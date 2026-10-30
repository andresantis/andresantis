# Converte uma linha de texto em contorno SVG (Geist, peso e tracking dados).
# Uso: texto_vetor.py fonte.woff2 peso tracking_em "texto" -> JSON {d, largura, ascender, capHeight, xHeight, unitsPerEm}
import json, sys
from io import BytesIO
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

fonte, peso, tracking, texto = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
f = TTFont(fonte)
f.flavor = None
inst = instancer.instantiateVariableFont(f, {"wght": peso})
buf = BytesIO(); inst.save(buf); dados = buf.getvalue()
upm = inst["head"].unitsPerEm
face = hb.Face(dados); font = hb.Font(face)
b = hb.Buffer(); b.add_str(texto); b.guess_segment_properties()
hb.shape(font, b, {"kern": True, "liga": True})
ordem = inst.getGlyphOrder(); gs = inst.getGlyphSet()
pen = SVGPathPen(gs)
x = 0; trk = tracking * upm
infos, poss = b.glyph_infos, b.glyph_positions
for i, (inf, pos) in enumerate(zip(infos, poss)):
    nome = ordem[inf.codepoint]
    # y invertido: SVG cresce para baixo; linha de base em y=0
    gs[nome].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)))
    x += pos.x_advance + (trk if i < len(infos) - 1 else 0)
os2 = inst["OS/2"]
print(json.dumps({"d": pen.getCommands(), "largura": x, "upm": upm,
                  "capHeight": os2.sCapHeight, "xHeight": os2.sxHeight,
                  "ascender": inst["hhea"].ascent, "descender": inst["hhea"].descent}))

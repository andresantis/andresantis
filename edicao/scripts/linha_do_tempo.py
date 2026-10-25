"""Calcula a linha do tempo de cada versão do vídeo 1: trechos mantidos e legendas no tempo final."""
import json, re, sys

BASE = "/home/user/andresantis/edicao/video1/"
W = json.load(open(BASE + "transcricao-palavras.json"))
PAUSAS = [tuple(map(float, l.split("\t")[:2])) for l in open(BASE + "pausas.tsv").read().strip().split("\n")]
FOLGA = 0.05  # respiro mantido em cada lado de uma pausa cortada

# Cortes de conteúdo aprovados na etapa 1 (tempo do vídeo original, em segundos)
# Limites encaixados nos silêncios do som; na montagem cada um é conferido de novo.
CORTES = [(17.30, 17.48), (27.95, 29.38), (32.32, 32.47), (46.98, 47.25), (72.85, 76.55),
          (79.15, 81.95), (132.05, 139.10), (142.12, 142.85), (177.20, 177.45)]

VERSOES = {
    "completa": [(0.0, 180.13)],
    "curta": [(0.56, 9.72), (19.05, 23.60), (44.28, 48.95), (62.50, 68.45), (109.20, 114.30),
              (114.45, 121.20), (130.10, 131.95), (139.10, 144.95), (166.20, 171.30)],
}

CORRECOES = {"Cloud": "Claude", "cloud": "Claude", "Perplexer": "Perplexity", "GROC": "Grok",
             "Ex": "X", "ChatEPT": "ChatGPT"}


def subtrai(trechos, cortes):
    out = []
    for a, b in trechos:
        partes = [(a, b)]
        for c, d in cortes:
            novo = []
            for x, y in partes:
                if d <= x or c >= y:
                    novo.append((x, y))
                else:
                    if c > x: novo.append((x, c))
                    if d < y: novo.append((d, y))
            partes = novo
        out += [p for p in partes if p[1] - p[0] >= 0.12]
    return out


def linha(versao):
    cortes = [(a + FOLGA, b - FOLGA) for a, b in PAUSAS] + CORTES
    clips = subtrai(VERSOES[versao], sorted(cortes))
    t = 0.0; mapa = []
    for a, b in clips:
        mapa.append((a, b, t)); t += b - a

    def saida(ts):
        for a, b, o in mapa:
            if a <= ts < b: return o + ts - a
        return None

    palavras = []
    for a, b, txt in W:
        meio = (a + b) / 2
        o = saida(max(a, meio - 0.01)) if saida(a) is None else saida(a)
        if o is None: continue
        txt = txt.strip()
        base = re.sub(r"[^\wÀ-ú-]", "", txt)
        if base in CORRECOES: txt = txt.replace(base, CORRECOES[base])
        palavras.append((round(o, 2), txt))
    # junta "chat ept" -> ChatGPT
    p2 = []
    for o, txt in palavras:
        if p2 and p2[-1][1] == "chat" and txt.startswith("ept"):
            p2[-1] = (p2[-1][0], "ChatGPT" + txt[3:]); continue
        p2.append((o, txt))
    return clips, round(t, 2), p2


if __name__ == "__main__":
    v = sys.argv[1]
    clips, dur, pal = linha(v)
    json.dump({"clips": clips, "duracao": dur, "palavras": pal}, open(BASE + f"linha-{v}.json", "w"), ensure_ascii=False, indent=1)
    print(v, "duração", dur, "s,", len(clips), "trechos")
    frase = []; ini = None
    for o, txt in pal:
        if ini is None: ini = o
        frase.append(txt)
        if txt.endswith((".", "?", "!", ",")) and len(frase) >= 3 or len(frase) >= 6:
            print(f"{ini:6.1f}  {' '.join(frase)}"); frase = []; ini = None
    if frase: print(f"{ini:6.1f}  {' '.join(frase)}")

import { interpolateColors, useCurrentFrame } from "remotion";
import { CORES, FONTE } from "../marca";
import { FPS, Palavra } from "./tempo";

const C = CORES.dark;

type Linha = { inicio: number; fim: number; palavras: { q: number; texto: string }[] };

// Agrupa as palavras em linhas de até 6 (e que caibam numa linha só), quebrando no fim das frases (estilo.md, formato 1).
// maxLetras menor quando a legenda vai sobre a faixa (o espaçamento interno da faixa ocupa largura).
export const montaLinhas = (palavras: Palavra[], duracao: number, maxLetras = 26): Linha[] => {
  const linhas: Linha[] = [];
  let atual: Linha["palavras"] = [];
  palavras.forEach(([t, w], i) => {
    atual.push({ q: Math.round(t * FPS), texto: w });
    const fimDeFrase = /[.?!]$/.test(w) || (/,$/.test(w) && atual.length >= 3);
    const proxima = palavras[i + 1]?.[1] ?? "";
    const letras = atual.reduce((n, p) => n + p.texto.length + 1, 0) + proxima.length;
    if (fimDeFrase || atual.length >= 6 || letras > maxLetras || i === palavras.length - 1) {
      linhas.push({ inicio: atual[0].q, fim: 0, palavras: atual });
      atual = [];
    }
  });
  linhas.forEach((l, i) => {
    l.fim = i + 1 < linhas.length ? linhas[i + 1].inicio : duracao;
  });
  return linhas;
};

// Nomes que continuam com maiúscula na legenda (o resto vai em minúsculas, como na referência).
const NOMES: [RegExp, string][] = [
  [/\bias\b/g, "IAs"], [/\bia\b/g, "IA"], [/chatgpt/g, "ChatGPT"], [/gemini/g, "Gemini"], [/claude/g, "Claude"],
  [/perplexity/g, "Perplexity"], [/grok/g, "Grok"], [/\bx\b/g, "X"], [/google/g, "Google"], [/search/g, "Search"],
  [/promptado/g, "Promptado"], [/\bb2b\b/g, "B2B"], [/gartner/g, "Gartner"], [/alexa/g, "Alexa"],
];
const minusculas = (t: string) => NOMES.reduce((s, [re, nome]) => s.replace(re, nome), t.toLowerCase());

export const Legenda: React.FC<{
  linhas: Linha[];
  escondida: boolean;
  // faixa: legenda sobre uma faixa da cor de Superfície (para fundos mistos, claro e escuro).
  faixa?: boolean;
  // aDireita(quadro): legenda no lado direito, em até 2 linhas (quando algo ocupa o canto superior esquerdo).
  aDireita?: (quadro: number) => boolean;
}> = ({ linhas, escondida, faixa, aDireita }) => {
  const frame = useCurrentFrame();
  if (escondida) return null;
  const linha = linhas.find((l) => frame >= l.inicio && frame < l.fim);
  if (!linha) return null;
  const direita = aDireita?.(frame) ?? false;
  return (
    <div
      style={{
        position: "absolute",
        top: 259 - 66 * 0.2,
        left: direita ? 440 : 60,
        width: direita ? 460 : 840,
        textAlign: direita ? "left" : "center",
        fontFamily: FONTE,
        fontWeight: 600,
        fontSize: 66,
        letterSpacing: "-0.03em",
        lineHeight: faixa ? 1.3 : 1.15,
      }}
    >
      <span
        style={
          faixa
            ? { background: C.superficie, borderRadius: 20, padding: "6px 22px", boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone" }
            : undefined
        }
      >
        {linha.palavras
          .filter((p) => frame >= p.q)
          .map((p, i) => (
            <span
              key={i}
              style={{
                color: interpolateColors(frame - p.q, [0, 3], [C.textoApoio, C.texto]),
              }}
            >
              {(i ? " " : "") + minusculas(p.texto)}
            </span>
          ))}
      </span>
    </div>
  );
};

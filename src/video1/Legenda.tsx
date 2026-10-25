import { interpolateColors, useCurrentFrame } from "remotion";
import { CORES, FONTE } from "../marca";
import { FPS, Palavra } from "./tempo";

const C = CORES.dark;

type Linha = { inicio: number; fim: number; palavras: { q: number; texto: string }[] };

// Agrupa as palavras em linhas de até 6 (e que caibam numa linha só), quebrando no fim das frases (estilo.md, formato 1).
const MAX_LETRAS = 26;
export const montaLinhas = (palavras: Palavra[], duracao: number): Linha[] => {
  const linhas: Linha[] = [];
  let atual: Linha["palavras"] = [];
  palavras.forEach(([t, w], i) => {
    atual.push({ q: Math.round(t * FPS), texto: w });
    const fimDeFrase = /[.?!]$/.test(w) || (/,$/.test(w) && atual.length >= 3);
    const proxima = palavras[i + 1]?.[1] ?? "";
    const letras = atual.reduce((n, p) => n + p.texto.length + 1, 0) + proxima.length;
    if (fimDeFrase || atual.length >= 6 || letras > MAX_LETRAS || i === palavras.length - 1) {
      linhas.push({ inicio: atual[0].q, fim: 0, palavras: atual });
      atual = [];
    }
  });
  linhas.forEach((l, i) => {
    l.fim = i + 1 < linhas.length ? linhas[i + 1].inicio : duracao;
  });
  return linhas;
};

export const Legenda: React.FC<{ linhas: Linha[]; escondida: boolean }> = ({
  linhas,
  escondida,
}) => {
  const frame = useCurrentFrame();
  if (escondida) return null;
  const linha = linhas.find((l) => frame >= l.inicio && frame < l.fim);
  if (!linha) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 259 - 66 * 0.2,
        left: 60,
        width: 840,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 600,
        fontSize: 66,
        letterSpacing: "-0.03em",
        lineHeight: 1.15,
      }}
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
            {(i ? " " : "") + p.texto.toLowerCase().replace(/\bia\b/g, "IA")
              .replace(/chatgpt/g, "ChatGPT").replace(/gemini/g, "Gemini")
              .replace(/claude/g, "Claude").replace(/perplexity/g, "Perplexity")
              .replace(/grok/g, "Grok").replace(/\bx\b/g, "X").replace(/google/g, "Google")
              .replace(/search/g, "Search").replace(/promptado/g, "Promptado")}
          </span>
        ))}
    </div>
  );
};

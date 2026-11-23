import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Capa do Reels (1080×1920) e thumbnail (1080×1350) dos vídeos 18 a 20. O fundo é um quadro do próprio vídeo, sem mudança de cor.
const E = CORES.dark;

export const TITULOS_REUNIOES: Record<string, [string, boolean?][]> = {
  video20: [["Segunda-feira: começando a semana com o "], ["pé direito", true]],
  video18: [["Mostre menos, gere mais "], ["curiosidade", true]],
  video19: [["Quando o resultado cai, a gente "], ["testa", true]],
};

export const CapaReuniao: React.FC<{ id: string; thumb?: boolean }> = ({ id, thumb }) => {
  const desloc = thumb ? -285 : 0;
  const partes = TITULOS_REUNIOES[id];
  const letras = partes.reduce((n, [t]) => n + t.length, 0);
  const tam = letras > 40 ? 88 : letras > 30 ? 98 : 108;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONTE, overflow: "hidden" }}>
      <Img src={staticFile(`reunioes/capa-${id}.png`)} style={{ position: "absolute", top: desloc, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ top: desloc, height: 1920,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 64%, rgba(0,0,0,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 70, width: 940, bottom: thumb ? 35 : 320, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: CORES.textoSobreVerde, fontSize: 32,
          fontWeight: 800, textTransform: "uppercase", padding: "12px 26px", borderRadius: 999 }}>
          • reunião de time
        </span>
        <div style={{ marginTop: 28, color: "#FFFFFF", fontSize: tam, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
          textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
          {partes.map(([t, verde], i) => <span key={i} style={verde ? { color: E.verde } : undefined}>{t}</span>)}
        </div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 38, fontWeight: 700,
          letterSpacing: "-0.03em" }}>
          <LogoPromptado tamanho={46} cor={E.texto} /> Promptado
        </div>
      </div>
    </AbsoluteFill>
  );
};

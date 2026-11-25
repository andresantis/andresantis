import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
export const FRASE_VIDEO23: [string, boolean?][] = [["Não somos o mais barato. "], ["Somos referência.", true]];

// Capa do Reels (1080×1920) e thumbnail (1080×1350) do vídeo 23. O fundo é um quadro do próprio vídeo, sem mudança de cor.
const E = CORES.dark;

export const Capa23: React.FC<{ thumb?: boolean }> = ({ thumb }) => {
  const desloc = thumb ? -285 : 0;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONTE, overflow: "hidden" }}>
      <Img src={staticFile("video23/capa-fundo.png")} style={{ position: "absolute", top: desloc, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ top: desloc, height: 1920,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 64%, rgba(0,0,0,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 70, width: 940, bottom: thumb ? 35 : 320, textAlign: "center" }}>
        <div style={{ color: "#FFFFFF", fontSize: 100, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
          textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
          {FRASE_VIDEO23.map(([t, verde], i) => <span key={i} style={{ color: verde ? E.verde : undefined }}>{t}</span>)}
        </div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 38, fontWeight: 700,
          letterSpacing: "-0.03em" }}>
          <LogoPromptado tamanho={46} cor={E.texto} /> Promptado
        </div>
      </div>
    </AbsoluteFill>
  );
};

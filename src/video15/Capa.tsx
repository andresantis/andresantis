import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Capa do Reels (1080×1920) e thumbnail (1080×1350) do vídeo 15. O fundo é um quadro do próprio vídeo, sem mudança de cor.
const E = CORES.dark;

export const Capa15: React.FC<{ thumb?: boolean }> = ({ thumb }) => {
  const desloc = thumb ? -285 : 0;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONTE, overflow: "hidden" }}>
      <Img src={staticFile("video15/capa-fundo.png")} style={{ position: "absolute", top: desloc, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ top: desloc, height: 1920,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 64%, rgba(0,0,0,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 70, width: 940, bottom: thumb ? 35 : 320, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: CORES.textoSobreVerde, fontSize: 32,
          fontWeight: 800, textTransform: "uppercase", padding: "12px 26px", borderRadius: 999 }}>
          • gestão
        </span>
        <div style={{ marginTop: 28, color: "#FFFFFF", fontSize: 104, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
          textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
          Contrato pela <span style={{ color: E.verde }}>prática</span>, não pelo currículo
        </div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 38, fontWeight: 700,
          letterSpacing: "-0.03em" }}>
          <LogoPromptado tamanho={46} cor={E.texto} /> Promptado
        </div>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Capa do Reels do vídeo 7. O fundo é um quadro do próprio vídeo (39 s), sem mudança de cor;
// o degradê escuro fica só atrás do texto. O texto fica dentro da área de 1080×1350 que o perfil mostra.
const E = CORES.dark;

export const Capa7: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONTE }}>
    <Img src={staticFile("video7/capa-fundo.png")} style={{ width: 1080, height: 1920 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.92) 100%)" }} />
    <div style={{ position: "absolute", left: 70, width: 940, top: 980, textAlign: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.superficie, color: E.texto, fontSize: 32,
        fontWeight: 700, textTransform: "uppercase", padding: "12px 26px", borderRadius: 999 }}>
        <span style={{ color: E.verde }}>•</span> acompanhamento de perto
      </span>
      <div style={{ marginTop: 34, color: "#FFFFFF", fontSize: 104, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
        textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
        O que falta para as <span style={{ color: E.verde, textTransform: "none" }}>IAs</span>{" "}
        <span style={{ color: E.verde }}>recomendarem</span> sua empresa?
      </div>
      <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 40, fontWeight: 700,
        letterSpacing: "-0.03em" }}>
        <LogoPromptado tamanho={48} cor={E.texto} /> Promptado
      </div>
    </div>
  </AbsoluteFill>
);

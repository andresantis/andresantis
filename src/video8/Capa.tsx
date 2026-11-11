import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Capa do Reels do vídeo 8. Fundo: a foto do André com o Luís (enviada por ele), sem mudança de cor;
// o degradê escuro fica só atrás do texto, dentro da área 1080×1350 que o perfil mostra.
const E = CORES.dark;

export const Capa8: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONTE }}>
    <Img src={staticFile("video8/andre-e-luis.jpg")} style={{ width: 1080, height: 1920, objectFit: "cover", objectPosition: "50% 20%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 63%, rgba(0,0,0,0.94) 100%)" }} />
    <div style={{ position: "absolute", left: 70, width: 940, top: 1010, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: E.verde, color: CORES.textoSobreVerde, fontSize: 34, fontWeight: 800,
        textTransform: "uppercase", padding: "12px 28px", borderRadius: 999 }}>
        • a história
      </span>
      <div style={{ marginTop: 32, color: "#FFFFFF", fontSize: 104, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
        textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
        A história por trás de um negócio <span style={{ color: E.verde }}>milionário</span>
      </div>
      <div style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 40, fontWeight: 700,
        letterSpacing: "-0.03em" }}>
        <LogoPromptado tamanho={48} cor={E.texto} /> Promptado
      </div>
    </div>
  </AbsoluteFill>
);

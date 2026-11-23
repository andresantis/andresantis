import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { cresce } from "../video1/componentes";

// Vídeo 16: a frase que o André mandou, refeita nas cores da marca (card escuro, final em verde).
const E = CORES.dark;

export const FRASE: [string, boolean?][] = [
  ["Tem gente que assina a Promptado para tentar fazer igual, mas vai ser "],
  ["difícil bater de frente", true],
];

// Card da frase, na área segura (x 90–910, acima da faixa que o Instagram cobre). Fica fora do eixo.
export const CardFrase: React.FC<{ desde: number; ate: number; frase?: [string, boolean?][]; top?: number }> = ({ desde, ate, frase = FRASE, top = 1110 }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 6), interpolate(f, [ate - 6, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 90, width: 820, top, fontFamily: FONTE, background: E.superficie, borderRadius: 32,
      padding: "30px 36px", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, boxShadow: "0 14px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: E.textoApoio, fontSize: 28, fontWeight: 600, marginBottom: 14 }}>
        <LogoPromptado tamanho={34} cor={E.texto} /> Promptado
      </div>
      <div style={{ color: "#FFFFFF", fontSize: 50, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
        {frase.map(([t, verde], i) => <span key={i} style={verde ? { color: E.verde } : undefined}>{t}</span>)}
      </div>
    </div>
  );
};

// Cobre a faixa vermelha que veio gravada no original (y 1540–1780, só no começo), com um degradê escuro.
export const CobreFaixaAntiga: React.FC<{ ate: number }> = ({ ate }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [ate - 4, ate + 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1460, height: 460, opacity: o,
        background: "linear-gradient(180deg, rgba(10,10,10,0) 0px, rgba(10,10,10,1) 70px, rgba(10,10,10,1) 100%)" }} />
    </AbsoluteFill>
  ) : null;
};

import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CORES, FONTE } from "../marca";
import { chega, cresce } from "../video1/componentes";

// Vídeo 22 (no carro, estilo B). Cabeça em y ≈ 480–900; o teto do carro (y 250–470) fica livre para selo e pílulas.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;

// ---------- Tela cheia escura com lista de ✗ e ✓ que se monta ----------
export const TelaListaXV: React.FC<{ desde: number; titulo: string; itens: [string, number, boolean][] }> = ({ desde, titulo, itens }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #12261A 0%, #000 62%)" }}>
      <div style={{ ...base, left: 130, width: 820, top: 760 }}>
        <div style={{ fontSize: 44, fontWeight: 600, color: chega(f, desde), textTransform: "uppercase", marginBottom: 30 }}>
          <span style={{ color: E.verde }}>•</span> {titulo}
        </div>
        {itens.map(([t, q, ok]) =>
          f >= q ? (
            <div key={t} style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, textTransform: "uppercase",
              color: ok ? E.verde : chega(f, q), marginBottom: 14, transform: `translateX(${(1 - cresce(f, q, 4)) * -40}px)` }}>
              <span style={{ color: ok ? E.verde : "#FF5A5A", display: "inline-block", width: 80 }}>{ok ? "✓" : "✗"}</span>
              <span style={{ textDecoration: ok ? undefined : "line-through", textDecorationThickness: 6, textDecorationColor: "rgba(255,255,255,0.45)" }}>{t}</span>
            </div>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Card "MESMO PREÇO:" com as opções COMIGO / COM ELE; na resposta, COMIGO fica verde com ✓ ----------
export const CardEscolha: React.FC<{ desde: number; escolhe: number; ate?: number; y: number }> = ({ desde, escolhe, ate, y }) => {
  const f = useCurrentFrame();
  const sai = ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = Math.min(cresce(f, desde, 5), sai);
  if (p <= 0) return null;
  const e = cresce(f, escolhe, 5);
  const pulo = f >= escolhe ? interpolate(f - escolhe, [0, 4, 8], [1, 1.1, 1], { extrapolateRight: "clamp" }) : 1;
  const botao = (texto: string, certo: boolean): React.ReactNode => (
    <div style={{ flex: 1, textAlign: "center", fontSize: 48, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em",
      padding: "20px 0", borderRadius: 999,
      background: certo ? interpolateColors(e, [0, 1], [E.linha, E.verde]) : E.linha,
      color: certo && e > 0.5 ? PRETO : !certo && e > 0.5 ? E.textoApoio : E.texto,
      opacity: certo ? 1 : interpolate(e, [0, 1], [1, 0.45]),
      transform: certo ? `scale(${pulo})` : undefined }}>
      {certo && e > 0.5 ? "✓ " : ""}{texto}
    </div>
  );
  return (
    <div style={{ ...base, left: CENTRO - 360, width: 720, top: y, background: E.superficie, borderRadius: 32, padding: "26px 30px 30px",
      color: E.texto, opacity: p, transform: `translateY(${(1 - p) * -30}px)`, boxShadow: "0 12px 34px rgba(0,0,0,0.35)" }}>
      <div style={{ fontSize: 34, fontWeight: 600, color: E.textoApoio, textTransform: "uppercase", marginBottom: 6 }}>mesmo preço:</div>
      <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 22 }}>você assinaria com quem?</div>
      <div style={{ display: "flex", gap: 20 }}>
        {botao("comigo", true)}
        {botao("com ele", false)}
      </div>
    </div>
  );
};

// ---------- Frase grande no topo, dentro de um card escuro (o teto do carro é claro); trecho em verde ----------
export const FraseGrande: React.FC<{ partes: [string, boolean?][]; desde: number; ate?: number; y: number; tamanho?: number }> = ({
  partes, desde, ate, y, tamanho = 96,
}) => {
  const f = useCurrentFrame();
  const sai = ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = Math.min(cresce(f, desde, 5), sai);
  if (p <= 0) return null;
  const pulo = interpolate(f - desde, [0, 4, 8], [1.15, 0.97, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ ...base, left: CENTRO - 420, width: 840, top: y, textAlign: "center", opacity: p }}>
      <span style={{ display: "inline-block", background: "rgba(10,10,12,0.88)", borderRadius: 32, padding: "18px 36px 22px",
        fontSize: tamanho, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.0, textTransform: "uppercase", color: "#FFFFFF",
        transform: `scale(${pulo})`, boxShadow: "0 12px 34px rgba(0,0,0,0.35)" }}>
        {partes.map(([t, verde], i) => <span key={i} style={{ color: verde ? E.verde : undefined }}>{t}</span>)}
      </span>
    </div>
  );
};

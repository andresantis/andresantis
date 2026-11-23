import { interpolate, useCurrentFrame } from "remotion";
import { CORES, FONTE } from "../marca";
import { cresce } from "../video1/componentes";

// Vídeos 18 a 20 (reuniões com o time). Cards escuros da marca, centralizados no eixo.
const E = CORES.dark;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const sombra = "0 12px 34px rgba(0,0,0,0.35)";

const Card: React.FC<{ desde: number; ate?: number; y: number; largura?: number; children: React.ReactNode }> = ({ desde, ate, y, largura = 680, children }) => {
  const f = useCurrentFrame();
  const sai = ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = Math.min(cresce(f, desde, 5), sai);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - largura / 2, width: largura, top: y, background: E.superficie, borderRadius: 28, padding: "22px 28px",
      color: E.texto, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: sombra }}>
      {children}
    </div>
  );
};

// Ranking de 4 concorrentes nas IAs; do 2º em diante, as linhas embaçam uma a uma.
export const RankingBorrado: React.FC<{ desde: number; borra: number; ate?: number; y: number }> = ({ desde, borra, ate, y }) => {
  const f = useCurrentFrame();
  return (
    <Card desde={desde} ate={ate} y={y}>
      <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio, marginBottom: 10 }}>ranking nas IAs</div>
      {[1, 2, 3, 4].map((n) => {
        const b = n === 1 ? 0 : cresce(f, borra + (n - 2) * 4, 6);
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700, padding: "8px 0",
            borderTop: n > 1 ? `1px solid ${E.linha}` : undefined }}>
            <span style={{ color: n === 1 ? E.verde : E.textoApoio, width: 56 }}>{n}º</span>
            <span style={{ filter: `blur(${b * 12}px)` }}>Concorrente {String.fromCharCode(64 + n)}</span>
            {b > 0.5 ? <span style={{ marginLeft: "auto", fontSize: 34 }}>🔒</span> : null}
          </div>
        );
      })}
    </Card>
  );
};

// "visibilidade: REGULAR" com o número borrado e uma interrogação.
export const CardRegular: React.FC<{ desde: number; ate?: number; y: number }> = ({ desde, ate, y }) => (
  <Card desde={desde} ate={ate} y={y} largura={620}>
    <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio }}>sua visibilidade</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 6 }}>
      <span style={{ fontSize: 90, fontWeight: 800, letterSpacing: "-0.05em", filter: "blur(14px)" }}>37%</span>
      <span style={{ fontSize: 80, fontWeight: 800, color: E.verde }}>?</span>
    </div>
    <div style={{ display: "inline-block", marginTop: 8, fontSize: 36, fontWeight: 800, color: "#1A1A1A", background: "#F5B700", borderRadius: 12,
      padding: "6px 16px", textTransform: "uppercase" }}>regular</div>
  </Card>
);

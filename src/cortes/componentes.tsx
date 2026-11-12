import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { siClaude, siWhatsapp } from "simple-icons";
import { CORES, FONTE } from "../marca";
import { chega, cresce } from "../video1/componentes";

// Cortes 1 a 8 (bastidores, estilo B). Você fica sentado do lado direito, com o rosto entre y ≈ 750 e 1110;
// o topo (parede e persiana, y 270–700) fica livre para os cards, e a legenda de 1 palavra vai em y ≈ 1300.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const LARG = 840;
const sombra = "0 12px 34px rgba(0,0,0,0.35)";

const aparece = (f: number, desde: number, ate?: number) => {
  const p = cresce(f, desde, 5);
  const s = ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(p, s);
};

// ---------- Selo do topo ("• BASTIDORES"), pílula verde com texto preto ----------
export const SeloBastidores: React.FC<{ texto: string; desde: number; ate: number }> = ({ texto, desde, ate }) => {
  const f = useCurrentFrame();
  const p = aparece(f, desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: 268, textAlign: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: PRETO, fontSize: 38, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "-0.01em", padding: "12px 30px", borderRadius: 999, opacity: p,
        transform: `scale(${0.9 + 0.1 * p})`, boxShadow: sombra }}>
        • {texto}
      </span>
    </div>
  );
};

// ---------- Número / expressão grande no topo ----------
export const NumeroGrande: React.FC<{ texto: string; desde: number; ate?: number; y?: number; verde?: boolean; tamanho?: number; legenda?: string }> = ({
  texto, desde, ate, y = 380, verde = true, tamanho = 220, legenda,
}) => {
  const f = useCurrentFrame();
  const p = aparece(f, desde, ate);
  if (p <= 0) return null;
  const pulo = interpolate(f - desde, [0, 4, 8], [1.25, 0.96, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <div style={{ fontSize: tamanho, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95, color: verde ? E.verde : "#FFFFFF",
        textTransform: "uppercase", transform: `scale(${pulo})`, textShadow: "0 8px 34px rgba(0,0,0,0.55)" }}>
        {texto}
      </div>
      {legenda ? (
        <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          {legenda}
        </div>
      ) : null}
    </div>
  );
};

// ---------- Card escuro no topo ----------
const Card: React.FC<{ desde: number; ate?: number; y: number; children: React.ReactNode; largura?: number }> = ({ desde, ate, y, children, largura = 720 }) => {
  const f = useCurrentFrame();
  const p = aparece(f, desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - largura / 2, width: largura, top: y, background: E.superficie, borderRadius: 28,
      padding: "22px 28px", color: E.texto, opacity: p, transform: `translateY(${(1 - p) * -30}px)`, boxShadow: sombra }}>
      {children}
    </div>
  );
};

// ---------- Card com logo (cores originais da marca) ----------
const LOGOS = { claude: siClaude, whatsapp: siWhatsapp };
export const CardLogo: React.FC<{ logo: keyof typeof LOGOS; nome: string; desde: number; ate?: number; y?: number }> = ({ logo, nome, desde, ate, y = 380 }) => {
  const s = LOGOS[logo];
  return (
    <Card desde={desde} ate={ate} y={y} largura={460}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <svg viewBox="0 0 24 24" width={84} height={84}><path d={s.path} fill={`#${s.hex}`} /></svg>
        <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em" }}>{nome}</span>
      </div>
    </Card>
  );
};

// ---------- Botão que é clicado (cursor + afundar) ----------
export const BotaoClique: React.FC<{ texto: string; desde: number; clique: number; ate?: number; y?: number; titulo?: string }> = ({
  texto, desde, clique, ate, y = 380, titulo,
}) => {
  const f = useCurrentFrame();
  const apertado = f >= clique && f < clique + 4;
  const cursor = interpolate(f, [desde, clique - 2], [120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const feito = f >= clique;
  return (
    <Card desde={desde} ate={ate} y={y} largura={600}>
      {titulo ? <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio, marginBottom: 14, textAlign: "center" }}>{titulo}</div> : null}
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 46, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "-0.02em", padding: "16px 34px", borderRadius: 18, background: feito ? E.verde : E.linha, color: feito ? PRETO : E.texto,
          transform: `scale(${apertado ? 0.92 : 1})` }}>
          {texto}
        </span>
        <svg viewBox="0 0 24 24" width={60} height={60} style={{ position: "absolute", left: 360 + cursor, top: 46 + cursor * 0.6 }}>
          <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="#FFFFFF" stroke="#000" strokeWidth={1.2} />
        </svg>
      </div>
    </Card>
  );
};

// ---------- Barra de créditos que esvazia até zero ----------
export const BarraCreditos: React.FC<{ desde: number; esvazia: number; ate?: number; y?: number }> = ({ desde, esvazia, ate, y = 380 }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [esvazia, esvazia + 20], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Card desde={desde} ate={ate} y={y} largura={640}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, fontWeight: 700, marginBottom: 14 }}>
        <span>créditos</span><span style={{ color: v > 0 ? E.verde : "#EF4444" }}>{Math.round(v)}%</span>
      </div>
      <div style={{ height: 30, borderRadius: 15, background: E.linha, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: v > 15 ? E.verde : "#EF4444", borderRadius: 15 }} />
      </div>
    </Card>
  );
};

// ---------- Microfone que fica mudo ----------
export const Microfone: React.FC<{ desde: number; muta: number; ate?: number; y?: number; rotulo?: string }> = ({ desde, muta, ate, y = 380, rotulo }) => {
  const f = useCurrentFrame();
  const m = cresce(f, muta, 4);
  return (
    <Card desde={desde} ate={ate} y={y} largura={520}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <svg viewBox="0 0 24 24" width={92} height={92}>
          <rect x={8} y={2} width={8} height={13} rx={4} fill={m > 0.5 ? "#EF4444" : E.verde} />
          <path d="M5 11 a7 7 0 0 0 14 0 M12 18 v4 M8 22 h8" stroke={E.texto} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <line x1={3} y1={3} x2={3 + 18 * m} y2={3 + 18 * m} stroke="#EF4444" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 52, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
          {m > 0.5 ? "mutado" : rotulo ?? "microfone"}
        </span>
      </div>
    </Card>
  );
};

// ---------- Interruptor de configuração que desliga ----------
export const Interruptor: React.FC<{ texto: string; desde: number; desliga: number; ate?: number; y?: number }> = ({ texto, desde, desliga, ate, y = 380 }) => {
  const f = useCurrentFrame();
  const d = cresce(f, desliga, 5);
  return (
    <Card desde={desde} ate={ate} y={y} largura={760}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <span style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.15 }}>{texto}</span>
        <span style={{ flex: "none", width: 112, height: 60, borderRadius: 30, background: d > 0.5 ? E.linha : E.verde, position: "relative" }}>
          <span style={{ position: "absolute", top: 6, left: 58 - 52 * d, width: 48, height: 48, borderRadius: 24, background: "#FFFFFF" }} />
        </span>
      </div>
    </Card>
  );
};

// ---------- Balão de mensagem de WhatsApp (texto digitado) ----------
export const BalaoWhats: React.FC<{ texto: string; desde: number; ate?: number; y?: number }> = ({ texto, desde, ate, y = 380 }) => {
  const f = useCurrentFrame();
  const p = aparece(f, desde, ate);
  if (p <= 0) return null;
  const n = Math.floor(Math.min(texto.length, (f - desde) * 1.6));
  return (
    <div style={{ ...base, left: CENTRO - 360, width: 720, top: y, opacity: p, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: "#005C4B", color: "#FFFFFF", fontSize: 40, fontWeight: 500, lineHeight: 1.25, padding: "20px 26px",
        borderRadius: "28px 28px 6px 28px", maxWidth: 680, boxShadow: sombra }}>
        {texto.slice(0, n)}
        <div style={{ textAlign: "right", fontSize: 24, color: "#9FD8CB", marginTop: 6 }}>12:20 ✓✓</div>
      </div>
    </div>
  );
};

// ---------- Pílulas de horário: 12:00 ×3 que são riscadas ----------
export const HorariosRiscados: React.FC<{ itens: [string, number][]; risca: number; ate?: number; y?: number }> = ({ itens, risca, ate, y = 380 }) => {
  const f = useCurrentFrame();
  const r = cresce(f, risca, 6);
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", justifyContent: "center", gap: 18,
      opacity: ate === undefined ? 1 : aparece(f, 0, ate) }}>
      {itens.map(([t, q], i) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={i} style={{ position: "relative", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", padding: "14px 26px",
            borderRadius: 22, background: E.superficie, color: E.texto, transform: `scale(${p})`, boxShadow: sombra }}>
            {t}
            <span style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 8, borderRadius: 4, background: "#EF4444",
              transform: `scaleX(${r})`, transformOrigin: "left center" }} />
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Tela cheia escura com lista que se monta (números ou ✓) ----------
export const TelaListaB: React.FC<{
  desde: number;
  titulo: string;
  subtitulo?: string;
  itens: [string, number][];
  check?: boolean;
}> = ({ desde, titulo, subtitulo, itens, check }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #12261A 0%, #000 62%)" }}>
      <div style={{ ...base, left: 100, width: 800, top: 760 }}>
        <div style={{ fontSize: 44, fontWeight: 600, color: chega(f, desde), textTransform: "uppercase", marginBottom: subtitulo ? 8 : 30 }}>
          <span style={{ color: E.verde }}>•</span> {titulo}
        </div>
        {subtitulo ? (
          <div style={{ fontSize: 34, fontWeight: 500, color: E.textoApoio, marginBottom: 30 }}>{subtitulo}</div>
        ) : null}
        {itens.map(([t, q], i) =>
          f >= q ? (
            <div key={t} style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, textTransform: "uppercase",
              color: chega(f, q), marginBottom: 10, transform: `translateX(${(1 - cresce(f, q, 4)) * -40}px)` }}>
              <span style={{ color: E.verde }}>{check ? "✓" : `${i + 1}.`}</span> {t}
            </div>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

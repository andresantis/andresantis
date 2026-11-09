import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { chega, cresce, Selo } from "../video1/componentes";
import { FPS, Palavra } from "../video1/tempo";

// Estilo B (estilo-referencias-2-e-3.md, Ref 2) na marca Promptado. A cabeça fica no alto do quadro
// (y ≈ 250–780), então a legenda vai sobre a camiseta e os cards logo abaixo dela.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const LARG = 840;

// ---------- Legenda de 1 palavra por vez, caixa alta, palavras-chave em verde ----------
export const LegendaUmaPalavra: React.FC<{
  palavras: Palavra[];
  verdes: string[]; // palavras (normalizadas) que ficam em verde
  y: number;
  escondida?: boolean;
}> = ({ palavras, verdes, y, escondida }) => {
  const f = useCurrentFrame();
  if (escondida) return null;
  let i = -1;
  for (let k = 0; k < palavras.length; k++) if (Math.round(palavras[k][0] * FPS) <= f) i = k;
  if (i < 0) return null;
  const q = Math.round(palavras[i][0] * FPS);
  const proxima = i + 1 < palavras.length ? Math.round(palavras[i + 1][0] * FPS) : q + 20;
  if (f >= Math.min(proxima, q + 24)) return null; // some nas pausas longas
  const texto = palavras[i][1].replace(/[.,?!]+$/, "");
  const norm = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const verde = verdes.includes(norm);
  const tam = Math.min(120, 1500 / Math.max(6, texto.length));
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y - tam / 2, textAlign: "center", fontSize: tam, fontWeight: 800,
      letterSpacing: "-0.04em", lineHeight: 1, textTransform: "uppercase", color: verde ? E.verde : "#FFFFFF",
      textShadow: "0 6px 28px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5)", transform: `scale(${interpolate(f - q, [0, 3], [1.12, 1], { extrapolateRight: "clamp" })})` }}>
      {texto}
    </div>
  );
};

// ---------- Selo fixo no topo e etiqueta do cliente ----------
export const SeloTopo: React.FC<{ desde: number; cliente: string; clienteDesde: number }> = ({ desde, cliente, clienteDesde }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  const pc = cresce(f, clienteDesde, 6);
  const pilula: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 12, background: E.superficie, color: E.texto,
    borderRadius: 999, fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" };
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: 268, textAlign: "center" }}>
      <span style={{ ...pilula, fontSize: 34, padding: "12px 26px", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
        <LogoPromptado tamanho={36} cor={E.texto} />
        <span style={{ color: E.verde }}>•</span> acompanhamento de perto
      </span>
      <div style={{ marginTop: 14, opacity: pc, transform: `translateX(${(1 - pc) * -120}px)` }}>
        <span style={{ ...pilula, fontSize: 28, padding: "8px 20px", fontWeight: 600, textTransform: "none", color: E.textoApoio }}>
          cliente: <span style={{ color: E.texto }}>{cliente}</span>
        </span>
      </div>
    </div>
  );
};

// ---------- Clarão branco entre partes (~0,3 s) ----------
export const Clarao: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [em - 4, em, em + 5], [0, 0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: o }} /> : null;
};

// ---------- Tela cheia escura com brilho no centro e lista numerada que se monta ----------
export const TelaLista: React.FC<{ desde: number; titulo: string; itens: [string, number][]; selo?: [string, number] }> = ({
  desde, titulo, itens, selo,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #12261A 0%, #000 62%)" }}>
      <div style={{ ...base, left: 80, width: 820, top: 640 }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: chega(f, desde), textTransform: "uppercase", marginBottom: 30 }}>
          <span style={{ color: E.verde }}>•</span> {titulo}
        </div>
        {itens.map(([t, q], i) =>
          f >= q ? (
            <div key={t} style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.12, textTransform: "uppercase",
              color: chega(f, q), whiteSpace: "nowrap", transform: `translateX(${(1 - cresce(f, q, 4)) * -40}px)` }}>
              <span style={{ color: E.verde }}>{i + 1}.</span> {t}
            </div>
          ) : null,
        )}
        {selo && f >= selo[1] ? (
          <div style={{ marginTop: 36, transform: `scale(${cresce(f, selo[1], 4)})`, transformOrigin: "left center" }}>
            <Selo texto={selo[0]} style={{ fontSize: 42, padding: "14px 28px" }} />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Card compacto (sobre a camiseta) ----------
const Card: React.FC<{ desde: number; y: number; children: React.ReactNode; largura?: number }> = ({ desde, y, children, largura = 720 }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  return (
    <div style={{ ...base, left: CENTRO - largura / 2, width: largura, top: y, background: E.superficie, borderRadius: 28,
      padding: "22px 28px", color: E.texto, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, boxShadow: "0 12px 34px rgba(0,0,0,0.35)" }}>
      {children}
    </div>
  );
};

// Página de site que se desenha: título e linhas que entram no ritmo da fala.
export const CardPagina: React.FC<{ desde: number; y: number; titulo: string; linhas: [string, number][] }> = ({ desde, y, titulo, linhas }) => {
  const f = useCurrentFrame();
  return (
    <Card desde={desde} y={y}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[0, 1, 2].map((k) => <span key={k} style={{ width: 14, height: 14, borderRadius: 7, background: E.linha }} />)}
        <span style={{ flex: 1, marginLeft: 10, height: 14, borderRadius: 7, background: E.linha }} />
      </div>
      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em" }}>{titulo}</div>
      {linhas.map(([t, q]) => (f >= q ? (
        <div key={t} style={{ fontSize: 34, fontWeight: 500, color: chega(f, q), marginTop: 8 }}>
          <span style={{ color: E.verde }}>✓</span> {t}
        </div>
      ) : null))}
    </Card>
  );
};

// FAQ: perguntas com "+" que entram digitadas.
export const CardFAQ: React.FC<{ desde: number; y: number; titulo: string; perguntas: [string, number][] }> = ({ desde, y, titulo, perguntas }) => {
  const f = useCurrentFrame();
  return (
    <Card desde={desde} y={y}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <Selo texto="FAQ" style={{ fontSize: 28 }} />
        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>{titulo}</span>
      </div>
      {perguntas.map(([t, q]) => {
        if (f < q) return null;
        const n = Math.floor(Math.min(t.length, (f - q) * 1.2));
        return (
          <div key={t} style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 600, padding: "8px 0",
            borderTop: `1px solid ${E.linha}` }}>
            <span>{t.slice(0, n)}</span><span style={{ color: E.textoApoio }}>+</span>
          </div>
        );
      })}
    </Card>
  );
};

// Esquema de página: bloco de conteúdo e a faixa "FAQ" encaixando embaixo (no footer).
export const EsquemaPagina: React.FC<{ desde: number; encaixa: number; y: number }> = ({ desde, encaixa, y }) => {
  const f = useCurrentFrame();
  const t = cresce(f, encaixa, 8);
  return (
    <Card desde={desde} y={y} largura={560}>
      <div style={{ fontSize: 28, fontWeight: 600, color: E.textoApoio, marginBottom: 10 }}>cada página</div>
      <div style={{ height: 110, borderRadius: 14, background: E.linha, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, fontWeight: 600, color: E.textoApoio }}>conteúdo</div>
      <div style={{ marginTop: 10, height: 64, borderRadius: 14, background: E.verde, color: PRETO, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 32, fontWeight: 800, opacity: t, transform: `translateY(${(1 - t) * 60}px)` }}>FAQ</div>
    </Card>
  );
};

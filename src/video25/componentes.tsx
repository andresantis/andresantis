import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { siClaude, siGooglegemini, siPerplexity } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Botao, chega, Chaves, cresce, TelaCheia } from "../video1/componentes";
import { LogoChatGPT } from "../video8/componentes";

// Vídeo 25 (estilo A, vertical). Cabeça de y ≈ 520 ao queixo em y ≈ 1340; a faixa da estante (y ≈ 340–520), logo
// abaixo da legenda, recebe palavras grandes e cards ATRÁS da cabeça; as explicações maiores vão em tela cheia.
// Toda palavra técnica ganha uma "tradução" simples (etiqueta), para o público leigo.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const LARG = 840;
const sombra = "0 12px 34px rgba(0,0,0,0.45)";
const img = (n: number) => staticFile(`video24/plataforma-${n}.png`);

const some = (f: number, ate?: number) =>
  ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Etiqueta de "tradução": termo = explicação simples.
export const Traducao: React.FC<{ termo: string; texto: string; desde: number; y: number; x?: number; claro?: boolean }> = ({
  termo, texto, desde, y, x = CENTRO - LARG / 2, claro,
}) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: x, width: LARG, top: y, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: claro ? "#FFFFFF" : E.superficie, color: claro ? "#1D1D1F" : E.texto,
        fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", padding: "12px 24px", borderRadius: 18, boxShadow: sombra, whiteSpace: "nowrap" }}>
        <span style={{ background: E.verde, color: PRETO, fontWeight: 800, padding: "4px 14px", borderRadius: 10 }}>{termo}</span>
        = {texto}
      </span>
    </div>
  );
};

// ---------- Logos das IAs (atrás da cabeça) + "= inteligências artificiais" ----------
const ico = (path: string, cor: string, t = 60) => <svg viewBox="0 0 24 24" width={t} height={t}><path d={path} fill={cor} /></svg>;
const LOGOS: [string, React.ReactNode][] = [
  ["ChatGPT", <LogoChatGPT key="c" tamanho={60} />],
  ["Gemini", ico(siGooglegemini.path, `#${siGooglegemini.hex}`)],
  ["Claude", ico(siClaude.path, `#${siClaude.hex}`)],
  ["Perplexity", ico(siPerplexity.path, "#FFFFFF")],
];
export const LogosIAs: React.FC<{ desde: number; y: number; rotulo: number; ate?: number }> = ({ desde, y, rotulo, ate }) => {
  const f = useCurrentFrame();
  const s = some(f, ate);
  const r = cresce(f, rotulo, 5);
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: s }}>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {LOGOS.map(([nome, logo], i) => {
          const q = cresce(f, desde + i * 4, 4);
          return (
            <span key={nome} style={{ width: 104, height: 104, borderRadius: 26, background: E.superficie, display: "inline-flex", alignItems: "center",
              justifyContent: "center", transform: `scale(${q})`, boxShadow: sombra }}>{logo}</span>
          );
        })}
      </div>
      {r > 0 ? (
        <div style={{ marginTop: 14, opacity: r }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 34, fontWeight: 800, padding: "8px 22px", borderRadius: 999 }}>
            = inteligências artificiais
          </span>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Tela cheia: chat de IA com "sua empresa" na resposta + selo "orgânico" ----------
export const TelaChatIA: React.FC<{ desde: number; resposta: number; marca: number; organico: number }> = ({ desde, resposta, marca, organico }) => {
  const f = useCurrentFrame();
  const pergunta = "Qual a melhor empresa do meu setor?";
  const n = Math.floor(Math.min(pergunta.length, Math.max(0, f - desde - 1) * 2.2));
  const r = cresce(f, resposta, 5);
  const m = cresce(f, marca, 5);
  return (
    <TelaCheia>
      <div style={{ ...base, left: 80, top: 320, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> perguntando para a IA
      </div>
      <div style={{ ...base, left: 200, width: 680, top: 410, textAlign: "right" }}>
        <span style={{ display: "inline-block", background: E.linha, color: E.texto, fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em",
          padding: "22px 30px", borderRadius: "30px 30px 8px 30px", textAlign: "left" }}>{pergunta.slice(0, n)}</span>
      </div>
      <div style={{ ...base, left: 80, width: 800, top: 620, background: E.superficie, borderRadius: 32, padding: "32px 36px", color: E.texto,
        opacity: r, transform: `translateY(${(1 - r) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600, color: E.textoApoio, marginBottom: 20 }}>
          <LogoChatGPT tamanho={40} /> ChatGPT
        </div>
        <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          A mais recomendada é{" "}
          <span style={{ position: "relative", display: "inline-block", padding: "0 10px", color: m > 0.5 ? PRETO : E.texto, fontWeight: 800 }}>
            <span style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: `${m * 100}%`, background: E.verde, borderRadius: 6 }} />
            <span style={{ position: "relative" }}>sua empresa</span>
          </span>
        </div>
      </div>
      <Traducao termo="orgânico" texto="sem pagar anúncio" desde={organico} y={1000} />
    </TelaCheia>
  );
};

// ---------- Card com o logo Promptado e um selo verde (atrás da cabeça) ----------
export const CardPromptado: React.FC<{ desde: number; y: number; selo?: [string, number]; texto?: string; ate?: number }> = ({
  desde, y, selo, texto = "Promptado", ate,
}) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  const ps = selo ? cresce(f, selo[1], 4) : 0;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 18, background: E.superficie, color: E.texto, fontSize: 52, fontWeight: 700,
        letterSpacing: "-0.03em", padding: "16px 34px", borderRadius: 999, boxShadow: sombra, transform: `scale(${0.85 + 0.15 * p})` }}>
        <LogoPromptado tamanho={56} cor={E.texto} /> {texto}
      </span>
      {selo && ps > 0 ? (
        <div style={{ marginTop: 14 }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 36, fontWeight: 700, padding: "10px 24px", borderRadius: 999,
            transform: `scale(${0.8 + 0.2 * ps})`, opacity: ps, boxShadow: sombra }}>{selo[0]}</span>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Balão de comentário de um seguidor ----------
export const Comentario: React.FC<{ desde: number; y: number; texto: string; ate?: number }> = ({ desde, y, texto, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  const n = Math.floor(Math.min(texto.length, Math.max(0, f - desde - 2) * 2));
  return (
    <div style={{ ...base, left: CENTRO - 390, width: 780, top: y, background: E.superficie, borderRadius: 28, padding: "18px 24px",
      display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * -24}px)`, boxShadow: sombra }}>
      <span style={{ flex: "none", width: 72, height: 72, borderRadius: 36, background: "linear-gradient(135deg, #3A3A3C, #1C1C1E)",
        border: `3px solid ${E.linha}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🙋</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: E.textoApoio }}>seguidor</div>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em", color: E.texto }}>{texto.slice(0, n)}</div>
      </div>
      <span style={{ fontSize: 36, color: E.textoApoio }}>♡</span>
    </div>
  );
};

// ---------- Tela cheia com um print grande da plataforma (Visão geral) ----------
// scan: linha verde de "escaneamento" descendo; zoom: [origem, escala final].
export const TelaPlataforma: React.FC<{ desde: number; ate: number; rotulo: string; scan?: boolean; zoom?: [string, number] }> = ({
  desde, ate, rotulo, scan, zoom,
}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [desde + 6, ate], [1, zoom ? zoom[1] : 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(f, [desde + 4, ate - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // a Visão geral (1907×934) ocupa a largura da área segura; fica no meio da tela
  const W = 900, H = (W * 934) / 1907;
  return (
    <TelaCheia>
      <div style={{ ...base, left: 70, top: 320, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> {rotulo}
      </div>
      <div style={{ position: "absolute", left: 30, top: 640, width: W, height: H * 1.25, borderRadius: 18, overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)", background: "#FFFFFF" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H * 1.25, transform: `scale(${z})`, transformOrigin: zoom?.[0] ?? "20% 15%" }}>
          <Img src={img(5)} style={{ display: "block", width: W * 1.25, marginLeft: -W * 0.02 }} />
          {scan ? (
            <>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${s * 100}%`, background: "rgba(34,197,94,0.10)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: `calc(${s * 100}% - 4px)`, height: 8, background: E.verde,
                boxShadow: `0 0 24px ${E.verde}` }} />
            </>
          ) : null}
        </div>
      </div>
      {scan ? <Traducao termo="monitorar" texto="acompanhar tudo sobre sua marca" desde={desde + 10} y={1250} /> : null}
    </TelaCheia>
  );
};

// ---------- Tela cheia: "os 3 números que importam" (prints + tradução de cada um) ----------
export const Tela3Numeros: React.FC<{ desde: number; itens: [number, string, string, number][] }> = ({ desde, itens }) => {
  const f = useCurrentFrame();
  return (
    <TelaCheia>
      <div style={{ ...base, left: 70, top: 300, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> os 3 números que importam
      </div>
      {itens.map(([n, termo, texto, q], i) => {
        const p = cresce(f, q, 6);
        if (p <= 0) return null;
        const y = 380 + i * 350;
        return (
          <div key={n} style={{ position: "absolute", left: 70, width: 820, top: y, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
            <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: `0 0 0 8px ${E.superficie}, ${sombra}`, width: 560 }}>
              <Img src={img(n)} style={{ display: "block", width: 560 }} />
            </div>
            <div style={{ marginTop: 20, fontFamily: FONTE }}>
              <span style={{ display: "inline-block", background: E.superficie, color: E.texto, fontSize: 34, fontWeight: 600, padding: "12px 20px",
                borderRadius: 16, boxShadow: sombra, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                <span style={{ color: E.verde, fontWeight: 800 }}>{termo}</span> = {texto}
              </span>
            </div>
          </div>
        );
      })}
    </TelaCheia>
  );
};

// ---------- Tela cheia: de onde a IA tira a resposta (fontes com barra de autoridade) ----------
export const TelaFontes: React.FC<{ desde: number; fontes: [string, string, number, number][]; traducao: number; autoridade: number }> = ({
  desde, fontes, traducao, autoridade,
}) => {
  const f = useCurrentFrame();
  const centro = { x: 480, y: 1060 };
  return (
    <TelaCheia>
      <div style={{ ...base, left: 70, top: 300, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> de onde a IA tira a resposta
      </div>
      <Traducao termo="fonte" texto="o site que a IA lê" desde={traducao} y={380} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {fontes.map(([, , , q], i) => {
          const x = 190 + i * 290, y = 640;
          const p = cresce(f, q, 8);
          return <line key={i} x1={x} y1={y + 150} x2={x + (centro.x - x) * p} y2={y + 150 + (centro.y - 70 - (y + 150)) * p}
            stroke={E.linha} strokeWidth={6} strokeDasharray="14 12" />;
        })}
      </svg>
      {fontes.map(([icone, nome, nivel, q], i) => {
        const p = cresce(f, q, 5);
        const b = cresce(f, Math.max(q, autoridade) + i * 6, 10);
        if (p <= 0) return null;
        return (
          <div key={nome} style={{ ...base, left: 70 + i * 290, top: 560, width: 240, background: E.superficie, borderRadius: 24, padding: "20px 18px",
            textAlign: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, boxShadow: sombra }}>
            <div style={{ fontSize: 54 }}>{icone}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: E.texto, marginTop: 6, lineHeight: 1.1, minHeight: 66 }}>{nome}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: E.textoApoio, marginTop: 10, textAlign: "left" }}>autoridade</div>
            <div style={{ height: 14, borderRadius: 7, background: E.linha, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${b * nivel}%`, background: nivel > 70 ? E.verde : E.textoApoio, borderRadius: 7 }} />
            </div>
          </div>
        );
      })}
      <div style={{ ...base, left: centro.x - 110, top: centro.y - 110, width: 220, height: 220, borderRadius: 50, background: E.superficie,
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${E.verde}, ${sombra}`,
        opacity: cresce(f, desde, 6) }}>
        <LogoChatGPT tamanho={120} />
      </div>
      <div style={{ ...base, left: 60, width: 840, top: centro.y + 140, textAlign: "center", fontSize: 40, fontWeight: 700, color: E.texto,
        opacity: cresce(f, desde + 4, 6) }}>resposta da IA</div>
    </TelaCheia>
  );
};

// ---------- Plano de ação (atrás da cabeça): título + funções do menu da plataforma ----------
export const CardPlano: React.FC<{ desde: number; y: number; itens: [string, number][]; ate?: number }> = ({ desde, y, itens, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 38, fontWeight: 800, padding: "10px 26px", borderRadius: 999,
        boxShadow: sombra }}>📋 plano de ação</span>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 14 }}>
        {itens.map(([t, q]) => {
          const c = cresce(f, q, 4);
          return c > 0 ? (
            <span key={t} style={{ background: E.superficie, color: E.texto, fontSize: 32, fontWeight: 600, padding: "10px 18px", borderRadius: 16,
              transform: `scale(${0.8 + 0.2 * c})`, opacity: c, boxShadow: sombra, whiteSpace: "nowrap" }}>✓ {t}</span>
          ) : null;
        })}
      </div>
    </div>
  );
};

// ---------- Pílulas (atrás da cabeça) ----------
export const Pilulas: React.FC<{ y: number; itens: [string, number, boolean?][]; ate?: number }> = ({ y, itens, ate }) => {
  const f = useCurrentFrame();
  const s = some(f, ate);
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", gap: 14, justifyContent: "center", opacity: s }}>
      {itens.map(([t, q, verde]) => {
        const c = cresce(f, q, 4);
        return c > 0 ? (
          <span key={t} style={{ background: verde ? E.verde : E.superficie, color: verde ? PRETO : E.texto, fontSize: 40, fontWeight: 700,
            padding: "14px 26px", borderRadius: 999, transform: `scale(${0.8 + 0.2 * c})`, opacity: c, boxShadow: sombra, whiteSpace: "nowrap" }}>{t}</span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Tela cheia: como funciona, em 3 passos ----------
export const TelaPassos: React.FC<{ desde: number; passos: [string, string, number][] }> = ({ desde, passos }) => {
  const f = useCurrentFrame();
  return (
    <TelaCheia>
      <div style={{ ...base, left: 70, top: 320, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> como funciona
      </div>
      {passos.map(([icone, texto, q], i) => {
        const p = cresce(f, q, 6);
        const ultimo = i === passos.length - 1;
        if (p <= 0) return null;
        return (
          <div key={texto}>
            {i > 0 ? (
              <div style={{ position: "absolute", left: 160, top: 560 + (i - 1) * 300 + 180, width: 6, height: 120 * p, background: E.verde, borderRadius: 3 }} />
            ) : null}
            <div style={{ ...base, left: 80, width: 800, top: 440 + i * 300, display: "flex", alignItems: "center", gap: 28, background: E.superficie,
              borderRadius: 30, padding: "26px 30px", opacity: p, transform: `translateX(${(1 - p) * 60}px)`, boxShadow: sombra,
              outline: ultimo ? `4px solid ${E.verde}` : undefined }}>
              <span style={{ flex: "none", width: 110, height: 110, borderRadius: 26, background: E.fundo, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 62 }}>{icone}</span>
              <div>
                <div style={{ fontSize: 28, fontWeight: 600, color: E.textoApoio }}>passo {i + 1}</div>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", color: E.texto, lineHeight: 1.05 }}>{texto}</div>
              </div>
            </div>
          </div>
        );
      })}
    </TelaCheia>
  );
};

// ---------- Chamada final (fundo claro) ----------
export const ChamadaContato: React.FC<{ desde: number; botao: number; liga: number }> = ({ desde, botao, liga }) => {
  const f = useCurrentFrame();
  const l = cresce(f, liga, 5);
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: CENTRO - 80, top: 500, opacity: cresce(f, desde, 4) }}>
        <LogoPromptado tamanho={160} cor={CORES.light.texto} />
      </div>
      <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: 720, textAlign: "center", fontSize: 92, fontWeight: 700, letterSpacing: "-0.05em",
        color: CORES.light.texto, opacity: cresce(f, desde, 4) }}>sua empresa</div>
      <Chaves palavras={[["nas", desde + 3], ["respostas", desde + 6], ["das IAs", desde + 9]]} desde={desde} y={830} tamanho={72} setas={false} claro />
      {f >= botao ? <Botao texto="entrar em contato →" desde={botao} y={990} claro /> : null}
      {l > 0 ? (
        <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: 1200, textAlign: "center", opacity: l }}>
          <span style={{ display: "inline-block", background: "#FFFFFF", color: CORES.light.texto, fontSize: 40, fontWeight: 600, padding: "14px 28px",
            borderRadius: 999, border: `2px solid ${CORES.light.linha}` }}>📞 nosso time vai te ligar</span>
        </div>
      ) : null}
    </TelaCheia>
  );
};

// a imagem 5 (Visão geral, 1907×934): o Ranking fica em x ≈ 300–1070, y ≈ 395–800 → origem do zoom
export const ORIGEM_RANKING = `${(685 / 1907) * 100}% ${(600 / 934) * 100}%`;
void AbsoluteFill;

import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { siClaude, siGooglegemini, siPerplexity } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Botao, chega, Chaves, cresce, TelaCheia } from "../video1/componentes";
import { LogoChatGPT } from "../video8/componentes";

// Vídeo 23 (estilo A). O rosto ocupa quase o quadro todo (cabeça de y ≈ 490 ao queixo em y ≈ 1490), então a camiseta
// fica fora da área segura: os cards vão na faixa da estante (y ≈ 340–600), logo abaixo da legenda, e passam ATRÁS
// da cabeça (mesmo recorte da palavra grande). As ilustrações maiores vão em tela cheia.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const LARG = 840;
const sombra = "0 12px 34px rgba(0,0,0,0.45)";

const some = (f: number, ate?: number) =>
  ate === undefined ? 1 : interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- Checklist "onde você já investe": ✓ em cada item falado e um último item vazio piscando ----------
export const Checklist: React.FC<{ y: number; itens: [string, number, boolean][]; ate?: number }> = ({ y, itens, ate }) => {
  const f = useCurrentFrame();
  const s = some(f, ate);
  const vazio = itens.find(([, , v]) => v);
  if (vazio && f >= vazio[1]) itens = [vazio];
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", flexWrap: "nowrap", gap: 12, justifyContent: "center", opacity: s }}>
      {itens.map(([t, q, ehVazio]) => {
        const vazio = ehVazio;
        const p = cresce(f, q, 4);
        if (p <= 0) return null;
        const pisca = vazio ? 0.55 + 0.45 * Math.abs(Math.sin((f - q) / 6)) : 1;
        return (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.superficie, color: E.texto, fontSize: vazio ? 48 : 33, whiteSpace: "nowrap",
            fontWeight: 600, letterSpacing: "-0.02em", padding: vazio ? "16px 32px" : "12px 18px", borderRadius: 20, transform: `scale(${0.8 + 0.2 * p})`, opacity: p,
            boxShadow: sombra, outline: vazio ? `4px dashed rgba(34,197,94,${pisca})` : undefined, outlineOffset: -4 }}>
            <span style={{ color: vazio ? E.verde : E.texto, fontWeight: 800 }}>{vazio ? "☐" : "✓"}</span>
            {t}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Card com o logo Promptado e um selo verde ----------
export const CardPromptado: React.FC<{ desde: number; y: number; selo?: [string, number]; ate?: number }> = ({ desde, y, selo, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  const ps = selo ? cresce(f, selo[1], 4) : 0;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 18, background: E.superficie, color: E.texto, fontSize: 54, fontWeight: 700,
        letterSpacing: "-0.03em", padding: "18px 36px", borderRadius: 999, boxShadow: sombra, transform: `scale(${0.85 + 0.15 * p})` }}>
        <LogoPromptado tamanho={58} cor={E.texto} /> Promptado
      </span>
      {selo && ps > 0 ? (
        <div style={{ marginTop: 16 }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em",
            padding: "10px 26px", borderRadius: 999, transform: `scale(${0.8 + 0.2 * ps})`, opacity: ps, boxShadow: sombra }}>
            {selo[0]}
          </span>
        </div>
      ) : null}
    </div>
  );
};

// ---------- Etiqueta de preço "o mais barato", riscada em verde ----------
export const EtiquetaPreco: React.FC<{ desde: number; risco: number; y: number; ate?: number }> = ({ desde, risco, y, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  const r = cresce(f, risco, 5);
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 18, background: E.superficie,
        color: r > 0.5 ? E.textoApoio : E.texto, fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em", padding: "20px 44px 20px 34px",
        borderRadius: "22px 60px 60px 22px", boxShadow: sombra, transform: `rotate(-3deg) scale(${0.85 + 0.15 * p})` }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, border: `5px solid ${E.textoApoio}` }} />
        o mais barato
        <span style={{ position: "absolute", left: 20, top: "50%", height: 16, borderRadius: 8, background: E.verde,
          width: `calc(${r * 100}% - 40px)`, transform: "rotate(-4deg)", transformOrigin: "left center" }} />
      </span>
    </div>
  );
};

// ---------- Botão "menor preço": o cursor chega, e em "clicar" ele trava (✗ não é aqui) ----------
export const BotaoPreco: React.FC<{ desde: number; trava: number; y: number; ate?: number }> = ({ desde, trava, y, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  const chegada = cresce(f, desde + 6, Math.max(6, trava - desde - 10));
  const t = cresce(f, trava, 4);
  const tremor = f >= trava && f < trava + 8 ? Math.sin((f - trava) * 2.4) * 10 : 0;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center", opacity: p }}>
      <span style={{ position: "relative", display: "inline-block", transform: `translateX(${tremor}px)` }}>
        <span style={{ display: "inline-block", background: interpolateColors(t, [0, 1], [E.verde, E.linha]),
          color: t > 0.5 ? E.textoApoio : PRETO, fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", padding: "22px 46px",
          borderRadius: 20, boxShadow: sombra }}>
          {t > 0.5 ? "✗ " : ""}menor preço
        </span>
        {/* cursor */}
        <svg width="54" height="64" viewBox="0 0 18 22" style={{ position: "absolute", left: interpolate(chegada, [0, 1], [520, 300]),
          top: interpolate(chegada, [0, 1], [150, 50]) }}>
          <path d="M1 1 L1 17 L5.5 13 L8.5 20 L11.5 18.6 L8.6 12 L14.5 12 Z" fill="#FFFFFF" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </span>
      {t > 0 ? (
        <div style={{ marginTop: 22, fontSize: 38, fontWeight: 600, color: E.texto, opacity: t, textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>
          não é aqui
        </div>
      ) : null}
    </div>
  );
};

// ---------- Painel de monitoramento: "sua marca" e as IAs acendendo uma a uma ----------
const LOGOS_IAS = {
  chatgpt: <LogoChatGPT tamanho={56} />,
  gemini: <svg viewBox="0 0 24 24" width={56} height={56}><path d={siGooglegemini.path} fill={`#${siGooglegemini.hex}`} /></svg>,
  claude: <svg viewBox="0 0 24 24" width={56} height={56}><path d={siClaude.path} fill={`#${siClaude.hex}`} /></svg>,
  perplexity: <svg viewBox="0 0 24 24" width={56} height={56}><path d={siPerplexity.path} fill="#FFFFFF" /></svg>,
};
const NOMES_IAS = { chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude", perplexity: "Perplexity" };
export const PainelIAs: React.FC<{ desde: number; y: number; itens: [keyof typeof LOGOS_IAS, number][]; ate?: number }> = ({ desde, y, itens, ate }) => {
  const f = useCurrentFrame();
  const p = Math.min(cresce(f, desde, 5), some(f, ate));
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - 410, width: 820, top: y, background: E.superficie, borderRadius: 28, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 14, color: E.texto, opacity: p, transform: `translateY(${(1 - p) * -30}px)`, boxShadow: sombra }}>
      <div style={{ flex: "none", width: 200, fontSize: 30, fontWeight: 600, lineHeight: 1.15, color: E.textoApoio }}>
        <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: E.verde, marginRight: 8,
          opacity: 0.5 + 0.5 * Math.abs(Math.sin(f / 8)) }} />
        monitorando<br /><span style={{ color: E.texto }}>sua marca</span>
      </div>
      {itens.map(([k, q]) => {
        const a = cresce(f, q, 4);
        return (
          <div key={k} style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", background: E.fundo, borderRadius: 20,
            padding: "14px 0", opacity: 0.3 + 0.7 * a, transform: `scale(${0.9 + 0.1 * a})` }}>
            {LOGOS_IAS[k]}
            {a > 0.5 ? <span style={{ position: "absolute", right: 8, top: 8, width: 14, height: 14, borderRadius: 7, background: E.verde }} /> : null}
          </div>
        );
      })}
    </div>
  );
};
void NOMES_IAS;

// ---------- Tela cheia: artigo sendo escrito, com as abas "blog" e "portal de notícia" e o selo de qualidade ----------
export const TelaArtigo: React.FC<{ desde: number; blog: number; portal: number; qualidade: number }> = ({ desde, blog, portal, qualidade }) => {
  const f = useCurrentFrame();
  const titulo = "Como escolher a melhor empresa do seu setor";
  const n = Math.floor(Math.min(titulo.length, Math.max(0, f - desde - 4) * 1.4));
  const aba = (texto: string, q: number) => {
    const a = cresce(f, q, 4);
    return (
      <span style={{ display: "inline-block", fontSize: 32, fontWeight: 600, padding: "10px 22px", borderRadius: 14,
        background: a > 0.5 ? E.texto : E.linha, color: a > 0.5 ? "#000" : E.textoApoio, transform: `scale(${0.9 + 0.1 * a})` }}>
        {texto}
      </span>
    );
  };
  const linhas = [1, 0.92, 0.97, 0.7, 1, 0.85, 0.6];
  return (
    <TelaCheia>
      <div style={{ ...base, left: 80, top: 330, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> conteúdo criado para
      </div>
      <div style={{ ...base, left: 80, top: 410, display: "flex", gap: 16 }}>
        {aba("blog", blog)}
        {aba("portal de notícia", portal)}
      </div>
      <div style={{ ...base, left: 80, width: 800, top: 520, background: E.superficie, borderRadius: 32, padding: "40px 44px", color: E.texto,
        opacity: cresce(f, desde, 5), transform: `translateY(${(1 - cresce(f, desde, 6)) * 60}px)` }}>
        <div style={{ height: 220, borderRadius: 20, background: E.linha, marginBottom: 34 }} />
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08, minHeight: 182 }}>
          {titulo.slice(0, n)}
          {n < titulo.length && Math.floor(f / 6) % 2 === 0 ? <span style={{ color: E.verde }}>|</span> : null}
        </div>
        {linhas.map((w, i) => (
          <div key={i} style={{ height: 18, borderRadius: 9, background: E.linha, marginTop: 20,
            width: `${w * 100 * cresce(f, desde + 26 + i * 3, 6)}%` }} />
        ))}
      </div>
      {f >= qualidade ? (
        <div style={{ ...base, left: 560, top: 470, transform: `rotate(6deg) scale(${interpolate(f - qualidade, [0, 4, 8], [1.4, 0.95, 1], { extrapolateRight: "clamp" })})` }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em",
            padding: "14px 30px", borderRadius: 999, boxShadow: sombra }}>✓ qualidade</span>
        </div>
      ) : null}
    </TelaCheia>
  );
};

// ---------- Tela cheia: pergunta para uma IA e a resposta com "sua marca" selecionada como referência ----------
export const TelaRespostaIA: React.FC<{ desde: number; resposta: number; marca: number }> = ({ desde, resposta, marca }) => {
  const f = useCurrentFrame();
  const pergunta = "Qual a melhor empresa do meu setor?";
  const n = Math.floor(Math.min(pergunta.length, Math.max(0, f - desde - 2) * 1.6));
  const r = cresce(f, resposta, 6);
  const m = cresce(f, marca, 5);
  return (
    <TelaCheia>
      <div style={{ ...base, left: 80, top: 330, fontSize: 40, fontWeight: 500, color: chega(f, desde) }}>
        <span style={{ color: E.verde }}>•</span> a resposta da IA
      </div>
      <div style={{ ...base, left: 220, width: 660, top: 430, textAlign: "right" }}>
        <span style={{ display: "inline-block", background: E.linha, color: E.texto, fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em",
          padding: "22px 30px", borderRadius: "30px 30px 8px 30px", textAlign: "left", opacity: cresce(f, desde, 4) }}>
          {pergunta.slice(0, n)}
        </span>
      </div>
      <div style={{ ...base, left: 80, width: 800, top: 640, background: E.superficie, borderRadius: 32, padding: "34px 38px", color: E.texto,
        opacity: r, transform: `translateY(${(1 - r) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600, color: E.textoApoio, marginBottom: 22 }}>
          <LogoChatGPT tamanho={40} /> resposta
        </div>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          A empresa mais indicada é{" "}
          <span style={{ position: "relative", display: "inline-block", padding: "0 10px", color: m > 0.5 ? PRETO : E.texto, fontWeight: 800 }}>
            <span style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: `${m * 100}%`, background: E.verde, borderRadius: 6 }} />
            <span style={{ position: "relative" }}>sua marca</span>
          </span>
          , referência no setor.
        </div>
        {[0.95, 0.8, 0.55].map((w, i) => (
          <div key={i} style={{ height: 16, borderRadius: 8, background: E.linha, marginTop: 20, width: `${w * 100 * cresce(f, resposta + 8 + i * 3, 6)}%` }} />
        ))}
      </div>
    </TelaCheia>
  );
};

// ---------- Chamada final (fundo claro): logo, frase entre chaves e botão "clique no botão abaixo ↓" ----------
export const ChamadaBotaoAbaixo: React.FC<{ palavras: [string, number][]; desde: number; botao: number }> = ({ palavras, desde, botao }) => {
  const f = useCurrentFrame();
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: CENTRO - 80, top: 554, opacity: cresce(f, desde, 4) }}>
        <LogoPromptado tamanho={160} cor={CORES.light.texto} />
      </div>
      <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: 770, textAlign: "center", fontSize: 92, fontWeight: 700, letterSpacing: "-0.05em",
        color: CORES.light.texto, opacity: cresce(f, desde, 4) }}>sua marca</div>
      <Chaves palavras={palavras} desde={desde} y={880} tamanho={72} setas={false} claro />
      {f >= botao ? <Botao texto="clique no botão abaixo ↓" desde={botao} y={1040} claro /> : null}
    </TelaCheia>
  );
};

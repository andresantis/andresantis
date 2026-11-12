import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { siClaude, siGoogle, siGooglegemini } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { chega, cresce } from "../video1/componentes";
import { LogoChatGPT } from "../video8/componentes";

// Vídeo 13 (estilo A). O rosto fica no meio do quadro (y ≈ 390–1020); os cards vão sobre a camiseta (y ≈ 1120–1450).
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480;
const LARG = 840;
const sombra = "0 12px 34px rgba(0,0,0,0.35)";

// ---------- Tela cheia com um trecho do vídeo de lançamento da OpenAI (fundo branco, como o vídeo dela) ----------
export const TelaOpenAI: React.FC<{ desde: number; inicio: number }> = ({ desde, inicio }) => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <Sequence from={desde} layout="none">
      <OffthreadVideo src={staticFile("editar/video14.mp4")} startFrom={Math.round(inicio * 30)} muted
        style={{ position: "absolute", left: -210, top: 543, width: 1500, height: 833 }} />
    </Sequence>
    <div style={{ ...base, left: 0, width: 1080, top: 1500, textAlign: "center", fontSize: 28, fontWeight: 500, color: "#8A8F98" }}>
      vídeo: OpenAI
    </div>
  </AbsoluteFill>
);

// ---------- Pílula ----------
export const Pilula: React.FC<{ texto: React.ReactNode; desde: number; y: number; verde?: boolean; tamanho?: number }> = ({
  texto, desde, y, verde, tamanho = 42,
}) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 14, background: verde ? E.verde : E.superficie, color: verde ? PRETO : E.texto,
        fontSize: tamanho, fontWeight: 700, letterSpacing: "-0.02em", whiteSpace: "nowrap", padding: `${tamanho * 0.34}px ${tamanho * 0.7}px`,
        borderRadius: 999, transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: sombra }}>
        {texto}
      </span>
    </div>
  );
};

// ---------- Gancho: "• NOVIDADE" + card do ChatGPT ----------
export const CardNovidade: React.FC<{ desde: number; card: number }> = ({ desde, card }) => {
  const f = useCurrentFrame();
  const p = cresce(f, card, 5);
  return (
    <>
      <Pilula texto="• NOVIDADE" desde={desde} y={1110} verde tamanho={40} />
      {p > 0 ? (
        <div style={{ ...base, left: CENTRO - 380, width: 760, top: 1210, background: E.superficie, borderRadius: 28, padding: "22px 28px",
          display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: sombra }}>
          <span style={{ flex: "none", width: 96, height: 96, borderRadius: 24, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoChatGPT tamanho={66} />
          </span>
          <span style={{ color: E.texto, fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Google Meu Negócio<br /><span style={{ color: E.verde }}>do ChatGPT</span>
          </span>
        </div>
      ) : null}
    </>
  );
};

// ---------- Chips (com risco opcional) ----------
export const ChipsRisco: React.FC<{ itens: [string, number, number?][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
      {itens.map(([t, q, r]) => {
        const p = cresce(f, q, 4);
        const risco = r === undefined ? 0 : cresce(f, r, 5);
        return p > 0 ? (
          <span key={t} style={{ position: "relative", background: E.superficie, color: risco > 0.5 ? E.textoApoio : E.texto, fontSize: 46, fontWeight: 600,
            letterSpacing: "-0.02em", padding: "16px 30px", borderRadius: 22, transform: `scale(${p})`, boxShadow: sombra }}>
            {t}
            <span style={{ position: "absolute", left: 16, right: 16, top: "50%", height: 8, borderRadius: 4, background: "#EF4444",
              transform: `scaleX(${risco})`, transformOrigin: "left center" }} />
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Card de busca do ChatGPT: onde ele procura e a marca recomendada ----------
export const CardBusca: React.FC<{ desde: number; web: number; site: number; recomenda: number }> = ({ desde, web, site, recomenda }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  const linha = (texto: string, q: number, verde?: boolean) =>
    f >= q ? (
      <div style={{ fontSize: 38, fontWeight: 600, marginTop: 12, color: verde ? E.verde : chega(f, q),
        transform: `translateX(${(1 - cresce(f, q, 4)) * -30}px)` }}>
        {texto}
      </div>
    ) : null;
  return p > 0 ? (
    <div style={{ ...base, left: CENTRO - 360, width: 720, top: 1120, background: E.superficie, borderRadius: 28, padding: "22px 30px",
      color: E.texto, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: sombra }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600, color: E.textoApoio }}>
        <LogoChatGPT tamanho={40} /> procurando informações…
      </div>
      {linha("🔎 na web", web)}
      {linha("🌐 no seu site", site)}
      {linha("✓ marca recomendada", recomenda, true)}
    </div>
  ) : null;
};

// ---------- Logo Promptado em card ----------
export const CardPromptado: React.FC<{ desde: number }> = ({ desde }) => (
  <Pilula texto={<><LogoPromptado tamanho={56} cor={E.texto} /> Promptado</>} desde={desde} y={1150} tamanho={54} />
);

// ---------- Logos das IAs, nome a nome ----------
const IAS = {
  chatgpt: <LogoChatGPT tamanho={70} />,
  gemini: <svg viewBox="0 0 24 24" width={70} height={70}><path d={siGooglegemini.path} fill={`#${siGooglegemini.hex}`} /></svg>,
  google: <svg viewBox="0 0 24 24" width={70} height={70}><path d={siGoogle.path} fill="#FFFFFF" /></svg>,
  claude: <svg viewBox="0 0 24 24" width={70} height={70}><path d={siClaude.path} fill={`#${siClaude.hex}`} /></svg>,
};
export const LogosIAs: React.FC<{ itens: [keyof typeof IAS, number][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", gap: 18, justifyContent: "center" }}>
      {itens.map(([k, q]) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={k} style={{ width: 116, height: 116, borderRadius: 28, background: E.superficie, display: "inline-flex", alignItems: "center",
            justifyContent: "center", transform: `scale(${p})`, boxShadow: sombra }}>
            {IAS[k]}
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Chamada final: comentário "IA" digitado + botão ----------
export const ComentaIA: React.FC<{ desde: number; digita: number; envia: number }> = ({ desde, digita, envia }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  const n = f < digita ? 0 : Math.min(2, Math.floor((f - digita) / 4) + 1);
  const enviado = f >= envia;
  return p > 0 ? (
    <div style={{ ...base, left: CENTRO - 360, width: 720, top: 1140, background: E.superficie, borderRadius: 28, padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: sombra }}>
      <span style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: E.linha }} />
      <span style={{ flex: 1, fontSize: 46, fontWeight: 700, color: E.texto, letterSpacing: "-0.02em" }}>
        {"IA".slice(0, n)}<span style={{ opacity: f % 20 < 10 && !enviado ? 1 : 0, color: E.verde }}>|</span>
      </span>
      <span style={{ fontSize: 36, fontWeight: 700, padding: "14px 26px", borderRadius: 18, background: enviado ? E.verde : E.linha,
        color: enviado ? PRETO : E.textoApoio, transform: `scale(${f >= envia && f < envia + 4 ? 0.92 : 1})` }}>
        {enviado ? "✓ enviado" : "comentar"}
      </span>
    </div>
  ) : null;
};

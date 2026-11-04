import { interpolate, useCurrentFrame } from "remotion";
import { siFacebook, siInstagram, siTiktok, siYoutube } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Cartao, chega, cresce, Selo, TelaCheia } from "../video1/componentes";

// Ilustrações do vídeo 5 (plano em edicao/video5/plano.md). O rosto ocupa o centro do quadro,
// então os cards ficam no teto do carro, acima da cabeça (y ≈ 370–540).
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const LARG = 840;
const Y_CARD = 360;

const Titulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", color: E.textoApoio, marginBottom: 12 }}>
    <span style={{ color: E.verde }}>•</span> {texto}
  </div>
);

// ---------- Logos das redes (cores originais, pedido do André) ----------
// Ícones do pacote simple-icons (CC0). O LinkedIn não está no pacote: o "in" é desenhado aqui.
type Rede = { nome: string; cor: string; path?: string };
export const REDES: Record<string, Rede> = {
  instagram: { nome: "Instagram", cor: `#${siInstagram.hex}`, path: siInstagram.path },
  tiktok: { nome: "TikTok", cor: "#FFFFFF", path: siTiktok.path },
  youtube: { nome: "YouTube", cor: `#${siYoutube.hex}`, path: siYoutube.path },
  facebook: { nome: "Facebook", cor: `#${siFacebook.hex}`, path: siFacebook.path },
  linkedin: { nome: "LinkedIn", cor: "#0A66C2" },
};

const Logo: React.FC<{ rede: Rede; tamanho: number }> = ({ rede, tamanho }) =>
  rede.path ? (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho}><path d={rede.path} fill={rede.cor} /></svg>
  ) : (
    <span style={{ width: tamanho, height: tamanho, borderRadius: tamanho * 0.18, background: rede.cor, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: tamanho * 0.62, fontWeight: 800,
      fontFamily: "Arial, sans-serif", letterSpacing: "-0.04em" }}>in</span>
  );

export const LogosRedes: React.FC<{ desde: number; titulo: string; logos: [keyof typeof REDES, number][] }> = ({
  desde, titulo, logos,
}) => {
  const f = useCurrentFrame();
  return (
    <Cartao y={Y_CARD} desde={desde}>
      <Titulo texto={titulo} />
      <div style={{ display: "flex", gap: 26, justifyContent: "center", alignItems: "center", height: 104 }}>
        {logos.map(([r, q]) => {
          const p = cresce(f, q, 4);
          return p > 0 ? (
            <span key={r} style={{ transform: `scale(${p})`, display: "inline-flex" }}>
              <Logo rede={REDES[r]} tamanho={88} />
            </span>
          ) : null;
        })}
      </div>
    </Cartao>
  );
};

// ---------- Card "roteiro do vídeo": cada item ganha ✓ quando é falado ----------
export const CardRoteiro: React.FC<{ desde: number; itens: [string, number][] }> = ({ desde, itens }) => {
  const f = useCurrentFrame();
  return (
    <Cartao y={Y_CARD} desde={desde}>
      <Titulo texto="roteiro de cada vídeo" />
      <div style={{ display: "flex", gap: 14 }}>
        {itens.map(([t, q]) => {
          const ok = f >= q;
          return (
            <span key={t} style={{ flex: 1, textAlign: "center", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em",
              padding: "14px 10px", borderRadius: 16, background: ok ? E.linha : "transparent", border: `1px solid ${E.linha}`,
              color: ok ? E.texto : E.textoApoio }}>
              {t} {ok ? <span style={{ color: E.verde }}>✓</span> : null}
            </span>
          );
        })}
      </div>
    </Cartao>
  );
};

// ---------- Grade de vídeos se enchendo + barras de leads subindo (sem números) ----------
export const CardTrafego: React.FC<{ desde: number; enche: [number, number]; leads: number }> = ({ desde, enche, leads }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, enche, [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const alturas = [0.3, 0.45, 0.6, 0.8, 1];
  return (
    <Cartao y={Y_CARD} desde={desde}>
      <Titulo texto="02 · tráfego pago" />
      {f < leads ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ height: 44, borderRadius: 10, background: i < n ? E.texto : "transparent",
              border: `1px solid ${E.linha}`, display: "flex", alignItems: "center", justifyContent: "center",
              color: PRETO, fontSize: 22 }}>{i < n ? "▶" : ""}</div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 98 }}>
          {alturas.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * 100 * cresce(f, leads + i * 2, 4)}%`, borderRadius: "8px 8px 0 0",
              background: i === alturas.length - 1 ? E.verde : E.linha }} />
          ))}
          <span style={{ fontSize: 34, fontWeight: 600, color: E.texto, marginLeft: 8 }}>leads ↑</span>
        </div>
      )}
    </Cartao>
  );
};

// ---------- Card com o logo Promptado (pequeno, acima da cabeça) ----------
export const SeloPromptado: React.FC<{ desde: number; titulo?: string }> = ({ desde, titulo }) => (
  <Cartao y={Y_CARD} desde={desde} largura={titulo ? 760 : 460}>
    {titulo ? <Titulo texto={titulo} /> : null}
    <div style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}>
      <LogoPromptado tamanho={64} cor={E.texto} />
      <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</span>
    </div>
  </Cartao>
);

// ---------- Resposta da IA recomendando a Promptado ----------
export const RespostaIA: React.FC<{ desde: number }> = ({ desde }) => (
  <Cartao y={Y_CARD} desde={desde}>
    <Titulo texto="resposta da IA" />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderRadius: 16,
      background: E.linha }}>
      <span style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, fontWeight: 600 }}>
        <LogoPromptado tamanho={48} cor={E.texto} /> Promptado
      </span>
      <Selo texto="recomendada ✓" style={{ fontSize: 30 }} />
    </div>
  </Cartao>
);

// ---------- Tela cheia: contador (ex.: 10 vídeos / dia, +500 leads / mês) ----------
export const TelaContador: React.FC<{ desde: number; rotulo: string; valor: number; prefixo?: string; sufixo: string; chega: number }> = ({
  desde, rotulo, valor, prefixo = "", sufixo, chega: q,
}) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [q - 8, q], [0, valor], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const rolando = f >= q - 8 && f < q;
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, width: LARG, top: 760, textAlign: "center", fontSize: 40, fontWeight: 500, color: E.textoApoio,
        opacity: cresce(f, desde, 3) }}>
        <span style={{ color: E.verde }}>•</span> {rotulo}
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 830, textAlign: "center", fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1 }}>
        <span style={{ fontSize: 240, color: f >= q ? E.verdeTexto : E.texto, filter: rolando ? "blur(5px)" : undefined }}>{prefixo}{n}</span>
        <div style={{ fontSize: 80, color: E.texto, marginTop: 14 }}>{sufixo}</div>
      </div>
    </TelaCheia>
  );
};

// ---------- Tela cheia: lista numerada que se monta (estilo B), depois vira o contador ----------
export const TelaEcossistema: React.FC<{ desde: number; itens: string[]; inicio: number; troca: number; total: number }> = ({
  desde, itens, inicio, troca, total,
}) => {
  const f = useCurrentFrame();
  if (f >= troca) return <TelaContador desde={troca} rotulo="com esse ecossistema" valor={total} prefixo="+" sufixo="leads / mês" chega={troca + 8} />;
  return (
    <TelaCheia>
      <div style={{ ...base, left: 110, width: 780, top: 700, color: E.texto }}>
        <div style={{ fontSize: 44, fontWeight: 500, color: chega(f, desde), marginBottom: 26 }}>
          <span style={{ color: E.verde }}>•</span> ecossistema Promptado
        </div>
        {itens.map((t, i) => {
          const q = inicio + i * 6;
          return f >= q ? (
            <div key={t} style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.2, whiteSpace: "nowrap", color: chega(f, q) }}>
              <span style={{ color: E.textoApoio }}>{i + 1}.</span> {t}
            </div>
          ) : null;
        })}
      </div>
    </TelaCheia>
  );
};

import { Img, interpolate, useCurrentFrame } from "remotion";
import { siGoogle, siGooglegemini, siInstagram, siPerplexity } from "simple-icons";
import { CORES, FONTE } from "../marca";
import { cresce, Selo } from "../video1/componentes";
import { FPS, Palavra } from "../video1/tempo";

// Estilo C (estilo-referencias-2-e-3.md, Ref 3) na marca Promptado: legenda karaokê embaixo,
// pílulas no topo e ilustrações compactas acima da cabeça (o boné começa em y ≈ 560).
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const CENTRO = 480; // centro da área segura; o Eixo do vídeo leva tudo para o centro da tela
const LARG = 840;

// ---------- Legenda karaokê: 2–3 palavras, branca com contorno, palavra falada em verde ----------
type Bloco = { inicio: number; fim: number; palavras: { q: number; texto: string }[] };

export const blocosKaraoke = (palavras: Palavra[], duracao: number, maxPalavras = 3, maxLetras = 18): Bloco[] => {
  const blocos: Bloco[] = [];
  let atual: Bloco["palavras"] = [];
  palavras.forEach(([t, w], i) => {
    atual.push({ q: Math.round(t * FPS), texto: w });
    const letras = atual.reduce((n, p) => n + p.texto.length + 1, 0) + (palavras[i + 1]?.[1].length ?? 0);
    if (/[.?!,]$/.test(w) || atual.length >= maxPalavras || letras > maxLetras || i === palavras.length - 1) {
      blocos.push({ inicio: atual[0].q, fim: 0, palavras: atual });
      atual = [];
    }
  });
  blocos.forEach((b, i) => {
    b.fim = i + 1 < blocos.length ? blocos[i + 1].inicio : duracao;
  });
  return blocos;
};

const NOMES: [RegExp, string][] = [
  [/\bias\b/g, "IAs"], [/\bia\b/g, "IA"], [/instagram/g, "Instagram"], [/\bmeta\b/g, "Meta"], [/chatgpt/g, "ChatGPT"],
  [/gemini/g, "Gemini"], [/perplexity/g, "Perplexity"], [/google/g, "Google"], [/\bai\b/g, "AI"],
  [/promptado/g, "Promptado"], [/\bsf leilões\b/g, "SF Leilões"], [/luís/g, "Luís"], [/\bgeo\b/g, "GEO"], [/ben rental car/g, "Ben Rental Car"], [/\bben\b/g, "Ben"], [/rental/g, "Rental"], [/\bcar\b/g, "Car"],
];
const minusculas = (t: string) => NOMES.reduce((s, [re, n]) => s.replace(re, n), t.toLowerCase());

export const LegendaKaraoke: React.FC<{ blocos: Bloco[]; escondida?: boolean; centroY?: number }> = ({
  blocos, escondida, centroY = 1410,
}) => {
  const f = useCurrentFrame();
  if (escondida) return null;
  const b = blocos.find((x) => f >= x.inicio && f < x.fim);
  if (!b) return null;
  const falada = [...b.palavras].reverse().find((p) => f >= p.q);
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: centroY - 50, textAlign: "center", fontSize: 84, fontWeight: 800,
      letterSpacing: "-0.02em", lineHeight: 1.1, WebkitTextStroke: "14px #000", paintOrder: "stroke fill" }}>
      {b.palavras.map((p, i) => (
        <span key={i} style={{ color: p === falada ? E.verde : "#FFFFFF" }}>{(i ? " " : "") + minusculas(p.texto)}</span>
      ))}
    </div>
  );
};

// ---------- Pílulas no topo ----------
export const Pilula: React.FC<{
  texto: React.ReactNode;
  desde: number;
  y: number;
  verde?: boolean;
  tamanho?: number;
}> = ({ texto, desde, y, verde, tamanho = 42 }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, textAlign: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: verde ? E.verde : E.superficie,
        color: verde ? PRETO : E.texto, fontSize: tamanho, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", whiteSpace: "nowrap",
        padding: `${tamanho * 0.32}px ${tamanho * 0.7}px`, borderRadius: 999, transform: `scale(${0.85 + 0.15 * p})`, opacity: p,
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
        {texto}
      </span>
    </div>
  );
};

// Lista de pílulas que se empilham (status "✓ …" / "✗ …").
export const PilulasEmpilhadas: React.FC<{ itens: [React.ReactNode, number, boolean?][]; y: number; passo?: number; tamanho?: number }> = ({
  itens, y, passo = 80, tamanho = 40,
}) => (
  <>
    {itens.map(([t, q, verde], i) => (
      <Pilula key={i} texto={t} desde={q} y={y + i * passo} verde={verde} tamanho={tamanho} />
    ))}
  </>
);

// ---------- Logos (cores originais) ----------
type Logo = { nome: string; cor: string; path?: string };
export const LOGOS: Record<string, Logo> = {
  instagram: { nome: "Instagram", cor: `#${siInstagram.hex}`, path: siInstagram.path },
  gemini: { nome: "Gemini", cor: `#${siGooglegemini.hex}`, path: siGooglegemini.path },
  perplexity: { nome: "Perplexity", cor: `#${siPerplexity.hex}`, path: siPerplexity.path },
  google: { nome: "Google", cor: `#${siGoogle.hex}`, path: siGoogle.path },
  chatgpt: { nome: "ChatGPT", cor: E.texto }, // não está no pacote de ícones livres: vira chip com o nome
};

export const IconeLogo: React.FC<{ logo: Logo; tamanho: number }> = ({ logo, tamanho }) =>
  logo.path ? (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho}><path d={logo.path} fill={logo.cor} /></svg>
  ) : (
    <span style={{ fontSize: tamanho * 0.5, fontWeight: 700, color: logo.cor, letterSpacing: "-0.02em" }}>{logo.nome}</span>
  );

export const LinhaLogos: React.FC<{ itens: [keyof typeof LOGOS, number][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: CENTRO - LARG / 2, width: LARG, top: y, display: "flex", gap: 18, justifyContent: "center" }}>
      {itens.map(([k, q]) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={k} style={{ background: E.superficie, borderRadius: 26, height: 112, minWidth: 112, padding: "0 18px",
            display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>
            <IconeLogo logo={LOGOS[k]} tamanho={72} />
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Card compacto acima da cabeça ----------
const Card: React.FC<{ desde: number; y: number; children: React.ReactNode; largura?: number }> = ({ desde, y, children, largura = 720 }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  return (
    <div style={{ ...base, left: CENTRO - largura / 2, width: largura, top: y, background: E.superficie, borderRadius: 28,
      padding: "20px 26px", color: E.texto, opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}>
      {children}
    </div>
  );
};

// Barra de busca do Instagram; ganha o chip "Meta IA".
export const BarraBusca: React.FC<{ desde: number; metaIA: number; y: number }> = ({ desde, metaIA, y }) => {
  const f = useCurrentFrame();
  const comIA = f >= metaIA;
  return (
    <Card desde={desde} y={y}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 38, fontWeight: 500 }}>
        <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke={E.textoApoio} strokeWidth="2.5" fill="none" /><path d="M15 15 L21 21" stroke={E.textoApoio} strokeWidth="2.5" strokeLinecap="round" /></svg>
        <span style={{ flex: 1, color: E.textoApoio }}>{comIA ? "pergunte à Meta IA…" : "pesquisar"}</span>
        {comIA ? <span style={{ transform: `scale(${cresce(f, metaIA, 4)})` }}><Selo texto="Meta IA" style={{ fontSize: 30 }} /></span> : null}
      </div>
    </Card>
  );
};

// Lista de perfis (vira risco) e depois a resposta da IA sendo digitada.
export const PerfisParaResposta: React.FC<{ desde: number; risco: number; resposta: number; y: number }> = ({ desde, risco, resposta, y }) => {
  const f = useCurrentFrame();
  if (f >= resposta) {
    const linhas = [0.95, 0.8, 0.9, 0.55];
    return (
      <Card desde={resposta} y={y}>
        <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio, marginBottom: 12 }}>resposta da Meta IA</div>
        {linhas.map((l, i) => (
          <div key={i} style={{ height: 18, borderRadius: 9, background: E.linha, marginTop: 10,
            width: `${l * 100 * cresce(f, resposta + 3 + i * 4, 4)}%` }} />
        ))}
      </Card>
    );
  }
  return (
    <Card desde={desde} y={y}>
      <div style={{ position: "relative" }}>
        {["@perfil_1", "@perfil_2", "@perfil_3"].map((n) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 500, color: E.textoApoio, padding: "4px 0" }}>
            <span style={{ width: 40, height: 40, borderRadius: 20, background: E.linha }} /> {n}
          </div>
        ))}
        {f >= risco ? (
          <span style={{ position: "absolute", left: -10, top: "48%", height: 12, borderRadius: 6, background: E.verde,
            width: 690 * cresce(f, risco, 6), transform: "rotate(-6deg)", transformOrigin: "left center" }} />
        ) : null}
      </div>
    </Card>
  );
};

// Chave liga/desliga travada: tenta desligar e volta.
export const ChaveTravada: React.FC<{ desde: number; tenta: number; y: number }> = ({ desde, tenta, y }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [tenta, tenta + 5, tenta + 12], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Card desde={desde} y={y} largura={560}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 38, fontWeight: 600 }}>
        <span>Meta IA na busca</span>
        <span style={{ position: "relative", width: 110, height: 60, borderRadius: 30, background: E.verde }}>
          <span style={{ position: "absolute", top: 6, left: 56 - t * 50, width: 48, height: 48, borderRadius: 24, background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔒</span>
        </span>
      </div>
    </Card>
  );
};

// Resposta da IA com uma marca recomendada.
export const RespostaRecomendada: React.FC<{ desde: number; selo: number; y: number }> = ({ desde, selo, y }) => {
  const f = useCurrentFrame();
  return (
    <Card desde={desde} y={y}>
      <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio, marginBottom: 12 }}>resposta da IA</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderRadius: 16, background: E.linha }}>
        <span style={{ fontSize: 40, fontWeight: 600, whiteSpace: "nowrap" }}>sua marca</span>
        {f >= selo ? <span style={{ transform: `scale(${cresce(f, selo, 4)})` }}><Selo texto="recomendada ✓" style={{ fontSize: 30, whiteSpace: "nowrap" }} /></span> : null}
      </div>
    </Card>
  );
};

// Ben Rental Car: visibilidade nas IAs de 0% a 20% (números que o André fala).
export const CardVisibilidade: React.FC<{ desde: number; zero: number; vinte: number; mes: number; y: number }> = ({ desde, zero, vinte, mes, y }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [zero, vinte], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const chegou = f >= vinte;
  return (
    <Card desde={desde} y={y}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em" }}>Ben Rental Car</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: E.textoApoio }}>visibilidade nas IAs</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1, color: chegou ? E.verdeTexto : E.texto }}>
            {f >= zero ? (chegou ? "+20%" : `${v}%`) : ""}
          </div>
          {f >= mes ? <Selo texto="em 1 mês" style={{ fontSize: 28 }} /> : null}
        </div>
      </div>
    </Card>
  );
};

// ---------- Print real do celular (enviado pelo André), recortado na parte que importa ----------
// recorte: [x, y, largura, altura] em px da imagem original. Aproxima devagar enquanto está na tela.
export const PrintCelular: React.FC<{
  src: string;
  recorte: [number, number, number, number];
  desde: number;
  ate: number;
  largura: number;
  y: number;
  larguraImagem?: number; // largura em px da imagem original (os prints do celular têm 736)
}> = ({ src, recorte, desde, ate, largura, y, larguraImagem = 736 }) => {
  const f = useCurrentFrame();
  const [rx, ry, rw, rh] = recorte;
  const escala = largura / rw;
  const altura = rh * escala;
  const entra = cresce(f, desde, 6);
  const sai = 1 - cresce(f, ate - 5, 5);
  const zoom = interpolate(f, [desde, ate], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: CENTRO - largura / 2, top: y, width: largura, height: altura, borderRadius: 34,
      overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: `3px solid ${E.linha}`, opacity: entra * sai,
      transform: `translateY(${(1 - entra) * 60}px) scale(${zoom})` }}>
      <Img src={src} style={{ position: "absolute", left: -rx * escala, top: -ry * escala, width: larguraImagem * escala }} />
    </div>
  );
};

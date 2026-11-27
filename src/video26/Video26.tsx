import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { siGooglegemini } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { cresce, Eixo, NoEixo } from "../video1/componentes";
import { criaAncora, Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { blocosKaraoke, LegendaKaraoke, Pilula } from "../video6/componentes";
import { LogoChatGPT } from "../video8/componentes";
import { Traducao } from "../video25/componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";

// Vídeo 26 (Stories, 1080×1920): estilo C (notícia rápida). Rosto de y ≈ 580 ao queixo em y ≈ 1370; pílulas e cards no topo
// (y 270–560, sobre o teto do carro, sempre com fundo escuro) e legenda karaokê no peito (y ≈ 1460). O Instagram cobre o topo
// (até y ≈ 220) e a base (a partir de y ≈ 1640) dos stories.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const FONTE_VIDEO = { video: "editar/video26.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15;
const EIXO = { dx: 60, escala: 0.93 };
const CENTRO = 480;
const Y = 290;
const sombra = "0 12px 34px rgba(0,0,0,0.45)";

export const duracaoVideo26 = () => linha.duracaoQuadros + SEGURA_NO_FIM;
const trechos = linha.trechos as [number, number][];

const useFade = (desde: number, ate: number) => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [ate - 5, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { f, p: Math.min(cresce(f, desde, 5), sai) };
};

// Mostra o filho só entre "de" e "ate".
const Entre: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const f = useCurrentFrame();
  return f >= de && f < ate ? <AbsoluteFill>{children}</AbsoluteFill> : null;
};

const Card: React.FC<{ desde: number; ate: number; y?: number; largura?: number; children: React.ReactNode }> = ({ desde, ate, y = Y, largura = 760, children }) => {
  const { p } = useFade(desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - largura / 2, width: largura, top: y, background: E.superficie, borderRadius: 30, padding: "24px 30px", color: E.texto,
      opacity: p, transform: `translateY(${(1 - p) * -30}px)`, boxShadow: sombra }}>
      {children}
    </div>
  );
};

const CardNome: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => (
  <Card desde={desde} ate={ate} largura={640}>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <span style={{ flex: "none", width: 92, height: 92, borderRadius: 46, background: E.linha, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48 }}>👤</span>
      <div>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>Felipe</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: E.verde, marginTop: 6 }}>CEO do Reclame Aqui</div>
      </div>
    </div>
  </Card>
);

const MiniChat: React.FC<{ desde: number; ate: number; responde: number }> = ({ desde, ate, responde }) => {
  const { f } = useFade(desde, ate);
  const pergunta = "me recomenda uma empresa de…";
  const n = Math.floor(Math.min(pergunta.length, Math.max(0, f - desde - 2) * 1.8));
  const r = cresce(f, responde, 5);
  return (
    <Card desde={desde} ate={ate}>
      <div style={{ textAlign: "right" }}>
        <span style={{ display: "inline-block", background: E.linha, fontSize: 38, fontWeight: 600, padding: "12px 22px", borderRadius: "24px 24px 6px 24px" }}>
          {pergunta.slice(0, n)}
        </span>
      </div>
      {r > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, opacity: r, transform: `translateY(${(1 - r) * 16}px)` }}>
          <LogoChatGPT tamanho={44} />
          <svg viewBox="0 0 24 24" width={44} height={44}><path d={siGooglegemini.path} fill={`#${siGooglegemini.hex}`} /></svg>
          <span style={{ fontSize: 40, fontWeight: 700 }}>recomendo a <span style={{ color: E.verde }}>empresa X ✓</span></span>
        </div>
      ) : null}
    </Card>
  );
};

const Checks: React.FC<{ desde: number; ate: number; itens: [string, number][] }> = ({ desde, ate, itens }) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: CENTRO - 420, width: 840, top: Y - 10, textAlign: "center", opacity: p }}>
      {itens.map(([t, q], i) => {
        const c = cresce(f, q, 4);
        return c > 0 ? (
          <div key={t} style={{ marginTop: i ? 12 : 0 }}>
            <span style={{ display: "inline-block", background: i === itens.length - 1 && f >= q ? E.verde : E.superficie,
              color: i === itens.length - 1 && f >= q ? PRETO : E.texto, fontSize: 42, fontWeight: 700, padding: "12px 28px", borderRadius: 999,
              transform: `scale(${0.8 + 0.2 * c})`, opacity: c, boxShadow: sombra }}>✓ {t}</span>
          </div>
        ) : null;
      })}
    </div>
  );
};

const CardEstudo: React.FC<{ desde: number; ate: number; conta: number }> = ({ desde, ate, conta }) => {
  const { f } = useFade(desde, ate);
  const n = Math.round(interpolate(f, [conta, conta + 18], [0, 85], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - (1 - t) ** 3 }));
  return (
    <Card desde={desde} ate={ate} largura={700}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 600, color: E.textoApoio }}>
        <LogoPromptado tamanho={34} cor={E.texto} /> estudo Promptado
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1, color: f >= conta ? E.verde : E.textoApoio }}>
          +{n}<span style={{ fontSize: 70 }}> mil</span>
        </span>
      </div>
      <div style={{ fontSize: 40, fontWeight: 700, marginTop: 4 }}>conversas analisadas</div>
    </Card>
  );
};

const CardFonte1: React.FC<{ desde: number; ate: number; destaque: number }> = ({ desde, ate, destaque }) => {
  const { f } = useFade(desde, ate);
  const d = cresce(f, destaque, 6);
  return (
    <Card desde={desde} ate={ate} largura={740}>
      <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio }}>fontes mais influentes no ChatGPT · Brasil</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16, padding: "16px 22px", borderRadius: 20,
        background: d > 0.5 ? E.verde : E.linha, color: d > 0.5 ? PRETO : E.texto, transform: `scale(${1 + 0.04 * Math.sin(Math.min(1, d) * Math.PI)})` }}>
        <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: "-0.04em" }}>1º</span>
        <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em" }}>Reclame Aqui</span>
        {d > 0.5 ? <span style={{ marginLeft: "auto", fontSize: 44 }}>🏆</span> : null}
      </div>
    </Card>
  );
};

const ProximoStory: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 5);
  if (p <= 0) return null;
  const seta = Math.sin((f - desde) / 4) * 12;
  return (
    <div style={{ ...base, left: CENTRO - 420, width: 840, top: Y + 20, textAlign: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "#FFFFFF", color: "#000", fontSize: 50, fontWeight: 800,
        letterSpacing: "-0.03em", padding: "20px 34px", borderRadius: 24, boxShadow: sombra, transform: "rotate(-3deg)" }}>
        veja no próximo story
        <span style={{ display: "inline-flex", width: 64, height: 64, borderRadius: 32, background: E.verde, color: PRETO, alignItems: "center",
          justifyContent: "center", transform: `translateX(${seta}px)` }}>→</span>
      </span>
    </div>
  );
};

export const Video26: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const palavras = legendas as Palavra[];
  const a = criaAncora(palavras);
  const blocos = blocosKaraoke(palavras, linha.duracaoQuadros);
  const fimVideo = a("vídeo", 3, -0.8);
  return (
    <FonteVideo.Provider value={FONTE_VIDEO}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[]} />
        )}
        <Eixo.Provider value={EIXO}>
          <NoEixo>
            <Entre de={0} ate={a("promptado")}><Pilula texto="• novidade" desde={4} y={Y} verde tamanho={50} /></Entre>
            <Entre de={a("promptado")} ate={a("felipe", 1, -0.3)}>
              <Pilula texto={<><LogoPromptado tamanho={44} cor={E.texto} /> Promptado</>} desde={a("promptado")} y={Y} tamanho={46} />
              <Pilula texto="📈 crescendo dia após dia" desde={a("crescendo")} y={Y + 110} verde tamanho={42} />
            </Entre>
            <CardNome desde={a("felipe")} ate={a("fez")} />
            <Entre de={a("vídeo")} ate={a("busca")}>
              <Pilula texto="🎥 vídeo sobre o poder da IA" desde={a("vídeo")} y={Y} tamanho={42} />
            </Entre>
            <Entre de={a("geo")} ate={a("busca")}>
              <Traducao termo="GEO" texto="aparecer nas respostas das IAs" desde={a("geo")} y={Y + 110} />
            </Entre>
            <MiniChat desde={a("busca")} ate={a("hoje", 1, -0.3)} responde={a("recomenda")} />
            <Checks desde={a("serviço")} ate={a("ceo", 2, -0.3)}
              itens={[["sua empresa na resposta", a("resposta")], ["orgânico (sem anúncio)", a("orgânica")], ["com estratégia", a("estratégia")]]} />
            <Entre de={a("ceo", 2, -0.3)} ate={a("estudo")}>
              <Pilula texto="🎥 o CEO do Reclame Aqui explicou" desde={a("ceo", 2, -0.3)} y={Y} tamanho={40} />
            </Entre>
            <CardEstudo desde={a("estudo")} ate={a("reclame", 4, -0.4)} conta={a("85")} />
            <CardFonte1 desde={a("reclame", 4, -0.4)} ate={fimVideo} destaque={a("primeiro")} />
            <ProximoStory desde={fimVideo} />
            <LegendaKaraoke blocos={blocos} centroY={1460} />
          </NoEixo>
        </Eixo.Provider>
      </AbsoluteFill>
    </FonteVideo.Provider>
  );
};

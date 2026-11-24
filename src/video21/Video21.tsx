import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { siClaude, siGooglegemini, siPerplexity } from "simple-icons";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { cresce } from "../video1/componentes";
import { criaAncora, Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { blocosKaraoke, LegendaKaraoke } from "../video6/componentes";
import { LogoChatGPT } from "../video8/componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";

// Vídeo 21 (YouTube, 1920×1080): estilo A adaptado. Você fica no centro (rosto em x ≈ 720–1080, y ≈ 0–540);
// os cards vão à direita (x 1260–1820), sobre a parede, e a legenda karaokê embaixo, no centro.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const FONTE_VIDEO = { video: "editar/video21.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15;
const X = 1260;
const L = 560;
const sombra = "0 14px 40px rgba(0,0,0,0.45)";

export const duracaoVideo21 = () => linha.duracaoQuadros + SEGURA_NO_FIM;
const trechos = linha.trechos as [number, number][];

const useFade = (desde: number, ate: number) => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [ate - 6, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { f, p: Math.min(cresce(f, desde, 6), sai) };
};

const Painel: React.FC<{ desde: number; ate: number; y?: number; children: React.ReactNode }> = ({ desde, ate, y = 200, children }) => {
  const { p } = useFade(desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: X, width: L, top: y, background: E.superficie, borderRadius: 32, padding: "30px 34px", color: E.texto,
      opacity: p, transform: `translateX(${(1 - p) * 60}px)`, boxShadow: sombra }}>
      {children}
    </div>
  );
};

const Check: React.FC<{ texto: string; ativo?: boolean; tamanho?: number }> = ({ texto, ativo = true, tamanho = 46 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: tamanho, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
    color: ativo ? E.texto : E.textoApoio }}>
    <span style={{ flex: "none", width: tamanho * 1.1, height: tamanho * 1.1, borderRadius: 12, background: ativo ? E.verde : E.linha, color: PRETO,
      display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: tamanho * 0.7 }}>{ativo ? "✓" : ""}</span>
    {texto}
  </div>
);

const Preco: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const pulo = interpolate(f - desde, [0, 4, 8], [1.2, 0.96, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ ...base, left: X, width: L, top: 240, textAlign: "center", opacity: p, transform: `scale(${pulo})` }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: "#FFFFFF", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>por apenas</div>
      <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: "-0.06em", color: E.verde, lineHeight: 1, whiteSpace: "nowrap", textShadow: "0 8px 34px rgba(0,0,0,0.55)" }}>R$ 13,30</div>
      <div style={{ fontSize: 60, fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>por dia</div>
    </div>
  );
};

const icone = (path: string, cor: string) => <svg viewBox="0 0 24 24" width={70} height={70}><path d={path} fill={cor} /></svg>;
const LOGOS: [string, React.ReactNode][] = [
  ["ChatGPT", <LogoChatGPT key="c" tamanho={70} />],
  ["Gemini", icone(siGooglegemini.path, `#${siGooglegemini.hex}`)],
  ["Claude", icone(siClaude.path, `#${siClaude.hex}`)],
  ["Perplexity", icone(siPerplexity.path, "#FFFFFF")],
];

const LogosIAs: React.FC<{ desde: number; ate: number; tempos: number[] }> = ({ desde, ate, tempos }) => {
  const { f } = useFade(desde, ate);
  return (
    <Painel desde={desde} ate={ate}>
      <Check texto="Monitoramento nas principais IAs" tamanho={40} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
        {LOGOS.map(([nome, logo], i) => {
          const q = cresce(f, tempos[i], 5);
          return (
            <div key={nome} style={{ display: "flex", alignItems: "center", gap: 14, background: E.linha, borderRadius: 20, padding: "14px 16px",
              opacity: q, transform: `scale(${0.8 + 0.2 * q})` }}>
              {logo}<span style={{ fontSize: 34, fontWeight: 700 }}>{nome}</span>
            </div>
          );
        })}
      </div>
    </Painel>
  );
};

const Concorrentes: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => (
  <Painel desde={desde} ate={ate}>
    <Check texto="Análise de concorrentes" tamanho={44} />
    {[["1º", "Sua marca", true], ["2º", "Concorrente A"], ["3º", "Concorrente B"]].map(([n, nome, sua]) => (
      <div key={String(n)} style={{ display: "flex", gap: 18, fontSize: 38, fontWeight: 700, marginTop: 16, color: sua ? E.verde : E.textoApoio }}>
        <span style={{ width: 60 }}>{n}</span>{nome}
      </div>
    ))}
  </Painel>
);

const Indicadores: React.FC<{ desde: number; ate: number; sobeVis: number; sobeRep: number }> = ({ desde, ate, sobeVis, sobeRep }) => {
  const { f } = useFade(desde, ate);
  const barra = (nome: string, q: number) => {
    const v = interpolate(f, [q, q + 20], [30, 85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, fontWeight: 700 }}>
          <span>{nome}</span><span style={{ color: f >= q ? E.verde : E.textoApoio }}>{f >= q ? "↑" : ""}</span>
        </div>
        <div style={{ height: 22, borderRadius: 11, background: E.linha, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${v}%`, height: "100%", background: E.verde, borderRadius: 11 }} />
        </div>
      </div>
    );
  };
  return (
    <Painel desde={desde} ate={ate}>
      <div style={{ fontSize: 32, fontWeight: 600, color: E.textoApoio }}>o que fazer para a sua marca</div>
      {barra("Visibilidade", sobeVis)}
      {barra("Reputação", sobeRep)}
    </Painel>
  );
};

const Resumo: React.FC<{ desde: number; ate: number; plano: number }> = ({ desde, ate, plano }) => {
  const { f } = useFade(desde, ate);
  return (
    <Painel desde={desde} ate={ate}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 600, color: E.textoApoio, marginBottom: 20 }}>
        <LogoPromptado tamanho={36} cor={E.texto} /> Promptado
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Check texto="R$ 13,30 por dia" tamanho={38} />
        <Check texto="Monitoramento nas principais IAs" tamanho={38} />
        <Check texto="Análise de concorrentes" tamanho={38} />
        <Check texto="Plano de ação para sua marca" ativo={f >= plano} tamanho={38} />
      </div>
    </Painel>
  );
};

const BotaoAgende: React.FC<{ desde: number; clique: number }> = ({ desde, clique }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 6);
  if (p <= 0) return null;
  const cursor = interpolate(f, [desde, clique - 2], [140, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const apertado = f >= clique && f < clique + 4;
  return (
    <div style={{ ...base, left: X, width: L, top: 330, textAlign: "center", opacity: p }}>
      <span style={{ position: "relative", display: "inline-block", background: E.verde, color: PRETO, fontSize: 48, fontWeight: 800,
        letterSpacing: "-0.03em", lineHeight: 1.1, padding: "30px 40px", borderRadius: 26, boxShadow: sombra,
        transform: `scale(${(0.85 + 0.15 * p) * (apertado ? 0.94 : 1)})` }}>
        Agende sua reunião<br />gratuita →
        <svg viewBox="0 0 24 24" width={70} height={70} style={{ position: "absolute", right: -10 - cursor, bottom: -40 - cursor * 0.6 }}>
          <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="#FFFFFF" stroke="#000" strokeWidth={1.2} />
        </svg>
      </span>
    </div>
  );
};

const Selo: React.FC<{ ate: number }> = ({ ate }) => {
  const { p } = useFade(0, ate);
  return p > 0 ? (
    <div style={{ ...base, left: 90, top: 70, opacity: p }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: PRETO, fontSize: 34, fontWeight: 800,
        textTransform: "uppercase", padding: "12px 26px", borderRadius: 999, boxShadow: sombra }}>• Promptado</span>
    </div>
  ) : null;
};

export const Video21: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const palavras = legendas as Palavra[];
  const a = criaAncora(palavras);
  const blocos = blocosKaraoke(palavras, linha.duracaoQuadros);
  const fim = linha.duracaoQuadros + SEGURA_NO_FIM;
  const chamada = a("agende");
  return (
    <FonteVideo.Provider value={FONTE_VIDEO}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[]} />
        )}
        <Selo ate={90} />
        <Preco desde={a("1330")} ate={a("monitora")} />
        <Painel desde={a("monitora")} ate={a("chatgpt")}><Check texto="Monitoramento nas principais IAs" /></Painel>
        <LogosIAs desde={a("chatgpt")} ate={a("você", 3)} tempos={[a("chatgpt"), a("gemini"), a("claude"), a("perplexity")]} />
        <Concorrentes desde={a("concorrentes")} ate={a("necessidade")} />
        <Indicadores desde={a("necessidade")} ate={a("se", 3)} sobeVis={a("visibilidade")} sobeRep={a("reputação", 2)} />
        <Resumo desde={a("se", 3)} ate={a("entre", 2)} plano={a("plano")} />
        <BotaoAgende desde={a("entre", 2)} clique={chamada} />
        {/* legenda karaokê embaixo, no centro da tela (o componente é desenhado para 1080 de largura) */}
        <AbsoluteFill style={{ transform: "translateX(480px)" }}>
          <LegendaKaraoke blocos={blocos} centroY={925} />
        </AbsoluteFill>
        {modo === "previa" ? (
          <>
            <Sequence from={Math.max(0, chamada - 12)} durationInFrames={20}>
              <Audio src={staticFile("sons/subida.wav")} />
            </Sequence>
            <Sequence from={chamada} durationInFrames={fim - chamada}>
              <Audio src={staticFile("sons/musiquinha.wav")} />
            </Sequence>
          </>
        ) : null}
      </AbsoluteFill>
    </FonteVideo.Provider>
  );
};

// Thumbnail do YouTube (1280×720 e 1920×1080): você à direita; texto à esquerda.
export const Thumb21: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONTE }}>
    <Img src={staticFile("video21/capa-fundo.png")} style={{ position: "absolute", left: "14%", width: "100%", height: "100%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.8) 38%, rgba(0,0,0,0) 62%)" }} />
    <div style={{ position: "absolute", left: "5%", top: "16%", width: "52%" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: PRETO, fontSize: "3vh", fontWeight: 800,
        textTransform: "uppercase", padding: "1vh 2.2vh", borderRadius: 999 }}>• Promptado</span>
      <div style={{ marginTop: "3vh", fontSize: "17vh", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95, color: E.verde }}>R$ 13,30<span style={{ fontSize: "9vh", color: "#FFFFFF" }}>/dia</span></div>
      <div style={{ marginTop: "2vh", fontSize: "9.5vh", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1, color: "#FFFFFF", textTransform: "uppercase" }}>
        Sua marca nas <span style={{ textTransform: "none" }}>IAs</span>
      </div>
      <div style={{ marginTop: "4vh", display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: "4vh", fontWeight: 700 }}>
        <LogoPromptado tamanho={44} cor={E.texto} /> Promptado
      </div>
    </div>
  </AbsoluteFill>
);

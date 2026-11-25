import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { cresce } from "../video1/componentes";
import { criaAncora, Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { blocosKaraoke, LegendaKaraoke } from "../video6/componentes";
import { Clarao } from "../video7/componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";

// Vídeo 24 (YouTube, 1920×1080): estilo A adaptado, com as telas da plataforma Promptado enviadas pelo André.
// Você fica no centro-esquerda (rosto em x ≈ 640–1090, y ≈ 100–700); as ilustrações vão à direita (x 1290–1850),
// sobre os monitores e acima do ombro; legenda karaokê embaixo, no centro. Telas cheias da plataforma com movimento lento.
const E = CORES.dark;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const FONTE_VIDEO = { video: "editar/video24.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15;
const X = 1290;
const L = 560;
const sombra = "0 16px 44px rgba(0,0,0,0.5)";
const img = (n: number) => staticFile(`video24/plataforma-${n}.png`);

export const duracaoVideo24 = () => linha.duracaoQuadros + SEGURA_NO_FIM;
const trechos = linha.trechos as [number, number][];

const useFade = (desde: number, ate: number) => {
  const f = useCurrentFrame();
  const sai = interpolate(f, [ate - 6, ate], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { f, p: Math.min(cresce(f, desde, 6), sai) };
};

const Painel: React.FC<{ desde: number; ate: number; y?: number; children: React.ReactNode }> = ({ desde, ate, y = 150, children }) => {
  const { p } = useFade(desde, ate);
  if (p <= 0) return null;
  return (
    <div style={{ ...base, left: X, width: L, top: y, background: E.superficie, borderRadius: 32, padding: "30px 34px", color: E.texto,
      opacity: p, transform: `translateX(${(1 - p) * 60}px)`, boxShadow: sombra }}>
      {children}
    </div>
  );
};

// Print da plataforma num card arredondado que entra deslizando; "revela" desenha da esquerda para a direita.
const Print: React.FC<{ n: number; desde: number; ate: number; y: number; largura?: number; revela?: boolean; destaque?: number }> = ({
  n, desde, ate, y, largura = L, revela, destaque,
}) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const r = revela ? cresce(f, desde + 4, 18) : 1;
  const d = destaque === undefined ? 0 : cresce(f, destaque, 6);
  return (
    <div style={{ ...base, left: X + L - largura, width: largura, top: y, opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
      <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#FFFFFF", boxShadow: `0 0 0 12px ${E.superficie}, ${sombra}` }}>
        <Img src={img(n)} style={{ display: "block", width: "100%", clipPath: revela ? `inset(0 ${(1 - r) * 100}% 0 0)` : undefined }} />
        {/* contorno verde na linha do 1º lugar do ranking (imagem 4: linha em y 93–145 de 423) */}
        {d > 0 ? (
          <div style={{ position: "absolute", left: "1.3%", width: "96.5%", top: `${(90 / 423) * 100}%`, height: `${(58 / 423) * 100}%`,
            border: `5px solid ${E.verde}`, borderRadius: 12, opacity: d, transform: `scale(${1.08 - 0.08 * d})` }} />
        ) : null}
      </div>
    </div>
  );
};

// Tela cheia com um print da plataforma, câmera lenta (zoom e deslize) e rótulo.
const TelaPrint: React.FC<{ n: number; desde: number; ate: number; rotulo: string; largura: number; origem: string; zoom: number;
  carimbo?: [string, number] }> = ({ n, desde, ate, rotulo, largura, origem, zoom, carimbo }) => {
  const f = useCurrentFrame();
  if (f < desde || f >= ate) return null;
  const z = interpolate(f, [desde, ate], [1, zoom], { extrapolateRight: "clamp" });
  const c = carimbo ? cresce(f, carimbo[1], 5) : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 45%, #10241A 0%, #000 65%)" }}>
      <div style={{ ...base, left: 110, top: 70, fontSize: 40, fontWeight: 600, color: E.texto, opacity: cresce(f, desde, 6) }}>
        <span style={{ color: E.verde }}>•</span> {rotulo}
      </div>
      <div style={{ position: "absolute", left: (1920 - largura) / 2, top: 150, width: largura, borderRadius: 26, overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transform: `scale(${z})`, transformOrigin: origem }}>
        <Img src={img(n)} style={{ display: "block", width: "100%" }} />
      </div>
      {carimbo && c > 0 ? (
        <div style={{ ...base, right: 160, top: 160, transform: `rotate(-6deg) scale(${interpolate(f - carimbo[1], [0, 4, 8], [1.6, 0.94, 1], { extrapolateRight: "clamp" })})` }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 84, fontWeight: 800, letterSpacing: "-0.04em",
            padding: "18px 44px", borderRadius: 24, boxShadow: sombra }}>{carimbo[0]}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Convite: React.FC<{ desde: number; card: number; ate: number }> = ({ desde, card, ate }) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const c = cresce(f, card, 6);
  const pulo = interpolate(f - card, [0, 5, 10], [0, 1.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ ...base, left: X, width: L, top: 170, opacity: p }}>
      <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 32, fontWeight: 800, textTransform: "uppercase",
        padding: "10px 24px", borderRadius: 999, boxShadow: sombra }}>• convite</span>
      {c > 0 ? (
        <div style={{ marginTop: 22, background: E.superficie, borderRadius: 32, padding: "30px 34px", display: "flex", alignItems: "center", gap: 26,
          opacity: c, transform: `translateY(${(1 - c) * 40}px)`, boxShadow: sombra }}>
          <span style={{ flex: "none", width: 104, height: 104, borderRadius: 52, background: E.verde, color: PRETO, fontSize: 64, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pulo})` }}>✓</span>
          <div>
            <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.04em", color: E.texto, lineHeight: 1.05 }}>Você foi selecionado</div>
            <div style={{ fontSize: 30, fontWeight: 500, color: E.textoApoio, marginTop: 8 }}>por um especialista Promptado</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const PlanoAcao: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => {
  const { f } = useFade(desde, ate);
  const b = interpolate(f, [desde + 6, ate - 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Painel desde={desde} ate={ate} y={200}>
      <div style={{ fontSize: 30, fontWeight: 600, color: E.textoApoio }}>📋 plano de ação</div>
      <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", marginTop: 8 }}>para a sua marca</div>
      <div style={{ height: 24, borderRadius: 12, background: E.linha, marginTop: 26, overflow: "hidden" }}>
        <div style={{ width: `${b}%`, height: "100%", background: E.verde, borderRadius: 12 }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: b >= 99 ? E.verde : E.textoApoio, marginTop: 12 }}>{b >= 99 ? "✓ pronto" : "traçando…"}</div>
    </Painel>
  );
};

const PalavraLado: React.FC<{ texto: string; desde: number; ate: number; y?: number; verde?: boolean; pilula?: [string, number]; sublinhado?: number }> = ({
  texto, desde, ate, y = 220, verde, pilula, sublinhado,
}) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const pulo = interpolate(f - desde, [0, 4, 8], [1.2, 0.97, 1], { extrapolateRight: "clamp" });
  const tamanho = Math.min(140, (L + 20) / (texto.length * 0.6 + 0.6));
  return (
    <div style={{ ...base, left: X - 20, width: L + 40, top: y, textAlign: "center", opacity: p }}>
      <span style={{ position: "relative", display: "inline-block", fontSize: tamanho, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1,
        textTransform: "uppercase", color: verde ? E.verde : "#FFFFFF", transform: `scale(${pulo})`, background: "rgba(10,10,12,0.9)",
        padding: `${tamanho * 0.18}px ${tamanho * 0.3}px ${tamanho * 0.3}px`, borderRadius: 30, boxShadow: sombra }}>
        {texto}
        {sublinhado !== undefined && f >= sublinhado ? (
          <span style={{ position: "absolute", left: tamanho * 0.3, top: tamanho * 1.08, height: 12, borderRadius: 6, background: E.verde,
            width: `calc(${cresce(f, sublinhado, 8)} * (100% - ${tamanho * 0.6}px))` }} />
        ) : null}
      </span>
      {pilula && f >= pilula[1] ? (
        <div style={{ marginTop: 40 }}>
          <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 40, fontWeight: 800, padding: "12px 30px",
            borderRadius: 999, boxShadow: sombra, transform: `scale(${0.8 + 0.2 * cresce(f, pilula[1], 4)})` }}>{pilula[0]}</span>
        </div>
      ) : null}
    </div>
  );
};

const Contador: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const n = Math.round(interpolate(f, [desde, desde + 22], [0, 200], { extrapolateRight: "clamp", easing: (t) => 1 - (1 - t) ** 3 }));
  return (
    <div style={{ ...base, left: X - 20, width: L + 40, top: 130, textAlign: "center", opacity: p, background: "rgba(10,10,12,0.9)", borderRadius: 36,
      padding: "20px 0 34px", boxShadow: sombra }}>
      <div style={{ fontSize: 210, fontWeight: 800, letterSpacing: "-0.07em", lineHeight: 1, color: E.verde, textShadow: "0 10px 40px rgba(0,0,0,0.6)",
        filter: f < desde + 18 ? "blur(1.5px)" : undefined }}>+{n}</div>
      <div style={{ marginTop: 10, display: "inline-block", background: E.superficie, color: E.texto, fontSize: 40, fontWeight: 700, padding: "14px 30px",
        borderRadius: 999, boxShadow: sombra }}>marcas usam a Promptado</div>
    </div>
  );
};

const Botao: React.FC<{ desde: number; ate: number; clique?: number; y?: number }> = ({ desde, ate, clique, y = 300 }) => {
  const { f, p } = useFade(desde, ate);
  if (p <= 0) return null;
  const alvo = clique ?? desde + 20;
  const cursor = interpolate(f, [desde, alvo - 2], [160, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const apertado = f >= alvo && f < alvo + 4;
  const q = (s: React.CSSProperties) => <span style={{ position: "absolute", width: 16, height: 16, background: "#fff", border: `2px solid ${E.texto}`, ...s }} />;
  return (
    <div style={{ ...base, left: X, width: L, top: y, textAlign: "center", opacity: p }}>
      <span style={{ position: "relative", display: "inline-block", transform: `scale(${(0.85 + 0.15 * p) * (apertado ? 0.94 : 1)})` }}>
        <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 50, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
          padding: "30px 44px", borderRadius: 26, boxShadow: sombra }}>
          Falar com o<br />especialista →
        </span>
        <span style={{ position: "absolute", inset: -12, border: `2px solid ${E.texto}` }}>
          {q({ left: -9, top: -9 })}{q({ right: -9, top: -9 })}{q({ left: -9, bottom: -9 })}{q({ right: -9, bottom: -9 })}
        </span>
        {clique !== undefined ? (
          <svg viewBox="0 0 24 24" width={74} height={74} style={{ position: "absolute", right: -16 - cursor, bottom: -44 - cursor * 0.6 }}>
            <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="#FFFFFF" stroke="#000" strokeWidth={1.2} />
          </svg>
        ) : null}
      </span>
    </div>
  );
};

const Chamada: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => {
  const { p } = useFade(desde, ate);
  return p > 0 ? (
    <>
      <div style={{ ...base, left: X, width: L, top: 120, textAlign: "center", opacity: p }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 18, color: E.texto, fontSize: 60, fontWeight: 800, letterSpacing: "-0.04em",
          textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
          <LogoPromptado tamanho={76} cor={E.texto} /> Promptado
        </span>
      </div>
      <Botao desde={desde + 6} ate={ate} y={300} />
    </>
  ) : null;
};

const Selo: React.FC = () => (
  <div style={{ ...base, left: 70, top: 56 }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.55)", color: E.texto, fontSize: 28, fontWeight: 700,
      padding: "10px 22px", borderRadius: 999 }}>
      <LogoPromptado tamanho={30} cor={E.texto} /> Promptado
    </span>
  </div>
);

export const Video24: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const f = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const a = criaAncora(palavras);
  const blocos = blocosKaraoke(palavras, linha.duracaoQuadros);
  const fim = linha.duracaoQuadros + SEGURA_NO_FIM;
  const chamada = a("vem");
  // telas cheias: [de, até)
  const sistema: [number, number] = [a("olhar"), a("traçar")];
  const ranking: [number, number] = [a("como", 1, -0.2), a("aqui")];
  const emTela = [sistema, ranking].some(([de, ate]) => f >= de && f < ate);
  return (
    <FonteVideo.Provider value={FONTE_VIDEO}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[]} />
        )}
        <Selo />
        {/* gancho: convite */}
        <Convite desde={a("esse")} card={a("selecionado")} ate={sistema[0]} />
        {/* o sistema */}
        <TelaPrint n={5} desde={sistema[0]} ate={sistema[1]} rotulo="o sistema Promptado" largura={1660} origem="30% 20%" zoom={1.12} />
        <PlanoAcao desde={a("traçar")} ate={a("trajetória")} />
        <Print n={1} desde={a("trajetória")} ate={a("nós")} y={230} revela />
        <PalavraLado texto="pioneiros" desde={a("pioneiros")} ate={a("hoje")} y={210} pilula={["pioneiros no Brasil", a("brasil")]} />
        <Contador desde={a("200")} ate={a("posicionar")} />
        <Print n={4} desde={a("posicionar")} ate={a("se", 2, -0.3)} y={130} largura={640} destaque={a("respostas", 3)} />
        <Botao desde={a("se", 2, -0.3)} ate={a("nessa")} clique={a("clica")} />
        {/* os 3 indicadores em cascata */}
        <Print n={1} desde={a("mostrar")} ate={ranking[0]} y={95} largura={520} />
        <Print n={2} desde={a("tudo")} ate={ranking[0]} y={300} largura={520} />
        <Print n={3} desde={a("marca", 4)} ate={ranking[0]} y={505} largura={520} />
        {/* primeiro lugar */}
        <TelaPrint n={4} desde={ranking[0]} ate={ranking[1]} rotulo="ranking de visibilidade nas IAs" largura={1300} origem="50% 22%" zoom={1.22}
          carimbo={["1º LUGAR", a("primeiro")]} />
        <Print n={3} desde={a("aqui")} ate={a("exatamente", 2)} y={230} />
        <PalavraLado texto="autoridade" desde={a("autoridade")} ate={chamada} y={250} verde sublinhado={a("autoridade", 1, 0.4)} />
        <Chamada desde={chamada} ate={99999} />
        {/* clarões na entrada e na saída das telas cheias */}
        {[sistema[0], sistema[1], ranking[0], ranking[1]].map((q) => (f >= q - 4 && f < q + 6 ? <Clarao key={q} em={q} /> : null))}
        {/* legenda karaokê embaixo, no centro da tela (o componente é desenhado para 1080 de largura) */}
        <AbsoluteFill style={{ transform: "translateX(480px)" }}>
          <LegendaKaraoke blocos={blocos} centroY={940} escondida={emTela} />
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

// Thumbnail do YouTube (1280×720 e 1920×1080): você à esquerda; o ranking com o 1º em destaque e o texto à direita.
export const Thumb24: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONTE }}>
    <Img src={staticFile("video24/capa-fundo.png")} style={{ position: "absolute", left: "-12%", width: "100%", height: "100%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 36%, rgba(0,0,0,0) 60%)" }} />
    <div style={{ position: "absolute", right: "4%", top: "8%", width: "46%" }}>
      <div style={{ position: "relative", borderRadius: "1.6vh", overflow: "hidden", transform: "rotate(-3deg)", boxShadow: "0 3vh 6vh rgba(0,0,0,0.6)" }}>
        <Img src={staticFile("video24/plataforma-4.png")} style={{ display: "block", width: "100%" }} />
        <div style={{ position: "absolute", left: "1.3%", width: "96.5%", top: `${(90 / 423) * 100}%`, height: `${(58 / 423) * 100}%`,
          border: `0.7vh solid ${E.verde}`, borderRadius: "1vh" }} />
      </div>
      <div style={{ marginTop: "5vh", fontSize: "13vh", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95, color: "#FFFFFF", textTransform: "uppercase" }}>
        Sua marca em 1º
      </div>
      <div style={{ fontSize: "13vh", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.95, color: E.verde }}>nas IAs</div>
    </div>
  </AbsoluteFill>
);

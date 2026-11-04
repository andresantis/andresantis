import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo3 } from "./roteiro";

// Vídeo 3: mesma montagem dos vídeos 1 e 2, sem zoom, sem palavra atrás da cabeça (não há máscaras)
// e com a legenda sobre a faixa (fundo com a fita de LED forte).
const FONTE = { video: "editar/video3.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim

export const duracaoVideo3 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

const corteMaisProximo = (alvo: number) => {
  let t = 0;
  let melhor = 0;
  for (const [a, b] of trechos) {
    if (Math.abs(t - alvo) < Math.abs(melhor - alvo)) melhor = t;
    t += b - a;
  }
  return melhor;
};

export const Video3: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo3(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const linhas = montaLinhas(palavras, linha.duracaoQuadros, 21);
  const glitch = corteMaisProximo(r.inicioCapitulos);
  return (
    <FonteVideo.Provider value={FONTE}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[glitch]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[glitch]} />
        )}
        {ativos.filter((i) => !i.esconde).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
        <Legenda linhas={linhas} escondida={ativos.some((i) => i.esconde)} faixa />
        {ativos.filter((i) => i.esconde).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
        {modo === "previa" ? (
          <>
            <Sequence from={r.chamada - 12} durationInFrames={20}>
              <Audio src={staticFile("sons/subida.wav")} />
            </Sequence>
            <Sequence from={r.chamada}>
              <Audio src={staticFile("sons/musiquinha.wav")} />
            </Sequence>
          </>
        ) : null}
      </AbsoluteFill>
    </FonteVideo.Provider>
  );
};

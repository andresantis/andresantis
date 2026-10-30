import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, PalavraAtrasDaPessoa, QuadrosGlitch } from "../video1/Camera";
import { PalavraGrande } from "../video1/componentes";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo2 } from "./roteiro";

// Vídeo 2: mesma montagem do vídeo 1 (ver Video1.tsx), sem zoom nos cortes e com a legenda sobre uma faixa,
// porque o fundo atrás dela é misto (forro escuro e céu claro).
const FONTE = { video: "editar/video2.mp4", mascaras: "editar/mascaras-video2", mascarasInv: "editar/mascaras-inv-video2", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const POST_SOME_NO_ORIGINAL = 210; // quadro do original (7,0 s) em que o card do post gravado no vídeo some

export const duracaoVideo2 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

// Quadro do vídeo editado que corresponde a um quadro do original (ou o 1º quadro depois dele).
const noEditado = (quadroOriginal: number) => {
  let t = 0;
  for (const [a, b] of trechos) {
    if (quadroOriginal < b) return t + Math.max(0, quadroOriginal - a);
    t += b - a;
  }
  return t;
};

const corteMaisProximo = (alvo: number) => {
  let t = 0;
  let melhor = 0;
  for (const [a, b] of trechos) {
    if (Math.abs(t - alvo) < Math.abs(melhor - alvo)) melhor = t;
    t += b - a;
  }
  return melhor;
};

export const Video2: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const total = linha.duracaoQuadros;
  const fimDoPost = noEditado(POST_SOME_NO_ORIGINAL);
  const r = roteiroVideo2(palavras, fimDoPost);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const grande = r.itens.find((i) => i.grande && frame >= i.de && frame < i.ate);
  const linhas = montaLinhas(palavras, total, 21);
  const glitch = corteMaisProximo(r.inicioCapitulos);
  return (
    <FonteVideo.Provider value={FONTE}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera
            trechos={trechos}
            volume={1}
            glitch={[glitch]}
            palavraAtiva={(f) => r.itens.some((i) => i.grande && f >= i.de && f < i.ate)}
            palavra={grande?.grande ? <PalavraGrande desde={grande.de} {...grande.grande} /> : null}
          />
        ) : (
          <>
            {grande?.grande ? (
              <PalavraAtrasDaPessoa trechos={trechos}>
                <PalavraGrande desde={grande.de} {...grande.grande} />
              </PalavraAtrasDaPessoa>
            ) : null}
            <QuadrosGlitch trechos={trechos} glitch={[glitch]} />
          </>
        )}
        {ativos.filter((i) => !i.esconde).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
        <Legenda linhas={linhas} escondida={ativos.some((i) => i.esconde)} faixa aDireita={(f) => f < fimDoPost} />
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

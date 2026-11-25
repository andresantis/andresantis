import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, PalavraAtrasDaPessoa, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo, PalavraGrande } from "../video1/componentes";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo23 } from "./roteiro";

// Vídeo 23: estilo A (legenda pequena no topo, palavra grande e cards ATRÁS da cabeça, telas cheias), sem zoom.
const FONTE = { video: "editar/video23.mp4", mascaras: "editar/mascaras-video23", mascarasInv: "editar/mascaras-inv-video23", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo23 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

export const Video23: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo23(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  // O que vai atrás da pessoa: a palavra grande e os cards marcados com "atras".
  const atras = ativos.filter((i) => i.grande || i.atras);
  const temAtras = (f: number) => r.itens.some((i) => (i.grande || i.atras) && f >= i.de && f < i.ate);
  const elAtras = atras.length ? (
    <Eixo.Provider value={EIXO}>
      <NoEixo>
        {atras.map((i, k) => (
          <AbsoluteFill key={k}>{i.grande ? <PalavraGrande desde={i.de} {...i.grande} /> : i.el}</AbsoluteFill>
        ))}
      </NoEixo>
    </Eixo.Provider>
  ) : null;
  const linhas = montaLinhas(palavras, linha.duracaoQuadros, 21);
  return (
    <FonteVideo.Provider value={FONTE}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={temAtras} palavra={elAtras} />
        ) : (
          <>
            {elAtras ? <PalavraAtrasDaPessoa trechos={trechos}>{elAtras}</PalavraAtrasDaPessoa> : null}
            <QuadrosGlitch trechos={trechos} glitch={[]} />
          </>
        )}
        <Eixo.Provider value={EIXO}>
          <NoEixo>
            {ativos.filter((i) => !i.esconde && !i.atras && !i.grande).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
            <Legenda linhas={linhas} escondida={ativos.some((i) => i.esconde)} faixa />
          </NoEixo>
          {ativos.filter((i) => i.esconde).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
        </Eixo.Provider>
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

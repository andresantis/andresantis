import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { LegendaUmaPalavra } from "./componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo7, VERDES_VIDEO7 } from "./roteiro";

// Vídeo 7: estilo B (legenda de 1 palavra no meio, selo "acompanhamento de perto", listas e clarões), sem zoom.
const FONTE = { video: "editar/video7.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo7 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

export const Video7: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo7(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  return (
    <FonteVideo.Provider value={FONTE}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[]} />
        )}
        <Eixo.Provider value={EIXO}>
          <NoEixo>
            {ativos.filter((i) => !i.esconde).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
            <LegendaUmaPalavra palavras={palavras} verdes={VERDES_VIDEO7} y={1000} escondida={ativos.some((i) => i.esconde)} />
          </NoEixo>
          {/* telas cheias e clarões cobrem a tela inteira, fora do eixo centralizado */}
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

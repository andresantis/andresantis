import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { LegendaUmaPalavra } from "../video7/componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo22, VERDES_VIDEO22 } from "./roteiro";

// Vídeo 22: estilo B (legenda de 1 palavra sobre a camiseta, selo, pílulas no teto do carro, lista e clarões), sem zoom.
const FONTE = { video: "editar/video22.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo22 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

export const Video22: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo22(palavras);
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
            <LegendaUmaPalavra palavras={palavras} verdes={VERDES_VIDEO22} y={1350} escondida={ativos.some((i) => i.esconde)} />
          </NoEixo>
          {/* telas cheias e clarões cobrem a tela inteira, fora do eixo centralizado */}
          {ativos.filter((i) => i.esconde).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
        </Eixo.Provider>
        {modo === "previa" ? (
          <>
            <Sequence from={r.chamada}>
              <Audio src={staticFile("sons/musiquinha.wav")} />
            </Sequence>
          </>
        ) : null}
      </AbsoluteFill>
    </FonteVideo.Provider>
  );
};

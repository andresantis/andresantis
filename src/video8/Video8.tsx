import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { blocosKaraoke, LegendaKaraoke } from "../video6/componentes";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { TelaCalculo } from "./componentes";
import { roteiroVideo8 } from "./roteiro";

// Vídeo 8: estilo C (legenda karaokê embaixo, pílulas no topo) com a tela do cálculo no estilo B; sem zoom.
const FONTE = { video: "editar/video8.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo8 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

const ehTelaCheia = (i: { el?: React.ReactNode }) => (i.el as { type?: unknown } | undefined)?.type === TelaCalculo;

export const Video8: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo8(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const blocos = blocosKaraoke(palavras, linha.duracaoQuadros);
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
            {ativos.filter((i) => !i.esconde || !ehTelaCheia(i)).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
            <LegendaKaraoke blocos={blocos} escondida={ativos.some((i) => i.esconde)} />
          </NoEixo>
          {/* a tela do cálculo cobre a tela inteira, fora do eixo centralizado */}
          {ativos.filter(ehTelaCheia).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
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

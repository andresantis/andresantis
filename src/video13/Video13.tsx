import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, PalavraAtrasDaPessoa, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo, PalavraGrande } from "../video1/componentes";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo13 } from "./roteiro";

// Vídeo 13: estilo A (legenda pequena no topo, palavra grande atrás da cabeça, cards sobre a camiseta), sem zoom,
// com as telas do vídeo de lançamento da OpenAI (video14) por cima da fala na abertura.
const FONTE = { video: "editar/video13.mp4", mascaras: "editar/mascaras-video13", mascarasInv: "editar/mascaras-inv-video13", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
// Textos e elementos centralizados na tela (pedido do André), 7% menores para não entrar na faixa da direita.
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo13 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

const trechos = linha.trechos as [number, number][];

export const Video13: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo13(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const grande = r.itens.find((i) => i.grande && frame >= i.de && frame < i.ate);
  const linhas = montaLinhas(palavras, linha.duracaoQuadros, 21);
  return (
    <FonteVideo.Provider value={FONTE}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera
            trechos={trechos}
            volume={1}
            glitch={[]}
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
            <QuadrosGlitch trechos={trechos} glitch={[]} />
          </>
        )}
        <Eixo.Provider value={EIXO}>
          <NoEixo>
            {ativos.filter((i) => !i.esconde).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
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

import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo4 } from "./roteiro";

// Vídeo 4: mesma montagem do vídeo 3 (mesma gravação até 49,5 s, final novo), sem zoom, sem palavra atrás da cabeça (não há máscaras)
// e com a legenda sobre a faixa (fundo com a fita de LED forte).
const FONTE = { video: "editar/video4.mp4", mascaras: "", mascarasInv: "", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
// Textos e elementos centralizados na tela (pedido do André), 7% menores para não entrar na faixa da direita.
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo4 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

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

export const Video4: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo4(palavras);
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

import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, PalavraAtrasDaPessoa, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo, PalavraGrande } from "../video1/componentes";
import { Legenda, montaLinhas } from "../video1/Legenda";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import legendas from "./legendas-completa.json";
import linha from "./linha-completa.json";
import { roteiroVideo5 } from "./roteiro";

// Vídeo 5: mesma montagem dos vídeos 3 e 4 (sem zoom, textos centralizados), com a palavra grande atrás da cabeça (máscaras)
// e com a legenda sobre a faixa (o teto do carro é claro).
const FONTE = { video: "editar/video5.mp4", mascaras: "editar/mascaras-video5", mascarasInv: "editar/mascaras-inv-video5", zoom: false };
const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
// Textos e elementos centralizados na tela (pedido do André), 7% menores para não entrar na faixa da direita.
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoVideo5 = () => linha.duracaoQuadros + SEGURA_NO_FIM;

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

export const Video5: React.FC<{ modo?: Modo }> = ({ modo = "previa" }) => {
  const frame = useCurrentFrame();
  const palavras = legendas as Palavra[];
  const r = roteiroVideo5(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const grande = r.itens.find((i) => i.grande && frame >= i.de && frame < i.ate);
  const linhas = montaLinhas(palavras, linha.duracaoQuadros, 21);
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

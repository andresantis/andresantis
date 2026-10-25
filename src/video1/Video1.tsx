import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, PalavraAtrasDaPessoa, QuadrosGlitch } from "./Camera";
import { LogoFinal, PalavraGrande } from "./componentes";
import { Legenda, montaLinhas } from "./Legenda";
import { Roteiro, roteiroCompleta, roteiroCurta } from "./roteiros";
import { Palavra } from "./tempo";
import legendasCurta from "./legendas-curta.json";
import legendasCompleta from "./legendas-completa.json";
import linhaCurta from "./linha-curta.json";
import linhaCompleta from "./linha-completa.json";

export type Versao = "curta" | "completa";
// "previa": tudo junto (para revisar no Studio). "camadas": só legendas e ilustrações, com fundo transparente;
// o vídeo original é cortado e colado por baixo pelo ffmpeg (edicao/scripts/exporta.py), sem mudar a cor.
export type Modo = "previa" | "camadas";

const SEGURA_NO_FIM = 15; // 0,5 s parado no fim

const dados = {
  curta: { palavras: legendasCurta as Palavra[], linha: linhaCurta, roteiro: roteiroCurta },
  completa: { palavras: legendasCompleta as Palavra[], linha: linhaCompleta, roteiro: roteiroCompleta },
};

export const duracaoVideo1 = (v: Versao) => dados[v].linha.duracaoQuadros + SEGURA_NO_FIM;

// O quadro de "glitch" vai no corte mais próximo do início do 1º capítulo.
const corteMaisProximo = (trechos: number[][], alvo: number) => {
  let t = 0;
  let melhor = 0;
  for (const [a, b] of trechos) {
    if (Math.abs(t - alvo) < Math.abs(melhor - alvo)) melhor = t;
    t += b - a;
  }
  return melhor;
};

export const Video1: React.FC<{ versao: Versao; modo?: Modo }> = ({ versao, modo = "previa" }) => {
  const frame = useCurrentFrame();
  const { palavras, linha, roteiro } = dados[versao];
  const total = linha.duracaoQuadros;
  const r: Roteiro = roteiro(palavras);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const grande = r.itens.find((i) => i.grande && frame >= i.de && frame < i.ate);
  const linhas = montaLinhas(palavras, total);
  const trechos = linha.trechos as [number, number][];
  const glitch = corteMaisProximo(trechos, r.inicioCapitulos);
  return (
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
      <Legenda linhas={linhas} escondida={ativos.some((i) => i.esconde)} />
      {ativos.filter((i) => i.esconde).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
      {versao === "completa" && frame >= total - 20 ? <LogoFinal desde={total - 20} /> : null}
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
  );
};

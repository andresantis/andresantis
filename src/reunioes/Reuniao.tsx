import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { LegendaUmaPalavra } from "../video7/componentes";
import l18 from "./legendas-video18.json";
import l19 from "./legendas-video19.json";
import l20 from "./legendas-video20.json";
import t18 from "./linha-video18.json";
import t19 from "./linha-video19.json";
import t20 from "./linha-video20.json";
import { roteiroReuniao } from "./roteiros";

// Vídeos 18 a 20 (reuniões com o time): estilo B, sem zoom.
type Linha = { trechos: number[][]; duracaoQuadros: number };
export const REUNIOES: Record<string, { legendas: Palavra[]; linha: Linha; yLegenda: number }> = {
  video18: { legendas: l18 as Palavra[], linha: t18, yLegenda: 1300 },
  video19: { legendas: l19 as Palavra[], linha: t19, yLegenda: 1250 },
  video20: { legendas: l20 as Palavra[], linha: t20, yLegenda: 1250 },
};

const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };

export const duracaoReuniao = (id: string) => REUNIOES[id].linha.duracaoQuadros + SEGURA_NO_FIM;

export const Reuniao: React.FC<{ id: string; modo?: Modo }> = ({ id, modo = "previa" }) => {
  const frame = useCurrentFrame();
  const c = REUNIOES[id];
  const trechos = c.linha.trechos as [number, number][];
  const r = roteiroReuniao(id, c.legendas);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const fonte = { video: `editar/${id}.mp4`, mascaras: "", mascarasInv: "", zoom: false };
  return (
    <FonteVideo.Provider value={fonte}>
      <AbsoluteFill style={{ backgroundColor: modo === "previa" ? "#000" : undefined }}>
        {modo === "previa" ? (
          <Camera trechos={trechos} volume={1} glitch={[]} palavraAtiva={() => false} palavra={null} />
        ) : (
          <QuadrosGlitch trechos={trechos} glitch={[]} />
        )}
        <Eixo.Provider value={EIXO}>
          <NoEixo>
            {ativos.filter((i) => !i.esconde).map((i, k) => <AbsoluteFill key={k}>{i.el}</AbsoluteFill>)}
            <LegendaUmaPalavra palavras={c.legendas} verdes={r.verdes} y={c.yLegenda} escondida={ativos.some((i) => i.esconde)} />
          </NoEixo>
          {ativos.filter((i) => i.esconde).map((i, k) => <AbsoluteFill key={`t${k}`}>{i.el}</AbsoluteFill>)}
        </Eixo.Provider>
        {modo === "previa" ? (
          <>
            <Sequence from={Math.max(0, r.chamada - 12)} durationInFrames={20}>
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

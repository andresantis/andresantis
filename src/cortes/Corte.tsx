import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, FonteVideo, QuadrosGlitch } from "../video1/Camera";
import { Eixo, NoEixo } from "../video1/componentes";
import { Palavra } from "../video1/tempo";
import { Modo } from "../video1/Video1";
import { LegendaUmaPalavra } from "../video7/componentes";
import l1 from "./legendas-corte1.json";
import l2 from "./legendas-corte2.json";
import l3 from "./legendas-corte3.json";
import l4 from "./legendas-corte4.json";
import l5 from "./legendas-corte5.json";
import l6 from "./legendas-corte6.json";
import l7 from "./legendas-corte7.json";
import l8 from "./legendas-corte8.json";
import t1 from "./linha-corte1.json";
import t2 from "./linha-corte2.json";
import t3 from "./linha-corte3.json";
import t4 from "./linha-corte4.json";
import t5 from "./linha-corte5.json";
import t6 from "./linha-corte6.json";
import t7 from "./linha-corte7.json";
import t8 from "./linha-corte8.json";
import { roteiroCorte } from "./roteiros";

// Cortes 1 a 8 dos vídeos de bastidores (10, 11 e 12): estilo B, sem zoom.
type Linha = { trechos: number[][]; duracaoQuadros: number };
export const CORTES: Record<string, { video: string; legendas: Palavra[]; linha: Linha }> = {
  corte1: { video: "video11", legendas: l1 as Palavra[], linha: t1 },
  corte2: { video: "video11", legendas: l2 as Palavra[], linha: t2 },
  corte3: { video: "video11", legendas: l3 as Palavra[], linha: t3 },
  corte4: { video: "video11", legendas: l4 as Palavra[], linha: t4 },
  corte5: { video: "video10", legendas: l5 as Palavra[], linha: t5 },
  corte6: { video: "video12", legendas: l6 as Palavra[], linha: t6 },
  corte7: { video: "video12", legendas: l7 as Palavra[], linha: t7 },
  corte8: { video: "video12", legendas: l8 as Palavra[], linha: t8 },
};

const SEGURA_NO_FIM = 15; // 0,5 s parado no fim
const EIXO = { dx: 60, escala: 0.93 };
const Y_LEGENDA = 1300;

export const duracaoCorte = (id: string) => CORTES[id].linha.duracaoQuadros + SEGURA_NO_FIM;

export const Corte: React.FC<{ id: string; modo?: Modo }> = ({ id, modo = "previa" }) => {
  const frame = useCurrentFrame();
  const c = CORTES[id];
  const trechos = c.linha.trechos as [number, number][];
  const r = roteiroCorte(id, c.legendas);
  const ativos = r.itens.filter((i) => frame >= i.de && frame < i.ate);
  const fonte = { video: `editar/${c.video}.mp4`, mascaras: "", mascarasInv: "", zoom: false };
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
            <LegendaUmaPalavra palavras={c.legendas} verdes={r.verdes} y={Y_LEGENDA} escondida={ativos.some((i) => i.esconde)} />
          </NoEixo>
          {/* telas cheias e clarões cobrem a tela inteira, fora do eixo centralizado */}
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

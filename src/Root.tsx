import { Composition } from "remotion";
import { FORMATO_VERTICAL } from "./formato";
import { Teste } from "./Teste";
import { duracaoVideo1, Video1 } from "./video1/Video1";
import { duracaoVideo2, Video2 } from "./video2/Video2";
import { duracaoVideo3, Video3 } from "./video3/Video3";
import { duracaoVideo4, Video4 } from "./video4/Video4";
import { duracaoVideo5, Video5 } from "./video5/Video5";
import { duracaoVideo6, Video6 } from "./video6/Video6";
import { duracaoVideo7, Video7 } from "./video7/Video7";
import { Capa7 } from "./video7/Capa";
import { duracaoVideo8, Video8 } from "./video8/Video8";
import { Capa8 } from "./video8/Capa";
import { Corte, duracaoCorte } from "./cortes/Corte";
import { CapaCorte } from "./cortes/Capa";

const IDS_CORTES = ["corte1", "corte2", "corte3", "corte4", "corte5", "corte6", "corte7", "corte8"];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teste"
        component={Teste}
        durationInFrames={5 * FORMATO_VERTICAL.fps}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video1-Curta"
        component={Video1}
        durationInFrames={duracaoVideo1("curta")}
        defaultProps={{ versao: "curta" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video1-Completa"
        component={Video1}
        durationInFrames={duracaoVideo1("completa")}
        defaultProps={{ versao: "completa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video2"
        component={Video2}
        durationInFrames={duracaoVideo2()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video3"
        component={Video3}
        durationInFrames={duracaoVideo3()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video4"
        component={Video4}
        durationInFrames={duracaoVideo4()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video5"
        component={Video5}
        durationInFrames={duracaoVideo5()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video6"
        component={Video6}
        durationInFrames={duracaoVideo6()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition
        id="Video7"
        component={Video7}
        durationInFrames={duracaoVideo7()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa7" component={Capa7} durationInFrames={1} {...FORMATO_VERTICAL} />
      <Composition
        id="Video8"
        component={Video8}
        durationInFrames={duracaoVideo8()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa8" component={Capa8} durationInFrames={1} {...FORMATO_VERTICAL} />
      {IDS_CORTES.map((id, i) => (
        <Composition key={id} id={`Corte${i + 1}`} component={Corte} durationInFrames={duracaoCorte(id)}
          defaultProps={{ id, modo: "previa" as const }} {...FORMATO_VERTICAL} />
      ))}
      {IDS_CORTES.map((id, i) => (
        <Composition key={`c${id}`} id={`Capa-Corte${i + 1}`} component={CapaCorte} durationInFrames={1}
          defaultProps={{ id, thumb: false }} {...FORMATO_VERTICAL} />
      ))}
      {IDS_CORTES.map((id, i) => (
        <Composition key={`t${id}`} id={`Thumb-Corte${i + 1}`} component={CapaCorte} durationInFrames={1}
          defaultProps={{ id, thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      ))}
    </>
  );
};

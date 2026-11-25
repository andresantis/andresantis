import { Composition } from "remotion";
import { FORMATO_HORIZONTAL, FORMATO_VERTICAL } from "./formato";
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
import { duracaoVideo13, Video13 } from "./video13/Video13";
import { Capa13 } from "./video13/Capa";
import { duracaoVideo15, Video15 } from "./video15/Video15";
import { Capa15 } from "./video15/Capa";
import { duracaoVideo16, Video16 } from "./video16/Video16";
import { Capa16 } from "./video16/Capa";
import { duracaoVideo17, Video17 } from "./video17/Video17";
import { Capa17 } from "./video17/Capa";
import { duracaoVideo22, Video22 } from "./video22/Video22";
import { Capa22 } from "./video22/Capa";
import { duracaoVideo23, Video23 } from "./video23/Video23";
import { Capa23 } from "./video23/Capa";
import { duracaoReuniao, Reuniao } from "./reunioes/Reuniao";
import { CapaReuniao } from "./reunioes/Capa";
import { duracaoVideo21, Thumb21, Video21 } from "./video21/Video21";
import { duracaoVideo24, Thumb24, Video24 } from "./video24/Video24";

const IDS_REUNIOES = ["video18", "video19", "video20"];
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
      <Composition
        id="Video13"
        component={Video13}
        durationInFrames={duracaoVideo13()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa13" component={Capa13} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition
        id="Video15"
        component={Video15}
        durationInFrames={duracaoVideo15()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa15" component={Capa15} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition id="Thumb15" component={Capa15} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      <Composition
        id="Video16"
        component={Video16}
        durationInFrames={duracaoVideo16()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa16" component={Capa16} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition id="Thumb16" component={Capa16} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      <Composition
        id="Video17"
        component={Video17}
        durationInFrames={duracaoVideo17()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa17" component={Capa17} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition id="Thumb17" component={Capa17} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      <Composition
        id="Video22"
        component={Video22}
        durationInFrames={duracaoVideo22()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa22" component={Capa22} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition id="Thumb22" component={Capa22} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      <Composition
        id="Video23"
        component={Video23}
        durationInFrames={duracaoVideo23()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_VERTICAL}
      />
      <Composition id="Capa23" component={Capa23} durationInFrames={1} defaultProps={{ thumb: false }} {...FORMATO_VERTICAL} />
      <Composition id="Thumb23" component={Capa23} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      {IDS_REUNIOES.map((id) => (
        <Composition key={id} id={`Video${id.slice(5)}`} component={Reuniao} durationInFrames={duracaoReuniao(id)}
          defaultProps={{ id, modo: "previa" as const }} {...FORMATO_VERTICAL} />
      ))}
      {IDS_REUNIOES.map((id) => (
        <Composition key={`c${id}`} id={`Capa${id.slice(5)}`} component={CapaReuniao} durationInFrames={1}
          defaultProps={{ id, thumb: false }} {...FORMATO_VERTICAL} />
      ))}
      {IDS_REUNIOES.map((id) => (
        <Composition key={`t${id}`} id={`Thumb${id.slice(5)}`} component={CapaReuniao} durationInFrames={1}
          defaultProps={{ id, thumb: true }} {...FORMATO_VERTICAL} height={1350} />
      ))}
      <Composition
        id="Video21"
        component={Video21}
        durationInFrames={duracaoVideo21()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_HORIZONTAL}
      />
      <Composition id="Thumb21" component={Thumb21} durationInFrames={1} {...FORMATO_HORIZONTAL} width={1280} height={720} />
      <Composition id="Thumb21-HD" component={Thumb21} durationInFrames={1} {...FORMATO_HORIZONTAL} />
      <Composition
        id="Video24"
        component={Video24}
        durationInFrames={duracaoVideo24()}
        defaultProps={{ modo: "previa" as const }}
        {...FORMATO_HORIZONTAL}
      />
      <Composition id="Thumb24" component={Thumb24} durationInFrames={1} {...FORMATO_HORIZONTAL} width={1280} height={720} />
      <Composition id="Thumb24-HD" component={Thumb24} durationInFrames={1} {...FORMATO_HORIZONTAL} />
      <Composition id="Thumb13" component={Capa13} durationInFrames={1} defaultProps={{ thumb: true }} {...FORMATO_VERTICAL} height={1350} />
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

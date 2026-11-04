import { Composition } from "remotion";
import { FORMATO_VERTICAL } from "./formato";
import { Teste } from "./Teste";
import { duracaoVideo1, Video1 } from "./video1/Video1";
import { duracaoVideo2, Video2 } from "./video2/Video2";
import { duracaoVideo3, Video3 } from "./video3/Video3";
import { duracaoVideo4, Video4 } from "./video4/Video4";
import { duracaoVideo5, Video5 } from "./video5/Video5";

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
    </>
  );
};

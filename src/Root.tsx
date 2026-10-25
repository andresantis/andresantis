import { Composition } from "remotion";
import { FORMATO_VERTICAL } from "./formato";
import { Teste } from "./Teste";
import { duracaoVideo1, Video1 } from "./video1/Video1";

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
    </>
  );
};

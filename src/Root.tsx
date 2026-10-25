import { Composition } from "remotion";
import { FORMATO_VERTICAL } from "./formato";
import { Teste } from "./Teste";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teste"
        component={Teste}
        durationInFrames={5 * FORMATO_VERTICAL.fps}
        {...FORMATO_VERTICAL}
      />
    </>
  );
};

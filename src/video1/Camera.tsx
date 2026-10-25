import { useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  OffthreadVideo,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";

// O vídeo original entra sem filtro, LUT ou correção: só cortes e zoom (escala).
const VIDEO = staticFile("editar/video1.mp4");
const ZOOM_FECHADO = 1.1;
const ORIGEM_ZOOM = "480px 760px"; // perto do rosto

type Trecho = [number, number]; // [quadro inicial, quadro final) no original

export const zoomDo = (i: number) => (i % 2 ? ZOOM_FECHADO : 1);

const Quadro: React.FC<{
  inicio: number;
  fim: number;
  zoom: number;
  mudo?: boolean;
  volume?: number;
  estilo?: React.CSSProperties;
}> = ({ inicio, fim, zoom, mudo, volume, estilo }) => (
  <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ORIGEM_ZOOM, ...estilo }}>
    <OffthreadVideo
      src={VIDEO}
      startFrom={inicio}
      endAt={fim}
      muted={mudo}
      volume={volume}
      toneMapped={false}
      style={{ width: "100%", height: "100%" }}
    />
  </AbsoluteFill>
);

// Camada só com a pessoa: o MESMO quadro do vídeo, recortado pela máscara (os pixels não mudam).
const Pessoa: React.FC<{ trecho: Trecho; zoom: number }> = ({ trecho, zoom }) => {
  const frame = useCurrentFrame();
  const quadroOriginal = trecho[0] + frame;
  const url = staticFile(`editar/mascaras/${String(quadroOriginal).padStart(5, "0")}.png`);
  return <PessoaComMascara key={url} url={url} trecho={trecho} zoom={zoom} />;
};

const PessoaComMascara: React.FC<{ url: string; trecho: Trecho; zoom: number }> = ({
  url,
  trecho,
  zoom,
}) => {
  const [pronto] = useState(() => {
    const h = delayRender(`máscara ${url}`);
    const img = new Image();
    img.onload = () => continueRender(h);
    img.onerror = () => continueRender(h);
    img.src = url;
    return h;
  });
  void pronto;
  const mascara: React.CSSProperties = {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskMode: "luminance",
  };
  return <Quadro inicio={trecho[0]} fim={trecho[1]} zoom={zoom} mudo estilo={mascara} />;
};

// 1 quadro de "glitch": a faixa de cima da imagem repetida 4 vezes (estilo.md, seção 3).
const Glitch: React.FC<{ trecho: Trecho }> = ({ trecho }) => (
  <AbsoluteFill>
    {[0, 1, 2, 3].map((k) => (
      <div key={k} style={{ position: "absolute", top: k * 480, left: 0, width: 1080, height: 480, overflow: "hidden" }}>
        <OffthreadVideo src={VIDEO} startFrom={trecho[0]} endAt={trecho[1]} muted toneMapped={false}
          style={{ width: 1080, height: 1920, transform: "translateY(-320px)" }} />
      </div>
    ))}
  </AbsoluteFill>
);

export const Camera: React.FC<{
  trechos: Trecho[];
  volume: number;
  palavraAtiva: (f: number) => boolean;
  palavra: React.ReactNode;
  glitch: number[];
}> = ({ trechos, volume, palavraAtiva, palavra, glitch }) => {
  const frame = useCurrentFrame();
  let ini = 0;
  const inicios = trechos.map(([a, b]) => {
    const s = ini;
    ini += b - a;
    return s;
  });
  const i = Math.max(0, inicios.findIndex((s, k) => frame >= s && frame < s + trechos[k][1] - trechos[k][0]));
  const trechoAtual = trechos[i];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {trechos.map(([a, b], k) => (
          <Series.Sequence key={k} durationInFrames={b - a}>
            <Quadro inicio={a} fim={b} zoom={zoomDo(k)} volume={volume} />
          </Series.Sequence>
        ))}
      </Series>
      {palavraAtiva(frame) && trechoAtual ? (
        <>
          {palavra}
          <AbsoluteFill>
            <Series>
              {trechos.map(([a, b], k) => (
                <Series.Sequence key={k} durationInFrames={b - a}>
                  {k === i ? <Pessoa trecho={[a, b]} zoom={zoomDo(k)} /> : null}
                </Series.Sequence>
              ))}
            </Series>
          </AbsoluteFill>
        </>
      ) : null}
      <QuadrosGlitch trechos={trechos} glitch={glitch} />
    </AbsoluteFill>
  );
};

// Onde cada quadro do vídeo editado está no original (trecho, quadro original e zoom).
export const posicaoNoOriginal = (trechos: Trecho[], frame: number) => {
  let ini = 0;
  for (let k = 0; k < trechos.length; k++) {
    const [a, b] = trechos[k];
    if (frame < ini + b - a) return { k, quadro: a + frame - ini, zoom: zoomDo(k) };
    ini += b - a;
  }
  return null;
};

export const QuadrosGlitch: React.FC<{ trechos: Trecho[]; glitch: number[] }> = ({ trechos, glitch }) => (
  <>
    {glitch.map((g) => {
      const pos = posicaoNoOriginal(trechos, g);
      return pos ? (
        <Sequence key={g} from={g} durationInFrames={1}>
          <Glitch trecho={[pos.quadro, pos.quadro + 1]} />
        </Sequence>
      ) : null;
    })}
  </>
);

// Modo "camadas": a palavra grande recortada onde a pessoa está (máscara invertida, com o mesmo zoom do trecho).
export const PalavraAtrasDaPessoa: React.FC<{ trechos: Trecho[]; children: React.ReactNode }> = ({ trechos, children }) => {
  const frame = useCurrentFrame();
  const pos = posicaoNoOriginal(trechos, frame);
  if (!pos) return <>{children}</>;
  const url = staticFile(`editar/mascaras-inv/${String(pos.quadro).padStart(5, "0")}.png`);
  return <MascaraInvertida key={url} url={url} zoom={pos.zoom}>{children}</MascaraInvertida>;
};

const MascaraInvertida: React.FC<{ url: string; zoom: number; children: React.ReactNode }> = ({ url, zoom, children }) => {
  useState(() => {
    const h = delayRender(`máscara ${url}`);
    const img = new Image();
    img.onload = () => continueRender(h);
    img.onerror = () => continueRender(h);
    img.src = url;
    return h;
  });
  const [ox, oy] = [480, 760];
  const mascara: React.CSSProperties = {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: `${1080 * zoom}px ${1920 * zoom}px`,
    WebkitMaskSize: `${1080 * zoom}px ${1920 * zoom}px`,
    maskPosition: `${ox - ox * zoom}px ${oy - oy * zoom}px`,
    WebkitMaskPosition: `${ox - ox * zoom}px ${oy - oy * zoom}px`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
  return <AbsoluteFill style={mascara}>{children}</AbsoluteFill>;
};

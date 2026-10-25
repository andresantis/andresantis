import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A palavra "salta" para dentro da tela com efeito de mola.
  const entrada = spring({ frame, fps, config: { damping: 12 } });
  const escala = interpolate(entrada, [0, 1], [0.3, 1]);
  const subida = interpolate(entrada, [0, 1], [300, 0]);
  const opacidade = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Arial Black, Arial, sans-serif",
          fontWeight: 900,
          fontSize: 140,
          color: "white",
          letterSpacing: 4,
          opacity: opacidade,
          transform: `translateY(${subida}px) scale(${escala})`,
          textShadow: "0 12px 40px rgba(0,0,0,0.4)",
        }}
      >
        FUNCIONOU
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { chega, cresce, Selo } from "../video1/componentes";

// Ilustrações do vídeo 8 (plano em edicao/video8/plano.md): tela do cálculo no estilo B
// (fundo escuro com brilho, lista que se monta) e o comparativo com a Promptado.
const E = CORES.dark;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };

export const TelaCalculo: React.FC<{
  desde: number;
  itens: [string, number][];
  total: number; // quadro em que aparece "= R$ 500 mil / ano"
  vira: number; // quadro em que vira o comparativo
  risco: number;
  preco: number;
}> = ({ desde, itens, total, vira, risco, preco }) => {
  const f = useCurrentFrame();
  const fundo = "radial-gradient(circle at 50% 50%, #12261A 0%, #000 62%)";
  if (f < vira) {
    return (
      <AbsoluteFill style={{ background: fundo }}>
        <div style={{ ...base, left: 110, width: 780, top: 640 }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: chega(f, desde), textTransform: "uppercase", marginBottom: 30 }}>
            <span style={{ color: E.verde }}>•</span> o cálculo · se você fosse contratar
          </div>
          {itens.map(([t, q], i) => (f >= q ? (
            <div key={t} style={{ fontSize: 66, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, textTransform: "uppercase",
              color: chega(f, q), whiteSpace: "nowrap" }}>
              <span style={{ color: E.verde }}>{i + 1}.</span> {t}
            </div>
          ) : null))}
          {f >= total ? (
            <div style={{ marginTop: 34, fontSize: 96, fontWeight: 800, letterSpacing: "-0.05em", color: E.texto,
              transform: `scale(${0.85 + 0.15 * cresce(f, total, 4)})`, transformOrigin: "left center" }}>
              = R$ 500 MIL <span style={{ fontSize: 54, color: E.textoApoio }}>/ ano</span>
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: fundo }}>
      <div style={{ ...base, left: 60, width: 840, top: 700, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", fontSize: 92, fontWeight: 800, letterSpacing: "-0.05em", color: E.textoApoio }}>
          R$ 500 mil <span style={{ fontSize: 50 }}>/ ano</span>
          {f >= risco ? (
            <span style={{ position: "absolute", left: -20, top: "50%", height: 16, borderRadius: 8, background: E.verde,
              width: `calc((100% + 40px) * ${cresce(f, risco, 6)})`, transform: "rotate(-5deg)", transformOrigin: "left center" }} />
          ) : null}
        </div>
        <div style={{ marginTop: 60, opacity: cresce(f, preco, 5), transform: `translateY(${(1 - cresce(f, preco, 5)) * 30}px)` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, fontSize: 56, fontWeight: 700, color: E.texto, letterSpacing: "-0.03em" }}>
            <LogoPromptado tamanho={64} cor={E.texto} /> Promptado
          </div>
          <div style={{ marginTop: 18, fontSize: 40, fontWeight: 600, color: E.textoApoio }}>a partir de</div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1, color: E.verdeTexto }}>
            R$ 399 <span style={{ fontSize: 60, color: E.texto }}>/ mês</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Legenda curta sob a foto dos fundadores.
export const RotuloFoto: React.FC<{ desde: number; ate: number; y: number }> = ({ desde, ate, y }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde + 4, 5) * (1 - cresce(f, ate - 5, 5));
  return (
    <div style={{ ...base, left: 60, width: 840, top: y, textAlign: "center", opacity: p }}>
      <Selo texto="André & Luís · fundadores" style={{ fontSize: 34, padding: "10px 24px" }} />
    </div>
  );
};

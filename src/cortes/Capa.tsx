import { AbsoluteFill, Img, staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Capa do Reels (1080×1920) e thumbnail (1080×1350) de cada corte. O fundo é um quadro do próprio corte,
// sem mudança de cor; o degradê escuro fica só atrás do texto. Na capa, o texto fica dentro da faixa
// 1080×1350 do centro (y 285–1635), que é o que a grade do perfil mostra.
const E = CORES.dark;

// Título: trechos [texto, verde?]
export const TITULOS: Record<string, [string, boolean?][]> = {
  corte1: [["19 vídeos", true], [" prontos e nenhum postado"]],
  corte2: [["O horário que eu "], ["nunca", true], [" uso para postar"]],
  corte3: [["A "], ["IA", true], [" montou uma loja pra mim"]],
  corte4: [["48", true], [" clientes quase perdidos"]],
  corte5: [["O que fazemos quando um cliente quer "], ["cancelar", true]],
  corte6: [["Nossa "], ["Black Friday", true], [" em 2 campanhas"]],
  corte7: [["Isso que é time "], ["engajado", true]],
  corte8: [["Bastidores: antes do "], ["webinar", true]],
};

export const CapaCorte: React.FC<{ id: string; thumb?: boolean }> = ({ id, thumb }) => {
  const desloc = thumb ? -285 : 0; // a thumbnail é o recorte 4:5 do centro da capa
  const partes = TITULOS[id];
  const letras = partes.reduce((n, [t]) => n + t.length, 0);
  const tam = letras > 34 ? 92 : letras > 26 ? 104 : 116;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONTE, overflow: "hidden" }}>
      <Img src={staticFile(`cortes/capa-${id}.png`)} style={{ position: "absolute", top: desloc, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ top: desloc, height: 1920,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(0,0,0,0.72) 62%, rgba(0,0,0,0.9) 100%)" }} />
      <div style={{ position: "absolute", left: 70, width: 940, top: 1110 + desloc, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: E.verde, color: CORES.textoSobreVerde, fontSize: 32,
          fontWeight: 800, textTransform: "uppercase", padding: "12px 26px", borderRadius: 999 }}>
          • bastidores
        </span>
        <div style={{ marginTop: 28, color: "#FFFFFF", fontSize: tam, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0,
          textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
          {partes.map(([t, verde], i) => (
            <span key={i} style={verde ? { color: E.verde } : undefined}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, color: E.texto, fontSize: 38, fontWeight: 700,
          letterSpacing: "-0.03em" }}>
          <LogoPromptado tamanho={46} cor={E.texto} /> Promptado
        </div>
      </div>
    </AbsoluteFill>
  );
};

import { interpolate, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Cartao, cresce, NoEixo, Selo } from "../video1/componentes";

// Ilustrações do final do vídeo 4 (plano em edicao/video4/plano.md).
const E = CORES.dark;
const L = CORES.light;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };

// ---------- Chips das IAs, cada um com um "?" ----------
export const ChipsPergunta: React.FC<{ itens: [string, number][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: 60, width: 840, top: y, display: "flex", gap: 20, justifyContent: "center" }}>
      {itens.map(([t, q]) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={t} style={{ background: E.superficie, color: E.texto, fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em",
            padding: "16px 26px", borderRadius: 22, transform: `scale(${p})` }}>
            {t} <span style={{ color: E.textoApoio }}>?</span>
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Card Promptado que vira um ranking; "sua empresa" sobe para o 1º lugar ----------
export const CardRanking: React.FC<{ desde: number; vira: number; sobe: number }> = ({ desde, vira, sobe }) => {
  const f = useCurrentFrame();
  if (f < vira) {
    return (
      <Cartao y={1090} desde={desde}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoPromptado tamanho={72} cor={E.texto} />
          <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</span>
        </div>
      </Cartao>
    );
  }
  const ALT = 74; // altura de cada linha
  const t = interpolate(f, [sobe, sobe + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // posição de cada empresa: antes [A, B, sua] -> depois [sua, A, B]
  const linhas: [string, number, number][] = [["empresa A", 0, 1], ["empresa B", 1, 2], ["sua empresa", 2, 0]];
  return (
    <Cartao y={1060} desde={vira}>
      <div style={{ fontSize: 32, fontWeight: 500, color: E.textoApoio, marginBottom: 12 }}>resposta da IA</div>
      <div style={{ position: "relative", height: ALT * 3 }}>
        {linhas.map(([nome, de, para]) => {
          const sua = nome === "sua empresa";
          const pos = de + (para - de) * t;
          const primeiro = sua && t >= 1;
          return (
            <div key={nome} style={{ position: "absolute", left: 0, right: 0, top: pos * ALT, height: ALT - 10, borderRadius: 14,
              background: sua ? E.linha : "transparent", border: sua ? "none" : `1px solid ${E.linha}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px",
              fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: sua ? E.texto : E.textoApoio }}>
              <span>{nome}</span>
              {primeiro ? <span style={{ transform: `scale(${cresce(f, sobe + 8, 4)})` }}><Selo texto="1º" style={{ fontSize: 34 }} /></span> : null}
            </div>
          );
        })}
      </div>
    </Cartao>
  );
};

// ---------- Notificação de direct que desce no topo (por cima da chamada final) ----------
export const NotificacaoDirect: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 6);
  if (p <= 0) return null;
  return (
    <NoEixo>
      <div style={{ ...base, left: 90, width: 780, top: 270 - (1 - p) * 160, opacity: p, background: L.superficie, borderRadius: 30,
        boxShadow: "0 16px 44px rgba(0,0,0,0.16)", border: `1px solid ${L.linha}`, display: "flex", alignItems: "center",
        gap: 22, padding: "22px 28px" }}>
        <span style={{ width: 76, height: 76, borderRadius: 38, background: L.texto, display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0 }}>
          <LogoPromptado tamanho={48} cor={L.fundo} />
        </span>
        <span style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: L.texto, letterSpacing: "-0.02em" }}>
            Promptado <span style={{ fontWeight: 500, color: L.textoApoio }}>· direct</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, color: L.texto }}>seu link para o relatório</div>
        </span>
        <span style={{ fontSize: 48, fontWeight: 700, color: L.verdeTexto }}>→</span>
      </div>
    </NoEixo>
  );
};

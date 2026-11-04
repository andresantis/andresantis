import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Alcas, Cartao, chega, cresce, TelaCheia } from "../video1/componentes";

// Ilustrações do vídeo 3 (plano em edicao/video3/plano.md). Mesma marca e mesma área segura dos outros vídeos:
// x de 60 a 900, y de 250 a 1470.
const E = CORES.dark;
const L = CORES.light;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const LARG = 840;

// Imagem do painel enviada pelo André (1600×565 px).
const PAINEL = staticFile("video3/painel-visitantes.jpg");
const PAINEL_W = 1600;
const PAINEL_H = 565;
type Regiao = [number, number, number, number]; // [x, y, largura, altura] em px da imagem
export const REGIOES: Record<string, Regiao> = {
  tudo: [0, 0, PAINEL_W, PAINEL_H],
  visitantes: [14, 14, 530, 142],
  grafico: [14, 176, 1572, 374],
  taxa: [1060, 14, 526, 142],
};
const NUMERO_TAXA: Regiao = [1084, 66, 92, 36]; // "12,2%" dentro do painel

// ---------- Prévia do painel (gancho): card pequeno, inclinado, com alças verdes ----------
export const PreviaPainel: React.FC<{ desde: number; ate: number }> = ({ desde, ate }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 6) * (1 - cresce(f, ate - 6, 6));
  const largura = 720;
  return (
    <div style={{ position: "absolute", left: 480 - largura / 2, top: 1150, width: largura, opacity: p,
      transform: `translateY(${(1 - p) * 120}px) rotate(${-3 + (1 - p) * -3}deg)` }}>
      <div style={{ position: "relative", borderRadius: 18, overflow: "visible", boxShadow: "0 18px 50px rgba(0,0,0,0.45)" }}>
        <Img src={PAINEL} style={{ width: largura, display: "block", borderRadius: 18 }} />
        <Alcas cor={E.verde} />
      </div>
    </div>
  );
};

// ---------- Tela cheia clara com o painel; a "câmera" aproxima regiões no ritmo da fala ----------
export const TelaPainel: React.FC<{
  desde: number;
  focos: [keyof typeof REGIOES, number][]; // [região, quadro em que a aproximação começa]
  sublinhaTaxa?: number;
}> = ({ desde, focos, sublinhaTaxa }) => {
  const f = useCurrentFrame();
  const VW = LARG;
  const VH = 560;
  // posição/escala para centralizar uma região na janela
  const enquadra = ([x, y, w, h]: Regiao) => {
    const s = Math.min((VW * 0.92) / w, (VH * 0.8) / h);
    return { s, tx: VW / 2 - (x + w / 2) * s, ty: VH / 2 - (y + h / 2) * s };
  };
  let atual = enquadra(REGIOES[focos[0][0]]);
  let regiaoAtual = REGIOES[focos[0][0]];
  for (let i = 1; i < focos.length; i++) {
    const [nome, q] = focos[i];
    if (f < q) break;
    const alvo = enquadra(REGIOES[nome]);
    const t = interpolate(f, [q, q + 9], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    atual = { s: atual.s + (alvo.s - atual.s) * t, tx: atual.tx + (alvo.tx - atual.tx) * t, ty: atual.ty + (alvo.ty - atual.ty) * t };
    regiaoAtual = t >= 1 ? REGIOES[nome] : regiaoAtual;
  }
  const entrada = cresce(f, desde, 6);
  const focado = regiaoAtual !== REGIOES.tudo;
  const caixa = (r: Regiao) => ({ left: r[0] * atual.s + atual.tx, top: r[1] * atual.s + atual.ty, width: r[2] * atual.s, height: r[3] * atual.s });
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: 60, top: 960 - VH / 2, width: VW, height: VH, overflow: "hidden", borderRadius: 28,
        background: L.superficie, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", opacity: entrada,
        transform: `translateY(${(1 - entrada) * 80}px)` }}>
        <Img src={PAINEL} style={{ position: "absolute", left: atual.tx, top: atual.ty, width: PAINEL_W * atual.s, height: PAINEL_H * atual.s }} />
        {focado ? (
          <div style={{ position: "absolute", ...caixa(regiaoAtual) }}>
            <Alcas cor={L.verde} />
          </div>
        ) : null}
        {sublinhaTaxa !== undefined && f >= sublinhaTaxa ? (
          <div style={{ position: "absolute", left: caixa(NUMERO_TAXA).left, top: caixa(NUMERO_TAXA).top + caixa(NUMERO_TAXA).height + 6,
            height: 12, borderRadius: 6, background: L.verde, width: caixa(NUMERO_TAXA).width * cresce(f, sublinhaTaxa, 7) }} />
        ) : null}
      </div>
    </TelaCheia>
  );
};

// ---------- Tela cheia: 12 a cada 100 ----------
export const Grade100: React.FC<{ desde: number; acende: [number, number]; quantos: number; rotulo: string }> = ({
  desde, acende, quantos, rotulo,
}) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, acende, [0, quantos], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const lado = 44; // 10 linhas de 44 px + 9 vãos de 14 px = 566 px: cabe entre y 790 e 1356
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, width: LARG, top: 560, textAlign: "center", fontSize: 150, fontWeight: 700,
        letterSpacing: "-0.06em", color: chega(f, desde) }}>
        {n > 0 ? n : "–"} <span style={{ color: E.textoApoio, fontWeight: 600, fontSize: 70, letterSpacing: "-0.03em" }}>em cada</span> 100
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 790, display: "grid", gridTemplateColumns: `repeat(10, ${lado}px)`,
        gap: 14, justifyContent: "center" }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} style={{ width: lado, height: lado, borderRadius: lado / 2,
            background: i < n ? E.texto : E.linha, transform: `scale(${i < n && i === n - 1 ? 1.15 : 1})` }} />
        ))}
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 1390, textAlign: "center", fontSize: 40, fontWeight: 500,
        color: E.texto, opacity: cresce(f, desde + 3, 4) }}>
        <span style={{ color: E.verde }}>•</span> {rotulo}
      </div>
    </TelaCheia>
  );
};

// ---------- Tela cheia clara: um valor grande (R$ 0) ----------
export const TelaValor: React.FC<{ desde: number; rotulo: string; prefixo: string; valor: string; entra: number }> = ({
  desde, rotulo, prefixo, valor, entra,
}) => {
  const f = useCurrentFrame();
  const p = cresce(f, entra, 4);
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: 60, width: LARG, top: 800, textAlign: "center", fontSize: 40, fontWeight: 500,
        color: L.textoApoio, opacity: cresce(f, desde, 3) }}>
        <span style={{ color: L.verde }}>•</span> {rotulo}
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 880, textAlign: "center", fontWeight: 700, letterSpacing: "-0.06em",
        lineHeight: 1, color: L.texto }}>
        <span style={{ fontSize: 110 }}>{prefixo} </span>
        <span style={{ fontSize: 260, color: L.verdeTexto, display: "inline-block", opacity: p,
          transform: `scale(${0.6 + 0.4 * p})`, filter: f < entra + 3 ? "blur(5px)" : undefined }}>{valor}</span>
      </div>
    </TelaCheia>
  );
};

// ---------- Card: resposta da IA com a sua empresa, depois o custo caindo até zero ----------
export const CardRespostaCusto: React.FC<{
  desde: number;
  sua: number; // quadro em que "sua empresa ✓" entra
  vira: number; // quadro em que o card vira "custo de aquisição"
  cai: [number, number]; // barra encolhe de cai[0] até chegar a zero em cai[1]
}> = ({ desde, sua, vira, cai }) => {
  const f = useCurrentFrame();
  const linha = (texto: string, destaque: boolean, q: number) => (
    <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", padding: "10px 16px", borderRadius: 14,
      background: E.linha, color: E.texto, opacity: cresce(f, q, 4), display: "flex", justifyContent: "space-between" }}>
      <span>{texto}</span>
      {destaque ? <span style={{ color: E.verde }}>✓</span> : null}
    </div>
  );
  if (f < vira) {
    return (
      <Cartao y={1090} desde={desde}>
        <div style={{ fontSize: 32, fontWeight: 500, color: E.textoApoio, marginBottom: 12 }}>resposta da IA</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {linha("empresa A", false, desde)}
          {f >= sua ? linha("sua empresa", true, sua) : null}
        </div>
      </Cartao>
    );
  }
  const largura = interpolate(f, cai, [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <Cartao y={1090} desde={vira}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em" }}>custo de aquisição</span>
        {f >= cai[1] ? <span style={{ fontSize: 52, fontWeight: 700, color: E.verde, transform: `scale(${cresce(f, cai[1], 4)})` }}>↓</span> : null}
      </div>
      <div style={{ height: 44, borderRadius: 12, background: E.linha, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${largura}%`, background: E.texto, borderRadius: 12 }} />
      </div>
    </Cartao>
  );
};

// ---------- Card Promptado (logo e nome) ----------
export const CardPromptadoSimples: React.FC<{ desde: number }> = ({ desde }) => (
  <Cartao y={1090} desde={desde}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <LogoPromptado tamanho={72} cor={E.texto} />
      <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</span>
    </div>
  </Cartao>
);

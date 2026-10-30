import { interpolate, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";
import { Alcas, Cartao, Chaves, chega, cresce, Selo, TelaCheia } from "../video1/componentes";

// Ilustrações do vídeo 2 (plano em edicao/video2/plano.md). Mesma marca e mesma área segura do vídeo 1:
// x de 60 a 900, y de 250 a 1470.
const E = CORES.dark;
const L = CORES.light;
const PRETO = CORES.textoSobreVerde;
const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };
const LARG = 840;

// Risco verde que se desenha da esquerda para a direita, levemente inclinado (estilo.md, "impossível").
const Risco: React.FC<{ desde: number; largura: number; top?: string | number }> = ({ desde, largura, top = "46%" }) => {
  const f = useCurrentFrame();
  if (f < desde) return null;
  return (
    <span style={{ position: "absolute", left: -16, top, height: 14, borderRadius: 7, background: E.verde,
      width: (largura + 32) * cresce(f, desde, 5), transform: "rotate(-5deg)", transformOrigin: "left center" }} />
  );
};

// ---------- Alças de seleção e cursor em volta do card do post que já está gravado no vídeo ----------
export const AlcasNoPost: React.FC<{ desde: number; caixa: [number, number, number, number] }> = ({ desde, caixa }) => {
  const f = useCurrentFrame();
  const [x, y, w, h] = caixa;
  const p = cresce(f, desde, 5);
  const clique = desde + 8;
  const cx = interpolate(f, [desde, clique], [x + w + 160, x + w - 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(f, [desde, clique], [y + h + 140, y + h - 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aperto = f >= clique && f < clique + 4 ? 0.85 : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w * p, height: h * p, opacity: p }}>
        <Alcas cor={E.verde} />
      </div>
      <svg width="64" height="64" viewBox="0 0 24 24"
        style={{ position: "absolute", left: cx, top: cy, transform: `scale(${aperto})`, opacity: p }}>
        <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.5 14 L18 14 Z" fill={E.texto} stroke={PRETO} strokeWidth={1.2} />
      </svg>
    </>
  );
};

// ---------- Chips que levam um risco quando são falados ----------
export const ChipsRiscados: React.FC<{ itens: [string, number, number][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: 60, width: LARG, top: y, display: "flex", gap: 26, justifyContent: "center" }}>
      {itens.map(([t, q, r]) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={t} style={{ position: "relative", background: E.superficie, color: E.texto, fontSize: 52, fontWeight: 600,
            letterSpacing: "-0.02em", padding: "18px 34px", borderRadius: 24, transform: `scale(${p})` }}>
            {t}
            <Risco desde={r} largura={t.length * 52 * 0.55 + 68} />
          </span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Tela cheia: 9 em cada 10 ----------
export const Grade10: React.FC<{ desde: number; preenche: number[]; rotulo: string }> = ({ desde, preenche, rotulo }) => {
  const f = useCurrentFrame();
  const lado = 128;
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, width: LARG, top: 640, textAlign: "center", fontSize: 150, fontWeight: 700,
        letterSpacing: "-0.06em", color: chega(f, desde) }}>
        9 <span style={{ color: E.textoApoio, fontWeight: 600, fontSize: 70, letterSpacing: "-0.03em" }}>em cada</span> 10
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 880, display: "grid", gridTemplateColumns: `repeat(5, ${lado}px)`,
        gap: 26, justifyContent: "center" }}>
        {Array.from({ length: 10 }, (_, i) => {
          const cheio = i < preenche.length && f >= preenche[i];
          return (
            <div key={i} style={{ width: lado, height: lado, borderRadius: 26, border: `3px solid ${E.linha}`,
              background: cheio ? E.texto : "transparent", transform: `scale(${cheio ? 0.9 + 0.1 * cresce(f, preenche[i], 3) : 1})` }} />
          );
        })}
      </div>
      <div style={{ ...base, left: 60, width: LARG, top: 1240, textAlign: "center", fontSize: 40, fontWeight: 500,
        color: E.texto, opacity: cresce(f, desde + 4, 4) }}>
        <span style={{ color: E.verde }}>•</span> {rotulo}
      </div>
    </TelaCheia>
  );
};

// ---------- Tela cheia clara: contador em degraus (US$ 15 trilhões) ----------
export const ContadorTela: React.FC<{
  desde: number;
  rotulo: string;
  prefixo: string;
  sufixo: string;
  degraus: [number, number][]; // [valor, quadro em que chega]
}> = ({ desde, rotulo, prefixo, sufixo, degraus }) => {
  const f = useCurrentFrame();
  let valor = 0;
  let rolando = false;
  let anterior = 0;
  for (const [v, q] of degraus) {
    if (f >= q) { valor = v; anterior = v; continue; }
    if (f >= q - 6) { valor = Math.round(interpolate(f, [q - 6, q], [anterior, v])); rolando = true; }
    break;
  }
  const final = degraus[degraus.length - 1];
  const chegou = f >= final[1];
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: 60, width: LARG, top: 800, textAlign: "center", fontSize: 40, fontWeight: 500,
        color: L.textoApoio, opacity: cresce(f, desde, 3) }}>
        <span style={{ color: L.verde }}>•</span> {rotulo}
      </div>
      {f >= degraus[0][1] - 6 ? (
        <div style={{ ...base, left: 60, width: LARG, top: 880, textAlign: "center", fontWeight: 700, letterSpacing: "-0.06em",
          lineHeight: 1, color: L.texto, filter: rolando ? "blur(5px)" : undefined }}>
          <span style={{ fontSize: 90 }}>{prefixo} </span>
          <span style={{ fontSize: 220, color: chegou ? L.verdeTexto : L.texto }}>{valor}</span>
          <div style={{ fontSize: 90, marginTop: 10 }}>{sufixo}</div>
        </div>
      ) : null}
    </TelaCheia>
  );
};

// ---------- Navegador com abas (até 10) e risco ----------
export const Navegador: React.FC<{ desde: number; abas: [number, number]; risco: number }> = ({ desde, abas, risco }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, abas, [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Cartao y={370} desde={desde}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[0, 1, 2].map((k) => <span key={k} style={{ width: 18, height: 18, borderRadius: 9, background: E.linha }} />)}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 34, fontWeight: 600, color: E.textoApoio }}>{n} abas</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ height: 40, borderRadius: 10, background: i < n ? E.linha : "transparent",
              border: `1px solid ${E.linha}` }} />
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 34, fontWeight: 500, color: E.textoApoio }}>comparar fornecedor…</div>
        <Risco desde={risco} largura={680} top="40%" />
      </div>
    </Cartao>
  );
};

// ---------- Chat no topo, com o nome da IA para quem você pergunta ----------
export const ChatIA: React.FC<{ desde: number; texto: string; alvos: [string, number][] }> = ({ desde, texto, alvos }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  const n = Math.floor(Math.min(texto.length, Math.max(0, (f - desde - 4) * 0.75)));
  const alvo = [...alvos].reverse().find(([, q]) => f >= q);
  return (
    <>
      {alvo ? (
        <div style={{ ...base, left: 80, top: 400, transform: `scale(${cresce(f, alvo[1], 4)})`, transformOrigin: "left center" }}>
          <span style={{ background: E.superficie, color: E.texto, fontSize: 40, fontWeight: 600, padding: "12px 26px",
            borderRadius: 999 }}>
            <span style={{ color: E.textoApoio, fontWeight: 500 }}>perguntando para </span>{alvo[0]}
          </span>
        </div>
      ) : null}
      <div style={{ ...base, left: 80, width: 800, top: 262, height: 120, borderRadius: 60, background: E.superficie,
        display: "flex", alignItems: "center", padding: "0 18px 0 40px", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
        <span style={{ flex: 1, fontSize: 46, fontWeight: 500, letterSpacing: "-0.02em", color: E.texto, whiteSpace: "nowrap", overflow: "hidden" }}>
          {texto.slice(0, n)}
          {Math.floor(f / 8) % 2 === 0 ? <span style={{ color: E.verde }}>|</span> : null}
        </span>
        <span style={{ width: 84, height: 84, borderRadius: 42, background: E.verde, color: PRETO, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700 }}>↑</span>
      </div>
    </>
  );
};

// ---------- Card de resposta: 2 ou 3 empresas, e a sua fica de fora ----------
export const CardResposta: React.FC<{
  desde: number;
  empresas: [string, number, boolean][]; // [nome, quadro, apagada]
  sua: { de: number; fora: number };
}> = ({ desde, empresas, sua }) => {
  const f = useCurrentFrame();
  const saiu = cresce(f, sua.fora + 8, 6);
  return (
    <Cartao y={370} desde={desde}>
      <div style={{ fontSize: 32, fontWeight: 500, color: E.textoApoio, marginBottom: 12 }}>resposta da IA</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {empresas.filter(([, q]) => f >= q).map(([nome, , apagada]) => (
          <div key={nome} style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", padding: "10px 16px",
            borderRadius: 14, background: E.linha, color: apagada ? E.textoApoio : E.texto }}>
            {nome}
          </div>
        ))}
        {f >= sua.de && saiu < 1 ? (
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", padding: "8px 14px",
            border: `2px dashed ${E.textoApoio}`, borderRadius: 14, color: E.textoApoio, opacity: 1 - saiu,
            display: "flex", justifyContent: "space-between" }}>
            <span>sua empresa</span>
            {f >= sua.fora ? <span style={{ color: E.texto }}>✗</span> : null}
          </div>
        ) : null}
      </div>
    </Cartao>
  );
};

// ---------- Tela cheia: "e o pior," + { você nunca vai saber } -> "perdeu essa venda." riscado ----------
export const TelaPior: React.FC<{
  desde: number;
  palavras: [string, number][];
  troca: number;
  risco: number;
}> = ({ desde, palavras, troca, risco }) => {
  const f = useCurrentFrame();
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, width: LARG, top: 760, textAlign: "center", fontSize: 44, fontWeight: 500,
        color: E.textoApoio, opacity: cresce(f, desde, 3) }}>
        e o pior,
      </div>
      {f < troca ? (
        <Chaves palavras={palavras} desde={palavras[0][1] - 4} y={880} tamanho={80} />
      ) : (
        <div style={{ ...base, left: 60, width: LARG, top: 880, textAlign: "center", fontSize: 96, fontWeight: 700,
          letterSpacing: "-0.04em", color: chega(f, troca), whiteSpace: "nowrap" }}>
          perdeu essa{" "}
          <span style={{ position: "relative" }}>
            venda.
            <Risco desde={risco} largura={300} />
          </span>
        </div>
      )}
    </TelaCheia>
  );
};

// ---------- Card Promptado: logo, depois a pergunta e o selo "monitorando" ----------
export const CardPromptadoIA: React.FC<{ desde: number; linha: [string, number]; selo: [string, number] }> = ({
  desde, linha, selo,
}) => {
  const f = useCurrentFrame();
  return (
    <Cartao y={370} desde={desde}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <LogoPromptado tamanho={64} cor={E.texto} />
        <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</span>
        <span style={{ flex: 1 }} />
        {f >= selo[1] ? (
          <span style={{ transform: `scale(${cresce(f, selo[1], 4)})` }}><Selo texto={selo[0]} /></span>
        ) : null}
      </div>
      {f >= linha[1] ? (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${E.linha}`, fontSize: 42, fontWeight: 600,
          letterSpacing: "-0.03em", color: chega(f, linha[1]) }}>
          {linha[0]}
        </div>
      ) : null}
    </Cartao>
  );
};

// ---------- Barras sem números: "você" encolhe, "concorrente" cresce ----------
export const BarrasConcorrente: React.FC<{ desde: number; muda: [number, number] }> = ({ desde, muda }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, muda, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barra = (rotulo: string, largura: number, cor: string) => (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 36, fontWeight: 600, marginBottom: 6 }}>{rotulo}</div>
      <div style={{ height: 40, borderRadius: 12, width: `${largura}%`, background: cor }} />
    </div>
  );
  return (
    <Cartao y={370} desde={desde}>
      {barra("você", interpolate(t, [0, 1], [70, 28]), E.linha)}
      {barra("concorrente", interpolate(t, [0, 1], [40, 92]), E.verde)}
    </Cartao>
  );
};

// ---------- Chamada final: logo, { comenta "IA" }, caixa de comentário e botão ----------
export const ChamadaComentario: React.FC<{ desde: number; ia: number; botao: number }> = ({ desde, ia, botao }) => {
  const f = useCurrentFrame();
  const letras = Math.floor(Math.min(2, Math.max(0, (f - ia) * 0.5)));
  const p = cresce(f, botao, 4);
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: 400, top: 634 - 80, opacity: cresce(f, desde, 4) }}>
        <LogoPromptado tamanho={160} cor={L.texto} />
      </div>
      <Chaves palavras={[["comenta", desde + 2], ['"IA"', ia]]} desde={desde} y={800} tamanho={72} claro />
      <div style={{ ...base, left: 120, width: 720, top: 980, height: 110, borderRadius: 55, background: L.superficie,
        border: `1px solid ${L.linha}`, display: "flex", alignItems: "center", padding: "0 36px",
        fontSize: 46, fontWeight: 500, color: L.texto, opacity: cresce(f, desde + 4, 4) }}>
        {"IA".slice(0, letras)}
        {Math.floor(f / 8) % 2 === 0 ? <span style={{ color: L.verde }}>|</span> : null}
      </div>
      {f >= botao ? (
        <div style={{ ...base, left: 60, width: LARG, top: 1150, textAlign: "center" }}>
          <span style={{ position: "relative", display: "inline-block", transform: `scale(${Math.max(0.05, p)})` }}>
            <span style={{ display: "inline-block", background: L.verde, color: PRETO, fontSize: 56, fontWeight: 600,
              letterSpacing: "-0.03em", padding: "22px 44px", borderRadius: 20 }}>comentar</span>
            <Alcas cor={L.texto} />
          </span>
        </div>
      ) : null}
    </TelaCheia>
  );
};

import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES, FONTE } from "../marca";

// Ilustrações do estilo.md com a marca Promptado. Tudo fica dentro da área segura:
// x de 60 a 900, y de 250 a 1470 (o Instagram cobre o topo, a base e a lateral direita).
const E = CORES.dark;
const L = CORES.light;
const PRETO = CORES.textoSobreVerde;
export const CENTRO_X = 480;
const LARG = 840;

const sai = Easing.out(Easing.cubic);
const cresce = (f: number, desde: number, dur = 4) =>
  interpolate(f, [desde, desde + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: sai });
const chega = (f: number, desde: number) => interpolateColors(f - desde, [0, 2], [E.textoApoio, E.texto]);

const base: React.CSSProperties = { position: "absolute", fontFamily: FONTE };

// Alças de seleção de programa de design (4 quadradinhos nos cantos + contorno).
const Alcas: React.FC<{ cor: string }> = ({ cor }) => {
  const q = (s: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 14, height: 14, background: "#fff", border: `2px solid ${cor}`, ...s }} />
  );
  return (
    <div style={{ position: "absolute", inset: -12, border: `2px solid ${cor}`, pointerEvents: "none" }}>
      {q({ left: -8, top: -8 })}
      {q({ right: -8, top: -8 })}
      {q({ left: -8, bottom: -8 })}
      {q({ right: -8, bottom: -8 })}
    </div>
  );
};

// ---------- Palavra grande (fica ATRÁS da pessoa; ver Camera.tsx) ----------
export const PalavraGrande: React.FC<{
  texto: string;
  desde: number;
  sublinhado?: number;
  risco?: number;
  contador?: boolean;
}> = ({ texto, desde, sublinhado, risco, contador }) => {
  const f = useCurrentFrame();
  const tamanho = Math.min(242, (LARG / (texto.length * 0.52)));
  let mostrado = texto;
  let desfoque = 0;
  if (contador) {
    const n = Math.round(interpolate(f, [desde, desde + 6], [1, Number(texto)], { extrapolateRight: "clamp" }));
    mostrado = String(n);
    desfoque = f < desde + 6 ? 6 : 0;
  }
  const largura = mostrado.length * tamanho * 0.52;
  return (
    <div style={{ ...base, left: 60, width: LARG, top: 470, textAlign: texto.length <= 3 ? "center" : "left" }}>
      <div
        style={{
          display: "inline-block",
          position: "relative",
          fontWeight: 700,
          fontSize: tamanho,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: chega(f, desde),
          filter: desfoque ? `blur(${desfoque}px)` : undefined,
        }}
      >
        {mostrado}
        {sublinhado !== undefined && f >= sublinhado ? (
          <div style={{ position: "absolute", left: 0, top: tamanho * 0.98, height: 14, borderRadius: 7,
            width: `${cresce(f, sublinhado, 7) * 100}%`, background: E.verde }} />
        ) : null}
        {risco !== undefined && f >= risco ? (
          <div style={{ position: "absolute", left: -20, top: tamanho * 0.5, height: 24, borderRadius: 12,
            width: (largura + 60) * cresce(f, risco, 5), background: E.verde,
            transform: "rotate(-5deg)", transformOrigin: "left center" }} />
        ) : null}
      </div>
    </div>
  );
};

// ---------- Rótulo de capítulo "• 01/05" ----------
export const Rotulo: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: 60, top: 380, fontSize: 36, fontWeight: 500, letterSpacing: "-0.01em",
      color: E.textoApoio, opacity: cresce(f, desde, 3) }}>
      <span style={{ color: E.verde }}>•</span> {texto}
    </div>
  );
};

// ---------- Palavra em caixa verde (seleção de texto) ----------
export const CaixaVerde: React.FC<{ texto: string; desde: number; y?: number }> = ({ texto, desde, y = 1180 }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde + 2, 4);
  return (
    <div style={{ ...base, left: CENTRO_X - LARG / 2, width: LARG, top: y, textAlign: "center" }}>
      <span style={{ position: "relative", display: "inline-block", padding: "6px 18px", fontSize: 84, fontWeight: 700,
        letterSpacing: "-0.04em", color: p > 0.5 ? PRETO : E.texto }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: E.verde }} />
        {f < desde + 2 ? <span style={{ position: "absolute", left: -6, top: 4, bottom: 4, width: 6, background: E.verde }} /> : null}
        <span style={{ position: "relative" }}>{texto}</span>
      </span>
    </div>
  );
};

// ---------- Chaves  ←{ palavra palavra }→  ----------
export const Chaves: React.FC<{
  palavras: [string, number][];
  desde: number;
  y?: number;
  prefixo?: string;
  setas?: boolean;
  tamanho?: number;
  claro?: boolean;
  caixa?: boolean;
}> = ({ palavras, desde, y = 1200, prefixo, setas = true, tamanho = 64, claro, caixa }) => {
  const f = useCurrentFrame();
  const C = claro ? L : E;
  const abre = cresce(f, desde, 4);
  // Diminui sozinho até caber na área segura (x de 60 a 900), contando chaves e setas.
  const letras = palavras.reduce((n, [w]) => n + w.length + 1, 0) + (setas ? 8 : 4);
  tamanho = Math.min(tamanho, (LARG + 20) / (letras * 0.55));
  const visiveis = palavras.filter(([, q]) => f >= q);
  const ponto = (lado: "left" | "right") => (
    <span style={{ position: "absolute", top: -10, [lado]: 2, width: 8, height: 8, background: C.texto }} />
  );
  const verde = (s: string) => <span style={{ color: C.verde, fontWeight: 500 }}>{s}</span>;
  return (
    <div style={{ ...base, left: CENTRO_X - LARG / 2 - 30, width: LARG + 60, top: y, textAlign: "center",
      fontSize: tamanho, fontWeight: 600, letterSpacing: "-0.03em", color: C.texto, opacity: abre }}>
      {prefixo ? <div style={{ fontSize: tamanho * 0.85, marginBottom: 6 }}>{prefixo}</div> : null}
      <span style={{ whiteSpace: "nowrap", ...(caixa ? { background: C.superficie, borderRadius: 24, padding: "14px 26px" } : {}) }}>
        {setas ? verde("← ") : null}
        <span style={{ position: "relative" }}>{ponto("left")}{verde("{")}</span>
        <span style={{ display: "inline-block", minWidth: interpolate(abre, [0, 1], [0, visiveis.length ? 0 : 260]) }}>
          {visiveis.map(([w, q], i) => (
            <span key={i} style={{ color: interpolateColors(f - q, [0, 2], [C.textoApoio, C.texto]) }}>
              {(i ? " " : " ") + w}
            </span>
          ))}{" "}
        </span>
        <span style={{ position: "relative" }}>{ponto("right")}{verde("}")}</span>
        {setas ? verde(" →") : null}
      </span>
    </div>
  );
};

// ---------- Cartão de superfície ----------
const Cartao: React.FC<{ y: number; desde: number; children: React.ReactNode; largura?: number }> = ({
  y, desde, children, largura = 760,
}) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 6);
  return (
    <div style={{ ...base, left: CENTRO_X - largura / 2, width: largura, top: y, background: E.superficie,
      borderRadius: 32, padding: "34px 40px", color: E.texto, opacity: p,
      transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * -4}deg)` }}>
      {children}
    </div>
  );
};

const Selo: React.FC<{ texto: string; style?: React.CSSProperties }> = ({ texto, style }) => (
  <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontWeight: 600, fontSize: 30,
    letterSpacing: "-0.01em", padding: "8px 18px", borderRadius: 999, ...style }}>{texto}</span>
);

// ---------- Gancho: 5 cards de IA -> painel Promptado ----------
export const GanchoIA: React.FC<{ nomes: string[]; desde: number; selecao: number; painel: number; fim: number }> = ({
  nomes, desde, selecao, painel,
}) => {
  const f = useCurrentFrame();
  if (f < painel) {
    return (
      <div style={{ ...base, left: 60, width: LARG, top: 1160, display: "flex", flexWrap: "wrap", gap: 22,
        justifyContent: "center" }}>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
          {nomes.map((n, i) => {
            const p = cresce(f, desde + i * 3, 4);
            return (
              <span key={n} style={{ background: E.superficie, color: E.texto, fontSize: 44, fontWeight: 600,
                letterSpacing: "-0.02em", padding: "18px 30px", borderRadius: 22, transform: `scale(${p})`, opacity: p }}>{n}</span>
            );
          })}
          {f >= selecao ? <Alcas cor={E.texto} /> : null}
        </div>
      </div>
    );
  }
  return (
    <Cartao y={980} desde={painel}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        <LogoPromptado tamanho={64} cor={E.texto} />
        <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</span>
        <span style={{ flex: 1 }} />
        {f >= painel + 6 ? <Selo texto="monitorando" /> : null}
      </div>
      {nomes.map((n, i) => (
        <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 500,
          padding: "10px 0", borderTop: `1px solid ${E.linha}` }}>
          <span>{n}</span>
          <span style={{ opacity: cresce(f, painel + 8 + i * 3, 3) }}>✓</span>
        </div>
      ))}
    </Cartao>
  );
};

// ---------- Card com lista (checklist, integrações, fontes, atalhos) ----------
export const CardLista: React.FC<{
  titulo: string;
  itens: [string, number][];
  desde: number;
  y?: number;
  marcador?: "✓" | "•" | "↗";
  verdeUltimo?: boolean;
}> = ({ titulo, itens, desde, y = 1060, marcador = "•", verdeUltimo }) => {
  const f = useCurrentFrame();
  return (
    <Cartao y={y} desde={desde}>
      <div style={{ fontSize: 34, fontWeight: 500, color: E.textoApoio, marginBottom: 14 }}>{titulo}</div>
      {itens.filter(([, q]) => f >= q).map(([t, q], i, arr) => {
        const [a, b] = t.split(" → ");
        const n = Math.floor(interpolate(f, [q, q + a.length / 0.75], [0, a.length], { extrapolateRight: "clamp" }));
        const ultimo = verdeUltimo && i === arr.length - 1 && i === itens.length - 1;
        return (
          <div key={i} style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em", padding: "10px 0",
            borderTop: `1px solid ${E.linha}` }}>
            <span style={{ color: ultimo ? E.verde : E.texto }}>{marcador} </span>
            {a.slice(0, n)}
            {b !== undefined && n >= a.length ? (
              <span style={{ color: E.verdeTexto }}>{" → " + b}</span>
            ) : null}
          </div>
        );
      })}
    </Cartao>
  );
};

// ---------- Chips soltos ----------
export const Chips: React.FC<{ itens: [string, number][]; y: number }> = ({ itens, y }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: 60, width: LARG, top: y, display: "flex", gap: 20, justifyContent: "center" }}>
      {itens.map(([t, q]) => {
        const p = cresce(f, q, 4);
        return p > 0 ? (
          <span key={t} style={{ background: E.superficie, color: E.texto, fontSize: 42, fontWeight: 600,
            letterSpacing: "-0.02em", padding: "16px 28px", borderRadius: 22, transform: `scale(${p})` }}>{t}</span>
        ) : null;
      })}
    </div>
  );
};

// ---------- Selo verde solto ----------
export const SeloSolto: React.FC<{ texto: string; desde: number; x: number; y: number }> = ({ texto, desde, x, y }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  return (
    <div style={{ ...base, left: x, top: y, transform: `scale(${p})`, transformOrigin: "left center" }}>
      <Selo texto={texto} style={{ fontSize: 40, padding: "12px 24px" }} />
    </div>
  );
};

// ---------- Card Promptado (time de desenvolvimento) ----------
export const CardPromptado: React.FC<{ subtitulo: string; selo: [string, number]; desde: number }> = ({
  subtitulo, selo, desde,
}) => {
  const f = useCurrentFrame();
  return (
    <Cartao y={1080} desde={desde}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <LogoPromptado tamanho={64} cor={E.texto} />
        <div>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.035em" }}>Promptado</div>
          <div style={{ fontSize: 34, fontWeight: 500, color: E.textoApoio }}>{subtitulo}</div>
        </div>
      </div>
      <div style={{ marginTop: 22, height: 60 }}>
        {f >= selo[1] ? (
          <span style={{ display: "inline-block", transform: `scale(${cresce(f, selo[1], 4)})`, transformOrigin: "left center" }}>
            <Selo texto={selo[0]} style={{ fontSize: 38, padding: "10px 22px" }} />
          </span>
        ) : null}
      </div>
    </Cartao>
  );
};

// ---------- Seleção de texto: cursor -> seleção verde -> texto preto ----------
export const Selecao: React.FC<{ texto: string; desde: number; y?: number }> = ({ texto, desde, y = 1180 }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde + 4, 4);
  return (
    <div style={{ ...base, left: CENTRO_X - LARG / 2, width: LARG, top: y, textAlign: "center" }}>
      <span style={{ position: "relative", display: "inline-block", padding: "4px 14px", fontSize: 96, fontWeight: 700,
        letterSpacing: "-0.05em", color: p > 0.5 ? PRETO : chega(f, desde) }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: E.verde }} />
        {f < desde + 4 && Math.floor((f - desde) / 2) % 2 === 0 ? (
          <span style={{ position: "absolute", left: -4, top: 6, bottom: 6, width: 6, background: E.verde }} />
        ) : null}
        <span style={{ position: "relative" }}>{texto}</span>
      </span>
    </div>
  );
};

// ---------- Coluna ao lado da cabeça ----------
export const Coluna: React.FC<{ linhas: [string, number][]; x?: number; y?: number }> = ({ linhas, x = 560, y = 620 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: x, top: y, width: 900 - x, fontSize: 50, fontWeight: 600, letterSpacing: "-0.03em",
      lineHeight: 1.15, background: E.superficie, borderRadius: 28, padding: "24px 28px" }}>
      {linhas.filter(([, q]) => f >= q).map(([t, q], i) => (
        <div key={i} style={{ color: i === linhas.length - 1 ? E.verdeTexto : chega(f, q) }}>{t}</div>
      ))}
    </div>
  );
};

// ---------- Caixa de chat digitando ----------
export const Chat: React.FC<{ passos: { texto: string; de: number; apaga?: number }[]; desde: number; envia?: number }> = ({
  passos, desde, envia,
}) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  let texto = "";
  for (const s of passos) {
    if (f < s.de) break;
    const n = Math.floor(Math.min(s.texto.length, (f - s.de) * 0.75));
    texto = s.texto.slice(0, n);
    if (s.apaga !== undefined && f >= s.apaga) {
      texto = s.texto.slice(0, Math.max(0, s.texto.length - Math.floor((f - s.apaga) * 2)));
    }
  }
  const enviado = envia !== undefined && f >= envia;
  return (
    <div style={{ ...base, left: 80, width: 800, top: 262, height: 120, borderRadius: 60, background: E.superficie,
      display: "flex", alignItems: "center", padding: "0 18px 0 40px", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
      <span style={{ flex: 1, fontSize: 46, fontWeight: 500, letterSpacing: "-0.02em", color: E.texto, whiteSpace: "nowrap", overflow: "hidden" }}>
        {texto}
        {Math.floor(f / 8) % 2 === 0 && !enviado ? <span style={{ color: E.verde }}>|</span> : null}
      </span>
      <span style={{ width: 84, height: 84, borderRadius: 42, background: E.verde, color: PRETO, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700,
        transform: `scale(${enviado ? interpolate(f - envia!, [0, 2, 5], [1, 0.85, 1], { extrapolateRight: "clamp" }) : 1})` }}>↑</span>
    </div>
  );
};

// ---------- Grok ⟷ X ----------
export const LinkApps: React.FC<{ a: string; b: string; desde: number }> = ({ a, b, desde }) => {
  const f = useCurrentFrame();
  const p1 = cresce(f, desde, 4);
  const linha = cresce(f, desde + 3, 6);
  const p2 = cresce(f, desde + 6, 4);
  const chip = (t: string, p: number) => (
    <span style={{ background: E.superficie, color: E.texto, fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em",
      padding: "22px 40px", borderRadius: 26, transform: `scale(${p})`, display: "inline-block" }}>{t}</span>
  );
  return (
    <div style={{ ...base, left: 60, width: LARG, top: 1180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {chip(a, p1)}
      <span style={{ position: "relative", width: 240, height: 6 }}>
        <span style={{ position: "absolute", left: 0, top: 0, height: 6, width: `${linha * 100}%`, background: E.textoApoio }} />
        {linha > 0.5 ? <span style={{ position: "absolute", left: 104, top: -13, width: 32, height: 32, borderRadius: 16, background: E.verde }} /> : null}
      </span>
      {chip(b, p2)}
    </div>
  );
};

// ---------- Botão verde com alças ----------
export const Botao: React.FC<{ texto: string; desde: number; y?: number; claro?: boolean }> = ({ texto, desde, y = 1200, claro }) => {
  const f = useCurrentFrame();
  const p = cresce(f, desde, 4);
  return (
    <div style={{ ...base, left: CENTRO_X - LARG / 2, width: LARG, top: y, textAlign: "center" }}>
      <span style={{ position: "relative", display: "inline-block", transform: `scale(${Math.max(0.05, p)})`, opacity: p > 0 ? 1 : 0 }}>
        <span style={{ display: "inline-block", background: E.verde, color: PRETO, fontSize: 56, fontWeight: 600,
          letterSpacing: "-0.03em", padding: "22px 44px", borderRadius: 20 }}>{texto}</span>
        <Alcas cor={claro ? L.texto : E.texto} />
      </span>
    </div>
  );
};

// ---------- Telas cheias ----------
export const TelaCheia: React.FC<{ claro?: boolean; children: React.ReactNode }> = ({ claro, children }) => {
  const C = claro ? L : E;
  const guia = (s: React.CSSProperties) => <div style={{ position: "absolute", background: C.linha, ...s }} />;
  return (
    <AbsoluteFill style={{ background: C.fundo }}>
      {guia({ left: 60, top: 0, bottom: 0, width: 1 })}
      {guia({ left: 900, top: 0, bottom: 0, width: 1 })}
      {guia({ top: 250, left: 0, right: 0, height: 1 })}
      {guia({ top: 1470, left: 0, right: 0, height: 1 })}
      {children}
    </AbsoluteFill>
  );
};

export const TelaRisco: React.FC<{
  texto: string;
  desde: number;
  risco: number;
  depois?: { palavras: [string, number][]; desde: number };
}> = ({ texto, desde, risco, depois }) => {
  const f = useCurrentFrame();
  if (depois && f >= depois.desde) {
    return (
      <TelaCheia>
        <Chaves palavras={depois.palavras} desde={depois.desde} y={880} tamanho={84} />
      </TelaCheia>
    );
  }
  const largura = Math.min(LARG, texto.length * 96 * 0.5);
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, width: LARG, top: 880, textAlign: "center", fontSize: 96, fontWeight: 700,
        letterSpacing: "-0.04em", lineHeight: 1.05, whiteSpace: "nowrap", color: chega(f, desde) }}>
        <span style={{ position: "relative" }}>
          {texto}
          {f >= risco ? (
            <span style={{ position: "absolute", left: -30, top: "48%", height: 26, borderRadius: 13, background: E.verde,
              width: (largura + 60) * cresce(f, risco, 5), transform: "rotate(-5deg)", transformOrigin: "left center" }} />
          ) : null}
        </span>
      </div>
    </TelaCheia>
  );
};

export const TelaChaves: React.FC<{ palavras: [string, number][]; desde: number }> = ({ palavras, desde }) => (
  <TelaCheia>
    <Chaves palavras={palavras} desde={desde} y={890} tamanho={84} />
  </TelaCheia>
);

// Cilindro 3D: a mesma palavra repetida em linhas que rolam (estilo.md, "revolução").
export const Cilindro: React.FC<{ palavra: string; desde: number; rotulos: [string, number, "cima" | "baixo"][] }> = ({
  palavra, desde, rotulos,
}) => {
  const f = useCurrentFrame();
  const rolagem = (f - desde) * 9;
  const linhas = [];
  for (let k = -7; k <= 7; k++) {
    const y = k * 92 + (rolagem % 92);
    const dist = Math.abs(y) / 640;
    if (dist > 1) continue;
    const escala = Math.cos(dist * Math.PI / 2.2);
    linhas.push(
      <div key={k} style={{ ...base, left: 60, width: LARG, top: 860 + y * 0.9, textAlign: "center", fontSize: 92 * escala,
        fontWeight: 700, letterSpacing: "-0.04em", color: interpolateColors(dist, [0, 0.8], [E.texto, E.linha]),
        whiteSpace: "nowrap", transform: "translateY(-50%)" }}>
        {palavra} {palavra}
      </div>,
    );
  }
  return (
    <TelaCheia>
      {linhas}
      {rotulos.filter(([, q]) => f >= q).map(([t, , pos]) => (
        <div key={t} style={{ ...base, left: 80, top: pos === "cima" ? 330 : 1380, fontSize: 36, fontWeight: 500, color: E.texto }}>
          <span style={{ color: E.verde }}>•</span> {t}
        </div>
      ))}
    </TelaCheia>
  );
};

// Gráfico de barras sem números (só cresce): "resultados ↑".
export const Grafico: React.FC<{ titulo: string; desde: number }> = ({ titulo, desde }) => {
  const f = useCurrentFrame();
  const alturas = [0.2, 0.34, 0.5, 0.7, 1];
  return (
    <TelaCheia>
      <div style={{ ...base, left: 60, top: 330, fontSize: 110, fontWeight: 700, letterSpacing: "-0.05em", color: chega(f, desde) }}>
        {titulo}
        <svg width="560" height="30" style={{ display: "block", marginTop: 4 }}>
          <path d="M0 15 Q 35 0 70 15 T 140 15 T 210 15 T 280 15 T 350 15 T 420 15 T 490 15 T 560 15" fill="none"
            stroke={E.verde} strokeWidth={8} strokeDasharray={600} strokeDashoffset={600 * (1 - cresce(f, desde + 2, 8))} />
        </svg>
      </div>
      <div style={{ ...base, left: 80, width: 800, top: 620, height: 820, display: "flex", alignItems: "flex-end", gap: 26,
        borderBottom: `2px solid ${E.linha}` }}>
        {alturas.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 100 * cresce(f, desde + 5 + i * 3, 4)}%`,
            background: i === alturas.length - 1 ? E.verde : E.linha, borderRadius: "10px 10px 0 0" }} />
        ))}
      </div>
    </TelaCheia>
  );
};

// Chamada final (fundo claro): logo, pergunta entre chaves e botão "me segue para mais".
export const ChamadaFinal: React.FC<{ palavras: [string, number][]; desde: number; botao: number }> = ({
  palavras, desde, botao,
}) => {
  const f = useCurrentFrame();
  return (
    <TelaCheia claro>
      <div style={{ ...base, left: CENTRO_X - 80, top: 634 - 80, opacity: cresce(f, desde, 4) }}>
        <LogoPromptado tamanho={160} cor={L.texto} />
      </div>
      <Chaves palavras={palavras} desde={desde} y={820} tamanho={72} claro />
      {f >= botao ? <Botao texto="me segue para mais →" desde={botao} y={1010} claro /> : null}
    </TelaCheia>
  );
};

export const LogoFinal: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...base, left: CENTRO_X - 70, top: 560, opacity: cresce(f, desde, 4) }}>
      <LogoPromptado tamanho={140} cor={E.texto} />
    </div>
  );
};

// Monta as versões do logo Promptado em SVG (slogan já convertido em contorno).
const { execFileSync } = require('child_process');
const path = require('path');

const PROJ = '/home/user/andresantis';
const FONTE = path.join(PROJ, 'public/fontes/Geist-latin.woff2');
const PY = path.join(__dirname, 'texto_vetor.py');

const ICONE_PATHS = [
  'M 416 80 H 160 c -35.3 0 -64 28.7 -64 64 v 224 c 0 35.3 28.7 64 64 64 h 128 l 64 64 c 6.2 6.2 14.4 9.4 22.6 9.4 c 4.1 0 8.3 -0.8 12.2 -2.5 c 11.9 -5 19.6 -16.6 19.6 -29.9 v -41 h 10 c 35.3 0 64 -28.7 64 -64 V 144 c 0 -35.3 -28.7 -64 -64 -64 z m 32 288 c 0 17.6 -14.4 32 -32 32 h -26 c -8.8 0 -16 7.2 -16 16 v 41 l -64 -64 c -3 -3 -7.1 -4.7 -11.3 -4.7 H 160 c -17.6 0 -32 -14.4 -32 -32 V 144 c 0 -17.6 14.4 -32 32 -32 h 256 c 17.6 0 32 14.4 32 32 v 224 z',
  'M 350 240 l -96 -56 c -4.5 -2.6 -10.1 -2.6 -14.6 0 c -4.5 2.6 -7.4 7.5 -7.4 12.6 v 112 c 0 5.1 2.9 10 7.4 12.6 c 2.3 1.3 4.8 2 7.3 2 s 5 -0.7 7.3 -2 l 32 -18.6 l 18.6 32 c 2.7 4.7 7.7 7.4 12.8 7.4 c 2.5 0 5.1 -0.6 7.4 -2 c 7 -4 9.4 -13.2 5.4 -20.2 l -18.6 -32 l 38.4 -22.4 c 4.5 -2.6 7.4 -7.5 7.4 -12.6 s -2.9 -10 -7.4 -12.8 z',
];
// Caixa medida do desenho (unidades do viewBox 0 0 512 512).
const IX = 96, IY = 80, IW = 384.4, IH = 425.4;
const CORPO_H = 352; // balão sem a "ponta" de baixo
const X_UNID = 125.4; // largura do cursor interno = unidade "x" da área de proteção

const SLOGAN = ['sua marca nas', 'respostas das IAs'];
const PESO = 600, TRACKING = -0.03, ENTRELINHA = 1.08;

function linha(texto, peso = PESO, tracking = TRACKING) {
  return JSON.parse(execFileSync('python3', ['-I', PY, FONTE, String(peso), String(tracking), texto]).toString());
}
const LINHAS = SLOGAN.map(t => linha(t));
const UPM = LINHAS[0].upm, XH = LINHAS[0].xHeight / UPM, DESC = 0.2;

const icone = (cor, x = 0, y = 0, esc = 1) =>
  `<g transform="translate(${x} ${y}) scale(${esc}) translate(${-IX} ${-IY})" fill="${cor}">${ICONE_PATHS.map(d => `<path d="${d}"/>`).join('')}</g>`;
const texto = (l, cor, x, base, s) =>
  `<path fill="${cor}" transform="translate(${x.toFixed(2)} ${base.toFixed(2)}) scale(${(s / UPM).toFixed(6)})" d="${l.d}"/>`;

// Cada versão devolve { w, h, corpo(cor) } em unidades do ícone.
const VERSOES = {
  logo: { nome: 'Logo (ícone)', w: IW, h: IH, corpo: cor => icone(cor) },
  horizontal: (() => {
    const s = 128, gap = X_UNID * 0.75;
    const tx = IW + gap;
    const meio = CORPO_H / 2;
    const b1 = meio + (XH * s - ENTRELINHA * s) / 2 + 0; // centro do bloco no centro do balão
    const b2 = b1 + ENTRELINHA * s;
    const larg = Math.max(...LINHAS.map(l => l.largura)) * s / UPM;
    return {
      nome: 'Logo + slogan (horizontal)', w: tx + larg, h: Math.max(IH, b2 + DESC * s),
      corpo: cor => icone(cor) + texto(LINHAS[0], cor, tx, b1, s) + texto(LINHAS[1], cor, tx, b2, s),
    };
  })(),
  vertical: (() => {
    const s = 104;
    const larg = LINHAS.map(l => l.largura * s / UPM);
    const w = Math.max(IW, ...larg);
    const b1 = IH + X_UNID * 0.6 + XH * s;
    const b2 = b1 + ENTRELINHA * s;
    return {
      nome: 'Logo + slogan (vertical)', w, h: b2 + DESC * s,
      corpo: cor => icone(cor, (w - IW) / 2) + texto(LINHAS[0], cor, (w - larg[0]) / 2, b1, s) + texto(LINHAS[1], cor, (w - larg[1]) / 2, b2, s),
    };
  })(),
};

// Nome "Promptado" composto em Geist Bold (o logotipo oficial não foi enviado) e slogan em uma linha.
const NOME = linha('Promptado', 700, -0.04);
const SLOGAN1 = linha(SLOGAN.join(' '));
const CAP = NOME.capHeight / UPM;
const larguraDe = (l, s) => l.largura * s / UPM;

VERSOES.nome = (() => {
  const s = 300, base = CAP * s;
  return { nome: 'Nome', w: larguraDe(NOME, s), h: base + DESC * s, corpo: cor => texto(NOME, cor, 0, base, s) };
})();

// Bloco nome + slogan com a mesma largura (o slogan se ajusta à largura do nome).
function blocoNomeSlogan(sN) {
  const wN = larguraDe(NOME, sN);
  const sS = sN * NOME.largura / SLOGAN1.largura;
  const b1 = CAP * sN, b2 = b1 + 0.34 * sN + CAP * sS;
  return { w: wN, topo: 0, base: b2, desc: b2 + DESC * sS, corpo: (cor, x, y) => texto(NOME, cor, x, y + b1, sN) + texto(SLOGAN1, cor, x, y + b2, sS) };
}
VERSOES.completo = (() => {
  const bl = blocoNomeSlogan(165);
  const tx = IW + X_UNID * 0.75;
  const y0 = CORPO_H / 2 - bl.base / 2;
  return { nome: 'Logo, nome e slogan (horizontal)', w: tx + bl.w, h: Math.max(IH, y0 + bl.desc),
    corpo: cor => icone(cor) + bl.corpo(cor, tx, y0) };
})();
VERSOES.completoVertical = (() => {
  const bl = blocoNomeSlogan(150);
  const w = Math.max(IW, bl.w);
  const y0 = IH + X_UNID * 0.6;
  return { nome: 'Logo, nome e slogan (vertical)', w, h: y0 + bl.desc,
    corpo: cor => icone(cor, (w - IW) / 2) + bl.corpo(cor, (w - bl.w) / 2, y0) };
})();

function svg(versao, cor, { pad = 0, largura } = {}) {
  const v = VERSOES[versao];
  const W = v.w + pad * 2, H = v.h + pad * 2;
  const dim = largura ? ` width="${largura}" height="${(largura * H / W).toFixed(2)}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${W.toFixed(2)} ${H.toFixed(2)}"${dim}>${v.corpo(cor)}</svg>`;
}

module.exports = { VERSOES, svg, X_UNID, IW, IH, SLOGAN };

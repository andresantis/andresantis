// Gera os catálogos de brindes (PDF) nos dois modelos e os arquivos de corte dos adesivos.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { VERSOES, svg } = require('./logos');

const PROJ = '/home/user/andresantis';
const SAIDA = path.join(PROJ, 'marca', 'brindes');

const C = { verde: '#22C55E', verdeTexto: '#16A34A', preto: '#000000', claro: '#F5F5F7', branco: '#FFFFFF',
  texto: '#1D1D1F', apoio: '#6E6E73', apoioEsc: '#A1A1A6', linha: '#D2D2D7' };

const fonte = f => fs.readFileSync(path.join(PROJ, 'public/fontes', f)).toString('base64');
const FONTES = `
@font-face{font-family:Geist;src:url(data:font/woff2;base64,${fonte('Geist-latin.woff2')}) format('woff2');font-weight:100 900;
unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Geist;src:url(data:font/woff2;base64,${fonte('Geist-latin-ext.woff2')}) format('woff2');font-weight:100 900;
unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}`;

// Logo centrado em (cx, cy). Tamanho por largura ou por altura.
function logoEm(versao, cor, cx, cy, { largura, altura }) {
  const v = VERSOES[versao];
  const l = largura ?? altura * v.w / v.h;
  const h = l * v.h / v.w;
  return `<g transform="translate(${(cx - l / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)})">${svg(versao, cor, { largura: l })}</g>`;
}

// Tecidos e materiais
const MAT = {
  preto: { base: '#1C1C1E', costura: '#0A0A0B', luz: '#2C2C2E', logo: C.claro },
  branco: { base: '#FAFAFA', costura: '#D2D2D7', luz: '#FFFFFF', logo: C.texto },
  verde: { base: C.verde, costura: '#179A48', luz: '#3DD472', logo: C.preto },
};
const sombra = '<defs><filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity=".14"/></filter></defs>';

// ---------- desenhos (escala aproximada indicada em px/cm) ----------
const TEE = 'M138 28 C160 44 240 44 262 28 L322 50 C340 58 352 70 362 86 L398 150 L344 178 L322 138 L324 420 C250 430 150 430 76 420 L78 138 L56 178 L2 150 L38 86 C48 70 60 58 78 50 Z';
function camiseta(m, aplic, { costas = false } = {}) { // 4,6 px/cm
  const k = MAT[m];
  const gola = costas
    ? `<path d="M138 28 C165 40 235 40 262 28" fill="none" stroke="${k.costura}" stroke-width="7"/>`
    : `<path d="M138 28 C165 40 235 40 262 28 C240 66 160 66 138 28 Z" fill="${k.costura}" opacity=".55"/><path d="M138 28 C160 66 240 66 262 28" fill="none" stroke="${k.costura}" stroke-width="7"/>`;
  return `<svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg">${sombra}
    <path d="${TEE}" fill="${k.base}" stroke="${k.costura}" stroke-width="2" filter="url(#sh)"/>${gola}
    <path d="M78 52 C84 90 80 120 78 138 M322 52 C316 90 320 120 322 138" fill="none" stroke="${k.costura}" stroke-width="2"/>
    <path d="M50 171 L8 149 M350 171 L392 149 M78 410 C150 420 250 420 322 410" fill="none" stroke="${k.costura}" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${aplic}</svg>`;
}
function polo(m, aplic) { // 4,6 px/cm
  const k = MAT[m];
  return `<svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg">${sombra}
    <path d="${TEE}" fill="${k.base}" stroke="${k.costura}" stroke-width="2" filter="url(#sh)"/>
    <path d="M138 28 C165 16 235 16 262 28 L262 36 C235 26 165 26 138 36 Z" fill="${k.costura}"/>
    <path d="M186 60 L214 60 L214 150 L186 150 Z" fill="${k.base}" stroke="${k.costura}" stroke-width="2"/>
    <circle cx="200" cy="88" r="4" fill="${k.costura}"/><circle cx="200" cy="120" r="4" fill="${k.costura}"/>
    <path d="M138 30 L202 62 L176 100 L128 44 Z" fill="${k.luz}" stroke="${k.costura}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M262 30 L198 62 L224 100 L272 44 Z" fill="${k.luz}" stroke="${k.costura}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M78 52 C84 90 80 120 78 138 M322 52 C316 90 320 120 322 138" fill="none" stroke="${k.costura}" stroke-width="2"/>
    <path d="M52 168 L6 145 M348 168 L394 145" stroke="${k.costura}" stroke-width="5"/>
    <path d="M78 410 C150 420 250 420 322 410" fill="none" stroke="${k.costura}" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${aplic}</svg>`;
}
const MOLETOM = 'M130 40 C150 60 250 60 270 40 L320 56 C346 64 356 84 362 110 L392 330 C394 345 386 352 372 352 L350 352 C340 352 334 346 333 336 L318 170 L322 420 C250 432 150 432 78 420 L82 170 L67 336 C66 346 60 352 50 352 L28 352 C14 352 6 345 8 330 L38 110 C44 84 54 64 80 56 Z';
function moletom(m, aplic, { costas = false } = {}) { // 4,2 px/cm
  const k = MAT[m];
  const capuz = costas
    ? `<path d="M118 42 C112 140 288 140 282 42 C255 62 145 62 118 42 Z" fill="${k.luz}" stroke="${k.costura}" stroke-width="2"/><path d="M200 56 L200 128" stroke="${k.costura}" stroke-width="1.5" stroke-dasharray="4 3"/>`
    : `<path d="M118 46 C112 6 288 6 282 46 C270 80 230 92 200 92 C170 92 130 80 118 46 Z" fill="${k.luz}" stroke="${k.costura}" stroke-width="2"/>
       <path d="M142 44 C142 20 258 20 258 44 C248 66 152 66 142 44 Z" fill="${k.costura}"/>
       <path d="M180 86 L174 168 M220 86 L226 168" stroke="${k.claroCordao ?? '#D2D2D7'}" stroke-width="3" stroke-linecap="round"/>
       <path d="M128 292 L272 292 L300 388 L100 388 Z" fill="none" stroke="${k.costura}" stroke-width="2"/>`;
  return `<svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg">${sombra}
    <path d="${MOLETOM}" fill="${k.base}" stroke="${k.costura}" stroke-width="2" filter="url(#sh)"/>
    <path d="M80 56 C86 100 84 140 82 170 M320 56 C314 100 316 140 318 170" fill="none" stroke="${k.costura}" stroke-width="2"/>
    <path d="M78 398 C150 410 250 410 322 398 M10 318 L64 322 M390 318 L336 322" fill="none" stroke="${k.costura}" stroke-width="2"/>
    ${capuz}${aplic}</svg>`;
}
function bone(m, aplic) { // 12 px/cm na frente
  const k = MAT[m];
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">${sombra}
    <path d="M70 226 C70 108 130 44 200 44 C270 44 330 108 330 226 Z" fill="${k.base}" stroke="${k.costura}" stroke-width="2" filter="url(#sh)"/>
    <path d="M200 46 C150 76 122 146 120 222 M200 46 C250 76 278 146 280 222" fill="none" stroke="${k.costura}" stroke-width="2"/>
    <circle cx="200" cy="46" r="7" fill="${k.costura}"/>
    <circle cx="112" cy="128" r="3.5" fill="${k.costura}"/><circle cx="288" cy="128" r="3.5" fill="${k.costura}"/>
    <path d="M62 220 C120 208 280 208 338 220 C352 226 352 240 340 250 C290 302 110 302 60 250 C48 240 48 226 62 220 Z" fill="${k.luz}" stroke="${k.costura}" stroke-width="2"/>
    <path d="M76 246 C130 286 270 286 324 246" fill="none" stroke="${k.costura}" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${aplic}</svg>`;
}
function caderno(aplic) { // A5, 14 px/cm
  return `<svg viewBox="0 0 330 400" xmlns="http://www.w3.org/2000/svg">${sombra}
    <rect x="66" y="56" width="207" height="294" rx="8" fill="#E5E5EA"/>
    <rect x="60" y="50" width="207" height="294" rx="10" fill="#161618" filter="url(#sh)"/>
    <rect x="60" y="50" width="14" height="294" rx="6" fill="#0A0A0B"/>
    <rect x="236" y="50" width="9" height="294" fill="#000"/>
    ${aplic}</svg>`;
}
function caneta(aplic) { // 30 px/cm
  return `<svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg">${sombra}
    <g filter="url(#sh)">
      <path d="M34 85 L82 70 L82 100 Z" fill="#A1A1A6"/><circle cx="34" cy="85" r="2.5" fill="#6E6E73"/>
      <rect x="80" y="68" width="400" height="34" rx="10" fill="#1D1D1F"/>
      <rect x="470" y="66" width="86" height="38" rx="14" fill="#1D1D1F"/>
      <rect x="474" y="66" width="3" height="38" fill="#3A3A3C"/>
      <path d="M450 56 L552 56 C562 56 566 62 560 70 L450 70 Z" fill="#A1A1A6"/>
    </g>
    <rect x="80" y="72" width="400" height="5" rx="2" fill="#fff" opacity=".07"/>
    ${aplic}</svg>`;
}
// Adesivos: dimensões em mm, sangria de 2 mm, linha de corte magenta (CutContour).
const ADESIVOS = {
  logo: [
    { id: 'adesivo-logo-circulo-verde', nome: 'Redondo verde', w: 50, h: 50, r: 25, fundo: C.verde, cor: C.preto, versao: 'logo', alt: 28 },
    { id: 'adesivo-logo-quadrado-preto', nome: 'Quadrado preto', w: 50, h: 50, r: 9, fundo: C.preto, cor: C.claro, versao: 'logo', alt: 28 },
  ],
  nome: [
    { id: 'adesivo-nome-preto', nome: 'Retangular preto', w: 90, h: 35, r: 9, fundo: C.preto, cor: C.claro, versao: 'nome', larg: 66 },
    { id: 'adesivo-nome-verde', nome: 'Retangular verde', w: 90, h: 35, r: 9, fundo: C.verde, cor: C.preto, versao: 'nome', larg: 66 },
  ],
  completo: [
    { id: 'adesivo-completo-horizontal-preto', nome: 'Retangular preto', w: 110, h: 45, r: 9, fundo: C.preto, cor: C.claro, versao: 'completo', larg: 92 },
    { id: 'adesivo-completo-vertical-verde', nome: 'Vertical verde', w: 70, h: 80, r: 9, fundo: C.verde, cor: C.preto, versao: 'completoVertical', larg: 52 },
  ],
  logoNome: [
    { id: 'adesivo-logo-nome-horizontal-preto', nome: 'Retangular preto', w: 100, h: 38, r: 9, fundo: C.preto, cor: C.claro, versao: 'logoNome', larg: 80 },
    { id: 'adesivo-logo-nome-vertical-verde', nome: 'Vertical verde', w: 60, h: 65, r: 9, fundo: C.verde, cor: C.preto, versao: 'logoNomeVertical', larg: 44 },
  ],
};
function adesivoArte(a, { corte = true, sangria = 2 } = {}) {
  const s = sangria, W = a.w + 2 * s, H = a.h + 2 * s;
  const logo = logoEm(a.versao, a.cor, W / 2, H / 2, a.alt ? { altura: a.alt } : { largura: a.larg });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
  <g id="arte"><rect x="0" y="0" width="${W}" height="${H}" rx="${a.r + s}" fill="${a.fundo}"/>${logo}</g>
  ${corte ? `<g id="CutContour"><rect x="${s}" y="${s}" width="${a.w}" height="${a.h}" rx="${a.r}" fill="none" stroke="#FF00FF" stroke-width="0.25"/></g>` : ''}
</svg>`;
}
// Troca a <svg> de fora por <g> (o logo dentro tem a sua própria <svg>).
const comoGrupo = s => s.trim().replace(/<svg[^>]*>/, '<g>').slice(0, -'</svg>'.length) + '</g>';
function adesivosCena(tipo) { // 3,4 px/mm
  const lista = ADESIVOS[tipo], e = 3.4;
  let x = 40; const partes = [];
  for (const [i, a] of lista.entries()) {
    const w = a.w * e, h = a.h * e;
    const y = 160 - h / 2 + (i ? 20 : -10);
    const rot = i ? 5 : -6;
    partes.push(`<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})" filter="url(#sh)">
      <rect x="-6" y="-6" width="${w + 12}" height="${h + 12}" rx="${(a.r + 1.8) * e}" fill="#fff"/>
      <g transform="scale(${e}) translate(-2 -2)">${comoGrupo(adesivoArte(a, { corte: false }))}</g></g>`);
    x += w + 60;
  }
  return `<svg viewBox="0 0 ${x - 20} 330" xmlns="http://www.w3.org/2000/svg">${sombra}${partes.join('')}</svg>`;
}

// ---------- especificações por modelo ----------
const PASTA = { logo: 'logo', nome: 'nome', completo: 'logo-nome-slogan-horizontal', completoVertical: 'logo-nome-slogan-vertical', logoNome: 'logo-nome-horizontal', logoNomeVertical: 'logo-nome-vertical' };
const DESC_V = { logo: 'Ícone', nome: 'Nome Promptado', completo: 'Logo, nome e slogan horizontal', completoVertical: 'Logo, nome e slogan vertical', logoNome: 'Logo e nome horizontal', logoNomeVertical: 'Logo e nome vertical' };
const MODELOS = {
  logo: { sub: 'Modelo 1 · Logo', capa: ['logo', 150], arquivo: 'brindes-promptado-1-logo' },
  nome: { sub: 'Modelo 2 · Nome', capa: ['nome', 420], arquivo: 'brindes-promptado-2-nome' },
  completo: { sub: 'Modelo 3 · Logo, nome e slogan', capa: ['completoVertical', 300], arquivo: 'brindes-promptado-3-logo-nome-slogan' },
  logoNome: { sub: 'Modelo 4 · Logo e nome', capa: ['logoNomeVertical', 260], arquivo: 'brindes-promptado-4-logo-nome' },
};
// Aplicação: versão, posição no desenho, tamanho em px e o texto do tamanho real.
// Escalas: camiseta/polo 4,6 px/cm · moletom 4,2 · boné 12 · caderno 14 · caneta 30.
const A = (versao, cx, cy, tam, txt) => ({ versao, cx, cy, tam, txt });
const APLIC = {
  logo: {
    caderno: A('logo', 155, 197, { altura: 70 }, '5 cm de altura'),
    caneta: A('logo', 410, 85, { altura: 22 }, '8 mm de altura'),
    moletomF: A('logo', 255, 150, { altura: 29 }, '7 cm de altura'),
    moletomC: A('logo', 200, 230, { altura: 105 }, '25 cm de altura'),
    camiseta: A('logo', 200, 160, { altura: 46 }, '10 cm de altura'),
    polo: A('logo', 255, 140, { altura: 23 }, '5 cm de altura'),
    bone: A('logo', 200, 150, { altura: 66 }, '5,5 cm de altura'),
  },
  nome: {
    caderno: A('nome', 155, 197, { largura: 126 }, '9 cm de largura'),
    caneta: A('nome', 380, 85, { largura: 135 }, '4,5 cm de largura'),
    moletomF: A('nome', 258, 150, { largura: 38 }, '9 cm de largura'),
    moletomC: A('nome', 200, 220, { largura: 126 }, '30 cm de largura'),
    camiseta: A('nome', 200, 155, { largura: 110 }, '24 cm de largura'),
    polo: A('nome', 258, 140, { largura: 41 }, '9 cm de largura'),
    bone: A('nome', 200, 150, { largura: 132 }, '11 cm de largura'),
  },
  completo: {
    caderno: A('completoVertical', 155, 190, { largura: 112 }, '8 cm de largura'),
    caneta: A('nome', 380, 85, { largura: 135 }, '4,5 cm de largura'),
    moletomF: A('logo', 255, 150, { altura: 29 }, '7 cm de altura'),
    moletomC: A('completoVertical', 200, 235, { largura: 109 }, '26 cm de largura'),
    camiseta: A('completo', 200, 155, { largura: 110 }, '24 cm de largura'),
    polo: A('completo', 262, 140, { largura: 55 }, '12 cm de largura'),
    bone: A('completo', 200, 150, { largura: 132 }, '11 cm de largura'),
  },
  logoNome: {
    caderno: A('logoNomeVertical', 155, 192, { largura: 112 }, '8 cm de largura'),
    caneta: A('logoNome', 385, 85, { largura: 114 }, '3,8 cm de largura'),
    moletomF: A('logoNome', 258, 150, { largura: 38 }, '9 cm de largura'),
    moletomC: A('logoNomeVertical', 200, 230, { largura: 109 }, '26 cm de largura'),
    camiseta: A('logoNome', 200, 155, { largura: 110 }, '24 cm de largura'),
    polo: A('logoNome', 260, 140, { largura: 41 }, '9 cm de largura'),
    bone: A('logoNome', 200, 150, { largura: 132 }, '11 cm de largura'),
  },
};
const arqDe = (a, cor) => `<code>${PASTA[a.versao]}/svg/…-${cor}.svg</code>`;
const aplicar = (a, cor) => logoEm(a.versao, cor, a.cx, a.cy, a.tam);

function itens(tipo) {
  const ap = APLIC[tipo];
  const C3 = tipo === 'completo';
  return [
    {
      nome: 'Adesivos', desenho: [adesivosCena(tipo)],
      specs: ADESIVOS[tipo].map(a => { const cm = n => String(n / 10).replace('.', ','); return [a.nome, a.r === a.w / 2 ? `Ø ${cm(a.w)} cm` : `${cm(a.w)} × ${cm(a.h)} cm`]; }).concat([
        ['Material', 'Vinil adesivo branco, laminação fosca'], ['Corte', 'Especial, na linha magenta do arquivo'],
        ['Arquivos', `<code>brindes/adesivos/</code> (SVG e PDF, com sangria de 2 mm)`]]),
      nota: 'A linha de corte está numa camada separada chamada CutContour, em magenta. A sangria de 2 mm já está no arquivo.',
    },
    {
      nome: 'Caderno', desenho: [caderno(aplicar(ap.caderno, C.claro))],
      specs: [['Modelo', 'A5 (14,8 × 21 cm), capa dura preta, elástico preto'], ['Aplicação', `${DESC_V[ap.caderno.versao]}, centro da capa`],
        ['Tamanho', ap.caderno.txt], ['Cor', 'Claro #F5F5F7 (branco gelo)'], ['Técnica', 'Hot stamping branco ou serigrafia'], ['Arquivo', arqDe(ap.caderno, 'claro')]],
    },
    {
      nome: 'Caneta', desenho: [caneta(aplicar(ap.caneta, C.claro))],
      specs: [['Modelo', 'Corpo preto fosco, clipe metálico'], ['Aplicação', `${DESC_V[ap.caneta.versao]} na lateral do corpo`], ['Tamanho', ap.caneta.txt],
        ['Cor', 'Claro #F5F5F7'], ['Técnica', 'Tampografia branca ou gravação a laser'], ['Arquivo', arqDe(ap.caneta, 'claro')]],
      nota: C3 ? 'A caneta leva só o nome neste modelo: o corpo tem cerca de 1 cm de altura e, nesse tamanho, o slogan ficaria ilegível.' : '',
    },
    {
      nome: 'Moletom', desenho: [moletom('preto', aplicar(ap.moletomF, C.claro)), moletom('preto', aplicar(ap.moletomC, C.claro), { costas: true })],
      legendas: ['Frente', 'Costas'],
      specs: [['Modelo', 'Moletom canguru com capuz, preto'], ['Frente', `${DESC_V[ap.moletomF.versao]} no peito esquerdo, ${ap.moletomF.txt}, bordado`],
        ['Costas', `${DESC_V[ap.moletomC.versao]}, centralizado, ${ap.moletomC.txt}, serigrafia`],
        ['Cor', 'Claro #F5F5F7 (linha e tinta branco gelo)'], ['Arquivos', `${arqDe(ap.moletomF, 'claro')} e ${arqDe(ap.moletomC, 'claro')}`]],
    },
    {
      nome: 'Camiseta', desenho: [camiseta('branco', aplicar(ap.camiseta, C.texto))],
      specs: [['Modelo', 'Camiseta gola careca, branca, 100% algodão'], ['Aplicação', `${DESC_V[ap.camiseta.versao]}, centro do peito`],
        ['Tamanho', ap.camiseta.txt], ['Cor', 'Grafite #1D1D1F'], ['Técnica', 'Serigrafia (silk) ou DTF'], ['Arquivo', arqDe(ap.camiseta, 'escuro')]],
    },
    {
      nome: 'Camiseta polo', desenho: [polo('preto', aplicar(ap.polo, C.claro))],
      specs: [['Modelo', 'Polo piquet, preta'], ['Aplicação', `${DESC_V[ap.polo.versao]} no peito esquerdo`],
        ['Tamanho', ap.polo.txt], ['Cor', 'Claro #F5F5F7 (linha branco gelo)'], ['Técnica', C3 ? 'DTF (transfer) de alta definição' : 'Bordado'], ['Arquivo', arqDe(ap.polo, 'claro')]],
      nota: C3 ? 'Neste tamanho as letras do slogan ficam com cerca de 3,5 mm, pequenas demais para bordado. Por isso a técnica indicada é DTF.' : '',
    },
    {
      nome: 'Boné', desenho: [bone('verde', aplicar(ap.bone, C.preto))],
      specs: [['Modelo', 'Boné aba curva, 6 gomos, verde'], ['Aplicação', `${DESC_V[ap.bone.versao]} na frente, centralizado`],
        ['Tamanho', ap.bone.txt], ['Cor', 'Preto #000000'], ['Técnica', C3 ? 'Patch emborrachado (silicone) ou DTF' : 'Bordado'],
        ['Tecido', 'Verde o mais próximo possível de #22C55E. Peça a cartela ao fornecedor.'], ['Arquivo', arqDe(ap.bone, 'preto')]],
      nota: 'Sobre o verde, a marca é sempre preta (regra da marca).' + (C3 ? ' O slogan fica pequeno demais para bordado, por isso o patch.' : ''),
    },
  ];
}

// ---------- páginas ----------
const pagina = (conteudo, { escura = false, num, titulo } = {}) => `
<section class="pg${escura ? ' esc' : ''}">
  ${titulo ? `<header><span class="rot"><i></i>${titulo}</span><span class="marca">Promptado · Brindes</span></header>` : ''}
  <div class="miolo">${conteudo}</div>
  ${num ? `<footer>${num}</footer>` : ''}
</section>`;

function catalogo(tipo) {
  const M = MODELOS[tipo];
  const lista = itens(tipo);
  const pgs = [];
  pgs.push(pagina(`<div class="capa">
      <div>${svg(M.capa[0], C.claro, { largura: M.capa[1] })}</div>
      <div><h1>Brindes</h1><p class="sub">${M.sub}</p>
      <p class="meta">Promptado · Especificações para produção · Outubro de 2026</p></div></div>`, { escura: true }));
  pgs.push(pagina(`<div class="visao">${lista.map((it, i) => `
      <figure><div class="mini">${it.desenho[0]}</div><figcaption><span>${String(i + 3).padStart(2, '0')}</span>${it.nome}</figcaption></figure>`).join('')}</div>`,
  { num: '02', titulo: 'Visão geral' }));
  lista.forEach((it, i) => {
    const desenhos = it.desenho.map((d, j) => `<div class="palco-item">${d}${it.legendas ? `<span class="leg">${it.legendas[j]}</span>` : ''}</div>`).join('');
    pgs.push(pagina(`<div class="item">
        <div class="palco ${it.desenho.length > 1 ? 'dois' : ''}">${desenhos}</div>
        <div><h2>${it.nome}</h2>
          <table class="tab">${it.specs.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>
          ${it.nota ? `<p class="nota">${it.nota}</p>` : ''}</div></div>`,
    { num: String(i + 3).padStart(2, '0'), titulo: it.nome }));
  });
  pgs.push(pagina(`<div><h2>Antes de produzir</h2>
    <ol class="regras">
      <li><span>1</span><div><b>Use sempre os arquivos em vetor (SVG ou PDF).</b><p>Estão em <code>arquivos/</code> (logos) e <code>brindes/adesivos/</code> (adesivos com corte). PNG só para visualização.</p></div></li>
      <li><span>2</span><div><b>Peça prova ou amostra de cada peça.</b><p>Principalmente do verde (boné e adesivos) e dos bordados pequenos.</p></div></li>
      <li><span>3</span><div><b>O logo nunca muda de cor fora do previsto.</b><p>Claro sobre preto, grafite sobre branco, preto sobre verde. Nunca verde.</p></div></li>
      <li><span>4</span><div><b>Respeite a área de proteção e os tamanhos mínimos do manual.</b><p>Ícone: 8 mm de altura. Nome: 2,5 cm de largura. Logo e nome: 3 cm (horizontal) ou 2 cm (vertical) de largura. Logo, nome e slogan: 5 cm (horizontal) ou 3 cm (vertical) de largura. Abaixo disso, use o ícone ou o nome.</p></div></li>
    </ol>
    <p class="nota">Os desenhos das peças são ilustrativos. Tamanhos e posições valem para a grade M; ajuste proporcionalmente nas outras grades.</p></div>`,
  { num: String(lista.length + 3).padStart(2, '0'), titulo: 'Antes de produzir' }));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Promptado · Brindes</title><style>${CSS}</style></head><body>${pgs.join('')}</body></html>`;
}

const CSS = `${FONTES}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Geist,sans-serif;color:${C.texto};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;background:${C.claro};padding:14mm 16mm;display:flex;flex-direction:column;page-break-after:always;overflow:hidden;position:relative}
.pg.esc{background:${C.preto};color:${C.claro}}
header{display:flex;justify-content:space-between;align-items:center;padding-bottom:5mm;border-bottom:1px solid ${C.linha};margin-bottom:8mm}
.rot{font-size:11pt;font-weight:600;letter-spacing:-.01em;display:inline-flex;align-items:center;gap:8px}
.rot i{width:8px;height:8px;border-radius:50%;background:${C.verde};display:inline-block}
.marca{font-size:9pt;color:${C.apoio};font-weight:500}
footer{position:absolute;bottom:10mm;right:16mm;font-size:9pt;color:${C.apoio};font-weight:500}
.miolo{flex:1;display:flex;flex-direction:column;justify-content:center}
h1{font-size:54pt;font-weight:700;letter-spacing:-.04em;line-height:1;color:${C.claro}}
h2{font-size:26pt;font-weight:700;letter-spacing:-.035em;line-height:1.08;margin-bottom:6mm}
.capa{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:6mm 0}
.capa .sub{font-size:20pt;font-weight:600;letter-spacing:-.03em;color:${C.verde};margin-top:4mm}
.capa .meta{font-size:10pt;color:${C.apoioEsc};margin-top:6mm;font-weight:500}
.visao{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.visao figure{display:flex;flex-direction:column;gap:2.5mm}
.mini{background:#fff;border-radius:4mm;height:58mm;display:flex;align-items:center;justify-content:center;padding:5mm}
.mini svg{max-width:100%;max-height:100%}
.visao figcaption{font-size:11pt;font-weight:600;letter-spacing:-.01em}
.visao figcaption span{color:${C.apoio};font-weight:500;margin-right:3mm}
.item{display:grid;grid-template-columns:1.25fr 1fr;gap:12mm;align-items:center}
.palco{background:#fff;border-radius:6mm;height:140mm;display:flex;align-items:center;justify-content:center;gap:4mm;padding:8mm}
.palco-item{position:relative;flex:1;height:100%;display:flex;align-items:center;justify-content:center}
.palco-item svg{max-width:100%;max-height:100%}
.leg{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-size:9pt;color:${C.apoio};font-weight:500}
.tab{border-collapse:collapse;width:100%;font-size:10.5pt}
.tab td{padding:2.6mm 3mm 2.6mm 0;border-bottom:1px solid ${C.linha};font-weight:500;vertical-align:top;line-height:1.4}
.tab td:first-child{font-weight:600;width:28mm}
code{font-family:ui-monospace,Menlo,monospace;font-size:.88em;background:#fff;border:1px solid ${C.linha};border-radius:4px;padding:0 4px}
.nota{font-size:9pt;line-height:1.45;color:${C.apoio};font-weight:500;margin-top:4mm}
.regras{list-style:none;display:flex;flex-direction:column;gap:5mm;max-width:200mm}
.regras li{display:flex;gap:5mm;align-items:flex-start}
.regras li>span{flex:none;width:9mm;height:9mm;border-radius:50%;border:1px solid ${C.linha};background:#fff;font-size:10pt;font-weight:600;display:flex;align-items:center;justify-content:center}
.regras b{font-size:13pt;font-weight:600;letter-spacing:-.015em}
.regras p{font-size:10.5pt;color:${C.apoio};font-weight:500;margin-top:1mm}
`;

(async () => {
  const dirAd = path.join(SAIDA, 'adesivos');
  for (const f of ['svg', 'pdf']) fs.mkdirSync(path.join(dirAd, f), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const a of Object.values(ADESIVOS).flat()) {
    const s = adesivoArte(a);
    fs.writeFileSync(path.join(dirAd, 'svg', a.id + '.svg'), s);
    await p.setContent(`<style>@page{margin:0}html,body{margin:0}svg{display:block}</style>${s}`);
    await p.pdf({ path: path.join(dirAd, 'pdf', a.id + '.pdf'), width: (a.w + 4) + 'mm', height: (a.h + 4) + 'mm', pageRanges: '1', printBackground: true });
  }
  for (const [tipo, { arquivo: nome }] of Object.entries(MODELOS)) {
    const html = catalogo(tipo);
    await p.setViewportSize({ width: 1123, height: 794 });
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(SAIDA, nome + '.pdf'), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
    const n = await p.locator('section.pg').count();
    for (let i = 0; i < n; i++) await p.locator('section.pg').nth(i).screenshot({ path: path.join(__dirname, `br-${tipo}-${i + 1}.png`) });
  }
  await b.close();
  console.log('ok');
})();

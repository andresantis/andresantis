// Gera os dois brandbooks (PDF) e os arquivos de logo para produção.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { VERSOES, svg, X_UNID, IW, IH, SLOGAN } = require('./logos');

const PROJ = '/home/user/andresantis';
const SAIDA = path.join(PROJ, 'marca');
const ARQ = path.join(SAIDA, 'arquivos');

const fonte = f => fs.readFileSync(path.join(PROJ, 'public/fontes', f)).toString('base64');
const FONTES = `
@font-face{font-family:Geist;src:url(data:font/woff2;base64,${fonte('Geist-latin.woff2')}) format('woff2');font-weight:100 900;
unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Geist;src:url(data:font/woff2;base64,${fonte('Geist-latin-ext.woff2')}) format('woff2');font-weight:100 900;
unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}`;

// Cores do site promptado-brand.vercel.app/marca (copiadas em src/marca.ts).
const C = { verde: '#22C55E', verdeTexto: '#16A34A', preto: '#000000', claro: '#F5F5F7', branco: '#FFFFFF',
  sup: '#161618', texto: '#1D1D1F', apoio: '#6E6E73', apoioEsc: '#A1A1A6', linha: '#D2D2D7', linhaEsc: '#2C2C2E' };

const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function cmyk(h) {
  const [r, g, b] = rgb(h).map(v => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return [0, 0, 0, 100];
  return [...[r, g, b].map(v => Math.round((1 - v - k) / (1 - k) * 100)), Math.round(k * 100)];
}

const CORES_LOGO = [
  { id: 'escuro', cor: C.texto, nome: 'Grafite #1D1D1F', uso: 'sobre fundos claros e brancos' },
  { id: 'claro', cor: C.claro, nome: 'Claro #F5F5F7', uso: 'sobre fundo preto e fotos escuras' },
  { id: 'preto', cor: C.preto, nome: 'Preto #000000', uso: 'sobre o verde e impressão a 1 cor' },
];

// ---------- páginas ----------
const pagina = (conteudo, { escura = false, num, titulo } = {}) => `
<section class="pg${escura ? ' esc' : ''}">
  ${titulo ? `<header><span class="rot"><i></i>${titulo}</span><span class="marca">Promptado · Manual de marca</span></header>` : ''}
  <div class="miolo">${conteudo}</div>
  ${num ? `<footer><span>${num}</span></footer>` : ''}
</section>`;

function capa(tipo) {
  const v = tipo === 'logo' ? 'logo' : 'vertical';
  return pagina(`
    <div class="capa">
      <div class="capa-logo">${svg(v, C.claro, { largura: tipo === 'logo' ? 150 : 300 })}</div>
      <div class="capa-txt">
        <h1>Manual de marca</h1>
        <p class="sub">${tipo === 'logo' ? 'Versão 1 · Logo' : 'Versão 2 · Logo e slogan'}</p>
        <p class="meta">Promptado · Arquivo para produção · Outubro de 2026</p>
      </div>
    </div>`, { escura: true });
}

function intro(tipo) {
  const itens = tipo === 'logo'
    ? ['O logo', 'Área de proteção e tamanho mínimo', 'Logo sobre fundos', 'Cores', 'Tipografia', 'Regras da marca', 'Usos incorretos', 'Arquivos para produção']
    : ['Logo e slogan', 'Área de proteção e tamanho mínimo', 'Logo e slogan sobre fundos', 'Cores', 'Tipografia', 'Regras da marca', 'Usos incorretos', 'Arquivos para produção'];
  return pagina(`
    <div class="duas">
      <div>
        <h2>A Promptado coloca empresas nas respostas das inteligências artificiais.</h2>
        <p class="txt">Pioneira no Brasil em GEO e AEO. Este manual reúne o que a produção precisa para aplicar a marca com consistência: ${tipo === 'logo' ? 'o logo' : 'o logo com o slogan'}, as cores, a fonte e as regras de uso.</p>
        <p class="txt">Na dúvida, use menos: fundo limpo, logo em uma cor e no máximo dois ou três elementos verdes por peça.</p>
      </div>
      <ol class="indice">${itens.map((t, i) => `<li><span>${String(i + 3).padStart(2, '0')}</span>${t}</li>`).join('')}</ol>
    </div>`, { num: '02', titulo: 'Sobre este manual' });
}

function paginaLogo(tipo) {
  if (tipo === 'logo') {
    return pagina(`
      <div class="duas larga-esq">
        <div class="palco claro">${svg('logo', C.texto, { largura: 230 })}</div>
        <div>
          <h2>O logo</h2>
          <p class="txt">Um balão de conversa com um cursor dentro: a marca aparecendo dentro da resposta. É a assinatura principal da Promptado.</p>
          <p class="txt">O logo é sempre de <b>uma cor só</b>, na cor de texto da peça. Ele nunca é verde, nunca leva degradê e nunca é redesenhado.</p>
          <p class="nota">Arquivo: <code>logo/promptado-logo-*.svg</code></p>
        </div>
      </div>`, { num: '03', titulo: 'O logo' });
  }
  return pagina(`
    <div class="grade2">
      <div class="palco claro alto">${svg('horizontal', C.texto, { largura: 420 })}<span class="leg">Horizontal · principal</span></div>
      <div class="palco claro alto">${svg('vertical', C.texto, { largura: 230 })}<span class="leg">Vertical · formatos quadrados e altos</span></div>
    </div>
    <div class="linha-txt">
      <p class="txt"><b>Slogan:</b> “${SLOGAN.join(' ')}”. Sempre em duas linhas, com a quebra depois de “nas”, em letras minúsculas (só “IAs” em maiúsculas). Fonte Geist Semibold, já convertida em contorno nos arquivos.</p>
      <p class="txt">Ícone e slogan formam uma peça só: não mude a distância nem a proporção entre eles. Quando o slogan ficar pequeno demais para ler, use só o ícone.</p>
    </div>`, { num: '03', titulo: 'Logo e slogan' });
}

// Diagrama da área de proteção: logo com moldura tracejada a 1x de distância.
function protecao(versao, largura) {
  const v = VERSOES[versao];
  const esc = largura / v.w;
  const x = X_UNID * esc;
  const W = largura + 2 * x, H = v.h * esc + 2 * x;
  return `<div class="prot" style="width:${W}px;height:${H}px">
    <div class="prot-area" style="inset:0"></div>
    <div style="position:absolute;left:${x}px;top:${x}px">${svg(versao, C.texto, { largura })}</div>
    <span class="xm" style="left:0;top:${H / 2 - 9}px;width:${x}px">x</span>
    <span class="xm" style="left:${x + largura / 2 - 6}px;top:0;height:${x}px;line-height:${x}px;width:12px">x</span>
  </div>`;
}

function paginaProtecao(tipo) {
  const versoes = tipo === 'logo' ? [['logo', 190]] : [['horizontal', 360], ['vertical', 170]];
  const minimos = tipo === 'logo'
    ? [['Ícone', '8 mm de altura', '32 px de altura']]
    : [['Horizontal', '40 mm de largura', '200 px de largura'], ['Vertical', '22 mm de largura', '120 px de largura'], ['Abaixo disso', 'use só o ícone', 'use só o ícone']];
  return pagina(`
    <div class="duas larga-esq">
      <div class="prot-lista">${versoes.map(([v, l]) => protecao(v, l)).join('')}</div>
      <div>
        <h2>Área de proteção</h2>
        <p class="txt">Ao redor do logo fica um espaço livre de <b>x</b>, onde não entra texto, borda nem outro elemento. <b>x</b> é a largura do cursor dentro do balão (cerca de um terço da largura do ícone).</p>
        <h3>Tamanho mínimo</h3>
        <table class="tab"><tr><th></th><th>Impresso</th><th>Digital</th></tr>
          ${minimos.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>
        <p class="nota">Tamanhos mínimos recomendados para produção. Abaixo deles o desenho perde leitura.</p>
      </div>
    </div>`, { num: '04', titulo: 'Área de proteção e tamanho mínimo' });
}

function paginaFundos(tipo) {
  const v = tipo === 'logo' ? 'logo' : 'horizontal';
  const larg = tipo === 'logo' ? 90 : 185;
  const fundos = [
    ['Fundo claro #F5F5F7', C.claro, C.texto, 'borda'],
    ['Fundo branco #FFFFFF', C.branco, C.texto, 'borda'],
    ['Fundo preto #000000', C.preto, C.claro, ''],
    ['Fundo verde #22C55E', C.verde, C.preto, ''],
  ];
  return pagina(`
    <div class="grade4">${fundos.map(([n, f, c, cl]) => `
      <figure><div class="amostra ${cl}" style="background:${f}">${svg(v, c, { largura: larg })}</div>
      <figcaption>${n}<br><span>logo em ${c === C.texto ? 'grafite #1D1D1F' : c === C.claro ? 'claro #F5F5F7' : 'preto #000000'}</span></figcaption></figure>`).join('')}
    </div>
    <p class="txt larga">Use sempre o logo na cor de texto do fundo. Sobre o verde, o logo e qualquer texto são <b>pretos</b>. Sobre fotos, só em áreas lisas e com bom contraste.</p>`,
  { num: '05', titulo: tipo === 'logo' ? 'Logo sobre fundos' : 'Logo e slogan sobre fundos' });
}

function swatch(nome, hex, uso, borda) {
  const [r, g, b] = rgb(hex); const [c, m, y, k] = cmyk(hex);
  return `<div class="sw"><div class="sw-cor${borda ? ' borda' : ''}" style="background:${hex}"></div>
    <div class="sw-info"><b>${nome}</b><span>HEX ${hex}</span><span>RGB ${r} ${g} ${b}</span><span>CMYK ${c} ${m} ${y} ${k}*</span><em>${uso}</em></div></div>`;
}

function paginaCores() {
  return pagina(`
    <div class="cores-top">
      ${swatch('Verde Promptado', C.verde, 'Única cor de marca. Botões, selos e áreas de destaque.')}
      ${swatch('Preto', C.preto, 'Fundo escuro e texto sobre o verde.')}
      ${swatch('Claro', C.claro, 'Fundo claro e texto no escuro.', true)}
      ${swatch('Grafite', C.texto, 'Texto, logo e ícones no claro.')}
    </div>
    <div class="cores-sec">
      ${swatch('Verde para texto', C.verdeTexto, 'Palavras e números em verde sobre fundo claro (a partir de 24 px).')}
      ${swatch('Superfície escura', C.sup, 'Cards e caixas no escuro.')}
      ${swatch('Apoio', C.apoio, 'Rótulos e rodapé no claro (#A1A1A6 no escuro).')}
      ${swatch('Linha', C.linha, 'Divisórias de 1 px no claro (#2C2C2E no escuro).', true)}
    </div>
    <p class="nota">* CMYK convertido direto do RGB, como ponto de partida. Peça prova de cor à gráfica antes de imprimir, principalmente para o verde. O site da marca não define Pantone.</p>`,
  { num: '06', titulo: 'Cores' });
}

function paginaTipo() {
  const escala = [['Número de destaque', '260', 'Bold 700', '−6%'], ['Título de capa', '100', 'Bold 700', '−4%'], ['Título', '84', 'Bold 700', '−3,5%'],
    ['Citação', '56 a 72', 'Semibold 600', '−3%'], ['Apoio', '36', 'Medium 500', '−1%'], ['Categoria', '30', 'Semibold 600', '−1%'], ['Rodapé', '28', 'Medium 500', '0']];
  return pagina(`
    <div class="duas">
      <div>
        <div class="tipo-g">Aa</div>
        <p class="tipo-nome">Geist</p>
        <p class="txt">A fonte da marca e do site. Gratuita (licença OFL), disponível no Google Fonts. Títulos levam sempre espaçamento negativo entre as letras.</p>
        <div class="pesos"><span style="font-weight:500">Medium 500</span><span style="font-weight:600">Semibold 600</span><span style="font-weight:700">Bold 700</span></div>
      </div>
      <div>
        <h3>Escala (peças de 1080 px de largura)</h3>
        <table class="tab"><tr><th>Estilo</th><th>Tamanho</th><th>Peso</th><th>Espaço</th></tr>
          ${escala.map(r => `<tr><td>${r[0]}</td><td>${r[1]} px</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>
        <p class="nota">Em outros formatos, mantenha a proporção entre os tamanhos.</p>
      </div>
    </div>`, { num: '07', titulo: 'Tipografia' });
}

function paginaRegras() {
  const regras = [
    ['Uma cor de marca: o verde.', 'Roxo, azul e outras cores não entram nas peças da Promptado.'],
    ['No máximo 2 ou 3 elementos verdes por peça.', 'Se precisar de mais destaques, os outros vão na cor de texto.'],
    ['Texto sobre o verde é sempre preto.', 'Nunca branco, nunca cinza.'],
    ['Fundo preto puro ou claro #F5F5F7.', 'Cards e caixas usam a cor de superfície.'],
    ['O logo não conta como elemento verde.', 'Ele fica sempre na cor de texto.'],
  ];
  return pagina(`
    <div class="duas larga-esq">
      <ol class="regras">${regras.map(([a, b], i) => `<li><span>${i + 1}</span><div><b>${a}</b><p>${b}</p></div></li>`).join('')}</ol>
      <div class="exemplo">
        <div class="ex-card">
          <span class="rot"><i></i>GEO e AEO</span>
          <p class="ex-tit">Sua empresa aparece quando o cliente pergunta pra IA?</p>
          <span class="botao">Fale com a gente</span>
        </div>
        <p class="nota">Exemplo: dois elementos verdes (ponto do rótulo e botão), texto preto sobre o verde.</p>
      </div>
    </div>`, { num: '08', titulo: 'Regras da marca' });
}

function paginaIncorretos(tipo) {
  const v = tipo === 'logo' ? 'logo' : 'horizontal';
  const l = tipo === 'logo' ? 70 : 170;
  const casos = [
    ['Não distorça', `<div style="transform:scaleX(1.45)">${svg(v, C.texto, { largura: l })}</div>`],
    ['Não gire', `<div style="transform:rotate(-14deg)">${svg(v, C.texto, { largura: l })}</div>`],
    ['Não use o logo em verde', svg(v, C.verde, { largura: l })],
    ['Não use outras cores', svg(v, '#7C3AED', { largura: l })],
    ['Não aplique sombra ou contorno', `<div style="filter:drop-shadow(4px 6px 3px rgba(0,0,0,.45))">${svg(v, C.texto, { largura: l })}</div>`],
    ['Não use em fundo sem contraste', `<div class="fake-fundo">${svg(v, '#3A3A3C', { largura: l })}</div>`],
  ];
  if (tipo !== 'logo') casos[5] = ['Não troque a fonte ou a quebra do slogan', `<div class="slogan-errado">${svg('logo', C.texto, { largura: 52 })}<span>Sua Marca Nas Respostas Das IAs</span></div>`];
  return pagina(`
    <div class="grade3">${casos.map(([t, h]) => `<figure><div class="amostra errado">${h}</div><figcaption><span class="nao">✕</span>${t}</figcaption></figure>`).join('')}</div>`,
  { num: '09', titulo: 'Usos incorretos' });
}

function paginaArquivos(tipo) {
  const grupos = tipo === 'logo'
    ? [['logo/', 'Ícone Promptado']]
    : [['logo-slogan-horizontal/', 'Logo e slogan, horizontal'], ['logo-slogan-vertical/', 'Logo e slogan, vertical'], ['logo/', 'Ícone sozinho (tamanhos pequenos)']];
  return pagina(`
    <div class="duas">
      <div>
        <h2>Arquivos para produção</h2>
        <table class="tab">
          <tr><th>Pasta</th><th>Conteúdo</th></tr>
          ${grupos.map(([p, t]) => `<tr><td><code>${p}</code></td><td>${t}</td></tr>`).join('')}
        </table>
        <h3>Cada pasta tem</h3>
        <table class="tab">
          <tr><td><code>.svg</code></td><td>Vetor. Use em gráfica, corte, bordado, sinalização e web.</td></tr>
          <tr><td><code>.pdf</code></td><td>Vetor. Para quem trabalha com Illustrator, InDesign ou envio direto à gráfica.</td></tr>
          <tr><td><code>.png</code></td><td>Imagem com fundo transparente, 3000 px de largura. Para apresentações e redes.</td></tr>
        </table>
      </div>
      <div>
        <h3>Em três cores</h3>
        <ul class="cores-arq">${CORES_LOGO.map(c => `<li><i style="background:${c.cor}"></i><div><b>-${c.id}</b> ${c.nome}<br><span>${c.uso}</span></div></li>`).join('')}</ul>
        <p class="nota">${tipo === 'logo' ? '' : 'O texto do slogan já está convertido em contorno: a gráfica não precisa ter a fonte instalada. '}A fonte Geist é gratuita no Google Fonts para os textos das peças.</p>
      </div>
    </div>`, { num: '10', titulo: 'Arquivos' });
}

const CSS = `${FONTES}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Geist,sans-serif;color:${C.texto};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;background:${C.claro};padding:14mm 16mm;display:flex;flex-direction:column;page-break-after:always;overflow:hidden;position:relative}
.pg.esc{background:${C.preto};color:${C.claro}}
header{display:flex;justify-content:space-between;align-items:center;padding-bottom:5mm;border-bottom:1px solid ${C.linha};margin-bottom:9mm}
.rot{font-size:11pt;font-weight:600;letter-spacing:-.01em;display:inline-flex;align-items:center;gap:8px}
.rot i{width:8px;height:8px;border-radius:50%;background:${C.verde};display:inline-block}
.marca{font-size:9pt;color:${C.apoio};font-weight:500}
footer{position:absolute;bottom:10mm;right:16mm;font-size:9pt;color:${C.apoio};font-weight:500}
.miolo{flex:1;display:flex;flex-direction:column;justify-content:center;gap:8mm}
h1{font-size:54pt;font-weight:700;letter-spacing:-.04em;line-height:1}
h2{font-size:26pt;font-weight:700;letter-spacing:-.035em;line-height:1.08;margin-bottom:6mm}
h3{font-size:13pt;font-weight:600;letter-spacing:-.01em;margin:6mm 0 3mm}
.txt{font-size:11.5pt;line-height:1.5;font-weight:500;color:#3A3A3C;margin-bottom:3.5mm;max-width:120mm}
.txt.larga{max-width:none}
.txt b{color:${C.texto};font-weight:600}
.nota{font-size:9pt;line-height:1.45;color:${C.apoio};font-weight:500;margin-top:3mm;max-width:130mm}
code{font-family:ui-monospace,Menlo,monospace;font-size:.9em;background:#fff;border:1px solid ${C.linha};border-radius:4px;padding:0 4px}
.capa{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:6mm 0}
.capa h1{color:${C.claro}}
.capa .sub{font-size:20pt;font-weight:600;letter-spacing:-.03em;color:${C.verde};margin-top:4mm}
.capa .meta{font-size:10pt;color:${C.apoioEsc};margin-top:6mm;font-weight:500}
.duas{display:grid;grid-template-columns:1fr 1fr;gap:16mm;align-items:center}
.duas.larga-esq{grid-template-columns:1.15fr 1fr}
.indice{list-style:none;border-top:1px solid ${C.linha}}
.indice li{display:flex;gap:6mm;padding:3.2mm 0;border-bottom:1px solid ${C.linha};font-size:12pt;font-weight:600;letter-spacing:-.01em}
.indice span{color:${C.apoio};font-weight:500;width:8mm}
.palco{background:#fff;border-radius:6mm;display:flex;align-items:center;justify-content:center;height:120mm;position:relative}
.palco.alto{height:105mm}
.leg{position:absolute;bottom:5mm;left:6mm;font-size:9pt;color:${C.apoio};font-weight:500}
.grade2{display:grid;grid-template-columns:1.5fr 1fr;gap:6mm}
.linha-txt{display:grid;grid-template-columns:1fr 1fr;gap:12mm}
.linha-txt .txt{max-width:none}
.prot-lista{display:flex;flex-direction:column;gap:8mm;align-items:center}
.prot{position:relative;background:#fff}
.prot-area{position:absolute;border:1px dashed ${C.verdeTexto};background:repeating-linear-gradient(45deg,rgba(34,197,94,.07) 0 6px,transparent 6px 12px)}
.xm{position:absolute;font-size:10pt;font-weight:600;color:${C.verdeTexto};text-align:center}
.tab{border-collapse:collapse;width:100%;font-size:10.5pt}
.tab th{text-align:left;font-weight:600;color:${C.apoio};font-size:9pt;padding:2mm 3mm 2mm 0;border-bottom:1px solid ${C.linha}}
.tab td{padding:2.6mm 3mm 2.6mm 0;border-bottom:1px solid ${C.linha};font-weight:500;vertical-align:top}
.tab td:first-child{font-weight:600}
.grade4{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.grade3{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm 6mm}
figure{display:flex;flex-direction:column;gap:3mm}
figcaption{font-size:10pt;font-weight:600;letter-spacing:-.01em;line-height:1.4}
figcaption span{font-weight:500;color:${C.apoio}}
.amostra{height:72mm;border-radius:4mm;display:flex;align-items:center;justify-content:center;overflow:hidden}
.grade3 .amostra{height:44mm;background:#fff}
.borda{border:1px solid ${C.linha}}
.nao{display:inline-block;width:18px;height:18px;border-radius:50%;background:${C.texto};color:#fff;font-size:10px;text-align:center;line-height:18px;margin-right:7px}
.fake-fundo{background:linear-gradient(135deg,#2C2C2E,#48484A);padding:12mm 18mm;border-radius:3mm}
.slogan-errado{display:flex;align-items:center;gap:10px}
.slogan-errado span{font-family:Georgia,serif;font-style:italic;font-size:13pt;width:120px;line-height:1.1}
.cores-top,.cores-sec{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.sw{background:#fff;border-radius:4mm;overflow:hidden}
.sw-cor{height:34mm}
.cores-sec .sw-cor{height:16mm}
.sw-cor.borda{border:0;border-bottom:1px solid ${C.linha}}
.sw-info{padding:3.5mm 4mm;display:flex;flex-direction:column;gap:1mm;font-size:9pt;font-weight:500}
.sw-info b{font-size:11pt;font-weight:600;letter-spacing:-.01em;margin-bottom:1mm}
.sw-info span{font-variant-numeric:tabular-nums;color:#3A3A3C}
.sw-info em{font-style:normal;color:${C.apoio};margin-top:1.5mm;line-height:1.35}
.tipo-g{font-size:150pt;font-weight:700;letter-spacing:-.06em;line-height:.9}
.tipo-nome{font-size:24pt;font-weight:700;letter-spacing:-.04em;margin:3mm 0 4mm}
.pesos{display:flex;gap:6mm;font-size:14pt;letter-spacing:-.02em;margin-top:2mm}
.regras{list-style:none;display:flex;flex-direction:column;gap:5mm}
.regras li{display:flex;gap:5mm;align-items:flex-start}
.regras li>span{flex:none;width:9mm;height:9mm;border-radius:50%;border:1px solid ${C.linha};background:#fff;font-size:10pt;font-weight:600;display:flex;align-items:center;justify-content:center}
.regras b{font-size:13pt;font-weight:600;letter-spacing:-.015em}
.regras p{font-size:10.5pt;color:${C.apoio};font-weight:500;margin-top:1mm}
.ex-card{background:${C.preto};color:${C.claro};border-radius:5mm;padding:10mm;display:flex;flex-direction:column;gap:6mm;align-items:flex-start}
.ex-card .rot{color:${C.apoioEsc}}
.ex-tit{font-size:20pt;font-weight:700;letter-spacing:-.035em;line-height:1.1}
.botao{background:${C.verde};color:#000;font-weight:600;font-size:11pt;padding:3mm 6mm;border-radius:99px}
.cores-arq{list-style:none;display:flex;flex-direction:column;gap:4mm}
.cores-arq li{display:flex;gap:4mm;align-items:center;font-size:10.5pt;font-weight:500}
.cores-arq i{width:12mm;height:12mm;border-radius:3mm;border:1px solid ${C.linha};flex:none}
.cores-arq b{font-family:ui-monospace,Menlo,monospace;font-weight:600}
.cores-arq span{color:${C.apoio}}
`;

function brandbook(tipo) {
  const pgs = [capa(tipo), intro(tipo), paginaLogo(tipo), paginaProtecao(tipo), paginaFundos(tipo),
    paginaCores(), paginaTipo(), paginaRegras(), paginaIncorretos(tipo), paginaArquivos(tipo)];
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Promptado · Manual de marca</title><style>${CSS}</style></head><body>${pgs.join('')}</body></html>`;
}

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();

  // Arquivos de logo: SVG, PDF vetorial e PNG transparente, em 3 cores.
  const PASTAS = { logo: 'logo', horizontal: 'logo-slogan-horizontal', vertical: 'logo-slogan-vertical', nome: 'nome', completo: 'logo-nome-slogan-horizontal', completoVertical: 'logo-nome-slogan-vertical' };
  for (const [versao, pasta] of Object.entries(PASTAS)) {
    const v = VERSOES[versao];
    for (const fmt of ['svg', 'pdf', 'png']) fs.mkdirSync(path.join(ARQ, pasta, fmt), { recursive: true });
    for (const c of CORES_LOGO) {
      const nome = `promptado-${pasta}-${c.id}`;
      const s = svg(versao, c.cor);
      fs.writeFileSync(path.join(ARQ, pasta, 'svg', nome + '.svg'), s);
      const wpx = 1000, hpx = Math.round(wpx * v.h / v.w);
      await p.setContent(`<style>@page{margin:0}html,body{margin:0}</style>${svg(versao, c.cor, { largura: wpx })}`);
      await p.pdf({ path: path.join(ARQ, pasta, 'pdf', nome + '.pdf'), width: wpx + 'px', height: (hpx + 1) + 'px', pageRanges: '1' });
      await p.setViewportSize({ width: 3000, height: Math.round(3000 * v.h / v.w) });
      await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg(versao, c.cor, { largura: 3000 })}`);
      await p.screenshot({ path: path.join(ARQ, pasta, 'png', nome + '.png'), omitBackground: true });
    }
  }

  for (const [tipo, nome] of [['logo', 'brandbook-promptado-logo'], ['slogan', 'brandbook-promptado-logo-e-slogan']]) {
    const html = brandbook(tipo);
    fs.writeFileSync(path.join(__dirname, nome + '.html'), html);
    await p.setViewportSize({ width: 1123, height: 794 });
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(SAIDA, nome + '.pdf'), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
    // prévias para conferência
    const n = await p.locator('section.pg').count();
    for (let i = 0; i < n; i++) await p.locator('section.pg').nth(i).screenshot({ path: path.join(__dirname, `prev-${tipo}-${i + 1}.png`) });
  }
  await b.close();
  console.log('ok');
})();

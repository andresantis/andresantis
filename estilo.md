# Estilo de edição

Análise quadro a quadro de `referencias/ScreenRecording_10-25-2026_11-19-23.mp4`: uma gravação de tela de um Reel do Instagram (@lukachoi_), com 28,6 s.
**Cores e fontes seguem a marca Promptado** (promptado-brand.vercel.app/marca). Os valores ficam em `src/marca.ts`, o logo em `src/LogoPromptado.tsx` e `public/promptado-icone.svg`, e a fonte em `public/fontes/`.

## Marca Promptado (vale para tudo abaixo)

**Fonte: Geist**, a mesma do site, gratuita. Os títulos levam sempre espaçamento negativo entre as letras.

**Cores:** fundo preto puro ou cinza `#F5F5F7`, e **uma única cor de marca: o verde**. Roxo, azul e outras cores não entram.

| Uso | Escuro | Claro |
|---|---|---|
| Verde Promptado (botões, selos, áreas preenchidas) | `#22C55E` | `#22C55E` |
| Verde para texto (categorias e números em destaque, só a partir de 24 px) | `#22C55E` | `#16A34A` |
| Fundo | `#000000` | `#F5F5F7` |
| Superfície (cards e caixas) | `#161618` | `#FFFFFF` |
| Texto (títulos, texto principal, logo, ícones) | `#F5F5F7` | `#1D1D1F` |
| Texto de apoio (rótulos, linhas de apoio, rodapé) | `#A1A1A6` | `#6E6E73` |
| Linha (divisórias de 1 px) | `#2C2C2E` | `#D2D2D7` |

**Regras da marca:**
- **Texto sobre o verde é sempre preto** (`#000000`).
- **No máximo 2 ou 3 elementos verdes por tela.** Quando a referência pede mais destaques que isso ao mesmo tempo, os outros usam a cor de Texto.

**Tabela de tipografia da marca** (para peças de 1080 px de largura). Nos vídeos mantemos os **tamanhos medidos na referência** (seção 2); desta tabela usamos os pesos e os espaçamentos.

| Estilo | Tamanho | Peso | Espaçamento |
|---|---|---|---|
| Número de destaque | 260 px | Bold 700 | −6% |
| Título de capa | 100 px | Bold 700 | −4% |
| Título | 84 px | Bold 700 | −3,5% |
| Citação | 56 a 72 px | Semibold 600 | −3% |
| Apoio | 36 px | Medium 500 | −1% |
| Categoria | 30 px | Semibold 600 | −1% |
| Rodapé | 28 px | Medium 500 | 0 |

### Logo (ícone Promptado)

- Usar o desenho de `public/promptado-icone.svg` (componente `<LogoPromptado tamanho cor />`).
- A cor do logo é sempre a de **Texto**: `#F5F5F7` no escuro e `#1D1D1F` no claro. Sobre o verde, preto. Ele **não conta** como elemento verde.
- **Onde entra:** na **chamada final**, centralizado acima de `{ Por que não você? }`. Fica com ~160 px @1080, com o meio a ~33% da altura, e aparece junto com as chaves aos 24,78 s. *Essa posição é uma proposta minha, porque a referência não tem logo; dá para trocar.*
- Por enquanto só existe o **ícone**. O nome "Promptado" escrito (logotipo completo) não foi enviado.

### Como as cores da referência foram trocadas

| Na referência | Na marca Promptado |
|---|---|
| Fundo bege `#EFEBE2` | Fundo claro `#F5F5F7` |
| Fundo escuro `#0D0D0F` | Fundo `#000000` |
| Azul de destaque `#2B59F5` (botões, caixas, seleção, quadradinhos, barra principal) | Verde `#22C55E`, com **texto preto** por cima |
| Azul em linhas e símbolos (sublinhado, risco, chaves, setas, cursor, pontos de rótulo) | Verde `#22C55E` (dentro do limite de 2 ou 3 por tela; acima disso, cor de Texto) |
| Palavra de destaque em azul dentro da frase (ex.: "hoje.") | Verde para texto: `#16A34A` no claro e `#22C55E` no escuro |
| **Tela cheia azul** | **Fundo preto `#000000`** com texto `#F5F5F7` e chaves/setas verdes. Linhas-guia em `#2C2C2E` |
| Barras azul-marinho `#1B2A6D` | `#2C2C2E` (a barra principal fica verde) |
| Texto quase preto `#141108` | Texto `#1D1D1F` (no claro) ou `#F5F5F7` (no escuro) |
| Texto branco | `#F5F5F7` |
| Palavra chegando em cinza `#5B5546` | Texto de apoio: `#6E6E73` no claro e `#A1A1A6` no escuro |

---

## Como foi medido

- A gravação tem 1320×2868 px e 60 fps. O Reel ocupa a tela do topo até y = 2616 px; abaixo disso fica a barra de comentários do Instagram.
- **O vídeo original é de 30 fps**: na gravação, cada imagem se repete em 2 quadros seguidos.
- Cores: mediana dos pixels de cada área. Tamanhos: caixa que envolve o desenho das letras. Tempos: diferença entre quadros seguidos a 60 fps, com precisão de ±0,033 s.
- Fonte: desenhei as mesmas palavras com fontes candidatas e comparei largura, altura e espessura das letras com o vídeo.
- **Para converter ao nosso formato (1080×1920)**, considerei que o Instagram estica o vídeo até preencher a altura da tela (fator 1920/2616 = 0,734) e corta as laterais. Os tamanhos em "px @1080" usam esse fator. Já os percentuais de altura não dependem dessa suposição.
- Ícones, nome de usuário e "Comenta 'GUIA' pra aprender!!" fazem parte do aplicativo do Instagram, **não** da edição.

---

## 1. As ilustrações (o que mais chamou atenção)

**O padrão:** cada número, ideia ou ação que a pessoa fala vira um elemento visual que **imita uma interface de aplicativo ou de programa de design**: card de perfil do Instagram, caixa de chat, gráfico, contador, botão, cursor de texto, seleção de texto, chaves `{ }` com pontinhos de caixa de texto e alças de seleção. Nada fica parado: tudo conta, cresce, é digitado ou é selecionado **no ritmo da fala**.

Elas aparecem de duas formas.

**A) Tela cheia (a pessoa some):** 5 vezes no vídeo, de 1,0 a 3,7 s cada. Sempre um fundo liso, com o verde como única cor de destaque:

| Fundo | Cor | Onde aparece |
|---|---|---|
| Claro | `#F5F5F7` | contador de faturamento, chamada final |
| Escuro | `#000000` | gráfico de barras, "revolução", "{ a ideia sempre foi sua }" |

**B) Por cima da pessoa:** o card de perfil, o chat, os botões, o fundo de fotos atrás da pessoa, e as palavras grandes **atrás da cabeça** (veja a seção 2).

### Cada ilustração, com os tempos medidos

| Tempo | Ilustração | Como anima |
|---|---|---|
| 0,80–2,47 s | `cada { legenda, número, gráfico }` | Chaves verdes com pontinhos nos cantos (como uma caixa de texto selecionada). As chaves se abrem e cada palavra entra quando é falada: legenda (0,93), número (1,40), gráfico (1,93). |
| 2,48–3,02 s | Caixa de chat (pílula na cor de Superfície, com o botão de enviar verde e a seta preta) | Aparece vazia e "quer ver?" é digitado a cerca de 1 letra por quadro (~22 letras/s), com o cursor piscando. Corta logo depois. |
| 3,02–5,32 s (2,30 s) | Contador **"• faturamento em R$"** em fundo claro | O rótulo (em Texto de apoio, com ponto verde) entra aos 3,10. O número entra aos 3,77 e sobe em degraus: 0→10.000 (0,20 s), pausa de 0,27 s, →100.000 (0,20 s), pausa, →1.000.000 (0,20 s), pausa de 0,4 s. Os dígitos rolam com **desfoque de movimento vertical**, como num caça-níquel. O número fica na cor de Texto; o valor final pode ficar em verde para texto. |
| 5,32–6,32 s (1,0 s) | **Card de perfil do Instagram** por cima da pessoa (cor de Superfície, texto `#1D1D1F`, número de seguidores em `#16A34A`) | Sobe de baixo **levemente inclinado** e se acomoda em 0,20 s. Os seguidores contam de 1,2 mil → 98,4 mil entre 5,42 e 6,15 s, rápido no começo e devagar no fim. Aos 5,85 o botão muda de "Seguir" (verde, texto preto) para "Seguindo ✓" (fundo `#F5F5F7`, borda `#D2D2D7`). Some aos 6,22–6,28. |
| 6,32–7,68 s (1,37 s) | **Gráfico de barras** "explodindo ↑" em fundo `#000000` | O título aparece em 0,07 s (de Texto de apoio para Texto), com um sublinhado verde ondulado. As 5 barras crescem **uma depois da outra**, da esquerda para a direita, entre 6,52 e 6,92 s (uma a cada ~0,1 s), com os percentuais em cima (16 / 30 / 47 / 70 / 100%). As 4 primeiras são `#2C2C2E`, com os percentuais em `#A1A1A6`; a última é verde `#22C55E`, com "100%" em verde. |
| 8,88–9,02 s | Risco sobre "impossível" | Uma linha verde grossa, de pontas arredondadas, levemente subindo para a direita, se desenha da esquerda para a direita em ~0,15 s e passa da borda da palavra. |
| 10,75–11,28 s | `←{ eu só falei. }→` sobre o peito da pessoa | Texto `#F5F5F7`, com chaves e setas verdes. As palavras entram uma a uma. |
| 12,23–12,47 s | Sublinhado de "criador" | Uma linha verde nasce como um ponto e cresce para a direita em ~0,23 s, também atrás da cabeça. |
| 14,72–15,25 s | "editar" como se estivesse num editor de texto | Cursor de texto verde → seleção verde com o **texto em preto** → apagado letra por letra ("edi…") → some. |
| 16,55–16,70 s | "m o s t r…" | Cada letra entra num quadradinho verde com a **letra preta**, uma por quadro. |
| 16,72–17,88 s (1,17 s) | Tela de destaque `{ a ideia sempre foi sua }` em fundo `#000000` | As chaves e setas verdes aparecem vazias, as palavras (`#F5F5F7`) entram no ritmo da fala e a chave de fechamento encosta no texto no final. O fundo tem **linhas-guia finas** em `#2C2C2E`, como uma grade de programa de design. |
| 18,32–18,52 s | Seleção em "vídeo" | Cursor aos 18,38, depois a caixa de seleção verde cresce para a direita em ~0,13 s e o **texto fica preto**. |
| 19,95–21,08 s (1,13 s) | "revolução revolução" repetido em ~10 linhas, fundo `#000000` | Efeito de **cilindro 3D rolando**: as linhas do meio são grandes e `#F5F5F7`, as das pontas menores e apagadas (indo para `#A1A1A6`), e todas se movem em todo quadro. Rótulos pequenos com ponto verde: "• pra galera" (canto superior esquerdo, 20,42) e "• que quer" (canto inferior direito, 20,75). Há 1 quadro de "piscada" vazio aos 20,88. |
| 21,10–22,12 s (1,0 s) | Pessoa recortada na frente de uma **parede curva de fotos** (estilo de vida), em fundo `#000000` | Um botão verde com texto preto no topo muda de "começar" para "criar conteúdo" aos 21,42. |
| 24,78–28,43 s (3,65 s) | **Chamada final** em fundo `#F5F5F7`: **logo Promptado**, `←{ Por que não você? }→` e o botão "me segue para mais →" | O logo e as chaves aparecem e as palavras entram (25,03 / 25,17 / ~25,3). O botão (verde, **texto preto**) **cresce de minúsculo até o tamanho final** entre 25,97 e 26,10 (~0,13 s), com **alças de seleção** de programa de design ao redor (em `#1D1D1F`). Fica parado por ~2,3 s. Elementos verdes nesta tela: as chaves/setas e o botão. |

### Posição e tamanho (px @1080×1920)

- Contador: o rótulo fica centralizado, a 41–44% da altura. O número fica centralizado, com o meio a 52% da altura; os dígitos têm ~147 px de altura (fonte de ~200 px) e ocupam ~71% da largura.
- Card de perfil: ~83% da largura, no terço de baixo, por cima do peito.
- Caixa de chat: ~82% da largura, no topo, onde ficaria a legenda.
- Chamada final: o texto entre chaves fica a 45% da altura e o botão a 55%, com ~62% da largura (contando as alças). O logo fica acima, a ~33% (proposta).
- Texto da tela de destaque: centralizado, no meio da altura (49%).

---

## 2. Legendas

### Fonte: Geist

- **Legenda pequena:** **Geist Semibold 600**, espaçamento **−3%** (o estilo "Citação" da marca). Tamanho da referência: **~66 px @1080**.
- **Palavra grande:** **Geist Bold 700**, espaçamento **−6%** (o estilo "Número de destaque" da marca). Tamanho da referência: **~242 px @1080**.
- **Número do contador:** Geist Bold 700, −6%, ~200 px.
- **Rótulos pequenos** (como "• faturamento em R$" e "• pra galera"): Geist Medium 500, −1% (o estilo "Apoio").
- **Texto de botões e chips:** Geist Semibold 600, −1% a −3%.
- Tudo em **minúsculas**, menos "IA", "R$" e o começo de "Por que não você?".
- *Na referência, a medição apontou a Inter Display (Semibold −3% na legenda e Bold/ExtraBold −6% a −8% na palavra grande). Trocamos pela Geist: os tamanhos continuam os da referência e o espaçamento segue a marca.*

### Cores das legendas

- Texto sobre o vídeo da pessoa: `#1D1D1F` se a parede for clara, ou `#F5F5F7` se for escura. A referência usa parede clara com texto escuro.
- Destaques (sublinhado, risco, seleção, chaves, botões): **verde `#22C55E`**, no máximo 2 ou 3 por tela. Sobre o verde, o texto é sempre preto.
- Palavra **chegando**: entra na cor de Texto de apoio (`#6E6E73` no claro e `#A1A1A6` no escuro) e escurece até a cor de Texto em 1–2 quadros.
- Palavra de destaque **em verde** dentro da frase (ex.: "hoje."): `#16A34A` no claro e `#22C55E` no escuro. Só a partir de 24 px.

### Formatos de legenda

1. **Linha pequena centralizada no topo** (é o padrão): o topo das letras fica a **13,5% da altura** (~259 px @1080). Cabem até **5 ou 6 palavras por linha**. A frase **se monta palavra por palavra**, no ritmo da fala, e cada palavra leva **0,10–0,17 s** para aparecer. Quando a frase termina, a linha some e a próxima começa vazia.
2. **Palavra grande ATRÁS da pessoa**: 1 palavra-chave por frase ("editado", "impossível", "criador", "editar", "vídeo", "dinâmicas", "criar"). Fica logo abaixo da linha pequena (topo a ~25% e base a ~34% da altura) e **a cabeça e o cabelo passam por cima dela**, porque a pessoa é recortada do fundo. Ela aparece em **2 quadros** (~0,07 s), indo do Texto de apoio até a cor de Texto, **sem pular nem deslizar**. Ocupa de 72% ("criador") a 93% ("impossível") da largura visível e pode encostar nas bordas.
3. **Bloco alinhado à esquerda**, em 2 linhas, no canto superior esquerdo (ex.: "eu não abri / nenhum programa,"), com um pequeno sinal verde no canto.
4. **Coluna estreita ao lado da cabeça** (ex.: "consegue / fazer isso / **hoje.**"), com a última palavra em verde para texto.
5. **Texto `#F5F5F7` sobre o peito**, entre chaves e setas verdes: `←{ eu só falei. }→`.
6. **Palavra em caixa verde** com o **texto preto** (ex.: "agora." sobre o peito, aos 24,37–24,78).

- **Durante as ilustrações em tela cheia não aparece legenda**: a ilustração substitui a legenda.
- Ritmo: pelo menos 80 palavras com legenda em 24,8 s de fala, ou seja, **mais de 3,2 palavras por segundo**.

---

## 3. Cortes e ritmo (medidos)

- **17 trechos em 28,4 s**: **1,7 s por trecho em média**. São 11 trechos da pessoa falando e 5 ilustrações em tela cheia, além do card e do fundo de fotos, que ficam por cima da pessoa.
- Cortes (s): 0,65 · 1,05 · 3,02 · 5,32 · 6,32 · 7,68 · 9,32 · 11,28 · 16,72 · 17,88 · 18,98 · 19,95 · 21,10 · 22,12 · 24,78.
- O trecho mais longo da pessoa falando tem 5,4 s (11,28–16,72), mas a legenda recomeça aos 13,35 e aos 15,15. **Algo muda na tela a cada 0,5 s ou menos.**
- Todos os cortes são **secos**: sem fade, sem zoom animado e sem transição deslizante. A única exceção é **1 quadro de "glitch"** aos 1,05 s, com a imagem repetida em 4 faixas horizontais.
- Os cortes são **jump cuts** que tiram as pausas e as respirações. Nos quadros dá para ver que o enquadramento alterna entre **aberto e mais fechado** (ex.: 9,32, 17,88 e 22,12 estão mais próximos). Isso foi observado nos quadros, sem medição em pixels.
- A pessoa olha para a câmera, no centro, com fundo neutro claro e cadeira escura.

---

## 4. Som (medido)

- **De 0 a 24,8 s: só voz, sem música de fundo.** No espectrograma não aparece nenhuma camada de música, e nos cortes o volume cai a −40/−47 dB, que é quase silêncio.
- **Não há efeitos sonoros nos cortes do meio do vídeo**: nenhum "whoosh" ou estalo foi detectado.
- Não existe silêncio maior que 0,15 s até o final: as pausas foram todas cortadas.
- Volume total: **−13 LUFS** (alto, padrão de Reels). Pico de +0,3 dB. Variação de volume (LRA): 4,4 LU, ou seja, uma voz bem uniforme.
- **No final**: um **efeito de subida** (o tom sobe de ~300 Hz para ~1.280 Hz entre 24,6 e 25,0 s), entrando junto com a chamada final. Depois vem **uma musiquinha curta de notas soltas** (~345 / 441 / 528 Hz, notas do acorde de Fá maior), uma a cada ~0,53 s (~113 batidas por minuto). Ela fica entre −22 e −38 dB, mais baixa que a voz, e termina aos 28,15 s.

---

## 5. Receita para os nossos vídeos

1. Fundo `#F5F5F7` (claro) ou `#000000` (escuro) e **uma única cor de marca: o verde `#22C55E`**, com no máximo 2 ou 3 elementos verdes por tela. **Texto sobre o verde é sempre preto.** Nada de azul, roxo ou outras cores.
2. Fonte **Geist**: legenda de ~66 px Semibold (−3%) no topo, a 13,5% da altura, e palavra-chave de ~242 px Bold (−6%) **atrás da pessoa**.
3. A legenda se monta palavra por palavra (5–6 por linha). Cada palavra entra na cor de Texto de apoio e escurece até a cor de Texto em ~0,1 s.
4. A cada número ou ideia, uma ilustração **com cara de interface** (card, gráfico, contador, chat, botão, seleção, chaves `{ }`), animada no ritmo da fala e durando de 1 a 2,3 s.
5. Um trecho a cada ~1,7 s, com cortes secos e sem respiração.
6. Só voz durante o vídeo. No final, um efeito de subida, uma musiquinha curta e uma chamada para ação com o **logo Promptado** e um botão verde.

## O que não deu para medir

- O que é falado durante as ilustrações de tela cheia, porque ali não há legenda. O modelo de transcrição (whisper) ainda não foi instalado.
- A resolução original do vídeo, antes de passar pelo Instagram. Por isso, os tamanhos "@1080" dependem da suposição explicada em "Como foi medido".

# Plano de edição: vídeo 1, "5 IAs que você deveria conhecer"

Original: `videosToEdit/copy_4C61A824-F757-488D-B61E-4B3116B7DB7D 2.mov` (3 min 0 s, H.264, 1080×1920, 30 fps, SDR BT.709).
Os tempos abaixo são do **vídeo já editado**. Eles têm margem de ~0,1–0,2 s e serão ajustados ao som na montagem.

## Regras que valem para as duas versões

- **Cor do vídeo:** intocada. O vídeo entra sem filtro, sem correção e sem LUT. Tudo o que eu adiciono fica **por cima** da imagem.
- **Formato:** 1080×1920, 30 fps.
- **Área segura:** nada importante em y < 250 px (topo), em y > 1470 px (base) nem em x > 900 px (lateral direita). As margens úteis são x de 60 a 900 px e y de 250 a 1470 px.
- **Tema escuro da marca:** o teto do carro, atrás da legenda, é escuro (brilho ~70 de 255).
  - Texto das legendas: `#F5F5F7`.
  - Palavra chegando: `#A1A1A6`.
  - Destaques: verde `#22C55E`, com no máximo 2 ou 3 por tela. Sobre o verde, o texto é sempre preto.
- **Legenda padrão:** Geist Semibold 66 px, espaçamento −3%, centralizada. O topo das letras fica a 259 px (13,5% da altura). Até 6 palavras por linha, montadas palavra por palavra (0,1 s por palavra).
- **Palavra grande atrás da cabeça:** Geist Bold 242 px, espaçamento −6%, cor `#F5F5F7`. A base das letras fica a ~650 px, então o topo da sua cabeça (~600–660 px) passa por cima dela. Testei o recorte de pessoa (MODNet) e ele funciona na cabeça e nos ombros. Nomes longos, como "Perplexity", diminuem até caber em 82% da largura.
- **Rótulo de capítulo:** "• 01/05" a "• 05/05" no canto superior esquerdo (x 60, y 380), em Geist Medium 36 px, cor `#A1A1A6`, com o ponto verde.
- **Cortes:** secos (jump cuts). Proposta opcional: alternar o enquadramento entre 100% e 110% (zoom) a cada corte, como na referência. Isso não mexe na cor.
- **Telas cheias:** fundo `#000000` ou `#F5F5F7`, com linhas-guia em `#2C2C2E`. Durante elas não aparece legenda, mas a sua voz continua.
- **Som:**
  - Só a sua voz, com volume normalizado para ~−14 LUFS (é volume, não cor).
  - Na chamada final, um efeito de subida de 0,4 s e uma musiquinha curta de notas soltas, que eu mesmo gero (sem música de terceiros). Ela fica entre −30 e −36 dB, abaixo da voz.
- **Corte novo para você aprovar:** tirar o "**Bom,**" antes de "e o Grok" (aos 94,7 s na completa e aos 28,0 s na curta). Ele não estava na lista da etapa 1, porque só apareceu na segunda transcrição.
- **Sem dados inventados:** nenhum gráfico ou card mostra números que você não falou.

---

## Gancho: primeiros 3 segundos (igual nas duas versões)

| Tempo | Fala | Legenda (topo) | Elemento na tela |
|---|---|---|---|
| 0,0–0,6 | "Hoje," | "hoje," | O vídeo começa **já com a fala** (a pausa inicial de 0,56 s foi cortada). |
| 0,6–2,4 | "existe pelo menos" | "hoje, existe pelo menos" | — |
| **2,5** | "**5**" | — | **"5" gigante atrás da cabeça**, que gira como um contador de 1 a 5 em 0,2 s. Um sublinhado verde cresce embaixo dele em 0,23 s. |
| 2,8–3,4 | "inteligências artificiais" | "inteligências artificiais" | **5 cards de app** surgem sobre o peito, um a cada 0,1 s: **ChatGPT · Gemini · Claude · Perplexity · Grok**. Ficam em fundo `#161618`, texto `#F5F5F7`, 40 px, entre y 1150 e 1400 px. |

**Por que funciona:** em 3 segundos, quem assiste já vê um **número** (5) e **cinco nomes que conhece**, e entende que vem uma comparação. Isso dá vontade de ver até o fim para descobrir "qual é a minha".

| Tempo | Fala | Legenda | Elemento |
|---|---|---|---|
| 3,4–5,2 | "que você deveria conhecer" | "que você deveria conhecer" | Os 5 cards continuam. Em "conhecer" (5,1), ganham **alças de seleção** (de programa de design). |
| 5,3–7,9 | "e que a gente monitora todas elas dentro da Promptado." | "e a gente monitora todas elas" → "dentro da Promptado." | Os cards se juntam num **painel Promptado** (fundo `#161618`, **logo Promptado** em `#F5F5F7`) com as 5 IAs em lista. Cada uma ganha um ✓ (em `#F5F5F7`), uma a cada 0,1 s, e o painel ganha o **selo verde "monitorando"** (texto preto). |

---

## Versão CURTA (~45 s)

Trechos mantidos do original: 0,56–9,72 · 19,05–23,60 · 44,28–48,95 · 62,50–68,45 · 109,20–114,30 · 114,45–121,20 · 130,10–131,95 · 139,10–144,95 · 166,20–171,30 s, sem as pausas de dentro.

| Tempo | Fala | Legenda | Elemento na tela |
|---|---|---|---|
| 0,0–7,9 | gancho | ver acima | ver acima |
| 8,0–8,3 | — | — | **1 quadro de "glitch"** no corte (imagem repetida em 4 faixas), igual à referência. |
| 8,4–9,7 | "Vou começar pela mais famosa," | "vou começar pela mais famosa," | Rótulo "• 01/05". |
| 9,8–11,0 | "que é o ChatGPT." | "que é o" | **"ChatGPT" grande atrás da cabeça** (10,0), com sublinhado verde. |
| 11,1–12,7 | "Eu vejo ela como um faz tudo." | "eu vejo ela como um" | **"faz tudo." em caixa verde** com texto preto, sobre o peito (12,3), entrando como uma seleção de texto (0,13 s). |
| 12,8–14,6 | "o Gemini serve muito para" | "o Gemini serve muito para" | Rótulo "• 02/05". **"Gemini" grande atrás da cabeça** (12,9). |
| 14,7–17,0 | "aquelas pessoas que usam o ecossistema Google." | "aquelas pessoas que usam o" | **`←{ ecossistema Google }→`** sobre o peito: texto `#F5F5F7`, chaves e setas verdes. As palavras entram no ritmo da fala (16,1 e 16,9). |
| 17,3–19,4 | "Já no Claude, eu vejo ele como" | "já no Claude," → "eu vejo ele como" | Rótulo "• 03/05". **"Claude" grande atrás da cabeça** (17,8), com sublinhado verde. |
| 19,5–22,4 | "uma IA que realmente consegue resolver coisas complexas." | "uma IA que realmente consegue" → "resolver coisas **complexas.**" | "complexas." em verde (verde para texto). Aos 21,9, **seleção verde** passando sobre "complexas" na legenda. |
| 22,5–22,9 | — | — | Corte seco. |
| 23,0–24,4 | "eu usaria o Perplexity" | "eu usaria o" | Rótulo "• 04/05". **"Perplexity" grande atrás da cabeça** (23,9), reduzida para caber. |
| 24,5–27,8 | "porque ele é um grande pesquisador na web e de fontes." | — (substituída pelo chat) | **Caixa de chat** no lugar da legenda (pílula `#161618`, botão de enviar verde com seta preta). "pesquisar na web e em fontes" é digitado (~22 letras/s, cursor piscando). Em "fontes." (27,6), o botão "envia". |
| 28,0–28,7 | "e o Grok," | "e o" | Rótulo "• 05/05". **"Grok" grande atrás da cabeça** (28,2). *(sem o "Bom," se você aprovar)* |
| 28,8–30,6 | "ele já é integrado com o X," | "ele já é integrado com o X," | Dois cards de app, **"Grok" ⟷ "X"**, ligados por uma linha que se desenha em 0,2 s, com um ponto verde no meio. |
| 30,7–33,8 | "então se você quer saber mais sobre notícias, tendências," | "então se você quer saber mais sobre" | **`cada { notícias, tendências }`** sobre o peito: as chaves verdes se abrem e cada palavra entra quando é falada (32,7 e 33,3). |
| 33,9–35,6 | "vale muito a pena você utilizar ele." | "vale muito a pena você utilizar ele." | — |
| 35,8–36,3 | "Lembrando," | "lembrando," | — |
| **36,4–40,6** | "não existe uma IA para tudo, eu usaria uma para cada questão." | (sem legenda) | **TELA CHEIA preta**, com grade `#2C2C2E`. "uma IA para tudo" aparece em Geist Bold 120 px `#F5F5F7`. Aos 38,4 ("tudo"), um **risco verde** o atravessa (0,15 s). Aos 38,8, ele dá lugar a **`←{ uma para cada questão }→`**, com as palavras entrando no ritmo da fala. |
| 40,6–41,0 | — | — | **Efeito de subida** (som) e corte para a chamada final. |
| **40,9–45,8** | "E se você gostou desse vídeo, já me siga aqui para mais vídeos como esse." | (sem legenda) | **CHAMADA FINAL**, tela cheia `#F5F5F7`: **logo Promptado** (`#1D1D1F`, 160 px, a 33% da altura) e **`←{ gostou desse vídeo? }→`** (a 45%). Em "siga" (43,2), o **botão verde "me segue para mais →"** (texto preto, alças de seleção) cresce de minúsculo até o tamanho final em 0,13 s, a 55% da altura. A **musiquinha** toca baixinho. A tela segura 0,5 s depois de "esse.". |

Elementos verdes por tela: sempre no máximo 2 (ex.: o sublinhado e o ponto do rótulo; ou as chaves e o botão).

---

## Versão COMPLETA (~2 min 25 s)

Todos os trechos, menos os cortes aprovados na etapa 1 e as 44 pausas.

| Tempo | Fala | Legenda | Elemento na tela |
|---|---|---|---|
| 0,0–7,9 | gancho | ver acima | ver acima |
| 8,0–8,4 | — | — | 1 quadro de "glitch" no corte. |
| 8,5–11,2 | "Vou fazer uma comparação para vocês de cada uma delas," | "vou fazer uma" → "de cada uma delas," | **"comparação" grande atrás da cabeça** (9,2), com sublinhado verde. |
| 11,5–14,0 | "para vocês entenderem para que serve cada uma." | "para vocês entenderem" | **`←{ para que serve }→`** sobre o peito (12,8–13,9). |
| 14,3–16,6 | "Isso na minha opinião e para que eu uso cada um deles." | "isso na minha opinião" → "e para que eu uso cada um deles." | **Selo verde "minha opinião"** (texto preto) ao lado da cabeça (14,8). |
| 17,0–18,8 | "Vou começar pela mais famosa, que é o ChatGPT." | "vou começar pela mais famosa," | Rótulo "• 01/05". **"ChatGPT" grande atrás da cabeça** (18,7), com sublinhado verde. |
| 19,7–21,3 | "Eu vejo ela como um faz tudo." | "eu vejo ela como um" | **"faz tudo." em caixa verde** sobre o peito (20,9). |
| 21,6–24,4 | "Ela é boa para você pesquisar, ela é boa para você ler uma documentação." | "ela é boa para você" | **Card de checklist** (`#161618`, título "ChatGPT"): "✓ pesquisar" (22,5) e "✓ ler documentação" (24,3) digitados, com os ✓ em `#F5F5F7`. |
| **25,4–27,9** | "se a gente faz tudo de uma vez a gente não faz nada direito." | (sem legenda) | **TELA CHEIA preta**: "faz tudo de uma vez" em 120 px. Em "nada direito" (27,4), um **risco verde** atravessa a frase. |
| 28,0–30,3 | "se você precisa de algo específico mesmo, o ChatGPT," | "se você precisa de algo" → "específico mesmo, o ChatGPT," | — |
| 31,3–32,5 | "ele não vai ser o melhor," | "ele não vai ser o melhor," | **"o melhor" grande atrás da cabeça**, com **risco verde** (32,2). |
| 32,6–34,1 | "mas ele serve para muita coisa." | "mas ele serve para **muita coisa.**" | "muita coisa." em verde. |
| 34,7–36,9 | "Eu não sou o grande usuário do Gemini," | "eu não sou o grande usuário do Gemini," | Rótulo "• 02/05". |
| 37,2–39,1 | "mas o Gemini serve muito para" | "mas o Gemini serve muito para" | **"Gemini" grande atrás da cabeça** (37,4), com sublinhado verde. |
| 39,2–41,5 | "aquelas pessoas que usam o ecossistema Google." | "aquelas pessoas que usam o" | **`←{ ecossistema Google }→`** sobre o peito (40,6–41,4). |
| 41,8–49,9 | "Então você consegue integrá-lo junto com as suas ferramentas como Google Search, você consegue integrá-lo com seu e-mail, você consegue fazer várias integrações" | frases em linhas de até 6 palavras | **Card "integra com"** (`#161618`, a 55–70% da altura) com linhas digitadas: "Google Search" (45,2), "e-mail" (47,8) e "+ várias integrações" (49,6). Cada linha tem um ponto `#F5F5F7`; a última ganha o ponto verde. |
| 50,1–53,7 | "que pode facilitar hoje dentro da sua empresa e dentro do seu trabalho." | "que pode facilitar hoje" → "dentro da sua empresa e" → "dentro do seu trabalho." | Chips "empresa" (52,3) e "trabalho" (53,6) surgem embaixo do card. |
| 53,9–55,0 | "Já no Claude," | "já no Claude," | Rótulo "• 03/05". **"Claude" grande atrás da cabeça** (54,4), com sublinhado verde. |
| 55,0–59,1 | "eu vejo ele como uma IA que realmente consegue resolver coisas complexas." | "eu vejo ele como uma IA" → "que realmente consegue resolver coisas" | **"complexas." grande atrás da cabeça** (59,0), no lugar de "Claude". |
| 59,5–63,3 | "Um exemplo, todos os nossos desenvolvedores da Promptado usam o Claude." | "um exemplo, todos os nossos" → "desenvolvedores da Promptado," | **Card Promptado** (`#161618`, **logo**, "time de desenvolvimento"). Em "usam o Claude" (62,9), entra o **selo verde "usa Claude ✓"**. |
| 63,6–65,2 | "Porque ele é extremamente técnico," | "porque ele é extremamente técnico," | Em "técnico", a **seleção de texto**: cursor verde, depois seleção verde com o texto em preto (0,13 s). |
| 65,3–71,7 | "Ele tem alta qualidade em ler documentos maiores, em buscar pesquisas, resultados de algo muito mais complexo." | "ele tem alta qualidade em" → … | **Coluna ao lado da cabeça** (formato 4 da referência): "documentos maiores / pesquisas / algo **mais complexo**", com a última linha em verde. Cada linha entra quando é falada (67,1, 68,7 e 71,2). |
| 72,3–75,7 | "O Perplexity hoje não é uma ferramenta, na minha opinião, tão utilizada." | "o Perplexity hoje não é uma" → "ferramenta, na minha opinião, tão utilizada." | Rótulo "• 04/05". **"Perplexity" grande atrás da cabeça** (72,4). |
| 76,2–81,3 | "Eu vejo que o pessoal de marketing costuma usar bastante ele, principalmente para pesquisas." | "eu vejo que o pessoal de" → "marketing costuma usar bastante ele," | Chip "marketing" (78,2). Depois, **"pesquisas" em caixa verde** sobre o peito (81,2). |
| 81,7–88,8 | "Se você quer saber algo de mercado, tamanho de mercado, informações ou até mesmo fontes que você pode usar como inspiração," | — (substituída pelo chat) | **Caixa de chat** no topo, digitando: "tamanho de mercado" (83,4) → apaga → "informações" (85,0) → apaga → "fontes de inspiração" (86,5–88,7). |
| 89,6–94,3 | "eu usaria o Perplexity porque ele é um grande pesquisador na web e de fontes." | "eu usaria o Perplexity porque ele" → "é um grande pesquisador na web e de fontes." | **Card "fontes"** (`#161618`): 3 linhas "fonte ↗" aparecem uma a uma (93,5, 93,8 e 94,1). São marcadores genéricos, sem sites inventados. |
| 94,8–95,5 | "e o Grok," | "e o" | Rótulo "• 05/05". **"Grok" grande atrás da cabeça** (95,0). *(sem o "Bom," se você aprovar)* |
| 95,6–97,4 | "ele já é integrado com o X," | "ele já é integrado com o X," | Cards **"Grok" ⟷ "X"**, ligados por uma linha com ponto verde (96,1–96,9). |
| 97,5–100,6 | "então se você quer saber mais sobre notícias, tendências," | "então se você quer saber mais sobre" | **`cada { notícias, tendências }`**: as chaves verdes se abrem e as palavras entram (99,4 e 100,1). |
| **100,7–103,0** | "que as pessoas estão falando em relação a mercado," | (sem legenda) | **TELA CHEIA preta: cilindro 3D** com "tendências tendências" repetido, rolando. Rótulos "• o que as pessoas falam" (canto superior esquerdo) e "• mercado" (canto inferior esquerdo), com ponto verde. |
| 103,1–106,5 | "principalmente dentro da rede social X," | "principalmente dentro da rede social X," | Volta para o vídeo. |
| 106,8–108,5 | "vale muito a pena você utilizar ele." | "vale muito a pena você utilizar ele." | **Botão verde "vale a pena ✓"** sobre o peito, crescendo em 0,13 s. |
| **108,8–113,6** | "Lembrando, não existe uma IA para tudo, eu usaria uma para cada questão." | (sem legenda) | **TELA CHEIA preta**: "uma IA para tudo", com **risco verde** em "tudo" (111,5). Depois, **`←{ uma para cada questão }→`** (111,8–113,5). |
| 113,8–121,6 | "Se eu estou precisando de programação, eu uso o Claude. Se eu quero ser mais generalista e rápido, eu usaria o ChatGPT, sem dúvidas alguma." | frases em linhas de até 6 palavras | **Card de "atalho"** (`#161618`, a 55–70% da altura), com 2 linhas digitadas: "programação → **Claude**" (115,4 e 116,3) e "generalista e rápido → **ChatGPT**" (118,6 e 119,6). Os nomes ficam em verde para texto (2 elementos verdes). |
| 121,9–127,0 | "Portanto, veja qual você mais se adequa, qual atende a sua necessidade" | "portanto, veja qual você mais se adequa," → "qual atende a sua necessidade" | — |
| 127,0–129,9 | "e use a inteligência artificial porque ela está aqui para otimizar" | "e use a inteligência artificial" → "porque ela está aqui para otimizar" | **"otimizar" grande atrás da cabeça** (129,2). |
| **129,9–132,0** | "o nosso tempo e melhorar os nossos resultados." | (sem legenda) | **TELA CHEIA preta: gráfico "resultados ↑"**, com sublinhado verde ondulado. 5 barras crescem uma depois da outra (0,1 s cada); as 4 primeiras em `#2C2C2E` e a última em verde. **Sem números**, porque você não falou nenhum. |
| 132,0–132,3 | — | — | **Efeito de subida** (som). |
| **132,2–136,6** | "E se você gostou desse vídeo, já me siga aqui para mais vídeos como esse." | (sem legenda) | **CHAMADA FINAL** `#F5F5F7`: **logo Promptado** e **`←{ gostou desse vídeo? }→`**. Em "siga" (134,6), entra o **botão verde "me segue para mais →"** com alças de seleção. A musiquinha começa. |
| 136,7–139,5 | "E se tem alguém precisando desse tipo de conteúdo," | "e se tem alguém precisando" → "desse tipo de conteúdo," | Volta para o vídeo; a musiquinha continua baixinha. |
| 139,6–142,5 | "já compartilhe esse conteúdo para o seu amigo, para a sua família" | "já compartilhe esse conteúdo" → "para o seu amigo, para a sua família" | **Botão verde "compartilhar ↗"** sobre o peito (140,0). Chips "amigo" (141,3) e "família" (142,2). |
| 142,6–145,3 | "que precisa saber mais sobre inteligência artificial." | "que precisa saber mais sobre" → "inteligência artificial." | Nos últimos 0,5 s, o **logo Promptado** aparece pequeno, no centro, a 33% da altura. |

Telas cheias na versão completa: 6, nos tempos 25,4 · 100,7 · 108,8 · 129,9 · 132,2 (e o glitch aos 8,0). É um ritmo próximo ao da referência, com algo novo na tela a cada ~0,5–2 s.

---

## Como vou conferir na etapa 3

1. Vou transcrever **o vídeo montado** e comparar com o texto esperado, para garantir que nenhum corte comeu uma palavra.
2. Vou comparar as cores de quadros do vídeo original com as do vídeo montado nos mesmos pontos (em áreas sem nada por cima) e anotar a diferença medida.
3. Vou abrir as duas versões no Remotion Studio para você revisar.

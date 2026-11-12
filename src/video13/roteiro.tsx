import { Botao, Chips } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { CardBusca, CardNovidade, CardPromptado, ChipsRisco, ComentaIA, LogosIAs, Pilula, TelaOpenAI } from "./componentes";

// Roteiro do vídeo 13 (plano aprovado em edicao/video13/plano.md): estilo A, com a pílula "NOVIDADE" na abertura
// e telas do vídeo de lançamento da OpenAI (video14) em tela cheia por cima da fala.
const Y = 1120; // cards sobre a camiseta

export const roteiroVideo13 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("comenta");
  // Palavra grande logo acima da cabeça (o topo da cabeça fica em y ≈ 390); a legenda pequena fica acima dela.
  const grande = (texto: string, extra: Partial<NonNullable<Item["grande"]>> = {}) => ({ texto, centro: true, sombra: true, topo: 380, ...extra });
  // Trecho do vídeo da OpenAI: [palavra em que entra, palavra em que sai, segundo do vídeo da OpenAI]
  const openai = (de: number, ate: number, inicio: number): Item => ({ de, ate, esconde: true, el: <TelaOpenAI desde={de} inicio={inicio} /> });
  const itens: Item[] = [
    // gancho
    { de: 0, ate: a("e"), el: <CardNovidade desde={0} card={a("google")} /> },
    { de: a("chatgpt"), ate: a("e", 1, -0.1), grande: grande("ChatGPT", { sublinhado: a("chatgpt", 1, 0.3) }) },
    { de: a("empresa"), ate: a("agora"), grande: grande("empresa") },
    // telas da OpenAI
    openai(a("agora"), a("adicionar"), 8.0),
    openai(a("adicionar"), a("acompanhar"), 14.0),
    openai(a("acompanhar"), a("mas"), 35.5),
    // o detalhe
    { de: a("detalhe"), ate: a("estar"), grande: grande("detalhe", { sublinhado: a("importante") }) },
    openai(a("estar"), a("não"), 42.0),
    {
      de: a("não"), ate: a("sabe"),
      el: <><Pilula texto="✓ cadastrado" desde={a("não")} y={Y} verde /><ChipsRisco y={Y + 110} itens={[["recomendado", a("recomendada"), a("recomendada", 1, 0.4)]]} /></>,
    },
    { de: a("porquê"), ate: a("porque"), grande: grande("por quê?") },
    { de: a("encontrar"), ate: a("se", 2), el: <CardBusca desde={a("encontrar")} web={a("web")} site={a("site")} recomenda={a("recomendar")} /> },
    {
      de: a("conteúdo"), ate: a("exatamente", 1, -0.2),
      el: <ChipsRisco y={Y + 40} itens={[["encontrada", a("encontrada"), a("encontrada", 1, 0.3)], ["recomendada", a("recomendada", 2), a("recomendada", 2, 0.3)]]} />,
    },
    { de: a("promptado"), ate: a("nossa"), grande: grande("Promptado", { sublinhado: a("existe") }) },
    { de: a("promptado"), ate: a("nossa"), el: <CardPromptado desde={a("promptado")} /> },
    // a plataforma
    {
      de: a("cria"), ate: a("além"),
      el: <><Chips y={Y + 40} itens={[["cria", a("cria")], ["publica", a("publica")], ["automaticamente", a("automaticamente")]]} />
        <Pilula texto="✓ mencionada" desde={a("mencionada")} y={Y + 160} verde /></>,
    },
    {
      de: a("sete"), ate: a("basta"),
      el: <><LogosIAs y={Y} itens={[["chatgpt", a("chatgpt", 5)], ["gemini", a("gemini")], ["google", a("google", 2)], ["claude", a("claude")]]} />
        <Pilula texto="+7 IAs" desde={a("sete")} y={Y + 150} verde />
        <Pilula texto="👀 concorrentes" desde={a("concorrentes")} y={Y + 250} /></>,
    },
    { de: a("reconhecido"), ate: a("se", 3), grande: grande("reconhecido", { sublinhado: a("ele", 4) }) },
    // chamadas
    { de: a("segue"), ate: a("saber", 2), el: <Botao texto="+ Seguir" desde={a("segue")} y={Y + 60} /> },
    { de: chamada, ate: 99999, el: <ComentaIA desde={chamada} digita={a("ia")} envia={a("link")} /> },
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

import { Chips, SeloSolto } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import {
  AlcasNoPost, BarrasConcorrente, CardPromptadoIA, CardResposta, ChamadaComentario, ChatIA, ChipsRiscados,
  ContadorTela, Grade10, Navegador, TelaPior,
} from "./componentes";

// Card do post que já vem gravado no vídeo (canto superior esquerdo): [x, y, largura, altura] em px.
export const CAIXA_DO_POST: [number, number, number, number] = [26, 184, 390, 486];

// Roteiro do vídeo 2 (plano aprovado em edicao/video2/plano.md). fimDoPost = quadro editado em que o card some.
export const roteiroVideo2 = (p: Palavra[], fimDoPost: number): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("comenta");
  // Palavras grandes um pouco mais altas que no vídeo 1: o rosto está próximo e a cabeça cobriria demais.
  const grande = (texto: string, extra: Partial<NonNullable<Item["grande"]>> = {}) => ({
    texto, centro: true, sombra: true, topo: 390, ...extra,
  });
  const aoLadoDoPost: [number, number] = [CAIXA_DO_POST[0] + CAIXA_DO_POST[2] + 24, 900 - (CAIXA_DO_POST[0] + CAIXA_DO_POST[2] + 24)];
  const nove = a("9");
  const passo = (a("compras", 2) - nove) / 9;
  const itens: Item[] = [
    // gancho
    { de: a("post"), ate: fimDoPost, el: <AlcasNoPost desde={a("post")} caixa={CAIXA_DO_POST} /> },
    { de: a("2028"), ate: a("90"), grande: grande("2028", { sublinhado: a("2028", 1, 0.3), area: aoLadoDoPost }) },
    { de: a("90"), ate: a("não"), grande: grande("90%", { contador: true, area: aoLadoDoPost }) },
    {
      de: a("não"), ate: a("segundo"),
      el: <ChipsRiscados y={420} itens={[["humano", a("humano"), a("humano", 1, 0.35)], ["Google", a("google"), a("google", 1, 0.3)]]} />,
    },
    { de: a("gartner"), ate: a("9"), el: <SeloSolto texto="fonte: Gartner" desde={a("gartner")} x={560} y={400} /> },
    {
      de: nove, ate: a("vão", 2), esconde: true,
      el: <Grade10 desde={nove} rotulo="compras entre empresas" preenche={Array.from({ length: 9 }, (_, i) => Math.round(nove + i * passo))} />,
    },
    { de: a("intermediadas"), ate: a("isso"), grande: grande("agentes de IA", { sublinhado: a("agentes", 1, 0.3) }) },
    { de: a("alexa"), ate: a("são"), el: <Chips y={420} itens={[["Alexa", a("alexa")], ["ChatGPT", a("chatgpt")]]} /> },
    {
      de: a("são"), ate: a("pensa"), esconde: true,
      el: (
        <ContadorTela desde={a("são")} rotulo="movimentados por agentes de IA" prefixo="US$" sufixo="trilhões"
          degraus={[[5, a("são", 1, 0.35)], [10, a("15")], [15, a("trilhões")]]} />
      ),
    },
    { de: a("abrir"), ate: a("ele"), el: <Navegador desde={a("abrir")} abas={[a("abrir"), a("abas")]} risco={a("ou", 3)} /> },
    {
      de: a("ele"), ate: a("responder", 1, -0.5), esconde: true,
      el: <ChatIA desde={a("ele")} texto="qual fornecedor eu contrato?" alvos={[["ChatGPT", a("chatgpt", 2)], ["Claude", a("claude")]]} />,
    },
    {
      de: a("responder", 1, -0.5), ate: a("ela"),
      el: (
        <CardResposta desde={a("responder", 1, -0.5)} sua={{ de: a("empresa"), fora: a("aparece") }}
          empresas={[["empresa A", a("duas"), false], ["empresa B", a("duas", 1, 0.1), false], ["empresa C", a("três"), true]]} />
      ),
    },
    { de: a("disputa"), ate: a("pior", 1, -0.3), grande: grande("disputa", { risco: a("parte") }) },
    {
      de: a("pior", 1, -0.3), ate: a("foi"), esconde: true,
      el: (
        <TelaPior desde={a("pior", 1, -0.3)} troca={a("perdeu")} risco={a("venda")}
          palavras={[["você", a("nunca", 1, -0.25)], ["nunca", a("nunca")], ["vai", a("nunca", 1, 0.2)], ["saber", a("saber")]]} />
      ),
    },
    {
      de: a("promptado"), ate: a("se", 3),
      el: <CardPromptadoIA desde={a("promptado")} linha={["as IAs recomendam a sua marca?", a("recomendando")]} selo={["monitorando", a("recomendando", 1, 0.3)]} />,
    },
    { de: a("se", 3), ate: a("quer", 2), el: <BarrasConcorrente desde={a("se", 3)} muda={[a("perdendo"), a("concorrente")]} /> },
    { de: chamada, ate: 99999, esconde: true, el: <ChamadaComentario desde={chamada} ia={a("ia", 3)} botao={a("mostro")} /> },
  ];
  return { chamada, inicioCapitulos: a("em"), itens: itens.filter((i) => i.ate > i.de) };
};

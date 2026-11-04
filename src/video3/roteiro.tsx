import { Botao, CaixaVerde, Chips, TelaChaves } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { ChipsRiscados } from "../video2/componentes";
import { CardPromptadoSimples, CardRespostaCusto, Grade100, PreviaPainel, TelaPainel, TelaValor } from "./componentes";

// Roteiro do vídeo 3 (plano aprovado em edicao/video3/plano.md). Sem palavra atrás da cabeça:
// a cabeça fica no alto do quadro, então as palavras-chave vão em caixa verde sobre o peito.
export const roteiroVideo3 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("entra");
  const itens: Item[] = [
    // gancho
    { de: a("isso"), ate: a("ia"), el: <PreviaPainel desde={a("isso")} ate={a("ia")} /> },
    { de: a("ia"), ate: a("só"), el: <CaixaVerde texto="IA" desde={a("ia")} y={1200} /> },
    { de: a("só"), ate: a("tivemos"), el: <ChipsRiscados y={1210} itens={[["só mais uma ferramenta", a("só"), a("ferramenta")]]} /> },
    // painel no trecho dos números
    {
      de: a("tivemos"), ate: a("vocês", 2), esconde: true,
      el: <TelaPainel desde={a("tivemos")} focos={[["tudo", a("tivemos")], ["visitantes", a("visitas")], ["grafico", a("orgânica")]]} />,
    },
    {
      de: a("com"), ate: a("cada", 1, -0.2), esconde: true,
      el: <TelaPainel desde={a("com")} focos={[["taxa", a("com")]]} sublinhaTaxa={a("12")} />,
    },
    {
      de: a("cada", 1, -0.2), ate: a("só", 2), esconde: true,
      el: <Grade100 desde={a("cada", 1, -0.2)} acende={[a("12", 2), a("12", 2, 0.6)]} quantos={12} rotulo="a cada 100 pessoas" />,
    },
    { de: a("12", 3), ate: a("vieram", 2), el: <CaixaVerde texto="12 pessoas" desde={a("12", 3)} y={1200} /> },
    {
      de: a("vieram", 2), ate: a("porque"), esconde: true,
      el: <TelaValor desde={a("vieram", 2)} rotulo="custo de aquisição" prefixo="R$" valor="0" entra={a("0")} />,
    },
    {
      de: a("chatgpt"), ate: a("estando", 1, -0.3),
      el: <Chips y={1230} itens={[["ChatGPT", a("chatgpt")], ["Gemini", a("gemini")], ["Claude", a("claude")]]} />,
    },
    {
      de: a("estando", 1, -0.3), ate: a("porque", 2),
      el: <CardRespostaCusto desde={a("estando", 1, -0.3)} sua={a("dentro")} vira={a("custo", 2)} cai={[a("baixa"), a("chão")]} />,
    },
    { de: a("recomendado"), ate: a("orgânica", 2), el: <CaixaVerde texto="recomendado" desde={a("recomendado")} y={1200} /> },
    { de: a("orgânica", 2), ate: a("dentro", 2, -0.5), el: <Chips y={1230} itens={[["orgânica", a("orgânica", 2)], ["gratuita", a("gratuita")]]} /> },
    {
      de: a("dentro", 2, -0.5), ate: a("se"), esconde: true,
      el: <TelaChaves desde={a("dentro", 2, -0.5)} palavras={[["dentro", a("dentro", 2)], ["da", a("resposta", 1, -0.3)], ["resposta", a("resposta")], ["da IA", a("ia", 3)]]} />,
    },
    { de: a("promptado"), ate: chamada, el: <CardPromptadoSimples desde={a("promptado")} /> },
    { de: chamada, ate: 99999, el: <Botao texto="entrar em contato ↓" desde={chamada} y={1290} /> },
  ];
  return { chamada, inicioCapitulos: a("vocês", 2), itens: itens.filter((i) => i.ate > i.de) };
};

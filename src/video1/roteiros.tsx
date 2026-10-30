import {
  Botao, CaixaVerde, CardLista, CardPromptado, ChamadaFinal, Chat, Chaves, Chips, Cilindro, Coluna,
  GanchoIA, Grafico, LinkApps, LogoFinal, Rotulo, Selecao, SeloSolto, TelaRisco,
} from "./componentes";
import { criaAncora, Palavra } from "./tempo";

// Roteiro de cada versão (plano aprovado em edicao/video1/plano.md).
// Cada item: [de, até) em quadros; "grande" = palavra atrás da cabeça; "esconde" = tela cheia/chat (sem legenda).
export type Item = {
  de: number;
  ate: number;
  el?: React.ReactNode;
  grande?: {
    texto: string; sublinhado?: number; risco?: number; contador?: boolean; centro?: boolean; sombra?: boolean;
    topo?: number; area?: [number, number];
  };
  esconde?: boolean;
};
export type Roteiro = { itens: Item[]; chamada: number; inicioCapitulos: number };

const IAS = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Grok"];

const gancho = (a: ReturnType<typeof criaAncora>, fimPainel: number): Item[] => [
  { de: a("5"), ate: a("monitora"), grande: { texto: "5", contador: true, sublinhado: a("5", 1, 0.25) } },
  {
    de: a("inteligências"), ate: fimPainel,
    el: <GanchoIA nomes={IAS} desde={a("inteligências")} selecao={a("conhecer")} painel={a("gente")} fim={fimPainel} />,
  },
];

export const roteiroCurta = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("gostou", 1, -0.5);
  return {
    chamada,
    inicioCapitulos: a("vou"),
    itens: [
      ...gancho(a, a("vou")),
      { de: a("vou"), ate: a("mas"), el: <Rotulo texto="01/05" desde={a("vou")} /> },
      { de: a("chatgpt"), ate: a("faz"), grande: { texto: "ChatGPT", sublinhado: a("chatgpt", 1, 0.3) } },
      { de: a("faz"), ate: a("mas"), el: <CaixaVerde texto="faz tudo." desde={a("faz")} /> },
      { de: a("mas"), ate: a("já"), el: <Rotulo texto="02/05" desde={a("mas")} /> },
      { de: a("gemini"), ate: a("aquelas"), grande: { texto: "Gemini", sublinhado: a("gemini", 1, 0.3) } },
      {
        de: a("ecossistema", 1, -0.3), ate: a("já"),
        el: <Chaves palavras={[["ecossistema", a("ecossistema")], ["Google", a("google")]]} desde={a("ecossistema", 1, -0.3)} caixa />,
      },
      { de: a("já"), ate: a("usaria"), el: <Rotulo texto="03/05" desde={a("já")} /> },
      { de: a("claude"), ate: a("realmente", 1, -0.2), grande: { texto: "Claude", sublinhado: a("claude", 1, 0.3) } },
      { de: a("coisas"), ate: a("eu", 3), el: <Selecao texto="complexas." desde={a("complexas", 1, -0.1)} /> },
      { de: a("usaria"), ate: a("grok"), el: <Rotulo texto="04/05" desde={a("usaria")} /> },
      { de: a("perplexity"), ate: a("pesquisador"), grande: { texto: "Perplexity", sublinhado: a("perplexity", 1, 0.3) } },
      {
        de: a("porque"), ate: a("grok"), esconde: true,
        el: <Chat desde={a("porque")} passos={[{ texto: "pesquisar na web e em fontes", de: a("porque", 1, 0.1) }]} envia={a("fontes")} />,
      },
      { de: a("grok"), ate: a("lembrando"), el: <Rotulo texto="05/05" desde={a("grok")} /> },
      { de: a("grok"), ate: a("integrado"), grande: { texto: "Grok", sublinhado: a("grok", 1, 0.3) } },
      { de: a("integrado"), ate: a("então"), el: <LinkApps a="Grok" b="X" desde={a("integrado")} /> },
      {
        de: a("sobre"), ate: a("lembrando"),
        el: <Chaves palavras={[["notícias,", a("notícias")], ["tendências", a("tendências")]]} desde={a("sobre")} caixa />,
      },
      {
        de: a("não"), ate: chamada, esconde: true,
        el: (
          <TelaRisco texto="uma IA para tudo" desde={a("não")} risco={a("tudo")}
            depois={{ desde: a("eu", 4), palavras: [["uma", a("uma", 3)], ["para", a("para", 3)], ["cada", a("cada")], ["questão", a("questão")]] }} />
        ),
      },
      {
        de: chamada, ate: 99999, esconde: true,
        el: <ChamadaFinal desde={chamada} botao={a("siga")} palavras={[["gostou", a("gostou")], ["desse", a("desse")], ["vídeo?", a("vídeo")]]} />,
      },
    ],
  };
};

export const roteiroCompleta = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("gostou", 1, -0.5);
  return {
    chamada,
    inicioCapitulos: a("vou"),
    itens: [
      ...gancho(a, a("vou")),
      { de: a("comparação"), ate: a("entenderem"), grande: { texto: "comparação", sublinhado: a("comparação", 1, 0.3) } },
      {
        de: a("para", 3, -0.2), ate: a("isso"),
        el: <Chaves palavras={[["para", a("para", 3)], ["que", a("que", 3)], ["serve", a("serve")]]} desde={a("para", 3, -0.2)} caixa />,
      },
      { de: a("minha"), ate: a("vou", 2), el: <SeloSolto texto="minha opinião" desde={a("minha")} x={560} y={660} /> },
      // 01/05 ChatGPT
      { de: a("vou", 2), ate: a("eu", 3), el: <Rotulo texto="01/05" desde={a("vou", 2)} /> },
      { de: a("chatgpt"), ate: a("faz"), grande: { texto: "ChatGPT", sublinhado: a("chatgpt", 1, 0.3) } },
      { de: a("faz"), ate: a("ela", 2), el: <CaixaVerde texto="faz tudo." desde={a("faz")} /> },
      {
        de: a("ela", 2), ate: a("se"),
        el: <CardLista titulo="o ChatGPT é bom para" marcador="✓" desde={a("ela", 2)} itens={[["pesquisar", a("pesquisar")], ["ler documentação", a("documentação")]]} />,
      },
      { de: a("se"), ate: a("se", 2), esconde: true, el: <TelaRisco texto="faz tudo de uma vez" desde={a("se")} risco={a("nada")} /> },
      { de: a("melhor"), ate: a("muita"), grande: { texto: "o melhor", risco: a("melhor", 1, 0.15) } },
      // 02/05 Gemini
      { de: a("eu", 3), ate: a("já"), el: <Rotulo texto="02/05" desde={a("eu", 3)} /> },
      { de: a("gemini", 2), ate: a("aquelas"), grande: { texto: "Gemini", sublinhado: a("gemini", 2, 0.3) } },
      {
        de: a("ecossistema", 1, -0.3), ate: a("então"),
        el: <Chaves palavras={[["ecossistema", a("ecossistema")], ["Google", a("google")]]} desde={a("ecossistema", 1, -0.3)} caixa />,
      },
      {
        de: a("então"), ate: a("empresa"),
        el: <CardLista titulo="integra com" desde={a("então")} verdeUltimo itens={[["Google Search", a("google", 2)], ["e-mail", a("email")], ["várias integrações", a("integrações")]]} />,
      },
      { de: a("empresa"), ate: a("já"), el: <Chips y={1200} itens={[["empresa", a("empresa")], ["trabalho", a("trabalho")]]} /> },
      // 03/05 Claude
      { de: a("já"), ate: a("perplexity"), el: <Rotulo texto="03/05" desde={a("já")} /> },
      { de: a("claude"), ate: a("coisas"), grande: { texto: "Claude", sublinhado: a("claude", 1, 0.3) } },
      { de: a("complexas"), ate: a("exemplo"), grande: { texto: "complexas." } },
      {
        de: a("desenvolvedores"), ate: a("extremamente"),
        el: <CardPromptado subtitulo="time de desenvolvimento" selo={["usa Claude ✓", a("usam")]} desde={a("desenvolvedores")} />,
      },
      { de: a("extremamente"), ate: a("tem"), el: <Selecao texto="técnico" desde={a("técnico", 1, -0.15)} /> },
      {
        de: a("maiores", 1, -0.3), ate: a("perplexity"),
        el: <Coluna linhas={[["documentos maiores", a("maiores")], ["pesquisas", a("pesquisas")], ["algo mais complexo", a("complexo")]]} />,
      },
      // 04/05 Perplexity
      { de: a("perplexity"), ate: a("grok"), el: <Rotulo texto="04/05" desde={a("perplexity")} /> },
      { de: a("perplexity"), ate: a("ferramenta"), grande: { texto: "Perplexity", sublinhado: a("perplexity", 1, 0.3) } },
      { de: a("marketing"), ate: a("pesquisas", 2), el: <Chips y={1200} itens={[["marketing", a("marketing")]]} /> },
      { de: a("pesquisas", 2), ate: a("tamanho"), el: <CaixaVerde texto="pesquisas." desde={a("pesquisas", 2)} /> },
      {
        de: a("se", 3), ate: a("eu", 6), esconde: true,
        el: (
          <Chat desde={a("se", 3)} envia={a("inspiração")}
            passos={[
              { texto: "tamanho de mercado", de: a("tamanho"), apaga: a("informações", 1, -0.35) },
              { texto: "informações", de: a("informações"), apaga: a("fontes", 1, -0.3) },
              { texto: "fontes de inspiração", de: a("fontes") },
            ]} />
        ),
      },
      {
        de: a("pesquisador"), ate: a("grok"),
        el: <CardLista titulo="fontes" marcador="↗" desde={a("pesquisador")} itens={[["fonte 1", a("web")], ["fonte 2", a("web", 1, 0.3)], ["fonte 3", a("fontes", 2)]]} />,
      },
      // 05/05 Grok
      { de: a("grok"), ate: a("lembrando"), el: <Rotulo texto="05/05" desde={a("grok")} /> },
      { de: a("grok"), ate: a("integrado"), grande: { texto: "Grok", sublinhado: a("grok", 1, 0.3) } },
      { de: a("integrado"), ate: a("então", 2), el: <LinkApps a="Grok" b="X" desde={a("integrado")} /> },
      {
        de: a("sobre"), ate: a("pessoas"),
        el: <Chaves palavras={[["notícias,", a("notícias")], ["tendências", a("tendências")]]} desde={a("sobre")} caixa />,
      },
      {
        de: a("pessoas", 2), ate: a("principalmente", 2), esconde: true,
        el: <Cilindro palavra="tendências" desde={a("pessoas", 2)} rotulos={[["o que as pessoas falam", a("pessoas", 2, 0.3), "cima"], ["mercado", a("mercado", 3), "baixo"]]} />,
      },
      { de: a("vale"), ate: a("lembrando"), el: <Botao texto="vale a pena ✓" desde={a("vale")} /> },
      {
        de: a("não", 5), ate: a("se", 5), esconde: true,
        el: (
          <TelaRisco texto="uma IA para tudo" desde={a("não", 5)} risco={a("tudo", 3)}
            depois={{ desde: a("eu", 7), palavras: [["uma", a("uma", 9)], ["para", a("uma", 9, 0.3)], ["cada", a("cada", 4)], ["questão", a("questão")]] }} />
        ),
      },
      {
        de: a("se", 5), ate: a("portanto"),
        el: <CardLista titulo="atalho" desde={a("se", 5)} itens={[["programação → Claude", a("programação")], ["generalista e rápido → ChatGPT", a("generalista")]]} />,
      },
      { de: a("otimizar"), ate: a("nosso"), grande: { texto: "otimizar", sublinhado: a("otimizar", 1, 0.3) } },
      { de: a("nosso"), ate: chamada, esconde: true, el: <Grafico titulo="resultados ↑" desde={a("nosso")} /> },
      {
        de: chamada, ate: a("alguém", 1, -0.4), esconde: true,
        el: <ChamadaFinal desde={chamada} botao={a("siga")} palavras={[["gostou", a("gostou")], ["desse", a("desse")], ["vídeo?", a("vídeo")]]} />,
      },
      { de: a("compartilhe"), ate: a("precisa", 2), el: <Botao texto="compartilhar ↗" desde={a("compartilhe")} /> },
      { de: a("amigo"), ate: a("precisa", 2), el: <Chips y={1380} itens={[["amigo", a("amigo")], ["família", a("família")]]} /> },
    ].filter((i) => i.ate > i.de),
  };
};

export { LogoFinal };

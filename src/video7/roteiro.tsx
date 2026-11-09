import { Chips } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { ChipsRiscados } from "../video2/componentes";
import { CardFAQ, CardPagina, Clarao, EsquemaPagina, SeloTopo, TelaLista } from "./componentes";

// Roteiro do vídeo 7 (plano aprovado em edicao/video7/plano.md), estilo B.
// Cards sobre a camiseta, abaixo da legenda de 1 palavra (y ≈ 1000).
const Y_CARD = 1110;

export const VERDES_VIDEO7 = [
  "descritivo", "orlando", "pagina", "ben", "rental", "car", "inteligencia", "artificial", "miami", "aeroporto", "schema", "faq",
  "importantissimo", "ferrari", "servico", "perguntas", "frequentes", "estruturacao", "artificiais",
];

export const roteiroVideo7 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const fim = a("artificiais", 1, 1.5);
  const itens: Item[] = [
    // O selo fica só na abertura: depois a cabeça sobe até o topo do quadro e ele cobriria os olhos.
    { de: 0, ate: a("página"), el: <SeloTopo desde={0} cliente="Ben Rental Car" clienteDesde={a("entra")} /> },
    { de: a("foto", 1, -0.3), ate: a("eu"), el: <ChipsRiscados y={Y_CARD} itens={[["só fotos", a("foto", 1, -0.3), a("foto")]]} /> },
    {
      de: a("página"), ate: a("isso"),
      el: <CardPagina desde={a("página")} y={Y_CARD} titulo="Aluguel de carro em Orlando · Ben Rental Car"
        linhas={[["o que faz", a("faz")], ["onde entrega", a("entrega")]]} />,
    },
    { de: a("isso"), ate: a("isso", 1, 0.3), esconde: true, el: <Clarao em={a("isso")} /> },
    {
      de: a("isso", 1, 0.15), ate: a("pô"), esconde: true,
      el: <TelaLista desde={a("isso", 1, 0.15)} titulo="o que a IA precisa entender"
        itens={[["quem é", a("quem")], ["qual o nicho", a("qual")], ["onde aluga", a("onde", 2)]]} />,
    },
    { de: a("orlando", 5), ate: a("cada"), el: <Chips y={Y_CARD} itens={[["Orlando", a("orlando", 5)], ["Miami", a("miami")], ["✈ aeroporto", a("aeroporto")]]} /> },
    {
      de: a("schema"), ate: a("embaixo"),
      el: <CardFAQ desde={a("schema")} y={Y_CARD} titulo="perguntas frequentes" perguntas={[]} />,
    },
    { de: a("embaixo"), ate: a("então", 2), el: <EsquemaPagina desde={a("embaixo")} encaixa={a("cada", 2)} y={Y_CARD} /> },
    {
      de: a("então", 2), ate: a("pra"),
      el: <CardFAQ desde={a("então", 2)} y={Y_CARD} titulo="sobre o carro"
        perguntas={[["sobre o carro?", a("pergunta")], ["onde entrega?", a("entrego", 2)], ["qual carro?", a("qual", 2)]]} />,
    },
    { de: a("pô", 2), ate: a("pô", 2, 0.3), esconde: true, el: <Clarao em={a("pô", 2)} /> },
    {
      de: a("ferrari"), ate: a("e", 2),
      el: <CardFAQ desde={a("ferrari")} y={Y_CARD} titulo="🏎 Ferrari"
        perguntas={[["entrega em casa ou no aeroporto?", a("entrega", 2)], ["quantos cavalos?", a("quantos")]]} />,
    },
    { de: a("isso", 4), ate: a("isso", 4, 0.3), esconde: true, el: <Clarao em={a("isso", 4)} /> },
    {
      de: a("isso", 4, 0.15), ate: fim + 99999, esconde: true,
      el: <TelaLista desde={a("isso", 4, 0.15)} titulo="resumo da consultoria"
        itens={[["página por cidade", a("isso", 4, 0.3)], ["schema FAQ em cada página", a("estruturação")], ["serviço + perguntas do carro", a("site", 2)]]}
        selo={["= site lido pelas IAs", a("inteligências")]} />,
    },
  ];
  return { chamada: a("inteligências"), inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

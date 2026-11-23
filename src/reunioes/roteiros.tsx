import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula } from "../video6/componentes";
import { Clarao } from "../video7/componentes";
import { BotaoClique, NumeroGrande, SeloBastidores, TelaListaB } from "../cortes/componentes";
import { CardRegular, RankingBorrado } from "./componentes";

// Roteiros dos vídeos 18 a 20 (plano aprovado em edicao/reunioes-18a20/plano.md), estilo B.
export type RoteiroReuniao = Roteiro & { verdes: string[] };
type A = ReturnType<typeof criaAncora>;
const SEM_FIM = 99999;
const selo: Item = { de: 0, ate: 90, el: <SeloBastidores texto="reunião de time" desde={0} ate={90} /> };
const tela = (de: number, ate: number, el: React.ReactNode): Item => ({ de, ate, esconde: true, el });
const clarao = (em: number): Item => ({ de: em - 4, ate: em + 6, esconde: true, el: <Clarao em={em} /> });
const monta = (itens: Item[], chamada: number, verdes: string[]): RoteiroReuniao => ({
  chamada, inicioCapitulos: 0, verdes, itens: itens.filter((i) => i.ate > i.de),
});

// Vídeo 20: você de lado, rosto em y ≈ 500–900; pílulas no topo, sobre a parede.
const video20 = (a: A) => {
  const Y = 300;
  return monta([
    selo,
    { de: a("semana"), ate: a("como"), el: <Pilula texto="🚀 começando a semana" desde={a("semana")} y={Y + 90} verde /> },
    { de: a("como"), ate: a("alinhamento"), el: <Pilula texto="☕ reunião de segunda" desde={a("como")} y={Y} /> },
    { de: a("alinhamento"), ate: a("entender", 1, -0.6), el: <Pilula texto="alinhamento da semana" desde={a("alinhamento")} y={Y} verde /> },
    clarao(a("entender", 1, -0.6)),
    tela(a("entender", 1, -0.6), a("também", 2, -0.4), <TelaListaB desde={a("entender", 1, -0.6)} titulo="a pauta"
      itens={[["o que fizemos", a("fez")], ["o que deixamos de fazer", a("deixou")], ["o que podemos fazer melhor", a("poderia")], ["como foi para cada um", a("cada")]]} />),
    { de: a("melhor", 2), ate: a("luizão", 2), el: <NumeroGrande texto="semana melhor que a passada" desde={a("melhor", 2)} ate={a("luizão", 2)} y={Y} tamanho={76} /> },
    { de: a("luizão", 2), ate: SEM_FIM, el: <Pilula texto="🎤 com a palavra: Luizão" desde={a("luizão", 2)} y={Y} /> },
  ], a("papo"), ["pé", "direito", "time", "alinhamento", "melhor", "fez", "fazer", "luizão", "papo"]);
};

// Vídeo 18: você de frente, rosto no topo (y ≈ 140–700); cards no peito, logo abaixo do queixo.
const video18 = (a: A) => {
  const Y = 800;
  return monta([
    selo,
    { de: 0, ate: a("isso"), el: <RankingBorrado desde={0} borra={a("um")} ate={a("isso")} y={Y} /> },
    { de: a("descobrir"), ate: a("isso"), el: <Pilula texto="🔒 quer ver o resto?" desde={a("descobrir")} y={Y - 100} verde /> },
    { de: a("curiosidade"), ate: a("aqui", 3), el: <NumeroGrande texto="curiosidade" desde={a("curiosidade")} ate={a("aqui", 3)} y={Y} tamanho={130} /> },
    { de: a("aqui", 3), ate: a("outro"), el: <RankingBorrado desde={a("aqui", 3)} borra={a("tiraria")} ate={a("outro")} y={Y} /> },
    {
      de: a("outro"), ate: a("descubra"),
      el: <BotaoClique texto="fale com o especialista" titulo="quer saber os outros?" desde={a("outro")} clique={a("fale")} ate={a("descubra")} y={Y} />,
    },
    { de: a("descubra"), ate: a("faria"), el: <Pilula texto="Descubra seus concorrentes mais citados" desde={a("descubra")} y={Y} tamanho={36} /> },
    { de: a("interrogaçãozinha"), ate: a("quanto"), el: <CardRegular desde={a("interrogaçãozinha")} ate={a("quanto")} y={Y} /> },
    { de: a("quanto"), ate: SEM_FIM, el: <Pilula texto="❓ por que regular?" desde={a("quanto")} y={Y} verde /> },
  ], a("bom"), ["relatório", "quatro", "um", "primeiro", "resto", "contratar", "curiosidade", "embaçado", "especialista", "cta", "concorrentes", "borrado", "regular"]);
};

// Vídeo 19: você de lado, rosto em y ≈ 360–810; pílulas no topo, sobre a parede.
const video19 = (a: A) => {
  const Y = 290;
  return monta([
    selo,
    { de: a("funciona"), ate: a("esse"), el: <Pilula texto="✓ funil funcionando" desde={a("funciona")} y={Y + 90} verde /> },
    tela(a("esse"), a("porque"), <TelaListaB desde={a("esse")} titulo="o funil"
      itens={[["coloca a URL", a("url")], ["relatório grátis", a("relatório")], ["vê a visibilidade", a("visibilidade")], ["vê a reputação", a("reputação")]]} />),
    { de: a("atenção"), ate: a("talvez"), el: <Pilula texto="relatório grátis = atenção" desde={a("atenção")} y={Y} /> },
    { de: a("curiosidade"), ate: a("assim"), el: <NumeroGrande texto="+ curiosidade" desde={a("curiosidade")} ate={a("assim")} y={Y} tamanho={110} /> },
    { de: a("sazonal"), ate: a("pessoal"), el: <NumeroGrande texto="sazonal" desde={a("sazonal")} ate={a("pessoal")} y={Y} tamanho={130} /> },
    { de: a("ano"), ate: a("final", 2), el: <Pilula texto="“ano que vem eu resolvo”" desde={a("ano")} y={Y} /> },
    { de: a("final", 2), ate: a("como", 3), el: <Pilula texto="📅 fim de ano" desde={a("final", 2)} y={Y} verde /> },
    { de: a("teste"), ate: a("teste", 2), el: <Pilula texto="🧪 tudo é teste" desde={a("teste")} y={Y} /> },
    { de: a("teste", 2), ate: SEM_FIM, el: <NumeroGrande texto="teste A/B" desde={a("teste", 2)} y={Y} tamanho={130} /> },
  ], a("teste", 2, -0.4), ["funil", "funciona", "url", "grátis", "visibilidade", "reputação", "curiosidade", "sazonal", "final", "ano", "teste", "testar"]);
};

export const ROTEIROS: Record<string, (a: A) => RoteiroReuniao> = { video18, video19, video20 };
export const roteiroReuniao = (id: string, p: Palavra[]) => ROTEIROS[id](criaAncora(p));

import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Clarao } from "../video7/componentes";
import { Pilula } from "../video6/componentes";
import {
  BalaoWhats, BarraCreditos, BotaoClique, CardLogo, HorariosRiscados, Interruptor, Microfone, NumeroGrande, SeloBastidores, TelaListaB,
} from "./componentes";

// Roteiros dos cortes 1 a 8 (plano aprovado em edicao/cortes-9-12/plano.md), estilo B.
// Cards no topo (y ≈ 380), sobre a parede; a legenda de 1 palavra fica em y ≈ 1300, abaixo do rosto.
export type RoteiroCorte = Roteiro & { verdes: string[] };
type A = ReturnType<typeof criaAncora>;

const SEM_FIM = 99999;
const selo = (texto = "bastidores", ate = 90): Item => ({ de: 0, ate, el: <SeloBastidores texto={texto} desde={0} ate={ate} /> });
const tela = (de: number, ate: number, el: React.ReactNode): Item => ({ de, ate, esconde: true, el });
const clarao = (em: number): Item => ({ de: em - 4, ate: em + 6, esconde: true, el: <Clarao em={em} /> });
const monta = (itens: Item[], chamada: number, verdes: string[]): RoteiroCorte => ({
  chamada, inicioCapitulos: 0, verdes, itens: itens.filter((i) => i.ate > i.de),
});

const corte1 = (a: A) => monta([
  selo(),
  { de: a("19"), ate: a("então"), el: <NumeroGrande texto="19" legenda="vídeos não postados" desde={a("19")} ate={a("então")} y={360} /> },
  { de: a("quarta"), ate: a("então", 3), el: <Pilula texto="📅 só quarta que vem" desde={a("quarta")} y={400} verde /> },
  clarao(a("então", 3)),
  tela(a("eu", 2), a("então", 4), <TelaListaB desde={a("eu", 2)} titulo="melhores horários para postar"
    itens={[["almoço", a("almoço")], ["fim do dia, em casa", a("casa")]]} />),
], a("produzindo"), ["19", "instagram", "quarta", "almoco", "produzindo", "legal"]);

const corte2 = (a: A) => monta([
  selo(),
  { de: a("meiodia"), ate: a("porque"), el: <NumeroGrande texto="12h20" desde={a("meiodia")} ate={a("porque")} y={380} tamanho={200} /> },
  {
    de: a("meio", 2), ate: a("nunca"),
    el: <HorariosRiscados itens={[["12:00", a("meio", 2)], ["12:00", a("meio", 3)], ["12:00", a("meio", 4)]]} risca={a("robô")} ate={a("nunca")} y={400} />,
  },
  {
    de: a("meio", 5), ate: SEM_FIM,
    el: <HorariosRiscados itens={[["12:01", a("meio", 5)], ["12:02", a("meio", 6)], ["12:20", a("qualquer")]]} risca={SEM_FIM} y={400} />,
  },
  { de: a("qualquer"), ate: SEM_FIM, el: <NumeroGrande texto="qualquer horário" desde={a("qualquer")} y={560} tamanho={84} /> },
], a("qualquer"), ["meio-dia", "vinte", "robo", "qualquer", "horario"]);

const corte3 = (a: A) => monta([
  selo("bastidores", 75),
  { de: a("shopee"), ate: a("claude"), el: <Pilula texto="🛍️ lojinha na Shopee" desde={a("shopee")} y={400} /> },
  { de: a("claude"), ate: a("programou"), el: <CardLogo logo="claude" nome="Claude" desde={a("claude")} ate={a("programou")} y={380} /> },
  {
    de: a("programou"), ate: a("aí", 2),
    el: <BotaoClique texto="✓ aceitar" titulo="o Claude montou tudo" desde={a("programou")} clique={a("aceitar")} ate={a("aí", 2)} y={360} />,
  },
  { de: a("aí", 2), ate: SEM_FIM, el: <BarraCreditos desde={a("aí", 2)} esvazia={a("créditos")} y={380} /> },
], a("créditos"), ["lojinha", "shopee", "claude", "aceitar", "creditos", "parou"]);

const corte4 = (a: A) => monta([
  selo(),
  { de: a("48"), ate: a("carolzinha"), el: <NumeroGrande texto="48" legenda="leads no trial que não pagaram" desde={a("48")} ate={a("carolzinha")} y={360} /> },
  { de: a("whatsapp"), ate: a("vamos"), el: <CardLogo logo="whatsapp" nome="WhatsApp" desde={a("whatsapp")} ate={a("vamos")} y={380} /> },
  tela(a("vamos"), a("talvez", 2), <TelaListaB desde={a("vamos")} titulo="a campanha"
    itens={[["desconto", a("desconto")], ["vídeo pro cliente", a("vídeo")], ["personalizado", a("personalizado")]]} />),
  { de: a("citação"), ate: a("pô"), el: <NumeroGrande texto="citação nas IAs" desde={a("citação")} ate={a("pô")} y={400} tamanho={90} /> },
  {
    de: a("pô"), ate: SEM_FIM,
    el: <BalaoWhats texto="Pô, você tá há tanto tempo aí já, você se inscreveu e vai deixar…" desde={a("pô")} y={360} />,
  },
], a("pô"), ["48", "trial", "whatsapp", "desconto", "video", "personalizado", "citacao", "ias"]);

const corte5 = (a: A) => monta([
  selo(),
  { de: a("zero"), ate: a("quando"), el: <NumeroGrande texto="0%" legenda="de conversão" verde={false} desde={a("zero")} ate={a("quando")} y={360} /> },
  clarao(a("quando")),
  { de: a("30"), ate: a("cara"), el: <NumeroGrande texto="30 dias" legenda="de consultoria" desde={a("30")} ate={a("cara")} y={380} tamanho={170} /> },
  tela(a("justamente"), a("consultoria", 2, 0.4), <TelaListaB desde={a("justamente")} titulo="por que ele queria cancelar"
    itens={[["não viu resultado", a("resultados")], ["não colocou em prática", a("colocou")], ["sem tempo", a("tempo")]]} />),
  { de: a("30", 2), ate: a("gabriel"), el: <NumeroGrande texto="+30 dias" legenda="com a gente" desde={a("30", 2)} ate={a("gabriel")} y={380} tamanho={170} /> },
  { de: a("mostrar"), ate: SEM_FIM, el: <Pilula texto="✓ mostrar resultado" desde={a("mostrar")} y={400} verde /> },
], a("gabriel"), ["convertido", "zero", "conversao", "estrategia", "cancelamento", "30", "dias", "consultoria", "resultado"]);

const corte6 = (a: A) => monta([
  selo(),
  { de: a("duas"), ate: a("essa"), el: <NumeroGrande texto="2 campanhas" desde={a("duas")} ate={a("essa")} y={380} tamanho={140} /> },
  tela(a("essa"), a("ele"), <TelaListaB desde={a("essa")} titulo="campanha 1" subtitulo="para quem já foi cliente" check
    itens={[["plano personalizado", a("personalizado")], ["30 dias de consultoria grátis", a("grátis")]]} />),
  { de: a("ele"), ate: a("agora", 2), el: <Pilula texto="campanha 1 · quem já foi cliente" desde={a("ele")} y={400} tamanho={38} /> },
  tela(a("agora", 2), a("estruturinha"), <TelaListaB desde={a("agora", 2)} titulo="campanha 2" subtitulo="para quem está conhecendo" check
    itens={[["plano avulso com desconto", a("avulso")], ["reunião de onboarding", a("onboarding")]]} />),
  { de: a("estruturinha"), ate: SEM_FIM, el: <Pilula texto="🖤 Black Friday Promptado" desde={a("estruturinha")} y={400} verde /> },
], a("ganhando"), ["black", "friday", "duas", "campanhas", "personalizado", "consultoria", "30", "dias", "gratis", "avulso", "desconto", "onboarding"]);

const corte7 = (a: A) => monta([
  selo(),
  tela(a("arte", 1, -0.3), a("viu"), <TelaListaB desde={a("arte", 1, -0.3)} titulo="o processo"
    itens={[["a arte", a("arte")], ["duas mensagens", a("duas")], ["eu ou o Jorge entra", a("jorge")]]} />),
  { de: a("liga"), ate: a("boa"), el: <Pilula texto="📞 liga pra ele" desde={a("liga")} y={400} verde /> },
  { de: a("boa"), ate: SEM_FIM, el: <NumeroGrande texto="é isso aí!" desde={a("boa")} y={380} tamanho={110} /> },
], a("boa"), ["time", "engajado", "arte", "mensagens", "jorge", "liga", "legal"]);

const corte8 = (a: A) => monta([
  selo("antes do webinar"),
  { de: a("andré"), ate: a("me"), el: <Pilula texto="host: André" desde={a("andré")} y={400} /> },
  { de: a("me"), ate: a("consegue", 2), el: <Microfone desde={a("me")} muta={a("calado")} ate={a("consegue", 2)} y={380} /> },
  {
    de: a("parte"), ate: a("aqui", 3),
    el: <BotaoClique texto="silenciar todos" titulo="Meet · pessoas" desde={a("parte")} clique={a("silenciar")} ate={a("aqui", 3)} y={360} />,
  },
  {
    de: a("aqui", 3), ate: a("cala", 2),
    el: <Interruptor texto="Permitir que colaboradores ativem o microfone" desde={a("aqui", 3)} desliga={a("tenta")} ate={a("cala", 2)} y={380} />,
  },
  { de: a("cala", 2), ate: a("participei"), el: <NumeroGrande texto="cala a boca, todo mundo" desde={a("cala", 2)} ate={a("participei")} y={380} tamanho={96} /> },
  { de: a("concorrente"), ate: SEM_FIM, el: <NumeroGrande texto="concorrente?" desde={a("concorrente")} y={400} tamanho={120} /> },
], a("concorrente"), ["bagunca", "host", "calado", "silenciar", "todos", "microfone", "cala", "boca", "concorrente", "meet"]);

export const ROTEIROS: Record<string, (a: A) => RoteiroCorte> = { corte1, corte2, corte3, corte4, corte5, corte6, corte7, corte8 };
export const roteiroCorte = (id: string, p: Palavra[]) => ROTEIROS[id](criaAncora(p));

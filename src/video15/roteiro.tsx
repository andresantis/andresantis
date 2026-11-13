import { LogoPromptado } from "../LogoPromptado";
import { CORES } from "../marca";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula } from "../video6/componentes";
import { Clarao } from "../video7/componentes";
import { NumeroGrande, SeloBastidores, TelaListaB } from "../cortes/componentes";
import { ChipsRisco } from "../video13/componentes";

// Roteiro do vídeo 15 (plano aprovado em edicao/video15/plano.md), estilo B.
// Topo (parede clara, y 270–470) para selo, pílulas e números; a legenda de 1 palavra fica sobre a camiseta.
export const VERDES_VIDEO15 = [
  "escassa", "sucesso", "contratacoes", "promptado", "crescimento", "pratica", "executar", "cs", "dois", "dias",
  "normal", "confiantes", "confiante", "livre", "arbitrio",
];
const Y = 330;
const SEM_FIM = 99999;

export const roteiroVideo15 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("livre");
  const tela = (de: number, ate: number, el: React.ReactNode): Item => ({ de, ate, esconde: true, el });
  const clarao = (em: number): Item => ({ de: em - 4, ate: em + 6, esconde: true, el: <Clarao em={em} /> });
  const itens: Item[] = [
    // gancho
    { de: 0, ate: 90, el: <SeloBastidores texto="gestão" desde={0} ate={90} /> },
    { de: a("sucesso"), ate: a("promptado"), el: <Pilula texto="✓ contratações certas" desde={a("sucesso")} y={Y + 40} verde /> },
    {
      de: a("promptado"), ate: a("foco"),
      el: <Pilula texto={<><LogoPromptado tamanho={40} cor={CORES.dark.texto} /> 📈 em crescimento</>} desde={a("promptado")} y={Y} />,
    },
    clarao(a("foco")),
    { de: a("foco"), ate: a("como"), el: <ChipsRisco y={Y} itens={[["saber tudo antes", a("tudo"), a("executar")]]} /> },
    { de: a("prática"), ate: a("coloco"), el: <NumeroGrande texto="prática > teoria" desde={a("prática")} y={Y} tamanho={100} /> },
    tela(a("coloco"), a("normalmente"), <TelaListaB desde={a("coloco")} titulo="como eles aprendem"
      itens={[["executando", a("executar", 2)], ["pesquisando nos documentos", a("pesquisar")], ["falando com o time", a("falando")], ["testando soluções", a("tentando")]]} />),
    { de: a("diminui"), ate: a("então", 2), el: <Pilula texto="⚡ curva de aprendizado menor" desde={a("diminui")} y={Y} verde tamanho={40} /> },
    clarao(a("então", 2)),
    { de: a("cs"), ate: a("dois"), el: <Pilula texto="novo CS · customer success" desde={a("cs")} y={Y} tamanho={40} /> },
    { de: a("dois"), ate: a("como", 2), el: <NumeroGrande texto="2 dias" legenda="executando tudo" desde={a("dois")} y={300} tamanho={170} /> },
    tela(a("como", 2), a("então", 3), <TelaListaB desde={a("como", 2)} titulo="como foi"
      itens={[["dia 1: acompanhamento", a("primeiro")], ["já faz tarefas", a("tarefa")], ["recebe metade das tarefas", a("metade")], ["acompanhamento de perto", a("acompanho")]]} />),
    {
      de: a("errar"), ate: a("mas", 2),
      el: <><Pilula texto="ele vai errar" desde={a("errar")} y={Y - 20} /><Pilula texto="✓ é normal" desde={a("normal")} y={Y + 70} verde /></>,
    },
    { de: a("confiantes"), ate: a("requisitando"), el: <NumeroGrande texto="confiantes" desde={a("confiantes")} y={Y} tamanho={130} /> },
    { de: a("livre"), ate: SEM_FIM, el: <><Pilula texto="autonomia" desde={a("livre")} y={Y - 20} /><Pilula texto="✓ confiança para executar" desde={a("confiante")} y={Y + 70} verde /></> },
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

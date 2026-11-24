import { LogoPromptado } from "../LogoPromptado";
import { CORES } from "../marca";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula } from "../video6/componentes";
import { Clarao } from "../video7/componentes";
import { SeloBastidores } from "../cortes/componentes";
import { CardEscolha, FraseGrande, TelaListaXV } from "./componentes";

// Roteiro do vídeo 22 (plano aprovado em edicao/video22/plano.md), estilo B.
// Topo (teto do carro, y 270–450) para selo, pílulas e frases grandes; a legenda de 1 palavra fica sobre a camiseta.
export const VERDES_VIDEO22 = ["caro", "cara", "elogio", "barato", "beneficios", "justamente"];
// Frase da capa.
export const FRASE_VIDEO22: [string, boolean?][] = [["Me chamaram de caro. "], ["É um elogio.", true]];
const Y = 300;
const SEM_FIM = 99999;
const tela = (de: number, ate: number, el: React.ReactNode): Item => ({ de, ate, esconde: true, el });
const clarao = (em: number): Item => ({ de: em - 4, ate: em + 6, esconde: true, el: <Clarao em={em} /> });

export const roteiroVideo22 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("fica");
  const lista = a("ofendi", 1, -0.4);
  const pergunta = a("aí", 1, -0.3);
  const itens: Item[] = [
    // gancho: o conflito antes de você chegar nele
    { de: 0, ate: a("mas"), el: <SeloBastidores texto="reunião com cliente" desde={0} ate={a("mas")} /> },
    { de: 8, ate: a("mas"), el: <Pilula texto="💬 “a sua é mais cara”" desde={8} y={Y + 95} /> },
    { de: a("plataforma"), ate: a("sim"), el: <Pilula texto="“a sua plataforma é mais cara”" desde={a("plataforma")} y={Y} tamanho={38} /> },
    { de: a("sim"), ate: a("quando"), el: <Pilula texto="✓ sim, é mais cara" desde={a("sim")} y={Y} verde /> },
    // "não me ofendi e nem tentei contestar, eu só afirmei"
    tela(lista, a("porque"), <TelaListaXV desde={lista} titulo="o que eu fiz"
      itens={[["me ofender", a("ofendi"), false], ["contestar", a("contestar"), false], ["afirmar", a("afirmei"), true]]} />),
    clarao(a("porque")),
    { de: a("elogio"), ate: a("elogio", 2), el: <FraseGrande partes={[["caro = "], ["elogio", true]]} desde={a("elogio")} ate={a("elogio", 2)} y={Y - 10} tamanho={104} /> },
    { de: a("elogio", 2), ate: a("imagina"), el: <FraseGrande partes={[["caro = "], ["elogio", true]]} desde={a("elogio", 2)} ate={a("imagina")} y={Y - 10} tamanho={104} /> },
    { de: a("barato"), ate: pergunta, el: <Pilula texto="❌ barato = não vale o que entrega" desde={a("barato")} y={Y} tamanho={36} /> },
    // a pergunta ao cliente
    clarao(pergunta),
    { de: a("preço"), ate: a("perguntei", 2), el: <CardEscolha desde={a("preço")} escolhe={a("assinaria", 2)} ate={a("perguntei", 2)} y={Y - 20} /> },
    { de: a("benefícios"), ate: a("justamente", 2), el: <Pilula texto="🎁 por todos os benefícios" desde={a("benefícios")} y={Y} verde /> },
    { de: a("justamente", 2), ate: chamada, el: <FraseGrande partes={[["por isso sou "], ["mais caro", true]]} desde={a("justamente", 2)} ate={chamada} y={Y - 10} tamanho={80} /> },
    // fecho
    { de: chamada, ate: SEM_FIM, el: <Pilula texto="💡 fica a dica" desde={chamada} y={Y} verde tamanho={48} /> },
    {
      de: a("alguém"), ate: SEM_FIM,
      el: <Pilula texto={<><LogoPromptado tamanho={36} cor={CORES.dark.texto} /> Promptado</>} desde={a("alguém")} y={Y + 100} tamanho={34} />,
    },
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

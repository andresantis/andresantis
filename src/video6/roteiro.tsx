import { staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES } from "../marca";
import { Botao } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { ChipsRiscados } from "../video2/componentes";
import {
  BarraBusca, CardVisibilidade, ChaveTravada, IconeLogo, LinhaLogos, LOGOS, PerfisParaResposta, Pilula, PilulasEmpilhadas,
  PrintCelular,
} from "./componentes";

// Roteiro do vídeo 6 (plano aprovado em edicao/video6/plano.md), estilo C.
// Topo: pílulas em y 270–340. Acima da cabeça: cards em y 360–550.
const Y_PILULA = 272;
const Y_CARD = 370;

export const roteiroVideo6 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("clica");
  const itens: Item[] = [
    // gancho
    { de: a("novidade"), ate: a("realidade", 1, 0.4), el: <Pilula texto="novidade" desde={a("novidade")} y={Y_PILULA} verde tamanho={40} /> },
    {
      de: a("instagram"), ate: a("realidade", 1, 0.4),
      el: (
        <Pilula desde={a("instagram")} y={Y_PILULA + 84} tamanho={36}
          texto={<><IconeLogo logo={LOGOS.instagram} tamanho={42} /> IA na busca do Instagram</>} />
      ),
    },
    { de: a("busca"), ate: a("lista"), el: <BarraBusca desde={a("busca")} metaIA={a("ia", 2)} y={Y_PILULA + 176} /> },
    { de: a("existe"), ate: a("mudou"), el: <Pilula texto="✗ sua empresa fora da resposta" desde={a("existe")} y={Y_PILULA + 176} tamanho={36} /> },
    { de: a("lista"), ate: a("monta", 1, -0.3), el: <PerfisParaResposta desde={a("lista")} risco={a("lembra")} resposta={99999} y={Y_CARD} /> },
    // print real: busca "andre santis" na Meta IA do Instagram (enviado pelo André)
    {
      de: a("monta", 1, -0.3), ate: a("impossível"), esconde: true,
      el: (
        <PrintCelular src={staticFile("video6/busca-andre-santis.jpg")} recorte={[0, 100, 736, 930]}
          desde={a("monta", 1, -0.3)} ate={a("impossível")} largura={640} y={360} />
      ),
    },
    { de: a("confirma"), ate: a("impossível"), el: <Pilula texto="✓ confirmado pela Meta" desde={a("confirma")} y={Y_PILULA} verde /> },
    { de: a("impossível"), ate: a("qual"), el: <Pilula texto="não dá para desativar" desde={a("impossível")} y={Y_PILULA} /> },
    { de: a("impossível"), ate: a("qual"), el: <ChaveTravada desde={a("impossível")} tenta={a("desativar")} y={Y_CARD} /> },
    // ponto de atenção
    { de: a("atenção"), ate: a("cliente", 2), el: <Pilula texto="⚠ ponto de atenção" desde={a("atenção")} y={Y_PILULA} /> },
    {
      de: a("instagram", 4), ate: a("cliente", 2),
      el: (
        <LinhaLogos y={Y_CARD + 30}
          itens={[["instagram", a("instagram", 4)], ["chatgpt", a("chatgpt")], ["gemini", a("gemini")], ["perplexity", a("perplexity")], ["google", a("google")]]} />
      ),
    },
    {
      de: a("links"), ate: a("ela"),
      el: <ChipsRiscados y={Y_CARD + 30} itens={[["links", a("links"), a("links", 1, 0.3)], ["perfis", a("perfis"), a("perfis", 1, 0.3)]]} />,
    },
    { de: a("pronta"), ate: a("rápido"), el: <Pilula texto="resposta pronta ✓" desde={a("pronta")} y={Y_PILULA} verde /> },
    // print real: busca "promptado" na Meta IA do Instagram (enviado pelo André)
    {
      de: a("ela"), ate: a("rápido"), esconde: true,
      el: (
        <PrintCelular src={staticFile("video6/busca-promptado.jpg")} recorte={[0, 100, 736, 835]}
          desde={a("ela")} ate={a("rápido")} largura={720} y={400} />
      ),
    },
    {
      de: a("rápido"), ate: a("ponto", 2),
      el: <PilulasEmpilhadas y={Y_PILULA} itens={[["rápido", a("rápido")], ["eficiente", a("eficiente")], ["curto, seco e direto", a("direto")]]} />,
    },
    { de: a("maioria"), ate: a("monitora"), el: <Pilula texto="a maioria das empresas" desde={a("maioria")} y={Y_PILULA} /> },
    {
      de: a("monitora"), ate: a("promptado"),
      el: <PilulasEmpilhadas y={Y_PILULA} itens={[["✗ não monitora", a("monitora")], ["✗ não mede", a("mede")], ["✗ não faz nada", a("nada")]]} />,
    },
    {
      de: a("promptado"), ate: a("exemplo"),
      el: <Pilula desde={a("promptado")} y={Y_PILULA} tamanho={38} texto={<><LogoPromptado tamanho={40} cor={CORES.dark.texto} /> Promptado resolve</>} />,
    },
    {
      de: a("exemplo"), ate: a("se", 3),
      el: <CardVisibilidade desde={a("exemplo")} zero={a("zero")} vinte={a("20")} mes={a("mês")} y={Y_CARD} />,
    },
    { de: chamada, ate: 99999, el: <Botao texto="relatório gratuito ↓" desde={chamada} y={Y_CARD + 20} /> },
    { de: a("gratuito"), ate: 99999, el: <Pilula texto="✓ 100% gratuito" desde={a("gratuito")} y={Y_PILULA} verde /> },
  ];
  return { chamada, inicioCapitulos: a("mudou"), itens: itens.filter((i) => i.ate > i.de) };
};

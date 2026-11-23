import { LogoPromptado } from "../LogoPromptado";
import { CORES } from "../marca";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula } from "../video6/componentes";
import { NumeroGrande, SeloBastidores } from "../cortes/componentes";
import { CardFrase } from "../video16/componentes";

// Roteiro do vídeo 17 (plano aprovado em edicao/video17/plano.md), estilo B.
// Topo (estante, y 270–450) para selo e pílulas; a legenda de 1 palavra fica sobre a camisa.
export const VERDES_VIDEO17 = ["30", "dias", "visibilidade", "devolvo", "dinheiro", "black", "friday", "promptado", "garantia", "concorrentes", "clientes"];
// Frase do card e da capa: provisória até chegar a imagem do André.
export const FRASE_VIDEO17: [string, boolean?][] = [["Sua empresa nas "], ["IAs"], [" ou "], ["seu dinheiro de volta", true]];
const Y = 340;
const SEM_FIM = 99999;

export const roteiroVideo17 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("entra", 2);
  const itens: Item[] = [
    // gancho
    { de: 0, ate: a("30"), el: <SeloBastidores texto="black friday" desde={0} ate={a("30")} /> },
    { de: a("30"), ate: a("devolvo"), el: <NumeroGrande texto="30 dias" desde={a("30")} ate={a("devolvo")} y={290} tamanho={170} /> },
    { de: a("devolvo"), ate: a("nesta"), el: <Pilula texto="💸 dinheiro de volta" desde={a("devolvo")} y={Y} verde /> },
    {
      de: a("black"), ate: a("garantia"),
      el: <Pilula texto={<><LogoPromptado tamanho={40} cor={CORES.dark.texto} /> Black Friday</>} desde={a("black")} y={Y} />,
    },
    { de: a("garantia"), ate: a("devolvo", 2), el: <NumeroGrande texto="garantia de 30 dias" desde={a("garantia")} ate={a("devolvo", 2)} y={Y - 20} tamanho={72} /> },
    { de: a("devolvo", 2), ate: a("chega"), el: <Pilula texto="✓ dinheiro de volta" desde={a("devolvo", 2)} y={Y} verde /> },
    { de: a("concorrentes"), ate: a("clientes"), el: <Pilula texto="❌ concorrentes no seu espaço" desde={a("concorrentes")} y={Y} /> },
    { de: a("clientes"), ate: chamada, el: <Pilula texto="❌ seus clientes com eles" desde={a("clientes")} y={Y} /> },
    // você aponta para cima: card da frase + "Saiba mais"
    { de: chamada, ate: SEM_FIM, esconde: true, el: <CardFrase desde={chamada} ate={SEM_FIM} frase={FRASE_VIDEO17} top={1220} /> },
    { de: a("clica"), ate: SEM_FIM, el: <Pilula texto="↑ Saiba mais" desde={a("clica")} y={Y} verde tamanho={48} /> },
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

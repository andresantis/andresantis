import { Grafico } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import {
  BotaoPreco, CardPromptado, ChamadaBotaoAbaixo, Checklist, EtiquetaPreco, PainelIAs, TelaArtigo, TelaRespostaIA,
} from "./componentes";

// Roteiro do vídeo 23 (plano aprovado em edicao/video23/plano.md), estilo A.
// "atras": o elemento fica ATRÁS da pessoa (como a palavra grande), na faixa da estante logo abaixo da legenda.
export type ItemA = Item & { atras?: boolean };
export type RoteiroA = Omit<Roteiro, "itens"> & { itens: ItemA[] };

const Y = 345; // faixa da estante, logo abaixo da legenda do topo
const SEM_FIM = 99999;

export const roteiroVideo23 = (p: Palavra[]): RoteiroA => {
  const a = criaAncora(p);
  const chamada = a("clica");
  const grande = (texto: string, extra: Partial<NonNullable<Item["grande"]>> = {}) => ({ texto, centro: true, sombra: true, topo: Y, ...extra });
  const tela = (de: number, ate: number, el: React.ReactNode): ItemA => ({ de, ate, esconde: true, el });
  const atras = (de: number, ate: number, el: React.ReactNode): ItemA => ({ de, ate, atras: true, el });
  const itens: ItemA[] = [
    // gancho
    { de: a("marketing"), ate: a("seo"), grande: grande("marketing", { sublinhado: a("empresa", 1, 0.2) }) },
    // onde você já investe… e o que falta
    atras(a("seo"), a("se", 3), <Checklist y={Y} ate={a("se", 3)}
      itens={[["SEO", a("seo"), false], ["tráfego pago", a("tráfego"), false], ["portais de notícia", a("meios"), false], ["respostas das IAs ?", a("respostas"), true]]} />),
    { de: a("ficando"), ate: a("já", 3), grande: grande("pra trás", { risco: undefined }) },
    // mercado em expansão
    tela(a("já", 3), a("nós", 1, -0.3), <Grafico titulo="expansão ↑" desde={a("já", 3)} />),
    // Promptado: referência e pioneiros
    atras(a("nós", 1, -0.3), a("referência"), <CardPromptado desde={a("nós", 1, -0.3)} y={Y} ate={a("referência")} />),
    { de: a("referência"), ate: a("pioneiros"), grande: grande("referência", { sublinhado: a("referência", 1, 0.3) }) },
    atras(a("pioneiros"), a("não", 2), <CardPromptado desde={a("pioneiros")} y={Y} selo={["pioneiros em GEO e AEO", a("pioneiros")]} ate={a("não", 2)} />),
    // não somos o mais barato
    atras(a("não", 2), a("se", 4), <EtiquetaPreco desde={a("não", 2)} risco={a("barato")} y={Y} ate={a("se", 4)} />),
    atras(a("se", 4), a("se", 5), <BotaoPreco desde={a("se", 4)} trava={a("clicar")} y={Y} ate={a("se", 5)} />),
    // conteúdo de qualidade
    tela(a("se", 5), a("se", 7), <TelaArtigo desde={a("se", 5)} blog={a("blogs")} portal={a("meios", 2)} qualidade={a("qualidade")} />),
    // monitoramento nas principais IAs
    atras(a("monitoramento"), a("quer", 1, -0.3), <PainelIAs desde={a("monitoramento")} y={Y} ate={a("quer", 1, -0.3)}
      itens={[["chatgpt", a("principais")], ["gemini", a("inteligências", 2)], ["claude", a("artificiais", 2)], ["perplexity", a("mercado", 3)]]} />),
    // resultado: sua marca como referência na resposta
    tela(a("quer", 1, -0.3), chamada, <TelaRespostaIA desde={a("quer", 1, -0.3)} resposta={a("resultado")} marca={a("referência", 2)} />),
    // chamada final
    tela(chamada, SEM_FIM, <ChamadaBotaoAbaixo desde={chamada} botao={a("botão")}
      palavras={[["nas", chamada + 4], ["respostas", chamada + 8], ["das IAs", chamada + 12]]} />),
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

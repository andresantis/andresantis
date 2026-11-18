import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula } from "../video6/componentes";
import { NumeroGrande, SeloBastidores } from "../cortes/componentes";
import { CardFrase, CobreFaixaAntiga } from "./componentes";

// Roteiro do vídeo 16 (plano aprovado em edicao/video16/plano.md), estilo B.
export const VERDES_VIDEO16 = ["plano", "copia", "cola", "valor", "criatividade", "case", "igual", "igualzinho", "desistir"];
const Y = 330;
const SEM_FIM = 99999;
// A faixa vermelha do original vai até 2,6 s do original = 2,2 s do editado (quadro 66).
const FIM_FAIXA_ANTIGA = 70;

export const roteiroVideo16 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("desistir");
  const itens: Item[] = [
    // gancho: a frase nas cores da marca, cobrindo a faixa vermelha antiga
    { de: 0, ate: FIM_FAIXA_ANTIGA + 6, esconde: true, el: <CobreFaixaAntiga ate={FIM_FAIXA_ANTIGA} /> },
    { de: 0, ate: 105, esconde: true, el: <CardFrase desde={0} ate={105} /> },
    { de: 0, ate: 90, el: <SeloBastidores texto="bastidores" desde={0} ate={90} /> },
    { de: a("copia"), ate: a("sério"), el: <Pilula texto="📋 copia e cola" desde={a("copia")} y={Y} /> },
    { de: a("tirar"), ate: a("deixa"), el: <Pilula texto="❌ tirar o cliente?" desde={a("tirar")} y={Y} /> },
    { de: a("deixa"), ate: a("se", 2), el: <Pilula texto="✓ deixa usar" desde={a("deixa")} y={Y} verde /> },
    { de: a("case"), ate: a("verdade"), el: <Pilula texto="crie o seu próprio case" desde={a("case")} y={Y} verde /> },
    { de: a("site"), ate: a("bom", 2), el: <NumeroGrande texto="3, 4 sites iguais" desde={a("site")} y={Y} tamanho={100} /> },
    // você aponta para a câmera: a frase volta
    { de: a("bom", 2), ate: a("muita"), esconde: true, el: <CardFrase desde={a("bom", 2)} ate={a("muita")} /> },
    { de: a("muita"), ate: SEM_FIM, el: <NumeroGrande texto="muita gente vai desistir" desde={a("muita")} y={Y} tamanho={92} /> },
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

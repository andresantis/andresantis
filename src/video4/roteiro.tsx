import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { ChamadaComentario } from "../video2/componentes";
import { itensResultado } from "../video3/roteiro";
import { CardRanking, ChipsPergunta, NotificacaoDirect } from "./componentes";

// Roteiro do vídeo 4 (plano aprovado em edicao/video4/plano.md): igual ao vídeo 3 até
// "...dentro da resposta da IA." e com o final novo ("comenta IA", direct com o link).
export const roteiroVideo4 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("comenta");
  const itens: Item[] = [
    ...itensResultado(a),
    {
      de: a("inteligências", 1), ate: a("e", 1),
      el: <ChipsPergunta y={1230} itens={[["ChatGPT", a("inteligências", 1)], ["Gemini", a("inteligências", 1, 0.15)], ["Claude", a("inteligências", 1, 0.3)]]} />,
    },
    { de: a("promptado"), ate: chamada, el: <CardRanking desde={a("promptado")} vira={a("primeiro")} sobe={a("lugar")} /> },
    { de: chamada, ate: 99999, esconde: true, el: <ChamadaComentario desde={chamada} ia={a('"IA"')} botao={a("lá")} /> },
    { de: a("direct"), ate: 99999, esconde: true, el: <NotificacaoDirect desde={a("direct")} /> },
  ];
  return { chamada, inicioCapitulos: a("vocês", 2), itens: itens.filter((i) => i.ate > i.de) };
};

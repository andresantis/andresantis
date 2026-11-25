import { Item } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Clarao } from "../video7/componentes";
import { ItemA, RoteiroA } from "../video23/roteiro";
import {
  CardPlano, CardPromptado, ChamadaContato, Comentario, LogosIAs, ORIGEM_RANKING, Pilulas, Tela3Numeros, TelaChatIA, TelaFontes,
  TelaPassos, TelaPlataforma,
} from "./componentes";

// Roteiro do vídeo 25 (plano aprovado em edicao/video25/plano.md), estilo A.
// "atras": o elemento fica ATRÁS da pessoa (como a palavra grande), na faixa da estante logo abaixo da legenda.
const Y = 345;
const SEM_FIM = 99999;

export const roteiroVideo25 = (p: Palavra[]): RoteiroA => {
  const a = criaAncora(p);
  const chamada = a("se", 7);
  const grande = (texto: string, extra: Partial<NonNullable<Item["grande"]>> = {}) => ({ texto, centro: true, sombra: true, topo: Y, ...extra });
  const atras = (de: number, ate: number, el: React.ReactNode): ItemA => ({ de, ate, atras: true, el });
  // tela cheia com clarão na entrada
  const tela = (de: number, ate: number, el: React.ReactNode): ItemA[] => [
    { de, ate, esconde: true, el },
    { de: de - 4, ate: de + 6, esconde: true, el: <Clarao em={de} /> },
  ];
  const itens: ItemA[] = [
    // gancho
    { de: a("agora"), ate: a("descobrir"), grande: grande("agora", { sublinhado: a("agora", 1, 0.25) }) },
    ({ de: a("descobrir"), ate: a("respostas"), el: <LogosIAs desde={a("descobrir")} rotulo={a("empresas")} y={Y} ate={a("respostas")} /> }),
    ...tela(a("respostas"), a("nós"), <TelaChatIA desde={a("respostas")} resposta={a("inteligências")} marca={a("artificiais")} organico={a("orgânica")} />),
    // Promptado: especialistas e pioneiros
    ({ de: a("nós"), ate: a("simplesmente", 1, -0.4), el: <CardPromptado desde={a("nós")} y={Y} selo={["especialistas em GEO e AEO", a("especialistas")]}
      ate={a("simplesmente", 1, -0.4)} /> }),
    { de: a("pioneiro"), ate: a("se", 2), grande: grande("pioneiros", { sublinhado: a("pioneiro", 1, 0.4) }) },
    atras(a("vem"), a("como", 2), <CardPromptado desde={a("vem")} y={Y} texto="vem para a Promptado →" ate={a("como", 2)} />),
    // a pergunta
    atras(a("como", 2), a("monitora", 1, -0.4), <Comentario desde={a("como", 2)} y={Y} texto="como vocês fazem isso, André? 🤔" ate={a("monitora", 1, -0.4)} />),
    // monitoramento completo
    ...tela(a("monitora", 1, -0.4), a("monitora", 2, -0.3), <TelaPlataforma desde={a("monitora", 1, -0.4)} ate={a("monitora", 2, -0.3)}
      rotulo="monitoramento do pé à cabeça" scan />),
    atras(a("monitora", 2, -0.3), a("quanto", 1, -0.2), <Pilulas y={Y} ate={a("quanto", 1, -0.2)}
      itens={[["👍 pontos positivos", a("positivos")], ["👎 pontos negativos", a("negativos")]]} />),
    // os 3 números
    ...tela(a("quanto", 1, -0.2), a("não", 1, -0.3), <Tela3Numeros desde={a("quanto", 1, -0.2)} itens={[
      [1, "visibilidade", "quantas vezes a IA fala de você", a("visibilidade")],
      [2, "reputação", "se ela fala bem ou mal", a("reputação")],
      [3, "posição", "em que lugar você aparece", a("posição")],
    ]} />),
    // as fontes
    ...tela(a("não", 1, -0.3), a("partir", 1, -0.5), <TelaFontes desde={a("não", 1, -0.3)} traducao={a("fontes")} autoridade={a("reputação", 2)}
      fontes={[["📰", "portal de notícias", 95, a("fontes")], ["✍️", "blog", 60, a("mencionam")], ["⭐", "site de avaliações", 30, a("interferência")]]} />),
    // plano de ação
    atras(a("partir", 1, -0.5), a("mastigada", 1, -0.4), <CardPlano desde={a("partir", 1, -0.5)} y={Y} ate={a("mastigada", 1, -0.4)}
      itens={[["Blog", a("plano")], ["Auditoria", a("diversas")], ["Recomendações", a("funcionalidades")], ["Planos de ação", a("plataforma")]]} />),
    { de: a("mastigada"), ate: a("executar"), grande: grande("mastigado") },
    atras(a("executar"), a("tem"), <Pilulas y={Y + 20} ate={a("tem")} itens={[["✓ você só executa", a("executar"), true]]} />),
    { de: a("fácil"), ate: a("se", 5), grande: grande("mais fácil?") },
    // como funciona
    ...tela(a("time"), a("nessa"), <TelaPassos desde={a("time")}
      passos={[["📞", "ligação rápida", a("ligação")], ["🧩", "entendemos seu problema", a("problema")], ["📅", "reunião", a("reunião")]]} />),
    ...tela(a("nessa"), chamada, <TelaPlataforma desde={a("nessa")} ate={chamada} rotulo="a plataforma completa" zoom={[ORIGEM_RANKING, 1.9]} />),
    // chamada final
    ...tela(chamada, SEM_FIM, <ChamadaContato desde={chamada} botao={a("entre")} liga={a("time", 2)} />),
  ];
  return { chamada, inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

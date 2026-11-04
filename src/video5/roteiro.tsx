import { Botao, CaixaVerde, Chat, Chips } from "../video1/componentes";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import {
  CardRoteiro, CardTrafego, LogosRedes, RespostaIA, SeloPromptado, TelaContador, TelaEcossistema,
} from "./componentes";

// Roteiro do vídeo 5 (plano aprovado em edicao/video5/plano.md). Estilo A com a lista numerada do estilo B.
export const roteiroVideo5 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const chamada = a("entra", 2);
  // Palavras grandes no teto do carro, logo acima da cabeça (o topo da cabeça fica a y ≈ 550).
  const grande = (texto: string, extra: Partial<NonNullable<Item["grande"]>> = {}) => ({
    texto, centro: true, sombra: true, topo: 360, ...extra,
  });
  const itens: Item[] = [
    // gancho
    { de: a("demanda"), ate: a("promptado"), grande: grande("demanda", { sublinhado: a("demanda", 1, 0.3) }) },
    { de: a("promptado"), ate: a("hoje", 2), el: <SeloPromptado desde={a("promptado")} /> },
    { de: a("ecossistema"), ate: a("uma"), grande: grande("ecossistema") },
    {
      de: a("uma"), ate: a("e"), esconde: true,
      el: <TelaContador desde={a("uma")} rotulo="meta diária" valor={10} sufixo="vídeos / dia" chega={a("10")} />,
    },
    { de: a("cta"), ate: a("partir", 1, -0.3), el: <CardRoteiro desde={a("cta")} itens={[["CTA", a("cta")], ["gancho", a("gancho")], ["body", a("body")]]} /> },
    // 01 · orgânico
    { de: a("orgânico"), ate: a("também"), el: <CaixaVerde texto="orgânico" desde={a("orgânico")} y={1360} /> },
    {
      de: a("instagram"), ate: a("também"),
      el: (
        <LogosRedes desde={a("instagram")} titulo="01 · orgânico"
          logos={[["instagram", a("instagram")], ["tiktok", a("redes")], ["youtube", a("redes", 1, 0.12)], ["facebook", a("redes", 1, 0.24)], ["linkedin", a("linkedin")]]} />
      ),
    },
    // 02 · tráfego pago
    { de: a("tráfego"), ate: a("vários"), grande: grande("tráfego pago", { sublinhado: a("pago") }) },
    { de: a("vários"), ate: a("e", 6), el: <CardTrafego desde={a("vários")} enche={[a("vários"), a("tráfego", 2)]} leads={a("leads")} /> },
    // 03 · GEO
    { de: a("geo"), ate: a("promptado", 2), grande: grande("GEO", { sublinhado: a("geo", 1, 0.3) }) },
    { de: a("promptado", 2), ate: a("inteligências"), el: <SeloPromptado desde={a("promptado", 2)} titulo="03 · GEO" /> },
    { de: a("inteligências"), ate: a("perguntam"), el: <Chips y={420} itens={[["ChatGPT", a("inteligências")], ["Gemini", a("inteligências", 1, 0.15)], ["Claude", a("inteligências", 1, 0.3)]]} /> },
    {
      de: a("perguntam"), ate: a("recomendação"), esconde: true,
      el: <Chat desde={a("perguntam")} passos={[{ texto: "qual empresa você recomenda?", de: a("perguntam", 1, 0.1) }]} envia={a("quer")} />,
    },
    { de: a("recomendação"), ate: a("então", 2), el: <RespostaIA desde={a("recomendação")} /> },
    {
      de: a("então", 2), ate: a("e", 7), esconde: true,
      el: <TelaEcossistema desde={a("então", 2)} itens={["vídeos orgânicos", "tráfego pago", "GEO"]} inicio={a("ecossistema", 2)} troca={a("gera")} total={500} />,
    },
    { de: a("produção"), ate: chamada, el: <Chips y={420} itens={[["produção", a("produção")], ["demanda", a("demanda", 2)]]} /> },
    { de: chamada, ate: 99999, el: <Botao texto="entrar em contato ↓" desde={chamada} y={1330} /> },
    { de: a("consultoria"), ate: 99999, el: <Chips y={420} itens={[["consultoria completa", a("consultoria")]]} /> },
  ];
  return { chamada, inicioCapitulos: a("é"), itens: itens.filter((i) => i.ate > i.de) };
};

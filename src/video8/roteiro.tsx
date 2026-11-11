import { staticFile } from "remotion";
import { LogoPromptado } from "../LogoPromptado";
import { CORES } from "../marca";
import { Item, Roteiro } from "../video1/roteiros";
import { criaAncora, Palavra } from "../video1/tempo";
import { Pilula, PilulasEmpilhadas, PrintCelular } from "../video6/componentes";
import { RotuloFoto, TelaCalculo } from "./componentes";

// Roteiro do vídeo 8 (plano aprovado em edicao/video8/plano.md): estilo C com a lista do estilo B no cálculo.
// Pílulas no topo, sobre o teto solar (y 270–520).
const Y = 272;

export const roteiroVideo8 = (p: Palavra[]): Roteiro => {
  const a = criaAncora(p);
  const fim = a("citado", 1, 2);
  const logo = <LogoPromptado tamanho={40} cor={CORES.dark.texto} />;
  const itens: Item[] = [
    // gancho
    { de: a("muita"), ate: a("foi"), el: <Pilula texto="a história" desde={a("muita")} y={Y} verde tamanho={40} /> },
    { de: a("promptado"), ate: a("foi"), el: <Pilula texto={<>{logo} como tudo começou</>} desde={a("promptado")} y={Y + 84} tamanho={38} /> },
    // linha do tempo
    {
      de: a("2024"), ate: a("oportunidade"),
      el: <PilulasEmpilhadas y={Y} itens={[["fim de 2024", a("2024"), true], ["SF Leilões", a("sfleilões")], ["ChatGPT", a("chatgpt")]]} />,
    },
    { de: a("oportunidade"), ate: a("recomendava"), el: <Pilula texto="💡 oportunidade" desde={a("oportunidade")} y={Y} verde /> },
    {
      de: a("recomendava"), ate: a("e", 6),
      el: <PilulasEmpilhadas y={Y} itens={[["a IA recomenda", a("recomendava")], ["pessoas", a("recomendava", 1, 0.9)], ["empresas", a("e", 4, 0.4), true]]} />,
    },
    {
      de: a("fontes"), ate: a("e", 8),
      el: <PilulasEmpilhadas y={Y} itens={[["fontes", a("fontes")], ["metodologia", a("metodologia")], ["indicação", a("indicar"), true]]} />,
    },
    // a foto dos fundadores
    {
      de: a("eu", 7), ate: a("promptado", 2, 0.4), esconde: true,
      el: (
        <PrintCelular src={staticFile("video8/andre-e-luis.jpg")} recorte={[0, 120, 1717, 1880]} larguraImagem={1717}
          desde={a("eu", 7)} ate={a("promptado", 2, 0.4)} largura={620} y={300} />
      ),
    },
    { de: a("eu", 7), ate: a("promptado", 2, 0.4), esconde: true, el: <RotuloFoto desde={a("eu", 7)} ate={a("promptado", 2, 0.4)} y={1010} /> },
    // crescimento
    {
      de: a("trabalhando"), ate: a("pioneiros"),
      el: <PilulasEmpilhadas y={Y} itens={[["trabalhando duro", a("trabalhando")], ["criando equipe", a("criando")], ["criando um movimento", a("criando", 2), true]]} />,
    },
    { de: a("pioneiros"), ate: a("e", 12), el: <Pilula texto="pioneiros" desde={a("pioneiros")} y={Y} verde /> },
    { de: a("maior"), ate: a("e", 12), el: <Pilula texto="a maior do Brasil" desde={a("maior")} y={Y + 84} /> },
    {
      de: a("indicação"), ate: a("canal", 1, -1.5),
      el: <PilulasEmpilhadas y={Y} itens={[["indicação", a("indicação")], ["branding", a("branding")], ["recomendação", a("recomendação"), true]]} />,
    },
    { de: a("canal"), ate: a("gente", 7), el: <Pilula texto="novo canal de aquisição" desde={a("canal")} y={Y} verde /> },
    // o cálculo (tela cheia)
    {
      de: a("gente", 7, -0.1), ate: a("economizar", 1, 1.2), esconde: true,
      el: (
        <TelaCalculo desde={a("gente", 7, -0.1)} itens={[["redator", a("redator")], ["especialista em GEO", a("especialista")]]}
          total={a("500")} vira={a("usando", 2)} risco={a("usando", 2, 0.3)} preco={a("r399")} />
      ),
    },
    { de: a("citado"), ate: fim + 99999, el: <Pilula texto="✓ citado pelas IAs" desde={a("citado")} y={Y} verde /> },
    { de: a("citado"), ate: fim + 99999, el: <Pilula texto={<>{logo} Promptado</>} desde={a("citado", 1, 0.2)} y={Y + 84} tamanho={36} /> },
  ];
  return { chamada: a("citado"), inicioCapitulos: 0, itens: itens.filter((i) => i.ate > i.de) };
};

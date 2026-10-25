import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Identidade visual da Promptado (fonte: promptado-brand.vercel.app/marca).
// Regra: uma única cor de marca (verde), no máximo 2 ou 3 elementos verdes por peça,
// e texto sobre o verde é sempre preto. Roxo, azul e outras cores não entram.

// Geist (Google Fonts, licença OFL) guardada em public/fontes para renderizar sem internet.
// É uma fonte variável: o mesmo arquivo cobre todos os pesos.
export const FONTE = "Geist";

loadFont({
  family: FONTE,
  url: staticFile("fontes/Geist-latin.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: FONTE,
  url: staticFile("fontes/Geist-latin-ext.woff2"),
  weight: "100 900",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

export const CORES = {
  dark: {
    verde: "#22C55E", // botões, selos, áreas preenchidas
    verdeTexto: "#22C55E", // categorias e números em destaque (>= 24px)
    fundo: "#000000",
    superficie: "#161618", // cards e caixas
    texto: "#F5F5F7", // títulos, texto principal, logo, ícones
    textoApoio: "#A1A1A6", // rótulos, linhas de apoio, rodapé
    linha: "#2C2C2E", // divisórias de 1px
  },
  light: {
    verde: "#22C55E",
    verdeTexto: "#16A34A",
    fundo: "#F5F5F7",
    superficie: "#FFFFFF",
    texto: "#1D1D1F",
    textoApoio: "#6E6E73",
    linha: "#D2D2D7",
  },
  textoSobreVerde: "#000000",
} as const;

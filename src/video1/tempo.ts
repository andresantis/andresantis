// Tempo e âncoras: cada elemento da tela é ancorado numa palavra falada,
// para ficar sincronizado mesmo se os cortes mudarem.

export const FPS = 30;

export type Palavra = [number, string]; // [segundo no vídeo editado, texto]

export const normaliza = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export const criaAncora = (palavras: Palavra[]) => {
  // em("ChatGPT", 2) = quadro em que se fala o 2º "ChatGPT"; desloc em segundos.
  return (palavra: string, ocorrencia = 1, desloc = 0): number => {
    const alvo = normaliza(palavra);
    let n = 0;
    for (const [t, w] of palavras) {
      if (normaliza(w) === alvo && ++n === ocorrencia) {
        return Math.max(0, Math.round((t + desloc) * FPS));
      }
    }
    throw new Error(`Palavra "${palavra}" (${ocorrencia}ª) não encontrada`);
  };
};

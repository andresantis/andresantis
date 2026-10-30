// Lista cada elemento do roteiro do vídeo 2 com a palavra falada no início e no fim (para conferir as âncoras).
import legendas from "../../src/video2/legendas-completa.json";
import { Palavra } from "../../src/video1/tempo";
import { roteiroVideo2 } from "../../src/video2/roteiro";

const p = legendas as Palavra[];
const em = (q: number) => {
  const i = p.findIndex(([t]) => Math.round(t * 30) >= q);
  return i < 0 ? "(fim)" : p.slice(Math.max(0, i - 1), i + 2).map(([, w]) => w).join(" ");
};
const nome = (el: unknown) => (el as { type?: { name?: string } })?.type?.name ?? "";
for (const it of roteiroVideo2(p, 9999).itens) {
  const qual = it.grande ? `GRANDE "${it.grande.texto}"` : nome(it.el);
  console.log(`${(it.de / 30).toFixed(1).padStart(5)}–${(Math.min(it.ate, 99999) / 30).toFixed(1).padStart(6)}s  ${qual.padEnd(20)} [${em(it.de)}] → [${em(it.ate)}]`);
}

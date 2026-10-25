// Lista cada elemento do roteiro com a palavra falada no início e no fim (para conferir as âncoras).
import legCurta from "../../src/video1/legendas-curta.json";
import legCompleta from "../../src/video1/legendas-completa.json";
import { roteiroCompleta, roteiroCurta } from "../../src/video1/roteiros";
import { Palavra } from "../../src/video1/tempo";

const nome = (el: unknown) => {
  const t = (el as { type?: { name?: string } })?.type;
  return t?.name ?? "";
};
for (const [v, pal, rot] of [["curta", legCurta, roteiroCurta], ["completa", legCompleta, roteiroCompleta]] as const) {
  const p = pal as Palavra[];
  const em = (q: number) => {
    const i = p.findIndex(([t]) => Math.round(t * 30) >= q);
    return i < 0 ? "(fim)" : p.slice(Math.max(0, i - 1), i + 2).map(([, w]) => w).join(" ");
  };
  console.log(`== ${v}`);
  for (const it of rot(p).itens) {
    const qual = it.grande ? `GRANDE "${it.grande.texto}"` : nome(it.el);
    console.log(`${(it.de / 30).toFixed(1).padStart(6)}–${(Math.min(it.ate, 99999) / 30).toFixed(1).padStart(6)}s  ${qual.padEnd(18)} [${em(it.de)}] → [${em(it.ate)}]`);
  }
}

// Gera quadros de teste de várias composições com um único bundle.
// Uso (na raiz do projeto): node edicao/scripts/quadros-varios.mjs <pasta_saida> Comp1=q1,q2 Comp2=q3 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [out, ...pedidos] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
try {
  for (const p of pedidos) {
    const [comp, lista] = p.split("=");
    const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
    for (const q of lista.split(",").map(Number)) {
      await renderStill({ composition, serveUrl, frame: q, output: `${out}/${comp}-${String(q).padStart(5, "0")}.png`, browserExecutable, imageFormat: "png" });
    }
    console.log("ok", comp);
  }
} finally {
  // Apaga a cópia temporária que o bundle criou (ela inclui toda a pasta public e enche o disco).
  fs.rmSync(serveUrl, { recursive: true, force: true });
}

// Gera vários quadros de teste com um único bundle. Uso (na raiz do projeto): node edicao/scripts/quadros-teste.mjs <composicao> <pasta_saida> <q1,q2,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [comp, out, lista] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
for (const q of lista.split(",").map(Number)) {
  await renderStill({ composition, serveUrl, frame: q, output: `${out}/${comp}-${String(q).padStart(5, "0")}.png`, browserExecutable, imageFormat: "png" });
  console.log("ok", q);
}

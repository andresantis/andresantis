"""Gera a máscara da pessoa (MODNet) para cada quadro usado nas versões editadas do vídeo 1.

A máscara só define onde fica a pessoa; os pixels do vídeo nunca são alterados.
Uso: python3 mascaras.py <modelo.onnx> [limite_de_quadros]
"""
import json, os, subprocess, sys
import numpy as np
import onnxruntime as ort
from PIL import Image

BASE = "/home/user/andresantis/"
SAIDA = BASE + "public/editar/mascaras/"
W, H = 1080, 1920
ALT_MODELO = 512
ALT_MASCARA = 480

os.makedirs(SAIDA, exist_ok=True)
quadros = set()
for v in ("curta", "completa"):
    for a, b in json.load(open(BASE + f"edicao/video1/linha-{v}.json"))["trechos"]:
        quadros.update(range(a, b))
quadros = sorted(q for q in quadros if not os.path.exists(SAIDA + f"{q:05d}.png"))
if len(sys.argv) > 2: quadros = quadros[: int(sys.argv[2])]
print(len(quadros), "quadros para processar", flush=True)

sess = ort.InferenceSession(sys.argv[1])
nome = sess.get_inputs()[0].name
lm = int(W * ALT_MODELO / H) // 32 * 32
proc = subprocess.Popen(["ffmpeg", "-v", "error", "-i", BASE + "public/editar/video1.mp4", "-vf", f"scale={lm}:{ALT_MODELO}",
                         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
alvo = set(quadros); n = 0; i = 0
while alvo:
    buf = proc.stdout.read(lm * ALT_MODELO * 3)
    if not buf: break
    if i in alvo:
        x = np.frombuffer(buf, np.uint8).reshape(ALT_MODELO, lm, 3).astype(np.float32) / 255
        x = ((x - 0.5) / 0.5).transpose(2, 0, 1)[None]
        m = sess.run(None, {nome: x})[0][0, 0]
        img = Image.fromarray((m * 255).clip(0, 255).astype(np.uint8)).resize((ALT_MASCARA * W // H, ALT_MASCARA), Image.BILINEAR)
        img.save(SAIDA + f"{i:05d}.png", optimize=True)
        alvo.discard(i); n += 1
        if n % 500 == 0: print(n, "feitos", flush=True)
    i += 1
proc.kill()
print("pronto:", n)

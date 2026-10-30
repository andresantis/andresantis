"""Converte as máscaras da pessoa em máscaras com transparência invertida.

Na camada de ilustrações, a palavra grande é desenhada só ONDE A PESSOA NÃO ESTÁ;
assim ela parece passar atrás da cabeça sem que o vídeo passe pelo navegador.
"""
import glob, os, sys
import numpy as np
from PIL import Image

# Uso: python3 mascaras_invertidas.py [video]   (padrão: video1)
VIDEO = sys.argv[1] if len(sys.argv) > 1 else "video1"
SUFIXO = "" if VIDEO == "video1" else f"-{VIDEO}"
ORIGEM = f"/home/user/andresantis/public/editar/mascaras{SUFIXO}/"
DESTINO = f"/home/user/andresantis/public/editar/mascaras-inv{SUFIXO}/"
os.makedirs(DESTINO, exist_ok=True)
for p in sorted(glob.glob(ORIGEM + "*.png")):
    alvo = DESTINO + os.path.basename(p)
    if os.path.exists(alvo): continue
    m = np.asarray(Image.open(p).convert("L"))
    rgba = np.zeros(m.shape + (4,), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = 255 - m
    Image.fromarray(rgba, "RGBA").save(alvo, optimize=True)
print(len(os.listdir(DESTINO)))

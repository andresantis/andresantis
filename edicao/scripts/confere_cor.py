"""Compara a cor do vídeo final com o original, quadro a quadro, numa área sem nada por cima.

Compara direto os planos Y (brilho), U e V (cor) do vídeo, sem converter para RGB.
Uso: python3 confere_cor.py <video> <versao>
"""
import json, subprocess, sys
import numpy as np

video, v = sys.argv[1], sys.argv[2]
RAIZ = "/home/user/andresantis/"
ZOOM = "crop=982:1746:44:69,scale=1080:1920:flags=lanczos"
tr = json.load(open(RAIZ + f"src/{video}/linha-{v}.json"))["trechos"]
COM_ZOOM = json.load(open(RAIZ + f"edicao/{video}/config.json")).get("zoom", True)


def quadro(arq, n, vf=None):
    filtro = (vf + "," if vf else "") + f"select=eq(n\\,{n})"
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-vf", filtro, "-vframes", "1", "-f", "rawvideo",
                        "-pix_fmt", "yuv420p", "-"], capture_output=True)
    b = np.frombuffer(r.stdout, np.uint8)
    y = b[:1080 * 1920].reshape(1920, 1080).astype(int)
    u = b[1080 * 1920:1080 * 1920 * 5 // 4].reshape(960, 540).astype(int)
    w = b[1080 * 1920 * 5 // 4:].reshape(960, 540).astype(int)
    return y, u, w


ini = 0
amostras = []
for k, (a, b) in enumerate(tr):
    if b - a > 20: amostras.append((ini + 10, a + 10, COM_ZOOM and k % 2 == 1))
    ini += b - a
for q, s, zoom in amostras[::max(1, len(amostras) // 8)]:
    o = quadro(RAIZ + f"public/editar/{video}.mp4", s, ZOOM if zoom else None)
    e = quadro(RAIZ + f"out/{video}-{v}.mp4", q)
    regioes = [(slice(1500, 1880), slice(60, 880)), (slice(750, 940), slice(30, 440))]  # Y; U/V têm metade da resolução
    dy = e[0][regioes[0]] - o[0][regioes[0]]
    du = e[1][regioes[1]] - o[1][regioes[1]]
    dv = e[2][regioes[1]] - o[2][regioes[1]]
    print(f"quadro {q:5d} (original {s:5d}{', com zoom' if zoom else ''}): "
          f"viés Y {dy.mean():+.2f}  U {du.mean():+.2f}  V {dv.mean():+.2f}  | diferença média Y {np.abs(dy).mean():.2f}")

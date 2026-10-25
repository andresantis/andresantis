"""Exporta só o áudio de uma versão editada (para conferir os cortes com o whisper).

Uso: python3 audio_editado.py <versao> <saida.wav>
"""
import json, subprocess, sys

v, saida = sys.argv[1], sys.argv[2]
d = json.load(open(f"/home/user/andresantis/edicao/video1/linha-{v}.json"))
fps = d["fps"]
filtro = "".join(f"[0:a]atrim=start={a / fps}:end={b / fps},asetpts=PTS-STARTPTS[a{i}];" for i, (a, b) in enumerate(d["trechos"]))
filtro += "".join(f"[a{i}]" for i in range(len(d["trechos"]))) + f"concat=n={len(d['trechos'])}:v=0:a=1,aresample=16000,pan=mono|c0=0.5*c0+0.5*c1[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/home/user/andresantis/public/editar/video1.mp4",
                "-filter_complex", filtro, "-map", "[o]", saida], check=True)

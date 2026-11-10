"""Converte o vídeo HDR do iPhone (HEVC 10 bits, HLG/BT.2020) para H.264 normal (SDR, BT.709).

Método escolhido comparando com a cópia SDR da mesma gravação (edicao/video1/plano.md):
tonemap "hable" com branco de referência em 185 nits -> viés de cor ~0 em relação à cópia.
Uso: python3 converte_hdr.py <entrada_hdr> <saida.mp4>
"""
import subprocess, sys

# Gravações em 4K são reduzidas para 1080×1920 e acertadas para 30 fps (só tamanho e ritmo; a cor segue o mesmo ajuste).
FILTRO = ("fps=30,zscale=w=1080:h=1920:f=lanczos,zscale=t=linear:npl=185,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,"
          "zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[1], "-vf", FILTRO,
                "-c:v", "libx264", "-crf", "10", "-preset", "slow", "-pix_fmt", "yuv420p",
                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
                "-map", "0:v:0", "-map", "0:a:0", "-c:a", "copy", "-movflags", "+faststart", sys.argv[2]], check=True)

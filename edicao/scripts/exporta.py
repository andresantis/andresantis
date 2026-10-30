"""Exporta o vídeo final de uma versão sem mudar a cor do vídeo original.

1. Remotion renderiza só as camadas (legendas e ilustrações) em PNG transparente.
2. Remotion renderiza só o áudio (voz cortada + efeito de subida + musiquinha).
3. ffmpeg corta o vídeo original e aplica o zoom; os pixels sem nada por cima não passam
   por nenhuma conversão de cor (só pela compressão final em H.264).
4. ffmpeg cola as camadas por cima e junta o áudio.

Uso (na raiz do projeto): python3 edicao/scripts/exporta.py <video> <versao>   (ex.: video2 completa)
"""
import json, os, shutil, subprocess, sys

video, v = sys.argv[1], sys.argv[2]
RAIZ = "/home/user/andresantis/"
COMP = {("video1", "curta"): "Video1-Curta", ("video1", "completa"): "Video1-Completa", ("video2", "completa"): "Video2"}[(video, v)]
PROPS = (lambda modo: {"versao": v, "modo": modo}) if video == "video1" else (lambda modo: {"modo": modo})
COM_ZOOM = json.load(open(RAIZ + f"edicao/{video}/config.json")).get("zoom", True)
NAVEGADOR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
CAMADAS = RAIZ + f"out/camadas-{video}-{v}/"
AUDIO = RAIZ + f"out/audio-{video}-{v}.wav"
SAIDA = RAIZ + f"out/{video}-{v}.mp4"
ZOOM_CROP = "crop=982:1746:44:69,scale=1080:1920:flags=lanczos"  # zoom 1,1x com origem em (480, 760), igual ao Camera.tsx

remotion = ["npx", "remotion", "render", COMP, "--browser-executable=" + NAVEGADOR, "--log=error"]
so_montagem = "--so-montagem" in sys.argv  # reaproveita camadas e áudio já renderizados
refaz_audio = "--refaz-audio" in sys.argv  # com --so-montagem: reaproveita as camadas, mas refaz o áudio
if not so_montagem and os.path.isdir(CAMADAS): shutil.rmtree(CAMADAS)
if not so_montagem: subprocess.run(remotion + [CAMADAS, "--sequence", "--image-format=png", "--concurrency=4", "--image-sequence-pattern=q[frame].[ext]",
                           "--props=" + json.dumps(PROPS("camadas"))], check=True, cwd=RAIZ)
if not so_montagem or refaz_audio: subprocess.run(remotion + [AUDIO, "--codec=wav", "--props=" + json.dumps(PROPS("previa"))], check=True, cwd=RAIZ)

linha = json.load(open(RAIZ + f"src/{video}/linha-{v}.json"))
pngs = sorted(f for f in os.listdir(CAMADAS) if f.endswith(".png"))
total = len(pngs)
LOG = os.environ.get("NIVEL_LOG", "error")
# 1) Cada trecho vira um arquivo intermediário SEM PERDA (x264 lossless em yuv420p: mesmos pixels do original).
#    Abrir o mesmo arquivo muitas vezes num só comando do ffmpeg se mostrou instável (parava no meio).
TRECHOS = RAIZ + f"out/.trechos-{video}-{v}/"
if os.path.isdir(TRECHOS): shutil.rmtree(TRECHOS)
os.makedirs(TRECHOS)
lista = []
for i, (a, b) in enumerate(linha["trechos"]):
    ss = round(max(0, a / 30 - 2), 3)
    zoom = "," + ZOOM_CROP if COM_ZOOM and i % 2 else ""
    arq = TRECHOS + f"{i:03d}.mkv"
    subprocess.run(["ffmpeg", "-v", LOG, "-y", "-ss", f"{ss:.3f}", "-i", RAIZ + f"public/editar/{video}.mp4", "-an",
                    "-vf", f"trim=start={(a - 0.5) / 30 - ss:.4f}:end={(b - 0.5) / 30 - ss:.4f},setpts=PTS-STARTPTS{zoom}",
                    "-c:v", "libx264", "-qp", "0", "-preset", "ultrafast", "-pix_fmt", "yuv420p", arq], check=True)
    lista.append(f"file '{arq}'")
open(TRECHOS + "lista.txt", "w").write("\n".join(lista) + "\n")
segura = total - linha["duracaoQuadros"]
# Quadros totalmente opacos (telas cheias) saem do Remotion sem canal de transparência;
# padroniza tudo em RGBA, senão o ffmpeg se perde quando o formato muda no meio da sequência.
from PIL import Image
for f in pngs:
    im = Image.open(CAMADAS + f)
    if im.mode != "RGBA": im.convert("RGBA").save(CAMADAS + f)
digitos = len(pngs[0]) - len("q") - len(".png")
padrao = CAMADAS + f"q%0{digitos}d.png"
# 2) Emenda os trechos, segura o último quadro no fim, cola as camadas por cima e junta o áudio.
#    settb/setpts=N: cada quadro cai exatamente na grade de 1/30 s.
filtro = (f"[0:v]settb=1/30,setpts=N,tpad=stop_mode=clone:stop={segura}[base];"
          "[1:v]settb=1/30,setpts=N[camadas];[base][camadas]overlay=format=yuv420:eof_action=pass,format=yuv420p[out]")
subprocess.run(["ffmpeg", "-v", LOG, "-y", "-f", "concat", "-safe", "0", "-i", TRECHOS + "lista.txt",
                "-framerate", "30", "-start_number", "0", "-i", padrao, "-i", AUDIO,
                "-filter_complex", filtro, "-map", "[out]", "-map", "2:a",
                "-fps_mode", "cfr", "-r", "30", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
                "-c:a", "aac", "-b:a", "192k", "-frames:v", str(total), "-movflags", "+faststart", SAIDA], check=True)
shutil.rmtree(TRECHOS)
print("pronto:", SAIDA, total, "quadros")

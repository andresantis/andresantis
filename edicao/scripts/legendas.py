"""Monta as legendas (palavra + tempo no vídeo final) a partir da transcrição do áudio editado.

Uso: python3 legendas.py <video> <versao> <transcricao_whisper.json>
Gera src/<video>/legendas-<versao>.json.
"""
import json, os, re, sys

video, v, arq = sys.argv[1], sys.argv[2], sys.argv[3]
d = json.load(open(arq))
pal = []
for s in d["transcription"]:
    for t in s["tokens"]:
        tx = t["text"]
        if tx.startswith("[") or t.get("t_dtw", -1) < 0: continue
        ts = max(0.0, t["t_dtw"] / 100 - 0.08)
        if tx.startswith(" ") or not pal: pal.append([round(ts, 2), tx.strip()])
        else: pal[-1][1] += tx

# Correções de nomes e palavras que o transcritor erra (confirmadas na etapa 1 de cada vídeo).
def corrige_video1(pal):
    TROCA = {"cloud": "Claude", "perplexer": "Perplexity", "grock": "Grok", "groc": "Grok", "ex": "X",
             "chatept": "ChatGPT", "fonte": "fontes"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        if base.lower() == "maia" and out and out[-1][1] == "um":
            out[-1][1] = "uma"; w = w.replace(base, "IA")
        if base == "EPP" and out and out[-1][1].lower() == "chat":
            out[-1][1] = "ChatGPT" + w[len(base):]; continue
        if base == "que" and out and out[-1][1] == "Claude,": w = "porque"
        out.append([t, w])
    return out


def corrige_video2(pal):
    TROCA = {"cloud": "Claude", "chatebt": "ChatGPT", "chatept": "ChatGPT", "ias": "IAs", "artificias": "artificiais",
             "artificial": "artificiais"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        # "por a gente de IA" -> "por agentes de IA"
        if base.lower() == "de" and len(out) >= 2 and [x[1].lower() for x in out[-2:]] == ["a", "gente"]:
            out.pop(); out[-1][1] = "agentes"
        # "comenta nesse post aqui. IA," -> 'aqui "IA",'
        if base.lower() == "ia" and out and out[-1][1].lower().startswith("aqui"):
            out[-1][1] = "aqui"; w = '"IA",'
        out.append([t, w])
    return out


out = {"video1": corrige_video1, "video2": corrige_video2}[video](pal)
os.makedirs(f"/home/user/andresantis/src/{video}", exist_ok=True)
json.dump(out, open(f"/home/user/andresantis/src/{video}/legendas-{v}.json", "w"), ensure_ascii=False)
print(v, len(out), "palavras")
print(" ".join(f"{w}@{t:.1f}" for t, w in out))

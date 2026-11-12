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


def corrige_video3(pal):
    TROCA = {"cloud": "Claude", "chatebt": "ChatGPT", "chatept": "ChatGPT"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        out.append([t, w])
    return out


def corrige_video4(pal):
    TROCA = {"cloud": "Claude", "chatebt": "ChatGPT", "chatept": "ChatGPT", "chatepd": "ChatGPT", "prontada": "Promptado"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        # "comenta IA." -> 'comenta "IA".'
        if base == "IA" and out and out[-1][1].lower() == "comenta": w = w.replace("IA", '"IA"')
        out.append([t, w])
    return out


def corrige_video5(pal):
    TROCA = {"dio": "GEO", "geo": "GEO", "cta": "CTA"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        # "Como eu gera o demanda hoje para o Promptado?" -> "Como eu gero demanda hoje para a Promptado?"
        if base == "gera" and out and out[-1][1] == "eu": w = "gero"
        if base == "o" and out and out[-1][1] == "gero": continue
        if base == "o" and out and out[-1][1] == "para" and len(out) < 8: w = "a"
        out.append([t, w])
    return out


def corrige_video6(pal):
    TROCA = {"chatept": "ChatGPT", "gmni": "Gemini", "hyperplexer": "Perplexity", "perplexer": "Perplexity"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        # "aí a monta" -> "a IA monta" (confirmado pelo André)
        if base == "monta" and len(out) >= 2 and out[-1][1] == "a" and out[-2][1].lower() == "aí":
            out[-2][1] = "a"; out[-1][1] = "IA"
        # "é com corte seco" -> "é curto, seco" (confirmado)
        if base == "corte" and out and out[-1][1] == "com":
            out.pop(); w = "curto,"
        # "da Barent Alcarca" -> "da Ben Rental Car," (confirmado)
        if base.lower().startswith("alcarca") and out and out[-1][1].lower().startswith("barent"):
            out[-1][1] = "Ben Rental"; w = "Car,"
        out.append([t, w])
    return out


def corrige_video7(pal):
    TROCA = {"alugue": "alugo", "entregue": "entrego", "footerzinha": "footer"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        # o áudio diz "Pô, cliquei aqui"; o transcritor ouviu "Tipo, clique"
        if base == "Tipo" and w.endswith(","): w = "Pô,"
        if base == "clique": w = "cliquei"
        out.append([t, w])
    return out


def corrige_video8(pal):
    TROCA = {"chatept": "ChatGPT", "dio": "GEO", "diy": "GEO", "luis": "Luís", "perguntou": "pergunta"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        if base == "SF": w = w.replace("SF", "SF Leilões")
        if base == "R399": w = w.replace("R$399", "R$ 399")
        # áudio: "para você que busca"
        if base == "buscar" and out and out[-1][1] == "você": out.append([t, "que"]); w = "busca"
        out.append([t, w])
    return out


# Cortes 1 a 8 (vídeos 10, 11 e 12, bastidores). Correções conferidas com a transcrição do vídeo original.
def troca_seq(pal, velhas, novas):
    """Troca uma sequência de palavras por outra, espalhando os tempos no mesmo intervalo."""
    lim = lambda w: re.sub(r"[^\wÀ-ú]", "", w).lower()
    alvo = [lim(w) for w in velhas]
    for i in range(len(pal) - len(alvo) + 1):
        if [lim(w) for _, w in pal[i:i + len(alvo)]] == alvo:
            t0 = pal[i][0]
            t1 = pal[i + len(alvo)][0] if i + len(alvo) < len(pal) else pal[i + len(alvo) - 1][0] + 0.4
            passo = (t1 - t0) / max(1, len(novas))
            return pal[:i] + [[round(t0 + k * passo, 2), w] for k, w in enumerate(novas)] + pal[i + len(alvo):]
    raise SystemExit(f"sequência não encontrada: {velhas}")


TROCAS_CORTES = {
    "corte1": [(["glória"], ["galera"]), (["vamos", "colocar", "o", "monte"], ["Então", "coloca", "almoço."]),
               (["não", "é", "nada"], ["Nem", "nada."])],
    "corte2": [(["meio", "dia", "e", "vinte"], ["Meio-dia", "e", "vinte"]),
               (["não", "deixa", "até", "um", "robô"], ["acha", "que", "é", "um", "robô."]),
               (["quebraria", "tem", "um", "robô", "que", "é"], ["Que", "brilhante.", "Eu", "nunca", "botei"]),
               (["você", "fala", "assim"], ["Você", "falou", "assim"])],
    "corte3": [(["minha", "loja"], ["uma", "lojinha"]), (["claud"], ["Claude."]), (["claudo"], ["Claude"]),
               (["faço", "a", "aceitar"], ["faço", "aceitar"]), (["e", "eu", "gastei"], ["Aí", "eu", "gastei"])],
    "corte4": [(["nesse", "mês", "agora", "nesse", "mês", "ali"], ["nesse", "mês", "ali."]), (["nasiasis"], ["nas", "IAs,"]),
               (["vai", "ser", "uma"], ["pode", "ser", "uma"])],
    "corte5": [],
    "corte6": [(["um", "boarding"], ["onboarding,"])],
    "corte7": [(["luiz"], ["Luís,"]), (["que", "receberam", "a", "ligação"], ["você", "vai", "ver", "a", "ligação."]),
               (["ficou", "trocando"], ["vai", "trocando,"])],
    "corte8": [(["isso", "aí", "com", "o", "andré"], ["isso", "aí?", "O", "André,"]), (["host"], ["host."]),
               (["a", "calada"], ["e", "calar?"]), (["calhe"], ["cale?"]), (["vendo", "mas", "você"], ["vendo,", "você"]),
               (["calado", "meu"], ["calado."]), (["sobe", "o", "meu", "poder"], ["sobre", "o", "meu", "poder,"]),
               (["link", "no", "ícone"], ["clique", "no", "ícone"]),
               (["link", "no", "botão", "se", "viciar", "todos"], ["clique", "no", "botão", "\"silenciar", "todos\"."]),
               (["não", "sei", "agora", "eu", "não", "sei"], []), (["carol"], ["caramba."]),
               (["tá", "la", "boca", "lulu"], ["Cala", "a", "boca,", "todo", "mundo."])],
}


def corrige_cortes(pal):
    pal = [[t, w.lstrip("-").strip()] for t, w in pal]
    pal = [p for p in pal if p[1]]
    for velhas, novas in TROCAS_CORTES[v]:
        pal = troca_seq(pal, velhas, novas)
    TROCA = {"luis": "Luís", "luiz": "Luís", "trial": "trial", "whatsapp": "WhatsApp", "shopee": "Shopee", "meet": "Meet"}
    out = []
    for t, w in pal:
        base = re.sub(r"[^\wÀ-ú-]", "", w)
        if base.lower() in TROCA: w = w.replace(base, TROCA[base.lower()])
        out.append([t, w])
    return out


out = {"video1": corrige_video1, "video2": corrige_video2, "video3": corrige_video3, "video4": corrige_video4,
       "video5": corrige_video5, "video6": corrige_video6, "video7": corrige_video7, "video8": corrige_video8,
       "video10": corrige_cortes, "video11": corrige_cortes, "video12": corrige_cortes}[video](pal)
pasta = "cortes" if v.startswith("corte") else video
os.makedirs(f"/home/user/andresantis/src/{pasta}", exist_ok=True)
json.dump(out, open(f"/home/user/andresantis/src/{pasta}/legendas-{v}.json", "w"), ensure_ascii=False)
print(v, len(out), "palavras")
print(" ".join(f"{w}@{t:.1f}" for t, w in out))

"""Calcula a linha do tempo de uma versão editada: trechos mantidos (em quadros de 30 fps).

Uso: python3 linha_do_tempo.py <video> <versao>   (ex.: video2 completa)
Lê edicao/<video>/pausas.tsv e edicao/<video>/config.json (cortes de conteúdo e versões)
e gera edicao/<video>/linha-<versao>.json com os trechos e a duração final.
"""
import json, sys

FPS = 30
FOLGA_FIM_FALA = 0.08  # respiro mantido depois da última palavra antes de uma pausa
FOLGA_INICIO_FALA = 0.05  # respiro mantido antes da primeira palavra depois de uma pausa


def subtrai(trechos, cortes):
    out = []
    for a, b in trechos:
        partes = [(a, b)]
        for c, d in cortes:
            novo = []
            for x, y in partes:
                if d <= x or c >= y:
                    novo.append((x, y))
                else:
                    if c > x: novo.append((x, c))
                    if d < y: novo.append((d, y))
            partes = novo
        out += [p for p in partes if p[1] - p[0] >= 0.12]
    return out


def linha(base, versao):
    pausas = [tuple(map(float, l.split("\t")[:2])) for l in open(base + "pausas.tsv").read().strip().split("\n")]
    config = json.load(open(base + "config.json"))
    cortes = [(a + FOLGA_FIM_FALA, b - FOLGA_INICIO_FALA) for a, b in pausas] + [tuple(c) for c in config["cortes"]]
    clips = subtrai([tuple(t) for t in config["versoes"][versao]], sorted(cortes))
    quadros = []
    for a, b in clips:
        ini, fim = round(a * FPS), round(b * FPS)
        if fim - ini >= 4: quadros.append((ini, fim))
    return quadros


if __name__ == "__main__":
    video, v = sys.argv[1], sys.argv[2]
    base = f"/home/user/andresantis/edicao/{video}/"
    q = linha(base, v)
    total = sum(b - a for a, b in q)
    json.dump({"fps": FPS, "trechos": q, "duracaoQuadros": total}, open(base + f"linha-{v}.json", "w"), indent=1)
    print(video, v, f"{total / FPS:.2f} s,", len(q), "trechos")

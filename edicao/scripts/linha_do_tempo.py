"""Calcula a linha do tempo de cada versão do vídeo 1: trechos mantidos (em quadros de 30 fps).

Uso: python3 linha_do_tempo.py curta|completa
Gera edicao/video1/linha-<versao>.json com os trechos e a duração final.
"""
import json, sys

BASE = "/home/user/andresantis/edicao/video1/"
FPS = 30
PAUSAS = [tuple(map(float, l.split("\t")[:2])) for l in open(BASE + "pausas.tsv").read().strip().split("\n")]
FOLGA_FIM_FALA = 0.08  # respiro mantido depois da última palavra antes de uma pausa
FOLGA_INICIO_FALA = 0.05  # respiro mantido antes da primeira palavra depois de uma pausa

# Cortes de conteúdo aprovados na etapa 1, com os limites conferidos no som (segundos do original).
# "ou" (47,0 s) e "aí" (177,1 s) ficaram de fora: saem colados na palavra seguinte, sem silêncio para cortar.
CORTES = [
    (0.00, 1.10),      # silêncio e ruído antes de "Hoje,"
    (17.34, 17.46),    # "o" em "e o para que eu uso"
    (27.70, 29.40),    # "É que nem aquele ditado que a gente faz,"
    (32.33, 32.52),    # "Então"
    (72.82, 76.46),    # "todos os nossos funcionários ali, os colaboradores,"
    (114.12, 114.66),  # "Bom, e o" antes de "Grok"
    (132.06, 139.12),  # repetição sobre o Grok
    (142.10, 142.88),  # "que eu faria,"
]

VERSOES = {
    "completa": [(0.0, 180.13)],
    "curta": [(1.10, 9.72), (19.08, 23.60), (44.06, 48.92), (62.50, 68.45), (109.15, 114.12),
              (114.66, 121.18), (130.10, 132.06), (139.12, 144.94), (166.20, 171.00)],
}


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


def linha(versao):
    cortes = [(a + FOLGA_FIM_FALA, b - FOLGA_INICIO_FALA) for a, b in PAUSAS] + CORTES
    clips = subtrai(VERSOES[versao], sorted(cortes))
    quadros = []
    for a, b in clips:
        ini, fim = round(a * FPS), round(b * FPS)
        if fim - ini >= 4: quadros.append((ini, fim))
    return quadros


if __name__ == "__main__":
    v = sys.argv[1]
    q = linha(v)
    total = sum(b - a for a, b in q)
    json.dump({"fps": FPS, "trechos": q, "duracaoQuadros": total}, open(BASE + f"linha-{v}.json", "w"), indent=1)
    print(v, f"{total / FPS:.2f} s,", len(q), "trechos")

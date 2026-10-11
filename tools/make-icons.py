"""Генерирует иконки Srpski: icons/icon.svg и PNG 192/512/maskable-512/apple-touch 180.

Запуск:  python tools/make-icons.py   (нужен Pillow: pip install pillow)
Рисунок — буква «Ћ» (сербская кириллица) бумажного цвета на приглушённом синем, с небольшим красным ромбом
(отсылка к триколору). Нарисовано линиями и кривой Безье, без шрифтов, поэтому SVG и PNG совпадают на любой системе.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'icons'
INK = '#2f4b8c'      # приглушённый синий (бренд, hue 258)
PAPER = '#f4f3f1'    # бумага
RED = '#b8484a'      # приглушённый красный
W = 46               # толщина штриха на холсте 512

BAR = ((118, 150), (338, 150))
STEM = ((196, 150), (196, 372))
BEZ = ((196, 282), (196, 222), (336, 214), (336, 296))   # дуга «ветви» буквы
LEG = ((336, 296), (336, 366))
HOOK = ((336, 366), (336, 400), (302, 404), (270, 392))   # квадратичная: загиб ножки внизу
DIAMOND = (400, 120, 22)   # cx, cy, r


def bez(p, n=40):
    out = []
    for i in range(n + 1):
        t = i / n
        if len(p) == 4:
            a = (1 - t) ** 3; b = 3 * (1 - t) ** 2 * t; c = 3 * (1 - t) * t ** 2; d = t ** 3
            out.append((a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]))
        else:
            a = (1 - t) ** 2; b = 2 * (1 - t) * t; c = t ** 2
            out.append((a * p[0][0] + b * p[1][0] + c * p[2][0], a * p[0][1] + b * p[1][1] + c * p[2][1]))
    return out


HOOKQ = ((336, 366), (336, 404), (290, 404))   # квадратичная кривая загиба


def svg(maskable=False):
    s = 0.8 if maskable else 1.0
    rx = 0 if maskable else 112
    dx, dy, r = DIAMOND
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="{rx}" fill="{INK}"/>
  <g transform="translate(256 256) scale({s}) translate(-256 -256)">
    <path d="M{BAR[0][0]} {BAR[0][1]}H{BAR[1][0]}M{STEM[0][0]} {STEM[0][1]}V{STEM[1][1]}M{BEZ[0][0]} {BEZ[0][1]}C{BEZ[1][0]} {BEZ[1][1]} {BEZ[2][0]} {BEZ[2][1]} {BEZ[3][0]} {BEZ[3][1]}V{LEG[1][1]}Q{HOOKQ[1][0]} {HOOKQ[1][1]} {HOOKQ[2][0]} {HOOKQ[2][1]}" fill="none" stroke="{PAPER}" stroke-width="{W}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M{dx} {dy - r}L{dx + r} {dy}L{dx} {dy + r}L{dx - r} {dy}Z" fill="{RED}"/>
  </g>
</svg>
'''


def png(size, maskable=False, path=None):
    from PIL import Image, ImageDraw
    k = 4
    S = 512 * k
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=0 if maskable else 112 * k, fill=INK)
    s = 0.8 if maskable else 1.0
    t = lambda p: ((256 + (p[0] - 256) * s) * k, (256 + (p[1] - 256) * s) * k)
    w = W * s * k

    def stroke(points):
        # штрих = цепочка кругов вдоль densified-ломаной (без артефактов на стыках)
        pts = [t(p) for p in points]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(1, int(max(abs(x1 - x0), abs(y1 - y0)) / (w / 6)))
            for i in range(n + 1):
                x, y = x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n
                d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=PAPER)

    stroke(list(BAR)); stroke(list(STEM))
    stroke(bez(BEZ) + [LEG[1]] + bez(HOOKQ)[1:])
    dx, dy, r = DIAMOND
    d.polygon([t((dx, dy - r)), t((dx + r, dy)), t((dx, dy + r)), t((dx - r, dy))], fill=RED)
    img.resize((size, size), Image.LANCZOS).save(path)


def main():
    OUT.mkdir(exist_ok=True)
    (OUT / 'icon.svg').write_text(svg(), encoding='utf-8')
    (OUT / 'icon-maskable.svg').write_text(svg(maskable=True), encoding='utf-8')
    try:
        png(192, path=OUT / 'icon-192.png')
        png(512, path=OUT / 'icon-512.png')
        png(512, maskable=True, path=OUT / 'icon-maskable-512.png')
        png(180, maskable=True, path=OUT / 'apple-touch-icon.png')
        print('icons: SVG + PNG готовы')
    except ImportError:
        print('Pillow не найден: созданы только SVG')


if __name__ == '__main__':
    main()

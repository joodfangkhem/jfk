from PIL import Image, ImageDraw

JADE = (13, 124, 102, 255)      # --primary
CREAM = (251, 249, 244, 255)    # --bg
VERM = (182, 69, 42, 255)       # --accent

SS = 4                          # supersample

def draw(size=512, bg=JADE, body=CREAM, dot=VERM, radius_pct=0.22, bleed=True):
    S = size * SS
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if bleed:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius_pct), fill=bg)
    u = S / 512.0                       # หน่วยอ้างอิงที่ 512
    w = 70 * u                          # ความหนาเส้น
    r = w / 2
    x = 332 * u                         # แกนตั้งของตัว j
    hx, hy = 256 * u, 330 * u           # จุดศูนย์กลางของหาง
    hr = 68 * u                         # รัศมีหาง
    # จุดบน = หัวเข็ม
    dr = 42 * u
    d.ellipse([x - dr, 110 * u - dr, x + dr, 110 * u + dr], fill=dot)
    # ก้าน
    d.rounded_rectangle([x - r, 212 * u - r, x + r, hy], radius=r, fill=body)
    # หาง: วาดส่วนโค้งแล้วปิดหัวท้ายด้วยวงกลมให้ได้ปลายมน
    d.arc([hx - hr - r, hy - hr - r, hx + hr + r, hy + hr + r], 0, 180, fill=body, width=int(w))
    for cx in (hx - hr, hx + hr):
        d.ellipse([cx - r, hy - r, cx + r, hy + r], fill=body)
    return img.resize((size, size), Image.LANCZOS)

def emit(outdir):
    import os
    draw(512).save(os.path.join(outdir, 'icon.png'))
    # apple-icon ไม่ต้องมนเอง iOS ครอบมุมให้อยู่แล้ว ถ้ามนซ้อนจะเห็นขอบเขียวเป็นกรอบ
    draw(180, radius_pct=0).save(os.path.join(outdir, 'apple-icon.png'))
    ico = draw(256)
    ico.save(os.path.join(outdir, 'favicon.ico'),
             sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


if __name__ == '__main__':
    big = draw(512)
    big.save('icon-512.png')
    # แผ่นพรีวิว: ดูว่าเล็กสุดยังอ่านออกไหม
    sheet = Image.new('RGBA', (1100, 340), (255, 255, 255, 255))
    xo = 20
    for s in (256, 64, 32, 16):
        im = draw(s)
        sheet.paste(im, (xo, 20), im)
        up = im.resize((s * (256 // s if s else 1), s * (256 // s)), Image.NEAREST)
        sheet.paste(up, (xo, 20) if s == 256 else (xo, 60), up)
        xo += 270
    sheet.save('preview.png')
    print('ok')

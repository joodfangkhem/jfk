"""วาดไอคอนของเว็บ (favicon / icon / apple-icon)

ตัว j สีครีมบนพื้นเขียวหยก จุดบนหัวเป็นสีชาด จึงอ่านได้ทั้งเป็นอักษรย่อของ JFK
และเป็นเข็ม เป้าหมายคือต้องยังดูออกตอนย่อเหลือ 16 px บนแท็บเบราว์เซอร์
จึงเททั้งพื้นเป็นสีเข้ม เส้นหนา และไม่เว้นขอบมาก

    python3 tools/make-icon.py          # เขียนทับไฟล์ใน src/app/
    python3 tools/make-icon.py preview  # ออกแผ่นเทียบขนาดไว้ดูเฉย ๆ
"""

import os
import sys
from PIL import Image, ImageDraw

JADE = (13, 124, 102, 255)      # --primary
CREAM = (251, 249, 244, 255)    # --bg
VERM = (182, 69, 42, 255)       # --accent

SS = 4                          # วาดใหญ่แล้วย่อ เพื่อให้ขอบเนียน
APP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'app')

# พิกัดทั้งหมดอ้างอิงผืนผ้าใบ 512x512
STROKE = 70                     # ความหนาของเส้น
AXIS_X = 332                    # แกนตั้งของก้าน
STEM_TOP = 212
HOOK = (256, 330)               # จุดศูนย์กลางของหางที่โค้งกลับ
DOT = (332, 110, 42)            # x, y, รัศมี


def draw(size=512, radius_pct=0.22):
    S = size * SS
    u = S / 512.0
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius_pct), fill=JADE)

    w = STROKE * u
    r = w / 2
    x = AXIS_X * u
    hx, hy = HOOK[0] * u, HOOK[1] * u
    # รัศมีหางต้องเท่ากับระยะจากจุดศูนย์กลางถึงแกนก้าน ไม่งั้นปลายโค้งกับก้านเหลื่อมกัน
    hr = (AXIS_X - HOOK[0]) * u

    # ประกอบตัว j ลงบนหน้ากากก่อนแล้วค่อยลงสีทีเดียว ส่วนที่ซ้อนกันจะได้รวมเป็นชิ้นเดียว
    # ถ้าวาดทับกันตรง ๆ รอยต่อระหว่างก้านกับหางจะเห็นเป็นเส้นบาง ๆ
    mask = Image.new('L', (S, S), 0)
    m = ImageDraw.Draw(mask)
    m.rounded_rectangle([x - r, STEM_TOP * u - r, x + r, hy], radius=r, fill=255)
    m.arc([hx - hr - r, hy - hr - r, hx + hr + r, hy + hr + r], 0, 180, fill=255, width=int(w))
    for cx in (hx - hr, hx + hr):            # ปลายมนของหาง
        m.ellipse([cx - r, hy - r, cx + r, hy + r], fill=255)
    img.paste(CREAM, mask=mask)

    dx, dy, dr = (v * u for v in DOT)
    d.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=VERM)
    return img.resize((size, size), Image.LANCZOS)


def emit(outdir=APP_DIR):
    draw(512).save(os.path.join(outdir, 'icon.png'))
    # apple-icon ไม่ต้องมนมุมเอง iOS ครอบมุมให้อยู่แล้ว มนซ้อนจะเห็นกรอบเขียวรอบไอคอน
    draw(180, radius_pct=0).save(os.path.join(outdir, 'apple-icon.png'))
    draw(256).save(os.path.join(outdir, 'favicon.ico'),
                   sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def preview(path='icon-preview.png'):
    sheet = Image.new('RGBA', (1100, 340), (255, 255, 255, 255))
    xo = 20
    for s in (256, 64, 32, 16):
        im = draw(s)
        sheet.paste(im, (xo, 20), im)
        up = im.resize((256, 256), Image.NEAREST)
        sheet.paste(up, (xo, 20) if s == 256 else (xo, 60), up)
        xo += 270
    sheet.save(path)
    return path


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'preview':
        print(preview())
    else:
        emit()
        print('wrote icon.png / apple-icon.png / favicon.ico ->', APP_DIR)

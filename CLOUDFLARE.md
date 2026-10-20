# ย้าย JFK จาก Vercel ไป Cloudflare Workers

> เขียนไว้ตอน 2026-10-20 ตอนที่ Vercel พักโปรเจกต์เพราะ Hobby Fluid Active CPU เกิน 4 ชม./เดือน
> (joodfangkhem.com ตอบ 402 `DEPLOYMENT_DISABLED` พักถึง 11 พ.ย. 2026)

ของที่อยู่ในโค้ดแล้ว: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`,
`initOpenNextCloudflareForDev()` ท้าย `next.config.ts` และสคริปต์ `preview` / `deploy` / `cf-typegen`
ทดสอบบน workerd ในเครื่องผ่านแล้ว (หน้าจุด, rewrite ไทย, redirect KI→KID, login guard, ค้นหา)

เหลือเฉพาะขั้นที่ต้องใช้บัญชี ทำตามลำดับนี้

## 1. บัญชี Cloudflare

สมัคร/ล็อกอินด้วย **joodfangkhem@gmail.com** (บัญชีเดียวกับ GitHub/Supabase ของโปรเจกต์นี้)
แล้วที่เครื่อง:

```bash
cd ~/Project/jfk && npx wrangler login
```

## 2. เปิด R2 แล้วสร้าง bucket

Dashboard → R2 → เปิดใช้งาน (Cloudflare จะขอผูกบัตรไว้ แม้จะใช้ในโควตาฟรี 10 GB ก็ตาม)
แล้วสร้าง bucket ชื่อ **`jfk-cache`** (ชื่อนี้ถูกอ้างใน `wrangler.jsonc` แล้ว ถ้าตั้งชื่ออื่นต้องแก้ไฟล์ตาม)

หรือสั่งจากเครื่องหลังล็อกอิน:

```bash
npx wrangler r2 bucket create jfk-cache
```

bucket นี้คือที่เก็บหน้า ISR ที่สร้างไว้แล้ว ถ้าไม่มี หน้าทุกหน้าจะถูก render ใหม่ทุกคำขอ
= กลับไปเจอปัญหาเดิมที่ทำให้ Vercel พักโปรเจกต์

## 3. ต่อ GitHub ให้ auto-deploy

Workers & Pages → Create → Workers → Import a repository → `joodfangkhem/jfk`

| ช่อง | ค่า |
|---|---|
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |
| Branch | `main` |

### ตัวแปรที่ต้องใส่ในหน้า build settings

Next ฝังค่า `NEXT_PUBLIC_*` ตั้งแต่ตอน build ไม่ใช่ตอนรัน และ `.env.local` ไม่ได้อยู่ใน git
ถ้าไม่ใส่ตรงนี้ เว็บจะ build ผ่านแต่ต่อ Supabase ไม่ได้ (หรือ build พังที่ guard ของ `src/lib/site.ts`)

```
NEXT_PUBLIC_SITE_URL=https://joodfangkhem.com
NEXT_PUBLIC_SUPABASE_URL=https://urkjxixuxxubdqymugqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key จาก .env.local>
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-4390416763222463
NEXT_PUBLIC_ADSENSE_SLOT_HOME=2916049703
NEXT_PUBLIC_ADSENSE_SLOT_LIST=3571579266
NEXT_PUBLIC_ADSENSE_SLOT_POINT=7976804696
NEXT_PUBLIC_ADSENSE_SLOT_CONDITION=6663723023
NEXT_PUBLIC_ADSENSE_SLOT_GUIDE=3380007574
```

## 4. ย้ายโดเมนมาที่ Cloudflare

DNS ของ joodfangkhem.com ตอนนี้อยู่ที่ Z.com ค่าที่มีจริง ณ 2026-10-20:

| ชนิด | ชื่อ | ค่า | ทำอย่างไร |
|---|---|---|---|
| A | `@` | `216.198.79.1` | ของ Vercel — **ลบทิ้ง** หลังต่อ Worker แล้ว |
| CNAME | `www` | `d6470827c2475dc8.vercel-dns-017.com` | ของ Vercel — **ลบทิ้ง** |
| TXT | `@` | `google-site-verification=uaDncjwV6lhBNB8gcsLYiM7pq16HkOZEyQJ20AM5m-c` | **ต้องเก็บไว้** ไม่งั้น Search Console หลุดการยืนยัน |

ไม่มี MX (โดเมนนี้ไม่ได้ใช้รับอีเมล) และไม่มี CAA จึงไม่มีอย่างอื่นให้ห่วง

ลำดับ:

1. Cloudflare → Add a site → `joodfangkhem.com` → แผน Free
2. ตอน import ให้ตรวจว่า **TXT ของ google-site-verification ติดมาด้วย** ถ้าไม่มาให้เพิ่มเอง
3. เอา nameserver ที่ Cloudflare ให้ (`xxx.ns.cloudflare.com` สองตัว) ไปใส่ที่ Z.com
   — **เมนู DNS บนแถบบน** ไม่ใช่หน้า "ตั้งค่าการชี้โดเมน" ซึ่งเป็น URL forwarding คนละอัน
4. รอ Cloudflare ขึ้น Active (ปกติไม่กี่ชั่วโมง)
5. Worker → Settings → Domains & Routes → Add custom domain: `joodfangkhem.com` และ `www.joodfangkhem.com`
6. ลบ A `@` กับ CNAME `www` ของ Vercel ทิ้ง
7. Rules → Redirect Rules: `www` → apex แบบ 301 (ของเดิมที่ Vercel ทำให้ ต้องตั้งเองที่นี่)

## 5. หลังขึ้นเสร็จ ตรวจ 5 อย่าง

```bash
curl -I https://joodfangkhem.com                       # 200 ไม่ใช่ 402
curl -s https://joodfangkhem.com/robots.txt | head -3  # Sitemap: ต้องเป็นโดเมนจริง ไม่ใช่ localhost
curl -s https://joodfangkhem.com/sitemap.xml | grep -c '<url>'   # ~830
curl -sI https://www.joodfangkhem.com | grep -i location          # 301 ไป apex
curl -s https://joodfangkhem.com/points/st-36 | grep -o '<link rel="canonical"[^>]*>'
```

แล้วเข้า `/admin/points/st-36` ล็อกอินจริง กดบันทึกสักครั้ง เพื่อดูว่า server action
`revalidatePoint()` ทำงานบน Workers (หน้า public ต้องเปลี่ยนตามทันที ไม่ต้องรอ 7 วัน)

## 6. เก็บกวาดฝั่ง Vercel

อย่าเพิ่งลบโปรเจกต์ Vercel จนกว่า Cloudflare จะนิ่ง เมื่อย้ายเสร็จแล้วค่อยปิด auto-deploy
หรือลบโปรเจกต์ทิ้ง จะได้ไม่มีสองที่แย่งกันเสิร์ฟโดเมนเดียวกัน

## สิ่งที่ยังเป็นความเสี่ยง

- `src/proxy.ts` ของ Next 16 รันบน Node runtime ซึ่ง adapter บอกเองว่า **ยังเป็น experimental**
  บน Cloudflare ถ้าวันหนึ่งพัง จุดที่จะพังคือ rewrite URL ไทยกับการกันหน้า /favorites /protocols /admin
- Workers แผนฟรีจำกัด 100,000 คำขอ/วัน ทราฟฟิกที่ทำให้ Vercel พักโปรเจกต์คือ ~25,000/วัน
  ยังอยู่ในโควตา แต่ถ้าบอทกลับมาหนักกว่าเดิมให้เปิด Bot Fight Mode (Security → Bots) ซึ่งฟรี

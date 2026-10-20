# JFK บน Cloudflare Workers

ย้ายจาก Vercel มาเสร็จ **2026-10-20** หลัง Vercel พักโปรเจกต์เพราะ Hobby Fluid Active CPU
เกิน 4 ชม./เดือน (เว็บตอบ 402 `DEPLOYMENT_DISABLED` ตั้งแต่ 12 ต.ค. พักถึง 11 พ.ย.)

**LIVE: https://joodfangkhem.com** · `www` → 301 → apex

## ของที่ตั้งไว้ตรงไหน

| | ค่า |
|---|---|
| บัญชี Cloudflare | `joodfangkhem@gmail.com` · account `b2b4963d5c312a0eb5796b29153bf6fc` |
| Worker | `jfk` · subdomain `joodfangkhem` (workers.dev ปิดไว้ ไม่ให้ Google เก็บซ้ำ) |
| ISR cache | R2 bucket `jfk-cache` |
| โดเมน | ประกาศใน `wrangler.jsonc` → `routes` ไม่ใช่กดในแดชบอร์ด |
| DNS | ย้ายมาที่ Cloudflare (`carter` / `olga.ns.cloudflare.com`) โดเมนยังจดที่ Z.com |
| auto-deploy | Workers Builds ← `joodfangkhem/jfk` branch `main` |

### Build settings (Cloudflare → Settings → Build)

```
Build command   npx opennextjs-cloudflare build
Deploy command  npx opennextjs-cloudflare deploy
```

**ห้ามใช้ `npx wrangler deploy`** ที่ Cloudflare เสนอให้เป็นค่าเริ่มต้น — เอกสาร OpenNext บอกชัดว่า
อย่าเรียก wrangler เอง เพราะ `opennextjs-cloudflare deploy` จะยัดหน้า ISR ลง R2 ก่อนแล้วค่อย deploy
ถ้าใช้ตัวเปล่า bucket จะว่าง ทุกหน้าถูก render ใหม่ตอนคนเข้าครั้งแรก = ยกปัญหาที่ทำให้ Vercel
พักโปรเจกต์มาไว้ที่ Cloudflare ทั้งดุ้น

Build variables 8 ตัว (Supabase 2 + AdSense 6) ใส่เป็น **Variable ไม่ใช่ Secret**
เพราะเป็นค่าสาธารณะที่ถูกฝังในไฟล์ JS อยู่แล้ว และ Secret จะเปิดดูย้อนหลังไม่ได้
**`NEXT_PUBLIC_SITE_URL` ไม่ต้องใส่** อยู่ใน `.env.production` ในรีโปแล้ว

## กับดักที่เจอมาแล้ว (อย่าเหยียบซ้ำ)

**1. บัญชีใหม่ยังไม่มี workers.dev subdomain** — deploy ค้าง 11 นาทีแล้วพัง error 10063
adapter สร้าง worker ชั่วคราว `open-next-cache-populate` เพื่อยัด cache ซึ่งต้องมี subdomain ก่อน
แก้ด้วยการเปิดหน้า Workers ในแดชบอร์ดครั้งแรกให้ Cloudflare สร้างให้

**2. `.env.local` ทับ `.env.production` เสมอ** — deploy จากเครื่องแล้วได้ canonical กับ sitemap
ทั้ง 854 URL ชี้ `localhost:3005` ทั้งที่ build ผ่านปกติ ตอนนี้ `src/lib/site.ts` บังคับว่า
production ต้องเป็น https เท่านั้น ไม่งั้น build พัง — **ให้ deploy ผ่าน CI เป็นหลัก** เพราะ CI สะอาด

**3. R2 `bucket info` ขึ้น 0 B / object_count 0 ได้ทั้งที่ cache เต็ม** — เป็นตัวเลขฝั่งบิลที่หน่วงเป็นชั่วโมง
ตรวจของจริงแบบนี้:

```bash
curl -sI https://joodfangkhem.com/points/bai-hui | grep -iE "x-nextjs-cache|cache-control"
# ต้องได้ x-nextjs-cache: HIT และ s-maxage นับถอยหลังจาก 604800 ตามเวลาที่ build ไป
```

**4. `proxy.ts` รันบน Node runtime ซึ่ง adapter เตือนเองว่า experimental บน Cloudflare**
ถ้าวันหนึ่งพังหลังอัป adapter จุดที่จะพังคือ rewrite URL ไทย, กันหน้า `/favorites` `/protocols` `/admin`
และ redirect `www` → apex — เทสสามอย่างนี้ทุกครั้งที่อัป

## ตรวจหลัง deploy

```bash
B=https://joodfangkhem.com
curl -s $B/points/st-36 | grep -o '<link rel="canonical"[^>]*>'   # ต้องเป็นโดเมนจริง
curl -s $B/sitemap.xml | grep -c '<url>'                          # 854
curl -s $B/points | grep -o 'href="/points/[a-z0-9-]*"' | sort -u | wc -l   # 120 = Supabase ติด
curl -sI $B/points/bai-hui | grep -i x-nextjs-cache               # HIT
curl -sI https://www.joodfangkhem.com/ | grep -i location         # 301 ไป apex
curl -so /dev/null -w '%{http_code}\n' $B/favorites               # 307
```

`120 จุด` คือตัวชี้ขาดว่า build variables ฝั่ง CI ยังอยู่ — ถ้า env หาย เว็บจะ build ผ่าน
แต่ได้เว็บเปล่า 0 จุด เพราะ guard `hasSupabase` ใน `src/lib/queries.ts` คืนค่าว่างแทนที่จะ error

## ค้างไว้

- Search Console: ส่ง sitemap ใหม่ + request indexing (เว็บล่มไป 8 วัน)
- AdSense: เช็คสถานะ review ถ้าถูกตีตกช่วง 402 ให้ยื่นใหม่
- Vercel: รอให้ Cloudflare นิ่งสัก 2-3 วันแล้วค่อยปิด auto-deploy / ลบโปรเจกต์
- ถ้าบอทกลับมาหนัก: เปิด Bot Fight Mode + AI Crawl Control (ฟรี บังคับได้จริงกว่า robots.txt)

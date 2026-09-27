# JFK — จุดฝังเข็ม (Jood Fang Khem)

คู่มืออ้างอิงจุดฝังเข็มในสัตว์ (สุนัข/แมว) ภาษาไทย — ค้นหาด้วยรหัสจุด ชื่อจีน หรืออาการ
ไล่ดูตามเส้นลมปราณ และบันทึกจุด/โน้ต/ชุดจุดของตัวเองเมื่อล็อกอินด้วย Google

- **Stack:** Next.js 16 (App Router, src dir, Turbopack) · Tailwind v4 · Supabase (Postgres + Auth + Storage) · Vercel
- **เนื้อหาเปิดอ่านฟรี** (SSR/ISR + sitemap) เพื่อให้ Google index ได้ → รองรับ AdSense
- **ล็อกอินเฉพาะ** `/favorites`, `/protocols`, `/admin`
- Dev port: **3005** (`.claude/launch.json` → `jfk-dev`)

## ตั้งค่าครั้งแรก

### 1. Supabase
1. สร้าง project ใหม่ (region Singapore)
2. SQL Editor → รัน `supabase-schema.sql` ทั้งไฟล์
3. SQL Editor → รัน `supabase-seed.sql` ทั้งไฟล์ (รันซ้ำได้ เป็น upsert)
4. Authentication → Providers → เปิด **Google** (ต้องสร้าง OAuth client ใน Google Cloud Console
   โดยใส่ Authorized redirect URI เป็น `https://<project-ref>.supabase.co/auth/v1/callback`)
5. Authentication → URL Configuration → ใส่ Site URL และ redirect allow-list:
   `http://localhost:3005/**` และ `https://<โดเมนจริง>/**`

### 2. Env
คัดลอก `.env.local.example` เป็น `.env.local` แล้วใส่ค่า
(อย่า copy ค่า key มาจากแชท ให้ copy จากหน้า Supabase ตรงๆ — เคยมีปัญหาตัวอักษรแปลกติดมา)

### 3. ตั้งตัวเองเป็นแอดมิน (เพื่อแก้เนื้อหา/อัปโหลดรูปจากในแอปที่ `/admin`)
ล็อกอินเข้าแอปด้วย Google หนึ่งครั้งก่อน แล้วรันใน SQL Editor:

```sql
insert into admins (user_id, note)
select id, 'owner' from auth.users where email = 'อีเมลของคุณ@gmail.com'
on conflict (user_id) do nothing;
```

### 4. AdSense (ทำหลังมีเนื้อหาและโดเมนจริงแล้ว)
ใส่ `NEXT_PUBLIC_ADSENSE_CLIENT` (เช่น `ca-pub-xxxxxxxx`) และรหัส slot ต่างๆ
ถ้าเว้นว่าง สคริปต์ AdSense จะไม่ถูกโหลดและช่องโฆษณาจะไม่ render เลย

## โครงสร้างข้อมูล

| ตาราง | ใช้ทำอะไร | สิทธิ์ |
|---|---|---|
| `meridians` | เส้นลมปราณ 14 เส้น + กลุ่มจุดคลาสสิก (`EX`) | อ่านได้ทุกคน / แอดมินแก้ |
| `points` | จุดฝังเข็ม (ตำแหน่ง สรรพคุณ ข้อบ่งใช้ เทคนิค ข้อควรระวัง รูป) | อ่านได้ทุกคน / แอดมินแก้ |
| `conditions` + `condition_points` | อาการ ↔ จุดหลัก/จุดเสริม | อ่านได้ทุกคน / แอดมินแก้ |
| `favorites`, `notes`, `protocols`, `protocol_points` | ข้อมูลผู้ใช้ | เจ้าของเท่านั้น (RLS) |
| `admins` | รายชื่อผู้ดูแล | อ่านได้แค่ตัวเอง |

รูปภาพจุดเก็บใน Storage bucket `point-images` (public read, แอดมินอัปโหลด)
จุดที่ยังไม่มีรูปจะแสดงกรอบ "ยังไม่มีรูป" ไว้

## คำสั่ง

```bash
npm run dev      # dev server (port 3005 ถ้าเรียกผ่าน launch.json)
npm run build    # production build
npm run lint
```

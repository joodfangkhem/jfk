# JFK — จุดฝังเข็ม (notes for Claude)

แอปคู่มือจุดฝังเข็มในสัตว์ ภาษาไทย เจ้าของเป็นสัตวแพทย์ (armmani)

## หลักการที่ต้องรักษาไว้

1. **เนื้อหาต้อง public** — หน้าจุด/เส้นลมปราณ/อาการ ต้องอ่านได้โดยไม่ล็อกอิน และเป็น SSG/ISR
   เพราะเป้าหมายคือ Google index + รายได้ AdSense ห้ามย้ายหน้าเนื้อหาไปอยู่หลัง auth
   หน้าที่ต้องล็อกอินมีแค่ `/favorites`, `/protocols`, `/admin` (คุมที่ `src/proxy.ts`)
2. **หน้า public ใช้ `supabasePublic`** (`src/lib/supabase/public.ts`, ไม่มี cookie) เพื่อไม่ทำให้ route
   กลายเป็น dynamic หน้าที่ต้องรู้ตัวตนให้ใช้ `createClient()` จาก `server.ts` หรือ client component
3. **ข้อมูลทางคลินิกต้องระวัง** — ตำแหน่งจุดเป็นระบบ transpositional ตำราต่างสำนักคลาดเคลื่อนกันได้
   ทุกหน้ามี disclaimer และผู้ใช้แก้เนื้อหาเองได้ที่ `/admin` อย่าแก้ข้อมูลจุดเองโดยไม่ถาม
4. **รูปภาพ** — เจ้าของจะถ่ายเองแล้วอัปโหลดผ่าน `/admin/points/[slug]`
   (bucket `point-images`) จุดที่ยังไม่มีรูปแสดง placeholder อยู่แล้ว ไม่ต้องหารูปจากอินเทอร์เน็ตมาใส่
5. **Next 16** ใช้ `src/proxy.ts` (ไม่ใช่ `middleware.ts`) และ `params`/`searchParams` เป็น Promise

## ไฟล์สำคัญ

- `supabase-schema.sql` — ตาราง + RLS + `search_points()` + bucket + policy แอดมิน
- `supabase-seed.sql` — 14 เส้นลมปราณ, ~100 จุด, 22 อาการ + การจับคู่จุด (upsert รันซ้ำได้)
- `src/lib/queries.ts` — ทุก query ของหน้า public (มี guard `hasSupabase` ให้ build ผ่านตอนไม่มี env)
- `src/components/AdSlot.tsx` — ไม่ render อะไรเลยถ้าไม่มี `NEXT_PUBLIC_ADSENSE_CLIENT`

## สถานะ (2026-09-29)

- **LIVE: https://joodfangkhem.com** — Vercel auto-deploy จาก `joodfangkhem/jfk` (บัญชี GitHub แยก ไม่ใช่ armmani)
- Supabase `urkjxixuxxubdqymugqo` รัน schema + seed + migration ครบ (100 จุด / 15 เส้น / 22 อาการ)
- Google OAuth publish แล้ว ล็อกอินใช้งานได้จริง · `joodfangkhem@gmail.com` เป็น admin
- Search Console verify + ส่ง sitemap แล้ว (Google เจอ 144 หน้า)
- AdSense `ca-pub-4390416763222463` ติดครบ 5 slot + ads.txt · **รอผลตรวจ**
- ผู้ใช้ส่งรูปเข้ามาได้ แอดมินอนุมัติที่ `/admin/submissions` · จุดละได้ถึง 6 รูป เลือกรูปหลักได้
- ยังไม่มี: รูปจุดจริง, จุดที่เหลือ (~260), species ม้า/วัว

## กับดักที่เจอมาแล้ว

- **`next/script` ไม่ใส่ `<script>` ลงใน SSR HTML** (ออกมาเป็น `<link rel=preload>` แล้วแทรกด้วย JS)
  ทำให้ crawler ของ AdSense ยืนยันเว็บไม่ผ่าน — ต้องใช้ `<script>` ธรรมดาใน `<head>` ของ root layout
- **generated column ที่เรียก `array_to_string()` รันไม่ผ่าน** (42P17 not immutable) → ใช้ trigger แทน
- Supabase SQL Editor รันทั้งสคริปต์ใน transaction เดียว error กลางทาง = rollback หมด
- component ที่เช็ค auth จะ render null ตอน SSR → `curl | grep` หาไม่เจอ ไม่ได้แปลว่า deploy ไม่ขึ้น

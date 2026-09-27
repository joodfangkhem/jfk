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

## สถานะ

- โครงสร้างและเนื้อหาชุดแรกเสร็จแล้ว build/lint/typecheck ผ่าน
- ยังไม่ได้: สร้าง Supabase project จริง, รัน SQL, เปิด Google OAuth, สร้าง GitHub repo, deploy Vercel, สมัคร AdSense
- ยังไม่มี: รูปภาพจุด, จุดที่เหลือของแต่ละเส้น (ตอนนี้เอาจุดที่ใช้บ่อยก่อน), species ม้า/วัว (schema รองรับแล้ว)

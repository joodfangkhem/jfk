import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** ยังไม่ได้ตั้งค่า Supabase (เช่นตอน build ครั้งแรก) — หน้าเว็บจะขึ้นเป็นรายการว่างแทนที่จะพัง */
export const hasSupabase = Boolean(url && key)

/**
 * client แบบไม่มี cookie สำหรับอ่านเนื้อหาสาธารณะ (จุด/เส้นลมปราณ/อาการ)
 * ใช้ตัวนี้เพื่อให้หน้า public ยัง static/ISR ได้ → ดีต่อ SEO และ AdSense
 */
export const supabasePublic = createClient(
  url ?? 'http://127.0.0.1:54321',
  key ?? 'public-anon-key-placeholder',
  { auth: { persistSession: false } }
)

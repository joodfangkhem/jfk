'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * หน้า public แคชไว้ 7 วันเพื่อประหยัด CPU จึงต้องมีคนสะกิดให้สร้างใหม่ตอนแอดมินแก้ข้อมูล
 * (PointEditor / VerifyToggle / PointGalleryManager เขียน Supabase ตรงจากเบราว์เซอร์
 * Next จึงไม่รู้ว่ามีอะไรเปลี่ยน ถ้าไม่เรียกตัวนี้ข้อมูลใหม่จะขึ้นก็ต่อเมื่อแคชหมดอายุ)
 */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  return Boolean(data)
}

/** path ที่ Next เห็นจริงหลัง proxy rewrite — ไทยก็มี prefix /th */
const LOCALES = ['th', 'en'] as const

/** จุดเดียวที่แก้ กระทบหน้าจุดนั้นกับหน้ารวมที่ลิสต์ชื่อจุดไว้ */
export async function revalidatePoint(slug: string) {
  if (!slug || !(await requireAdmin())) return
  for (const l of LOCALES) {
    revalidatePath(`/${l}/points/${slug}`)
    revalidatePath(`/${l}/points`)
    revalidatePath(`/${l}`)
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { refreshPages } from '@/lib/refreshPages'
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

/** slug มาจากเบราว์เซอร์และถูกต่อเป็น URL จึงต้องคัดก่อน */
function validSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug)
}

/** path ที่ Next เห็นจริงหลัง proxy rewrite — ไทยก็มี prefix /th */
const LOCALES = ['th', 'en'] as const

/** จุดเดียวที่แก้ กระทบหน้าจุดนั้นกับหน้ารวมที่ลิสต์ชื่อจุดไว้ */
export async function revalidatePoint(slug: string) {
  if (!validSlug(slug) || !(await requireAdmin())) return
  for (const l of LOCALES) {
    revalidatePath(`/${l}/points/${slug}`)
    revalidatePath(`/${l}/points`)
    revalidatePath(`/${l}`)
  }
  // /points เป็น dynamic อยู่แล้ว ไม่ต้องสร้างใหม่
  await refreshPages([`/points/${slug}`, '/'])
}

/** ปักหรือย้ายจุดบนโมเดล 3 มิติ — กระทบหน้าแอตลาสกับหน้าจุดนั้น */
export async function revalidateAtlas(slug?: string) {
  if (!(await requireAdmin())) return
  for (const l of LOCALES) {
    revalidatePath(`/${l}/atlas`)
    if (slug) revalidatePath(`/${l}/points/${slug}`)
  }
  await refreshPages(['/atlas', ...(slug && validSlug(slug) ? [`/points/${slug}`] : [])])
}

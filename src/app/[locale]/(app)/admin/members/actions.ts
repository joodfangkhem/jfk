'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLocale, type Locale } from '@/lib/i18n'

/** path ที่ Next เห็นจริงหลัง proxy rewrite — ไทยก็มี prefix /th */
function routePath(formData: FormData, path: string) {
  const raw = String(formData.get('locale') ?? '')
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return `/${locale}${path}`
}

/**
 * ให้สิทธิ์ "ผู้ช่วยตรวจข้อมูล"
 * ด่านจริงคือ policy `contributors_admin_write` (is_admin()) — ถ้าคนกดไม่ใช่แอดมิน insert จะถูกปฏิเสธ
 * และ trigger ฝั่ง DB เป็นตัวเติม granted_by จาก token เอง
 */
export async function grantContributor(formData: FormData) {
  const userId = String(formData.get('user_id') ?? '')
  const note = String(formData.get('note') ?? '').trim()
  if (!userId) return

  const supabase = await createClient()
  await supabase.from('contributors').upsert(
    { user_id: userId, note: note || null },
    { onConflict: 'user_id' }
  )

  revalidatePath(routePath(formData, '/admin/members'))
}

/** ถอนสิทธิ์ผู้ช่วย — เรื่องที่เคยส่งเข้ามายังอยู่ในกล่องแอดมินเหมือนเดิม */
export async function revokeContributor(formData: FormData) {
  const userId = String(formData.get('user_id') ?? '')
  if (!userId) return

  const supabase = await createClient()
  await supabase.from('contributors').delete().eq('user_id', userId)

  revalidatePath(routePath(formData, '/admin/members'))
}

/** โน้ตกำกับตัวผู้ช่วย (เห็นเฉพาะแอดมิน) */
export async function saveContributorNote(formData: FormData) {
  const userId = String(formData.get('user_id') ?? '')
  const note = String(formData.get('note') ?? '').trim()
  if (!userId) return

  const supabase = await createClient()
  await supabase.from('contributors').update({ note: note || null }).eq('user_id', userId)

  revalidatePath(routePath(formData, '/admin/members'))
}

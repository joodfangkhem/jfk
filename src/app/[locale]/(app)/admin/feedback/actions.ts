'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLocale, type Locale } from '@/lib/i18n'

const STATUSES = ['open', 'doing', 'done', 'rejected'] as const

/** path ที่ Next เห็นจริงหลัง proxy rewrite — ไทยก็มี prefix /th */
function routePath(formData: FormData, path: string) {
  const raw = String(formData.get('locale') ?? '')
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return `/${locale}${path}`
}

/**
 * เปลี่ยนสถานะเรื่อง + เขียนโน้ตตอบผู้ส่ง
 * ด่านจริงคือ policy `feedback_admin_write` (is_admin()) — คนอื่น update ไม่ผ่าน
 */
export async function setFeedbackStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  const note = String(formData.get('admin_note') ?? '').trim()
  if (!id || !(STATUSES as readonly string[]).includes(status)) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('feedback')
    .update({
      status,
      admin_note: note || null,
      // กลับเป็น "รอจัดการ" = ถือว่ายังไม่ได้ตรวจ ล้างชื่อคนตรวจออกให้ตรงกับความจริง
      reviewed_by: status === 'open' ? null : user.id,
      reviewed_at: status === 'open' ? null : new Date().toISOString(),
    })
    .eq('id', id)

  revalidatePath(routePath(formData, '/admin/feedback'))
  revalidatePath(routePath(formData, '/admin'))
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseAnnotations } from '@/lib/annotations'
import { revalidatePoint } from '@/lib/revalidate'
import { isLocale, type Locale } from '@/lib/i18n'

/** path ที่ Next เห็นจริงหลัง proxy rewrite — ไทยก็มี prefix /th */
function routePath(formData: FormData, path: string) {
  const raw = String(formData.get('locale') ?? '')
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return `/${locale}${path}`
}

/** อนุมัติ: เพิ่มรูปเข้าแกลเลอรีของจุดนั้น (รูปแรกจะถูกตั้งเป็นรูปหลักให้เลย) */
export async function approveSubmission(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const pointId = String(formData.get('point_id') ?? '')
  const imageUrl = String(formData.get('image_url') ?? '')
  const storagePath = String(formData.get('storage_path') ?? '')
  const credit = String(formData.get('credit') ?? '').trim()
  const caption = String(formData.get('caption') ?? '').trim()
  const slug = String(formData.get('slug') ?? '')
  const annotations = parseAnnotations(formData.get('annotations'))
  if (!id || !pointId || !imageUrl) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { count } = await supabase
    .from('point_images')
    .select('*', { count: 'exact', head: true })
    .eq('point_id', pointId)

  const existing = count ?? 0

  const { data: row, error } = await supabase
    .from('point_images')
    .insert({
      point_id: pointId,
      image_url: imageUrl,
      storage_path: storagePath || null,
      caption: caption || null,
      credit: credit || null,
      sort_order: existing,
      ...(annotations && { annotations }),
    })
    .select('id')
    .single()

  // เต็ม 6 รูปแล้ว หรือ insert ไม่ผ่าน -> ปล่อยให้ค้างรออนุมัติไว้เหมือนเดิม
  if (error || !row) return

  // แยกจาก insert: รูปย่อพลาดต้องไม่ทำให้อนุมัติไม่ผ่าน (DB บังคับว่าต้องอยู่ใน thumbs/)
  const thumbUrl = String(formData.get('thumb_url') ?? '')
  if (thumbUrl) {
    await supabase.from('point_images').update({ thumb_url: thumbUrl }).eq('id', row.id)
  }

  if (existing === 0) {
    await supabase.rpc('set_primary_point_image', { img_id: row.id })
  }

  await supabase
    .from('point_image_submissions')
    .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  // หน้าจุดแคช 7 วัน ไม่สะกิดตรงนี้รูปที่เพิ่งอนุมัติจะยังไม่ขึ้นเว็บ
  await revalidatePoint(slug)
  revalidatePath(routePath(formData, '/admin/submissions'))
  revalidatePath(routePath(formData, '/admin'))
}

/** ปฏิเสธ: มาร์คว่าไม่ผ่าน พร้อมเหตุผล และลบไฟล์ทิ้ง */
export async function rejectSubmission(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const reason = String(formData.get('reason') ?? '').trim()
  const path = String(formData.get('storage_path') ?? '')
  if (!id) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('point_image_submissions')
    .update({
      status: 'rejected',
      reject_reason: reason || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (path) await supabase.storage.from('point-images').remove([path])

  revalidatePath(routePath(formData, '/admin/submissions'))
}

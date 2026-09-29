'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/** อนุมัติ: เพิ่มรูปเข้าแกลเลอรีของจุดนั้น (รูปแรกจะถูกตั้งเป็นรูปหลักให้เลย) */
export async function approveSubmission(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const pointId = String(formData.get('point_id') ?? '')
  const imageUrl = String(formData.get('image_url') ?? '')
  const storagePath = String(formData.get('storage_path') ?? '')
  const credit = String(formData.get('credit') ?? '').trim()
  const caption = String(formData.get('caption') ?? '').trim()
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
    })
    .select('id')
    .single()

  // เต็ม 6 รูปแล้ว หรือ insert ไม่ผ่าน -> ปล่อยให้ค้างรออนุมัติไว้เหมือนเดิม
  if (error || !row) return

  if (existing === 0) {
    await supabase.rpc('set_primary_point_image', { img_id: row.id })
  }

  await supabase
    .from('point_image_submissions')
    .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin/submissions')
  revalidatePath('/admin')
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

  revalidatePath('/admin/submissions')
}

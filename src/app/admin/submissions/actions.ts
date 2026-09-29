'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/** อนุมัติ: เอารูปไปใส่ให้จุดนั้นเลย แล้วมาร์คว่าผ่าน */
export async function approveSubmission(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const pointId = String(formData.get('point_id') ?? '')
  const imageUrl = String(formData.get('image_url') ?? '')
  const credit = String(formData.get('credit') ?? '').trim()
  const caption = String(formData.get('caption') ?? '').trim()
  if (!id || !pointId || !imageUrl) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error: pointErr } = await supabase
    .from('points')
    .update({
      image_url: imageUrl,
      image_credit: credit || null,
      image_alt: caption || null,
    })
    .eq('id', pointId)
  if (pointErr) return

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

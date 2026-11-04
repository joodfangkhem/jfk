'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLocale, type Locale } from '@/lib/i18n'

/** ถอนเรื่องที่ตัวเองส่งไป — policy `feedback_owner_delete` ยอมให้ลบได้เฉพาะที่ยัง 'open' */
export async function withdrawFeedback(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const raw = String(formData.get('locale') ?? '')
  const locale: Locale = isLocale(raw) ? raw : 'th'

  const supabase = await createClient()
  await supabase.from('feedback').delete().eq('id', id)

  revalidatePath(`/${locale}/feedback`)
}

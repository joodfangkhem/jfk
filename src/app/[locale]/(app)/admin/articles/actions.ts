'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isLocale, lp, type Locale } from '@/lib/i18n'

function localeOf(formData: FormData): Locale {
  const raw = String(formData.get('locale') ?? '')
  return isLocale(raw) ? raw : 'th'
}

/** สร้างฉบับร่างเปล่าแล้วเด้งเข้าหน้าแก้ไขเลย */
export async function createArticle(formData: FormData) {
  const locale = localeOf(formData)
  const type = String(formData.get('type') ?? 'article') === 'case' ? 'case' : 'article'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(lp(locale, '/login'))

  // ผูกผู้เขียนให้อัตโนมัติจากแถวใน authors ที่ตรงกับบัญชีที่ล็อกอินอยู่
  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const stamp = Date.now().toString(36)
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: `${type}-${stamp}`,
      type,
      status: 'draft',
      author_id: author?.id ?? null,
      title_th: type === 'case' ? 'เคสใหม่' : 'บทความใหม่',
      body_th: '',
    })
    .select('id')
    .single()

  if (error || !data) return

  if (type === 'case') {
    await supabase.from('article_cases').insert({ article_id: data.id })
    await supabase.from('article_case_private').insert({ article_id: data.id })
  }

  revalidatePath(`/${locale}/admin/articles`)
  redirect(lp(locale, `/admin/articles/${data.id}`))
}

export async function deleteArticle(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const locale = localeOf(formData)

  const supabase = await createClient()
  await supabase.from('articles').delete().eq('id', id)

  revalidatePath(`/${locale}/admin/articles`)
  redirect(lp(locale, '/admin/articles'))
}

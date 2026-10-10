'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabasePublic } from '@/lib/supabase/public'
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

/**
 * ArticleEditor บันทึกจากเบราว์เซอร์ตรงเข้า Supabase จึงไม่มี server action
 * ตัวไหนทำงาน และหน้าสาธารณะที่เป็น ISR จะค้างแคชไว้จนครบชั่วโมง
 * ฟังก์ชันนี้ให้ editor เรียกหลังบันทึกสำเร็จ เพื่อล้างแคชเฉพาะหน้าที่เกี่ยวข้อง
 * ต้องใช้ path ของ route จริงที่มี /th หรือ /en นำหน้า ไม่ใช่ URL ที่ผู้ใช้เห็น
 */
export async function refreshArticlePages(articleId: string, slug: string) {
  for (const l of ['th', 'en'] as const) {
    revalidatePath(`/${l}/articles`)
    if (slug) revalidatePath(`/${l}/articles/${slug}`)
    revalidatePath(`/${l}/admin/articles`)
  }

  // บทความโผล่ท้ายหน้าจุดที่ถูกอ้างถึงด้วย จึงต้องล้างหน้าจุดพวกนั้นด้วย
  const { data } = await supabasePublic
    .from('article_points')
    .select('points(slug)')
    .eq('article_id', articleId)

  for (const row of data ?? []) {
    const ps = (row as { points?: { slug?: string } | null }).points?.slug
    if (!ps) continue
    for (const l of ['th', 'en'] as const) revalidatePath(`/${l}/points/${ps}`)
  }
}

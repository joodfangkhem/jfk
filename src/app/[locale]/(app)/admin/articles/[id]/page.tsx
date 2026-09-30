import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ArticleEditor, {
  type EditorArticle,
  type EditorCase,
  type EditorPrivate,
} from '@/components/ArticleEditor'
import { deleteArticle } from '../actions'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).artAdmin.title, robots: { index: false, follow: false } }
}

export default async function AdminArticleEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale: raw, id } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle()

  if (!admin) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted">
          {d.admin.notAdmin}{' '}
          <Link href={lp(locale, '/admin')} className="text-primary underline">
            {d.admin.notAdminLink}
          </Link>
        </p>
      </main>
    )
  }

  const { data: article } = await supabase
    .from('articles')
    .select('id, slug, type, status, title_th, excerpt_th, body_th, cover_url, cover_alt')
    .eq('id', id)
    .maybeSingle()
  if (!article) notFound()

  const [{ data: caseRow }, { data: privateRow }] = await Promise.all([
    supabase
      .from('article_cases')
      .select('pet_name, species, breed, sex, age_text, disclosure, complaint, diagnosis, sessions, outcome')
      .eq('article_id', id)
      .maybeSingle(),
    supabase
      .from('article_case_private')
      .select('owner_full_name, consent_date, consent_note')
      .eq('article_id', id)
      .maybeSingle(),
  ])

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href={lp(locale, '/admin')} className="hover:text-primary">{d.admin.title}</Link>
        <span>/</span>
        <Link href={lp(locale, '/admin/articles')} className="hover:text-primary">
          {d.artAdmin.title}
        </Link>
      </nav>

      <ArticleEditor
        article={article as EditorArticle}
        caseRow={(caseRow as EditorCase) ?? null}
        privateRow={(privateRow as EditorPrivate) ?? null}
        locale={locale}
      />

      <form action={deleteArticle} className="pt-4 border-t border-border">
        <input type="hidden" name="id" value={article.id} />
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="text-sm text-accent inline-flex items-center gap-1.5 hover:underline"
        >
          <Trash2 size={14} /> {d.artAdmin.del}
        </button>
      </form>
    </main>
  )
}

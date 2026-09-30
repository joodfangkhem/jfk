import Link from 'next/link'
import type { Metadata } from 'next'
import { FileText, Plus, Stethoscope } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createArticle } from './actions'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).artAdmin.title, robots: { index: false, follow: false } }
}

export default async function AdminArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
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

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, type, status, title_th, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted">
        <Link href={lp(locale, '/admin')} className="hover:text-primary">
          {d.admin.title}
        </Link>
      </nav>

      <h1 className="text-xl font-bold">{d.artAdmin.title}</h1>

      <div className="flex gap-2 flex-wrap">
        {(['article', 'case'] as const).map((type) => (
          <form key={type} action={createArticle}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="type" value={type} />
            <button
              type="submit"
              className={`h-11 px-4 inline-flex items-center gap-1.5 rounded-full text-sm font-medium active:scale-95 transition ${
                type === 'case'
                  ? 'border border-accent/30 bg-accent-soft text-accent'
                  : 'bg-primary text-white'
              }`}
            >
              <Plus size={16} />
              {type === 'case' ? d.artAdmin.newCase : d.artAdmin.newArticle}
            </button>
          </form>
        ))}
      </div>

      {(articles ?? []).length === 0 ? (
        <p className="text-sm text-muted">{d.artAdmin.empty}</p>
      ) : (
        <div className="space-y-2">
          {(articles ?? []).map((a) => (
            <Link
              key={a.id}
              href={lp(locale, `/admin/articles/${a.id}`)}
              className="card p-3 flex items-center gap-3 hover:border-primary/50 transition"
            >
              {a.type === 'case' ? (
                <Stethoscope size={16} className="text-accent shrink-0" />
              ) : (
                <FileText size={16} className="text-primary shrink-0" />
              )}
              <span className="flex-1 text-sm truncate">{a.title_th}</span>
              <span
                className={`chip ${
                  a.status === 'published' ? 'text-primary border-primary/30' : 'text-warn border-warn/30'
                }`}
              >
                {a.status === 'published' ? d.artAdmin.published : d.artAdmin.draft}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

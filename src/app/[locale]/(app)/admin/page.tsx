import Link from 'next/link'
import type { Metadata } from 'next'
import { Inbox, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isLocale, lp, pick, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).admin.title, robots: { index: false, follow: false } }
}

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; noimage?: string; unverified?: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)

  const { q, noimage, unverified } = await searchParams
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
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-3">
        <h1 className="text-xl font-bold">{d.admin.notAdminTitle}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.admin.notAdminBody}</p>
        <pre className="card p-3 text-xs overflow-x-auto leading-relaxed">
{`insert into admins (user_id, note)
select id, 'owner' from auth.users
where email = '${user?.email ?? 'your@email.com'}'
on conflict (user_id) do nothing;`}
        </pre>
      </main>
    )
  }

  let query = supabase
    .from('points')
    .select('id, code, slug, name_th, name_en, image_url, verified')
    .order('popularity', { ascending: false })
    .limit(200)
  if (q) query = query.ilike('search_text', `%${q}%`)
  if (noimage) query = query.is('image_url', null)
  if (unverified) query = query.eq('verified', false)
  const { data: points } = await query

  const withImage = (points ?? []).filter((p) => p.image_url).length
  const { count: pendingCount } = await supabase
    .from('point_image_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const base = lp(locale, '/admin')
  const filterHref = (extra?: string) =>
    `${base}${q ? `?q=${encodeURIComponent(q)}${extra ? `&${extra}` : ''}` : extra ? `?${extra}` : ''}`

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck size={19} className="text-primary" /> {d.admin.heading}
        </h1>
        <p className="text-sm text-muted">{d.admin.stat(withImage, points?.length ?? 0)}</p>
      </header>

      <div className="flex gap-1.5">
        <Link
          href={filterHref()}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            !noimage && !unverified
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          {d.admin.all}
        </Link>
        <Link
          href={filterHref('noimage=1')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            noimage
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          {d.admin.noImage}
        </Link>
        <Link
          href={filterHref('unverified=1')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            unverified
              ? 'bg-warn text-white border-warn'
              : 'bg-surface text-muted border-border hover:text-warn'
          }`}
        >
          {d.admin.unverified}
        </Link>
      </div>

      <Link
        href={lp(locale, '/admin/submissions')}
        className="card p-3.5 flex items-center gap-3 hover:border-primary/50 transition"
      >
        <Inbox size={18} className="text-primary shrink-0" />
        <span className="flex-1 text-sm font-medium">{d.admin.inbox}</span>
        {pendingCount ? (
          <span className="min-w-6 h-6 px-2 inline-flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
            {pendingCount}
          </span>
        ) : (
          <span className="chip">{d.admin.inboxEmpty}</span>
        )}
      </Link>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder={d.admin.searchPlaceholder}
          className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        {noimage && <input type="hidden" name="noimage" value="1" />}
        {unverified && <input type="hidden" name="unverified" value="1" />}
        <button className="h-11 px-4 rounded-full bg-primary text-white text-sm font-medium">
          {d.admin.search}
        </button>
      </form>

      <div className="space-y-2">
        {(points ?? []).map((p) => (
          <Link
            key={p.id}
            href={lp(locale, `/admin/points/${p.slug}`)}
            className="card p-3 flex items-center gap-3 hover:border-primary/50 transition"
          >
            <span className="shrink-0 min-w-14 h-7 px-2 inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-[13px]">
              {p.code}
            </span>
            <span className="flex-1 text-sm truncate">{pick(locale, p.name_th, p.name_en)}</span>
            {!p.verified && <span className="chip text-warn border-warn/30">{d.admin.pendingChip}</span>}
            <span className={`chip ${p.image_url ? 'text-primary border-primary/30' : ''}`}>
              {p.image_url ? d.admin.hasImage : d.admin.noImage}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}

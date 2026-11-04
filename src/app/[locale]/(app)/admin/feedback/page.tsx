import Link from 'next/link'
import type { Metadata } from 'next'
import { Flag, PencilLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { setFeedbackStatus } from './actions'
import { isLocale, lp, pick, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).fb.title, robots: { index: false, follow: false } }
}

type Kind = 'error' | 'typo' | 'image' | 'missing' | 'other'
type Status = 'open' | 'doing' | 'done' | 'rejected'

type Row = {
  id: string
  user_email: string | null
  kind: Kind
  point_id: string | null
  target: string | null
  target_label: string | null
  field: string | null
  message: string
  suggestion: string | null
  status: Status
  admin_note: string | null
  created_at: string
  points: { code: string; slug: string; name_th: string | null; name_en: string | null } | null
}

const STATUS_CHIP: Record<Status, string> = {
  open: 'text-warn border-warn/30',
  doing: 'text-primary border-primary/30',
  done: 'text-primary border-primary/30',
  rejected: 'text-muted',
}

export default async function AdminFeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ all?: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale).fb
  const { all } = await searchParams

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
          {t(locale).admin.notAdmin}{' '}
          <Link href={lp(locale, '/admin')} className="text-primary underline">
            {t(locale).admin.notAdminLink}
          </Link>
        </p>
      </main>
    )
  }

  let query = supabase
    .from('feedback')
    .select(
      'id, user_email, kind, point_id, target, target_label, field, message, suggestion, status, admin_note, created_at, points (code, slug, name_th, name_en)'
    )
    .order('created_at', { ascending: false })
    .limit(100)
  if (!all) query = query.eq('status', 'open')
  const { data } = await query

  const rows = (data ?? []) as unknown as Row[]
  const { count: openCount } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  const base = lp(locale, '/admin/feedback')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted">
        <Link href={lp(locale, '/admin')} className="hover:text-primary">
          {t(locale).admin.title}
        </Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Flag size={19} className="text-accent" /> {d.heading}
        </h1>
        <p className="text-sm text-muted">
          {openCount ? d.openCount(openCount) : d.none}
        </p>
      </header>

      <div className="flex gap-1.5">
        <Link
          href={base}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            !all
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          {d.filterOpen}
        </Link>
        <Link
          href={`${base}?all=1`}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            all
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          {d.filterAll}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card p-6 text-center text-sm text-muted">{d.emptyAdmin}</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="card p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="chip text-accent border-accent/30">{d.kind[r.kind]}</span>
                {r.field && (
                  <span className="chip">
                    {d.field[r.field as keyof typeof d.field] ?? r.field}
                  </span>
                )}
                <span className={`chip ${STATUS_CHIP[r.status]}`}>{d.status[r.status]}</span>
                <span className="flex-1" />
                <span className="text-xs text-muted">
                  {new Date(r.created_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'th-TH')}
                </span>
              </div>

              <div className="text-sm">
                {r.points ? (
                  <Link
                    href={lp(locale, `/points/${r.points.slug}`)}
                    className="font-semibold text-primary"
                  >
                    {r.points.code} {pick(locale, r.points.name_th, r.points.name_en)}
                  </Link>
                ) : r.target ? (
                  <Link href={lp(locale, r.target)} className="font-semibold text-primary">
                    {r.target_label ?? r.target}
                  </Link>
                ) : (
                  <span className="font-semibold">{r.target_label ?? '—'}</span>
                )}
                <p className="text-xs text-muted mt-0.5">
                  {d.by} {r.user_email ?? '—'}
                </p>
              </div>

              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{r.message}</p>

              {r.suggestion && (
                <div className="rounded-xl border border-primary/25 bg-primary-soft/40 p-3">
                  <p className="text-xs font-medium text-primary mb-1">{d.suggests}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.suggestion}</p>
                </div>
              )}

              {r.points && (
                <Link
                  href={lp(locale, `/admin/points/${r.points.slug}`)}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  <PencilLine size={13} /> {d.goEdit}
                </Link>
              )}

              <form action={setFeedbackStatus} className="space-y-2">
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="locale" value={locale} />
                <input
                  name="admin_note"
                  defaultValue={r.admin_note ?? ''}
                  maxLength={300}
                  placeholder={d.adminNotePlaceholder}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
                />
                <div className="flex flex-wrap gap-1.5">
                  {r.status !== 'doing' && (
                    <button
                      name="status"
                      value="doing"
                      className="h-10 px-4 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
                    >
                      {d.markDoing}
                    </button>
                  )}
                  {r.status !== 'done' && (
                    <button
                      name="status"
                      value="done"
                      className="h-10 px-4 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
                    >
                      {d.markDone}
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      name="status"
                      value="rejected"
                      className="h-10 px-4 rounded-full border border-accent/30 text-accent text-sm font-medium active:scale-95 transition"
                    >
                      {d.markRejected}
                    </button>
                  )}
                  {r.status !== 'open' && (
                    <button
                      name="status"
                      value="open"
                      className="h-10 px-4 rounded-full border border-border text-muted text-sm font-medium"
                    >
                      {d.reopen}
                    </button>
                  )}
                </div>
              </form>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

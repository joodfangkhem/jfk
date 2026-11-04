import Link from 'next/link'
import type { Metadata } from 'next'
import { Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { withdrawFeedback } from './actions'
import { isLocale, lp, pick, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).fb.myTitle, robots: { index: false, follow: false } }
}

type Status = 'open' | 'doing' | 'done' | 'rejected'
type Kind = 'error' | 'typo' | 'image' | 'missing' | 'other'

type Row = {
  id: string
  kind: Kind
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

/** หน้าของผู้ช่วย: ดูว่าเรื่องที่ส่งไปถึงไหนแล้ว */
export default async function MyFeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale).fb

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: admin }, { data: contributor }] = await Promise.all([
    supabase.from('admins').select('user_id').eq('user_id', user?.id ?? '').maybeSingle(),
    supabase.from('contributors').select('user_id').eq('user_id', user?.id ?? '').maybeSingle(),
  ])

  if (!admin && !contributor) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-3">
        <h1 className="text-xl font-bold">{d.noPermTitle}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.noPermBody}</p>
        <Link href={lp(locale, '/points')} className="text-sm text-primary underline">
          {t(locale).list.title}
        </Link>
      </main>
    )
  }

  const { data } = await supabase
    .from('feedback')
    .select(
      'id, kind, target, target_label, field, message, suggestion, status, admin_note, created_at, points (code, slug, name_th, name_en)'
    )
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (data ?? []) as unknown as Row[]

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Flag size={19} className="text-accent" /> {d.myTitle}
        </h1>
        {admin && (
          <Link href={lp(locale, '/admin/feedback')} className="text-sm text-primary underline">
            {d.heading}
          </Link>
        )}
      </header>

      {rows.length === 0 ? (
        <div className="card p-6 text-center text-sm text-muted">{d.emptyMine}</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="card p-4 space-y-2.5">
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

              {(r.points || r.target) && (
                <Link
                  href={lp(locale, r.points ? `/points/${r.points.slug}` : r.target!)}
                  className="text-sm font-semibold text-primary"
                >
                  {r.points
                    ? `${r.points.code} ${pick(locale, r.points.name_th, r.points.name_en)}`
                    : (r.target_label ?? r.target)}
                </Link>
              )}

              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{r.message}</p>

              {r.suggestion && (
                <p className="text-sm leading-relaxed text-muted whitespace-pre-wrap">
                  {d.suggests}: {r.suggestion}
                </p>
              )}

              {r.admin_note && (
                <div className="rounded-xl border border-primary/25 bg-primary-soft/40 p-3">
                  <p className="text-xs font-medium text-primary mb-1">{d.adminReply}</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.admin_note}</p>
                </div>
              )}

              {r.status === 'open' && (
                <form action={withdrawFeedback}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <button className="text-xs text-accent hover:underline">{d.withdraw}</button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

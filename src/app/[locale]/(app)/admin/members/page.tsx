import Link from 'next/link'
import type { Metadata } from 'next'
import { ShieldCheck, UserCheck, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { grantContributor, revokeContributor, saveContributorNote } from './actions'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).members.title, robots: { index: false, follow: false } }
}

type Member = {
  user_id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  last_seen_at: string | null
  admin: boolean
  contributor: boolean
  feedback_count: number
  photo_count: number
}

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale).members
  const { q } = await searchParams

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

  const [{ data: rows }, { data: notes }] = await Promise.all([
    supabase.rpc('list_members', { q: q ?? null, lim: 300 }),
    supabase.from('contributors').select('user_id, note, created_at'),
  ])

  const members = (rows ?? []) as Member[]
  const noteOf = new Map((notes ?? []).map((n) => [n.user_id, n.note as string | null]))
  const fmt = (v: string | null) =>
    v ? new Date(v).toLocaleDateString(locale === 'en' ? 'en-GB' : 'th-TH') : d.never

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted">
        <Link href={lp(locale, '/admin')} className="hover:text-primary">
          {t(locale).admin.title}
        </Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users size={19} className="text-primary" /> {d.heading}
        </h1>
        <p className="text-sm text-muted">{d.count(members.length)}</p>
      </header>

      <div className="card p-3.5 space-y-1.5 bg-primary-soft/40">
        <p className="text-sm leading-relaxed">{d.helperIntro}</p>
        <p className="text-xs text-muted leading-relaxed">{d.adminHint}</p>
      </div>

      <form className="flex gap-2">
        <input type="hidden" name="locale" value={locale} />
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder={d.searchPlaceholder}
          className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        <button className="h-11 px-4 rounded-full bg-primary text-white text-sm font-medium">
          {d.search}
        </button>
      </form>

      {members.length === 0 ? (
        <div className="card p-6 text-center text-sm text-muted">{d.empty}</div>
      ) : (
        <div className="space-y-2.5">
          {members.map((m) => (
            <article key={m.user_id} className="card p-3.5 space-y-3">
              <div className="flex items-start gap-3">
                {m.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={m.avatar_url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-border shrink-0 object-cover"
                  />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-primary-soft text-primary shrink-0 inline-flex items-center justify-center text-sm font-bold">
                    {(m.full_name ?? m.email ?? '?').slice(0, 1).toUpperCase()}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {m.full_name ?? m.email ?? m.user_id.slice(0, 8)}
                    {m.user_id === user?.id && (
                      <span className="ml-1.5 text-xs font-normal text-muted">({d.you})</span>
                    )}
                  </p>
                  <p className="text-xs text-muted truncate">{m.email}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {d.joined} {fmt(m.created_at)} · {d.lastSeen} {fmt(m.last_seen_at)}
                  </p>
                  <p className="text-xs text-muted">{d.stats(m.feedback_count, m.photo_count)}</p>
                </div>

                <span
                  className={`chip shrink-0 ${
                    m.admin
                      ? 'text-primary border-primary/30'
                      : m.contributor
                        ? 'text-accent border-accent/30'
                        : ''
                  }`}
                >
                  {m.admin ? (
                    <>
                      <ShieldCheck size={12} className="inline -mt-0.5 mr-1" />
                      {d.roleAdmin}
                    </>
                  ) : m.contributor ? (
                    <>
                      <UserCheck size={12} className="inline -mt-0.5 mr-1" />
                      {d.roleContributor}
                    </>
                  ) : (
                    d.roleMember
                  )}
                </span>
              </div>

              {!m.admin &&
                (m.contributor ? (
                  <div className="flex flex-wrap gap-2">
                    <form action={saveContributorNote} className="flex gap-2 flex-1 min-w-48">
                      <input type="hidden" name="user_id" value={m.user_id} />
                      <input type="hidden" name="locale" value={locale} />
                      <input
                        name="note"
                        defaultValue={noteOf.get(m.user_id) ?? ''}
                        maxLength={200}
                        placeholder={d.notePlaceholder}
                        className="flex-1 h-10 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
                      />
                      <button className="h-10 px-3 rounded-full border border-border text-muted text-xs font-medium">
                        {d.saveNote}
                      </button>
                    </form>
                    <form action={revokeContributor}>
                      <input type="hidden" name="user_id" value={m.user_id} />
                      <input type="hidden" name="locale" value={locale} />
                      <button className="h-10 px-4 rounded-full border border-accent/30 text-accent text-sm font-medium active:scale-95 transition">
                        {d.revoke}
                      </button>
                    </form>
                  </div>
                ) : (
                  <form action={grantContributor} className="flex flex-wrap gap-2">
                    <input type="hidden" name="user_id" value={m.user_id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      name="note"
                      maxLength={200}
                      placeholder={d.notePlaceholder}
                      className="flex-1 min-w-48 h-10 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
                    />
                    <button className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition">
                      <UserCheck size={15} /> {d.grant}
                    </button>
                  </form>
                ))}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

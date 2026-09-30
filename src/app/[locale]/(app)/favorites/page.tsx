import Link from 'next/link'
import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import PointCard from '@/components/PointCard'
import { createClient } from '@/lib/supabase/server'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'
import type { Point } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).fav.title, robots: { index: false, follow: false } }
}

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)

  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('favorites')
    .select('created_at, points (*)')
    .order('created_at', { ascending: false })

  const { data: notes } = await supabase.from('notes').select('point_id, body')
  const noteMap = new Map((notes ?? []).map((n) => [n.point_id, n.body]))

  const points = ((rows ?? []) as unknown as { points: Point }[])
    .map((r) => r.points)
    .filter(Boolean)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart size={19} className="text-accent" /> {d.fav.title}
        </h1>
        <p className="text-sm text-muted">
          {points.length ? d.fav.count(points.length) : d.fav.none}
        </p>
      </header>

      {points.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <p className="font-medium">{d.fav.emptyTitle}</p>
          <p className="text-sm text-muted leading-relaxed">{d.fav.emptyBody}</p>
          <Link href={lp(locale, '/points')} className="inline-block text-sm text-primary font-medium">
            {d.fav.emptyLink}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {points.map((p) => (
            <PointCard key={p.id} point={p} note={noteMap.get(p.id) ?? null} locale={locale} />
          ))}
        </div>
      )}

      <div className="card p-4">
        <h2 className="font-semibold mb-1">{d.fav.protoTitle}</h2>
        <p className="text-sm text-muted leading-relaxed mb-2">{d.fav.protoBody}</p>
        <Link href={lp(locale, '/protocols')} className="text-sm text-primary font-medium">
          {d.fav.protoLink}
        </Link>
      </div>
    </main>
  )
}

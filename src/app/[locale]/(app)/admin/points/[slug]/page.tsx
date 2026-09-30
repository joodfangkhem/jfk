import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PointEditor from '@/components/PointEditor'
import PointGalleryManager from '@/components/PointGalleryManager'
import VerifyToggle from '@/components/VerifyToggle'
import { isLocale, lp, pick, t, type Locale } from '@/lib/i18n'
import type { Point } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).admin.editTitle, robots: { index: false, follow: false } }
}

export default async function AdminPointPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
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

  const { data: point } = await supabase.from('points').select('*').eq('slug', slug).maybeSingle()
  if (!point) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href={lp(locale, '/admin')} className="hover:text-primary">{d.admin.title}</Link>
        <span>/</span>
        <Link href={lp(locale, `/points/${point.slug}`)} className="hover:text-primary">
          {d.admin.viewLive}
        </Link>
      </nav>
      <h1 className="text-xl font-bold">
        {d.admin.editHeading} <span className="text-primary">{point.code}</span>{' '}
        {pick(locale, point.name_th, point.name_en)}
      </h1>
      <VerifyToggle
        pointId={point.id}
        verified={point.verified}
        source={point.verified_source}
        locale={locale}
      />
      <PointGalleryManager pointId={point.id} slug={point.slug} locale={locale} />
      <PointEditor point={point as Point} locale={locale} />
    </main>
  )
}

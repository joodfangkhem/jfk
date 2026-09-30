import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import PointCard from '@/components/PointCard'
import { getMeridian, getMeridians, getPointsByMeridian } from '@/lib/queries'
import { ELEMENT_LABEL_I18N, isLocale, lp, pick, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateStaticParams() {
  const meridians = await getMeridians()
  return meridians.flatMap((m) => [
    { locale: 'th', slug: m.slug },
    { locale: 'en', slug: m.slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const m = await getMeridian(slug)
  if (!m) return { title: locale === 'en' ? 'Meridian not found' : 'ไม่พบเส้นลมปราณนี้' }
  const name = locale === 'en' ? m.name_en : m.name_th
  return {
    title:
      locale === 'en' ? `${name} (${m.code}) — points on the channel` : `${name} (${m.code}) — จุดบนเส้น`,
    description:
      pick(locale, m.summary_th, m.summary_en) ||
      (locale === 'en' ? `Acupuncture points on the ${name} in dogs and cats` : `จุดฝังเข็มบน${name}ในสุนัขและแมว`),
    alternates: {
      canonical: lp(locale, `/meridians/${m.slug}`),
      languages: altLanguages(`/meridians/${m.slug}`),
    },
  }
}

export default async function MeridianPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const meridian = await getMeridian(slug)
  if (!meridian) notFound()

  const points = await getPointsByMeridian(meridian.code)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href={lp(locale, '/')} className="hover:text-primary">{d.point.home}</Link>
        <span>/</span>
        <Link href={lp(locale, '/meridians')} className="hover:text-primary">{d.meridian.title}</Link>
      </nav>

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 h-11 px-3 inline-flex items-center rounded-xl bg-primary text-white font-bold">
            {meridian.code}
          </span>
          <div>
            <h1 className="text-xl font-bold leading-snug">
              {locale === 'en' ? meridian.name_en : meridian.name_th}
            </h1>
            <p className="text-sm text-muted">
              {[locale === 'en' ? meridian.name_th : meridian.name_en, meridian.name_pinyin, meridian.name_zh]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meridian.element && <span className="chip">{ELEMENT_LABEL_I18N[locale][meridian.element] ?? meridian.element}</span>}
          {meridian.yin_yang && (
            <span className="chip">
              {meridian.yin_yang === 'yin' ? d.meridian.yin : meridian.yin_yang === 'yang' ? d.meridian.yang : d.meridian.extra}
            </span>
          )}
          {meridian.point_count && <span className="chip">{d.meridian.total} {meridian.point_count} {d.meridian.points}</span>}
          {meridian.peak_time && <span className="chip">{d.meridian.peak} {meridian.peak_time}</span>}
        </div>
        {pick(locale, meridian.summary_th, meridian.summary_en) && (
          <p className="text-[15px] leading-relaxed text-text/85">
            {pick(locale, meridian.summary_th, meridian.summary_en)}
          </p>
        )}
      </header>

      <section>
        <h2 className="text-lg font-bold mb-3">
          {d.meridian.onThis} ({points.length})
        </h2>
        {points.length === 0 ? (
          <p className="text-sm text-muted">{locale === 'en' ? 'No points for this channel yet.' : 'ยังไม่มีจุดของเส้นนี้ในฐานข้อมูล'}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {points.map((p) => (
              <PointCard key={p.id} point={p} locale={locale} />
            ))}
          </div>
        )}
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST} label={d.ad} />
    </main>
  )
}

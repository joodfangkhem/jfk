import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import PointCard from '@/components/PointCard'
import { getCondition, getConditionPoints, getConditions } from '@/lib/queries'
import { CATEGORY_LABEL_I18N, SPECIES_LABEL_I18N, isLocale, lp, pick, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateStaticParams() {
  const conditions = await getConditions()
  return conditions.flatMap((c) => [
    { locale: 'th', slug: c.slug },
    { locale: 'en', slug: c.slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const c = await getCondition(slug)
  if (!c) return { title: locale === 'en' ? 'Condition not found' : 'ไม่พบอาการนี้' }
  const name = locale === 'en' && c.name_en ? c.name_en : c.name_th
  return {
    title: locale === 'en' ? `Acupuncture for ${name} — points used` : `ฝังเข็มสำหรับ${name} — จุดที่ใช้`,
    description:
      pick(locale, c.summary_th, c.summary_en) ||
      (locale === 'en'
        ? `Acupuncture points used for ${name} in dogs and cats`
        : `จุดฝังเข็มที่ใช้กับ${name}ในสุนัขและแมว`),
    alternates: {
      canonical: lp(locale, `/conditions/${c.slug}`),
      languages: altLanguages(`/conditions/${c.slug}`),
    },
  }
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const condition = await getCondition(slug)
  if (!condition) notFound()

  const rows = await getConditionPoints(condition.id)
  const primary = rows.filter((r) => r.role === 'primary')
  const secondary = rows.filter((r) => r.role !== 'primary')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href={lp(locale, '/')} className="hover:text-primary">{d.point.home}</Link>
        <span>/</span>
        <Link href={lp(locale, '/conditions')} className="hover:text-primary">{d.nav.conditions}</Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-xl font-bold leading-snug">
          {locale === 'en' && condition.name_en ? condition.name_en : condition.name_th}
        </h1>
        <p className="text-sm text-muted">{locale === 'en' ? condition.name_th : condition.name_en}</p>
        <div className="flex flex-wrap gap-1.5">
          {condition.category && <span className="chip">{CATEGORY_LABEL_I18N[locale][condition.category] ?? condition.category}</span>}
          {condition.species.map((s) => (
            <span key={s} className="chip">{SPECIES_LABEL_I18N[locale][s] ?? s}</span>
          ))}
        </div>
        {pick(locale, condition.summary_th, condition.summary_en) && (
          <p className="text-[15px] leading-relaxed text-text/85">
            {pick(locale, condition.summary_th, condition.summary_en)}
          </p>
        )}
      </header>

      {pick(locale, condition.detail_th, condition.detail_en) && (
        <section className="card p-4">
          <h2 className="font-semibold mb-2">{d.condition.approach}</h2>
          <p className="text-[15px] leading-relaxed">
            {pick(locale, condition.detail_th, condition.detail_en)}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold mb-3">{d.condition.primary} ({primary.length})</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {primary.map((r) => (
            <PointCard key={r.points.id} point={r.points} note={pick(locale, r.note_th, r.note_en)} locale={locale} />
          ))}
        </div>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONDITION} label={d.ad} />

      {secondary.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">{d.condition.secondary} ({secondary.length})</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {secondary.map((r) => (
              <PointCard key={r.points.id} point={r.points} note={pick(locale, r.note_th, r.note_en)} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-muted leading-relaxed">{d.condition.note}</p>
    </main>
  )
}

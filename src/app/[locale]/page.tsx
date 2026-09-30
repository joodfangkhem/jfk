import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import SearchBox from '@/components/SearchBox'
import PointCard from '@/components/PointCard'
import AdSlot from '@/components/AdSlot'
import { getCommonPoints, getConditions, getMeridians } from '@/lib/queries'
import { CATEGORY_LABEL_I18N, ELEMENT_LABEL_I18N, isLocale, lp, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return {
    alternates: { canonical: lp(locale, '/'), languages: altLanguages('/') },
    title:
      locale === 'en'
        ? 'JFK — Veterinary Acupuncture Point Reference'
        : 'JFK จุดฝังเข็ม — คู่มือจุดฝังเข็มในสัตว์',
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)

  const [common, meridians, conditions] = await Promise.all([
    getCommonPoints(12),
    getMeridians(),
    getConditions(),
  ])

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      <section className="text-center space-y-4 pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug">{d.home.title}</h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          {d.home.sub} <code className="text-primary">BL-23</code>,{' '}
          <code className="text-primary">Bai Hui</code>,{' '}
          <code className="text-primary">{locale === 'en' ? 'back pain' : 'ปวดหลัง'}</code>,{' '}
          <code className="text-primary">{locale === 'en' ? 'vomiting' : 'อาเจียน'}</code>
        </p>
        <div className="max-w-xl mx-auto">
          <Suspense fallback={<div className="h-14" />}>
            <SearchBox size="lg" locale={locale} />
          </Suspense>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href={lp(locale, '/points?species=dog')} className="chip hover:border-primary hover:text-primary">{d.home.dog}</Link>
          <Link href={lp(locale, '/points?species=cat')} className="chip hover:border-primary hover:text-primary">{d.home.cat}</Link>
          <Link href={lp(locale, '/points')} className="chip hover:border-primary hover:text-primary">{d.home.all}</Link>
          <Link href={lp(locale, '/guide')} className="chip hover:border-primary hover:text-primary">{d.home.cun}</Link>
        </div>
      </section>

      <section>
        <SectionHead title={d.home.common} href={lp(locale, '/points')} linkLabel={d.home.seeAll} />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {common.map((p) => (
            <PointCard key={p.id} point={p} locale={locale} />
          ))}
        </div>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} label={d.ad} />

      <section>
        <SectionHead title={d.home.byCondition} href={lp(locale, '/conditions')} linkLabel={d.home.seeAll} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {conditions.slice(0, 12).map((c) => (
            <Link
              key={c.id}
              href={lp(locale, `/conditions/${c.slug}`)}
              className="card p-3 hover:border-primary/50 active:scale-[0.99] transition"
            >
              <p className="font-semibold text-sm leading-snug">
                {locale === 'en' && c.name_en ? c.name_en : c.name_th}
              </p>
              <p className="text-[11px] text-muted mt-1">
                {c.category ? CATEGORY_LABEL_I18N[locale][c.category] ?? c.category : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title={d.home.byMeridian} href={lp(locale, '/meridians')} linkLabel={d.home.seeAll} />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {meridians.map((m) => (
            <Link
              key={m.code}
              href={lp(locale, `/meridians/${m.slug}`)}
              className="card p-3 flex items-center gap-3 hover:border-primary/50 active:scale-[0.99] transition"
            >
              <span className="shrink-0 w-11 h-11 rounded-xl bg-primary-soft text-primary font-bold text-sm inline-flex items-center justify-center">
                {m.code}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {locale === 'en' ? m.name_en : m.name_th}
                </p>
                <p className="text-[11px] text-muted truncate">
                  {locale === 'en' ? m.name_pinyin : m.name_en}
                  {m.element ? ` · ${ELEMENT_LABEL_I18N[locale][m.element] ?? m.element}` : ''}
                  {m.point_count ? ` · ${m.point_count} ${d.meridian.points}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-4 bg-warn-soft border-warn/25">
        <h2 className="font-semibold flex items-center gap-2 text-warn mb-1.5">
          <Info size={17} /> {d.home.warnTitle}
        </h2>
        <p className="text-sm leading-relaxed text-text/80">{d.home.warnBody}</p>
      </section>
    </main>
  )
}

function SectionHead({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h2 className="text-lg font-bold">{title}</h2>
      <Link href={href} className="text-sm text-primary font-medium inline-flex items-center gap-1">
        {linkLabel} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

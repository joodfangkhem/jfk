import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AlertTriangle, MapPin, Sparkles, Syringe } from 'lucide-react'
import AdSlot from '@/components/AdSlot'
import AdminEditButton from '@/components/AdminEditButton'
import FavoriteButton from '@/components/FavoriteButton'
import NoteBox from '@/components/NoteBox'
import PointCard from '@/components/PointCard'
import PhotoSubmit from '@/components/PhotoSubmit'
import PointGallery from '@/components/PointGallery'
import {
  getAllPoints,
  getMeridians,
  getPoint,
  getPointConditions,
  getPointImages,
  getRelatedPoints,
} from '@/lib/queries'
import { SPECIES_LABEL_I18N, isLocale, lp, pick, pickArr, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateStaticParams() {
  const points = await getAllPoints()
  return points.flatMap((p) => [
    { locale: 'th', slug: p.slug },
    { locale: 'en', slug: p.slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const point = await getPoint(slug)
  if (!point) return { title: locale === 'en' ? 'Point Not Found' : 'ไม่พบจุดนี้' }

  const localName = locale === 'en' ? point.name_en : point.name_th
  const name = [point.code, localName, point.name_pinyin].filter(Boolean).join(' ')
  const tail = locale === 'en' ? 'Veterinary Acupuncture Point' : 'จุดฝังเข็มในสัตว์'
  const desc = (
    locale === 'en'
      ? `Location: ${pick(locale, point.location_th, point.location_en)} ${pick(locale, point.functions_th, point.functions_en)} Indications: ${pickArr(locale, point.indications, point.indications_en).slice(0, 6).join(', ')}`
      : `ตำแหน่ง ${point.location_th} ${point.functions_th ?? ''} ข้อบ่งใช้: ${point.indications.slice(0, 6).join(', ')}`
  ).slice(0, 300)

  return {
    title: `${name} — ${tail}`,
    description: desc,
    alternates: {
      canonical: lp(locale, `/points/${point.slug}`),
      languages: altLanguages(`/points/${point.slug}`),
    },
    openGraph: { title: `${name} — ${tail}`, description: desc },
  }
}

export default async function PointPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const point = await getPoint(slug)
  if (!point) notFound()

  const [meridians, conditions, related, images] = await Promise.all([
    getMeridians(),
    getPointConditions(point.id),
    getRelatedPoints(point.id),
    getPointImages(point.id),
  ])
  const meridian = meridians.find((m) => m.code === point.meridian_code)

  const localName = locale === 'en' ? point.name_en : point.name_th
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${point.code} ${localName ?? ''} — ${locale === 'en' ? 'veterinary acupuncture point' : 'จุดฝังเข็มในสัตว์'}`,
    inLanguage: locale,
    about: pickArr(locale, point.indications, point.indications_en),
    description: pick(locale, point.location_th, point.location_en),
    articleSection: locale === 'en' ? meridian?.name_en : meridian?.name_th,
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // escape < เพื่อกันข้อความอย่าง </script> ในข้อมูลจุดหลุดออกจาก tag
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* breadcrumb */}
      <nav className="text-xs text-muted flex items-center gap-1.5 flex-wrap">
        <Link href={lp(locale, '/')} className="hover:text-primary">{d.point.home}</Link>
        <span>/</span>
        <Link href={lp(locale, '/points')} className="hover:text-primary">{d.nav.points}</Link>
        {meridian && (
          <>
            <span>/</span>
            <Link href={lp(locale, `/meridians/${meridian.slug}`)} className="hover:text-primary">
              {locale === 'en' ? meridian.name_en : meridian.name_th}
            </Link>
          </>
        )}
      </nav>

      {/* หัวเรื่อง */}
      <header className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="shrink-0 h-11 px-3 inline-flex items-center rounded-xl bg-primary text-white font-bold">
            {point.code}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-snug">
              {localName || point.name_pinyin || point.code}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              {[point.name_pinyin, point.name_zh, locale === 'en' ? point.name_th : point.name_en]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {meridian && (
            <Link href={lp(locale, `/meridians/${meridian.slug}`)} className="chip hover:border-primary hover:text-primary">
              {locale === 'en' ? meridian.name_en : meridian.name_th}
            </Link>
          )}
          {point.is_common && <span className="chip bg-accent-soft text-accent border-accent/20">{d.point.common}</span>}
          {!point.verified && (
            <span className="chip bg-warn-soft text-warn border-warn/25">{d.point.unverified}</span>
          )}
          {pickArr(locale, point.point_types, point.point_types_en).map((ty) => (
            <span key={ty} className="chip">{ty}</span>
          ))}
          {point.species.map((s) => (
            <span key={s} className="chip">{SPECIES_LABEL_I18N[locale][s] ?? s}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FavoriteButton pointId={point.id} code={point.code} slug={point.slug} locale={locale} />
          <AdminEditButton slug={point.slug} />
        </div>
      </header>

      <PointGallery images={images} code={point.code} nameTh={localName} emptyTitle={d.point.noImage} emptySub={d.point.noImageSub} />

      {/* ตำแหน่ง */}
      {!point.verified && (
        <section className="card p-4 bg-warn-soft border-warn/25">
          <p className="text-sm leading-relaxed text-text/85">
            <strong className="text-warn">{d.point.unverifiedTitle}</strong> {d.point.unverifiedBody}
          </p>
        </section>
      )}

      <section className="card p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <MapPin size={17} className="text-primary" /> {d.point.location}
        </h2>
        <p className="text-[15px] leading-relaxed">{pick(locale, point.location_th, point.location_en)}</p>
        {pick(locale, point.anatomy_th, point.anatomy_en) && (
          <p className="text-sm text-muted mt-2 leading-relaxed">
            <span className="font-medium text-text">{d.point.landmark}:</span>{' '}
            {pick(locale, point.anatomy_th, point.anatomy_en)}
          </p>
        )}
      </section>

      {/* สรรพคุณ + ข้อบ่งใช้ */}
      <section className="card p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <Sparkles size={17} className="text-primary" /> {d.point.functions}
        </h2>
        {pick(locale, point.functions_th, point.functions_en) && (
          <p className="text-[15px] leading-relaxed">{pick(locale, point.functions_th, point.functions_en)}</p>
        )}
        {pickArr(locale, point.indications, point.indications_en).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {pickArr(locale, point.indications, point.indications_en).map((i) => (
              <Link
                key={i}
                href={lp(locale, `/points?q=${encodeURIComponent(i)}`)}
                className="chip hover:border-primary hover:text-primary"
              >
                {i}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* เทคนิค */}
      {pick(locale, point.needle_th, point.needle_en) && (
        <section className="card p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-2">
            <Syringe size={17} className="text-primary" /> {d.point.needle}
          </h2>
          <p className="text-[15px] leading-relaxed">{pick(locale, point.needle_th, point.needle_en)}</p>
        </section>
      )}

      {/* ข้อควรระวัง */}
      {pick(locale, point.caution_th, point.caution_en) && (
        <section className="card p-4 bg-warn-soft border-warn/25">
          <h2 className="font-semibold flex items-center gap-2 mb-2 text-warn">
            <AlertTriangle size={17} /> {d.point.caution}
          </h2>
          <p className="text-[15px] leading-relaxed text-text/85">{pick(locale, point.caution_th, point.caution_en)}</p>
        </section>
      )}

      <NoteBox pointId={point.id} slug={point.slug} locale={locale} />

      <PhotoSubmit
        pointId={point.id}
        slug={point.slug}
        locale={locale}
        hasImage={images.length > 0}
        imageCount={images.length}
      />

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POINT} label={d.ad} />

      {/* อาการที่ใช้จุดนี้ */}
      {conditions.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">{d.point.conditionsUsing}</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {conditions.map((c) => (
              <Link
                key={c.conditions.slug}
                href={lp(locale, `/conditions/${c.conditions.slug}`)}
                className="card p-3 hover:border-primary/50 transition"
              >
                <p className="font-semibold text-sm">
                  {locale === 'en' && c.conditions.name_en ? c.conditions.name_en : c.conditions.name_th}
                </p>
                <p className="text-xs text-muted mt-1">
                  {c.role === 'primary' ? d.point.primary : d.point.secondary}
                  {pick(locale, c.note_th, c.note_en) ? ` · ${pick(locale, c.note_th, c.note_en)}` : ''}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* จุดที่มักใช้ร่วมกัน */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">{d.point.related}</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {related.map((p) => (
              <PointCard key={p.id} point={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

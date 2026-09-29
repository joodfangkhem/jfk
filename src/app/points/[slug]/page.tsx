import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AlertTriangle, MapPin, Sparkles, Syringe } from 'lucide-react'
import AdSlot from '@/components/AdSlot'
import AdminEditButton from '@/components/AdminEditButton'
import FavoriteButton from '@/components/FavoriteButton'
import NoteBox from '@/components/NoteBox'
import PointCard from '@/components/PointCard'
import PointImage from '@/components/PointImage'
import {
  getAllPoints,
  getMeridians,
  getPoint,
  getPointConditions,
  getRelatedPoints,
} from '@/lib/queries'
import { SPECIES_LABEL } from '@/lib/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const points = await getAllPoints()
  return points.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const point = await getPoint(slug)
  if (!point) return { title: 'ไม่พบจุดนี้' }

  const name = [point.code, point.name_th, point.name_pinyin].filter(Boolean).join(' ')
  const desc = `ตำแหน่ง ${point.location_th} ${point.functions_th ?? ''} ข้อบ่งใช้: ${point.indications
    .slice(0, 6)
    .join(', ')}`.slice(0, 300)

  return {
    title: `${name} — จุดฝังเข็มในสัตว์`,
    description: desc,
    alternates: { canonical: `/points/${point.slug}` },
    openGraph: { title: `${name} — จุดฝังเข็มในสัตว์`, description: desc },
  }
}

export default async function PointPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const point = await getPoint(slug)
  if (!point) notFound()

  const [meridians, conditions, related] = await Promise.all([
    getMeridians(),
    getPointConditions(point.id),
    getRelatedPoints(point.id),
  ])
  const meridian = meridians.find((m) => m.code === point.meridian_code)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${point.code} ${point.name_th ?? ''} — จุดฝังเข็มในสัตว์`,
    inLanguage: 'th',
    about: point.indications,
    description: point.location_th,
    articleSection: meridian?.name_th,
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav className="text-xs text-muted flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span>/</span>
        <Link href="/points" className="hover:text-primary">จุดฝังเข็ม</Link>
        {meridian && (
          <>
            <span>/</span>
            <Link href={`/meridians/${meridian.slug}`} className="hover:text-primary">
              {meridian.name_th}
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
              {point.name_th || point.name_pinyin || point.code}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              {[point.name_pinyin, point.name_zh, point.name_en].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {meridian && (
            <Link href={`/meridians/${meridian.slug}`} className="chip hover:border-primary hover:text-primary">
              {meridian.name_th}
            </Link>
          )}
          {point.is_common && <span className="chip bg-accent-soft text-accent border-accent/20">ใช้บ่อย</span>}
          {point.point_types.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
          {point.species.map((s) => (
            <span key={s} className="chip">{SPECIES_LABEL[s] ?? s}</span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FavoriteButton pointId={point.id} code={point.code} />
          <AdminEditButton slug={point.slug} />
        </div>
      </header>

      <PointImage point={point} />

      {/* ตำแหน่ง */}
      <section className="card p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <MapPin size={17} className="text-primary" /> ตำแหน่ง
        </h2>
        <p className="text-[15px] leading-relaxed">{point.location_th}</p>
        {point.anatomy_th && (
          <p className="text-sm text-muted mt-2 leading-relaxed">
            <span className="font-medium text-text">Landmark:</span> {point.anatomy_th}
          </p>
        )}
      </section>

      {/* สรรพคุณ + ข้อบ่งใช้ */}
      <section className="card p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-2">
          <Sparkles size={17} className="text-primary" /> สรรพคุณและข้อบ่งใช้
        </h2>
        {point.functions_th && <p className="text-[15px] leading-relaxed">{point.functions_th}</p>}
        {point.indications.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {point.indications.map((i) => (
              <Link
                key={i}
                href={`/points?q=${encodeURIComponent(i)}`}
                className="chip hover:border-primary hover:text-primary"
              >
                {i}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* เทคนิค */}
      {point.needle_th && (
        <section className="card p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-2">
            <Syringe size={17} className="text-primary" /> เทคนิคการปัก
          </h2>
          <p className="text-[15px] leading-relaxed">{point.needle_th}</p>
        </section>
      )}

      {/* ข้อควรระวัง */}
      {point.caution_th && (
        <section className="card p-4 bg-warn-soft border-warn/25">
          <h2 className="font-semibold flex items-center gap-2 mb-2 text-warn">
            <AlertTriangle size={17} /> ข้อควรระวัง
          </h2>
          <p className="text-[15px] leading-relaxed text-text/85">{point.caution_th}</p>
        </section>
      )}

      <NoteBox pointId={point.id} code={point.code} />

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POINT} />

      {/* อาการที่ใช้จุดนี้ */}
      {conditions.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">อาการที่ใช้จุดนี้</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {conditions.map((c) => (
              <Link
                key={c.conditions.slug}
                href={`/conditions/${c.conditions.slug}`}
                className="card p-3 hover:border-primary/50 transition"
              >
                <p className="font-semibold text-sm">{c.conditions.name_th}</p>
                <p className="text-xs text-muted mt-1">
                  {c.role === 'primary' ? 'จุดหลัก' : 'จุดเสริม'}
                  {c.note_th ? ` · ${c.note_th}` : ''}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* จุดที่มักใช้ร่วมกัน */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">จุดที่มักใช้ร่วมกัน</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {related.map((p) => (
              <PointCard key={p.id} point={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

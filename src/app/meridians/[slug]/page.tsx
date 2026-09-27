import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import PointCard from '@/components/PointCard'
import { getMeridian, getMeridians, getPointsByMeridian } from '@/lib/queries'
import { ELEMENT_LABEL } from '@/lib/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const meridians = await getMeridians()
  return meridians.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const m = await getMeridian(slug)
  if (!m) return { title: 'ไม่พบเส้นลมปราณนี้' }
  return {
    title: `${m.name_th} (${m.code}) — จุดบนเส้น`,
    description: m.summary_th ?? `จุดฝังเข็มบน${m.name_th}ในสุนัขและแมว`,
    alternates: { canonical: `/meridians/${m.slug}` },
  }
}

export default async function MeridianPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meridian = await getMeridian(slug)
  if (!meridian) notFound()

  const points = await getPointsByMeridian(meridian.code)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span>/</span>
        <Link href="/meridians" className="hover:text-primary">เส้นลมปราณ</Link>
      </nav>

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 h-11 px-3 inline-flex items-center rounded-xl bg-primary text-white font-bold">
            {meridian.code}
          </span>
          <div>
            <h1 className="text-xl font-bold leading-snug">{meridian.name_th}</h1>
            <p className="text-sm text-muted">
              {[meridian.name_en, meridian.name_pinyin, meridian.name_zh].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {meridian.element && <span className="chip">{ELEMENT_LABEL[meridian.element] ?? meridian.element}</span>}
          {meridian.yin_yang && (
            <span className="chip">
              {meridian.yin_yang === 'yin' ? 'ยิน' : meridian.yin_yang === 'yang' ? 'หยาง' : 'เส้นพิเศษ'}
            </span>
          )}
          {meridian.point_count && <span className="chip">ทั้งเส้นมี {meridian.point_count} จุด</span>}
          {meridian.peak_time && <span className="chip">ช่วงเวลาเด่น {meridian.peak_time}</span>}
        </div>
        {meridian.summary_th && (
          <p className="text-[15px] leading-relaxed text-text/85">{meridian.summary_th}</p>
        )}
      </header>

      <section>
        <h2 className="text-lg font-bold mb-3">
          จุดบนเส้นนี้ที่รวบรวมไว้ ({points.length})
        </h2>
        {points.length === 0 ? (
          <p className="text-sm text-muted">ยังไม่มีจุดของเส้นนี้ในฐานข้อมูล</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {points.map((p) => (
              <PointCard key={p.id} point={p} />
            ))}
          </div>
        )}
        {meridian.point_count && points.length < meridian.point_count && (
          <p className="text-xs text-muted mt-3 leading-relaxed">
            รวบรวมเฉพาะจุดที่ใช้บ่อยในสัตว์เล็กก่อน ({points.length} จาก {meridian.point_count} จุดของเส้นนี้)
            จะเพิ่มจุดที่เหลือต่อไป
          </p>
        )}
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST} />
    </main>
  )
}

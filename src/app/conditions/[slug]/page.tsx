import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import PointCard from '@/components/PointCard'
import { getCondition, getConditionPoints, getConditions } from '@/lib/queries'
import { CATEGORY_LABEL, SPECIES_LABEL } from '@/lib/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const conditions = await getConditions()
  return conditions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = await getCondition(slug)
  if (!c) return { title: 'ไม่พบอาการนี้' }
  return {
    title: `ฝังเข็มสำหรับ${c.name_th} — จุดที่ใช้`,
    description: c.summary_th ?? `จุดฝังเข็มที่ใช้กับ${c.name_th}ในสุนัขและแมว`,
    alternates: { canonical: `/conditions/${c.slug}` },
  }
}

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const condition = await getCondition(slug)
  if (!condition) notFound()

  const rows = await getConditionPoints(condition.id)
  const primary = rows.filter((r) => r.role === 'primary')
  const secondary = rows.filter((r) => r.role !== 'primary')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span>/</span>
        <Link href="/conditions" className="hover:text-primary">ตามอาการ</Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-xl font-bold leading-snug">{condition.name_th}</h1>
        {condition.name_en && <p className="text-sm text-muted">{condition.name_en}</p>}
        <div className="flex flex-wrap gap-1.5">
          {condition.category && <span className="chip">{CATEGORY_LABEL[condition.category] ?? condition.category}</span>}
          {condition.species.map((s) => (
            <span key={s} className="chip">{SPECIES_LABEL[s] ?? s}</span>
          ))}
        </div>
        {condition.summary_th && (
          <p className="text-[15px] leading-relaxed text-text/85">{condition.summary_th}</p>
        )}
      </header>

      {condition.detail_th && (
        <section className="card p-4">
          <h2 className="font-semibold mb-2">แนวทางการใช้</h2>
          <p className="text-[15px] leading-relaxed">{condition.detail_th}</p>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold mb-3">จุดหลัก ({primary.length})</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {primary.map((r) => (
            <PointCard key={r.points.id} point={r.points} note={r.note_th} />
          ))}
        </div>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONDITION} />

      {secondary.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">จุดเสริม ({secondary.length})</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {secondary.map((r) => (
              <PointCard key={r.points.id} point={r.points} note={r.note_th} />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-muted leading-relaxed">
        ชุดจุดนี้เป็นแนวทางตั้งต้น ไม่ใช่สูตรสำเร็จ — ต้องเลือกจุดตามการวินิจฉัยแยกกลุ่มอาการ (pattern)
        ของสัตว์แต่ละตัว และประเมินผลซ้ำทุกครั้งที่ทำ
      </p>
    </main>
  )
}

import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import SearchBox from '@/components/SearchBox'
import PointCard from '@/components/PointCard'
import AdSlot from '@/components/AdSlot'
import { getCommonPoints, getConditions, getMeridians } from '@/lib/queries'
import { CATEGORY_LABEL, ELEMENT_LABEL } from '@/lib/types'

export const revalidate = 3600

export default async function HomePage() {
  const [common, meridians, conditions] = await Promise.all([
    getCommonPoints(12),
    getMeridians(),
    getConditions(),
  ])

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      {/* hero */}
      <section className="text-center space-y-4 pt-2">
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
          จุดฝังเข็มในสัตว์ ค้นได้ในสามวินาที
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          พิมพ์รหัสจุด ชื่อจีน หรืออาการที่เจอในคลินิก — เช่น <code className="text-primary">BL-23</code>,{' '}
          <code className="text-primary">Bai Hui</code>, <code className="text-primary">ปวดหลัง</code>,{' '}
          <code className="text-primary">อาเจียน</code>
        </p>
        <div className="max-w-xl mx-auto">
          <Suspense fallback={<div className="h-14" />}>
            <SearchBox size="lg" />
          </Suspense>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/points?species=dog" className="chip hover:border-primary hover:text-primary">สุนัข</Link>
          <Link href="/points?species=cat" className="chip hover:border-primary hover:text-primary">แมว</Link>
          <Link href="/points" className="chip hover:border-primary hover:text-primary">จุดทั้งหมด</Link>
          <Link href="/guide" className="chip hover:border-primary hover:text-primary">cun วัดยังไง</Link>
        </div>
      </section>

      {/* จุดที่ใช้บ่อย */}
      <section>
        <SectionHead title="จุดที่ใช้บ่อยในสัตว์เล็ก" href="/points" linkLabel="ดูทั้งหมด" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {common.map((p) => (
            <PointCard key={p.id} point={p} />
          ))}
        </div>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />

      {/* ตามอาการ */}
      <section>
        <SectionHead title="เลือกตามอาการที่เจอ" href="/conditions" linkLabel="ดูทั้งหมด" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {conditions.slice(0, 12).map((c) => (
            <Link
              key={c.id}
              href={`/conditions/${c.slug}`}
              className="card p-3 hover:border-primary/50 active:scale-[0.99] transition"
            >
              <p className="font-semibold text-sm leading-snug">{c.name_th}</p>
              <p className="text-[11px] text-muted mt-1">
                {c.category ? CATEGORY_LABEL[c.category] ?? c.category : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* เส้นลมปราณ */}
      <section>
        <SectionHead title="ไล่ตามเส้นลมปราณ" href="/meridians" linkLabel="ดูทั้งหมด" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {meridians.map((m) => (
            <Link
              key={m.code}
              href={`/meridians/${m.slug}`}
              className="card p-3 flex items-center gap-3 hover:border-primary/50 active:scale-[0.99] transition"
            >
              <span className="shrink-0 w-11 h-11 rounded-xl bg-primary-soft text-primary font-bold text-sm inline-flex items-center justify-center">
                {m.code}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{m.name_th}</p>
                <p className="text-[11px] text-muted truncate">
                  {m.name_en}
                  {m.element ? ` · ${ELEMENT_LABEL[m.element] ?? m.element}` : ''}
                  {m.point_count ? ` · ${m.point_count} จุด` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* คำเตือน */}
      <section className="card p-4 bg-warn-soft border-warn/25">
        <h2 className="font-semibold flex items-center gap-2 text-warn mb-1.5">
          <Info size={17} /> อ่านก่อนใช้งาน
        </h2>
        <p className="text-sm leading-relaxed text-text/80">
          ข้อมูลในเว็บนี้เป็นคู่มืออ้างอิงเพื่อการศึกษา ตำแหน่งจุดอ้างอิงระบบ transpositional
          ในสุนัขและแมว ซึ่งแต่ละตำราอาจคลาดเคลื่อนกันเล็กน้อย — ควรคลำยืนยัน landmark จริงทุกครั้ง
          การฝังเข็มในสัตว์ต้องทำโดยสัตวแพทย์ที่ผ่านการอบรม และต้องวินิจฉัยโรคตามหลักการแพทย์แผนปัจจุบันควบคู่ไปด้วย
        </p>
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

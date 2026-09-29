import Link from 'next/link'
import type { Metadata } from 'next'
import { getMeridians } from '@/lib/queries'
import { ELEMENT_LABEL } from '@/lib/types'

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: '/meridians' },
  title: 'เส้นลมปราณทั้ง 14 เส้น',
  description:
    'รายชื่อเส้นลมปราณที่ใช้ในการฝังเข็มสัตว์ พร้อมธาตุ ยิน-หยาง ช่วงเวลาที่เส้นทำงานเด่น และจุดบนเส้นแต่ละเส้น',
}

export default async function MeridiansPage() {
  const meridians = await getMeridians()

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">เส้นลมปราณ</h1>
        <p className="text-sm text-muted leading-relaxed">
          12 เส้นหลัก + เส้นเริ่น (CV) และเส้นตู (GV) รวมถึงจุดคลาสสิกในสัตว์ที่ไม่ได้อยู่บนเส้นหลัก
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {meridians.map((m) => (
          <Link
            key={m.code}
            href={`/meridians/${m.slug}`}
            className="card p-4 hover:border-primary/50 active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-12 h-12 rounded-xl bg-primary-soft text-primary font-bold inline-flex items-center justify-center">
                {m.code}
              </span>
              <div className="min-w-0">
                <p className="font-semibold leading-snug">{m.name_th}</p>
                <p className="text-xs text-muted truncate">
                  {m.name_en}
                  {m.name_zh ? ` · ${m.name_zh}` : ''}
                </p>
              </div>
            </div>
            {m.summary_th && (
              <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-2">{m.summary_th}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {m.element && <span className="chip">{ELEMENT_LABEL[m.element] ?? m.element}</span>}
              {m.yin_yang && (
                <span className="chip">
                  {m.yin_yang === 'yin' ? 'ยิน' : m.yin_yang === 'yang' ? 'หยาง' : 'เส้นพิเศษ'}
                </span>
              )}
              {m.point_count && <span className="chip">{m.point_count} จุด</span>}
              {m.peak_time && <span className="chip">{m.peak_time}</span>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

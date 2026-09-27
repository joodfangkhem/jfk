import Link from 'next/link'
import type { Metadata } from 'next'
import { getConditions } from '@/lib/queries'
import { CATEGORY_LABEL } from '@/lib/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'เลือกจุดตามอาการ',
  description:
    'จุดฝังเข็มที่ใช้บ่อยตามอาการในสุนัขและแมว เช่น หมอนรองกระดูกเคลื่อน ขาหลังอ่อนแรง ข้อเสื่อม อาเจียน ท้องเสีย ชัก ผิวหนังคัน',
}

export default async function ConditionsPage() {
  const conditions = await getConditions()
  const groups = new Map<string, typeof conditions>()
  for (const c of conditions) {
    const key = c.category ?? 'other'
    groups.set(key, [...(groups.get(key) ?? []), c])
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">เลือกจุดตามอาการ</h1>
        <p className="text-sm text-muted leading-relaxed">
          ชุดจุดที่ใช้บ่อยตามอาการที่เจอในคลินิก แยกจุดหลักกับจุดเสริม พร้อมข้อควรระวังรายอาการ
        </p>
      </header>

      {[...groups.entries()].map(([cat, items]) => (
        <section key={cat}>
          <h2 className="text-base font-bold mb-2.5">{CATEGORY_LABEL[cat] ?? cat}</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {items.map((c) => (
              <Link
                key={c.id}
                href={`/conditions/${c.slug}`}
                className="card p-3.5 hover:border-primary/50 active:scale-[0.99] transition"
              >
                <p className="font-semibold leading-snug">{c.name_th}</p>
                {c.name_en && <p className="text-[11px] text-muted mt-0.5">{c.name_en}</p>}
                {c.summary_th && (
                  <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">{c.summary_th}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}

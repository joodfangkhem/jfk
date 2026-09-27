import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'
import PointCard from '@/components/PointCard'
import AdSlot from '@/components/AdSlot'
import { getMeridians, searchPoints } from '@/lib/queries'
import { SPECIES_LABEL } from '@/lib/types'

export const metadata: Metadata = {
  title: 'ค้นหาจุดฝังเข็ม',
  description:
    'ค้นหาจุดฝังเข็มในสัตว์จากรหัสจุด ชื่อจีน ชื่อไทย ตำแหน่ง หรืออาการ กรองตามชนิดสัตว์และเส้นลมปราณได้',
}

type SP = { q?: string; species?: string; meridian?: string }

export default async function PointsPage({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  const sp = await searchParams
  const q = sp.q ?? ''
  const [points, meridians] = await Promise.all([
    searchPoints(q, { species: sp.species, meridian: sp.meridian, limit: 120 }),
    getMeridians(),
  ])

  const buildHref = (patch: Partial<SP>) => {
    const next = new URLSearchParams()
    const merged = { ...sp, ...patch }
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v)
    return `/points${next.toString() ? `?${next}` : ''}`
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold">ค้นหาจุดฝังเข็ม</h1>

      <Suspense fallback={<div className="h-11" />}>
        <SearchBox autoFocus={!q} />
      </Suspense>

      {/* กรอง */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip href={buildHref({ species: undefined })} active={!sp.species}>
            ทุกชนิด
          </FilterChip>
          {['dog', 'cat'].map((s) => (
            <FilterChip key={s} href={buildHref({ species: s })} active={sp.species === s}>
              {SPECIES_LABEL[s]}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip href={buildHref({ meridian: undefined })} active={!sp.meridian}>
            ทุกเส้น
          </FilterChip>
          {meridians.map((m) => (
            <FilterChip key={m.code} href={buildHref({ meridian: m.code })} active={sp.meridian === m.code}>
              {m.code}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        {q ? (
          <>
            ผลค้นหา <span className="text-text font-medium">{q}</span> — {points.length} จุด
          </>
        ) : (
          <>ทั้งหมด {points.length} จุด (เรียงตามความถี่ที่ใช้)</>
        )}
      </p>

      {points.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <p className="font-medium">ไม่พบจุดที่ตรงกับคำค้นนี้</p>
          <p className="text-sm text-muted leading-relaxed">
            ลองพิมพ์รหัสจุด (BL-23), ชื่อพินอิน (Bai Hui), หรืออาการเป็นภาษาไทย (ปวดหลัง / อาเจียน / คัน)
          </p>
          <Link href="/conditions" className="inline-block text-sm text-primary font-medium">
            หรือเลือกจากรายการอาการ →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {points.map((p) => (
            <PointCard key={p.id} point={p} />
          ))}
        </div>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST} />
    </main>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition ${
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-surface text-muted border-border hover:border-primary/50 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  )
}

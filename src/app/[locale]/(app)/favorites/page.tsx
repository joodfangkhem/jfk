import Link from 'next/link'
import type { Metadata } from 'next'
import { Heart } from 'lucide-react'
import PointCard from '@/components/PointCard'
import { createClient } from '@/lib/supabase/server'
import type { Point } from '@/lib/types'

export const metadata: Metadata = {
  title: 'จุดที่บันทึกไว้',
  robots: { index: false, follow: false },
}

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('favorites')
    .select('created_at, points (*)')
    .order('created_at', { ascending: false })

  const { data: notes } = await supabase.from('notes').select('point_id, body')
  const noteMap = new Map((notes ?? []).map((n) => [n.point_id, n.body]))

  const points = ((rows ?? []) as unknown as { points: Point }[])
    .map((r) => r.points)
    .filter(Boolean)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart size={19} className="text-accent" /> จุดที่บันทึกไว้
        </h1>
        <p className="text-sm text-muted">
          {points.length ? `${points.length} จุด` : 'ยังไม่มีจุดที่บันทึก'}
        </p>
      </header>

      {points.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <p className="font-medium">ยังไม่ได้บันทึกจุดไหนไว้</p>
          <p className="text-sm text-muted leading-relaxed">
            เปิดหน้าจุดที่ใช้บ่อย แล้วกดปุ่ม “บันทึกจุดนี้” ไว้ จะกลับมาเปิดซ้ำได้เร็วขึ้น
          </p>
          <Link href="/points" className="inline-block text-sm text-primary font-medium">
            ไปหน้าค้นหาจุด →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {points.map((p) => (
            <PointCard key={p.id} point={p} note={noteMap.get(p.id) ?? null} />
          ))}
        </div>
      )}

      <div className="card p-4">
        <h2 className="font-semibold mb-1">ชุดจุดของฉัน</h2>
        <p className="text-sm text-muted leading-relaxed mb-2">
          จัดกลุ่มจุดเป็นชุด (protocol) สำหรับเคสที่ทำซ้ำบ่อย เช่น ชุด IVDD หรือชุดแมวไตเรื้อรัง
        </p>
        <Link href="/protocols" className="text-sm text-primary font-medium">
          จัดการชุดจุด →
        </Link>
      </div>
    </main>
  )
}

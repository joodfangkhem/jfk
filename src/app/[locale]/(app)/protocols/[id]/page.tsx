import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { addPointToProtocol, deleteProtocol, removePointFromProtocol } from '../actions'
import type { Point } from '@/lib/types'
import { SPECIES_LABEL } from '@/lib/types'

export const metadata: Metadata = {
  title: 'ชุดจุด',
  robots: { index: false, follow: false },
}

export default async function ProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: protocol } = await supabase
    .from('protocols')
    .select('id, name, species, note')
    .eq('id', id)
    .maybeSingle()
  if (!protocol) notFound()

  const { data: rows } = await supabase
    .from('protocol_points')
    .select('sort_order, note, points (*)')
    .eq('protocol_id', id)
    .order('sort_order')

  const items = ((rows ?? []) as unknown as { sort_order: number; note: string | null; points: Point }[])
    .filter((r) => r.points)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href="/protocols" className="hover:text-primary">ชุดจุดของฉัน</Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-xl font-bold">{protocol.name}</h1>
        <p className="text-sm text-muted">
          {protocol.species ? SPECIES_LABEL[protocol.species] ?? protocol.species : 'ทุกชนิดสัตว์'}
          {protocol.note ? ` · ${protocol.note}` : ''}
        </p>
      </header>

      <form action={addPointToProtocol} className="card p-4 space-y-2">
        <h2 className="font-semibold text-sm">เพิ่มจุดด้วยรหัส</h2>
        <input type="hidden" name="protocol_id" value={protocol.id} />
        <div className="flex gap-2">
          <input
            name="code"
            required
            placeholder="เช่น BL-23 หรือ BAI-HUI"
            className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface uppercase"
          />
          <button
            type="submit"
            className="h-11 px-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
          >
            <Plus size={16} /> เพิ่ม
          </button>
        </div>
        <p className="text-xs text-muted">
          ดูรหัสจุดได้จาก <Link href="/points" className="text-primary underline">หน้าค้นหาจุด</Link>
        </p>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีจุดในชุดนี้</p>
      ) : (
        <ol className="space-y-2.5">
          {items.map((r, i) => (
            <li key={r.points.id} className="card p-3.5 flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-surface-2 text-muted text-xs inline-flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <Link href={`/points/${r.points.slug}`} className="min-w-0 flex-1">
                <p className="font-semibold text-sm">
                  <span className="text-primary">{r.points.code}</span>{' '}
                  {r.points.name_th || r.points.name_pinyin}
                </p>
                <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">
                  {r.points.location_th}
                </p>
              </Link>
              <form action={removePointFromProtocol}>
                <input type="hidden" name="protocol_id" value={protocol.id} />
                <input type="hidden" name="point_id" value={r.points.id} />
                <button
                  type="submit"
                  aria-label={`เอา ${r.points.code} ออก`}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent-soft transition"
                >
                  <Trash2 size={15} />
                </button>
              </form>
            </li>
          ))}
        </ol>
      )}

      <form action={deleteProtocol} className="pt-2">
        <input type="hidden" name="id" value={protocol.id} />
        <button
          type="submit"
          className="text-sm text-accent inline-flex items-center gap-1.5 hover:underline"
        >
          <Trash2 size={14} /> ลบชุดนี้
        </button>
      </form>
    </main>
  )
}

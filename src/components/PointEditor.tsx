'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Point } from '@/lib/types'

/** ฟอร์มแก้ข้อมูลจุดสำหรับผู้ดูแล — รวมอัปโหลดรูปตำแหน่งจุด */
export default function PointEditor({ point }: { point: Point }) {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState({
    name_th: point.name_th ?? '',
    location_th: point.location_th ?? '',
    anatomy_th: point.anatomy_th ?? '',
    functions_th: point.functions_th ?? '',
    indications: point.indications.join(', '),
    needle_th: point.needle_th ?? '',
    caution_th: point.caution_th ?? '',
  })
  const [busy, setBusy] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setBusy(true)
    const { error } = await supabase
      .from('points')
      .update({
        name_th: form.name_th || null,
        location_th: form.location_th,
        anatomy_th: form.anatomy_th || null,
        functions_th: form.functions_th || null,
        indications: form.indications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        needle_th: form.needle_th || null,
        caution_th: form.caution_th || null,
      })
      .eq('id', point.id)
    setBusy(false)
    if (error) toast.error('บันทึกไม่สำเร็จ: ' + error.message)
    else {
      toast.success('บันทึกแล้ว')
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <section className="card p-4 space-y-3">
        <Field label="ชื่อไทย" value={form.name_th} onChange={set('name_th')} />
        <Area label="ตำแหน่ง" value={form.location_th} onChange={set('location_th')} rows={3} />
        <Area label="Landmark / กายวิภาค" value={form.anatomy_th} onChange={set('anatomy_th')} rows={2} />
        <Area label="สรรพคุณ" value={form.functions_th} onChange={set('functions_th')} rows={2} />
        <Field
          label="ข้อบ่งใช้ (คั่นด้วยจุลภาค)"
          value={form.indications}
          onChange={set('indications')}
        />
        <Area label="เทคนิคการปัก" value={form.needle_th} onChange={set('needle_th')} rows={2} />
        <Area label="ข้อควรระวัง" value={form.caution_th} onChange={set('caution_th')} rows={2} />
      </section>

      <button
        onClick={save}
        disabled={busy}
        className="h-11 px-5 inline-flex items-center gap-2 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition disabled:opacity-60"
      >
        <Save size={16} /> {busy ? 'กำลังบันทึก…' : 'บันทึก'}
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        value={value}
        onChange={onChange}
        className="mt-1 w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
      />
    </label>
  )
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="mt-1 w-full p-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface leading-relaxed"
      />
    </label>
  )
}

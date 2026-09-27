'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Save } from 'lucide-react'
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
    image_url: point.image_url ?? '',
    image_alt: point.image_alt ?? '',
    image_credit: point.image_credit ?? '',
  })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const upload = async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${point.slug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('point-images').upload(path, file, {
      cacheControl: '31536000',
      upsert: true,
    })
    if (error) {
      toast.error('อัปโหลดไม่สำเร็จ: ' + error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('point-images').getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    toast.success('อัปโหลดรูปแล้ว กด "บันทึก" เพื่อยืนยัน')
    setUploading(false)
  }

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
        image_url: form.image_url || null,
        image_alt: form.image_alt || null,
        image_credit: form.image_credit || null,
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
        <h2 className="font-semibold">รูปตำแหน่งจุด</h2>
        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="" className="w-full max-w-sm rounded-xl border border-border" />
        )}
        <label className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-surface-2 text-sm font-medium cursor-pointer hover:border-primary hover:text-primary transition">
          <ImagePlus size={16} />
          {uploading ? 'กำลังอัปโหลด…' : form.image_url ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload(f)
            }}
          />
        </label>
        <Field label="คำบรรยายรูป (alt)" value={form.image_alt} onChange={set('image_alt')} />
        <Field label="เครดิตรูป" value={form.image_credit} onChange={set('image_credit')} />
      </section>

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

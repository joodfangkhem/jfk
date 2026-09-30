'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { t, type Locale } from '@/lib/i18n'

/** ปุ่มให้แอดมินยืนยันว่าตรวจข้อมูลจุดนี้กับตำราแล้ว พร้อมบันทึกว่าตรวจกับเล่มไหนหน้าไหน */
export default function VerifyToggle({
  pointId,
  verified,
  source,
  locale = 'th',
}: {
  pointId: string
  verified: boolean
  source?: string | null
  locale?: Locale
}) {
  const d = t(locale).admin
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const [on, setOn] = useState(verified)
  const [src, setSrc] = useState(source ?? '')
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    setBusy(true)
    const next = !on
    // trigger ฝั่งฐานข้อมูลเป็นคนประทับ verified_at และล้างแหล่งอ้างอิงเมื่อถอนยืนยัน
    const { error } = await supabase.from('points').update({ verified: next }).eq('id', pointId)
    setBusy(false)
    if (error) return toast.error(error.message)
    setOn(next)
    if (!next) setSrc('')
    router.refresh()
    toast.success(next ? d.verifiedToast : d.unverifiedToast)
  }

  const saveSource = async () => {
    const value = src.trim()
    if (value === (source ?? '')) return
    const { error } = await supabase
      .from('points')
      .update({ verified_source: value || null })
      .eq('id', pointId)
    if (error) return toast.error(error.message)
    router.refresh()
    toast.success(d.sourceSaved)
  }

  return (
    <section className="space-y-2">
      <button
        onClick={toggle}
        disabled={busy}
        className={`h-11 px-4 inline-flex items-center gap-2 rounded-full border text-sm font-medium transition active:scale-95 disabled:opacity-50 ${
          on
            ? 'bg-primary-soft border-primary/30 text-primary'
            : 'bg-warn-soft border-warn/30 text-warn'
        }`}
      >
        <BadgeCheck size={16} />
        {on ? d.verifyOn : d.verifyOff}
      </button>

      {on && (
        <label className="block">
          <span className="text-xs font-medium text-muted">{d.source}</span>
          <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            onBlur={saveSource}
            placeholder={d.sourcePlaceholder}
            className="mt-1 w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />
          <span className="block text-xs text-muted mt-1 leading-relaxed">{d.sourceHint}</span>
        </label>
      )}
    </section>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

/** ปุ่มให้แอดมินยืนยันว่าตรวจข้อมูลจุดนี้กับตำราแล้ว */
export default function VerifyToggle({
  pointId,
  verified,
}: {
  pointId: string
  verified: boolean
}) {
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const [on, setOn] = useState(verified)
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    setBusy(true)
    const next = !on
    const { error } = await supabase.from('points').update({ verified: next }).eq('id', pointId)
    setBusy(false)
    if (error) return toast.error(error.message)
    setOn(next)
    router.refresh()
    toast.success(next ? 'ทำเครื่องหมายว่าตรวจแล้ว' : 'กลับเป็นรอตรวจสอบ')
  }

  return (
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
      {on ? 'ตรวจสอบแล้ว' : 'ยังรอตรวจสอบ — กดเพื่อยืนยัน'}
    </button>
  )
}

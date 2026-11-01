'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useIsAdmin } from '@/lib/useIsAdmin'
import { revalidateAtlas } from '@/lib/revalidate'

/**
 * ยืนยันตำแหน่งจุดได้จากหน้าแอตลาสเลย ไม่ต้องย้อนไป /admin/atlas
 * ขึ้นเฉพาะแอดมิน และเฉพาะจุดที่ยังติดป้ายรอตรวจสอบ
 */
export default function AtlasVerifyButton({
  pointId,
  species,
  slug,
  onVerified,
}: {
  pointId: string
  species: string
  slug: string
  onVerified: () => void
}) {
  const isAdmin = useIsAdmin()
  const [busy, setBusy] = useState(false)
  if (!isAdmin) return null

  const verify = async () => {
    setBusy(true)
    const { error } = await createClient()
      .from('point_coords')
      .update({ verified: true })
      .eq('point_id', pointId)
      .eq('species', species)
    setBusy(false)
    if (error) {
      toast.error('ยืนยันไม่สำเร็จ: ' + error.message)
      return
    }
    onVerified()
    await revalidateAtlas(slug)
    toast.success('ยืนยันตำแหน่งแล้ว')
  }

  return (
    <button
      type="button"
      onClick={verify}
      disabled={busy}
      className="chip border-primary/40 text-primary hover:bg-primary-soft"
    >
      <Check size={12} /> ยืนยันตำแหน่ง
    </button>
  )
}

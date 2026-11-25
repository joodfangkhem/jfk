'use client'

import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseAnnotations } from '@/lib/annotations'
import { uploadThumb } from '@/lib/thumb'

/** ฟอร์มอนุมัติ: ย่อรูปในเบราว์เซอร์ก่อน (Worker ไม่มี canvas) แล้วค่อยเรียก server action */
export default function ApproveForm({
  imageUrl,
  action,
  children,
}: {
  imageUrl: string
  action: (formData: FormData) => Promise<void>
  children: ReactNode
}) {
  return (
    <form
      className="space-y-2"
      action={async (formData) => {
        const url = await uploadThumb(
          createClient(),
          imageUrl,
          parseAnnotations(formData.get('annotations'))
        )
        if (url) formData.set('thumb_url', url)
        await action(formData)
      }}
    >
      {children}
    </form>
  )
}

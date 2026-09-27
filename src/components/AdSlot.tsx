'use client'

import { useEffect, useRef } from 'react'

/**
 * ช่องโฆษณา AdSense — จะแสดงเมื่อใส่ env NEXT_PUBLIC_ADSENSE_CLIENT แล้วเท่านั้น
 * ระหว่างรอ AdSense อนุมัติ ช่องนี้จะไม่ render อะไรเลย
 */
export default function AdSlot({
  slot,
  format = 'auto',
  className = '',
}: {
  slot?: string
  format?: string
  className?: string
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || pushed.current) return
    pushed.current = true
    try {
      // @ts-expect-error ตัวแปรที่สคริปต์ AdSense ฉีดเข้ามา
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [client])

  if (!client || !slot) return null

  return (
    <div className={`my-6 ${className}`}>
      <p className="text-[10px] text-muted mb-1 text-center tracking-wide">โฆษณา</p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

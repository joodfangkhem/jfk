'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ช่องโฆษณา AdSense — แสดงเมื่อใส่ env NEXT_PUBLIC_ADSENSE_CLIENT และมี slot แล้วเท่านั้น
 * ถ้า Google ไม่มีโฆษณามาลง (ยังไม่อนุมัติ หรือไม่มีโฆษณาที่ตรงกลุ่ม) จะยุบช่องทิ้ง
 * ไม่ทิ้งพื้นที่ว่างโบ๋ไว้กลางหน้า
 */
export default function AdSlot({
  slot,
  format = 'auto',
  className = '',
  label = 'โฆษณา',
}: {
  slot?: string
  format?: string
  className?: string
  label?: string
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    if (!client || !slot) return
    const el = ref.current
    if (!el) return

    if (!pushed.current) {
      pushed.current = true
      try {
        // @ts-expect-error ตัวแปรที่สคริปต์ AdSense ฉีดเข้ามา
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }

    // AdSense ติด data-ad-status="unfilled" เมื่อไม่มีโฆษณามาลง
    const check = () => {
      if (el.getAttribute('data-ad-status') === 'unfilled') setEmpty(true)
    }
    check()
    const obs = new MutationObserver(check)
    obs.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] })

    // เผื่อสคริปต์ไม่ตอบอะไรเลย (เช่นเว็บยังรออนุมัติ หรือโดน ad blocker)
    const t = setTimeout(() => {
      if (!el.offsetHeight) setEmpty(true)
    }, 4000)

    return () => {
      obs.disconnect()
      clearTimeout(t)
    }
  }, [client, slot])

  if (!client || !slot || empty) return null

  return (
    <div className={`my-6 ${className}`}>
      <p className="text-[10px] text-muted mb-1 text-center tracking-wide">{label}</p>
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

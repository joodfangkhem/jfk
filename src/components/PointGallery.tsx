'use client'

import { useState } from 'react'
import { Camera, Eye, EyeOff } from 'lucide-react'
import AnnotationOverlay from '@/components/AnnotationOverlay'
import type { Annotations } from '@/lib/annotations'
import { t, type Locale } from '@/lib/i18n'

export type GalleryImage = {
  id: string
  image_url: string
  caption: string | null
  credit: string | null
  is_primary: boolean
  annotations: Annotations | null
}

/** รูปหลัก + แถบรูปย่อย แตะสลับดูได้ (หลายมุม / หลายสายพันธุ์) */
export default function PointGallery({
  images,
  code,
  nameTh,
  emptyTitle = 'ยังไม่มีรูปตำแหน่งของจุดนี้',
  emptySub = 'ถ้ามีรูป ช่วยส่งเข้ามาได้ที่กล่องด้านล่าง',
  locale = 'th',
}: {
  images: GalleryImage[]
  code: string
  nameTh: string | null
  emptyTitle?: string
  emptySub?: string
  locale?: Locale
}) {
  const [active, setActive] = useState(0)
  const [showMarks, setShowMarks] = useState(true)

  if (images.length === 0) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center gap-2 bg-surface-2 border-dashed">
        <Camera size={22} className="text-muted" />
        <p className="text-sm text-muted leading-relaxed">
          {emptyTitle}
          <br />
          <span className="text-xs">{emptySub}</span>
        </p>
      </div>
    )
  }

  const current = images[Math.min(active, images.length - 1)]

  return (
    <figure className="card overflow-hidden">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image_url}
          alt={current.caption || `ตำแหน่งจุด ${code} ${nameTh ?? ''}`}
          className="block w-full object-cover"
          loading="lazy"
        />
        {current.annotations && showMarks && <AnnotationOverlay {...current.annotations} />}
      </div>

      {/* ซ่อนป้ายได้ เพื่อดูตรงจุดจริงที่ป้ายบังอยู่ — ปุ่มอยู่ใต้รูปเพราะวางทับแล้วบังป้ายเอง */}
      {current.annotations && (
        <div className="flex justify-end px-2 pt-2">
          <button
            type="button"
            onClick={() => setShowMarks((v) => !v)}
            className="chip hover:border-primary hover:text-primary"
          >
            {showMarks ? <EyeOff size={12} /> : <Eye size={12} />}{' '}
            {showMarks ? t(locale).annotate.hide : t(locale).annotate.show}
          </button>
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 p-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`ดูรูปที่ ${i + 1}`}
              className={`shrink-0 rounded-lg overflow-hidden border-2 transition ${
                i === active ? 'border-primary' : 'border-transparent opacity-70'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="" className="w-16 h-16 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {(current.caption || current.credit) && (
        <figcaption className="px-3 py-2 text-xs text-muted border-t border-border">
          {current.caption}
          {current.caption && current.credit ? ' · ' : ''}
          {current.credit ? `ภาพ: ${current.credit}` : ''}
        </figcaption>
      )}
    </figure>
  )
}

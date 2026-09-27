import { Camera } from 'lucide-react'
import type { Point } from '@/lib/types'

/** รูปตำแหน่งจุด — ยังไม่มีรูป จะขึ้นกรอบรอถ่ายไว้ก่อน */
export default function PointImage({ point }: { point: Point }) {
  if (point.image_url) {
    return (
      <figure className="card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={point.image_url}
          alt={point.image_alt || `ตำแหน่งจุด ${point.code} ${point.name_th ?? ''}`}
          className="w-full object-cover"
          loading="lazy"
        />
        {point.image_credit && (
          <figcaption className="px-3 py-2 text-xs text-muted border-t border-border">
            ภาพ: {point.image_credit}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center gap-2 bg-surface-2 border-dashed">
      <Camera size={22} className="text-muted" />
      <p className="text-sm text-muted leading-relaxed">
        ยังไม่มีรูปตำแหน่งของจุดนี้
        <br />
        <span className="text-xs">เดี๋ยวถ่ายมาใส่ให้ครับ</span>
      </p>
    </div>
  )
}

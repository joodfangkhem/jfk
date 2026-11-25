import AnnotationOverlay from '@/components/AnnotationOverlay'
import { FULL, cropStyle, cropView, squareIn, type Annotations } from '@/lib/annotations'

/** รูปหนึ่งใบพร้อมกรอบครอปและป้าย — ไม่มีครอปก็แสดงเต็มรูปตามสัดส่วนเดิม */
export default function AnnotatedImage({
  src,
  alt,
  data,
  showMarks = true,
  maxHeight,
  className = '',
}: {
  src: string
  alt: string
  data: Annotations
  showMarks?: boolean
  /** เช่น '20rem' — ย่อความกว้างตามสัดส่วนแทนการบีบรูป */
  maxHeight?: string
  className?: string
}) {
  const view = cropView(data)
  const ratio = view.w / view.h
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        width: maxHeight ? `min(100%, calc(${maxHeight} * ${ratio}))` : '100%',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute max-w-none"
        style={cropStyle(data.crop ?? FULL)}
      />
      {showMarks && <AnnotationOverlay {...view} />}
    </div>
  )
}

/** รูปย่อจัตุรัส ตัดจากกลางกรอบครอป ให้ตรงกับรูปใหญ่ */
export function CroppedThumb({
  src,
  data,
  className = '',
}: {
  src: string
  data: Annotations | null
  className?: string
}) {
  if (!data?.crop) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={`object-cover ${className}`} loading="lazy" />
    )
  }
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute max-w-none"
        style={cropStyle(squareIn(data.crop, data.w, data.h))}
      />
    </span>
  )
}

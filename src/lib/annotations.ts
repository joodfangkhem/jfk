/**
 * ป้ายชี้จุดบนรูป — เก็บใน point_images.annotations (jsonb)
 *
 * พิกัดเป็นสัดส่วน 0–1 ของรูป (x,r เทียบความกว้าง, y เทียบความสูง) จึงไม่ขึ้นกับขนาดที่แสดง
 * เก็บ w/h ของรูปไว้ด้วย เพื่อให้ SVG วาดสัดส่วนถูกตั้งแต่ SSR โดยไม่ต้องรอรูปโหลด
 */
export const ANNOTATION_COLORS = {
  red: '#e5261f',
  yellow: '#ffd60a',
  blue: '#0a84ff',
} as const

export type AnnotationColor = keyof typeof ANNOTATION_COLORS
export type AnnotationType = 'point' | 'circle' | 'arrow' | 'line'

export type AnnotationItem = {
  type: AnnotationType
  /** point/circle = จุดกลาง, arrow = โคน, line = ปลายด้านหนึ่ง */
  x: number
  y: number
  /** circle เท่านั้น */
  r?: number
  /** arrow = หัวลูกศร, line = ปลายอีกด้าน */
  x2?: number
  y2?: number
  label: string
  color: AnnotationColor
}

export type Annotations = { w: number; h: number; items: AnnotationItem[] }

export const MAX_ANNOTATIONS = 20
export const MAX_LABEL = 40

const TYPES: AnnotationType[] = ['point', 'circle', 'arrow', 'line']

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
/** ทศนิยม 4 ตำแหน่ง = ละเอียด 0.16px บนรูป 1600px พอแล้วและไม่เปลืองที่ */
export const unit = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 10000) / 10000

/** แปลงค่าที่ไม่รู้ที่มา (DB / ฟอร์ม) ให้เป็นรูปแบบที่ใช้ได้ — ชิ้นที่ผิดรูปแบบถูกทิ้ง ไม่มีอะไรเหลือ = null */
export function parseAnnotations(raw: unknown): Annotations | null {
  let v: unknown = raw
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v)
    } catch {
      return null
    }
  }
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const w = num(o.w)
  const h = num(o.h)
  if (!w || !h || w <= 0 || h <= 0 || !Array.isArray(o.items)) return null

  const items: AnnotationItem[] = []
  for (const it of o.items.slice(0, MAX_ANNOTATIONS)) {
    if (!it || typeof it !== 'object') continue
    const i = it as Record<string, unknown>
    const type = TYPES.find((ty) => ty === i.type)
    const x = num(i.x)
    const y = num(i.y)
    if (!type || x === null || y === null) continue
    const item: AnnotationItem = {
      type,
      x: unit(x),
      y: unit(y),
      label: typeof i.label === 'string' ? i.label.trim().slice(0, MAX_LABEL) : '',
      color:
        typeof i.color === 'string' && Object.hasOwn(ANNOTATION_COLORS, i.color)
          ? (i.color as AnnotationColor)
          : 'red',
    }
    if (type === 'circle') {
      const r = num(i.r)
      if (!r || r <= 0) continue
      item.r = unit(r)
    }
    if (type === 'arrow' || type === 'line') {
      const x2 = num(i.x2)
      const y2 = num(i.y2)
      if (x2 === null || y2 === null) continue
      item.x2 = unit(x2)
      item.y2 = unit(y2)
    }
    items.push(item)
  }
  return items.length ? { w, h, items } : null
}

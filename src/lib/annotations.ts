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

/** กรอบครอป เป็นสัดส่วน 0–1 ของรูปเต็ม — ไม่ได้ตัดไฟล์จริง ยกเลิกได้เสมอ */
export type Crop = { x: number; y: number; w: number; h: number }

/** พิกัดของ items เทียบกับรูปเต็มเสมอ แม้มี crop (ปรับกรอบใหม่แล้วป้ายไม่เลื่อน) */
export type Annotations = { w: number; h: number; items: AnnotationItem[]; crop?: Crop }

export const FULL: Crop = { x: 0, y: 0, w: 1, h: 1 }
/** เล็กกว่านี้รูปจะแตกจนดูไม่รู้เรื่อง */
export const MIN_CROP = 0.1

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
  const crop = parseCrop(o.crop)
  if (!items.length && !crop) return null
  return { w, h, items, ...(crop && { crop }) }
}

function parseCrop(raw: unknown): Crop | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const [x, y, w, h] = [num(c.x), num(c.y), num(c.w), num(c.h)]
  if (x === null || y === null || w === null || h === null) return null
  // เผื่อปัดเศษ 4 ตำแหน่งแล้วเกินขอบมานิดเดียว
  if (x < 0 || y < 0 || w < MIN_CROP / 2 || h < MIN_CROP / 2) return null
  if (x + w > 1.001 || y + h > 1.001) return null
  if (w > 0.998 && h > 0.998) return null // เต็มรูป = ไม่ครอป
  return { x: unit(x), y: unit(y), w: unit(Math.min(w, 1 - x)), h: unit(Math.min(h, 1 - y)) }
}

/** ป้ายที่จุดสำคัญ (จุดกลาง / หัวลูกศร) หลุดกรอบ ไม่ต้องแสดง แต่ยังเก็บไว้เผื่อขยายกรอบกลับ */
export function inCrop(it: AnnotationItem, c: Crop) {
  const inside = (x: number, y: number) =>
    x >= c.x - 0.0005 && x <= c.x + c.w + 0.0005 && y >= c.y - 0.0005 && y <= c.y + c.h + 0.0005
  if (it.type === 'arrow') return inside(it.x2!, it.y2!)
  if (it.type === 'line') return inside(it.x, it.y) || inside(it.x2!, it.y2!)
  return inside(it.x, it.y)
}

export function visibleCount(a: Annotations | null) {
  return a ? a.items.filter((it) => inCrop(it, a.crop ?? FULL)).length : 0
}

/** แปลงพิกัดรูปเต็ม -> พิกัดในกรอบครอป (null = หลุดกรอบ, คงลำดับเดิมไว้ให้ตัวแก้อ้างอิงได้) */
export function cropView(a: Annotations): { w: number; h: number; items: (AnnotationItem | null)[] } {
  const c = a.crop
  if (!c) return { w: a.w, h: a.h, items: a.items }
  const fx = (x: number) => (x - c.x) / c.w
  const fy = (y: number) => (y - c.y) / c.h
  return {
    w: a.w * c.w,
    h: a.h * c.h,
    items: a.items.map((it) =>
      inCrop(it, c)
        ? {
            ...it,
            x: fx(it.x),
            y: fy(it.y),
            ...(it.r !== undefined && { r: it.r / c.w }),
            ...(it.x2 !== undefined && { x2: fx(it.x2), y2: fy(it.y2!) }),
          }
        : null
    ),
  }
}

/** style ของ <img> ที่วาง absolute ในกล่องที่มีสัดส่วนเท่ากรอบครอป */
export function cropStyle(c: Crop) {
  return {
    width: `${100 / c.w}%`,
    height: `${100 / c.h}%`,
    left: `${(-c.x / c.w) * 100}%`,
    top: `${(-c.y / c.h) * 100}%`,
  }
}

/** จัตุรัส (หน่วยพิกเซล) ที่ใหญ่สุดกลางกรอบครอป */
export function squareIn(c: Crop, w: number, h: number): Crop {
  const side = Math.min(c.w * w, c.h * h)
  const sw = side / w
  const sh = side / h
  return { x: c.x + (c.w - sw) / 2, y: c.y + (c.h - sh) / 2, w: sw, h: sh }
}

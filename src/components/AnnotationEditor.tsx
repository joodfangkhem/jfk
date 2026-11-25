'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, Circle, Crop as CropIcon, Dot, Minus, Trash2, Undo2, X } from 'lucide-react'
import AnnotationOverlay from '@/components/AnnotationOverlay'
import CropStage from '@/components/CropStage'
import {
  ANNOTATION_COLORS,
  FULL,
  MAX_ANNOTATIONS,
  MAX_LABEL,
  cropStyle,
  cropView,
  parseAnnotations,
  unit,
  type AnnotationColor,
  type AnnotationItem,
  type AnnotationType,
  type Annotations,
  type Crop,
} from '@/lib/annotations'
import { t, type Locale } from '@/lib/i18n'

const TOOLS = [
  { type: 'point', Icon: Dot },
  { type: 'circle', Icon: Circle },
  { type: 'arrow', Icon: ArrowUpRight },
  { type: 'line', Icon: Minus },
] as const

/** สัดส่วนกรอบครอป (พิกเซลจริง กว้าง/สูง) */
const RATIOS = [
  { label: null, value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
] as const

const LOUPE = 120
const ZOOM = 2.5

type Part = 'move' | 'r' | 'a' | 'b'
type Gesture = {
  pointerId: number
  index: number
  part: Part
  /** กำลังวาดชิ้นใหม่ (ยังไม่ปล่อยนิ้ว) */
  fresh: boolean
  startX: number
  startY: number
  orig: AnnotationItem
  before: AnnotationItem[]
  beforeSelected: number
  moved: boolean
  /** เริ่มวาดทับชิ้นเดิม — ถ้าไม่ได้ลาก ถือว่าแค่แตะเลือกชิ้นนั้น */
  over: number
}
type Loupe = { x: number; y: number; w: number; h: number }

/** ตัวแก้ป้ายแบบเต็มจอ: แตะวางจุด ลากวาดวง/ลูกศร/เส้น ลากของเดิมเพื่อย้าย ครอปรูปได้ */
export default function AnnotationEditor({
  imageUrl,
  code,
  value,
  busy = false,
  saveLabel,
  onSave,
  onClose,
  locale = 'th',
}: {
  imageUrl: string
  code: string
  value: Annotations | null
  busy?: boolean
  saveLabel: string
  onSave: (v: Annotations | null) => void
  onClose: () => void
  locale?: Locale
}) {
  const d = t(locale).annotate
  const [size, setSize] = useState<{ w: number; h: number } | null>(
    value ? { w: value.w, h: value.h } : null
  )
  const [items, setItems] = useState<AnnotationItem[]>(value?.items ?? [])
  const [crop, setCrop] = useState<Crop>(value?.crop ?? FULL)
  /** กรอบที่กำลังลากอยู่ในโหมดครอป (null = โหมดวางป้าย) */
  const [draft, setDraft] = useState<Crop | null>(null)
  const [ratio, setRatio] = useState<number | null>(null)
  const [past, setPast] = useState<{ items: AnnotationItem[]; crop: Crop }[]>([])
  const [tool, setTool] = useState<AnnotationType>('point')
  const [color, setColor] = useState<AnnotationColor>('red')
  const [selected, setSelected] = useState(-1)
  const [loupe, setLoupe] = useState<Loupe | null>(null)
  const [failed, setFailed] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)

  const dirty = past.length > 0
  const current = items[selected]

  const close = () => {
    if (busy) return
    if (dirty && !window.confirm(d.discard)) return
    onClose()
  }

  const push = (before: AnnotationItem[]) => 
    setPast((p) => [...p.slice(-49), { items: before, crop }])

  const undo = () => {
    const last = past[past.length - 1]
    if (!last) return
    setItems(last.items)
    setCrop(last.crop)
    setPast(past.slice(0, -1))
    setSelected(-1)
  }

  const removeSelected = () => {
    if (!current) return
    push(items)
    setItems(items.filter((_, i) => i !== selected))
    setSelected(-1)
  }

  const patch = (p: Partial<AnnotationItem>) => {
    if (!current) return
    push(items)
    setItems(items.map((it, i) => (i === selected ? { ...it, ...p } : it)))
  }

  const startCrop = () => {
    setSelected(-1)
    setRatio(null)
    setDraft(crop)
  }

  /** ล็อกสัดส่วน: หดกรอบเดิมรอบจุดกลาง ไม่ขยายเกินที่เลือกไว้ */
  const lockRatio = (r: number | null) => {
    setRatio(r)
    if (!r || !draft || !size) return
    const k = (r * size.h) / size.w
    const w = Math.min(draft.w, draft.h * k)
    const h = w / k
    setDraft({
      x: unit(draft.x + (draft.w - w) / 2),
      y: unit(draft.y + (draft.h - h) / 2),
      w: unit(w),
      h: unit(h),
    })
  }

  const applyCrop = () => {
    if (!draft) return
    if (draft.x !== crop.x || draft.y !== crop.y || draft.w !== crop.w || draft.h !== crop.h) {
      push(items)
      setCrop(draft)
    }
    setDraft(null)
  }

  // ล็อกหน้าหลังไม่ให้เลื่อนตามตอนลากบนมือถือ
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // ไม่ใส่ deps: ตัวจัดการต้องเห็น state ล่าสุดเสมอ และผูกใหม่ถูกมาก
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.tagName === 'INPUT'
      if (e.key === 'Escape') {
        if (draft) setDraft(null)
        else close()
      } else if (draft) return
      else if (typing) return
      else if (e.key === 'Delete' || e.key === 'Backspace') removeSelected()
      else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const locate = (e: ReactPointerEvent) => {
    const r = stage.current!.getBoundingClientRect()
    const u = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const v = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    // ทุกอย่างคิดในพิกัดรูปเต็ม จอเห็นแค่ส่วนในกรอบครอป
    return {
      x: crop.x + u * crop.w,
      y: crop.y + v * crop.h,
      w: r.width / crop.w,
      h: r.height / crop.h,
    }
  }

  /** แว่นขยายตามตำแหน่งที่กำลังวาง เพราะนิ้วบังจุดพอดี */
  const showLoupe = (it: AnnotationItem, part: Part, w: number, h: number) => {
    if (part === 'r') return setLoupe(null)
    const tip = part === 'b' || (part === 'move' && it.type === 'arrow')
    setLoupe({ x: tip ? it.x2! : it.x, y: tip ? it.y2! : it.y, w, h })
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!size || busy || gesture.current || e.button !== 0) return
    e.preventDefault()
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    const p = locate(e)
    const hit = (e.target as Element).closest('[data-hit]')?.getAttribute('data-hit')

    const [part, idx] = hit ? hit.split(':') : []
    const index = hit ? Number(idx) : -1
    // วง/ลูกศร/เส้น มักต้องเริ่มตรงจุดที่วางไว้แล้ว จึงลากย้ายได้เฉพาะชิ้นที่เลือกอยู่
    const grab = hit && (index === selected || tool === 'point' || items.length >= MAX_ANNOTATIONS)

    let g: Gesture
    if (grab) {
      g = {
        pointerId: e.pointerId,
        index,
        part: part as Part,
        fresh: false,
        startX: p.x,
        startY: p.y,
        orig: items[index],
        before: items,
        beforeSelected: selected,
        moved: false,
        over: -1,
      }
      setSelected(index)
      setColor(items[index].color)
    } else {
      if (items.length >= MAX_ANNOTATIONS) return
      // ชิ้นแรกของรูปคือจุดของหน้านั้นเอง ใส่รหัสให้เลย ชิ้นต่อ ๆ ไปปล่อยว่างไว้ให้พิมพ์
      const label = tool !== 'line' && !items.some((i) => i.label === code) ? code.slice(0, MAX_LABEL) : ''
      const item: AnnotationItem = { type: tool, x: unit(p.x), y: unit(p.y), label, color }
      if (tool === 'circle') item.r = 0
      if (tool === 'arrow' || tool === 'line') {
        item.x2 = item.x
        item.y2 = item.y
      }
      g = {
        pointerId: e.pointerId,
        index: items.length,
        part: tool === 'circle' ? 'r' : tool === 'point' ? 'move' : 'b',
        fresh: true,
        startX: p.x,
        startY: p.y,
        orig: item,
        before: items,
        beforeSelected: selected,
        moved: false,
        over: index,
      }
      setItems([...items, item])
      setSelected(items.length)
    }
    gesture.current = g
    e.currentTarget.setPointerCapture(e.pointerId)
    showLoupe(g.orig, g.part, p.w, p.h)
  }

  /** จำกัดให้อยู่ในกรอบครอป ไม่งั้นลากหลุดกรอบแล้วป้ายหายจับคืนไม่ได้ */
  const cx = (v: number) => unit(Math.min(crop.x + crop.w, Math.max(crop.x, v)))
  const cy = (v: number) => unit(Math.min(crop.y + crop.h, Math.max(crop.y, v)))

  const apply = (g: Gesture, x: number, y: number, w: number, h: number): AnnotationItem => {
    const o = g.orig
    const dx = x - g.startX
    const dy = y - g.startY
    if (g.part === 'r') {
      // รัศมีเทียบความกว้าง ต้องแปลงแกน y ให้เป็นหน่วยเดียวกันก่อน
      return { ...o, r: unit(Math.hypot(x - o.x, ((y - o.y) * h) / w)) }
    }
    if (g.part === 'a') return { ...o, x: cx(o.x + dx), y: cy(o.y + dy) }
    if (g.part === 'b') return { ...o, x2: cx(o.x2! + dx), y2: cy(o.y2! + dy) }
    // ย้ายทั้งชิ้น: จำกัดระยะก่อนบวก ปลายข้างหนึ่งชนขอบแล้วอีกข้างต้องหยุดด้วย ไม่งั้นทรงเพี้ยน
    const xs = o.x2 === undefined ? [o.x] : [o.x, o.x2]
    const ys = o.y2 === undefined ? [o.y] : [o.y, o.y2]
    const mx = Math.max(crop.x - Math.min(...xs), Math.min(crop.x + crop.w - Math.max(...xs), dx))
    const my = Math.max(crop.y - Math.min(...ys), Math.min(crop.y + crop.h - Math.max(...ys), dy))
    return {
      ...o,
      x: unit(o.x + mx),
      y: unit(o.y + my),
      ...(o.x2 !== undefined && { x2: unit(o.x2 + mx), y2: unit(o.y2! + my) }),
    }
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.pointerId !== e.pointerId) return
    const p = locate(e)
    if (!g.moved && Math.hypot((p.x - g.startX) * p.w, (p.y - g.startY) * p.h) < 3) return
    g.moved = true
    const next = apply(g, p.x, p.y, p.w, p.h)
    setItems((list) => list.map((it, i) => (i === g.index ? next : it)))
    showLoupe(next, g.part, p.w, p.h)
  }

  const finish = (e: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = gesture.current
    if (!g || g.pointerId !== e.pointerId) return
    gesture.current = null
    setLoupe(null)

    const revert = () => {
      setItems(g.before)
      setSelected(g.fresh ? g.beforeSelected : g.index)
    }
    if (cancelled) return revert()
    if (g.over >= 0 && !g.moved) {
      setItems(g.before)
      setSelected(g.over)
      setColor(g.before[g.over].color)
      return
    }

    const p = locate(e)
    let done = g.moved ? apply(g, p.x, p.y, p.w, p.h) : g.orig

    if (g.fresh && done.type === 'circle' && (done.r ?? 0) * p.w < 8) {
      done = { ...done, r: unit(0.06 * crop.w) } // แตะเฉย ๆ = วงขนาดมาตรฐาน ปรับทีหลังได้
    }
    if (g.fresh && (done.type === 'arrow' || done.type === 'line')) {
      const len = Math.hypot((done.x2! - done.x) * p.w, (done.y2! - done.y) * p.h)
      if (len < 10) {
        if (done.type === 'line') return revert()
        const off = 0.14 * crop.w
        // แตะเฉย ๆ ด้วยลูกศร = ปลายอยู่ตรงที่แตะ โคนเยื้องไปด้านที่มีที่ว่าง
        done = {
          ...done,
          x2: done.x,
          y2: done.y,
          x: cx(done.x + (done.x < crop.x + crop.w / 2 ? off : -off)),
          y: cy(done.y + ((done.y < crop.y + crop.h / 2 ? off : -off) * p.w) / p.h),
        }
      }
    }
    if (g.part === 'r' && (done.r ?? 0) < 0.01) done = { ...done, r: 0.01 }
    if (!g.fresh && !g.moved) return // แค่แตะเลือก

    push(g.before)
    const final = done
    setItems((list) => list.map((it, i) => (i === g.index ? final : it)))
  }

  const save = () => {
    if (!size) return
    onSave(parseAnnotations({ ...size, items, crop }))
  }

  const view = size ? cropView({ ...size, items, crop }) : null
  const stageRatio = view ? view.w / view.h : 1

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={d.title}
      className="fixed inset-0 z-[100] bg-[#14100c] flex flex-col text-white"
    >
      <div className="flex items-center gap-2 px-3 h-14 shrink-0">
        <button
          type="button"
          onClick={close}
          aria-label={d.close}
          className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <X size={20} />
        </button>
        <p className="flex-1 min-w-0 truncate text-sm font-semibold">
          {d.title} <span className="opacity-70">{code}</span>
        </p>
        <button
          type="button"
          onClick={undo}
          disabled={!past.length || busy || !!draft}
          aria-label={d.undo}
          className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
        >
          <Undo2 size={18} />
        </button>
        <button
          type="button"
          onClick={startCrop}
          disabled={busy || !size || !!draft}
          aria-label={d.crop}
          className={`h-10 px-3 inline-flex items-center gap-1.5 rounded-full text-sm hover:bg-white/10 disabled:opacity-30 ${
            crop.w < 1 || crop.h < 1 ? 'bg-white/15' : ''
          }`}
        >
          <CropIcon size={17} /> <span className="hidden sm:inline">{d.crop}</span>
        </button>
        <button
          type="button"
          onClick={save}
          disabled={busy || !size || !!draft}
          className="h-10 px-4 rounded-full bg-primary text-sm font-medium active:scale-95 transition disabled:opacity-40"
        >
          {busy ? d.saving : saveLabel}
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center px-3 overflow-hidden">
        {failed ? (
          <p className="text-sm">{d.imageFailed}</p>
        ) : draft && size ? (
          <CropStage
            src={imageUrl}
            {...size}
            value={draft}
            k={ratio ? (ratio * size.h) / size.w : null}
            onChange={setDraft}
          />
        ) : (
          <div
            ref={stage}
            data-testid="annotation-stage"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={(e) => finish(e, false)}
            onPointerCancel={(e) => finish(e, true)}
            className="relative touch-none select-none cursor-crosshair overflow-hidden rounded-lg"
            style={{
              aspectRatio: stageRatio,
              width: `min(100%, calc((100dvh - 15rem) * ${stageRatio}))`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              onLoad={(e) =>
                setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
              }
              onError={() => setFailed(true)}
              className={`absolute max-w-none ${size ? '' : 'opacity-0'}`}
              style={cropStyle(crop)}
            />
            {view && <AnnotationOverlay {...view} selected={selected} hit />}
          </div>
        )}
      </div>

      {loupe && (
        <div
          aria-hidden
          className={`fixed top-16 rounded-full border-2 border-white shadow-lg overflow-hidden pointer-events-none ${
            loupe.x < 0.5 ? 'right-4' : 'left-4'
          }`}
          style={{
            width: LOUPE,
            height: LOUPE,
            backgroundColor: '#14100c',
            backgroundImage: `url("${imageUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${loupe.w * ZOOM}px ${loupe.h * ZOOM}px`,
            backgroundPosition: `${LOUPE / 2 - loupe.x * loupe.w * ZOOM}px ${LOUPE / 2 - loupe.y * loupe.h * ZOOM}px`,
          }}
        >
          <span className="absolute left-1/2 top-0 h-full w-px bg-white/70" />
          <span className="absolute top-1/2 left-0 w-full h-px bg-white/70" />
        </div>
      )}

      <div className="shrink-0 px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5 max-w-2xl w-full mx-auto">
        {draft ? (
          <>
            <div className="flex gap-1.5">
              {RATIOS.map((r) => (
                <button
                  key={r.label ?? 'free'}
                  type="button"
                  onClick={() => lockRatio(r.value)}
                  aria-pressed={ratio === r.value}
                  className={`flex-1 h-11 rounded-xl text-xs font-medium border transition ${
                    ratio === r.value ? 'bg-white text-text border-white' : 'border-white/25 hover:bg-white/10'
                  }`}
                >
                  {r.label ?? d.cropFree}
                </button>
              ))}
            </div>
            <div className="h-11 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRatio(null)
                  setDraft(FULL)
                }}
                className="h-11 px-4 rounded-xl border border-white/25 text-sm hover:bg-white/10"
              >
                {d.cropReset}
              </button>
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="h-11 px-4 rounded-xl text-sm hover:bg-white/10"
              >
                {d.cropCancel}
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="h-11 px-4 inline-flex items-center gap-1.5 rounded-xl bg-primary text-sm font-medium"
              >
                <Check size={16} /> {d.cropApply}
              </button>
            </div>
          </>
        ) : (
          <>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1.5">
            {TOOLS.map(({ type, Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTool(type)
                  setSelected(-1)
                }}
                aria-pressed={tool === type}
                className={`flex-1 h-11 inline-flex items-center justify-center gap-1 rounded-xl text-xs font-medium border transition ${
                  tool === type ? 'bg-white text-text border-white' : 'border-white/25 hover:bg-white/10'
                }`}
              >
                <Icon size={type === 'point' ? 24 : 16} /> {d.tool[type]}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(Object.keys(ANNOTATION_COLORS) as AnnotationColor[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-label={d.color[c]}
                aria-pressed={color === c}
                onClick={() => {
                  setColor(c)
                  if (current && current.color !== c) patch({ color: c })
                }}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  color === c ? 'border-white scale-100' : 'border-transparent scale-75'
                }`}
                style={{ background: ANNOTATION_COLORS[c] }}
              />
            ))}
          </div>
        </div>

        <div className="h-11 flex items-center gap-2">
          {current ? (
            <>
              <LabelInput
                key={selected}
                value={current.label}
                placeholder={d.labelPlaceholder}
                onBegin={() => push(items)}
                onChange={(label) =>
                  setItems((list) => list.map((it, i) => (i === selected ? { ...it, label } : it)))
                }
              />
              <button
                type="button"
                onClick={removeSelected}
                aria-label={d.remove}
                className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl border border-white/25 hover:bg-white/10"
              >
                <Trash2 size={17} />
              </button>
            </>
          ) : (
            <p className="text-xs text-white/75 leading-relaxed">
              {items.length >= MAX_ANNOTATIONS ? d.full(MAX_ANNOTATIONS) : d.hint[tool]}
            </p>
          )}
        </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

/** พิมพ์ทั้งคำ = undo ครั้งเดียว ไม่ใช่ทีละตัวอักษร */
function LabelInput({
  value,
  placeholder,
  onBegin,
  onChange,
}: {
  value: string
  placeholder: string
  onBegin: () => void
  onChange: (v: string) => void
}) {
  const [touched, setTouched] = useState(false)
  return (
    <input
      value={value}
      maxLength={MAX_LABEL}
      placeholder={placeholder}
      onChange={(e) => {
        if (!touched) {
          setTouched(true)
          onBegin()
        }
        onChange(e.target.value)
      }}
      onBlur={() => setTouched(false)}
      className="flex-1 min-w-0 h-11 px-3.5 rounded-xl bg-white/10 border border-white/25 text-base outline-none focus:border-white placeholder:text-white/50"
    />
  )
}

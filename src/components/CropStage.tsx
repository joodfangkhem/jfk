'use client'

import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { MIN_CROP, unit, type Crop } from '@/lib/annotations'

const CORNERS = ['nw', 'ne', 'sw', 'se'] as const
type Part = (typeof CORNERS)[number] | 'move'
type Gesture = { pointerId: number; part: Part; startX: number; startY: number; orig: Crop }

/** ลากกรอบครอปบนรูปเต็ม — `k` = กว้าง/สูง ในหน่วยสัดส่วนรูป (null = อิสระ) */
export default function CropStage({
  src,
  w,
  h,
  value,
  k,
  onChange,
}: {
  src: string
  w: number
  h: number
  value: Crop
  k: number | null
  onChange: (c: Crop) => void
}) {
  const stage = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)

  const locate = (e: ReactPointerEvent) => {
    const r = stage.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const part = (e.target as Element).closest('[data-crop]')?.getAttribute('data-crop') as Part | null
    if (!part || gesture.current || e.button !== 0) return
    e.preventDefault()
    const p = locate(e)
    gesture.current = { pointerId: e.pointerId, part, startX: p.x, startY: p.y, orig: value }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.pointerId !== e.pointerId) return
    const p = locate(e)
    const dx = p.x - g.startX
    const dy = p.y - g.startY
    const o = g.orig

    if (g.part === 'move') {
      return onChange({
        ...o,
        x: unit(Math.min(1 - o.w, Math.max(0, o.x + dx))),
        y: unit(Math.min(1 - o.h, Math.max(0, o.y + dy))),
      })
    }

    // มุมตรงข้ามอยู่กับที่ แล้วขยายออกไปได้ไม่เกินขอบรูป
    const east = g.part.endsWith('e')
    const south = g.part.startsWith('s')
    const ax = east ? o.x : o.x + o.w
    const ay = south ? o.y : o.y + o.h
    const maxW = east ? 1 - ax : ax
    const maxH = south ? 1 - ay : ay
    let cw = Math.min(maxW, Math.max(MIN_CROP, o.w + (east ? dx : -dx)))
    let ch = Math.min(maxH, Math.max(MIN_CROP, o.h + (south ? dy : -dy)))
    if (k) {
      cw = Math.min(maxW, maxH * k, Math.max(cw, ch * k))
      ch = cw / k
    }
    onChange({
      x: unit(east ? ax : ax - cw),
      y: unit(south ? ay : ay - ch),
      w: unit(cw),
      h: unit(ch),
    })
  }

  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (gesture.current?.pointerId === e.pointerId) gesture.current = null
  }

  return (
    <div
      ref={stage}
      data-testid="crop-stage"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative touch-none select-none"
      style={{ aspectRatio: w / h, width: `min(100%, calc((100dvh - 15rem) * ${w / h}))` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} className="absolute inset-0 w-full h-full" />
        <div
          className="absolute"
          style={{
            left: `${value.x * 100}%`,
            top: `${value.y * 100}%`,
            width: `${value.w * 100}%`,
            height: `${value.h * 100}%`,
            boxShadow: '0 0 0 9999px rgb(0 0 0 / .6)',
          }}
        />
      </div>
      <div
        data-crop="move"
        className="absolute border-2 border-white cursor-move"
        style={{
          left: `${value.x * 100}%`,
          top: `${value.y * 100}%`,
          width: `${value.w * 100}%`,
          height: `${value.h * 100}%`,
        }}
      >
        {CORNERS.map((c) => (
          <span
            key={c}
            data-crop={c}
            className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: c.endsWith('e') ? '100%' : 0,
              top: c.startsWith('s') ? '100%' : 0,
              cursor: c === 'nw' || c === 'se' ? 'nwse-resize' : 'nesw-resize',
            }}
          >
            <span className="w-4 h-4 rounded-full bg-white border-2 border-primary pointer-events-none" />
          </span>
        ))}
      </div>
    </div>
  )
}

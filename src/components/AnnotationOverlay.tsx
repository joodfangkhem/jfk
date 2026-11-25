import { ANNOTATION_COLORS, type AnnotationItem } from '@/lib/annotations'

const VW = 1000

/** หัวลูกศรเป็นสามเหลี่ยมในหน่วย viewBox — ไม่ใช้ <marker> เพราะขนาดเพี้ยนเมื่อเส้นเป็น non-scaling */
function arrowHead(x1: number, y1: number, x2: number, y2: number) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const a = Math.atan2(y2 - y1, x2 - x1)
  const size = Math.min(34, Math.max(16, len * 0.4))
  const at = (da: number) =>
    `${x2 - size * Math.cos(a + da)},${y2 - size * Math.sin(a + da)}`
  return {
    points: `${x2},${y2} ${at(0.42)} ${at(-0.42)}`,
    // ก้านหยุดก่อนถึงปลาย ไม่งั้นปลายแหลมจะทู่ตามความหนาเส้น
    sx: x2 - size * 0.7 * Math.cos(a),
    sy: y2 - size * 0.7 * Math.sin(a),
  }
}

/** ป้ายอยู่เหนือหรือใต้เครื่องหมาย — ไม่วางข้าง ๆ เพราะรูปแคบบนมือถือจะล้นขอบ */
function labelSpot(it: AnnotationItem, ratio: number) {
  if (it.type === 'arrow') {
    const below = it.y >= (it.y2 ?? 0)
    // โคนชิดขอบบน/ล่างมาก ต้องกลับด้านไม่งั้นป้ายหลุดรูป
    const flip = below ? it.y > 0.93 : it.y < 0.07
    return { x: it.x, y: it.y, below: flip ? !below : below, gap: 6 }
  }
  if (it.type === 'line') {
    const x = (it.x + (it.x2 ?? it.x)) / 2
    const y = (it.y + (it.y2 ?? it.y)) / 2
    return { x, y, below: y < 0.1, gap: 6 }
  }
  const ry = it.type === 'circle' ? (it.r ?? 0) * ratio : 0
  const below = it.y - ry < 0.1
  return { x: it.x, y: below ? it.y + ry : it.y - ry, below, gap: it.type === 'point' ? 13 : 5 }
}

/**
 * ชั้นป้ายทับบนรูป — วางใน element ที่เป็น relative และขนาดเท่ารูปพอดี
 * เส้นเป็น SVG ส่วนจุดกับข้อความเป็น HTML เพื่อให้ขนาดตัวอักษรคงที่ทุกขนาดจอ
 * `hit` = ใส่พื้นที่แตะให้ตัวแก้ป้าย (data-hit="<ส่วน>:<ลำดับ>")
 */
export default function AnnotationOverlay({
  w,
  h,
  items,
  selected = -1,
  hit = false,
}: {
  w: number
  h: number
  /** null = หลุดกรอบครอป ข้ามไปแต่คงลำดับไว้ให้ data-hit อ้างอิงได้ */
  items: (AnnotationItem | null)[]
  selected?: number
  hit?: boolean
}) {
  const vh = (VW * h) / w
  const ratio = w / h

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <svg viewBox={`0 0 ${VW} ${vh}`} className="absolute inset-0 w-full h-full" aria-hidden>
        {items.map((it, i) => {
          if (!it || it.type === 'point') return null
          const c = ANNOTATION_COLORS[it.color]
          const x = it.x * VW
          const y = it.y * vh
          const stroke = {
            fill: 'none',
            strokeLinecap: 'round' as const,
            vectorEffect: 'non-scaling-stroke' as const,
          }

          if (it.type === 'circle') {
            const r = (it.r ?? 0) * VW
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={r} {...stroke} stroke="#fff" strokeOpacity={0.9} strokeWidth={5} />
                <circle cx={x} cy={y} r={r} {...stroke} stroke={c} strokeWidth={2.5} />
                {hit && (
                  <circle
                    data-hit={`move:${i}`}
                    cx={x}
                    cy={y}
                    r={r}
                    {...stroke}
                    stroke="transparent"
                    strokeWidth={24}
                    className="cursor-move"
                    style={{ pointerEvents: 'stroke' }}
                  />
                )}
              </g>
            )
          }

          const x2 = (it.x2 ?? it.x) * VW
          const y2 = (it.y2 ?? it.y) * vh
          const head = it.type === 'arrow' ? arrowHead(x, y, x2, y2) : null
          const ex = head ? head.sx : x2
          const ey = head ? head.sy : y2
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={ex} y2={ey} {...stroke} stroke="#fff" strokeOpacity={0.9} strokeWidth={5.5} />
              {head && (
                <polygon
                  points={head.points}
                  fill={c}
                  stroke="#fff"
                  strokeOpacity={0.9}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  paintOrder="stroke"
                />
              )}
              <line
                x1={x}
                y1={y}
                x2={ex}
                y2={ey}
                {...stroke}
                stroke={c}
                strokeWidth={3}
                strokeDasharray={it.type === 'line' ? '7 6' : undefined}
              />
              {hit && (
                <line
                  data-hit={`move:${i}`}
                  x1={x}
                  y1={y}
                  x2={x2}
                  y2={y2}
                  {...stroke}
                  stroke="transparent"
                  strokeWidth={24}
                  className="cursor-move"
                  style={{ pointerEvents: 'stroke' }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {items.map((it, i) => {
        if (!it) return null
        const c = ANNOTATION_COLORS[it.color]
        const raw = labelSpot(it, ratio)
        // โคนลูกศร/ปลายเส้นอาจอยู่นอกกรอบครอป ป้ายต้องค้างอยู่ในรูป
        const spot = {
          ...raw,
          x: Math.min(1, Math.max(0, raw.x)),
          y: Math.min(1, Math.max(0, raw.y)),
        }
        return (
          <div key={i}>
            {it.type === 'point' && (
              <span
                data-hit={hit ? `move:${i}` : undefined}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                  hit ? 'w-9 h-9 pointer-events-auto cursor-move' : 'w-4 h-4'
                }`}
                style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%` }}
              >
                <span
                  className="w-4 h-4 rounded-full border-[2.5px] flex items-center justify-center pointer-events-none"
                  style={{
                    borderColor: c,
                    boxShadow: '0 0 0 1.5px rgb(255 255 255 / .9), inset 0 0 0 1.5px rgb(255 255 255 / .9)',
                  }}
                >
                  <span className="w-[4px] h-[4px] rounded-full" style={{ background: c }} />
                </span>
              </span>
            )}

            {it.label && (
              <span
                className={`absolute w-max max-w-[60%] px-1.5 py-0.5 rounded-md text-[12px] leading-tight font-semibold text-center break-words ${
                  selected === i ? 'ring-2 ring-white' : ''
                }`}
                style={{
                  left: `${spot.x * 100}%`,
                  // ชิดขอบบน/ล่างมากให้ค้างอยู่ในรูป (24px = ป้ายหนึ่งบรรทัด)
                  [spot.below ? 'top' : 'bottom']: `min(${
                    (spot.below ? spot.y : 1 - spot.y) * 100
                  }% + ${spot.gap}px, 100% - 24px)`,
                  // เลื่อนซ้ายตามสัดส่วน x เอง: ชิดขอบไหนก็ไม่มีวันล้นรูป
                  transform: `translateX(${-spot.x * 100}%)`,
                  background: c,
                  color: it.color === 'yellow' ? '#1e2622' : '#fff',
                }}
              >
                {it.label}
              </span>
            )}

            {hit && selected === i && it.type !== 'point' && (
              <>
                {it.type === 'circle' ? (
                  <>
                    <Handle hit={`move:${i}`} x={it.x} y={it.y} />
                    <Handle hit={`r:${i}`} x={Math.min(1, it.x + (it.r ?? 0))} y={it.y} />
                  </>
                ) : (
                  <>
                    <Handle hit={`a:${i}`} x={it.x} y={it.y} />
                    <Handle hit={`b:${i}`} x={it.x2 ?? it.x} y={it.y2 ?? it.y} />
                  </>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** ปุ่มจับย้ายปลาย/ปรับรัศมี — พื้นที่แตะ 36px แต่ตาเห็นแค่ 12px จะได้ไม่บังจุด */
function Handle({ hit, x, y }: { hit: string; x: number; y: number }) {
  return (
    <span
      data-hit={hit}
      className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto cursor-grab"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <span className="w-3 h-3 rounded-full bg-white/80 border-2 border-primary pointer-events-none" />
    </span>
  )
}

import Link from 'next/link'
import type { Point } from '@/lib/types'

export default function PointCard({ point, note }: { point: Point; note?: string | null }) {
  return (
    <Link
      href={`/points/${point.slug}`}
      className="card p-3.5 block active:scale-[0.99] transition hover:border-primary/50"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 min-w-14 h-7 px-2 inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-[13px]">
          {point.code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug truncate">
            {point.name_th || point.name_pinyin || point.code}
            {point.name_zh && <span className="text-muted font-normal"> {point.name_zh}</span>}
          </p>
          <p className="text-[13px] text-muted mt-0.5 line-clamp-2 leading-relaxed">
            {note || point.functions_th || point.location_th}
          </p>
          {point.indications.length > 0 && (
            <div className="flex gap-1 mt-2 overflow-hidden">
              {point.indications.slice(0, 3).map((i) => (
                <span key={i} className="chip">{i}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import type { Point } from '@/lib/types'
import { lp, pick, pickArr, type Locale } from '@/lib/i18n'

export default function PointCard({
  point,
  note,
  locale = 'th',
}: {
  point: Point
  note?: string | null
  locale?: Locale
}) {
  const name = locale === 'en' ? point.name_en || point.name_pinyin || point.code : point.name_th || point.name_pinyin || point.code
  const summary = note || pick(locale, point.functions_th, point.functions_en) || pick(locale, point.location_th, point.location_en)
  const inds = pickArr(locale, point.indications, point.indications_en)
  return (
    <Link
      href={lp(locale, `/points/${point.slug}`)}
      className="card p-3.5 block active:scale-[0.99] transition hover:border-primary/50"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 min-w-14 h-7 px-2 inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-[13px]">
          {point.code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug truncate">
            {name}
            {point.name_zh && <span className="text-muted font-normal"> {point.name_zh}</span>}
          </p>
          <p className="text-[13px] text-muted mt-0.5 line-clamp-2 leading-relaxed">{summary}</p>
          {inds.length > 0 && (
            <div className="flex gap-1 mt-2 overflow-hidden">
              {inds.slice(0, 3).map((i) => (
                <span key={i} className="chip">{i}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

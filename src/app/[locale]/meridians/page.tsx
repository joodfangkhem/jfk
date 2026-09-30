import Link from 'next/link'
import type { Metadata } from 'next'
import { getMeridians } from '@/lib/queries'
import { ELEMENT_LABEL_I18N, isLocale, lp, pick, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return {
    alternates: { canonical: lp(locale, '/meridians'), languages: altLanguages('/meridians') },
    title: locale === 'en' ? 'The 14 meridians' : 'เส้นลมปราณทั้ง 14 เส้น',
    description:
      locale === 'en'
        ? 'The meridians used in veterinary acupuncture with their element, yin-yang, peak hours and the points on each channel.'
        : 'รายชื่อเส้นลมปราณที่ใช้ในการฝังเข็มสัตว์ พร้อมธาตุ ยิน-หยาง ช่วงเวลาที่เส้นทำงานเด่น และจุดบนเส้นแต่ละเส้น',
  }
}

export default async function MeridiansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const meridians = await getMeridians()

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">{d.meridian.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.meridian.intro}</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {meridians.map((m) => (
          <Link
            key={m.code}
            href={lp(locale, `/meridians/${m.slug}`)}
            className="card p-4 hover:border-primary/50 active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-12 h-12 rounded-xl bg-primary-soft text-primary font-bold inline-flex items-center justify-center">
                {m.code}
              </span>
              <div className="min-w-0">
                <p className="font-semibold leading-snug">
                  {locale === 'en' ? m.name_en : m.name_th}
                </p>
                <p className="text-xs text-muted truncate">
                  {locale === 'en' ? m.name_pinyin : m.name_en}
                  {m.name_zh ? ` · ${m.name_zh}` : ''}
                </p>
              </div>
            </div>
            {pick(locale, m.summary_th, m.summary_en) && (
              <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-2">
                {pick(locale, m.summary_th, m.summary_en)}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {m.element && <span className="chip">{ELEMENT_LABEL_I18N[locale][m.element] ?? m.element}</span>}
              {m.yin_yang && (
                <span className="chip">
                  {m.yin_yang === 'yin' ? d.meridian.yin : m.yin_yang === 'yang' ? d.meridian.yang : d.meridian.extra}
                </span>
              )}
              {m.point_count && <span className="chip">{m.point_count} {d.meridian.points}</span>}
              {m.peak_time && <span className="chip">{m.peak_time}</span>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

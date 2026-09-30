import Link from 'next/link'
import type { Metadata } from 'next'
import { getConditions } from '@/lib/queries'
import { CATEGORY_LABEL_I18N, isLocale, lp, pick, t, type Locale } from '@/lib/i18n'
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
    alternates: { canonical: lp(locale, '/conditions'), languages: altLanguages('/conditions') },
    title: locale === 'en' ? 'Acupuncture points by condition' : 'เลือกจุดตามอาการ',
    description:
      locale === 'en'
        ? 'Point sets for common conditions in dogs and cats: IVDD, hindlimb paresis, osteoarthritis, vomiting, diarrhoea, seizures, pruritus.'
        : 'จุดฝังเข็มที่ใช้บ่อยตามอาการในสุนัขและแมว เช่น หมอนรองกระดูกเคลื่อน ขาหลังอ่อนแรง ข้อเสื่อม อาเจียน ท้องเสีย ชัก ผิวหนังคัน',
  }
}

export default async function ConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const conditions = await getConditions()
  const groups = new Map<string, typeof conditions>()
  for (const c of conditions) {
    const key = c.category ?? 'other'
    groups.set(key, [...(groups.get(key) ?? []), c])
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">{d.condition.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.condition.intro}</p>
      </header>

      {[...groups.entries()].map(([cat, items]) => (
        <section key={cat}>
          <h2 className="text-base font-bold mb-2.5">{CATEGORY_LABEL_I18N[locale][cat] ?? cat}</h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {items.map((c) => (
              <Link
                key={c.id}
                href={lp(locale, `/conditions/${c.slug}`)}
                className="card p-3.5 hover:border-primary/50 active:scale-[0.99] transition"
              >
                <p className="font-semibold leading-snug">
                  {locale === 'en' && c.name_en ? c.name_en : c.name_th}
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  {locale === 'en' ? c.name_th : c.name_en}
                </p>
                {pick(locale, c.summary_th, c.summary_en) && (
                  <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                    {pick(locale, c.summary_th, c.summary_en)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}

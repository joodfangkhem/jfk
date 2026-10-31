import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'
import AtlasBrowser from '@/components/AtlasBrowser'
import { getAtlasPoints, getSpeciesModels } from '@/lib/queries'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'
import type { AtlasPoint } from '@/lib/types'

// หน้ารวม: แคช 1 วัน พอให้จุดที่เพิ่งปักขึ้นเองโดยไม่ต้อง regenerate ทุกชั่วโมง
export const revalidate = 86400

export async function generateStaticParams() {
  return [{ locale: 'th' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return {
    alternates: { canonical: lp(locale, '/atlas'), languages: altLanguages('/atlas') },
    title: locale === 'en' ? '3D Atlas of Acupuncture Points' : 'แอตลาส 3 มิติ จุดฝังเข็มในสัตว์',
    description:
      locale === 'en'
        ? 'Rotate a 3D dog or cat and see where each acupuncture point sits. Tap a pin to open the point: location, landmarks, needling technique.'
        : 'หมุนโมเดลสุนัขและแมว 3 มิติ ดูว่าจุดฝังเข็มแต่ละจุดอยู่ตรงไหนบนตัวสัตว์ แตะหมุดเพื่อเปิดตำแหน่ง landmark และเทคนิคการปัก',
  }
}

export default async function AtlasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)

  const models = await getSpeciesModels()
  const lists = await Promise.all(models.map((m) => getAtlasPoints(m.species)))
  const pointsBySpecies: Record<string, AtlasPoint[]> = {}
  models.forEach((m, i) => {
    pointsBySpecies[m.species] = lists[i]
  })

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">{d.atlas.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.atlas.sub}</p>
      </header>

      <AtlasBrowser models={models} pointsBySpecies={pointsBySpecies} locale={locale} />

      <section className="card p-4 bg-warn-soft border-warn/25">
        <p className="text-sm leading-relaxed text-text/85">{d.home.warnBody}</p>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POINT} label={d.ad} />
    </main>
  )
}

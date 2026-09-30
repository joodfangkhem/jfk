import type { Metadata } from 'next'
import ArticleCard from '@/components/ArticleCard'
import AdSlot from '@/components/AdSlot'
import { getArticles } from '@/lib/queries'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const articles = await getArticles()
  return {
    alternates: { canonical: lp(locale, '/articles'), languages: altLanguages('/articles') },
    title: t(locale).article.title,
    description: t(locale).article.intro,
    // หน้าว่างไม่ควรให้ Google เก็บ — เปิด index เองเมื่อมีบทความแรก
    ...(articles.length === 0 ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const articles = await getArticles()

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">{d.article.title}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.article.intro}</p>
      </header>

      {articles.length === 0 ? (
        <p className="text-sm text-muted">{d.article.empty}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} />
          ))}
        </div>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE} label={d.ad} />
    </main>
  )
}

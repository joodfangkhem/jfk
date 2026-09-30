import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FileText, Stethoscope } from 'lucide-react'
import AdSlot from '@/components/AdSlot'
import { getArticle, getArticles, getPointsByCodes } from '@/lib/queries'
import {
  isLocale,
  lp,
  pick,
  t,
  SPECIES_LABEL_I18N,
  type Locale,
} from '@/lib/i18n'
import { altLanguages, siteUrl } from '@/lib/site'
import { extractPointCodes, plainText, readingMinutes, renderMarkdown } from '@/lib/markdown'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.flatMap((a) => [
    { locale: 'th', slug: a.slug },
    { locale: 'en', slug: a.slug },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const a = await getArticle(slug)
  if (!a) return { title: locale === 'en' ? 'Article Not Found' : 'ไม่พบบทความนี้' }

  const title = pick(locale, a.title_th, a.title_en)
  const body = pick(locale, a.body_th, a.body_en)
  const desc = pick(locale, a.excerpt_th, a.excerpt_en) || plainText(body, 200)

  return {
    title,
    description: desc,
    alternates: {
      canonical: lp(locale, `/articles/${a.slug}`),
      languages: altLanguages(`/articles/${a.slug}`),
    },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      ...(a.cover_url ? { images: [{ url: a.cover_url }] } : {}),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const a = await getArticle(slug)
  if (!a) notFound()

  const title = pick(locale, a.title_th, a.title_en)
  const body = pick(locale, a.body_th, a.body_en)
  const codes = extractPointCodes(body)
  const points = await getPointsByCodes(codes)
  const known = new Set(points.map((p) => p.code))
  const html = renderMarkdown(body, { locale, knownCodes: known })

  const c = a.article_cases
  const author = a.authors
  const species = SPECIES_LABEL_I18N[locale]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: a.published_at ?? undefined,
    dateModified: a.updated_at,
    inLanguage: locale === 'en' ? 'en' : 'th',
    mainEntityOfPage: `${siteUrl}${lp(locale, `/articles/${a.slug}`)}`,
    ...(a.cover_url ? { image: a.cover_url } : {}),
    ...(author
      ? {
          author: {
            '@type': 'Person',
            name: pick(locale, author.name_th, author.name_en),
            ...(author.credential ? { honorificSuffix: author.credential } : {}),
            ...(author.school ? { alumniOf: author.school } : {}),
          },
        }
      : {}),
  }

  const caseRows: [string, string | null][] = c
    ? [
        [d.article.pet, [c.pet_name, c.species ? species[c.species] ?? c.species : null, c.breed]
          .filter(Boolean)
          .join(' · ') || null],
        [d.article.sex, c.sex],
        [d.article.age, c.age_text],
        [d.article.owner, c.owner_display],
        [d.article.complaint, c.complaint],
        [d.article.diagnosis, c.diagnosis],
        [d.article.sessions, c.sessions],
        [d.article.outcome, c.outcome],
      ]
    : []

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <nav className="text-xs text-muted">
        <Link href={lp(locale, '/articles')} className="hover:text-primary">
          {d.article.backToList}
        </Link>
      </nav>

      <header className="space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`chip ${
              a.type === 'case' ? 'text-accent border-accent/30' : 'text-primary border-primary/30'
            }`}
          >
            {a.type === 'case' ? <Stethoscope size={11} /> : <FileText size={11} />}
            {a.type === 'case' ? d.article.typeCase : d.article.typeArticle}
          </span>
          <span className="text-xs text-muted">{d.article.readingMin(readingMinutes(body))}</span>
          {a.published_at && (
            <span className="text-xs text-muted">
              {new Date(a.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold leading-snug">{title}</h1>
      </header>

      {a.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.cover_url}
          alt={a.cover_alt ?? ''}
          className="w-full rounded-[var(--radius)] border border-border"
        />
      )}

      {c && caseRows.some(([, v]) => v) && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold text-sm">{d.article.caseBox}</h2>
          <dl className="text-sm space-y-1.5">
            {caseRows
              .filter(([, v]) => v)
              .map(([label, v]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-muted shrink-0 w-28">{label}</dt>
                  <dd className="flex-1 leading-relaxed">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="text-xs text-muted leading-relaxed pt-1 border-t border-border">
            {d.article.consentNote}
          </p>
        </section>
      )}

      <article
        className="article-body text-[15px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {points.length > 0 && (
        <section className="card p-4 space-y-2">
          <h2 className="font-semibold text-sm">{d.article.pointsUsed}</h2>
          <div className="flex flex-wrap gap-1.5">
            {points.map((p) => (
              <Link
                key={p.id}
                href={lp(locale, `/points/${p.slug}`)}
                className="chip hover:border-primary hover:text-primary"
              >
                <strong>{p.code}</strong> {pick(locale, p.name_th, p.name_en)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {author && (
        <section className="card p-4 text-sm space-y-1">
          <p className="text-xs text-muted">{d.article.by}</p>
          <p className="font-semibold">
            {pick(locale, author.name_th, author.name_en)}
            {author.credential && (
              <span className="text-muted font-normal"> · {author.credential}</span>
            )}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {[
              author.school,
              author.class_year,
              author.license_no ? `${d.article.license} ${author.license_no}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {pick(locale, author.bio_th, author.bio_en) && (
            <p className="text-[13px] leading-relaxed pt-1">
              {pick(locale, author.bio_th, author.bio_en)}
            </p>
          )}
        </section>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE} label={d.ad} />
    </main>
  )
}

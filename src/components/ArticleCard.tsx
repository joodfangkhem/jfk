import Link from 'next/link'
import { FileText, Stethoscope } from 'lucide-react'
import { lp, pick, t, type Locale } from '@/lib/i18n'
import { plainText, readingMinutes } from '@/lib/markdown'
import type { Article } from '@/lib/types'

export default function ArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  const d = t(locale).article
  const title = pick(locale, article.title_th, article.title_en)
  const body = pick(locale, article.body_th, article.body_en)
  const excerpt = pick(locale, article.excerpt_th, article.excerpt_en) || plainText(body, 140)
  const isCase = article.type === 'case'

  return (
    <Link
      href={lp(locale, `/articles/${article.slug}`)}
      className="card overflow-hidden block active:scale-[0.99] transition hover:border-primary/50"
    >
      {article.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_url}
          alt={article.cover_alt ?? ''}
          loading="lazy"
          className="w-full h-40 object-cover border-b border-border"
        />
      )}
      <div className="p-3.5 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`chip ${isCase ? 'text-accent border-accent/30' : 'text-primary border-primary/30'}`}>
            {isCase ? <Stethoscope size={11} /> : <FileText size={11} />}
            {isCase ? d.typeCase : d.typeArticle}
          </span>
          <span className="text-xs text-muted">{d.readingMin(readingMinutes(body))}</span>
        </div>
        <p className="font-semibold leading-snug">{title}</p>
        <p className="text-[13px] text-muted line-clamp-2 leading-relaxed">{excerpt}</p>
      </div>
    </Link>
  )
}

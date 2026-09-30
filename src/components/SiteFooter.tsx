import Link from 'next/link'
import { lp, t, type Locale } from '@/lib/i18n'

export default function SiteFooter({ locale }: { locale: Locale }) {
  const d = t(locale)
  const links = [
    { href: '/points', label: d.nav.points },
    { href: '/meridians', label: d.nav.meridians },
    { href: '/conditions', label: d.nav.conditions },
    { href: '/articles', label: d.nav.articles },
    { href: '/guide', label: d.nav.guide },
    { href: '/about', label: d.footer.about },
    { href: '/privacy', label: d.footer.privacy },
  ]

  return (
    <footer className="border-t border-border mt-12 bg-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={lp(locale, l.href)} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="leading-relaxed">{d.footer.disclaimer}</p>
        <p className="text-xs">© {new Date().getFullYear()} JFK {d.brandSuffix}</p>
      </div>
    </footer>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import AdminNavLink from './AdminNavLink'
import AuthButton from './AuthButton'
import LocaleSwitch from './LocaleSwitch'
import { lp, t, type Locale } from '@/lib/i18n'

export default function SiteHeader({ locale }: { locale: Locale }) {
  const d = t(locale)
  const nav = [
    { href: '/points', label: d.nav.points },
    { href: '/meridians', label: d.nav.meridians },
    { href: '/conditions', label: d.nav.conditions },
    { href: '/guide', label: d.nav.guide },
  ]

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-14 flex items-center gap-2">
          <Link href={lp(locale, '/')} className="flex items-center gap-2 shrink-0">
            <Image src="/logo-mark.png" alt="" width={30} height={30} priority className="rounded-lg" />
            <span className="font-bold text-[17px] tracking-tight">
              JFK<span className="text-muted font-medium"> {d.brandSuffix}</span>
            </span>
          </Link>
          <div className="flex-1" />
          <Suspense fallback={<div className="w-16 h-9" />}>
            <LocaleSwitch locale={locale} />
          </Suspense>
          <AuthButton locale={locale} />
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={lp(locale, n.href)}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-muted hover:text-primary hover:bg-primary-soft transition whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
          <AdminNavLink label={d.nav.admin} locale={locale} />
        </nav>
      </div>
    </header>
  )
}

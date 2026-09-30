'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Languages } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

/** สลับภาษาโดยไปหน้าเดียวกันอีกภาษา (คนละ URL เพื่อให้ Google เก็บได้ทั้งคู่) */
export default function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/'
  const params = useSearchParams()
  const qs = params.toString()

  const bare = pathname.startsWith('/en/') ? pathname.slice(3) : pathname === '/en' ? '/' : pathname
  const target = locale === 'th' ? `/en${bare === '/' ? '' : bare}` : bare

  return (
    <Link
      href={`${target}${qs ? `?${qs}` : ''}`}
      hrefLang={locale === 'th' ? 'en' : 'th'}
      className="h-9 px-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface text-xs font-medium text-muted hover:text-primary hover:border-primary/50 transition whitespace-nowrap"
    >
      <Languages size={14} />
      {locale === 'th' ? 'English' : 'ไทย'}
    </Link>
  )
}

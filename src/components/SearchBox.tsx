'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { lp, t, type Locale } from '@/lib/i18n'

export default function SearchBox({
  autoFocus = false,
  placeholder,
  size = 'md',
  locale = 'th',
}: {
  autoFocus?: boolean
  placeholder?: string
  size?: 'md' | 'lg'
  locale?: Locale
}) {
  const d = t(locale)
  const router = useRouter()
  const params = useSearchParams()
  const paramQ = params.get('q') ?? ''
  const [q, setQ] = useState(paramQ)
  const [syncedQ, setSyncedQ] = useState(paramQ)

  // คำค้นใน URL เปลี่ยน (กดลิงก์/ปุ่มย้อนกลับ) → ปรับค่าในช่องให้ตรง
  if (paramQ !== syncedQ) {
    setSyncedQ(paramQ)
    setQ(paramQ)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    const term = q.trim()
    if (term) sp.set('q', term)
    const species = params.get('species')
    if (species) sp.set('species', species)
    router.push(lp(locale, `/points${sp.toString() ? `?${sp}` : ''}`))
  }

  const h = size === 'lg' ? 'h-14 text-base' : 'h-11 text-sm'

  return (
    <form onSubmit={submit} className="relative">
      <Search
        size={size === 'lg' ? 20 : 17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        enterKeyHint="search"
        placeholder={placeholder ?? d.search.placeholder}
        aria-label={d.search.label}
        className={`w-full ${h} pl-11 pr-11 rounded-full bg-surface border border-border shadow-[var(--shadow)] outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition`}
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ('')}
          aria-label={d.search.clear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
        >
          <X size={17} />
        </button>
      )}
    </form>
  )
}

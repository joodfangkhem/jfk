'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useIsAdmin } from '@/lib/useIsAdmin'
import { lp, type Locale } from '@/lib/i18n'

/** แถบเมนู "ผู้ดูแล" — ขึ้นเฉพาะบัญชีที่เป็นแอดมิน */
export default function AdminNavLink({ label, locale = 'th' }: { label: string; locale?: Locale }) {
  const isAdmin = useIsAdmin()
  const [pending, setPending] = useState(0)

  useEffect(() => {
    if (!isAdmin) return
    const supabase = createClient()
    let alive = true
    supabase.rpc('pending_submission_count').then(({ data }) => {
      if (alive && typeof data === 'number') setPending(data)
    })
    return () => {
      alive = false
    }
  }, [isAdmin])

  if (!isAdmin) return null

  return (
    <Link
      href={lp(locale, '/admin')}
      className="px-3 py-1.5 rounded-full text-sm font-medium text-accent bg-accent-soft border border-accent/20 hover:border-accent/40 transition whitespace-nowrap inline-flex items-center gap-1.5"
    >
      <ShieldCheck size={14} /> {label}
      {pending > 0 && (
        <span className="ml-0.5 min-w-4 h-4 px-1 inline-flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold">
          {pending}
        </span>
      )}
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useIsAdmin } from '@/lib/useIsAdmin'

/** แถบเมนู "ผู้ดูแล" — ขึ้นเฉพาะบัญชีที่เป็นแอดมิน */
export default function AdminNavLink() {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return null

  return (
    <Link
      href="/admin"
      className="px-3 py-1.5 rounded-full text-sm font-medium text-accent bg-accent-soft border border-accent/20 hover:border-accent/40 transition whitespace-nowrap inline-flex items-center gap-1.5"
    >
      <ShieldCheck size={14} /> ผู้ดูแล
    </Link>
  )
}

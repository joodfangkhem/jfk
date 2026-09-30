'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { lp, t, type Locale } from '@/lib/i18n'

export default function AuthButton({ locale = 'th' }: { locale?: Locale }) {
  const d = t(locale)
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return
      setEmail(data.user?.email ?? null)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  if (!ready) return <div className="w-20 h-8" />

  if (!email) {
    return (
      <Link
        href={lp(locale, "/login")}
        className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
      >
        {d.auth.signIn}
      </Link>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <Link
          href="/favorites"
          className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-primary-soft text-primary"
          aria-label={d.auth.saved}
        >
          <Heart size={18} />
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-primary-soft text-primary"
          aria-label={d.auth.account}
        >
          <User size={18} />
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-11 w-56 card p-2 text-sm">
          <p className="px-2 py-1.5 text-xs text-muted truncate">{email}</p>
          <Link
            href="/favorites"
            onClick={() => setOpen(false)}
            className="block px-2 py-2 rounded-lg hover:bg-surface-2"
          >
            {d.auth.saved}
          </Link>
          <Link
            href="/protocols"
            onClick={() => setOpen(false)}
            className="block px-2 py-2 rounded-lg hover:bg-surface-2"
          >
            {d.auth.protocols}
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setOpen(false)
              router.refresh()
            }}
            className="w-full text-left px-2 py-2 rounded-lg hover:bg-surface-2 flex items-center gap-2 text-accent"
          >
            <LogOut size={15} /> {d.auth.signOut}
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { lp, t, type Locale } from '@/lib/i18n'

export default function FavoriteButton({
  pointId,
  code,
  slug,
  locale = 'th',
}: {
  pointId: string
  code: string
  slug: string
  locale?: Locale
}) {
  const d = t(locale)
  const supabase = createClient()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!alive) return
      if (!data.user) {
        setSignedIn(false)
        return
      }
      setSignedIn(true)
      const { data: row } = await supabase
        .from('favorites')
        .select('point_id')
        .eq('point_id', pointId)
        .maybeSingle()
      if (alive) setSaved(!!row)
    })()
    return () => {
      alive = false
    }
  }, [supabase, pointId])

  const toggle = async () => {
    if (signedIn === false) {
      toast(d.photo.saveLoginPrompt)
      router.push(lp(locale, `/login?next=${lp(locale, `/points/${slug}`)}`))
      return
    }
    setBusy(true)
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) {
      setBusy(false)
      router.push('/login')
      return
    }
    if (saved) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('point_id', pointId)
        .eq('user_id', u.user.id)
      if (error) toast.error(d.photo.removeFailed)
      else {
        setSaved(false)
        toast.success(d.photo.removedToast(code))
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ point_id: pointId, user_id: u.user.id })
      if (error) toast.error(d.photo.saveFailed)
      else {
        setSaved(true)
        toast.success(d.photo.savedToast(code))
      }
    }
    setBusy(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={`h-10 px-4 inline-flex items-center gap-2 rounded-full border text-sm font-medium transition active:scale-95 disabled:opacity-60 ${
        saved
          ? 'bg-accent-soft border-accent/30 text-accent'
          : 'bg-surface border-border text-muted hover:text-accent hover:border-accent/40'
      }`}
    >
      <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
      {saved ? d.point.saved : d.point.save}
    </button>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Camera, CheckCircle2, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { resizeImage, formatBytes } from '@/lib/resizeImage'
import { createClient } from '@/lib/supabase/client'
import { lp, t, type Locale } from '@/lib/i18n'

type Submission = {
  id: string
  status: string
  image_url: string
  reject_reason: string | null
}

/** ให้ผู้ใช้ส่งรูปตำแหน่งจุดเข้ามา แอดมินอนุมัติก่อนถึงจะขึ้นเว็บ */
export default function PhotoSubmit({
  pointId,
  slug,
  hasImage,
  imageCount = 0,
  locale = 'th',
}: {
  pointId: string
  slug: string
  hasImage: boolean
  imageCount?: number
  locale?: Locale
}) {
  const d = t(locale)
  const [supabase] = useState(() => createClient())
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [mine, setMine] = useState<Submission | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [credit, setCredit] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!alive) return
      if (!u.user) {
        setSignedIn(false)
        return
      }
      setSignedIn(true)
      const { data } = await supabase
        .from('point_image_submissions')
        .select('id, status, image_url, reject_reason')
        .eq('point_id', pointId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (alive) setMine(data)
    })()
    return () => {
      alive = false
    }
  }, [supabase, pointId])

  if (signedIn === null) return null

  const submit = async () => {
    if (!file) return toast.error(d.photo.pickFirst)
    if (file.size > 25 * 1024 * 1024) return toast.error(d.photo.tooBig)

    setBusy(true)
    // ย่อรูปในเครื่องก่อน จะได้อัปโหลดเร็วและไม่กินพื้นที่
    const small = await resizeImage(file)
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) {
      setBusy(false)
      return
    }

    const ext = small.name.split('.').pop()?.toLowerCase() || 'jpg'
    // ชื่อไฟล์ต้องไม่ซ้ำ จึงต้องใช้เวลาปัจจุบัน — อยู่ใน event handler ไม่ใช่ตอน render
    // eslint-disable-next-line react-hooks/purity
    const stamp = Date.now()
    const path = `submissions/${u.user.id}/${slug}-${stamp}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('point-images')
      .upload(path, small, { cacheControl: '31536000', upsert: false })
    if (upErr) {
      toast.error(d.photo.uploadFailed + upErr.message)
      setBusy(false)
      return
    }

    const { data: pub } = supabase.storage.from('point-images').getPublicUrl(path)

    const { data: row, error } = await supabase
      .from('point_image_submissions')
      .insert({
        point_id: pointId,
        user_id: u.user.id,
        user_email: u.user.email,
        image_url: pub.publicUrl,
        storage_path: path,
        credit: credit.trim() || null,
        note: note.trim() || null,
        status: 'pending',
      })
      .select('id, status, image_url, reject_reason')
      .single()

    setBusy(false)
    if (error) {
      toast.error(d.photo.sendFailed + error.message)
      return
    }
    setMine(row)
    setFile(null)
    setCredit('')
    setNote('')
    toast.success(d.photo.sent)
  }

  const withdraw = async () => {
    if (!mine) return
    setBusy(true)
    const { error } = await supabase.from('point_image_submissions').delete().eq('id', mine.id)
    setBusy(false)
    if (error) return toast.error(d.photo.withdrawFailed)
    setMine(null)
    toast.success(d.photo.withdrawn)
  }

  return (
    <section className="card p-4">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <Camera size={17} className="text-primary" />
        {hasImage ? d.photo.titleMore : d.photo.titleNew}
      </h2>

      {signedIn === false ? (
        <p className="text-sm text-muted leading-relaxed">
          <Link
            href={lp(locale, `/login?next=${lp(locale, `/points/${slug}`)}`)}
            className="text-primary underline"
          >
            {d.note.signIn}
          </Link>{' '}
          {d.photo.signedOut}
        </p>
      ) : mine?.status === 'pending' ? (
        <div className="space-y-2">
          <p className="text-sm flex items-center gap-2 text-warn">
            <Clock size={15} /> {d.photo.pending}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mine.image_url} alt="" className="w-40 rounded-xl border border-border" />
          <button
            onClick={withdraw}
            disabled={busy}
            className="text-xs text-accent hover:underline disabled:opacity-50"
          >
            {d.photo.withdraw}
          </button>
        </div>
      ) : mine?.status === 'approved' ? (
        <p className="text-sm flex items-center gap-2 text-primary">
          <CheckCircle2 size={15} /> {d.photo.approved}
        </p>
      ) : (
        <div className="space-y-3">
          {mine?.status === 'rejected' && (
            <p className="text-sm flex items-start gap-2 text-accent">
              <XCircle size={15} className="mt-0.5 shrink-0" />
              <span>
                {d.photo.rejected}
                {mine.reject_reason ? `: ${mine.reject_reason}` : ''} {d.photo.rejectedTail}
              </span>
            </p>
          )}
          <p className="text-sm text-muted leading-relaxed">
            {hasImage ? d.photo.hasImages(imageCount) : ''}
            {d.photo.tip}
          </p>

          <label className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-surface-2 text-sm font-medium cursor-pointer hover:border-primary hover:text-primary transition">
            <Camera size={16} />
            {file ? `${file.name.slice(0, 20)} (${formatBytes(file.size)})` : d.photo.choose}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <input
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            maxLength={60}
            placeholder={d.photo.creditPlaceholder}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder={d.photo.notePlaceholder}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />

          <button
            onClick={submit}
            disabled={busy || !file}
            className="h-11 px-5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition disabled:opacity-50"
          >
            {busy ? d.photo.submitting : d.photo.submit}
          </button>

          <p className="text-xs text-muted leading-relaxed">
            {d.photo.rules}
          </p>
        </div>
      )}
    </section>
  )
}

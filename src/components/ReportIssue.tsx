'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flag, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useMyRole } from '@/lib/useMyRole'
import { lp, t, type Locale } from '@/lib/i18n'

const KINDS = ['error', 'typo', 'image', 'missing', 'other'] as const
const POINT_FIELDS = [
  'any',
  'name',
  'location',
  'anatomy',
  'functions',
  'indications',
  'needle',
  'caution',
  'other',
] as const
const PAGE_FIELDS = ['any', 'other'] as const

/**
 * กล่อง "ส่งข้อเสนอแก้ไข" — ขึ้นเฉพาะผู้ช่วยตรวจข้อมูลกับแอดมิน
 * คนที่สมัครปกติจะไม่เห็นกล่องนี้เลย (ด่านจริงคือ RLS + trigger ฝั่ง DB)
 */
export default function ReportIssue({
  pointId,
  slug,
  target,
  targetLabel,
  showPhotoHint = false,
  locale = 'th',
}: {
  pointId?: string
  slug?: string
  /** path ของหน้าที่แจ้ง ใช้กับหน้าที่ไม่ใช่จุดฝังเข็ม */
  target?: string
  targetLabel?: string
  showPhotoHint?: boolean
  locale?: Locale
}) {
  const d = t(locale).fb
  const role = useMyRole()
  const [supabase] = useState(() => createClient())
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<(typeof KINDS)[number]>('error')
  const [field, setField] = useState<string>('any')
  const [message, setMessage] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [busy, setBusy] = useState(false)

  if (role.loading || !role.isContributor) return null

  const fields = pointId ? POINT_FIELDS : PAGE_FIELDS

  const submit = async () => {
    if (message.trim().length < 5) return toast.error(d.tooShort)
    setBusy(true)

    const { data: u } = await supabase.auth.getUser()
    if (!u.user) {
      setBusy(false)
      return
    }

    const { error } = await supabase.from('feedback').insert({
      user_id: u.user.id,
      kind,
      point_id: pointId ?? null,
      target: target ?? (slug ? `/points/${slug}` : null),
      target_label: targetLabel ?? null,
      field: field === 'any' ? null : field,
      message: message.trim(),
      suggestion: suggestion.trim() || null,
      status: 'open',
    })

    setBusy(false)
    if (error) return toast.error(d.failed + error.message)

    setMessage('')
    setSuggestion('')
    setOpen(false)
    toast.success(d.sent)
  }

  return (
    <section className="card p-4">
      <h2 className="font-semibold flex items-center gap-2">
        <Flag size={17} className="text-accent" /> {d.reportTitle}
      </h2>

      {!open ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted leading-relaxed">{d.reportIntro}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 text-accent text-sm font-medium active:scale-95 transition"
            >
              <Flag size={15} /> {d.reportOpen}
            </button>
            <Link href={lp(locale, '/feedback')} className="text-xs text-primary hover:underline">
              {d.seeMine}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">{d.kindLabel}</label>
            <div className="flex flex-wrap gap-1.5">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    kind === k
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-2 text-muted border-border hover:text-accent'
                  }`}
                >
                  {d.kind[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted" htmlFor="fb-field">
              {d.fieldLabel}
            </label>
            <select
              id="fb-field"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
            >
              {fields.map((f) => (
                <option key={f} value={f}>
                  {d.field[f as keyof typeof d.field]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted" htmlFor="fb-message">
              {d.messageLabel}
            </label>
            <textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder={d.messagePlaceholder}
              className="w-full p-3 rounded-xl border border-border bg-surface-2 text-sm leading-relaxed outline-none focus:border-primary focus:bg-surface resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted" htmlFor="fb-suggestion">
              {d.suggestionLabel}
            </label>
            <textarea
              id="fb-suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder={d.suggestionPlaceholder}
              className="w-full p-3 rounded-xl border border-border bg-surface-2 text-sm leading-relaxed outline-none focus:border-primary focus:bg-surface resize-y"
            />
          </div>

          {showPhotoHint && kind === 'image' && (
            <p className="text-xs text-muted leading-relaxed">{d.photoHint}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={busy || message.trim().length < 5}
              className="h-11 px-5 inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-sm font-medium active:scale-95 transition disabled:opacity-50"
            >
              <Send size={15} /> {busy ? d.submitting : d.submit}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="h-11 px-4 rounded-full border border-border text-muted text-sm"
            >
              {d.cancel}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

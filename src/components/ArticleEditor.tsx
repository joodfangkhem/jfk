'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, FileSignature, ImagePlus, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { resizeImage } from '@/lib/resizeImage'
import { extractPointCodes } from '@/lib/markdown'
import { lp, t, type Locale } from '@/lib/i18n'

export type EditorArticle = {
  id: string
  slug: string
  type: 'article' | 'case'
  status: 'draft' | 'published'
  title_th: string
  excerpt_th: string | null
  body_th: string
  cover_url: string | null
  cover_alt: string | null
}

export type EditorCase = {
  pet_name: string | null
  species: string | null
  breed: string | null
  sex: string | null
  age_text: string | null
  disclosure: 'full' | 'masked' | 'anonymous'
  complaint: string | null
  diagnosis: string | null
  sessions: string | null
  outcome: string | null
}

export type EditorPrivate = {
  owner_full_name: string | null
  consent_date: string | null
  consent_note: string | null
}

/** บังนามสกุลแบบเดียวกับฟังก์ชัน mask_owner_name ในฐานข้อมูล — ใช้โชว์ตัวอย่างเท่านั้น */
function maskPreview(full: string, level: EditorCase['disclosure']) {
  const name = full.trim()
  if (level === 'anonymous' || !name) return '—'
  if (level === 'full') return name
  const parts = name.split(/\s+/)
  if (parts.length < 2) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}.`
}

export default function ArticleEditor({
  article,
  caseRow,
  privateRow,
  locale,
}: {
  article: EditorArticle
  caseRow: EditorCase | null
  privateRow: EditorPrivate | null
  locale: Locale
}) {
  const d = t(locale).artAdmin
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const [a, setA] = useState(article)
  const [c, setC] = useState<EditorCase>(
    caseRow ?? {
      pet_name: '', species: '', breed: '', sex: '', age_text: '',
      disclosure: 'masked', complaint: '', diagnosis: '', sessions: '', outcome: '',
    }
  )
  const [pv, setPv] = useState<EditorPrivate>(
    privateRow ?? { owner_full_name: '', consent_date: null, consent_note: '' }
  )
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  const isCase = a.type === 'case'
  const codes = extractPointCodes(a.body_th)

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const small = await resizeImage(file)
      // ชื่อไฟล์ต้องไม่ซ้ำ จึงต้องใช้เวลาปัจจุบัน — อยู่ใน event handler ไม่ใช่ตอน render
      const path = `articles/${a.id}-${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('point-images')
        .upload(path, small, { cacheControl: '31536000', upsert: false })
      if (error) {
        toast.error(error.message)
        return null
      }
      return supabase.storage.from('point-images').getPublicUrl(path).data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  const insertAtCursor = (text: string) => {
    const el = bodyRef.current
    if (!el) {
      setA((v) => ({ ...v, body_th: `${v.body_th}\n\n${text}\n` }))
      return
    }
    const start = el.selectionStart
    const next = `${a.body_th.slice(0, start)}\n\n${text}\n\n${a.body_th.slice(el.selectionEnd)}`
    setA((v) => ({ ...v, body_th: next }))
  }

  const save = async () => {
    setBusy(true)
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          slug: a.slug.trim(),
          status: a.status,
          title_th: a.title_th.trim(),
          excerpt_th: a.excerpt_th?.trim() || null,
          body_th: a.body_th,
          cover_url: a.cover_url,
          cover_alt: a.cover_alt?.trim() || null,
        })
        .eq('id', a.id)
      if (error) return toast.error(d.saveFailed + error.message)

      if (isCase) {
        // ลำดับสำคัญ: เขียนชื่อเต็มก่อน แล้วค่อยเขียนระดับการเปิดเผย
        // เพราะ trigger ฝั่ง article_cases อ่านชื่อเต็มจากตารางส่วนตัวมาบังให้
        const { error: pErr } = await supabase.from('article_case_private').upsert({
          article_id: a.id,
          owner_full_name: pv.owner_full_name?.trim() || null,
          consent_level: c.disclosure,
          consent_date: pv.consent_date || null,
          consent_note: pv.consent_note?.trim() || null,
        })
        if (pErr) return toast.error(d.saveFailed + pErr.message)

        const { error: cErr } = await supabase.from('article_cases').upsert({
          article_id: a.id,
          pet_name: c.pet_name?.trim() || null,
          species: c.species || null,
          breed: c.breed?.trim() || null,
          sex: c.sex?.trim() || null,
          age_text: c.age_text?.trim() || null,
          disclosure: c.disclosure,
          complaint: c.complaint?.trim() || null,
          diagnosis: c.diagnosis?.trim() || null,
          sessions: c.sessions?.trim() || null,
          outcome: c.outcome?.trim() || null,
        })
        if (cErr) return toast.error(d.saveFailed + cErr.message)
      }

      // สร้างความเชื่อมโยงกับหน้าจุดใหม่ทุกครั้งจาก [[CODE]] ในเนื้อหา
      await supabase.from('article_points').delete().eq('article_id', a.id)
      if (codes.length) {
        const { data: pts } = await supabase.from('points').select('id, code').in('code', codes)
        if (pts?.length) {
          await supabase
            .from('article_points')
            .insert(pts.map((p) => ({ article_id: a.id, point_id: p.id })))
        }
      }

      toast.success(d.saved)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="card p-4 space-y-3">
        <Field label={d.fieldTitle} value={a.title_th} onChange={(v) => setA({ ...a, title_th: v })} />
        <Field
          label={d.fieldSlug}
          value={a.slug}
          hint={d.slugHint}
          onChange={(v) => setA({ ...a, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
        />
        <div className="flex gap-2">
          <Select
            label={d.fieldStatus}
            value={a.status}
            options={[
              ['draft', d.draft],
              ['published', d.published],
            ]}
            onChange={(v) => setA({ ...a, status: v as EditorArticle['status'] })}
          />
        </div>
        <Area
          label={d.fieldExcerpt}
          value={a.excerpt_th ?? ''}
          rows={2}
          onChange={(v) => setA({ ...a, excerpt_th: v })}
        />
      </section>

      <section className="card p-4 space-y-3">
        <p className="text-xs font-medium text-muted">{d.cover}</p>
        {a.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.cover_url}
            alt=""
            className="w-full max-h-52 object-cover rounded-xl border border-border"
          />
        )}
        <div className="flex gap-2 flex-wrap">
          <UploadButton
            label={uploading ? d.uploading : d.uploadCover}
            disabled={uploading}
            onFile={async (f) => {
              const url = await upload(f)
              if (url) setA((v) => ({ ...v, cover_url: url }))
            }}
          />
          {a.cover_url && (
            <button
              onClick={() => setA({ ...a, cover_url: null })}
              className="h-11 px-4 rounded-full border border-border text-sm text-muted hover:text-accent"
            >
              {d.removeCover}
            </button>
          )}
        </div>
        <Field
          label={d.coverAlt}
          value={a.cover_alt ?? ''}
          onChange={(v) => setA({ ...a, cover_alt: v })}
        />
      </section>

      {isCase && (
        <>
          <section className="card p-4 space-y-3">
            <h2 className="font-semibold text-sm">{d.caseSection}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label={d.petName} value={c.pet_name ?? ''} onChange={(v) => setC({ ...c, pet_name: v })} />
              <Select
                label={d.species}
                value={c.species ?? ''}
                options={[['', '—'], ['dog', 'dog'], ['cat', 'cat'], ['horse', 'horse'], ['cattle', 'cattle'], ['rabbit', 'rabbit']]}
                onChange={(v) => setC({ ...c, species: v })}
              />
              <Field label={d.breed} value={c.breed ?? ''} onChange={(v) => setC({ ...c, breed: v })} />
              <Field label={d.sex} value={c.sex ?? ''} onChange={(v) => setC({ ...c, sex: v })} />
              <Field label={d.age} value={c.age_text ?? ''} onChange={(v) => setC({ ...c, age_text: v })} />
            </div>
            <Area label={d.complaint} value={c.complaint ?? ''} rows={2} onChange={(v) => setC({ ...c, complaint: v })} />
            <Area label={d.diagnosis} value={c.diagnosis ?? ''} rows={2} onChange={(v) => setC({ ...c, diagnosis: v })} />
            <Area label={d.sessions} value={c.sessions ?? ''} rows={2} onChange={(v) => setC({ ...c, sessions: v })} />
            <Area label={d.outcome} value={c.outcome ?? ''} rows={2} onChange={(v) => setC({ ...c, outcome: v })} />
          </section>

          <section className="card p-4 space-y-3 border-accent/30">
            <h2 className="font-semibold text-sm text-accent">{d.privateSection}</h2>
            <Field
              label={d.ownerFullName}
              value={pv.owner_full_name ?? ''}
              hint={d.ownerHint}
              onChange={(v) => setPv({ ...pv, owner_full_name: v })}
            />
            <Select
              label={d.disclosure}
              value={c.disclosure}
              options={[
                ['masked', d.discMasked],
                ['full', d.discFull],
                ['anonymous', d.discAnon],
              ]}
              onChange={(v) => setC({ ...c, disclosure: v as EditorCase['disclosure'] })}
            />
            <p className="text-xs text-muted">
              {d.preview}{' '}
              <strong className="text-text">
                {maskPreview(pv.owner_full_name ?? '', c.disclosure)}
              </strong>
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-muted">{d.consentDate}</span>
                <input
                  type="date"
                  value={pv.consent_date ?? ''}
                  onChange={(e) => setPv({ ...pv, consent_date: e.target.value })}
                  className="mt-1 w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
                />
              </label>
              <Field
                label={d.consentNote}
                value={pv.consent_note ?? ''}
                onChange={(v) => setPv({ ...pv, consent_note: v })}
              />
            </div>
            <div className="pt-1">
              <Link
                href={lp(locale, `/admin/articles/${a.id}/consent`)}
                target="_blank"
                className="h-11 px-4 inline-flex items-center gap-2 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
              >
                <FileSignature size={16} /> {d.consentButton}
              </Link>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">{d.consentHint}</p>
            </div>
          </section>
        </>
      )}

      <section className="card p-4 space-y-2">
        <label className="block">
          <span className="text-xs font-medium text-muted">{d.fieldBody}</span>
          <textarea
            ref={bodyRef}
            value={a.body_th}
            onChange={(e) => setA({ ...a, body_th: e.target.value })}
            rows={20}
            className="mt-1 w-full p-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface leading-relaxed font-mono"
          />
        </label>
        <p className="text-xs text-muted leading-relaxed">{d.bodyHint}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <UploadButton
            label={uploading ? d.uploading : d.insertImage}
            disabled={uploading}
            icon={<ImagePlus size={16} />}
            onFile={async (f) => {
              const url = await upload(f)
              if (url) insertAtCursor(`![](${url})`)
            }}
          />
          {codes.length > 0 && <span className="chip">{d.linked(codes.length)}</span>}
        </div>
      </section>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={save}
          disabled={busy}
          className="h-11 px-5 inline-flex items-center gap-2 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition disabled:opacity-60"
        >
          <Save size={16} /> {busy ? d.saving : d.save}
        </button>
        {a.status === 'published' && (
          <Link
            href={lp(locale, `/articles/${a.slug}`)}
            target="_blank"
            className="h-11 px-4 inline-flex items-center gap-1.5 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
          >
            <ExternalLink size={15} /> {d.openLive}
          </Link>
        )}
      </div>
    </div>
  )
}

function UploadButton({
  label,
  disabled,
  icon,
  onFile,
}: {
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  onFile: (f: File) => void
}) {
  return (
    <label className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-surface-2 text-sm font-medium cursor-pointer hover:border-primary hover:text-primary transition">
      {icon ?? <ImagePlus size={16} />}
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
    </label>
  )
}

function Field({
  label, value, hint, onChange,
}: {
  label: string
  value: string
  hint?: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
      />
      {hint && <span className="block text-xs text-muted mt-1 leading-relaxed">{hint}</span>}
    </label>
  )
}

function Area({
  label, value, rows = 3, onChange,
}: {
  label: string
  value: string
  rows?: number
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full p-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface leading-relaxed"
      />
    </label>
  )
}

function Select({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (v: string) => void
}) {
  return (
    <label className="block flex-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  )
}

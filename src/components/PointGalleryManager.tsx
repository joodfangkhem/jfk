'use client'

import { useEffect, useState } from 'react'
import { ImagePlus, MapPinPlus, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AnnotationEditor from '@/components/AnnotationEditor'
import { CroppedThumb } from '@/components/AnnotatedImage'
import { parseAnnotations, visibleCount, type Annotations } from '@/lib/annotations'
import { createClient } from '@/lib/supabase/client'
import { refreshThumb, thumbPath } from '@/lib/thumb'
import { resizeImage } from '@/lib/resizeImage'
import { revalidatePoint } from '@/lib/revalidate'
import { t, type Locale } from '@/lib/i18n'

type Img = {
  id: string
  image_url: string
  storage_path: string | null
  caption: string | null
  credit: string | null
  is_primary: boolean
  annotations: Annotations | null
  thumb_url?: string | null
}

const MAX = 6

/** จัดการรูปของจุด: เพิ่ม เลือกรูปหลัก แก้คำบรรยาย ลบ (สำหรับแอดมิน) */
export default function PointGalleryManager({
  pointId,
  slug,
  code,
  locale = 'th',
}: {
  pointId: string
  slug: string
  code: string
  locale?: Locale
}) {
  const d = t(locale).gallery
  const [supabase] = useState(() => createClient())
  const [images, setImages] = useState<Img[]>([])
  const [busy, setBusy] = useState(false)
  const [marking, setMarking] = useState<Img | null>(null)

  const fetchImages = async () => {
    const { data } = await supabase
      .from('point_images')
      .select('*')
      .eq('point_id', pointId)
      .order('is_primary', { ascending: false })
      .order('sort_order')
      .order('created_at')
    return (data ?? []).map((r) => ({ ...r, annotations: parseAnnotations(r.annotations) })) as Img[]
  }

  const load = async () => setImages(await fetchImages())

  useEffect(() => {
    let alive = true
    ;(async () => {
      const rows = await fetchImages()
      if (!alive) return
      setImages(rows)
      // รูปที่มาก่อนระบบรูปย่อ หรือทำรูปย่อพลาดไว้ เปิดหน้านี้แล้วซ่อมให้เอง
      // (thumb_url เป็น undefined = ยังไม่ได้รัน migration ไม่ต้องทำ)
      const missing = rows.filter((r) => r.thumb_url === null)
      for (const img of missing) {
        if (!alive) return
        await refreshThumb(supabase, img)
      }
      if (missing.length && alive) {
        const fresh = await fetchImages()
        if (alive) setImages(fresh)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, pointId])

  const upload = async (file: File) => {
    if (images.length >= MAX) return toast.error(d.full(MAX))
    setBusy(true)
    const small = await resizeImage(file)
    // ชื่อไฟล์ต้องไม่ซ้ำ จึงต้องใช้เวลาปัจจุบัน — อยู่ใน event handler ไม่ใช่ตอน render
    // eslint-disable-next-line react-hooks/purity
    const path = `gallery/${slug}-${Date.now()}.jpg`

    const { error: upErr } = await supabase.storage
      .from('point-images')
      .upload(path, small, { cacheControl: '31536000', upsert: false })
    if (upErr) {
      setBusy(false)
      return toast.error(d.uploadFailed + upErr.message)
    }

    const { data: pub } = supabase.storage.from('point-images').getPublicUrl(path)
    const { data: row, error } = await supabase
      .from('point_images')
      .insert({
        point_id: pointId,
        image_url: pub.publicUrl,
        storage_path: path,
        sort_order: images.length,
      })
      .select('id')
      .single()

    if (error) {
      setBusy(false)
      return toast.error(error.message)
    }
    if (images.length === 0 && row) {
      await supabase.rpc('set_primary_point_image', { img_id: row.id })
    }
    if (row) {
      await refreshThumb(supabase, { id: row.id, image_url: pub.publicUrl, annotations: null })
    }
    await load()
    // หน้าจุดฝั่ง public แคชยาว ต้องสะกิดให้สร้างใหม่ทุกครั้งที่รูปเปลี่ยน
    await revalidatePoint(slug)
    setBusy(false)
    toast.success(d.added)
  }

  const setPrimary = async (id: string) => {
    setBusy(true)
    const { error } = await supabase.rpc('set_primary_point_image', { img_id: id })
    await load()
    if (!error) await revalidatePoint(slug)
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success(d.primarySet)
  }

  const remove = async (img: Img) => {
    setBusy(true)
    const { error } = await supabase.rpc('delete_point_image', { img_id: img.id })
    const files = [img.storage_path, thumbPath(img.thumb_url)].filter((f) => f !== null)
    if (!error && files.length) {
      await supabase.storage.from('point-images').remove(files)
    }
    await load()
    if (!error) await revalidatePoint(slug)
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success(d.removed)
  }

  const saveMarks = async (id: string, annotations: Annotations | null) => {
    setBusy(true)
    const { error } = await supabase.from('point_images').update({ annotations }).eq('id', id)
    if (!error) {
      // กรอบครอปหรือจุดที่ชี้เปลี่ยน รูปย่อต้องเปลี่ยนตาม
      const img = images.find((i) => i.id === id)
      if (img) await refreshThumb(supabase, { ...img, annotations })
      await load()
      await revalidatePoint(slug)
    }
    setBusy(false)
    // บันทึกไม่ผ่าน = เปิดตัวแก้ค้างไว้ ป้ายที่เพิ่งวางจะได้ไม่หาย
    if (error) return toast.error(error.message)
    setMarking(null)
    toast.success(t(locale).annotate.saved)
  }

  const saveText = async (id: string, caption: string, credit: string) => {
    setBusy(true)
    const { error } = await supabase
      .from('point_images')
      .update({ caption: caption.trim() || null, credit: credit.trim() || null })
      .eq('id', id)
    // ถ้าเป็นรูปหลัก ให้ sync ข้อความไปที่จุดด้วย
    const img = images.find((i) => i.id === id)
    if (!error && img?.is_primary) await supabase.rpc('set_primary_point_image', { img_id: id })
    await load()
    if (!error) await revalidatePoint(slug)
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success(d.saved)
  }

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{d.title}</h2>
        <span className="chip">{d.count(images.length, MAX)}</span>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted">{d.empty}</p>
      )}

      <div className="space-y-3">
        {images.map((img) => (
          <ImageRow
            key={img.id}
            img={img}
            busy={busy}
            onPrimary={() => setPrimary(img.id)}
            onRemove={() => remove(img)}
            onMark={() => setMarking(img)}
            onSave={(c, cr) => saveText(img.id, c, cr)}
            locale={locale}
          />
        ))}
      </div>

      {images.length < MAX && (
        <label className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-surface-2 text-sm font-medium cursor-pointer hover:border-primary hover:text-primary transition">
          <ImagePlus size={16} />
          {busy ? d.working : d.add}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload(f)
              e.target.value = ''
            }}
          />
        </label>
      )}

      <p className="text-xs text-muted leading-relaxed">{d.note}</p>

      {marking && (
        <AnnotationEditor
          imageUrl={marking.image_url}
          code={code}
          value={marking.annotations}
          busy={busy}
          saveLabel={t(locale).annotate.save}
          locale={locale}
          onClose={() => setMarking(null)}
          onSave={(v) => saveMarks(marking.id, v)}
        />
      )}
    </section>
  )
}

function ImageRow({
  img,
  busy,
  onPrimary,
  onRemove,
  onMark,
  onSave,
  locale,
}: {
  img: Img
  busy: boolean
  onPrimary: () => void
  onRemove: () => void
  onMark: () => void
  onSave: (caption: string, credit: string) => void
  locale: Locale
}) {
  const d = t(locale).gallery
  const [caption, setCaption] = useState(img.caption ?? '')
  const [credit, setCredit] = useState(img.credit ?? '')
  const dirty = caption !== (img.caption ?? '') || credit !== (img.credit ?? '')

  return (
    <div className="flex gap-3 items-start border border-border rounded-xl p-2.5">
      <CroppedThumb
        src={img.image_url}
        data={img.annotations}
        className="w-24 h-24 rounded-lg border border-border shrink-0"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {img.is_primary ? (
            <span className="chip text-primary border-primary/30">
              <Star size={11} fill="currentColor" /> {d.primary}
            </span>
          ) : (
            <button
              onClick={onPrimary}
              disabled={busy}
              className="chip hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <Star size={11} /> {d.makePrimary}
            </button>
          )}
          <button
            onClick={onMark}
            disabled={busy}
            className="chip hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <MapPinPlus size={11} />{' '}
            {img.annotations
              ? t(locale).annotate.editCount(visibleCount(img.annotations))
              : t(locale).annotate.open}
          </button>
        </div>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={80}
          placeholder={d.captionPlaceholder}
          className="w-full h-9 px-3 rounded-lg border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        <div className="flex gap-2">
          <input
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            maxLength={60}
            placeholder={d.creditPlaceholder}
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />
          <button
            onClick={() => onSave(caption, credit)}
            disabled={busy || !dirty}
            className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-medium disabled:opacity-40"
          >
            {d.save}
          </button>
          <button
            onClick={onRemove}
            disabled={busy}
            aria-label={d.removeLabel}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent-soft disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

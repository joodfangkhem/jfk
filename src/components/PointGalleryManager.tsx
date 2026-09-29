'use client'

import { useEffect, useState } from 'react'
import { ImagePlus, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { resizeImage } from '@/lib/resizeImage'

type Img = {
  id: string
  image_url: string
  storage_path: string | null
  caption: string | null
  credit: string | null
  is_primary: boolean
}

const MAX = 6

/** จัดการรูปของจุด: เพิ่ม เลือกรูปหลัก แก้คำบรรยาย ลบ (สำหรับแอดมิน) */
export default function PointGalleryManager({
  pointId,
  slug,
}: {
  pointId: string
  slug: string
}) {
  const [supabase] = useState(() => createClient())
  const [images, setImages] = useState<Img[]>([])
  const [busy, setBusy] = useState(false)

  const fetchImages = async () => {
    const { data } = await supabase
      .from('point_images')
      .select('id, image_url, storage_path, caption, credit, is_primary')
      .eq('point_id', pointId)
      .order('is_primary', { ascending: false })
      .order('sort_order')
      .order('created_at')
    return (data ?? []) as Img[]
  }

  const load = async () => setImages(await fetchImages())

  useEffect(() => {
    let alive = true
    ;(async () => {
      const rows = await fetchImages()
      if (alive) setImages(rows)
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, pointId])

  const upload = async (file: File) => {
    if (images.length >= MAX) return toast.error(`เก็บได้สูงสุด ${MAX} รูป ลบรูปเก่าก่อน`)
    setBusy(true)
    const small = await resizeImage(file)
    const path = `gallery/${slug}-${Date.now()}.jpg`

    const { error: upErr } = await supabase.storage
      .from('point-images')
      .upload(path, small, { cacheControl: '31536000', upsert: false })
    if (upErr) {
      setBusy(false)
      return toast.error('อัปโหลดไม่สำเร็จ: ' + upErr.message)
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
    await load()
    setBusy(false)
    toast.success('เพิ่มรูปแล้ว')
  }

  const setPrimary = async (id: string) => {
    setBusy(true)
    const { error } = await supabase.rpc('set_primary_point_image', { img_id: id })
    await load()
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success('ตั้งเป็นรูปหลักแล้ว')
  }

  const remove = async (img: Img) => {
    setBusy(true)
    const { error } = await supabase.rpc('delete_point_image', { img_id: img.id })
    if (!error && img.storage_path) {
      await supabase.storage.from('point-images').remove([img.storage_path])
    }
    await load()
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success('ลบรูปแล้ว')
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
    setBusy(false)
    if (error) toast.error(error.message)
    else toast.success('บันทึกแล้ว')
  }

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">รูปของจุดนี้</h2>
        <span className="chip">
          {images.length}/{MAX} รูป
        </span>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted">ยังไม่มีรูป — อัปโหลดรูปแรกจะถูกตั้งเป็นรูปหลักอัตโนมัติ</p>
      )}

      <div className="space-y-3">
        {images.map((img) => (
          <ImageRow
            key={img.id}
            img={img}
            busy={busy}
            onPrimary={() => setPrimary(img.id)}
            onRemove={() => remove(img)}
            onSave={(c, cr) => saveText(img.id, c, cr)}
          />
        ))}
      </div>

      {images.length < MAX && (
        <label className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-surface-2 text-sm font-medium cursor-pointer hover:border-primary hover:text-primary transition">
          <ImagePlus size={16} />
          {busy ? 'กำลังทำงาน…' : 'เพิ่มรูป'}
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

      <p className="text-xs text-muted leading-relaxed">
        ระบบย่อรูปให้อัตโนมัติ (ด้านยาว 1600px) · รูปหลักคือรูปที่ขึ้นบนสุดของหน้าจุดและใช้ตอนแชร์ลิงก์
      </p>
    </section>
  )
}

function ImageRow({
  img,
  busy,
  onPrimary,
  onRemove,
  onSave,
}: {
  img: Img
  busy: boolean
  onPrimary: () => void
  onRemove: () => void
  onSave: (caption: string, credit: string) => void
}) {
  const [caption, setCaption] = useState(img.caption ?? '')
  const [credit, setCredit] = useState(img.credit ?? '')
  const dirty = caption !== (img.caption ?? '') || credit !== (img.credit ?? '')

  return (
    <div className="flex gap-3 items-start border border-border rounded-xl p-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.image_url}
        alt=""
        className="w-24 h-24 object-cover rounded-lg border border-border shrink-0"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {img.is_primary ? (
            <span className="chip text-primary border-primary/30">
              <Star size={11} fill="currentColor" /> รูปหลัก
            </span>
          ) : (
            <button
              onClick={onPrimary}
              disabled={busy}
              className="chip hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <Star size={11} /> ตั้งเป็นรูปหลัก
            </button>
          )}
        </div>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={80}
          placeholder="คำบรรยาย เช่น มุมด้านข้าง / พุดเดิ้ลขาสั้น"
          className="w-full h-9 px-3 rounded-lg border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        <div className="flex gap-2">
          <input
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            maxLength={60}
            placeholder="เครดิตภาพ"
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />
          <button
            onClick={() => onSave(caption, credit)}
            disabled={busy || !dirty}
            className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-medium disabled:opacity-40"
          >
            บันทึก
          </button>
          <button
            onClick={onRemove}
            disabled={busy}
            aria-label="ลบรูปนี้"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent-soft disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

import type { SupabaseClient } from '@supabase/supabase-js'
import { squareFor, type Annotations } from '@/lib/annotations'

const SIDE = 160
const BUCKET = 'point-images'
const MARK = `/${BUCKET}/`

/** path ใน bucket จาก public URL (null = ไม่ใช่ไฟล์รูปย่อ ห้ามลบ) */
export function thumbPath(url: string | null | undefined) {
  const path = url?.split(MARK)[1]
  return path?.startsWith('thumbs/') ? path : null
}

/**
 * ย่อรูปในเบราว์เซอร์แล้วอัปโหลด คืน public URL (null = ทำไม่สำเร็จ)
 * หน้าค้นหามีถึง 120 จุด ใช้รูปเต็มไม่ได้ (โควตา Supabase 5 GB/เดือน)
 * และ /_next/image บน Cloudflare ไม่เก็บแคช ย่อใหม่ทุก request
 */
export async function uploadThumb(
  supabase: SupabaseClient,
  imageUrl: string,
  annotations: Annotations | null
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return null
    const bitmap = await createImageBitmap(await res.blob())
    const { width: w, height: h } = bitmap
    const sq = squareFor(annotations ?? { w, h, items: [] })

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIDE
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, sq.x * w, sq.y * h, sq.w * w, sq.h * h, 0, 0, SIDE, SIDE)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.8))
    if (!blob) return null

    // ชื่อใหม่ทุกครั้ง เพราะไฟล์แคชยาว 1 ปี ทับชื่อเดิมแล้วคนเก่าจะเห็นรูปเดิม
    const path = `thumbs/${crypto.randomUUID()}.jpg`
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { cacheControl: '31536000', contentType: 'image/jpeg' })
    if (error) return null
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  } catch {
    return null
  }
}

/** สร้างรูปย่อแล้วผูกกับแถวรูป ลบไฟล์ย่อเก่าทิ้ง — พลาดก็ไม่กระทบรูปหลัก (หน้าค้นหาใช้รูปเต็มแทน) */
export async function refreshThumb(
  supabase: SupabaseClient,
  img: {
    id: string
    image_url: string
    annotations: Annotations | null
    thumb_url?: string | null
  }
): Promise<string | null> {
  const url = await uploadThumb(supabase, img.image_url, img.annotations)
  if (!url) return null
  const { error } = await supabase.from('point_images').update({ thumb_url: url }).eq('id', img.id)
  const drop = thumbPath(error ? url : img.thumb_url)
  if (drop) await supabase.storage.from(BUCKET).remove([drop])
  return error ? null : url
}

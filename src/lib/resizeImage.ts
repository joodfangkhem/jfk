/**
 * ย่อรูปในเบราว์เซอร์ก่อนอัปโหลด
 * มือถือถ่ายมา 3-8 MB → เหลือราว 250-400 KB ซึ่งยังคมพอสำหรับดูตำแหน่งจุด
 * ช่วยให้ไม่ชน quota ของ Supabase (ฟรี 1 GB) และคนส่งอัปโหลดเร็วขึ้น
 */
export async function resizeImage(
  file: File,
  maxSide = 1600,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  // ไฟล์เล็กอยู่แล้วและไม่ใช่ฟอร์แมตแปลก ไม่ต้องยุ่ง
  if (file.size < 400 * 1024 && file.type === 'image/jpeg') return file

  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  )
  if (!blob || blob.size >= file.size) return file

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

import 'server-only'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { siteUrl } from '@/lib/site'

/**
 * สั่งให้หน้า ISR สร้างใหม่ทันทีบน Cloudflare
 *
 * `revalidatePath()` อย่างเดียวไม่มีผลที่นั่น เพราะต้องมี tag cache (D1/KV/DO) ซึ่งเราไม่ได้ตั้ง
 * จึงใช้ทางเดียวกับ memory queue ของ adapter: ขอหน้านั้นผ่าน service binding ของตัวเอง
 * พร้อมรหัส revalidate → Next สร้างใหม่แล้วเขียนทับแคชใน R2 ให้เลย
 *
 * ดาต้าเซ็นเตอร์อื่นที่มีสำเนาอยู่จะได้ของเก่าอีกหนึ่งครั้ง แล้วอัปเดตจาก R2 เอง
 *
 * ผู้เรียกต้องเช็คสิทธิ์แอดมินก่อนเสมอ
 */
export async function refreshPages(paths: string[]) {
  const key = process.env.NEXT_PREVIEW_MODE_ID
  if (!key) return // next dev: ไม่มีแคชให้ล้าง

  let self: { fetch: typeof fetch } | undefined
  try {
    const { env } = getCloudflareContext()
    self = (env as { WORKER_SELF_REFERENCE?: { fetch: typeof fetch } }).WORKER_SELF_REFERENCE
  } catch {
    return // ไม่ได้รันบน Cloudflare
  }
  if (!self) return

  // คำขอ revalidate ข้าม proxy.ts ไปเลย จึงต้องใช้ path ภายในที่มี /th นำหน้า
  // ถ้าใช้ URL สาธารณะ หน้าไทยจะได้ 404 ทั้งที่ header ยังบอกว่า REVALIDATED
  const urls = paths.flatMap((p) => ['th', 'en'].map((l) => `${siteUrl}/${l}${p === '/' ? '' : p}`))
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await self.fetch(url, {
          method: 'HEAD',
          headers: { 'x-prerender-revalidate': key, 'x-isr': '1' },
          signal: AbortSignal.timeout(10_000),
        })
        if (res.status !== 200 || res.headers.get('x-nextjs-cache') !== 'REVALIDATED') {
          console.error(`refreshPages: ${url} ไม่ถูกสร้างใหม่ (${res.status})`)
        }
        await res.body?.cancel()
      } catch (e) {
        // ล้างแคชไม่ได้ ไม่ควรทำให้การบันทึกที่สำเร็จไปแล้วดูเหมือนล้มเหลว
        console.error(`refreshPages: ${url}`, e)
      }
    })
  )
}

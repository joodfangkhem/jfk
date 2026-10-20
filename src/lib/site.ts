/**
 * URL ของเว็บ ใช้ทำ canonical / og / sitemap / robots
 *
 * บน Cloudflare **ต้องตั้ง `NEXT_PUBLIC_SITE_URL` เอง** — ไม่มีตัวแปรที่แพลตฟอร์ม
 * ใส่โดเมนจริงมาให้เหมือน `VERCEL_PROJECT_PRODUCTION_URL` ของ Vercel
 * ถ้าลืมตั้งแล้วปล่อยให้ fallback เป็น localhost จะได้ canonical กับ sitemap
 * ที่ชี้ localhost ทั้งเว็บ ซึ่ง Google เก็บไปแล้วแก้ทีหลังเจ็บตัว จึงให้ build พังไว้ก่อน
 */
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '')

if (process.env.NODE_ENV === 'production' && !/^https:\/\//.test(configured)) {
  // ดักทั้งกรณีไม่ได้ตั้ง และกรณีตั้งเป็น localhost ซึ่งเจ็บกว่า เพราะ build ผ่านเงียบ ๆ
  // แล้วส่ง canonical กับ sitemap ที่ชี้ localhost ออกไปให้ Google ทั้งเว็บ
  throw new Error(
    `NEXT_PUBLIC_SITE_URL ต้องเป็น https ของโดเมนจริง (เช่น https://joodfangkhem.com) แต่ได้ ${configured || '(ว่าง)'} — ` +
      'ถ้า build จากเครื่องตัวเอง ให้ลบบรรทัดนี้ออกจาก .env.local แล้วปล่อยให้ .env.production ทำงาน'
  )
}

export const siteUrl = (configured || 'http://localhost:3005').replace(/\/$/, '')

/** ลิงก์ hreflang บอก Google ว่าสองภาษานี้คือหน้าเดียวกัน */
export function altLanguages(path: string) {
  const p = path === '/' ? '' : path
  return {
    th: `${siteUrl}${p || '/'}`,
    en: `${siteUrl}/en${p}`,
    'x-default': `${siteUrl}${p || '/'}`,
  }
}

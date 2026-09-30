/**
 * URL ของเว็บ ใช้ทำ canonical / og / sitemap / robots
 * ลำดับการหา: ค่าที่ตั้งเอง → โดเมน production ที่ Vercel ใส่ให้ตอน build → localhost
 * (VERCEL_PROJECT_PRODUCTION_URL มาโดยไม่ต้องตั้งเอง ทำให้ deploy ครั้งแรกได้ค่าถูกเลย)
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3005')
).replace(/\/$/, '')

/** ลิงก์ hreflang บอก Google ว่าสองภาษานี้คือหน้าเดียวกัน */
export function altLanguages(path: string) {
  const p = path === '/' ? '' : path
  return {
    th: `${siteUrl}${p || '/'}`,
    en: `${siteUrl}/en${p}`,
    'x-default': `${siteUrl}${p || '/'}`,
  }
}

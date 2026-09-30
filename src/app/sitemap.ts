import type { MetadataRoute } from 'next'
import { getAllPoints, getConditions, getMeridians } from '@/lib/queries'
import { siteUrl as base } from '@/lib/site'

export const revalidate = 3600

/** หนึ่งหน้า = สองรายการ (ไทย/อังกฤษ) พร้อม hreflang บอกว่าเป็นหน้าเดียวกัน */
function entry(path: string, priority: number, now: Date): MetadataRoute.Sitemap {
  const p = path === '/' ? '' : path
  const languages = { th: `${base}${p || '/'}`, en: `${base}/en${p}` }
  return [
    { url: `${base}${p || '/'}`, lastModified: now, priority, alternates: { languages } },
    { url: `${base}/en${p}`, lastModified: now, priority: priority * 0.9, alternates: { languages } },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [points, meridians, conditions] = await Promise.all([
    getAllPoints(),
    getMeridians(),
    getConditions(),
  ])
  const now = new Date()

  return [
    ...entry('/', 1, now),
    ...entry('/points', 0.9, now),
    ...entry('/meridians', 0.8, now),
    ...entry('/conditions', 0.9, now),
    ...entry('/guide', 0.7, now),
    ...entry('/about', 0.4, now),
    ...entry('/privacy', 0.3, now),
    ...points.flatMap((p) => entry(`/points/${p.slug}`, p.is_common ? 0.8 : 0.6, now)),
    ...meridians.flatMap((m) => entry(`/meridians/${m.slug}`, 0.7, now)),
    ...conditions.flatMap((c) => entry(`/conditions/${c.slug}`, 0.8, now)),
  ]
}

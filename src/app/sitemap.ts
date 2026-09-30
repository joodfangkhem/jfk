import type { MetadataRoute } from 'next'
import { getAllPoints, getArticles, getConditions, getMeridians } from '@/lib/queries'
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
  const [points, meridians, conditions, articles] = await Promise.all([
    getAllPoints(),
    getMeridians(),
    getConditions(),
    getArticles(),
  ])
  const hasCases = articles.some((a) => a.type === 'case')
  const now = new Date()

  return [
    ...entry('/', 1, now),
    ...entry('/points', 0.9, now),
    ...entry('/meridians', 0.8, now),
    ...entry('/conditions', 0.9, now),
    ...entry('/guide', 0.7, now),
    ...(articles.length ? entry('/articles', 0.8, now) : []),
    ...(hasCases ? entry('/cases', 0.8, now) : []),
    ...entry('/about', 0.4, now),
    ...entry('/privacy', 0.3, now),
    ...points.flatMap((p) => entry(`/points/${p.slug}`, p.is_common ? 0.8 : 0.6, now)),
    ...meridians.flatMap((m) => entry(`/meridians/${m.slug}`, 0.7, now)),
    ...conditions.flatMap((c) => entry(`/conditions/${c.slug}`, 0.8, now)),
    ...articles.flatMap((a) => entry(`/articles/${a.slug}`, 0.7, now)),
  ]
}

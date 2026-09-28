import type { MetadataRoute } from 'next'
import { getAllPoints, getConditions, getMeridians } from '@/lib/queries'
import { siteUrl as base } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [points, meridians, conditions] = await Promise.all([
    getAllPoints(),
    getMeridians(),
    getConditions(),
  ])

  const now = new Date()

  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/points`, lastModified: now, priority: 0.9 },
    { url: `${base}/meridians`, lastModified: now, priority: 0.8 },
    { url: `${base}/conditions`, lastModified: now, priority: 0.9 },
    { url: `${base}/guide`, lastModified: now, priority: 0.7 },
    { url: `${base}/about`, lastModified: now, priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.3 },
    ...points.map((p) => ({
      url: `${base}/points/${p.slug}`,
      lastModified: now,
      priority: p.is_common ? 0.8 : 0.6,
    })),
    ...meridians.map((m) => ({ url: `${base}/meridians/${m.slug}`, lastModified: now, priority: 0.7 })),
    ...conditions.map((c) => ({ url: `${base}/conditions/${c.slug}`, lastModified: now, priority: 0.8 })),
  ]
}

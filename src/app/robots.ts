import type { MetadataRoute } from 'next'
import { siteUrl as base } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/favorites', '/protocols', '/admin', '/login', '/auth',
          '/en/favorites', '/en/protocols', '/en/admin', '/en/login', '/en/auth',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}

import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://jfk-vet.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/favorites', '/protocols', '/admin', '/login', '/auth'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}

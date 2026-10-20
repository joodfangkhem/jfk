import type { MetadataRoute } from 'next'
import { siteUrl as base } from '@/lib/site'

/** หน้าหลังล็อกอิน ไม่มีอะไรให้ Google เก็บ */
const PRIVATE = ['/favorites', '/protocols', '/admin', '/login', '/auth']

/**
 * หน้าค้นหาจุดรับ ?q= ?species= ?meridian= จึงเป็น dynamic ทุกครั้ง (แคชไม่ได้)
 * ชิปตัวกรองบนหน้านั้นสร้างคอมบิเนชันได้เป็นร้อย ถ้าปล่อยให้บอทไล่เก็บ
 * จะกลายเป็น crawler trap ที่เผา CPU ทิ้งโดยไม่ได้หน้า index เพิ่มเลย
 * (prefix matching ของ robots.txt: ปิดแค่ที่มี ? ต่อท้าย ตัว /points เปล่ายังเก็บได้)
 */
const QUERY_TRAPS = ['/points?', '/en/points?']

/** บอท AI ที่ดูดเนื้อหาไปเทรนโดยไม่ส่งคนกลับมา — ไม่ได้ช่วยทั้ง SEO และ AdSense */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'FacebookBot',
  'PerplexityBot',
  'Applebot-Extended',
  'Diffbot',
  'ImagesiftBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          ...PRIVATE,
          ...PRIVATE.map((p) => `/en${p}`),
          ...QUERY_TRAPS,
        ],
      },
      { userAgent: AI_CRAWLERS, disallow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}

import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { siteUrl } from '@/lib/site'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import '../globals.css'

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const en = locale === 'en'

  const title = en
    ? 'JFK — Veterinary Acupuncture Point Reference'
    : 'JFK จุดฝังเข็ม — คู่มือจุดฝังเข็มในสัตว์'
  const description = en
    ? 'A reference of acupuncture points in dogs and cats: search by point code, name or clinical sign, with locations, actions, needling technique and the points used most, channel by channel. For veterinarians and TCVM students.'
    : 'รวบรวมจุดฝังเข็มในสัตว์ (สุนัข แมว) ค้นหาด้วยรหัสจุด ชื่อ หรืออาการ ดูตำแหน่ง สรรพคุณ เทคนิคการปัก และจุดที่ใช้บ่อยตามเส้นลมปราณ สำหรับสัตวแพทย์และผู้เรียน TCVM'

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: en ? '%s · JFK Vet Acupuncture' : '%s · JFK จุดฝังเข็ม' },
    description,
    keywords: en
      ? ['veterinary acupuncture', 'dog acupuncture', 'cat acupuncture', 'TCVM',
         'acupuncture points', 'meridians', 'IVDD acupuncture', 'transpositional points']
      : ['ฝังเข็มสัตว์', 'จุดฝังเข็ม', 'acupuncture สุนัข', 'acupuncture แมว',
         'TCVM', 'เส้นลมปราณ', 'veterinary acupuncture', 'จุดฝังเข็มหมา'],
    openGraph: {
      type: 'website',
      locale: en ? 'en_US' : 'th_TH',
      siteName: en ? 'JFK Vet Acupuncture' : 'JFK จุดฝังเข็ม',
      url: en ? `${siteUrl}/en` : siteUrl,
      title,
      description: en
        ? 'Search veterinary acupuncture points by code, name or clinical sign, with location, actions and needling technique.'
        : 'ค้นหาจุดฝังเข็มในสัตว์ด้วยรหัสจุด ชื่อ หรืออาการ พร้อมตำแหน่ง สรรพคุณ และเทคนิคการปัก',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'JFK' }],
    },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
    robots: { index: true, follow: true },
    ...(adsClient ? { other: { 'google-adsense-account': adsClient } } : {}),
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'

  return (
    <html lang={locale}>
      <head>
        {/* ใช้ <script> ธรรมดาแทน next/script เพราะ next/script ออกมาเป็นแค่ link rel=preload
            ใน HTML ทำให้ crawler ของ AdSense หาโค้ดไม่เจอและยืนยันเว็บไม่ผ่าน */}
        {adsClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${plex.className} min-h-dvh flex flex-col`}>
        <SiteHeader locale={locale} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} />
        <Toaster position="top-center" toastOptions={{ style: { fontSize: 14 } }} />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import Script from 'next/script'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

const plex = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jfk-vet.vercel.app'
const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JFK จุดฝังเข็ม — คู่มือจุดฝังเข็มในสัตว์',
    template: '%s · JFK จุดฝังเข็ม',
  },
  description:
    'รวบรวมจุดฝังเข็มในสัตว์ (สุนัข แมว) ค้นหาด้วยรหัสจุด ชื่อ หรืออาการ ดูตำแหน่ง สรรพคุณ เทคนิคการปัก และจุดที่ใช้บ่อยตามเส้นลมปราณ สำหรับสัตวแพทย์และผู้เรียน TCVM',
  keywords: [
    'ฝังเข็มสัตว์', 'จุดฝังเข็ม', 'acupuncture สุนัข', 'acupuncture แมว',
    'TCVM', 'เส้นลมปราณ', 'veterinary acupuncture', 'จุดฝังเข็มหมา',
  ],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'JFK จุดฝังเข็ม',
    url: siteUrl,
    title: 'JFK จุดฝังเข็ม — คู่มือจุดฝังเข็มในสัตว์',
    description:
      'ค้นหาจุดฝังเข็มในสัตว์ด้วยรหัสจุด ชื่อ หรืออาการ พร้อมตำแหน่ง สรรพคุณ และเทคนิคการปัก',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        {adsClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${plex.className} min-h-dvh flex flex-col`}>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Toaster position="top-center" toastOptions={{ style: { fontSize: 14 } }} />
      </body>
    </html>
  )
}

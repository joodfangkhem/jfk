import type { Metadata } from 'next'
import { isLocale, lp, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return {
    alternates: { canonical: lp(locale, '/privacy'), languages: altLanguages('/privacy') },
    title: locale === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว',
    description:
      locale === 'en'
        ? 'What JFK stores, how it is used, cookies and advertising.'
        : 'ข้อมูลที่ JFK จุดฝังเข็ม เก็บ วิธีใช้ คุกกี้ และโฆษณา',
  }
}

const sections = {
  th: [
    ['ข้อมูลที่เราเก็บ', 'หากคุณเข้าสู่ระบบด้วย Google เราจะเก็บอีเมลและรหัสผู้ใช้ที่ Google ส่งมาให้เท่านั้น เพื่อผูกกับข้อมูลที่คุณบันทึกไว้ (จุดที่บันทึก โน้ต ชุดจุด และรูปที่ส่งเข้ามา) เราไม่เก็บรหัสผ่านของคุณ และไม่เข้าถึงข้อมูลอื่นในบัญชี Google ของคุณ'],
    ['ข้อมูลของคุณเป็นส่วนตัว', 'จุดที่บันทึก โน้ต และชุดจุดของคุณ ถูกจำกัดสิทธิ์ให้เข้าถึงได้เฉพาะบัญชีของคุณ ผู้ใช้อื่นไม่เห็นข้อมูลเหล่านี้ คุณลบข้อมูลหรือเลิกใช้งานได้ตลอดเวลา'],
    ['รูปที่คุณส่งเข้ามา', 'ถ้าคุณส่งรูปจุดเข้ามา แอดมินจะเห็นรูป อีเมลของคุณ และข้อความที่แนบมาเพื่อใช้พิจารณา เมื่อรูปได้รับอนุมัติ รูปนั้นจะแสดงบนหน้าเว็บสาธารณะ พร้อมชื่อเครดิตที่คุณระบุ (ถ้าไม่ระบุก็ไม่แสดงชื่อ) — อีเมลของคุณไม่ถูกเผยแพร่'],
    ['คุกกี้', 'เราใช้คุกกี้เท่าที่จำเป็นเพื่อคงสถานะการเข้าสู่ระบบ หากมีการแสดงโฆษณา ผู้ให้บริการโฆษณาอาจใช้คุกกี้ของตนเองเพื่อวัดผลและแสดงโฆษณาที่เกี่ยวข้อง'],
    ['โฆษณา', 'เว็บนี้แสดงโฆษณาผ่าน Google AdSense ซึ่งเป็นผู้ให้บริการภายนอก Google อาจใช้คุกกี้ในการแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้และเว็บไซต์อื่น คุณสามารถปิดการปรับโฆษณาตามความสนใจได้ที่การตั้งค่าโฆษณาของ Google (google.com/settings/ads)'],
    ['ผู้ให้บริการที่เราใช้', 'การยืนยันตัวตนและฐานข้อมูลใช้บริการ Supabase การโฮสต์เว็บใช้บริการ Vercel ผู้ให้บริการเหล่านี้ประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการ'],
    ['ติดต่อและลบข้อมูล', 'หากต้องการให้ลบบัญชีและข้อมูลทั้งหมดของคุณ ติดต่อผู้ดูแลเว็บไซต์ เราจะลบให้ภายในเวลาอันสมควร'],
  ],
  en: [
    ['What We Store', 'If you sign in with Google we store only the email address and user id Google gives us, so we can attach what you save (saved points, notes, protocols and submitted photos) to your account. We never see your password and do not access anything else in your Google account.'],
    ['Your Data Is Private', 'Your saved points, notes and protocols are restricted to your account at the database level. Other users cannot read them. You can delete them or stop using the site at any time.'],
    ['Photos You Submit', 'If you submit a photo of a point, an admin sees the image, your email address and any message you attach, in order to review it. Once approved, the photo appears publicly with the credit name you chose (none is shown if you leave it blank). Your email address is never published.'],
    ['Cookies', 'We use only the cookies needed to keep you signed in. Where advertising is shown, the ad provider may set its own cookies to measure and select ads.'],
    ['Advertising', 'This site shows ads through Google AdSense, a third-party provider. Google may use cookies to serve ads based on your visits to this and other sites. You can turn off personalised advertising in Google’s ad settings (google.com/settings/ads).'],
    ['Processors We Use', 'Authentication and the database run on Supabase; hosting is on Vercel. Both process data only as needed to provide the service.'],
    ['Contact and Deletion', 'To have your account and all of your data deleted, contact the site administrator and we will remove it within a reasonable time.'],
  ],
} as const

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold">
        {locale === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
      </h1>
      <div className="card p-4 space-y-4 text-[15px] leading-relaxed">
        {sections[locale].map(([title, body]) => (
          <section key={title}>
            <h2 className="font-semibold mb-1">{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
    </main>
  )
}

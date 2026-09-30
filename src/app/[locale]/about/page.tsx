import type { Metadata } from 'next'
import Link from 'next/link'
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
    alternates: { canonical: lp(locale, '/about'), languages: altLanguages('/about') },
    title: locale === 'en' ? 'About JFK' : 'เกี่ยวกับ JFK จุดฝังเข็ม',
    description:
      locale === 'en'
        ? 'JFK (Jood Fang Khem) is a reference of veterinary acupuncture points for dogs and cats, for veterinarians and TCVM students.'
        : 'JFK (Jood Fang Khem) คู่มืออ้างอิงจุดฝังเข็มในสัตว์ภาษาไทย รวบรวมจุดที่ใช้บ่อยในสุนัขและแมว',
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const en = locale === 'en'

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold">{en ? 'About JFK' : 'เกี่ยวกับ JFK จุดฝังเข็ม'}</h1>

      <div className="card p-4 space-y-3 text-[15px] leading-relaxed">
        {en ? (
          <>
            <p>
              <strong>JFK</strong> stands for <strong>Jood Fang Khem</strong> (จุดฝังเข็ม, “acupuncture
              point”). It exists because looking a point up in a thick textbook or an old slide deck is
              too slow when there is a patient on the table.
            </p>
            <p>
              The site covers the points used in small animals — dogs and cats. Search by point code,
              Chinese name or clinical sign; each point gives a location described from palpable bony
              landmarks, its TCVM actions, needling technique and cautions.
            </p>
            <p>
              <strong>Where the data comes from:</strong> locations follow the transpositional system
              taught in the international veterinary acupuncture curricula (IVAS / Chi Institute), which
              maps human point locations onto animal anatomy. Texts differ slightly from one another, so
              always confirm the landmarks by palpation. Points marked <em>Needs Review</em> are ones
              rarely used in animals, where the transposition is much less standardised.
            </p>
            <p>
              <strong>Photographs:</strong> we are photographing real cases point by point. Signed-in
              users can submit their own photos, which an admin reviews before they appear.
            </p>
            <p>
              <strong>Accounts:</strong> all content is free to read without signing in. Google sign-in
              only exists so you can save points, keep private notes on them and build your own point
              protocols.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>JFK</strong> ย่อมาจาก <strong>Jood Fang Khem</strong> (จุดฝังเข็ม) —
              คู่มืออ้างอิงภาษาไทยสำหรับจุดฝังเข็มในสัตว์ ทำขึ้นเพราะเวลาอยู่หน้าเคสจริง
              การเปิดหาตำแหน่งจุดจากตำราเล่มหนาหรือสไลด์เก่ามันช้าเกินไป
            </p>
            <p>
              เว็บนี้รวบรวมจุดที่ใช้ในสัตว์เล็ก (สุนัขและแมว) ค้นได้จากรหัสจุด ชื่อจีน
              ชื่อไทย หรืออาการ ดูตำแหน่งแบบอิง landmark กระดูกที่คลำได้จริง
              พร้อมสรรพคุณตามทฤษฎี TCVM เทคนิคการปัก และข้อควรระวัง
            </p>
            <p>
              <strong>ที่มาของข้อมูล:</strong> ตำแหน่งจุดอ้างอิงระบบ transpositional ที่ใช้ในหลักสูตร
              สัตวแพทย์ฝังเข็มสากล (IVAS / Chi Institute) ซึ่งแปลงตำแหน่งจุดของมนุษย์มาสู่กายวิภาคสัตว์
              ทั้งนี้ตำราแต่ละสำนักระบุตำแหน่งคลาดเคลื่อนกันได้เล็กน้อย จึงควรคลำยืนยัน landmark จริงทุกครั้ง
              จุดที่ติดป้าย <em>รอตรวจสอบ</em> คือจุดที่ใช้ไม่บ่อยในสัตว์ ซึ่งตำแหน่งยิ่งไม่ได้มาตรฐาน
            </p>
            <p>
              <strong>รูปภาพ:</strong> กำลังถ่ายรูปตำแหน่งจุดจากเคสจริงเพื่อมาใส่ทีละจุด
              ผู้ใช้ที่ล็อกอินส่งรูปเข้ามาช่วยได้ โดยแอดมินจะตรวจก่อนขึ้นเว็บ
            </p>
            <p>
              <strong>บัญชีผู้ใช้:</strong> เนื้อหาทั้งหมดอ่านได้ฟรีไม่ต้องล็อกอิน
              การเข้าสู่ระบบด้วย Google มีไว้เพื่อบันทึกจุดที่ใช้บ่อย จดโน้ตของตัวเองที่แต่ละจุด
              และสร้างชุดจุด (protocol) ของตัวเองเท่านั้น
            </p>
          </>
        )}
      </div>

      <div className="card p-4 bg-warn-soft border-warn/25 text-[15px] leading-relaxed text-text/85">
        <p>
          {en ? (
            <>
              <strong>Disclaimer:</strong> this site is for education and reference. It is not medical
              advice for an individual patient. Veterinary acupuncture must be performed by a trained
              veterinarian, alongside conventional diagnosis and treatment. If an animal is unwell, see a
              veterinarian.
            </>
          ) : (
            <>
              <strong>ข้อจำกัดความรับผิด:</strong> เนื้อหาบนเว็บนี้มีวัตถุประสงค์เพื่อการศึกษาและอ้างอิง
              ไม่ใช่คำแนะนำทางการแพทย์สำหรับสัตว์ป่วยรายตัว การฝังเข็มในสัตว์ต้องทำโดยสัตวแพทย์
              ที่ผ่านการอบรม และใช้ควบคู่ไปกับการวินิจฉัยและการรักษาตามหลักการแพทย์แผนปัจจุบัน
              หากสัตว์มีอาการผิดปกติ ให้พาไปพบสัตวแพทย์
            </>
          )}
        </p>
      </div>

      <p className="text-sm text-muted">
        <Link href={lp(locale, '/privacy')} className="text-primary underline">
          {en ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
        </Link>
      </p>
    </main>
  )
}

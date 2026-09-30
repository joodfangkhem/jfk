import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PrintButton from '@/components/PrintButton'
import { isLocale, lp, type Locale } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'หนังสือยินยอมให้เผยแพร่',
  robots: { index: false, follow: false },
}

/**
 * ใบขออนุญาตเจ้าของสัตว์ — เป็นหน้าสำหรับพิมพ์ ไม่ได้สร้างไฟล์ PDF เอง
 * เบราว์เซอร์จัดการเรนเดอร์ฟอนต์ไทยให้ถูกต้อง แล้วเลือก "Save as PDF" ได้
 * ภาษาไทยอย่างเดียว เพราะเป็นเอกสารที่เจ้าของสัตว์ในไทยเป็นคนเซ็น
 */
export default async function ConsentSheetPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale: raw, id } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle()
  if (!admin) notFound()

  const { data: article } = await supabase
    .from('articles')
    .select('id, title_th, authors (name_th, credential, license_no)')
    .eq('id', id)
    .maybeSingle()
  if (!article) notFound()

  const [{ data: c }, { data: pv }] = await Promise.all([
    supabase
      .from('article_cases')
      .select('pet_name, species, breed, sex, age_text')
      .eq('article_id', id)
      .maybeSingle(),
    supabase
      .from('article_case_private')
      .select('owner_full_name, consent_level, consent_date')
      .eq('article_id', id)
      .maybeSingle(),
  ])

  const author = (article.authors ?? null) as unknown as {
    name_th: string
    credential: string | null
    license_no: string | null
  } | null

  // ติ๊กช่องให้เฉพาะเมื่อบันทึกวันที่ขออนุญาตไว้แล้ว = คุยกับเจ้าของมาแล้ว
  // ถ้ายังไม่มีวันที่ ให้พิมพ์ออกมาเป็นใบเปล่าไปให้เจ้าของติ๊กเอง
  const signed = Boolean(pv?.consent_date)
  const box = (level: string) => (signed && pv?.consent_level === level ? '☑' : '☐')

  const line = (v?: string | null) => v?.trim() || '_______________________'

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="no-print flex items-center gap-3 flex-wrap">
        <Link
          href={lp(locale, `/admin/articles/${id}`)}
          className="text-sm text-primary hover:underline"
        >
          ← กลับไปหน้าแก้ไข
        </Link>
        <PrintButton label="พิมพ์ / บันทึกเป็น PDF" />
      </div>

      <p className="no-print text-xs text-muted leading-relaxed">
        {signed
          ? 'ติ๊กช่องตามที่บันทึกไว้ในระบบแล้ว เพราะมีวันที่ขออนุญาตอยู่'
          : 'ยังไม่ได้บันทึกวันที่ขออนุญาต จึงพิมพ์เป็นใบเปล่าให้เจ้าของติ๊กเอง'}{' '}
        · ใบที่เซ็นแล้วให้เก็บไว้ที่คลินิกเหมือนเวชระเบียน อย่าอัปโหลดขึ้นเว็บ
      </p>

      <article className="print-sheet card p-8 space-y-5 text-[15px] leading-relaxed">
        <header className="text-center space-y-1">
          <h1 className="text-lg font-bold">หนังสือยินยอมให้เผยแพร่ข้อมูลและภาพของสัตว์เลี้ยง</h1>
          <p className="text-xs text-muted">เพื่อการศึกษาและเผยแพร่ความรู้ทางสัตวแพทย์</p>
        </header>

        <section className="space-y-2">
          <p>
            ข้าพเจ้า <strong>{line(pv?.owner_full_name)}</strong> เจ้าของสัตว์ที่ระบุข้างล่างนี้
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <p>ชื่อสัตว์ {line(c?.pet_name)}</p>
            <p>ชนิดสัตว์ {line(c?.species)}</p>
            <p>พันธุ์ {line(c?.breed)}</p>
            <p>เพศ {line(c?.sex)}</p>
            <p>อายุ {line(c?.age_text)}</p>
          </div>
        </section>

        <section className="space-y-2">
          <p>
            ยินยอมให้ {author ? <strong>{author.name_th}</strong> : line(null)} นำข้อมูลการรักษาและ
            ภาพถ่ายของสัตว์ข้างต้น ไปเผยแพร่บนเว็บไซต์ joodfangkhem.com ภายใต้ขอบเขตต่อไปนี้
          </p>
        </section>

        <section className="space-y-1.5">
          <p className="font-semibold">การเปิดเผยชื่อเจ้าของ (เลือกหนึ่งข้อ)</p>
          <p>{box('full')} เปิดเผยชื่อ-นามสกุลเต็ม</p>
          <p>{box('masked')} เปิดเผยชื่อต้น และย่อนามสกุลเหลืออักษรแรก เช่น “สมชาย ร.”</p>
          <p>{box('anonymous')} ไม่ระบุชื่อเจ้าของเลย</p>
        </section>

        <section className="space-y-1.5">
          <p className="font-semibold">ข้อมูลที่ยินยอมให้เผยแพร่ (เลือกได้มากกว่าหนึ่งข้อ)</p>
          <p>☐ ข้อมูลทางคลินิก — อาการ การวินิจฉัย แนวทางการรักษา และผลลัพธ์</p>
          <p>☐ ภาพถ่ายสัตว์</p>
          <p>☐ ภาพถ่ายที่เห็นตำแหน่งการฝังเข็มบนตัวสัตว์</p>
        </section>

        <section className="space-y-1.5">
          <p className="font-semibold">ข้าพเจ้าเข้าใจว่า</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>
              ข้อมูลและภาพที่เผยแพร่จะปรากฏบนอินเทอร์เน็ตซึ่งบุคคลทั่วไปเข้าถึงได้
              และอาจถูกค้นหาหรือทำสำเนาต่อโดยบุคคลอื่น
            </li>
            <li>ข้อมูลติดต่อของข้าพเจ้า เช่น เบอร์โทรศัพท์และอีเมล จะไม่ถูกเผยแพร่</li>
            <li>
              ข้าพเจ้าขอให้ยกเลิกการเผยแพร่ได้ตลอดเวลา โดยแจ้งมาที่ผู้รับผิดชอบเว็บไซต์
              ซึ่งจะนำออกภายในเวลาอันสมควร แต่ไม่อาจเรียกคืนสำเนาที่บุคคลภายนอกทำซ้ำไปแล้ว
            </li>
            <li>
              การให้ความยินยอมนี้เป็นไปโดยสมัครใจ
              และการไม่ให้ความยินยอมจะไม่มีผลต่อการรักษาสัตว์ของข้าพเจ้าแต่อย่างใด
            </li>
          </ol>
        </section>

        <section className="grid grid-cols-2 gap-8 pt-6 text-sm">
          <div className="space-y-1">
            <p>ลงชื่อ ................................................ เจ้าของสัตว์</p>
            <p className="text-muted">({line(pv?.owner_full_name)})</p>
            <p>วันที่ {pv?.consent_date ?? '............ / ............ / ............'}</p>
          </div>
          <div className="space-y-1">
            <p>ลงชื่อ ................................................ สัตวแพทย์</p>
            <p className="text-muted">({author?.name_th ?? '_______________________'})</p>
            {author?.license_no && <p className="text-muted">เลขใบประกอบวิชาชีพ {author.license_no}</p>}
            <p>วันที่ ............ / ............ / ............</p>
          </div>
        </section>

        <p className="text-[11px] text-muted leading-relaxed pt-4 border-t border-border">
          แบบฟอร์มนี้จัดทำขึ้นเพื่ออำนวยความสะดวก ไม่ใช่คำแนะนำทางกฎหมาย
          ควรให้ผู้มีความรู้ทางกฎหมายตรวจสอบถ้อยคำก่อนนำไปใช้จริง
        </p>
      </article>
    </main>
  )
}

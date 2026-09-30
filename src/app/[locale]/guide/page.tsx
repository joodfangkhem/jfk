import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import AdSlot from '@/components/AdSlot'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'
import { altLanguages } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return {
    alternates: { canonical: lp(locale, '/guide'), languages: altLanguages('/guide') },
    title:
      locale === 'en'
        ? 'Guide — cun, point categories, needle sizes'
        : 'คู่มือใช้งาน — cun, ชนิดของจุด, ขนาดเข็ม',
    description:
      locale === 'en'
        ? 'How a cun is measured in animals, what the point categories mean, needle sizes for dogs and cats, and the contraindications of veterinary acupuncture.'
        : 'วิธีวัดระยะ cun ในสัตว์ ความหมายของชนิดจุด ขนาดเข็มที่ใช้ในสุนัขและแมว และข้อห้ามในการฝังเข็ม',
  }
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const en = locale === 'en'

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">{en ? 'Guide' : 'คู่มือใช้งาน'}</h1>
        <p className="text-sm text-muted leading-relaxed">
          {en
            ? 'The units and terms used in every point description on this site. Read once, use everywhere.'
            : 'ศัพท์และหน่วยวัดที่ใช้ในคำอธิบายตำแหน่งจุดทั้งเว็บ อ่านรอบเดียวแล้วใช้ได้ทุกหน้า'}
        </p>
      </header>

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">
          {en ? 'How a cun is measured in animals' : '1 cun วัดยังไงในสัตว์'}
        </h2>
        <p className="text-[15px] leading-relaxed">
          {en
            ? 'The cun (寸) is a proportional unit, not a centimetre, so it scales with the size of the animal in front of you. In veterinary practice these are the usual references:'
            : 'cun (ชุ่น / 寸) เป็นหน่วยวัดแบบสัดส่วน ไม่ใช่เซนติเมตร จึงปรับตามขนาดสัตว์แต่ละตัวโดยอัตโนมัติ ในสัตว์นิยมใช้เกณฑ์เหล่านี้'}
        </p>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5">
          <li>
            {en ? (
              <><strong>1 cun = the width of the last rib</strong> at its widest point — the reference used most often.</>
            ) : (
              <><strong>1 cun = ความกว้างของซี่โครงซี่สุดท้าย</strong> ที่จุดกว้างที่สุด — เกณฑ์หลักที่ใช้บ่อยที่สุด</>
            )}
          </li>
          <li>
            {en ? (
              <><strong>1.5 cun</strong>, the distance used for the back-shu points (BL-13 to BL-28), is measured lateral from the dorsal midline; in a medium dog that is roughly 2-4 cm. Confirm it by palpating the groove beside the epaxial muscles.</>
            ) : (
              <><strong>1.5 cun</strong> ที่ใช้กับจุด back-shu (BL-13 ถึง BL-28) คือระยะจากแนวกลางหลังออกข้าง ซึ่งในสุนัขขนาดกลางมักตกราว 2-4 ซม. ให้คลำหาร่องข้างกล้ามเนื้อ epaxial เป็นตัวยืนยัน</>
            )}
          </li>
          <li>
            {en ? (
              <><strong>3 cun</strong> = the width of four of your own fingers held together — a quick estimate on a medium-sized animal.</>
            ) : (
              <><strong>3 cun</strong> = ความกว้างของ 4 นิ้วมือผู้ปักเรียงติดกัน (ใช้เทียบเร็วในสัตว์ขนาดกลาง)</>
            )}
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          {en
            ? 'What matters most are the bony landmarks and muscle grooves — the cun figure is only an approximation, so always confirm by palpation.'
            : 'หัวใจสำคัญคือ landmark กระดูกและร่องกล้ามเนื้อ — ตัวเลข cun เป็นแค่ตัวช่วยประมาณ ให้คลำยืนยันเสมอ'}
        </p>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">{en ? 'Point categories' : 'ชนิดของจุด (point types)'}</h2>
        <dl className="space-y-2.5 text-[15px] leading-relaxed">
          <Term t="Yuan-source">
            {en
              ? 'Where the source qi of the channel gathers; used to tonify or regulate that organ directly.'
              : 'จุดที่ลมปราณต้นทุนของเส้นนั้นรวมตัว ใช้บำรุงหรือปรับอวัยวะนั้นโดยตรง'}
          </Term>
          <Term t="He-sea">
            {en
              ? 'Where qi flows deepest into the organ; used for internal disease and the large joints.'
              : 'จุดปลายทางที่ลมปราณไหลเข้าลึกสู่อวัยวะ มักใช้กับโรคของอวัยวะภายในและข้อต่อใหญ่'}
          </Term>
          <Term t="Ting point / Jing-well">
            {en
              ? 'At the nail bed; used in emergencies and for bleeding technique. Very painful — leave them until last.'
              : 'จุดที่โคนเล็บ ใช้ในภาวะฉุกเฉินและปล่อยเลือด ไวต่อความเจ็บมาก ควรทำท้ายสุด'}
          </Term>
          <Term t="Back-shu">
            {en
              ? 'On the bladder channel beside the spine; each one is tied to an organ, e.g. BL-23 to the kidney.'
              : 'จุดบนเส้น BL สองข้างสันหลัง แต่ละจุดผูกกับอวัยวะหนึ่ง เช่น BL-23 = ไต'}
          </Term>
          <Term t="Front-mu">
            {en
              ? 'On the ventral trunk where an organ’s qi collects; paired with that organ’s back-shu point.'
              : 'จุดด้านท้อง/อก ที่ลมปราณของอวัยวะมารวม ใช้คู่กับ back-shu ของอวัยวะเดียวกัน'}
          </Term>
          <Term t="Luo-connecting">
            {en
              ? 'Links a yin channel to its paired yang channel; used when signs cross both.'
              : 'เชื่อมเส้นยินกับหยางที่เป็นคู่กัน ใช้กับอาการที่ข้ามสองเส้น'}
          </Term>
          <Term t="Influential point">
            {en
              ? 'Influences one tissue throughout the body — GB-34 for sinews, BL-17 for blood, BL-11 for bone.'
              : 'จุดที่มีอิทธิพลต่อเนื้อเยื่อหนึ่งทั้งร่าง เช่น GB-34 ต่อเส้นเอ็น, BL-17 ต่อเลือด, BL-11 ต่อกระดูก'}
          </Term>
          <Term t="Command point">
            {en
              ? 'Governs a region — LI-4 the face and mouth, BL-40 the back, ST-36 the abdomen.'
              : 'จุดที่ควบคุมบริเวณหนึ่งของร่างกาย เช่น LI-4 ต่อใบหน้า-ปาก, BL-40 ต่อหลัง, ST-36 ต่อท้อง'}
          </Term>
          <Term t="Four Gates">
            {en
              ? 'LI-4 with LIV-3, bilaterally; opens circulation and relieves pain throughout the body.'
              : 'LI-4 คู่กับ LIV-3 ทั้งสองข้าง ใช้เปิดการไหลเวียนและระงับปวดทั่วร่าง'}
          </Term>
        </dl>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE} label={d.ad} />

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">{en ? 'Needle sizes in practice' : 'ขนาดเข็มที่ใช้บ่อย'}</h2>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>{en ? 'Cats and small-breed dogs:' : 'แมวและสุนัขพันธุ์เล็ก:'}</strong> 0.16-0.20 × 13-25 mm</li>
          <li><strong>{en ? 'Medium-breed dogs:' : 'สุนัขพันธุ์กลาง:'}</strong> 0.20-0.25 × 25-40 mm</li>
          <li><strong>{en ? 'Large dogs (hip and thick muscle):' : 'สุนัขพันธุ์ใหญ่ (จุดสะโพก/กล้ามเนื้อหนา):'}</strong> 0.25-0.30 × 40-50 mm</li>
          <li><strong>{en ? 'Face, digits and the chest wall:' : 'จุดบนใบหน้า ปลายนิ้ว และแนวอก:'}</strong> {en ? 'the finest needle, inserted shallowly only.' : 'เข็มเล็กที่สุดและปักตื้นเท่านั้น'}</li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          {en
            ? 'Needles are usually retained 15-20 minutes (start at 5-10 in a restless animal). For electroacupuncture, 2-4 Hz is used for lasting analgesia and 20-100 Hz to release muscle spasm, with the pair bracketing the lesion.'
            : 'คาเข็มทั่วไป 15-20 นาที (สัตว์ที่ตื่นตัวมากอาจเริ่มที่ 5-10 นาที) การกระตุ้นไฟฟ้า (electroacupuncture) นิยม 2-4 Hz สำหรับฤทธิ์ระงับปวดค้างนาน และ 20-100 Hz สำหรับคลายกล้ามเนื้อเกร็ง โดยคร่อมรอยโรค'}
        </p>
      </section>

      <section className="card p-4 bg-warn-soft border-warn/25 space-y-3">
        <h2 className="font-bold text-lg flex items-center gap-2 text-warn">
          <AlertTriangle size={18} /> {en ? 'Contraindications and cautions' : 'ข้อห้ามและข้อควรระวัง'}
        </h2>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5 text-text/85">
          <li>{en ? 'Never needle through infected skin, an open wound, or directly into a tumour.' : 'ห้ามปักผ่านผิวหนังที่ติดเชื้อ เป็นแผลเปิด หรือบนก้อนเนื้องอกโดยตรง'}</li>
          <li>{en ? 'Pregnancy: avoid LI-4, SP-6, GB-21, BL-60, CV-3, CV-4, CV-6 and all caudal abdominal points.' : 'สัตว์ตั้งท้อง: หลีกเลี่ยง LI-4, SP-6, GB-21, BL-60, CV-3, CV-4, CV-6 และจุดหน้าท้องน้อยทั้งหมด'}</li>
          <li>{en ? 'Over the thorax (LU-1, BL-13 to BL-21, CV-17, SP-21, LIV-14): oblique and shallow only — perpendicular insertion risks pneumothorax.' : 'แนวอกทั้งหมด (LU-1, BL-13 ถึง BL-21, CV-17, SP-21, LIV-14): ปักเฉียงตื้นเท่านั้น ห้ามตั้งฉากลึก เสี่ยงปอดรั่ว'}</li>
          <li>{en ? 'Along the dorsal midline and neck: never deep enough to reach the spinal canal, especially in cats and small dogs.' : 'แนวกลางหลังและคอ: ห้ามแทงลึกเข้าช่องไขสันหลัง โดยเฉพาะสัตว์ตัวเล็กและแมว'}</li>
          <li>{en ? 'CV-3 and the caudal abdomen: let the animal urinate first; never needle over a full bladder.' : 'CV-3 / จุดท้องน้อย: ให้สัตว์ปัสสาวะก่อน ห้ามปักเมื่อกระเพาะปัสสาวะเต็มมาก'}</li>
          <li>{en ? 'Bleeding disorders or thrombocytopenia: no bleeding technique (ER-JIAN, SHAN-GEN, WEI-JIAN, ting points).' : 'ภาวะเลือดออกง่ายหรือเกล็ดเลือดต่ำ: ห้ามทำการปล่อยเลือด (ER-JIAN, SHAN-GEN, WEI-JIAN, จุด Ting)'}</li>
          <li>{en ? 'An animal that cannot be safely restrained: assess the risk to the patient and to yourself first.' : 'สัตว์ที่ควบคุมไม่อยู่หรือก้าวร้าวมาก: ประเมินความปลอดภัยของทั้งสัตว์และผู้ทำก่อน'}</li>
          <li>{en ? 'Acupuncture is adjunctive; it does not replace conventional diagnosis and treatment.' : 'ฝังเข็มเป็นการรักษาเสริม ไม่ใช้แทนการวินิจฉัยและการรักษาตามหลักการแพทย์แผนปัจจุบัน'}</li>
        </ul>
      </section>

      <p className="text-sm text-muted">
        {en ? 'Start at the ' : 'เริ่มค้นจุดได้ที่ '}
        <Link href={lp(locale, '/points')} className="text-primary underline">
          {en ? 'point search' : 'หน้าค้นหาจุด'}
        </Link>
        {en ? ' or ' : ' หรือ '}
        <Link href={lp(locale, '/conditions')} className="text-primary underline">
          {en ? 'browse by condition' : 'เลือกตามอาการ'}
        </Link>
      </p>
    </main>
  )
}

function Term({ t: term, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </div>
  )
}

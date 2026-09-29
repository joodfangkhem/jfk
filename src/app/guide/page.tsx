import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  alternates: { canonical: '/guide' },
  title: 'คู่มือใช้งาน — cun, ชนิดของจุด, ขนาดเข็ม',
  description:
    'วิธีวัดระยะ cun ในสัตว์ ความหมายของชนิดจุด (Yuan-source, He-sea, Back-shu, Front-mu, Ting point), ขนาดเข็มที่ใช้ในสุนัขและแมว และข้อห้ามในการฝังเข็ม',
}

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">คู่มือใช้งาน</h1>
        <p className="text-sm text-muted leading-relaxed">
          ศัพท์และหน่วยวัดที่ใช้ในคำอธิบายตำแหน่งจุดทั้งเว็บ อ่านรอบเดียวแล้วใช้ได้ทุกหน้า
        </p>
      </header>

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">1 cun วัดยังไงในสัตว์</h2>
        <p className="text-[15px] leading-relaxed">
          cun (ชุ่น / 寸) เป็นหน่วยวัดแบบสัดส่วน ไม่ใช่เซนติเมตร จึงปรับตามขนาดสัตว์แต่ละตัวโดยอัตโนมัติ
          ในสัตว์นิยมใช้เกณฑ์เหล่านี้
        </p>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5">
          <li>
            <strong>1 cun = ความกว้างของซี่โครงซี่สุดท้าย</strong> ที่จุดกว้างที่สุด — เกณฑ์หลักที่ใช้บ่อยที่สุด
          </li>
          <li>
            <strong>1.5 cun</strong> ที่ใช้กับจุด back-shu (BL-13 ถึง BL-28) คือระยะจากแนวกลางหลังออกข้าง
            ซึ่งในสุนัขขนาดกลางมักตกราว 2-4 ซม. ให้คลำหาร่องข้างกล้ามเนื้อ epaxial เป็นตัวยืนยัน
          </li>
          <li>
            <strong>3 cun</strong> = ความกว้างของ 4 นิ้วมือผู้ปักเรียงติดกัน (ใช้เทียบเร็วในสัตว์ขนาดกลาง)
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          หัวใจสำคัญคือ landmark กระดูกและร่องกล้ามเนื้อ — ตัวเลข cun เป็นแค่ตัวช่วยประมาณ ให้คลำยืนยันเสมอ
        </p>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">ชนิดของจุด (point types)</h2>
        <dl className="space-y-2.5 text-[15px] leading-relaxed">
          <Term t="Yuan-source (จุดต้นทาง)">จุดที่ลมปราณต้นทุนของเส้นนั้นรวมตัว ใช้บำรุงหรือปรับอวัยวะนั้นโดยตรง</Term>
          <Term t="He-sea (จุดทะเล)">จุดปลายทางที่ลมปราณไหลเข้าลึกสู่อวัยวะ มักใช้กับโรคของอวัยวะภายในและข้อต่อใหญ่</Term>
          <Term t="Ting point / Jing-well (จุดปลายนิ้ว)">จุดที่โคนเล็บ ใช้ในภาวะฉุกเฉินและปล่อยเลือด ไวต่อความเจ็บมาก ควรทำท้ายสุด</Term>
          <Term t="Back-shu (จุดหลัง)">จุดบนเส้น BL สองข้างสันหลัง แต่ละจุดผูกกับอวัยวะหนึ่ง เช่น BL-23 = ไต</Term>
          <Term t="Front-mu (จุดหน้า)">จุดด้านท้อง/อก ที่ลมปราณของอวัยวะมารวม ใช้คู่กับ back-shu ของอวัยวะเดียวกัน</Term>
          <Term t="Luo-connecting (จุดเชื่อม)">เชื่อมเส้นยินกับหยางที่เป็นคู่กัน ใช้กับอาการที่ข้ามสองเส้น</Term>
          <Term t="Influential point (จุดอิทธิพล)">จุดที่มีอิทธิพลต่อเนื้อเยื่อหนึ่งทั้งร่าง เช่น GB-34 ต่อเส้นเอ็น, BL-17 ต่อเลือด, BL-11 ต่อกระดูก</Term>
          <Term t="Command point (จุดสั่งการ)">จุดที่ควบคุมบริเวณหนึ่งของร่างกาย เช่น LI-4 ต่อใบหน้า-ปาก, BL-40 ต่อหลัง, ST-36 ต่อท้อง</Term>
          <Term t="Four Gates (สี่ประตู)">LI-4 คู่กับ LIV-3 ทั้งสองข้าง ใช้เปิดการไหลเวียนและระงับปวดทั่วร่าง</Term>
        </dl>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE} />

      <section className="card p-4 space-y-3">
        <h2 className="font-bold text-lg">ขนาดเข็มที่ใช้บ่อย</h2>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>แมวและสุนัขพันธุ์เล็ก:</strong> 0.16-0.20 × 13-25 มม.</li>
          <li><strong>สุนัขพันธุ์กลาง:</strong> 0.20-0.25 × 25-40 มม.</li>
          <li><strong>สุนัขพันธุ์ใหญ่ (จุดสะโพก/กล้ามเนื้อหนา):</strong> 0.25-0.30 × 40-50 มม.</li>
          <li><strong>จุดบนใบหน้า ปลายนิ้ว และแนวอก:</strong> เข็มเล็กที่สุดและปักตื้นเท่านั้น</li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          คาเข็มทั่วไป 15-20 นาที (สัตว์ที่ตื่นตัวมากอาจเริ่มที่ 5-10 นาที)
          การกระตุ้นไฟฟ้า (electroacupuncture) นิยม 2-4 Hz สำหรับฤทธิ์ระงับปวดค้างนาน
          และ 20-100 Hz สำหรับคลายกล้ามเนื้อเกร็ง โดยคร่อมรอยโรค
        </p>
      </section>

      <section className="card p-4 bg-warn-soft border-warn/25 space-y-3">
        <h2 className="font-bold text-lg flex items-center gap-2 text-warn">
          <AlertTriangle size={18} /> ข้อห้ามและข้อควรระวัง
        </h2>
        <ul className="text-[15px] leading-relaxed space-y-2 list-disc pl-5 text-text/85">
          <li>ห้ามปักผ่านผิวหนังที่ติดเชื้อ เป็นแผลเปิด หรือบนก้อนเนื้องอกโดยตรง</li>
          <li>สัตว์ตั้งท้อง: หลีกเลี่ยง LI-4, SP-6, GB-21, BL-60, CV-3, CV-4, CV-6 และจุดหน้าท้องน้อยทั้งหมด</li>
          <li>แนวอกทั้งหมด (LU-1, BL-13 ถึง BL-21, CV-17, SP-21, LIV-14): ปักเฉียงตื้นเท่านั้น ห้ามตั้งฉากลึก เสี่ยงปอดรั่ว</li>
          <li>แนวกลางหลังและคอ: ห้ามแทงลึกเข้าช่องไขสันหลัง โดยเฉพาะสัตว์ตัวเล็กและแมว</li>
          <li>CV-3 / จุดท้องน้อย: ให้สัตว์ปัสสาวะก่อน ห้ามปักเมื่อกระเพาะปัสสาวะเต็มมาก</li>
          <li>ภาวะเลือดออกง่ายหรือเกล็ดเลือดต่ำ: ห้ามทำการปล่อยเลือด (ER-JIAN, SHAN-GEN, WEI-JIAN, จุด Ting)</li>
          <li>สัตว์ที่ควบคุมไม่อยู่หรือก้าวร้าวมาก: ประเมินความปลอดภัยของทั้งสัตว์และผู้ทำก่อน</li>
          <li>ฝังเข็มเป็นการรักษาเสริม ไม่ใช้แทนการวินิจฉัยและการรักษาตามหลักการแพทย์แผนปัจจุบัน</li>
        </ul>
      </section>

      <p className="text-sm text-muted">
        เริ่มค้นจุดได้ที่ <Link href="/points" className="text-primary underline">หน้าค้นหาจุด</Link> หรือ{' '}
        <Link href="/conditions" className="text-primary underline">เลือกตามอาการ</Link>
      </p>
    </main>
  )
}

function Term({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold">{t}</dt>
      <dd className="text-muted">{children}</dd>
    </div>
  )
}

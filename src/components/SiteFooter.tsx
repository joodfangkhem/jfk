import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-12 bg-surface-2">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/points" className="hover:text-primary">จุดฝังเข็ม</Link>
          <Link href="/meridians" className="hover:text-primary">เส้นลมปราณ</Link>
          <Link href="/conditions" className="hover:text-primary">ตามอาการ</Link>
          <Link href="/guide" className="hover:text-primary">คู่มือใช้งาน</Link>
          <Link href="/about" className="hover:text-primary">เกี่ยวกับ</Link>
          <Link href="/privacy" className="hover:text-primary">ความเป็นส่วนตัว</Link>
        </div>
        <p className="leading-relaxed">
          JFK (Jood Fang Khem) เป็นคู่มืออ้างอิงเพื่อการศึกษา สำหรับสัตวแพทย์และผู้เรียน TCVM
          ไม่ใช่คำแนะนำในการรักษาสัตว์ป่วยรายตัว การฝังเข็มในสัตว์ควรทำโดยสัตวแพทย์ที่ผ่านการอบรม
        </p>
        <p className="text-xs">© {new Date().getFullYear()} JFK จุดฝังเข็ม</p>
      </div>
    </footer>
  )
}

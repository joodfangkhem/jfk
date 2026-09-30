import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center space-y-3">
      <h1 className="text-2xl font-bold">ไม่พบหน้านี้ · Page not found</h1>
      <p className="text-sm text-muted leading-relaxed">
        จุดหรือหน้าที่คุณเปิดอาจถูกย้ายหรือยังไม่ได้เพิ่มเข้าฐานข้อมูล
        <br />
        The point or page you opened may have moved or is not in the database yet.
      </p>
      <div className="flex justify-center gap-2 pt-2 flex-wrap">
        <Link href="/points" className="h-11 px-4 inline-flex items-center rounded-full bg-primary text-white text-sm font-medium">
          ค้นหาจุดฝังเข็ม
        </Link>
        <Link href="/en/points" className="h-11 px-4 inline-flex items-center rounded-full border border-border text-sm font-medium">
          Search points
        </Link>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { ImagePlus } from 'lucide-react'
import { useIsAdmin } from '@/lib/useIsAdmin'

/** ปุ่มลัดไปแก้จุดนี้/ใส่รูป — ขึ้นเฉพาะแอดมิน อยู่คู่กับปุ่มบันทึกจุด */
export default function AdminEditButton({ slug }: { slug: string }) {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return null

  return (
    <Link
      href={`/admin/points/${slug}`}
      className="h-10 px-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft text-accent text-sm font-medium active:scale-95 transition"
    >
      <ImagePlus size={16} /> แก้ไข / ใส่รูป
    </Link>
  )
}

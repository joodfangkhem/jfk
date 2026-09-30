'use client'

import Link from 'next/link'
import { ImagePlus } from 'lucide-react'
import { useIsAdmin } from '@/lib/useIsAdmin'
import { lp, t, type Locale } from '@/lib/i18n'

/** ปุ่มลัดไปแก้จุดนี้/ใส่รูป — ขึ้นเฉพาะแอดมิน อยู่คู่กับปุ่มบันทึกจุด */
export default function AdminEditButton({ slug, locale = 'th' }: { slug: string; locale?: Locale }) {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return null

  return (
    <Link
      href={lp(locale, `/admin/points/${slug}`)}
      className="h-10 px-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft text-accent text-sm font-medium active:scale-95 transition"
    >
      <ImagePlus size={16} /> {t(locale).admin.editButton}
    </Link>
  )
}

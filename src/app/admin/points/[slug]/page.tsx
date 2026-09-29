import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PointEditor from '@/components/PointEditor'
import PointGalleryManager from '@/components/PointGalleryManager'
import type { Point } from '@/lib/types'

export const metadata: Metadata = {
  title: 'แก้ข้อมูลจุด',
  robots: { index: false, follow: false },
}

export default async function AdminPointPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle()
  if (!admin) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted">
          บัญชีนี้ไม่ใช่ผู้ดูแล — <Link href="/admin" className="text-primary underline">ดูวิธีตั้งผู้ดูแล</Link>
        </p>
      </main>
    )
  }

  const { data: point } = await supabase.from('points').select('*').eq('slug', slug).maybeSingle()
  if (!point) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <nav className="text-xs text-muted flex items-center gap-1.5">
        <Link href="/admin" className="hover:text-primary">ผู้ดูแล</Link>
        <span>/</span>
        <Link href={`/points/${point.slug}`} className="hover:text-primary">ดูหน้าจริง</Link>
      </nav>
      <h1 className="text-xl font-bold">
        แก้ <span className="text-primary">{point.code}</span> {point.name_th}
      </h1>
      <PointGalleryManager pointId={point.id} slug={point.slug} />
      <PointEditor point={point as Point} />
    </main>
  )
}

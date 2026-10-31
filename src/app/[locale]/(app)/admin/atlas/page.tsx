import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import AtlasPicker, { type PickerCoord, type PickerPoint } from '@/components/AtlasPicker'
import { createClient } from '@/lib/supabase/server'
import { isLocale, lp, t, type Locale } from '@/lib/i18n'
import type { SpeciesModel } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: `${t(locale).atlas.title} — ${t(locale).admin.title}`, robots: { index: false, follow: false } }
}

export default async function AdminAtlasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
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
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-3">
        <h1 className="text-xl font-bold">{d.admin.notAdminTitle}</h1>
        <p className="text-sm text-muted leading-relaxed">{d.admin.notAdminBody}</p>
      </main>
    )
  }

  const [{ data: models }, { data: points }, { data: coords }] = await Promise.all([
    supabase.from('species_models').select('*').eq('is_active', true).order('sort_order'),
    supabase
      .from('points')
      .select('id, code, slug, name_th, name_pinyin, meridian_code, species')
      .order('meridian_code')
      .order('number', { ascending: true, nullsFirst: false })
      .order('code'),
    supabase.from('point_coords').select('point_id, species, x, y, z, bilateral, note_th, verified'),
  ])

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold">ปักจุดบนโมเดล 3 มิติ</h1>
        <Link href={lp(locale, '/admin')} className="chip hover:border-primary hover:text-primary">
          <ArrowLeft size={12} /> {d.admin.title}
        </Link>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        เลือกจุดจากรายการ แล้วคลิกตำแหน่งบนตัวสัตว์ — พิกัดจะถูกบันทึกทันที จุดที่เป็นจุดสองข้าง
        ปักข้างเดียวพอ ระบบจะสะท้อนไปอีกข้างให้เอง จุดที่เพิ่งปักจะขึ้นเป็นสีเหลืองว่ายังไม่ได้ตรวจ
        ติ๊ก &ldquo;ตรวจตำแหน่งแล้ว&rdquo; เมื่อยืนยันว่าตรง
      </p>

      <AtlasPicker
        models={(models ?? []) as SpeciesModel[]}
        points={(points ?? []) as PickerPoint[]}
        coords={(coords ?? []) as PickerCoord[]}
      />
    </main>
  )
}

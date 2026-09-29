import Link from 'next/link'
import type { Metadata } from 'next'
import { Inbox, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'ผู้ดูแล',
  robots: { index: false, follow: false },
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; noimage?: string }>
}) {
  const { q, noimage } = await searchParams
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
        <h1 className="text-xl font-bold">สำหรับผู้ดูแลเท่านั้น</h1>
        <p className="text-sm text-muted leading-relaxed">
          บัญชีนี้ยังไม่ได้เป็นผู้ดูแล ถ้าเป็นเจ้าของเว็บ ให้รันคำสั่งนี้ใน Supabase SQL Editor
          หนึ่งครั้ง แล้วรีเฟรชหน้านี้
        </p>
        <pre className="card p-3 text-xs overflow-x-auto leading-relaxed">
{`insert into admins (user_id, note)
select id, 'owner' from auth.users
where email = '${user?.email ?? 'your@email.com'}'
on conflict (user_id) do nothing;`}
        </pre>
      </main>
    )
  }

  let query = supabase
    .from('points')
    .select('id, code, slug, name_th, image_url')
    .order('popularity', { ascending: false })
    .limit(200)
  if (q) query = query.ilike('search_text', `%${q}%`)
  if (noimage) query = query.is('image_url', null)
  const { data: points } = await query

  const withImage = (points ?? []).filter((p) => p.image_url).length
  const { count: pendingCount } = await supabase
    .from('point_image_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck size={19} className="text-primary" /> ผู้ดูแล — แก้เนื้อหาจุด
        </h1>
        <p className="text-sm text-muted">
          มีรูปแล้ว {withImage} จาก {points?.length ?? 0} จุดที่แสดง
        </p>
      </header>

      <div className="flex gap-1.5">
        <Link
          href={q ? `/admin?q=${encodeURIComponent(q)}` : '/admin'}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            !noimage
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          ทั้งหมด
        </Link>
        <Link
          href={q ? `/admin?q=${encodeURIComponent(q)}&noimage=1` : '/admin?noimage=1'}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            noimage
              ? 'bg-primary text-white border-primary'
              : 'bg-surface text-muted border-border hover:text-primary'
          }`}
        >
          ยังไม่มีรูป
        </Link>
      </div>

      <Link
        href="/admin/submissions"
        className="card p-3.5 flex items-center gap-3 hover:border-primary/50 transition"
      >
        <Inbox size={18} className="text-primary shrink-0" />
        <span className="flex-1 text-sm font-medium">รูปที่ผู้ใช้ส่งเข้ามา</span>
        {pendingCount ? (
          <span className="min-w-6 h-6 px-2 inline-flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
            {pendingCount}
          </span>
        ) : (
          <span className="chip">ไม่มีรอตรวจ</span>
        )}
      </Link>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="ค้นหาจุดที่จะแก้"
          className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        {noimage && <input type="hidden" name="noimage" value="1" />}
        <button className="h-11 px-4 rounded-full bg-primary text-white text-sm font-medium">ค้นหา</button>
      </form>

      <div className="space-y-2">
        {(points ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/admin/points/${p.slug}`}
            className="card p-3 flex items-center gap-3 hover:border-primary/50 transition"
          >
            <span className="shrink-0 min-w-14 h-7 px-2 inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-[13px]">
              {p.code}
            </span>
            <span className="flex-1 text-sm truncate">{p.name_th}</span>
            <span className={`chip ${p.image_url ? 'text-primary border-primary/30' : ''}`}>
              {p.image_url ? 'มีรูป' : 'ยังไม่มีรูป'}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}

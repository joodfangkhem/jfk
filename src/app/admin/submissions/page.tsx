import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, ImageOff, Inbox, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { approveSubmission, rejectSubmission } from './actions'

export const metadata: Metadata = {
  title: 'รูปที่รออนุมัติ',
  robots: { index: false, follow: false },
}

type Row = {
  id: string
  point_id: string
  image_url: string
  storage_path: string | null
  caption: string | null
  credit: string | null
  note: string | null
  user_email: string | null
  status: string
  reject_reason: string | null
  created_at: string
  points: { code: string; slug: string; name_th: string | null; image_url: string | null } | null
}

export default async function SubmissionsPage() {
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

  const { data } = await supabase
    .from('point_image_submissions')
    .select(
      'id, point_id, image_url, storage_path, caption, credit, note, user_email, status, reject_reason, created_at, points (code, slug, name_th, image_url)'
    )
    .order('created_at', { ascending: false })
    .limit(60)

  const rows = (data ?? []) as unknown as Row[]
  const pending = rows.filter((r) => r.status === 'pending')
  const reviewed = rows.filter((r) => r.status !== 'pending').slice(0, 12)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <nav className="text-xs text-muted">
        <Link href="/admin" className="hover:text-primary">ผู้ดูแล</Link>
      </nav>

      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Inbox size={19} className="text-primary" /> รูปที่ผู้ใช้ส่งเข้ามา
        </h1>
        <p className="text-sm text-muted">
          {pending.length ? `รออนุมัติ ${pending.length} รูป` : 'ไม่มีรูปที่รออนุมัติ'}
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="card p-6 text-center text-sm text-muted">
          ยังไม่มีใครส่งรูปเข้ามา — ปุ่มส่งรูปอยู่ในหน้าจุดแต่ละจุด ผู้ใช้ที่ล็อกอินแล้วส่งได้ทุกคน
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((r) => (
            <article key={r.id} className="card p-4 space-y-3">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image_url}
                  alt=""
                  className="w-28 h-28 object-cover rounded-xl border border-border shrink-0"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <Link
                    href={`/points/${r.points?.slug}`}
                    className="font-semibold text-primary"
                  >
                    {r.points?.code} {r.points?.name_th}
                  </Link>
                  {r.points?.image_url && (
                    <p className="text-xs text-muted mt-0.5">
                      จุดนี้มีรูปอยู่แล้ว — รูปใหม่จะถูกเพิ่มต่อท้าย (ไม่ทับของเดิม)
                    </p>
                  )}
                  <p className="text-xs text-muted mt-1">
                    ส่งโดย {r.user_email ?? 'ไม่ทราบ'} ·{' '}
                    {new Date(r.created_at).toLocaleDateString('th-TH')}
                  </p>
                  {r.credit && <p className="text-xs text-muted">เครดิต: {r.credit}</p>}
                  {r.note && <p className="text-xs mt-1">“{r.note}”</p>}
                  <a
                    href={r.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    เปิดรูปเต็ม
                  </a>
                </div>
              </div>

              <form action={approveSubmission} className="space-y-2">
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="point_id" value={r.point_id} />
                <input type="hidden" name="image_url" value={r.image_url} />
                <input type="hidden" name="credit" value={r.credit ?? ''} />
                <input type="hidden" name="storage_path" value={r.storage_path ?? ''} />
                <input type="hidden" name="user_email" value={r.user_email ?? ''} />
                <input
                  name="caption"
                  defaultValue={r.caption ?? ''}
                  placeholder="คำบรรยาย เช่น มุมด้านข้าง / พุดเดิ้ลขาสั้น"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
                />
                <button
                  type="submit"
                  className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
                >
                  <Check size={15} /> อนุมัติ เพิ่มเข้าแกลเลอรี
                </button>
              </form>

              <form action={rejectSubmission} className="flex gap-2">
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="storage_path" value={r.storage_path ?? ''} />
                <input
                  name="reason"
                  placeholder="เหตุผลที่ไม่ผ่าน (ผู้ส่งจะเห็น)"
                  className="flex-1 h-10 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 text-accent text-sm font-medium active:scale-95 transition"
                >
                  <X size={15} /> ไม่ผ่าน
                </button>
              </form>
            </article>
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-base font-bold">ตรวจไปแล้วล่าสุด</h2>
          {reviewed.map((r) => (
            <div key={r.id} className="card p-3 flex items-center gap-3 text-sm">
              <span
                className={`chip ${
                  r.status === 'approved'
                    ? 'text-primary border-primary/30'
                    : 'text-accent border-accent/30'
                }`}
              >
                {r.status === 'approved' ? 'อนุมัติ' : 'ไม่ผ่าน'}
              </span>
              <span className="flex-1 truncate">
                {r.points?.code} {r.points?.name_th}
              </span>
              <span className="text-xs text-muted truncate max-w-32">{r.user_email}</span>
              {r.status === 'rejected' && <ImageOff size={14} className="text-muted" />}
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

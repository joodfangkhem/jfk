'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NotebookPen } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

/** โน้ตส่วนตัวต่อจุด — เห็นเฉพาะเจ้าของ (ต้องล็อกอิน) */
export default function NoteBox({ pointId, code }: { pointId: string; code: string }) {
  const supabase = createClient()
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!alive) return
      if (!data.user) {
        setSignedIn(false)
        return
      }
      setSignedIn(true)
      const { data: note } = await supabase
        .from('notes')
        .select('body')
        .eq('point_id', pointId)
        .maybeSingle()
      if (alive && note) {
        setBody(note.body)
        setSaved(note.body)
      }
    })()
    return () => {
      alive = false
    }
  }, [supabase, pointId])

  if (signedIn === null) return null

  if (signedIn === false) {
    return (
      <section className="card p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-1">
          <NotebookPen size={17} className="text-primary" /> โน้ตของฉัน
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          <Link href={`/login?next=/points/${code.toLowerCase()}`} className="text-primary underline">
            เข้าสู่ระบบด้วย Google
          </Link>{' '}
          เพื่อจดบันทึกเคสของคุณไว้ที่จุดนี้ (เห็นเฉพาะคุณ)
        </p>
      </section>
    )
  }

  const save = async () => {
    setBusy(true)
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) return setBusy(false)
    const text = body.trim()
    if (!text) {
      await supabase.from('notes').delete().eq('point_id', pointId).eq('user_id', u.user.id)
      setSaved('')
      toast.success('ลบโน้ตแล้ว')
    } else {
      const { error } = await supabase
        .from('notes')
        .upsert({ user_id: u.user.id, point_id: pointId, body: text }, { onConflict: 'user_id,point_id' })
      if (error) toast.error('บันทึกไม่สำเร็จ')
      else {
        setSaved(text)
        toast.success('บันทึกโน้ตแล้ว')
      }
    }
    setBusy(false)
  }

  return (
    <section className="card p-4">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <NotebookPen size={17} className="text-primary" /> โน้ตของฉัน
      </h2>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="เช่น เคสพุดเดิ้ล 12 ปี ปัก BAI-HUI + GB-30 กระตุ้นไฟฟ้า 20 Hz 15 นาที ดีขึ้นครั้งที่ 3"
        className="w-full rounded-xl border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary focus:bg-surface transition leading-relaxed"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={save}
          disabled={busy || body.trim() === saved.trim()}
          className="h-10 px-4 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition disabled:opacity-50"
        >
          {busy ? 'กำลังบันทึก…' : 'บันทึกโน้ต'}
        </button>
        {saved && body.trim() === saved.trim() && (
          <span className="text-xs text-muted">บันทึกแล้ว</span>
        )}
      </div>
    </section>
  )
}

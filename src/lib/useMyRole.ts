'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type MyRole = {
  /** ยังเช็คไม่เสร็จ — ใช้กันการกระพริบของปุ่มที่ขึ้นตามสิทธิ์ */
  loading: boolean
  signedIn: boolean
  isAdmin: boolean
  /** ผู้ช่วยตรวจข้อมูล — แอดมินนับเป็นผู้ช่วยในตัวด้วย */
  isContributor: boolean
}

const GUEST: MyRole = { loading: false, signedIn: false, isAdmin: false, isContributor: false }

/**
 * สิทธิ์ของผู้ใช้ที่ล็อกอินอยู่ (ใช้ซ่อน/แสดงปุ่มจัดการและปุ่มส่งข้อเสนอแก้ไข)
 * อ่านจากตาราง `admins` / `contributors` ซึ่ง RLS ให้เจ้าของอ่านแถวตัวเองได้
 * — ด่านจริงอยู่ที่ RLS ฝั่ง DB ไม่ใช่ที่นี่
 */
export function useMyRole(): MyRole {
  const [role, setRole] = useState<MyRole>({ ...GUEST, loading: true })

  useEffect(() => {
    const supabase = createClient()
    let alive = true

    const check = async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!alive) return
      if (!u.user) {
        setRole(GUEST)
        return
      }
      const [{ data: admin }, { data: contrib }] = await Promise.all([
        supabase.from('admins').select('user_id').eq('user_id', u.user.id).maybeSingle(),
        supabase.from('contributors').select('user_id').eq('user_id', u.user.id).maybeSingle(),
      ])
      if (!alive) return
      setRole({
        loading: false,
        signedIn: true,
        isAdmin: !!admin,
        isContributor: !!admin || !!contrib,
      })
    }

    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => check())
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return role
}

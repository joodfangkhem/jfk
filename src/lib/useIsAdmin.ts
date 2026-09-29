'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/** เช็คว่าผู้ใช้ที่ล็อกอินอยู่เป็นแอดมินไหม (ใช้ซ่อน/แสดงปุ่มจัดการเนื้อหา) */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let alive = true

    const check = async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!alive) return
      if (!u.user) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', u.user.id)
        .maybeSingle()
      if (alive) setIsAdmin(!!data)
    }

    check()
    const { data: sub } = supabase.auth.onAuthStateChange(() => check())
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return isAdmin
}

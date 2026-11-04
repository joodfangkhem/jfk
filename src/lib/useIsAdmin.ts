'use client'

import { useMyRole } from '@/lib/useMyRole'

/** เช็คว่าผู้ใช้ที่ล็อกอินอยู่เป็นแอดมินไหม (ใช้ซ่อน/แสดงปุ่มจัดการเนื้อหา) */
export function useIsAdmin() {
  return useMyRole().isAdmin
}

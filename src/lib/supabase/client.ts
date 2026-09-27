import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    // ค่า fallback มีไว้ให้ build ผ่านตอนที่ยังไม่ได้ตั้ง env (เช่น build ครั้งแรก)
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder'
  )
}

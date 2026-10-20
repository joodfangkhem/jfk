import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** หน้าที่ต้องล็อกอิน — ที่เหลือเปิดให้อ่านฟรี (ดีต่อ SEO/AdSense) */
const PROTECTED = ['/favorites', '/protocols', '/admin']

/**
 * ตาข่ายกันพลาดชั้นสอง — ตัวคัดจริงอยู่ที่ `config.matcher` ท้ายไฟล์
 * ที่เหลือไว้เพราะ matcher ของ Next ต้องเป็นค่าคงที่ แก้ยากกว่าตอนเพิ่ม route ใหม่
 */
function isBypassed(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/ads.txt' ||
    /\.[a-z0-9]+$/i.test(pathname)
  )
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // apex เป็นตัวหลัก www ส่งต่อถาวร — ของเดิม Vercel ทำให้ที่ edge
  // sitemap กับ canonical ชี้ apex ทั้งหมด ถ้าปล่อยให้ www เสิร์ฟเองจะกลายเป็นเนื้อหาซ้ำ
  const host = request.headers.get('host') ?? ''
  if (host.startsWith('www.')) {
    const url = new URL(request.url)
    url.host = host.slice(4)
    return NextResponse.redirect(url, 301)
  }
  if (isBypassed(pathname)) return NextResponse.next()

  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  // path จริงที่ผู้ใช้ขอ โดยตัด prefix ภาษาออก ใช้เช็คสิทธิ์
  const bare = isEn ? pathname.slice(3) || '/' : pathname

  if (PROTECTED.some((p) => bare === p || bare.startsWith(p + '/'))) {
    const guard = await requireUser(request, isEn, bare)
    if (guard) return guard
  }

  // ไทยไม่มี prefix ใน URL แต่ภายในต้อง map ไปที่ segment /th
  if (!isEn) {
    const url = request.nextUrl.clone()
    url.pathname = `/th${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

async function requireUser(request: NextRequest, isEn: boolean, bare: string) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = new URL(isEn ? '/en/login' : '/login', request.url)
    url.searchParams.set('next', (isEn ? '/en' : '') + bare)
    return NextResponse.redirect(url)
  }
  return null
}

export const config = {
  /*
   * ปลุกฟังก์ชันเฉพาะ request ที่เป็นหน้าเว็บจริง ๆ
   * ไฟล์สแตติก ไฟล์ที่มีนามสกุล และ /api ถูกคัดออกตั้งแต่ชั้น matcher
   * ซึ่งสำคัญกว่าที่คิด เพราะ isBypassed() ด้านบนทำงาน "หลัง" ฟังก์ชันถูกปลุกแล้ว
   * = จ่ายค่า CPU ไปเรียบร้อยก่อนจะรู้ว่าไม่ต้องทำอะไร
   */
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml|ads\\.txt|.*\\.[a-zA-Z0-9]+$).*)',
  ],
}


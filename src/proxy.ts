import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** หน้าที่ต้องล็อกอิน — ที่เหลือเปิดให้อ่านฟรี (ดีต่อ SEO/AdSense) */
const PROTECTED = ['/favorites', '/protocols', '/admin']

/** ไฟล์และ route ที่ไม่ต้องเติม prefix ภาษา */
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
  matcher: ['/((?!_next/static|_next/image).*)'],
}

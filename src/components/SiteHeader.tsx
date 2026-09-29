import Image from 'next/image'
import Link from 'next/link'
import AdminNavLink from './AdminNavLink'
import AuthButton from './AuthButton'

const NAV = [
  { href: '/points', label: 'จุดฝังเข็ม' },
  { href: '/meridians', label: 'เส้นลมปราณ' },
  { href: '/conditions', label: 'ตามอาการ' },
  { href: '/guide', label: 'คู่มือใช้งาน' },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo-mark.png"
              alt=""
              width={30}
              height={30}
              priority
              className="rounded-lg"
            />
            <span className="font-bold text-[17px] tracking-tight">
              JFK<span className="text-muted font-medium"> จุดฝังเข็ม</span>
            </span>
          </Link>
          <div className="flex-1" />
          <AuthButton />
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-muted hover:text-primary hover:bg-primary-soft transition whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
          <AdminNavLink />
        </nav>
      </div>
    </header>
  )
}


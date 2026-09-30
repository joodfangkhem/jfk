import { lp, type Locale } from '@/lib/i18n'

/** จุดทุกจุดมี slug = รหัสตัวพิมพ์เล็ก (ตรวจแล้วทั้ง 371 จุด) */
export const codeToSlug = (code: string) => code.toLowerCase()

const POINT_REF = /\[\[([A-Za-z]{1,4}-?\d{0,3}[A-Za-z-]*)\]\]/g

/** ดึงรหัสจุดที่บทความพูดถึง เอาไปเขียนลง article_points ตอนบันทึก */
export function extractPointCodes(body: string): string[] {
  const out = new Set<string>()
  for (const m of body.matchAll(POINT_REF)) out.add(m[1].toUpperCase())
  return [...out]
}

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** อนุญาตเฉพาะลิงก์ที่ปลอดภัย กัน javascript: และ data: */
function safeHref(url: string) {
  const u = url.trim()
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(u)) return esc(u)
  return '#'
}

type Opts = { locale: Locale; knownCodes?: Set<string> }

/** inline: [[CODE]] → ลิงก์หน้าจุด, **หนา**, *เอียง*, `โค้ด`, [ข้อความ](url) */
function inline(raw: string, o: Opts): string {
  let s = esc(raw)

  s = s.replace(POINT_REF, (whole, code: string) => {
    const upper = code.toUpperCase()
    if (o.knownCodes && !o.knownCodes.has(upper)) return whole
    return `<a class="point-ref" href="${lp(o.locale, `/points/${codeToSlug(upper)}`)}">${upper}</a>`
  })

  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt: string, url: string) =>
      `<img src="${safeHref(url)}" alt="${alt}" loading="lazy" />`)

  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, text: string, url: string) => `<a href="${safeHref(url)}">${text}</a>`)

  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  return s
}

/**
 * markdown ชุดเล็กที่รองรับเท่าที่บทความต้องใช้จริง
 * escape ทุกอย่างก่อนเสมอ แล้วปล่อยเฉพาะแท็กที่เราสร้างเอง — ไม่รับ HTML ดิบจากผู้เขียน
 */
export function renderMarkdown(body: string, o: Opts): string {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let list: 'ul' | 'ol' | null = null
  let para: string[] = []

  const closeList = () => {
    if (list) {
      out.push(`</${list}>`)
      list = null
    }
  }
  const closePara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '), o)}</p>`)
      para = []
    }
  }
  const flush = () => {
    closePara()
    closeList()
  }

  for (const line of lines) {
    const t = line.trim()

    if (!t) {
      flush()
      continue
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(t)
    if (heading) {
      flush()
      const level = heading[1].length
      out.push(`<h${level}>${inline(heading[2], o)}</h${level}>`)
      continue
    }

    if (/^(---|\*\*\*)$/.test(t)) {
      flush()
      out.push('<hr />')
      continue
    }

    if (t.startsWith('> ')) {
      flush()
      out.push(`<blockquote>${inline(t.slice(2), o)}</blockquote>`)
      continue
    }

    const bullet = /^[-*]\s+(.*)$/.exec(t)
    if (bullet) {
      closePara()
      if (list !== 'ul') {
        closeList()
        out.push('<ul>')
        list = 'ul'
      }
      out.push(`<li>${inline(bullet[1], o)}</li>`)
      continue
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(t)
    if (numbered) {
      closePara()
      if (list !== 'ol') {
        closeList()
        out.push('<ol>')
        list = 'ol'
      }
      out.push(`<li>${inline(numbered[1], o)}</li>`)
      continue
    }

    closeList()
    para.push(t)
  }

  flush()
  return out.join('\n')
}

/** ตัดข้อความล้วนออกมาใช้เป็น meta description ตอนที่ผู้เขียนไม่ได้กรอกเอง */
export function plainText(body: string, max = 200) {
  const s = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // ตัดสัญลักษณ์หัวข้อ/รายการทีละบรรทัด ไม่ใช่ตัดทั้งข้อความ
    // ไม่งั้นขีดกลางในรหัสจุดหายไปด้วย BL-23 จะกลายเป็น BL23
    .split('\n')
    .map((l) => l.trim().replace(/^(#{1,6}|>|[-*]|\d+[.)])\s+/, ''))
    .join(' ')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return s.length > max ? s.slice(0, max).trimEnd() + '…' : s
}

/** นาทีที่ใช้อ่าน — ไทยนับเป็นตัวอักษร ไม่ใช่คำ เพราะไม่มีเว้นวรรคระหว่างคำ */
export function readingMinutes(body: string) {
  const chars = plainText(body, Number.MAX_SAFE_INTEGER).length
  return Math.max(1, Math.round(chars / 500))
}

import { hasSupabase, supabasePublic } from '@/lib/supabase/public'
import type { Condition, ConditionPoint, Meridian, Point } from '@/lib/types'

const POINT_FIELDS =
  'id, code, slug, meridian_code, number, name_th, name_en, name_pinyin, name_zh, location_th, anatomy_th, functions_th, indications, point_types, needle_th, caution_th, species, is_common, popularity, image_url, image_alt, image_credit'

export async function getMeridians(): Promise<Meridian[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('meridians')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getMeridian(slug: string): Promise<Meridian | null> {
  if (!hasSupabase) return null
  const { data } = await supabasePublic
    .from('meridians')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data
}

export async function getPointsByMeridian(code: string): Promise<Point[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('points')
    .select(POINT_FIELDS)
    .eq('meridian_code', code)
    .order('number', { ascending: true, nullsFirst: false })
    .order('code')
  return data ?? []
}

export async function getCommonPoints(limit = 12): Promise<Point[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('points')
    .select(POINT_FIELDS)
    .eq('is_common', true)
    .order('popularity', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getAllPoints(): Promise<Point[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('points')
    .select(POINT_FIELDS)
    .order('popularity', { ascending: false })
  return data ?? []
}

export async function getPoint(slug: string): Promise<Point | null> {
  if (!hasSupabase) return null
  const { data } = await supabasePublic
    .from('points')
    .select(POINT_FIELDS)
    .eq('slug', slug)
    .maybeSingle()
  return data
}

/** ค้นหาจุด: รหัส ชื่อ ตำแหน่ง หรืออาการ */
export async function searchPoints(
  q: string,
  opts: { species?: string; meridian?: string; limit?: number } = {}
): Promise<Point[]> {
  if (!hasSupabase) return []
  let query = supabasePublic.from('points').select(POINT_FIELDS)

  const term = q.trim()
  if (term) {
    const bare = term.replace(/[-\s]/g, '')
    query = query.or(
      `search_text.ilike.%${term}%,search_text.ilike.%${bare}%`
    )
  }
  if (opts.species) query = query.contains('species', [opts.species])
  if (opts.meridian) query = query.eq('meridian_code', opts.meridian)

  const { data } = await query
    .order('popularity', { ascending: false })
    .order('meridian_code')
    .order('number', { ascending: true, nullsFirst: false })
    .limit(opts.limit ?? 60)

  if (!data) return []
  if (!term) return data

  // ให้จุดที่รหัสตรงเป๊ะขึ้นก่อน
  const norm = (s: string) => s.toLowerCase().replace(/[-\s]/g, '')
  const key = norm(term)
  return [...data].sort((a, b) => rank(a, key) - rank(b, key))
}

function rank(p: Point, key: string) {
  const code = p.code.toLowerCase().replace(/[-\s]/g, '')
  if (code === key) return 0
  if (code.startsWith(key)) return 1
  if ((p.name_pinyin ?? '').toLowerCase().includes(key)) return 2
  return 3
}

export async function getConditions(): Promise<Condition[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('conditions')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getCondition(slug: string): Promise<Condition | null> {
  if (!hasSupabase) return null
  const { data } = await supabasePublic
    .from('conditions')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data
}

export async function getConditionPoints(conditionId: string): Promise<ConditionPoint[]> {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('condition_points')
    .select(`role, note_th, sort_order, points (${POINT_FIELDS})`)
    .eq('condition_id', conditionId)
    .order('role')
    .order('sort_order')
  return (data as unknown as ConditionPoint[]) ?? []
}

/** อาการที่อ้างถึงจุดนี้ (แสดงในหน้ารายละเอียดจุด) */
export async function getPointConditions(pointId: string) {
  if (!hasSupabase) return []
  const { data } = await supabasePublic
    .from('condition_points')
    .select('role, note_th, conditions (slug, name_th, category)')
    .eq('point_id', pointId)
    .order('role')
  return (data ?? []) as unknown as {
    role: string
    note_th: string | null
    conditions: { slug: string; name_th: string; category: string | null }
  }[]
}

/** จุดที่มักใช้ร่วมกัน = จุดที่ปรากฏในอาการเดียวกันบ่อย */
export async function getRelatedPoints(pointId: string, limit = 6): Promise<Point[]> {
  if (!hasSupabase) return []
  const { data: mine } = await supabasePublic
    .from('condition_points')
    .select('condition_id')
    .eq('point_id', pointId)
  const ids = (mine ?? []).map((r) => r.condition_id)
  if (!ids.length) return []

  const { data } = await supabasePublic
    .from('condition_points')
    .select(`point_id, points (${POINT_FIELDS})`)
    .in('condition_id', ids)
    .neq('point_id', pointId)

  const counts = new Map<string, { n: number; point: Point }>()
  for (const row of (data ?? []) as unknown as { point_id: string; points: Point }[]) {
    if (!row.points) continue
    const cur = counts.get(row.point_id)
    if (cur) cur.n += 1
    else counts.set(row.point_id, { n: 1, point: row.points })
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n || b.point.popularity - a.point.popularity)
    .slice(0, limit)
    .map((v) => v.point)
}

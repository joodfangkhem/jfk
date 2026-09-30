export type Meridian = {
  code: string
  slug: string
  name_th: string
  name_en: string
  name_pinyin: string | null
  name_zh: string | null
  element: string | null
  yin_yang: string | null
  limb: string | null
  point_count: number | null
  peak_time: string | null
  summary_th: string | null
  summary_en: string | null
  sort_order: number | null
}

export type Point = {
  id: string
  code: string
  slug: string
  meridian_code: string
  number: number | null
  name_th: string | null
  name_en: string | null
  name_pinyin: string | null
  name_zh: string | null
  location_th: string
  location_en: string | null
  anatomy_th: string | null
  anatomy_en: string | null
  functions_th: string | null
  functions_en: string | null
  indications: string[]
  indications_en: string[]
  point_types: string[]
  point_types_en: string[] | null
  needle_th: string | null
  needle_en: string | null
  caution_th: string | null
  caution_en: string | null
  species: string[]
  is_common: boolean
  verified: boolean
  popularity: number
  image_url: string | null
  image_alt: string | null
  image_credit: string | null
}

export type Condition = {
  id: string
  slug: string
  name_th: string
  name_en: string | null
  category: string | null
  summary_th: string | null
  summary_en: string | null
  detail_th: string | null
  detail_en: string | null
  species: string[]
  sort_order: number | null
}

export type ConditionPoint = {
  role: string
  note_th: string | null
  note_en: string | null
  sort_order: number | null
  points: Point
}

export const SPECIES_LABEL: Record<string, string> = {
  dog: 'สุนัข',
  cat: 'แมว',
  horse: 'ม้า',
  cattle: 'วัว',
  rabbit: 'กระต่าย',
}

export const ELEMENT_LABEL: Record<string, string> = {
  metal: 'ธาตุโลหะ',
  water: 'ธาตุน้ำ',
  wood: 'ธาตุไม้',
  fire: 'ธาตุไฟ',
  earth: 'ธาตุดิน',
}

export const CATEGORY_LABEL: Record<string, string> = {
  neuro: 'ระบบประสาท',
  ortho: 'กระดูกและข้อ',
  gi: 'ทางเดินอาหาร',
  uro: 'ทางเดินปัสสาวะ',
  resp: 'ระบบหายใจ',
  derm: 'ผิวหนัง',
  behavior: 'พฤติกรรม',
  other: 'อื่นๆ',
}

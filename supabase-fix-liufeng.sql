-- =============================================================
-- JFK — แก้ชื่อจุดง่ามนิ้ว BA-FENG / LIU-FENG
--
-- เหตุผล: ตัวเลขอยู่ในชื่อจุด
--   คน  มีนิ้วเท้า 5 นิ้ว -> ง่ามนิ้วข้างละ 4 -> สองข้าง 8 -> Ba Feng (ปา=แปด)
--   สุนัข ใช้นิ้ว 4 นิ้ว   -> ง่ามนิ้วข้างละ 3 -> สองข้าง 6 -> Liu Feng (ลิ่ว=หก)
-- "Ba Feng" จึงเป็นชื่อของคน ใช้กับสุนัขไม่ได้เพราะจำนวนไม่ตรง
-- Xie's บทที่ 6 ข้อ 77 เรียกจุดชุดนี้ว่า Liu-feng (Six Raphes) ชื่อเดียว
-- แล้วระบุแยกว่า "pelvic Liu-feng" กับ "thoracic Liu-feng"
--
-- ไม่เปลี่ยนรหัสจุดและ slug เพื่อให้ URL เดิมที่ Google เก็บไว้ไม่พัง
-- เปลี่ยนเฉพาะชื่อที่แสดงและคำอธิบาย
-- =============================================================

update points set
  name_th     = 'ลิ่วเฝิง (ขาหน้า)',
  name_en     = 'Liu Feng, thoracic limb web points',
  name_pinyin = 'Liu Feng',
  name_zh     = '六縫',
  location_th = 'ที่รอยพับผิวหนังด้านหลังมือ ตรงระดับข้อ metacarpophalangeal ระหว่างนิ้วที่ 2-3, 3-4 และ 4-5 ข้างละ 3 จุด รวมสองข้าง 6 จุด',
  anatomy_th  = 'รอยพับผิวหนังระหว่างนิ้วขาหน้า ระดับข้อ metacarpophalangeal',
  location_en = 'At the skin fold on the dorsal aspect of the metacarpophalangeal joints, between digits 2-3, 3-4 and 4-5. Three points per front foot, six across both.',
  anatomy_en  = 'Skin fold between the front digits at the metacarpophalangeal joints',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.77'
where code = 'LIU-FENG';

update points set
  name_th     = 'ลิ่วเฝิง (ขาหลัง)',
  name_en     = 'Liu Feng, pelvic limb web points',
  name_pinyin = 'Liu Feng',
  name_zh     = '六縫',
  location_th = 'ที่รอยพับผิวหนังด้านหลังเท้าหลัง ตรงระดับข้อ metatarsophalangeal ระหว่างนิ้วที่ 2-3, 3-4 และ 4-5 ข้างละ 3 จุด รวมสองข้าง 6 จุด',
  anatomy_th  = 'รอยพับผิวหนังระหว่างนิ้วเท้าหลัง ระดับข้อ metatarsophalangeal',
  location_en = 'At the skin fold on the dorsal aspect of the metatarsophalangeal joints, between digits 2-3, 3-4 and 4-5. Three points per hind foot, six across both.',
  anatomy_en  = 'Skin fold between the hind digits at the metatarsophalangeal joints',
  caution_th  = 'ชื่อ "ปาเฟิง" (Ba Feng 八風 แปลว่าแปดลม) เป็นชื่อของจุดในคน ซึ่งมีนิ้วเท้า 5 นิ้ว จึงมีง่ามนิ้วข้างละ 4 รวม 8 จุด สุนัขใช้นิ้วเพียง 4 นิ้ว มีง่ามนิ้วข้างละ 3 รวม 6 จุด จึงเรียกว่า "ลิ่วเฝิง" (Liu Feng 六縫 แปลว่าหกตะเข็บ) ตามจำนวนที่มีจริง',
  caution_en  = 'The name Ba Feng (八風, "eight winds") belongs to the human point: people have five toes, so four webs per foot and eight points in all. A dog uses four digits, giving three webs per foot and six points, which is why the canine point is Liu Feng (六縫, "six raphes").',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.77'
where code = 'BA-FENG';

select code, slug, name_th, name_en, name_zh from points
where code in ('LIU-FENG','BA-FENG') order by code;

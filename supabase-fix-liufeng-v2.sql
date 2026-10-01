-- =============================================================
-- JFK — จัดโครงสร้างจุดง่ามนิ้วใหม่ให้ถูกต้อง
--
-- LIU-FENG (六縫 ลิ่วเฝิง) = จุดของสัตว์ มีทั้งขาหน้าและขาหลัง
--   สุนัขใช้นิ้ว 4 นิ้ว จึงมีง่ามนิ้วข้างละ 3 รวมเท้าหน้าสองข้าง 6 จุด
--   และเท้าหลังสองข้างอีก 6 จุด ตำราเรียกรวมว่า Liu-feng ชื่อเดียว
--   แล้วระบุว่าใช้ชุดขาหน้าหรือขาหลัง
--
-- BA-FENG (八風 ปาเฟิง) = จุดของคน ไม่ใช่จุดในสัตว์
--   คนมีนิ้วเท้า 5 นิ้ว จึงมีง่ามนิ้วข้างละ 4 รวมสองข้าง 8 จุด
--   ของเดิมใส่ไว้เป็นจุดในสัตว์ ซึ่งไม่ถูก
--
-- ไม่ลบแถวและไม่เปลี่ยน slug เพื่อให้ URL เดิมไม่พัง
-- แต่ติดป้ายให้ชัดว่าเป็นจุดของคน และตัดออกจากตัวกรองชนิดสัตว์
-- =============================================================

-- ---------- 1) LIU-FENG จุดของสัตว์ ครอบคลุมทั้งสี่เท้า ----------
update points set
  name_th     = 'ลิ่วเฝิง',
  name_en     = 'Liu Feng (web points)',
  name_pinyin = 'Liu Feng',
  name_zh     = '六縫',
  location_th = 'ที่รอยพับผิวหนังระหว่างนิ้ว ด้านหลังมือและด้านหลังเท้า ตรงระดับข้อนิ้ว (metacarpophalangeal และ metatarsophalangeal) ระหว่างนิ้วที่ 2-3, 3-4 และ 4-5 เท้าละ 3 จุด — ขาหน้าสองข้างรวม 6 จุด ขาหลังสองข้างอีก 6 จุด เวลาใช้ให้เลือกชุดขาหน้าหรือขาหลังตามอาการ',
  anatomy_th  = 'รอยพับผิวหนังระหว่างนิ้ว ระดับข้อนิ้ว ทั้งเท้าหน้าและเท้าหลัง',
  functions_th = 'ระบายความร้อนและความชื้นที่ปลายขา ลดบวม ลดคัน ใช้กับเท้าอักเสบและรายที่เลียเท้าไม่หยุด · ชุดขาหน้าใช้กับปัญหาขาหน้า ชุดขาหลังใช้กับปัญหาขาหลัง',
  location_en = 'At the skin folds between the digits on the dorsum of the paw, level with the metacarpophalangeal and metatarsophalangeal joints, between digits 2-3, 3-4 and 4-5. Three points per foot: six across both front feet and six across both hind feet. Use the front or the hind set according to the limb affected.',
  anatomy_en  = 'Skin folds between the digits at the toe joints, front and hind feet',
  functions_en = 'Clears heat and damp from the distal limb, reduces swelling and itching. Used for pododermatitis and persistent paw licking. The front set treats the thoracic limbs, the hind set the pelvic limbs.',
  indications   = '{"เท้าอักเสบ","คันเท้า","pododermatitis","เลียเท้า","ภูมิแพ้เท้า","ขาบวม"}'::text[],
  indications_en = '{"pododermatitis","itchy paws","paw licking","atopic paw disease","distal limb swelling"}'::text[],
  species = '{dog,cat}'::text[],
  is_common = true, popularity = 60,
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.77'
where code = 'LIU-FENG';

-- ---------- 2) BA-FENG ติดป้ายว่าเป็นจุดของคน ----------
update points set
  name_th     = 'ปาเฟิง (จุดของคน)',
  name_en     = 'Ba Feng (a human point)',
  name_pinyin = 'Ba Feng',
  name_zh     = '八風',
  location_th = 'เป็นจุดในวิชาฝังเข็มของคน อยู่ที่รอยพับผิวหนังระหว่างนิ้วเท้าทั้งสี่ง่ามของแต่ละข้าง รวมสองข้าง 8 จุด — ชื่อ "ปา" (八) แปลว่าแปด ตามจำนวนจุดที่มี',
  anatomy_th  = 'ง่ามนิ้วเท้าคน ข้างละ 4 ง่าม',
  functions_th = 'จุดนี้ไม่ใช่จุดที่ใช้ในสัตว์ เพราะคนมีนิ้วเท้า 5 นิ้ว จึงมีง่ามนิ้วข้างละ 4 รวม 8 จุด ส่วนสุนัขใช้นิ้วเพียง 4 นิ้ว มีง่ามนิ้วข้างละ 3 รวม 6 จุด จุดชุดเดียวกันในสัตว์จึงเรียกว่า ลิ่วเฝิง (六縫) ตามจำนวนที่มีจริง',
  caution_th  = 'อย่าใช้ชื่อนี้กับสัตว์ ให้ใช้ ลิ่วเฝิง (LIU-FENG) แทน',
  location_en = 'A point from human acupuncture, at the skin folds between the toes — four webs per foot, eight points across both. The name Ba (八) means eight, after the number of points.',
  anatomy_en  = 'Human toe webs, four per foot',
  functions_en = 'This is not a point used in animals. A person has five toes, giving four webs per foot and eight points. A dog uses four digits, giving three webs per foot and six points, so the equivalent canine point is Liu Feng (六縫), named for the number it actually has.',
  caution_en  = 'Do not use this name in animals — use Liu Feng (LIU-FENG) instead.',
  point_types    = '{"จุดในคน ไม่ใช่จุดในสัตว์"}'::text[],
  point_types_en = '{"Human point, not used in animals"}'::text[],
  indications    = '{}'::text[],
  indications_en = '{}'::text[],
  species = '{}'::text[],
  is_common = false, popularity = 5,
  verified = true, verified_source = 'ไม่ปรากฏเป็นจุดในสัตว์ใน Xie''s Veterinary Acupuncture (2007) — ตำราใช้ Liu-feng (ch.6 no.77)'
where code = 'BA-FENG';

-- ---------- 3) ย้ายการจับคู่อาการมาที่ LIU-FENG ----------
delete from condition_points
where point_id = (select id from points where code = 'BA-FENG');

update condition_points set note_th = 'รายเลียเท้า ใช้ชุดขาหน้าหรือขาหลังตามเท้าที่เป็น',
                            note_en = 'For paw licking — use the front or hind set according to the foot affected'
where point_id = (select id from points where code = 'LIU-FENG');

select code, name_th, name_en, species, is_common,
       cardinality(indications) as จำนวนข้อบ่งใช้
from points where code in ('LIU-FENG','BA-FENG') order by code;

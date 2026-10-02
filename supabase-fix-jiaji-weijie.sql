-- ======================================================================
-- 1) WEI-GEN -> WEI-JIE   เปลี่ยนชื่อจุดให้ตรงตำรา + แก้สรรพคุณและเทคนิค
-- 2) JIA-JI               จำกัดเป็นชุดลำตัว T1-L7 (ฮวาถัวเจี๊ยจี่) เท่านั้น
-- 3) JING-JIA-JI          เพิ่มชุดคอ C1-C8 เป็นจุดใหม่
--
-- ตรวจเทียบ Xie's Veterinary Acupuncture (2007) บทที่ 6 no.21, 37, 40
-- (ยืนยันจากหน้าจริงของตำรา ไม่ได้ใช้เฉพาะตัวแยกข้อความ)
-- ตารางอื่นอ้างถึงจุดด้วย points.id ที่เป็น uuid การเปลี่ยน code/slug
-- จึงไม่กระทบรายการโปรด โน้ต ชุดจุด รูป หรือการจับคู่อาการ
-- ======================================================================

-- ---------------------------------------------------------------- 1 --
-- ตำราเรียกจุดที่ Cd1-Cd2 ว่า Wei-jie (尾杰) ส่วนชื่อ Wei-gen ตำราใช้กับ GV-2
-- ที่อยู่ถัดขึ้นไปหนึ่งข้อ ตรงรอยต่อกระเบนเหน็บกับหาง
-- สรรพคุณเดิมเป็นของ Hou-hai (GV-1) ซึ่งเป็นคนละจุด จึงย้ายออก
update points set
  code        = 'WEI-JIE',
  slug        = 'wei-jie',
  name_th     = 'เหว่ยเจี๋ย',
  name_en     = 'Wei Jie (tail vertebrae)',
  name_pinyin = 'Wei Jie',
  name_zh     = '尾杰',
  location_th = 'แนวกลางหลัง ที่โคนหาง ในช่องระหว่างกระดูกหางข้อที่ 1 และ 2 (Cd1-Cd2)',
  anatomy_th  = 'ช่องระหว่างกระดูกหางข้อที่ 1 และ 2 บนแนวกลาง',
  location_en = 'On the dorsal midline between the first and second caudal vertebrae (Cd1-Cd2)',
  anatomy_en  = 'Dorsal midline between Cd1 and Cd2',
  functions_th = 'เดินลมปราณบริเวณหางและส่วนท้ายของลำตัว ใช้ร่วมกับจุดอื่นในรายขาหลังอ่อนแรง',
  functions_en = 'Moves qi at the tail and caudal body; used with other points for pelvic limb weakness',
  indications    = '{หางอ่อนแรง,หางเป็นอัมพาต,ขาหลังอ่อนแรง,ขาหลังเป็นอัมพาต}',
  indications_en = '{tail weakness,tail paralysis,pelvic limb weakness,pelvic limb paralysis}',
  needle_th   = 'ตั้งฉาก ตื้นมาก ลึกราว 0.1-0.3 cun',
  needle_en   = 'Perpendicular, very shallow, 0.1-0.3 cun',
  caution_th  = 'ผิวบางและอยู่ชิดข้อกระดูกหาง อย่าแทงลึก / อย่าสับสนกับ GV-1 (โฮ่วไห่) ที่อยู่ใต้โคนหางเหนือทวารหนัก และ GV-2 ที่อยู่ถัดขึ้นไปหนึ่งข้อ',
  caution_en  = 'Thin skin directly over the caudal joint - do not needle deep. Not to be confused with GV-1 (Hou-hai), below the tail base above the anus, nor with GV-2 one space cranial.',
  popularity  = 30,
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 (fig. ref 37)'
where code = 'WEI-GEN';

-- สรรพคุณท้องผูกเป็นของ GV-1 ซึ่งจับคู่กับอาการนี้อยู่แล้ว จึงลบคู่ที่ซ้ำและผิดออก
delete from condition_points cp
using conditions c, points p
where cp.condition_id = c.id and cp.point_id = p.id
  and c.slug = 'constipation' and p.code = 'WEI-JIE';

-- ---------------------------------------------------------------- 2 --
-- ตำราแยกเจี๊ยจี่เป็นสองชุด ชุดลำตัวคือ Hua-tuo-jia-ji ครอบคลุม T1-L7 เท่านั้น
-- ข้อบ่งใช้เรื่องคอจึงย้ายไปอยู่กับชุดคอที่เพิ่มด้านล่าง
update points set
  name_th     = 'ฮวาถัวเจี๊ยจี่ (เจี๊ยจี่ลำตัว)',
  name_en     = 'Hua Tuo Jia Ji (thoracolumbar paravertebral)',
  functions_th = 'เปิดทางเดินลมปราณตามแนวสันหลังช่วงอกและเอว ใช้ปักคร่อมระดับที่มีพยาธิสภาพ',
  functions_en = 'Opens the channels along the thoracolumbar spine; needled around the affected level',
  indications    = '{หมอนรองกระดูก,IVDD,ปวดหลัง,ปวดหลังช่วงอก,ปวดเอว,อัมพาต,กระดูกสันหลังเสื่อม}',
  indications_en = '{intervertebral disk disease,IVDD,back pain,thoracic pain,lumbar pain,paralysis,spondylosis}',
  needle_th   = 'ตั้งฉาก ลึกราว 0.5 cun ปักคร่อม 2-3 ระดับเหนือและใต้รอยโรค นิยมทำ electroacupuncture คร่อมรอยโรค',
  needle_en   = 'Perpendicular, 0.5 cun. Needle 2-3 levels above and below the lesion; often used for electroacupuncture across the lesion.',
  caution_th  = 'ในช่วงอกอย่าแทงตั้งฉากลึกเกินกำหนด เสี่ยงปอดรั่ว',
  caution_en  = 'Over the thorax do not exceed the stated depth on a perpendicular insertion - risk of pneumothorax',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 (fig. ref 40)'
where code = 'JIA-JI';

-- ---------------------------------------------------------------- 3 --
insert into points (
  code, slug, meridian_code, number,
  name_th, name_en, name_pinyin, name_zh,
  location_th, anatomy_th, location_en, anatomy_en,
  functions_th, functions_en, indications, indications_en, point_types,
  needle_th, needle_en, caution_th, caution_en,
  species, is_common, popularity, verified, verified_source
) values (
  'JING-JIA-JI','jing-jia-ji','EX',null,
  'จิงเจี๊ยจี่ (เจี๊ยจี่คอ)','Jing Jia Ji (cervical paravertebral)','Jing Jia Ji','頸夾脊',
  'ด้านข้างของคอ เป็นสองแถว อยู่เหนือและใต้ปลาย transverse process ของกระดูกคอแต่ละข้อ ห่างออกไปแถวละ 0.5 cun ตลอดแนว C1 ถึง C8',
  'ด้านข้างคอ เหนือและใต้ปลาย transverse process ของ C1-C8 ห่าง 0.5 cun',
  'Two rows of points on the lateral aspect of the neck, 0.5 cun above and below the transverse process of each cervical vertebra, from C1 to C8',
  'Lateral neck, 0.5 cun dorsal and ventral to the transverse processes of C1-C8',
  'คลายกล้ามเนื้อคอและเปิดทางเดินลมปราณบริเวณคอ ใช้ปักคร่อมระดับที่มีพยาธิสภาพ',
  'Relaxes the cervical musculature and opens the channels of the neck; needled around the affected level',
  '{ปวดคอ,คอตึง,หมอนรองกระดูกคอ,IVDD คอ,Wobbler,ขาหน้าอ่อนแรง}',
  '{cervical pain,neck stiffness,cervical intervertebral disk disease,cervical IVDD,Wobbler syndrome,thoracic limb weakness}',
  '{จุดคลาสสิกในสัตว์,ชุดจุด}',
  'ตั้งฉาก ลึกราว 1 cun',
  'Perpendicular, 1 cun',
  'ด้านข้างคอมีหลอดเลือดดำ jugular หลอดลม และหลอดอาหารอยู่ใกล้ ให้คลำยืนยันปลาย transverse process ก่อนลงเข็มทุกครั้ง',
  'The jugular vein, trachea and oesophagus all lie close by - palpate and confirm the transverse process before every insertion',
  '{dog,cat}', true, 85, true, 'Xie''s Veterinary Acupuncture (2007) ch.6 (fig. ref 21)'
)
on conflict (code) do update set
  slug = excluded.slug, name_th = excluded.name_th, name_en = excluded.name_en,
  name_pinyin = excluded.name_pinyin, name_zh = excluded.name_zh,
  location_th = excluded.location_th, anatomy_th = excluded.anatomy_th,
  location_en = excluded.location_en, anatomy_en = excluded.anatomy_en,
  functions_th = excluded.functions_th, functions_en = excluded.functions_en,
  indications = excluded.indications, indications_en = excluded.indications_en,
  point_types = excluded.point_types,
  needle_th = excluded.needle_th, needle_en = excluded.needle_en,
  caution_th = excluded.caution_th, caution_en = excluded.caution_en,
  species = excluded.species, is_common = excluded.is_common,
  popularity = excluded.popularity, verified = excluded.verified,
  verified_source = excluded.verified_source;

-- ย้ายการจับคู่ "ปวดคอ" จากชุดลำตัวไปชุดคอ แล้วเพิ่มคู่ที่ควรมี
delete from condition_points cp
using conditions c, points p
where cp.condition_id = c.id and cp.point_id = p.id
  and c.slug = 'neck-pain' and p.code = 'JIA-JI';

insert into condition_points (condition_id, point_id, role, note_th, sort_order)
select c.id, p.id, v.role, nullif(v.note,''), v.ord
from (values
  ('neck-pain','JING-JIA-JI','primary','ปักคร่อมระดับที่กดเจ็บ คลำยืนยันปลายกระดูกก่อนลงเข็ม',6)
) as v(cond, code, role, note, ord)
join conditions c on c.slug = v.cond
join points     p on p.code = v.code
on conflict (condition_id, point_id) do update set
  role = excluded.role, note_th = excluded.note_th, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------- ตรวจผล --
select code, slug, name_th, name_zh, popularity, verified
from points
where code in ('WEI-JIE','JIA-JI','JING-JIA-JI')
order by code;

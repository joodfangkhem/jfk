-- =============================================================
-- JFK — เติมคำเตือนชื่อซ้ำที่จุด BAI-HUI
--
-- ตำราของ Xie ใช้ชื่อ "Bai-hui" (百會) กับสองจุดที่อยู่คนละที่
--   บทที่ 5  GV-20 Bai-hui        อยู่บนกระหม่อม — เป็นจุดที่คนใช้
--   บทที่ 6  33 Bai-hui           อยู่ที่เอว-กระเบนเหน็บ (L7-S1) — จุดที่สัตวแพทย์ใช้
-- ไม่ใช่ข้อมูลผิด แต่เป็นชื่อซ้ำที่มากับขนบการตั้งชื่อ
--
-- GV-20 มีคำเตือนอยู่แล้ว ส่วน BAI-HUI ยังไม่มี ทั้งที่เป็นหน้าที่คนเปิดมากที่สุด
-- =============================================================

update points set
  caution_th = 'อย่าแทงลึกเกินจนถึงไขสันหลังในสัตว์ตัวเล็ก · ระวังสับสนกับชื่อ: 百會 (Bai Hui) เป็นชื่อของสองจุดที่อยู่คนละที่ จุดนี้คือจุดคลาสสิกที่เอว-กระเบนเหน็บซึ่งสัตวแพทย์ใช้บ่อยที่สุด ส่วนในวิชาฝังเข็มของคน Bai Hui หมายถึง GV-20 ที่อยู่บนกระหม่อม',
  caution_en = 'Do not needle deeply enough to reach the spinal canal in a small animal. Note the shared name: 百會 (Bai Hui) belongs to two different points. This is the classical lumbosacral point, the one used most in veterinary practice. In human acupuncture Bai Hui means GV-20, on the top of the head.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.33'
where code = 'BAI-HUI';

-- ให้ชื่ออังกฤษของ GV-20 ค้นเจอด้วยคำว่า Bai Hui เหมือนกัน
update points set
  name_en = 'Bai Hui (GV-20, on the head)',
  point_types    = '{"จุดบนศีรษะ"}'::text[],
  point_types_en = '{"Point on the head"}'::text[]
where code = 'GV-20';

select code, name_th, name_en, name_zh, left(caution_th, 60) as ระวัง
from points where code in ('BAI-HUI','GV-20') order by code;

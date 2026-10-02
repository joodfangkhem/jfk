-- ======================================================================
-- GV-14 และ ST-9 — ปิดท้ายเส้น BL, GV, ST, GB
--
-- สองจุดนี้กันไว้ก่อนหน้านี้เพราะข้อควรระวังไม่ได้เป็นเรื่องปอดรั่ว
-- แต่เป็นไขสันหลัง (GV-14) และหลอดเลือด carotid (ST-9)
-- สัตวแพทย์เจ้าของเว็บตัดสินแล้วว่าทั้งสองจุดใช้ตามตำราได้
-- ======================================================================

-- GV-14 ต้าจุย — ช่องระหว่าง C7 กับ T1 ในสุนัขกว้างและลึกพอสำหรับแทงตั้งฉาก
-- ข้อควรระวังเดิมเขียนว่า "อย่าแทงตรงลึก" ซึ่งจะขัดกับเทคนิคใหม่ จึงต้องเขียนใหม่
-- ให้เป็นการกำกับความลึกและการคลำยืนยัน แทนการห้ามแทงตั้งฉาก
update points set
  needle_th  = 'แทงตั้งฉาก ลึกราว 2 cun',
  needle_en  = 'Perpendicular insertion: dry-needle depth 2 cun',
  caution_th = 'ช่องระหว่าง C7 กับ T1 กว้างและลึกพอสำหรับแทงตั้งฉากในสุนัข แต่ให้คลำยืนยันปุ่มกระดูก T1 (ปุ่มแรกที่คลำได้เมื่อไล่จากคอลงมาทางท้าย) ก่อนลงเข็มทุกครั้ง และอย่าแทงเกินความลึกที่กำหนด',
  caution_en = 'The space between C7 and T1 is wide and deep enough for a perpendicular insertion in the dog, but palpate and confirm the T1 spinous process (the first one palpable working caudally from the neck) before every insertion, and do not exceed the stated depth.',
  verified = true,
  verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'GV-14';

-- ST-9 เหรินอิ๋ง — ความลึกตามตำรา ข้อควรระวังเรื่องหลอดเลือดคงไว้ตามเดิม
-- เพราะไม่ได้ขัดกับการแทงตั้งฉาก และยิ่งสำคัญขึ้นเมื่อความลึกเพิ่มขึ้น
update points set
  needle_th = 'แทงตั้งฉาก ลึกราว 1.5 cun',
  needle_en = 'Perpendicular insertion: dry-needle depth 1.5 cun',
  verified = true,
  verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'ST-9';

-- ---------- ตรวจผล: ควรไม่เหลือจุดที่ยังเป็น ซม. ในสี่เส้นนี้ ----------
select
  count(*) filter (where needle_th like '%cun%') as ใช้หน่วย_cun,
  count(*) filter (where needle_th like '%ซม.%') as ยังเป็น_ซม,
  count(*)                                        as ทั้งหมด
from points
where meridian_code in ('BL','GV','ST','GB');

select code, needle_th
from points
where needle_th like '%ซม.%' and meridian_code in ('BL','GV','ST','GB')
order by code;

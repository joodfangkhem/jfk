-- ======================================================================
-- จุดคลาสสิกชุดเดิมที่ยังเป็น ซม. — ไม่ได้อยู่ในไฟล์ไหนเลยก่อนหน้านี้
-- ที่มา: Xie's Veterinary Acupuncture (2007) บทที่ 6 หัวข้อ METHOD
--
-- BA-FENG ไม่แตะ เพราะเป็นจุดของคน ไม่ได้อยู่ในชุด 77 จุดของสุนัข
-- ตำราจึงไม่มี METHOD สำหรับสัตว์ให้อ้างอิง
-- ======================================================================

update points p set
  needle_th = v.nth, needle_en = v.nen, verified = true,
  verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
from (values
  ('AN-SHEN',
   'แทงตั้งฉาก ลึกราว 0.3-0.5 cun',
   'Perpendicular insertion: dry-needle depth 0.3-0.5 cun'),
  ('BAI-HUI',
   'แทงตั้งฉาก ลึกราว 0.5 cun เหมาะทำ electroacupuncture คู่กับ GV-3 หรือ BL-23',
   'Perpendicular insertion: dry-needle depth 0.5 cun; suits electroacupuncture paired with GV-3 or BL-23'),
  ('DA-FENG-MEN',
   'แทงขนานผิวหนัง ชี้ออกจากจมูกเมื่อต้องการสงบ หรือชี้เข้าหาจมูกเมื่อต้องการบำรุง ลึกราว 0.5-1 cun ฝังลูกปัดทองหรือไหมที่จุดนี้ได้',
   'Horizontal insertion, away from the nose for sedation or toward the nose for tonification: dry-needle depth 0.5-1 cun; a gold bead or suture material may be implanted here'),
  ('SHAN-GEN',
   'แทงตั้งฉาก ลึกราว 0.5-1 cun',
   'Perpendicular insertion: dry-needle depth 0.5-1 cun'),
  ('ER-JIAN',
   'แทงตั้งฉาก ลึกราว 0.3 cun หรือใช้ปล่อยเลือด',
   'Perpendicular insertion: dry-needle depth 0.3 cun, or used as a bleeding point'),
  ('LIU-FENG',
   'แทงเฉียง ลึกราว 0.5 cun',
   'Oblique insertion: dry-needle depth 0.5 cun')
) as v(code, nth, nen)
where p.code = v.code;

-- ---------- ตรวจผล: ควรเหลือแค่ BA-FENG ----------
select code, name_th, needle_th
from points
where meridian_code = 'EX' and (needle_th is null or needle_th not like '%cun%')
order by code;

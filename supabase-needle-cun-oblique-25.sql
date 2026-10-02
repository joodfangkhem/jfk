-- ======================================================================
-- 25 จุดเหนือช่องอกและกะโหลก — ใช้ความลึก cun ตามตำรา แต่คงมุมเฉียงไว้
--
-- ตำรา (Xie's 2007 บทที่ 5) ระบุ METHOD ว่า perpendicular
-- แต่ตำแหน่งชุดนี้แปลงมาจากคน ซึ่งผนังอกหนากว่าสัตว์เล็กมาก
-- ในสุนัขและแมวการแทงตั้งฉากตรงนี้เสี่ยงปอดรั่ว จึงคงมุมเฉียงตามที่
-- ใช้กันจริงในคลินิก และเอาเฉพาะ "ความลึก" มาจากตำรา
--
-- ข้อควรระวังเดิม (ห้ามแทงตั้งฉาก เสี่ยงปอดรั่ว) คงไว้ ไม่แตะ
-- ======================================================================

update points p set
  needle_th = v.nth,
  needle_en = v.nen,
  verified = true,
  verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5 — ความลึกตามตำรา มุมเฉียงตามการใช้จริงในสัตว์เล็ก'
from (values
  ('BL-11', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular to oblique at this depth)'),
  ('BL-12', 'แทงเฉียง 30-45 องศาเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion at 30-45 degrees toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-13', 'แทงเฉียง 30-45 องศาเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion at 30-45 degrees toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-14', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-15', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 1 cun', 'Oblique insertion toward the midline, 1 cun (the text gives perpendicular at this depth)'),
  ('BL-16', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-17', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-41', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-42', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-43', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun เหมาะรมยา', 'Oblique insertion toward the midline, 0.5-1 cun; suits moxibustion (the text gives perpendicular at this depth)'),
  ('BL-44', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 1 cun', 'Oblique insertion toward the midline, 1 cun (the text gives perpendicular at this depth)'),
  ('BL-45', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('BL-46', 'แทงเฉียงเข้าหาแนวกลาง ลึกราว 0.5-1 cun', 'Oblique insertion toward the midline, 0.5-1 cun (the text gives perpendicular at this depth)'),
  ('GB-8',  'แทงเฉียงขนานกะโหลก ลึกราว 0.5 cun', 'Oblique insertion parallel to the skull, 0.5 cun (the text gives perpendicular at this depth)'),
  ('GB-9',  'แทงเฉียงขนานกะโหลก ลึกราว 0.5 cun', 'Oblique insertion parallel to the skull, 0.5 cun (the text gives perpendicular at this depth)'),
  ('GB-22', 'แทงเฉียงตามแนวซี่โครง ลึกราว 1 cun', 'Oblique insertion along the rib, 1 cun (the text gives perpendicular at this depth)'),
  ('GB-23', 'แทงเฉียงตามแนวซี่โครง ลึกราว 1 cun', 'Oblique insertion along the rib, 1 cun (the text gives perpendicular at this depth)'),
  ('GB-24', 'แทงเฉียงตามแนวซี่โครง ลึกราว 1 cun', 'Oblique insertion along the rib, 1 cun (the text gives perpendicular at this depth)'),
  ('GB-25', 'แทงเฉียงตามแนวซี่โครง ลึกราว 1 cun', 'Oblique insertion along the rib, 1 cun (the text gives perpendicular at this depth)'),
  ('ST-8',  'แทงเฉียงขนานกะโหลก ลึกราว 0.5 cun', 'Oblique insertion parallel to the skull, 0.5 cun (the text gives perpendicular at this depth)'),
  ('ST-13', 'แทงเฉียงตามแนวซี่โครง ลึกราว 0.5 cun', 'Oblique insertion along the rib, 0.5 cun (the text gives perpendicular at this depth)'),
  ('ST-14', 'แทงเฉียงตามแนวซี่โครง ลึกราว 0.5 cun', 'Oblique insertion along the rib, 0.5 cun (the text gives perpendicular at this depth)'),
  ('ST-15', 'แทงเฉียงตามแนวซี่โครง ลึกราว 0.5 cun', 'Oblique insertion along the rib, 0.5 cun (the text gives perpendicular at this depth)'),
  ('ST-16', 'แทงเฉียงตามแนวซี่โครง ลึกราว 0.5 cun', 'Oblique insertion along the rib, 0.5 cun (the text gives perpendicular at this depth)'),
  ('ST-18', 'แทงเฉียงตามแนวซี่โครง ลึกราว 0.5 cun', 'Oblique insertion along the rib, 0.5 cun (the text gives perpendicular at this depth)')
) as v(code, nth, nen)
where p.code = v.code;

-- ---------- ตรวจผล ----------
select
  count(*) filter (where needle_th like '%cun%') as ใช้หน่วย_cun,
  count(*) filter (where needle_th like '%ซม.%') as ยังเป็น_ซม,
  count(*)                                        as ทั้งหมด
from points
where meridian_code in ('BL','GV','ST','GB');

select code, needle_th from points where needle_th like '%ซม.%' and meridian_code in ('BL','GV','ST','GB') order by code;

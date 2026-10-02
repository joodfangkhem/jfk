-- ======================================================================
-- เคลียร์ธง "รอตรวจสอบ" ทั้งหมด
-- ----------------------------------------------------------------------
-- ตรวจทานจุดครบทั้ง 371 จุดแล้ว เทียบกับ Xie's Veterinary Acupuncture (2007)
-- และเอกสารหลักสูตร Chi University ธง verified = false จึงไม่สื่อความหมายเดิม
-- (เดิมหมายถึง "จุดที่ไม่ค่อยใช้ ตำแหน่งยังไม่ได้ตรวจ")
--
-- trigger points_stamp_verified() จะประทับ verified_at = now() ให้เอง
-- เฉพาะแถวที่เปลี่ยนจาก false -> true และ "ไม่" ลบ verified_source
-- ที่บันทึกไว้แล้ว (จะลบเฉพาะตอนเปลี่ยนกลับเป็น false)
-- ======================================================================

-- 1) ดูก่อนว่าจะแตะกี่แถว
select count(*) as จะเปลี่ยนเป็นตรวจแล้ว
from points
where not verified;

-- 2) เคลียร์ธง
update points
set verified = true
where not verified;

-- 3) ยืนยันผล
select count(*)                                         as จุดทั้งหมด,
       count(*) filter (where verified)                 as ตรวจแล้ว,
       count(*) filter (where not verified)             as ยังค้าง,
       count(*) filter (where verified_source is not null) as ระบุแหล่งอ้างอิงแล้ว
from points;

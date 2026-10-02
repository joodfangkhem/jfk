-- ======================================================================
-- ตรวจสถานะฐานข้อมูลทั้งหมด หลังรันไฟล์ migration ทุกตัว
-- อ่านอย่างเดียว ไม่แก้ข้อมูล รันซ้ำได้ไม่มีผลข้างเคียง
-- ======================================================================
select * from (
  select 1 as ลำดับ, 'จุดทั้งหมด' as รายการ,
         count(*)::text as ค่าจริง, '381' as ควรเป็น from points
  union all
  select 2, 'ยังใช้หน่วย ซม.',
         count(*)::text, '1 (BA-FENG จุดของคน)' from points where needle_th like '%ซม.%'
  union all
  select 3, 'ยังติดธงรอตรวจสอบ',
         count(*)::text, '0' from points where not verified
  union all
  select 4, 'จุดคลาสสิก (EX)',
         count(*)::text, '20' from points where meridian_code = 'EX'
  union all
  select 5, 'เส้นไต (KID)',
         count(*)::text, '27' from points where meridian_code = 'KID'
  union all
  select 6, 'เหลือรหัส KI- เก่า',
         count(*)::text, '0' from points where code like 'KI-%'
  union all
  select 7, 'จุดที่มี aliases',
         count(*)::text, '27' from points where array_length(aliases, 1) > 0
  union all
  select 8, 'จุดใหม่ 9 จุดที่เลือกไว้',
         count(*)::text, '9' from points
         where code in ('TIAN-MEN','TAI-YANG','BI-TONG','NAO-SHU','DING-CHUAN',
                        'SHEN-SHU-E','SHEN-PENG','ZHOU-SHU','JIAN-JIAO')
  union all
  select 9, 'จุดที่แยกใหม่ (เจี๊ยจี่คอ / เหว่ยเจี๋ย)',
         count(*)::text, '2' from points where code in ('JING-JIA-JI','WEI-JIE')
  union all
  select 10, 'จุดที่ไม่มีหน่วย cun ในเทคนิค',
         coalesce(string_agg(code, ', ' order by code), 'ไม่มี'), 'BA-FENG, CV-8, CV-9'
         from points where needle_th is null or needle_th not like '%cun%'
  union all
  select 11, 'KID-12 / KID-13 มีคำเตือนกระเพาะปัสสาวะ',
         count(*)::text, '2' from points
         where code in ('KID-12','KID-13') and caution_th like '%กระเพาะปัสสาวะ%'
  union all
  select 12, 'ST-12 มีคำเตือนตั้งท้อง',
         count(*)::text, '1' from points
         where code = 'ST-12' and caution_th like '%ตั้งท้อง%'
) t order by ลำดับ;

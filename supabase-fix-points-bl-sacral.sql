-- =============================================================
-- JFK — แก้จุด BL ช่วงกระเบนเหน็บ ตามที่เทียบกับ Xie's หน้า 165-166
-- ปัญหา: คำอธิบายเดิมอ้างอิงกายวิภาคคน (sacrum 5 ข้อ รูกระเบนเหน็บ 4 คู่)
--        แต่สุนัขมีกระดูกกระเบนเหน็บเชื่อมกันแค่ 3 ข้อ จึงไม่มี "รูคู่ที่ 4"
--        และ BL-31 ถึง BL-34 ในสุนัขไม่ได้อยู่ที่รูกระเบนเหน็บ
--        แต่อยู่กึ่งกลางระหว่างเส้น BL แถวใน กับแนวกลางหลัง
-- อ่านตารางเปรียบเทียบให้ครบก่อนรัน
-- =============================================================

update points set
  location_th = 'ห่างแนวกลางหลังออกข้าง 1.5 cun ที่ช่องระหว่างกระดูกกระเบนเหน็บข้อที่ 1 กับข้อที่ 2 (S1-S2) อยู่ในร่องระหว่างกระดูก sacrum กับขอบในของปีกกระดูกเชิงกราน',
  anatomy_th  = 'ช่อง S1-S2 ระหว่าง sacrum กับขอบในของปีกกระดูกเชิงกราน',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the midline at the first sacral intervertebral space (S1-S2), in the groove between the sacrum and the medial border of the wing of the ilium',
  anatomy_en  = 'S1-S2 space, between the sacrum and the medial border of the ilial wing',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.165'
where code = 'BL-28';

update points set
  location_th = 'ห่างแนวกลางหลังออกข้าง 1.5 cun ที่ช่องระหว่างกระดูกกระเบนเหน็บข้อที่ 2 กับข้อที่ 3 (S2-S3) อยู่ระหว่างกระดูก sacrum กับปีกกระดูกเชิงกราน',
  anatomy_th  = 'ช่อง S2-S3 ระหว่าง sacrum กับปีกกระดูกเชิงกราน',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the midline at the second sacral intervertebral space (S2-S3), between the sacrum and the wing of the ilium',
  anatomy_en  = 'S2-S3 space, between the sacrum and the ilial wing',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.165'
where code = 'BL-29';

update points set
  location_th = 'ห่างแนวกลางหลังออกข้าง 1.5 cun ที่ช่องรอยต่อระหว่างกระดูกกระเบนเหน็บข้อสุดท้ายกับกระดูกหางข้อแรก (S3-Cd1)',
  anatomy_th  = 'ช่องรอยต่อกระเบนเหน็บ-หาง (S3-Cd1)',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the midline at the sacrocaudal space (S3-Cd1)',
  anatomy_en  = 'Sacrocaudal space (S3-Cd1)',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.165'
where code = 'BL-30';

-- BL-31 ถึง BL-34 อยู่กึ่งกลางระหว่างเส้น BL แถวใน (BL-27 ถึง BL-30) กับแนวกลางหลัง
update points set
  location_th = 'ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 7 (L7) กึ่งกลางระหว่าง BL-27 กับแนวกลางหลัง',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L7 กึ่งกลางระหว่าง BL-27 กับแนวกลาง',
  location_en = 'At the caudal border of the dorsal spinous process of L7, halfway between BL-27 and the dorsal midline',
  anatomy_en  = 'Caudal border of the L7 spinous process, midway between BL-27 and the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.166'
where code = 'BL-31';

update points set
  location_th = 'ที่ช่องกระเบนเหน็บช่องแรก (S1-S2) กึ่งกลางระหว่าง BL-28 กับแนวกลางหลัง',
  anatomy_th  = 'ช่อง S1-S2 กึ่งกลางระหว่าง BL-28 กับแนวกลาง',
  location_en = 'At the first sacral space (S1-S2), halfway between BL-28 and the dorsal midline',
  anatomy_en  = 'S1-S2 space, midway between BL-28 and the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.166'
where code = 'BL-32';

update points set
  location_th = 'ที่ช่องกระเบนเหน็บช่องที่สอง (S2-S3) กึ่งกลางระหว่าง BL-29 กับแนวกลางหลัง',
  anatomy_th  = 'ช่อง S2-S3 กึ่งกลางระหว่าง BL-29 กับแนวกลาง',
  location_en = 'At the second sacral space (S2-S3), halfway between BL-29 and the dorsal midline',
  anatomy_en  = 'S2-S3 space, midway between BL-29 and the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.166'
where code = 'BL-33';

update points set
  location_th = 'ที่รอยต่อกระเบนเหน็บกับหาง (S3-Cd1) กึ่งกลางระหว่าง BL-30 กับแนวกลางหลัง',
  anatomy_th  = 'รอยต่อกระเบนเหน็บ-หาง กึ่งกลางระหว่าง BL-30 กับแนวกลาง',
  location_en = 'At the sacrocaudal junction, halfway between BL-30 and the dorsal midline',
  anatomy_en  = 'Sacrocaudal junction, midway between BL-30 and the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.166'
where code = 'BL-34';

update points set
  location_th = 'ในร่องข้างโคนหาง ถัดออกด้านข้างจาก BL-30 เล็กน้อย',
  anatomy_th  = 'ร่องข้างโคนหาง ข้าง BL-30',
  location_en = 'In the crease lateral to the tail base, just lateral to BL-30',
  anatomy_en  = 'Crease lateral to the tail base',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.166'
where code = 'BL-35';

-- BL-47 เดิมเขียน "ช่องที่ 9-10" ซึ่งไม่ตรงกับ BL-18 ของเราเองที่เขียน 10
update points set
  location_th = 'ห่างแนวกลางหลังออกข้าง 3 cun ที่ระดับเดียวกับ BL-18 (ขอบท้ายของปุ่มกระดูก T10)',
  anatomy_th  = 'แนวนอกของเส้น BL ระดับ T10',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T10, level with BL-18',
  anatomy_en  = 'Outer bladder line at the level of T10',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.164'
where code = 'BL-47';

-- จุด BL ที่เทียบแล้วตรง ไม่ต้องแก้เนื้อหา บันทึกแหล่งอ้างอิงอย่างเดียว
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('BL-10','BL-11','BL-12','BL-14','BL-15','BL-16','BL-17','BL-18','BL-19',
               'BL-21','BL-22','BL-24','BL-26','BL-27',
               'BL-41','BL-42','BL-43','BL-44','BL-45','BL-46','BL-48','BL-49','BL-50','BL-51','BL-52');

select code, left(location_th, 55) as ตำแหน่ง, verified_source
from points where meridian_code = 'BL' and verified_source is not null order by number;

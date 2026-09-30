-- =============================================================
-- JFK — เส้นตู (GV) และเส้นเริ่น (CV) เทียบกับ Xie's หน้า 195-204
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
--
-- เรื่องที่สำคัญที่สุดในไฟล์นี้: CV-9 ตำราห้ามใช้เข็ม
-- ของเดิมเว็บเราเขียนว่าแทงเฉียงตื้น 0.5-1 ซม.
-- =============================================================

-- ---------- 🔴 CV-9 ห้ามปักเข็ม ----------
update points set
  location_th = 'แนวกลางท้อง เหนือสะดือขึ้นมา 1 cun',
  anatomy_th  = 'เหนือสะดือ 1 cun',
  needle_th   = '**ห้ามปักเข็ม** ใช้รมยา (moxa) หรือกดนวดเท่านั้น',
  caution_th  = 'ห้ามปักเข็มที่จุดนี้ ตำราระบุให้ใช้การรมยาหรือกดนวดแทน',
  location_en = 'On the ventral midline, 1 cun cranial to the umbilicus',
  anatomy_en  = '1 cun cranial to the umbilicus',
  needle_en   = 'Needling is contraindicated. Use moxibustion or acupressure only.',
  caution_en  = 'Do not needle this point — the text specifies moxibustion or acupressure instead.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.202'
where code = 'CV-9';

-- ---------- GV ช่วงเอวและอก ----------
update points set
  location_th = 'แนวกลางหลัง ในแอ่งที่กว้างที่สุดระหว่างปุ่มกระดูกสันหลังเอว ตำราแยกเป็นสามตำแหน่ง คือ L4-L5 (GV-3a), L5-L6 (GV-3b) และ L6-L7 (GV-3c)',
  anatomy_th  = 'ช่อง interspinous L4-L5 / L5-L6 / L6-L7',
  location_en = 'On the dorsal midline in the largest depression between the lumbar spinous processes. The text gives three positions: L4-L5 (GV-3a), L5-L6 (GV-3b) and L6-L7 (GV-3c)',
  anatomy_en  = 'Interspinous space at L4-L5, L5-L6 or L6-L7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.195'
where code = 'GV-3';

-- GV-5 ของเดิมเขียน L1-L2 ตำราระบุ T13-L1
update points set
  location_th = 'แนวกลางหลัง ในช่องระหว่างปุ่มกระดูกสันหลังอกข้อสุดท้ายกับกระดูกสันหลังเอวข้อแรก (T13-L1)',
  anatomy_th  = 'ช่อง interspinous T13-L1',
  location_en = 'On the dorsal midline in the depression between the dorsal spinous processes of T13 and L1',
  anatomy_en  = 'Interspinous space at T13-L1',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.195'
where code = 'GV-5';

-- ---------- GV ช่วงท้ายทอยและหัว ----------
update points set
  location_th = 'แนวกลางท้ายทอย ที่ระดับฐานใบหูด้านท้าย ห่างจาก GV-16 ไปทางหน้า 1.5 cun อยู่หน้าต่อปุ่มกระดูกท้ายทอย',
  anatomy_th  = 'หน้าต่อปุ่มกระดูกท้ายทอย ระดับฐานใบหูด้านท้าย',
  location_en = 'On the dorsal midline at the level of the caudal ear bases, 1.5 cun cranial to GV-16, just in front of the occipital protuberance',
  anatomy_en  = 'Just cranial to the occipital protuberance, level with the caudal ear bases',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.198'
where code = 'GV-17';

update points set
  location_th = 'แนวกลางหัว กึ่งกลางระหว่าง GV-16 กับ GV-20',
  anatomy_th  = 'กึ่งกลางระหว่าง GV-16 กับ GV-20',
  location_en = 'On the dorsal midline, halfway between GV-16 and GV-20',
  anatomy_en  = 'Midway between GV-16 and GV-20',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.198'
where code = 'GV-18';

update points set
  location_th = 'แนวกลางหัว ที่ระยะสามในสี่จาก GV-16 ไปหา GV-20',
  anatomy_th  = '3/4 ของระยะ GV-16 ถึง GV-20',
  location_en = 'On the dorsal midline, three quarters of the distance from GV-16 to GV-20',
  anatomy_en  = 'Three quarters of the way from GV-16 to GV-20',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.198'
where code = 'GV-19';

update points set
  location_th = 'แนวกลางกระหม่อม บนเส้นที่ลากระหว่างปลายใบหูทั้งสองข้าง ที่ระดับรูหูชั้นนอก',
  anatomy_th  = 'แนวกลางกระหม่อม ระดับรูหู',
  location_en = 'On the dorsal midline, on a line drawn between the tips of the ears at the level of the ear canals',
  anatomy_en  = 'Dorsal midline at the level of the ear canals',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.199'
where code = 'GV-20';

-- GV-21 ตำรามีเทคนิคที่เว็บเรายังไม่มี ทิศทางเข็มเปลี่ยนผลการรักษา
update points set
  location_th = 'แนวกลางหัว ที่ระดับขอบหน้าของใบหู อยู่หน้าต่อ GV-20 ขึ้นมา 1.5 cun',
  anatomy_th  = 'แนวกลางหัว ระดับขอบหน้าใบหู',
  needle_th   = 'แทงราบขนานกะโหลก ลึก 0.5-1 cun โดยหันปลายเข็มไปทาง GV-17 เมื่อต้องการสงบ (sedation) หรือไปทาง GV-24 เมื่อต้องการบำรุง (tonification)',
  location_en = 'On the dorsal midline at the level of the cranial edge of the ears, 1.5 cun cranial to GV-20',
  anatomy_en  = 'Dorsal midline, level with the cranial edge of the ears',
  needle_en   = 'Horizontal insertion 0.5-1 cun, directed toward GV-17 to sedate or toward GV-24 to tonify',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.199'
where code = 'GV-21';

update points set
  location_th = 'แนวกลางหัว หน้าต่อ GV-20 ขึ้นมา 4 cun',
  anatomy_th  = 'แนวกลางหัว หน้า GV-20 ไป 4 cun',
  location_en = 'On the dorsal midline, 4 cun cranial to GV-20',
  anatomy_en  = '4 cun cranial to GV-20',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.199'
where code = 'GV-23';

update points set
  location_th = 'แนวกลางหัว หน้าต่อจุดคลาสสิก DA-FENG-MEN ขึ้นมา 1 cun (DA-FENG-MEN อยู่แนวกลางหัวที่ระดับขอบหน้าของฐานใบหู)',
  anatomy_th  = 'หน้าต่อ DA-FENG-MEN ไป 1 cun',
  location_en = 'On the dorsal midline, 1 cun cranial to the classical point Da-feng-men, which lies on the midline level with the cranial rim of the ear bases',
  anatomy_en  = '1 cun cranial to Da-feng-men',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.199'
where code = 'GV-24';

update points set
  location_th = 'แนวกลาง ที่กึ่งกลางระหว่างรูจมูกทั้งสองข้าง เหนือ GV-26 ขึ้นมา 0.5 cun',
  anatomy_th  = 'กึ่งกลางระหว่างรูจมูก เหนือ GV-26',
  location_en = 'On the midline at the midpoint of the nostrils, 0.5 cun dorsal to GV-26',
  anatomy_en  = 'Midpoint of the nostrils, 0.5 cun above GV-26',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.199'
where code = 'GV-25';

update points set
  location_th = 'ในร่อง philtrum แนวกลาง ที่รอยต่อระหว่างส่วนที่มีขนกับส่วนที่ไม่มีขน ระหว่างจมูกกับริมฝีปากบน',
  anatomy_th  = 'รอยต่อขน-ไม่มีขน ระหว่างจมูกกับริมฝีปากบน',
  location_en = 'In the philtrum on the midline, at the haired to non-haired junction between the nose and the upper lip',
  anatomy_en  = 'Haired/non-haired junction between nose and upper lip',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.200'
where code = 'GV-27';

update points set
  location_th = 'แนวกลางด้านในของริมฝีปากบน บนเส้นเลือด maxillary labial vein',
  anatomy_th  = 'ด้านในริมฝีปากบน บนเส้นเลือด maxillary labial',
  location_en = 'On the midline of the inner surface of the upper lip, on the maxillary labial vein',
  anatomy_en  = 'Inner surface of the upper lip, on the maxillary labial vein',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.200'
where code = 'GV-28';

-- ---------- CV ช่วงท้อง ตำราวัดจากสะดือ ไม่ใช่จากหัวหน่าว ----------
update points set
  location_th = 'แนวกลางใต้ท้อง กึ่งกลางระหว่างทวารหนักกับโคนถุงอัณฑะหรือโคนปากช่องคลอด',
  anatomy_th  = 'กึ่งกลางระหว่างทวารหนักกับโคนอวัยวะเพศ',
  location_en = 'On the ventral midline, halfway between the anus and the root of the scrotum or vulva',
  anatomy_en  = 'Midway between the anus and the root of the external genitalia',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.200'
where code = 'CV-1';

update points set
  location_th = 'แนวกลางท้อง ใต้สะดือลงมา 4 cun',
  anatomy_th  = 'ใต้สะดือ 4 cun',
  location_en = 'On the ventral midline, 4 cun caudal to the umbilicus',
  anatomy_en  = '4 cun caudal to the umbilicus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.200'
where code = 'CV-3';

update points set
  location_th = 'แนวกลางท้อง ใต้สะดือลงมา 3 cun',
  anatomy_th  = 'ใต้สะดือ 3 cun',
  location_en = 'On the ventral midline, 3 cun caudal to the umbilicus',
  anatomy_en  = '3 cun caudal to the umbilicus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.200'
where code = 'CV-4';

update points set
  location_th = 'แนวกลางท้อง ที่ระยะสามในสี่จากสะดือไปหาปลายกระดูก xiphoid',
  anatomy_th  = '3/4 ของระยะสะดือถึงปลาย xiphoid',
  needle_th   = 'แทงราบไปตามผนังหน้าท้อง ลึกราว 0.3 cun',
  location_en = 'On the ventral midline, three quarters of the distance from the umbilicus to the xiphoid process',
  anatomy_en  = 'Three quarters of the way from the umbilicus to the xiphoid',
  needle_en   = 'Horizontal insertion along the abdominal wall, about 0.3 cun',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.203'
where code = 'CV-14';

update points set
  location_th = 'แนวกลางท้อง เหนือ CV-14 ขึ้นมา 1 cun',
  anatomy_th  = 'เหนือ CV-14 ไป 1 cun',
  location_en = 'On the ventral midline, 1 cun cranial to CV-14',
  anatomy_en  = '1 cun cranial to CV-14',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.203'
where code = 'CV-15';

update points set
  location_th = 'แนวกลางท้อง เหนือ CV-14 ขึ้นมา 2 cun',
  anatomy_th  = 'เหนือ CV-14 ไป 2 cun',
  location_en = 'On the ventral midline, 2 cun cranial to CV-14',
  anatomy_en  = '2 cun cranial to CV-14',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.203'
where code = 'CV-16';

update points set
  location_th = 'แนวกลางใต้คอ อยู่หน้าต่อกล่องเสียง (larynx) เล็กน้อย',
  anatomy_th  = 'แนวกลางใต้คอ หน้าต่อกล่องเสียง',
  location_en = 'On the ventral midline of the cervical region, just cranial to the larynx',
  anatomy_en  = 'Ventral cervical midline, just cranial to the larynx',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.204'
where code = 'CV-23';

update points set
  location_th = 'แนวกลาง ใต้ขอบริมฝีปากล่างลงมา 1 cun',
  anatomy_th  = 'ใต้ขอบริมฝีปากล่าง 1 cun',
  location_en = 'On the ventral midline, 1 cun ventral to the border of the lower lip',
  anatomy_en  = '1 cun below the border of the lower lip',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.204'
where code = 'CV-24';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('GV-1','GV-2','GV-4','GV-6','GV-7','GV-8','GV-9','GV-10','GV-11','GV-12',
               'GV-13','GV-14','GV-15','GV-16','GV-22','GV-26',
               'CV-2','CV-5','CV-6','CV-7','CV-8','CV-10','CV-11','CV-12','CV-13',
               'CV-17','CV-18','CV-19','CV-20','CV-21','CV-22');

select meridian_code,
       count(*) filter (where verified_source is not null) as ตรวจแล้ว,
       count(*) as ทั้งเส้น
from points where meridian_code in ('GV','CV') group by meridian_code;

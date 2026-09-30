-- =============================================================
-- JFK — เส้น BL รอบที่สอง: จุดบนหัว ต้นขา และขาหลัง (29 จุดที่เหลือ)
-- เทียบกับ Xie's Veterinary Acupuncture หน้า 160, 162, 163, 167, 168, 169
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
-- =============================================================

-- ---------- จุดรอบตา ตำรามีข้อห้ามและเทคนิคที่เว็บเรายังไม่มี ----------
update points set
  location_th = 'เหนือหัวตา (medial canthus) ขึ้นไปประมาณ 0.1 cun',
  anatomy_th  = 'ชิดหัวตาด้านใน',
  needle_th   = 'ดันลูกตาให้เบนออกด้านนอกก่อน แล้วแทงตั้งฉากตื้นมาก ลึกราว 0.1 cun ห้ามหมุนเข็ม',
  caution_th  = 'ห้ามรมยา (moxibustion) · เสี่ยงกระทบลูกตาและเลือดออกในเบ้าตา ควรทำโดยผู้ชำนาญ',
  location_en = 'About 0.1 cun dorsal to the medial canthus of the eye',
  anatomy_en  = 'Just above the medial canthus',
  needle_en   = 'Push the eyeball laterally first, then insert perpendicular to about 0.1 cun. Do not twist the needle.',
  caution_en  = 'Moxibustion is contraindicated. Risk of injuring the globe and of orbital haemorrhage — for experienced hands only.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.160'
where code = 'BL-1';

update points set
  location_th = 'ที่สันขอบบนของเบ้าตา ตรงรอยบาก supraorbital notch อยู่เหนือ BL-1 ขึ้นมาตรงๆ',
  anatomy_th  = 'รอยบาก supraorbital notch เหนือ BL-1',
  needle_th   = 'แทงเฉียงเข้าหา BL-1 ลึกราว 0.2 cun',
  caution_th  = 'ห้ามรมยา (moxibustion)',
  location_en = 'On the supraorbital ridge at the supraorbital notch, directly dorsal to BL-1',
  anatomy_en  = 'Supraorbital notch, directly above BL-1',
  needle_en   = 'Oblique insertion directed toward BL-1, about 0.2 cun',
  caution_en  = 'Moxibustion is contraindicated',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.160'
where code = 'BL-2';

-- ---------- จุดบนหัว เว็บเดิมเขียนแค่ "ถัดจากจุดก่อนหน้า" ไม่มีระยะ ----------
update points set
  location_th = 'บนหัวด้านบน-ข้าง ถัดจาก BL-2 ไปทางท้ายทอย 3.5 cun',
  anatomy_th  = 'หลัง BL-2 ไป 3.5 cun',
  location_en = 'On the dorsolateral aspect of the head, 3.5 cun caudal to BL-2',
  anatomy_en  = '3.5 cun caudal to BL-2',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.162'
where code = 'BL-3';

update points set
  location_th = 'บนหัวด้านบน-ข้าง ที่ระยะหนึ่งในสามจาก GV-24 ไปหา ST-8',
  anatomy_th  = '1/3 ของระยะ GV-24 ถึง ST-8',
  location_en = 'On the dorsolateral aspect of the head, one third of the way from GV-24 to ST-8',
  anatomy_en  = 'One third of the distance from GV-24 to ST-8',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.162'
where code = 'BL-4';

update points set
  location_th = 'บนหัวด้านบน-ข้าง ถัดจาก BL-4 ไปทางท้ายทอย 0.5 cun ห่างแนวกลางหัว 1.5 cun',
  anatomy_th  = 'หลัง BL-4 ไป 0.5 cun ห่างแนวกลาง 1.5 cun',
  location_en = 'On the dorsolateral aspect of the head, 0.5 cun caudal to BL-4 and 1.5 cun lateral to the midline',
  anatomy_en  = '0.5 cun caudal to BL-4, 1.5 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.162'
where code = 'BL-5';

update points set
  location_th = 'บนหัว ถัดจาก BL-5 ไปทางท้ายทอย 1.5 cun ห่างแนวกลางหัว 1.5 cun',
  anatomy_th  = 'หลัง BL-5 ไป 1.5 cun ห่างแนวกลาง 1.5 cun',
  location_en = 'On the dorsal aspect of the head, 1.5 cun caudal to BL-5 and 1.5 cun from the midline',
  anatomy_en  = '1.5 cun caudal to BL-5, 1.5 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.162'
where code = 'BL-6';

update points set
  location_th = 'บนหัว ถัดจาก BL-6 ไปทางท้ายทอย 1.5 cun ข้างแนวกลางหัว ที่ระดับเดียวกับ GV-20',
  anatomy_th  = 'ระดับ GV-20 ข้างแนวกลางหัว',
  location_en = 'On the dorsal aspect of the head, 1.5 cun caudal to BL-6, lateral to the midline at the level of GV-20',
  anatomy_en  = 'Level with GV-20, lateral to the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.162'
where code = 'BL-7';

update points set
  location_th = 'บนหัว ถัดจาก BL-7 ไปทางท้ายทอย 1.5 cun ห่างแนวกลางหัว 1.5 cun',
  anatomy_th  = 'หลัง BL-7 ไป 1.5 cun ห่างแนวกลาง 1.5 cun',
  location_en = 'On the dorsal aspect of the head, 1.5 cun caudal to BL-7 and 1.5 cun lateral to the midline',
  anatomy_en  = '1.5 cun caudal to BL-7, 1.5 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.163'
where code = 'BL-8';

update points set
  location_th = 'บนหัวส่วนท้าย ห่างแนวกลางหัว 1.5 cun ที่ระดับขอบท้ายของใบหู',
  anatomy_th  = 'ระดับขอบท้ายใบหู ห่างแนวกลาง 1.5 cun',
  location_en = 'On the dorsum of the head, 1.5 cun lateral to the midline at the level of the caudal edge of the ears',
  anatomy_en  = 'Level with the caudal edge of the ears, 1.5 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.163'
where code = 'BL-9';

-- ---------- ต้นขาด้านหลัง ตำราวาง BL-37/38 ด้วยสัดส่วน BL-36 ถึง BL-39 ----------
update points set
  location_th = 'ใต้ขอบนอกของปุ่มกระดูกก้น (tuber ischii) ในร่องระหว่างกล้ามเนื้อ biceps femoris กับ semitendinosus',
  anatomy_th  = 'ร่องระหว่าง biceps femoris กับ semitendinosus ใต้ tuber ischii',
  location_en = 'Ventral to the lateral border of the tuber ischii, in the groove between the biceps femoris and semitendinosus muscles',
  anatomy_en  = 'Groove between biceps femoris and semitendinosus, below the tuber ischii',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-36';

update points set
  location_th = 'ด้านหลัง-นอกของต้นขา ที่ระยะหนึ่งในสามจาก BL-36 ไปหา BL-39 ในร่องระหว่างกล้ามเนื้อ biceps femoris กับ semitendinosus',
  anatomy_th  = '1/3 ของระยะ BL-36 ถึง BL-39 ในร่องกล้ามเนื้อ',
  location_en = 'On the caudolateral aspect of the pelvic limb, one third of the way from BL-36 to BL-39, in the groove between the biceps femoris and semitendinosus muscles',
  anatomy_en  = 'One third from BL-36 to BL-39, in the muscle groove',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-37';

update points set
  location_th = 'ด้านหลัง-นอกของต้นขา ที่ระยะสองในสามจาก BL-36 ไปหา BL-39 ในร่องระหว่างกล้ามเนื้อ biceps femoris กับ semitendinosus',
  anatomy_th  = '2/3 ของระยะ BL-36 ถึง BL-39 ในร่องกล้ามเนื้อ',
  location_en = 'On the caudolateral aspect of the pelvic limb, two thirds of the way from BL-36 to BL-39, in the groove between the biceps femoris and semitendinosus muscles',
  anatomy_en  = 'Two thirds from BL-36 to BL-39, in the muscle groove',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-38';

update points set
  location_th = 'ที่ปลายด้านนอกของรอยพับหลังเข่า ชิดขอบในของเอ็นกล้ามเนื้อ biceps femoris อยู่เหนือ BL-40 ขึ้นมาเล็กน้อย',
  anatomy_th  = 'ปลายนอกรอยพับหลังเข่า ขอบในเอ็น biceps femoris',
  location_en = 'On the lateral end of the popliteal crease, on the medial border of the biceps femoris tendon, just proximal to BL-40',
  anatomy_en  = 'Lateral end of the popliteal crease, medial border of the biceps femoris tendon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-39';

-- ---------- สะโพก BL-53 / BL-54 เว็บเดิมวางเป็นจุดข้างกระดูกสันหลัง ----------
update points set
  location_th = 'ที่บริเวณสะโพกด้านนอก ระดับเดียวกับ BL-28 ถัดไปทางท้ายจากปุ่มกระดูกเชิงกราน (tuber coxae) เล็กน้อย',
  anatomy_th  = 'สะโพกด้านนอก หลัง tuber coxae ระดับ BL-28',
  location_en = 'In the lateral gluteal region at the level of BL-28, just caudal to the tuber coxae',
  anatomy_en  = 'Lateral gluteal region, just caudal to the tuber coxae',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-53';

update points set
  location_th = 'ที่ข้อสะโพก ระดับเดียวกับรอยต่อกระเบนเหน็บ-หาง อยู่เหนือปุ่ม greater trochanter ขึ้นมาเล็กน้อย เป็นหนึ่งในสามจุดรอบข้อสะโพกที่เรียกว่า bowling ball points',
  anatomy_th  = 'เหนือ greater trochanter ระดับรอยต่อกระเบนเหน็บ-หาง',
  location_en = 'At the coxofemoral joint, level with the sacrococcygeal hiatus and just dorsal to the greater trochanter of the femur — one of the three "bowling ball points" around the hip',
  anatomy_en  = 'Just dorsal to the greater trochanter, level with the sacrococcygeal hiatus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-54';

-- ---------- ขาหลังท่อนล่าง ----------
update points set
  location_th = 'ด้านหลัง-นอกของขาหลังใต้เข่า ระหว่างหัวกล้ามเนื้อ gastrocnemius ทั้งสอง กึ่งกลางระหว่าง BL-55 กับ BL-57',
  anatomy_th  = 'ระหว่างหัวกล้ามเนื้อ gastrocnemius กึ่งกลาง BL-55 ถึง BL-57',
  location_en = 'On the caudolateral aspect of the pelvic limb distal to the stifle, between the bellies of the gastrocnemius muscles, halfway between BL-55 and BL-57',
  anatomy_en  = 'Between the gastrocnemius bellies, midway between BL-55 and BL-57',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.167'
where code = 'BL-56';

update points set
  location_th = 'ด้านหลัง-นอกของขาหลังใต้เข่า กึ่งกลางระหว่าง BL-40 กับ BL-60',
  anatomy_th  = 'กึ่งกลางระหว่าง BL-40 กับ BL-60',
  location_en = 'On the caudolateral aspect of the pelvic limb distal to the stifle, halfway between BL-40 and BL-60',
  anatomy_en  = 'Midway between BL-40 and BL-60',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-57';

update points set
  location_th = 'ด้านหลัง-นอกของขาหลัง ถัดจาก BL-57 ลงมาทางหน้า-ล่าง 1 cun หรือเหนือ BL-60 ขึ้นมา 7 cun อยู่ที่ขอบหลังของกระดูก fibula',
  anatomy_th  = 'ขอบหลังกระดูก fibula เหนือ BL-60 ขึ้นมา 7 cun',
  location_en = 'On the caudolateral aspect of the pelvic limb, 1 cun ventrolateral to BL-57 (or 7 cun proximal to BL-60), on the caudal border of the fibula',
  anatomy_en  = 'Caudal border of the fibula, 7 cun proximal to BL-60',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-58';

update points set
  location_th = 'ด้านหลัง-นอกของข้อเท้า ในเนื้อบางๆ ระหว่างปุ่ม lateral malleolus ของกระดูก fibula กับกระดูก calcaneus ที่ระดับปลายของ lateral malleolus (ตรงข้ามกับ KID-3)',
  anatomy_th  = 'ระหว่าง lateral malleolus กับกระดูก calcaneus',
  location_en = 'On the caudolateral aspect of the hock, in the thin fleshy tissue between the lateral malleolus of the fibula and the calcaneus, level with the tip of the lateral malleolus (opposite KID-3)',
  anatomy_en  = 'Between the lateral malleolus and the calcaneus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-60';

update points set
  location_th = 'ด้านหลัง-นอกของข้อเท้า ถัดจาก BL-60 ไปทางท้ายและลงล่าง 1 cun',
  anatomy_th  = 'ท้าย-ล่างต่อ BL-60 ไป 1 cun',
  location_en = 'On the caudolateral aspect of the hock, 1 cun caudal and distal to BL-60',
  anatomy_en  = '1 cun caudal and distal to BL-60',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-61';

update points set
  location_th = 'ด้านนอกของข้อเท้า ในแอ่งใต้ปุ่ม lateral malleolus ลงมาตรงๆ คลำตอนกระดกข้อเท้าขึ้น (ตรงข้ามกับ KID-6)',
  anatomy_th  = 'แอ่งใต้ปุ่ม lateral malleolus',
  location_en = 'On the lateral side of the hock, in the depression directly distal to the lateral malleolus of the fibula with the foot in dorsiflexion (opposite KID-6)',
  anatomy_en  = 'Depression directly below the lateral malleolus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-62';

update points set
  location_th = 'ด้านหลัง-นอกของเท้าหลัง ที่ปลายล่างของกระดูก calcaneus เหนือโคนกระดูก metatarsal ที่ 5',
  anatomy_th  = 'ปลายล่างกระดูก calcaneus เหนือโคน metatarsal V',
  location_en = 'On the caudolateral aspect of the pelvic limb, on the distal aspect of the calcaneus, proximal to the fifth metatarsal bone',
  anatomy_en  = 'Distal calcaneus, proximal to the fifth metatarsal',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.168'
where code = 'BL-63';

update points set
  location_th = 'ด้านนอกของนิ้วที่ 5 ขาหลัง ถัดจากข้อ metatarsophalangeal ลงไปทางปลายนิ้วเล็กน้อย',
  anatomy_th  = 'ด้านนอกนิ้วที่ 5 ใต้ข้อ metatarsophalangeal',
  location_en = 'Just distal to the metatarsophalangeal joint on the lateral aspect of the fifth digit of the pelvic limb',
  anatomy_en  = 'Lateral fifth digit, just distal to the metatarsophalangeal joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.169'
where code = 'BL-66';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('BL-40','BL-55','BL-59','BL-64','BL-65','BL-67');

select count(*) filter (where verified_source is not null) as ตรวจแล้ว,
       count(*) as ทั้งเส้น
from points where meridian_code = 'BL';

-- =============================================================
-- JFK — เส้นถุงน้ำดี (GB) เทียบกับ Xie's หน้า 182-190
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
--
-- รูปแบบที่เจอ
--   1) จุดบนหัว GB-4/5/6 ตำราวางด้วยสัดส่วนบนเส้น ST-8 ถึง GB-7
--      และจุดรอบหู "medial to the ear" ไม่ใช่ "เหนือใบหู"
--   2) GB-22/23 อยู่บนขอบท้ายของกระดูกสะบัก ไม่ได้อยู่ในช่องซี่โครง
--   3) GB-25 อยู่ที่ซี่โครงซี่ที่ 13 (ซี่สุดท้ายของสุนัข) ไม่ใช่ซี่ที่ 12
--   4) GB-31/32 วัดจากปุ่ม lateral epicondyle ของกระดูกต้นขา (7 cun / 3 cun)
--   5) GB-39 อยู่ขอบ "หลัง" ของ fibula ไม่ใช่ขอบหน้า
-- =============================================================

-- ---------- ใบหน้าและรอบหู ----------
update points set
  location_th = 'ในแอ่งที่ปลายท้ายของข้อต่อขากรรไกร (TMJ) เห็นชัดขึ้นเมื่ออ้าปาก อยู่ท้ายต่อกล้ามเนื้อ masseter และเยื้องท้าย-บนจากโหนกแก้มกับ ST-7',
  anatomy_th  = 'แอ่งท้าย TMJ ท้ายต่อ masseter',
  location_en = 'In the depression at the caudal end of the temporomandibular joint, more obvious with the mouth open, caudal to the masseter and caudodorsal to the zygomatic arch and ST-7',
  anatomy_en  = 'Depression at the caudal end of the TMJ',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.182'
where code = 'GB-3';

update points set
  location_th = 'บนหัว ด้านในของใบหู ที่ระยะหนึ่งในสี่ของเส้นที่ลากจาก ST-8 ไปหา GB-7',
  anatomy_th  = '1/4 ของเส้น ST-8 ถึง GB-7 ด้านในใบหู',
  location_en = 'On the dorsum of the head, on the medial side of the ear, one quarter of the distance along a line between ST-8 and GB-7',
  anatomy_en  = 'One quarter along the ST-8 to GB-7 line, medial to the ear',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.182'
where code = 'GB-4';

update points set
  location_th = 'บนหัว ด้านในของใบหู ที่กึ่งกลางของเส้นที่ลากจาก ST-8 ไปหา GB-7',
  anatomy_th  = 'กึ่งกลางเส้น ST-8 ถึง GB-7 ด้านในใบหู',
  location_en = 'On the dorsum of the head, on the medial side of the ear, halfway along a line between ST-8 and GB-7',
  anatomy_en  = 'Halfway along the ST-8 to GB-7 line, medial to the ear',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.182'
where code = 'GB-5';

update points set
  location_th = 'บนหัว ด้านในของใบหู ที่ระยะสามในสี่ของเส้นที่ลากจาก ST-8 ไปหา GB-7',
  anatomy_th  = '3/4 ของเส้น ST-8 ถึง GB-7 ด้านในใบหู',
  location_en = 'On the dorsum of the head, on the medial side of the ear, three quarters of the distance along a line between ST-8 and GB-7',
  anatomy_en  = 'Three quarters along the ST-8 to GB-7 line, medial to the ear',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.182'
where code = 'GB-6';

update points set
  location_th = 'บนหัว ห่างเข้าด้านใน 1.5 cun จากกึ่งกลางฐานใบหู',
  anatomy_th  = 'ด้านในฐานใบหู 1.5 cun',
  location_en = 'On the dorsum of the head, 1.5 cun medial to the middle of the ear base',
  anatomy_en  = '1.5 cun medial to the middle of the ear base',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.184'
where code = 'GB-8';

update points set
  location_th = 'บนหัว ห่างเข้าด้านใน 1 cun จากฐานใบหู และถัดจาก GB-8 ไปทางท้าย 0.5 cun',
  anatomy_th  = 'ด้านในฐานใบหู 1 cun ท้ายต่อ GB-8 0.5 cun',
  location_en = 'On the dorsum of the head, 1 cun medial to the ear base and 0.5 cun caudal to GB-8',
  anatomy_en  = '1 cun medial to the ear base, 0.5 cun caudal to GB-8',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.184'
where code = 'GB-9';

update points set
  location_th = 'บนหัว ที่ระยะสองในสามของเส้นที่ลากระหว่าง GV-24 กับ ST-8',
  anatomy_th  = '2/3 ของเส้น GV-24 ถึง ST-8',
  location_en = 'On the dorsum of the head, two thirds of the distance between GV-24 and ST-8',
  anatomy_en  = 'Two thirds of the way from GV-24 to ST-8',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-13';

-- GB-15 ถึง GB-18 เรียงตามเส้น GB-15 ถึง GB-20 ห่างกันจุดละ 1.5 cun
update points set
  location_th = 'บนหัว ท้ายต่อดวงตา ถัดจาก GB-14 ไปทางท้าย 1 cun',
  anatomy_th  = 'ท้ายต่อ GB-14 1 cun',
  location_en = 'On the dorsum of the head caudal to the eye, 1 cun caudal to GB-14',
  anatomy_en  = '1 cun caudal to GB-14',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-15';

update points set
  location_th = 'บนหัว ถัดจาก GB-15 ไปทางท้าย 1.5 cun บนเส้นที่ลากจาก GB-15 ไปหา GB-20',
  anatomy_th  = 'ท้ายต่อ GB-15 1.5 cun บนเส้น GB-15 ถึง GB-20',
  location_en = 'On the dorsum of the head, 1.5 cun caudal to GB-15 on a line connecting GB-15 to GB-20',
  anatomy_en  = '1.5 cun caudal to GB-15 on the GB-15 to GB-20 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-16';

update points set
  location_th = 'บนหัว ถัดจาก GB-16 ไปทางท้าย 1.5 cun บนเส้นที่ลากจาก GB-15 ไปหา GB-20',
  anatomy_th  = 'ท้ายต่อ GB-16 1.5 cun บนเส้น GB-15 ถึง GB-20',
  location_en = 'On the dorsum of the head, 1.5 cun caudal to GB-16 on a line connecting GB-15 to GB-20',
  anatomy_en  = '1.5 cun caudal to GB-16 on the GB-15 to GB-20 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-17';

update points set
  location_th = 'บนหัว ถัดจาก GB-17 ไปทางท้าย 1.5 cun บนเส้นที่ลากจาก GB-15 ไปหา GB-20',
  anatomy_th  = 'ท้ายต่อ GB-17 1.5 cun บนเส้น GB-15 ถึง GB-20',
  location_en = 'On the dorsum of the head, 1.5 cun caudal to GB-17 on a line connecting GB-15 to GB-20',
  anatomy_en  = '1.5 cun caudal to GB-17 on the GB-15 to GB-20 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-18';

update points set
  location_th = 'บนแนวหลังคอ ในแอ่งใหญ่ที่อยู่ท้ายและเยื้องข้างจากปุ่มกระดูกท้ายทอย อยู่ด้านในของขอบหน้าปีกกระดูก atlas',
  anatomy_th  = 'แอ่งท้าย-ข้างปุ่มกระดูกท้ายทอย ด้านในขอบหน้าปีก atlas',
  location_en = 'On the dorsum of the neck, in the large depression just caudal and lateral to the occipital protuberance, medial to the cranial edge of the wings of the atlas',
  anatomy_en  = 'Large depression caudolateral to the occipital protuberance, medial to the atlas wing',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-20';

update points set
  location_th = 'ในร่องกล้ามเนื้อที่อยู่หน้าต่อกระดูกสะบัก กึ่งกลางระหว่าง GV-14 กับปุ่ม acromion (GV-14 อยู่แนวกลางหลังระหว่าง C7-T1)',
  anatomy_th  = 'ร่องกล้ามเนื้อหน้าสะบัก กึ่งกลาง GV-14 ถึง acromion',
  needle_th   = 'แทงตั้งฉากหรือเฉียงโดยหันปลายเข็มเข้าหาด้านในของสะบัก ลึก 1-1.5 cun',
  location_en = 'In a groove in the muscle just cranial to the scapula, midway between GV-14 and the acromion. GV-14 lies on the midline between C7 and T1.',
  anatomy_en  = 'Muscle groove cranial to the scapula, midway between GV-14 and the acromion',
  needle_en   = 'Perpendicular or oblique, directed toward the medial aspect of the scapula, 1-1.5 cun',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.186'
where code = 'GB-21';

-- ---------- ลำตัว ----------
update points set
  location_th = 'บนขอบท้ายของกระดูกสะบัก ที่ระยะหนึ่งในสามนับจากขอบบนลงมาหาขอบล่างของสะบัก',
  anatomy_th  = 'ขอบท้ายสะบัก 1/3 จากขอบบน',
  location_en = 'On the caudal border of the scapula, one third of the distance from the dorsal to the ventral extent of the scapula',
  anatomy_en  = 'Caudal border of the scapula, one third down',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.187'
where code = 'GB-22';

update points set
  location_th = 'ตามขอบท้ายของกระดูกสะบัก ต่ำกว่า GB-22 ลงมา 1 cun',
  anatomy_th  = 'ขอบท้ายสะบัก ใต้ GB-22 1 cun',
  location_en = 'Along the caudal border of the scapula, 1 cun ventral to GB-22',
  anatomy_en  = 'Caudal border of the scapula, 1 cun below GB-22',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.187'
where code = 'GB-23';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 9 เหนือระดับข้อศอกขึ้นมาเล็กน้อย เยื้องท้าย-บนจาก LIV-14',
  anatomy_th  = 'ช่องซี่โครงที่ 9 เหนือระดับข้อศอก',
  location_en = 'On the ventrolateral thorax at the ninth intercostal space, just dorsal to the level of the elbow, caudodorsal to LIV-14',
  anatomy_en  = 'Ninth intercostal space, just above the level of the elbow',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.187'
where code = 'GB-24';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ปลายอิสระของขอบล่างของซี่โครงซี่ที่ 13 (ซี่สุดท้ายของสุนัข)',
  anatomy_th  = 'ปลายอิสระของซี่โครงซี่ที่ 13',
  location_en = 'On the ventrolateral thorax, on the free end of the lower border of the 13th rib',
  anatomy_en  = 'Free end of the 13th rib',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.187'
where code = 'GB-25';

update points set
  location_th = 'ผนังท้องด้านข้าง ถัดจาก GB-25 ไปทางท้าย-บน 1.5 cun บนเส้นที่ลากจาก GB-25 ไปหาปีกกระดูกเชิงกราน',
  anatomy_th  = 'ท้าย-บนจาก GB-25 1.5 cun บนเส้นไปปีกกระดูกเชิงกราน',
  location_en = 'On the lateral abdomen, 1.5 cun caudodorsal to GB-25 on a line between GB-25 and the wing of the ilium',
  anatomy_en  = '1.5 cun caudodorsal to GB-25, toward the wing of the ilium',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.187'
where code = 'GB-26';

-- ---------- สะโพกและต้นขา ----------
update points set
  location_th = 'บริเวณสะโพกด้านนอก ถัดจากขอบหน้าของปีกกระดูกเชิงกรานไปทางหน้า-บน 0.5 cun',
  anatomy_th  = 'หน้า-บนจากขอบหน้าปีกกระดูกเชิงกราน 0.5 cun',
  location_en = 'On the lateral aspect of the gluteal region, 0.5 cun craniodorsal to the cranial aspect of the iliac spine (wing of the ilium)',
  anatomy_en  = '0.5 cun craniodorsal to the cranial edge of the ilial wing',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-27';

update points set
  location_th = 'บริเวณสะโพกด้านนอก ในแอ่งกึ่งกลางระหว่าง GB-27 กับ GB-29',
  anatomy_th  = 'กึ่งกลางระหว่าง GB-27 กับ GB-29',
  location_en = 'On the lateral aspect of the gluteal region, in a depression midway between GB-27 and GB-29',
  anatomy_en  = 'Midway between GB-27 and GB-29',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-28';

update points set
  location_th = 'ที่ข้อสะโพก ในแอ่งหน้าต่อปุ่ม greater trochanter ของกระดูกต้นขา เป็นหนึ่งในสามจุดรอบข้อสะโพกที่เรียกว่า bowling ball points',
  anatomy_th  = 'แอ่งหน้าต่อ greater trochanter',
  location_en = 'At the coxofemoral joint, in a depression just cranial to the greater trochanter of the femur — one of the three "bowling ball points" around the hip',
  anatomy_en  = 'Depression just cranial to the greater trochanter',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-29';

update points set
  location_th = 'ด้านนอกของต้นขา ในแอ่งที่อยู่เหนือปุ่ม lateral epicondyle ของกระดูกต้นขาขึ้นมา 7 cun',
  anatomy_th  = 'เหนือ lateral epicondyle ของ femur 7 cun',
  location_en = 'On the lateral aspect of the thigh, in a depression 7 cun proximal to the lateral epicondyle of the femur',
  anatomy_en  = '7 cun proximal to the lateral epicondyle of the femur',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-31';

update points set
  location_th = 'ด้านนอกของต้นขา ในแอ่งที่อยู่เหนือปุ่ม lateral epicondyle ของกระดูกต้นขาขึ้นมา 3 cun',
  anatomy_th  = 'เหนือ lateral epicondyle ของ femur 3 cun',
  location_en = 'On the lateral aspect of the thigh, in a depression 3 cun proximal to the lateral epicondyle of the femur',
  anatomy_en  = '3 cun proximal to the lateral epicondyle of the femur',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-32';

update points set
  location_th = 'ด้านนอกของหัวเข่า ในแอ่งใหญ่เหนือปุ่ม lateral epicondyle ของกระดูกต้นขา ระหว่างจุดเกาะของเอ็นกล้ามเนื้อ biceps femoris กับกระดูกต้นขา',
  anatomy_th  = 'แอ่งเหนือ lateral epicondyle ระหว่างเอ็น biceps femoris กับกระดูก',
  location_en = 'On the lateral side of the stifle, in the large depression just proximal to the lateral epicondyle of the femur, between the insertion of the biceps femoris tendon and the femur',
  anatomy_en  = 'Large depression above the lateral epicondyle, between the biceps femoris tendon and the femur',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-33';

update points set
  needle_th = 'แทงเฉียง ลึกราว 0.5 cun',
  needle_en = 'Oblique insertion, about 0.5 cun',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.188'
where code = 'GB-34';

-- ---------- ขาหลังท่อนล่างและเท้า ----------
update points set
  location_th = 'ด้านนอกของขาหลังใต้เข่า เหนือ GB-39 ขึ้นมา 4 cun อยู่ระหว่างกล้ามเนื้อ common digital extensor กับ lateral digital extensor',
  anatomy_th  = 'ระหว่างกล้ามเนื้อ common กับ lateral digital extensor เหนือ GB-39 4 cun',
  location_en = 'On the lateral side of the pelvic limb distal to the stifle, 4 cun proximal to GB-39, between the common digital extensor and lateral digital extensor muscles',
  anatomy_en  = 'Between the common and lateral digital extensors, 4 cun above GB-39',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-36';

update points set
  location_th = 'ด้านนอกของขาหลังใต้เข่า เหนือ GB-39 ขึ้นมา 3 cun (เท่ากับเหนือปลาย lateral malleolus 6 cun) อยู่ระหว่างกล้ามเนื้อ common digital extensor กับ lateral digital extensor',
  anatomy_th  = 'ระหว่างกล้ามเนื้อ extensor เหนือ GB-39 3 cun',
  location_en = 'On the lateral side of the pelvic limb distal to the stifle, 3 cun proximal to GB-39, between the common digital extensor and lateral digital extensor muscles',
  anatomy_en  = 'Between the extensor muscles, 3 cun above GB-39',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-37';

update points set
  location_th = 'ด้านนอกของขาหลังใต้เข่า เหนือปลายปุ่ม lateral malleolus ขึ้นมา 3 cun ในแอ่งบนขอบหลังของกระดูก fibula ใกล้ที่เส้นเลือด lateral saphenous พาดผ่าน',
  anatomy_th  = 'ขอบหลังของกระดูก fibula เหนือปลาย lateral malleolus 3 cun',
  location_en = 'On the lateral side of the pelvic limb distal to the stifle, 3 cun proximal to the tip of the lateral malleolus, in a depression on the caudal border of the fibula near where the lateral saphenous vein crosses',
  anatomy_en  = 'Caudal border of the fibula, 3 cun above the tip of the lateral malleolus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-39';

update points set
  location_th = 'ด้านนอกของเท้าหลัง ถัดจากปลายปุ่ม lateral malleolus ไปทางหน้า-ล่าง อยู่เหนือเอ็นกล้ามเนื้อ lateral digital extensor และอยู่หน้าต่อ BL-62',
  anatomy_th  = 'หน้า-ล่างต่อ lateral malleolus เหนือเอ็น lateral digital extensor',
  location_en = 'On the lateral side of the pelvic limb distal to the hock, craniodistal to the tip of the lateral malleolus, over the tendon of the lateral digital extensor, cranial to BL-62',
  anatomy_en  = 'Craniodistal to the lateral malleolus, over the lateral digital extensor tendon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-40';

update points set
  location_th = 'ด้านหน้าของเท้าหลัง เหนือข้อ metatarsophalangeal ขึ้นมา อยู่ถัดจากรอยต่อของกระดูก metatarsal ที่ 4 และ 5 ลงมาทางปลายเล็กน้อย',
  anatomy_th  = 'หลังเท้า ใต้รอยต่อ metatarsal IV-V',
  location_en = 'On the lateral side of the pelvic limb distal to the hock, on the dorsum of the foot proximal to the metatarsophalangeal joint, just distal to the junction of the fourth and fifth metatarsal bones',
  anatomy_en  = 'Dorsum of the foot, just distal to the junction of metatarsals IV and V',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-41';

update points set
  location_th = 'ด้านหน้าของเท้าหลัง เหนือข้อ metatarsophalangeal ขึ้นมาเล็กน้อย ระหว่างกระดูก metatarsal ที่ 4 และ 5',
  anatomy_th  = 'หลังเท้า เหนือข้อนิ้ว ระหว่าง metatarsal IV-V',
  location_en = 'On the dorsum of the foot just proximal to the metatarsophalangeal joint, between the fourth and fifth metatarsal bones',
  anatomy_en  = 'Dorsum of the foot, just proximal to the metatarsophalangeal joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.189'
where code = 'GB-42';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('GB-1','GB-2','GB-7','GB-10','GB-11','GB-12','GB-14','GB-19',
               'GB-30','GB-35','GB-38','GB-43','GB-44');

select count(*) filter (where verified_source is not null) as ตรวจแล้ว, count(*) as ทั้งเส้น
from points where meridian_code = 'GB';

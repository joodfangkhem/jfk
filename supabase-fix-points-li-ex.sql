-- =============================================================
-- JFK — เส้นลำไส้ใหญ่ (LI) และจุดคลาสสิกในสัตว์ (EX)
-- LI เทียบกับ Xie บทที่ 5 หน้า 137-141 · EX เทียบกับบทที่ 6
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
--
-- เรื่องใหญ่: เส้น LI ของเดิมเริ่มผิดนิ้วและผิดด้านตั้งแต่จุดแรก
--   ตำราระบุว่าเส้นนี้เริ่มที่โคนเล็บ "นิ้วที่ 3 ด้านใน" ของเดิมเขียน "นิ้วที่ 2 ด้านนอก"
--   ทำให้ LI-1 ถึง LI-3 คลาดทั้งชุด
-- =============================================================

-- ---------- LI ช่วงนิ้วและฝ่ามือ ----------
update points set
  location_th = 'โคนเล็บของนิ้วที่ 3 ขาหน้า ด้านใน',
  anatomy_th  = 'โคนเล็บนิ้วที่ 3 ด้านใน',
  location_en = 'On the medial side of the third digit of the thoracic limb at the nail bed',
  anatomy_en  = 'Nail bed of the third digit, medial side',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-1';

update points set
  location_th = 'ด้านในของนิ้วที่ 3 ขาหน้า ถัดจากข้อ metacarpophalangeal ลงไปทางปลายนิ้ว',
  anatomy_th  = 'ด้านในนิ้วที่ 3 ใต้ข้อนิ้ว',
  location_en = 'On the medial aspect of the third digit of the thoracic limb, just distal to the metacarpophalangeal joint',
  anatomy_en  = 'Medial third digit, just distal to the metacarpophalangeal joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-2';

update points set
  location_th = 'ด้านในของกระดูก metacarpal ชิ้นที่ 3 ขาหน้า เหนือข้อ metacarpophalangeal ขึ้นมาเล็กน้อย',
  anatomy_th  = 'ด้านในกระดูก metacarpal III เหนือข้อนิ้ว',
  location_en = 'On the medial side of the third metacarpal bone of the thoracic limb, just proximal to the metacarpophalangeal joint',
  anatomy_en  = 'Medial third metacarpal, just proximal to the metacarpophalangeal joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-3';

update points set
  location_th = 'ในแอ่งด้านหน้า-ในของข้อ radiocarpal',
  anatomy_th  = 'แอ่งหน้า-ในของข้อ radiocarpal',
  location_en = 'In a depression on the craniomedial aspect of the radiocarpal joint',
  anatomy_en  = 'Depression on the craniomedial radiocarpal joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-5';

-- ---------- LI ช่วงปลายแขน ----------
update points set
  location_th = 'ด้านหน้า-นอกของขาหน้า เหนือ LI-5 ขึ้นมา 3 cun บนเส้นที่ลากจาก LI-5 ไปหา LI-11 อยู่ในร่องกล้ามเนื้อแนวหน้าสุด',
  anatomy_th  = 'ร่องกล้ามเนื้อแนวหน้าสุด เหนือ LI-5 3 cun',
  location_en = 'On the craniolateral aspect of the thoracic limb, 3 cun proximal to LI-5 on the line connecting LI-5 and LI-11, in the most cranial muscle groove',
  anatomy_en  = 'Most cranial muscle groove, 3 cun above LI-5',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-6';

update points set
  location_th = 'ด้านหน้า-นอกของขาหน้า เหนือ LI-6 ขึ้นมา 2 cun ในร่องระหว่างกล้ามเนื้อ extensor carpi radialis กับ common digital extensor',
  anatomy_th  = 'ร่องระหว่าง extensor carpi radialis กับ common digital extensor',
  location_en = 'On the craniolateral aspect of the thoracic limb, 2 cun proximal to LI-6, in the groove between the extensor carpi radialis and common digital extensor muscles',
  anatomy_en  = 'Groove between the extensor carpi radialis and common digital extensor, 2 cun above LI-6',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.139'
where code = 'LI-7';

-- ---------- LI ช่วงต้นแขนและไหล่ ----------
update points set
  location_th = 'ด้านนอกของขาหน้า ถัดจาก LI-11 ไปทางหน้า-บน 1 cun ตามแนวเส้นที่ลากจาก LI-11 ไปหา LI-15',
  anatomy_th  = 'หน้า-บนจาก LI-11 1 cun บนเส้น LI-11 ถึง LI-15',
  location_en = 'On the lateral side of the thoracic limb, 1 cun craniodorsal to LI-11 along a line connecting LI-11 and LI-15',
  anatomy_en  = '1 cun craniodorsal to LI-11 on the LI-11 to LI-15 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-12';

update points set
  location_th = 'ด้านนอกของขาหน้า ถัดจาก LI-11 ไปทางหน้า-บน 3 cun ตามแนวเส้นที่ลากจาก LI-11 ไปหา LI-15',
  anatomy_th  = 'หน้า-บนจาก LI-11 3 cun บนเส้น LI-11 ถึง LI-15',
  location_en = 'On the lateral side of the thoracic limb, 3 cun craniodorsal to LI-11 along a line connecting LI-11 and LI-15',
  anatomy_en  = '3 cun craniodorsal to LI-11 on the LI-11 to LI-15 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-13';

update points set
  location_th = 'ด้านนอกของขาหน้า ถัดจาก LI-11 ไปทางหน้า-บน 7 cun (หรือต่ำจาก LI-15 ลงมาทางท้าย-ล่าง 2 cun) ตามแนวเส้นที่ลากจาก LI-11 ไปหา LI-15',
  anatomy_th  = 'หน้า-บนจาก LI-11 7 cun บนเส้น LI-11 ถึง LI-15',
  location_en = 'On the lateral side of the thoracic limb, 7 cun craniodorsal to LI-11, or 2 cun caudoventral to LI-15, along the line connecting LI-11 and LI-15',
  anatomy_en  = '7 cun craniodorsal to LI-11 on the LI-11 to LI-15 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-14';

update points set
  location_th = 'บริเวณข้อไหล่ ถัดจากปุ่ม acromion ไปทางหน้าและลงล่าง อยู่บนขอบหน้าของหัว acromial ของกล้ามเนื้อ deltoid',
  anatomy_th  = 'ขอบหน้าของหัว acromial ของกล้ามเนื้อ deltoid',
  location_en = 'At the shoulder region, cranial and distal to the acromion, on the cranial margin of the acromial head of the deltoid muscle',
  anatomy_en  = 'Cranial margin of the acromial head of the deltoid',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-15';

update points set
  location_th = 'ตามขอบหน้าของกระดูกสะบัก ในแอ่งที่ระยะสองในสามจาก TH-15 ไปหาปลายข้อไหล่ (TH-15 อยู่ในแอ่งบนขอบบนของสะบัก ตรงรอยต่อกับกระดูกอ่อนสะบัก)',
  anatomy_th  = 'ขอบหน้าสะบัก 2/3 ของระยะ TH-15 ถึงปลายไหล่',
  location_en = 'Along the cranial border of the scapula, in a depression two thirds of the distance from TH-15 to the point of the shoulder',
  anatomy_en  = 'Cranial border of the scapula, two thirds from TH-15 to the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-16';

update points set
  location_th = 'ด้านหน้าของบริเวณคอ ถัดจาก LI-16 ไปทางหน้า-บน 2 cun อยู่บนขอบหลังของกล้ามเนื้อ sternocleidomastoid',
  anatomy_th  = 'ขอบหลังกล้ามเนื้อ sternocleidomastoid หน้า-บนจาก LI-16 2 cun',
  location_en = 'On the cranial aspect of the cervical region, 2 cun craniodorsal to LI-16, on the posterior border of the sternocleidomastoid muscle',
  anatomy_en  = 'Caudal border of the sternocleidomastoid, 2 cun craniodorsal to LI-16',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-17';

update points set
  location_th = 'ยืดคอสัตว์ออก แล้วไล่ตามแนวขอบล่างของขากรรไกรล่างไปจนถึงแอ่งที่อยู่เหนือร่อง jugular เล็กน้อย บริเวณส่วนหน้าสุดของคอ ในกล้ามเนื้อ sternocleidomastoid',
  anatomy_th  = 'แอ่งเหนือร่อง jugular ตามแนวขอบล่างขากรรไกร',
  location_en = 'With the head extended, follow the line of the ventral mandible to the depression just dorsal to the jugular groove on the most cranial aspect of the cervical region, in the sternocleidomastoid muscle',
  anatomy_en  = 'Depression just dorsal to the jugular groove, along the ventral mandible line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.141'
where code = 'LI-18';

update points set
  location_th = 'ในร่องข้างจมูก (nasolabial groove) อยู่ใต้ขอบด้านนอกของรูจมูกพอดี ที่ระดับเดียวกับ GV-26',
  anatomy_th  = 'ร่องข้างจมูก ใต้ขอบนอกของรูจมูก ระดับ GV-26',
  location_en = 'In the nasolabial groove directly below the lateral margin of the nares, level with GV-26',
  anatomy_en  = 'Nasolabial groove, below the lateral margin of the nostril',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.141'
where code = 'LI-19';

update points set
  location_th = 'ในร่องข้างจมูก ที่ระดับส่วนกว้างที่สุดของรูจมูก ห่างออกจากรอยต่อผิวหนังมีขนกับไม่มีขนราว 0.1 cun',
  anatomy_th  = 'ร่องข้างจมูก ระดับส่วนกว้างที่สุดของรูจมูก',
  location_en = 'In the nasolabial groove at the widest part of the nostril, about 0.1 cun outside the haired to non-haired junction',
  anatomy_en  = 'Nasolabial groove at the widest part of the nostril',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.141'
where code = 'LI-20';

-- ---------- EX จุดคลาสสิกในสัตว์ ----------
-- DA-FENG-MEN ของเดิมอธิบายตรงกับจุด Tian-men ซึ่งเป็นคนละจุดในตำรา
update points set
  location_th = 'แนวกลางศีรษะ ที่ระดับขอบหน้าของฐานใบหูทั้งสองข้าง (จุดที่อยู่ระดับขอบท้ายของฐานใบหูคือ Tian-men ซึ่งเป็นคนละจุด)',
  anatomy_th  = 'แนวกลางศีรษะ ระดับขอบหน้าของฐานใบหู',
  location_en = 'On the dorsal midline of the head, level with the cranial rim of the ear bases. The point level with the caudal rim is Tian-men, a different point.',
  anatomy_en  = 'Dorsal midline of the head, level with the cranial rim of the ear bases',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.2'
where code = 'DA-FENG-MEN';

update points set
  location_th = 'ด้านข้างของศีรษะ ถัดจากฐานใบหูไปทางท้าย อยู่กึ่งกลางระหว่าง TH-17 กับ GB-20',
  anatomy_th  = 'กึ่งกลางระหว่าง TH-17 กับ GB-20 ท้ายต่อฐานใบหู',
  location_en = 'On the side of the head, caudal to the base of the ear, halfway between TH-17 and GB-20',
  anatomy_en  = 'Halfway between TH-17 and GB-20, caudal to the ear base',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.15'
where code = 'AN-SHEN';

update points set
  location_th = 'ชุดจุดสองข้างของแนวกลางหลัง ห่างจากปุ่มกระดูกสันหลังออกข้าง 0.5 cun ทุกข้อตั้งแต่ T1 ถึง L7',
  anatomy_th  = 'ห่างปุ่มกระดูกสันหลังออกข้าง 0.5 cun ตั้งแต่ T1 ถึง L7',
  location_en = 'Two rows of points, 0.5 cun lateral to the dorsal spinous process of every vertebra from T1 to L7',
  anatomy_en  = '0.5 cun lateral to each spinous process from T1 to L7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.40'
where code = 'JIA-JI';

update points set
  location_th = 'ที่ผิวด้านนูนของปลายใบหู บนเส้นเลือดดำที่ใบหู (auricular vein)',
  anatomy_th  = 'ผิวด้านนูนของปลายใบหู บนเส้นเลือด auricular',
  location_en = 'On the convex surface of the ear tip, over the auricular vein',
  anatomy_en  = 'Convex surface of the ear tip, over the auricular vein',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.19'
where code = 'ER-JIAN';

-- WEI-GEN: ตำแหน่งตรงกับจุดที่ตำราเรียกว่า Wei-jie ส่วนชื่อ Wei-gen ตำราใช้กับ GV-2
update points set
  location_th = 'แนวกลางหลัง ที่โคนหาง ในช่องระหว่างกระดูกหางข้อที่ 1 และ 2 (Cd1-Cd2) — ตำราของ Xie เรียกจุดนี้ว่า Wei-jie ส่วนชื่อ Wei-gen ตำราใช้กับ GV-2 ซึ่งอยู่ที่รอยต่อกระเบนเหน็บกับหาง ถัดขึ้นไปหนึ่งข้อ',
  anatomy_th  = 'ช่องระหว่างกระดูกหางข้อที่ 1 และ 2',
  location_en = 'On the dorsal midline between the first and second caudal vertebrae (Cd1-Cd2). Xie''s text calls this point Wei-jie, and uses the name Wei-gen for GV-2, one space cranial at the sacrocaudal junction.',
  anatomy_en  = 'Dorsal midline between Cd1 and Cd2',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.37'
where code = 'WEI-GEN';

update points set
  needle_th = 'แทงตั้งฉากตื้นมาก ลึก 0.1-0.3 cun หรือใช้ปล่อยเลือด',
  needle_en = 'Perpendicular, very shallow, 0.1-0.3 cun, or used as a bleeding point',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.39'
where code = 'WEI-JIAN';

-- BA-FENG: ตำแหน่งถูกแล้ว แต่ตำรารวมจุดง่ามนิ้วทั้งสี่เท้าไว้ใต้ชื่อ Liu-feng ชื่อเดียว
update points set
  location_th = 'ที่รอยพับผิวหนังด้านหลังเท้าหลัง ตรงระดับข้อ metatarsophalangeal ระหว่างนิ้วที่ 2-3, 3-4 และ 4-5 ข้างละ 3 จุด — ตำราของ Xie รวมจุดง่ามนิ้วของทั้งสี่เท้าไว้ใต้ชื่อ Liu-feng ชื่อเดียว',
  anatomy_th  = 'รอยพับผิวหนังระหว่างนิ้วเท้าหลัง ระดับข้อ metatarsophalangeal',
  location_en = 'At the skin fold on the dorsal aspect of the metatarsophalangeal joints between digits 2-3, 3-4 and 4-5, three per hind foot. Xie''s text groups the web points of all four feet under the single name Liu-feng.',
  anatomy_en  = 'Skin fold between the hind digits at the metatarsophalangeal joints',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.77'
where code = 'BA-FENG';

update points set
  location_th = 'ที่รอยพับผิวหนังด้านหลังมือ ตรงระดับข้อ metacarpophalangeal ระหว่างนิ้วที่ 2-3, 3-4 และ 4-5 ข้างละ 3 จุด',
  anatomy_th  = 'รอยพับผิวหนังระหว่างนิ้วขาหน้า ระดับข้อ metacarpophalangeal',
  location_en = 'At the skin fold on the dorsal aspect of the metacarpophalangeal joints between digits 2-3, 3-4 and 4-5, three per front foot',
  anatomy_en  = 'Skin fold between the front digits at the metacarpophalangeal joints',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6 no.77'
where code = 'LIU-FENG';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('LI-8','LI-9','LI-10');

update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.6'
where code in ('BAI-HUI','SHAN-GEN');

select meridian_code,
       count(*) filter (where verified_source is not null) as ตรวจแล้ว,
       count(*) as ทั้งหมด
from points where meridian_code in ('LI','EX') group by meridian_code;

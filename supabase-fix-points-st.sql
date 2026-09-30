-- =============================================================
-- JFK — เส้นกระเพาะอาหาร (ST) เทียบกับ Xie's หน้า 142-149
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
--
-- สามเรื่องหลัก
--   1) ข้อห้ามที่ขาดไป: ST-1 ห้ามหมุนเข็ม+ห้ามรมยา, ST-12 ห้ามในสัตว์ตั้งท้อง,
--      ST-25 ห้ามรมยาในสัตว์ตั้งท้อง
--   2) จุดบนผนังอก ST-14..ST-18 ของเดิมเลื่อนไปหนึ่งช่องซี่โครง
--      และห่างจากแนวกลาง 4 cun ไม่ใช่ 2 cun
--   3) จุดบนต้นขา ST-31..ST-34 ตำราวางด้วยสัดส่วนบนเส้น tuber coxae ถึง ST-34
-- =============================================================

-- ---------- 1) ข้อห้ามที่ขาดไป ----------
update points set
  needle_th  = 'แทงตั้งฉากตื้นมาก ลึกราว 0.3 cun ห้ามหมุนเข็ม',
  caution_th = 'ห้ามรมยา (moxibustion) · เสี่ยงกระทบลูกตา ควรทำโดยผู้ชำนาญเท่านั้น',
  needle_en  = 'Perpendicular, very shallow, about 0.3 cun. Do not twist the needle.',
  caution_en = 'Moxibustion is contraindicated. Risk of injuring the globe — for experienced hands only.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.143'
where code = 'ST-1';

update points set
  location_th = 'ในแอ่งที่ห่างจาก ST-11 ออกด้านข้าง 2 cun',
  anatomy_th  = 'แอ่งข้าง ST-11 ออกไป 2 cun',
  caution_th  = 'ห้ามใช้ในสัตว์ตั้งท้อง · ห้ามแทงลึก เสี่ยงปอดรั่วและกระทบ brachial plexus',
  location_en = 'In the depression 2 cun lateral to ST-11',
  anatomy_en  = 'Depression 2 cun lateral to ST-11',
  caution_en  = 'Contraindicated during pregnancy. Do not needle deeply — risk of pneumothorax and brachial plexus injury.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-12';

update points set
  location_th = 'ข้างสะดือ ห่างออกด้านข้าง 2 cun อยู่กลางกล้ามเนื้อ rectus abdominis',
  anatomy_th  = 'กลางกล้ามเนื้อ rectus abdominis ข้างสะดือ 2 cun',
  caution_th  = 'ห้ามรมยา (moxibustion) ในสัตว์ตั้งท้อง · ระวังในสัตว์ท้องอืดมากหรือมีก้อนในท้อง',
  location_en = 'On the ventrolateral abdomen, 2 cun lateral to the umbilicus, in the centre of the rectus abdominis muscle',
  anatomy_en  = 'Centre of the rectus abdominis, 2 cun lateral to the umbilicus',
  caution_en  = 'Moxibustion is contraindicated in pregnancy. Take care in a very distended abdomen or where a mass is present.',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.146'
where code = 'ST-25';

-- ---------- 2) ผนังอก ของเดิมเลื่อนหนึ่งช่องและใช้ระยะข้างผิด ----------
update points set
  location_th = 'ผนังอกด้านหน้า ห่างแนวกลางท้องออกข้าง 4 cun ที่ระดับเดียวกับ LU-2',
  anatomy_th  = 'ผนังอกด้านหน้า ห่างแนวกลาง 4 cun ระดับ LU-2',
  location_en = 'In a depression 4 cun lateral to the ventral midline, at the level of LU-2',
  anatomy_en  = '4 cun lateral to the ventral midline, level with LU-2',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-13';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 1 ห่างแนวกลางท้องออกข้าง 4 cun ระดับเดียวกับ LU-1',
  anatomy_th  = 'ช่องซี่โครงที่ 1 ห่างแนวกลาง 4 cun',
  location_en = 'On the ventrolateral thorax at the first intercostal space, 4 cun lateral to the ventral midline, at the level of LU-1',
  anatomy_en  = 'First intercostal space, 4 cun lateral to the ventral midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-14';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 2 ห่างแนวกลางท้องออกข้าง 4 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 2 ห่างแนวกลาง 4 cun',
  location_en = 'On the ventrolateral thorax at the second intercostal space, 4 cun lateral to the ventral midline',
  anatomy_en  = 'Second intercostal space, 4 cun lateral to the ventral midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-15';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 3 ห่างแนวกลางท้องออกข้าง 4 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 3 ห่างแนวกลาง 4 cun',
  location_en = 'On the ventrolateral thorax at the third intercostal space, 4 cun lateral to the ventral midline',
  anatomy_en  = 'Third intercostal space, 4 cun lateral to the ventral midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.145'
where code = 'ST-16';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 4 ห่างแนวกลางท้องออกข้าง 4 cun ระดับเดียวกับ CV-17 (ระยะจาก CV-17 ถึงสะดือเท่ากับ 8 cun)',
  anatomy_th  = 'ช่องซี่โครงที่ 4 ห่างแนวกลาง 4 cun ระดับ CV-17',
  location_en = 'On the ventrolateral thorax at the fourth intercostal space, 4 cun lateral to the ventral midline, at the level of CV-17. There are 8 cun between CV-17 and the umbilicus.',
  anatomy_en  = 'Fourth intercostal space, 4 cun lateral to the ventral midline, level with CV-17',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.145'
where code = 'ST-17';

update points set
  location_th = 'ผนังอกด้านข้าง-ล่าง ที่ช่องซี่โครงช่องที่ 5 ห่างแนวกลางท้องออกข้าง 4 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 5 ห่างแนวกลาง 4 cun',
  location_en = 'On the ventrolateral thorax at the fifth intercostal space, 4 cun lateral to the ventral midline',
  anatomy_en  = 'Fifth intercostal space, 4 cun lateral to the ventral midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.145'
where code = 'ST-18';

-- ---------- ผนังหน้าท้อง ตำราวัดจากสะดือทุกจุด ห่างแนวกลาง 2 cun ----------
update points set
  location_th = 'ผนังหน้าท้องด้านข้าง เหนือสะดือขึ้นมา 6 cun ห่างแนวกลางออกข้าง 2 cun ระดับเดียวกับ CV-14',
  anatomy_th  = 'เหนือสะดือ 6 cun ห่างแนวกลาง 2 cun',
  location_en = 'On the ventrolateral abdomen, 6 cun cranial to the umbilicus, 2 cun lateral to the ventral midline, at the level of CV-14',
  anatomy_en  = '6 cun cranial to the umbilicus, 2 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.145'
where code = 'ST-19';

update points set
  location_th = 'ผนังหน้าท้องด้านข้าง เหนือสะดือขึ้นมา 5 cun ห่างแนวกลางออกข้าง 2 cun',
  anatomy_th  = 'เหนือสะดือ 5 cun ห่างแนวกลาง 2 cun',
  location_en = 'On the ventrolateral abdomen, 5 cun cranial to the umbilicus, 2 cun lateral to the ventral midline',
  anatomy_en  = '5 cun cranial to the umbilicus, 2 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.145'
where code = 'ST-20';

update points set
  location_th = 'ผนังหน้าท้องด้านข้าง เหนือสะดือขึ้นมา 4 cun ห่างแนวกลางออกข้าง 2 cun',
  anatomy_th  = 'เหนือสะดือ 4 cun ห่างแนวกลาง 2 cun',
  location_en = 'On the ventrolateral abdomen, 4 cun cranial to the umbilicus, 2 cun lateral to the ventral midline',
  anatomy_en  = '4 cun cranial to the umbilicus, 2 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.146'
where code = 'ST-21';

update points set
  location_th = 'ผนังหน้าท้องด้านข้าง เหนือสะดือขึ้นมา 3 cun ห่างแนวกลางออกข้าง 2 cun',
  anatomy_th  = 'เหนือสะดือ 3 cun ห่างแนวกลาง 2 cun',
  location_en = 'On the ventrolateral abdomen, 3 cun cranial to the umbilicus, 2 cun lateral to the ventral midline',
  anatomy_en  = '3 cun cranial to the umbilicus, 2 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.146'
where code = 'ST-22';

update points set
  location_th = 'ผนังหน้าท้องด้านข้าง ที่ระดับกระดูกหัวหน่าว ใต้สะดือลงมา 5 cun ห่างแนวกลางออกข้าง 2 cun',
  anatomy_th  = 'ระดับหัวหน่าว ใต้สะดือ 5 cun ห่างแนวกลาง 2 cun',
  location_en = 'On the ventrolateral abdomen at the level of the pubis, 5 cun caudal to the umbilicus, 2 cun lateral to the ventral midline',
  anatomy_en  = 'Level with the pubis, 5 cun caudal to the umbilicus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.147'
where code = 'ST-30';

-- ---------- 3) ต้นขา ตำราวางด้วยสัดส่วนบนเส้น tuber coxae ถึง ST-34 ----------
update points set
  location_th = 'ด้านนอกของต้นขา ที่ระยะหนึ่งในสามช่วงบนของเส้นที่ลากจากปุ่มกระดูกเชิงกราน (tuber coxae) ไปหา ST-34',
  anatomy_th  = '1/3 ช่วงบนของเส้น tuber coxae ถึง ST-34',
  location_en = 'On the lateral aspect of the thigh, on the upper third of the line connecting the tuber coxae and ST-34',
  anatomy_en  = 'Upper third of the tuber coxae to ST-34 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.147'
where code = 'ST-31';

update points set
  location_th = 'ด้านนอกของต้นขา ที่ระยะหนึ่งในสามของเส้นที่ลากระหว่าง ST-31 กับ ST-34',
  anatomy_th  = '1/3 ของระยะ ST-31 ถึง ST-34',
  location_en = 'On the lateral aspect of the thigh, one third of the distance along a line between ST-31 and ST-34',
  anatomy_en  = 'One third of the way from ST-31 to ST-34',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.147'
where code = 'ST-32';

update points set
  location_th = 'ด้านนอกของต้นขา เหนือ ST-34 ขึ้นมา 1 cun',
  anatomy_th  = 'เหนือ ST-34 ไป 1 cun',
  location_en = 'On the lateral aspect of the thigh, 1 cun proximal to ST-34',
  anatomy_en  = '1 cun proximal to ST-34',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.147'
where code = 'ST-33';

update points set
  location_th = 'ด้านนอกของต้นขา เหนือลูกสะบ้าขึ้นมา 2 cun และเยื้องไปทางท้าย-นอก อยู่ในเนื้อกล้ามเนื้อ vastus lateralis',
  anatomy_th  = 'ในเนื้อกล้ามเนื้อ vastus lateralis เหนือลูกสะบ้า 2 cun',
  location_en = 'On the lateral aspect of the thigh, 2 cun proximal and caudolateral to the patella, in the belly of the vastus lateralis muscle',
  anatomy_en  = 'Belly of the vastus lateralis, 2 cun proximal to the patella',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.147'
where code = 'ST-34';

-- ---------- ใบหน้าและคอ ----------
update points set
  location_th = 'ด้านข้างของจมูก ในแอ่งที่ถัดจากขอบบน-นอกของรูจมูกไปทางท้าย 2 cun',
  anatomy_th  = 'ข้างจมูก ท้ายต่อขอบรูจมูก 2 cun',
  location_en = 'On the lateral side of the nose, in the depression 2 cun caudal to the dorsolateral edge of the nares',
  anatomy_en  = 'Lateral nose, 2 cun caudal to the edge of the nostril',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.143'
where code = 'ST-3';

update points set
  location_th = 'ที่มุมปากด้านข้าง ห่างออกจากรอยต่อผิวหนังกับเยื่อบุ 0.1 cun',
  anatomy_th  = 'มุมปาก นอกรอยต่อผิวหนัง-เยื่อบุ 0.1 cun',
  location_en = 'At the lateral corner of the mouth, 0.1 cun outside the mucocutaneous junction',
  anatomy_en  = 'Lateral corner of the mouth, just outside the mucocutaneous junction',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.143'
where code = 'ST-4';

update points set
  location_th = 'ด้านข้างของใบหน้า ถัดจากมุมปากไปทางท้าย 4 cun ตามแนวขอบหน้าของกล้ามเนื้อ masseter',
  anatomy_th  = 'ขอบหน้ากล้ามเนื้อ masseter ท้ายต่อมุมปาก 4 cun',
  location_en = 'On the side of the face, 4 cun caudal to the lateral commissure of the mouth, along the rostral border of the masseter muscle',
  anatomy_en  = 'Rostral border of the masseter, 4 cun caudal to the corner of the mouth',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.143'
where code = 'ST-5';

update points set
  location_th = 'ในแอ่งที่อยู่ท้ายต่อแอ่งเหนือเบ้าตา (supraorbital fossa) ห่างจากขอบหน้าของฐานใบหูมาทางหน้า 1 cun',
  anatomy_th  = 'ท้ายต่อ supraorbital fossa หน้าต่อฐานใบหู 1 cun',
  location_en = 'In the depression caudal to the supraorbital fossa, 1 cun cranial to the front edge of the ear base',
  anatomy_en  = 'Caudal to the supraorbital fossa, 1 cun in front of the ear base',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-8';

update points set
  location_th = 'ในแอ่งท้ายต่อขากรรไกร ตามแนวขอบล่างของขากรรไกรล่าง อยู่บนขอบหน้าของกล้ามเนื้อ sternocleidomastoid',
  anatomy_th  = 'ขอบหน้ากล้ามเนื้อ sternocleidomastoid ท้ายต่อขากรรไกร',
  location_en = 'In the depression caudal to the jaw along the line of the mandible, on the anterior aspect of the sternocleidomastoid muscle',
  anatomy_en  = 'Anterior border of the sternocleidomastoid, caudal to the mandible',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-9';

update points set
  location_th = 'ข้างคอ ห่างจากหัวไหล่ขึ้นไปทางหน้า-บน 4 cun อยู่ในกล้ามเนื้อ sternocleidomastoid เหนือร่อง jugular (กึ่งกลางระหว่าง ST-9 กับ ST-11)',
  anatomy_th  = 'กล้ามเนื้อ sternocleidomastoid เหนือร่อง jugular กึ่งกลาง ST-9 ถึง ST-11',
  location_en = 'In the lateral cervical region, 4 cun craniodorsal to the point of the shoulder, in the sternocleidomastoid muscle dorsal to the jugular groove (midway between ST-9 and ST-11)',
  anatomy_en  = 'Sternocleidomastoid above the jugular groove, midway between ST-9 and ST-11',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-10';

update points set
  location_th = 'ด้านหน้าของอก ที่ระดับหัวไหล่ เหนือ KID-27 ขึ้นมา 2 cun (KID-27 อยู่ระหว่างกระดูกอกกับซี่โครงซี่แรก ห่างแนวกลางท้อง 2 cun)',
  anatomy_th  = 'หน้าอก ระดับหัวไหล่ เหนือ KID-27 ไป 2 cun',
  location_en = 'On the front of the chest at the level of the shoulder, 2 cun dorsal to KID-27, which lies between the sternum and the first rib, 2 cun lateral to the ventral midline',
  anatomy_en  = 'Front of the chest at shoulder level, 2 cun dorsal to KID-27',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.144'
where code = 'ST-11';

-- ---------- เท้าหลัง ----------
update points set
  location_th = 'ด้านหน้าของฝ่าเท้าหลัง ที่รอยต่อระหว่างกระดูก metatarsal ที่ 3 และ 4 ต่ำจาก ST-41 ลงมา 1 cun',
  anatomy_th  = 'รอยต่อ metatarsal III-IV ต่ำจาก ST-41 ลงมา 1 cun',
  location_en = 'On the cranial aspect of the metatarsus at the junction of the third and fourth metatarsal bones, 1 cun distal to ST-41',
  anatomy_en  = 'Junction of metatarsals III and IV, 1 cun distal to ST-41',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.149'
where code = 'ST-42';

update points set
  location_th = 'ถัดจากข้อ metatarsophalangeal ลงมาทางปลาย อยู่เหนือขอบพังผืดระหว่างนิ้วที่ 3 กับนิ้วที่ 4',
  anatomy_th  = 'ใต้ข้อ metatarsophalangeal เหนือพังผืดระหว่างนิ้ว III-IV',
  location_en = 'Distal to the metatarsophalangeal joint and proximal to the web margin between the third and fourth digits of the pelvic limb',
  anatomy_en  = 'Distal to the metatarsophalangeal joint, above the web between digits III and IV',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.149'
where code = 'ST-44';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('ST-2','ST-6','ST-7','ST-23','ST-24','ST-26','ST-27','ST-28','ST-29',
               'ST-35','ST-37','ST-38','ST-39','ST-40','ST-41','ST-43','ST-45');

select count(*) filter (where verified_source is not null) as ตรวจแล้ว, count(*) as ทั้งเส้น
from points where meridian_code = 'ST';

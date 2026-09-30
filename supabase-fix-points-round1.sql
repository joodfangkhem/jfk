-- =============================================================
-- JFK — แก้ 4 จุดตามที่เทียบกับ Xie's Veterinary Acupuncture แล้ว
-- อ่านตารางเปรียบเทียบให้ครบก่อนรัน · ต้องรัน supabase-migration-verified-source.sql ก่อน
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง ไม่ได้คัดลอกจากตำรา
-- GV-14 ไม่อยู่ในไฟล์นี้ รอการตัดสินใจเรื่องความลึกเข็ม
-- =============================================================

-- LI-4 — ตำราระบุด้านใน (medial) ไม่ใช่ด้านหลังมือ
update points set
  location_th = 'ด้านในของขาหน้า (medial) ในร่องระหว่างกระดูก metacarpal ที่ 2 และ 3 ที่ระดับกึ่งกลางของกระดูก metacarpal ที่ 3',
  anatomy_th  = 'ร่องระหว่าง metacarpal II-III ด้านในของขาหน้า',
  location_en = 'On the medial aspect of the thoracic limb, in the groove between the second and third metacarpal bones, level with the midpoint of the third metacarpal bone',
  anatomy_en  = 'Groove between metacarpals II and III on the medial side',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.138'
where code = 'LI-4';

-- LIV-3 — ด้านใน ไม่ใช่ด้านหลังเท้า และอยู่เหนือข้อนิ้ว ไม่ใช่กลางกระดูก
update points set
  location_th = 'ด้านในของขาหลัง ในร่องระหว่างกระดูก metatarsal ที่ 2 และ 3 เหนือข้อ metatarsophalangeal ขึ้นมาเล็กน้อย',
  anatomy_th  = 'ร่องระหว่าง metatarsal II-III ด้านใน เหนือข้อนิ้วเท้า',
  location_en = 'On the medial aspect of the pelvic limb, in the groove between the second and third metatarsal bones, just proximal to the metatarsophalangeal joint',
  anatomy_en  = 'Groove between metatarsals II and III on the medial side, proximal to the toe joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.190'
where code = 'LIV-3';

-- ST-36 — อยู่ในเนื้อกล้ามเนื้อ ไม่ใช่ในร่องข้างกระดูก และตำราให้แทงเฉียง
update points set
  location_th = 'ด้านหน้า-นอกของขาหลัง ต่ำจาก ST-35 ลงมา 3 cun และห่างจากสันหน้าแข้ง (tibial crest) ออกด้านนอก 0.5 cun อยู่ในเนื้อกล้ามเนื้อ cranial tibialis เป็นจุดยาวตามแนวกล้ามเนื้อ ไม่ใช่จุดเล็กจุดเดียว',
  anatomy_th  = 'ในเนื้อกล้ามเนื้อ cranial tibialis ห่างสันหน้าแข้งออกข้าง 0.5 cun',
  needle_th   = 'แทงเฉียง ลึก 0.5-1 cun ตามขนาดสัตว์',
  location_en = 'On the craniolateral aspect of the hind limb, 3 cun distal to ST-35 and 0.5 cun lateral to the tibial crest, within the belly of the cranial tibialis muscle. It runs as a long point along the muscle rather than a single spot.',
  anatomy_en  = 'Within the belly of the cranial tibialis muscle, 0.5 cun lateral to the tibial crest',
  needle_en   = 'Oblique insertion, 0.5-1 cun depending on the size of the animal',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.148'
where code = 'ST-36';

-- LI-11 — จุดอ้างอิงคือเอ็น biceps ไม่ใช่หัวกระดูก radius และต้องงอข้อศอกคลำ
update points set
  location_th = 'ด้านนอกของขาหน้า ที่ปลายด้านนอกของรอยพับข้อศอก กึ่งกลางระหว่างปุ่ม lateral epicondyle ของ humerus กับเอ็นกล้ามเนื้อ biceps คลำขณะงอข้อศอก',
  anatomy_th  = 'ปลายนอกของรอยพับข้อศอก ระหว่าง lateral epicondyle กับเอ็น biceps',
  needle_th   = 'ตั้งฉากหรือเฉียง ลึกได้ถึง 1.5 cun',
  location_en = 'On the lateral aspect of the thoracic limb at the outer end of the elbow crease, midway between the lateral epicondyle of the humerus and the biceps tendon; palpate with the elbow flexed',
  anatomy_en  = 'Outer end of the elbow crease, between the lateral epicondyle and the biceps tendon',
  needle_en   = 'Perpendicular or oblique, up to 1.5 cun',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.140'
where code = 'LI-11';

-- จุดที่เทียบแล้วตรงกับตำรา ไม่ต้องแก้เนื้อหา บันทึกแหล่งอ้างอิงไว้อย่างเดียว
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('BL-23', 'BL-13', 'BL-20', 'BL-25', 'GB-30', 'GB-34', 'SP-6', 'GV-4');

select code, verified_source, left(location_th, 60) as ตำแหน่ง
from points
where verified_source is not null
order by code;

-- =============================================================
-- JFK — แปดเส้นที่เหลือ: LU HT PC SI TH SP KI LIV (133 จุด)
-- เทียบกับ Xie's Veterinary Acupuncture บทที่ 5
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง
--
-- เรื่องใหญ่ที่สุด: SP-14 ถึง SP-21 ของเดิมวางผิดหมด
--   ตำราวางไว้บนผนังอกเรียงจากช่องซี่โครงที่ 10 ลงมาถึงช่องที่ 4
--   ของเดิมวางไว้บนผนังหน้าท้องและช่องซี่โครงที่ไม่ตรงกันเลย
-- อีกจุด: KI-7 กับ KI-8 ของเดิมเขียนตำแหน่งเหมือนกันเป๊ะทั้งสองจุด
-- =============================================================


update points set
  location_th = 'ในช่องด้านในต่อปุ่ม greater tubercle ของกระดูก humerus อยู่ในกล้ามเนื้อ superficial pectoral ที่ระดับช่องซี่โครงช่องแรก',
  anatomy_th  = 'กล้ามเนื้อ superficial pectoral ด้านในต่อ greater tubercle',
  location_en = 'In the space medial to the greater tubercle of the humerus, in the superficial pectoral muscle at the level of the first intercostal space',
  anatomy_en  = 'Superficial pectoral muscle, medial to the greater tubercle',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.136'
where code = 'LU-1';

update points set
  location_th = 'ในกล้ามเนื้อ superficial pectoral ถัดออกด้านข้างจาก LU-1 กึ่งกลางระหว่างข้อไหล่กับแนวกลางท้อง',
  anatomy_th  = 'กล้ามเนื้อ superficial pectoral ข้าง LU-1',
  location_en = 'In the superficial pectoral muscle, lateral to LU-1, halfway between the shoulder and the ventral midline',
  anatomy_en  = 'Superficial pectoral muscle, lateral to LU-1',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.136'
where code = 'LU-2';

update points set
  location_th = 'ที่ระยะหนึ่งในสามของเส้นที่ลากจาก LU-2 ไปหา LU-5',
  anatomy_th  = '1/3 ของเส้น LU-2 ถึง LU-5',
  location_en = 'One third of the distance along a line from LU-2 to LU-5',
  anatomy_en  = 'One third of the way from LU-2 to LU-5',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.136'
where code = 'LU-3';

update points set
  location_th = 'ด้านหน้า-ในของขาหน้า ต่ำจาก LU-5 ลงมา 5 cun อยู่ในร่องกล้ามเนื้อแนวหน้าสุด ระหว่างกล้ามเนื้อ extensor carpi radialis กับ flexor carpi radialis',
  anatomy_th  = 'ร่องระหว่าง extensor carpi radialis กับ flexor carpi radialis',
  location_en = 'On the craniomedial aspect of the thoracic limb, 5 cun distal to LU-5, in the most cranial muscle groove between the extensor carpi radialis and flexor carpi radialis muscles',
  anatomy_en  = 'Groove between the extensor and flexor carpi radialis, 5 cun below LU-5',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.136'
where code = 'LU-6';

update points set
  location_th = 'ด้านในของขาหน้า ในแอ่งที่อยู่ต่ำจาก LU-7 ลงมา 0.5 cun',
  anatomy_th  = 'ต่ำจาก LU-7 ลงมา 0.5 cun',
  location_en = 'On the medial side of the thoracic limb, in a depression 0.5 cun distal to LU-7',
  anatomy_en  = '0.5 cun distal to LU-7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.137'
where code = 'LU-8';

update points set
  location_th = 'ด้านในของข้อ radiocarpal อยู่หน้าต่อหลอดเลือดแดง radial ที่ระดับเดียวกับ HT-7',
  anatomy_th  = 'ด้านในข้อ radiocarpal หน้าต่อหลอดเลือดแดง radial',
  location_en = 'On the medial aspect of the radiocarpal joint just cranial to the radial artery, at the level of HT-7',
  anatomy_en  = 'Medial radiocarpal joint, just cranial to the radial artery',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.137'
where code = 'LU-9';

update points set
  location_th = 'ด้านในของขาหน้า กึ่งกลางระหว่างข้อ radiocarpal กับข้อ metacarpophalangeal ของนิ้วที่ 1 (นิ้วติ่ง)',
  anatomy_th  = 'กึ่งกลางข้อ radiocarpal ถึงข้อนิ้วที่ 1',
  location_en = 'On the medial side of the thoracic limb, halfway between the radiocarpal joint and the metacarpophalangeal joint of the first digit',
  anatomy_en  = 'Midway between the radiocarpal joint and the first digit',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.137'
where code = 'LU-10';

update points set
  location_th = 'โคนเล็บของนิ้วที่ 1 (นิ้วติ่ง / dewclaw) ขาหน้า ด้านใน',
  anatomy_th  = 'โคนเล็บนิ้วที่ 1 ด้านใน',
  location_en = 'On the medial side of the first digit of the thoracic limb at the nail bed',
  anatomy_en  = 'Nail bed of the first digit, medial side',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.137'
where code = 'LU-11';

update points set
  location_th = 'ในบริเวณรักแร้ กึ่งกลางระหว่าง HT-1 กับ HT-3',
  anatomy_th  = 'กึ่งกลาง HT-1 ถึง HT-3',
  location_en = 'In the axillary region, halfway between HT-1 and HT-3',
  anatomy_en  = 'Midway between HT-1 and HT-3',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.154'
where code = 'HT-2';

update points set
  location_th = 'ด้านหลัง-นอกของขาหน้า เหนือ HT-7 ขึ้นมา 1.5 cun ในร่องกล้ามเนื้อระหว่าง flexor carpi ulnaris กับ superficial digital flexor',
  anatomy_th  = 'ร่องระหว่าง flexor carpi ulnaris กับ superficial digital flexor',
  location_en = 'On the caudolateral aspect of the thoracic limb, 1.5 cun proximal to HT-7, in the muscle groove between the flexor carpi ulnaris and superficial digital flexor muscles',
  anatomy_en  = 'Groove between flexor carpi ulnaris and superficial digital flexor',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.155'
where code = 'HT-4';

update points set
  location_th = 'ด้านหลัง-นอกของขาหน้า เหนือ HT-7 ขึ้นมา 1 cun ในร่องกล้ามเนื้อระหว่าง flexor carpi ulnaris กับ superficial digital flexor',
  anatomy_th  = 'ร่องกล้ามเนื้อ เหนือ HT-7 1 cun',
  location_en = 'On the caudolateral aspect of the thoracic limb, 1 cun proximal to HT-7, in the muscle groove between the flexor carpi ulnaris and superficial digital flexor muscles',
  anatomy_en  = 'Same groove, 1 cun above HT-7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.155'
where code = 'HT-5';

update points set
  location_th = 'ด้านหลัง-นอกของขาหน้า เหนือ HT-7 ขึ้นมา 0.5 cun ในร่องกล้ามเนื้อระหว่าง flexor carpi ulnaris กับ superficial digital flexor',
  anatomy_th  = 'ร่องกล้ามเนื้อ เหนือ HT-7 0.5 cun',
  location_en = 'On the caudolateral border of the thoracic limb, 0.5 cun proximal to HT-7, in the muscle groove between the flexor carpi ulnaris and superficial digital flexor muscles',
  anatomy_en  = 'Same groove, 0.5 cun above HT-7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.155'
where code = 'HT-6';

update points set
  location_th = 'ที่รอยพับขวางของข้อข้อมือด้านนอก เข้าถึงผ่านแอ่งใหญ่ที่อยู่ด้านนอกของเอ็นกล้ามเนื้อ flexor carpi ulnaris แต่ตัวจุดอยู่ด้านในของเอ็นเส้นนี้',
  anatomy_th  = 'แอ่งข้างเอ็น flexor carpi ulnaris จุดอยู่ด้านในเอ็น',
  location_en = 'On the lateral transverse crease of the carpal joint, approached through the large depression lateral to the tendon of the flexor carpi ulnaris, although the point itself lies medial to that tendon',
  anatomy_en  = 'Carpal crease at the flexor carpi ulnaris tendon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.156'
where code = 'HT-7';

update points set
  location_th = 'ด้านในต่อปลายข้อศอก ในช่องซี่โครงช่องที่ 5',
  anatomy_th  = 'ด้านในปลายข้อศอก ช่องซี่โครงที่ 5',
  location_en = 'Medial to the point of the elbow, in the fifth intercostal space',
  anatomy_en  = 'Medial to the point of the elbow, fifth intercostal space',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.174'
where code = 'PC-1';

update points set
  location_th = 'ด้านในของรอยพับข้อศอก อยู่ท้ายต่อเอ็นกล้ามเนื้อ biceps brachii',
  anatomy_th  = 'ท้ายต่อเอ็น biceps brachii ที่รอยพับข้อศอก',
  location_en = 'On the medial side of the cubital crease of the elbow, just caudal to the tendon of the biceps brachii muscle',
  anatomy_en  = 'Medial cubital crease, just caudal to the biceps tendon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.175'
where code = 'PC-3';

update points set
  location_th = 'ด้านในของขาหน้า เหนือรอยพับขวางของข้อข้อมือขึ้นมา 5 cun ในร่องระหว่างกล้ามเนื้อ flexor carpi radialis กับ superficial digital flexor',
  anatomy_th  = 'ร่องระหว่าง flexor carpi radialis กับ superficial digital flexor เหนือข้อมือ 5 cun',
  location_en = 'On the medial side of the thoracic limb, 5 cun proximal to the transverse carpal crease, in the groove between the flexor carpi radialis and superficial digital flexor muscles',
  anatomy_en  = '5 cun above the carpal crease, in the flexor groove',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.175'
where code = 'PC-4';

update points set
  location_th = 'ด้านในของขาหน้า เหนือรอยพับขวางของข้อข้อมือขึ้นมา 4 cun ในร่องระหว่างกล้ามเนื้อ flexor carpi radialis กับ superficial digital flexor',
  anatomy_th  = 'ร่องกล้ามเนื้องอ เหนือข้อมือ 4 cun',
  location_en = 'On the medial side of the thoracic limb, 4 cun proximal to the transverse carpal crease, in the groove between the flexor carpi radialis and superficial digital flexor muscles',
  anatomy_en  = '4 cun above the carpal crease, in the flexor groove',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.175'
where code = 'PC-5';

update points set
  location_th = 'ด้านในของขาหน้า เหนือรอยพับขวางของข้อข้อมือขึ้นมา 3 cun ในร่องระหว่างกล้ามเนื้อ flexor carpi radialis กับ superficial digital flexor (อยู่ตรงข้ามกับ TH-5 ด้านนอก)',
  anatomy_th  = 'ร่องกล้ามเนื้องอ เหนือข้อมือ 3 cun ตรงข้าม TH-5',
  location_en = 'On the medial side of the thoracic limb, 3 cun proximal to the transverse carpal crease, in the groove between the flexor carpi radialis and superficial digital flexor muscles, opposite TH-5 on the lateral side',
  anatomy_en  = '3 cun above the carpal crease, opposite TH-5',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.175'
where code = 'PC-6';

update points set
  location_th = 'ด้านฝ่าเท้าหน้า ใต้อุ้งเท้าใหญ่ตรงกลาง ระหว่างกระดูก metacarpal ที่ 3 และ 4',
  anatomy_th  = 'ใต้อุ้งเท้ากลาง ระหว่าง metacarpal III-IV',
  location_en = 'On the palmar side of the thoracic limb, under the large central pad, between the third and fourth metacarpal bones',
  anatomy_en  = 'Under the central pad, between metacarpals III and IV',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.176'
where code = 'PC-8';

update points set
  location_th = 'โคนเล็บของนิ้วที่ 4 ขาหน้า ด้านใน',
  anatomy_th  = 'โคนเล็บนิ้วที่ 4 ด้านใน',
  location_en = 'On the medial aspect of the fourth digit of the thoracic limb at the nail bed',
  anatomy_en  = 'Nail bed of the fourth digit, medial side',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.176'
where code = 'PC-9';

update points set
  location_th = 'ด้านนอกของขาหน้า ต่ำกว่าข้อข้อมือ อยู่ท้าย-นอกต่อโคนกระดูก metacarpal ที่ 4 (ตรงข้ามกับ LI-4 ด้านใน)',
  anatomy_th  = 'ท้าย-นอกต่อโคน metacarpal IV ตรงข้าม LI-4',
  location_en = 'On the lateral side of the thoracic limb distal to the carpal joint, caudolateral to the base of the fourth metacarpal bone, opposite LI-4 on the medial side',
  anatomy_en  = 'Caudolateral to the base of the fourth metacarpal',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.157'
where code = 'SI-4';

update points set
  location_th = 'ด้านหลัง-นอกของขาหน้า ในแอ่งตามแนวปุ่ม lateral styloid process ของกระดูก radius',
  anatomy_th  = 'แอ่งตาม lateral styloid process ของ radius',
  location_en = 'On the caudolateral aspect of the thoracic limb, in a depression along the lateral styloid process of the radius',
  anatomy_en  = 'Depression along the lateral styloid process of the radius',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.157'
where code = 'SI-5';

update points set
  location_th = 'ด้านนอกของขาหน้า ต่ำกว่าปลายกระดูก ulna อยู่บนขอบหน้าของกล้ามเนื้อ ulnaris lateralis หน้าต่อ HT-7',
  anatomy_th  = 'ขอบหน้ากล้ามเนื้อ ulnaris lateralis หน้าต่อ HT-7',
  location_en = 'On the lateral side of the thoracic limb distal to the tip of the ulna, on the cranial edge of the ulnaris lateralis muscle, cranial to HT-7',
  anatomy_en  = 'Cranial edge of the ulnaris lateralis, cranial to HT-7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.157'
where code = 'SI-6';

update points set
  location_th = 'ด้านหลัง-นอกของขาหน้า เหนือ SI-5 ขึ้นมา 5 cun บนเส้นที่ลากระหว่าง SI-5 กับ SI-8',
  anatomy_th  = 'เหนือ SI-5 5 cun บนเส้น SI-5 ถึง SI-8',
  location_en = 'On the caudolateral aspect of the thoracic limb, 5 cun proximal to SI-5, on a line joining SI-5 and SI-8',
  anatomy_en  = '5 cun above SI-5 on the SI-5 to SI-8 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.157'
where code = 'SI-7';

update points set
  location_th = 'ด้านในของข้อศอก ระหว่างปุ่ม medial epicondyle ของ humerus กับปุ่ม olecranon จุดนี้อยู่บนเส้นประสาท ulnar',
  anatomy_th  = 'ระหว่าง medial epicondyle กับ olecranon บนเส้นประสาท ulnar',
  location_en = 'On the medial side of the elbow between the medial humeral epicondyle and the olecranon. The point lies on the ulnar nerve — the "funny bone".',
  anatomy_en  = 'Between the medial epicondyle and the olecranon, on the ulnar nerve',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-8';

update points set
  location_th = 'ท้ายต่อกระดูก humerus ในแอ่งใหญ่ตามขอบท้ายของกล้ามเนื้อ deltoid ตรงรอยต่อกับหัวด้านนอกและหัวยาวของกล้ามเนื้อ triceps brachii',
  anatomy_th  = 'แอ่งขอบท้าย deltoid รอยต่อกับ triceps',
  location_en = 'Caudal to the humerus, in the large depression along the caudal border of the deltoid muscle at its junction with the lateral and long heads of the triceps brachii',
  anatomy_en  = 'Depression along the caudal border of the deltoid',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-9';

update points set
  location_th = 'เหนือข้อไหล่ ถัดจาก SI-9 ไปทางหน้า-บน 2 cun',
  anatomy_th  = 'หน้า-บนจาก SI-9 2 cun',
  location_en = 'Dorsal to the shoulder, 2 cun craniodorsal to SI-9',
  anatomy_en  = '2 cun craniodorsal to SI-9',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-10';

update points set
  location_th = 'เหนือข้อไหล่ ถัดจาก SI-10 ไปทางท้าย-บน 2 cun อยู่ท้ายต่อสันกระดูกสะบัก',
  anatomy_th  = 'ท้าย-บนจาก SI-10 2 cun ท้ายต่อสันสะบัก',
  location_en = 'Dorsal to the shoulder, 2 cun caudodorsal to SI-10 and caudal to the scapular spine',
  anatomy_en  = '2 cun caudodorsal to SI-10, caudal to the scapular spine',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-11';

update points set
  location_th = 'หน้าต่อสันกระดูกสะบัก ต่ำจาก SI-13 ลงมา 3 cun',
  anatomy_th  = 'หน้าต่อสันสะบัก ใต้ SI-13 3 cun',
  location_en = 'Cranial to the scapular spine, 3 cun ventral to SI-13',
  anatomy_en  = 'Cranial to the scapular spine, 3 cun below SI-13',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-12';

update points set
  location_th = 'ท้ายต่อสันกระดูกสะบัก ต่ำจากขอบบนของสะบักลงมา 3 ⅓ cun',
  anatomy_th  = 'ท้ายต่อสันสะบัก ใต้ขอบบนสะบัก 3⅓ cun',
  location_en = 'Just caudal to the scapular spine, 3⅓ cun ventral to the dorsal border of the scapula',
  anatomy_en  = 'Caudal to the scapular spine, 3⅓ cun below its dorsal border',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.158'
where code = 'SI-13';

update points set
  location_th = 'บนขอบหน้าของกระดูกสะบัก ที่ระยะหนึ่งในสามของเส้นที่ลากจากขอบบนของสะบักไปหาปลายข้อไหล่',
  anatomy_th  = 'ขอบหน้าสะบัก 1/3 จากขอบบนไปหาปลายไหล่',
  location_en = 'On the cranial border of the scapula, one third of the distance along a line from the dorsal border of the scapula to the point of the shoulder',
  anatomy_en  = 'Cranial border of the scapula, one third down',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.159'
where code = 'SI-14';

update points set
  location_th = 'บริเวณคอส่วนท้าย ถัดจาก SI-14 ไปทางหน้า 1 cun',
  anatomy_th  = 'หน้าต่อ SI-14 1 cun',
  location_en = 'In the caudal cervical region, 1 cun cranial to SI-14',
  anatomy_en  = '1 cun cranial to SI-14',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.159'
where code = 'SI-15';

update points set
  location_th = 'บนขอบบนของกล้ามเนื้อ brachiocephalicus ที่ระดับช่องระหว่างกระดูกคอข้อที่ 2 และ 3 (C2-C3) อยู่เหนือ LI-18',
  anatomy_th  = 'ขอบบนกล้ามเนื้อ brachiocephalicus ระดับ C2-C3',
  location_en = 'On the dorsal border of the brachiocephalicus muscle at the level of the second cervical vertebral space (C2-C3), dorsal to LI-18',
  anatomy_en  = 'Dorsal border of the brachiocephalicus at C2-C3',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.159'
where code = 'SI-16';

update points set
  location_th = 'ถัดจากขากรรไกรล่างไปทางท้ายทันที ที่ระดับเดียวกับ SI-16',
  anatomy_th  = 'ท้ายต่อขากรรไกรล่าง ระดับ SI-16',
  location_en = 'Immediately caudal to the mandible at the level of SI-16',
  anatomy_en  = 'Immediately caudal to the mandible, level with SI-16',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.159'
where code = 'SI-17';

update points set
  location_th = 'หน้าต่อ tragus ที่ขอบท้ายของขากรรไกรล่าง เยื้องขึ้นเล็กน้อยจาก condyloid process',
  anatomy_th  = 'หน้าต่อ tragus ขอบท้ายขากรรไกรล่าง',
  location_en = 'Rostral to the tragus at the posterior border of the mandible, slightly dorsal to the condyloid process',
  anatomy_en  = 'Rostral to the tragus at the caudal border of the mandible',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.160'
where code = 'SI-19';

update points set
  location_th = 'ด้านนอกของนิ้วที่ 4 ขาหน้า ถัดจากข้อ metacarpophalangeal ลงไปทางปลายนิ้ว อยู่ในพังผืดระหว่างนิ้ว',
  anatomy_th  = 'ด้านนอกนิ้วที่ 4 ใต้ข้อนิ้ว ในพังผืด',
  location_en = 'Just distal to the metacarpophalangeal joint on the lateral side of the fourth digit, in the proximal web between the digits',
  anatomy_en  = 'Lateral fourth digit, in the web just below the joint',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.177'
where code = 'TH-2';

update points set
  location_th = 'ด้านนอกของขาหน้า เหนือข้อข้อมือขึ้นมา 3 cun ในช่องระหว่างกระดูก radius กับ ulna (อยู่ตรงข้ามกับ PC-6 ด้านใน)',
  anatomy_th  = 'ช่องระหว่าง radius กับ ulna เหนือข้อมือ 3 cun',
  location_en = 'On the lateral side of the thoracic limb, 3 cun proximal to the carpus, in the interosseous space between the radius and ulna, opposite PC-6 on the medial side',
  anatomy_en  = 'Interosseous space, 3 cun above the carpus, opposite PC-6',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.178'
where code = 'TH-5';

update points set
  location_th = 'ด้านนอกของขาหน้า เหนือข้อข้อมือขึ้นมา 4 cun บนเส้นที่ลากจาก TH-4 ไปหาปุ่ม olecranon',
  anatomy_th  = 'เหนือข้อมือ 4 cun บนเส้น TH-4 ถึง olecranon',
  location_en = 'On the lateral side of the thoracic limb, 4 cun proximal to the carpus, on a line connecting TH-4 and the olecranon',
  anatomy_en  = '4 cun above the carpus on the TH-4 to olecranon line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.178'
where code = 'TH-6';

update points set
  location_th = 'ด้านนอกของขาหน้า ถัดจาก TH-6 ไปทางท้าย 1 cun อยู่ระหว่างกระดูก radius กับ ulna',
  anatomy_th  = 'ท้ายต่อ TH-6 1 cun ระหว่าง radius กับ ulna',
  location_en = 'On the lateral side of the thoracic limb, 1 cun caudal to TH-6, between the radius and ulna',
  anatomy_en  = '1 cun caudal to TH-6',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.178'
where code = 'TH-7';

update points set
  location_th = 'ด้านนอกของขาหน้า เหนือข้อข้อมือขึ้นมา 5 cun บนเส้นที่ลากจาก TH-4 ไปหาปุ่ม olecranon',
  anatomy_th  = 'เหนือข้อมือ 5 cun บนเส้น TH-4 ถึง olecranon',
  location_en = 'On the lateral side of the thoracic limb, 5 cun proximal to the carpus, on a line connecting TH-4 and the olecranon',
  anatomy_en  = '5 cun above the carpus on the TH-4 to olecranon line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.178'
where code = 'TH-8';

update points set
  location_th = 'ด้านนอกของขาหน้า ต่ำจากปุ่ม olecranon ลงมา 4 cun บนเส้นที่ลากจาก TH-4 ไปหาปุ่ม olecranon',
  anatomy_th  = 'ใต้ olecranon 4 cun',
  location_en = 'On the lateral side of the thoracic limb, 4 cun distal to the olecranon, on a line connecting TH-4 and the olecranon',
  anatomy_en  = '4 cun distal to the olecranon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.179'
where code = 'TH-9';

update points set
  location_th = 'ในแอ่งบนเอ็นกล้ามเนื้อ triceps เหนือปุ่ม olecranon ขึ้นมาเล็กน้อย',
  anatomy_th  = 'แอ่งบนเอ็น triceps เหนือ olecranon',
  location_en = 'In a depression on the triceps tendon just proximal to the olecranon',
  anatomy_en  = 'Depression on the triceps tendon above the olecranon',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.179'
where code = 'TH-10';

update points set
  location_th = 'ด้านนอกของต้นแขน ที่ระยะหนึ่งในสามจาก TH-11 ไปหา TH-14',
  anatomy_th  = '1/3 ของระยะ TH-11 ถึง TH-14',
  location_en = 'On the lateral side of the thoracic limb, one third of the distance from TH-11 to TH-14',
  anatomy_en  = 'One third of the way from TH-11 to TH-14',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.179'
where code = 'TH-12';

update points set
  location_th = 'ด้านนอกของต้นแขน บนเส้นที่ลากระหว่างปุ่ม olecranon กับ TH-14 ต่ำจาก TH-14 ลงมา 3 cun',
  anatomy_th  = 'ใต้ TH-14 3 cun บนเส้น olecranon ถึง TH-14',
  location_en = 'On the lateral side of the thoracic limb, on a line joining the olecranon and TH-14, 3 cun ventral to TH-14',
  anatomy_en  = '3 cun below TH-14 on the olecranon line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.179'
where code = 'TH-13';

update points set
  location_th = 'ถัดจากฐานใบหูไปทางท้าย-ล่าง ในแอ่งระหว่างขากรรไกรล่างกับปุ่มกระดูก mastoid',
  anatomy_th  = 'แอ่งระหว่างขากรรไกรล่างกับ mastoid',
  location_en = 'Caudoventral to the base of the ear, in the depression between the mandible and the mastoid process',
  anatomy_en  = 'Depression between the mandible and the mastoid process',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.180'
where code = 'TH-17';

update points set
  location_th = 'ท้ายต่อใบหู ที่ระยะหนึ่งในสามของเส้นที่ลากระหว่าง TH-17 กับ TH-20',
  anatomy_th  = '1/3 ของเส้น TH-17 ถึง TH-20',
  location_en = 'Caudal to the ear, one third of the distance along a line between TH-17 and TH-20',
  anatomy_en  = 'One third along the TH-17 to TH-20 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.180'
where code = 'TH-18';

update points set
  location_th = 'ท้ายและเหนือใบหู ที่ระยะสองในสามของเส้นที่ลากระหว่าง TH-17 กับ TH-20',
  anatomy_th  = '2/3 ของเส้น TH-17 ถึง TH-20',
  location_en = 'Caudal and dorsal to the ear, two thirds of the distance along a line between TH-17 and TH-20',
  anatomy_en  = 'Two thirds along the TH-17 to TH-20 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.180'
where code = 'TH-19';

update points set
  location_th = 'ในแอ่งที่อยู่หน้าต่อรอยบาก supratragic เหนือ condyloid process ของขากรรไกรล่าง และอยู่เหนือ SI-19',
  anatomy_th  = 'แอ่งหน้าต่อ supratragic notch เหนือ SI-19',
  location_en = 'In a depression just cranial to the supratragic notch, dorsal to the condyloid process of the mandible and dorsal to SI-19',
  anatomy_en  = 'Just cranial to the supratragic notch, above SI-19',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.180'
where code = 'TH-21';

update points set
  location_th = 'หน้าต่อใบหู ถัดจาก TH-21 ไปทางหน้า 1 cun',
  anatomy_th  = 'หน้าต่อ TH-21 1 cun',
  location_en = 'Cranial to the ear, 1 cun cranial to TH-21',
  anatomy_en  = '1 cun cranial to TH-21',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.181'
where code = 'TH-22';

update points set
  location_th = 'ในแอ่งบนขอบเบ้าตา ตรงตำแหน่งปลายคิ้วถ้าลากยาวไปถึงหางตา',
  anatomy_th  = 'แอ่งบนขอบเบ้าตา ปลายแนวคิ้ว',
  location_en = 'In the depression on the rim of the orbit at the end of the eyebrow, where it would extend to the lateral canthus',
  anatomy_en  = 'Depression on the orbital rim at the end of the eyebrow line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.181'
where code = 'TH-23';

update points set
  location_th = 'ด้านหลัง-ในของขาหลัง ในแอ่งที่อยู่ถัดจากโคน (ปลายบน) ของกระดูก metatarsal ที่ 2 ลงไปทางปลาย',
  anatomy_th  = 'แอ่งใต้โคน metatarsal II',
  location_en = 'On the caudomedial side of the pelvic limb, in the depression distal to the base (proximal end) of the second metatarsal bone',
  anatomy_en  = 'Depression distal to the base of the second metatarsal',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.150'
where code = 'SP-4';

update points set
  location_th = 'ด้านในของขาหลัง ในแอ่งระหว่างส่วนหน้า-ล่างของปุ่ม medial malleolus กับกระดูก tibial tarsal อยู่ท้ายต่อกล้ามเนื้อ cranial tibialis',
  anatomy_th  = 'แอ่งระหว่าง medial malleolus กับ tibial tarsal bone',
  location_en = 'On the medial side of the pelvic limb, in a depression between the cranioventral aspect of the medial malleolus and the tibial tarsal bone, caudal to the cranial tibialis muscle',
  anatomy_en  = 'Between the medial malleolus and the tibial tarsal bone',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.150'
where code = 'SP-5';

update points set
  location_th = 'ด้านในของขาหลัง บนเส้นที่ลากระหว่าง SP-6 กับ SP-9 เหนือ SP-6 ขึ้นมา 3 cun (หรือต่ำจาก SP-9 ลงมา 7 cun)',
  anatomy_th  = 'เหนือ SP-6 3 cun บนเส้น SP-6 ถึง SP-9',
  location_en = 'On the medial side of the pelvic limb, on a line between SP-6 and SP-9, 3 cun proximal to SP-6 or 7 cun distal to SP-9',
  anatomy_en  = '3 cun above SP-6 on the SP-6 to SP-9 line',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.151'
where code = 'SP-7';

update points set
  location_th = 'เมื่องอข้อเข่า จุดนี้อยู่เยื้องขึ้นและเข้าด้านในจากลูกสะบ้า 2 cun ในแอ่งที่อยู่หน้าต่อกล้ามเนื้อ sartorius',
  anatomy_th  = 'แอ่งหน้าต่อ sartorius เยื้องบน-ในจากลูกสะบ้า 2 cun',
  location_en = 'With the stifle flexed, 2 cun proximal and medial to the patella on the diagonal, in a depression just cranial to the sartorius muscle',
  anatomy_en  = '2 cun proximomedial to the patella, cranial to the sartorius',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.151'
where code = 'SP-10';

update points set
  location_th = 'กึ่งกลางระหว่าง ST-35b กับ SP-12 บนเส้นที่ลากจาก SP-10 ไปหา SP-12',
  anatomy_th  = 'กึ่งกลาง ST-35b ถึง SP-12',
  location_en = 'Halfway between ST-35b and SP-12, on the line between SP-10 and SP-12',
  anatomy_en  = 'Halfway between ST-35b and SP-12',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.151'
where code = 'SP-11';

update points set
  location_th = 'บริเวณสะโพกด้านนอก ในแอ่งที่อยู่ใต้ส่วนโค้งด้านหน้าของปุ่มกระดูกเชิงกราน (tuber coxae)',
  anatomy_th  = 'แอ่งใต้ส่วนโค้งหน้าของ tuber coxae',
  location_en = 'On the lateral gluteal region, in a depression ventral to the curve of the cranial aspect of the tuber coxae',
  anatomy_en  = 'Depression below the cranial curve of the tuber coxae',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.152'
where code = 'SP-12';

update points set
  location_th = 'บริเวณสะโพกด้านนอก ถัดจากปุ่มกระดูกเชิงกรานด้านหน้า-บนไปทางหน้า-ล่าง 0.5 cun',
  anatomy_th  = 'หน้า-ล่างจาก dorsocranial iliac spine 0.5 cun',
  location_en = 'On the lateral gluteal region, 0.5 cun cranioventral to the dorsocranial iliac spine',
  anatomy_en  = '0.5 cun cranioventral to the dorsocranial iliac spine',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.152'
where code = 'SP-13';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 10 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 10 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the tenth intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Tenth intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.152'
where code = 'SP-14';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 9 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 9 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the ninth intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Ninth intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.152'
where code = 'SP-15';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 8 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 8 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the eighth intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Eighth intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.152'
where code = 'SP-16';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 7 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 7 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the seventh intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Seventh intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.153'
where code = 'SP-17';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 6 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 6 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the sixth intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Sixth intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.153'
where code = 'SP-18';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 5 ระดับที่ต่ำจากปลายข้อไหล่ลงมา 2 cun',
  anatomy_th  = 'ช่องซี่โครงที่ 5 ใต้ปลายไหล่ 2 cun',
  location_en = 'On the lateral aspect of the thorax at the fifth intercostal space, at a level 2 cun ventral to the point of the shoulder',
  anatomy_en  = 'Fifth intercostal space, 2 cun below the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.153'
where code = 'SP-19';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 4 ระดับเดียวกับข้อศอก',
  anatomy_th  = 'ช่องซี่โครงที่ 4 ระดับข้อศอก',
  location_en = 'On the lateral aspect of the thorax at the fourth intercostal space, at the level of the elbow',
  anatomy_en  = 'Fourth intercostal space, level with the elbow',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.153'
where code = 'SP-20';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ช่องซี่โครงช่องที่ 7 ระดับเดียวกับปลายข้อไหล่',
  anatomy_th  = 'ช่องซี่โครงที่ 7 ระดับปลายไหล่',
  location_en = 'On the lateral aspect of the thorax at the seventh intercostal space, at the same level as the point of the shoulder',
  anatomy_en  = 'Seventh intercostal space, level with the point of the shoulder',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.153'
where code = 'SP-21';

update points set
  location_th = 'ด้านหลัง-ในของขาหลัง ต่ำกว่ากระดูก calcaneus อยู่ท้ายต่อกระดูก central tarsal',
  anatomy_th  = 'ใต้ calcaneus ท้ายต่อ central tarsal bone',
  location_en = 'On the caudomedial aspect of the pelvic limb, distal to the calcaneus, caudal to the central tarsal bone',
  anatomy_en  = 'Distal to the calcaneus, caudal to the central tarsal bone',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.192'
where code = 'KI-2';

update points set
  location_th = 'ด้านหลัง-ในของขาหลัง เหนือ KI-3 ขึ้นมา 2 cun อยู่บนขอบหน้าของเอ็นร้อยหวาย',
  anatomy_th  = 'ขอบหน้าเอ็นร้อยหวาย เหนือ KI-3 2 cun',
  location_en = 'On the caudomedial aspect of the pelvic limb, 2 cun proximal to KID-3, on the cranial border of the Achilles tendon',
  anatomy_en  = 'Cranial border of the Achilles tendon, 2 cun above KID-3',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.192'
where code = 'KI-7';

update points set
  location_th = 'ด้านหลัง-ในของขาหลัง เหนือ KI-3 ขึ้นมา 2 cun และอยู่หน้าต่อ KI-7 ไป 0.5 cun ชิดท้ายต่อขอบในของกระดูก tibia',
  anatomy_th  = 'หน้าต่อ KI-7 0.5 cun ท้ายต่อขอบในของ tibia',
  location_en = 'On the caudomedial aspect of the pelvic limb, 0.5 cun cranial to KID-7 and 2 cun proximal to KID-3, caudal to the medial border of the tibia',
  anatomy_en  = '0.5 cun cranial to KID-7, caudal to the medial border of the tibia',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.192'
where code = 'KI-8';

update points set
  location_th = 'ด้านในของแอ่งหลังหัวเข่า ที่ระดับเดียวกับ BL-40 ระหว่างกล้ามเนื้อ semimembranosus กับ semitendinosus',
  anatomy_th  = 'ระหว่าง semimembranosus กับ semitendinosus ระดับ BL-40',
  location_en = 'On the medial side of the popliteal fossa at the level of BL-40, between the semimembranosus and semitendinosus muscles',
  anatomy_en  = 'Medial popliteal fossa, between semimembranosus and semitendinosus',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.193'
where code = 'KI-10';

update points set
  location_th = 'ด้านในของขาหลัง ถัดจากข้อ metatarsophalangeal ลงไปทางปลาย อยู่บนผิวด้านนอกของนิ้วที่ 2 ในพังผืดระหว่างนิ้ว',
  anatomy_th  = 'ผิวด้านนอกของนิ้วที่ 2 ในพังผืด',
  location_en = 'On the medial side of the pelvic limb, distal to the metatarsophalangeal joint, on the lateral surface of the second digit in the webbing',
  anatomy_en  = 'Lateral surface of the second digit, in the web',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.190'
where code = 'LIV-2';

update points set
  location_th = 'ด้านในของขาหลัง ที่ด้านหน้า-ในของข้อเท้า ต่ำกว่าระดับ ST-41 เล็กน้อย อยู่หน้าและต่ำกว่า KI-6',
  anatomy_th  = 'หน้า-ในของข้อเท้า ใต้ระดับ ST-41',
  location_en = 'On the medial side of the pelvic limb, on the craniomedial aspect of the hock just distal to the level of ST-41, cranial and distal to KID-6',
  anatomy_en  = 'Craniomedial hock, just below the level of ST-41',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.190'
where code = 'LIV-4';

update points set
  location_th = 'ด้านในของหัวเข่า ในแอ่งที่อยู่ท้ายต่อ SP-9 ไป 1 cun',
  anatomy_th  = 'แอ่งท้ายต่อ SP-9 1 cun',
  location_en = 'On the medial aspect of the pelvic limb at the stifle, in a depression 1 cun caudal to SP-9',
  anatomy_en  = 'Depression 1 cun caudal to SP-9',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-7';

update points set
  location_th = 'ด้านในของหัวเข่า เหนือปลายด้านในของรอยพับหลังเข่า ในแอ่งระหว่างปุ่ม medial condyle ของกระดูกต้นขากับจุดเกาะของกล้ามเนื้อ semimembranosus',
  anatomy_th  = 'แอ่งระหว่าง medial femoral condyle กับจุดเกาะ semimembranosus',
  location_en = 'On the medial stifle, proximal to the medial end of the popliteal crease, in a depression between the medial femoral condyle and the insertion of the semimembranosus muscle',
  anatomy_en  = 'Between the medial femoral condyle and the semimembranosus insertion',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-8';

update points set
  location_th = 'ด้านในของขาหลังเหนือหัวเข่า เหนือ LIV-8 และปุ่ม medial epicondyle ของกระดูกต้นขาขึ้นมา 4 cun อยู่ระหว่างกล้ามเนื้อ vastus medialis กับ sartorius',
  anatomy_th  = 'ระหว่าง vastus medialis กับ sartorius เหนือ LIV-8 4 cun',
  location_en = 'On the medial side of the pelvic limb proximal to the stifle, 4 cun proximal to LIV-8 and the medial epicondyle of the femur, between the vastus medialis and sartorius muscles',
  anatomy_en  = '4 cun above LIV-8, between vastus medialis and sartorius',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-9';

update points set
  location_th = 'ด้านในของขาหลัง บริเวณขาหนีบ บนขอบของกล้ามเนื้อ adductor longus ต่ำจาก ST-30 ลงมา 3 cun',
  anatomy_th  = 'ขอบกล้ามเนื้อ adductor longus ใต้ ST-30 3 cun',
  location_en = 'On the medial side of the pelvic limb in the inguinal region, on the border of the adductor longus muscle, 3 cun distal to ST-30',
  anatomy_en  = 'Border of the adductor longus, 3 cun below ST-30',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-10';

update points set
  location_th = 'ด้านในของขาหลัง บริเวณขาหนีบ บนขอบของกล้ามเนื้อ adductor longus ต่ำจาก ST-30 ลงมา 2 cun',
  anatomy_th  = 'ขอบกล้ามเนื้อ adductor longus ใต้ ST-30 2 cun',
  location_en = 'On the medial side of the pelvic limb in the inguinal region, on the border of the adductor longus muscle, 2 cun distal to ST-30',
  anatomy_en  = 'Border of the adductor longus, 2 cun below ST-30',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-11';

update points set
  location_th = 'บริเวณขาหนีบ ที่ระดับกระดูกหัวหน่าว ห่างจากแนวกลางท้องออกข้าง 2.5 cun',
  anatomy_th  = 'ระดับหัวหน่าว ห่างแนวกลาง 2.5 cun',
  location_en = 'In the inguinal region at the level of the pubis, 2.5 cun from the ventral midline',
  anatomy_en  = 'Inguinal region at the level of the pubis, 2.5 cun off the midline',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.191'
where code = 'LIV-12';

update points set
  location_th = 'ผนังอกด้านข้าง ที่ปลายอิสระของซี่โครงซี่ที่ 12',
  anatomy_th  = 'ปลายอิสระของซี่โครงซี่ที่ 12',
  location_en = 'On the lateral thorax, at the distal end of the 12th rib',
  anatomy_en  = 'Distal end of the 12th rib',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.192'
where code = 'LIV-13';

-- ---------- จุดที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------

update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code in ('LU-4', 'LU-5', 'LU-7', 'HT-1', 'HT-3', 'HT-8', 'HT-9', 'PC-2', 'PC-7', 'SI-1', 'SI-2', 'SI-3', 'SI-18', 'TH-1', 'TH-3', 'TH-4', 'TH-11', 'TH-14', 'TH-15', 'TH-16', 'TH-20', 'SP-1', 'SP-2', 'SP-3', 'SP-6', 'SP-8', 'SP-9', 'KI-1', 'KI-3', 'KI-4', 'KI-5', 'KI-6', 'KI-9', 'KI-11', 'KI-12', 'KI-13', 'KI-14', 'KI-15', 'KI-16', 'KI-17', 'KI-18', 'KI-19', 'KI-20', 'KI-21', 'KI-22', 'KI-23', 'KI-24', 'KI-25', 'KI-26', 'KI-27', 'LIV-1', 'LIV-5', 'LIV-6', 'LIV-14');


select meridian_code,
       count(*) filter (where verified_source is not null) as ตรวจแล้ว,
       count(*) as ทั้งเส้น
from points where meridian_code in ('LU','HT','PC','SI','TH','SP','KI','LIV')
group by meridian_code order by meridian_code;

-- =============================================================
-- JFK — แก้เส้นกระเพาะปัสสาวะ (BL) ตามที่เทียบกับ Xie's Veterinary Acupuncture
-- ไฟล์นี้รวมทุกอย่างไว้แล้ว ไม่ต้องรันไฟล์ BL อันก่อนหน้า (ยกเลิกไปแล้ว)
--
-- แก้ 3 เรื่อง
--   1) back-shu แถวใน BL-11..BL-27 และแถวนอก BL-41..BL-52
--      เปลี่ยนจากอ้างอิง "ช่องซี่โครง" มาเป็น "ขอบท้ายของปุ่มกระดูกสันหลัง" ตามตำรา
--      เพราะสุนัขมีกระดูกสันหลังอก 13 ข้อ (คนมี 12) และปุ่มกระดูกเอียงไปทางท้าย
--      การไล่นับซี่โครงจึงไม่ตรงกับระดับปุ่มกระดูกเสมอไป
--   2) BL-28..BL-35 คำอธิบายเดิมอ้างอิงกายวิภาคคน (รูกระเบนเหน็บ 4 คู่)
--      สุนัขมีกระเบนเหน็บเชื่อมกัน 3 ข้อ จึงไม่มีรูคู่ที่ 4
--      และ BL-31..BL-34 ไม่ได้อยู่ที่รูกระเบนเหน็บ แต่อยู่กึ่งกลางระหว่าง
--      เส้น BL แถวใน กับแนวกลางหลัง — BL-31 อยู่ที่ L7 ไม่ได้อยู่บน sacrum
--   3) BL-11 เพิ่มวิธีปักที่ตำราระบุไว้ (แทงระหว่างปุ่มกระดูกกับขอบในสะบัก)
--
-- ข้อความเขียนใหม่ด้วยถ้อยคำของเราเอง ไม่ได้คัดลอกจากตำรา
-- =============================================================

-- ---------- 1) BL-11 มีวิธีปักเฉพาะ ตำราเขียนแยกจากจุด back-shu อื่น ----------
update points set
  location_th = 'ที่ขอบหน้าของกระดูกสะบัก ห่างจากปุ่มกระดูกสันหลังอกข้อที่ 1 (T1) ออกข้าง 1.5 cun โดย T1 คือปุ่มกระดูกแรกที่คลำได้เมื่อไล่จากคอลงมาทางท้าย',
  anatomy_th  = 'ขอบหน้าสะบัก ระดับปุ่มกระดูก T1',
  needle_th   = 'แทงที่กึ่งกลางระหว่างปุ่มกระดูกกับขอบในของสะบัก เอียงปลายเข็มออกด้านนอกเล็กน้อย ตั้งฉากถึงเฉียง ลึก 0.5-1 cun',
  location_en = 'At the cranial edge of the scapula, 1.5 cun lateral to the dorsal spinous process of T1 — T1 being the first dorsal spinous process you can palpate working from cranial to caudal',
  anatomy_en  = 'Cranial edge of the scapula at the level of T1',
  needle_en   = 'Insert midway between the spinous process and the medial border of the scapula, angling the needle slightly lateral; perpendicular to oblique, 0.5-1 cun',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.163'
where code = 'BL-11';

-- ---------- BL-24 ตำราระบุ L4 และเปิดช่องว่าบางตำราใช้ L3 ----------
update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 4 (L4) บางตำราระบุ L3',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L4 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L4 (some texts give L3)',
  anatomy_en  = 'Caudal border of the L4 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) p.165'
where code = 'BL-24';

-- ---------- back-shu ที่เหลือ แถวใน 1.5 cun และแถวนอก 3 cun ----------
update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 2 (T2)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T2 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T2',
  anatomy_en  = 'Caudal border of the T2 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-12';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 3 (T3)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T3 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T3',
  anatomy_en  = 'Caudal border of the T3 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-13';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 4 (T4)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T4 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T4',
  anatomy_en  = 'Caudal border of the T4 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-14';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 5 (T5)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T5 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T5',
  anatomy_en  = 'Caudal border of the T5 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-15';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 6 (T6)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T6 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T6',
  anatomy_en  = 'Caudal border of the T6 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-16';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 7 (T7)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T7 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T7',
  anatomy_en  = 'Caudal border of the T7 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-17';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 10 (T10)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T10 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T10',
  anatomy_en  = 'Caudal border of the T10 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-18';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 11 (T11)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T11 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T11',
  anatomy_en  = 'Caudal border of the T11 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-19';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 12 (T12)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T12 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T12',
  anatomy_en  = 'Caudal border of the T12 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-20';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 13 (T13)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก T13 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of T13',
  anatomy_en  = 'Caudal border of the T13 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-21';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 1 (L1)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L1 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L1',
  anatomy_en  = 'Caudal border of the L1 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-22';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 2 (L2)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L2 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L2',
  anatomy_en  = 'Caudal border of the L2 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-23';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 5 (L5)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L5 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L5',
  anatomy_en  = 'Caudal border of the L5 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-25';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 6 (L6)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L6 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L6',
  anatomy_en  = 'Caudal border of the L6 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-26';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 1.5 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 7 (L7)',
  anatomy_th  = 'ขอบท้ายปุ่มกระดูก L7 บนกล้ามเนื้อ epaxial',
  location_en = 'On the dorsolateral aspect of the spine, 1.5 cun lateral to the caudal border of the dorsal spinous process of L7',
  anatomy_en  = 'Caudal border of the L7 spinous process, over the epaxial muscles',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-27';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 2 (T2) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T2',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T2, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T2',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-41';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 3 (T3) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T3',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T3, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T3',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-42';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 4 (T4) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T4',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T4, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T4',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-43';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 5 (T5) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T5',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T5, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T5',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-44';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 6 (T6) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T6',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T6, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T6',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-45';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 7 (T7) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T7',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T7, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T7',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-46';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 10 (T10) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T10',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T10, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T10',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-47';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 11 (T11) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T11',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T11, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T11',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-48';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 12 (T12) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T12',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T12, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T12',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-49';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังอกข้อที่ 13 (T13) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ T13',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of T13, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of T13',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-50';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 1 (L1) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ L1',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of L1, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of L1',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-51';

update points set
  location_th = 'ห่างจากแนวกลางหลังออกข้าง 3 cun ที่ขอบท้ายของปุ่มกระดูกสันหลังเอวข้อที่ 2 (L2) เป็นแนวนอกของเส้นกระเพาะปัสสาวะ',
  anatomy_th  = 'แนวนอกของเส้น BL ที่ระดับ L2',
  location_en = 'On the dorsolateral aspect of the spine, 3 cun lateral to the caudal border of the dorsal spinous process of L2, on the outer bladder line',
  anatomy_en  = 'Outer bladder line at the level of L2',
  verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-52';

-- ---------- 2) จุดช่วงกระเบนเหน็บ ----------
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

-- ---------- จุด BL อื่นที่เทียบแล้วตรง บันทึกแหล่งอ้างอิงอย่างเดียว ----------
update points set verified = true, verified_source = 'Xie''s Veterinary Acupuncture (2007) ch.5'
where code = 'BL-10';

-- ---------- ตรวจผล ----------
select number, code, left(location_th, 58) as ตำแหน่ง
from points where meridian_code = 'BL' and verified_source is not null order by number;

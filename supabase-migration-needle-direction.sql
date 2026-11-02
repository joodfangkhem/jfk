-- =============================================================
-- JFK — ทิศทางการแทงเข็มบนแอตลาส 3 มิติ
-- รันหลัง supabase-migration-atlas.sql
-- รันซ้ำได้ ไม่กระทบพิกัดที่ปักไว้แล้ว (จุดที่ยังไม่มีทิศทางจะเป็น null = หมุดกลมเหมือนเดิม)
-- =============================================================

alter table point_coords
  add column if not exists dir_x double precision,
  add column if not exists dir_y double precision,
  add column if not exists dir_z double precision;

comment on column point_coords.dir_x is
  'ทิศทางที่เข็มแทงเข้าไป — unit vector ใน local space ของโมเดล ชี้จากผิวหนังเข้าหาตัวสัตว์. '
  'null ทั้งสามแกน = ยังไม่ระบุ แอตลาสจะแสดงเป็นหมุดกลมเหมือนเดิม. '
  'จุด bilateral เก็บไว้ข้างเดียวเหมือนพิกัด ตัวแสดงผลสะท้อน x เป็นลบให้อีกข้างเอง. '
  'ความยาวเข็มที่วาดเป็นค่าคงที่เชิงสัญลักษณ์ ไม่ได้สื่อความลึกเป็น cun — ความลึกอ่านจาก points.needle_th';

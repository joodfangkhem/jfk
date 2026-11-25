-- =============================================================
-- JFK — ป้ายชี้จุดบนรูป (จุด / วง / ลูกศร / เส้น)
-- รันหลัง supabase-migration-gallery.sql
-- เก็บเป็นข้อมูลแยกจากไฟล์รูป จึงแก้ ลบ หรือซ่อนได้โดยรูปต้นฉบับไม่เปลี่ยน
-- สิทธิ์เขียนใช้ policy point_images_admin_write เดิม (แอดมินเท่านั้น)
-- =============================================================

alter table point_images add column if not exists annotations jsonb;

-- กันข้อมูลผิดรูปแบบหรือใหญ่เกิน (ตัวแอปจำกัดไว้ 20 ชิ้นต่อรูปอยู่แล้ว)
alter table point_images drop constraint if exists point_images_annotations_check;
alter table point_images add constraint point_images_annotations_check
  check (
    annotations is null
    or (jsonb_typeof(annotations) = 'object' and octet_length(annotations::text) <= 16384)
  );

-- ให้ REST API เห็นคอลัมน์ใหม่ทันที
notify pgrst, 'reload schema';

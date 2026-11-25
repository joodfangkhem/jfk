-- =============================================================
-- JFK — รูปย่อสำหรับรายการในหน้าค้นหา
-- รันหลัง supabase-migration-annotations.sql
-- ไฟล์ย่อ 160px สร้างจากเบราว์เซอร์แอดมิน เก็บที่ point-images/thumbs/
-- หน้าค้นหาใช้รูปย่อของ "รูปหลัก" (is_primary) เสมอ จึงไม่ต้อง sync ไปตาราง points
-- =============================================================

alter table point_images add column if not exists thumb_url text;

alter table point_images drop constraint if exists point_images_thumb_url_check;
alter table point_images add constraint point_images_thumb_url_check
  check (
    thumb_url is null
    or thumb_url like 'https://urkjxixuxxubdqymugqo.supabase.co/storage/v1/object/public/point-images/thumbs/%'
  );

notify pgrst, 'reload schema';

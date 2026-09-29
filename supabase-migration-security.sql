-- =============================================================
-- JFK — ปิดช่องโหว่ที่เจอจากการตรวจความปลอดภัย (2026-09-29)
-- รันหลัง supabase-migration-gallery.sql
-- =============================================================

-- 1) อีเมลผู้ส่งรูปเคยอ่านได้จาก public (point_images อ่านได้ทุกคน)
--    ย้ายไปดูที่ point_image_submissions แทน ซึ่งเห็นเฉพาะเจ้าของกับแอดมิน
alter table point_images drop column if exists submitted_email;
-- หมายเหตุ: revoke ทีละคอลัมน์ไม่มีผลถ้ามี grant ระดับตารางอยู่แล้ว
-- คอลัมน์นี้ไม่เคยถูกเขียนค่าจากแอปเลย จึงลบทิ้งแทนการพยายามซ่อน
alter table point_images drop column if exists submitted_by;

-- 2) จำกัดชนิดและขนาดไฟล์ที่อัปโหลดเข้า bucket
--    กันคนอัปไฟล์ HTML/SVG ที่รันสคริปต์ได้ และกันไฟล์ใหญ่ถล่มโควตา
update storage.buckets
set file_size_limit   = 6 * 1024 * 1024,
    allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'point-images';

-- 3) บังคับตัวตนผู้ส่งจาก token จริง ไม่เชื่อค่าที่ส่งมาจากเบราว์เซอร์
--    (เดิมผู้ใช้ใส่ user_email เองได้ = ปลอมชื่อคนส่งให้แอดมินเห็นผิดได้)
create or replace function set_submission_identity() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id    := auth.uid();
  new.user_email := auth.jwt() ->> 'email';
  new.status     := 'pending';
  new.reviewed_by := null;
  new.reviewed_at := null;
  new.reject_reason := null;

  -- รูปต้องอยู่ใน storage ของโปรเจกต์นี้เท่านั้น กันการชี้ไปเว็บนอก
  if new.image_url not like 'https://urkjxixuxxubdqymugqo.supabase.co/storage/v1/object/public/point-images/%' then
    raise exception 'รูปต้องอัปโหลดผ่านระบบเท่านั้น';
  end if;

  -- กันสแปม: ค้างรออนุมัติได้ไม่เกิน 10 รูปต่อคน
  if (select count(*) from point_image_submissions
      where user_id = new.user_id and status = 'pending') >= 10 then
    raise exception 'คุณมีรูปรออนุมัติครบ 10 รูปแล้ว รอแอดมินตรวจก่อนนะครับ';
  end if;

  return new;
end $$;

drop trigger if exists submissions_identity on point_image_submissions;
create trigger submissions_identity before insert on point_image_submissions
  for each row execute function set_submission_identity();

-- =============================================================
-- JFK — ให้ผู้ใช้ส่งรูปจุดเข้ามา แล้วแอดมินอนุมัติก่อนขึ้นเว็บ
-- รันไฟล์นี้ใน Supabase SQL Editor หลัง supabase-schema.sql
-- =============================================================

create table if not exists point_image_submissions (
  id            uuid primary key default gen_random_uuid(),
  point_id      uuid not null references points(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  user_email    text,                      -- เก็บไว้ให้แอดมินเห็นว่าใครส่ง
  image_url     text not null,             -- public URL ใน bucket point-images
  storage_path  text,                      -- path ใน bucket (ไว้ลบตอนปฏิเสธ)
  caption       text,                      -- คำบรรยายรูป
  credit        text,                      -- ชื่อที่จะให้เครดิตบนเว็บ
  note          text,                      -- ข้อความถึงแอดมิน
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  reject_reason text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists submissions_status_idx on point_image_submissions (status, created_at desc);
create index if not exists submissions_point_idx  on point_image_submissions (point_id);
create index if not exists submissions_user_idx   on point_image_submissions (user_id, created_at desc);

alter table point_image_submissions enable row level security;

-- เจ้าของเห็นของตัวเอง / แอดมินเห็นทั้งหมด
drop policy if exists submissions_read on point_image_submissions;
create policy submissions_read on point_image_submissions for select
  using (auth.uid() = user_id or is_admin());

-- ผู้ใช้ที่ล็อกอินส่งรูปได้ และส่งได้เฉพาะสถานะ pending ของตัวเอง
drop policy if exists submissions_insert on point_image_submissions;
create policy submissions_insert on point_image_submissions for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- แอดมินเท่านั้นที่เปลี่ยนสถานะได้
drop policy if exists submissions_admin_update on point_image_submissions;
create policy submissions_admin_update on point_image_submissions for all
  using (is_admin()) with check (is_admin());

-- เจ้าของถอนรูปของตัวเองได้ถ้ายังไม่ถูกพิจารณา
drop policy if exists submissions_owner_delete on point_image_submissions;
create policy submissions_owner_delete on point_image_submissions for delete
  using (auth.uid() = user_id and status = 'pending');

-- ---------- Storage: ให้ผู้ใช้อัปโหลดได้เฉพาะในโฟลเดอร์ของตัวเอง ----------
-- path ต้องเป็น submissions/<user_id>/<ไฟล์> เท่านั้น กันไม่ให้ทับไฟล์คนอื่น
drop policy if exists point_images_user_submit on storage.objects;
create policy point_images_user_submit on storage.objects for insert to authenticated
  with check (
    bucket_id = 'point-images'
    and (storage.foldername(name))[1] = 'submissions'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- เจ้าของลบไฟล์ของตัวเองได้ (ตอนถอนรูปที่ยังรออนุมัติ)
drop policy if exists point_images_user_delete on storage.objects;
create policy point_images_user_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'point-images'
    and (storage.foldername(name))[1] = 'submissions'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- จำนวนรูปที่รออนุมัติ (ใช้โชว์ตัวเลขบนเมนูแอดมิน)
create or replace function pending_submission_count() returns int
language sql stable security definer set search_path = public as $$
  select case when is_admin()
    then (select count(*)::int from point_image_submissions where status = 'pending')
    else 0 end;
$$;

-- =============================================================
-- JFK — รายชื่อสมาชิก + สิทธิ์ "ผู้ช่วยตรวจข้อมูล" + กล่อง feedback
-- รันไฟล์นี้ใน Supabase SQL Editor หลัง supabase-migration-atlas.sql
--
-- สิ่งที่เพิ่ม
--   1) profiles      — เงาของ auth.users ที่แอปอ่านได้ (auth.users ไม่เปิดให้ REST อ่าน)
--   2) contributors  — สิทธิ์ที่แอดมินกดให้เป็นคน ๆ ได้จากหน้า /admin/members
--   3) feedback      — ผู้ช่วยส่งที่ผิด/คำผิด/ขอรูป เข้ามาให้แอดมินตรวจ
-- รันซ้ำได้ ทุก statement เป็น idempotent
-- =============================================================

-- ---------- 1) โปรไฟล์สมาชิก ----------
-- เก็บเฉพาะข้อมูลที่ Google ส่งมาตอนล็อกอิน ไม่มีอะไรเกินกว่าที่ auth.users มีอยู่แล้ว
create table if not exists profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),   -- วันที่สมัคร (คัดลอกจาก auth.users)
  last_seen_at timestamptz                           -- ล็อกอินครั้งล่าสุด
);

create index if not exists profiles_created_idx on profiles (created_at desc);

alter table profiles enable row level security;

-- เจ้าของเห็นแถวตัวเอง แอดมินเห็นทุกแถว — anon ไม่เห็นอะไรเลย (มีอีเมลอยู่ในตารางนี้)
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select
  using (auth.uid() = user_id or is_admin());

-- ไม่มี policy insert/update/delete โดยเจตนา: แถวถูกเติมด้วย trigger ฝั่ง auth.users เท่านั้น
-- ผู้ใช้จึงแก้ชื่อ/อีเมลในตารางนี้เองไม่ได้ ค่าที่แอดมินเห็นมาจาก Google จริงเสมอ

create or replace function sync_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (user_id, email, full_name, avatar_url, created_at, last_seen_at)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    coalesce(new.created_at, now()),
    new.last_sign_in_at
  )
  on conflict (user_id) do update set
    email        = excluded.email,
    full_name    = coalesce(excluded.full_name, profiles.full_name),
    avatar_url   = coalesce(excluded.avatar_url, profiles.avatar_url),
    last_seen_at = greatest(
                     coalesce(excluded.last_seen_at, profiles.last_seen_at),
                     coalesce(profiles.last_seen_at, excluded.last_seen_at)
                   );
  return new;
end $$;

drop trigger if exists users_sync_profile on auth.users;
create trigger users_sync_profile after insert or update on auth.users
  for each row execute function sync_profile();

-- เติมคนที่สมัครไปแล้วก่อนจะมีตารางนี้
insert into profiles (user_id, email, full_name, avatar_url, created_at, last_seen_at)
select
  u.id,
  u.email,
  nullif(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'), ''),
  nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
  coalesce(u.created_at, now()),
  u.last_sign_in_at
from auth.users u
on conflict (user_id) do update set
  email        = excluded.email,
  full_name    = coalesce(excluded.full_name, profiles.full_name),
  avatar_url   = coalesce(excluded.avatar_url, profiles.avatar_url),
  last_seen_at = excluded.last_seen_at;

-- ---------- 2) สิทธิ์ผู้ช่วยตรวจข้อมูล ----------
create table if not exists contributors (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id) on delete set null,
  note       text,
  created_at timestamptz not null default now()
);

alter table contributors enable row level security;

-- เจ้าของต้องอ่านแถวตัวเองได้ ไม่งั้นหน้าเว็บไม่รู้ว่าจะขึ้นปุ่มส่ง feedback ให้ไหม
drop policy if exists contributors_read on contributors;
create policy contributors_read on contributors for select
  using (auth.uid() = user_id or is_admin());

drop policy if exists contributors_admin_write on contributors;
create policy contributors_admin_write on contributors for all
  using (is_admin()) with check (is_admin());

-- granted_by มาจาก token เสมอ ไม่เชื่อค่าที่ส่งมาจากเบราว์เซอร์
create or replace function set_contributor_identity() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.granted_by := auth.uid();
  return new;
end $$;

drop trigger if exists contributors_identity on contributors;
create trigger contributors_identity before insert on contributors
  for each row execute function set_contributor_identity();

-- แอดมินนับเป็นผู้ช่วยในตัว (ทำได้ทุกอย่างที่ผู้ช่วยทำได้)
create or replace function is_contributor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from contributors c where c.user_id = auth.uid())
      or exists (select 1 from admins a where a.user_id = auth.uid());
$$;

-- เดิม admins อ่านได้แต่แถวตัวเอง หน้า /admin/members จึงมองไม่เห็นว่าใครเป็นแอดมิน
drop policy if exists admins_admin_read on admins;
create policy admins_admin_read on admins for select using (is_admin());

-- ---------- 3) กล่อง feedback ----------
create table if not exists feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  user_email  text,
  kind        text not null default 'error'
              check (kind in ('error','typo','image','missing','other')),
  point_id    uuid references points(id) on delete set null,  -- ถ้าเป็นเรื่องของจุดใดจุดหนึ่ง
  target      text,            -- path ของหน้าอื่น เช่น /conditions/back-pain
  target_label text,           -- ชื่อหน้าที่อ่านออก ไว้โชว์ในหน้าแอดมิน
  field       text,            -- ช่องที่ผิด: location / anatomy / functions / needle / caution / name / other
  message     text not null,
  suggestion  text,            -- ข้อความที่ควรจะเป็น
  status      text not null default 'open'
              check (status in ('open','doing','done','rejected')),
  admin_note  text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists feedback_status_idx on feedback (status, created_at desc);
create index if not exists feedback_user_idx   on feedback (user_id, created_at desc);
create index if not exists feedback_point_idx  on feedback (point_id);

alter table feedback enable row level security;

-- เจ้าของเห็นของตัวเอง (ไว้ดูสถานะที่หน้า /feedback) แอดมินเห็นทั้งหมด
drop policy if exists feedback_read on feedback;
create policy feedback_read on feedback for select
  using (auth.uid() = user_id or is_admin());

-- ส่งได้เฉพาะผู้ช่วย/แอดมิน — ด่านจริงอยู่ใน trigger ด้วย กันกรณี policy ถูกแก้ทีหลัง
drop policy if exists feedback_insert on feedback;
create policy feedback_insert on feedback for insert to authenticated
  with check (auth.uid() = user_id and status = 'open' and is_contributor());

drop policy if exists feedback_admin_write on feedback;
create policy feedback_admin_write on feedback for all
  using (is_admin()) with check (is_admin());

-- เจ้าของถอนเรื่องของตัวเองได้ถ้าแอดมินยังไม่แตะ
drop policy if exists feedback_owner_delete on feedback;
create policy feedback_owner_delete on feedback for delete
  using (auth.uid() = user_id and status = 'open');

create or replace function set_feedback_identity() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not is_contributor() then
    raise exception 'สิทธิ์ส่งข้อเสนอแก้ไขเปิดให้เฉพาะผู้ช่วยตรวจข้อมูล';
  end if;

  new.user_id     := auth.uid();
  new.user_email  := auth.jwt() ->> 'email';
  new.status      := 'open';
  new.admin_note  := null;
  new.reviewed_by := null;
  new.reviewed_at := null;

  if length(coalesce(new.message, '')) < 5 then
    raise exception 'เขียนรายละเอียดอย่างน้อย 5 ตัวอักษร';
  end if;

  -- กันสแปม: ค้างรอแอดมินได้ไม่เกิน 30 เรื่องต่อคน
  if (select count(*) from feedback where user_id = new.user_id and status = 'open') >= 30 then
    raise exception 'คุณมีเรื่องที่รอแอดมินอยู่ 30 เรื่องแล้ว รอตรวจก่อนนะครับ';
  end if;

  return new;
end $$;

drop trigger if exists feedback_identity on feedback;
create trigger feedback_identity before insert on feedback
  for each row execute function set_feedback_identity();

-- จำนวนเรื่องที่ยังไม่ได้จัดการ (โชว์เป็นตัวเลขบนเมนูแอดมิน)
create or replace function open_feedback_count() returns int
language sql stable security definer set search_path = public as $$
  select case when is_admin()
    then (select count(*)::int from feedback where status = 'open')
    else 0 end;
$$;

-- ---------- รายชื่อสมาชิกสำหรับหน้า /admin/members ----------
-- รวมโปรไฟล์ + สิทธิ์ + ยอดที่ส่งเข้ามา ในคำขอเดียว คืนค่าว่างถ้าคนเรียกไม่ใช่แอดมิน
create or replace function list_members(q text default null, lim int default 200)
returns table (
  user_id        uuid,
  email          text,
  full_name      text,
  avatar_url     text,
  created_at     timestamptz,
  last_seen_at   timestamptz,
  admin          boolean,
  contributor    boolean,
  feedback_count int,
  photo_count    int
)
language sql stable security definer set search_path = public as $$
  select
    p.user_id, p.email, p.full_name, p.avatar_url, p.created_at, p.last_seen_at,
    exists (select 1 from admins a where a.user_id = p.user_id),
    exists (select 1 from contributors c where c.user_id = p.user_id),
    (select count(*)::int from feedback f where f.user_id = p.user_id),
    (select count(*)::int from point_image_submissions s where s.user_id = p.user_id)
  from profiles p
  where is_admin()
    and (
      q is null or q = ''
      or p.email ilike '%' || q || '%'
      or coalesce(p.full_name, '') ilike '%' || q || '%'
    )
  order by p.created_at desc
  limit greatest(1, least(coalesce(lim, 200), 500));
$$;

-- ตรวจผลหลังรัน:
--   select count(*) from profiles;                 -- ควรเท่าจำนวนผู้ใช้ใน Authentication
--   select * from list_members();                  -- ต้องรันในฐานะแอดมิน ไม่ใช่ SQL Editor (service role)

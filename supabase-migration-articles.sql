-- =============================================================
-- JFK — บทความ + เคสศึกษา
-- ตารางหลักตัวเดียวแยกด้วย type, ข้อมูลเคสแตกออกเป็นตารางลูก
-- ชื่อเจ้าของเต็มอยู่ในตารางที่ anon อ่านไม่ได้เลย เว็บเห็นแค่ชื่อที่บังแล้ว
-- รันหลัง supabase-migration-i18n.sql · รันซ้ำได้
-- =============================================================

-- ------------------------------------------------------------------
-- 1) ผู้เขียน
-- ------------------------------------------------------------------
create table if not exists authors (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  name_th     text not null,
  name_en     text,
  credential  text,          -- เช่น "สัตวแพทยศาสตรบัณฑิต"
  license_no  text,          -- เลขใบประกอบวิชาชีพการสัตวแพทย์
  school      text,          -- มหาวิทยาลัยที่จบ
  class_year  text,          -- รุ่น
  bio_th      text,
  bio_en      text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table authors enable row level security;

drop policy if exists authors_read on authors;
create policy authors_read on authors for select using (true);

drop policy if exists authors_admin_write on authors;
create policy authors_admin_write on authors for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------
-- 2) บทความ (type = 'article') และเคสศึกษา (type = 'case')
--    ใช้ text + check ไม่ใช้ enum เพราะ alter type add value
--    รันใน transaction ไม่ได้ และ SQL Editor ห่อทั้งสคริปต์เป็น transaction เดียว
-- ------------------------------------------------------------------
create table if not exists articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  type          text not null default 'article' check (type in ('article', 'case')),
  status        text not null default 'draft'   check (status in ('draft', 'published')),
  author_id     uuid references authors(id) on delete set null,

  title_th      text not null,
  excerpt_th    text,
  body_th       text not null default '',

  title_en      text,
  excerpt_en    text,
  body_en       text,

  cover_url     text,
  cover_alt     text,

  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_live_idx
  on articles (status, published_at desc nulls last);
create index if not exists articles_type_idx on articles (type, published_at desc nulls last);

alter table articles enable row level security;

-- คนทั่วไปเห็นเฉพาะที่เผยแพร่แล้ว ฉบับร่างเห็นได้เฉพาะแอดมิน
drop policy if exists articles_read on articles;
create policy articles_read on articles for select
  using (status = 'published' or is_admin());

drop policy if exists articles_admin_write on articles;
create policy articles_admin_write on articles for all
  using (is_admin()) with check (is_admin());

-- ประทับเวลาเผยแพร่ครั้งแรกให้อัตโนมัติ
create or replace function articles_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists articles_touch_trg on articles;
create trigger articles_touch_trg before insert or update on articles
  for each row execute function articles_touch();

-- ------------------------------------------------------------------
-- 3) ข้อมูลเคส — ส่วนที่เปิดเผยได้
--    owner_display เขียนโดย trigger เท่านั้น ห้ามกรอกเอง
-- ------------------------------------------------------------------
create table if not exists article_cases (
  article_id    uuid primary key references articles(id) on delete cascade,
  pet_name      text,
  species       text,
  breed         text,
  sex           text,
  age_text      text,
  owner_display text,
  disclosure    text not null default 'masked'
                check (disclosure in ('full', 'masked', 'anonymous')),
  complaint     text,
  diagnosis     text,
  sessions      text,
  outcome       text
);

alter table article_cases enable row level security;

drop policy if exists article_cases_read on article_cases;
create policy article_cases_read on article_cases for select
  using (exists (
    select 1 from articles a
    where a.id = article_id and (a.status = 'published' or is_admin())
  ));

drop policy if exists article_cases_admin_write on article_cases;
create policy article_cases_admin_write on article_cases for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------
-- 4) ข้อมูลเคส — ส่วนที่เปิดเผยไม่ได้ แอดมินเท่านั้น
--    ไม่มี policy ให้ anon เลย แปลว่าชื่อเต็มไม่มีทางหลุดออกฝั่งเว็บ
-- ------------------------------------------------------------------
create table if not exists article_case_private (
  article_id      uuid primary key references articles(id) on delete cascade,
  owner_full_name text,
  consent_level   text check (consent_level in ('full', 'masked', 'anonymous')),
  consent_date    date,
  consent_note    text,
  created_at      timestamptz not null default now()
);

alter table article_case_private enable row level security;

drop policy if exists article_case_private_admin on article_case_private;
create policy article_case_private_admin on article_case_private for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------
-- 5) บังชื่อเจ้าของ
--    'สมชาย รักสัตว์' -> 'สมชาย ร.'   ชื่อคำเดียวปล่อยไว้อย่างนั้น
-- ------------------------------------------------------------------
create or replace function mask_owner_name(full_name text, level text)
returns text language plpgsql immutable as $$
declare
  parts text[];
begin
  if level = 'anonymous' or full_name is null or btrim(full_name) = '' then
    return null;
  end if;
  if level = 'full' then
    return btrim(full_name);
  end if;
  parts := regexp_split_to_array(btrim(full_name), '\s+');
  if array_length(parts, 1) < 2 then
    return parts[1];
  end if;
  return parts[1] || ' ' || left(parts[array_length(parts, 1)], 1) || '.';
end $$;

-- คำนวณ owner_display ใหม่ทุกครั้งที่ชื่อเต็มหรือระดับการเปิดเผยเปลี่ยน
create or replace function sync_case_owner_display(target uuid)
returns void language sql security definer set search_path = public as $$
  update article_cases c
  set owner_display = mask_owner_name(p.owner_full_name, c.disclosure)
  from article_case_private p
  where c.article_id = target and p.article_id = target;
$$;

create or replace function article_cases_mask() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.owner_display := mask_owner_name(
    (select owner_full_name from article_case_private where article_id = new.article_id),
    new.disclosure
  );
  return new;
end $$;

drop trigger if exists article_cases_mask_trg on article_cases;
create trigger article_cases_mask_trg before insert or update on article_cases
  for each row execute function article_cases_mask();

create or replace function article_case_private_resync() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform sync_case_owner_display(new.article_id);
  return new;
end $$;

drop trigger if exists article_case_private_resync_trg on article_case_private;
create trigger article_case_private_resync_trg after insert or update on article_case_private
  for each row execute function article_case_private_resync();

-- ------------------------------------------------------------------
-- 6) จุดที่บทความพูดถึง — แอปเขียนให้จาก [[CODE]] ในเนื้อหาตอนบันทึก
-- ------------------------------------------------------------------
create table if not exists article_points (
  article_id uuid not null references articles(id) on delete cascade,
  point_id   uuid not null references points(id) on delete cascade,
  primary key (article_id, point_id)
);

create index if not exists article_points_point_idx on article_points (point_id);

alter table article_points enable row level security;

drop policy if exists article_points_read on article_points;
create policy article_points_read on article_points for select
  using (exists (
    select 1 from articles a
    where a.id = article_id and (a.status = 'published' or is_admin())
  ));

drop policy if exists article_points_admin_write on article_points;
create policy article_points_admin_write on article_points for all
  using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------
-- ตรวจผล
-- ------------------------------------------------------------------
select mask_owner_name('สมชาย รักสัตว์', 'masked')    as masked,
       mask_owner_name('สมชาย รักสัตว์', 'full')      as full,
       mask_owner_name('สมชาย รักสัตว์', 'anonymous') as anonymous;

-- ------------------------------------------------------------------
-- 7) ผู้เขียนคนแรก — แก้ค่าในวงเล็บให้เป็นของจริงก่อนรัน
--    ผูกกับบัญชีที่ล็อกอิน เพื่อให้บทความที่สร้างใหม่ใส่ชื่อผู้เขียนให้เอง
-- ------------------------------------------------------------------
insert into authors (user_id, name_th, credential, license_no, school, class_year)
select u.id,
       'สพ.ญ./น.สพ. ชื่อ นามสกุล',   -- ชื่อที่จะขึ้นท้ายบทความ
       'สัตวแพทยศาสตรบัณฑิต',
       'เลขใบประกอบวิชาชีพการสัตวแพทย์',
       'มหาวิทยาลัยที่จบ',
       'รุ่นที่'
from auth.users u
where u.email = 'joodfangkhem@gmail.com'
on conflict do nothing;

select name_th, license_no, school, class_year from authors;

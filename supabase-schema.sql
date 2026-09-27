-- =============================================================
-- JFK — จุดฝังเข็ม (Jood Fang Khem) : schema
-- รันไฟล์นี้ทั้งไฟล์ใน Supabase SQL Editor (ครั้งเดียว)
-- แล้วรัน supabase-seed.sql ต่อเพื่อใส่ข้อมูลจุด
-- =============================================================

create extension if not exists "pg_trgm";

-- ---------- เนื้อหา (อ่านได้แบบ public เพื่อ SEO/AdSense) ----------

-- เส้นลมปราณ
create table if not exists meridians (
  code         text primary key,              -- LU, LI, ST, ... GV, EX
  slug         text unique not null,
  name_th      text not null,
  name_en      text not null,
  name_pinyin  text,
  name_zh      text,
  element      text,                          -- metal/water/wood/fire/earth
  yin_yang     text,                          -- yin / yang / extraordinary
  limb         text,                          -- fore / hind / midline / head
  point_count  int,
  peak_time    text,                          -- ช่วงเวลาที่เส้นทำงานเด่น
  summary_th   text,
  sort_order   int default 0
);

-- จุดฝังเข็ม
create table if not exists points (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,         -- 'LI-4', 'BAI-HUI'
  slug          text unique not null,         -- 'li-4', 'bai-hui'
  meridian_code text not null references meridians(code) on delete restrict,
  number        int,                          -- ลำดับบนเส้น (null ได้สำหรับจุดพิเศษ)
  name_th       text,
  name_en       text,
  name_pinyin   text,
  name_zh       text,
  location_th   text not null,                -- ตำแหน่งในสัตว์
  anatomy_th    text,                         -- landmark / กล้ามเนื้อ / เส้นประสาท
  functions_th  text,                         -- สรรพคุณตามทฤษฎี TCVM
  indications   text[] not null default '{}', -- ข้อบ่งใช้ (ใช้ค้นหา/กรอง)
  point_types   text[] not null default '{}', -- Yuan-source, He-sea, Master point ฯลฯ
  needle_th     text,                         -- เทคนิค/ขนาดเข็ม/ความลึก
  caution_th    text,                         -- ข้อควรระวัง
  species       text[] not null default '{dog,cat}',
  is_common     boolean not null default false,
  popularity    int not null default 0,       -- ยิ่งสูงยิ่งใช้บ่อย (เรียงผลค้นหา)
  -- รูปภาพ: ถ่ายเองแล้วมาเติมทีหลัง
  image_url     text,
  image_alt     text,
  image_credit  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- คอลัมน์รวมข้อความสำหรับค้นหา (generated)
alter table points drop column if exists search_text;
alter table points add column search_text text
  generated always as (
    coalesce(code,'') || ' ' || replace(coalesce(code,''),'-','') || ' ' ||
    coalesce(name_th,'') || ' ' || coalesce(name_en,'') || ' ' ||
    coalesce(name_pinyin,'') || ' ' || coalesce(name_zh,'') || ' ' ||
    coalesce(location_th,'') || ' ' || coalesce(functions_th,'') || ' ' ||
    coalesce(array_to_string(indications,' '),'') || ' ' ||
    coalesce(array_to_string(point_types,' '),'')
  ) stored;

create index if not exists points_search_trgm on points using gin (search_text gin_trgm_ops);
create index if not exists points_meridian_idx on points (meridian_code, number);
create index if not exists points_popularity_idx on points (popularity desc);
create index if not exists points_indications_idx on points using gin (indications);
create index if not exists points_species_idx on points using gin (species);

-- อาการ / โรค
create table if not exists conditions (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_th     text not null,
  name_en     text,
  category    text,                            -- neuro / ortho / gi / uro / derm / behavior / resp / other
  summary_th  text,
  detail_th   text,
  species     text[] not null default '{dog,cat}',
  sort_order  int default 0,
  created_at  timestamptz not null default now()
);

create index if not exists conditions_category_idx on conditions (category, sort_order);

-- จุดที่ใช้กับอาการนั้น
create table if not exists condition_points (
  condition_id uuid not null references conditions(id) on delete cascade,
  point_id     uuid not null references points(id) on delete cascade,
  role         text not null default 'primary',  -- primary / secondary
  note_th      text,
  sort_order   int default 0,
  primary key (condition_id, point_id)
);

-- ---------- ข้อมูลผู้ใช้ (ต้องล็อกอิน, เห็นแค่ของตัวเอง) ----------

create table if not exists favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  point_id   uuid not null references points(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, point_id)
);

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  point_id   uuid not null references points(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, point_id)
);

create index if not exists notes_user_idx on notes (user_id, updated_at desc);

-- ชุดจุด (protocol) ที่ผู้ใช้ตั้งเอง
create table if not exists protocols (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  species    text,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists protocol_points (
  protocol_id uuid not null references protocols(id) on delete cascade,
  point_id    uuid not null references points(id) on delete cascade,
  sort_order  int default 0,
  note        text,
  primary key (protocol_id, point_id)
);

create index if not exists protocols_user_idx on protocols (user_id, updated_at desc);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists points_updated_at on points;
create trigger points_updated_at before update on points
  for each row execute function set_updated_at();

drop trigger if exists notes_updated_at on notes;
create trigger notes_updated_at before update on notes
  for each row execute function set_updated_at();

drop trigger if exists protocols_updated_at on protocols;
create trigger protocols_updated_at before update on protocols
  for each row execute function set_updated_at();

-- ---------- RLS ----------
alter table meridians       enable row level security;
alter table points          enable row level security;
alter table conditions      enable row level security;
alter table condition_points enable row level security;
alter table favorites       enable row level security;
alter table notes           enable row level security;
alter table protocols       enable row level security;
alter table protocol_points enable row level security;

-- เนื้อหา: ใครก็อ่านได้ (anon + authenticated) แต่แก้ไม่ได้
drop policy if exists meridians_read on meridians;
create policy meridians_read on meridians for select using (true);

drop policy if exists points_read on points;
create policy points_read on points for select using (true);

drop policy if exists conditions_read on conditions;
create policy conditions_read on conditions for select using (true);

drop policy if exists condition_points_read on condition_points;
create policy condition_points_read on condition_points for select using (true);

-- ข้อมูลผู้ใช้: เฉพาะเจ้าของ
drop policy if exists favorites_own on favorites;
create policy favorites_own on favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists notes_own on notes;
create policy notes_own on notes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists protocols_own on protocols;
create policy protocols_own on protocols for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists protocol_points_own on protocol_points;
create policy protocol_points_own on protocol_points for all
  using (exists (select 1 from protocols p where p.id = protocol_id and p.user_id = auth.uid()))
  with check (exists (select 1 from protocols p where p.id = protocol_id and p.user_id = auth.uid()));

-- ---------- ฟังก์ชันค้นหา (เรียกจากแอป) ----------
create or replace function search_points(q text, sp text default null, lim int default 40)
returns setof points
language sql stable security invoker as $$
  select *
  from points
  where (q is null or q = '' or search_text ilike '%' || q || '%')
    and (sp is null or sp = any(species))
  order by
    case when q is not null and q <> '' and lower(code) = lower(q) then 0
         when q is not null and q <> '' and lower(replace(code,'-','')) = lower(replace(q,'-','')) then 1
         when q is not null and q <> '' and code ilike q || '%' then 2
         else 3 end,
    popularity desc, meridian_code, number
  limit lim;
$$;

-- ---------- ผู้ดูแล (แก้เนื้อหา/ใส่รูปได้จากในแอป) ----------
create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

drop policy if exists admins_self_read on admins;
create policy admins_self_read on admins for select using (auth.uid() = user_id);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins a where a.user_id = auth.uid());
$$;

-- แอดมินแก้เนื้อหาได้ (คนอื่นอ่านได้เท่านั้น)
drop policy if exists points_admin_write on points;
create policy points_admin_write on points for all
  using (is_admin()) with check (is_admin());

drop policy if exists meridians_admin_write on meridians;
create policy meridians_admin_write on meridians for all
  using (is_admin()) with check (is_admin());

drop policy if exists conditions_admin_write on conditions;
create policy conditions_admin_write on conditions for all
  using (is_admin()) with check (is_admin());

drop policy if exists condition_points_admin_write on condition_points;
create policy condition_points_admin_write on condition_points for all
  using (is_admin()) with check (is_admin());

-- วิธีตั้งตัวเองเป็นแอดมิน (รันหลังล็อกอินเข้าแอปด้วย Google ครั้งแรก):
--   insert into admins (user_id, note)
--   select id, 'owner' from auth.users where email = 'อีเมลของคุณ@gmail.com'
--   on conflict (user_id) do nothing;

-- ---------- Storage bucket สำหรับรูปจุด (ถ่ายเองแล้วอัปโหลดทีหลัง) ----------
insert into storage.buckets (id, name, public)
values ('point-images', 'point-images', true)
on conflict (id) do update set public = true;

drop policy if exists point_images_public_read on storage.objects;
create policy point_images_public_read on storage.objects for select
  using (bucket_id = 'point-images');

drop policy if exists point_images_admin_write on storage.objects;
create policy point_images_admin_write on storage.objects for insert
  with check (bucket_id = 'point-images' and is_admin());

drop policy if exists point_images_admin_update on storage.objects;
create policy point_images_admin_update on storage.objects for update
  using (bucket_id = 'point-images' and is_admin());

drop policy if exists point_images_admin_delete on storage.objects;
create policy point_images_admin_delete on storage.objects for delete
  using (bucket_id = 'point-images' and is_admin());

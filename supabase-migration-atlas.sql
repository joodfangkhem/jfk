-- =============================================================
-- JFK — แอตลาส 3 มิติ: พิกัดจุดฝังเข็มบนโมเดลสุนัข/แมว
-- รันหลัง supabase-migration-gallery.sql
-- =============================================================

-- โมเดลหนึ่งตัวต่อหนึ่งสปีชีส์ — เก็บในตารางเพราะสเกลกับเครดิตต่างกันรายตัว
-- และวันหลังจะเพิ่มม้า/วัวได้โดยไม่ต้องแก้โค้ด
create table if not exists species_models (
  species       text primary key,              -- ตรงกับค่าใน points.species
  label_th      text not null,
  label_en      text,
  model_url     text not null,                 -- path ใต้ /public
  -- โมเดลคนละตัวปั้นมาคนละสเกล ตัวเลขนี้ใช้ตอนวางสองตัวเทียบกัน
  -- (หน้าดูทีละตัวจะ fit กล้องให้เองอยู่แล้ว ไม่ได้ใช้ค่านี้)
  display_scale double precision not null default 1,
  credit        text,                          -- ต้องแสดงตามสัญญาอนุญาต CC BY
  credit_url    text,
  license       text,
  license_url   text,
  is_active     boolean not null default true,
  sort_order    int not null default 0
);

alter table species_models enable row level security;

drop policy if exists species_models_read on species_models;
create policy species_models_read on species_models for select using (true);

drop policy if exists species_models_admin_write on species_models;
create policy species_models_admin_write on species_models for all
  using (is_admin()) with check (is_admin());

insert into species_models (species, label_th, label_en, model_url, display_scale, credit, credit_url, license, license_url, sort_order)
values
  ('dog', 'สุนัข', 'Dog', '/models/dog.glb', 1.0,
   'Canine Model by Lova Dahn', 'https://skfb.ly/pDzLV',
   'CC BY 4.0', 'http://creativecommons.org/licenses/by/4.0/', 1),
  ('cat', 'แมว', 'Cat', '/models/cat.glb', 0.42,
   'Cat Model by Lova Dahn', 'https://skfb.ly/pKw8M',
   'CC BY 4.0', 'http://creativecommons.org/licenses/by/4.0/', 2)
on conflict (species) do update set
  label_th = excluded.label_th,
  label_en = excluded.label_en,
  model_url = excluded.model_url,
  display_scale = excluded.display_scale,
  credit = excluded.credit,
  credit_url = excluded.credit_url,
  license = excluded.license,
  license_url = excluded.license_url,
  sort_order = excluded.sort_order;

-- พิกัดจุดบนโมเดล: หนึ่งแถวต่อหนึ่งจุดต่อหนึ่งสปีชีส์
-- เก็บเป็นพิกัดใน local space ของโมเดล ไม่ใช่พิกัดหน้าจอ สเกลเปลี่ยนก็ไม่ต้องปักใหม่
create table if not exists point_coords (
  point_id   uuid not null references points(id) on delete cascade,
  species    text not null references species_models(species) on delete cascade,
  x          double precision not null,
  y          double precision not null,
  z          double precision not null,
  -- จุดสองข้างเก็บแค่ข้างเดียว แล้วให้ตัวแสดงผลสะท้อน x เป็นลบให้อีกข้าง
  -- (โมเดลทั้งสองตัวสมมาตรรอบระนาบ x = 0) จุดกลางลำตัวอย่าง GV/CV ตั้ง false
  bilateral  boolean not null default true,
  note_th    text,                          -- เช่น "คลำร่องระหว่างซี่โครง 12-13 ก่อน"
  verified   boolean not null default false, -- หมอยืนยันตำแหน่งบนโมเดลแล้ว
  set_by     uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  primary key (point_id, species)
);

create index if not exists point_coords_species_idx on point_coords (species, verified);

alter table point_coords enable row level security;

drop policy if exists point_coords_read on point_coords;
create policy point_coords_read on point_coords for select using (true);

drop policy if exists point_coords_admin_write on point_coords;
create policy point_coords_admin_write on point_coords for all
  using (is_admin()) with check (is_admin());

create or replace function point_coords_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists point_coords_set_updated on point_coords;
create trigger point_coords_set_updated before update on point_coords
  for each row execute function point_coords_touch();

-- -------------------------------------------------------------
-- เพิ่มทีหลัง: ขนาดหมุดต่อจุด
-- จุดฝังเข็มไม่ได้กว้างเท่ากันทุกจุด บางจุดเป็นบริเวณกว้าง (ไป่ฮุ่ย) บางจุดแคบมาก
-- เก็บเป็นตัวคูณของขนาดมาตรฐาน ไม่ใช่ขนาดสัมบูรณ์ จะได้ไม่ผูกกับสเกลของโมเดล
-- -------------------------------------------------------------
alter table point_coords
  add column if not exists size_scale double precision not null default 1;

alter table point_coords drop constraint if exists point_coords_size_scale_range;
alter table point_coords
  add constraint point_coords_size_scale_range check (size_scale >= 0.3 and size_scale <= 3);

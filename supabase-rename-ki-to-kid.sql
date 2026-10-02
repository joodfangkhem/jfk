-- ======================================================================
-- เปลี่ยนรหัสเส้นไตจาก KI เป็น KID ตามที่ตำราใช้
--
-- Xie's Veterinary Acupuncture เขียน KID-1 ถึง KID-27 ส่วนเว็บเราใช้ KI-
-- ซึ่งเป็นรหัสตามมาตรฐาน WHO เมื่อทั้งเว็บตรวจทานกับตำราเล่มนี้แล้ว
-- จึงให้รหัสตรงกับตำราเพื่อไม่ให้สับสนเวลาเปิดเทียบ
--
-- รหัสเดิมเก็บไว้ในช่อง aliases เพื่อให้ค้นด้วย "KI-3" ยังเจอเหมือนเดิม
-- ไม่มีโค้ดส่วนไหนของเว็บ hardcode คำว่า KI ไว้ ทุกอย่างมาจากฐานข้อมูล
-- ======================================================================

-- ---------- 1) ช่องเก็บรหัสเดิม และให้ระบบค้นหามองเห็นด้วย ----------
alter table points add column if not exists aliases text[] not null default '{}';

comment on column points.aliases is
  'รหัสเดิมหรือรหัสที่ตำราอื่นใช้เรียกจุดนี้ ใช้ให้ค้นหาเจอ ไม่ได้แสดงบนหน้าเว็บ';

create or replace function points_fill_search_text() returns trigger
language plpgsql as $$
begin
  new.search_text :=
    coalesce(new.code,'') || ' ' || replace(coalesce(new.code,''),'-','') || ' ' ||
    coalesce(array_to_string(new.aliases,' '),'') || ' ' ||
    replace(coalesce(array_to_string(new.aliases,' '),''),'-','') || ' ' ||
    coalesce(new.name_th,'') || ' ' || coalesce(new.name_en,'') || ' ' ||
    coalesce(new.name_pinyin,'') || ' ' || coalesce(new.name_zh,'') || ' ' ||
    coalesce(new.location_th,'') || ' ' || coalesce(new.functions_th,'') || ' ' ||
    coalesce(array_to_string(new.indications,' '),'') || ' ' ||
    coalesce(array_to_string(new.point_types,' '),'');
  return new;
end $$;

-- ---------- 2) ย้ายแถวของเส้นลมปราณ ----------
-- foreign key ไม่ได้ตั้ง on update cascade จึงต้องสร้างแถวใหม่ ย้ายจุด แล้วค่อยลบแถวเก่า
-- slug ต้องไม่ซ้ำ จึงพักไว้ที่ชื่อชั่วคราวก่อน
insert into meridians (code, slug, name_th, name_en, name_pinyin, name_zh,
                       element, yin_yang, limb, point_count, peak_time, summary_th, sort_order)
select 'KID', 'kidney-tmp', name_th, name_en, name_pinyin, name_zh,
       element, yin_yang, limb, point_count, peak_time, summary_th, sort_order
from meridians where code = 'KI'
on conflict (code) do nothing;

update points set meridian_code = 'KID' where meridian_code = 'KI';

delete from meridians where code = 'KI';

update meridians set slug = 'kidney' where code = 'KID';

-- ---------- 3) เปลี่ยนรหัสและ slug ของจุด เก็บรหัสเดิมไว้ใน aliases ----------
update points set
  aliases = (select array_agg(distinct x) from unnest(aliases || code) as x),
  code    = 'KID-' || split_part(code, '-', 2),
  slug    = 'kid-' || split_part(slug, '-', 2)
where meridian_code = 'KID' and code like 'KI-%';

-- ---------- 4) การอ้างถึง KI-n ในข้อความของจุดอื่น ----------
-- \m คือขอบหน้าของคำ จึงไม่ไปโดน KID- ที่เปลี่ยนไปแล้ว และไม่โดนคำที่ลงท้ายด้วย KI
update points set
  location_th  = regexp_replace(location_th,  '\mKI-(\d)', 'KID-\1', 'g'),
  anatomy_th   = regexp_replace(anatomy_th,   '\mKI-(\d)', 'KID-\1', 'g'),
  location_en  = regexp_replace(location_en,  '\mKI-(\d)', 'KID-\1', 'g'),
  anatomy_en   = regexp_replace(anatomy_en,   '\mKI-(\d)', 'KID-\1', 'g'),
  functions_th = regexp_replace(functions_th, '\mKI-(\d)', 'KID-\1', 'g'),
  functions_en = regexp_replace(functions_en, '\mKI-(\d)', 'KID-\1', 'g'),
  needle_th    = regexp_replace(needle_th,    '\mKI-(\d)', 'KID-\1', 'g'),
  needle_en    = regexp_replace(needle_en,    '\mKI-(\d)', 'KID-\1', 'g'),
  caution_th   = regexp_replace(caution_th,   '\mKI-(\d)', 'KID-\1', 'g'),
  caution_en   = regexp_replace(caution_en,   '\mKI-(\d)', 'KID-\1', 'g')
where (location_th || coalesce(anatomy_th,'') || coalesce(location_en,'') ||
       coalesce(anatomy_en,'') || coalesce(functions_th,'') || coalesce(functions_en,'') ||
       coalesce(needle_th,'') || coalesce(needle_en,'') || coalesce(caution_th,'') ||
       coalesce(caution_en,'')) ~ '\mKI-\d';

update condition_points set
  note_th = regexp_replace(note_th, '\mKI-(\d)', 'KID-\1', 'g')
where note_th ~ '\mKI-\d';

update meridians set
  summary_th = regexp_replace(summary_th, '\mKI-(\d)', 'KID-\1', 'g')
where summary_th ~ '\mKI-\d';

-- ---------- 5) สร้าง search_text ใหม่ทุกแถว ให้ aliases เข้าไปอยู่ในนั้น ----------
update points set code = code;

-- ---------- ตรวจผล ----------
select code, slug, aliases, name_th
from points where meridian_code = 'KID' order by number limit 5;

select count(*) as จุดในเส้นไต from points where meridian_code = 'KID';
select count(*) as เหลือรหัสเก่า from points where code like 'KI-%';
select count(*) as เหลืออ้างอิงเก่า from points
  where (coalesce(location_th,'') || coalesce(needle_th,'') || coalesce(caution_th,'')) ~ '\mKI-\d';

-- ค้นด้วยรหัสเดิมต้องยังเจอ
select code, name_th from search_points('KI-3') limit 3;

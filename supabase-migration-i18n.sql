-- =============================================================
-- JFK — รองรับสองภาษา (ไทย/อังกฤษ)
-- คอลัมน์ _en ว่างได้ ถ้าไม่มีจะ fallback ไปใช้ภาษาไทยอัตโนมัติ
-- =============================================================

alter table points     add column if not exists anatomy_en     text;
alter table points     add column if not exists functions_en   text;
alter table points     add column if not exists indications_en text[] not null default '{}';
alter table points     add column if not exists needle_en      text;
alter table points     add column if not exists caution_en     text;
-- location_en มีอยู่แล้วตั้งแต่ schema แรก (ยังว่าง)

alter table meridians  add column if not exists summary_en text;

alter table conditions add column if not exists summary_en text;
alter table conditions add column if not exists detail_en  text;

alter table condition_points add column if not exists note_en text;

-- ให้ค้นหาภาษาอังกฤษได้ด้วย
create or replace function points_fill_search_text() returns trigger
language plpgsql as $$
begin
  new.search_text :=
    coalesce(new.code,'') || ' ' || replace(coalesce(new.code,''),'-','') || ' ' ||
    coalesce(new.name_th,'') || ' ' || coalesce(new.name_en,'') || ' ' ||
    coalesce(new.name_pinyin,'') || ' ' || coalesce(new.name_zh,'') || ' ' ||
    coalesce(new.location_th,'') || ' ' || coalesce(new.location_en,'') || ' ' ||
    coalesce(new.functions_th,'') || ' ' || coalesce(new.functions_en,'') || ' ' ||
    coalesce(array_to_string(new.indications,' '),'') || ' ' ||
    coalesce(array_to_string(new.indications_en,' '),'') || ' ' ||
    coalesce(array_to_string(new.point_types,' '),'');
  return new;
end $$;

-- เติม search_text ใหม่ให้ทุกแถว
update points set code = code;

-- JFK: แก้ translate() ให้ครอบคลุมสระตัวพิมพ์ใหญ่ด้วย
-- (Ěrhéliáo / Èrjiān / Ěrmén ไม่ถูกถอดวรรณยุกต์ เพราะ translate() แยกตัวพิมพ์เล็ก-ใหญ่)

begin;

create or replace function points_fill_search_text() returns trigger
language plpgsql as $fn$
declare
  toned text;
begin
  toned := coalesce(new.name_pinyin,'') || ' ' || coalesce(new.name_th,'');
  new.search_text :=
    coalesce(new.code,'') || ' ' || replace(coalesce(new.code,''),'-','') || ' ' ||
    toned || ' ' ||
    translate(toned, 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛÜŃŇǸ', 'aaaaeeeeiiiioooouuuuuuuuunnnAAAAEEEEIIIIOOOOUUUUUUUUUNNN') || ' ' ||
    coalesce(new.name_en,'') || ' ' || coalesce(new.name_zh,'') || ' ' ||
    coalesce(new.location_th,'') || ' ' || coalesce(new.functions_th,'') || ' ' ||
    coalesce(array_to_string(new.indications,' '),'') || ' ' ||
    coalesce(array_to_string(new.point_types,' '),'');
  return new;
end $fn$;

update points set code = code;

commit;

-- =============================================================
-- JFK — บันทึกว่าจุดไหนตรวจกับแหล่งอ้างอิงอะไร เมื่อไหร่
-- รันได้เลย ไม่แตะข้อมูลทางคลินิก · รันซ้ำได้
-- =============================================================

alter table points add column if not exists verified_source text;
alter table points add column if not exists verified_at    timestamptz;

comment on column points.verified_source is
  'แหล่งที่ใช้ตรวจ เช่น "Xie''s Veterinary Acupuncture p.148" — ว่างไว้ = ยังไม่เคยเทียบกับตำรา';
comment on column points.verified_at is
  'เวลาที่กดยืนยันครั้งล่าสุด';

-- กดยืนยันเมื่อไหร่ ให้ประทับเวลาเอง และถอนยืนยันให้ล้างทิ้ง
create or replace function points_stamp_verified() returns trigger
language plpgsql as $$
begin
  if new.verified and not coalesce(old.verified, false) then
    new.verified_at := now();
  elsif not new.verified and coalesce(old.verified, false) then
    new.verified_at := null;
    new.verified_source := null;
  end if;
  return new;
end $$;

drop trigger if exists points_stamp_verified_trg on points;
create trigger points_stamp_verified_trg before update on points
  for each row execute function points_stamp_verified();

select count(*) filter (where verified)                        as ยืนยันแล้ว,
       count(*) filter (where verified_source is not null)     as ระบุแหล่งอ้างอิงแล้ว,
       count(*)                                                as ทั้งหมด
from points;

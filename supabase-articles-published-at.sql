-- ======================================================================
-- ประทับ published_at ให้อัตโนมัติเมื่อบทความเปลี่ยนเป็นเผยแพร่
--
-- ตัว editor บันทึกจากเบราว์เซอร์ตรงเข้า Supabase ไม่ผ่าน server action
-- ถ้าไปเขียนค่านี้ในโค้ดฝั่งหน้าเว็บ จะพลาดได้ทุกครั้งที่มีทางเขียนใหม่
-- ทำที่ฐานข้อมูลจึงครอบคลุมกว่า ใช้รูปแบบเดียวกับ points_stamp_verified
-- ======================================================================

create or replace function articles_stamp_published() returns trigger
language plpgsql as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists articles_stamp_published_trg on articles;
create trigger articles_stamp_published_trg before insert or update on articles
  for each row execute function articles_stamp_published();

-- เติมย้อนหลังให้บทความที่เผยแพร่ไปแล้วแต่ยังไม่มีวันที่
update articles
set published_at = coalesce(published_at, updated_at, created_at)
where status = 'published' and published_at is null;

-- ---------- ตรวจผล ----------
select slug, type, status, published_at, title_th from articles order by created_at;

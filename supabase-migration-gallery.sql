-- =============================================================
-- JFK — หลายรูปต่อหนึ่งจุด + เลือกรูปหลักได้
-- รันหลัง supabase-migration-submissions.sql
-- =============================================================

create table if not exists point_images (
  id              uuid primary key default gen_random_uuid(),
  point_id        uuid not null references points(id) on delete cascade,
  image_url       text not null,
  storage_path    text,
  caption         text,          -- เช่น "มุมด้านข้าง", "พุดเดิ้ลขาสั้น"
  credit          text,
  submitted_by    uuid references auth.users(id),
  submitted_email text,
  is_primary      boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists point_images_point_idx on point_images (point_id, sort_order, created_at);

-- รูปหลักได้จุดละหนึ่งรูปเท่านั้น
create unique index if not exists point_images_one_primary
  on point_images (point_id) where is_primary;

alter table point_images enable row level security;

drop policy if exists point_images_read on point_images;
create policy point_images_read on point_images for select using (true);

drop policy if exists point_images_admin_write on point_images;
create policy point_images_admin_write on point_images for all
  using (is_admin()) with check (is_admin());

-- จำกัดจุดละ 6 รูป
create or replace function enforce_point_image_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from point_images where point_id = new.point_id) >= 6 then
    raise exception 'จุดนี้มีรูปครบ 6 รูปแล้ว ลบรูปเก่าก่อนถึงจะเพิ่มได้';
  end if;
  return new;
end $$;

drop trigger if exists point_images_limit on point_images;
create trigger point_images_limit before insert on point_images
  for each row execute function enforce_point_image_limit();

-- ตั้งรูปหลัก + sync ไปที่ points.image_url ให้หน้าเว็บกับ SEO ใช้ได้เหมือนเดิม
create or replace function set_primary_point_image(img_id uuid) returns void
language plpgsql security invoker as $$
declare
  p uuid; u text; c text; a text;
begin
  select point_id, image_url, credit, caption into p, u, c, a
  from point_images where id = img_id;
  if p is null then return; end if;

  update point_images set is_primary = false where point_id = p and is_primary;
  update point_images set is_primary = true  where id = img_id;
  update points set image_url = u, image_credit = c, image_alt = a where id = p;
end $$;

-- ลบรูป: ถ้าลบรูปหลัก ให้เลื่อนรูปถัดไปขึ้นมาเป็นรูปหลักแทน
create or replace function delete_point_image(img_id uuid) returns void
language plpgsql security invoker as $$
declare
  p uuid; was_primary boolean; next_id uuid;
begin
  select point_id, is_primary into p, was_primary from point_images where id = img_id;
  if p is null then return; end if;

  delete from point_images where id = img_id;

  if was_primary then
    select id into next_id from point_images
    where point_id = p order by sort_order, created_at limit 1;

    if next_id is null then
      update points set image_url = null, image_credit = null, image_alt = null where id = p;
    else
      perform set_primary_point_image(next_id);
    end if;
  end if;
end $$;

-- ย้ายรูปที่อนุมัติไปแล้ว (ถ้ามี) เข้าตารางใหม่ ให้ข้อมูลไม่หาย
insert into point_images (point_id, image_url, caption, credit, is_primary)
select p.id, p.image_url, p.image_alt, p.image_credit, true
from points p
where p.image_url is not null
  and not exists (select 1 from point_images i where i.point_id = p.id)
on conflict do nothing;

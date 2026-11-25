-- =============================================================
-- JFK — หมุดแอตลาส 3 มิติ: เริ่มที่ 0.5× และย่อได้ถึง 0.1×
-- รันหลัง supabase-migration-atlas.sql (ไม่แตะจุดที่ปักไว้แล้ว)
-- =============================================================

alter table point_coords alter column size_scale set default 0.5;

alter table point_coords drop constraint if exists point_coords_size_scale_range;
alter table point_coords
  add constraint point_coords_size_scale_range check (size_scale >= 0.1 and size_scale <= 3);

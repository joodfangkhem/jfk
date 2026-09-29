-- =============================================================
-- JFK — สถานะ "ตรวจสอบแล้ว" ของข้อมูลจุด
-- จุด 100 จุดแรก = ตรวจแล้ว, จุดที่เพิ่มเป็นชุดใหญ่ = รอตรวจสอบ
-- =============================================================

alter table points add column if not exists verified boolean not null default false;

-- จุดที่มีอยู่ ณ ตอนนี้คือชุดที่เขียนมาอย่างละเอียดแล้ว ถือว่าตรวจแล้ว
update points set verified = true where verified = false;

create index if not exists points_verified_idx on points (verified);

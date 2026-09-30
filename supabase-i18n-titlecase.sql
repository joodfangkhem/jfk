-- ปรับชื่ออาการภาษาอังกฤษให้เป็น Title Case (ใช้เป็นหัวข้อ h1 และชื่อลิงก์บนหน้า /en)
-- รันซ้ำได้ ไม่มีผลกับภาษาไทย

update conditions set name_en = v.name_en
from (values
  ('anorexia',        'Anorexia and Inappetence'),
  ('anxiety',         'Anxiety and Noise Phobia'),
  ('cancer-support',  'Cancer Supportive Care'),
  ('ckd',             'Chronic Kidney Disease'),
  ('constipation',    'Constipation and Megacolon'),
  ('cough',           'Cough, Tracheal Collapse, Feline Asthma'),
  ('diarrhea',        'Diarrhea and Enteritis'),
  ('emergency',       'Emergency, Shock, Resuscitation'),
  ('epilepsy',        'Seizures and Epilepsy'),
  ('facial-paralysis','Facial Nerve Paralysis'),
  ('geriatric',       'Geriatric Weakness'),
  ('hindlimb-paresis','Hindlimb Paresis and Paralysis'),
  ('hip-dysplasia',   'Hip Dysplasia'),
  ('incontinence',    'Urinary Incontinence'),
  ('ivdd',            'Intervertebral Disc Disease'),
  ('neck-pain',       'Cervical Pain'),
  ('otitis',          'Otitis and Vestibular Signs'),
  ('post-op',         'Post-operative Recovery and Pain'),
  ('pruritus',        'Pruritus and Atopic Dermatitis'),
  ('vomiting',        'Vomiting and Nausea')
) as v(slug, name_en)
where conditions.slug = v.slug;

select slug, name_en from conditions order by slug;

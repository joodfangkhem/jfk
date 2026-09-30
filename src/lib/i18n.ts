export const locales = ['th', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'th'

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v)
}

/** เติม prefix ภาษาให้ path — ไทยไม่มี prefix เพื่อให้ URL เดิมที่ Google เก็บไว้ไม่เปลี่ยน */
export function lp(locale: Locale, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return locale === 'en' ? `/en${p === '/' ? '' : p}` : p
}

/** เลือกข้อความตามภาษา ถ้าอังกฤษยังไม่มีให้ใช้ไทยแทน */
export function pick(locale: Locale, th: string | null | undefined, en: string | null | undefined) {
  if (locale === 'en' && en) return en
  return th ?? en ?? ''
}

export function pickArr(locale: Locale, th: string[] | null, en: string[] | null) {
  if (locale === 'en' && en && en.length) return en
  return th ?? []
}

const th = {
  brandSuffix: 'จุดฝังเข็ม',
  nav: { points: 'จุดฝังเข็ม', meridians: 'เส้นลมปราณ', conditions: 'ตามอาการ', guide: 'คู่มือใช้งาน', admin: 'ผู้ดูแล' },
  auth: { signIn: 'เข้าสู่ระบบ', signOut: 'ออกจากระบบ', account: 'บัญชีของฉัน', saved: 'จุดที่บันทึกไว้', protocols: 'ชุดจุดของฉัน' },
  footer: {
    about: 'เกี่ยวกับ', privacy: 'ความเป็นส่วนตัว',
    disclaimer:
      'JFK (Jood Fang Khem) เป็นคู่มืออ้างอิงเพื่อการศึกษา สำหรับสัตวแพทย์และผู้เรียน TCVM ไม่ใช่คำแนะนำในการรักษาสัตว์ป่วยรายตัว การฝังเข็มในสัตว์ควรทำโดยสัตวแพทย์ที่ผ่านการอบรม',
  },
  home: {
    title: 'จุดฝังเข็มในสัตว์ ค้นได้ในสามวินาที',
    sub: 'พิมพ์รหัสจุด ชื่อจีน หรืออาการที่เจอในคลินิก — เช่น',
    dog: 'สุนัข', cat: 'แมว', all: 'จุดทั้งหมด', cun: 'cun วัดยังไง',
    common: 'จุดที่ใช้บ่อยในสัตว์เล็ก',
    byCondition: 'เลือกตามอาการที่เจอ',
    byMeridian: 'ไล่ตามเส้นลมปราณ',
    seeAll: 'ดูทั้งหมด',
    warnTitle: 'อ่านก่อนใช้งาน',
    warnBody:
      'ข้อมูลในเว็บนี้เป็นคู่มืออ้างอิงเพื่อการศึกษา ตำแหน่งจุดอ้างอิงระบบ transpositional ในสุนัขและแมว ซึ่งแต่ละตำราอาจคลาดเคลื่อนกันเล็กน้อย — ควรคลำยืนยัน landmark จริงทุกครั้ง การฝังเข็มในสัตว์ต้องทำโดยสัตวแพทย์ที่ผ่านการอบรม และต้องวินิจฉัยโรคตามหลักการแพทย์แผนปัจจุบันควบคู่ไปด้วย',
  },
  search: { placeholder: 'ค้นหา: BL-23, Bai Hui, ปวดหลัง, อาเจียน…', label: 'ค้นหาจุดฝังเข็ม', clear: 'ล้างคำค้น' },
  list: {
    title: 'ค้นหาจุดฝังเข็ม', allSpecies: 'ทุกชนิด', allMeridians: 'ทุกเส้น',
    resultFor: 'ผลค้นหา', points: 'จุด', allSorted: 'จุด (เรียงตามความถี่ที่ใช้)',
    emptyTitle: 'ไม่พบจุดที่ตรงกับคำค้นนี้',
    emptyBody: 'ลองพิมพ์รหัสจุด (BL-23), ชื่อพินอิน (Bai Hui), หรืออาการเป็นภาษาไทย (ปวดหลัง / อาเจียน / คัน)',
    emptyLink: 'หรือเลือกจากรายการอาการ →',
  },
  point: {
    home: 'หน้าแรก', common: 'ใช้บ่อย', unverified: 'รอตรวจสอบ',
    unverifiedTitle: 'ข้อมูลจุดนี้ยังรอตรวจสอบ',
    unverifiedBody: '— เป็นจุดที่ไม่ค่อยใช้ในสัตว์ ตำแหน่ง transpositional จึงไม่ได้มาตรฐานเท่าจุดที่ใช้บ่อย กรุณาเทียบกับตำราอ้างอิงก่อนใช้งานจริงทุกครั้ง',
    location: 'ตำแหน่ง', landmark: 'Landmark', functions: 'สรรพคุณและข้อบ่งใช้',
    needle: 'เทคนิคการปัก', caution: 'ข้อควรระวัง',
    conditionsUsing: 'อาการที่ใช้จุดนี้', related: 'จุดที่มักใช้ร่วมกัน',
    primary: 'จุดหลัก', secondary: 'จุดเสริม',
    save: 'บันทึกจุดนี้', saved: 'บันทึกไว้แล้ว',
    noImage: 'ยังไม่มีรูปตำแหน่งของจุดนี้', noImageSub: 'ถ้ามีรูป ช่วยส่งเข้ามาได้ที่กล่องด้านล่าง',
  },
  meridian: {
    title: 'เส้นลมปราณ',
    intro: '12 เส้นหลัก + เส้นเริ่น (CV) และเส้นตู (GV) รวมถึงจุดคลาสสิกในสัตว์ที่ไม่ได้อยู่บนเส้นหลัก',
    total: 'ทั้งเส้นมี', points: 'จุด', peak: 'ช่วงเวลาเด่น', onThis: 'จุดบนเส้นนี้',
    yin: 'ยิน', yang: 'หยาง', extra: 'เส้นพิเศษ',
  },
  condition: {
    title: 'เลือกจุดตามอาการ',
    intro: 'ชุดจุดที่ใช้บ่อยตามอาการที่เจอในคลินิก แยกจุดหลักกับจุดเสริม พร้อมข้อควรระวังรายอาการ',
    approach: 'แนวทางการใช้', primary: 'จุดหลัก', secondary: 'จุดเสริม',
    note: 'ชุดจุดนี้เป็นแนวทางตั้งต้น ไม่ใช่สูตรสำเร็จ — ต้องเลือกจุดตามการวินิจฉัยแยกกลุ่มอาการ (pattern) ของสัตว์แต่ละตัว และประเมินผลซ้ำทุกครั้งที่ทำ',
  },
  note: {
    title: 'โน้ตของฉัน',
    signedOut: 'เพื่อจดบันทึกเคสของคุณไว้ที่จุดนี้ (เห็นเฉพาะคุณ)',
    signIn: 'เข้าสู่ระบบด้วย Google',
    placeholder: 'เช่น เคสพุดเดิ้ล 12 ปี ปัก BAI-HUI + GB-30 กระตุ้นไฟฟ้า 20 Hz 15 นาที ดีขึ้นครั้งที่ 3',
    save: 'บันทึกโน้ต',
    saving: 'กำลังบันทึก…',
    savedMark: 'บันทึกแล้ว',
    deleted: 'ลบโน้ตแล้ว',
    failed: 'บันทึกไม่สำเร็จ',
  },
  photo: {
    titleNew: 'ช่วยส่งรูปจุดนี้',
    titleMore: 'ส่งรูปมุมอื่นของจุดนี้',
    signedOut: 'เพื่อส่งรูปตำแหน่งจุดนี้เข้ามาช่วยกัน — แอดมินจะตรวจก่อนขึ้นเว็บ',
    pending: 'รูปของคุณส่งแล้ว กำลังรอแอดมินตรวจ',
    withdraw: 'ถอนรูปนี้',
    withdrawn: 'ถอนรูปแล้ว',
    approved: 'รูปของคุณถูกใช้งานแล้ว ขอบคุณครับ',
    rejected: 'รูปก่อนหน้าไม่ผ่าน',
    rejectedTail: '— ส่งใหม่ได้',
    hasImages: (n: number) => `จุดนี้มีรูปแล้ว ${n} รูป (เก็บได้สูงสุด 6) — ส่งมุมอื่นหรือสายพันธุ์อื่นมาเพิ่มได้ เช่น หมาขาสั้น/ขายาว ตัวใหญ่/ตัวเล็ก `,
    tip: 'ถ่ายให้เห็น landmark ชัดเจน เช่น ปุ่มกระดูกหรือร่องกล้ามเนื้อที่ใช้อ้างอิงตำแหน่ง',
    choose: 'เลือกรูป',
    creditPlaceholder: 'ชื่อที่จะให้เครดิตใต้รูป (ไม่บังคับ)',
    notePlaceholder: 'อยากบอกอะไรแอดมินไหม (ไม่บังคับ)',
    submit: 'ส่งรูปให้แอดมินตรวจ',
    submitting: 'กำลังส่ง…',
    rules: 'ระบบจะย่อรูปให้อัตโนมัติก่อนส่ง ไม่ต้องย่อเองมา · ส่งรูปที่คุณถ่ายเองเท่านั้น อย่าเอารูปจากตำราหรืออินเทอร์เน็ตมาส่ง เมื่อรูปถูกอนุมัติ ถือว่าคุณอนุญาตให้เว็บนี้ใช้รูปได้',
    pickFirst: 'เลือกรูปก่อนครับ',
    tooBig: 'ไฟล์ใหญ่เกิน 25 MB',
    sent: 'ส่งรูปแล้ว รอแอดมินตรวจ',
    uploadFailed: 'อัปโหลดไม่สำเร็จ: ',
    sendFailed: 'ส่งไม่สำเร็จ: ',
    withdrawFailed: 'ถอนไม่สำเร็จ',
    saveLoginPrompt: 'เข้าสู่ระบบด้วย Google เพื่อบันทึกจุดที่ใช้บ่อย',
    savedToast: (c: string) => `บันทึก ${c} แล้ว`,
    removedToast: (c: string) => `เอา ${c} ออกแล้ว`,
    saveFailed: 'บันทึกไม่สำเร็จ',
    removeFailed: 'ลบไม่สำเร็จ',
  },
  ad: 'โฆษณา',
  switchTo: 'English',
}

const en: typeof th = {
  brandSuffix: 'Vet Acupuncture',
  nav: { points: 'Points', meridians: 'Meridians', conditions: 'By Condition', guide: 'Guide', admin: 'Admin' },
  auth: { signIn: 'Sign In', signOut: 'Sign Out', account: 'My Account', saved: 'Saved Points', protocols: 'My Protocols' },
  footer: {
    about: 'About', privacy: 'Privacy',
    disclaimer:
      'JFK (Jood Fang Khem) is an educational reference for veterinarians and TCVM students. It is not treatment advice for an individual patient. Veterinary acupuncture should be performed by a trained veterinarian.',
  },
  home: {
    title: 'Veterinary Acupuncture Points, Found in Seconds',
    sub: 'Type a point code, its Chinese name, or the sign in front of you — for example',
    dog: 'Dog', cat: 'Cat', all: 'All Points', cun: 'How to Measure a Cun',
    common: 'Points Used Most in Small Animals',
    byCondition: 'Browse by Condition',
    byMeridian: 'Browse by Meridian',
    seeAll: 'See All',
    warnTitle: 'Before You Use This',
    warnBody:
      'This site is an educational reference. Locations follow the transpositional system for dogs and cats, which differs slightly between texts — always confirm the bony landmarks by palpation. Veterinary acupuncture must be performed by a trained veterinarian alongside conventional diagnosis and treatment.',
  },
  search: { placeholder: 'Search: BL-23, Bai Hui, back pain, vomiting…', label: 'Search Acupuncture Points', clear: 'Clear Search' },
  list: {
    title: 'Search Points', allSpecies: 'All Species', allMeridians: 'All Meridians',
    resultFor: 'Results for', points: 'points', allSorted: 'points, most used first',
    emptyTitle: 'No Point Matches That Search',
    emptyBody: 'Try a point code (BL-23), a pinyin name (Bai Hui), or a clinical sign (back pain / vomiting / itching).',
    emptyLink: 'Or pick from the condition list →',
  },
  point: {
    home: 'Home', common: 'Commonly Used', unverified: 'Needs Review',
    unverifiedTitle: 'This Point Still Needs Review',
    unverifiedBody: '— it is rarely used in animals, so its transpositional location is far less standardised than the common points. Check it against a reference text before using it clinically.',
    location: 'Location', landmark: 'Landmark', functions: 'Actions and Indications',
    needle: 'Needling', caution: 'Cautions',
    conditionsUsing: 'Conditions That Use This Point', related: 'Often Used Together With',
    primary: 'Primary', secondary: 'Supporting',
    save: 'Save This Point', saved: 'Saved',
    noImage: 'No Photo of This Point Yet', noImageSub: 'If you have one, you can submit it below.',
  },
  meridian: {
    title: 'Meridians',
    intro: 'The 12 main channels plus the Conception (CV) and Governing (GV) vessels, and the classical points used only in animals.',
    total: 'Full channel has', points: 'points', peak: 'Peak Hours', onThis: 'Points on This Channel',
    yin: 'Yin', yang: 'Yang', extra: 'Extraordinary',
  },
  condition: {
    title: 'Points by Condition',
    intro: 'Point sets for the conditions seen in practice, split into primary and supporting points, with cautions for each.',
    approach: 'How It Is Used', primary: 'Primary Points', secondary: 'Supporting Points',
    note: 'These are starting points, not a recipe — choose points from the pattern diagnosis of the individual animal and reassess at every session.',
  },
  note: {
    title: 'My Notes',
    signedOut: 'to keep private notes on this point (only you can see them).',
    signIn: 'Sign In with Google',
    placeholder: 'e.g. 12-year-old poodle, BAI-HUI + GB-30 with electroacupuncture 20 Hz for 15 min, improved by the third session',
    save: 'Save Note',
    saving: 'Saving…',
    savedMark: 'Saved',
    deleted: 'Note deleted',
    failed: 'Could not save',
  },
  photo: {
    titleNew: 'Help Us Photograph This Point',
    titleMore: 'Send Another Angle of This Point',
    signedOut: 'to submit a photo of this point — an admin reviews it before it goes live.',
    pending: 'Your photo has been submitted and is waiting for review.',
    withdraw: 'Withdraw This Photo',
    withdrawn: 'Photo withdrawn',
    approved: 'Your photo is in use — thank you.',
    rejected: 'Your previous photo was not accepted',
    rejectedTail: '— you can submit another.',
    hasImages: (n: number) => `This point already has ${n} photo(s) (up to 6). Send another angle or another breed — a short-legged versus a tall dog, a large versus a small one. `,
    tip: 'Show the landmark clearly — the bony prominence or muscle groove the location is referenced from.',
    choose: 'Choose a Photo',
    creditPlaceholder: 'Credit name to show under the photo (optional)',
    notePlaceholder: 'Anything you want to tell the admin? (optional)',
    submit: 'Submit for Review',
    submitting: 'Sending…',
    rules: 'Photos are downscaled automatically before upload, so send them as they are. Submit only photos you took yourself — never images from a textbook or the internet. Approving a photo means you allow this site to use it.',
    pickFirst: 'Choose a photo first',
    tooBig: 'File is larger than 25 MB',
    sent: 'Photo submitted — waiting for review',
    uploadFailed: 'Upload failed: ',
    sendFailed: 'Could not submit: ',
    withdrawFailed: 'Could not withdraw',
    saveLoginPrompt: 'Sign in with Google to save the points you use often',
    savedToast: (c: string) => `Saved ${c}`,
    removedToast: (c: string) => `Removed ${c}`,
    saveFailed: 'Could not save',
    removeFailed: 'Could not remove',
  },
  ad: 'Advertisement',
  switchTo: 'ไทย',
}

const dict = { th, en }
export function t(locale: Locale) {
  return dict[locale]
}

export const SPECIES_LABEL_I18N: Record<Locale, Record<string, string>> = {
  th: { dog: 'สุนัข', cat: 'แมว', horse: 'ม้า', cattle: 'วัว', rabbit: 'กระต่าย' },
  en: { dog: 'Dog', cat: 'Cat', horse: 'Horse', cattle: 'Cattle', rabbit: 'Rabbit' },
}

export const ELEMENT_LABEL_I18N: Record<Locale, Record<string, string>> = {
  th: { metal: 'ธาตุโลหะ', water: 'ธาตุน้ำ', wood: 'ธาตุไม้', fire: 'ธาตุไฟ', earth: 'ธาตุดิน' },
  en: { metal: 'Metal', water: 'Water', wood: 'Wood', fire: 'Fire', earth: 'Earth' },
}

export const CATEGORY_LABEL_I18N: Record<Locale, Record<string, string>> = {
  th: { neuro: 'ระบบประสาท', ortho: 'กระดูกและข้อ', gi: 'ทางเดินอาหาร', uro: 'ทางเดินปัสสาวะ', resp: 'ระบบหายใจ', derm: 'ผิวหนัง', behavior: 'พฤติกรรม', other: 'อื่นๆ' },
  en: { neuro: 'Neurology', ortho: 'Musculoskeletal', gi: 'Gastrointestinal', uro: 'Urinary', resp: 'Respiratory', derm: 'Skin', behavior: 'Behaviour', other: 'Other' },
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว',
  description: 'ข้อมูลที่ JFK จุดฝังเข็ม เก็บ วิธีใช้ คุกกี้ และโฆษณา',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold">นโยบายความเป็นส่วนตัว</h1>

      <div className="card p-4 space-y-4 text-[15px] leading-relaxed">
        <section>
          <h2 className="font-semibold mb-1">ข้อมูลที่เราเก็บ</h2>
          <p>
            หากคุณเข้าสู่ระบบด้วย Google เราจะเก็บอีเมลและรหัสผู้ใช้ที่ Google ส่งมาให้เท่านั้น
            เพื่อผูกกับข้อมูลที่คุณบันทึกไว้ (จุดที่บันทึก โน้ต และชุดจุดของคุณ)
            เราไม่เก็บรหัสผ่านของคุณ และไม่เข้าถึงข้อมูลอื่นในบัญชี Google ของคุณ
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-1">ข้อมูลของคุณเป็นส่วนตัว</h2>
          <p>
            จุดที่บันทึก โน้ต และชุดจุดของคุณ ถูกจำกัดสิทธิ์ให้เข้าถึงได้เฉพาะบัญชีของคุณ
            ผู้ใช้อื่นไม่เห็นข้อมูลเหล่านี้ คุณลบข้อมูลหรือเลิกใช้งานได้ตลอดเวลา
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-1">คุกกี้</h2>
          <p>
            เราใช้คุกกี้เท่าที่จำเป็นเพื่อคงสถานะการเข้าสู่ระบบ
            หากมีการแสดงโฆษณา ผู้ให้บริการโฆษณาอาจใช้คุกกี้ของตนเองเพื่อวัดผลและแสดงโฆษณาที่เกี่ยวข้อง
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-1">โฆษณา</h2>
          <p>
            เว็บนี้อาจแสดงโฆษณาผ่าน Google AdSense ซึ่งเป็นผู้ให้บริการภายนอก
            Google อาจใช้คุกกี้ในการแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้และเว็บไซต์อื่น
            คุณสามารถปิดการปรับโฆษณาตามความสนใจได้ที่การตั้งค่าโฆษณาของ Google
            (google.com/settings/ads)
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-1">ผู้ให้บริการที่เราใช้</h2>
          <p>
            การยืนยันตัวตนและฐานข้อมูลใช้บริการ Supabase การโฮสต์เว็บใช้บริการ Vercel
            ผู้ให้บริการเหล่านี้ประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการ
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-1">ติดต่อและลบข้อมูล</h2>
          <p>
            หากต้องการให้ลบบัญชีและข้อมูลทั้งหมดของคุณ ติดต่อผู้ดูแลเว็บไซต์
            เราจะลบให้ภายในเวลาอันสมควร
          </p>
        </section>
      </div>
    </main>
  )
}

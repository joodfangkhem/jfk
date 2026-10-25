import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'

/**
 * หน้า public ทั้งหมดเป็น ISR (จุด 7 วัน / หน้ารวม 1 วัน) จึงต้องมีที่เก็บผลที่สร้างแล้ว
 * ใช้ R2 เพราะอ่านฟรีไม่จำกัดและไม่มีเพดานเขียนรายวันแบบ KV
 *
 * withRegionalCache ซ้อน Cache API ของ Worker ไว้หน้า R2 หน้าที่เคยถูกขอใน
 * ดาต้าเซ็นเตอร์นั้นแล้วจะถูกใช้ซ้ำได้ถึง 30 นาทีโดยไม่ต้องแตะ R2 อีก
 *
 * ที่ต้องทำแบบนี้เพราะ Cache Rule ของโซนใช้แทนกันไม่ได้ Worker ทำงาน "ก่อน"
 * แคชของ CDN เสมอ response ที่ Worker สร้างเองจึงไม่เคยผ่านแคชชั้นนั้น
 * (สังเกตได้จาก response ไม่มี header cf-cache-status เลย)
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'long-lived',
  }),

  // ตัดวงจรให้สั้นลง ถ้าหน้า ISR มีในแคชแล้วตอบได้เลย ไม่ต้องปลุก Next router เต็มตัว
  // สำคัญกับเพดาน CPU 10 ms ของ Workers แพ็กฟรี ต้องกลับเป็น false ถ้าวันหนึ่งเปิด PPR
  enableCacheInterception: true,
})

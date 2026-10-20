import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

/**
 * หน้า public ทั้งหมดเป็น ISR (จุด 7 วัน / หน้ารวม 1 วัน) จึงต้องมีที่เก็บผลที่สร้างแล้ว
 * ใช้ R2 เพราะอ่านฟรีไม่จำกัดและไม่มีเพดานเขียนรายวันแบบ KV
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})

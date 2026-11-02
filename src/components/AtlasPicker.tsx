'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Camera, ChevronRight, Crosshair, ExternalLink, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { revalidateAtlas, revalidatePoint } from '@/lib/revalidate'
import type { AtlasCapture } from '@/components/AtlasStage'
import type { SpeciesModel } from '@/lib/types'

const AtlasStage = dynamic(() => import('@/components/AtlasStage'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] rounded-[var(--radius)] bg-surface-2 animate-pulse" />,
})

export type PickerPoint = {
  id: string
  code: string
  slug: string
  name_th: string | null
  name_pinyin: string | null
  meridian_code: string
  species: string[]
}

export type PickerCoord = {
  point_id: string
  species: string
  x: number
  y: number
  z: number
  bilateral: boolean
  size_scale: number
  note_th: string | null
  verified: boolean
  dir_x: number | null
  dir_y: number | null
  dir_z: number | null
}

const key = (pointId: string, species: string) => `${pointId}|${species}`

export default function AtlasPicker({
  models,
  points,
  coords,
}: {
  models: SpeciesModel[]
  points: PickerPoint[]
  coords: PickerCoord[]
}) {
  const supabase = createClient()
  const [species, setSpecies] = useState(models[0]?.species ?? 'dog')
  const [map, setMap] = useState<Record<string, PickerCoord>>(() =>
    Object.fromEntries(coords.map((c) => [key(c.point_id, c.species), c]))
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [onlyMissing, setOnlyMissing] = useState(false)
  // โหมดตั้งมุมเฉียง: คลิกครั้งถัดไปคือ "เข็มเล็งไปทางไหน" ไม่ใช่การย้ายตำแหน่งจุด
  // เก็บเป็น key ของจุดที่กำลังเล็ง ไม่ใช่ boolean เพื่อให้สลับจุดแล้วเลิกเล็งเอง
  const [aimFor, setAimFor] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  // ฉากส่งฟังก์ชันแคปภาพกลับมาเมื่อโมเดลโหลดเสร็จ เก็บใน ref เพราะไม่ต้อง re-render ตาม
  const captureRef = useRef<AtlasCapture | null>(null)
  const onCaptureReady = useCallback((fn: AtlasCapture | null) => {
    captureRef.current = fn
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [supabase])

  const model = models.find((m) => m.species === species)

  /** จุดที่ใช้กับสัตว์ชนิดนี้ได้ */
  const speciesPoints = useMemo(
    () => points.filter((p) => p.species.includes(species)),
    [points, species]
  )

  const placed = useMemo(
    () => speciesPoints.filter((p) => map[key(p.id, species)]),
    [speciesPoints, map, species]
  )

  const listed = useMemo(() => {
    const q = filter.trim().toLowerCase().replace(/[-\s]/g, '')
    return speciesPoints.filter((p) => {
      if (onlyMissing && map[key(p.id, species)]) return false
      if (!q) return true
      return [p.code, p.name_th, p.name_pinyin]
        .filter((v): v is string => Boolean(v))
        .some((v) => v.toLowerCase().replace(/[-\s]/g, '').includes(q))
    })
  }, [speciesPoints, filter, onlyMissing, map, species])

  const markers = useMemo(
    () =>
      placed.map((p) => {
        const c = map[key(p.id, species)]
        return {
          id: p.id,
          code: p.code,
          x: c.x,
          y: c.y,
          z: c.z,
          bilateral: c.bilateral,
          verified: c.verified,
          scale: c.size_scale,
          dir:
            c.dir_x !== null && c.dir_y !== null && c.dir_z !== null
              ? { x: c.dir_x, y: c.dir_y, z: c.dir_z }
              : null,
        }
      }),
    [placed, map, species]
  )

  const selected = speciesPoints.find((p) => p.id === selectedId) ?? null
  const selectedCoord = selected ? map[key(selected.id, species)] : undefined
  const hasDir =
    selectedCoord?.dir_x !== null &&
    selectedCoord?.dir_y !== null &&
    selectedCoord?.dir_z !== null
  const aimKey = selected ? key(selected.id, species) : null
  const aim = aimKey !== null && aimFor === aimKey

  const save = useCallback(
    async (row: PickerCoord, slug: string) => {
      setBusy(true)
      const { error } = await supabase
        .from('point_coords')
        .upsert({ ...row, set_by: userId }, { onConflict: 'point_id,species' })
      setBusy(false)
      if (error) {
        toast.error('บันทึกไม่สำเร็จ: ' + error.message)
        return false
      }
      setMap((m) => ({ ...m, [key(row.point_id, row.species)]: row }))
      await revalidateAtlas(slug)
      return true
    },
    [supabase, userId]
  )

  const onPick = useCallback(
    async (p: { x: number; y: number; z: number; nx: number; ny: number; nz: number }) => {
      if (!selected) {
        toast('เลือกจุดจากรายการก่อน แล้วค่อยคลิกบนตัวสัตว์')
        return
      }
      const prev = map[key(selected.id, species)]

      // โหมดตั้งมุม: คลิกนี้คือเป้าที่เข็มเล็งไป ทิศทาง = จากตัวจุดไปหาเป้า
      // ใช้การคลิกเป้าแทนสไลเดอร์องศา เพราะคำบรรยายในตำราพูดเป็น "เฉียงเข้าหา..." อยู่แล้ว
      if (aim) {
        if (!prev) {
          toast.error('ปักตำแหน่งจุดก่อน แล้วค่อยตั้งมุม')
          return
        }
        const dx = p.x - prev.x
        const dy = p.y - prev.y
        const dz = p.z - prev.z
        const len = Math.hypot(dx, dy, dz)
        if (len < 1e-6) {
          toast.error('คลิกเป้าให้ห่างจากตัวจุดหน่อย')
          return
        }
        const row: PickerCoord = {
          ...prev,
          dir_x: dx / len,
          dir_y: dy / len,
          dir_z: dz / len,
        }
        if (await save(row, selected.slug)) {
          setAimFor(null)
          toast.success(`ตั้งมุมแทงของ ${selected.code} แล้ว`)
        }
        return
      }

      const row: PickerCoord = {
        point_id: selected.id,
        species,
        x: p.x,
        y: p.y,
        z: p.z,
        bilateral: prev?.bilateral ?? true,
        size_scale: prev?.size_scale ?? 1,
        note_th: prev?.note_th ?? null,
        // คนที่คลิกปักคือสัตวแพทย์เจ้าของเว็บอยู่แล้ว การปักจึงนับเป็นการยืนยันในตัว
        // ถ้ายังไม่มั่นใจค่อยติ๊กออกเอง และการย้ายตำแหน่งไม่รีเซ็ตสถานะเดิม
        verified: prev?.verified ?? true,
        // ท่าตั้งต้นคือแทงตั้งฉาก = สวนทางกับ normal ของผิวตรงที่คลิก
        // ซึ่งตรงกับจุดส่วนใหญ่อยู่แล้ว จุดที่แทงเฉียงค่อยกดตั้งมุมทีหลัง
        // การคลิกปักใหม่จึงรีเซ็ตมุมกลับเป็นตั้งฉากเสมอ เพราะผิวตรงจุดใหม่หันไปอีกทาง
        dir_x: -p.nx,
        dir_y: -p.ny,
        dir_z: -p.nz,
      }
      if (await save(row, selected.slug)) {
        toast.success(`ปัก ${selected.code} แล้ว`)
      }
    },
    [selected, species, map, save, aim]
  )

  const patch = async (change: Partial<PickerCoord>) => {
    if (!selected || !selectedCoord) return
    const row = { ...selectedCoord, ...change }
    if (await save(row, selected.slug)) toast.success('บันทึกแล้ว')
  }

  // สไลเดอร์ขนาด: ลากแล้วอัปเดตเฉพาะในหน้าเพื่อให้เห็นผลทันที
  // แล้วค่อยเขียนลงฐานข้อมูลครั้งเดียวตอนปล่อยมือ ไม่ยิง upsert ทุกก้าวที่ลาก
  const sizeDirty = useRef(false)

  const previewSize = (v: number) => {
    if (!selected || !selectedCoord) return
    sizeDirty.current = true
    setMap((m) => ({ ...m, [key(selected.id, species)]: { ...selectedCoord, size_scale: v } }))
  }

  const commitSize = () => {
    if (!sizeDirty.current) return
    sizeDirty.current = false
    void patch({})
  }

  const remove = async () => {
    if (!selected || !selectedCoord) return
    setBusy(true)
    const { error } = await supabase
      .from('point_coords')
      .delete()
      .eq('point_id', selected.id)
      .eq('species', species)
    setBusy(false)
    if (error) {
      toast.error('ลบไม่สำเร็จ: ' + error.message)
      return
    }
    setMap((m) => {
      const next = { ...m }
      delete next[key(selected.id, species)]
      return next
    })
    await revalidateAtlas(selected.slug)
    toast.success('ลบพิกัดแล้ว')
  }

  /**
   * เก็บภาพจากมุมที่เห็นอยู่เข้าคลังรูปของจุดนั้น
   * ใช้ทางเดียวกับการอัปโหลดรูปถ่ายใน PointGalleryManager ทุกอย่าง
   * (bucket point-images → แถวใน point_images → ตั้งรูปหลักถ้ายังไม่มีรูป → สะกิดแคช)
   */
  const shoot = async () => {
    if (!selected || !selectedCoord) return
    const capture = captureRef.current
    if (!capture) {
      toast.error('โมเดลยังโหลดไม่เสร็จ')
      return
    }
    setBusy(true)
    try {
      const { count, error: countErr } = await supabase
        .from('point_images')
        .select('id', { count: 'exact', head: true })
        .eq('point_id', selected.id)
      if (countErr) {
        toast.error(countErr.message)
        return
      }
      const n = count ?? 0
      if (n >= 6) {
        toast.error('จุดนี้มีรูปครบ 6 รูปแล้ว ลบรูปเก่าก่อนถึงจะเพิ่มได้')
        return
      }

      const blob = await capture({ soloSelected: true })
      if (!blob) {
        toast.error('แคปภาพไม่สำเร็จ')
        return
      }

      // ชื่อไฟล์ต้องไม่ซ้ำ จึงใช้เวลาปัจจุบัน — อยู่ใน event handler ไม่ใช่ตอน render
      const path = `atlas/${selected.slug}-${species}-${Date.now()}.jpg`
      const { error: upErr } = await supabase.storage
        .from('point-images')
        .upload(path, blob, {
          cacheControl: '31536000',
          contentType: 'image/jpeg',
          upsert: false,
        })
      if (upErr) {
        toast.error('อัปโหลดไม่สำเร็จ: ' + upErr.message)
        return
      }

      const { data: pub } = supabase.storage.from('point-images').getPublicUrl(path)
      const { data: row, error } = await supabase
        .from('point_images')
        .insert({
          point_id: selected.id,
          image_url: pub.publicUrl,
          storage_path: path,
          caption: `ตำแหน่ง ${selected.code} บนโมเดล 3 มิติ (${model?.label_th ?? species})`,
          // โมเดลเป็น CC BY ภาพที่เรนเดอร์ออกมาเป็นงานดัดแปลง ต้องให้เครดิตเหมือนกัน
          credit: model?.credit ?? null,
          sort_order: n,
        })
        .select('id')
        .single()
      if (error) {
        toast.error(error.message)
        return
      }
      if (n === 0 && row) {
        await supabase.rpc('set_primary_point_image', { img_id: row.id })
      }
      // หน้าจุดฝั่ง public แคชยาว ต้องสะกิดให้สร้างใหม่ ไม่งั้นรูปขึ้นก็ต่อเมื่อแคชหมดอายุ
      await revalidatePoint(selected.slug)
      toast.success(n === 0 ? 'เก็บรูปแล้ว ตั้งเป็นรูปหลักของจุดนี้ให้เลย' : 'เก็บรูปเข้าหน้าจุดแล้ว')
    } finally {
      setBusy(false)
    }
  }

  const clearDir = () =>
    patch({ dir_x: null, dir_y: null, dir_z: null })

  const nextMissing = () => {
    const i = speciesPoints.findIndex((p) => p.id === selectedId)
    const after = speciesPoints.slice(i + 1).find((p) => !map[key(p.id, species)])
    const target = after ?? speciesPoints.find((p) => !map[key(p.id, species)])
    if (!target) {
      toast('ปักครบทุกจุดของสัตว์ชนิดนี้แล้ว')
      return
    }
    setSelectedId(target.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {models.map((m) => {
          const n = points.filter((p) => p.species.includes(m.species) && map[key(p.id, m.species)]).length
          const total = points.filter((p) => p.species.includes(m.species)).length
          return (
            <button
              key={m.species}
              type="button"
              onClick={() => {
                setSpecies(m.species)
                setSelectedId(null)
              }}
              aria-pressed={m.species === species}
              className={
                m.species === species
                  ? 'chip bg-primary text-white border-primary'
                  : 'chip hover:border-primary hover:text-primary'
              }
            >
              {m.label_th}
              <span className="opacity-70">
                {n}/{total}
              </span>
            </button>
          )
        })}
      </div>

      {model && (
        <div className="relative">
          <AtlasStage
            modelUrl={model.model_url}
            markers={markers}
            selectedId={selectedId}
            onSelectMarker={setSelectedId}
            pickMode={Boolean(selected)}
            onPick={onPick}
            onCaptureReady={onCaptureReady}
            className="relative w-full h-[320px] sm:h-[460px]"
          />
          <p className="absolute left-3 top-3 text-[11px] bg-surface/90 border border-border rounded-md px-2 py-1 pointer-events-none max-w-[70%]">
            {!selected ? (
              'เลือกจุดจากรายการด้านล่างก่อน แล้วคลิกบนตัวสัตว์'
            ) : aim ? (
              <>
                กำลังตั้งมุมของ <strong className="text-accent">{selected.code}</strong> — คลิกตรงที่เข็มเล็งไป
              </>
            ) : (
              <>
                กำลังปัก <strong className="text-accent">{selected.code}</strong> — คลิกบนตัวสัตว์ได้เลย
                {selectedCoord && ' (คลิกใหม่เพื่อย้ายตำแหน่ง)'}
              </>
            )}
            <span className="block text-muted mt-0.5">
              ลากเพื่อหมุน · คลิกขวา / Shift+ลาก / สองนิ้ว เพื่อเลื่อนภาพ · ดับเบิลคลิกเพื่อเล็งเข้าตรงนั้น
            </span>
          </p>
        </div>
      )}

      {/* แผงจัดการจุดที่เลือก */}
      <div className="card p-4 space-y-3">
        {!selected ? (
          <p className="text-sm text-muted">ยังไม่ได้เลือกจุด</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-semibold">
                <span className="text-primary">{selected.code}</span>{' '}
                {selected.name_th || selected.name_pinyin}
              </p>
              <button type="button" onClick={nextMissing} className="chip hover:border-primary hover:text-primary">
                จุดถัดไปที่ยังไม่ปัก <ChevronRight size={12} />
              </button>
            </div>

            {!selectedCoord ? (
              <p className="text-sm text-muted flex items-center gap-1.5">
                <Crosshair size={14} /> ยังไม่มีพิกัด — คลิกบนตัวสัตว์เพื่อปัก
              </p>
            ) : (
              <>
                <p className="text-xs text-muted font-mono">
                  x {selectedCoord.x.toFixed(4)} · y {selectedCoord.y.toFixed(4)} · z{' '}
                  {selectedCoord.z.toFixed(4)}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      id="atlas-bilateral"
                      type="checkbox"
                      checked={selectedCoord.bilateral}
                      disabled={busy}
                      onChange={(e) => patch({ bilateral: e.target.checked })}
                    />
                    จุดสองข้าง (สะท้อนให้อัตโนมัติ)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      id="atlas-verified"
                      type="checkbox"
                      checked={selectedCoord.verified}
                      disabled={busy}
                      onChange={(e) => patch({ verified: e.target.checked })}
                    />
                    ตรวจตำแหน่งแล้ว
                  </label>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <label htmlFor="atlas-size" className="text-sm shrink-0">
                    ขนาดหมุด
                  </label>
                  <input
                    id="atlas-size"
                    type="range"
                    // ต่ำกว่า 0.5 หมุดเล็กจนหายไปตอนซูมออก (ลองแล้ว 0.3 มองไม่เห็น)
                    // ฐานข้อมูลยอมถึง 0.3 ไว้เป็นกันชน แต่สไลเดอร์ไม่ให้ลงไปถึง
                    min={0.5}
                    max={3}
                    step={0.05}
                    value={selectedCoord.size_scale}
                    disabled={busy}
                    // ลากแล้วเห็นผลทันทีบนโมเดล ค่อยเขียนลงฐานข้อมูลตอนปล่อยมือ
                    onChange={(e) => previewSize(Number(e.target.value))}
                    onPointerUp={commitSize}
                    onKeyUp={commitSize}
                    onBlur={commitSize}
                    className="flex-1 min-w-40 accent-[var(--primary)]"
                  />
                  <span className="text-xs text-muted font-mono w-10 text-right">
                    {selectedCoord.size_scale.toFixed(2)}×
                  </span>
                  <button
                    type="button"
                    onClick={() => void patch({ size_scale: 1 })}
                    disabled={busy || selectedCoord.size_scale === 1}
                    className="chip hover:border-primary hover:text-primary"
                  >
                    ค่ามาตรฐาน
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    id="atlas-note"
                    type="text"
                    defaultValue={selectedCoord.note_th ?? ''}
                    placeholder="หมายเหตุบนแอตลาส เช่น คลำร่องซี่โครงก่อน"
                    disabled={busy}
                    onBlur={(e) => {
                      const v = e.target.value.trim() || null
                      if (v !== (selectedCoord.note_th ?? null)) patch({ note_th: v })
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg border border-border bg-surface flex-1 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={remove}
                    disabled={busy}
                    className="chip text-accent hover:border-accent"
                  >
                    <Trash2 size={12} /> ลบพิกัด
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap items-center pt-1 border-t border-border">
                  <span className="text-sm shrink-0">มุมแทง</span>
                  <span className={hasDir ? 'chip text-primary border-primary/30' : 'chip text-muted'}>
                    {hasDir ? 'ระบุแล้ว' : 'ยังไม่ระบุ'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAimFor(aim ? null : aimKey)}
                    disabled={busy}
                    aria-pressed={aim}
                    className={
                      aim
                        ? 'chip border-accent text-accent'
                        : 'chip hover:border-primary hover:text-primary'
                    }
                  >
                    <Crosshair size={12} /> {aim ? 'ยกเลิกการเล็ง' : 'ตั้งมุมเฉียง'}
                  </button>
                  <button
                    type="button"
                    onClick={clearDir}
                    disabled={busy || !hasDir}
                    className="chip hover:border-accent hover:text-accent disabled:opacity-40"
                  >
                    ล้างทิศทาง
                  </button>
                  <p className="text-xs text-muted basis-full leading-relaxed">
                    คลิกปักบนตัวสัตว์ = แทงตั้งฉากกับผิวตรงนั้นให้อัตโนมัติ (ปักใหม่ก็รีเซ็ตกลับเป็นตั้งฉาก)
                    · กด “ตั้งมุมเฉียง” แล้วคลิกตรงที่เข็มเล็งไป · เข็มจะโผล่ให้เห็นเฉพาะจุดที่เลือกอยู่
                    · ความยาวเข็มเป็นค่าคงที่ ไม่ได้สื่อความลึกเป็น cun
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap items-center pt-1 border-t border-border">
                  <button
                    type="button"
                    onClick={shoot}
                    disabled={busy}
                    className="chip hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    <Camera size={12} /> {busy ? 'กำลังทำงาน…' : 'แคปมุมนี้เข้าหน้าจุด'}
                  </button>
                  <a
                    href={`/admin/points/${selected.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip hover:border-primary hover:text-primary"
                  >
                    คลังรูปของจุดนี้ <ExternalLink size={12} />
                  </a>
                  <p className="text-xs text-muted basis-full leading-relaxed">
                    แคปตามมุมที่เห็นอยู่บนฉาก (ซ่อนหมุดจุดอื่นให้เอง) — ซูมกับหมุนให้ได้มุมที่ต้องการก่อนกด
                    รูปแรกของจุดจะถูกตั้งเป็นรูปหลักอัตโนมัติ
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* รายการจุด */}
      <section className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            id="atlas-picker-filter"
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="ค้นหารหัสหรือชื่อจุด"
            aria-label="ค้นหาจุด"
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-surface flex-1 min-w-0 sm:max-w-xs"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              id="atlas-only-missing"
              type="checkbox"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
            />
            เฉพาะที่ยังไม่ปัก
          </label>
          <span className="text-sm text-muted">
            ปักแล้ว {placed.length} / {speciesPoints.length}
          </span>
        </div>

        <ul className="grid sm:grid-cols-3 gap-1.5 max-h-80 overflow-y-auto">
          {listed.map((p) => {
            const c = map[key(p.id, species)]
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left card px-2.5 py-1.5 text-sm hover:border-primary/50 ${
                    p.id === selectedId ? 'border-accent' : ''
                  }`}
                >
                  <span className={c ? 'text-primary font-semibold' : 'text-muted font-semibold'}>
                    {p.code}
                  </span>{' '}
                  <span className="text-xs">{p.name_th || p.name_pinyin}</span>
                  {c && !c.verified && <span className="text-xs text-warn"> ·</span>}
                </button>
              </li>
            )
          })}
        </ul>
        {listed.length === 0 && <p className="text-sm text-muted py-3">ไม่พบจุดที่ตรงกับคำค้น</p>}
      </section>
    </div>
  )
}

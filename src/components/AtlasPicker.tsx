'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronRight, Crosshair, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { revalidateAtlas } from '@/lib/revalidate'
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
  const [busy, setBusy] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

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
        }
      }),
    [placed, map, species]
  )

  const selected = speciesPoints.find((p) => p.id === selectedId) ?? null
  const selectedCoord = selected ? map[key(selected.id, species)] : undefined

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
    async (p: { x: number; y: number; z: number }) => {
      if (!selected) {
        toast('เลือกจุดจากรายการก่อน แล้วค่อยคลิกบนตัวสัตว์')
        return
      }
      const prev = map[key(selected.id, species)]
      const row: PickerCoord = {
        point_id: selected.id,
        species,
        x: p.x,
        y: p.y,
        z: p.z,
        bilateral: prev?.bilateral ?? true,
        size_scale: prev?.size_scale ?? 1,
        note_th: prev?.note_th ?? null,
        // ย้ายตำแหน่งแล้วต้องตรวจใหม่
        verified: false,
      }
      if (await save(row, selected.slug)) {
        toast.success(`ปัก ${selected.code} แล้ว`)
      }
    },
    [selected, species, map, save]
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
            className="relative w-full h-[320px] sm:h-[460px]"
          />
          <p className="absolute left-3 top-3 text-[11px] bg-surface/90 border border-border rounded-md px-2 py-1 pointer-events-none max-w-[70%]">
            {selected ? (
              <>
                กำลังปัก <strong className="text-accent">{selected.code}</strong> — คลิกบนตัวสัตว์ได้เลย
                {selectedCoord && ' (คลิกใหม่เพื่อย้ายตำแหน่ง)'}
              </>
            ) : (
              'เลือกจุดจากรายการด้านล่างก่อน แล้วคลิกบนตัวสัตว์'
            )}
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

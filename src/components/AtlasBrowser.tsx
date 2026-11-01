'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ExternalLink, RotateCcw } from 'lucide-react'
import type { AtlasPoint, SpeciesModel } from '@/lib/types'
import { lp, t, type Locale } from '@/lib/i18n'

// three ~600 KB — โหลดเฉพาะตอนผู้ใช้เปิดหน้านี้จริง และต้องปิด ssr เพราะใช้ WebGL
const AtlasStage = dynamic(() => import('@/components/AtlasStage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] sm:h-[440px] rounded-[var(--radius)] bg-surface-2 animate-pulse" />
  ),
})

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function readHash() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ''))
}

type Props = {
  models: SpeciesModel[]
  pointsBySpecies: Record<string, AtlasPoint[]>
  locale: Locale
  initialSpecies?: string
  initialPointSlug?: string
}

export default function AtlasBrowser({
  models,
  pointsBySpecies,
  locale,
  initialSpecies,
  initialPointSlug,
}: Props) {
  const d = t(locale).atlas
  const [species, setSpecies] = useState(initialSpecies ?? models[0]?.species ?? 'dog')
  const [query, setQuery] = useState('')

  const points = useMemo(() => pointsBySpecies[species] ?? [], [pointsBySpecies, species])

  const [selectedId, setSelectedId] = useState<string | null>(
    () => points.find((p) => p.slug === initialPointSlug)?.id ?? null
  )

  // ลิงก์จากหน้าจุดมาเป็น /atlas#slug — หน้านี้เป็น static จึงอ่าน hash ฝั่งเบราว์เซอร์
  // แทน searchParams ซึ่งจะทำให้ทั้งหน้ากลายเป็น dynamic
  const hash = useSyncExternalStore(subscribeToHash, readHash, () => '')
  const [seenHash, setSeenHash] = useState(hash)
  if (hash !== seenHash) {
    // ปรับ state ระหว่าง render ตามแบบที่ React แนะนำ แทนการ setState ใน effect
    setSeenHash(hash)
    for (const m of models) {
      const hit = (pointsBySpecies[m.species] ?? []).find((p) => p.slug === hash)
      if (hit) {
        setSpecies(m.species)
        setSelectedId(hit.id)
        break
      }
    }
  }

  const model = models.find((m) => m.species === species)
  const selected = points.find((p) => p.id === selectedId) ?? null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/[-\s]/g, '')
    if (!q) return points
    return points.filter((p) =>
      [p.code, p.name_th, p.name_en, p.name_pinyin]
        .filter((v): v is string => Boolean(v))
        .some((v) => v.toLowerCase().replace(/[-\s]/g, '').includes(q))
    )
  }, [points, query])

  const markers = useMemo(
    () =>
      points.map((p) => ({
        id: p.id,
        code: p.code,
        x: p.x,
        y: p.y,
        z: p.z,
        bilateral: p.bilateral,
        verified: p.verified,
        scale: p.size_scale,
      })),
    [points]
  )

  const label = (p: AtlasPoint) =>
    (locale === 'en' ? p.name_en : p.name_th) || p.name_pinyin || p.code

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {models.map((m) => (
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
            {locale === 'en' && m.label_en ? m.label_en : m.label_th}
            <span className="opacity-70">{(pointsBySpecies[m.species] ?? []).length}</span>
          </button>
        ))}
      </div>

      {points.length === 0 || !model ? (
        <div className="card p-6 text-center text-sm text-muted">{d.emptySpecies}</div>
      ) : (
        <div className="relative">
          <AtlasStage
            modelUrl={model.model_url}
            markers={markers}
            selectedId={selectedId}
            onSelectMarker={setSelectedId}
            className="relative w-full h-[320px] sm:h-[440px]"
            loadingText={d.loading}
            errorText={d.loadError}
          />
          <p className="absolute left-3 top-3 text-[11px] text-muted bg-surface/85 border border-border rounded-md px-2 py-1 pointer-events-none">
            {d.hint}
          </p>
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute right-3 top-3 chip bg-surface hover:border-primary hover:text-primary"
            >
              <RotateCcw size={12} /> {d.clear}
            </button>
          )}
        </div>
      )}

      {selected && (
        <div className="card p-4 flex items-start gap-3 justify-between flex-wrap">
          <div className="min-w-0">
            <p className="font-semibold">
              <span className="text-primary">{selected.code}</span> {label(selected)}
            </p>
            {selected.note_th && (
              <p className="text-sm text-muted mt-1 leading-relaxed">{selected.note_th}</p>
            )}
            {!selected.verified && <p className="text-xs text-warn mt-1">{d.pending}</p>}
          </div>
          <Link
            href={lp(locale, `/points/${selected.slug}`)}
            className="chip hover:border-primary hover:text-primary shrink-0"
          >
            {d.seePoint} <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {/* รายการข้อความ — เป็นเนื้อหาที่ Google อ่านได้ ต่างจาก canvas ด้านบน */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <h2 className="font-bold">
            {d.listTitle} ({points.length})
          </h2>
          <input
            id="atlas-filter"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.filter}
            aria-label={d.filter}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-surface min-w-0 flex-1 sm:flex-none sm:w-60"
          />
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5">
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left card px-3 py-2 text-sm transition hover:border-primary/50 ${
                  p.id === selectedId ? 'border-accent' : ''
                }`}
              >
                <span className="font-semibold text-primary">{p.code}</span> <span>{label(p)}</span>
                {!p.verified && <span className="text-xs text-warn ml-1">· {d.pendingShort}</span>}
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && <p className="text-sm text-muted py-4">{d.emptyFilter}</p>}
      </section>

      {model?.credit && (
        <p className="text-xs text-muted leading-relaxed">
          {d.model}:{' '}
          {model.credit_url ? (
            <a href={model.credit_url} target="_blank" rel="noopener noreferrer" className="underline">
              {model.credit}
            </a>
          ) : (
            model.credit
          )}
          {model.license && (
            <>
              {' · '}
              {d.license}{' '}
              {model.license_url ? (
                <a href={model.license_url} target="_blank" rel="noopener noreferrer" className="underline">
                  {model.license}
                </a>
              ) : (
                model.license
              )}
            </>
          )}
          {' — '}
          {d.generic}
        </p>
      )}
    </div>
  )
}

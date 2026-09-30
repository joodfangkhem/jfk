import Link from 'next/link'
import type { Metadata } from 'next'
import { Layers, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createProtocol } from './actions'
import { isLocale, lp, t, SPECIES_LABEL_I18N, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  return { title: t(locale).protocol.title, robots: { index: false, follow: false } }
}

export default async function ProtocolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'th'
  const d = t(locale)
  const species = SPECIES_LABEL_I18N[locale]

  const supabase = await createClient()
  const { data: protocols } = await supabase
    .from('protocols')
    .select('id, name, species, note, updated_at, protocol_points (point_id)')
    .order('updated_at', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Layers size={19} className="text-primary" /> {d.protocol.title}
        </h1>
        <p className="text-sm text-muted leading-relaxed">{d.protocol.intro}</p>
      </header>

      <form action={createProtocol} className="card p-4 space-y-3">
        <h2 className="font-semibold">{d.protocol.createTitle}</h2>
        <input type="hidden" name="locale" value={locale} />
        <input
          name="name"
          required
          maxLength={80}
          placeholder={d.protocol.namePlaceholder}
          className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
        />
        <div className="flex gap-2">
          <select
            name="species"
            className="h-11 px-3 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary"
          >
            <option value="">{d.protocol.allSpecies}</option>
            <option value="dog">{species.dog}</option>
            <option value="cat">{species.cat}</option>
          </select>
          <input
            name="note"
            maxLength={200}
            placeholder={d.protocol.notePlaceholder}
            className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-surface-2 text-sm outline-none focus:border-primary focus:bg-surface"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
        >
          <Plus size={16} /> {d.protocol.create}
        </button>
      </form>

      {(protocols ?? []).length === 0 ? (
        <p className="text-sm text-muted">{d.protocol.empty}</p>
      ) : (
        <div className="space-y-2.5">
          {(protocols ?? []).map((p) => (
            <Link
              key={p.id}
              href={lp(locale, `/protocols/${p.id}`)}
              className="card p-3.5 block hover:border-primary/50 active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{p.name}</p>
                <span className="chip">
                  {Array.isArray(p.protocol_points) ? p.protocol_points.length : 0} {d.protocol.points}
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                {p.species ? species[p.species] ?? p.species : d.protocol.allSpecies}
                {p.note ? ` · ${p.note}` : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

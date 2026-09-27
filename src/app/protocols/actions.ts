'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createProtocol(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  const species = String(formData.get('species') ?? '') || null
  const note = String(formData.get('note') ?? '').trim() || null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/protocols')

  const { data } = await supabase
    .from('protocols')
    .insert({ user_id: user.id, name, species, note })
    .select('id')
    .single()

  revalidatePath('/protocols')
  if (data) redirect(`/protocols/${data.id}`)
}

export async function deleteProtocol(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const supabase = await createClient()
  await supabase.from('protocols').delete().eq('id', id)
  revalidatePath('/protocols')
  redirect('/protocols')
}

export async function addPointToProtocol(formData: FormData) {
  const protocolId = String(formData.get('protocol_id') ?? '')
  const codeRaw = String(formData.get('code') ?? '').trim()
  if (!protocolId || !codeRaw) return

  const supabase = await createClient()
  const code = codeRaw.toUpperCase().replace(/\s+/g, '-')

  const { data: point } = await supabase
    .from('points')
    .select('id')
    .or(`code.eq.${code},slug.eq.${codeRaw.toLowerCase()}`)
    .maybeSingle()

  if (point) {
    const { count } = await supabase
      .from('protocol_points')
      .select('*', { count: 'exact', head: true })
      .eq('protocol_id', protocolId)

    await supabase
      .from('protocol_points')
      .upsert(
        { protocol_id: protocolId, point_id: point.id, sort_order: (count ?? 0) + 1 },
        { onConflict: 'protocol_id,point_id' }
      )
  }

  revalidatePath(`/protocols/${protocolId}`)
}

export async function removePointFromProtocol(formData: FormData) {
  const protocolId = String(formData.get('protocol_id') ?? '')
  const pointId = String(formData.get('point_id') ?? '')
  if (!protocolId || !pointId) return

  const supabase = await createClient()
  await supabase
    .from('protocol_points')
    .delete()
    .eq('protocol_id', protocolId)
    .eq('point_id', pointId)

  revalidatePath(`/protocols/${protocolId}`)
}

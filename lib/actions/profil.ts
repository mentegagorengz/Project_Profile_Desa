'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfilInput = {
  sambutan_lurah: string
  foto_lurah_url: string | null
  visi: string
  misi: string
  sejarah: string
  jumlah_penduduk: number
  jumlah_kk: number
  jumlah_rt: number
  jumlah_rw: number
  google_maps_embed_url: string
}

export async function updateProfil(id: string, data: ProfilInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profil_kelurahan')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/profil')
  revalidatePath('/')
}

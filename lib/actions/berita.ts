'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBerita(formData: {
  judul: string
  slug: string
  konten: string
  status: 'draft' | 'published'
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('berita_desa').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}

export async function updateBerita(id: string, formData: {
  judul: string
  slug: string
  konten: string
  status: 'draft' | 'published'
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('berita_desa')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}

export async function deleteBerita(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('berita_desa').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}

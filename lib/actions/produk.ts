'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProdukInput = {
  nama_produk: string
  kategori: string
  harga_per_kg: number
}

export async function createProduk(data: ProdukInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').insert({ ...data, stok_saat_ini: 0 })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}

export async function updateProduk(id: string, data: ProdukInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}

export async function deleteProduk(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}

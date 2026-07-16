'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type CheckoutItem = {
  produk_id: string
  jumlah_kg: number
  harga_satuan: number
}

export async function checkoutTransaksi(items: CheckoutItem[], namaPelanggan: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const total = items.reduce((sum, i) => sum + i.jumlah_kg * i.harga_satuan, 0)

  const { data: transaksi, error: txError } = await supabase
    .from('transaksi')
    .insert({
      nama_pelanggan: namaPelanggan,
      admin_id: user.id,
      total_bayar: total,
      metode_pembayaran: 'tunai',
      status: 'aktif',
    })
    .select()
    .single()

  if (txError) throw new Error(txError.message)

  const detailRows = items.map((i) => ({
    transaksi_id: transaksi.id,
    produk_id: i.produk_id,
    jumlah_kg: i.jumlah_kg,
    harga_satuan: i.harga_satuan,
    subtotal: i.jumlah_kg * i.harga_satuan,
  }))

  const { error: detailError } = await supabase.from('detail_transaksi').insert(detailRows)
  if (detailError) throw new Error(detailError.message)

  for (const item of items) {
    const { error: rpcError } = await supabase.rpc('increment_stok', {
      p_produk_id: item.produk_id,
      p_jumlah: item.jumlah_kg,
    })
    if (rpcError) throw new Error(rpcError.message)
  }

  revalidatePath('/admin/pos')
  revalidatePath('/admin/produk')
  return transaksi
}

export async function batalkanTransaksi(id: string, alasan: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('transaksi')
    .update({ status: 'dibatalkan', alasan_pembatalan: alasan })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pos/riwayat')
  revalidatePath('/admin/laporan')
}

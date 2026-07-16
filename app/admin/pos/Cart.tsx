'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { checkoutTransaksi } from '@/lib/actions/transaksi'
import { useRouter } from 'next/navigation'

export function Cart() {
  const { items, removeItem, clear, total } = useCartStore()
  const [namaPelanggan, setNamaPelanggan] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    try {
      await checkoutTransaksi(
        items.map((i) => ({ produk_id: i.produk_id, jumlah_kg: i.jumlah_kg, harga_satuan: i.harga_per_kg })),
        namaPelanggan || null
      )
      clear()
      setNamaPelanggan('')
      router.refresh()
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded border p-4 space-y-3 bg-card sticky top-4">
      <h2 className="font-semibold text-lg">Keranjang</h2>
      <Input placeholder="Nama pelanggan (opsional)" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} />
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((i) => (
          <div key={i.produk_id} className="flex justify-between text-sm items-center">
            <span>{i.nama_produk} ({i.jumlah_kg}kg)</span>
            <div className="flex items-center gap-3">
              <span>Rp{(i.harga_per_kg * i.jumlah_kg).toLocaleString('id-ID')}</span>
              <button onClick={() => removeItem(i.produk_id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">hapus</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 font-bold flex justify-between text-lg">
        <span>Total</span>
        <span>Rp{total().toLocaleString('id-ID')}</span>
      </div>
      <Button onClick={handleCheckout} disabled={loading || items.length === 0} className="w-full" size="lg">
        {loading ? 'Memproses...' : 'Checkout Transaksi'}
      </Button>
    </div>
  )
}

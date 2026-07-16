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
      alert('Checkout transaksi berhasil!')
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border-2 border-mughal-green bg-white p-4 space-y-3 sticky top-20 shadow-sm">
      <h2 className="font-display font-semibold text-lg text-prussian">Keranjang</h2>
      <Input
        placeholder="Nama pelanggan (opsional)"
        value={namaPelanggan}
        onChange={(e) => setNamaPelanggan(e.target.value)}
        className="border-pastel-blue focus:border-teal-blue"
      />
      <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
        {items.map((i) => (
          <div key={i.produk_id} className="flex justify-between text-sm items-center">
            <span className="text-prussian font-medium">
              {i.nama_produk} ({i.jumlah_kg}kg)
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-prussian font-semibold">
                Rp{(i.harga_per_kg * i.jumlah_kg).toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => removeItem(i.produk_id)}
                className="text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                hapus
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-prussian/50 italic text-center py-4">Keranjang masih kosong.</p>
        )}
      </div>
      <div className="border-t border-pastel-blue pt-3 font-bold flex justify-between text-lg text-prussian">
        <span>Total</span>
        <span className="font-mono text-mughal-green">Rp{total().toLocaleString('id-ID')}</span>
      </div>
      <Button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-mughal-green hover:bg-mughal-green/90 text-white font-display"
        size="lg"
      >
        {loading ? 'Memproses...' : 'Checkout'}
      </Button>
    </div>
  )
}

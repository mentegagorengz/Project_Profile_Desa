'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (items.length > 0 && !loading) {
          handleCheckout()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [items, loading])

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
      <h2 className="font-display font-semibold text-lg text-foreground">Keranjang</h2>
      <Input
        placeholder="Nama pelanggan (opsional)"
        value={namaPelanggan}
        onChange={(e) => setNamaPelanggan(e.target.value)}
        className="border-border focus:border-ring"
      />
      <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
        {items.map((i) => (
          <div key={i.produk_id} className="flex justify-between text-sm items-center">
            <span className="text-foreground font-medium">
              {i.nama_produk} ({i.jumlah_kg}kg)
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-foreground font-semibold">
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
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <p className="text-sm font-medium text-foreground">Keranjang kosong</p>
            <p className="text-xs text-muted-foreground mt-1">Pilih produk di sebelah kiri untuk menambah pesanan.</p>
          </div>
        )}
      </div>
      <div className="border-t border-border pt-3 font-bold flex justify-between text-lg text-foreground">
        <span>Total</span>
        <span className="font-mono text-mughal-green">Rp{total().toLocaleString('id-ID')}</span>
      </div>
      <Button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all"
        size="lg"
      >
        {loading ? 'Memproses...' : 'Checkout Transaksi'}
      </Button>
    </div>
  )
}

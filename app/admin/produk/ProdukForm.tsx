'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProduk } from '@/lib/actions/produk'

export function ProdukForm() {
  const [nama, setNama] = useState('')
  const [kategori, setKategori] = useState('')
  const [harga, setHarga] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createProduk({ nama_produk: nama, kategori, harga_per_kg: parseFloat(harga) || 0 })
    setNama('')
    setKategori('')
    setHarga('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end rounded border p-4 bg-card">
      <div className="flex-1">
        <label className="text-sm font-medium">Nama Produk</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium">Kategori</label>
        <Input value={kategori} onChange={(e) => setKategori(e.target.value)} required />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium">Harga/kg</label>
        <Input type="number" min="0" step="1" value={harga} onChange={(e) => setHarga(e.target.value)} required />
      </div>
      <Button type="submit">Tambah</Button>
    </form>
  )
}

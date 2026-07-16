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
    try {
      await createProduk({ nama_produk: nama, kategori, harga_per_kg: parseFloat(harga) || 0 })
      setNama('')
      setKategori('')
      setHarga('')
      alert('Produk berhasil ditambahkan!')
    } catch (e: any) {
      alert('Gagal menambahkan produk: ' + e.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end rounded-lg border border-pastel-blue p-4 bg-white shadow-sm">
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Nama Produk</label>
        <Input 
          value={nama} 
          onChange={(e) => setNama(e.target.value)} 
          required 
          className="border-pastel-blue focus:border-teal-blue"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Kategori</label>
        <Input 
          value={kategori} 
          onChange={(e) => setKategori(e.target.value)} 
          required 
          className="border-pastel-blue focus:border-teal-blue"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Harga/kg</label>
        <Input 
          type="number" 
          min="0" 
          step="1" 
          value={harga} 
          onChange={(e) => setHarga(e.target.value)} 
          required 
          className="border-pastel-blue focus:border-teal-blue font-mono"
        />
      </div>
      <Button type="submit" className="w-full md:w-auto bg-prussian hover:bg-prussian/90 text-white font-display">
        Tambah
      </Button>
    </form>
  )
}

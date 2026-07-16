'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProduk, updateProduk, deleteProduk } from '@/lib/actions/produk'
import { Pencil, Trash2, X, Check } from 'lucide-react'

type Produk = {
  id: string
  nama_produk: string
  kategori: string
  harga_per_kg: number
}

// Form tambah produk baru
export function ProdukForm() {
  const [nama, setNama] = useState('')
  const [kategori, setKategori] = useState('')
  const [harga, setHarga] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createProduk({ nama_produk: nama, kategori, harga_per_kg: parseFloat(harga) || 0 })
      setNama('')
      setKategori('')
      setHarga('')
      alert('Produk berhasil ditambahkan!')
    } catch (e: any) {
      alert('Gagal menambahkan produk: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end rounded-lg border border-pastel-blue p-4 bg-white shadow-sm">
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Nama Produk</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} required className="border-pastel-blue focus:border-teal-blue" />
      </div>
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Kategori</label>
        <Input value={kategori} onChange={(e) => setKategori(e.target.value)} required className="border-pastel-blue focus:border-teal-blue" />
      </div>
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-prussian mb-1 block">Harga/kg (Rp)</label>
        <Input
          type="number" min="0" step="1"
          value={harga} onChange={(e) => setHarga(e.target.value)} required
          className="border-pastel-blue focus:border-teal-blue font-mono"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full md:w-auto bg-prussian hover:bg-prussian/90 text-white font-display">
        {loading ? 'Menyimpan...' : 'Tambah'}
      </Button>
    </form>
  )
}

// Row produk dengan Edit inline & Hapus
export function ProdukRow({ produk }: { produk: Produk }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nama_produk: produk.nama_produk, kategori: produk.kategori, harga_per_kg: produk.harga_per_kg })
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await updateProduk(produk.id, form)
      setEditing(false)
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus produk "${produk.nama_produk}"?`)) return
    setLoading(true)
    try {
      await deleteProduk(produk.id)
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
      setLoading(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-teal-blue bg-white p-4 flex flex-col md:flex-row gap-3 items-end shadow-sm">
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-prussian mb-1 block">Nama Produk</label>
          <Input value={form.nama_produk} onChange={(e) => setForm({ ...form, nama_produk: e.target.value })} className="border-pastel-blue focus:border-teal-blue" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-prussian mb-1 block">Kategori</label>
          <Input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="border-pastel-blue focus:border-teal-blue" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-prussian mb-1 block">Harga/kg (Rp)</label>
          <Input
            type="number" min="0"
            value={form.harga_per_kg}
            onChange={(e) => setForm({ ...form, harga_per_kg: parseFloat(e.target.value) || 0 })}
            className="border-pastel-blue focus:border-teal-blue font-mono"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={loading} className="bg-mughal-green hover:bg-mughal-green/90 text-white">
            <Check className="w-3 h-3 mr-1" /> Simpan
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-prussian/60">
            <X className="w-3 h-3 mr-1" /> Batal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-pastel-blue bg-white p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-prussian">{produk.nama_produk}</p>
        <p className="text-xs text-teal-blue">{produk.kategori}</p>
      </div>
      <p className="font-mono text-prussian font-semibold text-sm shrink-0">
        Rp{produk.harga_per_kg.toLocaleString('id-ID')}/kg
      </p>
      <div className="flex items-center gap-1 shrink-0">
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="text-prussian/60 hover:text-prussian">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

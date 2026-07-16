'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'

type Produk = {
  id: string
  nama_produk: string
  kategori: string
  harga_per_kg: number
}

export function ProductGrid({ produk }: { produk: Produk[] }) {
  const [jumlah, setJumlah] = useState<Record<string, string>>({})
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {produk.map((p) => (
        <Card key={p.id} className="p-4 space-y-2 border-pastel-blue bg-white shadow-sm">
          <p className="font-medium text-prussian">{p.nama_produk}</p>
          <p className="text-sm text-teal-blue">
            {p.kategori} —{' '}
            <span className="font-mono text-mughal-green font-semibold">
              Rp{p.harga_per_kg.toLocaleString('id-ID')}/kg
            </span>
          </p>
          <div className="flex gap-2 pt-1">
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="kg"
              value={jumlah[p.id] ?? ''}
              onChange={(e) => setJumlah({ ...jumlah, [p.id]: e.target.value })}
              className="border-pastel-blue focus:border-teal-blue font-mono"
            />
            <Button
              onClick={() => {
                const kg = parseFloat(jumlah[p.id] ?? '0')
                if (kg > 0) {
                  addItem({ produk_id: p.id, nama_produk: p.nama_produk, harga_per_kg: p.harga_per_kg }, kg)
                  setJumlah({ ...jumlah, [p.id]: '' })
                }
              }}
              className="bg-prussian hover:bg-prussian/90 text-white"
            >
              Tambah
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from './ProductGrid'
import { Cart } from './Cart'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function PosPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kasir POS (Bank Sampah)</h1>
        <Link href="/admin/pos/riwayat">
          <Button variant="outline">Lihat Riwayat Transaksi</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <ProductGrid produk={produk ?? []} />
        </div>
        <Cart />
      </div>
    </div>
  )
}

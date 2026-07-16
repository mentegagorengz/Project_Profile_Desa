import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from './ProductGrid'
import { Cart } from './Cart'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function PosPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  return (
    <div className="space-y-6">
      <PageHeader 
        eyebrow="Transaksi" 
        title="Kasir POS" 
        action={
          <Link href="/admin/pos/riwayat">
            <Button variant="outline" className="border-pastel-blue text-prussian hover:bg-light-silver">
              Lihat Riwayat Transaksi
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <ProductGrid produk={produk ?? []} />
        </div>
        <Cart />
      </div>
    </div>
  )
}

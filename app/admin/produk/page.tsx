import { createClient } from '@/lib/supabase/server'
import { ProdukForm, ProdukRow } from './ProdukForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase
    .from('produk_bumdes')
    .select('*')
    .order('nama_produk')

  return (
    <div className="space-y-6">
      <PageHeader title="Master Produk" description="Kelola daftar harga bank sampah." />
      <ProdukForm />
      <div className="space-y-2">
        {produk && produk.length > 0 ? (
          produk.map((p) => (
            <ProdukRow key={p.id} produk={p} />
          ))
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card">
            <p className="text-muted-foreground italic text-sm">Belum ada produk. Tambahkan produk pertama di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

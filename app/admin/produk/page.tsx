import { createClient } from '@/lib/supabase/server'
import { ProdukForm } from './ProdukForm'
import { deleteProduk } from '@/lib/actions/produk'
import { Button } from '@/components/ui/button'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteProduk(formData.get('id') as string)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Master Produk Bank Sampah</h1>
      <ProdukForm />
      <div className="rounded-md border bg-card text-card-foreground">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kategori</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Harga/kg</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stok (kg)</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {produk?.map((p) => (
              <tr key={p.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">{p.nama_produk}</td>
                <td className="p-4 align-middle">{p.kategori}</td>
                <td className="p-4 align-middle">Rp{p.harga_per_kg.toLocaleString('id-ID')}</td>
                <td className="p-4 align-middle">{p.stok_saat_ini}</td>
                <td className="p-4 align-middle text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

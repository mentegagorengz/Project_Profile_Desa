import { createClient } from '@/lib/supabase/server'
import { ProdukForm } from './ProdukForm'
import { deleteProduk } from '@/lib/actions/produk'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteProduk(formData.get('id') as string)
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Bank Sampah" title="Master Produk" />
      <ProdukForm />
      <div className="rounded-lg border border-pastel-blue bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-silver">
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Nama</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Kategori</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Harga/kg</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Stok (kg)</th>
              <th className="h-11 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {produk?.map((p) => (
              <tr key={p.id} className="border-t border-pastel-blue/60">
                <td className="p-4 text-prussian font-medium">{p.nama_produk}</td>
                <td className="p-4 text-teal-blue">{p.kategori}</td>
                <td className="p-4 font-mono text-prussian">Rp{p.harga_per_kg.toLocaleString('id-ID')}</td>
                <td className="p-4 font-mono text-mughal-green">{p.stok_saat_ini}</td>
                <td className="p-4 text-right">
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

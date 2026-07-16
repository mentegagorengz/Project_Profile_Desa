import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { batalkanTransaksi } from '@/lib/actions/transaksi'
import Link from 'next/link'

export default async function RiwayatPage() {
  const supabase = await createClient()
  const { data: transaksi } = await supabase
    .from('transaksi')
    .select('*, detail_transaksi(*, produk_bumdes(nama_produk))')
    .order('created_at', { ascending: false })
    .limit(50)

  async function handleBatal(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await batalkanTransaksi(id, 'Dibatalkan oleh admin')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
        <Link href="/admin/pos">
          <Button variant="outline">Kembali ke POS</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {transaksi?.map((t) => (
          <div key={t.id} className="rounded border p-4 bg-card shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">{t.nama_pelanggan || 'Pelanggan Anonim'}</p>
                <p className="text-sm text-muted-foreground">{new Date(t.created_at).toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Rp{t.total_bayar.toLocaleString('id-ID')}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {t.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-3 mb-4">
              <p className="text-sm font-semibold mb-2">Detail Item:</p>
              <ul className="text-sm space-y-1">
                {t.detail_transaksi?.map((dt: any) => (
                  <li key={dt.id} className="flex justify-between text-muted-foreground">
                    <span>{dt.produk_bumdes?.nama_produk} ({dt.jumlah_kg} kg x Rp{dt.harga_satuan.toLocaleString('id-ID')})</span>
                    <span>Rp{dt.subtotal.toLocaleString('id-ID')}</span>
                  </li>
                ))}
              </ul>
            </div>

            {t.status === 'aktif' && (
              <form action={handleBatal} className="border-t pt-3 flex justify-end">
                <input type="hidden" name="id" value={t.id} />
                <Button variant="destructive" size="sm" type="submit">Batalkan Transaksi</Button>
              </form>
            )}
            {t.status === 'dibatalkan' && t.alasan_pembatalan && (
              <div className="border-t pt-3">
                <p className="text-sm text-red-500 italic">Alasan: {t.alasan_pembatalan}</p>
              </div>
            )}
          </div>
        ))}
        {(!transaksi || transaksi.length === 0) && (
          <p className="text-muted-foreground italic">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  )
}

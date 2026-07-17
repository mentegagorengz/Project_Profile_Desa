import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { batalkanTransaksi } from '@/lib/actions/transaksi'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'

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
      <PageHeader 
        title="Riwayat Transaksi" 
        description="50 transaksi terbaru."
        action={
          <Link href="/admin/pos">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Kembali ke POS
            </Button>
          </Link>
        }
      />
      <div className="space-y-4">
        {transaksi?.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg text-foreground">{t.nama_pelanggan || 'Pelanggan Anonim'}</p>
                <p className="text-xs font-mono text-muted-foreground">{new Date(t.created_at).toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-lg text-foreground">
                  Rp{t.total_bayar.toLocaleString('id-ID')}
                </p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${t.status === 'aktif' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                  {t.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="border-t border-border/60 pt-3 mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Detail Item</p>
              <ul className="text-sm space-y-1.5">
                {t.detail_transaksi?.map((dt: any) => (
                  <li key={dt.id} className="flex justify-between text-foreground/80">
                    <span>
                      {dt.produk_bumdes?.nama_produk} ({dt.jumlah_kg} kg x Rp{dt.harga_satuan.toLocaleString('id-ID')})
                    </span>
                    <span className="font-mono text-foreground/70">
                      Rp{dt.subtotal.toLocaleString('id-ID')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {t.status === 'aktif' && (
              <form action={handleBatal} className="border-t border-border/60 pt-3 flex justify-end">
                <input type="hidden" name="id" value={t.id} />
                <Button variant="destructive" size="sm" type="submit" className="font-display">
                  Batalkan Transaksi
                </Button>
              </form>
            )}
            {t.status === 'dibatalkan' && t.alasan_pembatalan && (
              <div className="border-t border-border/60 pt-3">
                <p className="text-xs text-destructive italic">Alasan Batal: {t.alasan_pembatalan}</p>
              </div>
            )}
          </div>
        ))}
        {(!transaksi || transaksi.length === 0) && (
          <p className="text-muted-foreground italic text-center py-12">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  )
}

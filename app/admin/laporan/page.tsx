import { getLaporanHarian, getLaporanBulanan } from '@/lib/queries/laporan'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ tanggal?: string }>
}) {
  const { tanggal } = await searchParams
  const today = tanggal ?? new Date().toISOString().slice(0, 10)
  const now = new Date()

  const [harian, bulanan] = await Promise.all([
    getLaporanHarian(today),
    getLaporanBulanan(now.getFullYear(), now.getMonth() + 1),
  ])

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Transaksi" description="Rekap harian dan bulanan." />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-pastel-blue bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-display font-semibold text-lg text-prussian">
              Rekap Harian ({today})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-3xl font-mono font-bold text-mughal-green">
                Rp{harian.totalOmzet.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground">
                Jumlah Transaksi: <span className="font-mono font-semibold">{harian.jumlahTransaksi}</span>
              </p>
              
              <div className="pt-4 mt-4 border-t border-border/60">
                <p className="font-display font-medium text-sm text-foreground mb-3">Volume Sampah Masuk:</p>
                <ul className="text-sm space-y-2">
                  {Object.entries(harian.kgPerKategori).map(([kategori, kg]) => (
                    <li key={kategori} className="flex justify-between items-center text-foreground/80">
                      <span>{kategori}</span>
                      <span className="font-mono font-semibold text-primary">{kg} kg</span>
                    </li>
                  ))}
                  {Object.keys(harian.kgPerKategori).length === 0 && (
                    <li className="text-muted-foreground italic text-sm">Belum ada data sampah masuk.</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-display font-semibold text-lg text-foreground">
              Rekap Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-3xl font-mono font-bold text-mughal-green">
                Rp{bulanan.totalOmzet.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground">
                Jumlah Transaksi: <span className="font-mono font-semibold">{bulanan.jumlahTransaksi}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

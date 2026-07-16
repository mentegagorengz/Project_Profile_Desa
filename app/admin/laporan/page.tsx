import { getLaporanHarian, getLaporanBulanan } from '@/lib/queries/laporan'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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
      <h1 className="text-2xl font-bold">Laporan Transaksi</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rekap Harian ({today})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Rp{harian.totalOmzet.toLocaleString('id-ID')}</p>
              <p className="text-muted-foreground">{harian.jumlahTransaksi} Transaksi</p>
              
              <div className="pt-4 mt-4 border-t">
                <p className="font-semibold mb-2">Volume Sampah Masuk:</p>
                <ul className="text-sm space-y-1">
                  {Object.entries(harian.kgPerKategori).map(([kategori, kg]) => (
                    <li key={kategori} className="flex justify-between">
                      <span>{kategori}</span>
                      <span className="font-medium">{kg} kg</span>
                    </li>
                  ))}
                  {Object.keys(harian.kgPerKategori).length === 0 && (
                    <li className="text-muted-foreground italic">Belum ada data sampah masuk.</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekap Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Rp{bulanan.totalOmzet.toLocaleString('id-ID')}</p>
              <p className="text-muted-foreground">{bulanan.jumlahTransaksi} Transaksi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

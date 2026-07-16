import { createClient } from '@/lib/supabase/server'

export async function getLaporanHarian(tanggal: string) {
  const supabase = await createClient()
  const start = `${tanggal}T00:00:00`
  const end = `${tanggal}T23:59:59`

  const { data, error } = await supabase
    .from('transaksi')
    .select('total_bayar, detail_transaksi(jumlah_kg, produk_bumdes(kategori))')
    .eq('status', 'aktif')
    .gte('created_at', start)
    .lte('created_at', end)

  if (error) throw new Error(error.message)

  const totalOmzet = data.reduce((sum, t) => sum + t.total_bayar, 0)
  const kgPerKategori: Record<string, number> = {}
  
  for (const t of data) {
    for (const d of t.detail_transaksi as any[]) {
      const kategori = d.produk_bumdes?.kategori || 'Lainnya'
      kgPerKategori[kategori] = (kgPerKategori[kategori] ?? 0) + d.jumlah_kg
    }
  }

  return { totalOmzet, kgPerKategori, jumlahTransaksi: data.length }
}

export async function getLaporanBulanan(tahun: number, bulan: number) {
  const supabase = await createClient()
  const start = new Date(tahun, bulan - 1, 1).toISOString()
  const end = new Date(tahun, bulan, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('transaksi')
    .select('total_bayar')
    .eq('status', 'aktif')
    .gte('created_at', start)
    .lte('created_at', end)

  if (error) throw new Error(error.message)

  return {
    totalOmzet: data.reduce((sum, t) => sum + t.total_bayar, 0),
    jumlahTransaksi: data.length,
  }
}

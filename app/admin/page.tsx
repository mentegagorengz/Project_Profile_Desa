import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Newspaper, Package, ShoppingCart, BarChart3, User, Image } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ data: berita }, { data: produk }, { data: transaksiHariIni }] = await Promise.all([
    supabase.from('berita_desa').select('id, judul, status', { count: 'exact' }),
    supabase.from('produk_bumdes').select('id, nama_produk, stok_saat_ini'),
    supabase.from('transaksi').select('id, total_bayar').eq('status', 'aktif').gte('created_at', new Date().toISOString().slice(0, 10)),
  ])

  const totalOmzetHariIni = transaksiHariIni?.reduce((sum, t) => sum + (t.total_bayar ?? 0), 0) ?? 0

  const stats = [
    {
      label: 'Berita Dipublikasikan',
      value: berita?.filter((b) => b.status === 'published').length ?? 0,
      icon: Newspaper,
      href: '/admin/berita',
    },
    {
      label: 'Jenis Produk',
      value: produk?.length ?? 0,
      icon: Package,
      href: '/admin/produk',
    },
    {
      label: 'Transaksi Hari Ini',
      value: transaksiHariIni?.length ?? 0,
      icon: ShoppingCart,
      href: '/admin/pos',
    },
    {
      label: 'Omzet Hari Ini',
      value: `Rp${totalOmzetHariIni.toLocaleString('id-ID')}`,
      isMoney: true,
      icon: BarChart3,
      href: '/admin/laporan',
    },
  ]

  const shortcuts = [
    { href: '/admin/pos', label: 'Buka Kasir POS', icon: ShoppingCart, desc: 'Catat transaksi bank sampah' },
    { href: '/admin/berita', label: 'Kelola Berita', icon: Newspaper, desc: 'Tulis dan publikasikan berita' },
    { href: '/admin/profil', label: 'Edit Profil Kelurahan', icon: User, desc: 'Sambutan, visi-misi, infografis' },
    { href: '/admin/galeri', label: 'Kelola Galeri', icon: Image, desc: 'Upload dan hapus foto kegiatan' },
    { href: '/admin/produk', label: 'Master Produk', icon: Package, desc: 'Kelola daftar harga sampah' },
    { href: '/admin/laporan', label: 'Lihat Laporan', icon: BarChart3, desc: 'Rekap harian dan bulanan' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Panel pengelolaan Kelurahan Manembo-nembo Tengah</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-card rounded-xl border border-border p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <s.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
            </div>
            <p className={`font-mono text-2xl font-bold text-foreground ${s.isMoney ? 'text-lg' : ''}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="font-display font-semibold text-foreground mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                <s.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

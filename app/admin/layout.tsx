import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Newspaper, Package, ShoppingCart, BarChart3, User, Image, LayoutDashboard, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/berita', label: 'Berita Desa', icon: Newspaper },
  { href: '/admin/produk', label: 'Master Produk', icon: Package },
  { href: '/admin/pos', label: 'Kasir POS', icon: ShoppingCart },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/profil', label: 'Profil Kelurahan', icon: User },
  { href: '/admin/galeri', label: 'Galeri Foto', icon: Image },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-light-silver">
      {/* Sidebar */}
      <aside className="w-60 bg-prussian flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-pastel-blue mb-1">Admin Panel</p>
          <p className="font-display font-bold text-white text-sm leading-tight">Kelurahan Manembo-nembo Tengah</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors group"
            >
              <item.icon className="w-4 h-4 text-pastel-blue group-hover:text-white transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="font-mono text-xs text-pastel-blue truncate">{user.email}</p>
          <form action="/auth/signout" method="POST" className="mt-2">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-pastel-blue px-6 py-4 sticky top-0 z-10">
          <p className="text-prussian/50 text-sm font-mono">Panel Admin Kelurahan</p>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Newspaper, Package, ShoppingCart, BarChart3, User, Image } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/berita', label: 'Berita Desa', icon: Newspaper },
  { href: '/admin/produk', label: 'Master Produk', icon: Package },
  { href: '/admin/pos', label: 'Kasir POS', icon: ShoppingCart },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/profil', label: 'Profil Kelurahan', icon: User },
  { href: '/admin/galeri', label: 'Galeri Foto', icon: Image },
]

export function SidebarNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin')
  }

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${
              active
                ? 'bg-primary text-white'
                : 'text-green-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-green-300 group-hover:text-white'}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

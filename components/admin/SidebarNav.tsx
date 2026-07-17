'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Newspaper, Package, ShoppingCart,
  BarChart3, User, Image, ChevronDown,
} from 'lucide-react'

type SubItem = { href: string; label: string }

type NavItem = {
  href: string; label: string; icon: typeof LayoutDashboard
  exact?: boolean; children?: SubItem[]
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Utama',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Konten',
    items: [
      { href: '/admin/berita', label: 'Berita', icon: Newspaper },
      { href: '/admin/galeri', label: 'Galeri', icon: Image },
      { href: '/admin/profil', label: 'Profil', icon: User },
    ],
  },
  {
    label: 'Transaksi',
    items: [
      {
        href: '/admin/pos', label: 'Kasir POS', icon: ShoppingCart,
        children: [{ href: '/admin/pos/riwayat', label: 'Riwayat Transaksi' }],
      },
      { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
    ],
  },
  {
    label: 'Master',
    items: [
      { href: '/admin/produk', label: 'Produk', icon: Package },
    ],
  },
]

function isActiveItem(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname.startsWith(href) && (href !== '/admin' || pathname === '/admin')
}

function isActiveParent(pathname: string, item: NavItem) {
  if (isActiveItem(pathname, item.href, item.exact)) return true
  return item.children?.some((c) => pathname.startsWith(c.href)) ?? false
}

export function SidebarNav() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Set<string>>(() => {
    const set = new Set<string>()
    for (const s of navSections)
      for (const item of s.items)
        if (item.children && isActiveParent(pathname, item)) set.add(item.href)
    return set
  })

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href); else next.add(href)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {navSections.map((section) => (
        <div key={section.label}>
          <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {section.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const isOpen = openMenus.has(item.href)
              const isActive = isActiveItem(pathname, item.href, item.exact)

              return (
                <div key={item.href}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleMenu(item.href)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )}

                  {hasChildren && isOpen && (
                    <div className="mt-0.5">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`relative flex items-center rounded-lg py-2 pl-10 pr-3 text-sm transition-colors ${
                            pathname.startsWith(child.href)
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
                          <span className="relative">
                            <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-3 h-px bg-white/10" />
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

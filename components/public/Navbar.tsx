'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Sambutan', href: '/#sambutan' },
    { label: 'Profil', href: '/#profil' },
    { label: 'Statistik', href: '/#infografis' },
    { label: 'Berita', href: '/#berita' },
    { label: 'Peta', href: '/#lokasi' },
    { label: 'Harga Sampah', href: '/#harga' },
    { label: 'Galeri', href: '/galeri' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pastel-blue/80 shadow-sm">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-prussian text-sm sm:text-base leading-none">
              Manembo-nembo Tengah
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-prussian/80 hover:text-teal-blue transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider bg-prussian text-white px-3 py-1.5 rounded-lg hover:bg-prussian/95 transition-colors font-semibold"
            >
              Login <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-prussian hover:text-teal-blue hover:bg-light-silver/50 transition-colors"
            >
              {isOpen ? <X className="h-5 h-5" /> : <Menu className="h-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-pastel-blue bg-white py-4 px-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-mono text-xs uppercase tracking-wider text-prussian/80 hover:text-teal-blue transition-colors py-2 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-pastel-blue/60">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1 font-mono text-xs uppercase tracking-wider bg-prussian text-white py-2.5 rounded-lg hover:bg-prussian/95 transition-colors font-semibold w-full"
            >
              Login Staf / Admin <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

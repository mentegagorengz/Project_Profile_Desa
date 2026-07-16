'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-pastel-blue shadow-sm py-0' : 'bg-transparent py-2'}`}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-display font-bold text-sm sm:text-base leading-none transition-colors duration-300 ${isScrolled ? 'text-prussian' : 'text-white'}`}>
              Manembo-nembo Tengah
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-mono text-xs uppercase tracking-wider transition-colors font-medium ${isScrolled ? 'text-prussian/80 hover:text-teal-blue' : 'text-white/80 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${isScrolled ? 'text-prussian hover:text-teal-blue hover:bg-light-silver/50' : 'text-white hover:bg-white/10'}`}
            >
              {isOpen ? <X className="h-5 h-5" /> : <Menu className="h-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-pastel-blue/50 px-6 py-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-display text-sm font-semibold text-prussian hover:text-teal-blue hover:translate-x-1 transition-all py-2 border-b border-light-silver"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <header
      id="beranda"
      className="relative overflow-hidden bg-prussian"
      style={{
        background: 'linear-gradient(135deg, #103A57 0%, #1a5276 50%, #0d2e42 100%)',
      }}
    >
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Accent orbs */}
      <div
        className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A9D3C5 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #307B8E 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-3xl px-6 pt-32 pb-20 md:pt-40 md:pb-28 text-center md:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-pastel-blue animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-pastel-blue">
            Website Resmi Kelurahan
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
          Kelurahan<br />
          <span className="text-pastel-blue">Manembo-nembo Tengah</span>
        </h1>
        <p className="text-pastel-blue/80 text-sm md:text-base mt-2 mb-8">
          Kecamatan Matuari · Kota Bitung · Sulawesi Utara
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Link
            href="/#profil"
            className="inline-flex items-center justify-center gap-2 bg-mughal-green hover:bg-mughal-green/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 font-mono text-sm uppercase tracking-wide"
          >
            Lihat Profil
          </Link>
          <Link
            href="/#berita"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 font-mono text-sm uppercase tracking-wide"
          >
            Baca Berita
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative pb-8 flex justify-center">
        <a href="/#sambutan" className="text-pastel-blue/60 hover:text-pastel-blue transition-colors animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </header>
  )
}

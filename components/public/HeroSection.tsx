import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <header
      id="beranda"
      className="relative bg-gradient-to-br from-mughal-green via-primary to-green-700 text-white overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80')] bg-cover bg-center pointer-events-none" />
      <div className="relative max-w-3xl mx-auto md:max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-primary-foreground mb-5">
            <Leaf size={12} /> Bank Sampah Kelurahan
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Manembo-nembo Tengah<br />
            <span className="text-primary-foreground/80">Bersih, Makmur, Lestari</span>
          </h1>
           <p className="text-primary-foreground/80 text-sm md:text-lg leading-relaxed mb-8">
            Bergabunglah dalam program bank sampah plastik kelurahan kami. Tukar sampah plastik Anda dengan nilai ekonomi nyata dan bantu jaga lingkungan bersama-sama.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/berita">
              <button className="bg-white text-primary hover:bg-primary/10 font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2">
                Lihat Berita <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/#profil">
              <button className="text-white border border-white/30 hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer">
                Profil Kelurahan
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

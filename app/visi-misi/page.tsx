import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { FadeIn } from '@/components/ui/FadeIn'
import { Leaf } from 'lucide-react'

export default async function VisiMisiPage() {
  const supabase = await createClient()
  const { data: profil } = await supabase
    .from('profil_kelurahan')
    .select('visi, misi')
    .single()

  const misiPoints = profil?.misi
    ? profil.misi.split('\n').map((m: string) => m.trim()).filter(Boolean)
    : [
        'Menyelenggarakan pemerintahan desa yang bersih, transparan, dan akuntabel dengan pelayanan prima kepada masyarakat.',
        'Mengembangkan potensi ekonomi lokal melalui program-program pemberdayaan masyarakat yang berkelanjutan.',
        'Mewujudkan lingkungan desa yang bersih, sehat, dan hijau melalui program pengelolaan sampah terpadu dan konservasi alam.',
        'Membangun and memelihara infrastruktur desa yang berkualitas untuk mendukung aktivitas warga dan perekonomian desa.',
        'Meningkatkan kualitas sumber daya manusia melalui pendidikan, pelatihan, dan pembinaan generasi muda desa.',
        'Memperkuat nilai-nilai sosial budaya, kearifan lokal, dan keharmonisan antar warga dalam kehidupan bermasyarakat.',
      ]

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">
            Arah & Tujuan
          </span>
          <h1 className="font-display text-3xl font-bold text-foreground">Visi & Misi</h1>
        </div>

        {/* Visi Section */}
        <FadeIn delay={100}>
          <div className="bg-gradient-to-br from-mughal-green via-primary to-green-700 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden text-center mb-12 shadow-md">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-6 pointer-events-none" />
            <div className="relative">
              <Leaf size={32} className="mx-auto mb-4 text-primary-foreground/60 opacity-80" />
              <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80 mb-3 font-mono">
                Visi Kelurahan
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto">
                &quot;{profil?.visi || 'Terwujudnya Kelurahan Manembo-nembo Tengah yang Bersih, Makmur, dan Berkelanjutan Menuju Masyarakat Sejahtera pada Tahun 2030'}&quot;
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Misi Section */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">Misi Kelurahan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {misiPoints.map((misi: string, idx: number) => {
              const numStr = String(idx + 1).padStart(2, '0')
              return (
                <FadeIn key={idx} delay={50 * idx}>
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow h-full">
                    <div className="flex gap-4">
                      <div className="text-2xl font-black text-primary/20 leading-none shrink-0 font-mono">
                        {numStr}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                        {misi}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

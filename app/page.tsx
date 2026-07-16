import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/public/HeroSection'
import { BeritaSection } from '@/components/public/BeritaSection'
import { InfografisSection } from '@/components/public/InfografisSection'
import { PricelistSection } from '@/components/public/PricelistSection'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { FadeIn } from '@/components/ui/FadeIn'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: profil }, { data: berita }, { data: produk }] = await Promise.all([
    supabase.from('profil_kelurahan').select('*').single(),
    supabase.from('berita_desa').select('judul, slug, created_at, gambar_url').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    supabase.from('produk_bumdes').select('nama_produk, kategori, harga_per_kg').order('nama_produk'),
  ])

  return (
    <main>
      <Navbar />
      <HeroSection />

      {profil && (
        <FadeIn delay={100}>
          <InfografisSection penduduk={profil.jumlah_penduduk} kk={profil.jumlah_kk} rt={profil.jumlah_rt} rw={profil.jumlah_rw} />
        </FadeIn>
      )}

      <FadeIn delay={100}>
        <PricelistSection produk={produk ?? []} />
      </FadeIn>
      
      <FadeIn delay={100}>
        <BeritaSection berita={berita ?? []} />
      </FadeIn>

      <Footer />
    </main>
  )
}

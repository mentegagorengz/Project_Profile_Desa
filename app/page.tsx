import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { HeroSection } from '@/components/public/HeroSection'
import { BeritaSection } from '@/components/public/BeritaSection'
import { SambutanLurah } from '@/components/public/SambutanLurah'
import { ProfilSection } from '@/components/public/ProfilSection'
import { InfografisSection } from '@/components/public/InfografisSection'
import { PetaSection } from '@/components/public/PetaSection'
import { PricelistSection } from '@/components/public/PricelistSection'
import { GaleriSection } from '@/components/public/GaleriSection'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: profil }, { data: berita }, { data: produk }, { data: foto }] = await Promise.all([
    supabase.from('profil_kelurahan').select('*').single(),
    supabase.from('berita_desa').select('judul, slug, created_at, gambar_url').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    supabase.from('produk_bumdes').select('nama_produk, kategori, harga_per_kg').order('nama_produk'),
    supabase.from('galeri_foto').select('id, url, caption').order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <main>
      <Navbar />
      <HeroSection />

      {profil && (
        <>
          <SambutanLurah sambutan={profil.sambutan_lurah} fotoUrl={profil.foto_lurah_url} />
          <ProfilSection visi={profil.visi} misi={profil.misi} sejarah={profil.sejarah} />
          <InfografisSection penduduk={profil.jumlah_penduduk} kk={profil.jumlah_kk} rt={profil.jumlah_rt} rw={profil.jumlah_rw} />
        </>
      )}

      <BeritaSection berita={berita ?? []} />

      {profil?.google_maps_embed_url && <PetaSection embedUrl={profil.google_maps_embed_url} bgClass="bg-light-silver" />}
      <PricelistSection produk={produk ?? []} />
      <GaleriSection foto={foto ?? []} />

      <Footer />
    </main>
  )
}

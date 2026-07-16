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

      <footer className="bg-prussian py-12 text-white/80 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-display font-semibold text-white">Kelurahan Manembo-nembo Tengah</p>
            <p className="text-xs text-pastel-blue mt-1">Kec. Matuari, Kota Bitung, Sulawesi Utara</p>
          </div>
          <div className="shrink-0">
            <Link
              href="/admin"
              className="text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Portal Staf / Admin →
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-[10px] text-pastel-blue/60 font-mono">
            &copy; {new Date().getFullYear()} Kelurahan Manembo-nembo Tengah. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </main>
  )
}

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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
    supabase.from('berita_desa').select('judul, slug, created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    supabase.from('produk_bumdes').select('nama_produk, kategori, harga_per_kg').order('nama_produk'),
    supabase.from('galeri_foto').select('id, url, caption').order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <main>
      <Navbar />
      <header className="bg-prussian py-16 text-center md:text-left">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-1">Website Resmi</p>
          <h1 className="font-display text-4xl font-bold text-white">Kelurahan Manembo-nembo Tengah</h1>
          <p className="text-pastel-blue mt-2">Kec. Matuari, Kota Bitung</p>
        </div>
      </header>

      {profil && (
        <>
          <SambutanLurah sambutan={profil.sambutan_lurah} fotoUrl={profil.foto_lurah_url} />
          <ProfilSection visi={profil.visi} misi={profil.misi} sejarah={profil.sejarah} />
          <InfografisSection penduduk={profil.jumlah_penduduk} kk={profil.jumlah_kk} rt={profil.jumlah_rt} rw={profil.jumlah_rw} />
        </>
      )}

      <section id="berita" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Informasi</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Berita Terbaru</h2>
          <ul className="space-y-3">
            {berita?.map((b) => (
              <li key={b.slug} className="border-b border-dashed border-pastel-blue pb-3">
                <Link href={`/berita/${b.slug}`} className="text-prussian font-medium hover:text-mughal-green transition block">
                  {b.judul}
                </Link>
                {b.created_at && (
                  <p className="font-mono text-xs text-prussian/50 mt-1">
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </li>
            ))}
            {(!berita || berita.length === 0) && (
              <li className="text-prussian/50 italic">Belum ada berita yang dipublikasikan.</li>
            )}
          </ul>
        </div>
      </section>

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

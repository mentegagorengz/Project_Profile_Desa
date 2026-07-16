import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SambutanLurah } from '@/components/public/SambutanLurah'
import { ProfilSection } from '@/components/public/ProfilSection'
import { InfografisSection } from '@/components/public/InfografisSection'
import { PetaSection } from '@/components/public/PetaSection'
import { PricelistSection } from '@/components/public/PricelistSection'
import { GaleriSection } from '@/components/public/GaleriSection'
import { ArrowRight, FileText } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: profil }, 
    { data: berita }, 
    { data: produk }, 
    { data: foto }
  ] = await Promise.all([
    supabase.from('profil_kelurahan').select('*').single(),
    supabase.from('berita_desa').select('judul, slug, created_at, konten').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    supabase.from('produk_bumdes').select('nama_produk, kategori, harga_per_kg').order('nama_produk'),
    supabase.from('galeri_foto').select('id, url, caption').order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <main className="min-h-screen bg-background">
      <header className="relative py-20 lg:py-32 overflow-hidden border-b bg-primary/5">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background"></div>
        <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Kelurahan <span className="text-primary">Manembo-nembo Tengah</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kecamatan Matuari, Kota Bitung, Sulawesi Utara
          </p>
        </div>
      </header>

      {profil && (
        <>
          <SambutanLurah sambutan={profil.sambutan_lurah} fotoUrl={profil.foto_lurah_url} />
          <ProfilSection visi={profil.visi} misi={profil.misi} sejarah={profil.sejarah} />
          <InfografisSection penduduk={profil.jumlah_penduduk} kk={profil.jumlah_kk} rt={profil.jumlah_rt} rw={profil.jumlah_rw} />
        </>
      )}

      <section className="py-16 border-b">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold">Berita Terbaru</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {berita?.map((b) => (
              <Link key={b.slug} href={`/berita/${b.slug}`} className="group block h-full">
                <div className="rounded-xl border bg-card p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xs text-muted-foreground mb-3 flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{b.judul}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">{b.konten}</p>
                  <div className="text-sm font-medium text-primary flex items-center mt-auto">
                    Baca selengkapnya <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
            {(!berita || berita.length === 0) && (
              <p className="text-muted-foreground col-span-3 text-center py-8">Belum ada berita yang dipublikasikan.</p>
            )}
          </div>
        </div>
      </section>

      {profil?.google_maps_embed_url && <PetaSection embedUrl={profil.google_maps_embed_url} />}
      <PricelistSection produk={produk ?? []} />
      <GaleriSection foto={foto ?? []} />
    </main>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { FadeIn } from '@/components/ui/FadeIn'
import { MapPin, Building2 } from 'lucide-react'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: profil } = await supabase
    .from('profil_kelurahan')
    .select('*')
    .single()

  const perangkat = [
    {
      nama: 'Bpk. John Doe, S.IP',
      jabatan: 'Lurah Manembo-nembo Tengah',
      foto: profil?.foto_lurah_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=b6e3f4',
    },
    {
      nama: 'Ibu Siti Rahayu',
      jabatan: 'Sekretaris Kelurahan',
      foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti&backgroundColor=ffdfbf',
    },
    {
      nama: 'Bapak Hendra',
      jabatan: 'Kaur Keuangan',
      foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra&backgroundColor=c0aede',
    },
    {
      nama: 'Ibu Dewi Lestari',
      jabatan: 'Kaur Umum & Administrasi',
      foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi&backgroundColor=d1d4f9',
    },
    {
      nama: 'Bapak Yanto',
      jabatan: 'Kasi Pelayanan Masyarakat',
      foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yanto&backgroundColor=b6e3f4',
    },
    {
      nama: 'Ibu Rina',
      jabatan: 'Kasi Kesejahteraan Rakyat',
      foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina&backgroundColor=ffdfbf',
    },
  ]

  return (
    <main className="min-h-screen bg-muted">
      <Navbar />
      
      {/* Page Header */}
      <header className="bg-prussian pt-32 pb-16 text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80')] bg-cover bg-center pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <span className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest block mb-2">
            Tentang Kami
          </span>
          <h1 className="font-display text-4xl font-bold">Profil Kelurahan</h1>
          <p className="text-primary-foreground/70 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
            Mengenal lebih dekat sejarah, batas geografi, demografi penduduk, serta jajaran perangkat kelurahan Manembo-nembo Tengah.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Sejarah & Geografi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn delay={100}>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Building2 size={18} className="text-primary shrink-0" /> Sejarah Singkat
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profil?.sejarah || 'Kelurahan Manembo-nembo Tengah didirikan sebagai pusat pemukiman dan pelayanan administrasi kelurahan yang transparan, inovatif, dan berdedikasi tinggi demi kesejahteraan warga.'}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  <MapPin size={18} className="text-primary shrink-0" /> Geografi & Demografi
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium">Kecamatan</span>
                    <span className="text-foreground font-semibold">Matuari</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium">Kota / Provinsi</span>
                    <span className="text-foreground font-semibold">Bitung, Sulawesi Utara</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium">Jumlah Rukun Tetangga (RT)</span>
                    <span className="text-foreground font-semibold">{profil?.jumlah_rt ?? 0} RT</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium">Jumlah Rukun Warga (RW)</span>
                    <span className="text-foreground font-semibold">{profil?.jumlah_rw ?? 0} RW</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-medium">Batas Utara</span>
                    <span className="text-foreground font-semibold">Kelurahan Sagerat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Batas Selatan</span>
                    <span className="text-foreground font-semibold">Kelurahan Girian Indah</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Map Embed Section */}
        {profil?.google_maps_embed_url && (
          <FadeIn delay={100}>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 text-foreground">Peta Batas Kelurahan</h2>
              <iframe
                src={profil.google_maps_embed_url}
                className="w-full h-80 rounded-xl border border-border shadow-sm"
                loading="lazy"
              />
            </div>
          </FadeIn>
        )}

        {/* Perangkat Kelurahan Section */}
        <FadeIn delay={100}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Perangkat Kelurahan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {perangkat.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border shadow-sm p-5 text-center hover:shadow-md transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.foto} alt={p.nama} className="w-20 h-20 rounded-full mx-auto mb-3 bg-muted border border-border" />
                  <div className="font-bold text-sm text-foreground">{p.nama}</div>
                  <div className="text-xs text-primary font-bold mt-1 uppercase tracking-wide">{p.jabatan}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </main>
  )
}

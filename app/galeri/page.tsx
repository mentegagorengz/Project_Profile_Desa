import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { GaleriGrid } from '@/components/public/GaleriGrid'

export default async function GaleriPublikPage() {
  const supabase = await createClient()
  const { data: foto } = await supabase
    .from('galeri_foto')
    .select('id, url, caption')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen">
      <Navbar />
      <header className="bg-prussian pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs text-primary-foreground/60 mb-1">Dokumentasi</p>
          <h1 className="font-display text-3xl font-bold text-white">Galeri Kegiatan Kelurahan</h1>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <GaleriGrid initialFoto={foto ?? []} />
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

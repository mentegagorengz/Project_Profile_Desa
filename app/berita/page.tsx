import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Newspaper } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default async function BeritaListPage() {
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('judul, slug, created_at, gambar_url')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen">
      <Navbar />
      <header className="bg-prussian pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-primary-foreground/60 mb-1">Informasi</p>
          <h1 className="font-display text-3xl font-bold text-white">Berita Kelurahan</h1>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          {berita && berita.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {berita.map((b) => (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100 border-b border-border/30">
                    {b.gambar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.gambar_url}
                        alt={b.judul}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-10 h-10 text-slate-400/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-prussian/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <h2 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {b.judul}
                    </h2>
                    {b.created_at && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3 h-3 text-muted-foreground/70" />
                        <p className="font-mono text-xs text-muted-foreground">
                          {new Date(b.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-xl border border-dashed border-border">
              <Newspaper className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground italic">Belum ada berita yang dipublikasikan.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

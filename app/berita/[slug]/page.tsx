import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  const { data: beritaTerkait } = await supabase
    .from('berita_desa')
    .select('judul, slug, created_at, gambar_url')
    .eq('status', 'published')
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(2)

  if (!berita) notFound()

  return (
    <main className="min-h-screen">
      <Navbar />
      <header className="bg-prussian pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-1">Berita</p>
          <h1 className="font-display text-3xl font-bold text-white leading-tight">{berita.judul}</h1>
          <p className="font-mono text-sm text-pastel-blue mt-2">
            {new Date(berita.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      <article className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">

          {berita.gambar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={berita.gambar_url}
              alt={berita.judul}
              className="w-full aspect-video object-cover rounded-lg mb-8 border border-pastel-blue"
            />
          )}

          <div className="prose max-w-none text-prussian/90 leading-relaxed">
            <p className="whitespace-pre-line">{berita.konten}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-dashed border-pastel-blue">
            <Link
              href="/#berita"
              className="inline-flex items-center gap-2 font-mono text-sm text-prussian hover:text-mughal-green transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </article>

      {beritaTerkait && beritaTerkait.length > 0 && (
        <section className="bg-light-silver py-12 border-t border-pastel-blue/30">
          <div className="mx-auto max-w-3xl px-6">
            <h3 className="font-display text-xl font-semibold text-prussian mb-6">Berita Terkait</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beritaTerkait.map((b) => (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className="group block rounded-xl border border-pastel-blue/60 bg-white overflow-hidden hover:border-teal-blue hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-video overflow-hidden bg-light-silver">
                    {b.gambar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.gambar_url}
                        alt={b.judul}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pastel-blue/50">
                        <span className="font-mono text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-semibold text-prussian group-hover:text-teal-blue transition-colors line-clamp-2 text-sm leading-snug">
                      {b.judul}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

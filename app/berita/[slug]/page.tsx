import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!berita) notFound()

  return (
    <main className="min-h-screen">
      <Navbar />
      <header className="bg-prussian py-10">
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
    </main>
  )
}

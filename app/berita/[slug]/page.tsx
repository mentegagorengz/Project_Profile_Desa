import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

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
    <article className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">{berita.judul}</h1>
      <p className="mt-4 whitespace-pre-line">{berita.konten}</p>
    </article>
  )
}

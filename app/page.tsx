import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('judul, slug, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Website Desa</h1>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Berita Desa</h2>
        <ul className="mt-4 space-y-2">
          {berita?.map((b) => (
            <li key={b.slug}>
              <Link href={`/berita/${b.slug}`} className="text-blue-600 hover:underline">{b.judul}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

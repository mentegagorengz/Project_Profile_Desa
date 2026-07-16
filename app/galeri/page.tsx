import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'

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
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-1">Galeri</p>
          <h1 className="font-display text-3xl font-bold text-white">Galeri Kegiatan Kelurahan</h1>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          {foto && foto.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {foto.map((f) => (
                <div key={f.id} className="group relative aspect-square overflow-hidden rounded-lg border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.url}
                    alt={f.caption ?? 'Foto Kegiatan'}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {f.caption && (
                    <div className="absolute inset-0 bg-teal-blue/0 group-hover:bg-teal-blue/60 transition duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                      <p className="text-white text-xs line-clamp-3">{f.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-prussian/50">
              <p className="font-display text-xl">Belum ada foto di galeri.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

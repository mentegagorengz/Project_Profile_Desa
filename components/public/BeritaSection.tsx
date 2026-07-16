import Link from 'next/link'
import { Calendar, ArrowRight, Newspaper } from 'lucide-react'

type Berita = {
  judul: string
  slug: string
  created_at: string
  gambar_url?: string | null
}

export function BeritaSection({ berita }: { berita: Berita[] }) {
  return (
    <section id="berita" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Informasi</p>
            <h2 className="font-display text-2xl font-semibold text-prussian">Berita Terbaru</h2>
          </div>
          <Link
            href="/berita"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition shrink-0"
          >
            Semua Berita <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {berita && berita.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {berita.map((b, idx) => (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className={`group block rounded-xl border border-pastel-blue/60 overflow-hidden hover:border-teal-blue hover:shadow-md transition-all duration-200 ${idx === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-light-silver ${idx === 0 ? 'aspect-[16/7]' : 'aspect-video'}`}>
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
                        <Newspaper className="w-10 h-10 text-pastel-blue" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-prussian/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-display font-semibold text-prussian group-hover:text-teal-blue transition-colors line-clamp-2 leading-snug ${idx === 0 ? 'text-lg' : 'text-sm'}`}>
                      {b.judul}
                    </h3>
                    {b.created_at && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3 h-3 text-teal-blue/70" />
                        <p className="font-mono text-xs text-prussian/50">
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
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/berita"
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition"
              >
                Semua Berita <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-16 text-center rounded-xl border border-dashed border-pastel-blue">
            <Newspaper className="w-10 h-10 text-pastel-blue mx-auto mb-3" />
            <p className="text-prussian/50 italic">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </section>
  )
}

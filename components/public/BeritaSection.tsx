import Link from 'next/link'
import { Newspaper, ChevronRight } from 'lucide-react'

type Berita = {
  judul: string
  slug: string
  created_at: string
  gambar_url?: string | null
}

export function BeritaSection({ berita }: { berita: Berita[] }) {
  return (
    <section id="berita" className="bg-muted py-20 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">
              Informasi Terkini
            </span>
            <h2 className="text-2xl font-bold mt-1 text-foreground">Berita Kelurahan</h2>
          </div>
          <Link href="/berita">
            <button className="border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1">
              Lihat Semua <ChevronRight size={14} />
            </button>
          </Link>
        </div>

        {berita && berita.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {berita.slice(0, 3).map((b) => (
              <Link
                key={b.slug}
                href={`/berita/${b.slug}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100 shrink-0 border-b border-border/30">
                  {b.gambar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.gambar_url}
                      alt={b.judul}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-slate-400/60" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                      Kabar Kelurahan
                    </span>
                    <h3 className="font-bold text-foreground mt-2 mb-1.5 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {b.judul}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-muted/30">
                    <span>
                      {new Date(b.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      Baca <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-xl border border-dashed border-border bg-card">
            <Newspaper className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </section>
  )
}

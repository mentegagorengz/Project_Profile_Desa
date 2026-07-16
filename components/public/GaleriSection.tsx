type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  if (!foto || foto.length === 0) return null

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Dokumentasi</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Galeri Kegiatan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {foto.slice(0, 6).map((f) => (
            <div key={f.id} className="group relative aspect-square overflow-hidden rounded-lg border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.caption ?? ''} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              {f.caption && (
                <div className="absolute inset-0 bg-teal-blue/0 group-hover:bg-teal-blue/60 transition duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs line-clamp-3">{f.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

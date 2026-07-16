type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  if (!foto || foto.length === 0) return null
  
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Galeri Kegiatan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {foto.slice(0, 6).map((f) => (
            <div key={f.id} className="group relative rounded-xl overflow-hidden aspect-square border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={f.url} 
                alt={f.caption ?? 'Galeri Kegiatan'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              {f.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                  <p className="text-sm font-medium line-clamp-2">{f.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

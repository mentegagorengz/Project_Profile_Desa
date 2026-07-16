export function PetaSection({ embedUrl, bgClass = 'bg-white' }: { embedUrl: string; bgClass?: string }) {
  if (!embedUrl) return null
  return (
    <section id="lokasi" className={`${bgClass} py-16`}>
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Lokasi</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Peta Kelurahan</h2>
        <iframe
          src={embedUrl}
          className="w-full h-80 rounded-lg border-2 border-teal-blue shadow-sm"
          loading="lazy"
        />
      </div>
    </section>
  )
}

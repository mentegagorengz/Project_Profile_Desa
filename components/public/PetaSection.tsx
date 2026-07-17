export function PetaSection({ embedUrl, bgClass = 'bg-white' }: { embedUrl: string; bgClass?: string }) {
  if (!embedUrl) return null
  return (
    <section id="lokasi" className={`${bgClass} py-20`}>
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Peta Kelurahan</h2>
        <iframe
          src={embedUrl}
          className="w-full h-80 rounded-xl border border-border shadow-card"
          loading="lazy"
        />
      </div>
    </section>
  )
}

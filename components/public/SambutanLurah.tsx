export function SambutanLurah({ sambutan, fotoUrl }: { sambutan: string; fotoUrl: string | null }) {
  return (
    <section className="py-16 border-b bg-muted/30">
      <div className="mx-auto max-w-4xl px-6 flex flex-col md:flex-row gap-8 items-center">
        {fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoUrl} alt="Lurah" className="h-36 w-36 rounded-full object-cover shadow-md flex-shrink-0 ring-4 ring-background" />
        )}
        <div>
          <h2 className="text-2xl font-bold mb-3">Sambutan Lurah</h2>
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{sambutan || 'Sambutan lurah belum tersedia.'}</p>
        </div>
      </div>
    </section>
  )
}

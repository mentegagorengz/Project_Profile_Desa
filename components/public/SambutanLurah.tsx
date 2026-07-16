export function SambutanLurah({ sambutan, fotoUrl }: { sambutan: string; fotoUrl: string | null }) {
  return (
    <section className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl flex gap-8 items-center px-6">
        {fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt="Lurah"
            className="h-36 w-36 rounded-full object-cover ring-4 ring-mughal-green shrink-0"
          />
        )}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Sambutan</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-3">Dari Lurah Manembo-nembo Tengah</h2>
          <p className="whitespace-pre-line text-prussian/80 leading-relaxed">{sambutan || 'Sambutan lurah belum tersedia.'}</p>
        </div>
      </div>
    </section>
  )
}

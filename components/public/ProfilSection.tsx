export function ProfilSection({ visi, misi, sejarah }: { visi: string; misi: string; sejarah: string }) {
  return (
    <section id="profil" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Profil</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Kelurahan Manembo-nembo Tengah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-pastel-blue/40 border border-pastel-blue p-5">
            <h3 className="font-display font-semibold text-prussian mb-2">Visi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed">{visi || '-'}</p>
          </div>
          <div className="rounded-lg bg-pastel-blue/40 border border-pastel-blue p-5">
            <h3 className="font-display font-semibold text-prussian mb-2">Misi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed whitespace-pre-line">{misi || '-'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold text-prussian mb-2">Sejarah</h3>
          <p className="text-prussian/80 whitespace-pre-line leading-relaxed">{sejarah || '-'}</p>
        </div>
      </div>
    </section>
  )
}

export function ProfilSection({ visi, misi, sejarah }: { visi: string; misi: string; sejarah: string }) {
  return (
    <section id="profil" className="bg-light-silver py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6 text-center md:text-left">Kelurahan Manembo-nembo Tengah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl bg-white shadow-card p-6 border border-pastel-blue/20">
            <h3 className="font-display font-semibold text-prussian mb-3">Visi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed">{visi || '-'}</p>
          </div>
          <div className="rounded-2xl bg-white shadow-card p-6 border border-pastel-blue/20">
            <h3 className="font-display font-semibold text-prussian mb-3">Misi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed whitespace-pre-line">{misi || '-'}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white shadow-card p-6 border border-pastel-blue/20">
          <h3 className="font-display font-semibold text-prussian mb-3">Sejarah Singkat</h3>
          <p className="text-prussian/80 whitespace-pre-line text-sm leading-relaxed">{sejarah || '-'}</p>
        </div>
      </div>
    </section>
  )
}

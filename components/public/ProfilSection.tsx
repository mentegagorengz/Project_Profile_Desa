export function ProfilSection({ visi, misi, sejarah }: { visi: string; misi: string; sejarah: string }) {
  return (
    <section className="py-16 border-b">
      <div className="mx-auto max-w-4xl px-6 space-y-8">
        <h2 className="text-3xl font-bold text-center">Profil Kelurahan</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Visi</h3>
            <p className="text-muted-foreground">{visi || '-'}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Misi</h3>
            <p className="text-muted-foreground whitespace-pre-line">{misi || '-'}</p>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-semibold border-b pb-2">Sejarah Singkat</h3>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{sejarah || '-'}</p>
        </div>
      </div>
    </section>
  )
}

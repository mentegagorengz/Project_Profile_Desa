export function InfografisSection({ penduduk, kk, rt, rw }: { penduduk: number; kk: number; rt: number; rw: number }) {
  const stats = [
    { label: 'Penduduk', value: penduduk },
    { label: 'Kepala Keluarga', value: kk },
    { label: 'RT', value: rt },
    { label: 'RW', value: rw },
  ]
  return (
    <section className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Infografis</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Kelurahan dalam Angka</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-white border border-pastel-blue p-5 text-center shadow-sm">
              <p className="font-mono text-3xl font-semibold text-mughal-green">{s.value.toLocaleString('id-ID')}</p>
              <p className="text-sm text-prussian/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

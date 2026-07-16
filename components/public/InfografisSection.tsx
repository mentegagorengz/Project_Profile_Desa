import { Users, Home, Map, MapPin } from 'lucide-react'

export function InfografisSection({ penduduk, kk, rt, rw }: { penduduk: number; kk: number; rt: number; rw: number }) {
  const stats = [
    { label: 'Penduduk', value: penduduk, icon: Users },
    { label: 'Kepala Keluarga', value: kk, icon: Home },
    { label: 'RT', value: rt, icon: MapPin },
    { label: 'RW', value: rw, icon: Map },
  ]
  return (
    <section className="py-16 border-b bg-muted/10">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Infografis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <s.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold">{s.value.toLocaleString('id-ID')}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

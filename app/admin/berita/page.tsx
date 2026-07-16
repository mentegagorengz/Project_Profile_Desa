import { createClient } from '@/lib/supabase/server'
import { BeritaForm } from './BeritaForm'

export default async function BeritaPage() {
  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita_desa')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Berita Desa</h1>
      <BeritaForm />
      <div className="space-y-2">
        {beritaList?.map((b) => (
          <div key={b.id} className="rounded border p-4 bg-card">
            <p className="font-semibold">{b.judul} <span className="text-xs text-muted-foreground">({b.status})</span></p>
            <p className="text-sm text-muted-foreground">/{b.slug}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { BeritaForm, BeritaRow } from './BeritaForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function BeritaPage() {
  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita_desa')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader title="Berita Desa" description="Tulis dan publikasikan berita kelurahan." />
      <BeritaForm />
      <div className="space-y-2">
        {beritaList && beritaList.length > 0 ? (
          beritaList.map((b) => (
            <BeritaRow key={b.id} berita={b} />
          ))
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card">
            <p className="text-muted-foreground italic text-sm">Belum ada berita. Tambahkan berita pertama di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

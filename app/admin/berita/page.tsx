import { createClient } from '@/lib/supabase/server'
import { BeritaForm } from './BeritaForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function BeritaPage() {
  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita_desa')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="CMS" title="Berita Desa" />
      <BeritaForm />
      <div className="space-y-2">
        {beritaList?.map((b) => (
          <div key={b.id} className="rounded-lg border border-pastel-blue bg-white p-4">
            <p className="font-medium text-prussian">
              {b.judul}{' '}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${b.status === 'published' ? 'bg-mughal-green/10 text-mughal-green' : 'bg-teal-blue/10 text-teal-blue'}`}>
                {b.status}
              </span>
            </p>
            <p className="text-sm text-prussian/50 font-mono">/{b.slug}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

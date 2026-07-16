import { createClient } from '@/lib/supabase/server'
import { ProfilForm } from './ProfilForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: profil } = await supabase.from('profil_kelurahan').select('*').single()

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="CMS" title="Profil Kelurahan" />
      
      {profil ? (
        <ProfilForm profil={profil} />
      ) : (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          Data profil belum tersedia di database. Silakan jalankan seeder terlebih dahulu.
        </div>
      )}
    </div>
  )
}

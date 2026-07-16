import { createClient } from '@/lib/supabase/server'
import { ProfilForm } from './ProfilForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: profil } = await supabase.from('profil_kelurahan').select('*').single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profil Kelurahan</h1>
      <p className="text-muted-foreground">Kelola informasi profil, sejarah, visi-misi, dan data statistik kelurahan.</p>
      
      {profil ? (
        <ProfilForm profil={profil} />
      ) : (
        <div className="p-4 border rounded bg-destructive/10 text-destructive">
          Data profil belum tersedia di database. Silakan jalankan seeder terlebih dahulu.
        </div>
      )}
    </div>
  )
}

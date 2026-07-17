import { createClient } from '@/lib/supabase/server'
import { UploadForm } from './UploadForm'
import { deleteFoto } from '@/lib/actions/galeri'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function GaleriPage() {
  const supabase = await createClient()
  const { data: foto } = await supabase.from('galeri_foto').select('*').order('created_at', { ascending: false })

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteFoto(formData.get('id') as string, formData.get('url') as string)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Galeri Foto" description="Upload dan kelola foto kegiatan." />
      
      <UploadForm />
      
      {foto && foto.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {foto.map((f) => (
            <div key={f.id} className="group relative rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square relative overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={f.url} 
                  alt={f.caption ?? 'Foto Galeri'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-foreground font-medium truncate" title={f.caption ?? ''}>
                  {f.caption || <span className="italic text-muted-foreground font-normal">Tanpa caption</span>}
                </p>
                <form action={handleDelete} className="mt-3">
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="url" value={f.url} />
                  <Button variant="destructive" size="sm" type="submit" className="w-full font-display">
                    <Trash2 className="w-3 h-3 mr-2" /> Hapus
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground italic text-sm">Belum ada foto di galeri.</p>
        </div>
      )}
    </div>
  )
}

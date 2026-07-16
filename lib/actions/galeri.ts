'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadFoto(formData: FormData) {
  const file = formData.get('file') as File
  const caption = formData.get('caption') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const { error: uploadError } = await supabase.storage.from('galeri').upload(filename, file)
  if (uploadError) throw new Error(uploadError.message)

  const { data: publicUrl } = supabase.storage.from('galeri').getPublicUrl(filename)

  const { error: dbError } = await supabase.from('galeri_foto').insert({
    url: publicUrl.publicUrl,
    caption: caption || null,
  })
  if (dbError) {
    // Attempt rollback
    await supabase.storage.from('galeri').remove([filename])
    throw new Error(dbError.message)
  }

  revalidatePath('/admin/galeri')
  revalidatePath('/')
}

export async function deleteFoto(id: string, url: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Extract filename from the public URL
  // The URL format is typically: .../storage/v1/object/public/galeri/filename
  const filename = url.split('/').pop()!
  
  // Remove from storage first
  const { error: storageError } = await supabase.storage.from('galeri').remove([filename])
  if (storageError) throw new Error(storageError.message)

  // Remove from DB
  const { error: dbError } = await supabase.from('galeri_foto').delete().eq('id', id)
  if (dbError) throw new Error(dbError.message)

  revalidatePath('/admin/galeri')
  revalidatePath('/')
}

'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFoto } from '@/lib/actions/galeri'
import { ImagePlus } from 'lucide-react'

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    try {
      await uploadFoto(formData)
      formRef.current?.reset()
    } catch (e: any) {
      alert('Gagal mengunggah foto: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end rounded-lg border p-4 bg-card shadow-sm">
      <div className="w-full sm:flex-1">
        <label className="text-sm font-medium mb-1 block">Pilih Foto</label>
        <Input type="file" name="file" accept="image/*" required className="cursor-pointer" />
      </div>
      <div className="w-full sm:flex-1">
        <label className="text-sm font-medium mb-1 block">Caption (Opsional)</label>
        <Input type="text" name="caption" placeholder="Tuliskan keterangan foto..." />
      </div>
      <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
        {uploading ? (
          'Mengunggah...'
        ) : (
          <>
            <ImagePlus className="w-4 h-4 mr-2" /> Upload
          </>
        )}
      </Button>
    </form>
  )
}

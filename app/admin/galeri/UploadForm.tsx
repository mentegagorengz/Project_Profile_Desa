'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFoto } from '@/lib/actions/galeri'
import { ImagePlus } from 'lucide-react'

// Ponytail full: Native canvas compression (YAGNI on external libraries like browser-image-compression)
// Ceiling: Canvas toBlob is synchronous-ish and doesn't preserve EXIF data. Upgrade path: use a lightweight web worker library if EXIF/rotation matters.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      
      // Max dimensions
      const MAX_WIDTH = 1920
      const MAX_HEIGHT = 1080
      let { width, height } = img

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(file)

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to WEBP (widely supported, excellent compression)
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
          })
          resolve(newFile)
        },
        'image/webp',
        0.8 // quality
      )
    }
    img.onerror = () => reject(new Error('Gagal memproses gambar'))
    img.src = url
  })
}

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    
    setUploading(true)
    try {
      const formData = new FormData(formRef.current)
      const file = formData.get('file') as File
      
      if (file && file.size > 0) {
        const compressedFile = await compressImage(file)
        formData.set('file', compressedFile)
      }

      await uploadFoto(formData)
      formRef.current.reset()
    } catch (e: any) {
      alert('Gagal mengunggah foto: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end rounded-lg border border-pastel-blue p-4 bg-white shadow-sm">
      <div className="w-full sm:flex-1">
        <label className="text-sm font-medium text-prussian mb-1 block">Pilih Foto</label>
        <Input 
          type="file" 
          name="file" 
          accept="image/*" 
          required 
          className="cursor-pointer border-pastel-blue focus:border-teal-blue" 
        />
      </div>
      <div className="w-full sm:flex-1">
        <label className="text-sm font-medium text-prussian mb-1 block">Caption (Opsional)</label>
        <Input 
          type="text" 
          name="caption" 
          placeholder="Tuliskan keterangan foto..." 
          className="border-pastel-blue focus:border-teal-blue"
        />
      </div>
      <Button 
        type="submit" 
        disabled={uploading} 
        className="w-full sm:w-auto bg-prussian hover:bg-prussian/90 text-white font-display"
      >
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

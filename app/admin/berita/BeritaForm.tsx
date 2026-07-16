'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createBerita } from '@/lib/actions/berita'

export function BeritaForm() {
  const [judul, setJudul] = useState('')
  const [slug, setSlug] = useState('')
  const [konten, setKonten] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createBerita({ judul, slug, konten, status: 'draft' })
      setJudul('')
      setSlug('')
      setKonten('')
      alert('Berita berhasil disimpan sebagai draft!')
    } catch (e: any) {
      alert('Gagal menyimpan berita: ' + e.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-pastel-blue p-4 bg-white shadow-sm">
      <Input 
        placeholder="Judul Berita" 
        value={judul} 
        onChange={(e) => setJudul(e.target.value)} 
        required 
        className="border-pastel-blue focus:border-teal-blue"
      />
      <Input 
        placeholder="slug-url (contoh: berita-hari-ini)" 
        value={slug} 
        onChange={(e) => setSlug(e.target.value)} 
        required 
        className="border-pastel-blue focus:border-teal-blue font-mono"
      />
      <Textarea 
        placeholder="Konten Berita" 
        value={konten} 
        onChange={(e) => setKonten(e.target.value)} 
        required 
        className="border-pastel-blue focus:border-teal-blue min-h-[120px]"
      />
      <Button type="submit" className="bg-prussian hover:bg-prussian/90 text-white font-display">
        Simpan sebagai Draft
      </Button>
    </form>
  )
}

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
    await createBerita({ judul, slug, konten, status: 'draft' })
    setJudul('')
    setSlug('')
    setKonten('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border p-4 bg-card">
      <Input placeholder="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} required />
      <Input placeholder="slug-url" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      <Textarea placeholder="Konten" value={konten} onChange={(e) => setKonten(e.target.value)} required />
      <Button type="submit">Simpan sebagai Draft</Button>
    </form>
  )
}

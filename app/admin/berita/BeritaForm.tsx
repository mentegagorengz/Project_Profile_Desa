'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createBerita, updateBerita, deleteBerita } from '@/lib/actions/berita'
import { Pencil, Trash2, Globe, FileText, X, Check } from 'lucide-react'

type Berita = {
  id: string
  judul: string
  slug: string
  konten: string
  status: 'draft' | 'published'
  gambar_url?: string | null
  created_at: string
}

// Form Tambah Berita Baru
export function BeritaForm() {
  const [judul, setJudul] = useState('')
  const [slug, setSlug] = useState('')
  const [konten, setKonten] = useState('')
  const [loading, setLoading] = useState(false)

  function handleJudulChange(val: string) {
    setJudul(val)
    // Auto-generate slug
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createBerita({ judul, slug, konten, status: 'draft' })
      setJudul('')
      setSlug('')
      setKonten('')
      alert('Berita berhasil disimpan sebagai draft!')
    } catch (e: any) {
      alert('Gagal menyimpan berita: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-pastel-blue p-4 bg-white shadow-sm">
      <h3 className="font-display font-semibold text-prussian text-sm">Tambah Berita Baru</h3>
      <Input
        placeholder="Judul Berita"
        value={judul}
        onChange={(e) => handleJudulChange(e.target.value)}
        required
        className="border-pastel-blue focus:border-teal-blue"
      />
      <div>
        <Input
          placeholder="slug-url (contoh: berita-hari-ini)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="border-pastel-blue focus:border-teal-blue font-mono text-sm"
        />
        <p className="text-xs text-prussian/40 mt-1">URL publik: /berita/{slug || '...'}</p>
      </div>
      <Textarea
        placeholder="Konten Berita"
        value={konten}
        onChange={(e) => setKonten(e.target.value)}
        required
        className="border-pastel-blue focus:border-teal-blue min-h-[120px]"
      />
      <Button type="submit" disabled={loading} className="bg-prussian hover:bg-prussian/90 text-white font-display">
        {loading ? 'Menyimpan...' : 'Simpan sebagai Draft'}
      </Button>
    </form>
  )
}

// Row Berita dengan Edit inline & Hapus & Publish/Unpublish
export function BeritaRow({ berita }: { berita: Berita }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ judul: berita.judul, slug: berita.slug, konten: berita.konten, status: berita.status })
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await updateBerita(berita.id, form)
      setEditing(false)
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStatus() {
    setLoading(true)
    const newStatus = berita.status === 'published' ? 'draft' : 'published'
    try {
      await updateBerita(berita.id, { ...form, status: newStatus })
    } catch (e: any) {
      alert('Gagal mengubah status: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus berita "${berita.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setLoading(true)
    try {
      await deleteBerita(berita.id)
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message)
      setLoading(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-teal-blue bg-white p-4 space-y-3 shadow-sm">
        <Input
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="border-pastel-blue focus:border-teal-blue font-medium"
          placeholder="Judul"
        />
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border-pastel-blue focus:border-teal-blue font-mono text-sm"
          placeholder="slug"
        />
        <Textarea
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
          className="border-pastel-blue focus:border-teal-blue min-h-[100px]"
          placeholder="Konten"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={loading} className="bg-mughal-green hover:bg-mughal-green/90 text-white">
            <Check className="w-3 h-3 mr-1" /> Simpan
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-prussian/60">
            <X className="w-3 h-3 mr-1" /> Batal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-pastel-blue bg-white p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-prussian truncate">{berita.judul}</p>
          <span className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded-full ${berita.status === 'published' ? 'bg-mughal-green/10 text-mughal-green' : 'bg-teal-blue/10 text-teal-blue'}`}>
            {berita.status}
          </span>
        </div>
        <p className="text-xs text-prussian/50 font-mono">/{berita.slug}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleStatus}
          disabled={loading}
          title={berita.status === 'published' ? 'Jadikan Draft' : 'Publikasikan'}
          className={berita.status === 'published' ? 'text-teal-blue hover:text-teal-blue/70' : 'text-mughal-green hover:text-mughal-green/70'}
        >
          {berita.status === 'published' ? <FileText className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="text-prussian/60 hover:text-prussian">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

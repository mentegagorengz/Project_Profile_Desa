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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border p-4 bg-card shadow-sm">
      <h3 className="font-display font-semibold text-foreground text-sm">Tambah Berita Baru</h3>
      <Input
        placeholder="Judul Berita"
        value={judul}
        onChange={(e) => handleJudulChange(e.target.value)}
        required
        className="border-border focus:border-ring"
      />
      <div>
        <Input
          placeholder="slug-url (contoh: berita-hari-ini)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="border-border focus:border-ring font-mono text-sm"
        />
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-xs text-muted-foreground flex-1">URL publik: <span className="font-mono text-foreground">/berita/{slug || '...'}</span></p>
          <p className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full" title="Slug adalah alamat URL untuk berita ini">Otomatis dari judul</p>
        </div>
      </div>
      <Textarea
        placeholder="Konten Berita"
        value={konten}
        onChange={(e) => setKonten(e.target.value)}
        required
        className="border-border focus:border-ring min-h-[120px]"
      />
      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-display">
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
      <div className="rounded-lg border border-ring bg-card p-4 space-y-3 shadow-sm">
        <Input
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="border-border focus:border-ring font-medium"
          placeholder="Judul"
        />
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border-border focus:border-ring font-mono text-sm"
          placeholder="slug"
        />
        <Textarea
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
          className="border-border focus:border-ring min-h-[100px]"
          placeholder="Konten"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={loading} className="bg-mughal-green hover:bg-mughal-green/90 text-white">
            <Check className="w-3 h-3 mr-1" /> Simpan
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-muted-foreground">
            <X className="w-3 h-3 mr-1" /> Batal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-foreground truncate">{berita.judul}</p>
          <span className={`shrink-0 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${berita.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
            {berita.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate">/{berita.slug}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleStatus}
          disabled={loading}
          title={berita.status === 'published' ? 'Jadikan Draft' : 'Publikasikan'}
          className={berita.status === 'published' ? 'text-primary hover:text-primary/70' : 'text-primary hover:text-primary/70'}
        >
          {berita.status === 'published' ? <FileText className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

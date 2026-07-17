'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateProfil, type ProfilInput } from '@/lib/actions/profil'
import { Check, Loader2 } from 'lucide-react'

export function ProfilForm({ profil }: { profil: ProfilInput & { id: string } }) {
  const [form, setForm] = useState<ProfilInput>(profil)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfil(profil.id, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informasi Umum */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Informasi Umum</h3>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Sambutan Lurah</label>
          <Textarea
            value={form.sambutan_lurah}
            onChange={(e) => setForm({ ...form, sambutan_lurah: e.target.value })}
            rows={3}
            placeholder="Tuliskan sambutan lurah di sini..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">URL Foto Lurah</label>
          <Input
            value={form.foto_lurah_url ?? ''}
            onChange={(e) => setForm({ ...form, foto_lurah_url: e.target.value })}
            placeholder="https://... (Kosongkan jika belum ada)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Visi</label>
            <Textarea
              value={form.visi}
              onChange={(e) => setForm({ ...form, visi: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Misi</label>
            <Textarea
              value={form.misi}
              onChange={(e) => setForm({ ...form, misi: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Sejarah Singkat Kelurahan</label>
          <Textarea
            value={form.sejarah}
            onChange={(e) => setForm({ ...form, sejarah: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      {/* Data Demografi */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Data Demografi & Wilayah</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Jumlah Penduduk</label>
            <Input
              type="number"
              value={form.jumlah_penduduk}
              onChange={(e) => setForm({ ...form, jumlah_penduduk: parseInt(e.target.value) || 0 })}
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Jumlah KK</label>
            <Input
              type="number"
              value={form.jumlah_kk}
              onChange={(e) => setForm({ ...form, jumlah_kk: parseInt(e.target.value) || 0 })}
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Jumlah RT</label>
            <Input
              type="number"
              value={form.jumlah_rt}
              onChange={(e) => setForm({ ...form, jumlah_rt: parseInt(e.target.value) || 0 })}
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Jumlah RW</label>
            <Input
              type="number"
              value={form.jumlah_rw}
              onChange={(e) => setForm({ ...form, jumlah_rw: parseInt(e.target.value) || 0 })}
              className="font-mono"
            />
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Lokasi</h3>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Google Maps Embed URL</label>
          <Input
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.google_maps_embed_url || ''}
            onChange={(e) => setForm({ ...form, google_maps_embed_url: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Buka Google Maps → Cari Lokasi → Bagikan → Sematkan Peta → Salin URL dari <code className="bg-muted px-1 rounded">src="..."</code>.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Tersimpan
            </>
          ) : (
            'Simpan Profil Kelurahan'
          )}
        </Button>
        {saved && (
          <span className="text-sm text-primary font-medium">Perubahan berhasil disimpan.</span>
        )}
      </div>
    </form>
  )
}

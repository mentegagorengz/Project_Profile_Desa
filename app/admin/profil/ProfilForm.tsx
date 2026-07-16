'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateProfil, type ProfilInput } from '@/lib/actions/profil'

export function ProfilForm({ profil }: { profil: ProfilInput & { id: string } }) {
  const [form, setForm] = useState<ProfilInput>(profil)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfil(profil.id, form)
      alert('Profil berhasil disimpan!')
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg border border-pastel-blue shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-prussian mb-1 block">Sambutan Lurah</label>
          <Textarea 
            value={form.sambutan_lurah} 
            onChange={(e) => setForm({ ...form, sambutan_lurah: e.target.value })} 
            rows={4} 
            placeholder="Tuliskan sambutan lurah di sini..."
            className="border-pastel-blue focus:border-teal-blue"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-prussian mb-1 block">URL Foto Lurah</label>
          <Input 
            value={form.foto_lurah_url ?? ''} 
            onChange={(e) => setForm({ ...form, foto_lurah_url: e.target.value })} 
            placeholder="https://... (Kosongkan jika belum ada)"
            className="border-pastel-blue focus:border-teal-blue"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-prussian mb-1 block">Visi</label>
          <Textarea 
            value={form.visi} 
            onChange={(e) => setForm({ ...form, visi: e.target.value })} 
            rows={2}
            className="border-pastel-blue focus:border-teal-blue"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-prussian mb-1 block">Misi</label>
          <Textarea 
            value={form.misi} 
            onChange={(e) => setForm({ ...form, misi: e.target.value })} 
            rows={4}
            className="border-pastel-blue focus:border-teal-blue"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-prussian mb-1 block">Sejarah Singkat Kelurahan</label>
          <Textarea 
            value={form.sejarah} 
            onChange={(e) => setForm({ ...form, sejarah: e.target.value })} 
            rows={5} 
            className="border-pastel-blue focus:border-teal-blue"
          />
        </div>
      </div>

      <div className="border-t border-pastel-blue/60 pt-4">
        <h3 className="font-display font-semibold text-lg text-prussian mb-4">Data Demografi & Wilayah</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-prussian mb-1 block">Jumlah Penduduk</label>
            <Input 
              type="number" 
              value={form.jumlah_penduduk} 
              onChange={(e) => setForm({ ...form, jumlah_penduduk: parseInt(e.target.value) || 0 })} 
              className="border-pastel-blue focus:border-teal-blue font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-prussian mb-1 block">Jumlah KK</label>
            <Input 
              type="number" 
              value={form.jumlah_kk} 
              onChange={(e) => setForm({ ...form, jumlah_kk: parseInt(e.target.value) || 0 })} 
              className="border-pastel-blue focus:border-teal-blue font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-prussian mb-1 block">Jumlah RT</label>
            <Input 
              type="number" 
              value={form.jumlah_rt} 
              onChange={(e) => setForm({ ...form, jumlah_rt: parseInt(e.target.value) || 0 })} 
              className="border-pastel-blue focus:border-teal-blue font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-prussian mb-1 block">Jumlah RW</label>
            <Input 
              type="number" 
              value={form.jumlah_rw} 
              onChange={(e) => setForm({ ...form, jumlah_rw: parseInt(e.target.value) || 0 })} 
              className="border-pastel-blue focus:border-teal-blue font-mono"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-pastel-blue/60 pt-4">
        <label className="text-sm font-medium text-prussian mb-1 block">Google Maps Embed URL (Iframe src)</label>
        <Input
          placeholder="https://www.google.com/maps/embed?pb=..."
          value={form.google_maps_embed_url || ''}
          onChange={(e) => setForm({ ...form, google_maps_embed_url: e.target.value })}
          className="border-pastel-blue focus:border-teal-blue"
        />
        <p className="text-xs text-prussian/50 mt-1">
          Buka Google Maps → Cari Lokasi → Bagikan (Share) → Sematkan Peta (Embed a map) → Salin URL yang ada di dalam <code>src="..."</code>.
        </p>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={saving} 
          size="lg" 
          className="w-full sm:w-auto bg-prussian hover:bg-prussian/90 text-white font-display"
        >
          {saving ? 'Menyimpan...' : 'Simpan Profil Kelurahan'}
        </Button>
      </div>
    </form>
  )
}

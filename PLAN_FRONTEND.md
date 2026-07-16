# Frontend Design Polish Plan — Kelurahan Manembo-nembo Tengah

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menutup gap tampilan — homepage sudah dapat token desain (via `PLAN.md` Task 9), tapi 7 halaman admin dan 2 halaman publik sisa masih pakai styling default Shadcn (`text-muted-foreground`, `bg-card`), belum konsisten dengan sistem desain di `DESIGN.md`.

**Prasyarat:** Semua fungsional (`PLAN.md` Task 1–9) sudah selesai dan berjalan. Plan ini murni styling, tidak menambah fitur baru, tidak mengubah skema database atau server actions.

**Rujukan wajib dibaca sebelum eksekusi:** `DESIGN.md` — token warna (Prussian Blue, Mughal Green, Teal Blue, Pastel Blue, Light Silver), tipografi 3-role (Space Grotesk/Inter/IBM Plex Mono), dan checklist konsistensi di section 7.

## Global Constraints
- Tidak menambah warna/hex baru di luar 5 token `DESIGN.md`.
- Tidak mengubah logic server actions, query, atau skema — murni ganti className.
- Interaksi (button, dialog, form validation) tetap pakai komponen Shadcn UI apa adanya — yang diganti cuma warna/tipografi wrapper di sekitarnya.
- Shell admin (`app/admin/layout.tsx`) sudah sesuai — jangan diubah, jadi rujukan pola styling untuk task ini.

---

### Task 10: Restyle Halaman Konten Admin (sesuai DESIGN.md)

**Context:** Shell admin (`app/admin/layout.tsx` — sidebar + topbar) sudah pakai token brand dengan baik. Yang belum: konten di dalam `<main>` tiap 7 halaman (berita, produk, POS, riwayat, laporan, profil, galeri) masih Shadcn default (`text-muted-foreground`, `bg-card`, dst).

**Files:**
- Create: `components/admin/PageHeader.tsx` (shared, dipakai semua halaman)
- Modify: `app/admin/berita/page.tsx`
- Modify: `app/admin/produk/page.tsx`
- Modify: `app/admin/pos/page.tsx`, `app/admin/pos/Cart.tsx`, `app/admin/pos/ProductGrid.tsx`
- Modify: `app/admin/pos/riwayat/page.tsx`
- Modify: `app/admin/laporan/page.tsx`
- Modify: `app/admin/profil/ProfilForm.tsx`
- Modify: `app/admin/galeri/page.tsx`

- [ ] **Step 1: Shared PageHeader component**

`components/admin/PageHeader.tsx`:
```tsx
export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-1">{eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-prussian">{title}</h1>
      </div>
      {action}
    </div>
  )
}
```

- [ ] **Step 2: Restyle Berita**

`app/admin/berita/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { BeritaForm } from './BeritaForm'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function BeritaPage() {
  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita_desa')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="CMS" title="Berita Desa" />
      <BeritaForm />
      <div className="space-y-2">
        {beritaList?.map((b) => (
          <div key={b.id} className="rounded-lg border border-pastel-blue bg-white p-4">
            <p className="font-medium text-prussian">
              {b.judul}{' '}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${b.status === 'published' ? 'bg-mughal-green/10 text-mughal-green' : 'bg-teal-blue/10 text-teal-blue'}`}>
                {b.status}
              </span>
            </p>
            <p className="text-sm text-prussian/50 font-mono">/{b.slug}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Restyle Produk (tabel harga)**

`app/admin/produk/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { ProdukForm } from './ProdukForm'
import { deleteProduk } from '@/lib/actions/produk'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteProduk(formData.get('id') as string)
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Bank Sampah" title="Master Produk" />
      <ProdukForm />
      <div className="rounded-lg border border-pastel-blue bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-light-silver">
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Nama</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Kategori</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Harga/kg</th>
              <th className="h-11 px-4 text-left font-mono text-xs uppercase tracking-wider text-prussian/60">Stok (kg)</th>
              <th className="h-11 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {produk?.map((p) => (
              <tr key={p.id} className="border-t border-pastel-blue/60">
                <td className="p-4 text-prussian font-medium">{p.nama_produk}</td>
                <td className="p-4 text-teal-blue">{p.kategori}</td>
                <td className="p-4 font-mono text-prussian">Rp{p.harga_per_kg.toLocaleString('id-ID')}</td>
                <td className="p-4 font-mono text-mughal-green">{p.stok_saat_ini}</td>
                <td className="p-4 text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Restyle POS**

`app/admin/pos/page.tsx` — tambahkan `PageHeader` di atas grid existing:
```tsx
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from './ProductGrid'
import { Cart } from './Cart'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function PosPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  return (
    <div>
      <PageHeader eyebrow="Transaksi" title="Kasir POS" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ProductGrid produk={produk ?? []} />
        </div>
        <Cart />
      </div>
    </div>
  )
}
```

`app/admin/pos/ProductGrid.tsx` — ganti class `Card` jadi styled card, harga pakai mono hijau:
```tsx
// Di dalam <Card>, ganti isi jadi:
<Card key={p.id} className="p-4 space-y-2 border-pastel-blue">
  <p className="font-medium text-prussian">{p.nama_produk}</p>
  <p className="text-sm text-teal-blue">{p.kategori} — <span className="font-mono text-mughal-green">Rp{p.harga_per_kg.toLocaleString('id-ID')}/kg</span></p>
  {/* input + button tetap sama */}
</Card>
```

`app/admin/pos/Cart.tsx` — ganti wrapper dan total jadi styled:
```tsx
// Ganti wrapper luar:
<div className="rounded-lg border-2 border-mughal-green bg-white p-4 space-y-3">
  <h2 className="font-display font-semibold text-prussian">Keranjang</h2>
  {/* ...input nama, list items tetap... */}
  <div className="border-t border-pastel-blue pt-2 font-semibold flex justify-between text-prussian">
    <span>Total</span>
    <span className="font-mono text-mughal-green">Rp{total().toLocaleString('id-ID')}</span>
  </div>
  {/* button checkout tetap pakai <Button> Shadcn, biar konsisten interaksi */}
</div>
```

- [ ] **Step 5: Restyle Riwayat Transaksi**

`app/admin/pos/riwayat/page.tsx` — ganti header dan card status:
```tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { batalkanTransaksi } from '@/lib/actions/transaksi'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function RiwayatPage() {
  const supabase = await createClient()
  const { data: transaksi } = await supabase
    .from('transaksi')
    .select('*, detail_transaksi(*, produk_bumdes(nama_produk))')
    .order('created_at', { ascending: false })
    .limit(50)

  async function handleBatal(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await batalkanTransaksi(id, 'Dibatalkan oleh admin')
  }

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Transaksi" title="Riwayat" />
      {transaksi?.map((t) => (
        <div key={t.id} className="rounded-lg border border-pastel-blue bg-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-prussian font-medium">{t.nama_pelanggan ?? 'Anonim'}</p>
              <p className="font-mono text-mughal-green">Rp{t.total_bayar.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-2 py-1 rounded-full ${t.status === 'aktif' ? 'bg-mughal-green/10 text-mughal-green' : 'bg-red-100 text-red-600'}`}>
                {t.status}
              </span>
              {t.status === 'aktif' && (
                <form action={handleBatal}>
                  <input type="hidden" name="id" value={t.id} />
                  <Button variant="destructive" size="sm" type="submit">Batalkan</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Restyle Laporan**

`app/admin/laporan/page.tsx` — ganti header dan `<section>` jadi kartu brand:
```tsx
import { getLaporanHarian, getLaporanBulanan } from '@/lib/queries/laporan'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function LaporanPage({ searchParams }: { searchParams: Promise<{ tanggal?: string }> }) {
  const { tanggal } = await searchParams
  const today = tanggal ?? new Date().toISOString().slice(0, 10)
  const now = new Date()

  const [harian, bulanan] = await Promise.all([
    getLaporanHarian(today),
    getLaporanBulanan(now.getFullYear(), now.getMonth() + 1),
  ])

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rekap" title="Laporan" />

      <section className="rounded-lg border border-pastel-blue bg-white p-5">
        <h2 className="font-display font-semibold text-prussian mb-2">Rekap Harian ({today})</h2>
        <p className="text-prussian/70">Total Omzet: <span className="font-mono text-mughal-green font-semibold">Rp{harian.totalOmzet.toLocaleString('id-ID')}</span></p>
        <p className="text-prussian/70">Jumlah Transaksi: <span className="font-mono">{harian.jumlahTransaksi}</span></p>
        <ul className="mt-3 space-y-1">
          {Object.entries(harian.kgPerKategori).map(([kategori, kg]) => (
            <li key={kategori} className="text-sm text-teal-blue font-mono">{kategori}: {kg} kg</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-pastel-blue bg-white p-5">
        <h2 className="font-display font-semibold text-prussian mb-2">Rekap Bulan Ini</h2>
        <p className="text-prussian/70">Total Omzet: <span className="font-mono text-mughal-green font-semibold">Rp{bulanan.totalOmzet.toLocaleString('id-ID')}</span></p>
        <p className="text-prussian/70">Jumlah Transaksi: <span className="font-mono">{bulanan.jumlahTransaksi}</span></p>
      </section>
    </div>
  )
}
```

- [ ] **Step 7: Restyle Profil Form**

`app/admin/profil/page.tsx` — tambah `PageHeader`. `ProfilForm.tsx` — ganti label jadi `text-prussian font-medium text-sm`, textarea/input tetap Shadcn (interaksi konsisten), tombol submit pakai default `<Button>` (sudah otomatis ambil warna primary Shadcn — cek `globals.css` `--primary` sudah di-set ke Prussian/Mughal Green kalau belum, opsional disesuaikan di Step 8).

- [ ] **Step 8: Restyle Galeri Admin**

`app/admin/galeri/page.tsx` — tambah `PageHeader`, ganti tombol hapus foto tetap `variant="destructive"`, tambah border `border-pastel-blue` di grid item.

- [ ] **Step 9: Verify**

```bash
npm run dev
```
Login admin → cek semua 7 halaman: warna brand konsisten (Prussian/Mughal Green/Teal/Pastel Blue/Light Silver), font-display di judul, font-mono di angka. Cek gak ada `text-muted-foreground`/`bg-card` tersisa (`grep -rn "muted-foreground\|bg-card" app/admin` harus kosong kecuali di komponen Shadcn UI internal seperti Table/Dialog).

- [ ] **Step 10: Commit**

```bash
git add components/admin/PageHeader.tsx app/admin
git commit -m "style: apply brand design tokens to all admin content pages"
```

---

### Task 11: Polish Halaman Publik Sisa

**Files:**
- Modify: `app/galeri/page.tsx`
- Modify: `app/berita/[slug]/page.tsx`

- [ ] **Step 1: Restyle halaman galeri penuh**

`app/galeri/page.tsx` — pakai layout & warna sama seperti `GaleriSection` di homepage (grid 3 kolom, hover teal overlay), tambah header halaman bergaya sama seperti section homepage (`bg-prussian` mini-header di atas, eyebrow + judul `font-display`).

- [ ] **Step 2: Restyle halaman detail berita**

`app/berita/[slug]/page.tsx` — tambah eyebrow "Berita" (`font-mono text-teal-blue`), judul `font-display text-3xl text-prussian`, tanggal publish `font-mono text-sm text-prussian/50`, isi berita tetap `whitespace-pre-line` tapi warna `text-prussian/80 leading-relaxed`. Tambah link "← Kembali ke Beranda" di atas judul.

- [ ] **Step 3: Verify**

```bash
npm run dev
```
Buka `/galeri` dan `/berita/<slug-yang-ada>` → cek konsisten sama homepage: warna, font, spacing.

- [ ] **Step 4: Commit**

```bash
git add app/galeri app/berita
git commit -m "style: polish remaining public pages (galeri, berita detail)"
```

---

---

## Self-Review

**Scope check:** Task 10 cover 7 halaman admin (berita, produk, POS, riwayat, laporan, profil, galeri) — semua yang teridentifikasi 0% ter-styling. Task 11 cover 2 halaman publik sisa (`/galeri`, `/berita/[slug]`) yang baru sebagian. Tidak ada halaman yang terlewat dari audit sebelumnya.

**Konsistensi:** `PageHeader` dipakai di semua 7 halaman admin (Task 10) — satu titik perubahan kalau nanti pola header mau diubah lagi, bukan diulang manual 7 kali.

**Verifikasi akhir:** setelah Task 10 dan 11 selesai, jalankan:
```bash
grep -rn "text-muted-foreground\|bg-card" app/admin app/galeri app/berita
```
Hasil yang tersisa (kalau ada) seharusnya cuma dari internal komponen `components/ui/*.tsx` (Shadcn), bukan dari halaman/section yang kita tulis manual. Kalau masih ada di luar itu, berarti ada halaman yang kelewat re-style.

**Urutan eksekusi:** Task 10 dan 11 independen satu sama lain, bisa dikerjakan paralel atau urutan bebas.
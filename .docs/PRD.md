# PRODUCT REQUIREMENTS DOCUMENT (PRD) — REVISI v3
**Nama Proyek:** Website Profil Kelurahan Manembo-nembo Tengah & Sistem Kasir Bank Sampah
**Lokasi:** Kelurahan Manembo-nembo Tengah, Kec. Matuari, Kota Bitung
**Fase:** MVP (Minimum Viable Product) - Proyek KKT
**Arsitektur Sistem:** Monolithic (CMS & POS terintegrasi)
**Tech Stack Utama:** Next.js (App Router), Supabase (DB + Auth + Storage), TailwindCSS, Shadcn UI, Zustand.

> **Catatan penamaan:** Lokasi ini adalah **Kelurahan** (di bawah Kecamatan → Kota), bukan **Desa**. Dipimpin **Lurah** (ASN), bukan Kepala Desa. Istilah "BUMDes" tidak berlaku hukum untuk Kelurahan — modul jual-beli sampah di sistem ini disebut **"Bank Sampah Kelurahan"**, bukan badan usaha terpisah.

## 1. Executive Summary
Sistem menyelesaikan dua masalah operasional kelurahan lewat satu platform:
1. **Representasi Digital:** Website profil kelurahan (sambutan lurah, profil, infografis, berita, peta, galeri) — performa tinggi via Server Components.
2. **Digitalisasi Bank Sampah:** Kasir digital pencatatan jual-beli sampah plastik per kilogram, plus pricelist publik agar warga tahu harga sebelum datang.

Model operasional: **Beli Putus (Cash & Carry)**. Warga jual sampah plastik ke petugas kelurahan, dibayar tunai di tempat.

## 2. Batasan Ruang Lingkup (Scope Management)

### ✅ In-Scope
- Homepage publik: Sambutan Lurah, Profil Kelurahan, Infografis, Berita, Peta, Pricelist Bank Sampah, Galeri.
- Dashboard Admin (Protected Route) via Supabase Auth.
- CMS Berita (CRUD + draft/published).
- CMS Profil Kelurahan (sambutan, visi-misi, sejarah, data statistik/infografis) — editable admin.
- CMS Galeri Foto (upload via Supabase Storage).
- Peta: embed Google Maps (iframe, koordinat wilayah).
- Master Data Produk Bank Sampah (kategori, harga per kg) + halaman publik pricelist read-only.
- Modul POS (Kasir) dengan Cart multi-item, per kg.
- Void/koreksi transaksi.
- Laporan rekap (harian, bulanan, total omzet).
- Audit trail admin per transaksi.

### ❌ Out-of-Scope (MVP ini)
- Login/akun untuk warga.
- Dompet digital/saldo warga.
- Notifikasi WhatsApp/struk digital.
- Payment gateway/e-wallet.
- Modul jual sampah ke pengepul (stok keluar) — fase 2.
- Peta interaktif custom (pakai embed Google Maps saja, bukan built-in map library).

## 3. Matriks Hak Akses (User Roles)
- **Warga Publik:** Read-only — semua halaman publik tanpa login.
- **Admin/Staf Kelurahan:** Kelola seluruh konten (berita, profil, galeri, produk), catat transaksi kasir, lihat laporan.

## 4. Kebutuhan Fungsional (Functional Requirements)

### 4.1 Modul Frontend Publik
- **[FR-1.1]** Homepage menampilkan seluruh section berikut secara berurutan, di-render SSR/SSG:
  - Sambutan Lurah (foto + teks)
  - Profil Kelurahan (sejarah singkat, visi-misi, struktur ringkas)
  - Infografis (data statistik: jumlah penduduk, KK, RT/RW, dll — tampil sebagai kartu angka)
  - Berita terbaru (published only)
  - Peta wilayah (embed Google Maps)
  - Pricelist Bank Sampah (tabel harga per kg, read-only, dari `produk_bumdes`)
  - Galeri foto kegiatan
- **[FR-1.2]** Halaman detail berita (`/berita/[slug]`).
- **[FR-1.3]** Halaman galeri penuh (`/galeri`) kalau foto lebih dari yang muat di homepage.

### 4.2 Modul Admin Dashboard - CMS Berita
- **[FR-2.1]** Autentikasi Supabase Auth.
- **[FR-2.2]** CRUD Berita Desa (slug, status draft/published, gambar).

### 4.3 Modul Admin Dashboard - CMS Profil Kelurahan
- **[FR-2.3]** Form edit single-record: sambutan lurah (teks + foto), visi-misi, sejarah, data infografis (jumlah penduduk, KK, RT, RW — angka bebas diedit), link/koordinat Google Maps.
- Disimpan sebagai satu baris (`profil_kelurahan`, singleton table) — bukan CRUD multi-record, karena kontennya cuma satu instance yang diedit berulang.

### 4.4 Modul Admin Dashboard - Galeri
- **[FR-2.4]** Upload foto ke Supabase Storage bucket `galeri`, simpan metadata (caption, tanggal) ke tabel `galeri_foto`.
- **[FR-2.5]** Hapus foto (hapus dari storage + DB).

### 4.5 Modul Admin Dashboard - Master Produk
- **[FR-2.6]** CRUD produk bank sampah (nama, kategori, harga per kg). `stok_saat_ini` read-only (auto-update via transaksi).

### 4.6 Modul Admin Dashboard - POS & Kasir
- **[FR-3.1]** Antarmuka Kasir menampilkan daftar produk, harga per kg.
- **[FR-3.2]** Cart multi-item (Zustand).
- **[FR-3.3]** Kalkulasi Subtotal & Total dinamis klien.
- **[FR-3.4]** Checkout atomik: `transaksi` + `detail_transaksi` + increment `stok_saat_ini`.
- **[FR-3.5]** Void transaksi (soft delete + alasan wajib).

### 4.7 Modul Admin Dashboard - Laporan
- **[FR-4.1]** Rekap harian: total kg per kategori, total omzet.
- **[FR-4.2]** Rekap bulanan: total omzet, jumlah transaksi.
- **[FR-4.3]** Filter by rentang tanggal.

## 5. Arsitektur Basis Data (Supabase / PostgreSQL)

1. **`auth.users`** — kredensial admin.

2. **`berita_desa`**: `id`, `judul`, `slug`, `konten`, `gambar_url`, `status`, `created_at`, `updated_at`.

3. **`profil_kelurahan`** (singleton — selalu 1 baris):
   - `id` (uuid, pk)
   - `sambutan_lurah` (text)
   - `foto_lurah_url` (text, nullable)
   - `visi` (text)
   - `misi` (text)
   - `sejarah` (text)
   - `jumlah_penduduk` (int, nullable)
   - `jumlah_kk` (int, nullable)
   - `jumlah_rt` (int, nullable)
   - `jumlah_rw` (int, nullable)
   - `google_maps_embed_url` (text) — iframe src dari Google Maps "Share > Embed a map"
   - `updated_at` (timestamptz)

4. **`galeri_foto`**:
   - `id` (uuid, pk)
   - `url` (text) — dari Supabase Storage
   - `caption` (text, nullable)
   - `created_at` (timestamptz)

5. **`produk_bumdes`**: `id`, `nama_produk`, `kategori`, `harga_per_kg`, `stok_saat_ini`, `created_at`.
   *(nama tabel dipertahankan `produk_bumdes` secara teknis untuk konsistensi kode existing — istilah publik tetap "Bank Sampah Kelurahan")*

6. **`transaksi`**: `id`, `nama_pelanggan`, `admin_id`, `total_bayar`, `metode_pembayaran`, `status`, `alasan_pembatalan`, `created_at`.

7. **`detail_transaksi`**: `id`, `transaksi_id`, `produk_id`, `jumlah_kg`, `harga_satuan`, `subtotal`.

## 6. Row Level Security (Supabase RLS)
- `berita_desa`: publik `SELECT` where `status='published'`. Admin full CRUD.
- `profil_kelurahan`: publik `SELECT` semua (satu baris, semua public). Admin `UPDATE` only (tidak perlu insert/delete — singleton, dibuat sekali via seed).
- `galeri_foto`: publik `SELECT` semua. Admin full CRUD.
- `produk_bumdes`: publik `SELECT` (untuk pricelist) — **tapi hanya kolom nama, kategori, harga_per_kg** (bukan stok, lewat view terpisah kalau perlu sembunyikan stok dari publik). Admin full CRUD.
- `transaksi`, `detail_transaksi`: admin-only, no public access sama sekali.
- Storage bucket `galeri`: publik read, admin write (policy di Supabase Storage).

## 7. Catatan Fase 2 (Backlog)
- Modul jual sampah ke pengepul + tracking margin.
- Export laporan PDF/Excel.
- Print struk transaksi.
- Multi-galeri per kategori (kegiatan, fasilitas, dll) kalau foto makin banyak.
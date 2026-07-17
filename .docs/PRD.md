# Product Requirements Document (PRD)

## Website Profil Kelurahan Manembo-nembo Tengah & Sistem Kasir Bank Sampah

| Informasi | Detail |
| --- | --- |
| Nama Proyek | Website Profil Kelurahan Manembo-nembo Tengah & Sistem Kasir Bank Sampah |
| Lokasi | Kelurahan Manembo-nembo Tengah, Kec. Matuari, Kota Bitung |
| Fase | MVP (Minimum Viable Product) - Proyek KKT |
| Arsitektur | Monolithic: website publik, CMS, dan POS terintegrasi |
| Tech Stack | Next.js App Router, Supabase Database/Auth/Storage, TailwindCSS, Shadcn UI, Zustand |

> **Catatan penamaan:** Manembo-nembo Tengah adalah **Kelurahan**, bukan Desa. Dipimpin oleh **Lurah**, bukan Kepala Desa. Istilah **BUMDes** tidak digunakan pada komunikasi publik karena tidak berlaku untuk kelurahan. Modul pengelolaan jual-beli sampah disebut **Bank Sampah Kelurahan**.

---

## 1. Executive Summary

Sistem ini adalah platform digital terpadu untuk mendukung pelayanan informasi publik Kelurahan Manembo-nembo Tengah dan operasional Bank Sampah Kelurahan.

Platform memiliki dua tujuan utama:

1. **Representasi digital kelurahan**  
   Menyediakan website profil resmi yang menampilkan sambutan lurah, profil kelurahan, visi-misi, data infografis, berita, peta wilayah, dan galeri kegiatan.

2. **Digitalisasi Bank Sampah Kelurahan**  
   Menyediakan sistem kasir untuk mencatat transaksi pembelian sampah plastik dari warga berdasarkan berat per kilogram, lengkap dengan master harga, riwayat transaksi, koreksi transaksi, dan laporan rekap.

Model operasional Bank Sampah Kelurahan pada MVP adalah **beli putus / cash and carry**. Warga membawa sampah plastik ke petugas, sampah ditimbang, transaksi dicatat oleh admin, lalu warga dibayar tunai di tempat.

---

## 2. Tujuan Produk

- Menyediakan kanal informasi resmi kelurahan yang mudah diakses warga.
- Memudahkan admin/staf kelurahan mengelola konten website tanpa mengubah kode aplikasi.
- Menyediakan daftar harga Bank Sampah Kelurahan secara publik dan transparan.
- Mengurangi pencatatan manual transaksi bank sampah.
- Menyediakan laporan dasar untuk memantau total transaksi, berat sampah, dan nilai pembayaran.

---

## 3. Batasan Ruang Lingkup

### 3.1 In-Scope MVP

- Website publik profil kelurahan.
- Halaman berita dan detail berita.
- Halaman profil kelurahan.
- Halaman visi-misi.
- Halaman galeri kegiatan.
- Pricelist publik Bank Sampah Kelurahan.
- Login admin menggunakan Supabase Auth.
- Dashboard admin terproteksi.
- CMS berita dengan status draft/published.
- CMS profil kelurahan untuk sambutan lurah, visi, misi, sejarah, data infografis, dan peta.
- CMS galeri foto dengan upload gambar.
- Master data produk Bank Sampah Kelurahan.
- Modul POS/kasir untuk transaksi pembelian sampah dari warga.
- Riwayat transaksi.
- Void/koreksi transaksi dengan alasan pembatalan.
- Laporan rekap harian, bulanan, dan rentang tanggal.

### 3.2 Out-of-Scope MVP

- Akun/login untuk warga.
- Dompet digital atau saldo warga.
- Pembayaran non-tunai, payment gateway, atau e-wallet.
- Notifikasi WhatsApp.
- Struk digital otomatis.
- Cetak struk transaksi.
- Export laporan PDF/Excel.
- Modul penjualan sampah ke pengepul.
- Perhitungan margin/laba bank sampah.
- Peta interaktif custom berbasis map library.
- Multi-role granular di luar admin/staf kelurahan.

---

## 4. User Roles dan Hak Akses

| Role | Hak Akses |
| --- | --- |
| Warga Publik | Mengakses halaman publik tanpa login: profil, berita, galeri, peta, dan pricelist Bank Sampah Kelurahan. |
| Admin/Staf Kelurahan | Login ke dashboard admin, mengelola konten, mengelola produk bank sampah, mencatat transaksi kasir, melakukan void transaksi, dan melihat laporan. |

---

## 5. Kebutuhan Fungsional

### 5.1 Website Publik

| ID | Requirement |
| --- | --- |
| FR-1.1 | Sistem menampilkan homepage publik berisi hero/identitas kelurahan, sambutan lurah, ringkasan profil, data infografis, berita terbaru, peta wilayah, pricelist Bank Sampah Kelurahan, dan galeri terbaru. |
| FR-1.2 | Sistem menyediakan halaman daftar berita publik. |
| FR-1.3 | Sistem menyediakan halaman detail berita berdasarkan slug. |
| FR-1.4 | Sistem hanya menampilkan berita berstatus published kepada publik. |
| FR-1.5 | Sistem menyediakan halaman profil kelurahan. |
| FR-1.6 | Sistem menyediakan halaman visi-misi kelurahan. |
| FR-1.7 | Sistem menyediakan halaman galeri penuh. |
| FR-1.8 | Sistem menampilkan pricelist Bank Sampah Kelurahan secara read-only kepada publik. |

### 5.2 Admin Authentication

| ID | Requirement |
| --- | --- |
| FR-2.1 | Admin dapat login menggunakan email dan password melalui Supabase Auth. |
| FR-2.2 | Halaman dashboard admin hanya dapat diakses oleh pengguna yang sudah login. |
| FR-2.3 | Admin dapat logout dari sistem. |

### 5.3 CMS Berita

| ID | Requirement |
| --- | --- |
| FR-3.1 | Admin dapat membuat berita baru dengan judul, slug, konten, gambar, dan status. |
| FR-3.2 | Admin dapat mengubah berita. |
| FR-3.3 | Admin dapat menghapus berita. |
| FR-3.4 | Admin dapat menyimpan berita sebagai draft atau published. |
| FR-3.5 | Slug berita digunakan sebagai URL detail berita. |

### 5.4 CMS Profil Kelurahan

| ID | Requirement |
| --- | --- |
| FR-4.1 | Admin dapat mengubah sambutan lurah. |
| FR-4.2 | Admin dapat mengubah foto lurah. |
| FR-4.3 | Admin dapat mengubah visi, misi, dan sejarah kelurahan. |
| FR-4.4 | Admin dapat mengubah data infografis seperti jumlah penduduk, jumlah KK, jumlah RT, dan jumlah RW. |
| FR-4.5 | Admin dapat mengubah link/embed Google Maps. |
| FR-4.6 | Data profil kelurahan disimpan sebagai satu data utama/singleton karena hanya ada satu profil resmi kelurahan. |

### 5.5 CMS Galeri

| ID | Requirement |
| --- | --- |
| FR-5.1 | Admin dapat mengunggah foto kegiatan. |
| FR-5.2 | Admin dapat menambahkan caption foto. |
| FR-5.3 | Admin dapat menghapus foto. |
| FR-5.4 | Foto yang dihapus tidak lagi tampil di halaman publik. |

### 5.6 Master Produk Bank Sampah Kelurahan

| ID | Requirement |
| --- | --- |
| FR-6.1 | Admin dapat menambahkan produk/jenis sampah. |
| FR-6.2 | Admin dapat mengubah nama produk, kategori, dan harga per kilogram. |
| FR-6.3 | Admin dapat menghapus produk yang tidak digunakan. |
| FR-6.4 | Sistem menyimpan stok/akumulasi berat saat ini untuk setiap produk. |
| FR-6.5 | Pricelist publik hanya menampilkan nama produk, kategori, dan harga per kilogram. |

### 5.7 POS/Kasir Bank Sampah Kelurahan

| ID | Requirement |
| --- | --- |
| FR-7.1 | Admin dapat membuka halaman kasir dan melihat daftar produk bank sampah. |
| FR-7.2 | Admin dapat menambahkan satu atau lebih produk ke cart transaksi. |
| FR-7.3 | Admin dapat memasukkan berat sampah dalam kilogram untuk setiap item. |
| FR-7.4 | Sistem menghitung subtotal setiap item berdasarkan berat dan harga per kilogram. |
| FR-7.5 | Sistem menghitung total pembayaran transaksi. |
| FR-7.6 | Admin dapat menyimpan transaksi checkout. |
| FR-7.7 | Saat checkout berhasil, sistem menyimpan data transaksi dan detail transaksi. |
| FR-7.8 | Saat checkout berhasil, sistem menambah stok/akumulasi berat produk terkait. |
| FR-7.9 | Transaksi menggunakan metode pembayaran tunai sebagai default MVP. |

### 5.8 Void/Koreksi Transaksi

| ID | Requirement |
| --- | --- |
| FR-8.1 | Admin dapat membatalkan/void transaksi yang salah. |
| FR-8.2 | Admin wajib mengisi alasan pembatalan saat melakukan void. |
| FR-8.3 | Transaksi yang dibatalkan tidak dihapus permanen, tetapi diberi status void/cancelled. |
| FR-8.4 | Transaksi void tidak dihitung sebagai transaksi aktif pada laporan. |

### 5.9 Laporan

| ID | Requirement |
| --- | --- |
| FR-9.1 | Admin dapat melihat rekap transaksi harian. |
| FR-9.2 | Admin dapat melihat rekap transaksi bulanan. |
| FR-9.3 | Admin dapat memfilter laporan berdasarkan rentang tanggal. |
| FR-9.4 | Laporan menampilkan total transaksi, total berat kilogram, total pembayaran, dan rekap per kategori produk. |

---

## 6. Kebutuhan Non-Fungsional

| Aspek | Requirement |
| --- | --- |
| Keamanan | Dashboard admin wajib dilindungi autentikasi. |
| Akses publik | Halaman publik dapat diakses tanpa login. |
| Privasi transaksi | Data transaksi dan detail transaksi hanya dapat diakses admin. |
| Konsistensi data | Checkout transaksi harus menyimpan transaksi, detail transaksi, dan pembaruan stok secara konsisten. |
| Kemudahan penggunaan | Admin non-teknis harus dapat mengelola konten dan transaksi melalui dashboard. |
| Responsif | Website publik dan dashboard admin dapat digunakan pada perangkat desktop dan mobile. |
| Performa | Konten publik dioptimalkan untuk rendering cepat menggunakan kemampuan Next.js App Router. |

---

## 7. Arsitektur Sistem

Aplikasi menggunakan arsitektur monolithic berbasis Next.js App Router. Website publik, dashboard admin, CMS, dan POS berada dalam satu aplikasi yang sama.

Supabase digunakan untuk:

- database PostgreSQL;
- autentikasi admin;
- storage gambar berita/profil/galeri;
- Row Level Security untuk membatasi akses data.

State cart pada modul kasir dikelola di sisi klien menggunakan Zustand.

---

## 8. Arsitektur Basis Data

### 8.1 `auth.users`

Menyimpan kredensial admin melalui Supabase Auth.

### 8.2 `berita_desa`

Menyimpan konten berita.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `judul` | Judul berita. |
| `slug` | URL slug berita. |
| `konten` | Isi berita. |
| `gambar_url` | URL gambar berita. |
| `status` | Status draft/published. |
| `created_at` | Waktu pembuatan data. |
| `updated_at` | Waktu pembaruan data. |

> Catatan implementasi: meskipun nama tabel memakai `berita_desa`, istilah publik yang digunakan pada UI dan dokumen adalah **Berita Kelurahan**.

### 8.3 `profil_kelurahan`

Menyimpan satu data utama profil kelurahan.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `sambutan_lurah` | Teks sambutan lurah. |
| `foto_lurah_url` | URL foto lurah. |
| `visi` | Visi kelurahan. |
| `misi` | Misi kelurahan. |
| `sejarah` | Sejarah kelurahan. |
| `jumlah_penduduk` | Jumlah penduduk. |
| `jumlah_kk` | Jumlah kepala keluarga. |
| `jumlah_rt` | Jumlah RT. |
| `jumlah_rw` | Jumlah RW. |
| `google_maps_embed_url` | URL embed Google Maps. |
| `updated_at` | Waktu pembaruan data. |

### 8.4 `galeri_foto`

Menyimpan metadata foto galeri.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `url` | URL foto dari storage. |
| `caption` | Caption foto. |
| `created_at` | Waktu pembuatan data. |

### 8.5 `produk_bumdes`

Menyimpan master produk/jenis sampah Bank Sampah Kelurahan.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `nama_produk` | Nama produk/jenis sampah. |
| `kategori` | Kategori produk. |
| `harga_per_kg` | Harga per kilogram. |
| `stok_saat_ini` | Akumulasi berat/stok saat ini. |
| `created_at` | Waktu pembuatan data. |

> Catatan implementasi: nama tabel `produk_bumdes` dipertahankan sebagai detail teknis internal. Istilah publik tetap **Bank Sampah Kelurahan**.

### 8.6 `transaksi`

Menyimpan header transaksi kasir.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `nama_pelanggan` | Nama warga/pelanggan. |
| `admin_id` | ID admin yang mencatat transaksi. |
| `total_bayar` | Total nilai pembayaran transaksi. |
| `metode_pembayaran` | Metode pembayaran transaksi. |
| `status` | Status transaksi. |
| `alasan_pembatalan` | Alasan void/pembatalan transaksi. |
| `created_at` | Waktu pembuatan transaksi. |

### 8.7 `detail_transaksi`

Menyimpan item produk pada setiap transaksi.

| Kolom | Keterangan |
| --- | --- |
| `id` | Primary key. |
| `transaksi_id` | Relasi ke tabel `transaksi`. |
| `produk_id` | Relasi ke tabel `produk_bumdes`. |
| `jumlah_kg` | Berat sampah dalam kilogram. |
| `harga_satuan` | Harga produk per kilogram saat transaksi. |
| `subtotal` | Subtotal item transaksi. |

---

## 9. Row Level Security

| Resource | Kebijakan Akses |
| --- | --- |
| `berita_desa` | Publik hanya dapat membaca berita berstatus published; admin dapat mengelola seluruh berita. |
| `profil_kelurahan` | Publik dapat membaca profil; admin dapat mengubah profil. |
| `galeri_foto` | Publik dapat membaca galeri; admin dapat mengelola galeri. |
| `produk_bumdes` | Publik hanya membaca data pricelist yang diperlukan; admin dapat mengelola produk. |
| `transaksi` | Hanya admin yang dapat mengakses. |
| `detail_transaksi` | Hanya admin yang dapat mengakses. |
| Storage galeri/profil/berita | Publik dapat membaca gambar yang dipublikasikan; admin dapat mengunggah dan menghapus sesuai kebutuhan. |

---

## 10. Backlog Fase Berikutnya

- Modul penjualan sampah ke pengepul.
- Perhitungan stok keluar dan margin.
- Export laporan PDF/Excel.
- Cetak struk transaksi.
- Notifikasi WhatsApp.
- Akun warga dan riwayat setoran warga.
- Kategorisasi galeri lanjutan.

# DESIGN.md — Design System Kelurahan Manembo-nembo Tengah

**Proyek:** Website Profil Kelurahan & Kasir Bank Sampah
**Framework:** Next.js 15 + Tailwind CSS v4 + Shadcn UI
**Status:** v1 — diterapkan di Task 9 (`PLAN.md`)

---

## 1. Prinsip Desain

Subjek: kelurahan (pemerintahan lokal, civic) + bank sampah (lingkungan, transaksi kasir). Desain harus terasa **resmi tapi hijau/lingkungan**, bukan generik pemerintahan kaku, dan bukan juga template AI (cream+serif, atau dark-mode+neon).

Satu elemen berani: **pricelist bank sampah didesain seperti struk kasir asli** (border dashed, header solid, angka mono) — karena kontennya memang harga transaksi, bentuknya menegaskan fungsinya. Section lain tetap tenang, disiplin, biar struk ini yang jadi elemen paling diingat.

---

## 2. Warna

Palet dari klien, tiap warna punya peran tetap — **jangan dipakai bertukar tempat**.

| Nama | Hex | Peran |
|---|---|---|
| Prussian Blue | `#103A57` | Warna dasar/otoritas. Header, teks judul besar, teks body utama. |
| Mughal Green | `#366B2B` | Aksen utama. Angka statistik, ring foto lurah, header struk harga. |
| Teal Blue | `#307B8E` | Aksen sekunder. Label eyebrow, link, hover overlay galeri, border peta. |
| Pastel Blue | `#A9D3C5` | Fill kartu/border halus di atas Light Silver. Teks sekunder di header gelap. |
| Light Silver | `#CEE5D6` | Background section selang-seling (bukan putih polos semua). |

**Aturan pemakaian:**
- Section bergantian background: putih → Light Silver → putih → Light Silver, dst. Jangan dua section berturutan warna sama.
- Prussian Blue **tidak pernah** dipakai sebagai background section biasa — khusus header utama (hero) dan footer, biar tetap terasa "otoritatif" bukan dominan.
- Semua teks di atas background gelap (Prussian) pakai putih atau Pastel Blue, bukan warna lain.

---

## 3. Tipografi

Tiga font, tiga peran — jangan campur aduk:

| Role | Font | Dipakai untuk |
|---|---|---|
| Display | **Space Grotesk** | Semua `h1`, `h2`, `h3`, nama kelurahan, judul section. |
| Body | **Inter** | Paragraf: sambutan, sejarah, visi-misi, isi berita. |
| Mono/Data | **IBM Plex Mono** | Angka: infografis, harga per kg, tanggal, eyebrow label (uppercase kecil). |

**Kenapa bukan satu font untuk semua:** Space Grotesk kasih kesan "kelurahan yang melek digital" di judul, tapi kalau dipakai di body paragraf panjang jadi capek dibaca — makanya body tetap Inter. Mono khusus angka bikin data (statistik, harga) gampang di-scan mata, beda konteks visual dari teks naratif.

**Load via `next/font/google`** di `app/layout.tsx` (bukan `<link>` CDN) — biar Next.js optimasi otomatis.

---

## 4. Tailwind v4 — Cara Terapkan Token

> ⚠️ Project ini pakai **Tailwind v4**. TIDAK ADA `tailwind.config.ts`. Token warna & font didefinisikan lewat `@theme` block di `app/globals.css`, bukan `theme.extend` di config file. Kalau ada dokumentasi/tutorial yang nyebut `tailwind.config.ts`, itu untuk v3 — abaikan untuk project ini.

`app/globals.css` — tambahkan `@theme` block tepat setelah `@import "tailwindcss";`, **sebelum** `@layer base` (existing Shadcn variables tetap dipertahankan di `@layer base`, tidak dihapus):

```css
@import "tailwindcss";

@theme {
  --color-prussian: #103A57;
  --color-mughal-green: #366B2B;
  --color-teal-blue: #307B8E;
  --color-pastel-blue: #A9D3C5;
  --color-light-silver: #CEE5D6;

  --font-display: var(--font-space-grotesk), sans-serif;
  --font-body: var(--font-inter), sans-serif;
  --font-mono: var(--font-plex-mono), monospace;
}

@layer base {
  /* ...existing :root, .dark, dan base styles TETAP di sini, tidak diubah... */
}

h1, h2, h3 {
  font-family: var(--font-space-grotesk);
}
```

Setelah `@theme` didefinisikan, class Tailwind berikut otomatis tersedia tanpa config tambahan:
`bg-prussian` `text-prussian` `border-prussian` · `bg-mughal-green` `text-mughal-green` · `bg-teal-blue` `text-teal-blue` `border-teal-blue` · `bg-pastel-blue` `border-pastel-blue` · `bg-light-silver` · `font-display` `font-body` `font-mono`

`app/layout.tsx`:
```tsx
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-mono" });

// di <html>: className={cn(spaceGrotesk.variable, inter.variable, plexMono.variable)}
// di <body>: className="font-body text-prussian antialiased"
```

**Verifikasi token aktif:** buka DevTools di browser, inspect `<body>` — kalau warna Prussian Blue kebaca di computed style, token aktif. Kalau class Tailwind ke-drop / warna gak keluar, cek urutan: `@theme` harus di atas `@layer base`, bukan di bawahnya.

---

## 5. Layout & Struktur Section

Homepage adalah satu kolom panjang, section demi section, urutan tetap (tidak bisa diacak — tiap section punya alasan urutan):

```
┌─────────────────────────────────┐
│ HEADER (bg-prussian)            │  ← nama kelurahan, eyebrow "Website Resmi"
├─────────────────────────────────┤
│ SAMBUTAN LURAH (bg-light-silver)│  ← foto bulat + teks, ring hijau
├─────────────────────────────────┤
│ PROFIL (bg-white)                │  ← visi/misi 2 kartu pastel-blue + sejarah
├─────────────────────────────────┤
│ INFOGRAFIS (bg-light-silver)     │  ← 4 kartu angka mono hijau
├─────────────────────────────────┤
│ BERITA TERBARU (bg-white)        │  ← list judul, border dashed pastel-blue
├─────────────────────────────────┤
│ PETA (bg-white)                  │  ← iframe Google Maps, border teal
├─────────────────────────────────┤
│ PRICELIST BANK SAMPAH             │  ← ⭐ SIGNATURE: struk kasir
│ (bg-light-silver)                 │
├─────────────────────────────────┤
│ GALERI (bg-white)                 │  ← grid 3 kolom, hover teal overlay
└─────────────────────────────────┘
```

**Container:** semua section pakai `mx-auto max-w-3xl` (kecuali header pakai lebar penuh dengan konten di-center max-w-3xl). Padding vertikal section konsisten `py-16`.

**Label eyebrow:** tiap section (kecuali header) punya label kecil di atas judul — `font-mono text-xs uppercase tracking-wider text-teal-blue`. Contoh: "Sambutan", "Profil", "Infografis", "Informasi", "Lokasi", "Bank Sampah", "Dokumentasi". Ini device struktural yang encode kategori konten, bukan dekorasi kosong.

---

## 6. Signature Element — Struk Kasir Pricelist

Elemen paling distingtif di seluruh desain. Detail konstruksi:

- Container `max-w-md`, background putih, `border-x-2 border-dashed` + border dashed custom di atas-bawah (meniru perforasi kertas struk).
- Header solid `bg-mughal-green` + teks putih: nama "STRUK HARGA BANK SAMPAH" (Space Grotesk) + subjudul kelurahan (mono, kecil, opacity 80%).
- Tiap baris produk: nama + kategori kiri, harga kanan pakai `font-mono` rata kanan (`Rp{harga}/kg`), dipisah `border-b border-dashed` antar baris (kecuali baris terakhir).
- Footer: garis dashed + teks kecil abu-abu "Harga berlaku di kantor kelurahan".

**Kenapa ini bukan gimmick:** kontennya literally adalah daftar harga transaksi kasir. Bentuk struk bukan dekorasi tempelan — dia representasi jujur dari fungsi kontennya (bukti/rujukan harga sebelum transaksi).

---

## 7. Checklist Konsistensi (pakai ini tiap kali nambah komponen baru)

- [ ] Warna cuma dari 5 token di atas — tidak ada hex baru ditulis manual di komponen.
- [ ] Judul section pakai `font-display` (otomatis via `h1/h2/h3` global rule), body pakai `font-body` (default).
- [ ] Angka/harga/tanggal pakai `font-mono`.
- [ ] Section berselang-seling `bg-white` / `bg-light-silver`, tidak dua berturutan sama.
- [ ] Ada eyebrow label mono di atas tiap judul section (kecuali header utama).
- [ ] Tidak menambah numbered badge (01/02/03) kecuali konten benar-benar berurutan/proses.
- [ ] Responsive: cek tampilan mobile — grid 4 kolom (infografis) dan 3 kolom (galeri) perlu breakpoint turun ke 2 kolom di layar kecil (`sm:grid-cols-2` fallback belum ada di kode awal — tambahkan saat polish mobile).

---

## 8. Referensi Implementasi

Kode lengkap tiap komponen (`SambutanLurah.tsx`, `ProfilSection.tsx`, `InfografisSection.tsx`, `PetaSection.tsx`, `PricelistSection.tsx`, `GaleriSection.tsx`, `app/page.tsx`) ada di **`PLAN.md` → Task 9**. Dokumen ini (`DESIGN.md`) adalah rujukan prinsip & keputusan desain; `PLAN.md` adalah rujukan kode siap-eksekusi. Kalau ada konflik antara keduanya di masa depan (misal desain direvisi lagi), `DESIGN.md` yang diupdate dulu sebagai source of truth keputusan, baru `PLAN.md`/kode menyusul.
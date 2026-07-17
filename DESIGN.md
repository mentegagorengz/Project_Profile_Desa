# Design System

## 1. Design Direction

Website ini memakai pendekatan **The Green Harmony**: bersih, resmi, ramah warga, dan dekat dengan isu lingkungan. Visual harus terasa seperti situs pemerintahan modern yang tetap ringan digunakan untuk kebutuhan operasional Bank Sampah Kelurahan.

Acuan komponen utama adalah **shadcn/ui**. Semua komponen custom wajib mengikuti pola shadcn: token semantic, radius konsisten, focus ring jelas, state interaktif lengkap, dan komposisi berbasis utility Tailwind.

---

# Palet Warna & Token Semantik

Dokumen ini berisi daftar lengkap palet warna yang digunakan dalam sistem desain, termasuk warna brand utama (brand colors), warna netral (greyscale), dan warna fungsional (semantic status).

## 1. Brand Colors
Warna utama yang membentuk identitas visual aplikasi. Digunakan secara selektif untuk elemen penting agar tidak berlebihan.

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Mughal Green** | `#366B2B` | Brand utama, Call to Action (CTA) primer, aksen ramah lingkungan |
| **Prussian Blue** | `#103A57` | Header gelap, footer, teks kontras tinggi (judul besar) |
| **Teal Blue** | `#307B8E` | Link aktif, secondary CTA, aksen informasi sekunder |
| **Pastel Blue** | `#A9D3C5` | Background lembut untuk highlight section (gunakan sangat terbatas) |
| **Light Silver** | `#CEE5D6` | Border aksen brand, card tint, divider lembut |

## 2. Neutral Colors (Greyscale & UI Elements)
Warna netral untuk membentuk struktur, layout, dan hierarki teks tanpa mendominasi visual brand. Sangat krusial untuk menjaga aksesibilitas dan kenyamanan membaca.

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Pure White** | `#FFFFFF` | Latar belakang utama (Body/Main Background), background card, input form |
| **Deeper Soft Gray-Green** | `#E8EDE9` | Background halaman alternatif (Muted background), pemisah section |
| **Slate Gray (Light)** | `#E2E8F0` | Garis tepi (border) standard, pembatas antar list (divider) |
| **Charcoal Gray** | `#4A5568` | Teks pendukung (Muted Foreground), placeholder text, metadata waktu |
| **Ink Black** | `#1A202C` | Teks utama (Body copy), paragraf, judul artikel (Foreground) |

## 3. Functional Colors (Semantic Status)
Warna baku universal yang digunakan untuk mengomunikasikan status sistem, peringatan, atau hasil dari sebuah tindakan.

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Success (Green)** | `#10B981` | Notifikasi berhasil, badge status "Aktif/Selesai", validasi form benar |
| **Warning (Amber)** | `#F59E0B` | Status "Pending", peringatan, notifikasi yang butuh perhatian |
| **Destructive (Red)** | `#EF4444` | Pesan error (Error Foreground), hapus data, status gagal/bahaya |

---

## 3. Shadcn Semantic Tokens

Gunakan token semantic shadcn sebagai sumber warna utama di komponen. Hindari pemakaian hex langsung di JSX kecuali untuk kasus dekoratif yang benar-benar spesifik.

| Shadcn Token | Value | Brand Mapping | Usage |
| --- | --- | --- | --- |
| `background` | `#FFFFFF` | Pure White | Latar utama halaman |
| `foreground` | `#1A202C` | Ink Black | Teks utama, paragraf, judul artikel |
| `card` | `#FFFFFF` | Pure White | Card, panel, popover |
| `card-foreground` | `#1A202C` | Ink Black | Teks di atas card |
| `popover` | `#FFFFFF` | Pure White | Dropdown, popover, command menu |
| `popover-foreground` | `#1A202C` | Ink Black | Teks di atas popover |
| `primary` | `#366B2B` | Mughal Green | CTA utama, tombol simpan, current nav |
| `primary-foreground` | `#FFFFFF` | Pure White | Teks/icon di atas primary |
| `secondary` | `#E8F0E5` | Light green tint | Badge, secondary button, panel pendukung |
| `secondary-foreground` | `#2D5A20` | Deep green | Teks di atas secondary |
| `muted` | `#E8EDE9` | Deeper Soft Gray-Green | Input, subtle section, empty state |
| `muted-foreground` | `#4A5568` | Charcoal Gray | Metadata, helper text, placeholder |
| `accent` | `#E5F0F3` | Light teal tint | Info kecil, highlight non-kritis |
| `accent-foreground` | `#1C5E6E` | Deep teal | Teks di atas accent |
| `border` | `#E2E8F0` | Slate Gray (Light) | Border card, input, table row |
| `input` | `#F4F7F5` | Off-White / Cool Gray | Input, textarea, select |
| `ring` | `#366B2B` | Mughal Green | Focus visible ring |
| `placeholder` | `#4A5568` | Charcoal Gray | Placeholder text input & textarea |
| `destructive` | `#EF4444` | Destructive (Red) | Delete, void, error state |
| `destructive-foreground` | `#FFFFFF` | Pure White | Teks/icon di atas destructive |

### Token Rules

- Komponen shadcn wajib memakai class semantic seperti `bg-primary`, `text-primary-foreground`, `bg-muted`, `border-border`, dan `ring-ring`.
- Brand color langsung seperti `text-prussian` atau `bg-mughal-green` boleh dipakai untuk elemen identitas, hero, navbar, footer, atau aksen editorial.
- State interaktif wajib memakai token, bukan warna random: hover, focus, active, disabled, loading, error.
- Muted text minimal `#4A5568` di background putih agar tetap terbaca.

---

## 4. Typography

| Role | Font | Weight | Usage |
| --- | --- | --- | --- |
| Headline | Space Grotesk | 600–700 | Hero, judul halaman, section heading |
| Body | Inter | 400–500 | Paragraf, navigasi, form, dashboard |
| Label | IBM Plex Mono | 400–600 | Label kecil, data, metadata singkat |

Rules:

- Heading menggunakan `text-wrap: balance` bila memungkinkan.
- Body text maksimal 65–75 karakter per baris.
- Jangan memakai uppercase panjang untuk body copy.
- UI label, button, form, dan table sebaiknya tetap memakai Inter agar terasa familiar dan mudah dibaca.
- IBM Plex Mono hanya untuk metadata pendek, angka, atau label teknis; jangan dipakai untuk paragraf panjang.

---

## 5. Layout System

| Token | Rule |
| --- | --- |
| Content width | `max-w-6xl` |
| Page padding | `px-6` |
| Section spacing | `py-16` sampai `py-24` |
| Card radius | `0.625rem` / `rounded-lg` |
| Card shadow | `shadow-card` untuk default, `shadow-hover` untuk hover penting |
| Responsive grid | `repeat(auto-fit, minmax(280px, 1fr))` |

### Layout Rules

- Public site boleh lebih lapang dan editorial.
- Admin dashboard harus lebih padat, langsung, dan task-oriented.
- Gunakan Flexbox untuk susunan satu dimensi dan Grid untuk susunan dua dimensi.
- Hindari nested card yang membuat hierarchy membingungkan.
- Jangan membuat container baru dengan max-width berbeda kecuali ada alasan layout yang jelas.

---

## 6. Shadcn Component Guidelines

### 6.1 Button

Acuan: `components/ui/button.tsx` dengan `class-variance-authority`.

| Variant | Visual Rule | Usage |
| --- | --- | --- |
| `default` | `bg-primary text-primary-foreground`, hover lebih gelap | Aksi utama: simpan, checkout, login |
| `secondary` | `bg-secondary text-secondary-foreground` | Aksi pendukung |
| `outline` | Border `border-border`, background transparan/putih | Navigasi ringan, filter, cancel |
| `ghost` | Background transparan, hover `bg-muted` | Navbar, sidebar, icon button |
| `destructive` | `bg-destructive text-destructive-foreground` | Delete, void transaksi |
| `link` | `text-teal-blue` atau `text-primary` | Link tekstual |

Rules:

- Button wajib punya hover, focus-visible, disabled, dan loading affordance.
- Primary action hanya satu per area utama layar.
- Jangan memakai warna baru untuk variant baru; turunkan dari token semantic.

### 6.2 Card

Acuan: shadcn `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

| Area | Rule |
| --- | --- |
| Container | `bg-card text-card-foreground border border-border rounded-lg shadow-card` |
| Header | Judul jelas, description opsional memakai `text-muted-foreground` |
| Content | Spacing konsisten, hindari nested card |
| Footer | Aksi sekunder atau metadata |

Usage:

- Public site: card untuk berita, galeri, infografis, dan pricelist highlight.
- Admin: card untuk panel form, summary laporan, dan grouping data.
- Card hover boleh mengubah border/shadow/background, tetapi jangan animasikan gambar di dalam card.

### 6.3 Input, Textarea, Label

Acuan: shadcn `Input`, `Textarea`, `Label`.

| Component | Rule |
| --- | --- |
| Input | `bg-input border-border focus-visible:ring-ring` |
| Textarea | Sama seperti input, tinggi menyesuaikan konten |
| Label | Inter medium atau IBM Plex Mono untuk label pendek/teknis |
| Helper text | `text-muted-foreground`, ukuran lebih kecil |
| Error text | `text-destructive` |

Rules:

- Setiap input wajib punya label yang jelas.
- Placeholder bukan pengganti label.
- Error state harus terlihat lewat teks dan border/ring, bukan warna saja.

### 6.4 Dropdown, Popover, dan Nested Menu

Acuan perilaku: shadcn Dropdown Menu / Popover pattern.

| Element | Rule |
| --- | --- |
| Surface | `bg-popover text-popover-foreground border border-border rounded-lg shadow-hover` |
| Item | `px-4 py-3`, hover `bg-muted`, focus jelas |
| Separator | `border-border` atau background `border` |
| Icon | Lucide icon ukuran 14–16px |

Rules:

- Parent dropdown harus punya indikator `chevron-down`.
- Item yang punya nested dropdown harus punya `chevron-right`.
- Dropdown jangan ditempatkan dalam parent dengan `overflow: hidden` atau `overflow: auto` jika bisa terpotong.
- Untuk kompleksitas tinggi, prioritaskan komponen shadcn/Radix-style yang sudah menangani keyboard navigation.

### 6.5 Drawer / Sheet / Mobile Navigation

Acuan: shadcn Sheet pattern.

| Area | Rule |
| --- | --- |
| Trigger | Hamburger button di kanan navbar pada `< lg` |
| Surface | `bg-background text-foreground border-border` |
| Width | Mobile full-width atau max `320px` dari kanan |
| Item | Vertical stack, tap target minimal `44px` |

Rules:

- Mobile navigation tidak boleh hanya mengandalkan hover.
- Nested menu mobile sebaiknya collapsible/accordion, bukan dropdown absolute.
- Tombol close harus jelas dan bisa diakses keyboard.

### 6.6 Table

Acuan: shadcn Table pattern.

| Element | Rule |
| --- | --- |
| Header | `bg-muted`, teks medium |
| Row | Border bawah `border-border` |
| Cell | Padding cukup, angka rata kanan bila berupa nominal/berat |
| Empty state | Gunakan copy yang membantu, bukan hanya “data kosong” |

Usage:

- Pricelist publik.
- Laporan admin.
- Riwayat transaksi.
- Master produk.

### 6.7 Badge

Acuan: shadcn Badge pattern.

| Variant | Usage |
| --- | --- |
| Secondary | Status ringan, kategori produk |
| Outline | Metadata netral |
| Destructive | Error, void, cancelled |
| Accent custom | Highlight hangat non-kritis |

Rules:

- Badge tidak boleh menjadi pengganti button.
- Gunakan teks singkat maksimal 1–3 kata.

### 6.8 Dialog / Alert Dialog

Acuan: shadcn Dialog dan Alert Dialog.

| Use Case | Component |
| --- | --- |
| Konfirmasi hapus | Alert Dialog |
| Void transaksi | Alert Dialog dengan input alasan bila perlu |
| Form singkat | Dialog |
| Form panjang | Halaman khusus, bukan dialog |

Rules:

- Aksi destructive harus memakai konfirmasi jelas.
- Dialog harus punya title, description, close action, dan focus management.
- Jangan memakai modal untuk flow panjang jika halaman biasa lebih jelas.

---

## 7. Navbar Component Specification

Spesifikasi navbar menggunakan struktur **Split Header-Nav**: area brand/logo di sisi kiri dan menu navigasi di sisi kanan. Pola ini mendukung situs pemerintahan atau organisasi dengan struktur informasi yang padat, termasuk kebutuhan nested dropdown.

### Main Container & Alignment

- Navbar menggunakan latar full-width, tetapi konten internal wajib dibatasi `max-w-6xl` dan diposisikan di tengah dengan `mx-auto`.
- Konten utama navbar menggunakan `display: flex`, `justify-content: space-between`, dan `align-items: center`.
- Area kiri berisi brand/logo dalam susunan horizontal: lambang atau logo instansi diikuti teks nama instansi.
- Area kanan berisi link navigasi utama dalam susunan horizontal dan merapat ke sisi kanan kontainer.
- Padding vertikal navbar menggunakan `py-4` sampai `py-5` agar area logo dan menu tetap lega.

### Navigation Links & Dropdown Layout

- Top-level links disusun horizontal dengan jarak `gap-6`.
- Menu yang memiliki submenu wajib menyertakan ikon `chevron-down` kecil di sisi kanan teks dengan jarak `gap-1`.
- Parent menu dropdown menggunakan `position: relative`.
- Dropdown level 1 menggunakan `position: absolute`, rata kiri terhadap parent menu, dan disusun vertikal dengan `display: flex` dan `flex-direction: column`.
- Item dropdown memakai lebar penuh kontainer dan padding klik minimal `px-4 py-3`.
- Nested dropdown level 2 muncul di sisi kanan dropdown level 1 menggunakan `left: 100%` dan `top: 0`.
- Item level 1 yang memiliki nested dropdown wajib memakai ikon `chevron-right` sebagai penanda visual.
- Dropdown tidak boleh berada di dalam container yang memakai `overflow: hidden` atau `overflow: auto` jika posisi absolutnya berpotensi terpotong.

### Responsive Breakpoints

- Pada desktop (`lg` / `>= 1024px`), navbar menampilkan brand dan menu horizontal lengkap.
- Pada mobile dan tablet (`< 1024px`), blok menu navigasi kanan disembunyikan.
- Pada mobile dan tablet, tampilkan hamburger menu button di sisi kanan navbar.
- Saat hamburger menu aktif, navigasi berubah menjadi vertical drawer/overlay yang muncul dari bawah navbar atau bergeser dari sisi kanan layar.

---

## 8. Public Site Pattern

| Surface | Rule |
| --- | --- |
| Homepage | Lapang, section jelas, visual hijau-lingkungan kuat |
| Hero | Boleh memakai Prussian Blue/overlay gelap dengan teks putih |
| Section | Gunakan heading jelas, body 65–75ch, spacing `py-16` sampai `py-24` |
| Berita | Card bersih, metadata kecil, status published saja |
| Galeri | Grid responsif, gambar tidak dianimasikan saat hover |
| Pricelist | Table sederhana, harga mudah dipindai |
| Footer | Prussian Blue, teks kontras, link mudah dibaca |

Public site boleh memakai ekspresi brand lebih kuat, tetapi tetap harus terasa resmi dan mudah dipercaya.

---

## 9. Admin Dashboard Pattern

| Surface | Rule |
| --- | --- |
| Layout | Sidebar/topbar konsisten, area konten padat dan jelas |
| Page header | Judul, deskripsi singkat, aksi utama di kanan bila ada |
| Form | Card/panel tunggal, label jelas, helper text bila perlu |
| Table/data | Header stabil, row mudah dipindai, angka rata kanan |
| POS | Produk mudah dipilih, cart jelas, total pembayaran paling menonjol |
| Laporan | Summary card + table/detail, filter tanggal mudah dijangkau |

Admin dashboard mengutamakan efisiensi tugas. Hindari dekorasi berlebihan, animasi panjang, dan variasi visual yang tidak membantu pekerjaan admin.

---

## 10. Motion

- Animasi cukup untuk reveal section dan hover ringan.
- Durasi UI product 150–250ms.
- Jangan animasikan gambar saat hover.
- Semua animasi harus aman untuk `prefers-reduced-motion`.
- Hover cukup mengubah background, border, shadow, atau warna teks.
- Motion harus menyampaikan state, bukan dekorasi.

---

## 11. Imagery

- Gunakan foto kelurahan, aktivitas bank sampah, warga, fasilitas umum, dan lingkungan hijau.
- Hindari placeholder abstrak jika konteks membutuhkan foto nyata.
- Hero boleh memakai foto suasana kelurahan dengan overlay gelap agar teks tetap terbaca.
- Jangan memakai istilah visual “desa” bila konteks komunikasi publik menyebut Kelurahan.

---

## 12. Accessibility

- Body text minimal contrast 4.5:1.
- Large text minimal contrast 3:1.
- Semua tombol/link harus punya state hover dan focus jelas.
- Semua interactive control harus bisa diakses keyboard.
- Tap target mobile minimal 44px.
- Muted text jangan lebih terang dari `#4b5563` di background putih.
- Jangan mengandalkan warna saja untuk error, active, atau selected state.

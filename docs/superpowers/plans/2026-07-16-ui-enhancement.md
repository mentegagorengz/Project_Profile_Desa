# UI Enhancement — Profile Desa Manembo-nembo Tengah

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meningkatkan tampilan dan UX website kelurahan dari bare-minimum menjadi premium, modern, dan berkesan pada setiap halaman publik.

**Architecture:** Semua perubahan murni pada layer UI — komponen React dalam `components/public/` dan halaman dalam `app/`. Tidak ada perubahan pada skema database atau server actions. Gunakan Intersection Observer API untuk animasi scroll-triggered (native browser, tanpa library baru). Lightbox galeri diimplementasikan sebagai Client Component dengan state lokal.

**Tech Stack:**
- Next.js 16 (App Router, React 19)
- Tailwind CSS v4 dengan custom theme di `globals.css`
- Lucide React untuk icons
- Intersection Observer API (native, no new deps)
- CSS custom keyframes untuk animasi

## Global Constraints

- Warna: hanya gunakan token yang sudah ada — `prussian`, `mughal-green`, `teal-blue`, `pastel-blue`, `light-silver`
- Font: `font-display` (Space Grotesk), `font-body` (Inter), `font-mono` (IBM Plex Mono)
- Max width semua section: `max-w-3xl` kecuali jika ada alasan kuat
- Semua komponen publik masuk di `components/public/`
- Jangan install library animasi baru (gunakan CSS + Intersection Observer)
- Bahasa UI: Bahasa Indonesia
- Jangan ubah admin panel (`app/admin/`, `components/admin/`)

---

## FASE 1 — Quick Wins

### Task 1: Redesign Hero Section

**Files:**
- Modify: `app/page.tsx`
- Create: `components/public/HeroSection.tsx`

**Interfaces:**
- Consumes: tidak ada
- Produces: `<HeroSection />`

- [ ] **Step 1: Buat komponen HeroSection.tsx**

```tsx
// components/public/HeroSection.tsx
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <header
      id="beranda"
      className="relative overflow-hidden bg-prussian"
      style={{
        background: 'linear-gradient(135deg, #103A57 0%, #1a5276 50%, #0d2e42 100%)',
      }}
    >
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Accent orbs */}
      <div
        className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A9D3C5 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #307B8E 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-20 md:py-28 text-center md:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-pastel-blue animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-pastel-blue">
            Website Resmi Kelurahan
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
          Kelurahan<br />
          <span className="text-pastel-blue">Manembo-nembo Tengah</span>
        </h1>
        <p className="text-pastel-blue/80 text-sm md:text-base mt-2 mb-8">
          Kecamatan Matuari · Kota Bitung · Sulawesi Utara
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Link
            href="/#profil"
            className="inline-flex items-center justify-center gap-2 bg-mughal-green hover:bg-mughal-green/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 font-mono text-sm uppercase tracking-wide"
          >
            Lihat Profil
          </Link>
          <Link
            href="/#berita"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 font-mono text-sm uppercase tracking-wide"
          >
            Baca Berita
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative pb-8 flex justify-center">
        <a href="/#sambutan" className="text-pastel-blue/60 hover:text-pastel-blue transition-colors animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Update app/page.tsx — import dan ganti `<header>` lama**

```diff
// Tambah import:
+ import { HeroSection } from '@/components/public/HeroSection'

// Ganti block <header className="bg-prussian py-16..."> ... </header> dengan:
+ <HeroSection />
```

- [ ] **Step 3: Verifikasi di browser `http://localhost:3000` — hero tampil dengan gradient, badge, dua CTA**

- [ ] **Step 4: Commit**

```bash
git add components/public/HeroSection.tsx app/page.tsx
git commit -m "feat(ui): redesign hero section dengan gradient, badge, dan CTA buttons"
```

---

### Task 2: Berita jadi Card Grid dengan Thumbnail

**Files:**
- Modify: `app/page.tsx`
- Create: `components/public/BeritaSection.tsx`

**Interfaces:**
- Consumes: `berita: Array<{ judul: string; slug: string; created_at: string; gambar_url?: string | null }>`
- Produces: `<BeritaSection berita={berita} />`

- [ ] **Step 1: Update query berita di app/page.tsx untuk include gambar_url**

```diff
- supabase.from('berita_desa').select('judul, slug, created_at')
+ supabase.from('berita_desa').select('judul, slug, created_at, gambar_url')
```

- [ ] **Step 2: Buat komponen BeritaSection.tsx**

```tsx
// components/public/BeritaSection.tsx
import Link from 'next/link'
import { Calendar, ArrowRight, Newspaper } from 'lucide-react'

type Berita = {
  judul: string
  slug: string
  created_at: string
  gambar_url?: string | null
}

export function BeritaSection({ berita }: { berita: Berita[] }) {
  return (
    <section id="berita" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Informasi</p>
            <h2 className="font-display text-2xl font-semibold text-prussian">Berita Terbaru</h2>
          </div>
          <Link
            href="/berita"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition shrink-0"
          >
            Semua Berita <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {berita && berita.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {berita.map((b, idx) => (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className={`group block rounded-xl border border-pastel-blue/60 overflow-hidden hover:border-teal-blue hover:shadow-md transition-all duration-200 ${idx === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-light-silver ${idx === 0 ? 'aspect-[16/7]' : 'aspect-video'}`}>
                    {b.gambar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.gambar_url}
                        alt={b.judul}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-10 h-10 text-pastel-blue" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-prussian/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-display font-semibold text-prussian group-hover:text-teal-blue transition-colors line-clamp-2 leading-snug ${idx === 0 ? 'text-lg' : 'text-sm'}`}>
                      {b.judul}
                    </h3>
                    {b.created_at && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar className="w-3 h-3 text-teal-blue/70" />
                        <p className="font-mono text-xs text-prussian/50">
                          {new Date(b.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/berita"
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition"
              >
                Semua Berita <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-16 text-center rounded-xl border border-dashed border-pastel-blue">
            <Newspaper className="w-10 h-10 text-pastel-blue mx-auto mb-3" />
            <p className="text-prussian/50 italic">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update app/page.tsx**

```diff
+ import { BeritaSection } from '@/components/public/BeritaSection'

// Ganti seluruh <section id="berita">...</section> dengan:
+ <BeritaSection berita={berita ?? []} />
```

- [ ] **Step 4: Verifikasi — berita tampil sebagai card grid dengan thumbnail**

- [ ] **Step 5: Commit**

```bash
git add components/public/BeritaSection.tsx app/page.tsx
git commit -m "feat(ui): redesign section berita menjadi card grid dengan thumbnail"
```

---

### Task 3: Fix Back Button di Halaman Berita Detail

**Files:**
- Modify: `app/berita/[slug]/page.tsx`

- [ ] **Step 1: Ganti seluruh isi file dengan versi yang sudah diperbaiki**

```tsx
// app/berita/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Newspaper } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: berita }, { data: beritaLain }] = await Promise.all([
    supabase
      .from('berita_desa')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
    supabase
      .from('berita_desa')
      .select('judul, slug, created_at, gambar_url')
      .eq('status', 'published')
      .neq('slug', slug)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  if (!berita) notFound()

  const wordCount = berita.konten?.split(' ').length ?? 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main className="min-h-screen">
      <Navbar />
      <header
        className="bg-prussian py-10"
        style={{ background: 'linear-gradient(135deg, #103A57 0%, #1a5276 60%, #0d2e42 100%)' }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/#berita"
            className="inline-flex items-center gap-2 text-pastel-blue/70 hover:text-pastel-blue transition-colors mb-4 font-mono text-xs uppercase tracking-wide group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Berita
          </Link>
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-2">Berita</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
            {berita.judul}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {berita.created_at && (
              <div className="flex items-center gap-1.5 text-pastel-blue/70">
                <Calendar className="w-3.5 h-3.5" />
                <p className="font-mono text-xs">
                  {new Date(berita.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-pastel-blue/70">
              <Clock className="w-3.5 h-3.5" />
              <p className="font-mono text-xs">{readingTime} menit baca</p>
            </div>
          </div>
        </div>
      </header>

      <article className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-6">
          {berita.gambar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={berita.gambar_url}
              alt={berita.judul}
              className="w-full aspect-video object-cover rounded-xl mb-8 border border-pastel-blue shadow-sm"
            />
          )}

          <div className="prose max-w-none text-prussian/90 leading-relaxed text-base">
            <p className="whitespace-pre-line">{berita.konten}</p>
          </div>

          {/* Back Button bawah */}
          <div className="mt-12 pt-8 border-t border-pastel-blue/40">
            <Link
              href="/#berita"
              className="inline-flex items-center gap-2 text-teal-blue hover:text-prussian transition-colors font-mono text-sm uppercase tracking-wide group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke Daftar Berita
            </Link>
          </div>

          {/* Berita Terkait */}
          {beritaLain && beritaLain.length > 0 && (
            <div className="mt-12 pt-8 border-t border-pastel-blue/40">
              <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Lainnya</p>
              <h3 className="font-display text-xl font-semibold text-prussian mb-6">Berita Terbaru Lainnya</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {beritaLain.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/berita/${b.slug}`}
                    className="group block rounded-xl border border-pastel-blue/60 overflow-hidden hover:border-teal-blue hover:shadow-md transition-all duration-200"
                  >
                    <div className="aspect-video bg-light-silver overflow-hidden">
                      {b.gambar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.gambar_url}
                          alt={b.judul}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-8 h-8 text-pastel-blue" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-display text-sm font-semibold text-prussian group-hover:text-teal-blue transition-colors line-clamp-2 leading-snug">
                        {b.judul}
                      </h4>
                      {b.created_at && (
                        <p className="font-mono text-xs text-prussian/40 mt-1">
                          {new Date(b.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
```

- [ ] **Step 2: Verifikasi — back button tampil di atas dan bawah, berita terkait di bawah artikel**

- [ ] **Step 3: Commit**

```bash
git add "app/berita/[slug]/page.tsx"
git commit -m "fix(ui): tambahkan back button, reading time, dan berita terkait di halaman detail"
```

---

### Task 4: Tambahkan Nama Lurah & Jabatan di SambutanLurah

**Files:**
- Modify: `components/public/SambutanLurah.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update SambutanLurah.tsx**

```tsx
// components/public/SambutanLurah.tsx
import { Quote } from 'lucide-react'

type Props = {
  sambutan: string
  fotoUrl: string | null
  namaLurah?: string | null
  jabatanLurah?: string | null
}

export function SambutanLurah({ sambutan, fotoUrl, namaLurah, jabatanLurah }: Props) {
  return (
    <section id="sambutan" className="bg-light-silver py-16 relative overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute top-6 right-6 md:right-12 opacity-5 select-none pointer-events-none">
        <Quote className="w-32 h-32 text-prussian" />
      </div>

      <div className="mx-auto max-w-3xl flex flex-col md:flex-row gap-8 items-center px-6">
        {/* Foto + Nama */}
        <div className="flex flex-col items-center shrink-0 text-center">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoUrl}
              alt={namaLurah ?? 'Lurah'}
              className="h-36 w-36 rounded-full object-cover ring-4 ring-mughal-green shadow-lg"
            />
          ) : (
            <div className="h-36 w-36 rounded-full bg-prussian/10 border-4 border-mughal-green flex items-center justify-center">
              <span className="font-display text-4xl text-prussian/30">L</span>
            </div>
          )}
          {namaLurah && (
            <p className="font-display font-semibold text-prussian mt-3 text-sm">{namaLurah}</p>
          )}
          <p className="font-mono text-xs text-teal-blue mt-1 uppercase tracking-wider">
            {jabatanLurah ?? 'Lurah Manembo-nembo Tengah'}
          </p>
        </div>

        {/* Sambutan */}
        <div className="text-center md:text-left">
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Sambutan</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-4">
            Dari Pimpinan Kelurahan
          </h2>
          <p className="whitespace-pre-line text-prussian/80 leading-relaxed">
            {sambutan || 'Sambutan lurah belum tersedia.'}
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update app/page.tsx — pass namaLurah dan jabatanLurah**

```diff
- <SambutanLurah sambutan={profil.sambutan_lurah} fotoUrl={profil.foto_lurah_url} />
+ <SambutanLurah
+   sambutan={profil.sambutan_lurah}
+   fotoUrl={profil.foto_lurah_url}
+   namaLurah={profil.nama_lurah ?? null}
+   jabatanLurah={profil.jabatan_lurah ?? null}
+ />
```

> **Catatan:** Jika field `nama_lurah`/`jabatan_lurah` belum ada di DB, TypeScript mungkin error. Gunakan `(profil as any).nama_lurah ?? null` sebagai fallback sementara, atau abaikan props ini dan biarkan default fallback "Lurah Manembo-nembo Tengah".

- [ ] **Step 3: Verifikasi — jabatan muncul di bawah foto, quote mark dekoratif muncul di sudut**

- [ ] **Step 4: Commit**

```bash
git add components/public/SambutanLurah.tsx app/page.tsx
git commit -m "feat(ui): tambahkan nama lurah, jabatan, dan dekorasi quote mark di SambutanLurah"
```

---

## FASE 2 — Visual Enhancement

### Task 5: Redesign Footer jadi 3-Column

**Files:**
- Create: `components/public/Footer.tsx`
- Modify: `app/page.tsx`, `app/galeri/page.tsx`, `app/berita/[slug]/page.tsx`

- [ ] **Step 1: Buat Footer.tsx**

```tsx
// components/public/Footer.tsx
import Link from 'next/link'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Sambutan Lurah', href: '/#sambutan' },
  { label: 'Profil Kelurahan', href: '/#profil' },
  { label: 'Statistik', href: '/#infografis' },
  { label: 'Berita', href: '/#berita' },
  { label: 'Lokasi', href: '/#lokasi' },
  { label: 'Harga Sampah', href: '/#harga' },
  { label: 'Galeri', href: '/galeri' },
]

export function Footer() {
  return (
    <footer className="bg-prussian text-white/80 border-t border-white/10">
      <div className="mx-auto max-w-4xl px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Kolom 1: Info Kelurahan */}
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">
              Kelurahan Manembo-nembo Tengah
            </p>
            <p className="font-mono text-xs text-pastel-blue/80 mb-4">Website Resmi Pemerintah Kelurahan</p>
            <div className="flex items-start gap-2 text-sm text-white/60 mb-3">
              <MapPin className="w-4 h-4 shrink-0 text-pastel-blue mt-0.5" />
              <span>Kecamatan Matuari, Kota Bitung, Sulawesi Utara</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4 shrink-0 text-pastel-blue mt-0.5" />
              <span>Senin – Jumat: 08.00 – 16.00 WITA</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-pastel-blue mb-4">
              Navigasi Cepat
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-pastel-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Portal Admin */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-pastel-blue mb-4">
              Portal Staf
            </p>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Login khusus untuk staf kelurahan dan administrator sistem.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition-colors border border-white/10"
            >
              Login Admin <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-pastel-blue/50">
            © {new Date().getFullYear()} Kelurahan Manembo-nembo Tengah. Hak Cipta Dilindungi.
          </p>
          <p className="font-mono text-[10px] text-pastel-blue/30">
            Kota Bitung · Sulawesi Utara
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Update app/page.tsx**

```diff
+ import { Footer } from '@/components/public/Footer'
// Ganti seluruh <footer>...</footer> dengan:
+ <Footer />
```

- [ ] **Step 3: Update app/galeri/page.tsx dan app/berita/[slug]/page.tsx**

```diff
+ import { Footer } from '@/components/public/Footer'
// Tambah <Footer /> setelah konten utama, sebelum </main>
```

- [ ] **Step 4: Verifikasi — footer 3 kolom tampil di semua halaman publik**

- [ ] **Step 5: Commit**

```bash
git add components/public/Footer.tsx app/page.tsx app/galeri/page.tsx "app/berita/[slug]/page.tsx"
git commit -m "feat(ui): redesign footer menjadi 3-column dengan info kontak dan navigasi"
```

---

### Task 6: Infografis dengan Icon + Count-up Animation

**Files:**
- Modify: `components/public/InfografisSection.tsx`

- [ ] **Step 1: Ganti seluruh isi InfografisSection.tsx**

```tsx
// components/public/InfografisSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Home, MapPin, Building2 } from 'lucide-react'

type Props = { penduduk: number; kk: number; rt: number; rw: number }

function useCountUp(target: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!shouldStart || target === 0) return
    let current = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, shouldStart])
  return count
}

function StatCard({
  label, value, icon: Icon, shouldStart,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  shouldStart: boolean
}) {
  const count = useCountUp(value, 1500, shouldStart)
  return (
    <div className="group rounded-xl bg-white border border-pastel-blue p-6 text-center shadow-sm hover:shadow-md hover:border-teal-blue transition-all duration-200">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-silver mb-3 group-hover:bg-pastel-blue/40 transition-colors">
        <Icon className="w-6 h-6 text-mughal-green" />
      </div>
      <p className="font-mono text-3xl font-semibold text-mughal-green">
        {count.toLocaleString('id-ID')}
      </p>
      <p className="text-sm text-prussian/70 mt-1 font-medium">{label}</p>
    </div>
  )
}

export function InfografisSection({ penduduk, kk, rt, rw }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'Penduduk', value: penduduk, icon: Users },
    { label: 'Kepala Keluarga', value: kk, icon: Home },
    { label: 'RT', value: rt, icon: MapPin },
    { label: 'RW', value: rw, icon: Building2 },
  ]

  return (
    <section ref={ref} id="infografis" className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Infografis</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-8">Kelurahan dalam Angka</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} shouldStart={started} />
          ))}
        </div>
        <p className="font-mono text-xs text-prussian/40 text-right mt-4">Data Kelurahan Manembo-nembo Tengah</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verifikasi — scroll ke section infografis, angka count-up dari 0**

- [ ] **Step 3: Commit**

```bash
git add components/public/InfografisSection.tsx
git commit -m "feat(ui): tambahkan icon, count-up animation, dan hover effect pada InfografisSection"
```

---

### Task 7: Lightbox untuk Galeri

**Files:**
- Create: `components/public/GaleriLightbox.tsx`
- Modify: `components/public/GaleriSection.tsx`
- Modify: `app/galeri/page.tsx`

- [ ] **Step 1: Buat GaleriLightbox.tsx**

```tsx
// components/public/GaleriLightbox.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

type Foto = { id: string; url: string; caption: string | null }

export function GaleriGrid({ foto }: { foto: Foto[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const prev = useCallback(() => {
    setLightboxIdx((i) => (i === null ? 0 : (i - 1 + foto.length) % foto.length))
  }, [foto.length])

  const next = useCallback(() => {
    setLightboxIdx((i) => (i === null ? 0 : (i + 1) % foto.length))
  }, [foto.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIdx, next, prev])

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  const current = lightboxIdx !== null ? foto[lightboxIdx] : null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {foto.map((f, idx) => (
          <button
            key={f.id}
            id={`foto-${f.id}`}
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-pastel-blue/60 hover:border-teal-blue shadow-sm hover:shadow-md transition-all cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-teal-blue"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.url}
              alt={f.caption ?? ''}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-prussian/0 group-hover:bg-prussian/40 transition duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition duration-300 drop-shadow" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {current && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-prussian/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            id="lightbox-close"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            onClick={() => setLightboxIdx(null)}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {foto.length > 1 && (
            <button
              id="lightbox-prev"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.caption ?? ''}
              className="w-full h-full object-contain rounded-lg max-h-[80vh] mx-auto"
            />
            {current.caption && (
              <p className="text-center text-white/70 text-sm mt-3 font-mono">{current.caption}</p>
            )}
            <p className="text-center text-white/40 text-xs mt-1 font-mono">
              {lightboxIdx + 1} / {foto.length}
            </p>
          </div>

          {foto.length > 1 && (
            <button
              id="lightbox-next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Update GaleriSection.tsx**

```tsx
// components/public/GaleriSection.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GaleriGrid } from './GaleriLightbox'

type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  if (!foto || foto.length === 0) return null
  return (
    <section id="galeri" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Dokumentasi</p>
            <h2 className="font-display text-2xl font-semibold text-prussian">Galeri Kegiatan</h2>
          </div>
          <Link
            href="/galeri"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition shrink-0"
          >
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <GaleriGrid foto={foto.slice(0, 6)} />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update app/galeri/page.tsx**

```tsx
// app/galeri/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { GaleriGrid } from '@/components/public/GaleriLightbox'

export default async function GaleriPublikPage() {
  const supabase = await createClient()
  const { data: foto } = await supabase
    .from('galeri_foto')
    .select('id, url, caption')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen">
      <Navbar />
      <header
        className="bg-prussian py-12"
        style={{ background: 'linear-gradient(135deg, #103A57 0%, #1a5276 60%, #0d2e42 100%)' }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pastel-blue/70 hover:text-pastel-blue transition-colors mb-4 font-mono text-xs uppercase tracking-wide group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-1">Galeri</p>
          <h1 className="font-display text-3xl font-bold text-white">Galeri Kegiatan Kelurahan</h1>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          {foto && foto.length > 0 ? (
            <GaleriGrid foto={foto} />
          ) : (
            <div className="text-center py-24 text-prussian/50">
              <p className="font-display text-xl">Belum ada foto di galeri.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 4: Verifikasi — klik foto buka lightbox, ESC/prev/next/keyboard berfungsi**

- [ ] **Step 5: Commit**

```bash
git add components/public/GaleriLightbox.tsx components/public/GaleriSection.tsx app/galeri/page.tsx
git commit -m "feat(ui): tambahkan lightbox dengan navigasi keyboard pada galeri foto"
```

---

## FASE 3 — Polish

### Task 8: Navbar Scroll-aware

**Files:**
- Modify: `components/public/Navbar.tsx`

- [ ] **Step 1: Ganti seluruh isi Navbar.tsx**

```tsx
// components/public/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Sambutan', href: '/#sambutan' },
    { label: 'Profil', href: '/#profil' },
    { label: 'Statistik', href: '/#infografis' },
    { label: 'Berita', href: '/#berita' },
    { label: 'Peta', href: '/#lokasi' },
    { label: 'Harga Sampah', href: '/#harga' },
    { label: 'Galeri', href: '/galeri' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? 'bg-prussian/95 border-white/10 shadow-lg'
          : 'bg-white/95 border-pastel-blue/80 shadow-sm'
      }`}
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-13' : 'h-16'}`}>
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${scrolled ? 'bg-white/10' : 'bg-prussian/10'}`}>
              <span className={`font-display font-bold text-xs transition-colors ${scrolled ? 'text-white' : 'text-prussian'}`}>MNT</span>
            </div>
            <span className={`font-display font-bold text-sm sm:text-base leading-none transition-colors ${scrolled ? 'text-white' : 'text-prussian'}`}>
              Manembo-nembo Tengah
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-mono text-xs uppercase tracking-wider transition-colors font-medium ${
                  scrolled ? 'text-white/70 hover:text-white' : 'text-prussian/80 hover:text-teal-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                scrolled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-prussian text-white hover:bg-prussian/90'
              }`}
            >
              Login <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                scrolled ? 'text-white/80 hover:bg-white/10' : 'text-prussian hover:text-teal-blue hover:bg-light-silver/50'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-pastel-blue/20 bg-white py-4 px-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-mono text-xs uppercase tracking-wider text-prussian/80 hover:text-teal-blue transition-colors py-2 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-pastel-blue/60">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1 font-mono text-xs uppercase tracking-wider bg-prussian text-white py-2.5 rounded-lg hover:bg-prussian/95 transition-colors font-semibold w-full"
            >
              Login Staf / Admin <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Verifikasi — scroll ke bawah, navbar berubah jadi prussian gelap**

- [ ] **Step 3: Commit**

```bash
git add components/public/Navbar.tsx
git commit -m "feat(ui): navbar scroll-aware dengan transisi warna dari putih ke prussian"
```

---

### Task 9: Scroll-triggered Fade-in Animations

**Files:**
- Create: `components/public/FadeIn.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Tambahkan keyframe di globals.css (setelah @layer base)**

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 2: Buat FadeIn.tsx**

```tsx
// components/public/FadeIn.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible ? `fadeInUp 0.6s ease-out ${delay}ms forwards` : 'none',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Bungkus setiap section di app/page.tsx dengan FadeIn**

```tsx
import { FadeIn } from '@/components/public/FadeIn'

// Wrap setiap komponen section:
<FadeIn><SambutanLurah ... /></FadeIn>
<FadeIn delay={100}><ProfilSection ... /></FadeIn>
<FadeIn delay={100}><InfografisSection ... /></FadeIn>
<FadeIn delay={100}><BeritaSection ... /></FadeIn>
// dst.
```

- [ ] **Step 4: Verifikasi — refresh, scroll perlahan, setiap section fade-in dari bawah**

- [ ] **Step 5: Commit**

```bash
git add components/public/FadeIn.tsx app/globals.css app/page.tsx
git commit -m "feat(ui): scroll-triggered fade-in animation pada semua section halaman beranda"
```

---

## Ringkasan File

| File | Action |
|------|--------|
| `components/public/HeroSection.tsx` | CREATE |
| `components/public/BeritaSection.tsx` | CREATE |
| `components/public/Footer.tsx` | CREATE |
| `components/public/GaleriLightbox.tsx` | CREATE |
| `components/public/FadeIn.tsx` | CREATE |
| `components/public/SambutanLurah.tsx` | MODIFY |
| `components/public/InfografisSection.tsx` | MODIFY |
| `components/public/GaleriSection.tsx` | MODIFY |
| `components/public/Navbar.tsx` | MODIFY |
| `app/page.tsx` | MODIFY |
| `app/berita/[slug]/page.tsx` | MODIFY |
| `app/galeri/page.tsx` | MODIFY |
| `app/globals.css` | MODIFY |

## Verification Checklist

- [ ] Buka `http://localhost:3000` — hero gradient + badge + 2 CTA
- [ ] Scroll ke bawah — navbar berubah warna ke prussian gelap
- [ ] Scroll ke setiap section — fade-in animation berjalan
- [ ] Section infografis — angka count-up saat pertama kali terlihat
- [ ] Section berita — card grid dengan thumbnail dan placeholder
- [ ] Buka salah satu berita — back button atas & bawah, berita terkait
- [ ] Buka `/galeri` — back button ke beranda, klik foto buka lightbox
- [ ] Lightbox — prev/next button dan keyboard (←→ Esc) berfungsi
- [ ] Footer — 3 kolom: info kelurahan, navigasi, portal admin
- [ ] Mobile (< 768px) — semua layout responsive

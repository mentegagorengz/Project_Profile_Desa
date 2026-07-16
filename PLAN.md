# Website Profil Desa & POS BUMDes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun website profil desa (publik) + dashboard admin dengan modul CMS berita dan POS bank sampah (kasir per-kg), sesuai `PRD.md` v2.

**Architecture:** Next.js App Router monolith, Supabase (Postgres + Auth + RLS) sebagai backend tunggal, Zustand untuk cart state client-side, Shadcn UI + Tailwind untuk komponen, Astryx sebagai referensi design token/pattern.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Supabase JS client (`@supabase/ssr`), TailwindCSS, Shadcn UI, Zustand, Astryx (`@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@astryxdesign/cli`).

## Global Constraints
- Semua harga sampah: per kilogram (`harga_per_kg`, `jumlah_kg`) — bukan per-item.
- Stok pasif: `stok_saat_ini` hanya bertambah tiap transaksi, tidak ada modul stok keluar (fase 2).
- Transaksi tidak pernah di-hard-delete — pembatalan pakai `status = 'dibatalkan'` + `alasan_pembatalan`.
- Warga tidak punya akun — `nama_pelanggan` nullable, tanpa Supabase Auth untuk publik.
- RLS wajib aktif di semua tabel sebelum modul terkait dianggap selesai.
- Numeric type untuk semua nilai uang/berat (bukan float/int) — hindari rounding error.
- Node.js LTS, package manager: npm (ikut konvensi Astryx docs default).

---

### Task 1: Project Setup & Design System

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Create: `.env.local.example`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`

**Interfaces:**
- Produces: `createClient()` (browser, dari `lib/supabase/client.ts`), `createServerClient()` (server component/route handler, dari `lib/supabase/server.ts`) — dipakai semua task selanjutnya untuk akses Supabase.

- [ ] **Step 1: Init Next.js project**

```bash
npx create-next-app@latest desa-bumdes --typescript --tailwind --app --src-dir=false --import-alias "@/*"
cd desa-bumdes
```

- [ ] **Step 2: Install Supabase, Zustand, Shadcn deps**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand
npx shadcn@latest init -d
npx shadcn@latest add button input label card table dialog select badge textarea toast
```

- [ ] **Step 3: Install Astryx sebagai referensi design system**

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral
npm install -D @astryxdesign/cli
```

Tambah script di `package.json`:

```json
{
  "scripts": {
    "astryx": "node node_modules/@astryxdesign/cli/bin/astryx.mjs"
  }
}
```

Cek referensi token/komponen kapan pun butuh keputusan desain:

```bash
npm run astryx -- docs tokens
npm run astryx -- component Table
```

Astryx dipakai sebagai **referensi pattern & token saja** (spacing, radius, warna), bukan dependency runtime wajib — komponen aktual tetap pakai Shadcn UI supaya konsisten dengan Tailwind config existing.

- [ ] **Step 4: Setup environment variables**

```bash
cat > .env.local.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EOF
cp .env.local.example .env.local
echo ".env.local" >> .gitignore
```

Isi `.env.local` manual dari Supabase project dashboard (Settings > API). **`SUPABASE_SERVICE_ROLE_KEY` adalah credential sensitif — jangan pernah commit, pastikan `.env.local` ada di `.gitignore` sebelum lanjut.**

- [ ] **Step 4.5: Install Supabase Agent Skills + MCP server (opsional tapi direkomendasikan)**

Agent Skills nambah pengetahuan prosedural Claude Code soal RLS, migration workflow, dan security best practices Supabase:

```bash
npx skills add supabase/agent-skills
```

Supabase MCP server ngasih Claude Code akses eksekusi langsung ke project Supabase (jalanin migration, query, bikin user) tanpa kau perlu copy-paste manual tiap perintah:

```bash
claude mcp add supabase --transport http https://mcp.supabase.com/mcp
```

Ikuti flow OAuth yang muncul di terminal/browser buat autentikasi MCP server ke project Supabase-mu.

- [ ] **Step 4.6: Buat admin user otomatis via script (gantiin langkah manual dashboard)**

`scripts/create-admin.mjs`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const email = process.argv[2] ?? 'admin@kelurahan.local'
const password = process.argv[3] ?? 'ChangeMe123!'

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Gagal bikin admin user:', error.message)
  process.exit(1)
}

console.log('Admin user dibuat:', data.user.email)
```

Jalankan (butuh `SUPABASE_SERVICE_ROLE_KEY` sudah terisi di `.env.local`, load manual atau pakai `dotenv`):

```bash
node --env-file=.env.local scripts/create-admin.mjs admin@kelurahan.local "PasswordAman123!"
```

Expected output: `Admin user dibuat: admin@kelurahan.local`. User ini yang dipakai login di `/login` pas Task 3 kelar. Catat email/password yang dipakai — gak ada tempat lain buat lihat passwordnya setelah ini.

- [ ] **Step 5: Buat Supabase client helpers**

`lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // called from Server Component, ignore — middleware refreshes session
          }
        },
      },
    }
  )
}
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: build sukses tanpa error TypeScript.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: init Next.js project with Supabase, Shadcn, Astryx setup"
```

---

### Task 2: Database Schema & RLS

**Files:**
- Create: `supabase/migrations/00001_init_schema.sql`
- Create: `supabase/migrations/00002_rls_policies.sql`
- Create: `supabase/seed.sql`

**Interfaces:**
- Produces: tabel `berita_desa`, `produk_bumdes`, `transaksi`, `detail_transaksi` — dipakai semua task selanjutnya sebagai sumber data.

- [ ] **Step 1: Tulis migration schema**

`supabase/migrations/00001_init_schema.sql`:
```sql
create extension if not exists "uuid-ossp";

create table berita_desa (
  id uuid primary key default uuid_generate_v4(),
  judul text not null,
  slug text unique not null,
  konten text not null,
  gambar_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table produk_bumdes (
  id uuid primary key default uuid_generate_v4(),
  nama_produk text not null,
  kategori text not null,
  harga_per_kg numeric(12,2) not null check (harga_per_kg >= 0),
  stok_saat_ini numeric(12,2) not null default 0 check (stok_saat_ini >= 0),
  created_at timestamptz not null default now()
);

create table transaksi (
  id uuid primary key default uuid_generate_v4(),
  nama_pelanggan text,
  admin_id uuid references auth.users(id),
  total_bayar numeric(12,2) not null check (total_bayar >= 0),
  metode_pembayaran text not null default 'tunai',
  status text not null default 'aktif' check (status in ('aktif', 'dibatalkan')),
  alasan_pembatalan text,
  created_at timestamptz not null default now()
);

create table detail_transaksi (
  id uuid primary key default uuid_generate_v4(),
  transaksi_id uuid not null references transaksi(id) on delete cascade,
  produk_id uuid not null references produk_bumdes(id),
  jumlah_kg numeric(12,2) not null check (jumlah_kg > 0),
  harga_satuan numeric(12,2) not null check (harga_satuan >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0)
);

create index idx_transaksi_created_at on transaksi(created_at);
create index idx_detail_transaksi_transaksi_id on detail_transaksi(transaksi_id);
create index idx_berita_desa_status on berita_desa(status);
```

- [ ] **Step 2: Tulis RLS policies**

`supabase/migrations/00002_rls_policies.sql`:
```sql
alter table berita_desa enable row level security;
alter table produk_bumdes enable row level security;
alter table transaksi enable row level security;
alter table detail_transaksi enable row level security;

-- berita_desa: publik boleh baca yang published, admin full akses
create policy "public read published berita"
  on berita_desa for select
  using (status = 'published');

create policy "admin full access berita"
  on berita_desa for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- produk_bumdes: admin-only, no public access
create policy "admin full access produk"
  on produk_bumdes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- transaksi: admin-only
create policy "admin full access transaksi"
  on transaksi for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- detail_transaksi: admin-only
create policy "admin full access detail transaksi"
  on detail_transaksi for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

- [ ] **Step 3: Tulis seed data**

`supabase/seed.sql`:
```sql
insert into produk_bumdes (nama_produk, kategori, harga_per_kg, stok_saat_ini) values
  ('Botol Plastik PET', 'Plastik PET', 2500, 0),
  ('Plastik Kresek', 'Plastik Kresek', 500, 0),
  ('Kardus', 'Kertas', 1200, 0),
  ('Kaleng Aluminium', 'Logam', 8000, 0);

insert into berita_desa (judul, slug, konten, status) values
  ('Selamat Datang di Website Desa', 'selamat-datang', 'Website resmi profil desa dan program bank sampah BUMDes.', 'published');
```

- [ ] **Step 4: Jalankan migration ke Supabase project**

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

Expected: 4 tabel muncul di Supabase Table Editor, RLS badge "Enabled" di tiap tabel.

- [ ] **Step 5: Verify RLS via anon key**

Test manual: query `produk_bumdes` pakai anon key (tanpa login) via Supabase JS client — harus return array kosong/error, bukan data.

- [ ] **Step 6: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema, RLS policies, and seed data"
```

---

### Task 3: Auth & Admin Shell

**Files:**
- Create: `middleware.ts`
- Create: `app/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `lib/supabase/middleware.ts`

**Interfaces:**
- Consumes: `createClient()` dari `lib/supabase/server.ts` (Task 1)
- Produces: route `/admin/*` terproteksi, redirect ke `/login` kalau belum auth.

- [ ] **Step 1: Buat middleware session refresh**

`lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

`middleware.ts`:
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Buat halaman login**

`app/login/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-xl font-semibold">Login Admin</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Masuk</Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Buat admin layout dengan nav**

`app/admin/layout.tsx`:
```tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-4 space-y-2">
        <Link href="/admin" className="block font-semibold">Dashboard</Link>
        <Link href="/admin/berita" className="block">Berita Desa</Link>
        <Link href="/admin/produk" className="block">Produk BUMDes</Link>
        <Link href="/admin/pos" className="block">Kasir POS</Link>
        <Link href="/admin/laporan" className="block">Laporan</Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Admin user**

Kalau Step 4.6 di Task 1 sudah dijalankan, admin user sudah ada — lanjut ke Step 5. Kalau belum, jalankan sekarang:

```bash
node --env-file=.env.local scripts/create-admin.mjs admin@kelurahan.local "PasswordAman123!"
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Buka `/admin` tanpa login → harus redirect ke `/login`. Login dengan user yang dibuat → harus masuk ke `/admin`.

- [ ] **Step 6: Commit**

```bash
git add middleware.ts lib/supabase/middleware.ts app/login app/admin/layout.tsx
git commit -m "feat: add Supabase auth middleware and admin shell"
```

---

### Task 4: Modul CMS Berita Desa

**Files:**
- Create: `app/admin/berita/page.tsx`
- Create: `app/admin/berita/BeritaForm.tsx`
- Create: `app/page.tsx` (update — publik homepage list berita)
- Create: `app/berita/[slug]/page.tsx`
- Create: `lib/actions/berita.ts`

**Interfaces:**
- Consumes: `createClient()` server (Task 1), tabel `berita_desa` (Task 2)
- Produces: `createBerita()`, `updateBerita()`, `deleteBerita()` server actions — tidak dipakai task lain tapi pola ini direplikasi Task 5.

- [ ] **Step 1: Buat server actions CRUD**

`lib/actions/berita.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBerita(formData: {
  judul: string
  slug: string
  konten: string
  status: 'draft' | 'published'
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('berita_desa').insert(formData)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}

export async function updateBerita(id: string, formData: {
  judul: string
  slug: string
  konten: string
  status: 'draft' | 'published'
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('berita_desa')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}

export async function deleteBerita(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('berita_desa').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/berita')
  revalidatePath('/')
}
```

- [ ] **Step 2: Buat halaman admin list + form**

`app/admin/berita/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { BeritaForm } from './BeritaForm'

export default async function BeritaPage() {
  const supabase = await createClient()
  const { data: beritaList } = await supabase
    .from('berita_desa')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Berita Desa</h1>
      <BeritaForm />
      <div className="space-y-2">
        {beritaList?.map((b) => (
          <div key={b.id} className="rounded border p-4">
            <p className="font-semibold">{b.judul} <span className="text-xs text-gray-500">({b.status})</span></p>
            <p className="text-sm text-gray-600">/{b.slug}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

`app/admin/berita/BeritaForm.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createBerita } from '@/lib/actions/berita'

export function BeritaForm() {
  const [judul, setJudul] = useState('')
  const [slug, setSlug] = useState('')
  const [konten, setKonten] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createBerita({ judul, slug, konten, status: 'draft' })
    setJudul(''); setSlug(''); setKonten('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border p-4">
      <Input placeholder="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} required />
      <Input placeholder="slug-url" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      <Textarea placeholder="Konten" value={konten} onChange={(e) => setKonten(e.target.value)} required />
      <Button type="submit">Simpan sebagai Draft</Button>
    </form>
  )
}
```

- [ ] **Step 3: Buat halaman publik homepage**

`app/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('judul, slug, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Website Desa</h1>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Berita Desa</h2>
        <ul className="mt-4 space-y-2">
          {berita?.map((b) => (
            <li key={b.slug}>
              <Link href={`/berita/${b.slug}`} className="text-blue-600 hover:underline">{b.judul}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
```

`app/berita/[slug]/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: berita } = await supabase
    .from('berita_desa')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!berita) notFound()

  return (
    <article className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">{berita.judul}</h1>
      <p className="mt-4 whitespace-pre-line">{berita.konten}</p>
    </article>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Login admin → `/admin/berita` → buat berita baru → cek muncul di list. Publish manual via Supabase Table Editor (ubah status) → cek muncul di `/` dan `/berita/<slug>`.

- [ ] **Step 5: Commit**

```bash
git add app/admin/berita app/page.tsx app/berita lib/actions/berita.ts
git commit -m "feat: add CMS module for berita desa (admin CRUD + public pages)"
```

---

### Task 4.5: CRUD Master Produk Bank Sampah

**Files:**
- Create: `app/admin/produk/page.tsx`
- Create: `app/admin/produk/ProdukForm.tsx`
- Create: `lib/actions/produk.ts`

**Interfaces:**
- Consumes: tabel `produk_bumdes` (Task 2)
- Produces: data produk dipakai Task 5 (POS) dan Task 9 (pricelist publik) — pastikan task ini selesai sebelum keduanya.

- [ ] **Step 1: Server actions CRUD**

`lib/actions/produk.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProdukInput = {
  nama_produk: string
  kategori: string
  harga_per_kg: number
}

export async function createProduk(data: ProdukInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').insert({ ...data, stok_saat_ini: 0 })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}

export async function updateProduk(id: string, data: ProdukInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}

export async function deleteProduk(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('produk_bumdes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/produk')
  revalidatePath('/admin/pos')
  revalidatePath('/')
}
```

- [ ] **Step 2: Halaman admin produk**

`app/admin/produk/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { ProdukForm } from './ProdukForm'
import { deleteProduk } from '@/lib/actions/produk'
import { Button } from '@/components/ui/button'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteProduk(formData.get('id') as string)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Master Produk Bank Sampah</h1>
      <ProdukForm />
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Nama</th>
            <th className="py-2">Kategori</th>
            <th className="py-2">Harga/kg</th>
            <th className="py-2">Stok (kg)</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {produk?.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.nama_produk}</td>
              <td className="py-2">{p.kategori}</td>
              <td className="py-2">Rp{p.harga_per_kg.toLocaleString('id-ID')}</td>
              <td className="py-2">{p.stok_saat_ini}</td>
              <td className="py-2">
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
  )
}
```

- [ ] **Step 3: Form tambah produk**

`app/admin/produk/ProdukForm.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProduk } from '@/lib/actions/produk'

export function ProdukForm() {
  const [nama, setNama] = useState('')
  const [kategori, setKategori] = useState('')
  const [harga, setHarga] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createProduk({ nama_produk: nama, kategori, harga_per_kg: parseFloat(harga) || 0 })
    setNama(''); setKategori(''); setHarga('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end rounded border p-4">
      <div>
        <label className="text-sm font-medium">Nama Produk</label>
        <Input value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Kategori</label>
        <Input value={kategori} onChange={(e) => setKategori(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Harga/kg</label>
        <Input type="number" min="0" step="1" value={harga} onChange={(e) => setHarga(e.target.value)} required />
      </div>
      <Button type="submit">Tambah</Button>
    </form>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Login admin → `/admin/produk` → tambah produk baru → cek muncul di tabel dan otomatis muncul juga di `/admin/pos` (Task 5) dan pricelist publik (Task 9) setelah keduanya selesai dibangun. Hapus produk → cek hilang dari tabel.

- [ ] **Step 5: Commit**

```bash
git add app/admin/produk lib/actions/produk.ts
git commit -m "feat: add master produk CRUD (bank sampah pricelist source)"
```

---

### Task 5: Modul POS (Kasir)

**Files:**
- Create: `lib/store/cart.ts`
- Create: `app/admin/pos/page.tsx`
- Create: `app/admin/pos/ProductGrid.tsx`
- Create: `app/admin/pos/Cart.tsx`
- Create: `lib/actions/transaksi.ts`
- Create: `app/admin/pos/riwayat/page.tsx` (untuk void/koreksi)

**Interfaces:**
- Consumes: tabel `produk_bumdes`, `transaksi`, `detail_transaksi` (Task 2)
- Produces: `useCartStore` (Zustand) — state cart dipakai `ProductGrid.tsx` dan `Cart.tsx`.

- [ ] **Step 1: Buat Zustand cart store**

`lib/store/cart.ts`:
```typescript
import { create } from 'zustand'

export type CartItem = {
  produk_id: string
  nama_produk: string
  harga_per_kg: number
  jumlah_kg: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'jumlah_kg'>, jumlah_kg: number) => void
  updateJumlah: (produk_id: string, jumlah_kg: number) => void
  removeItem: (produk_id: string) => void
  clear: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item, jumlah_kg) => set((state) => {
    const existing = state.items.find((i) => i.produk_id === item.produk_id)
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.produk_id === item.produk_id ? { ...i, jumlah_kg: i.jumlah_kg + jumlah_kg } : i
        ),
      }
    }
    return { items: [...state.items, { ...item, jumlah_kg }] }
  }),
  updateJumlah: (produk_id, jumlah_kg) => set((state) => ({
    items: state.items.map((i) => (i.produk_id === produk_id ? { ...i, jumlah_kg } : i)),
  })),
  removeItem: (produk_id) => set((state) => ({
    items: state.items.filter((i) => i.produk_id !== produk_id),
  })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.harga_per_kg * i.jumlah_kg, 0),
}))
```

- [ ] **Step 2: Buat server action checkout**

`lib/actions/transaksi.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type CheckoutItem = {
  produk_id: string
  jumlah_kg: number
  harga_satuan: number
}

export async function checkoutTransaksi(items: CheckoutItem[], namaPelanggan: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const total = items.reduce((sum, i) => sum + i.jumlah_kg * i.harga_satuan, 0)

  const { data: transaksi, error: txError } = await supabase
    .from('transaksi')
    .insert({
      nama_pelanggan: namaPelanggan,
      admin_id: user.id,
      total_bayar: total,
      metode_pembayaran: 'tunai',
      status: 'aktif',
    })
    .select()
    .single()

  if (txError) throw new Error(txError.message)

  const detailRows = items.map((i) => ({
    transaksi_id: transaksi.id,
    produk_id: i.produk_id,
    jumlah_kg: i.jumlah_kg,
    harga_satuan: i.harga_satuan,
    subtotal: i.jumlah_kg * i.harga_satuan,
  }))

  const { error: detailError } = await supabase.from('detail_transaksi').insert(detailRows)
  if (detailError) throw new Error(detailError.message)

  for (const item of items) {
    const { error: rpcError } = await supabase.rpc('increment_stok', {
      p_produk_id: item.produk_id,
      p_jumlah: item.jumlah_kg,
    })
    if (rpcError) throw new Error(rpcError.message)
  }

  revalidatePath('/admin/pos')
  revalidatePath('/admin/produk')
  return transaksi
}

export async function batalkanTransaksi(id: string, alasan: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('transaksi')
    .update({ status: 'dibatalkan', alasan_pembatalan: alasan })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pos/riwayat')
  revalidatePath('/admin/laporan')
}
```

Butuh function stok increment (atomik, hindari race condition dari client menghitung manual):

`supabase/migrations/00003_stok_function.sql`:
```sql
create or replace function increment_stok(p_produk_id uuid, p_jumlah numeric)
returns void as $$
begin
  update produk_bumdes
  set stok_saat_ini = stok_saat_ini + p_jumlah
  where id = p_produk_id;
end;
$$ language plpgsql security definer;
```

- [ ] **Step 3: Buat halaman kasir**

`app/admin/pos/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from './ProductGrid'
import { Cart } from './Cart'

export default async function PosPage() {
  const supabase = await createClient()
  const { data: produk } = await supabase.from('produk_bumdes').select('*').order('nama_produk')

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h1 className="mb-4 text-2xl font-bold">Kasir POS</h1>
        <ProductGrid produk={produk ?? []} />
      </div>
      <Cart />
    </div>
  )
}
```

`app/admin/pos/ProductGrid.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'

type Produk = {
  id: string
  nama_produk: string
  kategori: string
  harga_per_kg: number
}

export function ProductGrid({ produk }: { produk: Produk[] }) {
  const [jumlah, setJumlah] = useState<Record<string, string>>({})
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="grid grid-cols-2 gap-3">
      {produk.map((p) => (
        <Card key={p.id} className="p-4 space-y-2">
          <p className="font-semibold">{p.nama_produk}</p>
          <p className="text-sm text-gray-500">{p.kategori} — Rp{p.harga_per_kg.toLocaleString('id-ID')}/kg</p>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="kg"
              value={jumlah[p.id] ?? ''}
              onChange={(e) => setJumlah({ ...jumlah, [p.id]: e.target.value })}
            />
            <Button
              onClick={() => {
                const kg = parseFloat(jumlah[p.id] ?? '0')
                if (kg > 0) {
                  addItem({ produk_id: p.id, nama_produk: p.nama_produk, harga_per_kg: p.harga_per_kg }, kg)
                  setJumlah({ ...jumlah, [p.id]: '' })
                }
              }}
            >
              Tambah
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
```

`app/admin/pos/Cart.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { checkoutTransaksi } from '@/lib/actions/transaksi'
import { useRouter } from 'next/navigation'

export function Cart() {
  const { items, removeItem, clear, total } = useCartStore()
  const [namaPelanggan, setNamaPelanggan] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    try {
      await checkoutTransaksi(
        items.map((i) => ({ produk_id: i.produk_id, jumlah_kg: i.jumlah_kg, harga_satuan: i.harga_per_kg })),
        namaPelanggan || null
      )
      clear()
      setNamaPelanggan('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded border p-4 space-y-3">
      <h2 className="font-semibold">Keranjang</h2>
      <Input placeholder="Nama pelanggan (opsional)" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} />
      {items.map((i) => (
        <div key={i.produk_id} className="flex justify-between text-sm">
          <span>{i.nama_produk} ({i.jumlah_kg}kg)</span>
          <div className="flex items-center gap-2">
            <span>Rp{(i.harga_per_kg * i.jumlah_kg).toLocaleString('id-ID')}</span>
            <button onClick={() => removeItem(i.produk_id)} className="text-red-500 text-xs">hapus</button>
          </div>
        </div>
      ))}
      <div className="border-t pt-2 font-semibold flex justify-between">
        <span>Total</span>
        <span>Rp{total().toLocaleString('id-ID')}</span>
      </div>
      <Button onClick={handleCheckout} disabled={loading || items.length === 0} className="w-full">
        {loading ? 'Memproses...' : 'Checkout'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 4: Buat halaman riwayat + void**

`app/admin/pos/riwayat/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { batalkanTransaksi } from '@/lib/actions/transaksi'

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
      <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
      {transaksi?.map((t) => (
        <div key={t.id} className="rounded border p-4">
          <div className="flex justify-between">
            <p>{t.nama_pelanggan ?? 'Anonim'} — Rp{t.total_bayar.toLocaleString('id-ID')} <span className="text-xs">({t.status})</span></p>
            {t.status === 'aktif' && (
              <form action={handleBatal}>
                <input type="hidden" name="id" value={t.id} />
                <Button variant="destructive" size="sm" type="submit">Batalkan</Button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```
Login admin → `/admin/pos` → tambah produk ke cart → checkout → cek `transaksi`, `detail_transaksi` terisi, `stok_saat_ini` produk bertambah. Cek `/admin/pos/riwayat` bisa batalkan transaksi.

- [ ] **Step 6: Commit**

```bash
git add lib/store/cart.ts app/admin/pos lib/actions/transaksi.ts supabase/migrations/00003_stok_function.sql
git commit -m "feat: add POS module with cart, checkout, and void transaction"
```

---

### Task 6: Modul Laporan

**Files:**
- Create: `app/admin/laporan/page.tsx`
- Create: `lib/queries/laporan.ts`

**Interfaces:**
- Consumes: tabel `transaksi`, `detail_transaksi` (Task 2)

- [ ] **Step 1: Buat query agregat**

`lib/queries/laporan.ts`:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getLaporanHarian(tanggal: string) {
  const supabase = await createClient()
  const start = `${tanggal}T00:00:00`
  const end = `${tanggal}T23:59:59`

  const { data, error } = await supabase
    .from('transaksi')
    .select('total_bayar, detail_transaksi(jumlah_kg, produk_bumdes(kategori))')
    .eq('status', 'aktif')
    .gte('created_at', start)
    .lte('created_at', end)

  if (error) throw new Error(error.message)

  const totalOmzet = data.reduce((sum, t) => sum + t.total_bayar, 0)
  const kgPerKategori: Record<string, number> = {}
  for (const t of data) {
    for (const d of t.detail_transaksi as any[]) {
      const kategori = d.produk_bumdes.kategori
      kgPerKategori[kategori] = (kgPerKategori[kategori] ?? 0) + d.jumlah_kg
    }
  }

  return { totalOmzet, kgPerKategori, jumlahTransaksi: data.length }
}

export async function getLaporanBulanan(tahun: number, bulan: number) {
  const supabase = await createClient()
  const start = new Date(tahun, bulan - 1, 1).toISOString()
  const end = new Date(tahun, bulan, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('transaksi')
    .select('total_bayar')
    .eq('status', 'aktif')
    .gte('created_at', start)
    .lte('created_at', end)

  if (error) throw new Error(error.message)

  return {
    totalOmzet: data.reduce((sum, t) => sum + t.total_bayar, 0),
    jumlahTransaksi: data.length,
  }
}
```

- [ ] **Step 2: Buat halaman laporan**

`app/admin/laporan/page.tsx`:
```tsx
import { getLaporanHarian, getLaporanBulanan } from '@/lib/queries/laporan'

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ tanggal?: string }>
}) {
  const { tanggal } = await searchParams
  const today = tanggal ?? new Date().toISOString().slice(0, 10)
  const now = new Date()

  const [harian, bulanan] = await Promise.all([
    getLaporanHarian(today),
    getLaporanBulanan(now.getFullYear(), now.getMonth() + 1),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan</h1>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Rekap Harian ({today})</h2>
        <p>Total Omzet: Rp{harian.totalOmzet.toLocaleString('id-ID')}</p>
        <p>Jumlah Transaksi: {harian.jumlahTransaksi}</p>
        <ul className="mt-2 text-sm">
          {Object.entries(harian.kgPerKategori).map(([kategori, kg]) => (
            <li key={kategori}>{kategori}: {kg} kg</li>
          ))}
        </ul>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Rekap Bulan Ini</h2>
        <p>Total Omzet: Rp{bulanan.totalOmzet.toLocaleString('id-ID')}</p>
        <p>Jumlah Transaksi: {bulanan.jumlahTransaksi}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```
Buka `/admin/laporan` → cek angka omzet harian/bulanan sesuai transaksi yang pernah dibuat di Task 5. Transaksi berstatus `dibatalkan` harus tidak terhitung.

- [ ] **Step 4: Commit**

```bash
git add app/admin/laporan lib/queries/laporan.ts
git commit -m "feat: add laporan module with daily and monthly aggregation"
```

---

### Task 2.5: Schema Tambahan — Profil Kelurahan & Galeri

**Files:**
- Create: `supabase/migrations/00004_profil_galeri.sql`
- Create: `supabase/migrations/00005_rls_profil_galeri.sql`
- Create: `supabase/seed_profil.sql`

- [ ] **Step 1: Migration tabel baru**

`supabase/migrations/00004_profil_galeri.sql`:
```sql
create table profil_kelurahan (
  id uuid primary key default uuid_generate_v4(),
  sambutan_lurah text,
  foto_lurah_url text,
  visi text,
  misi text,
  sejarah text,
  jumlah_penduduk int,
  jumlah_kk int,
  jumlah_rt int,
  jumlah_rw int,
  google_maps_embed_url text,
  updated_at timestamptz not null default now()
);

create table galeri_foto (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);
```

- [ ] **Step 2: RLS untuk tabel baru**

`supabase/migrations/00005_rls_profil_galeri.sql`:
```sql
alter table profil_kelurahan enable row level security;
alter table galeri_foto enable row level security;

create policy "public read profil" on profil_kelurahan for select using (true);
create policy "admin update profil" on profil_kelurahan for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read galeri" on galeri_foto for select using (true);
create policy "admin full access galeri" on galeri_foto for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

- [ ] **Step 3: Seed singleton profil (1 baris awal)**

`supabase/seed_profil.sql`:
```sql
insert into profil_kelurahan (sambutan_lurah, visi, misi, sejarah, jumlah_penduduk, jumlah_kk, jumlah_rt, jumlah_rw, google_maps_embed_url)
values (
  'Selamat datang di website resmi Kelurahan Manembo-nembo Tengah.',
  'Mewujudkan kelurahan yang bersih, sejahtera, dan mandiri.',
  'Meningkatkan pelayanan publik dan pengelolaan lingkungan berbasis bank sampah.',
  'Kelurahan Manembo-nembo Tengah berada di Kecamatan Matuari, Kota Bitung.',
  0, 0, 0, 0,
  ''
);
```
Isi angka statistik & embed URL sesungguhnya belakangan lewat dashboard admin (Task 7).

- [ ] **Step 4: Buat Supabase Storage bucket untuk galeri**

Via Supabase Dashboard > Storage > New bucket:
- Name: `galeri`
- Public bucket: **yes** (biar foto bisa diakses publik tanpa signed URL)

Tambah storage policy (Dashboard > Storage > galeri > Policies):
```sql
create policy "public read galeri bucket"
  on storage.objects for select
  using (bucket_id = 'galeri');

create policy "admin upload galeri bucket"
  on storage.objects for insert
  with check (bucket_id = 'galeri' and auth.role() = 'authenticated');

create policy "admin delete galeri bucket"
  on storage.objects for delete
  using (bucket_id = 'galeri' and auth.role() = 'authenticated');
```

- [ ] **Step 5: Jalankan migration + seed**

```bash
npx supabase db push
psql "$DATABASE_URL" -f supabase/seed_profil.sql
```

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/00004_profil_galeri.sql supabase/migrations/00005_rls_profil_galeri.sql supabase/seed_profil.sql
git commit -m "feat: add profil_kelurahan and galeri_foto schema with RLS + storage bucket"
```

---

### Task 7: CMS Profil Kelurahan (Sambutan, Visi-Misi, Infografis, Peta)

**Files:**
- Create: `app/admin/profil/page.tsx`
- Create: `app/admin/profil/ProfilForm.tsx`
- Create: `lib/actions/profil.ts`

**Interfaces:**
- Consumes: tabel `profil_kelurahan` (Task 2.5)

- [ ] **Step 1: Server action update profil**

`lib/actions/profil.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProfilInput = {
  sambutan_lurah: string
  foto_lurah_url: string | null
  visi: string
  misi: string
  sejarah: string
  jumlah_penduduk: number
  jumlah_kk: number
  jumlah_rt: number
  jumlah_rw: number
  google_maps_embed_url: string
}

export async function updateProfil(id: string, data: ProfilInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profil_kelurahan')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/profil')
  revalidatePath('/')
}
```

- [ ] **Step 2: Halaman admin profil**

`app/admin/profil/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { ProfilForm } from './ProfilForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: profil } = await supabase.from('profil_kelurahan').select('*').single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profil Kelurahan</h1>
      {profil && <ProfilForm profil={profil} />}
    </div>
  )
}
```

- [ ] **Step 3: Form edit**

`app/admin/profil/ProfilForm.tsx`:
```tsx
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
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="text-sm font-medium">Sambutan Lurah</label>
        <Textarea value={form.sambutan_lurah} onChange={(e) => setForm({ ...form, sambutan_lurah: e.target.value })} rows={4} />
      </div>
      <div>
        <label className="text-sm font-medium">URL Foto Lurah</label>
        <Input value={form.foto_lurah_url ?? ''} onChange={(e) => setForm({ ...form, foto_lurah_url: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Visi</label>
        <Textarea value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Misi</label>
        <Textarea value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Sejarah</label>
        <Textarea value={form.sejarah} onChange={(e) => setForm({ ...form, sejarah: e.target.value })} rows={4} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="text-sm font-medium">Jumlah Penduduk</label>
          <Input type="number" value={form.jumlah_penduduk} onChange={(e) => setForm({ ...form, jumlah_penduduk: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Jumlah KK</label>
          <Input type="number" value={form.jumlah_kk} onChange={(e) => setForm({ ...form, jumlah_kk: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Jumlah RT</label>
          <Input type="number" value={form.jumlah_rt} onChange={(e) => setForm({ ...form, jumlah_rt: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Jumlah RW</label>
          <Input type="number" value={form.jumlah_rw} onChange={(e) => setForm({ ...form, jumlah_rw: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Google Maps Embed URL</label>
        <Input
          placeholder="https://www.google.com/maps/embed?pb=..."
          value={form.google_maps_embed_url}
          onChange={(e) => setForm({ ...form, google_maps_embed_url: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Ambil dari Google Maps → cari lokasi → Share → Embed a map → copy src iframe.
        </p>
      </div>
      <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Profil'}</Button>
    </form>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Login admin → `/admin/profil` → isi semua field, termasuk embed URL Google Maps asli → simpan → cek data ter-update di Supabase table editor.

- [ ] **Step 5: Commit**

```bash
git add app/admin/profil lib/actions/profil.ts
git commit -m "feat: add profil kelurahan CMS (sambutan, visi-misi, infografis, maps embed)"
```

---

### Task 8: Modul Galeri (Upload Foto ke Supabase Storage)

**Files:**
- Create: `app/admin/galeri/page.tsx`
- Create: `app/admin/galeri/UploadForm.tsx`
- Create: `lib/actions/galeri.ts`

**Interfaces:**
- Consumes: tabel `galeri_foto`, Supabase Storage bucket `galeri` (Task 2.5)

- [ ] **Step 1: Server action upload + delete**

`lib/actions/galeri.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadFoto(formData: FormData) {
  const file = formData.get('file') as File
  const caption = formData.get('caption') as string
  const supabase = await createClient()

  const filename = `${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from('galeri').upload(filename, file)
  if (uploadError) throw new Error(uploadError.message)

  const { data: publicUrl } = supabase.storage.from('galeri').getPublicUrl(filename)

  const { error: dbError } = await supabase.from('galeri_foto').insert({
    url: publicUrl.publicUrl,
    caption: caption || null,
  })
  if (dbError) throw new Error(dbError.message)

  revalidatePath('/admin/galeri')
  revalidatePath('/')
}

export async function deleteFoto(id: string, url: string) {
  const supabase = await createClient()
  const filename = url.split('/').pop()!
  await supabase.storage.from('galeri').remove([filename])
  const { error } = await supabase.from('galeri_foto').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/galeri')
  revalidatePath('/')
}
```

- [ ] **Step 2: Halaman admin galeri**

`app/admin/galeri/page.tsx`:
```tsx
import { createClient } from '@/lib/supabase/server'
import { UploadForm } from './UploadForm'
import { deleteFoto } from '@/lib/actions/galeri'
import { Button } from '@/components/ui/button'

export default async function GaleriPage() {
  const supabase = await createClient()
  const { data: foto } = await supabase.from('galeri_foto').select('*').order('created_at', { ascending: false })

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteFoto(formData.get('id') as string, formData.get('url') as string)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Galeri Foto</h1>
      <UploadForm />
      <div className="grid grid-cols-4 gap-3">
        {foto?.map((f) => (
          <div key={f.id} className="space-y-1">
            <img src={f.url} alt={f.caption ?? ''} className="aspect-square w-full rounded object-cover" />
            <form action={handleDelete}>
              <input type="hidden" name="id" value={f.id} />
              <input type="hidden" name="url" value={f.url} />
              <Button variant="destructive" size="sm" type="submit" className="w-full">Hapus</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Form upload**

`app/admin/galeri/UploadForm.tsx`:
```tsx
'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFoto } from '@/lib/actions/galeri'

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    try {
      await uploadFoto(formData)
      formRef.current?.reset()
    } finally {
      setUploading(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 items-end rounded border p-4">
      <div>
        <label className="text-sm font-medium">Foto</label>
        <Input type="file" name="file" accept="image/*" required />
      </div>
      <div>
        <label className="text-sm font-medium">Caption</label>
        <Input type="text" name="caption" placeholder="Opsional" />
      </div>
      <Button type="submit" disabled={uploading}>{uploading ? 'Mengunggah...' : 'Upload'}</Button>
    </form>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```
Login admin → `/admin/galeri` → upload foto → cek muncul di grid dan di Supabase Storage bucket `galeri`. Hapus foto → cek hilang dari storage & DB.

- [ ] **Step 5: Commit**

```bash
git add app/admin/galeri lib/actions/galeri.ts
git commit -m "feat: add galeri module with Supabase Storage upload/delete"
```

---

### Task 9: Restructure Homepage Publik (Semua Section + Pricelist)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `app/components/SambutanLurah.tsx`
- Create: `app/components/ProfilSection.tsx`
- Create: `app/components/InfografisSection.tsx`
- Create: `app/components/PetaSection.tsx`
- Create: `app/components/PricelistSection.tsx`
- Create: `app/components/GaleriSection.tsx`

**Interfaces:**
- Consumes: `profil_kelurahan`, `berita_desa`, `produk_bumdes`, `galeri_foto` (semua dari task sebelumnya)

- [ ] **Step 0: Design tokens — warna & tipografi (Tailwind v4)**

> **Catatan:** Project ini pakai Tailwind v4 (`@import "tailwindcss"` di `globals.css`, bukan `tailwind.config.ts`). Token warna & font didefinisikan lewat `@theme` block langsung di CSS — bukan `theme.extend` di config file seperti Tailwind v3.

`app/globals.css` (tambahkan `@theme` block ini tepat setelah `@import "tailwindcss";`, sebelum `@layer base`):
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
  /* ...existing :root, .dark, dan base styles TETAP dipertahankan di sini... */
}

h1, h2, h3 {
  font-family: var(--font-space-grotesk);
}
```

Dengan `@theme`, class Tailwind otomatis tersedia: `bg-prussian`, `text-mughal-green`, `border-teal-blue`, `bg-pastel-blue`, `bg-light-silver`, `font-display`, `font-body`, `font-mono` — tidak perlu config file terpisah.

`app/layout.tsx` (ganti font loading, pertahankan `metadata` dan struktur existing):
```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Kelurahan Manembo-nembo Tengah",
  description: "Website resmi Kelurahan Manembo-nembo Tengah, Kecamatan Matuari, Kota Bitung",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={cn(spaceGrotesk.variable, inter.variable, plexMono.variable)}>
      <body className="font-body text-prussian antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 0.5: Verify token tersedia**

```bash
npm run dev
```
Buka DevTools di browser manapun, cek elemen `<body>` punya class `font-body text-prussian` dan warnanya keluar (bukan class ke-drop karena Tailwind gak kenal). Kalau warna gak muncul, pastikan `@theme` block ada di atas `@layer base`, bukan di bawahnya — urutan berpengaruh ke Tailwind v4.

- [ ] **Step 1: Component tiap section**

`app/components/SambutanLurah.tsx`:
```tsx
export function SambutanLurah({ sambutan, fotoUrl }: { sambutan: string; fotoUrl: string | null }) {
  return (
    <section className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl flex gap-8 items-center">
        {fotoUrl && (
          <img
            src={fotoUrl}
            alt="Lurah"
            className="h-36 w-36 rounded-full object-cover ring-4 ring-mughal-green shrink-0"
          />
        )}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Sambutan</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-3">Dari Lurah Manembo-nembo Tengah</h2>
          <p className="whitespace-pre-line text-prussian/80 leading-relaxed">{sambutan}</p>
        </div>
      </div>
    </section>
  )
}
```

`app/components/ProfilSection.tsx`:
```tsx
export function ProfilSection({ visi, misi, sejarah }: { visi: string; misi: string; sejarah: string }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Profil</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Kelurahan Manembo-nembo Tengah</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-pastel-blue/40 border border-pastel-blue p-5">
            <h3 className="font-display font-semibold text-prussian mb-2">Visi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed">{visi}</p>
          </div>
          <div className="rounded-lg bg-pastel-blue/40 border border-pastel-blue p-5">
            <h3 className="font-display font-semibold text-prussian mb-2">Misi</h3>
            <p className="text-prussian/80 text-sm leading-relaxed">{misi}</p>
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold text-prussian mb-2">Sejarah</h3>
          <p className="text-prussian/80 whitespace-pre-line leading-relaxed">{sejarah}</p>
        </div>
      </div>
    </section>
  )
}
```

`app/components/InfografisSection.tsx`:
```tsx
export function InfografisSection({ penduduk, kk, rt, rw }: { penduduk: number; kk: number; rt: number; rw: number }) {
  const stats = [
    { label: 'Penduduk', value: penduduk },
    { label: 'Kepala Keluarga', value: kk },
    { label: 'RT', value: rt },
    { label: 'RW', value: rw },
  ]
  return (
    <section className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Infografis</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Kelurahan dalam Angka</h2>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-white border border-pastel-blue p-5 text-center">
              <p className="font-mono text-3xl font-semibold text-mughal-green">{s.value.toLocaleString('id-ID')}</p>
              <p className="text-sm text-prussian/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

`app/components/PetaSection.tsx`:
```tsx
export function PetaSection({ embedUrl }: { embedUrl: string }) {
  if (!embedUrl) return null
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Lokasi</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Peta Kelurahan</h2>
        <iframe
          src={embedUrl}
          className="w-full h-80 rounded-lg border-2 border-teal-blue"
          loading="lazy"
        />
      </div>
    </section>
  )
}
```

`app/components/PricelistSection.tsx`:
```tsx
type Produk = { nama_produk: string; kategori: string; harga_per_kg: number }

export function PricelistSection({ produk }: { produk: Produk[] }) {
  return (
    <section className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Bank Sampah</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Harga Sampah per Kilogram</h2>

        {/* Signature element: struk kasir — border dashed, header solid, angka mono rata kanan */}
        <div
          className="mx-auto max-w-md bg-white shadow-sm border-x-2 border-dashed border-prussian/30"
          style={{
            borderTop: '2px dashed rgba(16,58,87,0.3)',
            borderBottom: '2px dashed rgba(16,58,87,0.3)',
          }}
        >
          <div className="bg-mughal-green text-white px-6 py-3 text-center">
            <p className="font-display font-semibold tracking-wide">STRUK HARGA BANK SAMPAH</p>
            <p className="font-mono text-xs opacity-80">Kelurahan Manembo-nembo Tengah</p>
          </div>
          <div className="px-6 py-4">
            {produk.map((p, idx) => (
              <div key={p.nama_produk} className={`flex justify-between py-2 text-sm ${idx !== produk.length - 1 ? 'border-b border-dashed border-prussian/15' : ''}`}>
                <div>
                  <p className="text-prussian font-medium">{p.nama_produk}</p>
                  <p className="text-teal-blue text-xs">{p.kategori}</p>
                </div>
                <p className="font-mono text-prussian font-semibold self-center">
                  Rp{p.harga_per_kg.toLocaleString('id-ID')}/kg
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 text-center border-t border-dashed border-prussian/20">
            <p className="font-mono text-xs text-prussian/50">Harga berlaku di kantor kelurahan</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

`app/components/GaleriSection.tsx`:
```tsx
type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Dokumentasi</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Galeri Kegiatan</h2>
        <div className="grid grid-cols-3 gap-3">
          {foto.slice(0, 6).map((f) => (
            <div key={f.id} className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={f.url} alt={f.caption ?? ''} className="h-full w-full object-cover transition group-hover:scale-105" />
              {f.caption && (
                <div className="absolute inset-0 bg-teal-blue/0 group-hover:bg-teal-blue/60 transition flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs">{f.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Assemble homepage**

`app/page.tsx` (replace isi sebelumnya):
```tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SambutanLurah } from '@/components/SambutanLurah'
import { ProfilSection } from '@/components/ProfilSection'
import { InfografisSection } from '@/components/InfografisSection'
import { PetaSection } from '@/components/PetaSection'
import { PricelistSection } from '@/components/PricelistSection'
import { GaleriSection } from '@/components/GaleriSection'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: profil }, { data: berita }, { data: produk }, { data: foto }] = await Promise.all([
    supabase.from('profil_kelurahan').select('*').single(),
    supabase.from('berita_desa').select('judul, slug, created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    supabase.from('produk_bumdes').select('nama_produk, kategori, harga_per_kg').order('nama_produk'),
    supabase.from('galeri_foto').select('id, url, caption').order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <main>
      <header className="bg-prussian py-10">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-pastel-blue mb-1">Website Resmi</p>
          <h1 className="font-display text-3xl font-bold text-white">Kelurahan Manembo-nembo Tengah</h1>
          <p className="text-pastel-blue mt-1">Kec. Matuari, Kota Bitung</p>
        </div>
      </header>

      {profil && (
        <>
          <SambutanLurah sambutan={profil.sambutan_lurah} fotoUrl={profil.foto_lurah_url} />
          <ProfilSection visi={profil.visi} misi={profil.misi} sejarah={profil.sejarah} />
          <InfografisSection penduduk={profil.jumlah_penduduk} kk={profil.jumlah_kk} rt={profil.jumlah_rt} rw={profil.jumlah_rw} />
        </>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Informasi</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Berita Terbaru</h2>
          <ul className="space-y-3">
            {berita?.map((b) => (
              <li key={b.slug} className="border-b border-pastel-blue pb-3">
                <Link href={`/berita/${b.slug}`} className="text-prussian font-medium hover:text-mughal-green transition">
                  {b.judul}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {profil?.google_maps_embed_url && <PetaSection embedUrl={profil.google_maps_embed_url} />}
      <PricelistSection produk={produk ?? []} />
      <GaleriSection foto={foto ?? []} />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```
Buka `/` → cek semua 7 section muncul berurutan: sambutan, profil, infografis, berita, peta, pricelist, galeri. Isi profil kosong (belum diisi Task 7) → section tetap render tanpa error (graceful empty state).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/components
git commit -m "feat: restructure public homepage with all 7 required sections"
```

---

## Self-Review

**Spec coverage (PRD v3):** Semua fitur tercakup penuh — Sambutan Lurah (Task 7, 9), Profil Kelurahan (Task 7, 9), Infografis (Task 7, 9), Berita (Task 4), Peta (Task 7, 9), Master Produk CRUD (Task 4.5), Pricelist Bank Sampah publik (Task 9), POS/Kasir (Task 5), Laporan (Task 6), Galeri (Task 8, 9), RLS + Storage policies (Task 2, 2.5). Tidak ada gap tersisa.

**Urutan eksekusi:** Task 1 → 2 → 2.5 → 3 → 4 → 4.5 → 5 → 6 → 7 → 8 → 9. Task 9 (homepage) paling akhir karena butuh data dari semua modul sebelumnya. Task 4.5 harus selesai sebelum Task 5 (POS butuh data produk) dan sebelum Task 9 (pricelist publik butuh data produk).

**Placeholder scan:** Tidak ada TBD/placeholder — semua step punya kode lengkap siap tempel.

**Type consistency:** `CartItem`, `CheckoutItem`, dan kolom `detail_transaksi` konsisten pakai `produk_id`, `jumlah_kg`, `harga_satuan` di semua task.

---

**Plan lengkap tersimpan di `PLAN.md`. Dua opsi eksekusi:**

**1. Subagent-Driven (recommended)** — dispatch subagent baru per task, review antar task, iterasi cepat.

**2. Inline Execution** — eksekusi task berurutan dalam sesi ini, batch dengan checkpoint review.

Mana yang mau dipakai?
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

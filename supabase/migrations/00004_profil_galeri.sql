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

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

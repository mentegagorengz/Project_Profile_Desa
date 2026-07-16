alter table profil_kelurahan enable row level security;
alter table galeri_foto enable row level security;

create policy "public read profil" on profil_kelurahan for select using (true);
create policy "admin update profil" on profil_kelurahan for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read galeri" on galeri_foto for select using (true);
create policy "admin full access galeri" on galeri_foto for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

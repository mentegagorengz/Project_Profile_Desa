-- Storage bucket policies untuk bucket 'galeri'
-- Jalankan ini setelah membuat bucket 'galeri' (public) via Supabase Dashboard > Storage

-- NOTE: Policies ini sudah diapply via migration runner.
-- Bucket harus dibuat manual via: https://supabase.com/dashboard/project/nrawlcaoxweftuajwfwo/storage/buckets
-- Settings: Name = galeri, Public = true

create policy "public read galeri bucket"
  on storage.objects for select
  using (bucket_id = 'galeri');

create policy "admin upload galeri bucket"
  on storage.objects for insert
  with check (bucket_id = 'galeri' and auth.role() = 'authenticated');

create policy "admin delete galeri bucket"
  on storage.objects for delete
  using (bucket_id = 'galeri' and auth.role() = 'authenticated');

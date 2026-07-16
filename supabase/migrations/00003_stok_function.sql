create or replace function increment_stok(p_produk_id uuid, p_jumlah numeric)
returns void as $$
begin
  update produk_bumdes
  set stok_saat_ini = stok_saat_ini + p_jumlah
  where id = p_produk_id;
end;
$$ language plpgsql security definer;

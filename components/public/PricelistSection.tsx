type Produk = { nama_produk: string; kategori: string; harga_per_kg: number }

export function PricelistSection({ produk }: { produk: Produk[] }) {
  if (!produk || produk.length === 0) return null
  
  return (
    <section className="py-16 border-b bg-muted/20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Harga Bank Sampah</h2>
          <p className="text-muted-foreground">Daftar harga beli sampah plastik per kilogram (Cash & Carry).</p>
        </div>
        
        <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-semibold">Jenis Sampah</th>
                <th className="py-3 px-4 text-left font-semibold hidden sm:table-cell">Kategori</th>
                <th className="py-3 px-4 text-right font-semibold">Harga / kg</th>
              </tr>
            </thead>
            <tbody>
              {produk.map((p, i) => (
                <tr key={p.nama_produk} className={i !== produk.length - 1 ? 'border-b' : ''}>
                  <td className="py-3 px-4">
                    <span className="font-medium">{p.nama_produk}</span>
                    <span className="block sm:hidden text-xs text-muted-foreground mt-1">{p.kategori}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.kategori}</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">Rp{p.harga_per_kg.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

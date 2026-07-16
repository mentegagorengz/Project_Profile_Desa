type Produk = { nama_produk: string; kategori: string; harga_per_kg: number }

export function PricelistSection({ produk }: { produk: Produk[] }) {
  if (!produk || produk.length === 0) return null

  return (
    <section id="harga" className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Bank Sampah</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-6">Harga Sampah per Kilogram</h2>

        {/* Signature element: struk kasir — border dashed, header solid, angka mono rata kanan */}
        <div
          className="mx-auto max-w-md bg-white shadow-md border-x-2 border-dashed border-prussian/30"
          style={{
            borderTop: '2px dashed rgba(16,58,87,0.3)',
            borderBottom: '2px dashed rgba(16,58,87,0.3)',
          }}
        >
          <div className="bg-mughal-green text-white px-6 py-3 text-center">
            <p className="font-display font-semibold tracking-wide text-lg">STRUK HARGA BANK SAMPAH</p>
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
          <div className="px-6 py-3 text-center border-t border-dashed border-prussian/20 bg-muted/30">
            <p className="font-mono text-xs text-prussian/50">Harga berlaku di kantor kelurahan</p>
          </div>
        </div>
      </div>
    </section>
  )
}

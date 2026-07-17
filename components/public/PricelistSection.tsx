import { Check } from 'lucide-react'

type Produk = { nama_produk: string; kategori: string; harga_per_kg: number }

export function PricelistSection({ produk }: { produk: Produk[] }) {
  if (!produk || produk.length === 0) return null

  return (
    <section id="harga" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Program Description */}
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">
              Program Unggulan
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4 text-foreground leading-tight">
              Bank Sampah Kelurahan
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
              Program bank sampah hadir sebagai solusi pengelolaan limbah sekaligus pemberdayaan ekonomi warga. Warga dapat menyetor berbagai jenis sampah langsung ke kantor kelurahan dengan harga transparan.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              Sistem kami menggunakan pencatatan digital modern, memastikan setiap transaksi tercatat akurat dan transparan untuk seluruh pihak.
            </p>
            <div className="space-y-3">
              {[
                'Harga transparan per kilogram berdasarkan jenis plastik',
                'Proses drop-off cepat di kantor kelurahan',
                'Pencatatan digital real-time',
                'Mendukung lingkungan dan ekonomi warga',
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            {produk.slice(0, 8).map((p) => (
              <div
                key={p.nama_produk}
                className="bg-secondary rounded-xl p-4 border border-border shadow-sm"
              >
                <div className="text-[10px] text-primary/70 font-semibold mb-1 uppercase tracking-wider font-mono">
                  {p.kategori} · kg
                </div>
                <div className="text-sm font-bold text-foreground leading-tight line-clamp-2 h-10">
                  {p.nama_produk}
                </div>
                <div className="mt-2 text-primary font-black text-base">
                  Rp{p.harga_per_kg.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-muted-foreground">/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

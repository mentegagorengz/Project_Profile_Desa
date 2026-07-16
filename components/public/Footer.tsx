import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-prussian pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-blue/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Kolom 1: Identitas */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-4">
              Kelurahan<br />
              <span className="text-pastel-blue">Manembo-nembo Tengah</span>
            </h3>
            <p className="text-pastel-blue/80 text-sm leading-relaxed mb-6">
              Mewujudkan pelayanan masyarakat yang prima, inovatif, dan transparan menuju kelurahan yang mandiri dan sejahtera.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/5"
              >
                Portal Admin <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Kolom 2: Kontak */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-teal-blue mb-4">Kontak & Lokasi</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pastel-blue shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">
                  Jl. SH Sarundajang, Kec. Matuari, Kota Bitung, Sulawesi Utara
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pastel-blue shrink-0" />
                <span className="text-white/80 text-sm">(0438) XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pastel-blue shrink-0" />
                <span className="text-white/80 text-sm">kontak@manembonembotengah.go.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Jam Layanan */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-teal-blue mb-4">Jam Layanan</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-4 h-4 text-pastel-blue" /> Senin - Kamis
                </div>
                <span className="text-white font-medium">08:00 - 16:00</span>
              </li>
              <li className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-4 h-4 text-pastel-blue" /> Jumat
                </div>
                <span className="text-white font-medium">08:00 - 11:30</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="w-4 h-4 text-pastel-blue" /> Sabtu & Minggu
                </div>
                <span className="text-red-400 font-medium">Tutup</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-pastel-blue/60 font-mono">
            &copy; {new Date().getFullYear()} Kelurahan Manembo-nembo Tengah. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4 text-xs font-mono text-pastel-blue/60">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

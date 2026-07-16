import Link from 'next/link'
import { MapPin, Phone, Mail, Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#14532d] text-white border-t border-green-800">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Identity */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Leaf size={18} className="text-green-300" />
            </div>
            <div>
              <div className="text-sm font-bold">Manembo-nembo Tengah</div>
              <div className="text-xs text-green-300 font-medium">BUMDes Maju Bersama</div>
            </div>
          </div>
          <p className="text-sm text-green-200 leading-relaxed">
            Mewujudkan pelayanan masyarakat yang prima, inovatif, dan transparan menuju kelurahan yang mandiri, sejahtera, dan berkelanjutan.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-bold text-green-300 mb-4 text-sm uppercase tracking-wider">
            Tautan Cepat
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Profil Kelurahan', href: '/profil' },
              { label: 'Visi & Misi', href: '/visi-misi' },
              { label: 'Berita Desa', href: '/berita' },
              { label: 'Galeri Kegiatan', href: '/galeri' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-green-200 hover:text-white transition-colors cursor-pointer text-left self-start"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="font-bold text-green-300 mb-4 text-sm uppercase tracking-wider">
            Kontak
          </h4>
          <div className="space-y-3.5 text-sm text-green-200">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-green-400" />
              <span className="leading-relaxed">
                Jl. SH Sarundajang, Kec. Matuari, Kota Bitung, Sulawesi Utara
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-green-400" />
              <span>(0438) XXXXXX</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-green-400" />
              <span>kontak@manembonembotengah.go.id</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-green-800 py-6 text-center text-xs text-green-400 font-mono">
        © {new Date().getFullYear()} Pemerintah Kelurahan Manembo-nembo Tengah. Hak cipta dilindungi.
      </div>
    </footer>
  )
}

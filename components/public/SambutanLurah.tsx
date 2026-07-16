import { User } from 'lucide-react'

export function SambutanLurah({ sambutan, fotoUrl }: { sambutan: string; fotoUrl: string | null }) {
  return (
    <section id="sambutan" className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl flex flex-col md:flex-row gap-8 items-center px-6 text-center md:text-left">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt="Lurah Manembo-nembo Tengah"
            className="h-40 w-40 rounded-full object-cover ring-4 ring-mughal-green shrink-0 mx-auto md:mx-0 shadow-lg"
          />
        ) : (
          <div className="h-40 w-40 rounded-full bg-pastel-blue/20 flex items-center justify-center ring-4 ring-mughal-green shrink-0 mx-auto md:mx-0 shadow-lg">
            <User className="w-16 h-16 text-teal-blue/50" />
          </div>
        )}
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Sambutan</p>
          <h2 className="font-display text-2xl font-semibold text-prussian mb-3">Selamat Datang di Portal Kelurahan</h2>
          <p className="whitespace-pre-line text-prussian/80 leading-relaxed italic mb-4">
            &quot;{sambutan || 'Bersama kita bangun Manembo-nembo Tengah yang lebih baik, sejahtera, dan harmonis.'}&quot;
          </p>
          <div>
            <p className="font-display font-semibold text-prussian text-lg">Bpk. John Doe, S.IP</p>
            <p className="font-mono text-xs text-teal-blue">Lurah Manembo-nembo Tengah</p>
          </div>
        </div>
      </div>
    </section>
  )
}

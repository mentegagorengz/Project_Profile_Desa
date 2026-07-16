export function SambutanLurah({ sambutan, fotoUrl }: { sambutan: string; fotoUrl: string | null }) {
  return (
    <section id="sambutan" className="bg-[#f8faf7] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Foto */}
          <div className="shrink-0">
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoUrl}
                alt="Lurah Manembo-nembo Tengah"
                className="h-44 w-44 rounded-2xl object-cover shadow-card ring-2 ring-pastel-blue mx-auto md:mx-0"
              />
            ) : (
              <div className="h-44 w-44 rounded-2xl bg-light-silver flex items-center justify-center shadow-card ring-2 ring-pastel-blue mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-teal-blue/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          {/* Teks */}
          <div className="flex-1 text-center md:text-left">
            <blockquote className="text-prussian/85 leading-relaxed text-base md:text-lg mb-6 relative">
              <span className="text-5xl text-pastel-blue font-serif leading-none absolute -top-3 -left-2 select-none hidden md:block">&ldquo;</span>
              <p className="md:pl-8 whitespace-pre-line">
                {sambutan || 'Bersama kita bangun Manembo-nembo Tengah yang lebih baik, sejahtera, dan harmonis.'}
              </p>
            </blockquote>
            <div className="border-t border-pastel-blue/40 pt-4">
              <p className="font-display font-semibold text-prussian">Bpk. John Doe, S.IP</p>
              <p className="text-sm text-teal-blue mt-0.5">Lurah Manembo-nembo Tengah</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

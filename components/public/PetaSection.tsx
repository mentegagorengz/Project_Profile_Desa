export function PetaSection({ embedUrl }: { embedUrl: string }) {
  if (!embedUrl) return null
  return (
    <section className="py-16 border-b">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Peta Wilayah</h2>
        <div className="w-full h-[400px] rounded-xl overflow-hidden border shadow-sm">
          <iframe 
            src={embedUrl} 
            className="w-full h-full border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" 
          />
        </div>
      </div>
    </section>
  )
}

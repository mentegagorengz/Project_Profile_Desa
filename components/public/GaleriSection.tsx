'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ZoomIn } from 'lucide-react'

type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)

  if (!foto || foto.length === 0) return null

  return (
    <>
      <section id="galeri" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Dokumentasi</p>
              <h2 className="font-display text-2xl font-semibold text-prussian">Galeri Kegiatan</h2>
            </div>
            <Link
              href="/galeri"
              className="hidden sm:inline-flex font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition shrink-0"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {foto.slice(0, 6).map((f) => (
              <div 
                key={f.id} 
                className="group relative aspect-square overflow-hidden rounded-xl border border-pastel-blue/60 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
                onClick={() => setSelectedFoto(f)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.caption ?? ''} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-prussian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-md transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                </div>
                {f.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-prussian/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs line-clamp-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{f.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/galeri"
              className="inline-flex font-mono text-xs uppercase tracking-wider text-teal-blue hover:text-mughal-green transition"
            >
              Lihat Semua →
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedFoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-prussian/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedFoto(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedFoto(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedFoto.url} 
              alt={selectedFoto.caption ?? ''} 
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            {selectedFoto.caption && (
              <div className="w-full mt-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <p className="text-white text-center text-sm md:text-base leading-relaxed">
                  {selectedFoto.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

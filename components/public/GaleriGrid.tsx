'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Foto = { id: string; url: string; caption: string | null }

export function GaleriGrid({ initialFoto }: { initialFoto: Foto[] }) {
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)

  useEffect(() => {
    if (!selectedFoto) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFoto(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFoto])

  if (!initialFoto || initialFoto.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
        <p className="font-display text-lg">Belum ada foto di galeri.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {initialFoto.map((f) => (
          <button
            key={f.id}
            type="button"
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-card hover:shadow-hover transition-shadow duration-300 cursor-pointer text-left"
            onClick={() => setSelectedFoto(f)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={f.url} 
              alt={f.caption ?? 'Foto Kegiatan'} 
              className="h-full w-full object-cover" 
            />
            <div className="absolute inset-0 bg-prussian/0 group-hover:bg-prussian/50 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {f.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-prussian/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs line-clamp-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {f.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-dashed border-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Lightbox Modal */}
      {selectedFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-prussian/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedFoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Detail Foto Kegiatan"
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedFoto(null) }}
            aria-label="Tutup detail foto"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFoto.url}
              alt={selectedFoto.caption ?? ''}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            {selectedFoto.caption && (
              <div className="w-full mt-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 max-w-xl">
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

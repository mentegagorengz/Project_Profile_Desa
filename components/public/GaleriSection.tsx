'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ZoomIn } from 'lucide-react'

type Foto = { id: string; url: string; caption: string | null }

export function GaleriSection({ foto }: { foto: Foto[] }) {
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)

  useEffect(() => {
    if (!selectedFoto) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFoto(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFoto])

  if (!foto || foto.length === 0) return null

  return (
    <>
      <section id="galeri" className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">Galeri Kegiatan</h2>
            <Link
              href="/galeri"
              className="hidden sm:text-sm text-primary hover:text-primary/80 transition-colors sm:inline-block"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {foto.slice(0, 6).map((f) => (
              <button
                key={f.id}
                type="button"
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-card hover:shadow-hover transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedFoto(f)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.caption ?? ''} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-prussian/0 group-hover:bg-prussian/50 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/galeri" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Lihat Semua →
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
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
              <p className="mt-4 text-white/70 text-sm text-center max-w-xl">{selectedFoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Home, Map, Building2 } from 'lucide-react'

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let startTime: number
    let frame: number
    const run = (ts: number) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      if (elapsed < duration) {
        setCount(Math.min(Math.floor((elapsed / duration) * end), end))
        frame = requestAnimationFrame(run)
      } else {
        setCount(end)
      }
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [end, duration, started])

  return <span ref={ref}>{count.toLocaleString('id-ID')}</span>
}

export function InfografisSection({ penduduk, kk, rt, rw }: { penduduk: number; kk: number; rt: number; rw: number }) {
  const stats = [
    { label: 'Jiwa', sublabel: 'Jumlah Penduduk', value: penduduk, icon: Users },
    { label: 'KK', sublabel: 'Kepala Keluarga', value: kk, icon: Home },
    { label: 'RT', sublabel: 'Rukun Tetangga', value: rt, icon: Map },
    { label: 'RW', sublabel: 'Rukun Warga', value: rw, icon: Building2 },
  ]

  return (
    <section id="infografis" className="bg-prussian py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">Kelurahan dalam Angka</h2>
        <p className="text-pastel-blue/70 text-sm mb-10">Data kependudukan dan wilayah terkini.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <s.icon className="w-5 h-5 text-pastel-blue mx-auto mb-3 opacity-70" />
              <p className="font-mono text-4xl font-bold text-white tabular-nums">
                <CountUp end={s.value} />
              </p>
              <p className="font-mono text-xs text-pastel-blue mt-1.5 uppercase tracking-wider">{s.label}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

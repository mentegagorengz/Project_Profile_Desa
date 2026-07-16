'use client'

import { useEffect, useRef, useState } from 'react'

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
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
    { label: 'Jiwa', value: penduduk, color: 'text-green-700' },
    { label: 'KK', value: kk, color: 'text-blue-700' },
    { label: 'RT', value: rt, color: 'text-amber-700' },
    { label: 'RW', value: rw, color: 'text-emerald-700' },
  ]

  return (
    <section id="infografis" className="bg-white border-b border-border py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className={`font-mono text-3xl md:text-4xl font-bold ${s.color}`}>
                <CountUp end={s.value} />
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

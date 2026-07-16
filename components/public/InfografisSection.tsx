'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Home, Map, Building2 } from 'lucide-react'

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        const nextCount = Math.min(Math.floor((progress / duration) * end), end)
        setCount(nextCount)
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])

  return <span ref={countRef}>{count.toLocaleString('id-ID')}</span>
}

export function InfografisSection({ penduduk, kk, rt, rw }: { penduduk: number; kk: number; rt: number; rw: number }) {
  const stats = [
    { label: 'Penduduk', value: penduduk, icon: Users },
    { label: 'Kepala Keluarga', value: kk, icon: Home },
    { label: 'RT', value: rt, icon: Map },
    { label: 'RW', value: rw, icon: Building2 },
  ]
  return (
    <section id="infografis" className="bg-light-silver py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2 text-center md:text-left">Infografis</p>
        <h2 className="font-display text-2xl font-semibold text-prussian mb-8 text-center md:text-left">Kelurahan dalam Angka</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div 
              key={s.label} 
              className="group rounded-xl bg-white border border-pastel-blue/60 p-5 text-center shadow-sm hover:shadow-md hover:border-teal-blue transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-pastel-blue/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <s.icon className="w-6 h-6 text-teal-blue" />
              </div>
              <p className="font-mono text-3xl font-bold text-mughal-green">
                <CountUp end={s.value} />
              </p>
              <p className="text-sm font-medium text-prussian/70 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

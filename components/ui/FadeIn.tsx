'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If the user prefers reduced motion, trigger visibility instantly
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    // Safety timeout fallback to guarantee visibility for headless search crawlers & slow rendering tabs
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true)
    }, 1200)

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entries[0].target)
        clearTimeout(fallbackTimer)
      }
    }, { threshold: 0.1 })
    
    if (domRef.current) observer.observe(domRef.current)
    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

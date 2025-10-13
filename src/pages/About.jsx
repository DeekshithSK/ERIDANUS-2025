import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Galaxy from '../components/Galaxy.jsx'

export default function About() {
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  useLayoutEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      if (titleRef.current && bodyRef.current) {
        gsap.set([titleRef.current, bodyRef.current], { autoAlpha: 0, y: 12 })
        gsap.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        gsap.to(bodyRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="hero hero-min" aria-label="About ERIDANUS 2025">
      {/* Galaxy background for consistency */}
      <div className="galaxy-bg" aria-hidden>
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.5}
          glowIntensity={0.45}
          saturation={0.0}
          hueShift={0}
          rotationSpeed={0.04}
          twinkleIntensity={0.3}
          transparent={false}
        />
      </div>
      <section className="overlay about-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="about-title">About ERIDANUS 2025</h1>
        <p ref={bodyRef} className="about-copy">
          ERIDANUS 2025 is a premier interdisciplinary conference designed to break down academic silos and foster collaboration. Our mission is to unite bright minds from technology, business, and sustainability to address complex global challenges. We aim to create a dynamic platform for sharing groundbreaking research, innovative business models, and sustainable practices that will shape a better tomorrow.
        </p>
        <style>{`
          .about-overlay { max-width: 960px; margin: 0 auto; text-align: left; }
          .about-title { font-size: clamp(1.6rem, 4.6vw, 2.8rem); font-weight: 700; line-height: 1.1; color: #fff; text-align: center; margin-bottom: 0.6rem; }
          .about-copy { font-size: clamp(1.1rem, 2.8vw, 1.25rem); line-height: 1.75; color: #dfe5ff; text-align: center; max-width: 60ch; margin: 0.35rem auto 0; }
          @media (max-width: 640px) { .about-overlay { padding: 14px 10px; } }
        `}</style>
      </section>
    </main>
  )
}

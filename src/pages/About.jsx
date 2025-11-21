import React, { useLayoutEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'

export default function About() {
  const titleRef = useRef(null)
  const bodyRef = useRef(null)
  const partnersRef = useRef(null)

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

  // Import all partner logo assets from src/partners (supports multiple extensions and cases)
  const partnerLogos = useMemo(() => {
    const modules = import.meta.glob('../partners/**/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true, import: 'default' })
    const urls = Object.values(modules).filter(Boolean)
    // Stable order by URL so deploys are deterministic
    urls.sort((a, b) => String(a).localeCompare(String(b)))
    return urls
  }, [])

  // Single unified partners list
  const partners = useMemo(() => partnerLogos.map((src, i) => ({ label: `Partner ${i + 1}`, src })), [partnerLogos])

  return (
    <main className="hero hero-min" aria-label="About ERIDANUS 2025">
      <section className="overlay about-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="about-title">About ERIDANUS 2025</h1>
        <p ref={bodyRef} className="about-copy">
          ERIDANUS 2025 is a premier interdisciplinary conference designed to break down academic silos and foster collaboration. Our mission is to unite bright minds from technology, business, and sustainability to address complex global challenges. We aim to create a dynamic platform for sharing groundbreaking research, innovative business models, and sustainable practices that will shape a better tomorrow.
        </p>

        {/* Partners Section */}


        <style>{`
          .about-overlay { max-width: 1100px; margin: 0 auto; text-align: left; }
          .about-title { font-size: clamp(1.6rem, 4.6vw, 2.8rem); font-weight: 700; line-height: 1.1; color: #fff; text-align: center; margin-bottom: 0.6rem; }
          .about-copy { font-size: clamp(1.1rem, 2.8vw, 1.25rem); line-height: 1.75; color: #dfe5ff; text-align: center; max-width: 68ch; margin: 0.35rem auto 0; }

          .partners { margin: clamp(22px, 5vw, 40px) auto 0; display: grid; gap: clamp(18px, 4vw, 28px); }
          .partner-group { background: rgba(10,12,18,0.35); border: 1px solid rgba(107,193,255,0.22); border-radius: 16px; padding: clamp(14px, 3.6vw, 22px); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 10px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04); }
          .partner-title { margin: 0 0 14px; color: #eaf5ff; font-weight: 800; letter-spacing: .01em; font-size: clamp(1.05rem, 2.8vw, 1.25rem); text-align: center; }
          .logos { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; align-items: center; justify-items: center; }
          .partner-logo { max-width: 90%; max-height: 96px; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
          .logo-fallback { display: inline-grid; place-items: center; min-height: 64px; padding: 10px 12px; font-size: .95rem; color: #b9dfff; opacity: .9; font-weight: 700; letter-spacing: .01em; border: 1px dashed rgba(107,193,255,0.3); border-radius: 10px; }
          @media (max-width: 640px) { .about-overlay { padding: 14px 10px; } }
        `}</style>
      </section>
    </main>
  )
}

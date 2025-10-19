import React, { useLayoutEffect, useRef } from 'react'
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

  const partners = [
    {
      title: 'International Knowledge Partners',
      items: [
        { label: 'Partner 1', src: '' },
        { label: 'Partner 2', src: '' },
        { label: 'Partner 3', src: '' },
        { label: 'Partner 4', src: '' },
      ],
    },
    {
      title: 'Academic Partners',
      items: [
        { label: 'Partner 1', src: '' },
        { label: 'Partner 2', src: '' },
        { label: 'Partner 3', src: '' },
        { label: 'Partner 4', src: '' },
        { label: 'Partner 5', src: '' },
      ],
    },
    {
      title: 'Media and Streaming Partners',
      items: [
        { label: 'Partner 1', src: '' },
        { label: 'Partner 2', src: '' },
        { label: 'Partner 3', src: '' },
        { label: 'Partner 4', src: '' },
      ],
    },
  ]

  return (
    <main className="hero hero-min" aria-label="About ERIDANUS 2025">
      <section className="overlay about-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="about-title">About ERIDANUS 2025</h1>
        <p ref={bodyRef} className="about-copy">
          ERIDANUS 2025 is a premier interdisciplinary conference designed to break down academic silos and foster collaboration. Our mission is to unite bright minds from technology, business, and sustainability to address complex global challenges. We aim to create a dynamic platform for sharing groundbreaking research, innovative business models, and sustainable practices that will shape a better tomorrow.
        </p>

        {/* Partners Section */}
        <section ref={partnersRef} className="partners" aria-label="Partners">
          {partners.map((group, gi) => (
            <div className="partner-group" key={group.title + gi}>
              <h2 className="partner-title">{group.title}</h2>
              <div className="logos" role="list">
                {group.items.map((it, idx) => (
                  <div className="logo-card" role="listitem" key={group.title + idx}>
                    {it.src ? (
                      <img src={it.src} alt={it.label || 'Partner logo'} loading="lazy" />
                    ) : (
                      <div className="logo-fallback" aria-hidden="true">{it.label || 'Logo'}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <style>{`
          .about-overlay { max-width: 1100px; margin: 0 auto; text-align: left; }
          .about-title { font-size: clamp(1.6rem, 4.6vw, 2.8rem); font-weight: 700; line-height: 1.1; color: #fff; text-align: center; margin-bottom: 0.6rem; }
          .about-copy { font-size: clamp(1.1rem, 2.8vw, 1.25rem); line-height: 1.75; color: #dfe5ff; text-align: center; max-width: 68ch; margin: 0.35rem auto 0; }

          .partners { margin: clamp(22px, 5vw, 40px) auto 0; display: grid; gap: clamp(18px, 4vw, 28px); }
          .partner-group { background: rgba(10,12,18,0.35); border: 1px solid rgba(107,193,255,0.22); border-radius: 16px; padding: clamp(14px, 3.6vw, 22px); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 10px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04); }
          .partner-title { margin: 0 0 12px; color: #eaf5ff; font-weight: 800; letter-spacing: .01em; font-size: clamp(1.05rem, 2.8vw, 1.25rem); }
          .logos { display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px; align-items: center; }
          .logo-card { grid-column: span 6; height: 84px; display: grid; place-items: center; border-radius: 12px; background: rgba(14,18,28,0.55); border: 1px solid rgba(107,193,255,0.18); overflow: hidden; }
          .logo-card img { max-height: 80%; max-width: 90%; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
          .logo-fallback { font-size: .95rem; color: #b9dfff; opacity: .9; font-weight: 700; letter-spacing: .01em; }
          @media (min-width: 720px) {
            .logo-card { grid-column: span 3; height: 96px; }
          }
          @media (max-width: 640px) { .about-overlay { padding: 14px 10px; } }
        `}</style>
      </section>
    </main>
  )
}

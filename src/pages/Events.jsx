import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Galaxy from '../components/Galaxy.jsx'

const cards = [
  {
    key: 'angetenar',
    name: 'Angetenar',
    subtitle: 'Poster Presentation',
    eligibility: 'UG & PU students',
    team: 'Max 2 members',
    extraLabel: 'Poster Size',
    extraValue: '18inc × 24inc (portrait)',
    price: '₹260',
    cta: 'Register for Angetenar',
    url: 'https://forms.gle/jin6avP2rEfyqmgW8',
    accent: ['#6a5cff', '#8a6bff'],
    icon: 'image'
  },
  {
    key: 'zaurak',
    name: 'Zaurak',
    subtitle: 'Online Abstract Presentation',
    eligibility: 'UG, PG, Researchers',
    team: 'Max 2 members',
    extraLabel: 'Duration',
    extraValue: '10 mins + 5 mins Q&A',
    price: '₹200',
    cta: 'Register for Zaurak',
    url: 'https://forms.gle/VxVfXCXMU4NE7WTY7',
    accent: ['#00b472', '#19d38c'],
    icon: 'video'
  },
  {
    key: 'beid',
    name: 'Beid',
    subtitle: 'In-Person Abstract Presentation',
    eligibility: 'UG, PG, Researchers',
    team: 'Max 2 members',
    extraLabel: 'Duration',
    extraValue: '12 mins + 3 mins Q&A',
    price: '₹350',
    cta: 'Register for Beid',
    url: 'https://forms.gle/T4Utnerghy8vw3TPA',
    accent: ['#ff6a3a', '#ff8a4e'],
    icon: 'abstract'
  }
]

export default function Events() {
  const gridRef = useRef(null)
  const titleRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { autoAlpha: 0, y: 14 })
        gsap.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
      }
      if (gridRef.current) {
        const nodes = gridRef.current.querySelectorAll('.ev-card')
        gsap.set(nodes, { autoAlpha: 0, y: 24, scale: 0.98 })
        gsap.to(nodes, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="hero hero-min" aria-label="Events">
      {/* Galaxy background */}
      <div className="galaxy-bg" aria-hidden>
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.5}
          glowIntensity={0.45}
          saturation={0.0}
          hueShift={0}
          rotationSpeed={0.035}
          twinkleIntensity={0.3}
          transparent={false}
        />
      </div>
      <section className="overlay events-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="events-title">Events</h1>
        <div ref={gridRef} className="events-grid">
          {cards.map(e => (
            <article key={e.key} className="ev-card" aria-labelledby={`${e.key}-title`}>
              <div className="ev-badge" aria-hidden>
                <div className="ev-badge-inner" style={{ background: `linear-gradient(135deg, ${e.accent[0]}, ${e.accent[1]})` }}>
                  {e.icon === 'image' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.5" y="6" width="17" height="12" rx="3" stroke="#fff" strokeWidth="1.6"/>
                      <circle cx="9" cy="10" r="1.6" fill="#fff" />
                      <path d="M7 16l3-3 2 2 3-3 3 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {e.icon === 'video' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3.5" y="6" width="12" height="12" rx="2.5" stroke="#fff" strokeWidth="1.6"/>
                      <path d="M16 10l4-2v8l-4-2v-4z" fill="#fff"/>
                    </svg>
                  )}
                  {e.icon === 'abstract' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12a6 6 0 1112 0 6 6 0 01-12 0z" stroke="#fff" strokeWidth="1.6" opacity="0.8"/>
                      <path d="M12 6v12M6 12h12" stroke="#fff" strokeWidth="1.6" opacity="0.8"/>
                    </svg>
                  )}
                </div>
              </div>
              <header className="ev-header">
                <h2 id={`${e.key}-title`} className="ev-title">{e.name}</h2>
                <p className="ev-subtitle">{e.subtitle}</p>
              </header>
              <ul className="ev-meta" role="list">
                <li className="ev-meta-row">
                  <span className="ev-meta-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c-1.657 0-3-1.567-3-3.5S10.343 7 12 7s3 1.567 3 3.5S13.657 14 12 14z" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c.5-3 3.5-5 7-5s6.5 2 7 5" stroke="currentColor" strokeWidth="1.6"/></svg>
                  </span>
                  <span className="ev-meta-text"><strong>Eligibility:</strong> {e.eligibility}</span>
                </li>
                <li className="ev-meta-row">
                  <span className="ev-meta-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 8a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0zM5 16h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </span>
                  <span className="ev-meta-text"><strong>Team Size:</strong> {e.team}</span>
                </li>
                <li className="ev-meta-row">
                  <span className="ev-meta-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="ev-meta-text"><strong>{e.extraLabel}:</strong> {e.extraValue}</span>
                </li>
              </ul>
              <div className="ev-price">
                <div className="ev-price-box">
                  <div className="ev-price-value">{e.price}</div>
                  <div className="ev-price-sub">per team</div>
                </div>
              </div>
              <div className="ev-cta">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="ev-btn" aria-label={e.cta}>
                  <span className="ev-btn-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12h10M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span>{e.cta}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <style>{`
          .events-overlay { max-width: 1240px; margin: 0 auto; }
          .events-title { font-size: clamp(1.6rem, 4.6vw, 2.6rem); font-weight: 700; color: #fff; text-align: center; margin-bottom: 1.25rem; }
          .events-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.1rem; }
          .ev-card { position: relative; display: flex; flex-direction: column; gap: 0.75rem; background: rgba(10,12,18,0.55); border: 1px solid rgba(107,193,255,0.12); border-radius: 18px; padding: 1.1rem; color: #e9e9ef; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 38px rgba(0,0,0,0.45); transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
          .ev-card:hover { transform: translateY(-2px); border-color: rgba(107,193,255,0.22); box-shadow: 0 18px 46px rgba(0,0,0,0.55); }
          .ev-badge { display: flex; align-items: center; justify-content: center; }
          .ev-badge-inner { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18), 0 8px 24px rgba(0,0,0,0.25); }
          .ev-header { text-align: left; }
          .ev-title { font-weight: 800; color: #fff; font-size: clamp(1.25rem, 2.6vw, 1.6rem); margin: 0.25rem 0 0; }
          .ev-subtitle { color: #cfd3ff; font-weight: 700; margin: 0; }
          .ev-meta { list-style: none; margin: 0.25rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
          .ev-meta-row { display: grid; grid-template-columns: 20px 1fr; gap: 0.5rem; align-items: start; color: #dfe5ff; }
          .ev-meta-icon { color: #9fb5ff; display: inline-flex; align-items: center; justify-content: center; margin-top: 0.1rem; }
          .ev-meta-text { line-height: 1.5; font-size: 0.98rem; }
          .ev-price { margin-top: 0.35rem; }
          .ev-price-box { display: grid; place-items: center; background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 0.85rem; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), 0 10px 24px rgba(0,0,0,0.25); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
          .ev-price-value { font-size: 1.8rem; font-weight: 700; color: #fff; text-shadow: 0 2px 14px rgba(118,143,255,0.25); }
          .ev-price-sub { font-size: 0.95rem; color: #c9d2ff; opacity: 0.9; }
          .ev-cta { margin-top: 0.6rem; }
          .ev-btn { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem 1rem; color: #fff; font-weight: 700; border: 1px solid rgba(118,143,255,0.16); border-radius: 14px; background: linear-gradient(135deg, #0b1e3f, #1f4aa1); box-shadow: 0 12px 28px rgba(0,0,0,0.3), 0 0 0 1px rgba(118,143,255,0.08) inset, 0 8px 28px rgba(64,113,255,0.18); cursor: pointer; transition: transform 160ms ease, box-shadow 220ms ease, filter 160ms ease, background 220ms ease; }
          .ev-btn:hover { filter: brightness(1.05); box-shadow: 0 14px 38px rgba(0,0,0,0.38), 0 0 0 1px rgba(118,143,255,0.12) inset, 0 10px 34px rgba(64,113,255,0.28); }
          .ev-btn:active { transform: translateY(1px); }
          .ev-btn:focus-visible { outline: 2px solid rgba(118,143,255,0.7); outline-offset: 3px; }
          .ev-btn-icon { display: inline-flex; align-items: center; justify-content: center; }
          @media (max-width: 1024px) { .events-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
          @media (max-width: 640px) { .events-grid { grid-template-columns: 1fr; } .ev-card { padding: 1rem; } }
        `}</style>
      </section>
    </main>
  )
}

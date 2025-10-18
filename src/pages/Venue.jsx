import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import venueImg from '../../nipe padil.webp'

export default function Venue() {
  const titleRef = useRef(null)
  const leadRef = useRef(null)
  const imgRef = useRef(null)
  const travelRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, leadRef.current, imgRef.current, travelRef.current], { autoAlpha: 0, y: 14 })
      gsap.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
      gsap.to(leadRef.current, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.12 })
      gsap.to(imgRef.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.22 })
      gsap.to(travelRef.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.32 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="hero hero-min" aria-label="Venue">
      <section className="overlay venue-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="venue-title">Venue</h1>
        <p ref={leadRef} className="venue-lead">NIPE Padil Campus, Mangaluru</p>
        <div className="venue-media">
          <img ref={imgRef} src={venueImg} alt="NIPE Padil Campus" className="venue-img" loading="lazy" />
        </div>
        <div className="venue-actions">
          <a
            className="map-btn"
            href="https://maps.app.goo.gl/GLbbn1UvXGYvy6Ye8"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open NIPE Padil Campus in Google Maps (opens in a new tab)"
          >
            View on Google Maps
          </a>
        </div>
        <p className="venue-copy">
          Our conference will be held at the modern and accessible NIPE Padil Campus. Equipped with state-of-the-art facilities, it provides the perfect environment for learning, networking, and collaboration.
        </p>
        <div ref={travelRef} className="venue-travel">
          <div className="travel-block">
            <h2>By Private Vehicle</h2>
            <p>
              Use Google Maps for turn-by-turn navigation to the campus. You can open the location using the button above. Ample parking is available on-site with dedicated spaces for conference attendees.
            </p>
          </div>
          <div className="travel-block">
            <h2>By Public Transport</h2>
            <p>The campus is well-connected by local bus routes (Numbers 10, 11, 30). The nearest major train station is Mangalore Junction (MAJN), just a 15-minute auto-rickshaw ride away.</p>
          </div>
        </div>
        <style>{`
          .venue-overlay { max-width: 1100px; margin: 0 auto; text-align: center; }
          .venue-title { font-size: clamp(1.6rem, 4.6vw, 2.6rem); font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
          .venue-lead { color: #cfd3ff; font-weight: 700; margin: 0.25rem 0 0.75rem; }
          .venue-media { margin: 0.5rem auto 0.75rem; border-radius: 16px; overflow: hidden; border: 1px solid rgba(107,193,255,0.18); box-shadow: 0 14px 38px rgba(0,0,0,0.45); max-width: 100%; }
          .venue-img { display: block; width: 100%; height: auto; object-fit: cover; }
          .venue-actions { margin: 0.6rem auto 0.9rem; }
          .map-btn { display: inline-block; padding: 10px 16px; font-weight: 700; color: #eaf4ff; text-decoration: none; border-radius: 12px; border: 1px solid rgba(107,193,255,0.35); background: linear-gradient(135deg, rgba(13,42,77,0.95), rgba(11,74,122,0.95)); box-shadow: 0 8px 24px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04); transition: transform 160ms ease, filter 160ms ease, background 160ms ease; }
          .map-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
          .map-btn:active { transform: translateY(0); filter: brightness(0.98); }
          .map-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px #0b4a7a, 0 0 0 4px rgba(107,193,255,0.55); }
          .venue-copy { color: #dfe5ff; line-height: 1.7; font-size: clamp(0.98rem, 2.2vw, 1.06rem); max-width: 70ch; margin: 0.5rem auto 1rem; }
          .venue-travel { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; text-align: left; }
          .travel-block { background: rgba(10,12,18,0.5); border: 1px solid rgba(107,193,255,0.18); border-radius: 14px; padding: 1rem; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color: #e9e9ef; }
          .travel-block h2 { margin: 0 0 0.35rem; font-size: clamp(1.05rem, 2.6vw, 1.25rem); color: #fff; }
          .travel-block p { margin: 0; color: #dfe5ff; line-height: 1.6; }
          @media (max-width: 800px) { .venue-travel { grid-template-columns: 1fr; } }
          /* Desktop-only: make the image container smaller so it doesn't span the entire content width */
          @media (min-width: 1024px) { .venue-media { max-width: 70%; } }
        `}</style>
      </section>
    </main>
  )
}

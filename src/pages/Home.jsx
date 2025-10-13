import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Galaxy from '../components/Galaxy.jsx'

export default function Home({ playHeroAnim = false }) {
  // Refs for animating hero texts
  const headlineRef = useRef(null);
  const subheadRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  // Play a tasteful appear animation only on first visit/mount
  useLayoutEffect(() => {
    try {
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const onceKey = 'eridanus:home-hero-animated:v1';
      if (!playHeroAnim || reduceMotion || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(onceKey))) return;
      const ctx = gsap.context(() => {
        const h = headlineRef.current;
        const s = subheadRef.current;
        const d = dateRef.current;
        const t = timeRef.current;
        if (!h || !s || !d || !t) return;
        gsap.set([h, s, d, t], { autoAlpha: 0, y: 12 });
        gsap.set(h, { y: 16, scale: 0.985, filter: 'blur(2px)' });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        // Start immediately when intro signals completion; slow, graceful timings
        tl.to(h, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 })
          .to(s, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.45')
          .to(d, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.2')
          // Soft glow "breath" on the date as it lands
          .to(d, { '--dateGlow': 0.5, duration: 0.7, ease: 'sine.inOut', repeat: 1, yoyo: true }, '-=0.25')
          // Delay the time by an additional 150ms after the date breath finishes
          .to(t, { autoAlpha: 1, y: 0, duration: 0.7 }, '+=0.15');
      });
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(onceKey, '1');
      return () => ctx.revert();
    } catch {
      // no-op if sessionStorage or matchMedia unavailable
    }
  }, [playHeroAnim]);
  return (
    <main className="hero hero-min" aria-label="ERIDANUS 2025 Home">
      {/* Absolute galaxy background within the hero area */}
      <div className="galaxy-bg" aria-hidden>
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.5}
          glowIntensity={0.4}
          saturation={0.0}
          hueShift={0}
          rotationSpeed={0.04}
          twinkleIntensity={0.35}
          transparent={false}
        />
      </div>
      {/* Minimal overlay content */}
  <section className="overlay home-overlay" style={{ padding: '12px 10px' }}>
  <h1 ref={headlineRef} className="headline" style={{ marginTop: 8 }}>ERIDANUS 2025</h1>
  <p ref={subheadRef} className="subhead">Organized by Nitte Institute of Professional Education, Padil 
    (NIPE)</p>

        {/* Minimal date/time section (outer box removed) */}
        <div className="event-datetime" role="group" aria-label="Event schedule">
          <div ref={dateRef} className="event-date-large">November 2, 2025</div>
          <div ref={timeRef} className="event-time-small">9:00 AM – 4:30 PM</div>
          {/* If you prefer a range style like the reference: replace the date above with:
              October 7 – October 8, 2025 */}
        </div>
        {/* Page-scoped styles for the event card */}
        <style>{`
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          /* Larger, responsive hero heading and centered subhead */
          .headline { font-size: clamp(2.4rem, 8.5vw, 4.8rem); line-height: 1.05; letter-spacing: -0.02em; font-weight: 700; text-align: center; color: #fff; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          .subhead { margin-top: 0.25rem; font-size: clamp(1rem, 2.8vw, 1.25rem); color: #a8b4ff; text-align: center; }
          /* Minimal date/time styles */
          .event-datetime { margin: 1.2rem auto 0; text-align: center; width: min(92vw, 1000px); animation: fadeUp 650ms ease-out both; }
          .event-date-large { font-size: clamp(1.6rem, 6.2vw, 3.2rem); font-weight: 700; color: #fff; letter-spacing: -0.01em; --dateGlow: 0.25; text-shadow: 0 4px 24px rgba(118,143,255,var(--dateGlow)); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          .event-time-small { margin-top: 0.25rem; font-size: clamp(1rem, 3.2vw, 1.25rem); color: #cfd3ff; font-weight: 600; }
          /* Center the overlay content and card on small screens */
          .home-overlay { max-width: 1200px; margin: 0 auto; }
          @media (max-width: 640px) {
            .home-overlay { display: flex; flex-direction: column; align-items: center; text-align: center; }
            .event-datetime { width: min(94vw, 680px); }
          }
          @keyframes fadeUp { from { opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        `}</style>
      </section>
    </main>
  )
}

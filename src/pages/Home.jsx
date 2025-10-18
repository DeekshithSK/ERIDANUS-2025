import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import CountUp from '../components/CountUp.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'

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
  // Land the headline at baseline (y:0); the whole block is shifted via CSS on .hero-head-offset
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
    {/* Minimal overlay content */}
  <section className="overlay home-overlay" style={{ padding: '6px 10px' }}>
  <div className="hero-head hero-head-offset">
    <h1 ref={headlineRef} className="headline" style={{ marginTop: 0 }}>ERIDANUS 2025</h1>
    <p ref={subheadRef} className="subhead">Organized by Nitte Institute of Professional Education, Padil 
      <br />
      <span className="subhead-assoc">In Association with The Directorate of Research,<br /> Nitte DU</span></p>
  </div>
        <div className="event-datetime" role="group" aria-label="Event schedule">
          <div ref={dateRef} className="event-date-large">November 4, 2025</div>
          <div ref={timeRef} className="event-time-small">9:00 AM – 4:30 PM</div>
          {/* If you prefer a range style like the reference: replace the date above with:
              October 7 – October 8, 2025 */}
        </div>
        {/* Minimal stats below date/time */}
        <section className="stats" role="group" aria-label="Event stats">
          <div className="stat">
            <div className="stat-value"><CountUp to={81} duration={1.1} /></div>
            <div className="stat-label">Teams Registered</div>
          </div>
          <div className="stat">
            <div className="stat-value"><CountUp to={100} duration={1.2} /></div>
            <div className="stat-label">Participants Confirmed</div>
          </div>
          <div className="stat">
            <div className="stat-value"><CountUp to={16} duration={1.15} /></div>
            <div className="stat-label">Days Until Registration Closes</div>
          </div>
        </section>

        {/* Large spacer to force scroll before description */}
        <div className="home-spacer" aria-hidden></div>
        {/* ScrollReveal conference description */}
  <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '8vh' }}>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            textClassName="text-[#dfe5ff]"
          >
            ERIDANUS 2025 is a premier interdisciplinary conference designed to break down academic silos and foster collaboration. Our mission is to unite bright minds from technology, business, and sustainability to address complex global challenges. We aim to create a dynamic platform for sharing groundbreaking research, innovative business models, and sustainable practices that will shape a better tomorrow.
          </ScrollReveal>
        </div>

        {/* Page-scoped styles for the event card and stats */}
        <style>{`
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          /* Larger, responsive hero heading and centered subhead */
          .headline { font-size: clamp(2.4rem, 8.5vw, 4.8rem); line-height: 1.05; letter-spacing: -0.02em; font-weight: 700; text-align: center; color: #fff; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          /* Move the title + organizer/association block lower without reflowing siblings */
          .hero-head-offset { transform: translateY(28px); }
          .subhead { margin-top: 0.05rem; font-size: clamp(1rem, 2.8vw, 1.25rem); color: #a8b4ff; text-align: center; }
            .subhead .subhead-assoc { display: inline-block; color: #fff; font-size: clamp(1.05rem, 3.2vw, 1.35rem); margin-top: 25px; }
          /* Center the hero headline and subhead vertically with reduced spacing */
          .hero-head { min-height: 50svh; padding-top: 2vh; display: grid; place-items: center; gap: 0.2rem; }
          @media (max-width: 640px) { .hero-head { min-height: 56svh; padding-top: 4vh; } }
          /* Minimal date/time styles */
          .event-datetime { margin: 0.45rem auto 0; text-align: center; width: 100%; max-width: 1000px; animation: fadeUp 650ms ease-out both; }
          .event-date-large { font-size: clamp(1.6rem, 6.2vw, 3.2rem); font-weight: 700; color: #fff; letter-spacing: -0.01em; --dateGlow: 0.25; text-shadow: 0 4px 24px rgba(118,143,255,var(--dateGlow)); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          .event-time-small { margin-top: 0.25rem; font-size: clamp(1rem, 3.2vw, 1.25rem); color: #cfd3ff; font-weight: 600; }
          /* Minimal stats grid */
          .stats { margin: 1rem auto 0; width: 100%; max-width: 1000px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(10px, 2.2vw, 22px); align-items: start; text-align: center; }
          .stat-value { font-size: clamp(1.6rem, 6.5vw, 2.8rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; }
          .stat-label { margin-top: 4px; font-size: clamp(0.8rem, 2.4vw, 0.95rem); text-transform: none; letter-spacing: 0.04em; color: #a8b4ff; }
          /* Center the overlay content and card on small screens */
          .home-overlay { max-width: 1200px; width: 100%; margin: 0 auto; padding-left: 16px; padding-right: 16px; }
          @media (max-width: 640px) {
            .home-overlay { display: flex; flex-direction: column; align-items: center; text-align: center; padding-left: calc(16px + env(safe-area-inset-left, 0px)); padding-right: calc(16px + env(safe-area-inset-right, 0px)); }
            .event-datetime { width: 100%; max-width: 680px; }
            .stats { grid-template-columns: 1fr 1fr; }
            .stats .stat:last-child { grid-column: span 2; }
          }
          /* Force scroll before description appears */
          .home-spacer { height: 28vh; }
          @media (max-width: 640px) { .home-spacer { height: 56vh; } }
          @keyframes fadeUp { from { opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        `}</style>
      </section>
    </main>
  )
}

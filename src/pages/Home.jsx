import React, { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import CountUp from '../components/CountUp.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
// CardSwap removed from Home page
// Logo asset: imported as URL by Vite
import logoUrl from '../../eridanus.svg'

export default function Home({ playHeroAnim = false }) {
  // Refs for animating hero texts
  const headlineRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  // Days until registration closes (auto-updating)
  const [daysLeft, setDaysLeft] = useState(() => {
    const now = new Date();
    const close = new Date(2025, 9, 30, 23, 59, 59); // Oct is month 9 (0-indexed)
    const diff = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  });

  useEffect(() => {
    // Update roughly every hour to keep the countdown fresh without excess work
    const interval = setInterval(() => {
      const now = new Date();
      const close = new Date(2025, 9, 30, 23, 59, 59);
      const diff = Math.ceil((close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diff));
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Play a tasteful appear animation only on first visit/mount
  useLayoutEffect(() => {
    try {
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const onceKey = 'eridanus:home-hero-animated:v1';
      if (!playHeroAnim || reduceMotion || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(onceKey))) return;
      const ctx = gsap.context(() => {
        const h = headlineRef.current;
        const d = dateRef.current;
        const t = timeRef.current;
        if (!h || !d || !t) return;
        gsap.set([h, d, t], { autoAlpha: 0, y: 12 });
        gsap.set(h, { y: 16, scale: 0.985, filter: 'blur(2px)' });
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  // Start immediately when intro signals completion; slow, graceful timings
  // Land the headline at baseline (y:0); the whole block is shifted via CSS on .hero-head-offset
  tl.to(h, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 })
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

  // Removed events cards data (CardSwap section deleted)
  return (
    <main className="hero hero-min" aria-label="ERIDANUS 2025 Home">
    {/* Minimal overlay content */}
  <section className="overlay home-overlay" style={{ padding: '6px 10px' }}>
  <div className="hero-head hero-head-offset">
    {/* Replaced the visible text heading with the logo; keep an SR-only h1 for semantics */}
    <h1 className="sr-only">ERIDANUS 2025</h1>
    <img
      ref={headlineRef}
      className="headline logo"
      src={logoUrl}
      alt=""
      aria-hidden="true"
      role="presentation"
      style={{ marginTop: 0 }}
    />
    <p className="org-line">Organized by Nitte Institute of Professional Education, Padil</p>
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
            <div className="stat-value"><CountUp to={100} duration={1.2} /></div>
            <div className="stat-label">Participants Confirmed</div>
          </div>
          <div className="stat">
            <div className="stat-value"><CountUp to={daysLeft} duration={0.8} /></div>
            <div className="stat-label">Days Until Registration Closes</div>
          </div>
        </section>

        {/* Large spacer to force scroll before description */}
        <div className="home-spacer" aria-hidden></div>

        {/* Removed Events at ERIDANUS CardSwap section */}
        {/* ScrollReveal conference description */}
  <div className="desc-wrap">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            textClassName="text-[#dfe5ff]"
            containerClassName="sr-desc"
            fontSize="clamp(1rem, 4.2vw, 2rem)"
            lineHeight={1.5}
            fontWeight={400}
          >
            ERIDANUS 2025 is a premier interdisciplinary conference designed to break down academic silos and foster collaboration. Our mission is to unite bright minds from technology, business, and sustainability to address complex global challenges. We aim to create a dynamic platform for sharing groundbreaking research, innovative business models, and sustainable practices that will shape a better tomorrow.
          </ScrollReveal>
        </div>

        {/* Page-scoped styles for the event card and stats */}
        <style>{`
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          /* Larger, responsive hero heading */
          .headline { font-size: clamp(2.4rem, 8.5vw, 4.8rem); line-height: 1.05; letter-spacing: -0.02em; font-weight: 700; text-align: center; color: #fff; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; position: relative; top: 36px; }
          /* Logo sizing/placement (when using the headline slot as an image) */
          .headline.logo { display: block; width: clamp(200px, 46vw, 560px); height: auto; margin-left: auto; margin-right: auto; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.25)); }
          /* Raise organizer line without shifting the logo */
          .org-line { margin-top: 8px; font-size: clamp(1rem, 3.2vw, 1.2rem); color: #cbd3ff; text-align: center; transform: translateY(-26px); }
          /* Move the title + organizer/association block lower without reflowing siblings */
          .hero-head-offset { transform: translateY(48px); }
          /* Center the hero headline and subhead vertically with tighter spacing */
          .hero-head { min-height: 44svh; padding-top: 1.5vh; display: grid; place-items: center; gap: 0.15rem; }
          @media (max-width: 640px) {
            .hero-head { min-height: 46svh; padding-top: 2vh; }
            /* Slightly less offset on smaller screens to balance vertical space */
            .hero-head-offset { transform: translateY(28px); }
            /* Mobile type tweaks */
            .headline { font-size: clamp(2rem, 8.8vw, 3rem); line-height: 1.08; top: 92px; }
            /* Bigger logo on mobile with comfortable max */
            .headline.logo { width: clamp(220px, 82vw, 520px); }
            /* Slightly adjust organizer line to sit closer to the larger logo */
            .org-line { margin-top: 6px; font-size: clamp(0.95rem, 3.4vw, 1.1rem); transform: translateY(-34px); max-width: 90%; margin-left: auto; margin-right: auto; }
          }
          /* Minimal date/time styles */
          .event-datetime { margin: 1.25rem auto 0; text-align: center; width: 100%; max-width: 1000px; animation: fadeUp 650ms ease-out both; }
          .event-date-large { font-size: clamp(1.6rem, 6.2vw, 3.2rem); font-weight: 700; color: #fff; letter-spacing: -0.01em; --dateGlow: 0.25; text-shadow: 0 4px 24px rgba(118,143,255,var(--dateGlow)); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
          .event-time-small { margin-top: 0.15rem; font-size: clamp(1rem, 3.2vw, 1.25rem); color: #cfd3ff; font-weight: 600; }
          @media (max-width: 640px) { .event-datetime { margin-top: 1.2rem; } }
          /* Minimal stats grid */
          .stats { margin: 0.6rem auto 0; width: 100%; max-width: 1000px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2.2vw, 22px); align-items: start; text-align: center; }
          .stat-value { font-size: clamp(1.6rem, 6.5vw, 2.8rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; }
          .stat-label { margin-top: 4px; font-size: clamp(0.8rem, 2.4vw, 0.95rem); text-transform: none; letter-spacing: 0.04em; color: #a8b4ff; }
          /* Center the overlay content and card on small screens */
          .home-overlay { max-width: 1200px; width: 100%; margin: 0 auto; padding-left: 16px; padding-right: 16px; }
          .desc-wrap { max-width: 1000px; margin: 0 auto; padding: 0 0 10vh; }
          @media (max-width: 640px) {
            .home-overlay { display: flex; flex-direction: column; align-items: center; text-align: center; padding-left: calc(16px + env(safe-area-inset-left, 0px)); padding-right: calc(16px + env(safe-area-inset-right, 0px)); }
            .desc-wrap { padding-left: 14px; padding-right: 14px; padding-bottom: calc(18vh + env(safe-area-inset-bottom, 0px)); }
            .event-datetime { width: 100%; max-width: 680px; }
            .stats { grid-template-columns: 1fr 1fr; }
          }
          /* Force scroll before description appears */
          .home-spacer { height: 24vh; }
          @media (max-width: 640px) { .home-spacer { height: 40vh; } }
          @keyframes fadeUp { from { opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }

          /* CardSwap section removed */
        `}</style>
      </section>
    </main>
  )
}

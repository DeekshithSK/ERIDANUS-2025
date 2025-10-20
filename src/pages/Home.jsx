import React, { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import CountUp from '../components/CountUp.jsx'
import { useNavigate } from 'react-router-dom'
import imgInPerson from '../../in person abstract presentation.jpg'
import imgOnline from '../../online abstract presentation.jpg'
import imgPoster from '../../poster presentation.jpg'
// CardSwap removed from Home page

export default function Home({ playHeroAnim = false }) {
  // Refs for animating hero texts
  const headlineRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const descRef = useRef(null);
  const carouselRef = useRef(null);
  const stageRef = useRef(null);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [frontIdx, setFrontIdx] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const homeCards = [
    { key: 'angetenar', name: 'Angetenar', subtitle: 'Poster Presentation', image: imgPoster, eligibility: 'UG & PU students', team: 'Max 2 members', extraLabel: 'Poster Size', extraValue: '18inc × 24inc (portrait)', price: '₹260' },
    { key: 'zaurak', name: 'Zaurak', subtitle: 'Online Abstract Presentation', image: imgOnline, eligibility: 'UG, PG, Researchers', team: 'Max 2 members', extraLabel: 'Duration', extraValue: '10 mins + 5 mins Q&A', price: '₹200' },
    { key: 'beid', name: 'Beid', subtitle: 'In-Person Abstract Presentation', image: imgInPerson, eligibility: 'UG, PG, Researchers', team: 'Max 2 members', extraLabel: 'Duration', extraValue: '12 mins + 3 mins Q&A', price: '₹350' }
  ];
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

  // Mobile-first description reveal using IntersectionObserver
  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = descRef.current;
    if (!el) return;
    if (reduceMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
      return;
    }
    const onIntersect = (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.classList.add('desc-in');
          obs.disconnect();
          break;
        }
      }
    };
    const obs = new IntersectionObserver(onIntersect, { root: null, threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onIntersect = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setCarouselVisible(true);
          if (!reduceMotion) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => setFrontIdx((i) => (i + 1) % 3), 3200);
          } else {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
          }
        } else {
          setCarouselVisible(false);
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        }
      }
    };
    const obs = new IntersectionObserver(onIntersect, { root: null, threshold: 0.15 });
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, []);

  // Dynamically size the rotator stage to the active card height (better on mobile)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const active = stage.querySelector('.kr-card.is-active .ev-card');
      if (active) {
        const h = active.offsetHeight;
        if (h && Number.isFinite(h)) stage.style.height = h + 'px';
      }
    };

    // measure on next frame to allow layout to settle
    const raf = requestAnimationFrame(measure);
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener('resize', onResize);

    // also measure when images finish loading
    const imgs = stage.querySelectorAll('img');
    const listeners = [];
    imgs.forEach(img => {
      const handler = () => measure();
      img.addEventListener('load', handler, { once: true });
      listeners.push([img, handler]);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      listeners.forEach(([img, h]) => img.removeEventListener('load', h));
    };
  }, [frontIdx, carouselVisible]);

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
    {/* Visible, accessible wordmark heading */}
    <h1 ref={headlineRef} className="headline wordmark" aria-label="ERIDANUS 2025">
      <span className="wm-eridanus" aria-hidden="true">ERIDANUS</span>
      <span className="wm-year" aria-hidden="true">2025</span>
    </h1>
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

        {/* Large spacer to force scroll before cards */}
        <div className="home-spacer" aria-hidden></div>

        {/* Event preview cards (appear on scroll) */}
        <section
          ref={carouselRef}
          className={`kr-wrap ${carouselVisible ? 'is-visible' : ''}`}
          aria-roledescription="carousel"
          aria-label="ERIDANUS Events preview"
        >
          <div ref={stageRef} className="kr-stage">
            {homeCards.map((c, i) => (
              <a
                key={c.key}
                className={`kr-card ${frontIdx === i ? 'is-active' : ''}`}
                href="/events"
                onClick={(e) => { e.preventDefault(); navigate('/events'); }}
                aria-label={`${c.name} — go to Events`}
              >
                <article className="ev-card" aria-labelledby={`home-${c.key}-title`}>
                  <figure className="ev-hero">
                    <img src={c.image} alt={`${c.subtitle} banner`} loading="lazy" />
                  </figure>
                  <header className="ev-header">
                    <h2 id={`home-${c.key}-title`} className="ev-title">{c.name}</h2>
                    <p className="ev-subtitle">{c.subtitle}</p>
                  </header>
                  <ul className="ev-meta" role="list">
                    <li className="ev-meta-row">
                      <span className="ev-meta-icon" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c-1.657 0-3-1.567-3-3.5S10.343 7 12 7s3 1.567 3 3.5S13.657 14 12 14z" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c.5-3 3.5-5 7-5s6.5 2 7 5" stroke="currentColor" strokeWidth="1.6"/></svg>
                      </span>
                      <span className="ev-meta-text"><strong>Eligibility:</strong> {c.eligibility}</span>
                    </li>
                    <li className="ev-meta-row">
                      <span className="ev-meta-icon" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 8a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0zM5 16h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                      </span>
                      <span className="ev-meta-text"><strong>Team Size:</strong> {c.team}</span>
                    </li>
                    <li className="ev-meta-row">
                      <span className="ev-meta-icon" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="ev-meta-text"><strong>{c.extraLabel}:</strong> {c.extraValue}</span>
                    </li>
                  </ul>
                  <div className="ev-price">
                    <div className="ev-price-box">
                      <div className="ev-price-value">{c.price}</div>
                      <div className="ev-price-sub">per team</div>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </section>

        {/* Description block (ScrollReveal removed) */}
        <div className="desc-wrap">
          <p ref={descRef} className="home-desc">
            ERIDANUS 2025, the Student Research Congress, is dedicated to fostering interdisciplinary research and driving innovation across technology, finance, and healthcare. This congress bridges the gap between business, fintech, and sustainability, showcasing how technologies like AI, big data, and cloud computing are driving transformative change towards a cleaner, greener future. Participants are provided the opportunity to present their research ideas in the form of posters and abstracts. Poster presentations are to be made in-person, while abstract presentations are conducted at a hybrid mode. By emphasizing ethical AI and cybersecurity and encouraging exploration of new digital ecosystems, the congress empowers inclusive solutions for smart cities and global sustainability.
          </p>
        </div>

        {/* Page-scoped styles for the event card and stats */}
        <style>{`
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
          /* Larger, responsive hero heading */
          .headline { line-height: 1.05; letter-spacing: -0.02em; font-weight: 800; text-align: center; color: #fff; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; position: relative; top: 36px; margin: 10px 0 6px; }
          /* Wordmark styling */
          .headline.wordmark { display: grid; place-items: center; gap: 0.2rem; }
          .headline.wordmark .wm-eridanus { display: block; font-size: clamp(2.4rem, 9vw, 5.2rem); letter-spacing: 0.02em; font-weight: 800; background: linear-gradient(180deg, #fff, #e6e6ff 55%, #9cc3ff); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 4px 26px rgba(118,143,255,0.28)); position: relative; }
          .headline.wordmark .wm-eridanus::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: -0.25em; width: 68%; height: 2px; background: radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.6), rgba(255,255,255,0)); opacity: 0.8; filter: blur(0.6px); }
          .headline.wordmark .wm-year { display: inline-block; font-size: clamp(1.1rem, 3.4vw, 1.6rem); letter-spacing: 0.38em; font-weight: 700; color: #dfe5ff; text-transform: uppercase; opacity: 0.95; }
          /* Soft glow pulse for the wordmark */
          @keyframes wmGlow { 0% { text-shadow: 0 0 0 rgba(118,143,255,0.0); } 50% { text-shadow: 0 6px 28px rgba(118,143,255,0.35); } 100% { text-shadow: 0 0 0 rgba(118,143,255,0.0); } }
          .headline.wordmark .wm-eridanus { animation: wmGlow 6s ease-in-out infinite; }
          /* Raise organizer line without shifting the logo */
          .org-line { margin-top: 8px; font-size: clamp(1rem, 3.2vw, 1.2rem); color: #cbd3ff; text-align: center; transform: translateY(-26px); }
          /* Move the title + organizer/association block lower without reflowing siblings */
          .hero-head-offset { transform: translateY(48px); }
          /* Center the hero headline and subhead vertically with tighter spacing */
          .hero-head { min-height: 44svh; padding-top: 1.5vh; display: grid; place-items: center; gap: 0.15rem; }
          @media (max-width: 640px) {
            .hero-head { min-height: 48svh; padding-top: 3vh; }
            /* Slightly less offset on smaller screens to balance vertical space */
            .hero-head-offset { transform: translateY(22px); }
            /* Mobile type tweaks */
            .headline { line-height: 1.08; top: 92px; }
            .headline.wordmark .wm-eridanus { font-size: clamp(2.2rem, 14vw, 3.6rem); }
            .headline.wordmark .wm-year { font-size: clamp(1rem, 4vw, 1.2rem); letter-spacing: 0.32em; }
            /* Push organizer line down to avoid overlap with relatively-positioned heading */
            .org-line { margin-top: 14px; font-size: clamp(0.95rem, 3.4vw, 1.1rem); transform: translateY(0); max-width: 90%; margin-left: auto; margin-right: auto; line-height: 1.35; }
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
          .home-overlay { max-width: 1200px; width: 100%; margin: 0 auto; padding-left: 16px; padding-right: 16px; display: block; }
          .desc-wrap { max-width: 1000px; margin: 0 auto; padding: 0 0 10vh; }
          .home-desc { color: #dfe5ff; font-size: clamp(1rem, 4.2vw, 2rem); line-height: 1.5; font-weight: 400; margin: 0; opacity: 0; transform: translateY(10px); filter: blur(4px); }
          .home-desc.desc-in { opacity: 1; transform: translateY(0); filter: blur(0); transition: opacity 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1), filter 520ms ease; }

          /* Flat Ken Burns card rotator */
          .kr-wrap { position: relative; width: 100%; max-width: clamp(340px, 92vw, 420px); margin: clamp(18px, 6vw, 40px) auto 0; padding: 0 6px; opacity: 0; transform: translateY(14px); filter: blur(8px); transition: opacity 520ms ease, transform 520ms ease, filter 520ms ease; }
          .kr-wrap.is-visible { opacity: 1; transform: none; filter: none; }
          .kr-stage { position: relative; width: 100%; min-height: 520px; overflow: visible; }
          .kr-card { position: absolute; inset: 0; display: block; width: 100%; height: 100%; padding: 0; margin: 0; cursor: pointer; pointer-events: none; opacity: 0; transform: scale(0.98) translateY(6px); transition: opacity 520ms ease, transform 520ms cubic-bezier(0.22,1,0.36,1); text-decoration: none; color: inherit; }
          .kr-card.is-active { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
          .kr-card img { transform-origin: center; filter: saturate(1.05) contrast(1.02); }
          .kr-card.is-active .ev-hero img { animation: kenBurns 9s ease-in-out infinite alternate; }
          @keyframes kenBurns { 0% { transform: scale(1.02) translate3d(0, 0, 0); } 100% { transform: scale(1.08) translate3d(0, -6px, 0); } }
          /* Event card styling (scoped for Home rotator) */
          .kr-stage .ev-card { position: relative; display: flex; flex-direction: column; gap: 0.75rem; width: 100%; box-sizing: border-box; background: rgba(10,12,18,0.55); border: 1px solid rgba(107,193,255,0.12); border-radius: 18px; padding: 1.1rem; color: #e9e9ef; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 14px 38px rgba(0,0,0,0.45); }
          .kr-stage .ev-hero { margin: -0.1rem 0 0.35rem; position: relative; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 24px rgba(0,0,0,0.25); }
          .kr-stage .ev-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.08)); pointer-events: none; }
          .kr-stage .ev-hero img { display: block; width: 100%; height: 180px; object-fit: cover; object-position: center; }
          .kr-stage .ev-header { text-align: left; }
          .kr-stage .ev-title { font-weight: 800; color: #fff; font-size: clamp(1.25rem, 2.6vw, 1.6rem); margin: 0.25rem 0 0; }
          .kr-stage .ev-subtitle { color: #cfd3ff; font-weight: 700; margin: 0; }
          .kr-stage .ev-meta { list-style: none; margin: 0.25rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
          .kr-stage .ev-meta-row { display: grid; grid-template-columns: 20px 1fr; gap: 0.5rem; align-items: start; color: #dfe5ff; }
          .kr-stage .ev-meta-icon { color: #9fb5ff; display: inline-flex; align-items: center; justify-content: center; margin-top: 0.1rem; }
          .kr-stage .ev-meta-text { line-height: 1.5; font-size: 0.98rem; }
          .kr-stage .ev-price { margin-top: 0.35rem; }
          .kr-stage .ev-price-box { display: grid; place-items: center; background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 0.85rem; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), 0 10px 24px rgba(0,0,0,0.25); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
          .kr-stage .ev-price-value { font-size: 1.8rem; font-weight: 700; color: #fff; text-shadow: 0 2px 14px rgba(118,143,255,0.25); }
          .kr-stage .ev-price-sub { font-size: 0.95rem; color: #c9d2ff; opacity: 0.9; }
          @media (max-width: 640px) {
            .kr-wrap { width: 100%; flex: 0 1 100%; align-self: stretch; max-width: min(640px, 92vw); padding-left: calc(12px + env(safe-area-inset-left, 0px)); padding-right: calc(12px + env(safe-area-inset-right, 0px)); padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px)); }
            .kr-stage { min-height: 480px; }
            .kr-card { border-radius: 16px; }
            .kr-stage .ev-hero img { height: 180px; }
            .kr-stage .ev-card { padding: 0.9rem; }
            .kr-stage .ev-title { font-size: clamp(1rem, 4vw, 1.25rem); }
            .kr-stage .ev-subtitle { font-size: 0.98rem; }
            .kr-stage .ev-meta { gap: 0.4rem; }
            .kr-stage .ev-meta-row { grid-template-columns: 18px 1fr; gap: 0.45rem; }
            .kr-stage .ev-meta-text { font-size: 0.92rem; line-height: 1.4; }
            .kr-stage .ev-price-box { padding: 0.75rem; }
            .kr-stage .ev-price-value { font-size: 1.5rem; }
          }
          @media (prefers-reduced-motion: reduce) {
            .kr-card, .kr-card.is-active { transition: none !important; transform: none !important; opacity: 1 !important; }
            .kr-card img, .kr-card.is-active img { animation: none !important; }
          }
          @media (max-width: 640px) {
            .home-overlay { display: flex; flex-direction: column; align-items: center; text-align: center; padding-left: calc(16px + env(safe-area-inset-left, 0px)); padding-right: calc(16px + env(safe-area-inset-right, 0px)); }
            .desc-wrap { padding-left: 14px; padding-right: 14px; padding-bottom: calc(18vh + env(safe-area-inset-bottom, 0px)); }
            .event-datetime { width: 100%; max-width: 680px; }
            .stats { grid-template-columns: 1fr 1fr; }
          }
          /* Force scroll before description appears */
          .home-spacer { height: 18vh; }
          @media (max-width: 640px) { .home-spacer { height: 22vh; } }
          @keyframes fadeUp { from { opacity: 0; transform: translate3d(0, 8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }

          /* CardSwap section removed */
        `}</style>
      </section>
    </main>
  )
}

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const schedule = [
  { time: '09:30 – 09:50 AM', title: 'Formal Event', desc: 'An elegant gathering characterized by a formal agenda and sophisticated decorum.' },
  { time: '09:50 – 10:00 AM', title: 'Inaugural Session', desc: 'Inaugural session featuring keynote speeches and opening remarks.' },
  { time: '10:00 AM – 12:30 PM', title: 'Abstract Presentations — Session 1', desc: 'Concurrent sessions covering diverse research areas.' },
  { time: '11:00 AM – 12:00 PM', title: 'Poster Presentation', desc: 'Interactive poster session with expert evaluation and peer networking.' },
  { time: '12:30 – 1:00 PM', title: 'Abstract Presentations — Session 2', desc: 'Concurrent sessions covering diverse research areas.' },
  { time: '2:00 – 3:30 PM', title: 'Lunch', desc: 'Networking lunch with opportunities for informal discussions.' },
  { time: '4:00 – 4:30 PM', title: 'Panel Discussion', desc: 'Interactive session with experts on interdisciplinary research and innovation.' },
  { time: '4:00 – 4:30 PM', title: 'Valedictory & Award Ceremony', desc: 'Closing ceremony with recognition of outstanding presentations and achievements.' },
]

export default function Program() {
  const titleRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { autoAlpha: 0, y: 16 })
        gsap.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      }
      // Make sure all items are visible immediately (no scroll-triggered animations)
      if (trackRef.current) {
        const items = trackRef.current.querySelectorAll('.tl-item')
        gsap.set(items, { autoAlpha: 1, y: 0 })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
  <main className="hero hero-min program-hero" aria-label="Program Timeline">
      <section className="overlay program-overlay" style={{ padding: '16px 12px' }}>
        <h1 ref={titleRef} className="program-title">Program Timeline</h1>
        <div ref={trackRef} className="timeline">
          {schedule.map((s) => (
            <div className="tl-item" key={s.title}>
              <div className="tl-dot" aria-hidden />
              <div className="tl-card">
                <div className="tl-title">{s.title}</div>
                <div className="tl-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          /* On this page we prefer normal block flow for reliable scrolling */
          .program-hero { display: block; min-height: unset; overflow: visible; height: auto; }
          .program-overlay { max-width: 1000px; margin: 0 auto; padding-bottom: 64px; }
          .program-title { font-size: clamp(1.6rem, 4.6vw, 2.6rem); font-weight: 700; color: #fff; text-align: center; margin-bottom: 1rem; }
          .timeline { position: relative; margin: 0.5rem auto 0; display: grid; gap: 1rem; }
          .tl-item { position: relative; display: grid; grid-template-columns: 22px 1fr; align-items: start; gap: 0.75rem; }
          .tl-dot { position: relative; height: 18px; width: 18px; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #a5b6ff, #6bc1ff 60%, rgba(107,193,255,0.2) 100%); box-shadow: 0 0 24px rgba(107,193,255,0.55); margin-top: 0.35rem; }
          .tl-card { position: relative; background: rgba(10,12,18,0.45); border: 1px solid rgba(107,193,255,0.18); border-radius: 14px; padding: 0.9rem 1rem; color: #e9e9ef; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .tl-card::before { content: ""; position: absolute; inset: -1px; border-radius: 14px; pointer-events: none; background: radial-gradient(120% 60% at 10% 0%, rgba(118,143,255,0.18), rgba(118,143,255,0) 40%); mask: linear-gradient(#000, #000) padding-box, linear-gradient(#000, #000); -webkit-mask-composite: xor; mask-composite: exclude; }
          .tl-title { font-weight: 700; color: #fff; margin-bottom: 0.25rem; font-size: clamp(1rem, 2.6vw, 1.2rem); }
          .tl-desc { color: #dfe5ff; line-height: 1.6; font-size: clamp(0.9rem, 2.2vw, 1.02rem); }
          .timeline::after { content: ""; position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, rgba(107,193,255,0), rgba(107,193,255,0.35) 20%, rgba(107,193,255,0.35) 80%, rgba(107,193,255,0)); filter: blur(0.2px); }
          @media (max-width: 640px) {
            .tl-item { grid-template-columns: 18px 1fr; gap: 0.65rem; }
            .timeline::after { left: 9px; }
          }
        `}</style>
      </section>
    </main>
  )
}

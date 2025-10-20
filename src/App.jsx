import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Program from './pages/Program.jsx'
import Events from './pages/Events.jsx'
import Venue from './pages/Venue.jsx'
import Resources from './pages/Resources.jsx'
import Contact from './pages/Contact.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import MenuOverlay from './components/MenuOverlay.jsx'
import Galaxy from './components/Galaxy.jsx'
import logoUrl from '../eridanus.svg'
import Lenis from 'lenis'

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const location = useLocation()
  const lenisRef = useRef(null)

  // Initialize Lenis once for cross-device smooth/resistant scrolling
  useEffect(() => {
    try {
      const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const lenis = new Lenis({
        // Slightly longer easing for a gentle, resistant feel
        duration: 1.1,
        // Ensure both wheel and touch have smoothing; dampen touch a bit for resistance
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 0.9,
        // Keep default easing; internal raf loop will drive it
      })
      lenisRef.current = lenis

      let rafId
      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      // Pause/resume Lenis when menu opens/closes to avoid fighting body scroll lock
      const onMenuOpen = () => { try { lenis.stop() } catch {} }
      const onMenuClose = () => { try { lenis.start() } catch {} }
      document.addEventListener('eridanus:menu:open', onMenuOpen)
      document.addEventListener('eridanus:menu:close', onMenuClose)

      // Expose for debugging if needed
      try { window.__lenis = lenis } catch {}

      return () => {
        document.removeEventListener('eridanus:menu:open', onMenuOpen)
        document.removeEventListener('eridanus:menu:close', onMenuClose)
        if (rafId) cancelAnimationFrame(rafId)
        try { lenis.destroy() } catch {}
        lenisRef.current = null
      }
    } catch {}
  }, [])

  // Failsafe: on route changes, ensure body scroll is unlocked and reset scroll position
  useEffect(() => {
    try {
      const body = document.body
      body.style.overflow = ''
      body.style.touchAction = ''
    } catch {}
    // Ensure user starts at top of new route; prefer Lenis for consistent feel
    try {
      if (lenisRef.current) {
        // Give the route a tick to mount before scrolling
        setTimeout(() => {
          try { lenisRef.current.scrollTo(0, { duration: 0.8 }) } catch { window.scrollTo({ top: 0, behavior: 'auto' }) }
        }, 0)
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    } catch {}
  }, [location.pathname])

  // Play intro only once per browser session
  useEffect(() => {
    try {
      const key = 'eridanus:intro:seen:v1'
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key) === '1') {
        setIntroDone(true)
      }
    } catch {}
  }, [])

  // While intro is playing, aggressively preload the headline logo so it's ready the moment Home mounts
  useEffect(() => {
    if (introDone) return
    try {
      // Add <link rel="preload" as="image"> to the document head
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = logoUrl
      // Hint a higher fetch priority where supported
      link.fetchPriority = 'high'
      document.head.appendChild(link)

      // Also instantiate an Image and decode it
      const img = new Image()
      // @ts-ignore: fetchPriority is supported in modern browsers
      img.fetchPriority = 'high'
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = logoUrl
      if (img.decode) {
        img.decode().catch(() => {})
      }

      return () => {
        // Keep the link to preserve the cache; remove if desired
      }
    } catch {}
  }, [introDone])
  return (
    <div className="app-root">
      {/* Global fixed galaxy background via portal to <body>, ensures true viewport-level layer */}
      {introDone && typeof document !== 'undefined' && createPortal(
        <div className="galaxy-wrap" aria-hidden>
          <Galaxy
            mouseRepulsion={false}
            mouseInteraction={false}
            density={0.5}
         glowIntensity={1}
            saturation={0.85}
            hueShift={120}
             warmBias={0.2}
             colorVariance={0.35}
             gamma={1.6}
            rotationSpeed={0.1}
            twinkleIntensity={0.45}
            transparent={false}
          />
        </div>,
        document.body
      )}
      {introDone ? (
        <div className="app-fade-in">
          <MenuOverlay />
          <Routes>
            <Route path="/" element={<Home playHeroAnim={introDone} />} />
            <Route path="/about" element={<About />} />
            <Route path="/program" element={<Program />} />
            <Route path="/events" element={<Events />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      ) : (
        <IntroOverlay onDone={() => {
          try {
            const key = 'eridanus:intro:seen:v1'
            if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, '1')
          } catch {}
          setIntroDone(true)
        }} />
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Program from './pages/Program.jsx'
import Events from './pages/Events.jsx'
import Venue from './pages/Venue.jsx'
import Resources from './pages/Resources.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import StaggeredMenu from './components/StaggeredMenu.jsx'

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const location = useLocation()

  // Failsafe: on route changes, ensure body scroll is unlocked and reset scroll position
  useEffect(() => {
    try {
      const body = document.body
      body.style.overflow = ''
      body.style.touchAction = ''
    } catch {}
    // Optional: ensure user starts at top of new route
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {}
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
  return (
    <div className="app-root">
      {introDone ? (
        <div className="app-fade-in">
          <StaggeredMenu
            position="right"
            colors={["#0b0e17", "#202838", "#6bc1ff"]}
            accentColor="#6bc1ff"
            displayItemNumbering={false}
          />
          <Routes>
            <Route path="/" element={<Home playHeroAnim={introDone} />} />
            <Route path="/about" element={<About />} />
            <Route path="/program" element={<Program />} />
            <Route path="/events" element={<Events />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/resources" element={<Resources />} />
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

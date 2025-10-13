import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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
        <IntroOverlay onDone={() => setIntroDone(true)} />
      )}
    </div>
  )
}

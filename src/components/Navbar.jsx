import React, { useState } from 'react'

const items = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Program', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Venue', href: '#' },
  { label: 'Resources', href: '#' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(v => !v)
  const close = () => setOpen(false)

  return (
    <header className="nav" onBlur={(e)=>{ if(!e.currentTarget.contains(e.relatedTarget)) close() }}>
      <div className="nav-inner">
        <a className="brand" href="#" aria-label="ERIDANUS 2025 Home" onClick={(e)=> e.preventDefault()}>
          <span className="logo" />
          <span className="title">ERIDANUS</span>
          <span className="year">2025</span>
        </a>
        <button className="hamburger" aria-label="Toggle menu" aria-expanded={open} aria-controls="primary-nav" onClick={toggle}>
          <span className="hamburger-box">
            <span className={`hamburger-inner ${open ? 'open' : ''}`}/>
          </span>
        </button>
        <nav id="primary-nav" className={`links mobile ${open ? 'open' : ''}`} aria-label="Primary">
          {items.map((it) => (
            <a key={it.label} className="link" href={it.href} onClick={(e)=> { e.preventDefault(); close() }}>
              {it.label}
            </a>
          ))}
        </nav>
        <nav className="links desktop" aria-label="Primary">
          {items.map((it) => (
            <a key={it.label} className="link" href={it.href} onClick={(e)=> e.preventDefault()}>
              {it.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

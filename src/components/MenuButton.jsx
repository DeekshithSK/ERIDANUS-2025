import React, { useEffect, useRef, useState } from 'react'

const items = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Program', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Venue', href: '#' },
  { label: 'Resources', href: '#' },
]

export default function MenuButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const toggle = () => setOpen(v => !v)
  const close = () => setOpen(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function handleClick(e){ if(ref.current && !ref.current.contains(e.target)) close() }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div ref={ref} className="menu-root">
      <button className="menu-btn" aria-haspopup="true" aria-expanded={open} aria-controls="menu-panel" onClick={toggle}>
        Menu
      </button>
      <div id="menu-panel" className={`menu-panel ${open ? 'open' : ''}`} role="menu" aria-label="Site Menu">
        {items.map(it => (
          <a key={it.label} className="menu-item" href={it.href} role="menuitem" onClick={(e)=> e.preventDefault()}>
            {it.label}
          </a>
        ))}
      </div>
    </div>
  )
}

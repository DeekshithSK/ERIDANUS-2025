import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import Lenis from 'lenis'

const container = document.getElementById('root')
const root = createRoot(container)
// Initialize smooth scrolling (Lenis)
let lenis;
let rafId;
const startLenis = () => {
  if (lenis) return;
  lenis = new Lenis({
    // Lower = more smoothing/resistance
    lerp: 0.065,
    smoothWheel: true,
    smoothTouch: true
  });
  const raf = (time) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
};

// Avoid double init in React StrictMode (dev)
if (typeof window !== 'undefined') {
  startLenis();
}

// Cleanup on hot-reload in dev
if (import.meta && import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (rafId) cancelAnimationFrame(rafId);
    lenis?.destroy?.();
    lenis = undefined;
  });
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

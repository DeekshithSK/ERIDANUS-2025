import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';

const defaultItems = [
  { label: 'Home', link: '/' },
  { label: 'About', link: '/about' },
  { label: 'Program', link: '/program' },
  { label: 'Events', link: '/events' },
  { label: 'Venue', link: '/venue' },
  { label: 'Resources', link: '/resources' },
  { label: 'Contact', link: '/contact' },
];

export default function MenuOverlay({ items = defaultItems }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const lockScroll = useCallback(() => {
    try {
      const body = document.body;
      const html = document.documentElement;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      body.dataset.menuPrevScroll = String(scrollY);
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      if (html) {
        html.style.overflow = 'hidden';
        html.style.height = '100%';
      }
    } catch {}
  }, []);

  const unlockScroll = useCallback(() => {
    try {
      const body = document.body;
      const html = document.documentElement;
      const prev = parseInt(body.dataset.menuPrevScroll || '0', 10) || 0;
      body.style.overflow = '';
      body.style.touchAction = '';
      if (html) {
        html.style.overflow = '';
        html.style.height = '';
      }
      window.scrollTo(0, prev);
      delete body.dataset.menuPrevScroll;
    } catch {}
  }, []);

  useEffect(() => {
    if (open) {
      lockScroll();
      try { document.dispatchEvent(new CustomEvent('eridanus:menu:open')) } catch {}
    } else {
      unlockScroll();
      try { document.dispatchEvent(new CustomEvent('eridanus:menu:close')) } catch {}
    }
    return () => unlockScroll();
  }, [open, lockScroll, unlockScroll]);

  const onItemClick = (e, link) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => navigate(link), 0);
  };

  return (
    <>
      {createPortal(
        <>
          <button
            className={`mo-toggle ${open ? 'is-open' : ''} ${!isHome ? 'variant-fab' : ''} ${isHome && open ? 'variant-fab-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
            type="button"
          >
            <span className="mo-bg" aria-hidden="true"></span>
            <span className="mo-glow" aria-hidden="true"></span>
            <span className="mo-shimmer" aria-hidden="true"></span>
            <span className="mo-ripple" aria-hidden="true"></span>
            <span className="mo-toggle-inner">
              <span className="mo-label-wrap" aria-hidden="true">
                <span className="mo-label-line menu">Menu</span>
                <span className="mo-label-line close">Close</span>
              </span>
              <span className="mo-icon" aria-hidden="true">
                <span className="mo-line h"></span>
                <span className="mo-line v"></span>
              </span>
            </span>
          </button>
          <aside
            className={`mo-panel ${open ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
          >
            <div className="mo-vfx" aria-hidden="true" />
            <div className="mo-panel-inner">
              <ul className="mo-list" role="list">
                {items.map((it, idx) => (
                  <li key={it.label + idx} className="mo-itemWrap" style={{ ['--d']: `${idx * 70}ms` }}>
                    <a href={it.link} className="mo-item" onClick={(e) => onItemClick(e, it.link)}>
                      <span className="mo-itemLabel">{it.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mo-footer">
                Nitte Institute Of Professional Education NH-75, Next to First Neuro Hospital, Kodakkal, Mangaluru – 575007. Karnataka, India.
              </div>
            </div>
          </aside>
          <style>{`
            .mo-toggle { position: fixed; bottom: calc(22px + env(safe-area-inset-bottom, 0px)); left: 50%; transform: translateX(-50%); z-index: 2200; appearance: none; border: none; background: transparent; color: #e9e9ef; border-radius: 56px; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform .66s cubic-bezier(0.22,1,0.36,1), width .5s cubic-bezier(0.22,1,0.36,1), height .5s cubic-bezier(0.22,1,0.36,1), border-radius .5s cubic-bezier(0.22,1,0.36,1), box-shadow .5s ease; }
            .mo-toggle .mo-toggle-inner { position: relative; z-index: 2; display: inline-flex; align-items: center; justify-content: center; gap: 0.7rem; padding: 18px 40px; font-weight: 700; letter-spacing: .02em; font-size: 18px; }
            .mo-label-wrap { position: relative; height: 1.1em; overflow: hidden; display: inline-grid; align-items: center; justify-items: center; min-width: 64px; }
            .mo-label-line { display: block; grid-area: 1 / 1; line-height: 1.1; will-change: transform, opacity; transition: transform .5s cubic-bezier(0.22,1,0.36,1), opacity .38s ease; }
            .mo-label-line.menu { opacity: 1; transform: translateY(0); }
            .mo-label-line.close { opacity: 0; transform: translateY(6px); }
            .mo-toggle.is-open .mo-label-line.menu { opacity: 0; transform: translateY(-6px); }
            .mo-toggle.is-open .mo-label-line.close { opacity: 1; transform: translateY(0); }
            .mo-toggle .mo-icon { position: relative; width: 18px; height: 18px; display: inline-flex; }
            .mo-toggle .mo-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2.5px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%) rotate(0deg); transition: transform .56s cubic-bezier(0.22,1,0.36,1); }
            .mo-toggle .mo-line.v { transform: translate(-50%, -50%) rotate(90deg); }
            .mo-toggle.is-open .mo-line.h { transform: translate(-50%, -50%) rotate(45deg); }
            .mo-toggle.is-open .mo-line.v { transform: translate(-50%, -50%) rotate(-45deg); }

            /* Background layers */
            .mo-toggle .mo-bg { position: absolute; inset: 0; border-radius: 56px; background: rgba(10, 15, 25, 0.65); border: 1px solid rgba(107, 193, 255, 0.28); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 6px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06); }
            .mo-toggle .mo-glow { position: absolute; inset: 0; border-radius: 56px; background: radial-gradient(120% 120% at 50% 0%, rgba(107,193,255,0.12) 0%, rgba(107,193,255,0.04) 40%, transparent 70%); opacity: 0; transition: opacity .3s ease; }
            .mo-toggle .mo-shimmer { position: absolute; inset: -1px; border-radius: 56px; padding: 1px; background: conic-gradient(from 0deg, transparent 0deg, rgba(107, 193, 255, 0.35) 120deg, rgba(174, 228, 255, 0.45) 180deg, rgba(107, 193, 255, 0.35) 240deg, transparent 360deg); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; opacity: 0.4; filter: blur(.2px); }
            .mo-toggle .mo-ripple { position: absolute; inset: 0; border-radius: 56px; border: 1px solid rgba(107,193,255,0.6); transform: scale(0.7); opacity: 0; pointer-events: none; }
            .mo-toggle:hover .mo-glow { opacity: 1; }
            .mo-toggle:hover .mo-shimmer { opacity: 0.7; }
            .mo-toggle:active .mo-toggle-inner { transform: translateY(1px) scale(0.98); }
            .mo-toggle.is-open .mo-glow { opacity: 1; animation: moGlowPulse 3s ease-in-out infinite; }
            .mo-toggle.is-open .mo-ripple { animation: moRipple .6s ease-out; }

            
            @keyframes moRipple { 0% { transform: scale(0.7); opacity: 0.28; } 70% { opacity: 0.12; } 100% { transform: scale(1.3); opacity: 0; } }
            @keyframes moGlowPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
            @media (prefers-reduced-motion: reduce) {
              .mo-toggle.is-open .mo-icon { animation: none !important; }
              .mo-toggle.is-open .mo-ripple { animation: none !important; opacity: 0 !important; }
              .mo-toggle.is-open .mo-glow { animation: none !important; }
              .mo-label-line { transition: none !important; }
            }
            .mo-panel { position: fixed; inset: 0; width: 100vw; min-height: 100vh; height: 100vh; height: 100svh; height: 100lvh; height: 100dvh; background: rgba(10,12,18,0.9); color: #fff; z-index: 2100; visibility: hidden; opacity: 0; pointer-events: none; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: opacity .28s ease; overflow-y: auto; clip-path: circle(0% at 50% 50%); }
            .mo-panel.is-open { visibility: visible; opacity: 1; pointer-events: auto; clip-path: circle(150% at 50% 50%); transition: opacity .28s ease, clip-path .6s cubic-bezier(0.22, 1, 0.36, 1); }
            .mo-panel-inner { min-height: 100%; padding: 5.5em 1.25em 1.5em 1.25em; display: flex; flex-direction: column; gap: 1.25rem; }
            .mo-vfx { position: fixed; left: 50%; top: 50%; width: 60vmin; height: 60vmin; transform: translate(-50%, -50%) scale(0.9); border-radius: 50%; pointer-events: none; opacity: 0; background: radial-gradient(closest-side, rgba(118,143,255,0.3), rgba(118,143,255,0) 65%); filter: blur(1px); }
            .mo-panel.is-open .mo-vfx { animation: moBurst 600ms ease-out forwards; }
            .mo-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
            .mo-itemWrap { opacity: 0; transform: translateY(8px) scale(0.98); }
            .mo-panel.is-open .mo-itemWrap { animation: moItemIn 520ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) forwards; }
            .mo-item { display: inline-block; color: #fff; text-decoration: none; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; font-size: clamp(1.6rem, 6.4vw, 3rem); padding-right: 1.6em; }
            .mo-item:hover { color: #6bc1ff; }
            .mo-footer { position: sticky; bottom: calc(3rem + env(safe-area-inset-bottom, 0px)); text-align: left; max-width: 46ch; font-size: 16px; line-height: 1.55; color: #ffffff; margin-top: auto; }
            @media (max-width: 640px) {
              .mo-item { font-size: clamp(1.6rem, 8vw, 2.2rem); }
              .mo-footer { font-size: 15px; max-width: 34ch; bottom: calc(8rem + env(safe-area-inset-bottom, 0px)); }
              .mo-panel-inner { padding-bottom: calc(9rem + env(safe-area-inset-bottom, 0px)); }
            }
            @keyframes moItemIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }
            @keyframes moBurst { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } 40% { opacity: 0.55; transform: translate(-50%, -50%) scale(1.04); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.08); } }
            @media (prefers-reduced-motion: reduce) {
              .mo-panel { transition: none; clip-path: none !important; }
              .mo-panel.is-open { transition: none; }
              .mo-itemWrap, .mo-panel.is-open .mo-itemWrap { animation: none !important; opacity: 1 !important; transform: none !important; }
              .mo-vfx, .mo-panel.is-open .mo-vfx { animation: none !important; opacity: 0 !important; }
            }

            /* Mobile FAB variant (non-Home always FAB, Home becomes FAB when open) */
            @media (max-width: 640px) {
              /* Compute rightward translation from center to bottom-right, including half FAB size */
              .mo-toggle { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
              .mo-toggle.variant-fab,
              .mo-toggle.variant-fab-open { --fabHalf: 32px; transform: translateX(calc(50vw - (16px + env(safe-area-inset-right, 0px)) - 50% - var(--fabHalf))); width: 64px; height: 64px; border-radius: 50%; }
              .mo-toggle.variant-fab .mo-toggle-inner,
              .mo-toggle.variant-fab-open .mo-toggle-inner { padding: 0; width: 100%; height: 100%; }
              .mo-toggle.variant-fab .mo-label-wrap,
              .mo-toggle.variant-fab-open .mo-label-wrap { display: none; }
              .mo-toggle.variant-fab .mo-icon,
              .mo-toggle.variant-fab-open .mo-icon { width: 24px; height: 24px; }
              .mo-toggle.variant-fab .mo-bg,
              .mo-toggle.variant-fab .mo-glow,
              .mo-toggle.variant-fab .mo-shimmer,
              .mo-toggle.variant-fab .mo-ripple,
              .mo-toggle.variant-fab-open .mo-bg,
              .mo-toggle.variant-fab-open .mo-glow,
              .mo-toggle.variant-fab-open .mo-shimmer,
              .mo-toggle.variant-fab-open .mo-ripple { border-radius: 50%; }
              .mo-toggle.variant-fab:hover .mo-shimmer,
              .mo-toggle.variant-fab-open:hover .mo-shimmer { opacity: 0.65; }
              .mo-toggle.variant-fab:active .mo-toggle-inner,
              .mo-toggle.variant-fab-open:active .mo-toggle-inner { transform: translateY(0.5px) scale(0.99); }
              .mo-toggle.variant-fab.is-open,
              .mo-toggle.variant-fab-open.is-open { --fabHalf: 34px; width: 68px; height: 68px; transform: translateX(calc(50vw - (16px + env(safe-area-inset-right, 0px)) - 50% - var(--fabHalf))); }
            }
          `}</style>
        </>,
        document.body
      )}
    </>
  );
}

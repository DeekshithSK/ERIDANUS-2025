import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const defaultMenuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Program', ariaLabel: 'View the program', link: '/program' },
  { label: 'Events', ariaLabel: 'View events', link: '/events' },
  { label: 'Venue', ariaLabel: 'Venue details', link: '/venue' },
  { label: 'Resources', ariaLabel: 'View resources', link: '/resources' }
];

export default function StaggeredMenu({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = defaultMenuItems,
  displayItemNumbering = true,
  className,
  logoUrl = '',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  onMenuOpen,
  onMenuClose
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);
  // Full-screen overlay is now the only mode
  const [isModal, setIsModal] = useState(false);
  useEffect(() => { setIsModal(false); }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;
      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;
      const offscreen = position === 'left' ? -100 : 100;
      gsap.set(panel, { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
  if (preLayers.length) gsap.set(preLayers, { autoAlpha: 0 });
  if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position, isModal]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;
    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    // Prepare initial states for center fade-in
    gsap.set(panel, { xPercent: 0, scale: 0.96, autoAlpha: 0, transformOrigin: '50% 50%' });
  if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, y: 10, yPercent: 0, scale: 0.98, rotate: 0, transformOrigin: '50% 50%' });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
    const tl = gsap.timeline({ paused: true });
    // Panel fades/scales in from center
  const panelDuration = 0.45;
    tl.to(panel, { autoAlpha: 1, scale: 1, duration: panelDuration, ease: 'power2.out' }, 0);
    // Aesthetic radial burst from center
    const vfx = panel.querySelector('.sm-panel-vfx');
    if (vfx) {
      tl.fromTo(
        vfx,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 0.5, scale: 1.06, duration: panelDuration, ease: 'power2.out' },
        0
      ).to(vfx, { autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, panelDuration - 0.1);
    }
    // Items stagger in (fade/scale up slightly)
    if (itemEls.length) {
      const itemsStart = panelDuration * 0.2;
      tl.to(
        itemEls,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out', stagger: { each: 0.07, from: 'start' } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.45, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.07, from: 'start' } },
          itemsStart + 0.06
        );
      }
    }
    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      // Fallback: ensure items are visible if timeline couldn't be built
      const panel = panelRef.current;
      if (panel) {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 1, y: 0, scale: 1, rotate: 0 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 1 });
        gsap.set(panel, { xPercent: 0, autoAlpha: 1, scale: 1 });
        const layers = preLayerElsRef.current;
        if (layers && layers.length) gsap.set(layers, { xPercent: 0 });
      }
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback((onDone) => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();
    const panel = panelRef.current;
    if (!panel) return;
    if (busyRef.current) return;
    busyRef.current = true;
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current?.kill();
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const vfx = panel.querySelector('.sm-panel-vfx');
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    // Items fade/scale out with reverse stagger
    if (itemEls.length) {
      tl.to(itemEls, {
        autoAlpha: 0,
        y: 10,
        scale: 0.98,
        duration: 0.35,
        ease: 'power2.in',
        stagger: { each: 0.06, from: 'end' }
      }, 0);
    }
    // Numbers fade out
    if (numberEls.length) {
      tl.to(numberEls, { ['--sm-num-opacity']: 0, duration: 0.25, ease: 'power2.in' }, 0);
    }
    // Subtle center VFX during close
    if (vfx) {
      tl.to(vfx, { autoAlpha: 0.25, scale: 1.02, duration: 0.2, ease: 'power2.out' }, 0)
        .to(vfx, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.12);
    }
    // Panel fades/scales out overlapping the item exit
    tl.to(panel, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: 'power2.in' }, 0.08)
      .add(() => {
        // Reset for next open
        gsap.set(panel, { xPercent: offscreen, autoAlpha: 1, scale: 1 });
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, yPercent: 0, y: 10, scale: 0.98, rotate: 0 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
        busyRef.current = false;
        onDone && onDone();
      });
    closeTweenRef.current = tl;
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;
    spinTweenRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    opening => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
    // Cleanup: ensure body scroll is restored if component unmounts while open
    return () => {
      try {
        const body = document.body;
        body.style.overflow = '';
        body.style.touchAction = '';
      } catch {}
    };
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    // We'll set open state immediately only when opening; for closing, delay until animation completes
    if (target) openRef.current = true; else openRef.current = false;
    if (target) setOpen(true);
    // Lock/unlock body scroll
    if (target) {
      try {
        const body = document.body;
        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
      } catch {}
    }
    if (target) {
      // Prepare initial hidden state; timeline will fade/scale in cleanly
      if (panelRef.current) {
        gsap.set(panelRef.current, { xPercent: 0, autoAlpha: 0, scale: 0.96 });
        const itemEls = Array.from(panelRef.current.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, yPercent: 0, y: 10, scale: 0.98, rotate: 0 });
        const numberEls = Array.from(panelRef.current.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
      }
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose(() => {
        // Now actually close in state and restore scroll
        setOpen(false);
        try {
          const body = document.body;
          body.style.overflow = '';
          body.style.touchAction = '';
        } catch {}
      });
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const handleItemClick = useCallback((e, link) => {
    e.preventDefault();
    // Navigate and then close the menu
    navigate(link);
    if (openRef.current) {
      toggleMenu();
    }
  }, [navigate, toggleMenu]);

  return (
    <div className={`sm-scope z-40`}>
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full'}
        style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 left-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>
        <header
          className="staggered-menu-header fixed top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none z-20"
          aria-label="Main navigation header"
        >
          <div className="sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="sm-logo-img block h-8 w-auto object-contain"
                draggable={false}
                width={110}
                height={24}
              />
            )}
          </div>
          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-[0.5rem] bg-[rgba(10,12,18,0.5)] border border-[rgba(107,193,255,0.25)] cursor-pointer text-[#e9e9ef] font-semibold leading-none overflow-visible pointer-events-auto rounded-[12px] px-3.5 py-2.5 backdrop-blur-[10px]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1.1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1.1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span
              ref={iconRef}
              className="sm-icon relative w-[16px] h-[16px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
            </span>
          </button>
        </header>
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute inset-0 h-full bg-[rgba(10,12,18,0.88)] text-white flex flex-col p-[4.5em_1.25em_1.25em_1.25em] overflow-y-auto z-10 backdrop-blur-[10px]"
          style={{ WebkitBackdropFilter: 'blur(10px)' }}
          aria-hidden={!open}
          role="dialog"
          aria-modal="true"
        >
          {/* Center VFX burst element */}
          <div className="sm-panel-vfx pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] rounded-full opacity-0"
               style={{ background: 'radial-gradient(closest-side, rgba(118,143,255,0.25), rgba(118,143,255,0) 65%)' }}
               aria-hidden="true" />
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2 text-white"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                    <a
                      className="sm-panel-item relative text-white font-semibold text-[1.35rem] md:text-[1.6rem] cursor-pointer leading-none tracking-[-1px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.2em]"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={e => handleItemClick(e, it.link)}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                  <span className="sm-panel-item relative text-black font-semibold text-[1.6rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                      No items
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
      {/* Inline styles for the menu, can be moved to a CSS file if desired */}
  <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
.sm-scope .staggered-menu-header { position: fixed; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: transparent; pointer-events: none; z-index: 100; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(10,12,18,0.5); border: 1px solid rgba(107,193,255,0.25); cursor: pointer; color: #e9e9ef; font-weight: 700; line-height: 1; overflow: visible; border-radius: 12px; padding: 12px 16px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); font-size: clamp(0.95rem, 1.2vw, 1.1rem); }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 18px; height: 18px; flex: 0 0 18px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: fixed; inset: 0; width: 100vw; height: 100vh; background: rgba(10,12,18,0.88); color: #fff; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 6em 1.25em calc(1.25em + env(safe-area-inset-bottom, 16px)) 1.25em; overflow-y: auto; z-index: 80; will-change: transform; }
.sm-scope .staggered-menu-panel::-webkit-scrollbar { width: 8px; }
.sm-scope .staggered-menu-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 8px; }
.sm-scope [data-position='right'] .staggered-menu-panel { transform: translateX(100%); }
.sm-scope [data-position='left'] .staggered-menu-panel { transform: translateX(-100%); }
.sm-scope [data-open] .staggered-menu-panel { transform: translateX(0) !important; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 70; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; will-change: transform; }
.sm-scope [data-position='right'] .sm-prelayer { transform: translateX(100%); }
.sm-scope [data-position='left'] .sm-prelayer { transform: translateX(-100%); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
.sm-scope .sm-panel-item { position: relative; color: #fff; font-weight: 700; font-size: clamp(1.6rem, 5vw, 3rem); cursor: pointer; line-height: 1.05; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.6em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #5227FF); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #5227FF); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } .sm-scope .sm-panel-list { gap: 1rem; } }
@media (max-width: 640px) { .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } .sm-scope .sm-panel-item { font-size: clamp(1.6rem, 8vw, 2.4rem); } .sm-scope .sm-panel-list { gap: 1.1rem; padding-bottom: 1.25rem; } }
@supports (top: env(safe-area-inset-top)) { .sm-scope .staggered-menu-header { padding-top: calc(1rem + env(safe-area-inset-top)); padding-right: calc(1.25rem + env(safe-area-inset-right)); } }

/* Backdrop can be reused if desired, but not needed for full-screen slide */
      `}</style>
    </div>
  );
}

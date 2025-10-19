import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [textLines, setTextLines] = useState(['Menu']);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);
  const pendingTargetRef = useRef(null);
  // Full-screen overlay is now the only mode
  const [isModal, setIsModal] = useState(false);
  useEffect(() => { setIsModal(false); }, []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
  // Keep panel anchored; we animate only inner content for reliability
  gsap.set(panel, { xPercent: 0 });
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
    const anim = panel.querySelector('.sm-panel-anim');
    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
  // Prepare initial states for center fade-in (animate inner content, not the fixed backdrop)
  if (anim) gsap.set(anim, { xPercent: 0, scale: 0.96, autoAlpha: 0, transformOrigin: '50% 50%' });
  if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, y: 10, yPercent: 0, scale: 0.98, rotate: 0, transformOrigin: '50% 50%' });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
  const tl = gsap.timeline({ paused: true });
    // Panel fades/scales in from center
  const panelDuration = 0.45;
  if (anim) tl.to(anim, { autoAlpha: 1, scale: 1, duration: panelDuration, ease: 'power2.out' }, 0);
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

  const playOpen = useCallback((onDone) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onStart', () => {
        try {
          const panel = panelRef.current;
          if (panel) {
            panel.scrollTop = 0;
            panel.scrollTo?.(0, 0);
          }
        } catch {}
      });
      tl.eventCallback('onComplete', () => {
        try {
          const panel = panelRef.current;
          if (panel) {
            panel.scrollTop = 0;
            panel.scrollTo?.(0, 0);
          }
        } catch {}
        busyRef.current = false;
        onDone && onDone();
        // Process any pending toggle intent
        if (pendingTargetRef.current !== null && pendingTargetRef.current !== openRef.current) {
          const desired = pendingTargetRef.current;
          pendingTargetRef.current = null;
          // Defer to next tick to avoid re-entrancy in GSAP callbacks
          setTimeout(() => {
            requestToggle(desired);
          }, 0);
        }
      });
      tl.play(0);
    } else {
      // Fallback: ensure items are visible if timeline couldn't be built
      const panel = panelRef.current;
      if (panel) {
        const anim = panel.querySelector('.sm-panel-anim');
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 1, y: 0, scale: 1, rotate: 0 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 1 });
        // Backdrop is fixed full-screen; make sure inner content is visible
        gsap.set(panel, { xPercent: 0 });
        if (anim) gsap.set(anim, { autoAlpha: 1, scale: 1 });
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
  // No panel slide; keep anchored and fade/scale inner content only
    closeTweenRef.current?.kill();
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
  const vfx = panel.querySelector('.sm-panel-vfx');
  const anim = panel.querySelector('.sm-panel-anim');
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
    if (anim) tl.to(anim, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: 'power2.in' }, 0.08)
      .add(() => {
        // Reset for next open
        if (anim) gsap.set(anim, { xPercent: 0, autoAlpha: 1, scale: 1 });
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, yPercent: 0, y: 10, scale: 0.98, rotate: 0 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
        busyRef.current = false;
        onDone && onDone();
        // Process any pending toggle intent
        if (pendingTargetRef.current !== null && pendingTargetRef.current !== openRef.current) {
          const desired = pendingTargetRef.current;
          pendingTargetRef.current = null;
          setTimeout(() => {
            requestToggle(desired);
          }, 0);
        }
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
    const targetLabel = opening ? 'Close' : 'Menu';
    // Swap to a single label and do a small up-fade
    setTextLines([targetLabel]);
    gsap.fromTo(inner, { y: 6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
  }, []);

  // Smoothly scroll the page to the top, resolve when at top or after maxWait ms
  const scrollPageToTop = useCallback((smooth = true, maxWait = 900) => {
    return new Promise(resolve => {
      try {
        const docEl = document.documentElement || document.body;
        const current = Math.max(window.scrollY || 0, docEl.scrollTop || 0);
        if (current <= 0) return resolve();
        const start = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        if (smooth && docEl && 'scrollBehavior' in docEl.style) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
        const check = () => {
          const y = Math.max(window.scrollY || 0, (document.documentElement?.scrollTop || 0));
          const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start;
          if (y <= 0 || elapsed >= maxWait) return resolve();
          requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      } catch {
        resolve();
      }
    });
  }, []);

  const requestToggle = useCallback((target) => {
    // Queue request if an animation is running
    if (busyRef.current) {
      pendingTargetRef.current = target;
      return;
    }
    if (target === openRef.current) return; // nothing to do
    if (target) {
      // Open overlay immediately at current scroll position
      openRef.current = true;
      setOpen(true);
      try {
        const body = document.body;
        const html = document.documentElement;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        body.dataset.smLock = String(scrollY);
        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
        if (html) {
          html.style.overflow = 'hidden';
          html.style.height = '100%';
        }
      } catch {}
      const panel = panelRef.current;
      if (panel) {
        try { panel.focus({ preventScroll: true }); } catch {}
        panel.scrollTop = 0;
        panel.scrollTo?.(0, 0);
        // Keep backdrop visible; prep inner anim content
        gsap.set(panel, { xPercent: 0 });
        const anim = panel.querySelector('.sm-panel-anim');
        if (anim) gsap.set(anim, { autoAlpha: 0, scale: 0.96, transformOrigin: '50% 50%' });
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { autoAlpha: 0, yPercent: 0, y: 10, scale: 0.98, rotate: 0 });
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
      }
      onMenuOpen?.();
      playOpen();
      // Trigger open-state UI animations now that the open has begun
      animateIcon(true);
      animateColor(true);
      animateText(true);
      return;
    } else {
      openRef.current = false;
      onMenuClose?.();
      playClose(() => {
        setOpen(false);
        try {
          const body = document.body;
          const html = document.documentElement;
          const prev = parseInt(body.dataset.smLock || '0', 10) || 0;
          body.style.overflow = '';
          body.style.touchAction = '';
          if (html) {
            html.style.overflow = '';
            html.style.height = '';
          }
          window.scrollTo(0, prev);
          delete body.dataset.smLock;
        } catch {}
      });
      setTimeout(() => {
        try {
          const body = document.body;
          const html = document.documentElement;
          body.style.overflow = '';
          body.style.touchAction = '';
          if (html) {
            html.style.overflow = '';
            html.style.height = '';
          }
        } catch {}
      }, 500);
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    requestToggle(target);
  }, [requestToggle]);

  const handleItemClick = useCallback((e, link) => {
    e.preventDefault();
    // Close first to avoid any races, then navigate
    if (openRef.current) {
      requestToggle(false);
    }
    // Slight defer to allow close to kick off cleanly
    setTimeout(() => navigate(link), 0);
  }, [navigate, requestToggle]);

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
        {mounted ? createPortal(
          <>
          <header
            className="staggered-menu-header fixed bg-transparent"
            style={{ pointerEvents: 'none' }}
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
              className="menu-toggle-btn pointer-events-auto"
              style={{ pointerEvents: 'auto', cursor: 'pointer', position: 'relative', zIndex: 2000 }}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              {/* Animated background layers */}
              <div className="btn-bg-layer btn-bg-primary"></div>
              <div className="btn-bg-layer btn-bg-glow"></div>
              <div className="btn-border-shimmer"></div>
              
              {/* Button content */}
              <span className="btn-content inline-flex items-center gap-[0.7rem] text-[#e9e9ef] font-semibold leading-none">
                <span
                  ref={textWrapRef}
                  className="sm-toggle-textWrap relative inline-block h-[1.1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
                  aria-hidden="true"
                >
                  <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                    {textLines.map((l, i) => (
                      <span className="sm-toggle-line block h-[1.1em] leading-none tracking-wide" key={i}>
                        {l}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  ref={iconRef}
                  className="sm-icon relative w-[18px] h-[18px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
                  aria-hidden="true"
                >
                  <span
                    ref={plusHRef}
                    className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2.5px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
                  />
                  <span
                    ref={plusVRef}
                    className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2.5px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
                  />
                </span>
              </span>
            </button>
          </header>
          <aside
            id="staggered-menu-panel"
            ref={panelRef}
            className={`staggered-menu-panel bg-[rgba(10,12,18,0.88)] text-white flex flex-col p-[4.5em_1.25em_1.25em_1.25em] overflow-y-auto backdrop-blur-[10px] ${open ? 'is-open' : ''}`}
            style={{ WebkitBackdropFilter: 'blur(12px)' }}
            aria-hidden={!open}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <div className="sm-panel-anim relative min-h-full">
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
              {/* Bottom-left footer info */}
              <div className="sm-panel-footer" aria-label="Institution address">
              Nitte Institute Of Professional Education NH-75, Next to First Neuro Hospital, Kodakkal, Mangaluru – 575007. Karnataka, India.
              </div>
            </div>
          </aside>
          </>, document.body) : null}
      </div>
      {/* Inline styles for the menu, can be moved to a CSS file if desired */}
  <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
.sm-scope .staggered-menu-header { position: fixed; bottom: calc(24px + env(safe-area-inset-bottom, 0px)); left: 50%; right: auto; top: auto; transform: translateX(-50%); width: auto; display: flex; align-items: center; justify-content: center; padding: 0; background: transparent; pointer-events: none; z-index: 1000; }
.staggered-menu-header { position: fixed; bottom: calc(24px + env(safe-area-inset-bottom, 0px)); left: 50%; right: auto; top: auto; transform: translateX(-50%); width: auto; display: flex; align-items: center; justify-content: center; padding: 0; background: transparent; pointer-events: none; z-index: 1000; animation: menuButtonFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(10,12,18,0.5); border: 1px solid rgba(107,193,255,0.25); cursor: pointer; color: #e9e9ef; font-weight: 700; line-height: 1; overflow: visible; border-radius: 12px; padding: 12px 16px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); font-size: clamp(0.95rem, 1.2vw, 1.1rem); }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
/* Unscoped equivalents so the portal header gets proper layout */
.sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1.1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-toggle-line { display: block; height: 1.1em; line-height: 1; }
.sm-icon { position: relative; width: 18px; height: 18px; flex: 0 0 18px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.sm-line { display: none !important; }
@keyframes menuButtonFadeIn { 
  from { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.95); } 
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 
}

/* Custom Animated Menu Button */
.menu-toggle-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: transparent;
  border: none;
  border-radius: 50px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.menu-toggle-btn:hover {
  transform: translateY(-1px);
}

.menu-toggle-btn:active {
  transform: scale(0.96);
}

/* Background layers */
.btn-bg-layer {
  position: absolute;
  inset: 0;
  border-radius: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-bg-primary {
  background: rgba(10, 15, 25, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 193, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.menu-toggle-btn:hover .btn-bg-primary {
  background: rgba(15, 20, 35, 0.75);
  border-color: rgba(107, 193, 255, 0.35);
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(107, 193, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.btn-bg-glow {
  background: radial-gradient(circle at 50% 0%, 
    rgba(107, 193, 255, 0.08) 0%,
    transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-toggle-btn:hover .btn-bg-glow {
  opacity: 1;
}

/* Animated border shimmer */
.btn-border-shimmer {
  position: absolute;
  inset: -1px;
  border-radius: 50px;
  padding: 1px;
  background: conic-gradient(from 0deg,
    transparent 0deg,
    rgba(107, 193, 255, 0.3) 90deg,
    rgba(174, 228, 255, 0.4) 180deg,
    rgba(107, 193, 255, 0.3) 270deg,
    transparent 360deg);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  animation: shimmerRotate 4s linear infinite;
  transition: opacity 0.3s ease;
}

.menu-toggle-btn:hover .btn-border-shimmer {
  opacity: 0.6;
}

/* Button content */
.btn-content {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.menu-toggle-btn:hover .btn-content {
  color: rgba(255, 255, 255, 1);
}

/* Icon lines improvements */
.sm-icon-line {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: currentColor;
}

@keyframes shimmerRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Focus visible state */
.menu-toggle-btn:focus-visible {
  outline: 2px solid rgba(107, 193, 255, 0.5);
  outline-offset: 3px;
}
 .sm-scope .staggered-menu-panel { position: fixed; inset: 0; width: 100vw; min-height: 100vh; height: 100vh; height: 100svh; height: 100lvh; height: 100dvh; background: rgba(10,12,18,0.88); color: #fff; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; --sm-pad-top: 4.5em; --sm-pad-bottom: calc(1.25em + env(safe-area-inset-bottom, 16px)); padding: var(--sm-pad-top) 1.25em var(--sm-pad-bottom) 1.25em; overflow-y: auto; z-index: 1980; }
.sm-scope .staggered-menu-wrapper:not([data-open]) .staggered-menu-panel { visibility: hidden; opacity: 0; pointer-events: none; }
.sm-scope .staggered-menu-wrapper[data-open] .staggered-menu-panel { visibility: visible; opacity: 1; pointer-events: auto; }
 /* Unscoped rules for portaled panel */
 .staggered-menu-panel { position: fixed; inset: 0; width: 100vw; min-height: 100vh; height: 100vh; height: 100svh; height: 100lvh; height: 100dvh; background: rgba(10,12,18,0.88); color: #fff; display: flex; flex-direction: column; --sm-pad-top: 4.5em; --sm-pad-bottom: calc(1.25em + env(safe-area-inset-bottom, 16px)); padding: var(--sm-pad-top) 1.25em var(--sm-pad-bottom) 1.25em; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 1980; visibility: hidden; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; overflow-y: auto; }
 .staggered-menu-panel.is-open { visibility: visible; opacity: 1; pointer-events: auto; }
.sm-scope .sm-panel-anim { will-change: transform, opacity; }
.sm-scope .staggered-menu-panel { overscroll-behavior: contain; -webkit-overflow-scrolling: touch; overflow-anchor: none; scroll-behavior: auto; }
.sm-scope .staggered-menu-panel::-webkit-scrollbar { width: 0 !important; height: 0 !important; background: transparent !important; }
.sm-scope .staggered-menu-panel::-webkit-scrollbar-thumb { background: transparent !important; border: none !important; }
.sm-scope .staggered-menu-panel { scrollbar-width: none; -ms-overflow-style: none; }
/* Note: Transforms for open/close are controlled by GSAP on .sm-panel-anim; the backdrop panel remains full-screen fixed. */
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: fixed; inset: 0; width: 100vw; min-height: 100vh; height: 100vh; height: 100svh; height: 100lvh; height: 100dvh; pointer-events: none; z-index: 970; }
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
/* Footer inside panel */
.sm-scope .sm-panel-footer { position: sticky; bottom: calc(3rem + env(safe-area-inset-bottom, 0px)); left: 0; text-align: left; max-width: 46ch; font-size: 16px; line-height: 1.55; color: #ffffff; padding-top: 0.9rem; margin-top: auto; }
@media (max-width: 640px) { .sm-scope .sm-panel-footer { font-size: 15px; max-width: 34ch; bottom: calc(4rem + env(safe-area-inset-bottom, 0px)); } }
@media (max-width: 1024px) { .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } .sm-scope .sm-panel-list { gap: 1rem; } }
@media (max-width: 640px) {
  /* Move menu button to bottom center on mobile */
  .sm-scope .staggered-menu-header { top: auto; bottom: calc(22px + env(safe-area-inset-bottom, 0px)); left: 50%; right: auto; transform: translateX(-50%); justify-content: center; padding: 0; width: auto; }
  .staggered-menu-header { top: auto; bottom: calc(22px + env(safe-area-inset-bottom, 0px)); left: 50%; right: auto; transform: translateX(-50%); justify-content: center; padding: 0; width: auto; }
  .sm-scope .sm-logo { display: none; }
  .sm-logo { display: none; }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); }
  .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); }
  .menu-toggle-btn { padding: 16px 32px; font-size: 18px; }
  .sm-icon { width: 16px !important; height: 16px !important; }
  .sm-scope .sm-panel-item { font-size: clamp(1.6rem, 8vw, 2.4rem); }
  .sm-scope .sm-panel-list { gap: 1.1rem; padding-bottom: 1.25rem; }
  .sm-scope .staggered-menu-panel { --sm-pad-top: 4em; --sm-pad-bottom: calc(1.25em + env(safe-area-inset-bottom, 12px)); }
}
@supports (top: env(safe-area-inset-top)) { .sm-scope .staggered-menu-header { padding-top: calc(1rem + env(safe-area-inset-top)); padding-right: calc(1.25rem + env(safe-area-inset-right)); } }

/* Backdrop can be reused if desired, but not needed for full-screen slide */
      `}</style>
    </div>
  );
}

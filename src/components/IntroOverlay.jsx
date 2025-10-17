import React, { useEffect, useMemo, useState } from 'react';
import SplitText from './SplitText.jsx';
import Galaxy from './Galaxy.jsx';

export default function IntroOverlay({ onDone }) {
  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const TEXT = 'Welcome To ERIDANUS 2025';
  const DURATION_SEC = 2; // per-letter animation duration (slower)
  const STAGGER_MS = 120; // stagger between letters (slower)
  // Faster timing for mobile so the year follows promptly
  const MOBILE_DURATION_SEC = 0.8;
  const MOBILE_STAGGER_MS = 160;
  const lettersCount = useMemo(() => Array.from(TEXT).filter(c => c.trim().length > 0).length, [TEXT]);

  useEffect(() => {
    // Safety timeout in case animation callback doesn't fire for any reason
    // Estimate: all staggers plus one duration, with a small buffer
    const estimatedTotal = DURATION_SEC * 1000 + STAGGER_MS * lettersCount + 1200;
    const t = setTimeout(() => { setShow(false); onDone?.(); }, estimatedTotal);
    return () => clearTimeout(t);
  }, [onDone]);

  // Decide mobile vs desktop once overlay mounts
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const set = () => setIsMobile(mq.matches);
    set();
    mq.addEventListener ? mq.addEventListener('change', set) : mq.addListener(set);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', set) : mq.removeListener(set);
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, backgroundColor:'#0a0c12', overflow:'hidden', WebkitTapHighlightColor:'transparent' }}>
      {/* Safe-area top filler to avoid any notch/status-bar seam */}
      <div aria-hidden style={{ position:'absolute', top:0, left:0, right:0, height:'env(safe-area-inset-top, 0px)', background:'#0a0c12', pointerEvents:'none' }} />
      {/* Galaxy background */}
      <div style={{ position:'absolute', top:'-1px', left:'-1px', right:'-1px', bottom:'-1px' }} aria-hidden>
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.6}
          glowIntensity={0.55}
          saturation={0.0}
          hueShift={0}
          rotationSpeed={0.06}
          twinkleIntensity={0.35}
          transparent={false}
        />
      </div>
      {/* Centered animated headline */}
      <div style={{ position:'relative', display:'grid', placeItems:'center', height:'100%', padding:'0 12px' }}>
        {isMobile ? (
          <div style={{ display:'grid', placeItems:'center', gap: 4 }}>
            <SplitText
              text={'Welcome To ERIDANUS'}
              tag="h1"
              className="headline"
              delay={MOBILE_STAGGER_MS}
              duration={MOBILE_DURATION_SEC}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="center"
              onLetterAnimationComplete={() => setShowYear(true)}
            />
            {/* Reserve space for the year to avoid layout shift */}
            <div style={{ position:'relative', width:'100%' }}>
              <h1 className="headline" style={{ visibility:'hidden', margin: 0, textAlign:'center' }}>2025</h1>
              {showYear && (
                <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center' }}>
                  <SplitText
                    text={'2025'}
                    tag="h1"
                    className="headline"
                    delay={MOBILE_STAGGER_MS}
                    duration={MOBILE_DURATION_SEC}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    onLetterAnimationComplete={() => { setShow(false); onDone?.(); }}
                    textAlign="center"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <SplitText
            text={TEXT}
            tag="h1"
            className="headline"
            delay={STAGGER_MS}
            duration={DURATION_SEC}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            onLetterAnimationComplete={() => { setShow(false); onDone?.(); }}
            textAlign="center"
          />
        )}
      </div>
    </div>
  );
}

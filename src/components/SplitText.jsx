import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const wrapBy = (text, splitType) => {
  if (!text) return [];
  if (splitType === 'words' || splitType === 'lines') {
    // simple word split; lines are layout-dependent, so we map to words for now
    return text.split(/(\s+)/).map((w, i) => ({ key: i, content: w, type: /\s+/.test(w) ? 'space' : 'word' }));
  }
  // default: chars
  return Array.from(text).map((ch, i) => ({ key: i, content: ch, type: ch === ' ' ? 'space' : 'char' }));
};

export default function SplitText({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const items = useMemo(() => wrapBy(text, splitType), [text, splitType]);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.split-char, .split-word');
    if (!targets.length) return;
    const tl = gsap.fromTo(
      targets,
      { ...from },
      { ...to, duration, ease, stagger: delay / 1000, onComplete: onLetterAnimationComplete }
    );
    return () => tl.kill();
  }, { dependencies: [text, delay, duration, ease, JSON.stringify(from), JSON.stringify(to), splitType] });

  const style = { textAlign, willChange: 'transform, opacity' };
  const classes = `split-parent inline-block ${className}`;

  const Tag = tag;
  return (
    <Tag ref={ref} className={classes} style={style}>
      {items.map(({ key, content, type }) => {
        if (type === 'space') return <span key={key}>&nbsp;</span>;
        if (type === 'word') return <span key={key} className="split-word inline-block">{content}</span>;
        return <span key={key} className="split-char inline-block">{content}</span>;
      })}
    </Tag>
  );
}

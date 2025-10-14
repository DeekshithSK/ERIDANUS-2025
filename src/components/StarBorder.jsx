import React from 'react'

/**
 * StarBorder
 * Props:
 * - as: string | React component (default 'button')
 * - className: extra classes for outer wrapper
 * - color: glow color for star trails (default 'white')
 * - speed: animation duration (e.g., '6s')
 * - thickness: outer padding thickness to simulate border (default 1)
 * - children: content inside the inner panel
 * - ...rest: any other props (style merged)
 */
const StarBorder = React.forwardRef(({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  thicknessX,
  radius = 20,
  innerPadding,
  innerFontSize,
  children,
  ...rest
}, ref) => {
  const computedRadius = radius === 'full' || radius === 'pill' ? 9999 : radius;
  const outerStyle = {
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    borderRadius: computedRadius,
    padding: `${thickness}px ${typeof thicknessX === 'number' ? thicknessX : thickness}px`,
    // Expose color to CSS as a variable for the outline
    ['--star-border-color']: color,
    ['--star-speed']: typeof speed === 'number' ? `${speed}ms` : speed,
    ...rest.style
  }

  const trailCommon = {
    position: 'absolute',
    width: '260%',
    height: '180%',
    opacity: 0.55,
    borderRadius: '9999px',
    zIndex: 0,
    background: `radial-gradient(circle, ${color}, transparent 18%)`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    willChange: 'transform, opacity',
  }

  return (
  <Component ref={ref} className={`relative inline-block overflow-hidden star-border-wrap ${className}`} style={outerStyle} {...rest}>
      {/* Bottom trail */}
      <div
        className="animate-star-movement-bottom"
        style={{
          ...trailCommon,
          bottom: '-40%',
          right: '-70%',
          animationName: 'star-movement-bottom',
          animationDuration: speed,
        }}
        aria-hidden
      />
      {/* Top trail */}
      <div
        className="animate-star-movement-top"
        style={{
          ...trailCommon,
          top: '-40%',
          left: '-70%',
          animationName: 'star-movement-top',
          animationDuration: speed,
        }}
        aria-hidden
      />
      {/* Left trail */}
      <div
        className="animate-star-movement-left"
        style={{
          ...trailCommon,
          left: '-40%',
          top: '-70%',
          width: '180%',
          height: '260%',
          animationName: 'star-movement-left',
          animationDuration: speed,
        }}
        aria-hidden
      />
      {/* Right trail */}
      <div
        className="animate-star-movement-right"
        style={{
          ...trailCommon,
          right: '-40%',
          top: '-70%',
          width: '180%',
          height: '260%',
          animationName: 'star-movement-right',
          animationDuration: speed,
        }}
        aria-hidden
      />
      {/* Inner content container */}
      <div
        className="star-inner"
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, rgba(10,12,20,0.98) 0%, rgba(15,18,28,0.96) 100%)',
          border: '1px solid rgba(107, 193, 255, 0.22)',
          textAlign: 'center',
          fontSize: innerFontSize ?? 16,
          padding: innerPadding ?? '16px 26px',
          borderRadius: computedRadius,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(107,193,255,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        {children}
      </div>

      {/* Scoped styles for animations */}
      <style>{`
        .star-border-wrap {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .star-border-wrap:hover {
          transform: translateY(-2px);
        }
        .star-border-wrap:active {
          transform: translateY(0px);
        }
        .star-border-wrap::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          pointer-events: none;
          border: 1px solid color-mix(in oklab, var(--star-border-color) 40%, transparent);
          box-shadow:
            0 0 12px color-mix(in oklab, var(--star-border-color) 22%, transparent),
            inset 0 0 8px color-mix(in oklab, var(--star-border-color) 10%, transparent);
          transition: all 0.3s ease;
        }
        .star-border-wrap:hover::before {
          border-color: color-mix(in oklab, var(--star-border-color) 60%, transparent);
          box-shadow:
            0 0 20px color-mix(in oklab, var(--star-border-color) 35%, transparent),
            inset 0 0 12px color-mix(in oklab, var(--star-border-color) 15%, transparent);
        }
        .star-border-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: conic-gradient(from 0deg,
            color-mix(in oklab, var(--star-border-color) 70%, transparent) 0%,
            transparent 20%,
            color-mix(in oklab, var(--star-border-color) 80%, transparent) 40%,
            transparent 60%,
            color-mix(in oklab, var(--star-border-color) 70%, transparent) 80%,
            transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          animation: star-ring-rotate var(--star-speed, 6s) linear infinite;
          opacity: 0.5;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .star-border-wrap:hover::after {
          opacity: 0.75;
          animation-duration: calc(var(--star-speed, 6s) * 0.7);
        }
        .star-border-wrap:hover .star-inner {
          background: linear-gradient(135deg, rgba(12,15,24,0.98) 0%, rgba(18,22,32,0.96) 100%);
          border-color: rgba(107, 193, 255, 0.35);
          box-shadow: 
            0 6px 32px rgba(0,0,0,0.5),
            0 0 0 1px rgba(107,193,255,0.15),
            inset 0 1px 0 rgba(107,193,255,0.15);
        }
        @keyframes star-ring-rotate { to { transform: rotate(360deg); } }
        @keyframes star-movement-bottom {
          0% { transform: translate(0%, 0%); opacity: 0.55; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }
        @keyframes star-movement-top {
          0% { transform: translate(0%, 0%); opacity: 0.55; }
          100% { transform: translate(100%, 0%); opacity: 0; }
        }
        @keyframes star-movement-left {
          0% { transform: translate(0%, 0%); opacity: 0.55; }
          100% { transform: translate(0%, -100%); opacity: 0; }
        }
        @keyframes star-movement-right {
          0% { transform: translate(0%, 0%); opacity: 0.55; }
          100% { transform: translate(0%, 100%); opacity: 0; }
        }
        .animate-star-movement-bottom { animation: star-movement-bottom linear infinite alternate; }
        .animate-star-movement-top { animation: star-movement-top linear infinite alternate; }
        .animate-star-movement-left { animation: star-movement-left linear infinite alternate; }
        .animate-star-movement-right { animation: star-movement-right linear infinite alternate; }
      `}</style>
    </Component>
  )
})

export default StarBorder

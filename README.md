# ERIDANUS 2025 — Dark Galaxy SPA

React + Vite single-page app with an OGL galaxy background, animated intro, and a full-screen overlay menu. Home shows event details and animated stats.

## Features

- OGL galaxy background across pages
- One-time intro overlay animation (session-gated)
- Full-screen, centered overlay menu with robust GSAP open/close animations
- Minimal, bottom-center Menu toggle (portal-based) for mobile and desktop
- React Router pages: Home, About, Program, Events, Venue, Resources
- Animated CountUp stats on Home (Motion)
- Firebase Hosting config in repo

## Run locally

1. Install dependencies
2. Start the dev server

```bash
npm install
npm run dev
```

Open the local URL (usually http://localhost:5173).

Optional: Use VS Code launch config “Vite: dev server” to start and attach Chrome.

## Structure

- `src/components/Galaxy.jsx` — galaxy background
- `src/components/IntroOverlay.jsx` — intro animation overlay
- `src/components/StaggeredMenu.jsx` — overlay menu + toggle
- `src/components/CountUp.jsx` — number animation (Motion)
- `src/pages/*` — route pages
- `src/App.jsx` — routes and global composition
- `src/main.jsx` — React entry
- `src/styles.css` — global styles

## Tasks and Launch

- VS Code tasks: vite:dev, vite:build, vite:preview
- VS Code launch: Vite: dev server (starts task and opens Chrome)

## Deploy (Firebase Hosting)

Build and deploy:

```bash
npm run firebase:deploy
```

## Notes

- The menu overlay uses fixed positioning and GSAP-controlled fade/scale to always open centered and cover the viewport regardless of scroll.
- The Menu button is rendered via a portal and fixed at the bottom center on all viewports. Safe-area insets are respected.

# ERIDANUS 2025 — Registration (Home only)

Dark galaxy–themed React + Vite site. This initial cut implements:

- Galaxy shader background (OGL)
- Sticky navbar with links: Home, About, Program, Events, Venue, Resources (placeholders)
- Home hero with CTA buttons (placeholders)

## Run locally

1. Install dependencies
2. Start the dev server

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Structure

- `src/components/Galaxy.jsx` — background shader component
- `src/components/Navbar.jsx` — top navigation
- `src/pages/Home.jsx` — home page content
- `src/App.jsx` — site composition
- `src/main.jsx` — React entry
- `src/styles.css` — global styles / theme

## Next steps

- Wire registration form and backend
- Build About, Program, Events, Venue, Resources pages
- Add routing (React Router)
- Accessibility review and keyboard nav

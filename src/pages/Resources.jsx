import React from 'react'
import posterDocx from '../../Poster Creation Instructions - Final.docx'
import abstractDocx from '../../Abstract Presentation Instructions - Final.docx'

export default function Resources() {
  return (
    <main className="hero hero-min" aria-label="Resources">
      <section className="overlay resources-overlay" style={{ padding: '16px 12px' }}>
        <h1 className="headline" style={{ marginTop: 8 }}>Resources</h1>
        <p className="subhead">Guides, downloads, and links</p>

        <div className="cards-grid">
          {/* Poster creation instructions (Angetenar) */}
          <article className="res-card">
            <header className="res-head">
              <h2>Poster presentation instructions (.DOCX)</h2>
              <p>Official instructions for creating posters for Angetenar</p>
            </header>
            <div className="res-actions">
              <a
                className="dl-btn"
                href={posterDocx}
                download="Poster_Creation_Instructions.docx"
                aria-label="Download Poster Creation Instructions (DOCX)"
              >
                Download
              </a>
            </div>
          </article>

          {/* Abstract presentation instructions (Zaurak & Beid) */}
          <article className="res-card">
            <header className="res-head">
              <h2>Abstract presentation instructions (.DOCX)</h2>
              <p>Formatting guidelines for Zaurak and Beid submissions</p>
            </header>
            <div className="res-actions">
              <a
                className="dl-btn"
                href={abstractDocx}
                download="Abstract_Presentation_Instructions.docx"
                aria-label="Download Abstract Presentation Instructions (DOCX)"
              >
                Download
              </a>
            </div>
          </article>

          {/* Conference Guidelines - no functionality on the button */}
          <article className="res-card">
            <header className="res-head">
              <h2>Conference Guidelines (.PDF)</h2>
              <p>Complete participant handbook and submission guidelines</p>
            </header>
            <div className="res-actions">
              <button className="dl-btn disabled" aria-disabled="true" title="Download will be available soon">
                Download
              </button>
            </div>
          </article>
        </div>

        <style>{`
          .resources-overlay { max-width: 1100px; margin: 0 auto; }
          .cards-grid { margin-top: 1rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
          @media (max-width: 980px) { .cards-grid { grid-template-columns: 1fr; } }
          .res-card { background: rgba(10,12,18,0.55); border: 1px solid rgba(107,193,255,0.18); border-radius: 16px; padding: 1rem; box-shadow: 0 14px 38px rgba(0,0,0,0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .res-head h2 { margin: 0 0 0.35rem; font-size: clamp(1.05rem, 2.8vw, 1.25rem); color: #fff; }
          .res-head p { margin: 0; color: #cfd3ff; font-size: clamp(0.95rem, 2.3vw, 1rem); }
          .res-actions { margin-top: 0.75rem; display: flex; gap: 0.5rem; }
          .dl-btn { display: inline-block; padding: 10px 16px; font-weight: 700; color: #eaf4ff; text-decoration: none; border-radius: 12px; border: 1px solid rgba(107,193,255,0.35); background: linear-gradient(135deg, rgba(13,42,77,0.95), rgba(11,74,122,0.95)); box-shadow: 0 8px 24px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04); transition: transform 160ms ease, filter 160ms ease; cursor: pointer; }
          .dl-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
          .dl-btn:active { transform: translateY(0); filter: brightness(0.98); }
          .dl-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px #0b4a7a, 0 0 0 4px rgba(107,193,255,0.55); }
          .dl-btn.disabled, .dl-btn[aria-disabled="true"], button.dl-btn[disabled] { opacity: 0.6; filter: saturate(0.7); cursor: not-allowed; pointer-events: none; }
        `}</style>
      </section>
    </main>
  )
}

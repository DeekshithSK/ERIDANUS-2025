import React from 'react'
import { useNavigate } from 'react-router-dom'
import imgInPerson from '../../in person abstract presentation.jpg'
import imgOnline from '../../online abstract presentation.jpg'
import imgPoster from '../../poster presentation.jpg'

export default function Winners() {
  const navigate = useNavigate()
  return (
    <main className="winners-page" aria-labelledby="winners-heading">
      <div className="winners-inner">
        <header>
          <h1 id="winners-heading">Winners</h1>
          <p className="winners-sub">Results will be posted here once announced.</p>
        </header>

        <section className="winners-grid">
          {[
            { key: 'angetenar', title: 'Angetenar', image: imgPoster },
            { key: 'zaurak', title: 'Zaurak', image: imgOnline },
            { key: 'beid', title: 'Beid', image: imgInPerson }
          ].map((c) => (
            <article key={c.key} className="winner-card">
              <figure className="winner-hero">
                <img src={c.image} alt={`${c.title} banner`} loading="lazy" />
              </figure>
              <h2 className="winner-title">{c.title}</h2>
              <p className="winner-status">Winners yet to be announced</p>
              <div className="winner-actions">
                <button className="btn-primary" onClick={() => navigate('/events')}>View event</button>
              </div>
            </article>
          ))}
        </section>

        <style>{`
          .winners-page { min-height: 100svh; padding: clamp(36px, 5vw, 72px) 1rem 2.25rem; color: #fff; display: grid; place-items: start center; }
          .winners-inner { width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 0.9rem; }
          .winners-sub { margin: 0 0 0.8rem; color: #cfd8ff; }
          .winners-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
          .winner-card { background: linear-gradient(180deg, rgba(13,17,26,0.65), rgba(13,17,26,0.45)); border: 1px solid rgba(107,193,255,0.18); border-radius: 12px; padding: 0.75rem; display: flex; flex-direction: column; gap: .5rem; }
          .winner-hero { margin: 0; border-radius: 10px; overflow: hidden; }
          .winner-hero img { display: block; width: 100%; height: 120px; object-fit: cover; object-position: center; }
          .winner-title { margin: 0; font-size: 1rem; font-weight: 800; }
          .winner-status { margin: 0; color: #c9d9ff; opacity: 0.95; font-size: 0.95rem; }
          .winner-actions { display: flex; gap: .45rem; }
          .btn-primary { background: linear-gradient(92deg, #bfe7ff, #6bc1ff); color: #071018; border: none; padding: .45rem .7rem; border-radius: 9px; font-weight: 800; cursor: pointer; font-size: 0.95rem; }

          @media (min-width: 720px) {
            .winners-grid { grid-template-columns: repeat(3, 1fr); }
            .winner-card { padding: 0.9rem; }
            .winner-hero img { height: 140px; }
          }
        `}</style>
      </div>
    </main>
  )
}

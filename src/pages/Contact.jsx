import React from 'react'

export default function Contact() {
  return (
    <section className="contact-page" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <header className="contact-header">
          <h1 id="contact-heading" className="contact-title">Contact Us</h1>
          <p className="contact-sub">We are happy to help. Reach out to our coordinators or email us.</p>
          <div className="contact-actions">
            <a
              className="contact-cta"
              href="https://nitte.edu.in/discover-nitte.php"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Discover NITTE page in a new tab"
            >
              discover NITTE
            </a>
          </div>
        </header>

        <div className="contact-grid">
          <article className="contact-card contact-mail">
            <h2 className="contact-name">Mail us at</h2>
            <a className="contact-link" href="mailto:eridanus2025.nipe@gmail.com" aria-label="Email eridanus2025.nipe@gmail.com">eridanus2025.nipe@gmail.com</a>
            <a className="contact-link" href="mailto:nipe@nitte.edu.in" aria-label="Email nipe@nitte.edu.in">nipe@nitte.edu.in</a>
            <a className="contact-link" href="mailto:Vishal.23uca115@student.nitte.edu.in" aria-label="Email Vishal.23uca115@student.nitte.edu.in">Vishal.23uca115@student.nitte.edu.in</a>
          </article>

          <article className="contact-card">
            <h2 className="contact-name">Vishal Acharya</h2>
            <p className="contact-role">Student Coordinator</p>
            <a className="contact-link" href="tel:+917349320466" aria-label="Call Vishal Acharya at +91 73493 20466">+91 73493 20466</a>
          </article>

          <article className="contact-card">
            <h2 className="contact-name">Dr. Asha Vijay T</h2>
            <p className="contact-role">Faculty Coordinator</p>
            <a className="contact-link" href="tel:+919495747943" aria-label="Call Dr. Asha Vijay T at +91 94957 47943">+91 94957 47943</a>
          </article>

        </div>
      </div>

      <style>{`
        .contact-page { min-height: 100svh; padding: clamp(72px, 8vw, 120px) 1.25rem 2rem; display: grid; place-items: start center; color: #fff; }
        .contact-inner { width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 1.5rem; }
        .contact-header { text-align: left; }
        .contact-title { font-size: clamp(2rem, 7vw, 3.25rem); margin: 0 0 .3rem; font-weight: 900; letter-spacing: -0.02em; background: linear-gradient(92deg, #ffffff 0%, #bfe7ff 60%, #6bc1ff 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .contact-sub { margin: 0; opacity: 0.9; font-size: 1rem; }
  .contact-actions { margin-top: .9rem; }
  .contact-cta { display: inline-flex; align-items: center; gap: .5rem; color: #09111b; font-weight: 800; letter-spacing: .01em; text-decoration: none; padding: .6rem 1rem; border-radius: 12px; border: 1px solid rgba(191,231,255,0.6); background: linear-gradient(92deg, #bfe7ff, #6bc1ff); box-shadow: 0 6px 18px rgba(107,193,255,0.35), inset 0 1px 0 rgba(255,255,255,0.5); transition: transform .2s ease, filter .2s ease, box-shadow .2s ease; }
  .contact-cta:hover { transform: translateY(-1px); filter: brightness(1.05); box-shadow: 0 8px 22px rgba(107,193,255,0.48), inset 0 1px 0 rgba(255,255,255,0.6); }

        .contact-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; margin-top: .5rem; }
        .contact-card { grid-column: span 12; background: linear-gradient(180deg, rgba(13,17,26,0.65), rgba(13,17,26,0.45)); border: 1px solid rgba(107,193,255,0.22); border-radius: 16px; padding: 1.25rem; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06); }
        .contact-name { margin: 0 0 .25rem; font-size: clamp(1.2rem, 4.5vw, 1.6rem); font-weight: 800; letter-spacing: -0.01em; }
        .contact-role { margin: 0 0 .6rem; opacity: 0.82; }
        .contact-link { display: inline-block; color: #e8f6ff; text-decoration: none; font-weight: 700; letter-spacing: .01em; padding: .5rem .9rem; border-radius: 12px; border: 1px solid rgba(107,193,255,0.35); background: rgba(19,27,39,0.5); transition: transform .2s ease, background .2s ease, border-color .2s ease; }
        .contact-mail .contact-link { display: block; width: fit-content; margin-bottom: .5rem; }
        .contact-mail .contact-link:last-of-type { margin-bottom: 0; }
        .contact-link:hover { transform: translateY(-1px); background: rgba(19,27,39,0.7); border-color: rgba(107,193,255,0.65); color: #bfe7ff; }

        @media (min-width: 720px) {
          .contact-card { grid-column: span 6; }
          .contact-mail { grid-column: span 12; }
        }
      `}</style>
    </section>
  )
}

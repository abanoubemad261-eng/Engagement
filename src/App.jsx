import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Music2, VolumeX, ChevronDown } from 'lucide-react'

const EVENT_DATE = new Date('2026-09-05T19:00:00+03:00')

function App() {
  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(true)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  function getTimeLeft() {
    const diff = Math.max(0, EVENT_DATE.getTime() - Date.now())
    const total = Math.floor(diff / 1000)
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    }
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="site-shell">
      {!opened && (
        <motion.div
          className="opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="opening-glow" />
          <div className="opening-content">
            <p className="eyebrow">A little invitation to a beautiful beginning</p>
            <h1>Abanoub <span>&</span> Our Love</h1>
            <p className="opening-date">05 · 09 · 2026</p>
            <button className="primary-btn" onClick={() => setOpened(true)}>
              Open Invitation <Heart size={16} />
            </button>
          </div>
        </motion.div>
      )}

      <nav className="top-nav">
        <button onClick={() => scrollTo('home')} className="brand">A & ♥</button>
        <div className="nav-links">
          <button onClick={() => scrollTo('story')}>Our Story</button>
          <button onClick={() => scrollTo('event')}>The Day</button>
          <button onClick={() => scrollTo('gallery')}>Gallery</button>
        </div>
        <button className="music-btn" onClick={() => setMuted(!muted)} aria-label="Toggle music">
          {muted ? <VolumeX size={18} /> : <Music2 size={18} />}
        </button>
      </nav>

      <section id="home" className="hero section">
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow">Together with our families</p>
          <h1>We are getting<br /><em>engaged.</em></h1>
          <p className="hero-date">September 05, 2026</p>
          <button className="scroll-cue" onClick={() => scrollTo('story')}>
            <span>Discover our story</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </section>

      <section id="story" className="section paper story">
        <div className="section-inner narrow">
          <p className="eyebrow">Our story</p>
          <h2>One beautiful chapter,<br /><em>just beginning.</em></h2>
          <div className="divider"><span>♥</span></div>
          <p className="body-copy">
            Some stories are written quietly, one memory at a time.
            Ours brought two hearts together, and today we are happy to
            celebrate the beginning of a new chapter with the people we love.
          </p>
          <p className="script-note">Our dreams, together.</p>
        </div>
      </section>

      <section className="section quote">
        <div className="quote-card">
          <p className="eyebrow">A verse for our journey</p>
          <blockquote>
            “It is not good for the man to be alone.
            I will make a helper suitable for him.”
          </blockquote>
          <span>Genesis 2:18</span>
        </div>
      </section>

      <section id="event" className="section paper event">
        <div className="section-inner">
          <p className="eyebrow">Save the date</p>
          <h2>Meet us on<br /><em>our special day.</em></h2>

          <div className="countdown">
            {[
              ['Days', timeLeft.days],
              ['Hours', timeLeft.hours],
              ['Minutes', timeLeft.minutes],
              ['Seconds', timeLeft.seconds],
            ].map(([label, value]) => (
              <div className="count-item" key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="event-grid">
            <article>
              <span className="event-number">01</span>
              <h3>Prayer</h3>
              <p>St. George Church<br />Banha</p>
              <p className="small">A quiet prayer to begin our journey.</p>
            </article>
            <article>
              <span className="event-number">02</span>
              <h3>Celebration</h3>
              <p>Church Rooftop<br />Banha</p>
              <p className="small">Then we continue our joy together.</p>
            </article>
          </div>

          <button className="outline-btn">
            <MapPin size={16} /> View Location
          </button>
        </div>
      </section>

      <section id="gallery" className="section gallery">
        <div className="section-inner">
          <p className="eyebrow">Our memories</p>
          <h2>A few moments<br /><em>we love.</em></h2>
          <div className="gallery-grid">
            <div className="photo photo-a"><span>Our first memories</span></div>
            <div className="photo photo-b"><span>Always us</span></div>
            <div className="photo photo-c"><span>More to come</span></div>
          </div>
          <p className="gallery-note">Replace these placeholders with your own photos in <code>public/images</code>.</p>
        </div>
      </section>

      <section className="section final">
        <div className="final-content">
          <p className="eyebrow">With love</p>
          <h2>Abanoub <span>&</span> Your Name</h2>
          <p>05 · 09 · 2026</p>
          <div className="heart-line"><Heart size={16} fill="currentColor" /></div>
          <p className="small">Thank you for being part of our story.</p>
        </div>
      </section>

      <footer>Made with love · Our Engagement</footer>
    </main>
  )
}

export default App

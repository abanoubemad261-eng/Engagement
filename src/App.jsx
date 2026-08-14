import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Album, Camera, Heart, MapPin, MessageCircleHeart, Send, Volume2, VolumeX, X } from 'lucide-react'

const EVENT_DATE = new Date('2026-08-27T20:00:00+03:00')
const MAP_URL = 'https://maps.app.goo.gl/5ZTEqBQ7FyvxmEnp9?g_st=iw'

const navItems = [
  { id: 'album', label: 'Album', icon: Album },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'rsvp', label: 'RSVP', icon: Heart },
  { id: 'wishes', label: 'Wishes', icon: MessageCircleHeart },
]

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

function App() {
  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(true)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [active, setActive] = useState('home')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [wishes, setWishes] = useState(() => JSON.parse(localStorage.getItem('engy-wishes') || '[]'))
  const [wishName, setWishName] = useState('')
  const [wishText, setWishText] = useState('')
  const [rsvpName, setRsvpName] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const [guests, setGuests] = useState('1')
  const fileRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const sections = ['home', 'album', 'location', 'camera', 'rsvp', 'wishes']
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { threshold: [0.25, 0.55] })
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [opened])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSelectedPhoto(reader.result)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const downloadPhoto = () => {
    if (!selectedPhoto) return
    const image = new Image()
    image.onload = () => {
      const size = 1600
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      const scale = Math.max(size / image.width, size / image.height)
      const w = image.width * scale
      const h = image.height * scale
      ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h)
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = '#f5eee4'
      ctx.fillRect(0, 0, size, size)
      ctx.restore()
      const a = document.createElement('a')
      a.download = 'Abanoub-Engy-Engagement.png'
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    image.src = selectedPhoto
  }

  const submitWish = (e) => {
    e.preventDefault()
    if (!wishName.trim() || !wishText.trim()) return
    const next = [{ name: wishName.trim(), text: wishText.trim() }, ...wishes]
    setWishes(next)
    localStorage.setItem('engy-wishes', JSON.stringify(next))
    setWishName('')
    setWishText('')
  }

  const submitRsvp = (e) => {
    e.preventDefault()
    if (!rsvpName.trim()) return
    localStorage.setItem('engy-rsvp', JSON.stringify({ name: rsvpName, attendance, guests }))
    alert('Thank you for your response ❤️')
    setRsvpName('')
  }

  return (
    <main className="site-shell">
      {!opened && (
        <motion.div className="opening" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="opening-glow" />
          <div className="opening-content">
            <p className="eyebrow">A little invitation to a beautiful beginning</p>
            <h1>Abanoub <span>&</span> Engy</h1>
            <p className="opening-subtitle">IT'S OUR ENGAGEMENT</p>
            <p className="opening-date">THURSDAY · 27 AUGUST 2026</p>
            <button className="primary-btn" onClick={() => setOpened(true)}>Open Invitation <Heart size={16} /></button>
          </div>
        </motion.div>
      )}

      <nav className="top-nav">
        <button onClick={() => scrollTo('home')} className="brand">A & E</button>
        <div className="nav-title">OUR ENGAGEMENT</div>
        <button className="music-btn" onClick={() => setMuted(!muted)} aria-label="Toggle music">
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </nav>

      <section id="home" className="hero section">
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow">Together with our families</p>
          <h1>Abanoub <span>&</span><br /><em>Engy</em></h1>
          <p className="hero-date">IT'S OUR ENGAGEMENT · 27 AUGUST 2026</p>
          <div className="home-countdown">
            {Object.entries(timeLeft).map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}
          </div>
          <button className="scroll-cue" onClick={() => scrollTo('album')}>Scroll to our story <span>↓</span></button>
        </div>
      </section>

      <section id="album" className="section paper album-section">
        <div className="section-inner">
          <p className="eyebrow">Album</p>
          <h2>Our story,<br /><em>in moments.</em></h2>
          <div className="story-grid">
            <div className="story-placeholder large"><span>Your Photo 01</span></div>
            <div className="story-placeholder"><span>Your Photo 02</span></div>
            <div className="story-placeholder"><span>Your Photo 03</span></div>
            <div className="story-placeholder wide"><span>Your Photo 04</span></div>
          </div>
          <p className="gallery-note">Your 4–5 personal photos will be uploaded here from your Admin page.</p>
        </div>
      </section>

      <section id="location" className="section location-section">
        <div className="section-inner narrow">
          <p className="eyebrow">The day</p>
          <h2>Meet us at<br /><em>St. George.</em></h2>
          <div className="event-card">
            <span>THURSDAY · 27 AUGUST 2026</span>
            <h3>8:00 PM</h3>
            <p>ST. GEORGE CHURCH<br />BANHA</p>
            <div className="event-divider" />
            <p>CELEBRATION<br /><strong>ST. GEORGE CHURCH ROOFTOP</strong><br />BANHA</p>
            <a className="outline-btn" href={MAP_URL} target="_blank" rel="noreferrer"><MapPin size={16} /> Open Location</a>
          </div>
        </div>
      </section>

      <section id="camera" className="section camera-section">
        <div className="section-inner">
          <p className="eyebrow">Create your memory</p>
          <h2>Take a photo<br /><em>with our frame.</em></h2>
          <div className="frame-stage">
            <div className="frame-photo">{selectedPhoto ? <img src={selectedPhoto} alt="Your memory" /> : <div className="frame-empty">Your photo<br />goes here</div>}</div>
            <div className="frame-ring">
              <div className="frame-top">IT'S OUR ENGAGEMENT</div>
              <div className="frame-icons">♡　◇　♡</div>
              <div className="frame-bottom">ABANOUB <span>&</span> ENGY</div>
              <div className="frame-date">THURSDAY · 27 AUGUST 2026</div>
            </div>
          </div>
          <div className="camera-actions">
            <button className="primary-btn" onClick={() => fileRef.current?.click()}><Camera size={16} /> Take Photo</button>
            <button className="outline-btn light" onClick={() => fileRef.current?.click()}>Choose from Gallery</button>
            {selectedPhoto && <button className="download-btn" onClick={downloadPhoto}>Download Framed Photo</button>}
          </div>
          <input ref={fileRef} hidden type="file" accept="image/*" capture="user" onChange={handlePhoto} />
          <p className="camera-note">Your photo stays on your device until you choose to download it.</p>
        </div>
      </section>

      <section id="rsvp" className="section paper rsvp-section">
        <div className="section-inner narrow">
          <p className="eyebrow">RSVP</p>
          <h2>Will you<br /><em>join us?</em></h2>
          <form className="invite-form" onSubmit={submitRsvp}>
            <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Your name" required />
            <div className="choice-row"><button type="button" className={attendance === 'yes' ? 'choice active' : 'choice'} onClick={() => setAttendance('yes')}>Yes, I'll be there</button><button type="button" className={attendance === 'no' ? 'choice active' : 'choice'} onClick={() => setAttendance('no')}>Sorry, I can't</button></div>
            <select value={guests} onChange={e => setGuests(e.target.value)}><option value="1">1 Guest</option><option value="2">2 Guests</option><option value="3">3 Guests</option><option value="4">4 Guests</option></select>
            <button className="primary-btn dark" type="submit">Confirm RSVP <Send size={15} /></button>
          </form>
        </div>
      </section>

      <section id="wishes" className="section wishes-section">
        <div className="section-inner narrow">
          <p className="eyebrow">A little love from you</p>
          <h2>Leave us<br /><em>a wish.</em></h2>
          <form className="invite-form wishes-form" onSubmit={submitWish}>
            <input value={wishName} onChange={e => setWishName(e.target.value)} placeholder="Your name" required />
            <textarea value={wishText} onChange={e => setWishText(e.target.value)} placeholder="Write your wish for Abanoub & Engy..." rows="4" required />
            <button className="primary-btn dark" type="submit">Send Your Wish <MessageCircleHeart size={15} /></button>
          </form>
          <div className="wishes-list">{wishes.slice(0, 12).map((wish, i) => <article key={i}><Heart size={14} fill="currentColor" /><p>“{wish.text}”</p><span>— {wish.name}</span></article>)}</div>
        </div>
      </section>

      <section className="section final">
        <div className="final-content">
          <p className="eyebrow">Why we invited you</p>
          <h2>Be part of<br /><em>our beginning.</em></h2>
          <p className="final-message">We don't want you to simply attend our engagement.<br />We want you to be part of the beginning of our story.</p>
          <div className="heart-line"><Heart size={16} fill="currentColor" /></div>
          <h3>Abanoub & Engy</h3>
          <p>27 · 08 · 2026</p>
        </div>
      </section>

      <div className="bottom-nav">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'active' : ''} onClick={() => scrollTo(id)}><Icon size={19} /><span>{label}</span></button>)}
      </div>
      <footer>Made with love · Abanoub & Engy</footer>
    </main>
  )
}

export default App

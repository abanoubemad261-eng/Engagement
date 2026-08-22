import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Memories from './Memories'
import './styles.css'
import './opening.css'
import './home.css'
import './location.css'
import './wishes-private.css'
import './final.css'
import './camera-touch-lock.js'
import './camera-overrides.css'
import './photo-crop-fix.js'
import './memory-wall.css'
import './memory-wall-limit.js'
import './memories-return-camera.js'
import './bottom-nav-fix.css'

const Root=location.pathname==='/memories'?<Memories/>:<App/>
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {Root}
  </React.StrictMode>
)

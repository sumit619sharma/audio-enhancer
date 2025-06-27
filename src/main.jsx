import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { VideoProvider } from './context/VideoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VideoProvider>
        <App />
      </VideoProvider>
    </BrowserRouter>
  </StrictMode>,
)
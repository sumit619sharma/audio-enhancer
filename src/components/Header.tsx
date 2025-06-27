import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="logo-link">
            VoiceSwap
          </Link>
        </motion.div>
        
        <motion.nav 
          className="nav"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link to="/" className="nav-link">Upload</Link>
          <Link to="/videoeditor" className="nav-link">Video Editor</Link>
          <Link to="/results" className="nav-link">Results</Link>
        </motion.nav>
      </div>
    </header>
  )
}

export default Header
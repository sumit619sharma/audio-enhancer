import { motion } from 'framer-motion'
import Header from './Header'
import { useVideo } from '../context/VideoContext'

function Layout({ children }) {
  const { error } = useVideo()

  return (
    <div className="app-container">
      <Header />
      
      {error && (
        <motion.div 
          className="error-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--color-error)',
            color: 'white',
            padding: 'var(--space-2)',
            textAlign: 'center',
          }}
        >
          {error}
        </motion.div>
      )}
      
      <main className="content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default Layout
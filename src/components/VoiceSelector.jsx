import { motion } from 'framer-motion'
import { useVideo } from '../context/VideoContext'
import './VoiceSelector.css'

function VoiceSelector() {
  const { selectedVoice, setSelectedVoice } = useVideo()
  
  const voices = [
    { id: 'male', name: 'Male', description: 'Deep male voice' },
    { id: 'female', name: 'Female', description: 'Clear female voice' },
    { id: 'neutral', name: 'Neutral', description: 'Gender-neutral voice' },
    { id: 'british', name: 'British', description: 'British accent' },
    { id: 'american', name: 'American', description: 'American accent' },
  ]
  
  return (
    <div className="voice-selector-container">
      <h3 className="voice-selector-title">Select Voice</h3>
      
      <div className="voices-grid">
        {voices.map((voice) => (
          <motion.div 
            key={voice.id}
            className={`voice-option ${selectedVoice === voice.id ? 'selected' : ''}`}
            onClick={() => setSelectedVoice(voice.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="voice-content">
              <h4 className="voice-name">{voice.name}</h4>
              <p className="voice-description">{voice.description}</p>
            </div>
            
            <div className="voice-check-container">
              <div className={`voice-check ${selectedVoice === voice.id ? 'checked' : ''}`}>
                {selectedVoice === voice.id && (
                  <motion.div 
                    className="voice-check-inner"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default VoiceSelector
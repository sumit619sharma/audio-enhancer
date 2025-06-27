import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiArrowLeft } from 'react-icons/fi'
import VideoPlayer from '../components/VideoPlayer'
import TranscriptViewer from '../components/TranscriptViewer'
import VoiceSelector from '../components/VoiceSelector'
import ProcessingIndicator from '../components/ProcessingIndicator'
import { useVideo } from '../context/VideoContext'
import './ResultsPage.css'

function ResultsPage() {
  const navigate = useNavigate()
  const { 
    videoUrl, 
    videoFile, 
    transcript, 
    voiceoverProcessing, 
    voiceoverApplied,
    refreshVoiceover 
  } = useVideo()
  
  // Redirect if no video or transcript
  if (!videoUrl && !videoFile) {
    navigate('/')
    return null
  }
  
  return (
    <div className="results-page">
      <motion.div 
        className="page-header with-back"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <FiArrowLeft />
          <span>Back to Upload</span>
        </button>
        
        <div className="header-content">
          <h1>Video Results</h1>
          <p className="page-description">
            {voiceoverApplied 
              ? 'Your video has been processed with a new voiceover.'
              : 'Your video has been processed. You can view the transcript and change the voiceover.'}
          </p>
        </div>
      </motion.div>
      
      <div className="results-container">
        <div className="video-section">
          <VideoPlayer 
            src={videoUrl} 
            title={videoFile?.name} 
          />
        </div>
        
        <div className="transcript-section">
          {transcript ? (
            <TranscriptViewer transcript={transcript} />
          ) : (
            <div className="no-transcript">
              <p>No transcript available. Process the video first.</p>
            </div>
          )}
        </div>
        
        <div className="voiceover-section">
          {transcript && (
            <>
              <div className="section-header">
                <h2>Voice Replacement</h2>
                <p className="section-description">
                  Choose a voice style and refresh the voiceover to apply it to your video.
                </p>
              </div>
              
              {/* <VoiceSelector /> */}
              
              {voiceoverProcessing ? (
                <ProcessingIndicator text="Applying new voiceover. This may take a few moments..." />
              ) : (
                <motion.button
                  className="btn btn-primary btn-icon"
                  onClick={refreshVoiceover}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FiRefreshCw />
                  <span>Refresh Voiceover</span>
                </motion.button>
              )}
              
              {voiceoverApplied && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>✅ New voiceover has been applied successfully!</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
import { motion } from 'framer-motion'
import './TranscriptViewer.css'

function TranscriptViewer({ sheetLink }) {
  if (!sheetLink) return null;

  // Convert the sheet link to an embed URL and ensure it's editable
  const embedUrl = `${sheetLink}/edit?embedded=true&rm=minimal`;

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h3 className="transcript-title">Transcript</h3>
      </div>
      
      <motion.div 
        className="transcript-content-wrapper"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="transcript-instructions">
          <h4 className="instructions-title">Instructions:</h4>
          <ol className="instructions-list">
            <li>Edit the transcript directly in the embedded sheet below</li>
            <li>Click the "Refresh Voiceover" button below to update the video with your edited transcript</li>
          </ol>
        </div>
        
        <div className="sheets-embed-container">
          <iframe 
            className="sheets-embed"
            src={embedUrl}
            title="Transcript Editor"
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default TranscriptViewer
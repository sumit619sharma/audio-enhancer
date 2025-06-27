import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiRefreshCw } from 'react-icons/fi'
import { FaDownload } from 'react-icons/fa';
import VideoUploader from '../components/VideoUploader'
import VideoPlayer from '../components/VideoPlayer'
import TranscriptViewer from '../components/TranscriptViewer'
import VoiceSelector from '../components/VoiceSelector'
import ProcessingIndicator from '../components/ProcessingIndicator'
import { useVideo } from '../context/VideoContext'
import './ProcessingPage.css'

function ProcessingPage() {
  const { 
    videoFile, 
    videoUrl,
    processedVideoUrl,
    processing,
    transcript,
    voiceoverProcessing,
    voiceoverApplied,
    processVideo,
    refreshVoiceover,
    sheetLink,
    newVideoLink,
    sheetId, 
    refreshVoice
  } = useVideo()

  const videoSectionRef = useRef(null)
  const transcriptSectionRef = useRef(null)
  const finalVideoSectionRef = useRef(null)

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
    }, 300) // Wait for animation to start
  }

  const handleProcessVideo = async () => {
    
    await processVideo()
    scrollToSection(videoSectionRef)
  }

  const handleVoiceoverRefresh = async () => {
     await refreshVoiceover()
    // await refreshVoice(sheetId);
    scrollToSection(finalVideoSectionRef)
  }

  // Ensure proper initial scroll position
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      height: 0,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -50,
      height: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="processing-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Video Voice Changer</h1>
        <p className="page-description">
          Transform your video's voice in three simple steps: Upload, Edit, and Transform
        </p>
      </motion.div>

      <div className="content-sections">
        <motion.section 
          className="step-section upload-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="step-header">
            <div className="step-number">1</div>
            <div>
              <h2>Upload Your Video</h2>
              <p className="section-description">Select a video file to begin the transformation</p>
            </div>
          </div>
          
          <VideoUploader />
          
          {processing ? (
            <ProcessingIndicator text="Processing your video. This may take a few moments..." />
          ) : (
            <motion.button
              className={`btn btn-primary btn-icon ${!videoFile ? 'btn-disabled' : ''}`}
              disabled={!videoFile || processing}
              onClick={handleProcessVideo}
              whileHover={videoFile && !processing ? { scale: 1.02 } : {}}
              whileTap={videoFile && !processing ? { scale: 0.98 } : {}}
            >
              <FiUpload />
              <span>Process Video</span>
            </motion.button>
          )}
        </motion.section>

        <AnimatePresence mode="wait">
          {processedVideoUrl && (
            <motion.section 
              ref={videoSectionRef}
              className="step-section video-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="step-header">
                <div className="step-number">2</div>
                <div className='video-header'>
                <div>
                  <h2>Preview & Edit</h2>
                  <p className="section-description">Review your video and edit the transcript</p>
                </div>
                <div>
                <a
                  href={processedVideoUrl}
                  download="video.mp4"
                  className="download-link"
                  title="Download Video"
                >
                  <FaDownload />
                </a>
                </div>
                </div>
              </div>
              
              <VideoPlayer src={processedVideoUrl} title="Original Video" />
              
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TranscriptViewer sheetLink={sheetLink} />
                </motion.div>
              )}
            </motion.section>
          )}

          {transcript && (
            <motion.section 
              ref={transcriptSectionRef}
              className="step-section voice-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="step-header">
                <div className="step-number">3</div>
                <div>
                  <h2>Transform Voice</h2>
                  <p className="section-description">Choose a new voice style and generate your video</p>
                </div>
              </div>
              
              <VoiceSelector />
              
              {voiceoverProcessing ? (
                <ProcessingIndicator text="Applying new voiceover. This may take a few moments..." />
              ) : (
                <motion.button
                  className="btn btn-primary btn-icon"
                  onClick={handleVoiceoverRefresh}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiRefreshCw />
                  <span>Generate Video</span>
                </motion.button>
              )}
            </motion.section>
          )}

          {voiceoverApplied && (
            <motion.section
              ref={finalVideoSectionRef}
              className="step-section final-video-section"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >

             <div className="step-header">
                <div className="step-number">✨</div>
                <div className='video-header'>
                <div>
                  <h2>Final Result</h2>
                  <p className="section-description">Here's your video with the new voice!</p>
                </div>
                <div>
                <a
                  href={processedVideoUrl}
                  download="video.mp4"
                  className="download-link"
                  title="Download Video"
                >
                  <FaDownload />
                </a>
                </div>
                </div>
              </div>
              
              <VideoPlayer src={processedVideoUrl} title="Transformed Video" />
              
              <div className="success-message">
                <p>✨ Voice transformation complete! You can generate another version by selecting a different voice above.</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProcessingPage
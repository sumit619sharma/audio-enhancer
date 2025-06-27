import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi'
import './VideoPlayer.css'

function VideoPlayer({ src, title }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    
    if (!video || !src) return
    
    const handleLoadedData = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }
    
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [src])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return
    
    const seekPosition = e.nativeEvent.offsetX / e.target.clientWidth
    const seekTime = seekPosition * duration
    
    video.currentTime = seekTime
    setCurrentTime(seekTime)
    setProgress(seekPosition * 100)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return
    
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
    
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen()
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="video-player-container">
      {title && <h3 className="video-title">{title}</h3>}
      
      <div className="video-wrapper">
        {isLoading && (
          <div className="video-loading">
            <div className="spinner"></div>
            <p>Loading video...</p>
          </div>
        )}
        
        <video 
          ref={videoRef}
          src={src}
          className="video-element"
          onClick={togglePlay}
          playsInline
        />
        
        <motion.div 
          className="video-controls"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="progress-container" onClick={handleSeek}>
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="controls-row">
            <button 
              className="control-button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            <div className="volume-container">
              <button 
                className="control-button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Volume"
              />
            </div>
            
            <button 
              className="control-button"
              onClick={handleFullscreen}
              aria-label="Fullscreen"
            >
              <FiMaximize />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VideoPlayer
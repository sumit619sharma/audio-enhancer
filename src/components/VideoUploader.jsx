import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { useVideo } from '../context/VideoContext'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'
import './VideoUploader.css'

function VideoUploader() {
  const { videoFile, handleVideoUpload, resetAll } = useVideo()
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (file.type.startsWith('video/')) {
        handleVideoUpload(file)
      } else {
        alert('Please upload a valid video file')
      }
    }
  }, [handleVideoUpload])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    multiple: false
  })
  
  return (
    <div className="uploader-container">
      {!videoFile ? (
        <motion.div 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          
          <div className="dropzone-content">
            <motion.div 
              className="upload-icon"
              animate={{ scale: isDragActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <FiUpload size={48} />
            </motion.div>
            
            <h3 className="upload-title">
              {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
            </h3>
            
            <p className="upload-subtitle">or click to browse files</p>
            
            <p className="upload-formats">Supports: MP4, WebM, MOV (max 500MB)</p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="file-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="file-info">
            <div className="file-icon">
              <FiFile size={32} />
            </div>
            
            <div className="file-details">
              <p className="file-name">{videoFile.name}</p>
              <p className="file-size">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          
          <button 
            className="remove-file" 
            onClick={(e) => {
              e.stopPropagation()
              resetAll()
            }}
            aria-label="Remove file"
          >
            <FiX size={24} />
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default VideoUploader
import { createContext, useState, useContext } from 'react'
import axios from 'axios'
const VideoContext = createContext()

export function VideoProvider({ children }) {
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null)
  const [transcript, setTranscript] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [voiceoverProcessing, setVoiceoverProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [voiceoverApplied, setVoiceoverApplied] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('male')
  const [sheetLink, setSheetLink] = useState("");
  const [segments, setSegments] = useState([]);
  const [newVideoLink, setNewVideoLink] = useState(""); // Field 5
  const [sheetId, setSheetId] = useState(""); // Field 6
  const [backendUrl, setBackendUrl] = useState("https://audioenhancerapi.realtyai.in")


  const handleVideoUpload = (file) => {
    try {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setProcessedVideoUrl(null)
      setTranscript(null)
      setVoiceoverApplied(false)
      setError(null)
    } catch (err) {
      setError('Error uploading video: ' + err.message)
      console.error(err)
    }
  }

  const refreshVoice = async (id,segments, first) => {
    try {
     console.log("refreshing voiceover: ", id );
  
     if (!id) return alert("No Google Sheet available.");
   
     // START ************************************
    //  let diffs =[]
    // let updated = segments;
    // if(first) {
    //   diffs = segments.map((s,i)=> i);
    // } else {
    //    // re-fetch current sheet to compare
    //   let { segments: updated } = await fetch(`http://13.200.81.38/fetch-segments?sheetId=${id}`).then((r) => r.json());
    //   updated = updated;
    // // detect only changed rows by comparing refined scripts
    //  diffs = updated
    //   .map((u, i) =>
    //     u.refined !== segments[i].refined ? i : -1
    //   )
    //   .filter((idx) => idx >= 0);      
    // }

    // END ********************************************

    // call backend with only changed indices
    const refreshRes = await axios.post(`${backendUrl}/refresh-voiceover?sheetId=${id}`, {
      // changedIndices: diffs,
      // sheetId: id
    });
    
console.log("Refresh resp: ", refreshRes);
    // we might receive s3 vdeio url , based on that will update it later
    // const blob = await refreshRes?.blob();
    // const url = URL.createObjectURL(refreshRes);
    // console.log("video URL: ", url);
    // setNewVideoLink(url);
  //  setSegments(updated); // update cache

  setProcessedVideoUrl(refreshRes.data.Final_s3_url); // set new video URL
    
  } catch (error) {
      console.error('Error refreshing voiceover:', error);
      setError('Error refreshing voiceover: ' + error.message);    
    }
  }
  
  const getSegments = async (id) => {
    console.log("fetching segments for: ", id);
     // Fetch the sheet contents to cache original segments
    const sheetRes = await fetch(`${backendUrl}/fetch-segments?sheetId=${id}`);
    const sheetJson = await sheetRes.json();
    console.log("segments: ", sheetJson);
    setSegments(sheetJson.segments); // [{ start,end,original,refined }]
    return sheetJson.segments;
  }
  
  const uploadVideoAndGetSheetId = async () => {
    const form = new FormData();
    form.append("file", videoFile);
    const res = await fetch(`${backendUrl}/process-video`,
      { method: "POST", body: form }
    );
    const json = await res.json();
    console.log('spreadSheet Id: ', json);
    const id = json.spreadsheetId;
    const link = `https://docs.google.com/spreadsheets/d/${id}`;
    setSheetId(id);
    setSheetLink(link);
    return id;
  }
  
  const processVideo = async () => {
    if (!videoFile) {
      setError('Please upload a video first')
      return
    }
      
    try {
      setProcessing(true)
      setError(null)
      
      // Simulate processing with timeout
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const id = await uploadVideoAndGetSheetId();
      // const seg = await getSegments(id);
      await refreshVoice(id, segments,true);
      
      // Mock transcript generation
      const mockTranscript = `This is a sample transcript for the video "${videoFile.name}". 
      In a real application, this would be the actual transcription of the audio 
      from the video.`
      
      setTranscript(mockTranscript)
      // setProcessedVideoUrl(videoUrl)
      setProcessing(false)
    } catch (err) {
      setProcessing(false)
      setError('Error processing video: ' + err.message)
      console.error(err)
    }
  }

  const refreshVoiceover = async () => {
    if (!transcript) {
      setError('No transcript available. Process the video first.')
      return
    }

    try {
      setVoiceoverProcessing(true)
      setVoiceoverApplied(false);
      setError(null)
      
      // Simulate processing with timeout
      // await new Promise(resolve => setTimeout(resolve, 2500))
      
      // In a real app, this would be a new video URL with the updated voiceover
      await refreshVoice(sheetId);
     
      // setProcessedVideoUrl(videoUrl)
      setVoiceoverApplied(true)
      setVoiceoverProcessing(false)
    } catch (err) {
      setVoiceoverProcessing(false)
      setError('Error refreshing voiceover: ' + err.message)
      console.error(err)
    }
  }

  const resetAll = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    if (processedVideoUrl && processedVideoUrl !== videoUrl) {
      URL.revokeObjectURL(processedVideoUrl)
    }
    setVideoFile(null)
    setVideoUrl(null)
    setProcessedVideoUrl(null)
    setTranscript(null)
    setProcessing(false)
    setVoiceoverProcessing(false)
    setError(null)
    setVoiceoverApplied(false)
  }

  const value = {
    videoFile,
    videoUrl,
    processedVideoUrl,
    transcript,
    processing,
    voiceoverProcessing,
    error,
    voiceoverApplied,
    selectedVoice,
    setSelectedVoice,
    handleVideoUpload,
    processVideo,
    refreshVoiceover,
    resetAll,
    sheetLink,
    newVideoLink,
    sheetId,
    refreshVoice,
  }

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}
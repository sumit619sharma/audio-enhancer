import { Routes, Route } from 'react-router-dom'
import ProcessingPage from './pages/ProcessingPage'
import NotFoundPage from './pages/NotFoundPage'
import VideoEditorPage from './pages/VideoEditorPage'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProcessingPage />} />
        <Route path="/videoeditor" element={<VideoEditorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
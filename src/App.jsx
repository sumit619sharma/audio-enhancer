import { Routes, Route } from 'react-router-dom'
import ProcessingPage from './pages/ProcessingPage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProcessingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
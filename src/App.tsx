import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import SettingsPage from './pages/SettingsPage'
import TopicPage from './pages/TopicPage'
import TrackPage from './pages/TrackPage'
import WrongPage from './pages/WrongPage'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track/:trackId" element={<TrackPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/result" element={<ResultPage />} />
        <Route path="/wrong" element={<WrongPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

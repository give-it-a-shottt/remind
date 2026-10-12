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
  // 블록으로 감싸 반환값을 버린다. scrollTo를 덮어쓰는 확장 프로그램이 값을 돌려주면
  // React가 그 값을 cleanup 함수로 호출해 "is not a function" 에러가 난다
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
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

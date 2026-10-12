import { topics, tracks } from './data'

export default function App() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">remind</h1>
      <p className="mt-2 text-sm text-gray-500">UI는 피그마 디자인 확정 후 구현 예정</p>
      <ul className="mt-6 space-y-1">
        {tracks.map((t) => (
          <li key={t.id}>
            {t.emoji} {t.label} — {topics.filter((x) => x.track === t.id).length}개 토픽
          </li>
        ))}
      </ul>
    </main>
  )
}

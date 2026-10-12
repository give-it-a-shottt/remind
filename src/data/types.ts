export type Track = 'frontend' | 'backend' | 'design'

interface QuestionBase {
  /** 고정 ID. 한 번 정하면 바꾸지 않는다 (학습 기록이 이 ID에 묶임) */
  id: string
  /** 노션 원문에서의 위치 (소제목). 커버리지 검사에 사용 */
  source: string
  question: string
  /** 문제와 함께 보여줄 코드 */
  code?: string
  explanation: string
}

export interface McqQuestion extends QuestionBase {
  type: 'mcq'
  choices: string[]
  /** choices 의 정답 인덱스 */
  answer: number
}

export interface OxQuestion extends QuestionBase {
  type: 'ox'
  answer: boolean
}

export interface ShortQuestion extends QuestionBase {
  type: 'short'
  /** 허용 정답들 (공백·대소문자 무시하고 비교) */
  answer: string[]
}

export interface EssayQuestion extends QuestionBase {
  type: 'essay'
  /** 모범 답안 — 사용자가 보고 스스로 채점 */
  answer: string
  keywords?: string[]
}

export type Question = McqQuestion | OxQuestion | ShortQuestion | EssayQuestion

export interface Topic {
  /** URL 에 쓰이는 고정 slug */
  id: string
  track: Track
  /** 트랙 안의 묶음 (예: 'HTML/CSS', 'Python', 'Flask') */
  group: string
  title: string
  order: number
  /** 원본 노션 페이지 ID (자체 작성 콘텐츠면 생략) */
  notionId?: string
  /** 노션 원문의 소제목 목록 — 모든 소제목에 문제가 1개 이상 있어야 함 */
  sections: string[]
  questions: Question[]
}

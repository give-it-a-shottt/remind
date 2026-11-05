export type Track = 'frontend' | 'backend' | 'fullstack' | 'react'

interface QuestionBase {
  /** 고정 ID. 한 번 정하면 바꾸지 않는다 (학습 기록이 이 ID에 묶임) */
  id: string
  /** 노션 원문에서의 위치 (소제목). 커버리지 검사에 사용 */
  source: string
  question: string
  /** 문제와 함께 보여줄 코드 */
  code?: string
  /** 정답 해설 (필수) — 왜 이게 정답인지 노트 내용을 근거로 설명 */
  explanation: string
}

export interface McqQuestion extends QuestionBase {
  type: 'mcq'
  choices: string[]
  /** choices 의 정답 인덱스 */
  answer: number
  /** 선택지별 설명 (choices 와 같은 길이) — 오답이 왜 틀렸는지 */
  choiceExplanations?: string[]
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

/**
 * 레슨 슬라이드 안의 블록. 글자 안에서 **굵게**, `코드` 를 쓸 수 있다.
 * - say: 선생님이 말로 설명하는 문단 (레슨의 기본)
 * - ask: 선생님이 던지는 질문 — 탭하면 답이 열린다
 * - note: 비유·팁·주의 박스
 */
export type Block =
  | { type: 'say'; text: string }
  | { type: 'ask'; q: string; a: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; code: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'note'; tone: 'analogy' | 'tip' | 'warn'; text: string }

/** 레슨에서 한 장씩 넘겨 보는 설명 카드 */
export interface Slide {
  title?: string
  blocks: Block[]
}

/** 문제 풀기 전에 읽는 개념 설명 — 노션 소제목 하나에 대응 */
export interface Section {
  /** 노션 원문 소제목. 문제의 source 와 같은 문자열 */
  title: string
  /** 핵심 설명 (짧은 문장 여러 개) — 복습형 트랙 */
  points?: string[]
  /** 넘겨 보는 수업 카드 — 레슨형 트랙. 다 넘기면 이 개념의 문제가 바로 나온다 */
  slides?: Slide[]
  /** 대표 예시 코드 */
  code?: string
  /** 이 섹션의 원본 노션 하위 페이지 ID들 (파일별 하위 페이지를 섹션으로 묶은 경우) */
  notionIds?: string[]
}

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
  /** 주간 업데이트로 새로 추가된 날짜 (YYYY-MM-DD). 최초 일괄 생성분은 생략 */
  addedAt?: string
  /** 주간 업데이트로 내용이 바뀐 날짜 (YYYY-MM-DD) */
  updatedAt?: string
  /** updatedAt 때 바뀐 섹션 title 목록 */
  changedSections?: string[]
  /** 개념 설명 — 모든 섹션에 문제가 1개 이상, 모든 문제의 source 는 섹션 title 중 하나 */
  sections: Section[]
  questions: Question[]
}

export type Track = 'frontend' | 'backend' | 'design' | 'project'

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

/** 문제 풀기 전에 읽는 개념 설명 — 노션 소제목 하나에 대응 */
export interface Section {
  /** 노션 원문 소제목. 문제의 source 와 같은 문자열 */
  title: string
  /** 핵심 설명 (짧은 문장 여러 개) */
  points: string[]
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

import type { Question, Section, Slide, Topic } from '../data/types'

/** 레슨 한 단계: 수업 카드 한 장, 또는 확인 문제 하나 */
export type LessonStep =
  | { kind: 'slide'; section: Section; sectionNo: number; slide: Slide; no: number; count: number }
  | { kind: 'quiz'; section: Section; sectionNo: number; q: Question; no: number; count: number }

/** 개념 카드들 → 그 개념의 확인 문제들 → 다음 개념 … 순서로 편다 */
export function lessonSteps(topic: Topic): LessonStep[] {
  return topic.sections.flatMap((section, si) => {
    const slides = section.slides ?? []
    const qs = topic.questions.filter((q) => q.source === section.title)
    return [
      ...slides.map((slide, i): LessonStep => ({ kind: 'slide', section, sectionNo: si + 1, slide, no: i + 1, count: slides.length })),
      ...qs.map((q, i): LessonStep => ({ kind: 'quiz', section, sectionNo: si + 1, q, no: i + 1, count: qs.length })),
    ]
  })
}

/** i 이전의 가장 가까운 카드 (이미 푼 문제는 건너뛴다). 없으면 -1 */
export function prevSlide(steps: LessonStep[], i: number): number {
  let j = i - 1
  while (j >= 0 && steps[j].kind === 'quiz') j--
  return j
}

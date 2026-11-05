import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-03-4-detail-404',
  track: 'fullstack',
  group: '03. FastAPI와 DB 연결',
  title: '3-4. 강의 상세 API: 경로 파라미터와 404',
  order: 304,
  notionId: '40cdf951bf80806ebbdce74ce0ba200c',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '/courses/{course_id}',
      slides: [
        {
          title: '강의 하나 가져오기',
          blocks: [
            { type: 'say', text: '3장 마지막 수업이에요. 목록에서 강의를 누르면 들어갈 **상세 API** `GET /courses/3`을 만들어요.' },
            {
              type: 'code',
              code: `from fastapi import HTTPException

@app.get("/courses/{course_id}", response_model=CourseOut)   # 하나니까 list가 아님
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)        # 기본 키로 바로 찾기
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course`,
            },
            {
              type: 'list',
              items: [
                '`{course_id}`: 1-2에서 배운 **경로 파라미터**. 함수 인자 이름과 **같아야** 해요',
                '`db.get(Course, 3)`: 기본 키(2-4)로 한 행을 찾아요. 없으면 `None`',
                '응답 모델이 `CourseOut` 하나 → 본문이 `{ }` (1-1: 하나는 객체)',
              ],
            },
          ],
        },
      ],
    },
    {
      title: '없으면 404를 직접 던지기',
      slides: [
        {
          title: 'None을 그대로 돌려주면',
          blocks: [
            { type: 'ask', q: 'if course is None 검사를 빼고 그냥 return course 하면, /courses/99999 는 어떻게 될까요?', a: '`None`을 돌려주게 되는데, 응답 모델은 `CourseOut`(id·title이 필수)이라 맞지 않아요. 그래서 **500 서버 에러**가 나요.\n그런데 이건 서버 잘못이 아니라 "**없는 강의를 요청했다**"는 거잖아요. 1-1에서 배운 대로라면 **404**가 맞아요. 상태 코드가 틀리면 프론트가 "서버가 고장 났다"고 잘못 판단해요.' },
            { type: 'say', text: '`raise HTTPException(status_code=404, detail="...")`은 "여기서 처리를 멈추고 **이 상태 코드와 설명**으로 응답해 줘"예요. 응답 본문은 1-1에서 본 `{"detail": "Course not found"}` 모양이 돼요.' },
          ],
        },
        {
          title: '상태 코드를 정확하게',
          blocks: [
            {
              type: 'table',
              head: ['상황', '알맞은 코드', '누가 만드나'],
              rows: [
                ['강의 3번 있음', '200', 'FastAPI 기본'],
                ['강의 99999번 없음', '**404**', '우리가 `HTTPException`으로'],
                ['`/courses/abc` (숫자가 아님)', '**422**', 'FastAPI가 자동 (`course_id: int` 때문에)'],
                ['DB가 꺼져서 조회 실패', '500', '처리 안 된 예외 → FastAPI 기본'],
              ],
            },
            { type: 'note', tone: 'tip', text: '`course_id: int`라는 **타입 힌트** 하나로 FastAPI가 "abc"를 받으면 함수를 실행하지도 않고 422를 돌려줘요. 3-3의 요청 모델 검사와 같은 원리예요. 숫자로 바꾸는 일과 검사를 FastAPI가 대신 해요.' },
          ],
        },
      ],
    },
    {
      title: '경로 순서 함정',
      slides: [
        {
          title: '/courses/search 가 안 돼요',
          blocks: [
            { type: 'say', text: '강의 검색 API `GET /courses/search?q=파이썬`을 추가했는데, 이상하게 422 에러가 나요.' },
            {
              type: 'code',
              code: `@app.get("/courses/{course_id}")     # ① 먼저 등록
def get_course(course_id: int, ...): ...

@app.get("/courses/search")          # ② 나중에 등록
def search_courses(q: str, ...): ...`,
            },
            { type: 'ask', q: '/courses/search 요청은 왜 ②가 아니라 ①로 갔을까요?', a: 'FastAPI는 등록된 **순서대로** 경로를 맞춰 봐요. ①의 `/courses/{course_id}`는 `/courses/` 뒤에 **아무 글자**나 오면 일치해요. 그래서 "search"를 course_id로 받으려다 숫자가 아니라 422가 난 거예요.\n해결: **고정 경로(`/courses/search`)를 파라미터 경로보다 먼저** 등록해요.' },
            { type: 'note', tone: 'warn', text: '규칙: **구체적인 경로가 먼저, 일반적인(빈칸 있는) 경로가 나중.** 이런 버그는 에러 메시지만 보면 원인을 찾기 어려워서, /docs에서 경로 목록 순서를 보는 습관이 도움이 돼요.\n\n3장 끝! 이제 백엔드에 목록 API와 상세 API가 다 있어요. 4장에서 Next.js 화면을 SSR로 만들어요. 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs03-4-q1',
      source: '/courses/{course_id}',
      type: 'mcq',
      question: '@app.get("/courses/{course_id}") 함수의 인자 이름으로 알맞은 것은?',
      choices: ['id', 'course_id', 'courseId', 'path'],
      answer: 1,
      explanation: '경로의 {course_id}와 함수 인자 이름이 같아야 FastAPI가 값을 넣어 줘요.',
    },
    {
      id: 'fs03-4-q2',
      source: '없으면 404를 직접 던지기',
      type: 'mcq',
      question: '없는 강의를 요청받았을 때 올바른 처리는?',
      choices: ['None을 그대로 return', 'raise HTTPException(status_code=404, detail="Course not found")', '빈 객체 {} 를 200으로', '500 에러를 일부러 낸다'],
      answer: 1,
      explanation: '없는 걸 요청한 건 클라이언트 쪽 상황이라 404예요. None을 그대로 돌려주면 응답 모델과 맞지 않아 500이 나요.',
    },
    {
      id: 'fs03-4-q3',
      source: '없으면 404를 직접 던지기',
      type: 'short',
      question: '/courses/abc 처럼 course_id: int 자리에 숫자가 아닌 값을 보내면 FastAPI가 자동으로 돌려주는 상태 코드는? (숫자)',
      answer: ['422'],
      explanation: '타입 힌트 덕분에 함수 실행 전에 FastAPI가 검사해서 422를 돌려줘요.',
    },
    {
      id: 'fs03-4-q4',
      source: '경로 순서 함정',
      type: 'mcq',
      question: '/courses/{course_id} 를 /courses/search 보다 먼저 등록했더니 검색이 422가 난다. 해결은?',
      choices: ['search를 지운다', '고정 경로 /courses/search 를 파라미터 경로보다 먼저 등록한다', 'course_id를 str로 바꾼다', 'CORS를 설정한다'],
      answer: 1,
      explanation: 'FastAPI는 등록 순서대로 맞춰 봐요. 구체적인 경로가 먼저, 빈칸 있는 경로가 나중이에요.',
    },
  ],
}

export default topic

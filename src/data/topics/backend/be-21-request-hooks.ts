import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-21-request-hooks',
  track: 'backend',
  group: 'Flask',
  title: '21강 - before_request & after_request',
  order: 21,
  notionId: '3efdf951bf8081d9a1ebdb20a03e7151',
  sections: [
    { title: '데코레이터 정리', points: ['@app.before_request: 요청이 들어올 때마다 먼저 실행, 인자를 받을 수 없음', '@app.after_request: 처리가 끝나고 응답 직전에 실행, response를 인자로 받고 response를 리턴해야 함'] },
    { title: '첫 요청 때만 실행하기', points: ['@app.before_first_request는 최신 Flask에서 없어짐', '전역 변수(initialized)로 첫 요청인지 체크'] },
    { title: '활용 예', points: ['before_request: 로그인 여부 확인, 접속 기록', 'after_request: 응답 헤더 추가, 처리 시간 기록'] },
  ],
  questions: [
    { id: 'be-21-01', type: 'mcq', source: '데코레이터 정리', question: '@app.after_request 함수에 대한 설명으로 옳은 것은?', choices: ['인자를 받지 않는다', 'response를 받아 response를 리턴해야 한다', '요청 전에 실행된다', '첫 요청에만 실행된다'], answer: 1, explanation: '응답 직전에 실행되며 response를 반드시 돌려줘야 해요.' },
    { id: 'be-21-02', type: 'ox', source: '데코레이터 정리', question: '@app.before_request 함수는 인자를 받을 수 없다.', answer: true, explanation: '요청마다 먼저 실행되는 함수로, 인자 없이 정의해요.' },
    { id: 'be-21-03', type: 'essay', source: '첫 요청 때만 실행하기', question: '최신 Flask에서 "첫 요청 때만" 코드를 실행하려면 어떻게 할까?', answer: '@app.before_first_request가 없어졌으므로, 전역 변수(initialized = False)를 두고 before_request 안에서 global로 확인해 아직 초기화 전이면 초기화 함수를 실행하고 initialized를 True로 바꾼다.', keywords: ['전역 변수', 'before_request', 'global'], explanation: 'before_first_request 대체 패턴.' },
    { id: 'be-21-04', type: 'mcq', source: '활용 예', question: 'after_request의 활용 예로 알맞은 것은?', choices: ['로그인 여부 확인', '응답 헤더 추가, 처리 시간 기록', 'URL 라우팅', 'DB 테이블 생성'], answer: 1, explanation: '로그인 확인·접속 기록은 before_request.' },
  ],
}

export default topic

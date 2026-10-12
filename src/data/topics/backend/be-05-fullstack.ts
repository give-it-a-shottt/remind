import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-05-fullstack',
  track: 'backend',
  group: 'Flask',
  title: '5강 - 풀스택 개발 이해 & 프레임워크',
  order: 5,
  notionId: '3efdf951bf80811a9d1de277bbb8f7ed',
  sections: [
    { title: '강의 목표와 원칙', points: ['목표: 나만의 풀스택 서비스, 다양한 기술의 기본기, 혼자서도 개발 가능한 테크트리', '원칙: 쉬운 기술, 최신 기술, 다른 기술과 연결되는 기술, 높은 생산성, 상용화 수준'] },
    { title: '학습 곡선 (러닝 커브)', points: ['기술마다 익히는 난이도가 다름', '낮은 학습 곡선의 기술부터 시작하고 필요할 때 어려운 기술 선택', '유행 기술은 계속 바뀌니 다양한 경험이 중요'] },
    { title: '스타트업 개발 프로세스', points: ['적은 리소스로 짧은 기간에 고객 반응을 확인하는 방식'] },
    { title: '프레임워크란?', points: ['프레임(틀) + 워크(일하다) = 미리 만들어진 틀로 일하기', '장점: 원리를 몰라도 쓸 수 있음', '단점: 제공된 기능 외에는 못 쓰고, 써도 실력이 늘지 않을 수 있음'] },
    { title: '왜 Flask?', points: ['가장 짧은 시간에 익히고 빠르게 구현', '파이썬 기반 → 다양한 라이브러리', 'REST API, CORS, DB 연결, MVC 등 기본 기술을 다뤄 다른 언어로 옮기기 쉬움', 'Flask를 익히면 비슷한 문법의 FastAPI(성능 더 좋음)도 바로'] },
    { title: '왜 Django가 아닌가?', points: ['학습 곡선이 높고 Django 사용법만 익히게 되어 다른 기술로 연결이 잘 안 됨', '회사는 다양한 기술을 빠르게 익히는 개발자를 원함'] },
  ],
  questions: [
    { id: 'be-05-01', type: 'ox', source: '강의 목표와 원칙', question: '이 강의의 원칙 중 하나는 "다른 기술과 연결되는 기술"을 고르는 것이다.', answer: true, explanation: '쉬운·최신·연결되는 기술, 높은 생산성, 상용화 수준이 원칙이에요.' },
    { id: 'be-05-02', type: 'mcq', source: '학습 곡선 (러닝 커브)', question: '새 기술을 배울 때 강의가 권하는 순서는?', choices: ['가장 어려운 기술부터', '낮은 학습 곡선의 기술부터 시작하고 필요할 때 어려운 기술', '유행하는 기술만', '회사에서 쓰는 기술만'], answer: 1, explanation: '예: DB를 처음 배우며 오라클 특화 기능부터 배우면 SQL도 오라클도 다 어려워져요.' },
    { id: 'be-05-03', type: 'mcq', source: '스타트업 개발 프로세스', question: '스타트업 개발 프로세스의 핵심은?', choices: ['모든 기능을 완벽히 만든 뒤 출시', '적은 리소스로 짧은 기간에 고객 반응 확인', '대규모 팀으로 장기 개발', '경쟁사 기능 복제'], answer: 1, explanation: '빨리 만들어 고객 반응을 보고 개선 (→ 22강 MVP와 연결).' },
    { id: 'be-05-04', type: 'essay', source: '프레임워크란?', question: '프레임워크의 장점과 단점을 설명하세요.', answer: '미리 만들어진 틀로 일하는 것이라, 내부 원리를 몰라도 빠르게 기능을 만들 수 있다는 장점이 있다. 반면 제공된 기능 범위 밖의 일은 하기 어렵고, 원리를 모른 채 쓰기만 하면 실력이 늘지 않는다는 단점이 있다.', keywords: ['틀', '원리', '제한'], explanation: '프레임 + 워크 = 틀로 일하기.' },
    { id: 'be-05-05', type: 'mcq', source: '왜 Flask?', question: 'Flask를 선택한 이유로 거리가 먼 것은?', choices: ['짧은 시간에 익히고 빠르게 구현', 'REST API·CORS·MVC 등 다른 언어로 옮길 수 있는 기본기', '인증·관리자 페이지 등 모든 기능이 기본 내장', '비슷한 문법의 FastAPI로 쉽게 확장'], answer: 2, explanation: '모든 기능 내장은 Django 같은 풀스택 프레임워크의 특징. Flask는 최소 기능의 마이크로 프레임워크예요.' },
    { id: 'be-05-06', type: 'ox', source: '왜 Django가 아닌가?', question: 'Django는 학습 곡선이 높고, Django 사용법만 익히게 되어 다른 기술로의 연결이 약하다.', answer: true, explanation: '그래서 처음엔 복잡도를 낮춘 Flask로 기본기를 익혀요.' },
  ],
}

export default topic

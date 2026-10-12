import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-22-mvp-mvc',
  track: 'backend',
  group: 'Flask',
  title: '22강 - 블로그 서비스 기획 (MVP & MVC)',
  order: 22,
  notionId: '3efdf951bf8081ff82c7d0b204182be2',
  sections: [
    { title: '풀스택 웹서비스 구현', points: ['Flask로 백엔드 + 프론트엔드 모두 구현', 'HTML/CSS는 부트스트랩 예제 수정', '가벼운 기획 → MVP 설정 → A/B 테스트 기능 구현'] },
    { title: 'MVP', points: ['Minimum Viable Product: 최소한의 기능만 구현한 제품', '고객 피드백을 받아 조금씩 개선 — 스타트업 방식'] },
    { title: '블로그 프로젝트 목표 기능', points: ['A/B 테스트: 같은 주소로 접속해도 두 버전 중 하나 (제목만 다름)', '이메일 구독 유도, 구독하면 저장 + 구독창 안 뜨게', '접속 IP와 시간을 로그로 저장', '목적: 어떤 제목이 구독자를 더 많이 모으는지 확인'] },
    { title: 'MVC 패턴', points: ['Model: 데이터 (주로 DB)', 'View: 사용자 화면', 'Controller: Model과 View를 제어하는 중간 코드', '주장: 나누면 유지보수가 쉬워짐'] },
    { title: '현실에서는?', points: ['기능 하나가 여러 파일에 쪼개져 이해·디버깅이 오히려 어려울 때가 많음', '결론: 기존 코드가 MVC면 따르고, 아니면 참고만 — Simple is Best'] },
  ],
  questions: [
    { id: 'be-22-01', type: 'ox', source: '풀스택 웹서비스 구현', question: '블로그 프로젝트는 Flask 하나로 백엔드와 프론트엔드를 모두 구현한다.', answer: true, explanation: 'HTML/CSS는 부트스트랩 예제를 수정해서 써요.' },
    { id: 'be-22-02', type: 'short', source: 'MVP', question: 'MVP는 무엇의 약자인가? (영어)', answer: ['Minimum Viable Product'], explanation: '최소한의 기능만 구현한 제품 → 피드백으로 개선.' },
    { id: 'be-22-03', type: 'mcq', source: '블로그 프로젝트 목표 기능', question: '블로그 프로젝트의 A/B 테스트 목적은?', choices: ['서버 속도 비교', '어떤 제목이 구독자를 더 많이 모으는지 확인', '두 DB 성능 비교', '디자인 시안 투표'], answer: 1, explanation: '제목만 다른 두 버전을 보여주고 구독 로그를 분석.' },
    { id: 'be-22-04', type: 'mcq', source: 'MVC 패턴', question: 'MVC에서 Model과 View를 제어하는 중간 코드는?', choices: ['Model', 'View', 'Controller', 'Router'], answer: 2, explanation: 'Model = 데이터, View = 화면, Controller = 제어.' },
    { id: 'be-22-05', type: 'essay', source: '현실에서는?', question: '강의에서 MVC에 대해 내린 현실적인 결론은?', answer: 'MVC로 나누면 유지보수가 쉽다고 하지만, 실제로는 기능 하나가 여러 파일에 쪼개져 이해·디버깅이 어렵고 수정할 때도 연결된 파일을 다 고치게 되는 경우가 많다. 그래서 기존 코드가 MVC면 따르고, 아니면 참고만 하며 단순하게(Simple is Best) 만드는 것이 좋다.', keywords: ['파일 분산', 'Simple is Best'], explanation: '패턴은 도구일 뿐, 상황에 맞게.' },
  ],
}

export default topic

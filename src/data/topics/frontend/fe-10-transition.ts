import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-10-transition',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '10강 - transition',
  order: 10,
  notionId: '3efdf951bf80812b9b92d48d4c482833',
  sections: [
    { title: 'transition', points: ['속성 값이 바뀔 때 즉시가 아니라 부드럽게 변하게 함', '시작 → 끝 두 지점을 연결 (hover, focus, class 추가 등 변화가 있어야 실행)'] },
    { title: '4가지 속성', points: ['property(어떤 속성), duration(얼마 동안), timing-function(속도 곡선), delay(얼마 뒤)', '단축: transition: background-color 0.3s ease;', 'transition은 변하기 전 상태(기본 선택자)에 써야 들어갈 때와 나올 때 모두 부드러움'] },
    { title: '타이밍 함수', points: ['ease(기본): 천천히 시작 → 빠르게 → 천천히 끝', 'linear: 일정한 속도', 'ease-in: 천천히 시작 / ease-out: 천천히 끝 / ease-in-out', 'cubic-bezier(x1, y1, x2, y2): 직접 곡선 만들기'] },
    { title: '예제: 버튼 hover', points: ['배경색 + translateY(-2px)를 함께 transition'], code: `.btn { transition: background-color .25s ease, transform .25s ease; }
.btn:hover { background: tomato; transform: translateY(-2px); }` },
    { title: '예제: 카드 이미지 확대', points: ['부모 overflow: hidden + img에 transform: scale 전환'], code: `.card { overflow: hidden; }
.card img { transition: transform .4s ease-out; }
.card:hover img { transform: scale(1.08); }` },
    { title: '성능 팁', points: ['transform, opacity는 부드럽고 가벼움', 'width, height, top, left는 레이아웃 재계산이라 무거울 수 있음', 'transition: all은 의도치 않은 속성까지 움직일 수 있음', 'display: none은 transition 안 됨 → opacity + visibility 조합'] },
  ],
  questions: [
    { id: 'fe-10-01', type: 'ox', source: 'transition', question: 'transition은 페이지가 열리면 자동으로 실행된다.', answer: false, explanation: 'transition은 상태 변화(hover, class 추가 등)가 있어야 실행돼요. 자동 실행은 animation.' },
    { id: 'fe-10-02', type: 'mcq', source: '4가지 속성', question: 'transition: background-color 0.3s ease 0.1s; 에서 0.1s는?', choices: ['duration', 'delay', 'timing-function', 'property'], answer: 1, explanation: '시간 값이 두 개면 앞이 duration, 뒤가 delay.' },
    { id: 'fe-10-03', type: 'mcq', source: '4가지 속성', question: 'hover에서 나올 때도 부드럽게 되돌아가게 하려면 transition을 어디에 써야 할까?', choices: [':hover 선택자에만', '기본(변하기 전) 선택자에', ':active에', 'body에'], answer: 1, explanation: ':hover에만 쓰면 들어갈 때만 부드럽고 나올 때는 즉시 바뀌어요.' },
    { id: 'fe-10-04', type: 'mcq', source: '타이밍 함수', question: '일정한 속도로 변하는 타이밍 함수는?', choices: ['ease', 'linear', 'ease-in', 'ease-out'], answer: 1, explanation: 'linear = 등속. ease가 기본값.' },
    { id: 'fe-10-05', type: 'short', source: '타이밍 함수', question: '속도 곡선을 직접 만드는 함수 이름은?', answer: ['cubic-bezier', 'cubic-bezier()'], explanation: 'cubic-bezier(x1, y1, x2, y2). 피그마의 커스텀 베지어 이징과 같은 개념.' },
    { id: 'fe-10-06', type: 'ox', source: '예제: 버튼 hover', question: 'transition에 여러 속성을 쉼표로 나열할 수 있다.', answer: true, explanation: 'transition: background-color .25s, transform .25s; 처럼 써요.' },
    { id: 'fe-10-07', type: 'mcq', source: '예제: 카드 이미지 확대', question: 'hover 시 이미지가 카드 밖으로 넘치지 않고 확대되게 하려면 카드에 무엇을 줘야 할까?', choices: ['position: absolute', 'overflow: hidden', 'z-index: 1', 'display: inline'], answer: 1, explanation: 'scale로 커진 부분을 부모의 overflow: hidden이 잘라줘요.' },
    { id: 'fe-10-08', type: 'mcq', source: '성능 팁', question: '애니메이션에 가장 가볍고 부드러운 속성 조합은?', choices: ['width, height', 'top, left', 'transform, opacity', 'margin, padding'], answer: 2, explanation: 'transform·opacity는 레이아웃을 다시 계산하지 않아 가벼워요.' },
    { id: 'fe-10-09', type: 'essay', source: '성능 팁', question: '드롭다운을 display: none ↔ block으로 바꾸면 페이드 효과가 안 되는 이유와 대안은?', answer: 'display는 중간값이 없는 속성이라 transition이 적용되지 않는다. 대신 opacity(0↔1)와 visibility(hidden↔visible)를 함께 전환하면 부드럽게 나타나고, 숨겨진 상태에서는 클릭도 막을 수 있다.', keywords: ['중간값', 'opacity', 'visibility'], explanation: 'display: none은 transition 불가.' },
  ],
}

export default topic

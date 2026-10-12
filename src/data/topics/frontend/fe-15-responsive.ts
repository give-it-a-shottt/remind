import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-15-responsive',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '15강 - 미디어 쿼리와 반응형 웹',
  order: 15,
  notionId: '3efdf951bf8081d1a04bc720c986f980',
  sections: [
    { title: '반응형 웹', points: ['하나의 코드로 화면 크기에 따라 레이아웃이 바뀌는 웹', '모바일·태블릿·PC 모두 지원'] },
    { title: 'viewport meta', points: ['없으면 모바일에서 PC 화면을 축소해 보여줘서 미디어 쿼리가 제대로 안 먹힘'], code: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' },
    { title: '@media 문법', points: ['(max-width: 767px) 이하 / (min-width: 768px) 이상 / and로 사이', '(orientation: landscape) 가로 모드, print 인쇄'] },
    { title: '브레이크포인트', points: ['예: 모바일 ~767, 태블릿 768~1023, PC 1024~', '정답은 없고 디자인이 깨지는 지점에 맞추는 게 좋음'] },
    { title: '모바일 퍼스트', points: ['기본 CSS는 모바일 기준 → min-width로 화면이 커질 때 추가', '장점: 모바일은 가벼운 CSS만 읽고, 코드가 자연스럽게 더해지는 구조'], code: `.cards { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } }` },
    { title: '반응형 이미지', points: ['img { max-width: 100%; height: auto; } → 부모보다 커지지 않게', '<picture> + <source media srcset>로 화면에 따라 다른 이미지'] },
    { title: '미디어 쿼리 없이도 반응형', points: ['%, max-width, clamp(), flex-wrap', 'grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))'] },
    { title: '테스트', points: ['크롬 디바이스 툴바(Ctrl + Shift + M)로 여러 화면 크기 확인', '가능하면 실제 휴대폰으로도 확인'] },
  ],
  questions: [
    { id: 'fe-15-01', type: 'ox', source: '반응형 웹', question: '반응형 웹은 모바일용 사이트와 PC용 사이트를 따로 만드는 방식이다.', answer: false, explanation: '하나의 코드로 화면 크기에 따라 레이아웃이 바뀌는 방식이에요.' },
    { id: 'fe-15-02', type: 'mcq', source: 'viewport meta', question: 'viewport meta 태그가 없으면 모바일에서 생기는 일은?', choices: ['폰트가 깨진다', 'PC 화면을 축소해서 보여줘 미디어 쿼리가 제대로 안 먹힌다', 'JavaScript가 실행되지 않는다', '이미지가 안 뜬다'], answer: 1, explanation: '모바일 브라우저가 약 980px 가상 화면으로 렌더링해서 축소해 보여줘요.' },
    { id: 'fe-15-03', type: 'mcq', source: '@media 문법', question: '"768px 이상"일 때만 적용하는 미디어 쿼리는?', choices: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media (width: 768px)', '@media screen and (768px)'], answer: 1, explanation: 'min-width = 이상, max-width = 이하.' },
    { id: 'fe-15-04', type: 'short', source: '@media 문법', question: '인쇄할 때만 적용하는 미디어 타입은? (@media ?)', answer: ['print'], explanation: '@media print { ... }' },
    { id: 'fe-15-05', type: 'ox', source: '브레이크포인트', question: '브레이크포인트는 기기 이름(아이폰, 갤럭시) 기준으로 정하는 것이 가장 좋다.', answer: false, explanation: '정답은 없고 디자인이 깨지는 지점(너비)에 맞추는 게 좋아요.' },
    { id: 'fe-15-06', type: 'essay', source: '모바일 퍼스트', question: '모바일 퍼스트로 CSS를 작성하는 방법과 장점을 설명하세요.', answer: '기본 스타일을 모바일 기준(1열 등)으로 작성하고, @media (min-width: ...)로 화면이 커질 때 필요한 스타일만 추가한다. 모바일은 가벼운 기본 CSS만 적용받고, 큰 화면 스타일이 자연스럽게 덧붙는 구조라 코드가 단순해진다.', keywords: ['min-width', '기본 = 모바일', '추가'], explanation: '이 사이트도 모바일 퍼스트로 만들었어요.' },
    { id: 'fe-15-07', type: 'short', source: '반응형 이미지', question: '이미지가 부모보다 커지지 않게 하는 CSS (속성: 값)?', answer: ['max-width: 100%', 'max-width:100%'], explanation: 'img { max-width: 100%; height: auto; }' },
    { id: 'fe-15-08', type: 'mcq', source: '반응형 이미지', question: '화면 크기에 따라 아예 다른 이미지 파일을 보여주는 HTML 태그는?', choices: ['<figure>', '<picture>', '<canvas>', '<video>'], answer: 1, explanation: '<picture> 안에 <source media srcset>를 두고 기본 <img>를 마지막에.' },
    { id: 'fe-15-09', type: 'mcq', source: '미디어 쿼리 없이도 반응형', question: '미디어 쿼리 없이 "최소 220px, 남으면 늘어나는" 카드 그리드를 만드는 값은?', choices: ['repeat(3, 1fr)', 'repeat(auto-fit, minmax(220px, 1fr))', 'minmax(1fr, 220px)', 'auto 220px'], answer: 1, explanation: 'auto-fit + minmax로 들어갈 수 있는 만큼 열을 자동으로 만들어요.' },
    { id: 'fe-15-10', type: 'short', source: '테스트', question: '크롬 개발자 도구에서 디바이스 툴바를 여는 단축키는? (Windows)', answer: ['Ctrl + Shift + M', 'Ctrl+Shift+M'], explanation: 'Ctrl + Shift + M. 실제 휴대폰 확인도 함께.' },
  ],
}

export default topic

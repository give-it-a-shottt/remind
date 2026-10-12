import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-07-display',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '7강 - display (block, inline, inline-block)',
  order: 7,
  notionId: '3efdf951bf8081e6b3dcea056fe69ceb',
  sections: [
    { title: 'block', points: ['가로 한 줄을 전부 차지, 다음 요소는 아래 줄로', 'width, height, margin, padding 모두 적용', '예: div, p, h1~h6, ul, li, section, header'] },
    { title: 'inline', points: ['내용만큼만 차지하고 옆으로 나란히', 'width·height 적용 안 됨, 위아래 margin 안 됨 (좌우는 됨)', '위아래 padding은 보이지만 주변 줄 간격을 밀어내지 않음', '예: span, a, strong, em, img(예외적으로 크기 지정 가능)'] },
    { title: 'inline-block', points: ['inline처럼 옆으로 나란히 + block처럼 크기·여백 적용', '요소 사이 HTML 줄바꿈 때문에 약 4px 틈이 생길 수 있음 → 요즘은 주로 flex'] },
    { title: 'display로 성질 바꾸기', points: ['.menu a { display: block; } → 링크 클릭 영역 넓히기', '.menu li { display: inline-block; } → 세로 목록을 가로로', '그 외 flex, grid, none'] },
    { title: '숨기기: display: none vs visibility: hidden vs opacity: 0', points: ['display: none → 공간도 사라짐', 'visibility: hidden → 안 보이지만 공간은 남음', 'opacity: 0 → 투명할 뿐 공간도 남고 클릭도 됨, transition 가능'] },
    { title: '정리표', points: ['block: 줄바꿈 O / 크기 O / 상하 margin O', 'inline: 줄바꿈 X / 크기 X / 상하 margin X', 'inline-block: 줄바꿈 X / 크기 O / 상하 margin O'] },
  ],
  questions: [
    { id: 'fe-07-01', type: 'mcq', source: 'block', question: 'block 요소가 아닌 것은?', choices: ['div', 'p', 'section', 'span'], answer: 3, explanation: 'span은 inline. div, p, section, h1, ul, li 등이 block.' },
    { id: 'fe-07-02', type: 'ox', source: 'block', question: 'block 요소는 너비를 지정하지 않으면 가로 한 줄을 전부 차지한다.', answer: true, explanation: '그래서 다음 요소는 아래 줄로 내려가요.' },
    { id: 'fe-07-03', type: 'mcq', source: 'inline', question: 'inline 요소에 적용되지 않는 것은?', choices: ['좌우 margin', '글자 색', 'width와 위아래 margin', '좌우 padding'], answer: 2, explanation: 'inline은 width·height와 위아래 margin이 적용되지 않아요.' },
    { id: 'fe-07-04', type: 'ox', source: 'inline', question: 'inline 요소의 위아래 padding은 보이지만 주변 줄 간격을 밀어내지 않는다.', answer: true, explanation: '배경은 커지지만 레이아웃(줄 높이)에 반영되지 않아 겹쳐 보일 수 있어요.' },
    { id: 'fe-07-05', type: 'mcq', source: 'inline-block', question: '태그(#빵 #디저트)처럼 옆으로 나란히 두면서 padding·margin을 주고 싶을 때 적합한 display는?', choices: ['block', 'inline', 'inline-block', 'none'], answer: 2, explanation: 'inline-block = 나란히 + 크기·여백 적용.' },
    { id: 'fe-07-06', type: 'short', source: 'inline-block', question: 'inline-block 요소 사이에 생기는 틈(약 4px)의 원인은?', answer: ['HTML 줄바꿈', '줄바꿈', '공백', 'HTML 공백', '띄어쓰기'], explanation: 'HTML 코드의 줄바꿈이 공백 문자로 렌더링되기 때문. 그래서 요즘은 flex를 많이 써요.' },
    { id: 'fe-07-07', type: 'mcq', source: 'display로 성질 바꾸기', question: '메뉴 링크의 클릭 영역을 넓히려고 a에 주는 속성은?', choices: ['display: inline', 'display: block + padding', 'visibility: visible', 'float: left'], answer: 1, explanation: 'a는 inline이라 padding이 레이아웃에 반영되지 않아요. block으로 바꾸고 padding을 주면 클릭 영역이 넓어져요.' },
    { id: 'fe-07-08', type: 'mcq', source: '숨기기: display: none vs visibility: hidden vs opacity: 0', question: '안 보이지만 "공간은 남는" 방법 두 가지는?', choices: ['display: none, opacity: 0', 'visibility: hidden, opacity: 0', 'display: none, visibility: hidden', 'display: none만'], answer: 1, explanation: 'display: none만 공간까지 사라져요.' },
    { id: 'fe-07-09', type: 'ox', source: '숨기기: display: none vs visibility: hidden vs opacity: 0', question: 'opacity: 0인 요소는 클릭할 수 없다.', answer: false, explanation: '투명할 뿐 그대로 있어서 클릭이 돼요. transition 애니메이션도 가능.' },
    { id: 'fe-07-10', type: 'mcq', source: '정리표', question: '"줄바꿈 X / 크기 지정 O / 상하 margin O" 인 것은?', choices: ['block', 'inline', 'inline-block', 'none'], answer: 2, explanation: 'inline-block의 특징이에요.' },
  ],
}

export default topic

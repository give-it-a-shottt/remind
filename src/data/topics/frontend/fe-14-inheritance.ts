import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-14-inheritance',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '14강 - 상속 (inheritance)',
  order: 14,
  notionId: '3efdf951bf8081cba4c2f88c275fd1e3',
  sections: [
    { title: '상속이란?', points: ['부모에 준 스타일을 자식이 자동으로 물려받는 것', 'body { color; font-family } → 페이지 안 모든 글자에 적용'] },
    { title: '상속되는 속성', points: ['주로 글자 관련: color, font-family, font-size, font-weight, line-height', 'text-align, letter-spacing, visibility, cursor, list-style'] },
    { title: '상속되지 않는 속성', points: ['주로 박스·배치 관련: width, height, margin, padding, border', 'background, position, display, transform', '부모의 border가 상속되면 테두리가 겹겹이 생김 → 그래서 상속 안 됨'] },
    { title: '상속 제어 키워드', points: ['inherit: 부모 값을 강제로 물려받기 (a { color: inherit })', 'initial: CSS 기본 초기값으로', 'unset: 상속 속성이면 inherit, 아니면 initial', 'button, input, textarea는 폰트를 상속받지 않아서 font: inherit를 자주 씀'] },
    { title: '상속 vs 캐스케이딩', points: ['상속: 부모 → 자식으로 값이 내려감', '캐스케이딩: 같은 요소에 규칙이 여러 개일 때 무엇이 이기는지', '상속받은 값은 명시도가 가장 약함 → 자식에 직접 쓴 규칙이 항상 이김'], code: `#main { color: red; }
p { color: blue; }  /* #main 안의 p는 파랑 */` },
    { title: '활용 팁 (CSS 변수)', points: ['글자 스타일은 body·섹션 단위에 한 번만 주고 다른 부분만 덮어쓰기', 'CSS 변수(커스텀 속성)도 상속됨'], code: `:root { --main-color: tomato; }
.btn { background: var(--main-color); }
.dark { --main-color: #ff8a65; }` },
  ],
  questions: [
    { id: 'fe-14-10', type: 'ox', source: '상속이란?', question: 'body에 color와 font-family를 주면 페이지 안 모든 글자가 그 값을 물려받는다.', answer: true, explanation: '상속은 부모 스타일을 자식이 자동으로 물려받는 것. 글자 스타일은 body에 한 번만 주는 게 효율적이에요.' },
    { id: 'fe-14-01', type: 'mcq', source: '상속되는 속성', question: '상속되는 속성은?', choices: ['margin', 'border', 'color', 'background'], answer: 2, explanation: '글자 관련(color, font-*, line-height 등)은 상속돼요.' },
    { id: 'fe-14-02', type: 'mcq', source: '상속되지 않는 속성', question: '상속되지 않는 속성은?', choices: ['font-family', 'line-height', 'padding', 'letter-spacing'], answer: 2, explanation: '박스·배치 관련(width, margin, padding, border, background...)은 상속되지 않아요.' },
    { id: 'fe-14-03', type: 'essay', source: '상속되지 않는 속성', question: 'border나 margin이 상속되지 않도록 설계된 이유를 설명하세요.', answer: '박스 관련 속성이 상속되면 부모에 준 테두리·여백이 모든 자식, 손자에게 겹겹이 적용되어 레이아웃이 망가진다. 그래서 글자처럼 일관되게 이어져야 하는 속성만 상속되고, 박스·배치 속성은 각 요소가 따로 가진다.', keywords: ['겹겹이', '레이아웃'], explanation: '상속은 "자연스럽게 이어져야 하는" 글자 속성 위주.' },
    { id: 'fe-14-04', type: 'short', source: '상속 제어 키워드', question: '링크의 파란 기본색 대신 부모 글자색을 쓰게 하는 값은? (color: ?)', answer: ['inherit'], explanation: 'a { color: inherit; }' },
    { id: 'fe-14-05', type: 'mcq', source: '상속 제어 키워드', question: 'button의 글자가 페이지 폰트와 다르게 보이는 이유와 해결은?', choices: ['button은 인라인이라서 / display: block', 'button은 기본적으로 폰트를 상속받지 않아서 / font: inherit', 'button은 z-index가 낮아서 / z-index: 1', 'button은 color가 없어서 / color: initial'], answer: 1, explanation: 'button, input, textarea는 브라우저 기본 스타일 때문에 폰트를 상속받지 않아요.' },
    { id: 'fe-14-06', type: 'mcq', source: '상속 제어 키워드', question: 'unset의 동작은?', choices: ['항상 initial', '항상 inherit', '상속 속성이면 inherit, 아니면 initial', '스타일 삭제 후 브라우저 기본값'], answer: 2, explanation: 'unset = 자연스러운 상태로 되돌리기.' },
    { id: 'fe-14-07', type: 'mcq', source: '상속 vs 캐스케이딩', question: '<div id="main"><p>글</p></div> 에 #main { color: red } p { color: blue } 이면 글자색은?', choices: ['red (id가 더 강함)', 'blue', '검정', '보라'], answer: 1, choiceExplanations: ['id 규칙은 div에 적용되고 p는 그 값을 "상속"받을 뿐이에요.', '정답. p에 직접 쓴 규칙이 상속값보다 항상 이겨요.', '기본 검정보다 직접 쓴 규칙이 우선이에요.', '색이 섞이지는 않아요.'], explanation: '상속받은 값은 명시도가 가장 약해서, 자식에 직접 쓴 규칙이 있으면 항상 그게 이겨요.' },
    { id: 'fe-14-08', type: 'ox', source: '활용 팁 (CSS 변수)', question: 'CSS 변수(커스텀 속성)도 상속된다.', answer: true, explanation: '.dark { --main-color: ... } 안에 있는 요소만 다른 색을 쓰게 할 수 있어요.' },
    { id: 'fe-14-09', type: 'short', source: '활용 팁 (CSS 변수)', question: 'CSS 변수 --main-color를 사용하는 함수 표기는?', answer: ['var(--main-color)'], explanation: 'background: var(--main-color);' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-04-selectors',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '4강 - CSS 선택자',
  order: 4,
  notionId: '3efdf951bf8081809626f9802b633933',
  sections: [
    { title: '기본 선택자', points: ['* 전체 / li 태그 / .active class / #logo id', 'h1, h2 그룹 (여러 개 동시에)', 'li.active: li이면서 active class (붙여 쓰기)'] },
    { title: '조합 선택자', points: ['.menu a: 자손 (띄어쓰기, 안의 모든 a)', '.menu > li: 자식 (바로 아래만)', 'h2 + p: 인접 형제 (바로 다음 하나)', 'h2 ~ p: 일반 형제 (뒤의 모든 p)'] },
    { title: '속성 선택자', points: ['input[type="email"]: 값이 같음', 'a[href^="https"]: ~로 시작', 'a[href$=".pdf"]: ~로 끝남', 'img[alt*="빵"]: ~를 포함'] },
    { title: '가상 클래스', points: [':hover, :active, :focus, :checked, :disabled — 상태', ':first-child, :last-child, :nth-child(2), :nth-child(odd) — 순서', ':not(.active) — 제외', '링크 순서: :link → :visited → :hover → :active (LoVe HAte)'] },
    { title: '가상 요소', points: ['::before, ::after: HTML에 없는 내용 추가 (content 필수, 빈 값도 content: "")', '::first-letter, ::selection, ::placeholder', '가상 클래스는 : 하나, 가상 요소는 :: 두 개'], code: `.price::after { content: "원"; }
.new::before { content: "NEW "; color: red; }` },
    { title: '선택자 작성 팁', points: ['너무 길게 연결하지 말기 (#header .nav ul li a → .nav-link)', '스타일은 주로 class로, id는 JS나 앵커용 → 명시도 충돌이 줄어듦'] },
  ],
  questions: [
    { id: 'fe-04-01', type: 'mcq', source: '기본 선택자', question: 'li.active 가 선택하는 요소는?', choices: ['li 안의 .active', 'li 또는 .active', 'li이면서 class가 active인 요소', '.active 안의 li'], answer: 2, explanation: '띄어쓰기 없이 붙여 쓰면 "둘 다 만족"하는 요소예요.' },
    { id: 'fe-04-02', type: 'ox', source: '기본 선택자', question: 'h1, h2 { } 는 h1과 h2 모두에 같은 스타일을 준다.', answer: true, explanation: '쉼표는 그룹 선택자 — 여러 선택자에 동시에 적용.' },
    { id: 'fe-04-03', type: 'mcq', source: '조합 선택자', question: '.menu 의 "바로 아래 자식" li만 선택하는 것은?', choices: ['.menu li', '.menu > li', '.menu + li', '.menu ~ li'], answer: 1, explanation: '> 는 자식(한 단계), 띄어쓰기는 모든 자손.' },
    { id: 'fe-04-04', type: 'mcq', source: '조합 선택자', question: 'h2 + p 가 선택하는 것은?', choices: ['h2 안의 p', 'h2 뒤의 모든 p', 'h2 바로 다음에 오는 p 하나', 'h2 바로 앞의 p'], answer: 2, explanation: '+ 는 인접 형제(바로 다음 하나), ~ 는 뒤의 모든 형제.' },
    { id: 'fe-04-05', type: 'short', source: '속성 선택자', question: 'href가 ".pdf"로 끝나는 a를 선택하는 선택자는? (a[...] 형태)', answer: ['a[href$=".pdf"]', "a[href$='.pdf']", 'a[href$=.pdf]'], explanation: '^= 시작, $= 끝, *= 포함.' },
    { id: 'fe-04-06', type: 'mcq', source: '속성 선택자', question: 'img[alt*="빵"] 의 의미는?', choices: ['alt가 "빵"과 정확히 같음', 'alt가 "빵"으로 시작', 'alt에 "빵"이 포함', 'alt가 "빵"으로 끝남'], answer: 2, explanation: '*= 는 포함(contains).' },
    { id: 'fe-04-07', type: 'short', source: '가상 클래스', question: '표의 홀수 행에만 배경을 주는 선택자는? (tr:...)', answer: ['tr:nth-child(odd)', 'tr:nth-child(2n+1)'], explanation: ':nth-child(odd) 또는 (2n+1). 짝수는 even.' },
    { id: 'fe-04-08', type: 'mcq', source: '가상 클래스', question: '링크 가상 클래스의 권장 작성 순서는?', choices: [':hover → :link → :active → :visited', ':link → :visited → :hover → :active', ':active → :hover → :visited → :link', ':visited → :link → :active → :hover'], answer: 1, explanation: 'LoVe HAte로 외우기. 순서가 바뀌면 뒤 규칙이 앞 규칙을 덮어써서 상태 스타일이 안 보여요.' },
    { id: 'fe-04-09', type: 'ox', source: '가상 클래스', question: 'li:not(.active) 는 active 클래스가 없는 li를 선택한다.', answer: true, explanation: ':not()은 괄호 안 조건을 제외해요.' },
    { id: 'fe-04-10', type: 'ox', source: '가상 요소', question: '::before는 content 속성이 없어도 화면에 보인다.', answer: false, explanation: '::before/::after는 content가 있어야 생성돼요. 꾸밈용 빈 요소도 content: "" 필요.' },
    { id: 'fe-04-11', type: 'mcq', source: '가상 요소', question: '가상 클래스와 가상 요소의 표기 차이로 맞는 것은?', choices: ['가상 클래스 ::, 가상 요소 :', '가상 클래스 :, 가상 요소 ::', '둘 다 :', '둘 다 ::'], answer: 1, explanation: '가상 클래스(:hover)는 콜론 하나, 가상 요소(::after)는 두 개.' },
    { id: 'fe-04-12', type: 'essay', source: '선택자 작성 팁', question: '스타일을 id보다 class 위주로 작성하고 선택자를 짧게 유지하면 좋은 이유는?', answer: 'id는 명시도가 매우 높아서 나중에 덮어쓰기 어렵고 충돌을 만든다. class 위주로 짧은 선택자를 쓰면 명시도가 낮고 균일해서 덮어쓰기와 재사용이 쉽고, HTML 구조가 바뀌어도 스타일이 깨지지 않는다.', keywords: ['명시도', '재사용', '구조 변경'], explanation: '#header .nav ul li a 같은 긴 선택자는 .nav-link 하나로 바꾸는 게 좋아요.' },
  ],
}

export default topic

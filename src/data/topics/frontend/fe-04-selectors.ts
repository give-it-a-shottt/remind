import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-04-selectors',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '4강 - CSS 선택자',
  order: 4,
  notionId: '3efdf951bf8081809626f9802b633933',
  sections: [
    {
      title: '기본 선택자',
      slides: [
        {
          title: '선택자는 "누구에게"를 정해요',
          blocks: [
            { type: 'say', text: '2강에서 CSS는 **선택자 { 속성: 값; }** 이라고 했죠. 이번 수업은 그 앞부분, **선택자**만 집중해서 배워요. 원하는 요소를 정확히 고를 줄 알아야 원하는 곳에 옷을 입힐 수 있어요.' },
            {
              type: 'table',
              head: ['선택자', '고르는 대상'],
              rows: [
                ['`*`', '**모든** 요소'],
                ['`li`', '모든 `<li>` 태그'],
                ['`.active`', 'class에 **active**가 있는 요소'],
                ['`#logo`', 'id가 **logo**인 요소 하나'],
              ],
            },
            { type: 'note', tone: 'tip', text: '0강의 Emmet과 같은 약속이에요. `.`은 class, `#`은 id. Emmet에서 `div.card`를 썼던 것처럼요.' },
          ],
        },
        {
          title: '쉼표와 붙여 쓰기',
          blocks: [
            { type: 'say', text: '선택자 두 개를 이어 쓰는 방법에 따라 뜻이 완전히 달라져요. 아주 자주 틀리는 부분이니 천천히 봐요.' },
            { type: 'code', code: `h1, h2 { }      /* 쉼표: h1 "그리고" h2 — 둘 다에 적용 (그룹) */
li.active { }   /* 붙여 쓰기: li "이면서" active인 요소 */
li .active { }  /* 띄어쓰기: li "안에 있는" active (다음 개념) */` },
            { type: 'note', tone: 'analogy', text: '`li.active`는 "**안경 쓴 학생**"이에요. 학생이면서 안경을 쓴, **한 사람이 두 조건을 다** 만족해야 해요. 반면 `h1, h2`는 "1반 **그리고** 2반 모두 모여"예요.' },
            { type: 'ask', q: '`p.notice`와 `p .notice`는 무엇이 다를까요?', a: '`p.notice`(붙여 씀)는 **class가 notice인 p 자기 자신**이에요. `p .notice`(띄어 씀)는 **p 안에 들어 있는** notice 요소예요. 띄어쓰기 하나로 대상이 바뀌어요.' },
          ],
        },
      ],
    },
    {
      title: '조합 선택자',
      slides: [
        {
          title: '가계도로 고르기',
          blocks: [
            { type: 'say', text: '0강에서 HTML은 **나무 구조(DOM)** 라고 했죠. 조합 선택자는 이 가계도에서 **관계**로 요소를 골라요.' },
            { type: 'code', code: `<ul class="menu">
  <li><a>홈</a></li>          ← li는 .menu의 자식
  <li>
    <ul>
      <li><a>공지</a></li>    ← 이 li는 .menu의 손자 (자손이지만 자식은 아님)
    </ul>
  </li>
</ul>` },
            {
              type: 'table',
              head: ['선택자', '관계', '위 예시에서'],
              rows: [
                ['`.menu a` (띄어쓰기)', '**자손** — 안에 있는 모든 것, 몇 단계 아래든', '홈, 공지 링크 **둘 다**'],
                ['`.menu > li`', '**자식** — 바로 한 단계 아래만', '바깥 li 두 개만 (공지 li는 제외)'],
              ],
            },
          ],
        },
        {
          title: '형제 고르기: + 와 ~',
          blocks: [
            { type: 'say', text: '같은 부모 아래 **나란히 있는** 요소를 형제라고 해요.' },
            { type: 'code', code: `<h2>제목</h2>
<p>첫 문단</p>     ← h2 + p 도, h2 ~ p 도 선택
<p>둘째 문단</p>   ← h2 ~ p 만 선택
<p>셋째 문단</p>   ← h2 ~ p 만 선택` },
            { type: 'list', items: ['`h2 + p` → h2 **바로 다음에 붙어 있는** p **하나**', '`h2 ~ p` → h2 **뒤에 오는 모든** p 형제'] },
            { type: 'note', tone: 'tip', text: '"제목 바로 밑 첫 문단만 크게"처럼 **바로 다음 하나**를 꾸밀 때 `+`가 유용해요. 형제 선택자는 항상 **뒤쪽** 형제만 골라요. 앞에 있는 형제는 못 골라요.' },
            { type: 'ask', q: '`.menu > li`와 `.menu li`, 메뉴 안에 하위 메뉴가 있을 때 어느 쪽을 써야 바깥 메뉴만 꾸밀 수 있을까요?', a: '`.menu > li`예요. 띄어쓰기(자손)는 하위 메뉴의 li까지 전부 골라 버려요. `>`는 **바로 아래 한 단계**만 골라요.' },
          ],
        },
      ],
    },
    {
      title: '속성 선택자',
      slides: [
        {
          title: '속성 값으로 고르기',
          blocks: [
            { type: 'say', text: '1강에서 배운 **속성**(`type`, `href`, `alt`…)의 값으로도 요소를 고를 수 있어요. 대괄호 `[ ]`를 써요.' },
            {
              type: 'table',
              head: ['선택자', '뜻', '외우는 법'],
              rows: [
                ['`input[type="email"]`', '값이 **정확히 같음**', '='],
                ['`a[href^="https"]`', '값이 ~로 **시작**', '`^` 산 꼭대기, 맨 앞'],
                ['`a[href$=".pdf"]`', '값이 ~로 **끝남**', '`$` 돈은 맨 끝에 계산'],
                ['`img[alt*="빵"]`', '값에 ~가 **포함**', '`*` 어디든 (와일드카드)'],
              ],
            },
          ],
        },
        {
          title: '이럴 때 써요',
          blocks: [
            { type: 'code', code: `/* PDF 링크 뒤에 자동으로 표시 */
a[href$=".pdf"]::after { content: " (PDF)"; }

/* 이메일 입력창만 따로 꾸미기 */
input[type="email"] { background: #f5f8ff; }` },
            { type: 'say', text: 'HTML에 class를 하나하나 붙이지 않아도 **이미 있는 속성**으로 골라낼 수 있다는 게 장점이에요. PDF 링크가 100개여도 CSS 한 줄이면 끝나요.' },
            { type: 'note', tone: 'tip', text: '속성 선택자의 명시도는 **class와 같은 급**이에요. 2강의 명시도 표에서 "class · 속성 · 가상 클래스"가 한 줄에 있었던 거 기억나죠?' },
          ],
        },
      ],
    },
    {
      title: '가상 클래스',
      slides: [
        {
          title: '상태로 고르기',
          blocks: [
            { type: 'say', text: '**가상 클래스**는 HTML에 class를 직접 안 써도, 요소의 **상태나 위치**에 따라 브라우저가 붙여 주는 "보이지 않는 class"예요. 콜론 **하나** `:`로 써요.' },
            {
              type: 'table',
              head: ['가상 클래스', '언제'],
              rows: [
                ['`:hover`', '마우스를 **올렸을 때**'],
                ['`:active`', '**누르고 있는** 순간'],
                ['`:focus`', '입력창에 커서가 들어가거나 Tab으로 **선택됐을 때**'],
                ['`:checked`', '체크박스·라디오가 **체크됐을 때**'],
                ['`:disabled`', '**비활성화**된 버튼·입력창'],
              ],
            },
            { type: 'code', code: `.btn:hover { background: navy; }   /* 올리면 진하게 */
input:focus { outline: 2px solid tomato; }` },
          ],
        },
        {
          title: '순서로 고르기',
          blocks: [
            { type: 'code', code: `li:first-child       /* 첫째 */
li:last-child        /* 마지막 */
li:nth-child(2)      /* 둘째 */
tr:nth-child(odd)    /* 홀수 번째: 1, 3, 5… (= 2n+1) */
tr:nth-child(even)   /* 짝수 번째: 2, 4, 6… (= 2n) */
li:not(.active)      /* active가 "아닌" li */` },
            { type: 'say', text: '표의 줄마다 배경색을 번갈아 주는 "얼룩말 줄무늬"는 `tr:nth-child(odd)` 한 줄이면 돼요. 행이 늘어나도 알아서 따라와요.\n\n`:not()`은 **괄호 안 조건을 제외**해요. "마지막 메뉴만 빼고 오른쪽에 구분선" → `li:not(:last-child)`.' },
          ],
        },
        {
          title: '링크 순서: LoVe HAte',
          blocks: [
            { type: 'say', text: '링크에 상태 스타일을 줄 때는 **순서가 중요해요.**' },
            { type: 'code', code: `a:link    { }   /* L  아직 안 가 본 링크 */
a:visited { }   /* V  가 본 링크 */
a:hover   { }   /* H  마우스 올림 */
a:active  { }   /* A  누르는 중 */` },
            { type: 'say', text: '**LoVe HAte**(사랑과 미움)로 외워요. 왜 순서가 중요할까요? 이 넷은 명시도가 **전부 같아서**, 2강에서 배운 대로 **나중에 쓴 게 이겨요.** `:hover`를 `:visited`보다 먼저 쓰면, 가 본 링크에 마우스를 올려도 `:visited`가 덮어써서 hover 효과가 안 보여요.' },
          ],
        },
      ],
    },
    {
      title: '가상 요소',
      slides: [
        {
          title: 'HTML에 없는 걸 CSS로 만들어요',
          blocks: [
            { type: 'say', text: '**가상 요소**는 요소의 **일부분**을 고르거나, HTML에 **없는 내용을 새로 끼워 넣어요.** 콜론 **두 개** `::`로 써요.' },
            { type: 'code', code: `.price::after { content: "원"; }
.new::before  { content: "NEW "; color: red; }

<span class="price">3,000</span>   →  화면: 3,000원
<li class="new">크로와상</li>        →  화면: NEW 크로와상` },
            { type: 'list', items: ['`::before` → 요소 내용의 **맨 앞**에 끼워 넣기', '`::after` → 요소 내용의 **맨 뒤**에 끼워 넣기'] },
          ],
        },
        {
          title: 'content 없으면 안 생겨요',
          blocks: [
            { type: 'say', text: '`::before`, `::after`는 **`content` 속성이 있어야만** 만들어져요. 글자 없이 꾸밈용 동그라미나 선만 그리고 싶어도 `content: ""`(빈 글자)를 꼭 써야 해요.' },
            { type: 'code', code: `.title::before {
  content: "";          /* 이게 없으면 아무것도 안 보여요 */
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: tomato;   /* 제목 앞 빨간 점 */
}` },
            {
              type: 'table',
              head: ['그 밖의 가상 요소', '고르는 부분'],
              rows: [
                ['`::first-letter`', '첫 글자 (잡지처럼 크게)'],
                ['`::selection`', '마우스로 **드래그해 선택한** 부분'],
                ['`::placeholder`', '입력창의 안내 문구'],
              ],
            },
            { type: 'ask', q: '`:hover`와 `::after`, 콜론 개수가 왜 다를까요?', a: '`:hover`는 **상태**(가상 클래스)라 콜론 하나, `::after`는 **새 조각**(가상 요소)이라 콜론 두 개예요. "상태면 하나, 조각이면 둘"로 기억하세요.' },
          ],
        },
      ],
    },
    {
      title: '선택자 작성 팁',
      slides: [
        {
          title: '짧게, class로',
          blocks: [
            { type: 'code', code: `/* 😣 길고 id까지 섞인 선택자 */
#header .nav ul li a { color: white; }

/* 😊 class 하나 */
.nav-link { color: white; }` },
            { type: 'say', text: '위쪽 선택자는 문제가 두 개예요.\n1. **명시도가 너무 높아요** (1, 1, 3). 나중에 특정 링크만 다른 색으로 바꾸려면 이보다 더 긴 선택자를 써야 해요.\n2. **HTML 구조에 묶여요.** 디자인이 바뀌어 `ul`을 `div`로 바꾸는 순간 스타일이 깨져요.\n\n`.nav-link` 하나면 명시도도 낮고, 구조가 바뀌어도 class만 붙어 있으면 그대로 작동해요.' },
            { type: 'note', tone: 'tip', text: '실무 습관 정리: **스타일은 class로**, id는 `#contact` 같은 앵커 링크나 JavaScript에서 요소 하나를 찾을 때만. 이렇게 하면 명시도가 고르게 낮아서 2강의 "안 먹혀요" 문제가 거의 사라져요.' },
          ],
        },
      ],
    },
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

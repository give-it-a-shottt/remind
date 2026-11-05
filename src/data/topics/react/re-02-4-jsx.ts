import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-02-4-jsx',
  track: 'react',
  group: '02. JS·TS 기초와 JSX',
  title: '2-4. JSX 규칙',
  order: 204,
  notionId: '409df951bf8081cfb4f9d06ed5d19c02',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'JSX는 결국 자바스크립트',
      slides: [
        {
          title: 'HTML처럼 생긴 자바스크립트',
          blocks: [
            { type: 'say', text: '이번 수업은 **JSX 규칙**이에요. JSX는 HTML이랑 너무 닮아서 "HTML이랑 똑같이 쓰면 되겠지" 하다가 자주 막혀요. 오늘 그 차이를 확실히 잡을게요.\n\n핵심은 한 문장이에요. **JSX는 HTML이 아니라 자바스크립트다.**' },
            {
              type: 'code',
              code: `// 우리가 쓰는 JSX
<h1 className="title">안녕</h1>

// 빌드하면 이런 자바스크립트 함수 호출로 바뀐다
jsx('h1', { className: 'title', children: '안녕' })`,
              caption: '1-2에서 배운 번들러의 "변환" 단계가 이 일을 해요',
            },
            { type: 'say', text: '브라우저는 JSX를 못 읽어서 빌드할 때 이렇게 **함수 호출로 바뀌어요.** 오늘 배울 규칙은 전부 여기서 나와요. "결국 자바스크립트 함수 호출이니까 자바스크립트 규칙을 따른다"는 거예요.' },
          ],
        },
      ],
    },
    {
      title: '{ } 안에는 표현식만',
      slides: [
        {
          title: '값이 나오는 코드만 들어가요',
          blocks: [
            { type: 'say', text: 'JSX 안에서 `{ }`를 쓰면 자바스크립트 값을 끼워 넣을 수 있어요. 이걸 **보간법**이라고 해요.' },
            { type: 'code', code: `<p>{name}님 안녕하세요</p>
<p>합계 {price * qty}원</p>` },
            { type: 'say', text: '그런데 `{ }` 안에는 **표현식**만 들어가요. 표현식은 "실행하면 **값이 하나 나오는** 코드"예요.\n\n• `1 + 2` → 3이 나옴 (표현식 ✅)\n• `isVip ? \'VIP\' : \'일반\'` → 둘 중 하나가 나옴 (표현식 ✅)\n• `if (ok) { ... }` → 값이 안 나옴 (문장 ❌)\n• `for (...) { ... }` → 값이 안 나옴 (문장 ❌)' },
            { type: 'ask', q: '왜 if는 안 될까요? 힌트: JSX는 함수 호출로 바뀌어요.', a: "`jsx('p', { children: if (ok) {...} })` 처럼 함수 인수 자리에 if를 넣는 셈이에요. 자바스크립트에서 함수 인수에는 **값**만 넣을 수 있어서 if는 문법 에러예요." },
          ],
        },
        {
          title: 'if와 for 대신 쓰는 것',
          blocks: [
            {
              type: 'table',
              head: ['하고 싶은 것', '못 씀 (문장)', '대신 씀 (표현식)'],
              rows: [
                ['조건에 따라 둘 중 하나', '`if / else`', '`{ok ? <A /> : <B />}`'],
                ['조건이 맞을 때만 보이기', '`if`', '`{ok && <A />}`'],
                ['목록 반복', '`for`', '`{items.map((it) => <li key={it.id}>…</li>)}`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '`&&`에는 유명한 함정이 있어요.\n`{count && <p>{count}개</p>}` → count가 **0**이면 화면에 **"0"이 찍혀요!**\n`&&`는 앞이 거짓이면 **앞의 값을 그대로** 돌려주는데, React는 false·null은 안 그리지만 숫자 0은 그려요.\n안전하게: `{count > 0 && <p>{count}개</p>}`' },
            { type: 'note', tone: 'tip', text: '조건이 복잡하면 JSX 안에서 억지로 쓰지 말고, return 위에서 일반 if로 변수를 만들어 두고 `{content}`처럼 넣으면 훨씬 읽기 좋아요.' },
          ],
        },
      ],
    },
    {
      title: '속성 이름은 카멜 표기',
      slides: [
        {
          title: 'class가 아니라 className',
          blocks: [
            { type: 'say', text: 'HTML에서 `class="title"`이라고 쓰던 걸 JSX에서는 `className="title"`이라고 써요. 왜일까요?\n\n자바스크립트에서 `class`는 클래스를 만드는 **예약어**라서 이름으로 못 써요. `for`도 반복문 예약어고요. 그래서 JSX는 자바스크립트가 DOM을 다룰 때 쓰는 이름(`element.className`, `label.htmlFor`)을 따라요.' },
            {
              type: 'table',
              head: ['HTML', 'JSX'],
              rows: [
                ['`class`', '`className`'],
                ['`for`', '`htmlFor`'],
                ['`tabindex`', '`tabIndex`'],
                ['`onclick`', '`onClick`'],
                ['`style="background-color: red"`', '`style={{ backgroundColor: \'red\' }}` (객체, 키도 카멜)'],
                ['`aria-label`, `data-id`', '그대로 (예외적으로 케밥 유지)'],
              ],
            },
            { type: 'ask', q: 'style={{ }} 에서 괄호가 왜 두 겹일까요?', a: '바깥 `{ }`는 "여기 자바스크립트 값 들어가요"라는 **보간법 괄호**고, 안쪽 `{ }`는 **객체**예요. style에는 문자열이 아니라 객체를 넘기거든요. `const s = { color: \'red\' }; style={s}`와 같은 뜻이에요.' },
          ],
        },
        {
          title: '이름 짓는 표기법 4가지',
          blocks: [
            { type: 'say', text: '나온 김에 개발에서 쓰는 이름 표기법을 한 번에 정리해요. 어디에 무엇을 쓰는지 알면 코드가 훨씬 자연스러워 보여요.' },
            {
              type: 'table',
              head: ['표기법', '모양', '어디에 쓰나'],
              rows: [
                ['파스칼 (PascalCase)', '`TodoItem`', '**React 컴포넌트 이름**(필수), 클래스, 타입'],
                ['카멜 (camelCase)', '`onClick`, `todoList`', '변수·함수, **JSX 속성**, props'],
                ['케밥 (kebab-case)', '`todo-item`', 'CSS 클래스, URL, 파일·폴더 이름, `aria-*` `data-*`'],
                ['스네이크 (snake_case)', '`created_at`', '파이썬 변수, DB 컬럼. 대문자 `API_BASE_URL`은 환경변수·상수'],
              ],
            },
            { type: 'note', tone: 'tip', text: '백엔드(파이썬·DB)는 `created_at`, 프론트(JS)는 `createdAt`을 쓰는 경우가 많아요. API에서 어느 쪽으로 맞출지는 팀이 정해 두는 결정이에요. 풀스택 코스에서 직접 부딪혀 볼 거예요.' },
          ],
        },
      ],
    },
    {
      title: '문자열은 자동 이스케이프',
      slides: [
        {
          title: '댓글에 해킹 코드를 쓴다면?',
          blocks: [
            { type: 'say', text: '댓글 기능을 만들었는데 누가 댓글에 이런 걸 썼다고 해 볼게요.' },
            { type: 'code', code: `<img src=x onerror="alert('해킹!')">` },
            { type: 'say', text: '이게 HTML로 그대로 들어가면 다른 사람이 댓글을 보는 순간 그 코드가 실행돼요. 진짜 해커라면 alert 대신 로그인 정보를 훔치는 코드를 넣겠죠. 이런 공격을 **XSS**(크로스 사이트 스크립팅)라고 해요.' },
          ],
        },
        {
          title: 'React가 기본으로 막아 줘요',
          blocks: [
            { type: 'say', text: 'React는 `{ }` 안에 들어간 문자열을 **태그로 해석하지 않고 글자 그대로** 보여 줘요. `<`를 `&lt;`로 바꾸는 식으로요. 이걸 **이스케이프(escape)** 라고 해요.' },
            {
              type: 'code',
              code: `<p>{comment}</p>
// comment = '<img src=x onerror="alert(1)">'
// 실제 HTML: <p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>
// → 화면에 글자로 찍히고, 실행되지 않는다`,
            },
            { type: 'note', tone: 'warn', text: '예외가 하나 있어요. `dangerouslySetInnerHTML`을 쓰면 이스케이프 없이 HTML이 **그대로** 들어가요. 이름부터 "위험하게"예요. 꼭 써야 하면(예: 블로그 글 HTML) **DOMPurify** 같은 도구로 위험한 부분을 걸러 낸 뒤 넣어요. 코드 리뷰에서 이걸 보면 무조건 한 번 더 확인해요.' },
          ],
        },
      ],
    },
    {
      title: '최상위는 하나만: Fragment',
      slides: [
        {
          title: '왜 하나로 감싸야 할까요',
          blocks: [
            { type: 'code', code: `// ❌ 에러: 최상위 요소가 두 개
return (
  <h1>제목</h1>
  <p>내용</p>
);` },
            { type: 'ask', q: 'JSX는 함수 호출로 바뀐다고 했죠. 그럼 왜 최상위가 하나여야 할까요?', a: '컴포넌트는 `return jsx(...)`로 값을 돌려주는데, **함수는 값을 하나만 돌려줄 수 있어요.** `return a, b`는 안 되잖아요. 그래서 맨 위는 하나로 묶어야 해요.' },
            { type: 'say', text: '그렇다고 아무 의미 없는 `<div>`로 감싸면 화면에 쓸데없는 div가 쌓여요. CSS 레이아웃(flex, grid)이 깨지기도 하고요.' },
          ],
        },
        {
          title: '<> </> 빈 껍데기',
          blocks: [
            {
              type: 'code',
              code: `return (
  <>
    <h1>제목</h1>
    <p>내용</p>
  </>
);
// 실제 화면에는 h1과 p만 남고, <> 는 아무 태그도 안 만든다`,
            },
            { type: 'say', text: '`<> </>`를 **Fragment(조각)** 라고 해요. "묶기만 하고 화면에는 흔적을 남기지 않는" 투명 포장지예요.' },
            { type: 'note', tone: 'tip', text: '목록을 map으로 돌리면서 Fragment에 key를 줘야 할 때는 짧은 문법 대신 `<Fragment key={item.id}>`로 써요. `<>`에는 속성을 못 붙여요.' },
            { type: 'say', text: 'JSX 규칙 끝! 확인 문제로 정리해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're02-4-q1',
      source: 'JSX는 결국 자바스크립트',
      type: 'ox',
      question: '브라우저는 JSX를 그대로 읽을 수 있어서 변환 없이 실행된다.',
      answer: false,
      explanation: '브라우저는 JSX를 몰라요. 빌드할 때 jsx() 같은 자바스크립트 함수 호출로 바뀐 뒤 실행돼요.',
    },
    {
      id: 're02-4-q2',
      source: '{ } 안에는 표현식만',
      type: 'mcq',
      question: 'JSX의 { } 안에 쓸 수 없는 것은?',
      choices: ['{price * qty}', "{isVip ? 'VIP' : '일반'}", '{if (ok) { return 1 }}', '{items.map((it) => <li key={it.id}>{it.name}</li>)}'],
      answer: 2,
      explanation: '{ } 안에는 값이 나오는 표현식만 들어가요. if는 값을 만들지 않는 문장이라 못 써요. 대신 삼항 연산자나 &&를 써요.',
    },
    {
      id: 're02-4-q3',
      source: '{ } 안에는 표현식만',
      type: 'mcq',
      question: 'count가 0일 때 {count && <p>{count}개</p>} 는 화면에 무엇을 보여 줄까?',
      choices: ['아무것도 안 보인다', '"0"이 보인다', '"0개"가 보인다', '에러가 난다'],
      answer: 1,
      explanation: '&&는 앞이 거짓이면 앞의 값(0)을 그대로 돌려줘요. React는 false·null은 안 그리지만 숫자 0은 그려요. count > 0 && 로 써야 안전해요.',
    },
    {
      id: 're02-4-q4',
      source: '속성 이름은 카멜 표기',
      type: 'short',
      question: 'HTML의 class 속성을 JSX에서는 무엇이라고 쓸까?',
      answer: ['className'],
      explanation: 'class는 자바스크립트 예약어라서, DOM API 이름인 className을 써요. for는 htmlFor예요.',
    },
    {
      id: 're02-4-q5',
      source: '속성 이름은 카멜 표기',
      type: 'mcq',
      question: '배경색을 빨간색으로 하는 JSX로 옳은 것은?',
      choices: ['style="background-color: red"', "style={{ backgroundColor: 'red' }}", "style={{ 'background-color': red }}", "style={backgroundColor: 'red'}"],
      answer: 1,
      explanation: 'style에는 객체를 넘기고, 키는 카멜 표기(backgroundColor)를 써요. 바깥 { }는 보간법, 안쪽 { }는 객체예요.',
    },
    {
      id: 're02-4-q6',
      source: '속성 이름은 카멜 표기',
      type: 'mcq',
      question: 'React 컴포넌트 이름에 반드시 써야 하는 표기법은?',
      choices: ['camelCase (todoItem)', 'PascalCase (TodoItem)', 'kebab-case (todo-item)', 'snake_case (todo_item)'],
      answer: 1,
      explanation: '컴포넌트는 대문자로 시작하는 PascalCase여야 해요. 소문자로 시작하면 React가 HTML 태그로 읽어요.',
    },
    {
      id: 're02-4-q7',
      source: '문자열은 자동 이스케이프',
      type: 'mcq',
      question: "comment가 '<img src=x onerror=\"alert(1)\">' 일 때 <p>{comment}</p> 는 어떻게 될까?",
      choices: ['이미지 태그가 만들어지고 alert가 실행된다', '태그가 아니라 글자 그대로 화면에 보인다', '아무것도 안 보인다', '빌드 에러가 난다'],
      answer: 1,
      explanation: 'React는 { } 안의 문자열을 이스케이프해서 글자로 보여 줘요. 덕분에 XSS 공격을 기본으로 막아요.',
    },
    {
      id: 're02-4-q8',
      source: '문자열은 자동 이스케이프',
      type: 'ox',
      question: 'dangerouslySetInnerHTML로 넣은 HTML도 React가 자동으로 이스케이프해 준다.',
      answer: false,
      explanation: 'dangerouslySetInnerHTML은 이스케이프 없이 그대로 넣어요. 꼭 써야 하면 DOMPurify 같은 도구로 먼저 걸러 내요.',
    },
    {
      id: 're02-4-q9',
      source: '최상위는 하나만: Fragment',
      type: 'mcq',
      question: '컴포넌트가 <h1>과 <p>를 나란히 돌려주고 싶은데, 화면에 불필요한 태그는 남기고 싶지 않다. 가장 알맞은 방법은?',
      choices: ['<div>로 감싼다', '<> </> (Fragment)로 감싼다', 'return을 두 번 쓴다', '배열 [<h1/>, <p/>]만 쓴다'],
      answer: 1,
      explanation: 'Fragment는 묶기만 하고 실제 DOM에는 아무 태그도 남기지 않아요. div로 감싸면 레이아웃이 깨질 수 있어요.',
    },
  ],
}

export default topic

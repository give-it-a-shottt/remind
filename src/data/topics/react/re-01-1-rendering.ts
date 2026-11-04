import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-01-1-rendering',
  track: 'react',
  group: '01. React 시작하기',
  title: '1-1. React는 화면을 어떻게 그릴까',
  order: 101,
  notionId: '409df951bf8080af92d9cfc8bd08af30',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '컴포넌트: 화면을 레고 블록처럼',
      slides: [
        {
          title: '같은 카드를 20번 복사할 건가요?',
          blocks: [
            { type: 'say', text: '반가워요! 오늘 첫 수업은 React가 화면을 어떻게 그리는지예요.\n\n먼저 쇼핑몰 화면을 하나 떠올려 볼게요. 상품 카드가 20개 있어요. 사진, 이름, 가격이 들어 있는 똑같은 모양의 카드예요.' },
            { type: 'ask', q: 'HTML만 쓴다면 이 카드 20개를 어떻게 만들까요?', a: '카드 HTML을 20번 복사해서 붙여 넣겠죠.\n그런데 카드 디자인을 하나 바꾸려면? 20군데를 다 고쳐야 해요. 하나라도 빠뜨리면 그 카드만 모양이 달라져요.' },
            { type: 'say', text: 'React는 이 문제를 이렇게 풀어요. **카드 모양을 딱 한 번만 만들어 두고, 필요한 곳에서 가져다 쓴다.**\n\n이렇게 한 번 만들어 두고 여러 번 쓰는 화면 조각을 **컴포넌트(component)** 라고 불러요.' },
            { type: 'note', tone: 'analogy', text: '레고 블록이랑 같아요. 블록 모양은 공장에서 한 번만 설계하고, 우리는 그 블록을 원하는 만큼 꽂아서 집도 만들고 자동차도 만들어요. 화면 전체는 컴포넌트 블록을 조립한 결과예요.' },
          ],
        },
        {
          title: '컴포넌트는 그냥 함수예요',
          blocks: [
            { type: 'say', text: '겁먹을 필요 없어요. React 컴포넌트는 **화면 모양(JSX)을 돌려주는 자바스크립트 함수**일 뿐이에요.' },
            {
              type: 'code',
              code: `// 1) 카드 모양을 한 번만 만든다
function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price}원</p>
    </div>
  );
}

// 2) 필요한 곳에서 가져다 쓴다
<ProductCard name="키보드" price={39000} />
<ProductCard name="마우스" price={19000} />`,
              caption: '카드를 2개 썼지만 모양 코드는 한 군데에만 있어요',
            },
            { type: 'say', text: '하나씩 볼게요.' },
            {
              type: 'list',
              items: [
                '`function ProductCard` → 컴포넌트는 함수로 만들어요.',
                '`return ( <div>…</div> )` → 함수가 돌려주는 HTML처럼 생긴 코드를 **JSX**라고 해요. "이 컴포넌트는 이렇게 생겼어요"라는 설명서예요.',
                '`{ name, price }` → 쓰는 쪽에서 넘겨준 값이에요. 이걸 **props**(properties의 줄임말)라고 불러요. 함수의 인자와 똑같아요.',
                '`<ProductCard name="키보드" />` → 컴포넌트를 쓸 때는 HTML 태그처럼 써요.',
              ],
            },
          ],
        },
        {
          title: '이름은 꼭 대문자로 시작해요',
          blocks: [
            { type: 'ask', q: '컴포넌트 이름을 productCard처럼 소문자로 시작하면 어떻게 될까요?', a: 'React가 그걸 컴포넌트가 아니라 HTML 태그로 착각해요.\n`<div>`, `<p>`처럼 소문자 태그는 "브라우저에 원래 있는 태그"로 읽고, 대문자로 시작하는 `<ProductCard>`만 "내가 만든 컴포넌트"로 읽거든요. 그래서 소문자로 쓰면 화면에 아무것도 안 나오거나 경고가 떠요.' },
            { type: 'note', tone: 'tip', text: '실무 규칙: 컴포넌트 1개 = 파일 1개, 파일 이름 = 컴포넌트 이름. `ProductCard.jsx` 안에 `ProductCard` 컴포넌트가 있으면 찾기도 고치기도 쉬워요.' },
            { type: 'say', text: '정리해 볼게요.\n\n• 컴포넌트 = 화면 조각을 돌려주는 함수\n• JSX = 그 조각이 어떻게 생겼는지 적은 코드\n• props = 쓰는 쪽에서 넘겨주는 값\n\n자, 제대로 이해했는지 문제로 확인해 볼까요?' },
          ],
        },
      ],
    },
    {
      title: '상태(state): 화면은 상태의 결과',
      slides: [
        {
          title: '숫자가 바뀌면 화면은 누가 바꿀까요?',
          blocks: [
            { type: 'say', text: '이번엔 좋아요 버튼을 만들어 볼게요. 누를 때마다 숫자가 1씩 올라가요.\n\nReact를 모르고 자바스크립트만으로 만들면 이렇게 해요.' },
            { type: 'list', ordered: true, items: ['화면에서 숫자가 적힌 태그를 찾는다', '그 태그 안의 글자를 새 숫자로 직접 바꾼다'] },
            { type: 'say', text: '버튼이 하나면 괜찮아요. 그런데 숫자가 화면 세 군데(버튼, 상단 알림, 사이드바)에 나온다면? 세 군데를 전부 찾아서 바꿔야 해요. 하나라도 빠뜨리면 화면끼리 숫자가 달라지는 버그가 생겨요.' },
            { type: 'say', text: 'React는 방법을 바꿨어요.\n\n**"너는 숫자만 바꿔. 화면은 내가 다시 그려 줄게."**\n\n이때 "바뀌면 화면도 같이 바뀌어야 하는 값"을 **상태(state)** 라고 불러요.' },
            { type: 'note', tone: 'analogy', text: '엑셀을 떠올려 보세요. A1 칸의 숫자만 바꾸면 `=A1*2` 수식이 들어 있는 칸들은 알아서 다시 계산되죠. 상태는 A1 칸이고, 화면은 수식 칸이에요. 우리는 A1만 바꾸면 돼요.' },
          ],
        },
        {
          title: 'useState 한 줄씩 읽기',
          blocks: [
            {
              type: 'code',
              code: `import { useState } from 'react';

function LikeButton() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      좋아요 {count}
    </button>
  );
}`,
            },
            {
              type: 'list',
              items: [
                '`useState(0)` → "처음 값이 0인 상태 하나 만들어 줘"라는 뜻이에요.',
                '`count` → 지금 상태 값이에요. 읽기만 해요.',
                '`setCount` → 상태를 바꾸는 함수예요. **이걸 불러야 React가 "아, 바뀌었구나" 하고 화면을 다시 그려요.**',
                '`onClick={() => setCount(count + 1)}` → 버튼을 누르면 상태를 1 올려 달라고 요청해요.',
              ],
            },
            { type: 'say', text: 'React는 `setCount`가 불리면 `LikeButton` 함수를 **처음부터 다시 실행**해요. 이번엔 `count`가 1이니까 "좋아요 1"이 적힌 버튼 모양이 나오고, 그게 화면에 반영돼요. 이걸 **리렌더링**이라고 불러요.' },
          ],
        },
        {
          title: '그냥 변수로 하면 안 되나요?',
          blocks: [
            {
              type: 'code',
              code: `function LikeButton() {
  let count = 0;
  return <button onClick={() => { count++; }}>좋아요 {count}</button>;
}`,
              caption: '누르면 count는 올라갈까요? 화면은 바뀔까요?',
            },
            { type: 'ask', q: '이 버튼을 10번 누르면 화면에 뭐가 보일까요?', a: '계속 "좋아요 0"이에요.\n`count++`로 변수 값은 올라가지만, React한테 아무도 "바뀌었어"라고 알려 주지 않았어요. 그래서 React는 화면을 다시 그리지 않아요.\n게다가 혹시 다시 그려지더라도 함수가 처음부터 실행되면서 `let count = 0`으로 또 0이 돼요. 상태는 React가 함수 바깥에 따로 보관해 주기 때문에 다시 그려도 값이 남아 있는 거예요.' },
            { type: 'note', tone: 'warn', text: '`setCount(count + 1)`을 부른 바로 다음 줄에서 `console.log(count)`를 찍으면 아직 **이전 값**이 나와요. 새 값은 다음 렌더링 때 함수가 다시 실행되면서 들어와요. 처음 배울 때 가장 많이 헷갈리는 부분이에요.' },
            { type: 'say', text: '한 줄로 정리하면 **화면은 상태의 결과**예요. 우리는 상태만 바꾸고, 화면을 바꾸는 일은 React가 해요.\n\n확인 문제 가 볼까요?' },
          ],
        },
      ],
    },
    {
      title: '단방향 데이터 흐름: 데이터는 위에서 아래로',
      slides: [
        {
          title: '부모와 자식 컴포넌트',
          blocks: [
            { type: 'say', text: '컴포넌트 안에 컴포넌트를 넣을 수 있어요. 바깥쪽을 **부모**, 안쪽을 **자식**이라고 불러요.\n\n그럼 질문이요. 부모가 가진 상태를 자식도 보여 줘야 하면 어떻게 할까요? 앞에서 배운 **props**로 내려 줘요.' },
            {
              type: 'code',
              code: `function Parent() {
  const [count, setCount] = useState(0);   // 상태는 부모가 가진다
  return <Child count={count} onPlus={() => setCount(count + 1)} />;
}

function Child({ count, onPlus }) {
  return <button onClick={onPlus}>{count}</button>;  // 자식은 읽고, 요청만 한다
}`,
            },
            { type: 'say', text: '여기서 중요한 규칙이 하나 있어요. **자식은 받은 props를 직접 바꿀 수 없어요.** `count = 5`처럼 고치면 안 돼요.\n\n그럼 자식이 숫자를 올리고 싶으면요? 부모가 함께 내려 준 함수 `onPlus`를 불러서 **"부모님, 올려 주세요"라고 요청**해요.' },
          ],
        },
        {
          title: '데이터는 아래로, 이벤트는 위로',
          blocks: [
            { type: 'list', ordered: true, items: ['부모가 `useState`로 상태를 가진다', '상태를 props로 자식에게 내려 준다', '자식은 값을 읽기만 하고, 바꾸고 싶으면 부모가 준 함수를 부른다', '부모 상태가 바뀌면 React가 부모와 자식을 다시 그린다 → 자식은 새 값을 받는다'] },
            { type: 'note', tone: 'analogy', text: '식당 주방이라고 생각해 보세요. 메뉴판(데이터)은 주방장(부모)이 정해서 홀 직원(자식)에게 내려 줘요. 홀 직원은 메뉴판을 마음대로 고치지 않고, "이 메뉴 품절이에요"라고 주방에 알려요(이벤트). 메뉴판은 언제나 주방 한 곳에서만 바뀌어요.' },
            { type: 'say', text: '이렇게 데이터가 **부모 → 자식, 한 방향으로만** 흐르는 걸 **단방향 데이터 흐름(one-way data flow)** 이라고 해요.' },
          ],
        },
        {
          title: '왜 굳이 한 방향으로만?',
          blocks: [
            { type: 'ask', q: '여러 컴포넌트가 아무 데서나 서로 값을 바꿀 수 있다면 어떤 일이 생길까요?', a: '화면에 이상한 숫자가 떴을 때 "누가 이 값을 바꿨지?"를 찾기가 정말 어려워져요. 범인 후보가 너무 많거든요.\n단방향이면 값의 주인은 항상 위쪽 한 곳이라, 그 컴포넌트만 보면 돼요. 버그 찾기가 쉬워져요.' },
            {
              type: 'table',
              head: ['', '단방향 (React)', '양방향 바인딩 (Vue `v-model` 등)'],
              rows: [
                ['데이터 방향', '부모 → 자식', '화면 ↔ 데이터 자동 동기화'],
                ['input 연결', '`value`와 `onChange`를 직접 연결', '문법 하나로 자동'],
                ['장점', '값이 어디서 바뀌는지 추적이 쉬움', '코드가 짧음'],
                ['단점', '코드가 조금 길어짐', '큰 앱에서 변경 출처를 찾기 어려움'],
              ],
            },
            { type: 'note', tone: 'warn', text: '책에서 "단방향 데이터 바인딩"이라고 쓰기도 하는데, React 공식 문서 용어는 **단방향 데이터 흐름**이에요. 면접에서는 "흐름"이라고 말하는 게 정확해요.' },
          ],
        },
      ],
    },
    {
      title: '가상 DOM과 재조정',
      slides: [
        {
          title: '먼저, DOM이 뭐예요?',
          blocks: [
            { type: 'say', text: '브라우저는 HTML 글자를 그대로 화면에 그리지 않아요. 먼저 HTML을 읽어서 **태그들이 부모-자식으로 연결된 나무(트리) 모양 구조**를 만들어요. 이게 **DOM**(Document Object Model)이에요.\n\n자바스크립트로 화면을 바꾼다는 건 이 DOM을 고친다는 뜻이에요.' },
            { type: 'say', text: '그런데 DOM을 고치는 건 **비싼 작업**이에요. 글자 하나만 바꿔도 브라우저가 "옆 요소 위치가 밀렸나? 크기가 바뀌었나?"를 다시 계산하고 다시 칠할 수 있거든요.' },
            { type: 'note', tone: 'analogy', text: '집 리모델링을 생각해 보세요. 벽을 하나 바꿀 때마다 실제 공사를 하면 돈도 시간도 많이 들죠. 그래서 먼저 **설계도 위에서** 이전 설계도와 새 설계도를 비교하고, 정말 달라진 벽만 공사해요. React의 설계도가 바로 **가상 DOM**이에요.' },
          ],
        },
        {
          title: 'React가 화면을 바꾸는 3단계',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**렌더**: 상태가 바뀌면 컴포넌트 함수를 다시 실행해서, 새 화면 모양을 자바스크립트 객체 트리(가상 DOM)로 만든다',
                '**재조정(reconciliation)**: 이전 트리와 새 트리를 비교해서 달라진 곳을 찾는다',
                '**커밋**: 달라진 부분만 실제 DOM에 반영한다',
              ],
            },
            {
              type: 'table',
              head: ['상황', '이전 트리', '새 트리', '실제 DOM 작업'],
              rows: [
                ['count 0 → 1', '`<button>0</button>`', '`<button>1</button>`', '버튼은 그대로, 글자만 교체'],
                ['목록에 C 추가', '`<li>A</li><li>B</li>`', '`<li>A</li><li>B</li><li>C</li>`', '`<li>C</li>` 하나만 추가'],
              ],
            },
            { type: 'say', text: '덕분에 우리는 "상태가 이러면 화면은 이렇게 생겼어"라고 **결과만 적으면** 돼요. 어디를 어떻게 고칠지는 React가 계산해요. 이런 방식을 **선언형**이라고 불러요.' },
          ],
        },
        {
          title: '목록에는 key가 필요해요',
          blocks: [
            { type: 'say', text: '목록을 그릴 때 React는 "이전 목록의 몇 번째가 새 목록의 몇 번째지?"를 알아야 비교할 수 있어요. 그래서 각 항목에 **이름표(key)** 를 붙여 줘요.' },
            {
              type: 'code',
              code: `{todos.map((todo) => (
  <li key={todo.id}>{todo.text}</li>
))}`,
              caption: 'key는 형제끼리 겹치지 않는 고유한 값이면 돼요 (보통 데이터의 id)',
            },
            { type: 'ask', q: 'key로 배열 순서(index)를 쓰면 왜 문제가 될 수 있을까요?', a: '맨 앞에 항목이 하나 끼어들면 모든 항목의 index가 하나씩 밀려요. React는 "0번이 0번이네" 하고 같은 항목인 줄 알고 비교하는데, 실제로는 다른 항목이에요.\n그래서 입력 칸에 적어 둔 글자가 엉뚱한 줄로 옮겨 가는 버그가 생길 수 있어요. 순서가 바뀌지 않는 고정 목록이 아니라면 id를 key로 써요.' },
          ],
        },
        {
          title: '가상 DOM이면 무조건 빠르다?',
          blocks: [
            { type: 'note', tone: 'warn', text: '"가상 DOM이라서 무조건 빠르다"는 틀린 말이에요. 이전 트리와 새 트리를 비교하는 일 자체도 비용이에요. 잘 짠 직접 DOM 조작이 더 빠를 때도 있어요.' },
            { type: 'say', text: '정확한 장점은 이거예요. **선언형으로 편하게 써도 대부분의 경우 충분히 빠르다.**\n\n그리고 요즘 React에는 **React Compiler**(2025년 10월 1.0)가 있어요. 빌드할 때 "다시 계산할 필요 없는 부분"을 기억해 두는 코드를 자동으로 넣어서 쓸데없는 리렌더링을 줄여 줘요. 기본으로 켜져 있지는 않고, 설정으로 켜는 선택 기능이에요.' },
            { type: 'say', text: '첫 레슨 마지막 개념이에요. 문제로 확인하고 마무리할게요!' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're01-1-q1',
      source: '컴포넌트: 화면을 레고 블록처럼',
      type: 'mcq',
      question: 'React 컴포넌트에 대한 설명으로 옳은 것은?',
      choices: ['HTML 파일 하나를 뜻한다', '화면 조각(JSX)을 돌려주는 함수다', '브라우저에 원래 있는 태그다', '스타일만 담는 CSS 묶음이다'],
      answer: 1,
      explanation: '컴포넌트는 "이 조각은 이렇게 생겼어요"라는 JSX를 돌려주는 자바스크립트 함수예요. 한 번 만들어 두고 여러 곳에서 가져다 써요.',
      choiceExplanations: ['컴포넌트는 파일이 아니라 함수예요. 보통 파일 하나에 컴포넌트 하나를 두지만 같은 건 아니에요.', '맞아요. 함수가 JSX를 돌려줘요.', '브라우저에 원래 있는 건 `div`, `p` 같은 HTML 태그예요. 컴포넌트는 우리가 만든 거예요.', '컴포넌트는 모양(JSX)과 동작을 함께 가져요. CSS만 담는 게 아니에요.'],
    },
    {
      id: 're01-1-q2',
      source: '컴포넌트: 화면을 레고 블록처럼',
      type: 'ox',
      question: '컴포넌트 이름을 productCard처럼 소문자로 시작해도 React는 내가 만든 컴포넌트로 알아본다.',
      answer: false,
      explanation: 'React는 소문자로 시작하는 태그를 HTML 태그로 읽어요. 내가 만든 컴포넌트는 반드시 대문자로 시작해야 해요 (`ProductCard`).',
    },
    {
      id: 're01-1-q3',
      source: '상태(state): 화면은 상태의 결과',
      type: 'mcq',
      question: '아래 버튼을 눌러도 화면의 숫자가 0에서 바뀌지 않는 가장 큰 이유는?',
      code: `function LikeButton() {
  let count = 0;
  return <button onClick={() => { count++; }}>좋아요 {count}</button>;
}`,
      choices: ['onClick 철자가 틀려서', 'React에게 값이 바뀌었다고 알리지 않아서 다시 그리지 않기 때문에', 'count++ 문법이 자바스크립트에 없어서', 'button 태그는 숫자를 보여 줄 수 없어서'],
      answer: 1,
      explanation: 'React는 상태를 바꾸는 함수(setCount 같은)가 불려야 "바뀌었구나" 하고 컴포넌트를 다시 실행해요. 일반 변수는 바꿔도 아무도 알려 주지 않으니 화면이 그대로예요. 그래서 `useState`를 써야 해요.',
    },
    {
      id: 're01-1-q4',
      source: '상태(state): 화면은 상태의 결과',
      type: 'short',
      question: '"바뀌면 화면도 다시 그려져야 하는 값"을 컴포넌트에 만들 때 쓰는 React 훅 이름은?',
      answer: ['useState', 'useState()'],
      explanation: '`const [값, 바꾸는함수] = useState(처음값)` 형태로 써요. 바꾸는 함수를 부르면 React가 화면을 다시 그려요.',
    },
    {
      id: 're01-1-q5',
      source: '상태(state): 화면은 상태의 결과',
      type: 'ox',
      question: 'setCount(count + 1)을 부른 바로 다음 줄에서 console.log(count)를 찍으면 이미 바뀐 새 값이 나온다.',
      answer: false,
      explanation: '그 줄에서는 아직 이전 값이에요. 새 값은 React가 컴포넌트를 다시 실행하는 다음 렌더링 때 들어와요.',
    },
    {
      id: 're01-1-q6',
      source: '단방향 데이터 흐름: 데이터는 위에서 아래로',
      type: 'mcq',
      question: '자식 컴포넌트가 부모가 가진 count를 1 올리고 싶어요. 올바른 방법은?',
      choices: ['자식에서 props.count = props.count + 1 로 직접 바꾼다', '자식에서 useState로 count를 하나 더 만든다', '부모가 내려 준 함수(예: onPlus)를 호출해 부모에게 바꿔 달라고 요청한다', '전역 변수에 count를 저장한다'],
      answer: 2,
      explanation: '데이터는 아래로, 이벤트는 위로! 값의 주인은 부모라서, 자식은 부모가 준 함수를 불러 "바꿔 주세요"라고 요청해요. 부모 상태가 바뀌면 새 값이 다시 내려와요.',
      choiceExplanations: ['props는 읽기 전용이라 자식이 직접 바꾸면 안 돼요.', '그러면 부모 값과 자식 값이 따로 놀아서 화면끼리 숫자가 달라져요.', '맞아요. 단방향 데이터 흐름의 기본 패턴이에요.', '전역 변수를 바꿔도 React는 화면을 다시 그리지 않아요.'],
    },
    {
      id: 're01-1-q7',
      source: '단방향 데이터 흐름: 데이터는 위에서 아래로',
      type: 'essay',
      question: '[면접] React의 단방향 데이터 흐름을 설명하고, 이 방식의 장점을 말해 주세요.',
      answer: '데이터는 부모에서 자식으로 props를 통해서만 내려가고, 자식은 받은 props를 직접 바꿀 수 없습니다. 자식이 값을 바꾸고 싶으면 부모가 내려 준 콜백 함수를 호출해 부모 상태를 바꾸고, 부모가 다시 렌더링되면서 새 값이 내려옵니다. 값의 출처가 위쪽 한 곳이라 어디서 값이 바뀌었는지 추적하기 쉽다는 것이 장점입니다.',
      keywords: ['props', '콜백', '부모 상태', '리렌더링', '추적이 쉬움'],
      explanation: '핵심은 "데이터는 아래로, 이벤트(요청)는 위로"예요. 장점으로 변경 출처 추적이 쉽다는 점을 꼭 말해요.',
    },
    {
      id: 're01-1-q8',
      source: '가상 DOM과 재조정',
      type: 'mcq',
      question: '상태가 바뀐 뒤 React가 화면을 바꾸는 순서로 옳은 것은?',
      choices: ['실제 DOM 반영 → 비교 → 함수 다시 실행', '함수 다시 실행(새 트리) → 이전 트리와 비교 → 바뀐 부분만 실제 DOM 반영', '이전 트리와 비교 → 실제 DOM 전체 다시 만들기', '실제 DOM 전체 지우기 → 새로 그리기'],
      answer: 1,
      explanation: '렌더(새 가상 DOM 트리) → 재조정(이전 트리와 비교) → 커밋(달라진 부분만 실제 DOM에 반영) 순서예요.',
    },
    {
      id: 're01-1-q9',
      source: '가상 DOM과 재조정',
      type: 'ox',
      question: '가상 DOM을 쓰면 직접 DOM을 조작하는 것보다 언제나 더 빠르다.',
      answer: false,
      explanation: '트리를 비교하는 일도 비용이에요. 장점은 "선언형으로 편하게 써도 대부분 충분히 빠르다"는 것이지, 언제나 더 빠르다는 게 아니에요.',
    },
    {
      id: 're01-1-q10',
      source: '가상 DOM과 재조정',
      type: 'mcq',
      question: '목록을 그릴 때 각 항목에 key를 붙이는 이유는?',
      choices: ['CSS 스타일을 적용하려고', 'React가 이전 목록과 새 목록에서 같은 항목을 정확히 짝지어 비교하려고', '항목을 알파벳 순으로 정렬하려고', '검색 엔진이 목록을 읽게 하려고'],
      answer: 1,
      explanation: 'key는 항목의 이름표예요. 이름표가 있어야 React가 "이건 아까 그 항목"이라고 알아보고 바뀐 것만 고쳐요. 순서가 바뀔 수 있는 목록이면 index 대신 id를 써요.',
    },
  ],
}

export default topic

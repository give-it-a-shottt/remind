import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-03-2-immutability',
  track: 'react',
  group: '03. 상태·스타일·이벤트·폼',
  title: '3-2. 불변성: 상태를 직접 고치면 안 되는 이유',
  order: 302,
  notionId: '409df951bf8081e39a3bd5e6fc7cb76d',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '직접 고치면 생기는 유령 버그',
      slides: [
        {
          title: '버튼을 눌렀는데 아무 일도 없어요',
          blocks: [
            { type: 'say', text: '이번 수업은 React에서 **가장 중요한 규칙** 중 하나예요. 면접 단골 질문이기도 하고요.\n\n먼저 버그 하나를 보여 줄게요.' },
            {
              type: 'code',
              code: `const [items, setItems] = useState(['A']);

const addWrong = () => {
  items.push('X');       // 원본 배열을 직접 고침
  setItems(items);       // 같은 배열을 다시 넣음
};
const addRight = () => {
  setItems([...items, 'O']);   // 새 배열
};`,
            },
            { type: 'ask', q: '"잘못 추가"를 2번 누르면 화면은 어떻게 될까요?', a: '계속 **A** 그대로예요. 2-1에서 배운 것처럼 React는 "같은 상자(같은 주소)인가?"만 보는데, push는 상자 안에 몰래 넣은 거라 상자가 그대로거든요. React는 "안 바뀌었네" 하고 다시 그리지 않아요.' },
          ],
        },
        {
          title: '그리고 나중에 터져요',
          blocks: [
            { type: 'say', text: '진짜 무서운 건 지금부터예요. 그 상태에서 **"제대로 추가"를 1번** 누르면 화면이 이렇게 돼요.' },
            { type: 'code', code: `A,X,X,O` },
            { type: 'ask', q: '분명 X는 화면에 한 번도 안 나왔는데, 왜 갑자기 두 개가 튀어나왔을까요?', a: 'push로 넣은 X 두 개는 **데이터 안에는 이미 들어가 있었어요.** 화면만 몰랐던 거예요.\n"제대로 추가"가 새 배열 `[...items, \'O\']`를 만들 때 이미 X가 두 개 든 items를 복사했으니, 숨어 있던 X가 한꺼번에 나타난 거예요.' },
            { type: 'note', tone: 'warn', text: '직접 수정은 "화면이 안 바뀜"으로 끝나지 않아요. 데이터와 화면이 **몰래 어긋난 채로** 있다가 **엉뚱한 순간에** 터져요. 이런 버그는 원인을 찾기가 정말 어려워요. AI가 짠 코드에서도 자주 나오는 실수라 코드 리뷰 단골 항목이에요.' },
          ],
        },
      ],
    },
    {
      title: '얕은 비교: 송장 번호만 본다',
      slides: [
        {
          title: '상태는 상자 안의 상자',
          blocks: [
            { type: 'say', text: '"왜 React는 안쪽까지 안 보고 상자만 보냐"는 의문이 들죠? 이유를 택배로 설명해 볼게요.\n\n상태는 **상자 안에 상자가 든 택배**예요. 상자마다 **송장 번호(메모리 주소)** 가 붙어 있어요.' },
            {
              type: 'code',
              code: `state (송장 #100)
├─ user (#200)
│  └─ address (#300) → city: '서울'
└─ todos (#400)`,
            },
            {
              type: 'table',
              head: ['비교 방식', '하는 일', '비용'],
              rows: [
                ['깊은 비교', '모든 상자를 다 열어서 안의 물건을 하나하나 대조', '상자가 많을수록 느려짐'],
                ['**얕은 비교**', '**송장 번호만** 비교. 번호가 같으면 "안 바뀜"', '항상 한 번. 엄청 빠름'],
              ],
            },
          ],
        },
        {
          title: 'React는 빠른 쪽을 골랐어요',
          blocks: [
            { type: 'say', text: 'React는 렌더링할 때마다 "바뀌었나?"를 확인해야 해요. 매번 모든 상자를 열어 보면 앱이 느려지겠죠. 그래서 **얕은 비교**를 써요.\n\n• `setState`는 이전 값과 새 값을 `Object.is`로 비교해요(주소가 같은가)\n• `memo`는 props를 하나씩 `Object.is`로 비교해요' },
            { type: 'say', text: '대신 약속이 하나 생겨요. **"바꿀 때는 반드시 새 상자에 담아서 줄게."** 이 약속을 **불변성**이라고 해요. 원본은 절대 고치지 않고, 바뀐 건 새로 만들어요.' },
            { type: 'note', tone: 'analogy', text: '택배 회사가 상자를 일일이 뜯어보지 않고 송장 번호만 찍어서 분류하는 것과 같아요. 대신 내용물이 바뀌었으면 **새 송장을 붙여서** 다시 보내야 해요. 같은 송장에 내용물만 바꿔 넣으면 택배 회사는 모르죠.' },
          ],
        },
      ],
    },
    {
      title: '경로 복사: 바뀐 길만 새로 포장',
      slides: [
        {
          title: '세 가지 방법 비교',
          blocks: [
            { type: 'say', text: 'city를 서울에서 부산으로 바꾸고 싶어요. 방법이 세 가지 있어요.' },
            {
              type: 'table',
              head: ['방법', '송장 번호', 'React가 보기에', '결과'],
              rows: [
                ['① 직접 수정: 상자를 열고 물건만 바꿈', '그대로 #100', '"안 바뀜"', '화면 안 바뀜 (유령 버그)'],
                ['② 깊은 복사: 모든 상자를 새로 포장', '전부 새 번호', '"전부 바뀜"', '화면은 바뀌지만 안 바뀐 todos까지 "바뀜" → memo 무의미, 비용도 큼'],
                ['③ **경로 복사**: 바뀐 물건이 든 상자 + 그걸 감싼 상자들만 새로', 'state·user·address만 새 번호, todos는 #400 그대로', '바뀐 곳만 정확히 "바뀜"', '**정답**'],
              ],
            },
          ],
        },
        {
          title: '경로 복사를 코드로',
          blocks: [
            { type: 'say', text: 'city가 바뀌면, city가 든 **address 상자 → 그걸 담은 user 상자 → 맨 바깥 state 상자**. 이 세 개만 새로 포장해요. todos는 건드리지 않아요.' },
            {
              type: 'code',
              code: `const next = {
  ...state,                                           // state: 새 상자
  user: {
    ...state.user,                                    // user: 새 상자
    address: { ...state.user.address, city: '부산' }, // address: 새 상자
  },
};
// todos는 ...state가 주소만 복사 → 이전 것을 그대로 공유`,
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '맨 바깥 송장이 바뀌었으니 React는 **비교 한 번으로** "뭔가 바뀌었다"를 알아요',
                '내려가 보면 todos는 송장이 그대로 → todos를 받는 자식(memo)은 **건너뛰어요**',
                '바뀐 걸 찾으려고 상자를 전부 열 필요가 없어요',
              ],
            },
            { type: 'say', text: '바뀐 길만 새 주소를 갖고 안 바뀐 가지는 이전 것을 같이 쓰는 걸 **구조적 공유**라고도 불러요.' },
          ],
        },
        {
          title: '층마다 ...을 빠뜨리면',
          blocks: [
            {
              type: 'code',
              code: `const next = {
  ...state,
  user: { address: { ...state.user.address, city: '부산' } },  // ...state.user 를 빠뜨림
};
next.user.name;   // undefined  ← name이 사라졌다!`,
            },
            { type: 'say', text: '2-1에서 배운 전개 연산자는 **한 겹만** 복사해요. 그래서 경로 복사는 그 얕은 복사를 **바뀐 길을 따라 층마다 한 번씩** 하는 거예요. 한 층이라도 `...`을 빠뜨리면 그 층의 나머지 속성이 사라져요.' },
            { type: 'note', tone: 'tip', text: '그렇다고 `structuredClone`(깊은 복사)으로 통째로 복사하면 방법 ②가 돼서 오히려 나빠요. 층이 깊어서 실수하기 쉽다면 다음 개념의 **immer**를 써요.' },
          ],
        },
      ],
    },
    {
      title: '배열·객체 불변 업데이트 패턴',
      slides: [
        {
          title: '이것만 외우면 돼요',
          blocks: [
            { type: 'say', text: '실무에서 쓰는 패턴은 생각보다 몇 개 안 돼요. 표 하나로 정리할게요. 왼쪽은 **원본을 바꾸는** 코드라 state에 쓰면 안 되고, 오른쪽이 **새로 만드는** 코드예요.' },
            {
              type: 'table',
              head: ['하고 싶은 것', '❌ 원본 변경', '✅ 새로 만들기'],
              rows: [
                ['배열에 추가', '`push`, `unshift`', '`[...arr, x]`'],
                ['배열에서 삭제', '`splice`', '`arr.filter((t) => t.id !== id)`'],
                ['배열 항목 수정', '`arr[i].done = true`', '`arr.map((t) => t.id === id ? { ...t, done: true } : t)`'],
                ['정렬·뒤집기', '`sort()`, `reverse()`', '`toSorted()`, `toReversed()` (ES2023)'],
                ['객체 속성 수정', '`obj.name = \'x\'`', '`{ ...obj, name: \'x\' }`'],
              ],
            },
          ],
        },
        {
          title: '수정 패턴 한 줄씩 읽기',
          blocks: [
            { type: 'say', text: '제일 헷갈리는 "항목 수정"을 풀어 볼게요.' },
            { type: 'code', code: `setTodos(todos.map((t) => t.id === id ? { ...t, done: true } : t));` },
            {
              type: 'list',
              ordered: true,
              items: [
                '`todos.map(...)` → **새 배열**을 만들어요 (바깥 상자 새로)',
                '`t.id === id ?` → 바꿀 항목이면',
                '`{ ...t, done: true }` → 그 항목만 **새 객체**로 (안쪽 상자 새로)',
                '`: t` → 나머지 항목은 **원래 객체 그대로** (구조적 공유)',
              ],
            },
            { type: 'say', text: '방금 배운 경로 복사가 그대로 들어 있죠? 배열(바깥) → 바뀐 항목(안쪽)만 새로, 나머지는 공유.' },
            { type: 'note', tone: 'warn', text: '`sort()`는 이름과 달리 **원본을 바꿔요.** state 배열을 정렬하려면 `todos.toSorted(...)` 또는 `[...todos].sort(...)`처럼 복사본에서 하세요. 헷갈리면 "이 메서드가 원본을 바꾸나?"를 MDN에서 확인하는 습관을 들여요.' },
          ],
        },
      ],
    },
    {
      title: 'immer와 함수형 업데이트',
      slides: [
        {
          title: '고치듯이 쓰면 경로 복사를 해 주는 도구',
          blocks: [
            { type: 'say', text: '층이 깊으면 `...`을 층마다 쓰다가 실수하기 쉬워요. **immer**는 **직접 고치듯이 쓰면 경로 복사 결과를 대신 만들어 주는** 라이브러리예요.' },
            {
              type: 'code',
              code: `import { produce } from 'immer';

const next = produce(state, (draft) => {
  draft.user.address.city = '부산';   // 고치듯이 써도
});
// 결과는 경로 복사: state·user·address만 새 객체, todos는 공유
// 원본 state는 절대 안 바뀜`,
            },
            { type: 'say', text: '`draft`는 "연습장"이에요. 연습장에 마음껏 고치면 immer가 그걸 보고 바뀐 길만 새로 포장한 결과를 돌려줘요. Redux Toolkit도 안에서 immer를 써요(5장).' },
          ],
        },
        {
          title: '이전 값으로 바꿀 때는 함수를 넘겨요',
          blocks: [
            { type: 'say', text: '불변성과 같이 알아 둘 게 하나 더 있어요. 1-1에서 "setCount 직후에는 아직 이전 값"이라고 했죠. 그래서 이런 일이 생겨요.' },
            {
              type: 'code',
              code: `setCount(count + 1);
setCount(count + 1);         // ⚠️ 1만 증가 — 둘 다 같은 count(0)를 봄

setCount((c) => c + 1);
setCount((c) => c + 1);      // ✅ 2 증가 — 앞의 결과를 이어받음`,
            },
            { type: 'say', text: 'setState에 **함수**를 넘기면 React가 **가장 최신 값**을 넣어서 불러 줘요. 이걸 **함수형 업데이트**라고 해요. 이전 값을 기준으로 바꿀 때(카운터, 토글, 목록에 추가)는 이 방식이 안전해요.' },
            { type: 'code', code: `setTodos((prev) => [...prev, newTodo]);   // 목록 추가도 이렇게` },
            { type: 'say', text: '불변성 수업 끝! 오늘 내용은 면접에 정말 자주 나와요. 확인 문제로 꼭 다져 두세요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're03-2-q1',
      source: '직접 고치면 생기는 유령 버그',
      type: 'mcq',
      question: 'items = ["A"] 상태에서 items.push("X"); setItems(items); 를 2번 실행한 뒤, setItems([...items, "O"]) 를 1번 실행하면 화면은?',
      choices: ['A,O', 'A,X,X,O', 'A,X,O', 'A'],
      answer: 1,
      explanation: 'push로 넣은 X는 데이터에 이미 들어가 있었고 화면만 몰랐어요. 새 배열을 만들 때 그 X들까지 복사돼서 한꺼번에 나타나요.',
    },
    {
      id: 're03-2-q2',
      source: '직접 고치면 생기는 유령 버그',
      type: 'ox',
      question: 'items.push(x) 후 setItems(items)를 하면 React가 바뀐 것을 알아채고 화면을 다시 그린다.',
      answer: false,
      explanation: '같은 배열(같은 주소)을 다시 넣었기 때문에 React는 "안 바뀜"으로 봐요. 새 배열 [...items, x]를 넘겨야 해요.',
    },
    {
      id: 're03-2-q3',
      source: '얕은 비교: 송장 번호만 본다',
      type: 'mcq',
      question: 'React가 상태 변화를 감지하는 방식은?',
      choices: ['모든 속성을 끝까지 비교하는 깊은 비교', '이전 값과 새 값이 같은 객체(같은 주소)인지 보는 얕은 비교', 'JSON 문자열로 바꿔서 비교', '변경 시각을 기록해서 비교'],
      answer: 1,
      explanation: 'setState와 memo는 Object.is로 주소를 비교해요. 빠른 대신 "바꿀 때는 새 객체로"라는 불변성 약속이 필요해요.',
    },
    {
      id: 're03-2-q4',
      source: '경로 복사: 바뀐 길만 새로 포장',
      type: 'mcq',
      question: 'state.user.address.city 만 바꿀 때, 경로 복사로 새로 만들어지는 객체는?',
      choices: ['address 하나만', 'state, user, address', 'state, user, address, todos 전부', '아무것도 새로 만들지 않는다'],
      answer: 1,
      explanation: '바뀐 잎(city)이 든 상자부터 루트까지, 길 위의 상자만 새로 만들어요. todos는 그대로 공유해서 memo가 건너뛸 수 있어요.',
    },
    {
      id: 're03-2-q5',
      source: '경로 복사: 바뀐 길만 새로 포장',
      type: 'ox',
      question: '불변성을 지키려면 structuredClone으로 상태 전체를 깊은 복사하는 것이 가장 좋다.',
      answer: false,
      explanation: '깊은 복사는 비용이 크고, 안 바뀐 부분까지 주소가 바뀌어 memo가 전부 "바뀜"으로 봐요. 바뀐 길만 새로 만드는 경로 복사가 정답이에요.',
    },
    {
      id: 're03-2-q6',
      source: '배열·객체 불변 업데이트 패턴',
      type: 'mcq',
      question: 'todos에서 id가 3인 항목을 지우는 올바른 코드는?',
      choices: ['todos.splice(2, 1); setTodos(todos)', 'setTodos(todos.filter((t) => t.id !== 3))', 'delete todos[2]; setTodos(todos)', 'setTodos(todos.pop())'],
      answer: 1,
      explanation: 'filter는 원본을 건드리지 않고 새 배열을 돌려줘요. splice·delete·pop은 원본을 바꿔요.',
    },
    {
      id: 're03-2-q7',
      source: '배열·객체 불변 업데이트 패턴',
      type: 'mcq',
      question: 'id가 일치하는 할 일만 done: true 로 바꾸는 코드로 옳은 것은?',
      choices: ['todos.find((t) => t.id === id).done = true', 'setTodos(todos.map((t) => t.id === id ? { ...t, done: true } : t))', 'setTodos(todos.map((t) => { t.done = true; return t; }))', 'setTodos({ ...todos, done: true })'],
      answer: 1,
      explanation: 'map으로 새 배열, 바꿀 항목만 { ...t, done: true }로 새 객체, 나머지는 그대로 둬요. 3번은 원본 객체를 고치고 전부 바꿔 버려요.',
    },
    {
      id: 're03-2-q8',
      source: '배열·객체 불변 업데이트 패턴',
      type: 'short',
      question: '원본을 바꾸는 sort() 대신, 정렬된 새 배열을 돌려주는 ES2023 메서드 이름은?',
      answer: ['toSorted', 'toSorted()'],
      explanation: '같은 짝으로 toReversed(), toSpliced(), with()가 있어요. state 배열에는 이쪽을 써요.',
    },
    {
      id: 're03-2-q9',
      source: 'immer와 함수형 업데이트',
      type: 'mcq',
      question: 'count가 0일 때 setCount(count + 1); setCount(count + 1); 를 연달아 부르면 다음 렌더링의 count는?',
      choices: ['0', '1', '2', '에러'],
      answer: 1,
      explanation: '두 줄 모두 같은 count(0)를 보고 1로 설정해요. 2를 원하면 setCount((c) => c + 1)처럼 함수형 업데이트를 써요.',
    },
    {
      id: 're03-2-q10',
      source: 'immer와 함수형 업데이트',
      type: 'ox',
      question: 'immer의 produce 안에서 draft.user.name = "x" 처럼 고치면 원본 state도 함께 바뀐다.',
      answer: false,
      explanation: 'draft는 연습장이에요. immer는 고친 내용을 보고 경로 복사한 새 객체를 돌려주고, 원본은 절대 바꾸지 않아요.',
    },
    {
      id: 're03-2-q11',
      source: 'immer와 함수형 업데이트',
      type: 'essay',
      question: '[면접] React에서 상태를 불변성 있게 변경해야 하는 이유를 설명해 주세요.',
      answer: 'React는 상태가 바뀌었는지를 안쪽을 뒤지는 깊은 비교가 아니라 주소만 비교하는 얕은 비교(Object.is)로 판단합니다. 원본을 직접 고치면 주소가 같아서 React가 변화를 못 알아채고 화면이 갱신되지 않으며, 데이터와 화면이 어긋난 채 나중에 엉뚱한 시점에 드러납니다. 그래서 바뀐 잎까지 가는 경로의 객체만 새로 만들고 나머지는 공유하는데, 이렇게 하면 변화 감지가 한 번의 비교로 끝나고 memo로 안 바뀐 부분을 건너뛸 수도 있습니다.',
      keywords: ['얕은 비교', 'Object.is', '경로 복사', '구조적 공유', 'memo'],
      explanation: '"얕은 비교라서 → 새 객체가 필요하다 → 경로 복사가 효율적이다" 흐름으로 말하면 돼요. 유령 버그 예시를 들면 더 좋아요.',
    },
  ],
}

export default topic

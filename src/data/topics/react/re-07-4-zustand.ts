import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-4-zustand',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-4. Zustand 기본',
  order: 704,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'Zustand는 왜 인기일까',
      slides: [
        {
          title: '가볍고 단순한 전역 저장소',
          blocks: [
            { type: 'say', text: '이제 **클라이언트 상태** 쪽이에요. 4-5에서 "자주 바뀌는 공유 값은 Context보다 Zustand"라고 했고, 5-5에서 "새 프로젝트에선 가벼운 Zustand를 많이 고른다"고 했죠. 드디어 배워요.\n\n**Zustand**(독일어로 "상태")는 전역 상태를 위한 아주 작은 라이브러리예요.' },
            {
              type: 'table',
              head: ['', 'Context + useState', 'Redux Toolkit', 'Zustand'],
              rows: [
                ['Provider', '필요', '필요', '**필요 없음**'],
                ['코드 양', '적음', '많음 (slice, store, 타입 훅)', '**아주 적음**'],
                ['값이 바뀌면', '읽는 쪽 **전부** 다시 렌더링', '고른 값만', '**고른 값만**'],
                ['DevTools', '없음', '강력함', '미들웨어로 연결 가능'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '스토어 만들고 쓰기',
      slides: [
        {
          title: 'create 하나로 끝',
          blocks: [
            {
              type: 'code',
              code: `import { create } from 'zustand';

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()((set) => ({
  items: [],                                                        // 상태
  add: (item) => set((s) => ({ items: [...s.items, item] })),        // 액션
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));`,
            },
            {
              type: 'list',
              items: [
                '`create`가 돌려주는 건 **훅**(`useCartStore`)이에요. 이름을 use로 시작하는 이유죠',
                '상태(`items`)와 그걸 바꾸는 함수(액션)를 **한 객체에** 같이 둬요',
                '`set`으로 바꿔요. 넘긴 객체가 기존 상태와 **합쳐져요**(얕은 병합). 그래서 `items`만 줘도 add·remove는 그대로 남아요',
                '`set((s) => ...)`는 3-2의 함수형 업데이트와 같아요. 이전 값을 기준으로 바꿀 때 써요',
              ],
            },
            { type: 'note', tone: 'tip', text: 'TypeScript에서는 `create<CartState>()(...)`처럼 괄호가 두 번이에요. 오타가 아니라 타입을 정확히 추론하려고 Zustand가 권하는 모양이에요.' },
          ],
        },
        {
          title: '컴포넌트에서 쓰기',
          blocks: [
            {
              type: 'code',
              code: `function CartBadge() {
  const count = useCartStore((s) => s.items.length);   // 개수만 골라 구독
  return <span>{count}</span>;
}

function AddButton({ item }: { item: CartItem }) {
  const add = useCartStore((s) => s.add);               // 함수만 골라 구독
  return <button onClick={() => add(item)}>담기</button>;
}`,
            },
            { type: 'say', text: 'Provider로 감쌀 필요 없이 **어디서든 훅을 부르면** 끝이에요. 그리고 괄호 안의 함수 `(s) => s.items.length`가 **선택자(selector)** 예요. 5-5의 useSelector와 같아요. 다음 개념에서 이게 왜 중요한지 볼게요.' },
          ],
        },
      ],
    },
    {
      title: '선택자로 필요한 것만 구독',
      slides: [
        {
          title: '고른 값이 바뀔 때만 다시 렌더링',
          blocks: [
            { type: 'say', text: 'Zustand는 상태가 바뀔 때마다 각 컴포넌트의 선택자를 다시 실행해서, **결과가 이전과 다를 때만** 그 컴포넌트를 다시 렌더링해요. 비교는 3-2의 `Object.is`(주소 비교)예요.' },
            {
              type: 'code',
              code: `// ✅ 개수만 구독: 상품 수량이 바뀌어도 개수가 그대로면 다시 렌더링 안 됨
const count = useCartStore((s) => s.items.length);

// ⚠️ 통째로 구독: 스토어의 무엇이 바뀌든 다시 렌더링
const store = useCartStore();`,
            },
            { type: 'ask', q: '선택자 없이 useCartStore()로 통째로 받으면 무엇이 Context와 같아질까요?', a: '스토어의 **어떤 값이 바뀌어도** 그 컴포넌트가 다시 렌더링돼요. 4-5에서 배운 Context의 단점(값 하나만 바뀌어도 읽는 쪽 전부)과 똑같아져요. Zustand의 장점을 버리는 거예요. **필요한 것만 골라 받는** 습관을 들이세요.' },
          ],
        },
        {
          title: '객체를 골라 받을 때는 useShallow',
          blocks: [
            { type: 'code', code: `// ⚠️ 매번 새 객체 { items, add } 를 만들어 돌려줌 → 주소가 매번 다름
const { items, add } = useCartStore((s) => ({ items: s.items, add: s.add }));` },
            { type: 'say', text: '선택자가 **매번 새 객체**를 만들면 내용이 같아도 주소가 달라서 "바뀌었다"로 봐요. Zustand v5에서는 이게 **무한 렌더링 에러**로 이어질 수 있어요. 이럴 땐 `useShallow`로 감싸서 "안쪽 값들을 하나씩 비교해 줘"라고 해요.' },
            { type: 'code', code: `import { useShallow } from 'zustand/react/shallow';

const { items, add } = useCartStore(useShallow((s) => ({ items: s.items, add: s.add })));
// items와 add가 각각 같으면 "안 바뀜"` },
            { type: 'note', tone: 'tip', text: '가장 단순한 방법은 **값 하나씩 따로** 고르는 거예요. `const items = useCartStore((s) => s.items); const add = useCartStore((s) => s.add);` 이러면 useShallow도 필요 없어요.' },
          ],
        },
      ],
    },
    {
      title: '컴포넌트 밖에서 쓰기',
      slides: [
        {
          title: 'getState와 setState',
          blocks: [
            { type: 'say', text: 'Zustand 스토어는 React 밖에서도 쓸 수 있어요. 이게 Context와 큰 차이예요. 예를 들어 5-3의 `api()` 함수에서 로그인 토큰을 붙이고 싶을 때요.' },
            {
              type: 'code',
              code: `// src/api/client.ts — 컴포넌트가 아닌 일반 함수
import { useAuthStore } from '@/stores/auth';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;      // 훅이 아니라 지금 값을 바로 읽음
  const res = await fetch(path, {
    ...init,
    headers: { ...init?.headers, Authorization: \`Bearer \${token}\` },
  });
  if (res.status === 401) useAuthStore.getState().logout();   // 밖에서 액션 호출도 OK
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}`,
            },
            { type: 'say', text: '`useAuthStore.getState()`는 훅이 아니라서 4-1의 훅 규칙을 안 따져도 돼요. 대신 **구독하지 않으니** 값이 바뀌어도 다시 실행되지 않아요. 화면에 보여 줄 값은 컴포넌트에서 훅으로, 이벤트·일반 함수에서 "지금 값"이 필요할 땐 getState로.' },
          ],
        },
        {
          title: 'Zustand에 넣으면 안 되는 것',
          blocks: [
            { type: 'say', text: '7-1에서 배운 걸 다시 강조할게요. Zustand는 **클라이언트 상태** 저장소예요.' },
            {
              type: 'table',
              head: ['Zustand에 ✅', 'Zustand에 ❌ (→ 대신)'],
              rows: [
                ['로그인 토큰, 사용자 설정(테마·언어)', '서버에서 온 강의 목록 (→ TanStack Query)'],
                ['장바구니(비로그인 상태로 담아 두는 것)', '서버에 저장된 장바구니 내역 (→ TanStack Query)'],
                ['여러 화면이 공유하는 UI 상태 (사이드바 접힘, 편집 중인 초안)', '한 컴포넌트만 쓰는 상태 (→ useState)'],
                ['', '공유·새로고침이 필요한 필터 (→ URL, 6-3)'],
              ],
            },
            { type: 'say', text: '상태마다 맞는 집이 있어요. Zustand는 "브라우저가 주인이고, 여러 곳에서 공유하는" 상태의 집이에요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-4-q1',
      source: 'Zustand는 왜 인기일까',
      type: 'ox',
      question: 'Zustand 스토어를 쓰려면 앱 최상위를 Provider로 감싸야 한다.',
      answer: false,
      explanation: 'create가 돌려주는 훅을 어디서든 부르면 돼요. Provider가 필요 없는 게 Zustand의 장점이에요.',
    },
    {
      id: 're07-4-q2',
      source: '스토어 만들고 쓰기',
      type: 'mcq',
      question: "Zustand에서 set({ items: [] }) 를 부르면 스토어의 add, remove 함수는?",
      choices: ['사라진다', '그대로 남는다 (set은 기존 상태와 얕게 병합한다)', 'undefined가 된다', '에러가 난다'],
      answer: 1,
      explanation: 'set에 넘긴 객체는 기존 상태와 합쳐져요. 바꾸고 싶은 키만 넘기면 돼요.',
    },
    {
      id: 're07-4-q3',
      source: '선택자로 필요한 것만 구독',
      type: 'mcq',
      question: 'const count = useCartStore((s) => s.items.length) 를 쓰는 컴포넌트가 다시 렌더링되는 때는?',
      choices: ['스토어의 어떤 값이든 바뀔 때', 'items.length(개수)가 바뀔 때만', '1초마다', '절대 안 된다'],
      answer: 1,
      explanation: '선택자 결과가 이전과 다를 때만 다시 렌더링해요. 그래서 필요한 것만 골라 받아요.',
    },
    {
      id: 're07-4-q4',
      source: '선택자로 필요한 것만 구독',
      type: 'ox',
      question: 'const store = useCartStore() 처럼 선택자 없이 통째로 구독해도, 쓰는 값이 바뀔 때만 다시 렌더링된다.',
      answer: false,
      explanation: '통째로 구독하면 스토어의 무엇이 바뀌든 다시 렌더링돼요. Context의 단점과 같아져요.',
    },
    {
      id: 're07-4-q5',
      source: '선택자로 필요한 것만 구독',
      type: 'short',
      question: '선택자가 객체를 돌려줄 때 안쪽 값을 하나씩 비교하게 해 주는 Zustand 훅은?',
      answer: ['useShallow', 'useShallow()'],
      explanation: '매번 새 객체를 돌려주면 주소가 달라 계속 "바뀜"으로 보여요. useShallow로 감싸거나 값 하나씩 따로 골라요.',
    },
    {
      id: 're07-4-q6',
      source: '컴포넌트 밖에서 쓰기',
      type: 'mcq',
      question: 'React 컴포넌트가 아닌 api() 함수에서 Zustand의 로그인 토큰을 읽는 방법은?',
      choices: ['useAuthStore((s) => s.token) 훅 호출', 'useAuthStore.getState().token', 'useContext(AuthContext)', '읽을 수 없다'],
      answer: 1,
      explanation: 'getState()는 훅이 아니라 지금 값을 바로 읽어요. 훅은 컴포넌트 안에서만 부를 수 있어요.',
    },
    {
      id: 're07-4-q7',
      source: '컴포넌트 밖에서 쓰기',
      type: 'mcq',
      question: 'Zustand에 두기 가장 알맞은 상태는?',
      choices: ['서버에서 가져온 강의 목록', '여러 화면에서 공유하는 사이드바 접힘 여부', '한 컴포넌트만 쓰는 입력값', '링크로 공유해야 하는 검색 필터'],
      answer: 1,
      explanation: '브라우저가 주인이고 여러 곳에서 공유하는 상태가 Zustand의 자리예요. 서버 데이터는 TanStack Query, 혼자 쓰면 useState, 공유 필터는 URL이에요.',
    },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-5-zustand-advanced',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-5. Zustand 실전: 미들웨어와 구조',
  order: 705,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'persist: 새로고침해도 남기기',
      slides: [
        {
          title: 'localStorage에 자동 저장',
          blocks: [
            { type: 'say', text: '장바구니에 담았는데 새로고침하면 사라진다면 속상하죠. Zustand의 **persist 미들웨어**를 끼우면 스토어를 localStorage에 자동으로 저장하고, 다음에 열 때 불러와요.' },
            {
              type: 'code',
              code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, item] })),
    }),
    {
      name: 'cart',                                   // localStorage 키 이름
      partialize: (s) => ({ items: s.items }),        // 저장할 것만 골라서
    },
  ),
);`,
            },
            { type: 'say', text: '**미들웨어**는 5-5에서 배운 것처럼 "사이에 끼어서 기능을 덧붙이는" 함수예요. 스토어 정의를 persist로 **감싸기만** 하면 돼요. `partialize`로 함수는 빼고 데이터만 저장해요.' },
          ],
        },
        {
          title: 'Next.js에서는 하이드레이션을 조심',
          blocks: [
            { type: 'ask', q: '6-2를 떠올려 보세요. Next.js에서 persist 스토어의 장바구니 개수를 그대로 화면에 그리면 무슨 일이 생길까요?', a: '서버에는 localStorage가 없으니 **서버는 0개**로 그리고, 브라우저는 localStorage에서 불러와 **3개**로 그려요. 첫 결과가 달라서 **하이드레이션 불일치**가 나요.' },
            {
              type: 'code',
              code: `// 해결 방법 중 하나: 불러오기가 끝났는지 확인하고 그리기
'use client';
function CartBadge() {
  const count = useCartStore((s) => s.items.length);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);     // 하이드레이션 뒤에만 true
  return <span>{ready ? count : 0}</span>; // 첫 렌더는 서버와 같은 0
}`,
            },
            { type: 'note', tone: 'tip', text: 'persist에는 `skipHydration` 옵션과 `useCartStore.persist.rehydrate()`도 있어서 "언제 불러올지"를 직접 정할 수도 있어요. 핵심은 6-2와 같아요. **첫 렌더링은 서버와 똑같이, 브라우저 전용 값은 그다음에.**' },
          ],
        },
      ],
    },
    {
      title: 'devtools와 immer',
      slides: [
        {
          title: 'Redux DevTools로 보기',
          blocks: [
            { type: 'say', text: '5-5에서 Redux DevTools의 시간 여행을 배웠죠. Zustand도 **devtools 미들웨어**로 같은 확장 프로그램에 연결할 수 있어요.' },
            {
              type: 'code',
              code: `import { devtools, persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        add: (item) => set((s) => ({ items: [...s.items, item] }), false, 'cart/add'),   // 액션 이름
      }),
      { name: 'cart' },
    ),
  ),
);`,
            },
            { type: 'say', text: '미들웨어는 **겹겹이 감쌀** 수 있어요. set의 세 번째 인자로 액션 이름을 주면 DevTools에 "cart/add"처럼 보여서 무슨 일이 있었는지 추적하기 쉬워요.' },
          ],
        },
        {
          title: '깊은 객체는 immer로',
          blocks: [
            { type: 'say', text: '상태가 깊어지면 3-2의 "층마다 ..." 문제가 또 생겨요. Zustand에도 **immer 미들웨어**가 있어요.' },
            {
              type: 'code',
              code: `import { immer } from 'zustand/middleware/immer';

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    doc: { title: '', sections: [] },
    renameSection: (i, title) =>
      set((s) => { s.doc.sections[i].title = title; }),   // 고치듯 써도 경로 복사가 됨
  })),
);`,
            },
            { type: 'note', tone: 'warn', text: 'immer 미들웨어를 쓰려면 `immer` 패키지도 따로 설치해야 해요. 그리고 5-5와 같은 규칙이에요. immer가 감싸 준 set 안에서만 "고치듯" 쓸 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '스토어를 어떻게 나눌까',
      slides: [
        {
          title: '하나의 거대한 스토어 vs 작은 스토어 여러 개',
          blocks: [
            { type: 'say', text: 'Redux는 "스토어는 하나"가 원칙이었죠. Zustand는 **기능별로 작은 스토어를 여러 개** 만드는 게 자연스러워요.' },
            {
              type: 'code',
              code: `src/stores/
├─ auth.ts       ← useAuthStore   (토큰, 로그인 사용자 id, logout)
├─ cart.ts       ← useCartStore   (비로그인 장바구니)
└─ ui.ts         ← useUiStore     (사이드바 접힘, 모달 열림)`,
            },
            {
              type: 'list',
              items: [
                '각 스토어가 **한 가지 일**만 해서 읽기 쉬워요 (4-1의 "책임이 하나인가")',
                '사이드바를 접어도 장바구니 쪽은 아무 영향이 없어요',
                '한 스토어가 너무 커지면 **slice 패턴**으로 파일을 나눠서 하나로 합칠 수도 있어요',
              ],
            },
          ],
        },
        {
          title: '액션은 스토어 안에',
          blocks: [
            { type: 'code', code: `// ❌ 컴포넌트마다 set 로직이 흩어짐
useCartStore.setState((s) => ({ items: [...s.items, item] }));

// ✅ 스토어 안에 이름 붙은 액션으로
const add = useCartStore((s) => s.add);
add(item);` },
            { type: 'say', text: '4-3의 useReducer와 같은 생각이에요. "상태를 어떻게 바꾸는지"를 **스토어 한 곳에** 모아 두면, 장바구니가 이상할 때 그 파일 하나만 보면 돼요. 컴포넌트는 "담아 줘"라고 부르기만 하고요.' },
          ],
        },
      ],
    },
    {
      title: 'Next.js에서 Zustand 쓰기',
      slides: [
        {
          title: '서버에서 사용자끼리 섞이는 문제',
          blocks: [
            { type: 'say', text: '6-4에서 Redux를 Next.js에서 쓸 때 "모듈 맨 바깥에 스토어를 하나 만들면 **사용자끼리 데이터가 섞일 수 있다**"고 했죠. Zustand의 `create()`도 모듈 맨 바깥에서 실행되니까 똑같은 문제가 있어요.' },
            { type: 'say', text: '왜냐하면 Next.js 서버는 **여러 사용자의 요청을 같은 프로세스에서** 처리해요. 서버 렌더링 중에 A의 데이터로 스토어를 채우면, 동시에 들어온 B의 요청도 같은 스토어를 볼 수 있어요.' },
            { type: 'note', tone: 'warn', text: '그래서 Zustand 공식 문서의 Next.js 가이드는 **요청마다 스토어를 새로 만들고 Context로 내려 주는** 방식을 권해요. 스토어는 서버 컴포넌트에서 읽지 않고, 클라이언트 컴포넌트에서만 써요.' },
          ],
        },
        {
          title: '요청마다 새 스토어',
          blocks: [
            {
              type: 'code',
              code: `// stores/cart-store.ts
import { createStore } from 'zustand/vanilla';
export const createCartStore = (init: CartData = { items: [] }) =>
  createStore<CartState>()((set) => ({ ...init, add: (i) => set((s) => ({ items: [...s.items, i] })) }));

// app/cart-provider.tsx
'use client';
const CartContext = createContext<ReturnType<typeof createCartStore> | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createCartStore());   // 이 Provider(=이 사용자)만의 스토어, 한 번만 생성
  return <CartContext value={store}>{children}</CartContext>;
}

export function useCart<T>(selector: (s: CartState) => T) {
  const store = use(CartContext);
  if (!store) throw new Error('CartProvider 안에서 써 주세요');
  return useStore(store, selector);                    // import { useStore } from 'zustand'
}`,
            },
            { type: 'say', text: '4-3의 레이지 초기화(`useState(() => ...)`)로 Provider마다 **한 번만** 스토어를 만들고, 4-5의 Context로 내려 줘요. 이번 장까지 배운 게 전부 조합돼요. Vite 같은 CSR 앱에서는 이럴 필요 없이 7-4처럼 `create()`를 그대로 쓰면 돼요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-5-q1',
      source: 'persist: 새로고침해도 남기기',
      type: 'mcq',
      question: 'Zustand 스토어를 새로고침해도 유지되도록 localStorage에 저장하는 미들웨어는?',
      choices: ['devtools', 'persist', 'immer', 'useShallow'],
      answer: 1,
      explanation: '스토어 정의를 persist로 감싸고 name(저장 키)을 주면 자동으로 저장·불러오기를 해요.',
    },
    {
      id: 're07-5-q2',
      source: 'persist: 새로고침해도 남기기',
      type: 'ox',
      question: 'Next.js에서 persist 스토어 값을 첫 렌더링에 그대로 그려도 하이드레이션 불일치가 생기지 않는다.',
      answer: false,
      explanation: '서버에는 localStorage가 없어 기본값으로, 브라우저는 저장된 값으로 그려서 첫 결과가 달라요. 하이드레이션 뒤에 보여 줘야 해요.',
    },
    {
      id: 're07-5-q3',
      source: 'devtools와 immer',
      type: 'mcq',
      question: 'Zustand 스토어의 변화를 Redux DevTools 확장 프로그램에서 보려면?',
      choices: ['persist로 감싼다', 'devtools 미들웨어로 감싼다', 'Redux를 설치한다', '불가능하다'],
      answer: 1,
      explanation: 'devtools 미들웨어로 감싸면 같은 확장에서 액션과 상태 변화를 볼 수 있어요. 미들웨어는 겹쳐 쓸 수 있어요.',
    },
    {
      id: 're07-5-q4',
      source: '스토어를 어떻게 나눌까',
      type: 'mcq',
      question: 'Zustand에서 권장되는 스토어 구성에 가장 가까운 것은?',
      choices: ['앱 전체 상태를 스토어 하나에 몰아넣는다', 'auth, cart, ui처럼 기능별 작은 스토어를 여러 개 만든다', '컴포넌트마다 스토어를 하나씩 만든다', '스토어 대신 전역 변수를 쓴다'],
      answer: 1,
      explanation: '기능별로 나누면 각자 책임이 분명하고 서로 영향을 주지 않아요.',
    },
    {
      id: 're07-5-q5',
      source: '스토어를 어떻게 나눌까',
      type: 'ox',
      question: '상태를 바꾸는 로직은 컴포넌트마다 setState로 흩어 두기보다, 스토어 안에 이름 붙은 액션으로 모으는 것이 좋다.',
      answer: true,
      explanation: '바꾸는 규칙이 한 파일에 모여서 버그를 찾기 쉬워요. useReducer·Redux와 같은 생각이에요.',
    },
    {
      id: 're07-5-q6',
      source: 'Next.js에서 Zustand 쓰기',
      type: 'mcq',
      question: 'Next.js에서 모듈 맨 바깥의 create()로 만든 스토어를 서버 렌더링에 쓰면 생길 수 있는 문제는?',
      choices: ['빌드가 느려진다', '서버가 여러 요청을 같이 처리해 사용자끼리 상태가 섞일 수 있다', 'CSS가 깨진다', '아무 문제 없다'],
      answer: 1,
      explanation: '서버의 모듈 전역은 모든 요청이 공유해요. 그래서 요청(Provider)마다 새 스토어를 만들어 Context로 내려 줘요.',
    },
    {
      id: 're07-5-q7',
      source: 'Next.js에서 Zustand 쓰기',
      type: 'short',
      question: 'Provider 안에서 스토어를 딱 한 번만 만들기 위해 쓰는 패턴은? useState(() => createCartStore()) 처럼 함수를 넘기는 것. 이 이름은? (__ 초기화)',
      answer: ['레이지', '레이지 초기화', 'lazy', 'lazy initialization'],
      explanation: '4-3의 레이지 초기화예요. 함수를 넘기면 마운트 때 한 번만 실행돼서 리렌더링마다 스토어가 새로 생기지 않아요.',
    },
  ],
}

export default topic

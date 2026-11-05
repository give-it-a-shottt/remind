import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-05-5-redux',
  track: 'react',
  group: '05. 라우터·HTTP·CORS·Redux',
  title: '5-5. Redux Toolkit',
  order: 505,
  notionId: '409df951bf8081548b16e7c8671ce171',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'Redux는 왜 생겼나',
      slides: [
        {
          title: '수백 개 컴포넌트가 같은 데이터를 만진다면',
          blocks: [
            { type: 'say', text: '5장 마지막 수업이자, 노션 React 노트의 마지막 수업이에요!\n\n쇼핑몰을 생각해 보세요. 장바구니 데이터를 헤더(개수 배지), 상품 카드(담기 버튼), 장바구니 페이지, 결제 페이지가 다 써요. 4-5에서 배운 Context로 하면 장바구니가 바뀔 때마다 **읽는 컴포넌트 전부**가 다시 렌더링되고, 여러 곳에서 바꾸다 보면 "**누가 장바구니를 바꿨지?**"가 다시 문제가 돼요.' },
            { type: 'say', text: '페이스북이 이 문제를 풀려고 만든 구조가 **플럭스(Flux)** 예요. 1장의 "데이터는 한 방향으로"를 **앱 전체**로 넓힌 거예요. 이걸 더 단순하게 다듬은 게 **Redux**예요.' },
            {
              type: 'code',
              code: `액션 (무슨 일이 있었나)
  ↓ dispatch
리듀서 (새 상태 계산)
  ↓
스토어 (상태 하나)
  ↓
화면
  ↓ (클릭)
다시 액션 …`,
            },
          ],
        },
        {
          title: '4-3의 useReducer를 앱 전체로',
          blocks: [
            { type: 'say', text: '어디서 본 것 같죠? 4-3의 **useReducer**와 같은 구조예요. 실제로 useReducer가 Redux의 리듀서 개념을 React 안으로 가져온 거예요. 차이는 **범위**예요.' },
            {
              type: 'table',
              head: ['', 'useReducer', 'Redux'],
              rows: [
                ['상태가 사는 곳', '컴포넌트 하나 안', '앱 전체의 **스토어 하나**'],
                ['다른 컴포넌트와 공유', 'props나 Context로', '어느 컴포넌트든 `useSelector`로'],
                ['DevTools·미들웨어', '없음', '있음'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '식당 비유를 이어 가면, useReducer는 **가게 하나의 주방**이고 Redux는 **프랜차이즈 본사의 중앙 주방**이에요. 모든 지점(컴포넌트)이 같은 주문서 양식으로 중앙 주방에 주문을 넣어요.' },
          ],
        },
      ],
    },
    {
      title: '리듀서를 순수 함수로 분리한 이유',
      slides: [
        {
          title: '같은 입력이면 항상 같은 결과',
          blocks: [
            { type: 'say', text: 'Redux의 핵심 규칙은 "**상태를 바꾸는 유일한 방법은 액션을 dispatch하고 리듀서가 계산하는 것**"이에요. 리듀서는 `(지금 상태, 액션) => 다음 상태`인 **순수 함수**예요. 같은 입력이면 항상 같은 결과가 나오죠. 그래서 Redux를 "**예측 가능한 상태 컨테이너**"라고 불러요.' },
            {
              type: 'table',
              head: ['리듀서를 분리해서 얻는 것', '왜 가능하냐면'],
              rows: [
                ['테스트가 쉬움', '`reducer(상태, 액션)`만 부르면 됨. 화면 없이 입력→출력 확인'],
                ['**시간 여행 디버깅**', '불변성 덕분에 이전 상태가 그대로 남아 있음 → 과거 어느 시점으로든 돌아갈 수 있음'],
                ['핫 리로딩', '데이터(스토어)는 두고 함수(리듀서)만 갈아 끼움'],
                ['나눠서 조립', '리듀서는 함수라 여러 개를 합칠 수 있음 (todos, user, cart 따로)'],
              ],
            },
          ],
        },
        {
          title: '시간 여행 디버깅',
          blocks: [
            { type: 'say', text: '3-2에서 "불변성을 지키면 상태가 바뀔 때마다 **새 객체**가 되고 이전 객체는 그대로 남는다"고 했죠. Redux는 이 성질을 이용해요. 상태가 바뀔 때마다 기록해 두면 과거 어느 시점이든 그대로 꺼낼 수 있어요.' },
            { type: 'say', text: '크롬 확장 **Redux DevTools**를 깔면 지금까지 일어난 액션 목록이 보여요. 그중 하나를 누르면 **그 시점의 화면으로 돌아가요.** "장바구니에 3번째 상품을 담는 순간 이상해졌다"를 눈으로 찾을 수 있어요.' },
            { type: 'ask', q: '리듀서 안에서 state.items.push(x) 처럼 원본을 직접 고친다면 시간 여행이 될까요?', a: '안 돼요. 원본을 고치면 "이전 상태" 객체도 같이 바뀌어 버려서 과거 기록이 전부 지금 값으로 덮여요. 불변성이 시간 여행의 전제예요. (그런데 다음 개념의 Redux Toolkit에서는 push처럼 써도 돼요. 이유가 재밌어요.)' },
          ],
        },
      ],
    },
    {
      title: 'createSlice와 configureStore',
      slides: [
        {
          title: '지금은 Redux Toolkit으로 써요',
          blocks: [
            { type: 'note', tone: 'warn', text: '가장 중요한 바로잡음이에요. 책처럼 **액션 타입 상수 + switch 리듀서 + `createStore`** 를 손으로 짜는 방식은 Redux 팀이 직접 **더 이상 권하지 않아요.** `createStore`에는 deprecated 표시가 붙어 있고, 공식 문서는 **Redux Toolkit(RTK)** 을 "오늘날 Redux를 쓰는 올바른 방법"이라고 해요.' },
            {
              type: 'table',
              head: ['책 (손으로 짠 Redux)', 'Redux Toolkit'],
              rows: [
                ['액션 타입 상수 + 액션 생성 함수 + switch 리듀서 따로', '`createSlice` 하나가 세 가지를 한 번에'],
                ['불변성을 지키려고 `...`을 층마다', '안에 **immer**(3-2)가 있어서 직접 고치듯 써도 됨'],
                ['`createStore` + `combineReducers` + 미들웨어 + DevTools 설정', '`configureStore` 하나에 전부 기본 포함'],
                ['`connect()` 고차 컴포넌트', '`useSelector`, `useDispatch` 훅'],
              ],
            },
          ],
        },
        {
          title: '코드로 보면',
          blocks: [
            {
              type: 'code',
              code: `import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as CartItem[],
  reducers: {
    added(state, action: PayloadAction<CartItem>) {
      state.push(action.payload);           // immer 덕분에 OK
    },
    removed(state, action: PayloadAction<number>) {
      return state.filter((i) => i.id !== action.payload);   // 새 값을 돌려줘도 OK
    },
  },
});

export const { added, removed } = cartSlice.actions;   // 액션 생성 함수가 자동으로

export const store = configureStore({
  reducer: { cart: cartSlice.reducer, user: userSlice.reducer },   // 다중 리듀서
});`,
            },
            { type: 'say', text: '`added(item)`을 부르면 `{ type: \'cart/added\', payload: item }` 액션 객체가 만들어져요. 액션 이름을 따로 상수로 만들 필요가 없어요.' },
            { type: 'note', tone: 'warn', text: '"직접 고치듯" 쓸 수 있는 건 **createSlice 리듀서 안에서만**이에요. immer가 감싸 주는 곳이라서요. useState의 state를 직접 고치는 건 여전히 금지예요(3-2). 그리고 한 리듀서 안에서 "직접 고치기"와 "새 값 돌려주기" 중 **하나만** 해야 해요.' },
          ],
        },
      ],
    },
    {
      title: 'useSelector와 useDispatch',
      slides: [
        {
          title: '필요한 값만 골라 구독하기',
          blocks: [
            {
              type: 'code',
              code: `import { Provider, useDispatch, useSelector } from 'react-redux';

// 앱 맨 위에서 한 번
<Provider store={store}><App /></Provider>

// 어느 컴포넌트에서든
function CartBadge() {
  const count = useSelector((state: RootState) => state.cart.length);   // 개수만 구독
  return <span>{count}</span>;
}

function AddButton({ item }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(added(item))}>담기</button>;
}`,
            },
            { type: 'say', text: '`useSelector`는 **고른 값이 바뀔 때만** 다시 렌더링해요. CartBadge는 장바구니 **개수**만 골랐으니, 상품 수량만 바뀌고 개수가 그대로면 다시 렌더링되지 않아요. 4-5에서 말한 Context의 한계(값이 바뀌면 읽는 쪽 전부)를 푸는 부분이에요.' },
          ],
        },
        {
          title: '컨테이너 컴포넌트는 이제 필요 없어요',
          blocks: [
            { type: 'say', text: '책 시절에는 `connect()`라는 고차 컴포넌트(4-4)로 "스토어와 연결된 컨테이너 컴포넌트"를 만들고 그 안에 표현 컴포넌트를 넣었어요. 3-1의 컨테이너/표현 패턴이 유명해진 배경이 이거예요.\n\n지금은 **훅**으로 어느 컴포넌트에서든 바로 읽고 보내요. 컨테이너를 따로 만들 필요가 없어요.' },
            { type: 'note', tone: 'tip', text: 'TypeScript에서는 `useSelector`, `useDispatch`에 매번 타입을 붙이기 귀찮아서 `useAppSelector`, `useAppDispatch`라는 타입 붙은 훅을 한 번 만들어 쓰는 게 공식 권장 방식이에요.' },
          ],
        },
      ],
    },
    {
      title: '미들웨어와 thunk',
      slides: [
        {
          title: 'dispatch와 리듀서 사이의 검수대',
          blocks: [
            { type: 'say', text: '리듀서는 순수 함수라 안에서 서버 요청(비동기)을 못 해요. 그럼 "서버에서 장바구니 불러오기"는 어디서 할까요?\n\n**미들웨어**는 dispatch와 리듀서 **사이**에 끼어들어 액션을 가로채는 함수예요. 로그 남기기, 비동기 처리에 써요.' },
            { type: 'note', tone: 'analogy', text: '택배가 창고(리듀서)에 들어가기 전에 거치는 **검수대**예요. 검수대에서 기록을 남기거나, "이건 재고 확인하고 넣어야 해" 하고 잠깐 붙잡아 둘 수 있어요.' },
            {
              type: 'code',
              code: `// thunk: 액션 대신 "함수"를 dispatch → 안에서 기다렸다가 진짜 액션을 dispatch
const loadCart = () => async (dispatch, getState) => {
  const items = await api<CartItem[]>('/api/cart');   // 5-3의 api()
  dispatch(cartLoaded(items));
};

dispatch(loadCart());`,
            },
            { type: 'say', text: '이렇게 함수를 dispatch할 수 있게 해 주는 미들웨어가 **thunk**예요. Redux Toolkit의 `configureStore`에 **기본으로 들어 있어서** 따로 설치할 필요가 없어요.' },
          ],
        },
        {
          title: 'saga와 제너레이터는?',
          blocks: [
            { type: 'say', text: '책에 **redux-saga**와 **제너레이터 함수**(`function*`, `yield`)가 나올 거예요. 제너레이터는 `yield`에서 **멈췄다가** 바깥에서 `next()`를 부르면 다시 진행하는 함수예요. 책갈피를 끼운 책처럼요. saga는 이걸로 취소·재시도 같은 복잡한 비동기 흐름을 관리해요.' },
            { type: 'note', tone: 'warn', text: 'saga는 **새 프로젝트에서 거의 안 써요.** API 호출 대부분은 **RTK Query**(Redux Toolkit 내장)나 **TanStack Query**가 캐시·재시도·로딩 상태까지 처리해 줘요. saga는 오래된 대규모 코드를 읽을 때 만날 수 있고, 제너레이터는 "이런 문법이 있다" 정도면 충분해요.' },
          ],
        },
      ],
    },
    {
      title: '2026년에 Redux를 써야 할까',
      slides: [
        {
          title: '상태 종류에 맞는 집 고르기',
          blocks: [
            { type: 'say', text: '3-1에서 배운 "상태 종류별 집"을 이제 완성할 수 있어요.' },
            {
              type: 'table',
              head: ['상태 종류', '예시', '도구'],
              rows: [
                ['화면 상태', '드롭다운 열림, 입력 중인 글자', '`useState`, `useReducer`'],
                ['가끔 바뀌는 공유 값', '테마, 로그인 사용자, 언어', 'Context'],
                ['자주 바뀌는 공유 클라이언트 상태', '장바구니, 편집 중인 문서', '**Zustand** 또는 **Redux Toolkit**'],
                ['서버 데이터', '강의 목록, 주문 내역', '**TanStack Query** 또는 RTK Query'],
              ],
            },
          ],
        },
        {
          title: 'Redux Toolkit vs Zustand',
          blocks: [
            { type: 'say', text: 'Redux Toolkit은 큰 회사·오래된 프로젝트에 많이 남아 있어서 **읽고 쓸 줄은 알아야** 해요. 반면 새 개인 프로젝트나 작은 팀에서는 더 가벼운 **Zustand**를 많이 골라요. Provider도 필요 없고 코드가 훨씬 짧거든요.' },
            { type: 'say', text: '누가 더 좋다기보다 **팀과 프로젝트 규모의 선택**이에요. 엄격한 규칙과 DevTools가 필요한 큰 팀 → Redux Toolkit, 빠르고 가볍게 → Zustand. 시니어 공고에 둘 다 자주 나오는 이유예요. Zustand와 TanStack Query는 다음 시니어 챕터에서 제대로 배울 거예요.' },
            { type: 'say', text: '노션 React 노트 5장까지 끝! 여기까지 왔으면 React 기본기는 완성이에요. 이제 마지막 확인 문제 풀고, 다음부터는 시니어가 되기 위한 챕터로 넘어가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're05-5-q1',
      source: 'Redux는 왜 생겼나',
      type: 'mcq',
      question: 'Redux의 데이터 흐름으로 옳은 것은?',
      choices: ['컴포넌트가 스토어의 값을 직접 고친다', '액션 → dispatch → 리듀서가 새 상태 계산 → 스토어 → 화면', '리듀서 → 액션 → 화면 → 스토어', '스토어가 서버에 직접 요청한다'],
      answer: 1,
      explanation: '상태를 바꾸는 유일한 길은 액션을 dispatch하고 리듀서가 계산하는 것이에요. 한 방향으로만 흘러서 예측 가능해요.',
    },
    {
      id: 're05-5-q2',
      source: 'Redux는 왜 생겼나',
      type: 'ox',
      question: 'useReducer와 Redux는 "(상태, 액션) => 새 상태" 리듀서라는 같은 개념을 쓰고, 차이는 상태가 사는 범위다.',
      answer: true,
      explanation: 'useReducer는 컴포넌트 하나 안, Redux는 앱 전체의 스토어 하나에 상태가 있어요.',
    },
    {
      id: 're05-5-q3',
      source: '리듀서를 순수 함수로 분리한 이유',
      type: 'mcq',
      question: 'Redux DevTools의 "시간 여행 디버깅"이 가능한 이유는?',
      choices: ['브라우저가 화면을 녹화해서', '리듀서가 순수 함수이고 불변성 덕분에 이전 상태 객체가 그대로 보존되기 때문', '서버에 상태를 저장해서', 'localStorage를 써서'],
      answer: 1,
      explanation: '상태가 바뀔 때마다 새 객체가 되고 이전 객체는 그대로 남아요. 기록만 해 두면 어느 시점이든 꺼낼 수 있어요.',
    },
    {
      id: 're05-5-q4',
      source: 'createSlice와 configureStore',
      type: 'mcq',
      question: '2026년 기준 Redux를 쓰는 공식 권장 방식은?',
      choices: ['createStore + switch 리듀서를 손으로 작성', 'Redux Toolkit의 createSlice + configureStore', 'connect() 고차 컴포넌트', 'redux-saga만 사용'],
      answer: 1,
      explanation: 'Redux 팀이 Redux Toolkit을 공식 방식으로 권해요. createStore에는 deprecated 표시가 붙어 있어요.',
    },
    {
      id: 're05-5-q5',
      source: 'createSlice와 configureStore',
      type: 'mcq',
      question: 'createSlice 리듀서 안에서 state.push(item) 처럼 직접 고치듯 써도 되는 이유는?',
      choices: ['Redux는 불변성이 필요 없어서', '내부의 immer가 고친 내용을 보고 새 상태(경로 복사)를 만들어 주기 때문', 'push가 원래 새 배열을 돌려줘서', '개발 모드에서만 되는 것'],
      answer: 1,
      explanation: 'immer가 draft를 감싸서 불변 업데이트 결과를 만들어 줘요. createSlice 밖(useState 등)에서는 여전히 직접 고치면 안 돼요.',
    },
    {
      id: 're05-5-q6',
      source: 'useSelector와 useDispatch',
      type: 'mcq',
      question: 'useSelector((s) => s.cart.length) 를 쓰는 컴포넌트가 다시 렌더링되는 때는?',
      choices: ['스토어의 아무 값이나 바뀔 때', '고른 값(장바구니 개수)이 바뀔 때', '매 초마다', '절대 안 된다'],
      answer: 1,
      explanation: 'useSelector는 고른 값이 바뀔 때만 다시 렌더링해요. Context는 값이 바뀌면 읽는 쪽 전부가 다시 렌더링되는 것과 달라요.',
    },
    {
      id: 're05-5-q7',
      source: '미들웨어와 thunk',
      type: 'ox',
      question: 'Redux Toolkit에서 thunk를 쓰려면 redux-thunk를 따로 설치하고 설정해야 한다.',
      answer: false,
      explanation: 'configureStore에 thunk가 기본으로 들어 있어서 설정 없이 함수를 dispatch할 수 있어요.',
    },
    {
      id: 're05-5-q8',
      source: '미들웨어와 thunk',
      type: 'mcq',
      question: '리듀서 안에서 서버 요청(비동기)을 하지 않는 이유는?',
      choices: ['리듀서는 같은 입력에 같은 결과를 내는 순수 함수여야 해서', '리듀서는 문자열만 다뤄서', 'fetch가 리듀서에서 금지된 문법이라서', '서버가 거부해서'],
      answer: 0,
      explanation: '비동기·부작용은 thunk 같은 미들웨어나 RTK Query로 처리하고, 리듀서는 결과로 상태만 계산해요.',
    },
    {
      id: 're05-5-q9',
      source: '2026년에 Redux를 써야 할까',
      type: 'mcq',
      question: '서버에서 가져온 강의 목록(캐시·재요청·로딩 처리 필요)을 다루기에 가장 알맞은 도구는?',
      choices: ['useRef', 'Context', 'TanStack Query (또는 RTK Query)', 'CSS 변수'],
      answer: 2,
      explanation: '서버 데이터는 서버 상태 도구로 다뤄요. Redux·Zustand는 클라이언트 상태(장바구니 등)에 써요.',
    },
    {
      id: 're05-5-q10',
      source: '2026년에 Redux를 써야 할까',
      type: 'essay',
      question: '[면접] Redux에서 리듀서를 순수 함수로 분리한 이유는 무엇인가요?',
      answer: '리듀서는 현재 상태와 액션을 받아 다음 상태를 돌려주는 순수 함수라, 같은 입력이면 항상 같은 결과가 나옵니다. 그래서 화면 없이 테스트할 수 있고, 불변성 덕분에 이전 상태가 그대로 보존되어 과거 시점을 재현하는 시간 여행 디버깅이 가능하며, 상태는 두고 로직만 교체하는 핫 리로딩과 여러 리듀서를 합치는 것도 쉬워집니다. 요즘은 Redux Toolkit의 createSlice로 작성하고 내부의 immer가 불변 업데이트를 대신 처리합니다.',
      keywords: ['순수 함수', '예측 가능성', '시간 여행 디버깅', '불변성', 'Redux Toolkit'],
      explanation: '순수 함수 → 얻는 것(테스트·시간 여행·핫 리로딩·조립) → 지금은 RTK + immer 순서로 말해요.',
    },
  ],
}

export default topic

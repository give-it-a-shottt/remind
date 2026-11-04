import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-03-1-state-place',
  track: 'react',
  group: '03. 상태·스타일·이벤트·폼',
  title: '3-1. 상태는 어디에 둘까',
  order: 301,
  notionId: '409df951bf8081e39a3bd5e6fc7cb76d',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'state와 props, 그리고 state가 아닌 것',
      slides: [
        {
          title: '내 지갑 vs 용돈 명세서',
          blocks: [
            { type: 'say', text: '3장에 온 걸 환영해요! 이번 장은 실제로 앱을 만들 때 매일 고민하는 것들이에요. 첫 수업은 "**상태를 어디에 둘까**"예요.\n\n먼저 state와 props를 한 번에 비교해 볼게요.' },
            {
              type: 'table',
              head: ['', 'state (상태)', 'props (속성)'],
              rows: [
                ['주인', '그 컴포넌트 자신', '부모'],
                ['바꿀 수 있나', '`setState`로만', '받은 쪽에서는 못 바꿈'],
                ['비유', '내 지갑 속 돈', '부모님이 주신 용돈 명세서'],
              ],
            },
            { type: 'say', text: '**state**는 컴포넌트가 직접 가지고 있고, **시간이 지나면서 바뀌는** 데이터예요. 바뀌면 화면이 다시 그려지고요.' },
          ],
        },
        {
          title: '계산할 수 있으면 state가 아니에요',
          blocks: [
            { type: 'say', text: '"바뀌는 데이터니까 state로 하자"라고 생각하기 쉬운데, 여기 함정이 있어요.' },
            {
              type: 'code',
              code: `// ❌ 완료 개수를 state로 따로 둠
const [todos, setTodos] = useState<Todo[]>([]);
const [doneCount, setDoneCount] = useState(0);   // todos가 바뀔 때마다 같이 고쳐야 함

// ✅ 렌더링할 때 계산
const [todos, setTodos] = useState<Todo[]>([]);
const doneCount = todos.filter((t) => t.status === 'done').length;`,
            },
            { type: 'ask', q: '완료 개수를 state로 따로 두면 어떤 버그가 생길까요?', a: '할 일을 완료로 바꾸면서 `setDoneCount`를 깜빡하면 숫자가 어긋나요. "할 일은 3개 완료인데 화면에는 2개 완료"처럼요.\n**다른 값으로 계산할 수 있는 값은 state로 두지 말고, 렌더링할 때 계산**하세요. 그러면 어긋날 일이 아예 없어요.' },
          ],
        },
      ],
    },
    {
      title: '무상태 컴포넌트는 재사용의 왕',
      slides: [
        {
          title: '받은 것만 그리는 컴포넌트',
          blocks: [
            { type: 'say', text: 'state가 없고 **props만 받아서 그리기만 하는** 컴포넌트를 **무상태 컴포넌트**라고 해요. 같은 props를 주면 항상 같은 화면이 나와요.' },
            {
              type: 'code',
              code: `function CourseCard({ title, price, onWish }: Props) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{price.toLocaleString()}원</p>
      <button onClick={onWish}>찜</button>
    </div>
  );
}`,
            },
            { type: 'note', tone: 'analogy', text: '자판기랑 같아요. 같은 버튼(props)을 누르면 항상 같은 음료(화면)가 나와요. 자판기 안에 기분(state)이 있어서 오늘은 콜라 대신 사이다가 나오면 곤란하잖아요.' },
          ],
        },
        {
          title: '어디에 써먹나요',
          blocks: [
            {
              type: 'table',
              head: ['활용', '예시'],
              rows: [
                ['디자인 시스템 컴포넌트', '`Button`, `Badge`, `Card` — 피그마 컴포넌트 1개 = 코드 무상태 컴포넌트 1개'],
                ['목록의 항목', '2장의 `TodoItem`, 강의 카드, 상품 카드'],
                ['같은 모양, 다른 데이터', '강의 카드를 홈·검색 결과·찜 목록에서 그대로 재사용'],
                ['상태별 미리보기', 'props만 바꿔서 기본·비활성·에러 모양을 전부 확인 (Storybook이 이 방식)'],
              ],
            },
            { type: 'say', text: '이 앱(remind)의 `Badge`, `ProgressBar`도 전부 무상태 컴포넌트예요. 어느 화면에서든 가져다 쓸 수 있죠.' },
          ],
        },
      ],
    },
    {
      title: '가장 가까운 공통 부모에 두기',
      slides: [
        {
          title: '"무조건 맨 위"가 아니에요',
          blocks: [
            { type: 'say', text: '2장에서 "상태 끌어올리기"를 배웠죠. 그럼 상태를 전부 맨 위 App에 모으면 제일 편하지 않을까요?\n\nReact 공식 문서의 기준은 **"무조건 위로"가 아니라** 이 두 가지예요.' },
            {
              type: 'table',
              head: ['원칙', '뜻', '예시'],
              rows: [
                ['**가장 가까운 공통 부모**로 끌어올리기', '그 상태를 쓰는 컴포넌트들의 가장 가까운 조상까지만. 더 위로는 안 올려요', '검색창과 결과 목록이 검색어를 같이 쓰면 → 둘의 부모인 SearchPage에'],
                ['**혼자 쓰면 그 자리에**', '한 컴포넌트만 쓰면 굳이 올리지 않아요', '드롭다운 열림/닫힘, 입력 중인 글자 → 그 컴포넌트 안에'],
              ],
            },
          ],
        },
        {
          title: '맨 위에 다 모으면 생기는 일',
          blocks: [
            { type: 'ask', q: '드롭다운 열림 여부를 App에 두면 드롭다운을 열 때마다 무슨 일이 생길까요? (2장 memo 수업을 떠올려 보세요)', a: 'App의 state가 바뀌니까 **App 아래 전체가 다시 렌더링**돼요. 드롭다운 하나 여는데 앱 전체가 다시 계산되는 거예요.\n게다가 App에서 드롭다운까지 props를 5단계씩 내려보내야 해요. 중간 컴포넌트들은 쓰지도 않는 props를 그냥 전달만 하죠. 이걸 **props 드릴링**이라고 불러요.' },
            { type: 'note', tone: 'analogy', text: '회사에서 모든 결정을 사장님이 하면 볼펜 하나 살 때도 결재가 5단계를 거쳐요. 팀에서 정할 건 팀에서, 회사 전체가 알아야 할 것만 위에서 정하는 게 빠르죠.' },
          ],
        },
        {
          title: '상태 종류에 따라 집이 달라요',
          blocks: [
            { type: 'say', text: '실무에서는 상태를 **종류별로** 나눠서 다른 곳에 둬요. 지금은 이름만 알아 두세요. 뒤 챕터에서 하나씩 배워요.' },
            {
              type: 'table',
              head: ['상태 종류', '예시', '두는 곳'],
              rows: [
                ['화면 상태 (로컬)', '드롭다운 열림, 입력 중인 글자', '그 컴포넌트 안 `useState`'],
                ['공유 상태 (전역)', '로그인 사용자, 다크 모드', 'Context, **Zustand** 같은 전역 저장소'],
                ['서버 상태', '강의 목록, 내 주문 내역', '**TanStack Query** 같은 서버 상태 도구'],
              ],
            },
            { type: 'note', tone: 'tip', text: '시니어 채용 공고에 "TanStack Query 등 서버 상태 관리 경험"이 자주 나오는 이유가 이거예요. 서버에서 온 데이터는 캐시·재요청·로딩 처리가 필요해서 일반 state와 다르게 다뤄요.' },
          ],
        },
      ],
    },
    {
      title: '로직은 커스텀 훅으로',
      slides: [
        {
          title: '컨테이너/표현 컴포넌트 패턴',
          blocks: [
            { type: 'say', text: '책이나 오래된 블로그에서 **컨테이너 컴포넌트 / 표현 컴포넌트**라는 패턴을 볼 거예요.\n• 컨테이너: 상태와 로직만 가짐, UI는 없음\n• 표현: props를 받아 UI만 그림' },
            {
              type: 'code',
              code: `// 예전 방식: 로직 담당 컴포넌트가 UI 담당 컴포넌트에 넘김
function TodoContainer() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const add = (title: string) => setTodos([...todos, { id: Date.now(), title }]);
  return <TodoView todos={todos} onAdd={add} />;
}`,
            },
            { type: 'note', tone: 'warn', text: '이 패턴을 유명하게 만든 Dan Abramov(전 React 팀)가 2019년에 직접 "**이제는 이렇게 나누는 걸 권하지 않는다. 훅으로 같은 일을 할 수 있다**"고 글 맨 위에 덧붙였어요. 기계적으로 두 종류로 나누면 파일만 늘고 억지스러운 경계가 생기거든요.' },
          ],
        },
        {
          title: '요즘 방식: 커스텀 훅',
          blocks: [
            { type: 'say', text: '"로직과 UI를 나눈다"는 **생각 자체는 여전히 맞아요.** 다만 로직을 컴포넌트가 아니라 **커스텀 훅**이라는 함수로 빼요. 이름이 `use`로 시작하는 함수예요.' },
            {
              type: 'code',
              code: `// 로직은 훅으로
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const add = (title: string) => setTodos([...todos, { id: Date.now(), title }]);
  return { todos, add };
}

// 컴포넌트는 훅을 불러 쓰기만
function TodoPage() {
  const { todos, add } = useTodos();
  return <TodoView todos={todos} onAdd={add} />;   // UI는 무상태 컴포넌트
}`,
            },
            { type: 'say', text: '좋은 점은 `useTodos`를 **다른 컴포넌트에서도 그대로** 쓸 수 있다는 거예요. 정리하면 이 수업의 한 줄 규칙이에요.\n\n**상태는 가장 가까운 공통 부모에, UI 컴포넌트는 props만, 로직은 커스텀 훅으로.**\n\n커스텀 훅은 4장에서 자세히 배워요.' },
          ],
        },
      ],
    },
    {
      title: 'props 검증은 TypeScript로',
      slides: [
        {
          title: 'PropTypes는 이제 동작하지 않아요',
          blocks: [
            { type: 'say', text: '컴포넌트에 잘못된 props가 들어오면 바로 알 수 있어야 하죠. 예전에는 **PropTypes**라는 걸로 검사했어요.' },
            {
              type: 'code',
              code: `// 예전 (React 19에서는 아무 일도 안 일어남)
Heading.propTypes = { text: PropTypes.string };
Heading.defaultProps = { text: '안녕' };

// 지금
interface Props { text?: string }
function Heading({ text = '안녕' }: Props) {   // 타입 + 기본 파라미터
  return <h1>{text}</h1>;
}`,
            },
            { type: 'note', tone: 'warn', text: '**React 19에서 함수 컴포넌트의 propTypes 검사가 제거**됐어요. 써도 경고조차 안 나와요. `defaultProps`도 함수 컴포넌트에서는 무시돼요. 책에 PropTypes 예제가 있으면 따라 하지 말고 TypeScript + 기본 파라미터(2-1)로 바꿔 쓰세요.' },
          ],
        },
        {
          title: 'TypeScript가 못 막는 것',
          blocks: [
            {
              type: 'table',
              head: ['', 'PropTypes', 'TypeScript'],
              rows: [
                ['검사 시점', '실행 중 (콘솔 경고)', '코드 쓰는 중·빌드 중 (빨간 줄)'],
                ['React 19', '함수 컴포넌트에서 제거됨', '권장 방식'],
                ['자동완성', '없음', '있음'],
              ],
            },
            { type: 'ask', q: 'TypeScript로 props 타입을 다 적었어요. 그럼 서버에서 온 데이터도 안전할까요?', a: '아니요. TypeScript는 **코드를 쓰는 동안**만 검사하고, 빌드하면 타입이 사라져요(2-3). 실행 중에 밖에서 들어오는 값(API 응답, 폼 입력)은 검사하지 못해요.\n그건 **zod** 같은 런타임 검사 도구로 막아요. 역할 분담: **컴포넌트 props는 TypeScript, 외부 데이터는 zod.**' },
            { type: 'say', text: '첫 수업 끝! 확인 문제 풀어 볼게요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're03-1-q1',
      source: 'state와 props, 그리고 state가 아닌 것',
      type: 'mcq',
      question: 'todos 상태가 있을 때 "완료한 할 일 개수"는 어떻게 다루는 게 좋을까?',
      choices: ['useState로 doneCount를 따로 만든다', '렌더링할 때 todos.filter(...).length로 계산한다', '전역 변수에 저장한다', 'localStorage에 저장한다'],
      answer: 1,
      explanation: '다른 state로 계산할 수 있는 값은 state로 두지 않아요. 따로 두면 todos를 바꿀 때 같이 고치는 걸 깜빡해서 숫자가 어긋나요.',
    },
    {
      id: 're03-1-q2',
      source: 'state와 props, 그리고 state가 아닌 것',
      type: 'ox',
      question: '자식은 부모에게 받은 props를 setState처럼 직접 바꿀 수 있다.',
      answer: false,
      explanation: 'props의 주인은 부모예요. 자식은 읽기만 하고, 바꾸고 싶으면 부모가 내려 준 함수를 불러서 요청해요.',
    },
    {
      id: 're03-1-q3',
      source: '무상태 컴포넌트는 재사용의 왕',
      type: 'mcq',
      question: '무상태 컴포넌트의 특징으로 옳은 것은?',
      choices: ['항상 서버에서 데이터를 가져온다', '같은 props를 주면 항상 같은 화면을 그린다', 'useState를 반드시 하나 이상 가진다', '한 화면에서만 쓸 수 있다'],
      answer: 1,
      explanation: '무상태 컴포넌트는 받은 props로 그리기만 해요. 결과가 예측 가능해서 여러 화면에서 재사용하기 좋아요.',
    },
    {
      id: 're03-1-q4',
      source: '가장 가까운 공통 부모에 두기',
      type: 'mcq',
      question: '드롭다운 하나의 열림/닫힘 상태는 어디에 두는 게 가장 알맞을까?',
      choices: ['App 최상위', '그 드롭다운 컴포넌트 안', 'TanStack Query', '모든 페이지의 공통 레이아웃'],
      answer: 1,
      explanation: '혼자 쓰는 상태는 그 자리에 둬요. App에 두면 드롭다운을 열 때마다 앱 전체가 다시 렌더링되고 props 드릴링이 생겨요.',
    },
    {
      id: 're03-1-q5',
      source: '가장 가까운 공통 부모에 두기',
      type: 'short',
      question: '쓰지도 않는 props를 여러 단계의 중간 컴포넌트가 그냥 전달만 하는 현상을 무엇이라고 할까? (props ___)',
      answer: ['드릴링', 'props 드릴링', 'drilling', 'prop drilling', 'props drilling'],
      explanation: '상태를 필요 이상으로 위에 두면 생기는 문제예요. 공유가 넓게 필요하면 Context나 전역 저장소를 써요.',
    },
    {
      id: 're03-1-q6',
      source: '가장 가까운 공통 부모에 두기',
      type: 'mcq',
      question: '서버에서 가져온 강의 목록처럼 캐시·재요청·로딩 처리가 필요한 "서버 상태"를 다루는 대표 도구는?',
      choices: ['useState', 'TanStack Query', 'CSS 모듈', 'PropTypes'],
      answer: 1,
      explanation: '화면 상태는 useState, 공유 상태는 Context·Zustand, 서버 상태는 TanStack Query처럼 종류별로 집이 달라요.',
    },
    {
      id: 're03-1-q7',
      source: '로직은 커스텀 훅으로',
      type: 'mcq',
      question: '요즘 React에서 "로직과 UI를 분리"하는 권장 방식은?',
      choices: ['모든 컴포넌트를 컨테이너/표현 두 종류로 기계적으로 나눈다', '로직은 use로 시작하는 커스텀 훅으로 빼고, UI는 props를 받는 컴포넌트로 만든다', '로직을 전부 CSS로 옮긴다', '클래스 컴포넌트로 다시 바꾼다'],
      answer: 1,
      explanation: '분리한다는 생각은 맞지만, 패턴을 소개한 본인도 2019년부터 기계적 분리를 권하지 않아요. 지금은 커스텀 훅으로 로직을 빼요.',
    },
    {
      id: 're03-1-q8',
      source: 'props 검증은 TypeScript로',
      type: 'ox',
      question: 'React 19의 함수 컴포넌트에서도 propTypes를 설정하면 잘못된 props에 콘솔 경고가 나온다.',
      answer: false,
      explanation: 'React 19에서 함수 컴포넌트의 propTypes 검사가 제거돼서 아무 효과가 없어요. TypeScript로 타입을 적고 기본값은 기본 파라미터로 써요.',
    },
    {
      id: 're03-1-q9',
      source: '가장 가까운 공통 부모에 두기',
      type: 'essay',
      question: '[면접] 상태는 항상 최상위 부모에 두는 게 좋나요?',
      answer: '아닙니다. 그 상태를 쓰는 컴포넌트들의 가장 가까운 공통 부모까지만 끌어올리고, 한 컴포넌트만 쓰는 상태는 그 컴포넌트 안에 둡니다. 무조건 위로 올리면 작은 변화에도 넓은 범위가 다시 렌더링되고 props 드릴링이 생깁니다. 여러 화면이 공유하는 값은 Context나 전역 저장소, 서버 데이터는 TanStack Query 같은 도구로 구분합니다.',
      keywords: ['가장 가까운 공통 부모', '가까이 두기', '리렌더링 범위', 'props 드릴링', '서버 상태'],
      explanation: '"가장 가까운 공통 부모"와 "혼자 쓰면 그 자리에" 두 원칙, 그리고 상태 종류별 위치를 말하면 좋아요.',
    },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-04-1-design-hooks',
  track: 'react',
  group: '04. 훅·생명주기·Context',
  title: '4-1. 화면 설계와 훅의 규칙',
  order: 401,
  notionId: '409df951bf808131b12af91514be27c4',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '시안 → 상태와 액션 → 컴포넌트',
      slides: [
        {
          title: '코드 치기 전에 할 일',
          blocks: [
            { type: 'say', text: '4장에 온 걸 환영해요! 이번 장은 **훅**을 제대로 배우는 장이에요. 그 전에 첫 수업은 "화면 하나를 만들 때 **어떤 순서로 생각하는지**"예요.\n\n많은 사람이 피그마 시안을 보자마자 코드부터 쳐요. 그러다 중간에 "이 값은 어디에 둬야 하지?" 하며 다 뜯어고치죠. 시니어는 코드 치기 전에 세 가지를 먼저 뽑아요.' },
            { type: 'list', ordered: true, items: ['**상태**: 이 화면이 기억해야 하는 값은?', '**액션**: 사용자가 할 수 있는 행동은?', '**컴포넌트**: 반복되거나 따로 떼기 좋은 덩어리는?'] },
            { type: 'note', tone: 'tip', text: 'React 공식 문서의 "Thinking in React"도 같은 흐름이에요. UI를 컴포넌트로 나누기 → 정적 화면 만들기 → **최소한의 상태** 찾기 → 상태가 살 곳 정하기 → 액션 연결하기.' },
          ],
        },
        {
          title: '기획 문서가 그대로 설계가 돼요',
          blocks: [
            { type: 'say', text: '디자인 기획 때 만드는 **IA**(화면 구조)와 **유저플로우**(사용자 행동 흐름)가 여기서 그대로 쓰여요. 인프런 강의 목록 화면으로 해 볼게요.' },
            {
              type: 'table',
              head: ['기획 산출물', '여기서 뽑는 것', '예: 강의 목록 화면'],
              rows: [
                ['IA (화면이 보여 주는 정보)', '**상태** 후보', '강의 목록, 검색어, 선택한 카테고리, 정렬 기준'],
                ['유저플로우 (사용자 행동)', '**액션**', '검색어 입력, 카테고리 클릭, 정렬 변경, 찜하기, 강의 클릭 → 상세'],
                ['피그마 시안 (반복되는 덩어리)', '**컴포넌트** 후보', 'SearchBar, CategoryTabs, CourseCard, SortSelect'],
              ],
            },
            { type: 'ask', q: '"검색 결과 목록"도 상태로 만들어야 할까요? (3-1을 떠올려 보세요)', a: '아니요. 검색 결과는 **강의 목록 + 검색어 + 카테고리**로 계산할 수 있어요. 계산할 수 있는 값은 state로 따로 두지 않고 렌더링할 때 계산해요. 화면에 보인다고 전부 state가 아니에요.' },
          ],
        },
      ],
    },
    {
      title: '상태를 나눌까 묶을까',
      slides: [
        {
          title: '따로 바뀌면 나누고, 같이 바뀌면 묶어요',
          blocks: [
            { type: 'say', text: '상태를 뽑았으면 "useState 하나에 다 넣을까, 여러 개로 나눌까?"를 정해야 해요. 기준은 간단해요.' },
            {
              type: 'code',
              code: `// ✅ 따로 바뀌는 값은 나눈다
const [query, setQuery] = useState('');
const [sort, setSort] = useState<'new' | 'popular'>('new');

// ✅ 항상 같이 바뀌는 값은 묶는다
const [pos, setPos] = useState({ x: 0, y: 0 });   // 마우스 위치는 x, y가 늘 함께`,
            },
            { type: 'say', text: '검색어를 바꿀 때 정렬은 상관없죠. 둘을 한 객체에 넣으면 바꿀 때마다 `{ ...filter, query: 새값 }`처럼 나머지를 챙겨야 해서 번거로워요. 반대로 x, y처럼 늘 함께 바뀌는 건 묶어야 둘이 어긋나지 않아요.' },
          ],
        },
        {
          title: '컴포넌트도 같은 기준으로 나눠요',
          blocks: [
            { type: 'say', text: '이 기준은 **컴포넌트를 나눌 때도** 똑같이 써요. A만 쓰는 부분과 B만 쓰는 부분을 다른 컴포넌트로 나누고, 각자 안에 상태를 두면 **A가 바뀌어도 B 쪽은 다시 렌더링되지 않아요.**' },
            { type: 'say', text: '예를 들어 헤더의 알림 드롭다운 열림 상태는 헤더 안에, 강의 목록 필터는 목록 페이지 안에 두면, 알림을 열고 닫을 때 강의 목록이 다시 계산되지 않아요.' },
            {
              type: 'table',
              head: ['컴포넌트를 나누는 기준', '판단하는 질문'],
              rows: [
                ['재사용', '두 곳 이상에서 쓰나? 디자인 시스템 컴포넌트인가?'],
                ['책임이 하나인가', '이 컴포넌트가 하는 일을 **한 문장**으로 말할 수 있나?'],
                ['상태가 독립적인가', '따로 바뀌는 상태를 한 컴포넌트가 다 들고 있지 않나?'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '함수 컴포넌트 vs 클래스 컴포넌트',
      slides: [
        {
          title: '직원과 계산기',
          blocks: [
            { type: 'say', text: '2-2에서 클래스 컴포넌트의 this 문제를 봤죠. 오늘은 두 방식의 **생각하는 법** 차이를 볼게요.' },
            { type: 'note', tone: 'analogy', text: '**클래스형** = 직원 한 명. 자기 서랍(`this.state`)이 있고, 정해진 시간표(생명주기 메서드)대로 일해요. "출근하면 할 일", "퇴근 전에 할 일"이 시간표별로 흩어져 있어요.\n\n**함수형** = 계산기. 넣은 값(props)이 같으면 항상 같은 결과(화면)를 내요. 필요한 능력은 **부품(훅)** 을 끼워서 얻고, 한 기능의 "시작"과 "정리"가 한 부품 안에 같이 들어 있어요.' },
            {
              type: 'code',
              code: `// 클래스형: 시작과 정리가 다른 메서드에 흩어짐
class WindowWidth extends React.Component {
  componentDidMount() { window.addEventListener('resize', this.onResize); }      // 시작
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); } // 정리
  // ...
}

// 함수형: 시작과 정리가 한 곳에
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);                  // 시작
    return () => window.removeEventListener('resize', onResize);  // 정리 (바로 옆)
  }, []);
  return width;
}`,
            },
          ],
        },
        {
          title: '기능이 많아지면 차이가 커져요',
          blocks: [
            { type: 'say', text: '창 너비, 온라인 여부, 타이머. 기능을 3개로 늘리면 어떻게 될까요?' },
            {
              type: 'table',
              head: ['', '클래스형', '함수형'],
              rows: [
                ['코드 모양', 'componentDidMount 안에 세 기능의 시작이, componentWillUnmount 안에 세 기능의 정리가 **섞여** 들어감', '`useWindowWidth()`, `useOnline()`, `useTimer()` 세 줄'],
                ['한 기능을 고칠 때', '메서드 2~3개를 오가며 찾아야 함', '훅 파일 하나만 열면 됨'],
                ['재사용', '고차 컴포넌트로 겹겹이 감싸야 함', '훅을 불러 쓰면 끝'],
                ['정리 누락 위험', '시작과 정리가 멀리 떨어져 있어 빼먹기 쉬움', '바로 옆에 있어 눈에 띔'],
              ],
            },
          ],
        },
        {
          title: '클래스는 이제 언제 쓰나요',
          blocks: [
            { type: 'note', tone: 'warn', text: '책에 "생명주기가 더 필요하거나 C#·자바가 익숙하면 클래스 컴포넌트"라고 나오면 **지금은 그렇게 고르지 않아요.** React 공식 문서는 클래스 컴포넌트를 **레거시(예전 방식) API**로 분류하고 새 코드는 함수로 쓰라고 해요. 익숙함은 기준이 아니에요.' },
            { type: 'say', text: '클래스가 아직 필요한 곳은 **딱 하나**예요. **에러 바운더리**(자식에서 난 에러를 잡아 "문제가 생겼어요" 화면을 대신 보여 주는 컴포넌트). React 19에도 훅 버전이 없어서, 보통은 `react-error-boundary` 라이브러리를 써요.' },
            { type: 'say', text: '"함수 컴포넌트가 렌더링 성능이 더 좋다"는 말도 반만 맞아요. 하나를 렌더링하는 속도는 거의 같아요. 다만 **React Compiler가 함수 컴포넌트만** 자동 최적화하고, 새 기능이 전부 함수 기준이라 실제로는 함수가 유리한 환경이에요.' },
          ],
        },
      ],
    },
    {
      title: '훅의 규칙 2가지',
      slides: [
        {
          title: '이것만은 꼭 지켜요',
          blocks: [
            { type: 'say', text: '이번 장 내내 훅을 쓸 텐데, 그 전에 **훅의 규칙** 두 가지를 알고 가요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '컴포넌트(또는 커스텀 훅)의 **맨 위에서만** 불러요. if문, 반복문, 안쪽 함수 안에서 부르지 않아요.',
                '**React 함수 컴포넌트나 커스텀 훅 안에서만** 불러요. 일반 함수에서는 못 불러요.',
              ],
            },
            {
              type: 'code',
              code: `function Profile({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState('');   // ❌ 조건 안에서 훅 호출
  }
  const [age, setAge] = useState(0);
}`,
            },
          ],
        },
        {
          title: '왜 순서가 중요할까요',
          blocks: [
            { type: 'say', text: 'React는 훅에 이름표를 붙이지 않아요. **부른 순서**로 구분해요. "이 컴포넌트의 첫 번째 useState, 두 번째 useState…" 이렇게요.' },
            { type: 'ask', q: '위 코드에서 처음엔 isLoggedIn이 true였다가 다음 렌더링에 false가 되면 무슨 일이 생길까요?', a: '처음엔 name이 1번, age가 2번이었어요. 다음엔 name이 건너뛰어져서 **age가 1번 자리**가 돼요. React는 1번 자리에 저장해 둔 값(name의 값)을 age에 줘 버려요. 상태가 뒤섞이는 거예요.' },
            { type: 'note', tone: 'analogy', text: '사물함에 이름 대신 **번호**만 적혀 있다고 생각해 보세요. 매일 같은 순서로 줄을 서야 자기 사물함을 찾아요. 어느 날 한 명이 빠지면 뒷사람들이 전부 남의 사물함을 열어요.' },
            { type: 'note', tone: 'tip', text: '예외가 하나 있어요. React 19의 `use`는 if문 안에서도 부를 수 있어요(4-5에서 나와요). Vite 템플릿의 린트(eslint-plugin-react-hooks)가 이 규칙을 어기면 바로 알려 줘요.' },
            { type: 'say', text: '첫 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're04-1-q1',
      source: '시안 → 상태와 액션 → 컴포넌트',
      type: 'mcq',
      question: '유저플로우(사용자 행동 흐름) 문서에서 주로 뽑아내는 것은?',
      choices: ['컴포넌트 이름', '액션 (검색, 클릭, 찜하기 같은 사용자 행동)', 'CSS 색상', 'DB 테이블'],
      answer: 1,
      explanation: 'IA에서는 상태 후보, 유저플로우에서는 액션, 시안에서는 컴포넌트 후보를 뽑아요.',
    },
    {
      id: 're04-1-q2',
      source: '시안 → 상태와 액션 → 컴포넌트',
      type: 'ox',
      question: '강의 목록·검색어·카테고리가 state로 있을 때, "검색 결과 목록"도 따로 state로 두는 것이 좋다.',
      answer: false,
      explanation: '검색 결과는 다른 state로 계산할 수 있어서 렌더링할 때 계산해요. 따로 두면 어긋날 수 있어요.',
    },
    {
      id: 're04-1-q3',
      source: '상태를 나눌까 묶을까',
      type: 'mcq',
      question: '상태를 묶어서 하나의 객체로 두기에 가장 알맞은 것은?',
      choices: ['검색어와 정렬 기준', '마우스 위치 x와 y', '드롭다운 열림과 로그인 사용자', '다크 모드와 장바구니'],
      answer: 1,
      explanation: '항상 같이 바뀌는 값은 묶고, 따로 바뀌는 값은 나눠요. x, y는 늘 함께 바뀌어요.',
    },
    {
      id: 're04-1-q4',
      source: '함수 컴포넌트 vs 클래스 컴포넌트',
      type: 'mcq',
      question: '지금도 클래스 컴포넌트가 필요한(또는 라이브러리를 써야 하는) 경우는?',
      choices: ['상태가 3개 이상일 때', '에러 바운더리', '자바가 익숙한 개발자일 때', '목록을 렌더링할 때'],
      answer: 1,
      explanation: '에러 바운더리는 React 19에도 훅 버전이 없어요. 그 외 새 코드는 함수 컴포넌트로 써요.',
    },
    {
      id: 're04-1-q5',
      source: '함수 컴포넌트 vs 클래스 컴포넌트',
      type: 'mcq',
      question: '함수 컴포넌트 + 훅이 클래스보다 나은 점으로 가장 알맞은 것은?',
      choices: ['코드가 무조건 2배 빨리 실행된다', '한 기능의 시작과 정리 코드가 한 곳(훅)에 모여서 고치고 재사용하기 쉽다', 'CSS를 쓸 필요가 없다', '서버가 필요 없다'],
      answer: 1,
      explanation: '클래스는 기능 하나의 코드가 생명주기 메서드 여러 곳에 흩어져요. 훅은 기능 단위로 모이고, 다른 컴포넌트에서 불러 쓰기만 하면 돼요.',
    },
    {
      id: 're04-1-q6',
      source: '훅의 규칙 2가지',
      type: 'ox',
      question: 'useState는 if문 안에서 필요할 때만 불러도 된다.',
      answer: false,
      explanation: 'React는 훅을 부른 순서로 구분해요. 조건에 따라 건너뛰면 순서가 밀려서 상태가 뒤섞여요. 훅은 항상 맨 위에서 불러요.',
    },
    {
      id: 're04-1-q7',
      source: '훅의 규칙 2가지',
      type: 'mcq',
      question: 'React가 컴포넌트 안의 여러 useState를 서로 구분하는 방법은?',
      choices: ['변수 이름으로', '부른 순서로', '초깃값으로', '랜덤 id로'],
      answer: 1,
      explanation: '훅에는 이름표가 없고 순서로 구분해요. 그래서 매 렌더링마다 같은 순서로 불러야 해요.',
    },
  ],
}

export default topic

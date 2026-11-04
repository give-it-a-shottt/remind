import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-08-3-generics',
  track: 'react',
  group: '08. TypeScript 실전',
  title: '8-3. 제네릭 심화',
  order: 803,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '제약 조건 extends',
      slides: [
        {
          title: '아무 T나 받으면 곤란할 때',
          blocks: [
            { type: 'say', text: '2-3에서 제네릭은 "타입 자리의 빈칸 T"라고 했죠. 그런데 아무 타입이나 들어오면 곤란할 때가 있어요.' },
            {
              type: 'code',
              code: `function byId<T>(list: T[], id: number) {
  return list.find((item) => item.id === id);   // ❌ T에 id가 있는지 모름
}`,
            },
            { type: 'say', text: 'T가 숫자일 수도 있잖아요. 숫자에는 id가 없죠. 그래서 "**T는 적어도 id를 가진 타입이어야 해**"라고 **제약**을 걸어요.' },
            {
              type: 'code',
              code: `function byId<T extends { id: number }>(list: T[], id: number): T | undefined {
  return list.find((item) => item.id === id);   // ✅
}

byId(courses, 7);   // Course | undefined  ← T는 Course로, 다른 속성 정보도 유지
byId([1, 2], 1);    // ❌ number에는 id가 없음`,
            },
          ],
        },
        {
          title: 'extends는 "적어도 이건 가져야 해"',
          blocks: [
            { type: 'say', text: '`T extends { id: number }`는 "T는 id를 **포함한** 아무 타입"이라는 뜻이에요. Course든 User든 Review든 id만 있으면 다 돼요. 그리고 결과 타입은 **들어온 그대로**(Course면 Course) 유지돼요. any나 `{ id: number }`로 받았다면 title 같은 정보가 사라졌을 거예요.' },
            { type: 'note', tone: 'analogy', text: '"택배 상자에 넣은 물건 그대로 배송"(2-3)에 조건이 붙은 거예요. "**바코드(id)가 붙은 물건만** 받아요. 대신 받은 물건은 그대로 돌려드려요."' },
            { type: 'say', text: '8-2에서 본 `K extends keyof Course`도 같은 제약이에요. "K는 Course의 키 중 하나여야 해."' },
          ],
        },
      ],
    },
    {
      title: '제네릭 컴포넌트',
      slides: [
        {
          title: '어떤 목록이든 그리는 List',
          blocks: [
            { type: 'say', text: '강의 목록, 사용자 목록, 수강평 목록… 모양은 다르지만 "목록을 그리고, 비었으면 안내 문구"는 같아요. 컴포넌트도 제네릭으로 만들 수 있어요.' },
            {
              type: 'code',
              code: `type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  render: (item: T) => React.ReactNode;
  empty?: React.ReactNode;
};

function List<T>({ items, getKey, render, empty = '아직 없어요' }: ListProps<T>) {
  if (items.length === 0) return <p>{empty}</p>;
  return <ul>{items.map((item) => <li key={getKey(item)}>{render(item)}</li>)}</ul>;
}

// 쓰는 쪽: T가 Course로 자동 결정 → render 안에서 c.title 자동완성
<List items={courses} getKey={(c) => c.id} render={(c) => <b>{c.title}</b>} />`,
            },
          ],
        },
        {
          title: '함수로 받는 이유',
          blocks: [
            { type: 'ask', q: 'getKey와 render를 함수로 받는 이유가 뭘까요?', a: 'List는 T가 무엇인지 **모르니까** "id가 어디 있는지", "어떻게 그릴지"를 스스로 정할 수 없어요. 그래서 쓰는 쪽에 물어보는 거예요. "key는 이걸로, 그림은 이렇게 그려 줘." 2-5의 key 규칙과 3-1의 무상태 컴포넌트가 제네릭과 만난 모양이에요.' },
            { type: 'note', tone: 'tip', text: '.tsx 파일에서 화살표 함수로 제네릭 컴포넌트를 쓰면 `<T>`를 JSX 태그로 착각할 수 있어요. 그럴 땐 `<T,>`처럼 쉼표를 붙이거나 위처럼 `function`으로 써요.' },
          ],
        },
      ],
    },
    {
      title: '제네릭 훅과 기본 타입',
      slides: [
        {
          title: '7장의 훅을 제네릭으로',
          blocks: [
            {
              type: 'code',
              code: `function useApi<T>(key: readonly unknown[], path: string) {
  return useQuery({ queryKey: key, queryFn: () => api<T>(path) });
}

const { data } = useApi<Course[]>(['courses'], '/api/courses');   // data: Course[] | undefined`,
            },
            { type: 'say', text: '4-4에서 만든 `useLocalStorage<T>`도, 5-3의 `api<T>()`도 제네릭이었어요. **"쓰는 쪽이 타입을 정하고, 안쪽은 그 타입을 그대로 흘려보내는"** 게 제네릭의 핵심이에요.' },
          ],
        },
        {
          title: '기본 타입 정하기',
          blocks: [
            {
              type: 'code',
              code: `type ApiResponse<T = unknown> = {
  data: T;
  error: string | null;
};

const a: ApiResponse = { data: 1, error: null };              // T를 안 주면 unknown
const b: ApiResponse<Course> = { data: course, error: null };`,
            },
            { type: 'say', text: '`T = unknown`처럼 빈칸에 **기본값**을 줄 수 있어요. 함수의 기본 파라미터(2-1)와 똑같아요. 기본값을 any 대신 unknown으로 두면 "타입을 안 정하면 확인하고 써야 한다"가 지켜져요.' },
            { type: 'note', tone: 'warn', text: '제네릭을 **너무 많이** 쓰면 읽기 어려워져요. `<T, U, V, K extends keyof T>`처럼 빈칸이 4개면 동료가 이해하기 힘들어요. 규칙: **같은 타입이 두 군데 이상에서 연결될 때만** 제네릭을 써요(입력과 출력처럼). 한 번만 쓰이면 그냥 구체적인 타입이 나아요.' },
          ],
        },
      ],
    },
    {
      title: '조건부 타입 맛보기',
      slides: [
        {
          title: '타입에도 if가 있어요',
          blocks: [
            { type: 'say', text: '라이브러리 타입을 열어 보면 이런 게 보여요. 직접 짤 일은 많지 않지만 **읽을 줄은** 알아야 해요.' },
            {
              type: 'code',
              code: `type IsString<T> = T extends string ? '문자' : '문자 아님';
type A = IsString<'hi'>;   // '문자'
type B = IsString<42>;     // '문자 아님'

// 8-2의 NonNullable은 사실 이렇게 생겼어요
type MyNonNullable<T> = T extends null | undefined ? never : T;
type C = MyNonNullable<string | null>;   // string`,
            },
            { type: 'say', text: '`T extends X ? A : B`는 "T가 X에 들어갈 수 있으면 A, 아니면 B"예요. 2-4에서 배운 삼항 연산자의 타입 버전이에요. 유니언에 쓰면 **하나씩** 적용돼서, `string | null`에서 null만 never(사라짐)가 돼요.' },
            { type: 'say', text: '"Awaited, ReturnType 같은 유틸리티는 이런 조건부 타입으로 만들어져 있구나" 정도면 충분해요. 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're08-3-q1',
      source: '제약 조건 extends',
      type: 'mcq',
      question: 'function byId<T extends { id: number }>(list: T[], id: number) 에 넣을 수 없는 것은?',
      choices: ['Course[] (id 있음)', 'User[] (id 있음)', 'number[]', 'Review[] (id 있음)'],
      answer: 2,
      explanation: 'extends는 "적어도 이건 가져야 해"예요. number에는 id가 없어서 안 돼요.',
    },
    {
      id: 're08-3-q2',
      source: '제약 조건 extends',
      type: 'ox',
      question: 'byId<T extends { id: number }>에 Course[]를 넣으면 결과 타입이 { id: number }로 줄어들어 title 정보가 사라진다.',
      answer: false,
      explanation: '제네릭은 들어온 타입(Course)을 그대로 유지해요. 그래서 any나 { id: number }로 받는 것보다 나아요.',
    },
    {
      id: 're08-3-q3',
      source: '제네릭 컴포넌트',
      type: 'mcq',
      question: '제네릭 List<T> 컴포넌트가 getKey, render를 함수로 받는 이유는?',
      choices: ['성능 때문에', 'List는 T가 무엇인지 몰라서, key와 그리는 방법을 쓰는 쪽에서 알려 줘야 하기 때문에', 'React 규칙이라서', 'CSS를 위해서'],
      answer: 1,
      explanation: '모르는 타입에 대해 필요한 정보를 쓰는 쪽에 함수로 물어보는 패턴이에요.',
    },
    {
      id: 're08-3-q4',
      source: '제네릭 훅과 기본 타입',
      type: 'mcq',
      question: 'type ApiResponse<T = unknown> 에서 ApiResponse 라고만 쓰면 T는?',
      choices: ['any', 'unknown', 'never', '에러'],
      answer: 1,
      explanation: '= 뒤가 기본 타입이에요. any 대신 unknown을 기본으로 두면 안전해요.',
    },
    {
      id: 're08-3-q5',
      source: '제네릭 훅과 기본 타입',
      type: 'ox',
      question: '타입이 한 군데에서만 쓰일 때도 가능한 한 제네릭으로 만드는 것이 좋다.',
      answer: false,
      explanation: '제네릭은 입력과 출력처럼 같은 타입이 두 군데 이상 연결될 때 써요. 아니면 구체적인 타입이 읽기 쉬워요.',
    },
    {
      id: 're08-3-q6',
      source: '조건부 타입 맛보기',
      type: 'mcq',
      question: "type F<T> = T extends string ? 'S' : 'N'; 일 때 F<42> 는?",
      choices: ["'S'", "'N'", 'never', 'number'],
      answer: 1,
      explanation: '42는 string에 들어갈 수 없으니 거짓 쪽인 N이에요. 타입 세계의 삼항 연산자예요.',
    },
  ],
}

export default topic

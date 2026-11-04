import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-08-1-narrowing',
  track: 'react',
  group: '08. TypeScript 실전',
  title: '8-1. 타입 좁히기와 판별 유니온',
  order: 801,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '타입 좁히기 다시 보기',
      slides: [
        {
          title: '2-3에서 한 걸음 더',
          blocks: [
            { type: 'say', text: '8장은 공고의 "**TypeScript에 대한 이해가 있으며, 정적 타입 기반의 안정적인 개발을 지향하시는 분**"이에요. 2-3에서 기초를 배웠으니, 이번엔 실무에서 **버그를 타입으로 막는** 법을 배워요.\n\n참고로 2026년 7월에 나온 **TypeScript 7**은 컴파일러를 Go 언어로 새로 만들어서 검사 속도가 훨씬 빨라졌어요. 쓰는 문법은 그대로예요.' },
            { type: 'say', text: '2-3에서 `unknown`을 `typeof`로 확인하면 그 안에서 타입이 **좁혀진다**고 했죠. 좁히는 방법은 여러 가지예요.' },
            {
              type: 'table',
              head: ['방법', '예', '좁혀지는 것'],
              rows: [
                ['`typeof`', "`typeof v === 'string'`", 'string, number, boolean 같은 기본 타입'],
                ['`in`', "`'email' in user`", '그 속성을 가진 객체 타입'],
                ['`instanceof`', '`e instanceof Error`', '클래스로 만든 객체 (에러 등)'],
                ['값 비교', "`status === 'done'`", '리터럴 유니언 중 하나'],
                ['null 확인', '`if (user)`, `user?.name`', '`User | null` → `User`'],
              ],
            },
          ],
        },
        {
          title: 'catch의 e는 unknown이에요',
          blocks: [
            {
              type: 'code',
              code: `try {
  await save();
} catch (e) {
  // e: unknown — 무엇이 던져졌는지 TS는 몰라요 (문자열을 throw할 수도 있으니까)
  const message = e instanceof Error ? e.message : '알 수 없는 오류';
  toast(message);
}`,
            },
            { type: 'say', text: '`e.message`를 바로 쓰면 에러예요. 자바스크립트는 `throw \'문자열\'`처럼 **아무거나** 던질 수 있어서 e가 Error라는 보장이 없거든요. `instanceof Error`로 좁혀서 써요. 이게 2-3의 "unknown은 확인하고 써"가 실무에서 가장 자주 나오는 곳이에요.' },
          ],
        },
      ],
    },
    {
      title: '판별 유니온',
      slides: [
        {
          title: '불리언 여러 개의 함정',
          blocks: [
            { type: 'say', text: '데이터를 불러오는 화면의 상태를 이렇게 만들었다고 해 볼게요.' },
            {
              type: 'code',
              code: `type State = {
  isLoading: boolean;
  isError: boolean;
  data?: Course[];
  error?: string;
};`,
            },
            { type: 'ask', q: '이 타입으로 만들 수 있지만 말이 안 되는 상태를 하나 떠올려 볼래요?', a: '`{ isLoading: true, isError: true, data: [...] }` — 불러오는 중인데 에러이면서 데이터도 있는 상태요. 불리언 2개 + 선택 속성 2개면 조합이 16가지나 되는데, 실제로 말이 되는 건 3~4가지뿐이에요. 나머지는 **버그가 들어갈 자리**예요.' },
          ],
        },
        {
          title: '상태마다 모양을 따로',
          blocks: [
            {
              type: 'code',
              code: `type State =
  | { status: 'loading' }
  | { status: 'success'; data: Course[] }
  | { status: 'error'; error: string };`,
            },
            { type: 'say', text: '공통 속성 `status`의 값으로 **어떤 모양인지 구별**할 수 있는 유니온을 **판별 유니온(discriminated union)** 이라고 해요. 이제 "로딩인데 데이터도 있는" 상태는 **타입으로 만들 수조차 없어요.**' },
            {
              type: 'code',
              code: `function View({ state }: { state: State }) {
  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error') return <p>{state.error}</p>;   // 여기선 error가 있다고 확신
  return <List items={state.data} />;                          // 여기선 data가 있다고 확신
}`,
            },
            { type: 'note', tone: 'tip', text: '7장의 TanStack Query 결과도 이 방식이에요. `isPending`을 확인하고 나면 `data`가 undefined가 아니라고 TS가 알아요. 라이브러리가 판별 유니온으로 타입을 만들어 둬서 가능한 거예요.' },
          ],
        },
      ],
    },
    {
      title: 'never로 빠진 경우 잡기',
      slides: [
        {
          title: '새 상태를 추가했는데 처리를 깜빡하면',
          blocks: [
            { type: 'say', text: '나중에 누가 `{ status: \'empty\' }`(결과 없음)를 추가했어요. 그런데 화면 코드에서 처리를 깜빡하면? 위 View는 empty일 때 `state.data`를 읽으려다 터져요.' },
            {
              type: 'code',
              code: `function label(state: State): string {
  switch (state.status) {
    case 'loading': return '불러오는 중';
    case 'success': return \`\${state.data.length}개\`;
    case 'error':   return state.error;
    default: {
      const _exhaustive: never = state;   // ← 모든 경우를 처리했다면 여기는 절대 못 옴
      return _exhaustive;
    }
  }
}`,
            },
            { type: 'say', text: '2-3에서 잠깐 본 `never`는 "**절대 일어날 수 없음**"이에요. 모든 경우를 처리했다면 default에 올 수 있는 값이 없으니 state는 never가 돼요. 그런데 `\'empty\'`가 추가되면 default에 empty가 들어올 수 있어서 **"empty는 never에 넣을 수 없다"는 빌드 에러**가 나요. 깜빡한 곳을 컴파일러가 전부 찾아 줘요.' },
          ],
        },
        {
          title: '이게 "정적 타입 기반의 안정적인 개발"',
          blocks: [
            { type: 'say', text: '공고의 "정적 타입 기반의 안정적인 개발"이 바로 이런 거예요.\n• **말이 안 되는 상태를 타입으로 못 만들게** 하고 (판별 유니온)\n• **새 경우가 생기면 처리 안 한 곳을 컴파일러가 찾게** 하는 것 (never)\n\n테스트를 짜기 전에 타입만으로 버그 한 종류를 통째로 없애는 거예요.' },
            { type: 'note', tone: 'tip', text: '4-3 useReducer의 Action 타입도 판별 유니온이었어요(`type` 속성으로 구별). reducer의 switch 끝에 never 검사를 두면 새 액션을 추가하고 처리를 깜빡하는 실수가 사라져요.' },
          ],
        },
      ],
    },
    {
      title: '타입 가드 함수',
      slides: [
        {
          title: '좁히는 조건을 함수로',
          blocks: [
            { type: 'say', text: '좁히는 조건이 길거나 여러 곳에서 쓰이면 함수로 빼고 싶죠. 그런데 그냥 boolean을 돌려주는 함수로 빼면 TS가 좁혀 주지 않아요.' },
            {
              type: 'code',
              code: `function isCourse(v: unknown): v is Course {          // ← 반환 타입이 "v is Course"
  return typeof v === 'object' && v !== null && 'id' in v && 'title' in v;
}

const data: unknown = await res.json();
if (isCourse(data)) {
  data.title;   // ✅ 여기서 data는 Course
}`,
            },
            { type: 'say', text: '반환 타입을 `v is Course`라고 쓰면 "이 함수가 true면 v는 Course다"라고 TS에 알려 주는 **타입 가드**가 돼요.' },
            { type: 'note', tone: 'warn', text: '타입 가드는 **내가 TS에게 약속하는 것**이에요. 함수 안 검사가 허술해도 TS는 그대로 믿어요. 그래서 서버 응답처럼 복잡한 데이터는 손으로 타입 가드를 짜기보다 8-5의 **zod**로 검사해요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're08-1-q1',
      source: '타입 좁히기 다시 보기',
      type: 'mcq',
      question: 'catch (e) 블록에서 e.message를 안전하게 쓰는 방법은?',
      choices: ['그냥 e.message', 'e instanceof Error 로 확인한 뒤 e.message', 'e를 any로 바꾼다', 'e.toString() 만 쓴다'],
      answer: 1,
      explanation: 'catch의 e는 unknown이에요. 무엇이든 던질 수 있어서 instanceof Error로 좁힌 뒤 써요.',
    },
    {
      id: 're08-1-q2',
      source: '타입 좁히기 다시 보기',
      type: 'short',
      question: "'email' in user 처럼 객체에 특정 속성이 있는지로 타입을 좁히는 연산자는?",
      answer: ['in'],
      explanation: 'typeof는 기본 타입, in은 속성 유무, instanceof는 클래스 객체를 좁혀요.',
    },
    {
      id: 're08-1-q3',
      source: '판별 유니온',
      type: 'mcq',
      question: '{ isLoading: boolean; isError: boolean; data?: T } 보다 판별 유니온이 나은 이유는?',
      choices: ['코드가 짧아서', '"로딩이면서 에러" 같은 말이 안 되는 상태를 타입으로 만들 수 없게 해서', '런타임이 빨라져서', 'React가 요구해서'],
      answer: 1,
      explanation: "status: 'loading' | 'success' | 'error'로 모양을 나누면 가능한 상태만 표현돼요.",
    },
    {
      id: 're08-1-q4',
      source: '판별 유니온',
      type: 'ox',
      question: "판별 유니온에서 if (state.status === 'success') 안에서는 state.data가 있다고 TypeScript가 안다.",
      answer: true,
      explanation: 'status 값으로 어떤 모양인지 구별되니까, 그 분기 안에서는 success 모양으로 좁혀져요.',
    },
    {
      id: 're08-1-q5',
      source: 'never로 빠진 경우 잡기',
      type: 'mcq',
      question: 'switch의 default에서 const _x: never = state 를 두는 목적은?',
      choices: ['성능 향상', '유니온에 새 경우가 추가됐는데 처리를 깜빡하면 빌드 에러로 알려 주려고', '에러를 숨기려고', 'state를 지우려고'],
      answer: 1,
      explanation: '모든 경우를 처리했다면 default의 state는 never예요. 새 경우가 생기면 never에 넣을 수 없어 에러가 나요(exhaustive check).',
    },
    {
      id: 're08-1-q6',
      source: '타입 가드 함수',
      type: 'mcq',
      question: '함수가 true를 돌려주면 인자를 Course로 좁혀 주게 하려면 반환 타입을 어떻게 쓸까?',
      choices: ['boolean', 'v is Course', 'Course', 'never'],
      answer: 1,
      explanation: 'v is Course가 타입 가드예요. 단, 검사가 허술해도 TS는 믿으니 복잡한 데이터는 zod로 검사해요.',
    },
    {
      id: 're08-1-q7',
      source: '타입 가드 함수',
      type: 'ox',
      question: '타입 가드 함수 안의 검사가 허술하면 TypeScript가 컴파일 에러로 알려 준다.',
      answer: false,
      explanation: '타입 가드는 개발자의 약속이라 TS는 안의 로직을 검증하지 않고 그대로 믿어요.',
    },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-02-3-typescript',
  track: 'react',
  group: '02. JS·TS 기초와 JSX',
  title: '2-3. TypeScript 기초',
  order: 203,
  notionId: '409df951bf8081cfb4f9d06ed5d19c02',
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'TypeScript는 왜 쓸까',
      slides: [
        {
          title: '실행해 봐야 아는 실수',
          blocks: [
            { type: 'say', text: '이번 수업은 **TypeScript(TS)** 예요. 요즘 React 채용 공고에 거의 빠지지 않는 기술이에요.\n\n먼저 자바스크립트로 이런 코드를 짰다고 해 볼게요.' },
            {
              type: 'code',
              code: `function getTotal(price, qty) {
  return price * qty;
}

getTotal('4500', 2);     // 9000  (운 좋게 됨)
getTotal(4500);          // NaN   (qty를 빼먹음)
user.nmae;               // undefined (오타)`,
            },
            { type: 'say', text: '자바스크립트는 이런 실수를 **실행해 봐야** 알아요. 그것도 에러가 아니라 NaN, undefined처럼 조용히 이상한 값이 나와서, 화면에서 한참 뒤에 터지죠.' },
          ],
        },
        {
          title: '쓰는 순간 빨간 줄',
          blocks: [
            { type: 'say', text: 'TypeScript는 자바스크립트에 **타입(이 값은 숫자다, 문자다)** 을 적을 수 있게 한 언어예요.' },
            {
              type: 'code',
              code: `function getTotal(price: number, qty: number): number {
  return price * qty;
}

getTotal(4500);   // ❌ 에디터 빨간 줄: 인수 2개가 필요한데 1개
user.nmae;        // ❌ 'nmae' 속성이 없어요. 'name'을 말한 건가요?`,
            },
            { type: 'note', tone: 'analogy', text: '워드의 **맞춤법 검사기**랑 같아요. 글을 다 써서 인쇄하기 전에, 쓰는 순간 빨간 밑줄로 알려 주죠. TypeScript는 코드의 맞춤법 검사기예요.' },
            { type: 'note', tone: 'tip', text: '타입은 **빌드할 때 전부 지워져요.** 브라우저에서 도는 건 결국 일반 자바스크립트예요. TypeScript는 "개발하는 동안 나를 지켜 주는 도구"이지, 실행 속도를 바꾸지 않아요.' },
          ],
        },
      ],
    },
    {
      title: '기본 타입과 any·unknown',
      slides: [
        {
          title: '자주 쓰는 기본 타입',
          blocks: [
            {
              type: 'table',
              head: ['타입', '예시', '메모'],
              rows: [
                ['`number`', '`let age: number = 30`', '정수·실수 구분 없음'],
                ['`string`', '`let name: string = \'성훈\'`', ''],
                ['`boolean`', '`let done: boolean = false`', ''],
                ['배열', '`number[]` 또는 `Array<number>`', '둘은 같은 뜻'],
                ['유니언', '`string | number`', '둘 중 하나'],
                ['`null`', '`User | null`', '"아직 없음"을 표현'],
                ['`void`', '`function log(): void`', '돌려주는 값이 없음'],
                ['튜플', '`[string, number]`', '길이·자리별 타입이 정해진 배열 (useState가 돌려주는 것)'],
              ],
            },
            { type: 'say', text: '좋은 소식은 **다 적을 필요가 없다**는 거예요. `let age = 30`이라고만 써도 TS가 "아, number구나" 하고 알아서 추론해요. 함수 파라미터처럼 추론이 안 되는 곳에만 적으면 돼요.' },
          ],
        },
        {
          title: 'any는 검사기를 끄는 스위치',
          blocks: [
            { type: 'say', text: '`any`는 "무엇이든 돼요"라는 타입이에요. 편해 보이지만 사실은 **맞춤법 검사기를 꺼 버리는 것**이에요. any로 받은 값은 오타를 내도, 없는 속성을 불러도 아무 말이 없어요.' },
            { type: 'say', text: '"뭔지 모르는 값"을 받아야 할 때는 `any` 대신 **`unknown`** 을 써요. unknown은 "모르니까 **확인하고 써**"라는 타입이에요.' },
            {
              type: 'code',
              code: `function printLength(value: unknown) {
  value.length;                 // ❌ 에러: 뭔지 확인도 안 하고 쓰면 안 돼요
  if (typeof value === 'string') {
    value.length;               // ✅ 여기서는 string이라고 확인됨
  }
}`,
            },
            { type: 'say', text: 'if로 확인하면 그 안에서는 타입이 좁혀져요. 이걸 **타입 좁히기(narrowing)** 라고 해요. 서버 응답처럼 밖에서 들어오는 값은 unknown으로 받고 확인해서 쓰는 게 안전해요.' },
            { type: 'note', tone: 'warn', text: '실무 리뷰 단골 지적: "any 쓰지 마세요." any가 한 번 들어가면 그 값을 쓰는 곳 전체가 검사 없이 퍼져 나가요.' },
          ],
        },
      ],
    },
    {
      title: '리터럴 유니언으로 실수 막기',
      slides: [
        {
          title: '정해진 값만 허용하기',
          blocks: [
            { type: 'say', text: '할 일 앱에서 상태는 "할 일, 하는 중, 완료" 셋 중 하나예요. 그런데 `status: string`이라고 적으면 `\'finished\'`, `\'Done\'`, `\'완료\'` 같은 오타가 전부 통과해요.' },
            { type: 'say', text: '이럴 때 **값 자체를 타입으로** 써요. 이걸 **리터럴 타입**이라고 하고, `|`로 여러 개를 묶으면 **리터럴 유니언**이에요.' },
            {
              type: 'code',
              code: `type Status = 'todo' | 'doing' | 'done';   // 이 3개 말고는 못 넣음

const s: Status = 'finished';
// error TS2322: Type '"finished"' is not assignable to type 'Status'.`,
            },
            { type: 'note', tone: 'tip', text: '에디터에서 `s = \'` 까지만 쳐도 todo / doing / done 자동완성이 떠요. 오타가 날 수가 없어요.' },
          ],
        },
        {
          title: '타입에 이름 붙이기 (type 별칭)',
          blocks: [
            { type: 'say', text: '방금 쓴 `type Status = ...`처럼 타입에 이름을 붙이는 걸 **타입 별칭(type alias)** 이라고 해요.' },
            {
              type: 'code',
              code: `type UserId = string;    // 그냥 string이지만 "사용자 ID"라는 뜻이 생김
function getUser(id: UserId) { ... }`,
            },
            { type: 'ask', q: 'type ProductId = string 도 만들었어요. getUser에 상품 ID를 넣으면 에러가 날까요?', a: '**안 나요.** 둘 다 결국 string이라 TS 눈에는 같은 타입이에요.\n`type UserId = string`은 읽는 사람에게 뜻을 전해 주는 **이름표**일 뿐, 실수를 막아 주지는 않아요. 실수를 막아 주는 건 방금 배운 **리터럴 유니언**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'type vs interface와 인터섹션',
      slides: [
        {
          title: '객체 모양을 정하는 두 가지 방법',
          blocks: [
            { type: 'say', text: '객체가 어떤 속성을 가져야 하는지 정하는 방법이 두 가지 있어요.' },
            {
              type: 'code',
              code: `interface Todo {
  id: number;
  title: string;
  status: Status;
}

type Todo2 = {
  id: number;
  title: string;
  status: Status;
};`,
            },
            { type: 'say', text: '객체 모양을 정할 때는 **둘이 거의 똑같이** 동작해요. 차이는 "한쪽만 할 수 있는 일"에 있어요.' },
            {
              type: 'table',
              head: ['기능', '`type`', '`interface`'],
              rows: [
                ['객체 모양', '가능', '가능'],
                ['유니언 `A | B`, 리터럴 타입', '가능', '불가'],
                ['기본 타입·튜플에 이름 붙이기', '가능', '불가'],
                ['확장', '`&` (인터섹션)', '`extends`'],
                ['같은 이름으로 두 번 선언하면 합쳐짐', '불가 (에러)', '가능 (선언 병합)'],
              ],
            },
          ],
        },
        {
          title: '그래서 뭘 쓰라는 거예요?',
          blocks: [
            { type: 'say', text: '정답은 하나가 아니에요. 중요한 건 **프로젝트 안에서 한 가지 규칙으로 통일**하는 거예요.\n\n• TypeScript 공식 핸드북: 객체는 interface, type이 필요할 때 type\n• 많은 React 팀: props에도 유니언을 자주 써서 전부 type으로 통일\n\n이 수업의 추천: **데이터 모양(Todo, User)은 interface, props·유니언·별칭은 type.**' },
            { type: 'say', text: '표에 나온 **인터섹션 `&`** 도 짚고 갈게요. 두 타입을 합쳐서 "A이면서 동시에 B"인 타입을 만들어요.' },
            {
              type: 'code',
              code: `type OwnedTodo = Todo & { owner: UserId };
// Todo의 속성 전부 + owner 까지 다 있어야 함`,
            },
            { type: 'ask', q: '속성이 합쳐지는데 왜 이름이 "교집합(intersection)"일까요?', a: '이름은 **값의 범위** 기준이에요. "Todo이면서 **동시에** owner도 가진 값"만 허용하니까 들어올 수 있는 값은 오히려 **줄어요**(교집합). 그런 값이 되려면 속성을 다 가져야 하니까 속성은 합쳐진 것처럼 보이는 거예요.\n반대로 유니언 `A | B`는 A거나 B면 되니까 값의 범위가 넓어져요(합집합).' },
          ],
        },
      ],
    },
    {
      title: '제네릭',
      slides: [
        {
          title: '타입 자리에 빈칸 두기',
          blocks: [
            { type: 'say', text: '배열의 첫 번째 값을 돌려주는 함수를 만들어 볼게요. 숫자 배열에도, 문자 배열에도 쓰고 싶어요.' },
            {
              type: 'code',
              code: `function firstAny(arr: any[]): any {
  return arr[0];
}
const a = firstAny([10, 20]);   // a: any  ← 숫자라는 정보가 사라짐`,
            },
            { type: 'say', text: 'any로 하면 받을 수는 있지만 **돌려줄 때 타입 정보가 사라져요.** 이걸 해결하는 게 **제네릭**이에요. 타입 자리에 **빈칸 `T`** 를 두고, 쓸 때 채우는 거예요.' },
            {
              type: 'code',
              code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([10, 20]);   // n: number | undefined  ← T가 number로 자동 결정
const s = first(['a']);      // s: string | undefined`,
            },
            { type: 'note', tone: 'analogy', text: '택배 상자에 "**들어온 물건 그대로** 배송"이라고 적는 거예요. 무엇이 들어올지는 모르지만, 넣은 게 컵이면 컵이, 책이면 책이 나와요. `T`가 그 "들어온 물건"이에요.' },
          ],
        },
        {
          title: 'React에서 매일 보는 제네릭',
          blocks: [
            {
              type: 'code',
              code: `const [todos, setTodos] = useState<Todo[]>([]);
//                                 ^^^^^^^^ T = Todo[]

const [user, setUser] = useState<User | null>(null);
//                                ^^^^^^^^^^^ 처음엔 null, 나중엔 User`,
            },
            { type: 'ask', q: 'useState<Todo[]>([]) 에서 <Todo[]>를 빼고 useState([])만 쓰면 무슨 문제가 생길까요?', a: '빈 배열 `[]`만 보고는 TS가 "무슨 배열인지" 알 수 없어서 `never[]`(아무것도 못 넣는 배열)로 추론해요. 그러면 나중에 `setTodos([newTodo])`에서 에러가 나요.\n처음 값만으로 타입을 알 수 없을 때는 이렇게 빈칸을 직접 채워 줘요.' },
          ],
        },
      ],
    },
    {
      title: 'enum 대신 리터럴 유니언',
      slides: [
        {
          title: 'enum은 왜 잘 안 쓸까요',
          blocks: [
            { type: 'say', text: 'TypeScript에는 `enum`이라는 문법이 있어요. 오래된 코드에서 자주 보여요.' },
            {
              type: 'code',
              code: `enum Color { Red, Blue }
const c = Color.Red;`,
            },
            { type: 'say', text: '그런데 **새 프로젝트에서는 거의 안 써요.** 이유가 재밌어요. 앞에서 "타입은 빌드할 때 전부 지워진다"고 했죠? 그런데 enum은 지워지지 않고 **실제 자바스크립트 객체를 만들어 내요.** 타입 문법인데 실행 코드를 만드는 특이한 녀석이에요.' },
            { type: 'say', text: '요즘 도구들은 "타입만 쓱 지우면 바로 JS가 되는 코드"를 좋아해요. 그래서 막아요.\n\n• Vite 8의 `react-ts` 템플릿: `erasableSyntaxOnly` 옵션이 켜져 있어서 enum을 쓰면 빌드 에러\n• Node.js로 .ts 파일 바로 실행: enum은 지원 안 한다는 에러' },
          ],
        },
        {
          title: '대신 쓰는 방법',
          blocks: [
            {
              type: 'code',
              code: `// 방법 1: 리터럴 유니언 (가장 많이 씀)
type Status = 'todo' | 'doing' | 'done';

// 방법 2: as const 객체 (값 목록을 코드에서도 써야 할 때)
const STATUS = { Todo: 'todo', Done: 'done' } as const;
type StatusValue = typeof STATUS[keyof typeof STATUS];   // 'todo' | 'done'`,
            },
            { type: 'say', text: '방법 2가 좀 어려워 보이죠. 지금은 "**드롭다운 메뉴처럼 값 목록을 화면에 뿌려야 하면 as const 객체, 아니면 리터럴 유니언**" 정도만 기억하면 돼요.' },
            { type: 'note', tone: 'tip', text: '오래된 회사 코드에서 enum을 만나면 당황하지 말고 "값 목록에 이름을 붙인 객체구나" 하고 읽으면 돼요.' },
          ],
        },
      ],
    },
    {
      title: '절대 경로(@/) 설정',
      slides: [
        {
          title: '../../../ 세기 지옥',
          blocks: [
            { type: 'say', text: '마지막은 프로젝트 설정 하나예요. 폴더가 깊어지면 import가 이렇게 돼요.' },
            {
              type: 'code',
              code: `// src/features/todo/components/TodoItem.tsx 에서
import Button from '../../../components/Button';

// 절대 경로를 쓰면
import Button from '@/components/Button';`,
            },
            { type: 'say', text: '`@`는 "**src 폴더의 별명**"이에요. 어느 파일에서든 src부터 경로를 적으니까 `../`를 셀 필요가 없고, 파일을 다른 폴더로 옮겨도 import가 안 깨져요.' },
          ],
        },
        {
          title: '두 곳에 알려 줘야 해요',
          blocks: [
            { type: 'say', text: '여기서 많이들 막혀요. **TypeScript(에디터)** 와 **Vite(실제 실행)** 는 서로 다른 프로그램이라 **둘 다**에게 알려 줘야 해요.' },
            {
              type: 'code',
              code: `// 1) tsconfig.app.json → TypeScript·에디터가 알아듣게
"compilerOptions": {
  "paths": { "@/*": ["./src/*"] }
}

// 2) vite.config.ts → Vite가 실제 파일을 찾아가게 (Vite 8 내장 옵션)
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
})`,
            },
            {
              type: 'table',
              head: ['하나만 설정하면', '증상'],
              rows: [
                ['tsconfig만', '에디터는 멀쩡한데 실행하면 `Failed to resolve import "@/..."`'],
                ['vite.config만', '실행은 되는데 에디터가 빨간 줄'],
              ],
            },
            { type: 'note', tone: 'tip', text: 'Next.js는 이게 훨씬 쉬워요. create-next-app이 `@/*`를 기본으로 넣어 주고, Next가 tsconfig를 스스로 읽어요. 설정할 게 거의 없어요.' },
            { type: 'say', text: 'TypeScript 기초 끝! 확인 문제 가 볼게요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're02-3-q1',
      source: 'TypeScript는 왜 쓸까',
      type: 'ox',
      question: 'TypeScript의 타입 정보는 브라우저에서 실행될 때도 그대로 남아서 실행 속도를 빠르게 해 준다.',
      answer: false,
      explanation: '타입은 빌드할 때 전부 지워지고 브라우저는 일반 JS를 실행해요. TS는 개발 중 실수를 미리 잡아 주는 도구예요.',
    },
    {
      id: 're02-3-q2',
      source: '기본 타입과 any·unknown',
      type: 'mcq',
      question: '서버 응답처럼 뭔지 모르는 값을 받을 때 가장 안전한 타입은?',
      choices: ['any', 'unknown', 'void', 'never'],
      answer: 1,
      explanation: 'unknown은 "확인하고 써"라는 타입이에요. typeof 등으로 좁힌 뒤에만 쓸 수 있어요. any는 검사를 꺼 버려서 위험해요.',
      choiceExplanations: ['검사기를 끄는 것과 같아요. 실수가 숨어요.', '맞아요. 확인을 강제해요.', 'void는 함수가 돌려주는 값이 없다는 뜻이에요.', 'never는 절대 일어나지 않는 값이에요.'],
    },
    {
      id: 're02-3-q3',
      source: '기본 타입과 any·unknown',
      type: 'mcq',
      question: 'value: unknown 일 때 value.length 를 에러 없이 쓰려면?',
      choices: ['그냥 쓴다', "if (typeof value === 'string') 안에서 쓴다", 'value를 let으로 바꾼다', 'unknown 대신 void를 쓴다'],
      answer: 1,
      explanation: 'typeof로 확인하면 그 if 블록 안에서 value가 string으로 좁혀져요(타입 좁히기).',
    },
    {
      id: 're02-3-q4',
      source: '리터럴 유니언으로 실수 막기',
      type: 'mcq',
      question: "type Status = 'todo' | 'doing' | 'done' 일 때 에러가 나는 것은?",
      choices: ["const a: Status = 'todo'", "const b: Status = 'done'", "const c: Status = 'finished'", "const d: Status = 'doing'"],
      answer: 2,
      explanation: '리터럴 유니언은 정해진 값만 허용해요. finished는 목록에 없어서 TS2322 에러가 나요.',
    },
    {
      id: 're02-3-q5',
      source: '리터럴 유니언으로 실수 막기',
      type: 'ox',
      question: 'type UserId = string 과 type ProductId = string 을 만들면, UserId 자리에 ProductId 값을 넣을 때 TypeScript가 에러를 낸다.',
      answer: false,
      explanation: '둘 다 결국 string이라 같은 타입이에요. 별칭은 뜻을 전하는 이름표일 뿐 실수를 막지는 않아요.',
    },
    {
      id: 're02-3-q6',
      source: 'type vs interface와 인터섹션',
      type: 'mcq',
      question: 'type으로는 되지만 interface로는 할 수 없는 것은?',
      choices: ['객체 모양 정의', "유니언 타입 정의 (예: 'a' | 'b')", '다른 타입을 확장하기', '속성에 타입 붙이기'],
      answer: 1,
      explanation: '유니언·리터럴 타입·기본 타입 별칭은 type만 할 수 있어요. 반대로 같은 이름 두 번 선언해 합치기(선언 병합)는 interface만 돼요.',
    },
    {
      id: 're02-3-q7',
      source: 'type vs interface와 인터섹션',
      type: 'mcq',
      question: 'type A = { id: number } & { owner: string } 인 값은?',
      choices: ['id나 owner 중 하나만 있으면 된다', 'id와 owner를 모두 가져야 한다', 'id만 있으면 된다', '아무 속성도 없어야 한다'],
      answer: 1,
      explanation: '인터섹션은 "A이면서 동시에 B"라서 두 타입의 속성을 모두 가져야 해요. 하나만 있어도 되는 건 유니언(|)이에요.',
    },
    {
      id: 're02-3-q8',
      source: '제네릭',
      type: 'mcq',
      question: 'function first<T>(arr: T[]): T | undefined 에서 first(["a", "b"]) 의 결과 타입은?',
      choices: ['any', 'string | undefined', 'T', 'string[]'],
      answer: 1,
      explanation: '넣은 배열이 string[]이라 T가 string으로 정해져요. 제네릭은 들어온 타입 정보를 그대로 유지해요.',
    },
    {
      id: 're02-3-q9',
      source: '제네릭',
      type: 'short',
      question: 'Todo 배열을 담는 상태를 빈 배열로 시작할 때: const [todos, setTodos] = useState<____>([]) 빈칸에 들어갈 타입은?',
      answer: ['Todo[]', 'Array<Todo>'],
      explanation: '빈 배열만으로는 무슨 배열인지 알 수 없어서 제네릭 빈칸을 직접 채워요. Todo[]와 Array<Todo>는 같은 뜻이에요.',
    },
    {
      id: 're02-3-q10',
      source: 'enum 대신 리터럴 유니언',
      type: 'mcq',
      question: '새 프로젝트에서 enum을 잘 쓰지 않는 이유는?',
      choices: ['enum은 TypeScript에서 삭제되었다', '다른 타입과 달리 빌드 후 실제 JS 코드를 만들어 내서, 타입만 지우는 도구들이 막는다', 'enum은 숫자만 담을 수 있다', 'React에서 import 할 수 없다'],
      answer: 1,
      explanation: '타입은 지우면 끝이지만 enum은 실제 객체를 만들어요. Vite 템플릿의 erasableSyntaxOnly나 Node의 타입 제거 실행이 enum을 막아요. 대안은 리터럴 유니언이에요.',
    },
    {
      id: 're02-3-q11',
      source: '절대 경로(@/) 설정',
      type: 'mcq',
      question: 'Vite + TS 프로젝트에서 tsconfig에만 @/* 경로를 설정하고 vite.config는 그대로 두었다. 어떻게 될까?',
      choices: ['모두 정상 동작한다', '에디터는 괜찮은데 실행하면 Vite가 @/... import를 못 찾는다', '에디터에 빨간 줄이 생기고 실행은 된다', 'TypeScript가 설치되지 않는다'],
      answer: 1,
      explanation: 'tsconfig는 TypeScript·에디터에게, vite.config는 Vite(실제 실행)에게 알려 주는 곳이에요. 둘 다 설정해야 해요.',
    },
  ],
}

export default topic

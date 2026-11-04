import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-08-2-utility-types',
  track: 'react',
  group: '08. TypeScript 실전',
  title: '8-2. 유틸리티 타입과 타입 연산자',
  order: 802,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '타입을 복사하지 말고 만들어 쓰기',
      slides: [
        {
          title: '비슷한 타입이 여러 개 필요할 때',
          blocks: [
            { type: 'say', text: '강의 데이터 타입이 있어요.' },
            { type: 'code', code: `interface Course {
  id: number;
  title: string;
  price: number;
  description: string;
  createdAt: string;
}` },
            { type: 'say', text: '그런데 실무에서는 이런 비슷한 타입들이 필요해져요.\n• 강의 **만들 때** 보내는 값: id·createdAt은 서버가 만드니까 빼고\n• 강의 **수정할 때**: 바꿀 것만 일부\n• 강의 **카드**에 넘길 것: id·title·price만\n\n이걸 손으로 다시 적으면 Course에 속성을 추가할 때 **세 군데를 다 고쳐야** 해요. TypeScript는 기존 타입으로 새 타입을 **만들어 내는** 도구를 줘요. 이걸 **유틸리티 타입**이라고 해요.' },
          ],
        },
        {
          title: '가장 많이 쓰는 다섯 가지',
          blocks: [
            {
              type: 'table',
              head: ['유틸리티', '뜻', '예'],
              rows: [
                ['`Partial<T>`', '모든 속성을 **선택**(?)으로', '수정 요청: `Partial<Course>`'],
                ['`Required<T>`', '모든 속성을 **필수**로', '기본값을 채운 뒤의 설정'],
                ['`Pick<T, K>`', '고른 속성**만**', "`Pick<Course, 'id' | 'title' | 'price'>`"],
                ['`Omit<T, K>`', '고른 속성을 **빼고**', "`Omit<Course, 'id' | 'createdAt'>`"],
                ['`Record<K, V>`', '키가 K, 값이 V인 객체', "`Record<Status, string>`"],
              ],
            },
            {
              type: 'code',
              code: `type CreateCourse = Omit<Course, 'id' | 'createdAt'>;   // 만들 때
type UpdateCourse = Partial<CreateCourse>;              // 수정할 때 (일부만)
type CourseCardProps = Pick<Course, 'id' | 'title' | 'price'>;

const statusLabel: Record<'todo' | 'doing' | 'done', string> = {
  todo: '할 일', doing: '하는 중', done: '완료',   // 하나라도 빠지면 에러
};`,
            },
            { type: 'say', text: '이제 Course에 속성을 추가하면 나머지 타입이 **자동으로** 따라와요. 진짜 데이터는 한 곳에만(3-1)의 타입 버전이에요.' },
          ],
        },
      ],
    },
    {
      title: '함수와 Promise에서 타입 꺼내기',
      slides: [
        {
          title: 'ReturnType·Parameters·Awaited',
          blocks: [
            {
              type: 'table',
              head: ['유틸리티', '꺼내는 것'],
              rows: [
                ['`ReturnType<typeof fn>`', '함수가 돌려주는 타입'],
                ['`Parameters<typeof fn>`', '함수 인자 타입들 (튜플)'],
                ['`Awaited<T>`', 'Promise 안의 값 타입'],
                ['`NonNullable<T>`', '`null`·`undefined`를 뺀 타입'],
              ],
            },
            {
              type: 'code',
              code: `async function getCourse(id: number) {
  const res = await fetch(\`/api/courses/\${id}\`);
  return (await res.json()) as Course;
}

type R = ReturnType<typeof getCourse>;            // Promise<Course>
type C = Awaited<ReturnType<typeof getCourse>>;   // Course

// 7-5에서 봤던 것
type CartStore = ReturnType<typeof createCartStore>;`,
            },
            { type: 'say', text: '라이브러리 함수가 돌려주는 타입이 export 안 돼 있을 때 정말 유용해요. 직접 타입을 적지 않고 **함수에서 꺼내** 쓰면 함수가 바뀌어도 타입이 따라와요.' },
          ],
        },
      ],
    },
    {
      title: 'keyof·typeof·인덱스 접근',
      slides: [
        {
          title: '타입 세계의 연산자',
          blocks: [
            { type: 'say', text: '유틸리티 타입은 사실 이 연산자들로 만들어져 있어요. 읽을 줄 알아야 남의 코드와 라이브러리 타입이 보여요.' },
            {
              type: 'table',
              head: ['연산자', '뜻', '예 → 결과'],
              rows: [
                ['`keyof T`', 'T의 키 이름들의 유니언', "`keyof Course` → `'id' | 'title' | ...`"],
                ['`typeof 값`', '값에서 타입을 꺼냄 (타입 자리에서)', '`typeof config` → config 객체의 타입'],
                ['`T[K]`', 'T의 K 속성 타입', "`Course['price']` → `number`"],
              ],
            },
            {
              type: 'code',
              code: `function getField<K extends keyof Course>(course: Course, key: K): Course[K] {
  return course[key];
}
getField(c, 'price');    // number
getField(c, 'title');    // string
getField(c, 'prise');    // ❌ 오타를 잡아 줌`,
            },
          ],
        },
        {
          title: 'as const로 값에서 타입 만들기',
          blocks: [
            { type: 'say', text: '2-3의 enum 대안으로 본 `as const`를 이제 제대로 이해할 수 있어요.' },
            {
              type: 'code',
              code: `const STATUS = ['todo', 'doing', 'done'] as const;
// as const 없으면 string[], 있으면 readonly ['todo', 'doing', 'done']

type Status = (typeof STATUS)[number];   // 'todo' | 'doing' | 'done'

// 드롭다운은 값 배열로, 타입은 같은 배열에서 → 둘이 어긋날 일이 없음
<select>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>`,
            },
            { type: 'say', text: '`as const`는 "이 값은 절대 안 바뀌어, 글자 그대로 기억해"라는 뜻이에요. `typeof STATUS`로 배열 타입을 꺼내고, `[number]`로 "아무 칸의 타입"을 꺼내면 리터럴 유니언이 돼요. **값 목록 하나에서 화면과 타입을 동시에** 만드는 실무 패턴이에요.' },
          ],
        },
      ],
    },
    {
      title: 'satisfies',
      slides: [
        {
          title: '검사는 받되, 타입은 넓히지 않기',
          blocks: [
            { type: 'say', text: '설정 객체에 타입을 붙이는 두 방법을 비교해 볼게요.' },
            {
              type: 'code',
              code: `type Routes = Record<string, { path: string; auth: boolean }>;

// ① 타입 붙이기: 검사는 되지만 정확한 키 정보가 사라짐
const r1: Routes = { home: { path: '/', auth: false } };
r1.hoem;              // 에러 안 남 (Record<string, ...>이라 아무 키나 OK)

// ② satisfies: 검사는 받고, 원래 모양은 그대로 기억
const r2 = { home: { path: '/', auth: false } } satisfies Routes;
r2.hoem;              // ❌ 오타를 잡아 줌 (home만 있다는 걸 앎)`,
            },
            { type: 'say', text: '`satisfies`는 "이 값이 Routes 규칙을 **만족하는지만 검사**해 줘. 타입은 내가 쓴 그대로 두고"라는 뜻이에요. 설정·상수 객체에 정말 잘 맞아요.' },
            { type: 'note', tone: 'warn', text: '`as`(`const x = data as Course`)는 검사가 아니라 **"내 말 믿어"** 예요. 틀려도 TS가 아무 말 안 해요. 8-1의 타입 가드처럼 약속일 뿐이에요. 코드 리뷰에서 `as`가 보이면 "정말 확실한가?"를 따져요. `satisfies`는 반대로 진짜 검사를 해요.' },
            { type: 'say', text: '수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're08-2-q1',
      source: '타입을 복사하지 말고 만들어 쓰기',
      type: 'mcq',
      question: '강의를 만들 때 보낼 타입(id, createdAt은 서버가 만듦)으로 알맞은 것은?',
      choices: ['Partial<Course>', "Omit<Course, 'id' | 'createdAt'>", "Pick<Course, 'id'>", 'Required<Course>'],
      answer: 1,
      explanation: 'Omit은 고른 속성을 빼요. 수정처럼 일부만 보낼 땐 Partial, 몇 개만 고를 땐 Pick이에요.',
    },
    {
      id: 're08-2-q2',
      source: '타입을 복사하지 말고 만들어 쓰기',
      type: 'ox',
      question: "Record<'todo' | 'doing' | 'done', string> 타입 객체에서 done 키를 빠뜨리면 에러가 난다.",
      answer: true,
      explanation: 'Record는 지정한 키를 전부 요구해요. 상태별 라벨처럼 빠짐없이 채워야 하는 맵에 좋아요.',
    },
    {
      id: 're08-2-q3',
      source: '함수와 Promise에서 타입 꺼내기',
      type: 'mcq',
      question: 'async function getCourse(): Promise<Course> 의 결과 값 타입(Course)을 꺼내는 코드는?',
      choices: ['ReturnType<typeof getCourse>', 'Awaited<ReturnType<typeof getCourse>>', 'Parameters<typeof getCourse>', 'typeof Course'],
      answer: 1,
      explanation: 'ReturnType은 Promise<Course>예요. Awaited로 Promise를 벗기면 Course가 나와요.',
    },
    {
      id: 're08-2-q4',
      source: 'keyof·typeof·인덱스 접근',
      type: 'mcq',
      question: "interface Course { id: number; title: string } 일 때 keyof Course 는?",
      choices: ['number | string', "'id' | 'title'", 'Course[]', 'string'],
      answer: 1,
      explanation: 'keyof는 키 이름들의 유니언이에요. Course["id"]처럼 인덱스로 접근하면 그 속성의 타입(number)이 나와요.',
    },
    {
      id: 're08-2-q5',
      source: 'keyof·typeof·인덱스 접근',
      type: 'mcq',
      question: "const STATUS = ['todo', 'done'] as const; type S = (typeof STATUS)[number]; 에서 S는?",
      choices: ['string', "'todo' | 'done'", 'number', 'readonly string[]'],
      answer: 1,
      explanation: 'as const로 글자 그대로 기억하고, typeof로 배열 타입을, [number]로 칸의 타입을 꺼내면 리터럴 유니언이 돼요.',
    },
    {
      id: 're08-2-q6',
      source: 'satisfies',
      type: 'mcq',
      question: 'satisfies 연산자의 특징은?',
      choices: ['타입 검사를 끈다', '규칙을 만족하는지 검사하면서 값의 원래(좁은) 타입은 그대로 유지한다', '값을 런타임에 검사한다', 'as와 완전히 같다'],
      answer: 1,
      explanation: '타입을 붙이면 넓은 타입이 되어 정보가 사라지지만, satisfies는 검사만 하고 정확한 모양을 기억해요.',
    },
    {
      id: 're08-2-q7',
      source: 'satisfies',
      type: 'ox',
      question: 'const x = data as Course 는 data가 정말 Course 모양인지 TypeScript가 검사해 준다.',
      answer: false,
      explanation: 'as는 "내 말 믿어"라는 단언이라 검사하지 않아요. 틀려도 에러가 없어서 리뷰에서 조심해서 봐요.',
    },
  ],
}

export default topic

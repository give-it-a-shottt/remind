import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-08-5-zod-strict',
  track: 'react',
  group: '08. TypeScript 실전',
  title: '8-5. zod로 런타임 검증하기와 엄격한 설정',
  order: 805,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '타입은 실행할 때 사라져요',
      slides: [
        {
          title: '서버가 거짓말을 한다면',
          blocks: [
            { type: 'say', text: '8장 마지막 수업이에요. 2-3에서 "타입은 빌드할 때 전부 지워진다"고 했죠. 그게 이번 수업의 출발점이에요.' },
            {
              type: 'code',
              code: `const course = (await res.json()) as Course;   // "이건 Course야"라고 약속
course.price.toLocaleString();                  // 서버가 price를 null로 보내면? 💥`,
            },
            { type: 'say', text: 'TypeScript는 **코드를 쓰는 동안만** 검사해요. 서버 응답, 폼 입력, localStorage, URL 파라미터처럼 **실행 중에 밖에서 들어오는 값**은 TS가 확인할 방법이 없어요. 8-2에서 배운 `as`는 검사가 아니라 약속일 뿐이고요.\n\n백엔드가 필드 이름을 바꾸거나 null을 보내면, 타입은 멀쩡한데 화면이 터져요.' },
            { type: 'note', tone: 'analogy', text: 'TypeScript는 **공장 안 품질 검사**예요. 공장에서 만든 부품(내 코드)은 꼼꼼히 봐요. 그런데 **외부에서 납품받은 부품**(서버 응답)은 상자에 "정품"이라고 쓰여 있다고(as) 믿어 버려요. 납품 받는 입구에도 검사대가 필요해요. 그게 **zod**예요.' },
          ],
        },
      ],
    },
    {
      title: 'zod 기본',
      slides: [
        {
          title: '스키마 만들고 검사하기',
          blocks: [
            {
              type: 'code',
              code: `import { z } from 'zod';

const CourseSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()),
  instructor: z.object({ name: z.string(), email: z.email() }),
});

const data = CourseSchema.parse(await res.json());   // 모양이 틀리면 여기서 에러`,
            },
            {
              type: 'list',
              items: [
                '**스키마**: "이 데이터는 이런 모양이어야 해"라는 규칙을 코드로 적은 것',
                '`parse()`: 검사해서 맞으면 값을 돌려주고, **틀리면 에러를 던져요** (어느 필드가 왜 틀렸는지까지)',
                '타입과 달리 **실행 중에 진짜로** 검사해요',
              ],
            },
          ],
        },
        {
          title: '타입은 스키마에서 꺼내요',
          blocks: [
            { type: 'code', code: `type Course = z.infer<typeof CourseSchema>;
// { id: number; title: string; price: number; tags: string[]; instructor: {...} }` },
            { type: 'say', text: '`z.infer`로 스키마에서 **TypeScript 타입을 자동으로** 꺼내요. 이제 interface Course를 따로 적을 필요가 없어요. 스키마 하나가 **실행 중 검사**와 **코드 작성 중 타입**을 동시에 해요. 둘이 어긋날 일이 없죠. 8-2의 "적지 말고 꺼내 쓰기"의 완성판이에요.' },
            { type: 'note', tone: 'tip', text: '지금 쓰는 zod는 **4**버전이에요. 이메일 검사가 `z.string().email()`에서 `z.email()`로 바뀌는 등 v3와 조금 달라요. 블로그 예제를 볼 때 버전을 확인하세요.' },
          ],
        },
      ],
    },
    {
      title: '어디에 검사대를 둘까',
      slides: [
        {
          title: 'safeParse로 부드럽게',
          blocks: [
            { type: 'say', text: '`parse`는 틀리면 에러를 던져요. 폼처럼 "틀리면 메시지를 보여 줘야" 하는 곳에서는 **safeParse**가 편해요.' },
            {
              type: 'code',
              code: `const ReviewSchema = z.object({
  content: z.string().min(10, '10자 이상 써 주세요').max(1000),
  rating: z.coerce.number().int().min(1).max(5),   // 폼 값은 문자열이라 숫자로 변환
});

const result = ReviewSchema.safeParse(Object.fromEntries(formData));
if (!result.success) {
  return { error: result.error.issues[0].message };   // 에러를 던지지 않고 결과로
}
await db.review.create({ data: result.data });         // result.data는 검증된 값 + 타입`,
            },
          ],
        },
        {
          title: '검사대를 두는 곳',
          blocks: [
            {
              type: 'table',
              head: ['들어오는 곳', '왜 검사하나'],
              rows: [
                ['**서버 응답** (5-3 `api()` 안)', '백엔드가 바뀌어도 화면이 조용히 터지지 않게'],
                ['**Server Action 입력** (6-6)', '공개 API라 누구나 아무 값이나 보낼 수 있음 → 보안'],
                ['**폼 입력**', '사용자에게 틀린 곳을 알려 주려고 (React Hook Form + zod, 3-4)'],
                ['**환경변수**', '`DATABASE_URL`을 빠뜨리고 배포하면 시작하자마자 알 수 있게'],
                ['localStorage·URL 파라미터', '옛 버전이 저장한 값, 사용자가 고친 주소'],
              ],
            },
            { type: 'say', text: '규칙 한 줄: **"내 코드 밖에서 들어오는 값은 입구에서 zod로 검사하고, 안쪽에서는 타입을 믿는다."** 3-1에서 말한 "컴포넌트 props는 TypeScript, 외부 데이터는 zod"가 이 뜻이에요.' },
          ],
        },
      ],
    },
    {
      title: 'tsconfig 엄격 설정',
      slides: [
        {
          title: 'strict는 무조건 켜요',
          blocks: [
            { type: 'say', text: '마지막은 tsconfig예요. 같은 TypeScript라도 설정에 따라 잡아 주는 실수가 크게 달라요.' },
            {
              type: 'table',
              head: ['옵션', '잡아 주는 것'],
              rows: [
                ['`strict: true`', 'null 확인 누락(strictNullChecks), 타입 없는 파라미터(any 암시) 등 핵심 검사 묶음. **새 프로젝트는 무조건 켜요**'],
                ['`noUncheckedIndexedAccess`', '`arr[0]`이나 `record[key]`를 **undefined일 수도 있다**고 봐 줌'],
                ['`noUnusedLocals`, `noUnusedParameters`', '안 쓰는 변수·파라미터'],
                ['`erasableSyntaxOnly`', 'enum처럼 실제 코드를 만드는 TS 문법 금지 (2-3)'],
              ],
            },
          ],
        },
        {
          title: 'arr[0]은 정말 있을까',
          blocks: [
            {
              type: 'code',
              code: `const first = courses[0];
first.title;          // strict만 켜면: 에러 없음 → 빈 배열이면 런타임에 💥

// noUncheckedIndexedAccess를 켜면
const first = courses[0];   // Course | undefined
first?.title;               // ✅ 확인을 강제`,
            },
            { type: 'say', text: '빈 배열의 0번은 undefined인데, 기본 설정은 "있겠지" 하고 넘어가요. `noUncheckedIndexedAccess`를 켜면 확인을 강제해요. 처음엔 귀찮지만 실제 버그를 많이 잡아 줘요.' },
            { type: 'note', tone: 'tip', text: '이 앱(remind)의 `tsconfig.app.json`을 열어 보면 `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`가 켜져 있어요. Vite 템플릿이 기본으로 넣어 주는 설정이에요. 시니어 면접에서 "TypeScript 어떻게 쓰세요?"라고 물으면 "**strict + 외부 입력은 zod + 상태는 판별 유니온 + any 금지**" 네 가지를 말하면 정적 타입 기반 개발을 지향한다는 게 전해져요.\n\n8장 끝! 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're08-5-q1',
      source: '타입은 실행할 때 사라져요',
      type: 'ox',
      question: 'const course = (await res.json()) as Course 라고 쓰면 서버 응답이 Course 모양인지 실행 중에 검사된다.',
      answer: false,
      explanation: 'as는 약속일 뿐이고 타입은 빌드 때 사라져요. 실행 중 검사는 zod 같은 런타임 검증 도구로 해요.',
    },
    {
      id: 're08-5-q2',
      source: 'zod 기본',
      type: 'mcq',
      question: 'zod 스키마 CourseSchema에서 TypeScript 타입을 꺼내는 코드는?',
      choices: ['typeof CourseSchema', 'z.infer<typeof CourseSchema>', 'CourseSchema.type', 'ReturnType<CourseSchema>'],
      answer: 1,
      explanation: 'z.infer로 꺼내면 스키마 하나가 실행 중 검사와 타입을 동시에 해서 둘이 어긋나지 않아요.',
    },
    {
      id: 're08-5-q3',
      source: '어디에 검사대를 둘까',
      type: 'mcq',
      question: '폼 입력을 검사해서, 틀리면 에러를 던지지 않고 메시지를 보여 주고 싶다. 쓰는 메서드는?',
      choices: ['parse', 'safeParse', 'infer', 'as'],
      answer: 1,
      explanation: 'safeParse는 { success, data | error }를 돌려줘서 에러 메시지를 화면에 보여 주기 좋아요. parse는 틀리면 throw 해요.',
    },
    {
      id: 're08-5-q4',
      source: '어디에 검사대를 둘까',
      type: 'mcq',
      question: 'zod 검증이 가장 덜 필요한 곳은?',
      choices: ['서버 API 응답', 'Server Action으로 들어온 FormData', '내 코드 안에서 부모가 자식에게 넘기는 props', '환경변수'],
      answer: 2,
      explanation: '내 코드 안의 props는 TypeScript가 이미 검사해요. zod는 밖에서 들어오는 값의 입구에 둬요.',
    },
    {
      id: 're08-5-q5',
      source: 'tsconfig 엄격 설정',
      type: 'mcq',
      question: 'courses[0].title 처럼 배열 칸을 읽을 때 undefined일 수도 있다고 검사하게 하는 tsconfig 옵션은?',
      choices: ['strict', 'noUncheckedIndexedAccess', 'noUnusedLocals', 'erasableSyntaxOnly'],
      answer: 1,
      explanation: '기본 strict는 배열 인덱스 결과를 있다고 가정해요. noUncheckedIndexedAccess를 켜면 T | undefined로 봐요.',
    },
    {
      id: 're08-5-q6',
      source: 'tsconfig 엄격 설정',
      type: 'essay',
      question: '[면접] TypeScript로 "정적 타입 기반의 안정적인 개발"을 하려면 어떻게 하시나요?',
      answer: 'tsconfig에서 strict를 켜고, 필요하면 noUncheckedIndexedAccess 같은 옵션으로 검사를 더 엄격하게 합니다. any는 쓰지 않고, 모르는 값은 unknown으로 받아 좁혀서 씁니다. 상태는 불리언 여러 개 대신 판별 유니온으로 설계해 말이 안 되는 상태를 타입으로 만들 수 없게 하고, switch 끝에 never 검사를 둬 새 경우를 빠뜨리지 않게 합니다. 타입은 실행 중에 사라지므로 서버 응답·폼·Server Action 입력처럼 밖에서 들어오는 값은 zod로 검증하고, z.infer로 타입을 스키마에서 꺼내 검사와 타입이 어긋나지 않게 합니다.',
      keywords: ['strict', 'any 금지·unknown', '판별 유니온', 'never 검사', 'zod 런타임 검증', 'z.infer'],
      explanation: '설정(strict) → 코드 습관(unknown, 판별 유니온, never) → 경계(zod) 세 층으로 말하면 좋아요.',
    },
  ],
}

export default topic

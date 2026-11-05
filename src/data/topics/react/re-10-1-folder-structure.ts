import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-10-1-folder-structure',
  track: 'react',
  group: '10. 프론트엔드 아키텍처',
  title: '10-1. 폴더 구조와 경계',
  order: 1001,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '종류별 폴더의 한계',
      slides: [
        {
          title: 'components/ hooks/ utils/ 에 다 넣으면',
          blocks: [
            { type: 'say', text: '10장은 공고의 "**모노레포(pnpm, Turborepo 등) 환경**", "**Micro Frontend(Module Federation) 아키텍처**"예요. 둘 다 "큰 코드를 어떻게 나누나"에 대한 답이에요. 그 첫걸음인 **한 앱 안의 폴더 구조**부터 볼게요.\n\n처음엔 보통 이렇게 **종류별로** 나눠요.' },
            {
              type: 'code',
              code: `src/
├─ components/   ← CourseCard, ReviewForm, CartBadge, LoginForm ... 80개
├─ hooks/        ← useCourses, useCart, useAuth ... 30개
├─ api/          ← courses.ts, cart.ts, auth.ts
├─ stores/
└─ utils/`,
            },
            { type: 'ask', q: '"수강평" 기능을 고치려면 몇 개 폴더를 열어야 할까요?', a: 'components에서 ReviewForm·ReviewList, hooks에서 useReviews, api에서 reviews.ts, 타입 폴더에서 Review… **네다섯 군데를 왔다 갔다** 해야 해요. 앱이 커질수록 "이 파일이 어느 기능 거지?"를 알기 어려워지고, 기능 하나를 지우려 해도 흩어진 파일을 다 찾아야 해요.' },
          ],
        },
      ],
    },
    {
      title: '기능별 폴더',
      slides: [
        {
          title: '같이 바뀌는 것끼리 모으기',
          blocks: [
            { type: 'say', text: '그래서 커지면 **기능(feature)별로** 나눠요. 기준은 9-3의 청크와 같아요. "**같이 바뀌는 것끼리 모은다.**"' },
            {
              type: 'code',
              code: `src/
├─ app/                  ← 라우터, Provider, 전역 설정 (앱을 조립하는 곳)
├─ features/
│  ├─ course/            ← 강의 기능에 필요한 것 전부
│  │  ├─ CourseCard.tsx
│  │  ├─ useCourses.ts
│  │  ├─ api.ts
│  │  └─ types.ts
│  ├─ review/
│  └─ cart/
└─ shared/               ← 어느 기능에도 속하지 않는 공용 (Button, api client, 날짜 포맷)
   ├─ ui/
   └─ lib/`,
            },
            { type: 'say', text: '이제 수강평을 고치려면 `features/review/` **하나만** 열면 돼요. 기능을 통째로 지우거나 다른 팀에 넘기기도 쉬워요. 4-1의 "책임이 하나인가"를 폴더 단위로 적용한 거예요.' },
          ],
        },
      ],
    },
    {
      title: 'import 방향 규칙',
      slides: [
        {
          title: '아래로만 흐르게',
          blocks: [
            { type: 'say', text: '1-2에서 "import는 한 방향으로"라고 했죠. 기능별 구조에서는 이 규칙이 더 중요해요.' },
            {
              type: 'code',
              code: `app  →  features  →  shared
 ✅        ✅
(위층은 아래층을 import 할 수 있음)

shared → features   ❌  (공용 Button이 강의 기능을 알면 안 됨)
features/cart → features/course   ⚠️ 기능끼리 직접 import 는 최소화`,
            },
            { type: 'ask', q: '장바구니(cart) 기능이 강의 카드(course)를 보여 줘야 해요. cart에서 course를 바로 import 하면 무슨 문제가 생길까요?', a: '기능끼리 서로 import 하다 보면 course → cart → course처럼 **순환 의존**(1-2)이 생기기 쉽고, course를 고쳤는데 cart가 깨지는 일이 생겨요.\n보통은 ① 두 기능을 **조립하는 위층**(app이나 페이지)에서 합치거나, ② 정말 공용이면 **shared로** 내리거나, ③ 그 기능이 공개한 것(다음 슬라이드)만 쓰게 해요.' },
          ],
        },
        {
          title: '기능의 공개 출입구',
          blocks: [
            { type: 'code', code: `// features/course/index.ts — 이 기능이 밖에 공개하는 것만
export { CourseCard } from './CourseCard';
export { useCourses } from './useCourses';
export type { Course } from './types';
// api.ts 안의 내부 함수는 공개하지 않음

// 다른 곳에서는
import { CourseCard } from '@/features/course';           // ✅ 출입구로
import { fetchRaw } from '@/features/course/api';         // ❌ 내부를 직접` },
            { type: 'say', text: '1-2에서 "배럴 파일 주의"라고 했는데, 여기서 쓰는 건 다르게 봐야 해요. 모든 컴포넌트를 다 내보내는 거대한 배럴이 아니라, **기능 하나의 공개 출입구**를 작게 만드는 거예요. 내부 구조를 바꿔도 출입구만 그대로면 밖은 안 깨져요.' },
            { type: 'note', tone: 'tip', text: '이런 규칙은 사람 기억에 맡기면 깨져요. ESLint의 import 제한 규칙(`no-restricted-imports`, `eslint-plugin-boundaries` 등)으로 **자동 검사**해요. 이렇게 층과 규칙을 표준화한 방법론으로 **FSD(Feature-Sliced Design)** 가 있어요. 처음부터 다 따를 필요는 없고 "층 + 한 방향 + 공개 출입구" 세 가지만 지켜도 충분해요.' },
          ],
        },
      ],
    },
    {
      title: '언제 구조를 바꿀까',
      slides: [
        {
          title: '처음부터 거대한 구조는 필요 없어요',
          blocks: [
            {
              type: 'table',
              head: ['규모', '추천'],
              rows: [
                ['작은 앱, 혼자 (이 복습 앱 정도)', '종류별 폴더로 충분 (components, pages, lib)'],
                ['기능 10개 이상, 여러 명', '**기능별 폴더** + import 방향 규칙'],
                ['여러 앱이 코드를 공유 (웹·관리자·모바일 웹)', '**모노레포** (10-2, 10-3)'],
                ['여러 팀이 한 화면의 다른 부분을 **따로 배포**', '**Micro Frontend** (10-4)'],
              ],
            },
            { type: 'say', text: '시니어의 감각은 "**지금 규모에 맞는 만큼만**"이에요. 처음부터 모노레포와 Micro Frontend를 들이면 설정만 늘고 아무도 못 알아봐요. 반대로 커졌는데 구조를 안 바꾸면 모두가 서로의 코드를 깨뜨려요. 이 장의 나머지 수업은 "커졌을 때 다음 단계"예요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're10-1-q1',
      source: '종류별 폴더의 한계',
      type: 'ox',
      question: 'components/, hooks/, api/ 처럼 종류별로만 나누면 앱이 커질수록 기능 하나를 고칠 때 여러 폴더를 오가야 한다.',
      answer: true,
      explanation: '한 기능의 파일이 종류별 폴더에 흩어져서 찾기·지우기·넘기기가 어려워져요.',
    },
    {
      id: 're10-1-q2',
      source: '기능별 폴더',
      type: 'mcq',
      question: '기능별(feature) 폴더 구조의 기준으로 가장 알맞은 것은?',
      choices: ['파일 확장자가 같은 것끼리', '같이 바뀌는 것끼리 모은다', '파일 크기순', '만든 날짜순'],
      answer: 1,
      explanation: '기능 하나를 고칠 때 한 폴더만 열면 되게, 같이 바뀌는 컴포넌트·훅·API·타입을 모아요.',
    },
    {
      id: 're10-1-q3',
      source: 'import 방향 규칙',
      type: 'mcq',
      question: 'app → features → shared 구조에서 허용되지 않는 import는?',
      choices: ['app이 features를 import', 'features가 shared를 import', 'shared의 Button이 features/course를 import', 'app이 shared를 import'],
      answer: 2,
      explanation: '아래층(shared)이 위층(features)을 알면 안 돼요. 방향이 거꾸로면 순환 의존과 연쇄 고장이 생겨요.',
    },
    {
      id: 're10-1-q4',
      source: 'import 방향 규칙',
      type: 'mcq',
      question: 'features/course/index.ts 에 공개할 것만 export 해 두는 목적은?',
      choices: ['번들을 크게 하려고', '기능의 공개 출입구를 정해, 내부 구조를 바꿔도 밖이 깨지지 않게 하려고', 'CSS를 나누려고', '타입 검사를 끄려고'],
      answer: 1,
      explanation: '밖에서는 출입구로만 들어오게 해서 기능 내부를 자유롭게 바꿀 수 있어요. 규칙은 ESLint로 자동 검사해요.',
    },
    {
      id: 're10-1-q5',
      source: '언제 구조를 바꿀까',
      type: 'ox',
      question: '작은 개인 프로젝트도 처음부터 모노레포와 Micro Frontend로 시작하는 것이 좋다.',
      answer: false,
      explanation: '규모에 맞는 만큼만 들여요. 작은 앱에 큰 구조를 넣으면 설정과 복잡도만 늘어요.',
    },
  ],
}

export default topic

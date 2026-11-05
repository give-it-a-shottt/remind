import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-11-5-errors-wrapup',
  track: 'react',
  group: '11. 품질: 접근성·테스트·성능',
  title: '11-5. 에러 처리·모니터링과 전체 정리',
  order: 1105,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '에러는 반드시 나요',
      slides: [
        {
          title: '하얀 화면 대신',
          blocks: [
            { type: 'say', text: 'React 수업의 진짜 마지막 수업이에요!\n\n아무리 테스트해도 배포하면 에러는 나요. 서버가 죽기도 하고, 사용자가 상상도 못 한 데이터를 넣기도 하고요. 중요한 건 **에러가 났을 때 무엇이 보이느냐**예요.\n\n렌더링 중에 에러가 나면 React는 기본적으로 **화면 전체를 지워 버려요.** 하얀 화면이죠. 사용자는 앱이 고장 났다고 생각하고 떠나요.' },
            {
              type: 'table',
              head: ['에러 종류', '잡는 곳'],
              rows: [
                ['렌더링 중 에러 (undefined.title 등)', '**에러 바운더리** (4-1, Next.js `error.tsx`)'],
                ['이벤트 핸들러 안의 에러', 'try/catch (에러 바운더리는 이벤트 에러를 못 잡아요)'],
                ['서버 요청 실패', 'TanStack Query의 isError, Server Action의 결과 처리'],
                ['예상 못 한 전역 에러', '`window.onerror`, 모니터링 도구'],
              ],
            },
          ],
        },
        {
          title: '에러 바운더리를 겹겹이',
          blocks: [
            {
              type: 'code',
              code: `// react-error-boundary 라이브러리 예
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<FullPageError />}>            // 앱 전체: 최후의 방어선
  <Header />
  <ErrorBoundary fallback={<p>추천 강의를 불러오지 못했어요</p>}>   // 부분: 여기만 실패
    <Recommended />
  </ErrorBoundary>
  <CourseDetail />
</ErrorBoundary>`,
            },
            { type: 'say', text: '에러 바운더리를 **구역마다** 두면, 추천 강의가 터져도 그 칸만 "불러오지 못했어요"로 바뀌고 **나머지 페이지는 멀쩡해요.** 6-5의 Suspense가 "로딩"의 경계라면, 에러 바운더리는 "실패"의 경계예요. 둘을 짝으로 써요. 10-4의 remote 위젯도 이렇게 감쌌죠.' },
            { type: 'note', tone: 'tip', text: '좋은 에러 화면에는 ① 무슨 일이 생겼는지 사람 말로 ② **다시 시도** 버튼 ③ 홈으로 가는 길이 있어요. "Error: Cannot read properties of undefined" 같은 개발자용 메시지를 그대로 보여 주지 마세요.' },
          ],
        },
      ],
    },
    {
      title: '모니터링: 사용자보다 먼저 알기',
      slides: [
        {
          title: '사용자는 에러를 알려 주지 않아요',
          blocks: [
            { type: 'say', text: '에러를 겪은 사용자 100명 중 신고하는 사람은 거의 없어요. 그냥 떠나죠. 그래서 **에러 모니터링 도구**로 배포된 앱의 에러를 자동으로 모아요. 대표적인 게 **Sentry**예요.' },
            {
              type: 'list',
              items: [
                '에러가 나면 **어떤 브라우저, 어떤 페이지, 어떤 사용자 행동 뒤에** 났는지 자동 기록',
                '9-4의 **소스맵**을 올려 두면 압축 코드가 아니라 **원래 파일·줄**로 보여 줌',
                '같은 에러를 묶어서 "이 에러가 오늘 300명에게 났다"처럼 **우선순위**를 알려 줌',
                '새 배포 뒤에 에러가 갑자기 늘면 알림 → 빠르게 되돌리기',
              ],
            },
            { type: 'note', tone: 'warn', text: '에러 기록에 **비밀번호, 토큰, 개인정보**가 들어가지 않게 조심해요. 모니터링 도구는 보통 민감한 값을 가리는 설정이 있어요. 6-4의 "비밀은 서버에만"이 로그에도 적용돼요.' },
          ],
        },
      ],
    },
    {
      title: 'React 수업 전체 정리',
      slides: [
        {
          title: '11장 동안 배운 것',
          blocks: [
            { type: 'say', text: '정말 수고 많았어요. 지금까지 배운 걸 한 장에 모아 볼게요.' },
            {
              type: 'table',
              head: ['장', '한 줄'],
              rows: [
                ['1~2', '화면은 상태의 결과, 모듈과 번들러, 모던 JS·TS, JSX 규칙, props와 key'],
                ['3~4', '상태의 위치와 불변성, 스타일링, 이벤트·폼, 훅과 생명주기, Context'],
                ['5', '라우터, 서버 통신, CORS, Redux Toolkit'],
                ['6', 'CSR·SSR·SSG·ISR, 하이드레이션, App Router, 서버 컴포넌트, 캐시, Server Actions'],
                ['7', '서버 상태(TanStack Query)와 클라이언트 상태(Zustand)'],
                ['8', '판별 유니온·유틸리티 타입·제네릭·zod로 타입 안정성'],
                ['9', 'Vite·webpack 설정, 번들 크기, 소스맵, 빌드 에러'],
                ['10', '폴더 구조, 모노레포·Turborepo, Micro Frontend'],
                ['11', '시맨틱 HTML·접근성, 테스트, Core Web Vitals, 에러 처리'],
              ],
            },
          ],
        },
        {
          title: '처음 목표였던 채용 공고와 맞춰 보기',
          blocks: [
            {
              type: 'table',
              head: ['공고 문구', '배운 곳'],
              rows: [
                ['SSR, CSR에 대한 기본적인 이해', '6-1, 6-2'],
                ['TypeScript, 정적 타입 기반의 안정적인 개발', '2-3, 8장 전체'],
                ['Next.js 기반 SSR/SSG 프로젝트 경험', '6장 전체'],
                ['모노레포(pnpm, Turborepo)', '10-2, 10-3'],
                ['Micro Frontend(Module Federation)', '10-4'],
                ['TanStack Query 등 서버 상태 관리', '7-1 ~ 7-3, 7-6'],
                ['Webpack, Vite 번들러 구성·빌드 문제 해결', '1-2, 9장 전체'],
                ['웹표준, 웹접근성', '11-1, 11-2'],
                ['Zustand', '7-4, 7-5'],
              ],
            },
            { type: 'say', text: '이제 할 일은 **직접 만들어 보는 것**이에요. 풀스택 코스에서 Next.js + FastAPI로 미니 인프런을 만들면서 오늘 배운 걸 하나씩 써 보세요. 그리고 고친 문제마다 **"무엇을, 왜, 어떻게, 숫자로"** 기록하세요. 그게 면접에서 "경험 있으신 분"이 되는 방법이에요.\n\n마지막 확인 문제 가요. 정말 고생했어요! 🎉' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're11-5-q1',
      source: '에러는 반드시 나요',
      type: 'mcq',
      question: '에러 바운더리가 잡지 못하는 에러는?',
      choices: ['렌더링 중 undefined 접근 에러', 'onClick 이벤트 핸들러 안에서 던진 에러', '자식 컴포넌트 렌더링 에러', '하위 트리 렌더링 에러'],
      answer: 1,
      explanation: '에러 바운더리는 렌더링 중 에러를 잡아요. 이벤트 핸들러 안의 에러는 try/catch로 직접 처리해요.',
    },
    {
      id: 're11-5-q2',
      source: '에러는 반드시 나요',
      type: 'ox',
      question: '에러 바운더리를 구역마다 두면 한 구역이 실패해도 나머지 페이지는 정상으로 보일 수 있다.',
      answer: true,
      explanation: 'Suspense가 로딩의 경계라면 에러 바운더리는 실패의 경계예요. 둘을 짝으로 써요.',
    },
    {
      id: 're11-5-q3',
      source: '모니터링: 사용자보다 먼저 알기',
      type: 'mcq',
      question: 'Sentry 같은 에러 모니터링 도구에 소스맵을 올려 두는 이유는?',
      choices: ['번들을 줄이려고', '압축된 코드 위치 대신 원래 파일·줄로 에러를 보여 주려고', '사용자에게 소스를 보여 주려고', '테스트를 대신하려고'],
      answer: 1,
      explanation: '9-4처럼 hidden 소스맵을 도구에만 올리면 사용자는 못 받고, 개발자는 원래 위치를 봐요.',
    },
    {
      id: 're11-5-q4',
      source: '모니터링: 사용자보다 먼저 알기',
      type: 'ox',
      question: '에러 로그에 사용자의 토큰과 비밀번호를 함께 남겨 두면 디버깅에 도움이 되므로 권장된다.',
      answer: false,
      explanation: '민감 정보는 로그에 남기지 않아요. 모니터링 도구의 가리기 설정을 써요.',
    },
    {
      id: 're11-5-q5',
      source: 'React 수업 전체 정리',
      type: 'essay',
      question: '[면접] 자기소개처럼, React 시니어로서 가장 중요하게 생각하는 원칙 세 가지를 이유와 함께 말해 주세요.',
      answer: '첫째, 상태는 종류에 맞는 집에 둡니다. 계산할 수 있으면 상태로 두지 않고, 혼자 쓰면 useState, 유지돼야 하는 화면 상태는 URL, 서버 데이터는 TanStack Query나 서버 컴포넌트, 공유 클라이언트 상태는 Zustand에 둬서 데이터가 한 곳에만 있게 합니다. 둘째, 타입과 경계로 버그를 미리 막습니다. strict와 판별 유니온으로 말이 안 되는 상태를 못 만들게 하고, 외부 입력은 zod로 검증합니다. 셋째, 측정한 뒤 개선합니다. 번들 분석과 Core Web Vitals, CI 시간 같은 숫자를 먼저 보고 하나씩 고친 뒤 다시 측정해 기록합니다. 여기에 시맨틱 HTML과 접근성을 기본으로 두면 테스트하기도 쉬워집니다.',
      keywords: ['상태의 집', '데이터는 한 곳에', '타입·zod로 경계', '측정 후 개선', '접근성'],
      explanation: '정답은 없어요. 이 수업 전체에서 반복된 원칙(상태의 집, 타입 경계, 측정 후 개선, 접근성)을 자기 말과 경험으로 묶으면 돼요.',
    },
  ],
}

export default topic

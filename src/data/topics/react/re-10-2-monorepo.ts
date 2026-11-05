import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-10-2-monorepo',
  track: 'react',
  group: '10. 프론트엔드 아키텍처',
  title: '10-2. 모노레포와 pnpm workspace',
  order: 1002,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '모노레포란',
      slides: [
        {
          title: '여러 앱이 같은 코드를 쓸 때',
          blocks: [
            { type: 'say', text: '회사에 앱이 세 개 있어요. 사용자 웹, 관리자 웹, 강사용 웹. 셋 다 **같은 Button, 같은 날짜 포맷, 같은 API 타입**을 써요.' },
            { type: 'ask', q: '세 앱이 각자 다른 저장소(repo)에 있다면, 공용 Button의 버그를 고칠 때 무슨 일을 해야 할까요?', a: '① Button 저장소에서 고치고 ② npm 패키지로 새 버전을 배포하고 ③ 세 앱 저장소에서 각각 버전을 올리고 ④ 각각 테스트·배포… 버그 하나에 저장소 4개를 오가요. 누군가는 버전 올리는 걸 까먹어서 앱마다 Button 모양이 달라지고요.' },
            { type: 'say', text: '**모노레포(monorepo)** 는 여러 앱과 공용 패키지를 **한 저장소**에 두는 방식이에요. 반대로 따로 두는 건 폴리레포(polyrepo)라고 해요.' },
          ],
        },
        {
          title: '모노레포의 모양',
          blocks: [
            {
              type: 'code',
              code: `my-company/
├─ apps/
│  ├─ web/          ← 사용자 웹 (Next.js)
│  ├─ admin/        ← 관리자 웹 (Vite)
│  └─ instructor/
├─ packages/
│  ├─ ui/           ← 공용 Button, Card ... (디자인 시스템)
│  ├─ api-types/    ← 백엔드와 맞춘 타입, zod 스키마 (8-5)
│  └─ config/       ← 공용 tsconfig, ESLint 설정
├─ package.json
└─ pnpm-workspace.yaml`,
            },
            {
              type: 'table',
              head: ['모노레포 장점', '모노레포 단점'],
              rows: [
                ['Button을 고치면 세 앱에 **한 커밋으로** 바로 반영', '저장소가 커서 설치·빌드가 느려질 수 있음 → 10-3 Turborepo'],
                ['앱과 패키지를 **함께 테스트**하고 리뷰', '권한을 저장소 단위로 나누기 어려움'],
                ['설정(tsconfig, ESLint)을 한 곳에서 통일', '도구(workspace, 빌드 순서)를 알아야 함'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'pnpm workspace',
      slides: [
        {
          title: '패키지끼리 연결하기',
          blocks: [
            { type: 'say', text: '모노레포에서 `apps/web`이 `packages/ui`를 쓰려면, npm에 배포하지 않고도 **저장소 안의 패키지를 바로 연결**해야 해요. 이걸 해 주는 게 **workspace** 기능이에요. pnpm이 가장 많이 쓰여요.' },
            { type: 'code', code: `# pnpm-workspace.yaml (저장소 맨 위)
packages:
  - 'apps/*'
  - 'packages/*'` },
            {
              type: 'code',
              code: `// packages/ui/package.json
{ "name": "@acme/ui", "version": "0.0.0", "exports": { ".": "./src/index.ts" } }

// apps/web/package.json
{
  "dependencies": {
    "@acme/ui": "workspace:*"      ← "저장소 안의 그 패키지를 써"
  }
}

// apps/web 코드에서는 일반 패키지처럼
import { Button } from '@acme/ui';`,
            },
            { type: 'say', text: '`workspace:*`는 "npm에서 받지 말고 **이 저장소의 @acme/ui 폴더를 연결**해 줘"라는 뜻이에요. ui를 고치면 web에 **즉시** 반영돼요. 배포·버전 올리기가 필요 없어요.' },
          ],
        },
        {
          title: '자주 쓰는 명령',
          blocks: [
            {
              type: 'table',
              head: ['명령', '뜻'],
              rows: [
                ['`pnpm install`', '저장소 맨 위에서 한 번 → 모든 앱·패키지 설치'],
                ['`pnpm --filter web dev`', 'web 앱만 개발 서버 실행'],
                ['`pnpm --filter @acme/ui add clsx`', 'ui 패키지에만 의존성 추가'],
                ['`pnpm -r build`', '모든 패키지에서 build 스크립트 실행 (recursive)'],
              ],
            },
            { type: 'note', tone: 'tip', text: '1-3에서 "npm, pnpm, yarn은 명령 모양만 다르고 개념은 같다"고 했죠. 모노레포에서는 pnpm이 특히 인기예요. 이유가 다음 개념이에요.' },
          ],
        },
      ],
    },
    {
      title: 'pnpm이 모노레포에서 인기인 이유',
      slides: [
        {
          title: '유령 의존성',
          blocks: [
            { type: 'say', text: 'npm은 설치한 패키지와 **그 패키지가 쓰는 패키지까지** `node_modules` 맨 위에 평평하게 풀어 놔요. 그래서 이런 일이 생겨요.' },
            {
              type: 'code',
              code: `// package.json 에는 react-router만 설치했는데
import something from 'some-lib';   // react-router가 내부에서 쓰는 패키지
// npm에선 됨 (우연히 맨 위에 풀려 있어서) → 나중에 react-router를 올리면 갑자기 깨짐`,
            },
            { type: 'say', text: 'package.json에 적지도 않은 패키지가 **우연히** import 되는 걸 **유령 의존성(phantom dependency)** 이라고 해요. 패키지가 수십 개인 모노레포에서는 "어느 앱이 진짜 뭘 쓰는지"가 엉망이 돼요.' },
          ],
        },
        {
          title: 'pnpm은 엄격하고 빨라요',
          blocks: [
            {
              type: 'list',
              items: [
                '**엄격함**: 각 패키지는 자기 package.json에 **적은 것만** import 할 수 있어요. 유령 의존성이 바로 에러로 드러나요',
                '**디스크 절약**: 같은 버전의 패키지는 컴퓨터에 **한 번만** 저장하고 링크로 연결해요. 앱이 10개여도 react는 한 벌',
                '**빠름**: 이미 받아 둔 건 링크만 걸어서 설치가 빨라요',
              ],
            },
            { type: 'note', tone: 'warn', text: 'npm 프로젝트를 pnpm으로 옮기면 "모듈을 찾을 수 없다" 에러가 우르르 날 수 있어요. 대부분 **원래 숨어 있던 유령 의존성**이 드러난 거예요. 고장이 아니라 발견이에요. 빠진 패키지를 package.json에 제대로 적어 주면 돼요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're10-2-q1',
      source: '모노레포란',
      type: 'mcq',
      question: '모노레포(monorepo)란?',
      choices: ['앱 하나만 있는 저장소', '여러 앱과 공용 패키지를 한 저장소에서 관리하는 방식', '모바일 전용 저장소', '백엔드만 있는 저장소'],
      answer: 1,
      explanation: '공용 코드를 고치면 여러 앱에 한 커밋으로 반영할 수 있어요. 따로 두는 방식은 폴리레포예요.',
    },
    {
      id: 're10-2-q2',
      source: '모노레포란',
      type: 'ox',
      question: '모노레포에서는 공용 Button을 고친 뒤 npm에 새 버전을 배포하고 각 앱에서 버전을 올려야 반영된다.',
      answer: false,
      explanation: 'workspace로 연결돼 있어서 같은 저장소 안에서 고치면 앱에 바로 반영돼요.',
    },
    {
      id: 're10-2-q3',
      source: 'pnpm workspace',
      type: 'short',
      question: 'apps/web의 package.json에서 저장소 안의 @acme/ui 패키지를 연결할 때 버전 자리에 쓰는 값은? ("@acme/ui": "________")',
      answer: ['workspace:*', 'workspace'],
      explanation: 'workspace:*는 npm에서 받지 말고 저장소 안의 그 패키지를 링크하라는 뜻이에요.',
    },
    {
      id: 're10-2-q4',
      source: 'pnpm workspace',
      type: 'mcq',
      question: '모노레포에서 web 앱의 개발 서버만 실행하는 pnpm 명령은?',
      choices: ['pnpm dev', 'pnpm --filter web dev', 'pnpm -g dev', 'npx web'],
      answer: 1,
      explanation: '--filter로 대상 패키지를 골라 실행해요. 모든 패키지에서 실행하려면 -r(recursive)을 써요.',
    },
    {
      id: 're10-2-q5',
      source: 'pnpm이 모노레포에서 인기인 이유',
      type: 'mcq',
      question: '유령 의존성(phantom dependency)이란?',
      choices: ['설치했지만 안 쓰는 패키지', 'package.json에 적지 않았는데 다른 패키지의 의존성이 우연히 풀려 있어서 import 되는 패키지', '삭제된 패키지', '보안 취약점이 있는 패키지'],
      answer: 1,
      explanation: '적지 않은 걸 우연히 쓰다가 다른 패키지를 올리면 갑자기 깨져요. pnpm은 적은 것만 import 하게 해서 막아요.',
    },
    {
      id: 're10-2-q6',
      source: 'pnpm이 모노레포에서 인기인 이유',
      type: 'ox',
      question: 'npm 프로젝트를 pnpm으로 옮겼더니 모듈을 찾을 수 없다는 에러가 났다면, 숨어 있던 유령 의존성이 드러난 경우가 많다.',
      answer: true,
      explanation: '빠진 패키지를 package.json에 제대로 적으면 해결돼요. 고장이 아니라 발견이에요.',
    },
  ],
}

export default topic

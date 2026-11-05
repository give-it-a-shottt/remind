import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-10-3-turborepo',
  track: 'react',
  group: '10. 프론트엔드 아키텍처',
  title: '10-3. Turborepo: 빌드 순서와 캐시',
  order: 1003,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '모노레포 빌드의 두 가지 문제',
      slides: [
        {
          title: '순서와 시간',
          blocks: [
            { type: 'say', text: '10-2에서 앱 3개와 패키지 3개를 한 저장소에 모았어요. 이제 전부 빌드해야 해요. 두 가지 문제가 생겨요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**순서**: `apps/web`을 빌드하려면 `packages/ui`가 **먼저** 빌드돼 있어야 해요. 사람이 순서를 기억해서 하나씩 돌려야 할까요?',
                '**시간**: 관리자 웹 글자 하나 고쳤는데 앱 3개 + 패키지 3개를 **전부 다시** 빌드? CI가 매번 20분씩 걸려요',
              ],
            },
            { type: 'say', text: '**Turborepo**는 이 두 문제를 푸는 **모노레포용 작업 실행기**예요. 비슷한 도구로 Nx가 있어요. 공고에 "pnpm, Turborepo 등"이라고 묶여 나오는 이유예요. pnpm이 **설치와 연결**을, Turborepo가 **빌드·테스트 실행**을 맡아요.' },
          ],
        },
      ],
    },
    {
      title: 'turbo.json과 작업 그래프',
      slides: [
        {
          title: '작업 사이의 관계 적기',
          blocks: [
            {
              type: 'code',
              code: `// turbo.json (저장소 맨 위)
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],              // 내가 의존하는 패키지들의 build를 먼저
      "outputs": ["dist/**", ".next/**"]    // 이 결과물을 캐시해 둬
    },
    "lint": {},                              // 서로 상관없이 병렬로
    "test": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true }   // 개발 서버는 캐시 안 함, 계속 떠 있음
  }
}`,
            },
            { type: 'say', text: '핵심은 `"dependsOn": ["^build"]`예요. **`^`는 "내가 의존하는 패키지들"** 이에요. web의 package.json에 `@acme/ui`가 있으니, web을 빌드하기 전에 ui의 build를 자동으로 먼저 해요.' },
          ],
        },
        {
          title: '알아서 순서를 정하고 동시에 돌려요',
          blocks: [
            { type: 'code', code: `turbo run build

1단계 (동시에)
  config, api-types
2단계 (동시에)
  ui          ← config·api-types 다음
  instructor  ← api-types만 끝나면
3단계 (동시에)
  web, admin  ← ui 다음`, caption: '서로 상관없는 건 동시에, 의존하는 건 순서대로' },
            { type: 'say', text: 'Turborepo는 각 package.json의 의존 관계를 읽어서 **작업 그래프**를 만들어요. 1-2의 의존성 그래프를 패키지 단위로 그린 거예요. 그리고 **순서가 필요한 것만 기다리고, 나머지는 동시에** 돌려요. 2-2의 Promise.all과 같은 아이디어예요.' },
          ],
        },
      ],
    },
    {
      title: '캐시: 이미 한 일은 다시 안 하기',
      slides: [
        {
          title: '입력이 같으면 결과도 같다',
          blocks: [
            { type: 'say', text: 'Turborepo의 진짜 힘은 **캐시**예요. 각 작업마다 **입력(소스 파일, 의존성, 환경변수, 설정)** 의 지문(해시)을 계산해요. 입력이 지난번과 같으면 빌드하지 않고 **저장해 둔 결과(outputs)를 꺼내** 써요.' },
            { type: 'code', code: `$ turbo run build     # 관리자 웹만 고친 뒤
• packages/ui:build      cache hit, replaying logs   ← 안 바뀜, 0.1초
• apps/web:build         cache hit, replaying logs   ← 안 바뀜
• apps/admin:build       cache miss, executing       ← 바뀐 것만 진짜 빌드

 Tasks:    3 successful, 3 total
Cached:    2 cached, 3 total` },
            { type: 'note', tone: 'analogy', text: '수학 숙제에서 같은 문제가 또 나오면 메모해 둔 답을 쓰죠(4-4 메모이제이션). Turborepo는 **빌드 전체를 메모이제이션**하는 거예요. 9-1의 파일명 해시, 4-4의 useMemo deps와 같은 원리예요. "재료가 같으면 결과도 같다."' },
          ],
        },
        {
          title: '원격 캐시',
          blocks: [
            { type: 'say', text: '캐시는 기본적으로 내 컴퓨터에 저장돼요. **원격 캐시**를 켜면 팀 전체와 CI가 캐시를 **공유**해요. 동료가 이미 빌드한 결과를 내 컴퓨터와 CI가 그대로 받아 써요.' },
            { type: 'ask', q: 'turbo.json의 outputs를 실제 빌드 폴더와 다르게 적으면 무슨 일이 생길까요?', a: '캐시에 **엉뚱한 폴더**(혹은 빈 폴더)가 저장돼요. 다음에 cache hit가 나면 Turborepo는 "빌드했다"고 하는데 실제 결과물이 없어서, 배포했더니 빈 화면이 되는 사고가 나요. outputs는 Vite면 `dist/**`, Next.js면 `.next/**`처럼 **정확히** 적어요. 반대로 캐시에 영향을 주는 환경변수를 Turborepo에 안 알려 주면, 값이 바뀌어도 옛 결과를 써요.' },
          ],
        },
      ],
    },
    {
      title: '바뀐 것만 돌리기',
      slides: [
        {
          title: 'filter와 affected',
          blocks: [
            {
              type: 'table',
              head: ['명령', '뜻'],
              rows: [
                ['`turbo run build`', '전부 (캐시로 바뀐 것만 진짜 실행)'],
                ['`turbo run build --filter=web`', 'web만 (필요한 의존 패키지 build는 자동으로 먼저)'],
                ['`turbo run test --affected`', '**main 브랜치 대비 바뀐** 패키지와 그걸 쓰는 패키지만'],
                ['`turbo run dev --filter=admin`', '관리자 웹 개발 서버만'],
              ],
            },
            { type: 'say', text: 'PR에서 ui 패키지만 고쳤다면 `--affected`는 ui와 **ui를 쓰는 앱들**만 테스트해요. 상관없는 패키지는 건드리지 않아요. CI 시간이 20분에서 2분이 되는 마법의 정체예요.' },
            { type: 'note', tone: 'tip', text: '면접에서 모노레포 경험을 말할 때 숫자가 강해요. "Turborepo 캐시와 affected 빌드로 CI 시간을 평균 18분에서 4분으로 줄였다." 9-3에서 말한 "분석 → 개선 → 숫자로 확인"이 여기서도 통해요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're10-3-q1',
      source: '모노레포 빌드의 두 가지 문제',
      type: 'mcq',
      question: '모노레포에서 pnpm workspace와 Turborepo의 역할 분담으로 옳은 것은?',
      choices: ['둘 다 같은 일을 한다', 'pnpm은 설치와 패키지 연결, Turborepo는 빌드·테스트 작업 실행(순서·캐시)', 'Turborepo가 설치, pnpm이 빌드', '둘 다 배포 도구다'],
      answer: 1,
      explanation: 'pnpm이 패키지를 깔고 workspace로 연결하면, Turborepo가 작업 순서를 정하고 캐시해요.',
    },
    {
      id: 're10-3-q2',
      source: 'turbo.json과 작업 그래프',
      type: 'mcq',
      question: 'turbo.json의 "dependsOn": ["^build"] 에서 ^가 뜻하는 것은?',
      choices: ['같은 패키지의 다른 작업', '내가 의존하는 패키지들의 build를 먼저 실행', '모든 패키지를 동시에', '캐시 끄기'],
      answer: 1,
      explanation: '^는 의존 패키지들이에요. web이 ui를 쓰면 ui의 build가 먼저 돌아요.',
    },
    {
      id: 're10-3-q3',
      source: 'turbo.json과 작업 그래프',
      type: 'ox',
      question: 'Turborepo는 서로 의존하지 않는 패키지의 작업을 동시에 실행할 수 있다.',
      answer: true,
      explanation: '작업 그래프에서 순서가 필요한 것만 기다리고 나머지는 병렬로 돌려요.',
    },
    {
      id: 're10-3-q4',
      source: '캐시: 이미 한 일은 다시 안 하기',
      type: 'mcq',
      question: 'Turborepo가 "cache hit"으로 빌드를 건너뛰는 조건은?',
      choices: ['마지막 빌드 후 1시간 이내', '작업의 입력(소스·의존성·설정·환경변수)의 해시가 지난번과 같을 때', '파일 수가 같을 때', '항상'],
      answer: 1,
      explanation: '입력이 같으면 결과도 같다는 원리로, 저장해 둔 outputs를 꺼내 써요.',
    },
    {
      id: 're10-3-q5',
      source: '캐시: 이미 한 일은 다시 안 하기',
      type: 'ox',
      question: 'turbo.json의 outputs를 실제 빌드 결과 폴더와 다르게 적어도 캐시에는 문제가 없다.',
      answer: false,
      explanation: '엉뚱한 폴더가 캐시돼서 cache hit 때 결과물이 없는 사고가 나요. dist/**, .next/**처럼 정확히 적어요.',
    },
    {
      id: 're10-3-q6',
      source: '바뀐 것만 돌리기',
      type: 'short',
      question: 'main 브랜치 대비 바뀐 패키지와 그걸 쓰는 패키지만 작업을 돌리는 turbo 옵션은? (--______)',
      answer: ['affected', '--affected'],
      explanation: 'PR에서 바뀐 범위만 테스트·빌드해서 CI 시간을 크게 줄여요.',
    },
  ],
}

export default topic

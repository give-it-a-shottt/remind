# remind

노션에 정리한 공부 노트를 문제로 바꿔, 잊어버리기 전에 다시 풀게 해 주는 개인용 복습 앱입니다.

**배포:** https://remind-flame-ten.vercel.app/

## 무엇을 공부하나

| 트랙 | 토픽 | 문제 | 내용 |
|---|---:|---:|---|
| 프론트엔드 | 17 | 188 | HTML · CSS · 웹 기초 |
| 백엔드 | 67 | 848 | FastAPI · SQL · DB 설계 · MongoDB · 알고리즘 |
| 풀스택 코스 | 14 | 77 | HTTP · FastAPI · Docker Postgres · SQLAlchemy · Next.js 화면 연결 (수업형) |
| React | 52 | 426 | React 기초 → TypeScript · Next.js · TanStack Query · 빌드 도구 · 웹 접근성 · 모노레포 (수업형) |
| **합계** | **150** | **1,539** | |

백엔드 트랙은 문제만 풀어도 FastAPI와 데이터베이스를 익힐 수 있게 구성한 자체 커리큘럼입니다. 웹 기초 → FastAPI → SQLAlchemy → 비동기 → 인증 → SQL → MongoDB → DB 설계(정규화, ER, 인덱스, 안티패턴, 트리 구조) → 종합 실전 순서로 진행합니다.

## 기능

- **수업형 트랙:** 풀스택 코스와 React는 설명 카드를 한 장씩 넘기며 듣고, 개념마다 확인 문제를 바로 푸는 수업 방식입니다. 확인 문제도 오늘 복습·오답노트에 들어갑니다.
- **개념 → 문제:** 토픽마다 개념 설명(섹션)을 먼저 읽고 문제를 풉니다. 문제에서 바로 해당 개념으로 돌아갈 수 있습니다.
- **문제 유형:** 객관식(선택지별 해설), OX, 단답형(공백·대소문자 무시 채점), 서술형(모범 답안을 보고 스스로 채점).
- **간격 반복 복습:** 맞히면 단계가 올라가고, 틀리면 0단계로 돌아갑니다. 단계별 복습 간격은 당일 → 1일 → 3일 → 7일 → 14일 → 30일입니다.
- **오늘의 복습:** 오답노트 문제를 먼저, 그다음 복습일이 된 문제를 하루 최대 20개(설정 가능) 보여 줍니다.
- **오답노트:** 틀린 문제를 모아 두고, 연속 2번 맞히면 졸업합니다.
- **이어서 풀기와 결과:** 풀던 세트를 이어서 풀 수 있고, 끝나면 결과와 새로 틀린 문제를 보여 줍니다.
- **업데이트 표시:** 새로 추가되거나 바뀐 토픽에 NEW / UPDATED 배지가 붙습니다.
- **기기 동기화:** 설정에서 로그인하면 컴퓨터와 폰의 풀이 기록이 자동으로 합쳐집니다. 문제마다 더 최근에 푼 기록을 남기고, 풀던 세트는 기기마다 따로 둡니다.
- **백업:** 학습 기록을 JSON 파일로 내보내고, 다른 기기에서 가져올 수 있습니다.

## 기술 스택

- React 19, React Router 7, TypeScript
- Vite 8, Tailwind CSS 4
- Supabase (로그인 + 학습 기록 한 줄 저장, 무료 플랜)
- oxlint
- Vercel 배포 (SPA rewrite)

문제 데이터는 TypeScript 파일로 빌드에 포함되고, 학습 기록은 브라우저 `localStorage`(`remind:v1:progress`)에 저장됩니다. 로그인하면 같은 기록을 Supabase `progress` 테이블에도 올려 기기끼리 맞춥니다. 오프라인에서도 그대로 풀 수 있고, 다시 연결되면 합칩니다.

## 구조

```
src/
  data/
    types.ts            # Topic · Section · Question 타입
    index.ts            # topics/**/*.ts 를 모아 트랙·문제 색인 생성
    topics/<트랙>/*.ts   # 토픽 1개 = 파일 1개
  lib/
    storage.ts          # 학습 기록 저장소 (localStorage + useSyncExternalStore)
    srs.ts              # 채점, 복습 간격, 오늘의 복습 큐
    quiz.ts             # 퀴즈 세트 구성
    lesson.ts           # 수업형 트랙: 카드 → 확인 문제 순서
    merge.ts            # 기기 간 기록 합치기 규칙 (순수 함수)
    sync.ts             # Supabase 로그인 · 받아 합치고 올리기
  pages/                # 홈, 트랙, 토픽, 퀴즈, 결과, 오답노트, 설정
  components/
content/sync.json       # 노션 페이지 ↔ 토픽 동기화 상태
supabase/schema.sql     # 동기화 테이블과 보안 규칙(RLS)
scripts/check-content.ts
```

토픽 파일 예시:

```ts
const topic: Topic = {
  id: 'fa-03-path',
  track: 'backend',
  group: 'FastAPI',
  title: '경로 파라미터',
  order: 23,
  sections: [{ title: '경로 파라미터 기본', points: ['...'], code: '...' }],
  questions: [
    { id: 'fa-03-01', type: 'mcq', source: '경로 파라미터 기본', question: '...',
      choices: ['...'], answer: 2, choiceExplanations: ['...'], explanation: '...' },
  ],
}
```

- 문제 `id`는 학습 기록의 키라서 한 번 정하면 바꾸지 않습니다. 삭제된 문제의 기록은 자동으로 무시됩니다.
- 모든 문제의 `source`는 섹션 제목 중 하나여야 하고, 모든 섹션에는 문제가 1개 이상 있어야 합니다.

## 콘텐츠 업데이트

노션 학습 노트가 바뀌면 Claude가 `content/sync.json`과 비교해 토픽을 추가·수정합니다. 기존 문제 ID는 유지하고, 바뀐 섹션은 UPDATED로 표시합니다. 빌드 전에 콘텐츠 검사가 돌아가서 다음 문제를 막습니다.

- 설명·해설 누락, 문제 ID 중복
- 섹션에 문제가 없거나, 문제의 `source`가 섹션에 없음
- 객관식 정답 인덱스 범위, 선택지 설명 개수 불일치
- (`--strict`) `sync.json`의 노션 페이지 중 토픽이 없는 페이지

## 기기 동기화 설정

1. Supabase 프로젝트의 SQL Editor에서 `supabase/schema.sql`을 실행합니다.
2. Authentication → Users에서 계정을 하나 만들고(Auto Confirm), Sign In / Providers에서 새 회원가입을 끕니다. 앱의 아이디 `admin`은 `admin@remind.local`로 바뀌어 로그인합니다.
3. `.env.example`을 `.env.local`로 복사해 Project URL과 publishable 키를 넣습니다. Vercel에도 같은 두 환경변수를 넣고 다시 배포합니다.

publishable 키는 브라우저에 공개돼도 되는 키이고, 실제 보호는 RLS(자기 줄만 읽고 쓰기)가 맡습니다. secret·service_role 키는 앱에 넣지 않습니다. 환경변수가 없으면 동기화 칸만 꺼지고 앱은 그대로 동작합니다.

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run check     # 콘텐츠 검사
npm run build     # 콘텐츠 검사 + 타입 검사 + 빌드
npm run lint
```

`npm run check`는 Node가 `.ts` 파일을 바로 실행해야 해서 Node 22.18 이상이 필요합니다. 그보다 낮은 버전에서는 `node --experimental-strip-types scripts/check-content.ts`로 실행하세요.

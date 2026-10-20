# remind

노션에 정리한 공부 노트를 문제로 바꿔, 잊어버리기 전에 다시 풀게 해 주는 개인용 복습 앱입니다.

**배포:** https://remind-flame-ten.vercel.app/

## 무엇을 공부하나

| 트랙 | 토픽 | 문제 | 내용 |
|---|---:|---:|---|
| 프론트엔드 | 17 | 188 | HTML · CSS · 웹 기초 |
| 백엔드 | 67 | 848 | FastAPI · SQL · DB 설계 · MongoDB · 알고리즘 |
| 디자인 | 14 | 212 | 디자인 기초 · 포토샵 · 일러스트 · 피그마 |
| 프로젝트 | 30 | 463 | 포트폴리오 · Accio · Maestro 코드 읽기 |
| **합계** | **128** | **1,711** | |

백엔드 트랙은 문제만 풀어도 FastAPI와 데이터베이스를 익힐 수 있게 구성한 자체 커리큘럼입니다. 웹 기초 → FastAPI → SQLAlchemy → 비동기 → 인증 → SQL → MongoDB → DB 설계(정규화, ER, 인덱스, 안티패턴, 트리 구조) → 종합 실전 순서로 진행합니다.

## 기능

- **개념 → 문제:** 토픽마다 개념 설명(섹션)을 먼저 읽고 문제를 풉니다. 문제에서 바로 해당 개념으로 돌아갈 수 있습니다.
- **문제 유형:** 객관식(선택지별 해설), OX, 단답형(공백·대소문자 무시 채점), 서술형(모범 답안을 보고 스스로 채점).
- **간격 반복 복습:** 맞히면 단계가 올라가고, 틀리면 0단계로 돌아갑니다. 단계별 복습 간격은 당일 → 1일 → 3일 → 7일 → 14일 → 30일입니다.
- **오늘의 복습:** 오답노트 문제를 먼저, 그다음 복습일이 된 문제를 하루 최대 20개(설정 가능) 보여 줍니다.
- **오답노트:** 틀린 문제를 모아 두고, 연속 2번 맞히면 졸업합니다.
- **이어서 풀기와 결과:** 풀던 세트를 이어서 풀 수 있고, 끝나면 결과와 새로 틀린 문제를 보여 줍니다.
- **업데이트 표시:** 새로 추가되거나 바뀐 토픽에 NEW / UPDATED 배지가 붙습니다.
- **백업:** 학습 기록을 JSON 파일로 내보내고, 다른 기기에서 가져올 수 있습니다.

## 기술 스택

- React 19, React Router 7, TypeScript
- Vite 8, Tailwind CSS 4
- oxlint
- Vercel 배포 (SPA rewrite)

서버와 데이터베이스가 없는 프론트엔드 전용 앱입니다. 문제 데이터는 TypeScript 파일로 빌드에 포함되고, 학습 기록은 브라우저 `localStorage`(`remind:v1:progress`)에 저장됩니다.

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
  pages/                # 홈, 트랙, 토픽, 퀴즈, 결과, 오답노트, 설정
  components/
content/sync.json       # 노션 페이지 ↔ 토픽 동기화 상태
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

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run check     # 콘텐츠 검사
npm run build     # 콘텐츠 검사 + 타입 검사 + 빌드
npm run lint
```

`npm run check`는 Node가 `.ts` 파일을 바로 실행해야 해서 Node 22.18 이상이 필요합니다. 그보다 낮은 버전에서는 `node --experimental-strip-types scripts/check-content.ts`로 실행하세요.

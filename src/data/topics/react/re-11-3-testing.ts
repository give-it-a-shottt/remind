import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-11-3-testing',
  track: 'react',
  group: '11. 품질: 접근성·테스트·성능',
  title: '11-3. 테스트: Vitest·Testing Library·Playwright',
  order: 1103,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '무엇을 얼마나 테스트할까',
      slides: [
        {
          title: '테스트의 세 층',
          blocks: [
            { type: 'say', text: '이번 수업은 **테스트**예요. "코드를 고쳤는데 다른 데가 깨졌는지 어떻게 알아요?"에 대한 답이에요. 매번 손으로 다 눌러 볼 수는 없잖아요.' },
            {
              type: 'table',
              head: ['종류', '무엇을', '도구', '속도'],
              rows: [
                ['**단위 테스트**', '함수 하나 (reducer, 채점 함수, 날짜 포맷)', 'Vitest', '아주 빠름'],
                ['**통합(컴포넌트) 테스트**', '컴포넌트를 그리고 사용자처럼 클릭해 봄', 'Vitest + Testing Library', '빠름'],
                ['**E2E 테스트**', '진짜 브라우저로 앱 전체 흐름 (로그인 → 결제)', 'Playwright', '느림'],
              ],
            },
            { type: 'say', text: '프론트엔드에서는 **통합 테스트를 가장 많이**, 단위는 순수 로직에, E2E는 **돈과 직결되는 핵심 흐름 몇 개**에만 두는 게 흔한 전략이에요. 모든 걸 E2E로 하면 느리고 자주 깨져요.' },
          ],
        },
      ],
    },
    {
      title: '단위 테스트: Vitest',
      slides: [
        {
          title: '이 앱의 채점 함수를 테스트해 보기',
          blocks: [
            { type: 'say', text: '이 앱(remind)에는 단답형 답을 채점하는 함수가 있어요. 공백·대소문자·끝 마침표를 무시하고 비교하죠. 순수 함수라 테스트하기 딱 좋아요.' },
            {
              type: 'code',
              code: `// src/lib/srs.test.ts
import { describe, expect, it } from 'vitest';
import { normalize } from './srs';

describe('normalize', () => {
  it('공백과 대소문자를 무시한다', () => {
    expect(normalize(' Use State ')).toBe('usestate');
  });
  it('끝의 마침표를 지운다', () => {
    expect(normalize('useState.')).toBe('usestate');
  });
});`,
            },
            { type: 'list', items: ['`describe`: 테스트 묶음', '`it` (또는 `test`): 테스트 하나. 이름은 **"무엇을 보장하는지"** 를 문장으로', '`expect(실제).toBe(기대)`: 같은지 확인'] },
            { type: 'note', tone: 'tip', text: '**Vitest**는 Vite와 같은 설정·변환을 써서 TS·JSX를 따로 설정할 필요가 없어요. Jest와 문법이 거의 같아서 옮기기도 쉬워요. 4-3에서 "reducer는 순수 함수라 화면 없이 테스트할 수 있다"고 한 게 바로 이거예요.' },
          ],
        },
      ],
    },
    {
      title: '컴포넌트 테스트: Testing Library',
      slides: [
        {
          title: '사용자가 보는 대로 찾기',
          blocks: [
            {
              type: 'code',
              code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('찜 버튼을 누르면 하트가 채워진다', async () => {
  const user = userEvent.setup();
  render(<WishButton initial={false} />);

  const button = screen.getByRole('button', { name: '찜하기' });   // 역할과 이름으로 찾기
  await user.click(button);                                         // 사용자처럼 클릭

  expect(screen.getByRole('button', { name: '찜 취소' })).toBeInTheDocument();
});`,
            },
            { type: 'say', text: '**Testing Library**의 철학은 "**사용자가 쓰는 방식대로 테스트하라**"예요. 그래서 CSS 클래스나 내부 state가 아니라 **역할(button)과 이름(찜하기)** 으로 요소를 찾아요.' },
          ],
        },
        {
          title: 'getByRole이 접근성과 연결돼요',
          blocks: [
            { type: 'ask', q: '11-1의 `<div onClick>` 가짜 버튼을 getByRole("button")으로 찾으면 어떻게 될까요?', a: '**못 찾아요.** div에는 button 역할이 없으니까요. 테스트가 실패하면서 "이거 접근성 문제야"를 알려 주는 셈이에요.\n아이콘만 있는 버튼도 `aria-label`이 없으면 `{ name: \'닫기\' }`로 못 찾아요. **접근성이 좋은 컴포넌트가 테스트하기도 쉬워요.** 둘은 같은 방향이에요.' },
            {
              type: 'table',
              head: ['찾는 방법 (추천 순서)', '예'],
              rows: [
                ['`getByRole`', "`getByRole('button', { name: '저장' })`"],
                ['`getByLabelText`', "`getByLabelText('이메일')` (11-1 label 연결)"],
                ['`getByText`', "`getByText('레슨 완료!')`"],
                ['`getByTestId`', '정말 다른 방법이 없을 때만'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '서버 요청 흉내 내기: MSW',
      slides: [
        {
          title: '테스트마다 진짜 서버를 띄울 순 없어요',
          blocks: [
            { type: 'say', text: '강의 목록 컴포넌트를 테스트하려는데, 7장처럼 TanStack Query로 `/api/courses`를 불러요. 테스트할 때마다 진짜 FastAPI 서버를 띄울 수는 없죠.' },
            {
              type: 'code',
              code: `import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/courses', () =>
    HttpResponse.json([{ id: 1, title: 'React 완벽 가이드', price: 39000 }]),
  ),
);
beforeAll(() => server.listen());
afterAll(() => server.close());

it('강의 목록을 보여 준다', async () => {
  render(<CourseList />, { wrapper: QueryProvider });
  expect(await screen.findByText('React 완벽 가이드')).toBeInTheDocument();   // 비동기라 findBy
});`,
            },
            { type: 'say', text: '**MSW**(Mock Service Worker)는 네트워크 요청을 **중간에서 가로채서 가짜 응답**을 줘요. 컴포넌트 코드는 하나도 안 바꾸고 진짜처럼 fetch해요. 에러 응답(500)을 주면 "에러 화면이 제대로 나오나"도 테스트할 수 있어요.' },
            { type: 'note', tone: 'tip', text: '같은 MSW 설정을 **개발 서버**에서도 쓸 수 있어요. 백엔드 API가 아직 안 만들어졌을 때 프론트 개발을 먼저 진행하는 데 정말 유용해요. 풀스택 코스에서 직접 써 볼 거예요.' },
          ],
        },
      ],
    },
    {
      title: 'E2E: Playwright',
      slides: [
        {
          title: '진짜 브라우저로 전체 흐름',
          blocks: [
            {
              type: 'code',
              code: `// e2e/lesson.spec.ts
import { expect, test } from '@playwright/test';

test('수업을 끝까지 보면 완료 화면이 나온다', async ({ page }) => {
  await page.goto('/topic/re-01-1-rendering');
  await page.getByRole('link', { name: '수업 시작' }).click();
  // ... 카드 넘기고 문제 풀기
  await expect(page.getByText('레슨 완료!')).toBeVisible();
});`,
            },
            { type: 'say', text: '**Playwright**는 진짜 크롬·파이어폭스·사파리를 띄워서 사용자처럼 클릭해요. 라우터, 서버, 저장소까지 **전부 연결된 상태**를 확인할 수 있어요. 대신 느리고, 화면이 조금만 바뀌어도 깨지기 쉬워요.' },
            { type: 'say', text: '그래서 E2E는 "**이게 깨지면 회사가 돈을 잃는다**" 싶은 흐름에만 둬요. 회원가입, 로그인, 결제, 이 앱이라면 "수업 → 문제 → 완료 → 오답노트". 나머지는 빠른 통합 테스트로 덮어요.' },
          ],
        },
        {
          title: '테스트를 언제 돌리나',
          blocks: [
            {
              type: 'list',
              items: [
                '**코드 쓰면서**: `vitest --watch`로 저장할 때마다 관련 테스트만',
                '**PR 올릴 때**: CI에서 단위·통합 전부 + 핵심 E2E (10-3 `--affected`로 바뀐 곳만)',
                '**버그를 고칠 때**: 먼저 그 버그를 재현하는 테스트를 쓰고 → 실패 확인 → 고쳐서 통과. 같은 버그가 다시 안 생겨요',
              ],
            },
            { type: 'note', tone: 'warn', text: '테스트 커버리지 100%가 목표가 아니에요. 숫자를 채우려고 의미 없는 테스트를 쓰면 유지보수만 늘어요. "**이게 깨지면 아프다**"는 곳부터 테스트해요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're11-3-q1',
      source: '무엇을 얼마나 테스트할까',
      type: 'mcq',
      question: '진짜 브라우저로 로그인 → 결제 같은 앱 전체 흐름을 확인하는 테스트는?',
      choices: ['단위 테스트', '컴포넌트 테스트', 'E2E 테스트', '타입 검사'],
      answer: 2,
      explanation: 'E2E는 Playwright 같은 도구로 전체를 연결해 확인해요. 느려서 핵심 흐름에만 둬요.',
    },
    {
      id: 're11-3-q2',
      source: '단위 테스트: Vitest',
      type: 'ox',
      question: 'reducer나 채점 함수 같은 순수 함수는 화면을 그리지 않고도 단위 테스트할 수 있다.',
      answer: true,
      explanation: '같은 입력에 같은 출력이라 expect로 바로 확인하면 돼요. 가장 빠르고 안정적인 테스트예요.',
    },
    {
      id: 're11-3-q3',
      source: '컴포넌트 테스트: Testing Library',
      type: 'mcq',
      question: 'Testing Library에서 가장 먼저 권하는 요소 찾기 방법은?',
      choices: ['CSS 클래스로', 'getByRole (역할과 이름으로)', 'getByTestId', '내부 state로'],
      answer: 1,
      explanation: '사용자(와 화면 낭독기)가 인식하는 방식으로 찾아요. 접근성이 좋을수록 찾기 쉬워요.',
    },
    {
      id: 're11-3-q4',
      source: '컴포넌트 테스트: Testing Library',
      type: 'ox',
      question: "<div onClick>으로 만든 가짜 버튼은 getByRole('button')으로 찾을 수 있다.",
      answer: false,
      explanation: 'div에는 button 역할이 없어서 못 찾아요. 테스트가 접근성 문제를 알려 주는 셈이에요.',
    },
    {
      id: 're11-3-q5',
      source: '서버 요청 흉내 내기: MSW',
      type: 'mcq',
      question: 'MSW(Mock Service Worker)의 역할은?',
      choices: ['CSS를 압축한다', '네트워크 요청을 가로채 가짜 응답을 줘서, 진짜 서버 없이 API를 쓰는 컴포넌트를 테스트하게 한다', '브라우저를 띄운다', '타입을 만든다'],
      answer: 1,
      explanation: '컴포넌트 코드를 안 바꾸고 fetch가 가짜 응답을 받아요. 에러 응답 테스트, 백엔드 없이 개발에도 써요.',
    },
    {
      id: 're11-3-q6',
      source: 'E2E: Playwright',
      type: 'mcq',
      question: '버그를 고칠 때 권장되는 테스트 순서는?',
      choices: ['고치고 나서 테스트는 생략', '버그를 재현하는 테스트를 먼저 써서 실패를 확인하고, 고친 뒤 통과시킨다', 'E2E만 추가한다', '커버리지 100%를 먼저 채운다'],
      answer: 1,
      explanation: '먼저 실패하는 테스트로 버그를 고정하면 같은 버그가 다시 생기는 걸 막아요.',
    },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-11-2-a11y-practice',
  track: 'react',
  group: '11. 품질: 접근성·테스트·성능',
  title: '11-2. 접근성 실전: 키보드·ARIA·대비',
  order: 1102,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '키보드로만 써 보기',
      slides: [
        {
          title: '마우스를 치워 보세요',
          blocks: [
            { type: 'say', text: '접근성 테스트를 제일 쉽게 하는 법이에요. **마우스를 치우고 Tab 키만으로** 내 사이트를 써 보세요. 많은 문제가 바로 보여요.' },
            {
              type: 'table',
              head: ['확인할 것', '문제가 있으면'],
              rows: [
                ['Tab으로 모든 버튼·링크·입력칸에 갈 수 있나', 'div 버튼 (11-1) → button으로'],
                ['**지금 어디에 포커스가 있는지** 보이나', '`outline: none`으로 테두리를 지워 버림 → 지우지 말고 `:focus-visible`로 예쁘게'],
                ['순서가 화면 순서와 맞나', 'CSS로 위치만 바꿈, `tabIndex`에 양수 사용 → HTML 순서를 맞추기'],
                ['Enter·Space·Esc가 기대대로 되나', '모달이 Esc로 안 닫힘 → 키 처리 추가'],
              ],
            },
            { type: 'note', tone: 'warn', text: '디자인 때문에 `*:focus { outline: none }`을 넣는 경우가 정말 많아요. 그러면 키보드 사용자는 **지금 어디 있는지 전혀 모르게** 돼요. `:focus-visible`(키보드로 왔을 때만 보이는 포커스)로 디자인에 맞는 테두리를 주세요.' },
          ],
        },
        {
          title: '모달의 포커스',
          blocks: [
            { type: 'say', text: '모달(대화 상자)은 키보드 접근성의 단골 문제예요. 제대로 된 모달은 이렇게 동작해요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '열리면 포커스가 **모달 안으로** 들어가요',
                'Tab을 눌러도 **모달 밖으로 안 나가요** (포커스 가두기, focus trap)',
                '**Esc**로 닫혀요',
                '닫히면 포커스가 **모달을 연 버튼으로** 돌아가요',
                '`role="dialog"`, `aria-modal="true"`로 낭독기에 "대화 상자"라고 알려요',
              ],
            },
            { type: 'note', tone: 'tip', text: '이 앱의 "그만 풀까요?" 다이얼로그는 `role="dialog" aria-modal="true"`가 붙어 있고 Esc로 닫혀요. 다만 포커스 가두기는 아직 없어요. 직접 다 짜기 어려우니 실무에서는 HTML의 `<dialog>` 요소나 Radix UI 같은 **접근성이 검증된 라이브러리**를 많이 써요.' },
          ],
        },
      ],
    },
    {
      title: 'ARIA는 마지막 수단',
      slides: [
        {
          title: 'ARIA의 첫 번째 규칙',
          blocks: [
            { type: 'say', text: '**ARIA**(Accessible Rich Internet Applications)는 HTML만으로 표현이 안 되는 정보를 낭독기에 알려 주는 속성이에요. `role`, `aria-label`, `aria-expanded` 같은 거요.' },
            { type: 'note', tone: 'warn', text: 'ARIA의 **첫 번째 규칙**: "**쓸 수 있는 HTML 요소가 있으면 ARIA 대신 그걸 써라.**" `<div role="button" tabIndex={0} onKeyDown={...}>`보다 `<button>`이 백배 나아요. 잘못 쓴 ARIA는 **없는 것보다 나빠요.** 낭독기에 틀린 정보를 주니까요.' },
            {
              type: 'table',
              head: ['ARIA', '언제', '예'],
              rows: [
                ['`aria-label`', '글자 없이 아이콘만 있는 버튼', '`<button aria-label="닫기"><XIcon /></button>`'],
                ['`aria-expanded`', '펼치고 접는 버튼의 현재 상태', '목차 펼침 버튼, 드롭다운'],
                ['`aria-current="page"`', '지금 페이지인 메뉴', '5-1 NavLink가 자동으로'],
                ['`aria-live`', '화면 일부가 **저절로 바뀔 때** 알려 주기', '"정답이에요!" 피드백, 토스트'],
              ],
            },
          ],
        },
        {
          title: '이 앱에서 찾아보기',
          blocks: [
            { type: 'say', text: '지금 쓰고 있는 이 앱에도 ARIA가 들어 있어요.' },
            {
              type: 'list',
              items: [
                '수업 카드의 🤔 질문 버튼: `aria-expanded`로 답이 열렸는지 알려 줘요',
                '문제를 풀면 나오는 "정답이에요!/아쉬워요" 패널: `aria-live="polite"`라서 낭독기가 **자동으로 읽어 줘요**. 안 그러면 화면이 바뀐 걸 모르죠',
                '닫기 버튼(X 아이콘): `aria-label="닫기"`',
                '진행 막대: `role="progressbar"`와 `aria-valuenow`로 몇 %인지',
              ],
            },
            { type: 'ask', q: 'aria-live를 "polite"가 아니라 "assertive"로 하면 어떻게 될까요?', a: 'polite는 낭독기가 **지금 읽던 걸 다 읽고 나서** 알려 줘요. assertive는 **읽던 걸 끊고 바로** 알려 줘요. 그래서 assertive는 "결제 실패", "세션 만료"처럼 정말 급한 것에만 써요. 정답 피드백 같은 건 polite가 맞아요.' },
          ],
        },
      ],
    },
    {
      title: '색과 움직임',
      slides: [
        {
          title: '색 대비 4.5 : 1',
          blocks: [
            { type: 'say', text: '연한 회색 글자는 세련돼 보이지만 저시력 사용자나 햇빛 아래 휴대폰에서는 안 읽혀요. WCAG는 일반 글자와 배경의 **명도 대비를 4.5 : 1 이상**(큰 글자는 3 : 1)으로 권해요.' },
            {
              type: 'list',
              items: [
                '크롬 개발자 도구에서 글자를 선택하면 대비 값과 통과 여부를 바로 보여 줘요',
                '**색만으로 정보를 전달하지 않기**: 오답을 빨간색으로만 표시하면 색각 이상인 사람은 몰라요. 이 앱은 색과 함께 ✕ 아이콘과 "아쉬워요" 글자를 같이 보여 줘요',
                '디자인 토큰(3-3)으로 색을 관리하면 대비 검사도 한 곳에서 할 수 있어요',
              ],
            },
          ],
        },
        {
          title: '움직임 줄이기 설정 존중하기',
          blocks: [
            { type: 'code', code: `@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}` },
            { type: 'say', text: '운영체제에서 "움직임 줄이기"를 켠 사용자는 큰 애니메이션에 어지러움을 느끼는 경우가 많아요. 3-3의 다크 모드(`prefers-color-scheme`)처럼, CSS로 그 설정을 읽어서 애니메이션을 줄여 줘요. Tailwind에서는 `motion-reduce:` 접두사로 쓸 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '접근성 검사 도구',
      slides: [
        {
          title: '자동 검사 + 사람 검사',
          blocks: [
            {
              type: 'table',
              head: ['도구', '하는 일'],
              rows: [
                ['Lighthouse (크롬 개발자 도구)', '접근성 점수와 문제 목록'],
                ['axe DevTools / axe-core', '더 자세한 자동 검사. 테스트 코드에도 넣을 수 있음'],
                ['eslint-plugin-jsx-a11y', '코드 쓰는 순간 `<img>`에 alt 없음, div onClick 등 경고'],
                ['화면 낭독기 (NVDA, VoiceOver)', '**직접 들어 보기**'],
              ],
            },
            { type: 'note', tone: 'warn', text: '자동 검사는 문제의 **일부(대략 30~40%)** 만 잡아요. "alt가 있나"는 알지만 "alt 내용이 말이 되나"는 몰라요. 키보드로 직접 써 보고, 화면 낭독기로 한 번 들어 보는 게 꼭 필요해요. Windows는 NVDA(무료), Mac·아이폰은 VoiceOver가 기본으로 있어요.' },
            { type: 'say', text: '면접에서 "웹 접근성 경험"을 물으면 "시맨틱 HTML → 키보드 → ARIA는 최소한 → 대비 → 자동 + 직접 검사" 순서로 말하고, 실제로 고친 사례 하나(예: 아이콘 버튼에 aria-label, 모달 포커스)를 들면 좋아요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're11-2-q1',
      source: '키보드로만 써 보기',
      type: 'mcq',
      question: '디자인 때문에 *:focus { outline: none }을 넣었다. 가장 큰 문제는?',
      choices: ['페이지가 느려진다', '키보드 사용자가 지금 어디에 포커스가 있는지 알 수 없다', 'SEO가 떨어진다', '문제 없다'],
      answer: 1,
      explanation: '포커스 표시를 지우지 말고 :focus-visible로 디자인에 맞는 테두리를 줘요.',
    },
    {
      id: 're11-2-q2',
      source: '키보드로만 써 보기',
      type: 'ox',
      question: '접근성 있는 모달은 열려 있는 동안 Tab을 눌러도 포커스가 모달 밖으로 나가지 않는다.',
      answer: true,
      explanation: '포커스 가두기(focus trap)예요. Esc로 닫히고, 닫히면 연 버튼으로 포커스가 돌아가야 해요.',
    },
    {
      id: 're11-2-q3',
      source: 'ARIA는 마지막 수단',
      type: 'mcq',
      question: 'ARIA의 첫 번째 규칙은?',
      choices: ['모든 요소에 role을 붙인다', '쓸 수 있는 HTML 요소가 있으면 ARIA 대신 그걸 쓴다', 'aria-label은 필수다', 'div만 쓴다'],
      answer: 1,
      explanation: '<div role="button">보다 <button>이 나아요. 잘못 쓴 ARIA는 없는 것보다 나빠요.',
    },
    {
      id: 're11-2-q4',
      source: 'ARIA는 마지막 수단',
      type: 'short',
      question: '글자 없이 X 아이콘만 있는 닫기 버튼에 "닫기"라는 이름을 붙이는 ARIA 속성은?',
      answer: ['aria-label', 'aria-label="닫기"'],
      explanation: '아이콘만 있으면 낭독기가 무슨 버튼인지 읽을 수 없어요.',
    },
    {
      id: 're11-2-q5',
      source: 'ARIA는 마지막 수단',
      type: 'mcq',
      question: '문제를 제출한 뒤 나타나는 "정답이에요!" 패널을 낭독기가 자동으로 읽게 하려면?',
      choices: ['aria-hidden="true"', 'aria-live="polite"', 'tabIndex={-1}', 'role="presentation"'],
      answer: 1,
      explanation: 'aria-live 영역은 내용이 바뀌면 낭독기가 알려 줘요. 급하지 않은 건 polite, 아주 급한 것만 assertive예요.',
    },
    {
      id: 're11-2-q6',
      source: '색과 움직임',
      type: 'mcq',
      question: '오답을 빨간색으로만 표시하는 것의 문제와 해결은?',
      choices: ['문제 없다', '색각 이상인 사람은 구분 못 함 → 아이콘·글자를 함께 표시', '빨간색이 촌스러움 → 파란색으로', '느려짐 → 색 제거'],
      answer: 1,
      explanation: '색만으로 정보를 전달하지 않아요. 이 앱은 ✕ 아이콘과 "아쉬워요" 글자를 같이 보여 줘요.',
    },
    {
      id: 're11-2-q7',
      source: '접근성 검사 도구',
      type: 'ox',
      question: 'Lighthouse 접근성 점수가 100점이면 접근성 문제가 하나도 없다고 볼 수 있다.',
      answer: false,
      explanation: '자동 검사는 일부만 잡아요. alt 내용이 말이 되는지, 키보드 흐름이 자연스러운지는 사람이 직접 확인해야 해요.',
    },
  ],
}

export default topic

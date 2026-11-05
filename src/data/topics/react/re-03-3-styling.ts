import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-03-3-styling',
  track: 'react',
  group: '03. 상태·스타일·이벤트·폼',
  title: '3-3. 스타일링: 인라인·CSS 모듈·Tailwind',
  order: 303,
  notionId: '409df951bf8081e39a3bd5e6fc7cb76d',
  addedAt: '2026-11-05',
  sections: [
    {
      title: '인라인 스타일은 언제만 쓸까',
      slides: [
        {
          title: 'style={{ }} 의 한계',
          blocks: [
            { type: 'say', text: '이번 수업은 React에서 **스타일을 입히는 방법**이에요. 방법이 너무 많아서 처음엔 뭘 써야 할지 헷갈리죠. 오늘 2026년 기준으로 깔끔하게 정리해 줄게요.\n\n제일 쉬운 건 2-4에서 본 **인라인 스타일**이에요.' },
            { type: 'code', code: `<button style={{ backgroundColor: 'orange', padding: 12 }}>저장</button>` },
            { type: 'say', text: '간단하지만 실무에서는 **잘 안 써요.** 이유가 있어요.' },
            {
              type: 'table',
              head: ['인라인 스타일로는', '왜 문제냐면'],
              rows: [
                ['`:hover`, `:focus`를 못 써요', '마우스 올렸을 때 색 바꾸기가 안 돼요'],
                ['미디어 쿼리를 못 써요', 'PC·모바일 반응형이 안 돼요'],
                ['재사용·통일이 어려워요', '같은 색을 여기저기 복붙 → 디자인 토큰을 안 쓰게 돼요'],
                ['우선순위가 가장 높아요', '나중에 CSS로 덮어쓰기 어려워요'],
              ],
            },
          ],
        },
        {
          title: '예외: 실행 중에 계산되는 값',
          blocks: [
            { type: 'say', text: '인라인 스타일이 딱 맞는 경우가 있어요. **실행 중에 계산되는 값**이에요. 진행률 막대처럼요.' },
            {
              type: 'code',
              code: `// 진행률은 실행해 봐야 알 수 있으니 인라인으로
<div className="bar" style={{ width: \`\${percent}%\` }} />`,
            },
            { type: 'note', tone: 'tip', text: '이 앱(remind)의 `ProgressBar`가 정확히 이렇게 돼 있어요. 색·모양은 클래스로, **폭(계산 값)만** style로 넘겨요.' },
          ],
        },
      ],
    },
    {
      title: 'CSS 모듈: 이름 충돌 막기',
      slides: [
        {
          title: '일반 CSS는 전역이에요',
          blocks: [
            { type: 'say', text: '평범한 CSS 파일을 import 하면 그 안의 클래스는 **앱 전체에** 적용돼요.\n\n`Card.css`에도 `.title`, `Modal.css`에도 `.title`이 있으면? 둘이 **서로 덮어써요.** 나중에 불러온 파일이 이기죠. 컴포넌트가 수백 개면 이름 겹칠 일이 정말 많아요.' },
            { type: 'ask', q: '1-2에서 배운 "모듈"의 특징이 뭐였죠? 그걸 CSS에 적용하면?', a: '모듈은 **자기만의 방(스코프)** 을 가져서 다른 파일과 이름이 겹쳐도 괜찮았죠. 이걸 CSS에 적용한 게 바로 **CSS 모듈**이에요.' },
          ],
        },
        {
          title: '.module.css',
          blocks: [
            {
              type: 'code',
              code: `/* Card.module.css */
.card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
.title { font-weight: 700; }`,
            },
            {
              type: 'code',
              code: `import styles from './Card.module.css';

function Card() {
  return (
    <div className={styles.card}>
      <p className={styles.title}>제목</p>
    </div>
  );
}
// 실제 HTML: <p class="_title_nc2zs_2">  ← 빌드가 고유한 꼬리표를 붙임`,
            },
            { type: 'say', text: '파일 이름을 `.module.css`로 끝내기만 하면 돼요. 빌드할 때 `.title`이 `_title_nc2zs_2`처럼 **고유한 이름**으로 바뀌어서 다른 파일의 `.title`과 절대 안 겹쳐요. Vite·Next.js에 기본으로 들어 있어서 설치할 것도 없어요.' },
          ],
        },
      ],
    },
    {
      title: 'Tailwind CSS',
      slides: [
        {
          title: '미리 만들어진 클래스를 조합해요',
          blocks: [
            { type: 'say', text: '요즘 가장 많이 쓰는 방식이에요. **Tailwind CSS**는 CSS를 직접 쓰는 대신, **작은 일 하나만 하는 클래스**를 미리 잔뜩 만들어 두고 그걸 조합해요.' },
            {
              type: 'code',
              code: `<button className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
  저장
</button>
// rounded-full = 둥글게, px-6 = 좌우 여백, hover:bg-... = 마우스 올리면 색 변경`,
            },
            { type: 'note', tone: 'analogy', text: '일반 CSS가 "옷을 직접 재단해서 만들기"라면, Tailwind는 "단추·주머니·소매 같은 부품을 골라서 조립하기"예요. 부품이 정해져 있어서 누가 만들어도 모양이 통일돼요.' },
            { type: 'say', text: '사실 지금 보고 있는 **이 앱(remind)도 Tailwind로 만들었어요.** 지금 이 수업 카드의 `rounded-card bg-surface` 같은 게 전부 Tailwind 클래스예요.' },
          ],
        },
        {
          title: 'CSS 모듈과 뭐가 달라요?',
          blocks: [
            { type: 'say', text: '"Tailwind랑 CSS 모듈은 관계가 있나요?" 자주 받는 질문이에요. **상관없는 서로 다른 방식**이에요. 둘 다 "이름 충돌"을 해결하지만 방법이 달라요.' },
            {
              type: 'table',
              head: ['', 'CSS 모듈', 'Tailwind CSS'],
              rows: [
                ['쓰는 법', '평범한 CSS를 쓰고 `className={styles.card}`', '클래스 조합 `className="p-3 rounded-lg"`'],
                ['CSS 파일', '컴포넌트마다 하나', '거의 없음'],
                ['충돌 방지', '이름에 고유값을 붙여서', '충돌할 이름 자체를 안 만들어서'],
                ['디자인 토큰', 'CSS 변수로 직접', '`@theme`에 등록하면 클래스로 자동 생성'],
                ['설치', 'Vite·Next.js 기본', '패키지 설치 필요'],
              ],
            },
            { type: 'note', tone: 'tip', text: '디자인 시스템과 궁합이 좋아요. 피그마의 색·간격 토큰을 `@theme`에 `--color-brand: #ff6b00`처럼 등록하면 `bg-brand`, `text-brand` 클래스가 자동으로 생겨요. 이 앱의 `text-15`, `bg-surface`가 그렇게 만든 거예요.' },
          ],
        },
        {
          title: '컴포넌트에 클래스 덧붙이기',
          blocks: [
            { type: 'say', text: '공통 `Button` 컴포넌트를 만들었는데, 어떤 화면에서는 가로로 꽉 채우고 싶어요. 그럴 땐 **className을 props로 받아서 합쳐요.**' },
            {
              type: 'code',
              code: `function Button({ className = '', ...rest }) {
  return <button className={\`rounded-full px-6 py-3 \${className}\`} {...rest} />;
}

<Button className="w-full">저장</Button>   // 기본 스타일 + w-full`,
            },
            { type: 'say', text: '실무에서는 `cn()`이라는 작은 함수(clsx + tailwind-merge)를 많이 써요. `px-6`과 `px-4`가 같이 들어오면 뒤에 것만 남기는 식으로 **충돌하는 클래스를 정리**해 줘요. shadcn/ui라는 인기 컴포넌트 모음이 이 방식이에요.' },
          ],
        },
      ],
    },
    {
      title: 'Sass와 styled-components는?',
      slides: [
        {
          title: 'CSS에도 이제 변수가 있어요',
          blocks: [
            { type: 'say', text: '책에서 "CSS에는 변수, 반복문, 함수가 없어서 Sass를 쓴다"는 말을 볼 수 있어요. **예전 이야기**예요. 지금 CSS에는 이런 게 다 있어요.' },
            {
              type: 'code',
              code: `:root { --brand: #ff6b00; }            /* 변수 */
.card {
  color: var(--brand);
  padding: calc(8px * 2);               /* 계산 */
  font-size: clamp(14px, 2vw, 18px);    /* 최소·최대 사이에서 자동 */
  & .title { font-weight: 700; }        /* 중첩 — 모든 최신 브라우저 지원 */
}`,
            },
            { type: 'say', text: '반복문과 믹스인은 여전히 Sass에만 있어요. 그래서 **Sass(SCSS)** 는 기존 프로젝트나 Bootstrap에서 여전히 쓰이지만, 새로 도입할 이유는 많이 줄었어요.' },
          ],
        },
        {
          title: 'styled-components는 왜 줄었을까',
          blocks: [
            { type: 'say', text: '**styled-components**는 자바스크립트 파일 안에 CSS를 쓰는 방식(CSS-in-JS)이에요. 한때 정말 인기였어요.' },
            { type: 'code', code: `const Title = styled.h1\`
  font-size: 24px;
  color: orange;
\`;` },
            { type: 'note', tone: 'warn', text: '2025년 3월, styled-components 메인테이너가 **유지보수 모드**를 선언하고 새 프로젝트에는 권하지 않는다고 밝혔어요. 또 **브라우저에서 실행될 때** 스타일을 만드는 방식이라, 서버에서 그리는 Next.js 서버 컴포넌트와 잘 맞지 않아요. 새로 배울 1순위는 아니에요.' },
            {
              type: 'table',
              head: ['방식', '새 프로젝트에', '한 줄'],
              rows: [
                ['인라인 style', '계산되는 값만', '호버·반응형 불가'],
                ['일반 CSS 파일', '전역 스타일(리셋, 토큰)에', '클래스 충돌 주의'],
                ['CSS 모듈', '추천', '평범한 CSS + 충돌 방지'],
                ['Tailwind CSS', '추천 (가장 많이 씀)', '빠르고 디자인 토큰과 잘 맞음'],
                ['Sass', '기존 프로젝트에', '최신 CSS로 대부분 대체 가능'],
                ['styled-components', '비추천', '유지보수 모드, 서버 컴포넌트와 안 맞음'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: '다크 모드는 CSS 변수로',
      slides: [
        {
          title: '값만 바꿔치기',
          blocks: [
            { type: 'say', text: '"다크 모드는 Tailwind가 해 주는 거죠?" 이것도 자주 하는 오해예요. 다크 모드는 **어떤 방식을 쓰든** 원리가 같아요. **CSS 변수(디자인 토큰) 값을 바꿔치기**하는 거예요.' },
            {
              type: 'code',
              code: `:root { --bg: #ffffff; --text: #111111; }        /* 라이트 */

@media (prefers-color-scheme: dark) {
  :root { --bg: #111111; --text: #f5f5f5; }      /* OS가 다크면 값만 교체 */
}

body { background: var(--bg); color: var(--text); }   /* 쓰는 쪽은 그대로 */`,
            },
            { type: 'note', tone: 'analogy', text: '연극 무대에서 배우와 소품은 그대로 두고 **조명 색만** 바꾸는 거예요. 컴포넌트(배우)는 "배경색 = var(--bg)"만 알고, --bg가 흰색인지 검은색인지는 조명(토큰)이 정해요.' },
            { type: 'say', text: 'Tailwind는 이걸 `dark:bg-gray-900`처럼 **쉽게 쓰는 문법**을 줄 뿐이에요. 원리는 똑같아요. 그래서 디자인할 때부터 색을 "토큰"으로 정해 두면 다크 모드가 쉬워져요.\n\n스타일링 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're03-3-q1',
      source: '인라인 스타일은 언제만 쓸까',
      type: 'mcq',
      question: '인라인 스타일(style={{ }})로 할 수 없는 것은?',
      choices: ['글자 색 바꾸기', '마우스를 올렸을 때(:hover) 색 바꾸기', '여백 주기', '너비를 계산된 값으로 주기'],
      answer: 1,
      explanation: '인라인 스타일로는 :hover, :focus 같은 상태와 미디어 쿼리를 쓸 수 없어요. 계산된 값(진행률 너비)은 오히려 인라인이 잘 맞아요.',
    },
    {
      id: 're03-3-q2',
      source: '인라인 스타일은 언제만 쓸까',
      type: 'ox',
      question: '진행률 막대처럼 실행 중에 계산되는 너비는 인라인 스타일로 넘기는 것이 자연스럽다.',
      answer: true,
      explanation: '색·모양은 클래스로 두고, 실행해 봐야 아는 값만 style로 넘겨요.',
    },
    {
      id: 're03-3-q3',
      source: 'CSS 모듈: 이름 충돌 막기',
      type: 'mcq',
      question: 'CSS 모듈(.module.css)이 해결하는 문제는?',
      choices: ['CSS 파일 용량이 큰 문제', '여러 파일에서 같은 클래스 이름이 서로 덮어쓰는 문제', '브라우저가 CSS를 못 읽는 문제', '다크 모드가 안 되는 문제'],
      answer: 1,
      explanation: '빌드할 때 클래스 이름에 고유한 꼬리표를 붙여서(.title → _title_nc2zs_2) 다른 파일과 겹치지 않게 해요.',
    },
    {
      id: 're03-3-q4',
      source: 'CSS 모듈: 이름 충돌 막기',
      type: 'short',
      question: 'CSS 모듈을 쓰려면 CSS 파일 이름을 무엇으로 끝내야 할까? (예: Card.____.css)',
      answer: ['module', '.module.css', 'module.css'],
      explanation: 'Card.module.css처럼 .module.css로 끝내면 Vite·Next.js가 CSS 모듈로 처리해요.',
    },
    {
      id: 're03-3-q5',
      source: 'Tailwind CSS',
      type: 'mcq',
      question: 'Tailwind CSS와 CSS 모듈의 관계로 옳은 것은?',
      choices: ['Tailwind는 CSS 모듈 위에서만 동작한다', '서로 다른 방식이며, 둘 다 클래스 이름 충돌을 각자의 방법으로 피한다', 'CSS 모듈은 Tailwind의 옛 이름이다', 'Tailwind를 쓰면 CSS 모듈이 자동으로 켜진다'],
      answer: 1,
      explanation: 'CSS 모듈은 이름에 고유값을 붙이고, Tailwind는 미리 만든 유틸리티 클래스를 조합해서 충돌할 이름 자체를 안 만들어요.',
    },
    {
      id: 're03-3-q6',
      source: 'Tailwind CSS',
      type: 'ox',
      question: 'Tailwind에서 @theme에 --color-brand 같은 디자인 토큰을 등록하면 bg-brand 같은 클래스를 쓸 수 있다.',
      answer: true,
      explanation: '토큰을 등록하면 관련 유틸리티 클래스가 자동으로 생겨요. 피그마 토큰과 코드를 맞추기 좋아요.',
    },
    {
      id: 're03-3-q7',
      source: 'Sass와 styled-components는?',
      type: 'ox',
      question: '지금의 CSS에는 변수가 없어서 색을 재사용하려면 반드시 Sass가 필요하다.',
      answer: false,
      explanation: '지금 CSS에는 변수(--brand, var()), 중첩, calc()·clamp() 같은 함수가 있어요. 반복문·믹스인 정도만 Sass에만 있어요.',
    },
    {
      id: 're03-3-q8',
      source: 'Sass와 styled-components는?',
      type: 'mcq',
      question: 'styled-components를 새 프로젝트에 잘 권하지 않는 이유로 옳은 것은?',
      choices: ['CSS를 전혀 쓸 수 없어서', '2025년 유지보수 모드가 선언됐고, 브라우저 실행 중에 스타일을 만들어 서버 컴포넌트와 잘 맞지 않아서', 'React 19에서 삭제되어서', '모바일에서 동작하지 않아서'],
      answer: 1,
      explanation: '메인테이너가 2025년 3월 유지보수 모드를 선언했어요. 런타임 CSS-in-JS라 Next.js 서버 컴포넌트와도 궁합이 나빠요. CSS 모듈이나 Tailwind를 써요.',
    },
    {
      id: 're03-3-q9',
      source: '다크 모드는 CSS 변수로',
      type: 'mcq',
      question: '다크 모드를 만드는 공통 원리는?',
      choices: ['다크 모드용 컴포넌트를 따로 하나씩 만든다', 'CSS 변수(디자인 토큰)의 값을 상황에 따라 바꿔치기한다', 'Tailwind를 설치하면 자동으로 된다', '이미지를 반전시킨다'],
      answer: 1,
      explanation: '컴포넌트는 var(--bg)만 쓰고, --bg 값을 라이트/다크에 따라 바꿔요. Tailwind의 dark:는 이걸 쉽게 쓰는 문법일 뿐이에요.',
    },
  ],
}

export default topic

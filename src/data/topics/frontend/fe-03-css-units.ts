import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-03-css-units',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '3강 - CSS 단위',
  order: 3,
  notionId: '3efdf951bf808174a291c8dac33febca',
  sections: [
    {
      title: 'px',
      slides: [
        {
          title: '크기에는 "무엇 기준"이 있어요',
          blocks: [
            { type: 'say', text: '이번 수업은 CSS **단위**예요. `width: 50`이라고만 쓰면 브라우저는 50 **뭐?** 하고 무시해요. 숫자 뒤에는 꼭 단위가 붙어야 해요.\n\n단위마다 **무엇을 기준으로** 크기를 정하는지가 달라요. 이 "기준"만 잡으면 이번 수업은 끝이에요.' },
            {
              type: 'table',
              head: ['단위', '기준'],
              rows: [
                ['`px`', '**고정** (화면의 점 하나)'],
                ['`%`', '**부모** 요소의 크기'],
                ['`em`', '**자기(부모)의 글자 크기**'],
                ['`rem`', '**루트(html)의 글자 크기**'],
                ['`vw` / `vh`', '**화면(뷰포트)** 너비 / 높이'],
              ],
            },
          ],
        },
        {
          title: 'px은 변하지 않아요',
          blocks: [
            { type: 'say', text: '`px`은 화면의 점(픽셀) 하나를 기준으로 한 **고정 크기**예요. 화면이 넓든 좁든, 글자 설정을 키우든 말든 `1px`은 `1px`이에요.' },
            { type: 'say', text: '그래서 **절대 변하면 안 되는 것**에 잘 맞아요.\n• 테두리 두께 `border: 1px solid` — 화면이 커진다고 선이 두꺼워지면 이상하죠\n• 작은 아이콘 크기, 그림자 거리' },
            { type: 'note', tone: 'warn', text: '반대로 **본문 글자 크기를 px로 고정**하면, 눈이 불편해서 브라우저 글자 크기를 키운 사용자에게도 글자가 안 커져요. 글자는 잠시 뒤에 배울 **rem**이 기본이에요.' },
          ],
        },
      ],
    },
    {
      title: '%',
      slides: [
        {
          title: '%는 부모의 몇 퍼센트',
          blocks: [
            { type: 'say', text: '`%`는 **나를 감싼 부모 요소** 크기를 기준으로 해요. 화면 기준이 아니에요!' },
            { type: 'code', code: `.wrap      { width: 800px; }
.wrap .box { width: 50%; }   /* 부모 800px의 50% → 400px */` },
            { type: 'note', tone: 'analogy', text: '피자 한 판을 생각해 보세요. "**반 판** 주세요"의 크기는 피자가 라지인지 레귤러인지에 따라 달라요. `%`도 똑같이 **부모가 얼마나 큰지**에 따라 결과가 달라져요.' },
          ],
        },
        {
          title: '높이 %가 안 먹는 이유',
          blocks: [
            { type: 'say', text: '`width: 50%`는 잘 되는데, `height: 50%`는 아무 변화가 없을 때가 많아요. 이유는 간단해요.\n\n요소의 높이는 보통 **내용만큼 저절로** 정해져요. 부모 높이가 "내용만큼"이면 정해진 숫자가 없는 거라서, "부모의 50%"를 **계산할 수가 없어요.**' },
            { type: 'code', code: `.parent { }                  /* 높이 없음 → 자식 height: 50%는 무시 */
.parent { height: 400px; }   /* 높이 있음 → 자식 height: 50% = 200px */` },
            { type: 'ask', q: '"반 판"을 달라고 했는데 피자 크기를 아무도 모른다면?', a: '반이 얼마인지 계산할 수 없죠. 높이 %도 **부모 높이가 정해져 있어야** 계산돼요. 화면 높이에 맞추고 싶다면 % 대신 뒤에서 배울 `vh`를 써요.' },
          ],
        },
      ],
    },
    {
      title: 'em',
      slides: [
        {
          title: 'em은 글자 크기의 몇 배',
          blocks: [
            { type: 'say', text: '`1em`은 **글자 크기 1개 분량**이에요. 글자 크기가 20px인 곳에서 `1em`은 20px, `0.5em`은 10px이에요.' },
            { type: 'code', code: `.card   { font-size: 20px; }
.card p {
  font-size: 0.8em;   /* 부모(.card) 글자 20px × 0.8 = 16px */
  padding: 1em;       /* 이번엔 "내" 글자 16px × 1 = 16px */
}` },
            { type: 'say', text: '`font-size`에 쓴 em은 **부모** 글자 크기 기준이고, 그 밖의 속성(padding, margin)에 쓴 em은 **내** 글자 크기 기준이에요. 그래서 em으로 여백을 주면 **글자가 커질 때 여백도 같이** 커져요. 버튼 안쪽 여백에 em을 많이 써요.' },
          ],
        },
        {
          title: 'em의 함정: 곱하기가 계속돼요',
          blocks: [
            { type: 'code', code: `<ul>              ← 16px
  <li>            ← 0.8em = 12.8px
    <ul>
      <li>        ← 12.8 × 0.8 = 10.24px
        <ul>
          <li>    ← 10.24 × 0.8 = 8.19px … 점점 작아짐

li { font-size: 0.8em; }` },
            { type: 'say', text: '목록 안에 목록을 넣었더니 안쪽으로 갈수록 글자가 **점점 작아져요.** em은 부모 기준이라 중첩될 때마다 **계속 곱해지기** 때문이에요. 몇 단계만 들어가도 계산하기 어려워져요.' },
            { type: 'say', text: '이 문제를 해결하려고 나온 단위가 바로 다음 개념, **rem**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'rem',
      slides: [
        {
          title: 'rem은 항상 같은 기준',
          blocks: [
            { type: 'say', text: '`rem`은 **r**oot **em**이에요. 부모가 아니라 문서 맨 꼭대기, **`<html>`의 글자 크기**만 기준으로 해요. 브라우저 기본값은 **16px**이에요.' },
            { type: 'code', code: `h2       { font-size: 1.5rem; }  /* 16 × 1.5 = 24px */
.section { padding: 2rem; }      /* 16 × 2 = 32px */` },
            { type: 'say', text: '아까처럼 목록을 열 번 겹쳐도 `0.8rem`은 **어디서나 12.8px**이에요. 기준이 하나뿐이라 예측하기 쉬워요.' },
            { type: 'note', tone: 'analogy', text: 'em은 "**바로 위 선배**보다 0.8배 크게"라서 선배가 바뀔 때마다 달라져요. rem은 "**교장 선생님** 기준 0.8배"라서 학교 안 어디서든 똑같아요.' },
          ],
        },
        {
          title: 'rem이 접근성에 좋은 이유',
          blocks: [
            { type: 'say', text: '시력이 약한 사용자는 브라우저 설정에서 **기본 글자 크기를 16px → 24px**로 키워요. 이러면 html 글자 크기가 바뀌죠.\n• rem으로 만든 글자 → html 기준이니 **같이 1.5배 커져요** ✅\n• px로 고정한 글자 → 설정을 무시하고 그대로 ❌' },
            { type: 'note', tone: 'tip', text: '시안의 px을 rem으로 바꾸는 공식: **px ÷ 16**\n16px → 1rem, 24px → 1.5rem, 32px → 2rem, 14px → 0.875rem' },
            { type: 'ask', q: '피그마 시안에 제목이 40px이에요. rem으로 쓰면?', a: '40 ÷ 16 = **2.5rem**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'vw, vh',
      slides: [
        {
          title: '화면 크기를 기준으로',
          blocks: [
            { type: 'say', text: '`vw`, `vh`는 **뷰포트**(브라우저에서 실제로 보이는 영역) 기준이에요. 부모가 누구든 상관없어요.' },
            { type: 'list', items: ['`100vw` = 화면 너비 **전체**, `50vw` = 화면 너비의 절반', '`100vh` = 화면 높이 **전체**', '`vmin` = 너비·높이 중 **작은** 쪽 기준, `vmax` = **큰** 쪽 기준'] },
            { type: 'code', code: `/* 들어가자마자 화면을 꽉 채우는 첫 화면 */
.hero { height: 100vh; }` },
          ],
        },
        {
          title: '모바일 100vh 함정과 dvh',
          blocks: [
            { type: 'say', text: '휴대폰 브라우저는 위아래 **주소창**이 스크롤에 따라 나타났다 사라져요. 그런데 `100vh`는 주소창이 **사라졌을 때의 큰 높이**로 계산돼요. 그래서 주소창이 보이는 처음 상태에선 화면이 살짝 **넘쳐서** 아래가 잘려요.' },
            { type: 'code', code: `.hero { height: 100dvh; }   /* d = dynamic, 지금 실제로 보이는 높이 */` },
            { type: 'say', text: '`dvh`는 주소창 상태에 맞춰 **지금 실제로 보이는 높이**를 써요. "모바일에서 꽉 찬 화면이 살짝 넘쳐요" 하면 dvh를 떠올리세요.' },
          ],
        },
      ],
    },
    {
      title: '어떤 단위를 쓸까?',
      slides: [
        {
          title: '상황별 추천 단위',
          blocks: [
            { type: 'say', text: '단위가 너무 많아서 헷갈리죠? 실무에서는 대부분 이 표대로 골라요.' },
            {
              type: 'table',
              head: ['어디에', '단위', '이유'],
              rows: [
                ['글자 크기', '**rem**', '예측 쉽고 사용자 글자 설정을 따라감'],
                ['여백', 'rem (글자에 맞춰 늘리려면 **em**)', '버튼 안쪽 여백은 글자 따라 커지는 em이 자연스러움'],
                ['레이아웃 너비', '**%**, **max-width**', '부모에 맞춰 늘고 줄되, 너무 넓어지진 않게'],
                ['테두리', '**px**', '절대 변하면 안 됨'],
                ['전체 화면 섹션', '**vh** (dvh)', '화면 높이에 맞춤'],
              ],
            },
            { type: 'ask', q: '테두리를 `0.1vh`로 주면 어떤 일이 생길까요?', a: '화면 높이에 따라 선 두께가 바뀌어요. 큰 모니터에선 두꺼워지고, 작은 화면에선 거의 안 보여요. 테두리처럼 **변하면 안 되는 건 px**이에요.' },
          ],
        },
      ],
    },
    {
      title: '함께 쓰면 좋은 함수',
      slides: [
        {
          title: 'min()과 calc()',
          blocks: [
            { type: 'say', text: '단위 하나로는 아쉬울 때, CSS **함수**로 단위를 섞어 쓸 수 있어요.' },
            { type: 'code', code: `.container { width: min(90%, 1200px); }
.sidebar   { width: calc(100% - 240px); }` },
            { type: 'list', items: ['`min(90%, 1200px)` → 둘 중 **작은 값**. 좁은 폰에선 90%, 넓은 모니터에선 1200px에서 멈춰요. "화면의 90%이되 최대 1200px"을 한 줄로!', '`calc(100% - 240px)` → **다른 단위끼리 계산**. "왼쪽 메뉴 240px 빼고 나머지 전부"'] },
            { type: 'note', tone: 'warn', text: '`calc()` 안의 `+`, `-` 양옆에는 **반드시 띄어쓰기**를 해야 해요. `calc(100%-240px)`는 작동하지 않아요.' },
          ],
        },
        {
          title: 'clamp(): 최소·기본·최대',
          blocks: [
            { type: 'code', code: `.title { font-size: clamp(1.5rem, 4vw, 3rem); }
/* clamp(최소, 기본, 최대) → 최소 1.5rem, 평소 4vw, 최대 3rem */` },
            { type: 'say', text: '`clamp`는 "평소엔 **가운데 값**(4vw)으로 하되, **최소**보다 작아지지도 **최대**보다 커지지도 마"라는 뜻이에요.\n\n그래서 제목이 화면 크기에 따라 **부드럽게** 커지고 작아지면서도, 폰에서 너무 작아지거나 큰 모니터에서 너무 커지지 않아요.' },
            { type: 'note', tone: 'analogy', text: '에어컨 자동 모드예요. "평소엔 바깥 온도에 맞춰 알아서 조절하되, **18도 아래로도, 28도 위로도 가지 마**." 가운데 값은 상황 따라 움직이고, 양 끝은 안전장치예요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-03-01', type: 'mcq', source: 'px', question: 'px 단위가 가장 적합한 곳은?', choices: ['본문 글자 크기', '테두리 두께', '전체 화면 섹션 높이', '레이아웃 너비'], answer: 1, explanation: 'px는 고정 크기라 변하지 않아야 하는 테두리·아이콘에 적합해요.' },
    { id: 'fe-03-02', type: 'short', source: '%', question: '부모 width가 800px일 때 자식 width: 50%는 몇 px? (숫자만)', answer: ['400', '400px'], explanation: '%는 부모 요소 기준 → 800 × 0.5 = 400px.' },
    { id: 'fe-03-03', type: 'ox', source: '%', question: 'height를 %로 주면 부모 높이와 상관없이 항상 적용된다.', answer: false, explanation: '부모에 높이가 정해져 있어야 % 높이가 계산돼요.' },
    { id: 'fe-03-04', type: 'short', source: 'em', question: '.card { font-size: 20px } 안의 p에 font-size: 0.8em 이면 몇 px? (숫자만)', answer: ['16', '16px'], explanation: 'em은 부모 font-size 기준 → 20 × 0.8 = 16px.' },
    { id: 'fe-03-05', type: 'ox', source: 'em', question: 'em은 중첩될수록 값이 곱해져 계산이 복잡해질 수 있다.', answer: true, explanation: '부모의 em 값이 다시 기준이 되기 때문이에요.' },
    { id: 'fe-03-06', type: 'mcq', source: 'rem', question: 'rem 단위의 기준이 되는 것은?', choices: ['화면 너비', '부모 요소의 font-size', 'html(루트)의 font-size', '브라우저 창 높이'], answer: 2, choiceExplanations: ['화면 너비 기준은 vw예요.', '부모(자기) font-size 기준은 em이라 중첩되면 곱해져요.', '정답. 루트(html) 기준이라 중첩돼도 항상 같아요.', '창 높이 기준은 vh예요.'], explanation: 'rem(root em)은 html의 font-size가 기준이에요. 부모 font-size가 기준인 건 em이에요.' },
    { id: 'fe-03-07', type: 'short', source: 'rem', question: '브라우저 기본 font-size 기준으로 1.5rem은 몇 px? (숫자만)', answer: ['24', '24px'], explanation: '16 × 1.5 = 24px.' },
    { id: 'fe-03-08', type: 'essay', source: 'rem', question: 'rem이 em보다 크기를 예측하기 쉬운 이유와, 접근성에 유리한 이유를 설명하세요.', answer: 'rem은 항상 루트(html)의 font-size 하나만 기준으로 해서 요소가 몇 번 중첩되어도 1rem은 같은 크기예요. em은 부모 font-size 기준이라 중첩될수록 값이 곱해져요. 또 사용자가 브라우저 글자 크기를 키우면 루트 크기가 바뀌어 rem으로 만든 크기도 같이 커져서 접근성에 유리해요.', keywords: ['루트 기준', '중첩', '브라우저 글자 크기'], explanation: '글자 크기는 rem이 일반적인 기준이에요.' },
    { id: 'fe-03-09', type: 'mcq', source: 'vw, vh', question: '모바일에서 100vh가 화면을 넘칠 때 대안으로 쓰는 단위는?', choices: ['100%', '100dvh', '100vmax', '100rem'], answer: 1, explanation: '주소창 높이 때문에 100vh가 넘칠 수 있어, 실제 보이는 높이 기준인 dvh를 써요.' },
    { id: 'fe-03-10', type: 'ox', source: 'vw, vh', question: 'vmin은 화면 너비와 높이 중 작은 쪽 기준이다.', answer: true, explanation: 'vmin = 작은 쪽, vmax = 큰 쪽 기준.' },
    { id: 'fe-03-11', type: 'mcq', source: '어떤 단위를 쓸까?', question: '일반적인 단위 선택 기준으로 어색한 것은?', choices: ['글자 크기 → rem', '테두리 → px', '레이아웃 너비 → %, max-width', '테두리 두께 → vh'], answer: 3, explanation: '테두리는 고정 px. vh는 전체 화면 섹션처럼 화면 높이에 맞출 때 써요.' },
    { id: 'fe-03-12', type: 'mcq', source: '함께 쓰면 좋은 함수', question: 'font-size: clamp(1.5rem, 4vw, 3rem) 의 의미는?', choices: ['항상 4vw', '최소 1.5rem, 기본 4vw, 최대 3rem', '1.5rem과 3rem의 평균', '4vw보다 작아지지 않음'], answer: 1, explanation: 'clamp(최소, 기본, 최대): 4vw로 커지고 작아지되 1.5rem~3rem 사이로 제한해요.' },
    { id: 'fe-03-13', type: 'short', source: '함께 쓰면 좋은 함수', question: '피그마 시안의 32px을 rem으로 바꾸면? (기본 16px 기준, 숫자+rem)', answer: ['2rem'], explanation: 'px ÷ 16 = rem → 32 ÷ 16 = 2rem.' },
    { id: 'fe-03-14', type: 'mcq', source: '함께 쓰면 좋은 함수', question: '"화면의 90%이되 최대 1200px"을 한 줄로 쓰는 방법은?', choices: ['width: max(90%, 1200px)', 'width: min(90%, 1200px)', 'width: calc(90% + 1200px)', 'width: clamp(90%, 1200px)'], answer: 1, explanation: 'min()은 둘 중 작은 값 → 넓은 화면에선 1200px, 좁은 화면에선 90%.' },
  ],
}

export default topic

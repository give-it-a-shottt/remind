import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-15-responsive',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '15강 - 미디어 쿼리와 반응형 웹',
  order: 15,
  notionId: '3efdf951bf8081d1a04bc720c986f980',
  sections: [
    {
      title: '반응형 웹',
      slides: [
        {
          title: '하나의 코드, 여러 화면',
          blocks: [
            { type: 'say', text: '지금 이 앱을 휴대폰으로 보면 한 줄로, PC로 보면 넓게 펼쳐져 보이죠? 이렇게 **코드는 하나인데 화면 크기에 따라 레이아웃이 알아서 바뀌는** 웹을 **반응형 웹**이라고 해요.\n\n예전에는 `m.naver.com`처럼 **모바일 사이트를 따로** 만들기도 했어요. 그러면 고칠 때 두 벌을 다 고쳐야 하죠. 반응형은 한 벌로 모바일·태블릿·PC를 모두 지원해요.' },
            { type: 'note', tone: 'analogy', text: '반응형 웹은 **물**과 같아요. 컵에 부으면 컵 모양, 병에 부으면 병 모양이 되죠. 내용(물)은 하나인데 담기는 그릇(화면)에 맞춰 모양이 바뀌어요.' },
          ],
        },
      ],
    },
    {
      title: 'viewport meta',
      slides: [
        {
          title: '반응형의 첫 줄',
          blocks: [
            { type: 'code', code: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' },
            { type: 'say', text: '1강에서 "무조건 넣는다"고 했던 그 한 줄이에요. 이제 이유를 정확히 알 때가 됐어요.\n\n이 줄이 없으면 휴대폰 브라우저는 "이 사이트는 PC용이겠지" 하고 **가로 980px짜리 가상 화면**에 페이지를 그린 다음, 그걸 **손톱만 하게 축소**해서 보여 줘요.' },
            { type: 'say', text: '그러면 진짜 문제가 생겨요. 다음에 배울 미디어 쿼리로 "화면이 767px 이하면 모바일 레이아웃"이라고 써 놔도, 브라우저는 화면 폭을 **980px**이라고 생각하니까 **모바일 CSS가 아예 적용되지 않아요.**\n\n`width=device-width`는 "가상 화면 말고 **기기의 진짜 폭**을 써"라는 뜻이에요.' },
            { type: 'ask', q: '미디어 쿼리를 열심히 짰는데, 개발자 도구에서는 잘 되고 실제 폰에서는 PC 화면이 작게 보여요. 가장 먼저 의심할 곳은?', a: '`<head>`에 **viewport meta 태그**가 있는지예요. 개발자 도구의 디바이스 툴바는 이 태그가 없어도 비슷하게 보여 줄 때가 있어서, 실제 폰에서야 문제가 드러나기도 해요.' },
          ],
        },
      ],
    },
    {
      title: '@media 문법',
      slides: [
        {
          title: '조건부 CSS',
          blocks: [
            { type: 'say', text: '**미디어 쿼리**는 "**이 조건일 때만** 이 CSS를 적용해"라는 문법이에요. 반응형의 핵심 도구예요.' },
            { type: 'code', code: `/* 화면 폭이 767px "이하"일 때만 */
@media (max-width: 767px) {
  .menu { display: none; }
}

/* 화면 폭이 768px "이상"일 때만 */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* 768px 이상 "그리고" 1023px 이하 (태블릿) */
@media (min-width: 768px) and (max-width: 1023px) { ... }` },
            { type: 'note', tone: 'warn', text: '`max`와 `min`이 헷갈리기 쉬워요.\n• `max-width: 767px` = 폭의 **최대**가 767 → **767 이하**\n• `min-width: 768px` = 폭의 **최소**가 768 → **768 이상**\n"max는 이하, min은 이상"으로 외우세요.' },
          ],
        },
        {
          title: '폭 말고도 조건이 있어요',
          blocks: [
            {
              type: 'table',
              head: ['조건', '언제 적용'],
              rows: [
                ['`(orientation: landscape)`', '기기를 **가로로** 눕혔을 때 (portrait는 세로)'],
                ['`print`', '**인쇄**할 때 — 메뉴·광고를 숨기고 글만 인쇄'],
                ['`(prefers-color-scheme: dark)`', '사용자가 **다크 모드**를 켰을 때'],
                ['`(prefers-reduced-motion: reduce)`', '**동작 줄이기**를 켰을 때 (11강)'],
              ],
            },
            { type: 'code', code: `@media print {
  .header, .footer, .ad { display: none; }
}` },
          ],
        },
      ],
    },
    {
      title: '브레이크포인트',
      slides: [
        {
          title: '레이아웃이 바뀌는 지점',
          blocks: [
            { type: 'say', text: '미디어 쿼리에서 레이아웃을 바꾸는 기준 폭을 **브레이크포인트**(breakpoint)라고 해요. 흔히 이렇게 나눠요.' },
            {
              type: 'table',
              head: ['구간', '폭', '예시 레이아웃'],
              rows: [
                ['모바일', '~ 767px', '카드 1열, 햄버거 메뉴'],
                ['태블릿', '768 ~ 1023px', '카드 2열'],
                ['PC', '1024px ~', '카드 3~4열, 메뉴 펼침'],
              ],
            },
          ],
        },
        {
          title: '기기 말고 디자인 기준으로',
          blocks: [
            { type: 'say', text: '"아이폰 15는 393px이니까 393에 맞추자"처럼 **특정 기기**에 맞추고 싶어지죠. 하지만 기기는 매년 새로 나오고 크기도 제각각이에요. 기기 목록을 쫓아가면 끝이 없어요.\n\n더 좋은 방법은 **브라우저 창을 천천히 줄여 보면서, 디자인이 깨지는 지점**을 찾는 거예요. 카드가 너무 좁아져 글자가 세 줄로 꺾이는 순간, 그 폭이 바로 브레이크포인트예요.' },
            { type: 'note', tone: 'tip', text: '위 표의 숫자는 **출발점**일 뿐 정답이 아니에요. 팀에서 하나로 정해 두고 같이 쓰는 게 중요해요.' },
          ],
        },
      ],
    },
    {
      title: '모바일 퍼스트',
      slides: [
        {
          title: '작은 화면부터 짜기',
          blocks: [
            { type: 'code', code: `/* 기본 = 모바일: 카드 1열 */
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* 화면이 커지면 "추가" */
@media (min-width: 768px)  { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }` },
            { type: 'say', text: '**모바일 퍼스트**는 미디어 쿼리 **밖의 기본 CSS를 모바일 기준**으로 쓰고, `min-width`로 화면이 **커질 때 필요한 것만 더해 가는** 방식이에요. 반대로 PC를 기본으로 쓰고 `max-width`로 줄여 가는 건 "데스크톱 퍼스트"예요.' },
          ],
        },
        {
          title: '왜 모바일부터일까',
          blocks: [
            { type: 'list', items: ['**모바일은 가벼워요** — 폰은 기본 CSS만 쓰고, 큰 화면용 규칙은 조건이 안 맞아 건너뛰어요. 성능이 약한 기기가 덜 일해요', '**코드가 자연스럽게 쌓여요** — 1열 → 2열 → 3열, "더하기"만 하면 돼요. PC 기준이면 "3열이었던 걸 취소하고 1열로, 사이드바 숨기고…" **빼기**가 많아져요', '**중요한 것부터 생각하게 돼요** — 좁은 화면엔 꼭 필요한 것만 들어가니, 콘텐츠 우선순위가 분명해져요'] },
            { type: 'note', tone: 'analogy', text: '여행 짐 싸기와 같아요. **작은 배낭**(모바일)에 꼭 필요한 것부터 넣고, 큰 캐리어(PC)를 쓸 땐 여유 있게 더 넣는 게 쉬워요. 큰 캐리어 기준으로 싼 짐을 배낭에 맞춰 **빼는** 건 훨씬 어렵죠.' },
          ],
        },
      ],
    },
    {
      title: '반응형 이미지',
      slides: [
        {
          title: '이미지가 화면 밖으로 삐져나가요',
          blocks: [
            { type: 'code', code: `img {
  max-width: 100%;   /* 부모보다 넓어지지 않게 */
  height: auto;      /* 너비가 줄면 높이도 비율대로 */
}` },
            { type: 'say', text: '가로 1200px 사진을 375px 폰에서 보면 화면 밖으로 삐져나가서 **가로 스크롤**이 생겨요. `max-width: 100%`면 부모보다 커지지 않고, `height: auto`가 비율을 지켜서 찌그러지지 않아요. 2강 리셋 CSS의 그 줄이에요.\n\n`width: 100%`가 아니라 `max-width`인 이유: 작은 아이콘 이미지까지 부모 폭만큼 **억지로 늘어나면** 안 되니까요. "최대 100%까지만"이에요.' },
          ],
        },
        {
          title: '화면마다 다른 사진: picture',
          blocks: [
            { type: 'code', code: `<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.jpg" />
  <source media="(min-width: 768px)"  srcset="hero-mid.jpg" />
  <img src="hero-mobile.jpg" alt="갓 구운 빵이 진열된 매장" />
</picture>` },
            { type: 'say', text: 'PC용 가로로 긴 배너를 폰에서 줄이면 주인공이 콩알만 해져요. 이럴 땐 폰에는 **세로로 자른 다른 사진**을 보여 주는 게 나아요.\n\n`<picture>` 안의 `<source>`를 **위에서부터** 확인해서 조건(`media`)이 맞는 첫 이미지를 쓰고, 다 안 맞으면 마지막 `<img>`를 써요. 폰은 **작은 사진만 내려받으니** 데이터도 아껴요. alt는 `<img>`에 한 번만 쓰면 돼요.' },
          ],
        },
      ],
    },
    {
      title: '미디어 쿼리 없이도 반응형',
      slides: [
        {
          title: '알아서 늘고 주는 CSS',
          blocks: [
            { type: 'say', text: '미디어 쿼리가 반응형의 전부는 아니에요. 지금까지 배운 것 중에 **원래부터 유연한** 도구가 많아요.' },
            { type: 'list', items: ['`%`, `max-width` — 부모에 맞춰 늘고 줄되 너무 넓어지지 않게 (3강)', '`clamp(1.5rem, 4vw, 3rem)` — 글자가 화면에 따라 부드럽게 (3강)', '`flex-wrap: wrap` — 자리가 모자라면 알아서 다음 줄로 (16강)'] },
            { type: 'code', code: `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}` },
            { type: 'say', text: '이 한 줄이 마법 같아요. "카드는 **최소 220px**, 남는 공간이 있으면 **늘어나서(1fr)** 채우고, 한 줄에 **들어갈 만큼(auto-fit)** 넣어." 화면이 넓으면 4열, 좁아지면 3열, 2열, 1열로 **미디어 쿼리 한 줄 없이** 바뀌어요. grid는 16강에서 자세히 배워요.' },
          ],
        },
      ],
    },
    {
      title: '테스트',
      slides: [
        {
          title: '여러 화면에서 확인하기',
          blocks: [
            { type: 'say', text: '반응형은 **확인**이 반이에요. 0강에서 배운 크롬 개발자 도구의 **디바이스 툴바**(`F12` → `Ctrl + Shift + M`)를 켜면 아이폰, 갤럭시, 아이패드 크기를 골라 보거나, 폭을 직접 끌어서 바꿔 볼 수 있어요.' },
            { type: 'list', items: ['폭을 **천천히 끌어 보며** 깨지는 지점이 없는지 (브레이크포인트 사이도!)', '**가로 스크롤**이 생기지 않는지 — 생기면 뭔가가 화면보다 넓다는 신호', '버튼이 **손가락으로 누르기에** 충분히 큰지 (최소 44px 정도)'] },
            { type: 'note', tone: 'warn', text: '디바이스 툴바는 **흉내**일 뿐이에요. 실제 폰은 주소창 높이(3강의 100vh 문제), 터치 동작, 글꼴 렌더링이 달라요. 마무리 전에는 꼭 **진짜 휴대폰**으로도 열어 보세요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-15-01', type: 'ox', source: '반응형 웹', question: '반응형 웹은 모바일용 사이트와 PC용 사이트를 따로 만드는 방식이다.', answer: false, explanation: '하나의 코드로 화면 크기에 따라 레이아웃이 바뀌는 방식이에요.' },
    { id: 'fe-15-02', type: 'mcq', source: 'viewport meta', question: 'viewport meta 태그가 없으면 모바일에서 생기는 일은?', choices: ['폰트가 깨진다', 'PC 화면을 축소해서 보여줘 미디어 쿼리가 제대로 안 먹힌다', 'JavaScript가 실행되지 않는다', '이미지가 안 뜬다'], answer: 1, explanation: '모바일 브라우저가 약 980px 가상 화면으로 렌더링해서 축소해 보여줘요.' },
    { id: 'fe-15-03', type: 'mcq', source: '@media 문법', question: '"768px 이상"일 때만 적용하는 미디어 쿼리는?', choices: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media (width: 768px)', '@media screen and (768px)'], answer: 1, explanation: 'min-width = 이상, max-width = 이하.' },
    { id: 'fe-15-04', type: 'short', source: '@media 문법', question: '인쇄할 때만 적용하는 미디어 타입은? (@media ?)', answer: ['print'], explanation: '@media print { ... }' },
    { id: 'fe-15-05', type: 'ox', source: '브레이크포인트', question: '브레이크포인트는 기기 이름(아이폰, 갤럭시) 기준으로 정하는 것이 가장 좋다.', answer: false, explanation: '정답은 없고 디자인이 깨지는 지점(너비)에 맞추는 게 좋아요.' },
    { id: 'fe-15-06', type: 'essay', source: '모바일 퍼스트', question: '모바일 퍼스트로 CSS를 작성하는 방법과 장점을 설명하세요.', answer: '기본 스타일을 모바일 기준(1열 등)으로 작성하고, @media (min-width: ...)로 화면이 커질 때 필요한 스타일만 추가한다. 모바일은 가벼운 기본 CSS만 적용받고, 큰 화면 스타일이 자연스럽게 덧붙는 구조라 코드가 단순해진다.', keywords: ['min-width', '기본 = 모바일', '추가'], explanation: '이 사이트도 모바일 퍼스트로 만들었어요.' },
    { id: 'fe-15-07', type: 'short', source: '반응형 이미지', question: '이미지가 부모보다 커지지 않게 하는 CSS (속성: 값)?', answer: ['max-width: 100%', 'max-width:100%'], explanation: 'img { max-width: 100%; height: auto; }' },
    { id: 'fe-15-08', type: 'mcq', source: '반응형 이미지', question: '화면 크기에 따라 아예 다른 이미지 파일을 보여주는 HTML 태그는?', choices: ['<figure>', '<picture>', '<canvas>', '<video>'], answer: 1, explanation: '<picture> 안에 <source media srcset>를 두고 기본 <img>를 마지막에.' },
    { id: 'fe-15-09', type: 'mcq', source: '미디어 쿼리 없이도 반응형', question: '미디어 쿼리 없이 "최소 220px, 남으면 늘어나는" 카드 그리드를 만드는 값은?', choices: ['repeat(3, 1fr)', 'repeat(auto-fit, minmax(220px, 1fr))', 'minmax(1fr, 220px)', 'auto 220px'], answer: 1, explanation: 'auto-fit + minmax로 들어갈 수 있는 만큼 열을 자동으로 만들어요.' },
    { id: 'fe-15-10', type: 'short', source: '테스트', question: '크롬 개발자 도구에서 디바이스 툴바를 여는 단축키는? (Windows)', answer: ['Ctrl + Shift + M', 'Ctrl+Shift+M'], explanation: 'Ctrl + Shift + M. 실제 휴대폰 확인도 함께.' },
  ],
}

export default topic

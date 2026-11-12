import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-16-layout',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '16강 - 레이아웃 (Flexbox & Grid)',
  order: 16,
  notionId: '3efdf951bf808127b78defb3abf27333',
  sections: [
    {
      title: 'Flexbox',
      slides: [
        {
          title: '드디어 레이아웃의 주인공',
          blocks: [
            { type: 'say', text: 'HTML/CSS 마지막 수업이에요! 지금까지 inline-block의 틈(7강), float의 부모 높이 0(13강)처럼 가로 배치가 늘 골치였죠. 그 고생을 끝낸 게 **Flexbox**(flex)와 **Grid**예요.\n\n먼저 flex부터 볼게요. flex는 요소들을 **한 방향**(가로 또는 세로)으로 줄 세우고 정렬하는 도구예요.' },
            { type: 'code', code: `.menu { display: flex; }   /* 부모에게만 주면 끝 */

<ul class="menu">           ← flex container (부모)
  <li>홈</li>               ← flex item (직속 자식)
  <li>메뉴</li>
  <li>오시는 길</li>
</ul>                       → 홈  메뉴  오시는 길  (가로로 나란히, 틈 없이)` },
            { type: 'say', text: '`display: flex`는 **부모**에게 줘요. 그러면 부모의 **바로 아래 자식들**이 flex 규칙에 따라 배치돼요. 손자는 영향을 안 받아요. 손자까지 배치하려면 자식에게도 `display: flex`를 줘야 해요.' },
          ],
        },
        {
          title: '주축과 교차축',
          blocks: [
            { type: 'say', text: 'flex를 이해하는 열쇠는 **축 두 개**예요.' },
            { type: 'code', code: `flex-direction: row (기본)

  주축 (main axis) ---------------->

  +--------+ +--------+ +--------+    |
  |   A    | |   B    | |   C    |    |  교차축
  +--------+ +--------+ +--------+    v  (cross axis)` },
            { type: 'list', items: ['**주축** — 아이템들이 **줄 서는 방향**. 기본은 가로(→)', '**교차축** — 주축과 **수직인** 방향. 기본은 세로(↓)'] },
            { type: 'note', tone: 'analogy', text: '**기차**를 생각해요. 객차가 이어지는 방향이 주축(선로 방향), 객차의 높이 방향이 교차축이에요. 기차를 세워서 엘리베이터처럼 위아래로 이으면(column) 축도 같이 돌아가요.' },
          ],
        },
      ],
    },
    {
      title: '컨테이너 속성',
      slides: [
        {
          title: '방향과 주축 정렬',
          blocks: [
            {
              type: 'table',
              head: ['속성', '값', '하는 일'],
              rows: [
                ['`flex-direction`', '`row`(기본) / `column`', '주축 방향: 가로 / 세로'],
                ['`justify-content`', '`flex-start`, `center`, `space-between`, `space-around`, `space-evenly`', '**주축** 방향 정렬'],
                ['`align-items`', '`stretch`(기본), `flex-start`, `center`, `flex-end`', '**교차축** 방향 정렬'],
              ],
            },
            { type: 'code', code: `space-between   [A]        [B]        [C]     ← 양 끝 붙이고 사이를 똑같이
space-around     [A]      [B]      [C]       ← 아이템마다 양옆에 같은 여백
space-evenly       [A]    [B]    [C]         ← 모든 틈이 똑같이` },
          ],
        },
        {
          title: 'column이면 역할이 바뀌어요',
          blocks: [
            { type: 'say', text: '가장 많이 헷갈리는 부분이에요. `justify-content`는 "가로 정렬"이 아니라 **"주축 정렬"** 이에요. 그래서 `flex-direction: column`으로 주축이 세로가 되면…' },
            {
              type: 'table',
              head: ['', 'row (기본)', 'column'],
              rows: [
                ['`justify-content`', '가로 정렬', '**세로** 정렬'],
                ['`align-items`', '세로 정렬', '**가로** 정렬'],
              ],
            },
            { type: 'say', text: '"가로냐 세로냐"로 외우지 말고 **"주축이냐 교차축이냐"** 로 외우세요. 그러면 방향이 바뀌어도 안 헷갈려요.' },
          ],
        },
        {
          title: '줄바꿈과 간격',
          blocks: [
            { type: 'code', code: `.tags {
  display: flex;
  flex-wrap: wrap;   /* 자리가 모자라면 다음 줄로 */
  gap: 8px;          /* 아이템 사이 간격 */
}` },
            { type: 'list', items: ['`flex-wrap` — 기본 `nowrap`이라 자리가 모자라도 **한 줄에 우겨 넣으며 찌그러뜨려요.** `wrap`이면 넘치는 아이템이 다음 줄로 내려가요', '`gap` — 아이템 **사이에만** 간격. margin처럼 양 끝에 쓸데없는 여백이 안 생겨요'] },
            { type: 'ask', q: '헤더에서 로고는 왼쪽 끝, 메뉴는 오른쪽 끝으로 보내려면 justify-content를 무엇으로 줄까요?', a: '`space-between`이에요. 아이템이 둘(로고, 메뉴 묶음)이면 양 끝에 하나씩 붙고 가운데가 전부 빈 공간이 돼요. 헤더의 단골 조합이에요.' },
          ],
        },
      ],
    },
    {
      title: '아이템 속성',
      slides: [
        {
          title: 'grow, shrink, basis',
          blocks: [
            { type: 'say', text: '이번엔 **자식(아이템)** 에게 주는 속성이에요. 남거나 모자라는 공간을 **어떻게 나눌지** 정해요.' },
            {
              type: 'table',
              head: ['속성', '뜻', '기본값'],
              rows: [
                ['`flex-grow`', '공간이 **남을 때** 나눠 가지는 비율', '0 (안 늘어남)'],
                ['`flex-shrink`', '공간이 **모자랄 때** 줄어드는 비율', '1 (줄어듦) — **0이면 안 줄어듦**'],
                ['`flex-basis`', '늘고 줄기 전의 **기본 크기**', 'auto (내용만큼)'],
              ],
            },
            { type: 'code', code: `flex: 1 1 200px;   /* grow shrink basis 단축 */
flex: 1;           /* = 1 1 0 → 기본 크기 0에서 시작해 남는 공간을 "똑같이" 나눠 갖기 */
flex: 0 0 240px;   /* 늘지도 줄지도 않는 고정 240px */` },
            { type: 'note', tone: 'analogy', text: '피자를 나누는 거예요. **basis**는 각자 처음 받은 몫, **grow**는 남은 피자를 더 받을 비율, **shrink**는 피자가 모자랄 때 양보할 비율이에요. `flex: 1`을 모두에게 주면 "처음 몫 0, 남은 피자를 똑같이" → 공평하게 n등분이에요.' },
          ],
        },
        {
          title: '하나만 따로: align-self, order',
          blocks: [
            { type: 'code', code: `.item.special { align-self: flex-end; }   /* 이 아이템만 교차축 끝으로 */
.item.first   { order: -1; }              /* 화면에서 맨 앞으로 (기본 0) */` },
            { type: 'say', text: '`align-self`는 부모의 `align-items`를 **이 아이템만** 덮어써요. `order`는 HTML 순서는 그대로 두고 **보이는 순서만** 바꿔요. 숫자가 작을수록 앞이에요.' },
            { type: 'note', tone: 'warn', text: '`order`로 순서를 바꿔도 **Tab 키 이동 순서와 스크린리더가 읽는 순서는 HTML 순서 그대로**예요. 보이는 순서와 읽는 순서가 달라지면 헷갈리니, 중요한 순서 변경은 HTML 자체를 바꾸세요.' },
          ],
        },
      ],
    },
    {
      title: 'flex 패턴',
      slides: [
        {
          title: '실무 단골 패턴 네 가지',
          blocks: [
            { type: 'code', code: `/* ① 정중앙 — 9강의 translate 방법보다 쉬워요 */
.center { display: flex; justify-content: center; align-items: center; }

/* ② 헤더: 양 끝 */
.header { display: flex; justify-content: space-between; align-items: center; }

/* ③ 사이드바 고정 + 본문은 나머지 전부 */
.layout   { display: flex; }
.sidebar  { flex: 0 0 240px; }   /* 240px 고정, 줄지도 않음 */
.content  { flex: 1; }           /* 남는 공간 전부 */` },
            { type: 'say', text: '③에서 사이드바에 `flex-shrink: 0`(단축 `0 0 240px`의 가운데 0)을 안 주면, 화면이 좁아질 때 사이드바가 **찌그러져요.** "고정 폭"을 원하면 shrink를 0으로!' },
          ],
        },
        {
          title: '카드 버튼을 항상 맨 아래로',
          blocks: [
            { type: 'code', code: `.card {
  display: flex;
  flex-direction: column;     /* 카드 안을 세로로 줄 세우기 */
}
.card .btn { margin-top: auto; }   /* 위쪽 남는 공간을 전부 먹어서 맨 아래로 밀림 */` },
            { type: 'say', text: '카드 세 개를 나란히 놨는데 설명 길이가 달라서 **버튼 높이가 들쭉날쭉**한 경우, 정말 흔하죠. 카드를 세로 flex로 만들고 버튼에 `margin-top: auto`를 주면 버튼이 항상 **카드 맨 아래**에 붙어요.\n\n5강에서 `margin: 0 auto`의 auto가 "남는 공간을 나눠 가져"였죠? flex 안에서 `margin-top: auto`는 "**위쪽** 남는 공간을 **전부** 내가 가질게"라서 버튼이 바닥까지 밀려나요.' },
          ],
        },
      ],
    },
    {
      title: 'Grid',
      slides: [
        {
          title: '행과 열을 동시에',
          blocks: [
            { type: 'say', text: 'flex가 **한 줄**(1차원)을 다룬다면, **Grid**는 **행과 열을 동시에**(2차원) 다뤄요. 엑셀 표처럼 칸을 먼저 그어 두고 거기에 아이템을 채워 넣는 방식이에요.' },
            { type: 'code', code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 같은 너비의 열 3개 */
  gap: 16px;
}` },
            { type: 'say', text: '`fr`(fraction, 몫)은 Grid 전용 단위로, **남는 공간의 비율**이에요. `1fr 1fr 1fr`이면 똑같이 3등분, `2fr 1fr`이면 2 : 1로 나눠요. `repeat(3, 1fr)`은 `1fr 1fr 1fr`을 줄여 쓴 거예요.\n\n15강의 `repeat(auto-fit, minmax(220px, 1fr))`도 이제 읽히죠? "최소 220px, 최대 1fr인 열을 들어갈 만큼"이에요.' },
          ],
        },
        {
          title: '여러 칸 차지하기와 영역 이름',
          blocks: [
            { type: 'code', code: `.featured { grid-column: span 2; }   /* 가로 2칸 차지 (1강 표의 colspan처럼) */

.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }` },
            { type: 'say', text: '`grid-template-areas`는 **글자로 지도를 그리는** 방식이에요. CSS만 봐도 페이지 구조가 눈에 보이죠. 모바일에서는 미디어 쿼리로 지도만 `"header" "main" "sidebar" "footer"`처럼 한 열로 바꾸면 레이아웃이 통째로 바뀌어요.' },
          ],
        },
      ],
    },
    {
      title: 'flex vs grid',
      slides: [
        {
          title: '언제 무엇을',
          blocks: [
            {
              type: 'table',
              head: ['', 'flex', 'grid'],
              rows: [
                ['차원', '**1차원** — 한 줄', '**2차원** — 행 × 열'],
                ['생각하는 방식', '내용이 먼저, 크기에 맞춰 **흘러가며** 정렬', '칸을 먼저 긋고 **채워 넣기**'],
                ['어울리는 곳', '메뉴, 버튼 묶음, 헤더, **카드 안** 요소 정렬', '상품 목록, 갤러리, **페이지 전체** 레이아웃'],
              ],
            },
            { type: 'say', text: '둘 중 하나만 고르는 게 아니라 **섞어 쓰는 게 보통**이에요. 페이지 뼈대와 카드 목록은 **grid**로, 각 카드 안의 제목·가격·버튼 정렬은 **flex**로요.' },
            { type: 'ask', q: '상품 카드 12개를 PC에서 4열 바둑판으로 놓고 싶어요. 카드 안에서는 버튼을 맨 아래로 붙이고 싶고요. 각각 무엇을 쓸까요?', a: '카드 목록(행 × 열)은 **grid** — `repeat(4, 1fr)`. 카드 안의 세로 정렬과 버튼 맨 아래는 **flex** — `flex-direction: column` + `margin-top: auto`. 딱 "섞어 쓰기"의 예예요.' },
          ],
        },
      ],
    },
    {
      title: '연습 추천',
      slides: [
        {
          title: '게임으로 손에 익히기',
          blocks: [
            { type: 'say', text: 'flex와 grid는 읽기만 해서는 금방 잊어요. **직접 여러 번** 써 봐야 손에 붙어요. 재밌게 연습할 수 있는 무료 게임 사이트 두 개를 추천해요.' },
            { type: 'list', items: ['**Flexbox Froggy** — 개구리를 연잎 위로 옮기는 게임. `justify-content`, `align-items`, `flex-direction`을 단계별로 익혀요', '**Grid Garden** — 당근밭에 물을 주는 게임. `grid-column`, `grid-row`, `grid-template-columns`를 익혀요'] },
            { type: 'say', text: 'HTML/CSS 수업은 여기까지예요. 정말 수고 많았어요! 0강에서 "뼈대, 옷, 근육"으로 시작했는데, 이제 뼈대와 옷은 자신 있게 입힐 수 있어요. 마지막 확인 문제 풀고 마무리해요. 🎉' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-16-01', type: 'mcq', source: 'Flexbox', question: 'display: flex를 주면 배치되는 대상은?', choices: ['모든 자손', '직속 자식', '형제 요소', '부모 요소'], answer: 1, explanation: 'flex container의 직속 자식만 flex item이 돼요.' },
    { id: 'fe-16-02', type: 'mcq', source: '컨테이너 속성', question: 'flex-direction: row일 때 justify-content가 정렬하는 방향은?', choices: ['세로', '가로(주축)', '대각선', '정렬하지 않음'], answer: 1, explanation: 'justify-content = 주축, align-items = 교차축. row면 주축이 가로.' },
    { id: 'fe-16-03', type: 'ox', source: '컨테이너 속성', question: 'flex-direction: column이면 justify-content가 세로 정렬을 담당한다.', answer: true, explanation: '주축이 세로가 되므로 justify-content는 세로, align-items는 가로.' },
    { id: 'fe-16-04', type: 'short', source: '컨테이너 속성', question: '로고는 왼쪽, 메뉴는 오른쪽 끝으로 보내는 justify-content 값은?', answer: ['space-between'], explanation: 'space-between — 양 끝에 붙이고 사이를 균등하게.' },
    { id: 'fe-16-05', type: 'mcq', source: '아이템 속성', question: 'flex: 1 의 의미로 가장 가까운 것은?', choices: ['고정 너비 1px', '남는 공간을 똑같이 나눠 갖기', '절대 줄어들지 않기', '순서를 1번으로'], answer: 1, explanation: 'flex: 1 = flex-grow 1, shrink 1, basis 0 → 남는 공간을 균등 분배.' },
    { id: 'fe-16-06', type: 'mcq', source: '아이템 속성', question: '공간이 모자라도 사이드바가 줄어들지 않게 하는 값은?', choices: ['flex-grow: 0', 'flex-shrink: 0', 'flex-basis: 0', 'order: 0'], answer: 1, explanation: 'flex-shrink: 0이면 안 줄어들어요. 그래서 사이드바에 flex: 0 0 240px.' },
    { id: 'fe-16-07', type: 'mcq', source: 'flex 패턴', question: '카드 높이가 제각각일 때 버튼을 항상 맨 아래에 두는 방법은?', choices: ['버튼에 position: fixed', '카드를 flex column으로 + 버튼에 margin-top: auto', '버튼에 float: bottom', '카드에 height: 100vh'], answer: 1, explanation: 'margin-top: auto가 남는 공간을 모두 위쪽 여백으로 가져가요.' },
    { id: 'fe-16-08', type: 'short', source: 'Grid', question: 'Grid에서 "남는 공간의 비율"을 뜻하는 단위는?', answer: ['fr'], explanation: 'grid-template-columns: repeat(3, 1fr) → 3등분.' },
    { id: 'fe-16-09', type: 'mcq', source: 'Grid', question: '그리드 아이템이 가로 2칸을 차지하게 하는 속성은?', choices: ['grid-row: span 2', 'grid-column: span 2', 'flex: 2', 'colspan: 2'], answer: 1, explanation: 'grid-column: span 2.' },
    { id: 'fe-16-10', type: 'essay', source: 'flex vs grid', question: 'flex와 grid를 각각 언제 쓰는지 예를 들어 설명하세요.', answer: 'flex는 1차원(한 방향) 정렬에 적합해서 메뉴, 버튼 묶음, 카드 안 요소 배치처럼 한 줄로 늘어선 것을 정렬할 때 쓴다. grid는 행과 열을 동시에 다루는 2차원 배치라 상품 목록, 갤러리, 페이지 전체 레이아웃에 쓴다. 보통 페이지 골격은 grid, 카드 내부는 flex처럼 섞어 쓴다.', keywords: ['1차원', '2차원', '섞어 쓰기'], explanation: 'flex = 줄, grid = 표.' },
    { id: 'fe-16-11', type: 'ox', source: '연습 추천', question: 'Flexbox Froggy와 Grid Garden은 게임으로 레이아웃을 연습하는 사이트다.', answer: true, explanation: '개구리를 연잎에, 당근밭에 물을 주며 속성을 익혀요.' },
  ],
}

export default topic

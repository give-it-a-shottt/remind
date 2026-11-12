import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-14-inheritance',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '14강 - 상속 (inheritance)',
  order: 14,
  notionId: '3efdf951bf8081cba4c2f88c275fd1e3',
  sections: [
    {
      title: '상속이란?',
      slides: [
        {
          title: '부모가 준 스타일을 자식이 물려받아요',
          blocks: [
            { type: 'say', text: '8강에서 `line-height`를 "자식에게 물려진다"고 했던 거 기억나세요? 이번 수업에서 그 **상속**을 제대로 배워요.\n\n상속은 **부모에게 준 스타일을 자식이 자동으로 물려받는 것**이에요.' },
            { type: 'code', code: `body {
  color: #333;
  font-family: "Pretendard", sans-serif;
}
/* p, h1, li, span… 따로 안 써도 전부 #333 Pretendard */` },
            { type: 'say', text: 'body에 한 번만 쓰면 페이지 안 **모든 글자**가 그 색과 글꼴을 써요. 상속이 없다면 p, h1, li, span… 태그마다 글꼴을 다 적어야 했을 거예요.' },
            { type: 'note', tone: 'analogy', text: '집안의 **말투**를 생각해요. 부모님이 쓰는 사투리를 아이가 따로 배우지 않아도 자연스럽게 물려받죠. 하지만 아이가 밖에서 표준어를 배우면(자식에 직접 스타일을 쓰면) 그게 우선이에요.' },
          ],
        },
      ],
    },
    {
      title: '상속되는 속성',
      slides: [
        {
          title: '주로 글자에 관한 것들',
          blocks: [
            { type: 'say', text: '모든 속성이 상속되는 건 아니에요. 상속되는 건 **대부분 글자에 관한 속성**이에요.' },
            {
              type: 'table',
              head: ['분류', '상속되는 속성'],
              rows: [
                ['글자 모양', '`color`, `font-family`, `font-size`, `font-weight`, `line-height`'],
                ['글자 배치', '`text-align`, `letter-spacing`, `word-break`'],
                ['그 밖에', '`visibility`, `cursor`, `list-style`'],
              ],
            },
            { type: 'say', text: '외우는 요령은 간단해요. **"글자에 관한 거면 대체로 상속된다."** 한 문단 안에서 글자색이 단어마다 제각각이면 이상하잖아요. 그러니 글자 속성은 물려받는 게 자연스러워요.' },
          ],
        },
      ],
    },
    {
      title: '상속되지 않는 속성',
      slides: [
        {
          title: '주로 상자에 관한 것들',
          blocks: [
            {
              type: 'table',
              head: ['분류', '상속되지 않는 속성'],
              rows: [
                ['상자 크기·여백', '`width`, `height`, `margin`, `padding`, `border`'],
                ['꾸밈', '`background`'],
                ['배치', '`position`, `display`, `transform`'],
              ],
            },
            { type: 'say', text: '**상자(박스 모델)와 배치에 관한 속성**은 상속되지 않아요. 왜 그럴까요? 상속된다고 상상해 보면 바로 이해돼요.' },
          ],
        },
        {
          title: 'border가 상속된다면',
          blocks: [
            { type: 'code', code: `.card { border: 1px solid #ccc; padding: 20px; }

/* 만약 border, padding이 상속된다면… */
+-------------------------+   .card
|  +-------------------+  |   .card 안의 h3도 테두리 + 여백 20
|  |  +-------------+  |  |   h3 안의 span도 테두리 + 여백 20
|  |  |    title    |  |  |   …겹겹이 상자 지옥
|  |  +-------------+  |  |
|  +-------------------+  |
+-------------------------+` },
            { type: 'say', text: '카드에 테두리를 줬을 뿐인데, 안의 제목·문단·글자 조각마다 테두리와 여백이 **겹겹이** 생길 거예요. margin도 마찬가지로 자식마다 쌓이면서 레이아웃이 엉망이 되겠죠.\n\n상자 속성은 **"그 상자 하나"에만** 의미가 있어요. 그래서 상속되지 않도록 설계됐어요.' },
            { type: 'ask', q: '`background`는 상속되지 않는데, 부모에 배경색을 주면 자식 위치에도 그 색이 보여요. 왜일까요?', a: '자식의 `background` 기본값이 **투명**(transparent)이라서, 투명한 자식을 통해 **뒤에 있는 부모 배경이 비쳐 보이는** 거예요. 물려받은 게 아니라 보이는 것뿐이에요.' },
          ],
        },
      ],
    },
    {
      title: '상속 제어 키워드',
      slides: [
        {
          title: 'inherit, initial, unset',
          blocks: [
            { type: 'say', text: '상속을 **직접 조절**하는 특별한 값이 있어요. 어떤 속성에든 쓸 수 있어요.' },
            {
              type: 'table',
              head: ['키워드', '뜻'],
              rows: [
                ['`inherit`', '부모 값을 **강제로 물려받기** (상속 안 되는 속성도)'],
                ['`initial`', 'CSS가 정한 **맨 처음 기본값**으로 (예: color는 보통 검정)'],
                ['`unset`', '상속되는 속성이면 `inherit`처럼, 아니면 `initial`처럼'],
              ],
            },
            { type: 'code', code: `a { color: inherit; }   /* 2강 리셋 CSS의 그 줄! */` },
            { type: 'say', text: '링크(`a`)는 브라우저 기본 스타일이 **파란색**을 직접 지정해 둬서, 부모 글자색을 물려받지 못해요. `color: inherit`로 "기본 파란색 말고 **부모 색을 따라가**"라고 시키는 거예요. 그래서 리셋 CSS에 거의 항상 들어 있어요.' },
          ],
        },
        {
          title: '버튼 글꼴만 혼자 달라요',
          blocks: [
            { type: 'say', text: 'body에 Pretendard를 줬는데 **버튼과 입력창 글자만** 다른 글꼴로 보이는 일이 흔해요.\n\n`button`, `input`, `textarea` 같은 폼 요소는 브라우저 기본 스타일에서 **자기 글꼴을 따로 지정**해 둬서, 부모 글꼴을 물려받지 않아요.' },
            { type: 'code', code: `button, input, textarea, select {
  font: inherit;   /* 글꼴·크기·굵기를 한꺼번에 부모에게서 */
}` },
            { type: 'note', tone: 'tip', text: '이 한 줄도 리셋 CSS의 단골이에요. `font`는 단축 속성이라 `font-family`, `font-size`, `font-weight`, `line-height`를 한 번에 inherit해 줘요.' },
          ],
        },
      ],
    },
    {
      title: '상속 vs 캐스케이딩',
      slides: [
        {
          title: '두 개념은 다른 질문에 답해요',
          blocks: [
            {
              type: 'table',
              head: ['', '상속', '캐스케이딩 (2강)'],
              rows: [
                ['질문', '부모 값이 자식에게 **내려오나?**', '한 요소에 걸린 규칙 중 **누가 이기나?**'],
                ['방향', '부모 → 자식 (세로)', '같은 요소 안에서 경쟁'],
              ],
            },
            { type: 'say', text: '그럼 둘이 부딪히면요? 규칙은 하나예요. **상속받은 값은 가장 약해요.** 명시도 점수조차 없어요. 자식에게 **직접** 걸린 규칙이 하나라도 있으면, 그게 아무리 약한 선택자여도 이겨요.' },
          ],
        },
        {
          title: 'id가 태그한테 지는 경우',
          blocks: [
            { type: 'code', code: `<div id="main"><p>글</p></div>

#main { color: red; }    /* div에 걸린 규칙 (id, 아주 셈) */
p     { color: blue; }   /* p에 직접 걸린 규칙 (태그, 아주 약함) */

/* "글"의 색은? → blue */` },
            { type: 'say', text: '명시도만 보면 `#main`이 훨씬 세요. 그런데 `#main`은 **div**를 고른 규칙이에요. p는 그 빨간색을 **상속으로** 받을 뿐이에요. 반면 `p { color: blue }`는 **p에 직접** 걸렸죠.\n\n명시도 비교는 **같은 요소에 직접 걸린 규칙끼리만** 해요. 상속값은 그 경쟁에 끼지도 못해요. 그래서 blue예요.' },
            { type: 'ask', q: '그럼 위 예시에서 "글"을 빨갛게 하려면 어떻게 고치면 될까요?', a: 'p에 **직접** 걸리게 쓰면 돼요. `#main p { color: red; }`처럼요. 이제 p에 직접 걸린 규칙끼리 명시도로 겨루니까 (1,0,1)인 `#main p`가 (0,0,1)인 `p`를 이겨요.' },
          ],
        },
      ],
    },
    {
      title: '활용 팁 (CSS 변수)',
      slides: [
        {
          title: '글자 스타일은 위에서 한 번만',
          blocks: [
            { type: 'say', text: '상속을 잘 쓰면 CSS가 짧아져요. 글자 스타일은 **body나 섹션 단위에 한 번만** 주고, **다른 부분만** 덮어써요.' },
            { type: 'code', code: `body   { color: #333; font-family: "Pretendard", sans-serif; line-height: 1.6; }
.footer { color: #888; font-size: .875rem; }   /* 푸터 안 글자는 전부 회색·작게 */` },
          ],
        },
        {
          title: 'CSS 변수도 상속돼요',
          blocks: [
            { type: 'code', code: `:root { --main-color: tomato; }          /* 변수 선언 (:root = html) */

.btn  { background: var(--main-color); }  /* 변수 사용 */

.dark { --main-color: #ff8a65; }          /* 이 구역 안에서만 값 바꾸기 */` },
            { type: 'say', text: '`--이름: 값`으로 **CSS 변수**(커스텀 속성)를 만들고, `var(--이름)`으로 꺼내 써요. 브랜드 색을 한 곳에서 관리하니, 색을 바꿀 때 **한 줄만** 고치면 사이트 전체가 바뀌어요.\n\nCSS 변수도 **상속돼요.** `:root`에 선언하면 모든 요소가 물려받고, `.dark` 안에서 값을 다시 정하면 **그 구역 안의 버튼들만** 다른 색을 써요. 다크 모드나 섹션별 테마를 이렇게 만들어요.' },
            { type: 'ask', q: '`.dark` 안에 있는 `.btn`의 배경색은 무엇일까요?', a: '`#ff8a65`예요. `.btn`은 `var(--main-color)`를 쓰는데, 변수 값은 **가장 가까운 조상**에게서 물려받아요. `.dark`가 `:root`보다 가까우니 `.dark`의 값을 써요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-14-10', type: 'ox', source: '상속이란?', question: 'body에 color와 font-family를 주면 페이지 안 모든 글자가 그 값을 물려받는다.', answer: true, explanation: '상속은 부모 스타일을 자식이 자동으로 물려받는 것. 글자 스타일은 body에 한 번만 주는 게 효율적이에요.' },
    { id: 'fe-14-01', type: 'mcq', source: '상속되는 속성', question: '상속되는 속성은?', choices: ['margin', 'border', 'color', 'background'], answer: 2, explanation: '글자 관련(color, font-*, line-height 등)은 상속돼요.' },
    { id: 'fe-14-02', type: 'mcq', source: '상속되지 않는 속성', question: '상속되지 않는 속성은?', choices: ['font-family', 'line-height', 'padding', 'letter-spacing'], answer: 2, explanation: '박스·배치 관련(width, margin, padding, border, background...)은 상속되지 않아요.' },
    { id: 'fe-14-03', type: 'essay', source: '상속되지 않는 속성', question: 'border나 margin이 상속되지 않도록 설계된 이유를 설명하세요.', answer: '박스 관련 속성이 상속되면 부모에 준 테두리·여백이 모든 자식, 손자에게 겹겹이 적용되어 레이아웃이 망가진다. 그래서 글자처럼 일관되게 이어져야 하는 속성만 상속되고, 박스·배치 속성은 각 요소가 따로 가진다.', keywords: ['겹겹이', '레이아웃'], explanation: '상속은 "자연스럽게 이어져야 하는" 글자 속성 위주.' },
    { id: 'fe-14-04', type: 'short', source: '상속 제어 키워드', question: '링크의 파란 기본색 대신 부모 글자색을 쓰게 하는 값은? (color: ?)', answer: ['inherit'], explanation: 'a { color: inherit; }' },
    { id: 'fe-14-05', type: 'mcq', source: '상속 제어 키워드', question: 'button의 글자가 페이지 폰트와 다르게 보이는 이유와 해결은?', choices: ['button은 인라인이라서 / display: block', 'button은 기본적으로 폰트를 상속받지 않아서 / font: inherit', 'button은 z-index가 낮아서 / z-index: 1', 'button은 color가 없어서 / color: initial'], answer: 1, explanation: 'button, input, textarea는 브라우저 기본 스타일 때문에 폰트를 상속받지 않아요.' },
    { id: 'fe-14-06', type: 'mcq', source: '상속 제어 키워드', question: 'unset의 동작은?', choices: ['항상 initial', '항상 inherit', '상속 속성이면 inherit, 아니면 initial', '스타일 삭제 후 브라우저 기본값'], answer: 2, explanation: 'unset = 자연스러운 상태로 되돌리기.' },
    { id: 'fe-14-07', type: 'mcq', source: '상속 vs 캐스케이딩', question: '<div id="main"><p>글</p></div> 에 #main { color: red } p { color: blue } 이면 글자색은?', choices: ['red (id가 더 강함)', 'blue', '검정', '보라'], answer: 1, choiceExplanations: ['id 규칙은 div에 적용되고 p는 그 값을 "상속"받을 뿐이에요.', '정답. p에 직접 쓴 규칙이 상속값보다 항상 이겨요.', '기본 검정보다 직접 쓴 규칙이 우선이에요.', '색이 섞이지는 않아요.'], explanation: '상속받은 값은 명시도가 가장 약해서, 자식에 직접 쓴 규칙이 있으면 항상 그게 이겨요.' },
    { id: 'fe-14-08', type: 'ox', source: '활용 팁 (CSS 변수)', question: 'CSS 변수(커스텀 속성)도 상속된다.', answer: true, explanation: '.dark { --main-color: ... } 안에 있는 요소만 다른 색을 쓰게 할 수 있어요.' },
    { id: 'fe-14-09', type: 'short', source: '활용 팁 (CSS 변수)', question: 'CSS 변수 --main-color를 사용하는 함수 표기는?', answer: ['var(--main-color)'], explanation: 'background: var(--main-color);' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-05-box-model',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '5강 - 박스 모델',
  order: 5,
  notionId: '3efdf951bf8081848e84d87dfb89d8e3',
  sections: [
    {
      title: '모든 요소는 상자다',
      slides: [
        {
          title: '화면은 상자들로 이루어져 있어요',
          blocks: [
            { type: 'say', text: '이번 수업은 CSS 레이아웃의 가장 중요한 기초, **박스 모델**이에요. 브라우저는 제목이든 글이든 버튼이든 **모든 요소를 네모난 상자**로 다뤄요. 둥근 버튼도 사실은 모서리만 둥글게 깎은 상자예요.' },
            { type: 'note', tone: 'tip', text: '직접 확인해 보세요. 아무 사이트에서 개발자 도구를 열고 `* { outline: 1px solid red; }`를 넣으면, 화면 전체가 빨간 네모들로 쪼개져 보여요.' },
          ],
        },
        {
          title: '상자의 네 겹',
          blocks: [
            { type: 'say', text: '상자는 **안에서 밖으로** 네 겹이에요.' },
            {
              type: 'code',
              code: `+-----------------------------+   margin  : 바깥 여백 (투명)
|  +-----------------------+  |   border  : 테두리
|  |  +-----------------+  |  |   padding : 안쪽 여백 (배경색 칠해짐)
|  |  |     content     |  |  |   content : 내용
|  |  +-----------------+  |  |
|  +-----------------------+  |
+-----------------------------+`,
            },
            { type: 'list', ordered: true, items: ['**content** — 글자나 이미지가 실제로 들어가는 곳', '**padding** — 내용과 테두리 사이 **안쪽 여백**. 배경색이 **칠해져요**', '**border** — 테두리 선', '**margin** — 다른 요소와 떨어뜨리는 **바깥 여백**. **투명**해요'] },
          ],
        },
        {
          title: '액자로 기억하기',
          blocks: [
            { type: 'note', tone: 'analogy', text: '벽에 건 **액자**를 떠올려 보세요.\n• **content** = 그림\n• **padding** = 그림과 액자 틀 사이의 흰 여백(매트) — 액자의 일부라 색이 있어요\n• **border** = 나무 액자 틀\n• **margin** = 옆 액자와 떨어뜨려 둔 벽의 빈 공간 — 벽이 그대로 보여요(투명)' },
            { type: 'ask', q: '버튼의 배경색을 넓게 보이게 하고 싶어요. padding과 margin 중 무엇을 늘려야 할까요?', a: '**padding**이에요. 배경색은 padding까지 칠해지니까 padding을 늘리면 색칠된 버튼이 커져요. margin을 늘리면 버튼 주변의 **투명한 빈 공간**만 넓어져요.' },
          ],
        },
      ],
    },
    {
      title: '단축 속성',
      slides: [
        {
          title: '네 방향을 한 줄로',
          blocks: [
            { type: 'say', text: 'margin과 padding은 위·오른쪽·아래·왼쪽 네 방향이 있어요. 하나씩 쓰면 네 줄이지만 **한 줄로 줄여 쓸 수 있어요.** 이걸 **단축 속성**이라고 해요.' },
            { type: 'code', code: `/* 길게 */
margin-top: 10px; margin-right: 20px; margin-bottom: 30px; margin-left: 40px;

/* 짧게 — 위부터 시계 방향 */
margin: 10px 20px 30px 40px;` },
            { type: 'note', tone: 'analogy', text: '**시계 방향**이에요. 12시(위) → 3시(오른쪽) → 6시(아래) → 9시(왼쪽). 영어로는 **TRouBLe**(Top Right Bottom Left), "트러블"로 외우기도 해요.' },
          ],
        },
        {
          title: '값 개수에 따라 달라져요',
          blocks: [
            {
              type: 'table',
              head: ['값 개수', '예시', '뜻'],
              rows: [
                ['1개', '`margin: 10px`', '네 방향 **모두** 10'],
                ['2개', '`margin: 10px 20px`', '**위아래** 10, **좌우** 20'],
                ['3개', '`margin: 10px 20px 30px`', '위 10, **좌우** 20, 아래 30'],
                ['4개', '`margin: 10px 20px 30px 40px`', '위 10, 오른쪽 20, 아래 30, 왼쪽 40'],
              ],
            },
            { type: 'say', text: '값이 모자라면 **반대편 값을 빌려 와요.** 3개일 때 왼쪽이 없으니 반대편인 오른쪽(20)을 그대로 써요. 2개일 때는 아래가 위를, 왼쪽이 오른쪽을 따라가요.' },
            { type: 'code', code: `border: 1px solid #333;   /* 두께  스타일  색 — 테두리도 단축 속성 */` },
            { type: 'ask', q: '`padding: 8px 16px`이면 버튼 안쪽 여백은 어떻게 될까요?', a: '**위아래 8px, 좌우 16px**이에요. 버튼은 보통 이렇게 옆을 더 넓게 줘요. 그래야 가로로 길쭉하고 보기 좋은 버튼이 돼요.' },
          ],
        },
      ],
    },
    {
      title: 'box-sizing',
      slides: [
        {
          title: 'width 300px인데 왜 344px일까',
          blocks: [
            { type: 'say', text: '박스 모델에서 가장 많이 당황하는 순간이에요.' },
            { type: 'code', code: `.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
/* 화면에서 재 보면… 344px?! */` },
            { type: 'say', text: '기본 설정(`content-box`)에서 `width`는 **content(내용)의 너비만** 뜻해요. 여기에 padding과 border가 **바깥으로 더해져요.**\n\n300 (content) + 20 × 2 (padding 양쪽) + 2 × 2 (border 양쪽) = **344px**' },
            { type: 'note', tone: 'analogy', text: '"폭 300 액자를 주세요" 했는데, 가게가 **그림 크기만 300**으로 재고 매트와 틀을 바깥에 덧붙여서 344짜리를 준 셈이에요. 벽에 걸 자리를 300으로 맞춰 놨다면 안 들어가죠.' },
          ],
        },
        {
          title: 'border-box로 바꾸면',
          blocks: [
            { type: 'code', code: `*, *::before, *::after {
  box-sizing: border-box;
}` },
            { type: 'say', text: '`border-box`로 바꾸면 `width`가 **border까지 포함한 전체 너비**가 돼요. 위 예시는 정확히 **300px**이 되고, padding과 border는 **안쪽으로** 들어가서 content가 256px로 줄어요.\n\n"내가 width에 쓴 숫자 = 화면에 보이는 크기"라서 계산이 정말 편해져요. 그래서 거의 모든 프로젝트가 **맨 처음에** 이 세 줄을 넣고 시작해요. 2강의 리셋 CSS에 있던 그 `box-sizing`이 바로 이거예요.' },
            { type: 'note', tone: 'warn', text: 'border-box도 **margin은 포함하지 않아요.** margin은 상자 바깥의 빈 공간이라 언제나 따로예요.' },
          ],
        },
      ],
    },
    {
      title: 'margin 상쇄',
      slides: [
        {
          title: '30 + 20인데 왜 30일까',
          blocks: [
            { type: 'code', code: `.a { margin-bottom: 30px; }
.b { margin-top: 20px; }

/* .a 아래에 .b가 오면 두 상자 사이 간격은? */` },
            { type: 'say', text: '50px일 것 같지만 **30px**이에요. 위아래로 만나는 margin은 **더해지지 않고, 큰 쪽 하나만** 남아요. 이걸 **margin 상쇄**(collapse, 겹침)라고 해요.' },
            { type: 'note', tone: 'analogy', text: '두 사람이 각자 "나는 앞사람과 **최소** 30cm, 20cm는 떨어져 있고 싶어"라고 해요. 30cm만 떨어지면 **두 사람 모두 만족**하죠. 50cm까지 벌릴 필요가 없어요. margin은 "최소 이만큼 떨어져 줘"라는 요청이라 큰 쪽 하나로 충분한 거예요.' },
            { type: 'say', text: '이 현상은 **세로(위아래)에서만** 일어나요. 좌우로 나란히 놓인 요소의 margin은 그대로 더해져요.' },
          ],
        },
        {
          title: '부모 밖으로 새는 margin',
          blocks: [
            { type: 'say', text: '더 헷갈리는 경우도 있어요. 부모 안의 **첫 자식**에 `margin-top`을 줬는데, 자식이 내려가는 게 아니라 **부모 전체가 같이 내려가요.** 부모와 첫 자식의 위 margin끼리도 상쇄되면서 margin이 부모 바깥으로 새어 나가는 거예요.' },
            { type: 'code', code: `.parent { background: beige; }
.child  { margin-top: 40px; }  /* 부모 배경 위에 빈틈이 생기길 기대했는데…
                                  부모째로 40px 내려감 */` },
            { type: 'list', items: ['해결 1: 부모에 `padding-top`을 주기 (margin 대신)', '해결 2: 부모에 `border`를 주기', '해결 3: 부모를 `display: flex` 또는 `grid`로 (이 안에서는 상쇄가 안 일어나요)'] },
          ],
        },
      ],
    },
    {
      title: '가운데 정렬',
      slides: [
        {
          title: 'margin: 0 auto',
          blocks: [
            { type: 'say', text: '사이트 본문이 넓은 모니터에서 화면 가운데에 놓이는 거, 이 두 줄로 만들어요.' },
            { type: 'code', code: `.container {
  max-width: 1200px;
  margin: 0 auto;   /* 위아래 0, 좌우 auto */
}` },
            { type: 'say', text: '`auto`는 "**남는 공간을 알아서 나눠 가져**"라는 뜻이에요. 좌우 둘 다 auto면 남는 공간을 **반씩** 나눠 가지니까 상자가 가운데 놓여요.' },
            { type: 'note', tone: 'warn', text: '**너비가 정해져 있어야** 작동해요. 블록 요소는 기본으로 부모 너비를 꽉 채우기 때문에, 너비가 없으면 남는 공간이 0이라 나눌 게 없어요.\n\n그리고 `text-align: center`와 헷갈리지 마세요. 그건 상자 **안의 글자**를 가운데로 보내는 거고, `margin: 0 auto`는 **상자 자체**를 가운데로 보내요.' },
          ],
        },
      ],
    },
    {
      title: 'overflow',
      slides: [
        {
          title: '내용이 상자보다 클 때',
          blocks: [
            { type: 'say', text: '높이가 200px인 상자에 글이 300px만큼 들어가면 어떻게 될까요? `overflow` 속성이 정해요.' },
            {
              type: 'table',
              head: ['값', '동작'],
              rows: [
                ['`visible` (기본)', '상자 **밖으로 비져나와** 보여요 (아래 요소와 겹치기도)'],
                ['`hidden`', '넘친 부분을 **잘라서** 숨겨요'],
                ['`scroll`', '넘치든 안 넘치든 **항상** 스크롤바'],
                ['`auto`', '**넘칠 때만** 스크롤바'],
              ],
            },
            { type: 'say', text: '채팅창이나 댓글 목록처럼 "일정 높이 안에서 스크롤"이 필요하면 `overflow: auto`가 가장 자연스러워요. 내용이 적을 땐 쓸데없는 스크롤바가 안 생기니까요.' },
            { type: 'ask', q: '카드 안의 이미지를 확대하는 hover 효과를 줬더니, 이미지가 카드 밖으로 튀어나와요. 카드에 무엇을 주면 될까요?', a: '카드에 `overflow: hidden`이에요. 넘친 부분이 잘려서 이미지가 카드 테두리 안에서만 커지는 것처럼 보여요. 쇼핑몰 상품 카드에서 정말 자주 쓰는 조합이에요.' },
          ],
        },
      ],
    },
    {
      title: '기타 박스 속성',
      slides: [
        {
          title: '모서리, 그림자, 최소·최대 크기',
          blocks: [
            { type: 'code', code: `.card {
  border-radius: 12px;                      /* 둥근 모서리 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);   /* x y 흐림 색 */
  min-height: 200px;                        /* 내용이 적어도 최소 200 */
  max-width: 400px;                         /* 아무리 넓어도 최대 400 */
}
.avatar { border-radius: 50%; }             /* 정사각형 → 원 */` },
            { type: 'list', items: ['`border-radius: 50%` → 정사각형이면 **완벽한 원**이 돼요 (프로필 사진)', '`box-shadow: x y 흐림 색` → x는 오른쪽, y는 아래로 얼마나 밀지. 색은 2강의 `rgba`로 **연하게** 주는 게 자연스러워요', '`min-` / `max-` → 고정 크기 대신 **범위**를 줘서, 내용이나 화면에 따라 유연하게'] },
            { type: 'note', tone: 'tip', text: '그림자를 검정 100%로 진하게 주면 촌스러워 보여요. `rgba(0,0,0,0.1)`처럼 아주 연하게, 흐림을 크게 주는 게 요즘 스타일이에요.' },
          ],
        },
      ],
    },
    {
      title: '디버깅 팁',
      slides: [
        {
          title: '여백이 어디서 왔는지 모를 때',
          blocks: [
            { type: 'say', text: '"이 빈 공간은 대체 어디서 온 거지?" 박스 모델을 배우면 꼭 한 번은 겪어요. 두 가지 무기가 있어요.' },
            { type: 'list', ordered: true, items: ['**개발자 도구 → Elements → Computed 탭** — 선택한 요소의 박스 모델 그림이 나와요. margin(주황), padding(초록), content(파랑)에 실제 숫자가 적혀 있어요', '**임시 outline** — 모든 상자의 경계를 빨간 선으로 보여 줘요'] },
            { type: 'code', code: `* { outline: 1px solid red; }   /* 확인 끝나면 꼭 지우기 */` },
          ],
        },
        {
          title: '왜 border가 아니라 outline일까',
          blocks: [
            { type: 'say', text: '`border`를 1px 주면 모든 상자가 **2px씩 커져요**(양쪽). 그러면 딱 맞던 레이아웃이 밀려서 줄이 바뀌거나 깨져요. 디버깅하려다 화면을 망가뜨리는 거죠.\n\n`outline`은 상자 **바깥에 그려지기만** 하고 크기 계산에 **포함되지 않아요.** 레이아웃을 건드리지 않고 경계만 보여 줘서 디버깅에 딱이에요.' },
            { type: 'ask', q: 'outline이 크기에 안 들어간다면, 박스 모델 네 겹(content, padding, border, margin) 중 어디에도 속하지 않는 걸까요?', a: '맞아요. outline은 박스 모델 **바깥의 덧칠**이에요. 그래서 크기도 안 바뀌고, 다른 요소와 겹쳐 그려질 수도 있어요. 입력창 `:focus` 표시에 outline을 쓰는 것도 같은 이유예요. 눌러도 레이아웃이 들썩이지 않으니까요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-05-01', type: 'mcq', source: '모든 요소는 상자다', question: '박스 모델을 안쪽부터 바깥쪽 순서로 나열한 것은?', choices: ['margin → border → padding → content', 'content → padding → border → margin', 'content → border → padding → margin', 'padding → content → margin → border'], answer: 1, explanation: 'content → padding → border → margin.' },
    { id: 'fe-05-02', type: 'ox', source: '모든 요소는 상자다', question: 'margin 영역에는 요소의 배경색이 칠해진다.', answer: false, explanation: '배경색은 padding까지 칠해지고, margin은 투명한 바깥 여백이에요.' },
    { id: 'fe-05-03', type: 'mcq', source: '단축 속성', question: 'margin: 10px 20px 30px; 의 의미는?', choices: ['위 10, 오른쪽 20, 아래 30, 왼쪽 0', '위 10, 좌우 20, 아래 30', '위아래 10, 좌우 20, 전체 30', '위 30, 좌우 20, 아래 10'], answer: 1, explanation: '값이 3개면 위 / 좌우 / 아래.' },
    { id: 'fe-05-04', type: 'short', source: '단축 속성', question: '4개 값을 쓰는 margin 단축 속성의 방향 순서는? (예: 위 오른쪽 ...)', answer: ['위 오른쪽 아래 왼쪽', '위오른쪽아래왼쪽', '위, 오른쪽, 아래, 왼쪽', 'top right bottom left'], explanation: '시계 방향: 위 → 오른쪽 → 아래 → 왼쪽.' },
    { id: 'fe-05-05', type: 'short', source: 'box-sizing', question: 'width: 300px; padding: 20px; border: 2px; 인 content-box 요소의 실제 너비는? (숫자만)', answer: ['344', '344px'], explanation: '300 + 20×2 + 2×2 = 344px. border-box라면 300px.' },
    { id: 'fe-05-06', type: 'mcq', source: 'box-sizing', question: 'box-sizing: border-box 의 효과는?', choices: ['width가 내용 영역만 뜻함', 'width에 padding과 border까지 포함', 'margin까지 포함', '테두리가 사라짐'], answer: 1, explanation: '지정한 width가 실제 보이는 너비가 되어 계산이 편해요.' },
    { id: 'fe-05-07', type: 'short', source: 'margin 상쇄', question: '.a { margin-bottom: 30px } 다음 .b { margin-top: 20px } 일 때 두 상자 사이 간격은? (숫자만)', answer: ['30', '30px'], explanation: '세로 margin은 상쇄되어 큰 쪽(30px)만 적용돼요.' },
    { id: 'fe-05-08', type: 'ox', source: 'margin 상쇄', question: '좌우 margin도 상쇄된다.', answer: false, explanation: '상쇄는 세로(위아래) margin에서만 일어나요.' },
    { id: 'fe-05-09', type: 'mcq', source: '가운데 정렬', question: '블록 요소를 가로 가운데 정렬하는 방법은?', choices: ['text-align: center', 'margin: 0 auto (너비 지정 필요)', 'vertical-align: middle', 'float: center'], answer: 1, explanation: '너비가 있는 블록 요소에 margin: 0 auto. text-align은 안의 인라인 콘텐츠 정렬.' },
    { id: 'fe-05-10', type: 'mcq', source: 'overflow', question: '내용이 넘칠 때만 스크롤바가 생기는 overflow 값은?', choices: ['visible', 'hidden', 'scroll', 'auto'], answer: 3, explanation: 'scroll은 항상 스크롤바, auto는 넘칠 때만.' },
    { id: 'fe-05-11', type: 'short', source: '기타 박스 속성', question: '정사각형 요소를 원으로 만드는 border-radius 값은?', answer: ['50%'], explanation: 'border-radius: 50%.' },
    { id: 'fe-05-12', type: 'ox', source: '디버깅 팁', question: '* { outline: 1px solid red; } 는 레이아웃을 바꾸지 않고 모든 요소의 경계를 보여준다.', answer: true, explanation: 'outline은 박스 크기에 영향을 주지 않아서 디버깅용으로 좋아요 (border는 크기가 바뀜).' },
  ],
}

export default topic

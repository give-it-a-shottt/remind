import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-12-transform',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '12강 - transform',
  order: 12,
  notionId: '3efdf951bf80814b9b77e438727ede6f',
  sections: [
    {
      title: 'transform',
      slides: [
        {
          title: '요소를 옮기고, 키우고, 돌리기',
          blocks: [
            { type: 'say', text: '10·11강에서 `translateY`, `scale`, `rotate`를 몇 번 미리 써 봤죠. 이번 수업에서 그 정체, **transform**을 제대로 배워요. transform은 요소를 **이동·확대·회전·기울이기** 해요.' },
            { type: 'code', code: `.a { transform: translate(20px, 10px); }   /* 이동 */
.b { transform: scale(1.2); }              /* 확대 */
.c { transform: rotate(45deg); }           /* 회전 */
.d { transform: skew(10deg, 0); }          /* 기울이기 */` },
          ],
        },
        {
          title: '주변은 모르게 움직여요',
          blocks: [
            { type: 'say', text: 'transform의 가장 큰 특징이에요. 요소를 아무리 옮기고 키워도 **다른 요소들의 위치는 그대로**예요. 브라우저 입장에선 그 요소가 **원래 자리, 원래 크기 그대로** 있다고 생각해요. 화면에 그릴 때만 모양을 바꿔서 그려요.' },
            { type: 'note', tone: 'analogy', text: '연극 무대에 **조명으로 그림자 인형**을 비추는 것과 같아요. 인형(요소)은 제자리에 있고, 벽에 비친 그림자(보이는 모습)만 커지고 움직여요. 그러니 옆 배우들(주변 요소)이 자리를 비켜 줄 필요가 없죠.' },
            { type: 'say', text: '이 덕분에 10강에서 배운 것처럼 **레이아웃 재계산이 없어서 가볍고 부드러워요.** 그래서 transition·animation과 단짝이에요.' },
            { type: 'ask', q: '`margin-top: -4px`와 `transform: translateY(-4px)`, 둘 다 4px 위로 올라가요. 무엇이 다를까요?', a: 'margin은 레이아웃을 바꿔서 **아래 요소들도 같이 4px 끌려 올라와요.** transform은 그 요소만 위로 그려지고 **주변은 꿈쩍 안 해요.** hover 효과에 margin을 쓰면 주변이 들썩거려서 transform을 써요.' },
          ],
        },
      ],
    },
    {
      title: '2D 함수',
      slides: [
        {
          title: '네 가지 함수',
          blocks: [
            {
              type: 'table',
              head: ['함수', '하는 일', '예'],
              rows: [
                ['`translate(x, y)`', '이동. `translateX()`, `translateY()`로 한 방향만도 가능', '`translate(-50%, -50%)`'],
                ['`scale(n)`', '확대/축소. 1이 원래 크기', '`scale(1.2)` = 1.2배, `scale(.9)` = 90%'],
                ['`rotate(각도)`', '회전. 양수면 **시계 방향**', '`rotate(45deg)`'],
                ['`skew(x각도, y각도)`', '기울이기 (평행사변형처럼)', '`skew(10deg, 0)`'],
              ],
            },
          ],
        },
        {
          title: 'translate의 %는 내 크기',
          blocks: [
            { type: 'say', text: '3강에서 `%`는 **부모** 기준이라고 했죠. 그런데 `translate`의 %는 예외예요. **나 자신의 크기**가 기준이에요.' },
            { type: 'code', code: `.box { width: 200px; transform: translateX(50%); }
/* 부모가 1000px이어도 → 내 너비 200px의 50% = 100px 이동 */` },
            { type: 'say', text: '9강의 정중앙 배치 `translate(-50%, -50%)`가 상자 크기를 몰라도 항상 정확했던 이유가 이거예요. "내 너비의 절반, 내 높이의 절반"만큼 되돌리니까요.' },
          ],
        },
      ],
    },
    {
      title: 'transform-origin',
      slides: [
        {
          title: '어디를 축으로 돌릴까',
          blocks: [
            { type: 'say', text: '회전이나 확대에는 **기준점**이 있어요. 기본값은 **정가운데**(`50% 50%`)예요. 그래서 rotate하면 제자리에서 팽이처럼 돌고, scale하면 사방으로 고르게 커져요.' },
            { type: 'code', code: `.gauge {
  transform-origin: left center;   /* 왼쪽 가운데를 기준점으로 */
  transform: scaleX(.7);           /* 가로만 70%로 */
}` },
            { type: 'say', text: '진행률 게이지 바를 줄일 때 기준점이 가운데면 **양쪽에서** 줄어들어서 이상해요. 기준점을 `left`로 옮기면 왼쪽은 고정되고 **오른쪽 끝만** 줄어들어요. 우리가 아는 게이지 바 모양이죠.' },
            { type: 'note', tone: 'analogy', text: '문이 열리는 모습을 생각해요. 문은 **경첩(기준점)** 이 있는 쪽은 그대로 두고 반대쪽이 돌죠. transform-origin은 경첩을 어디에 달지 정하는 속성이에요. 기본값은 문 정가운데에 경첩을 단 회전문이에요.' },
          ],
        },
      ],
    },
    {
      title: '여러 변형 조합',
      slides: [
        {
          title: '순서가 결과를 바꿔요',
          blocks: [
            { type: 'code', code: `transform: translateX(100px) rotate(45deg);   /* A */
transform: rotate(45deg) translateX(100px);   /* B — 결과가 달라요! */` },
            { type: 'say', text: '띄어쓰기로 여러 함수를 이어 쓸 수 있는데, **순서가 바뀌면 결과가 달라요.** 함수는 **오른쪽부터** 적용되는 것처럼 동작해요.\n• A: 먼저 45도 돌리고 → 원래 오른쪽(가로 방향)으로 100px 이동\n• B: 먼저 오른쪽으로 100px 옮긴 다음, **원래 자리의 중심을 축으로** 45도 돌려요 → 팔을 뻗은 채 몸을 돌린 것처럼 요소가 **오른쪽 아래 대각선**으로 휘둘려 가요' },
            { type: 'note', tone: 'tip', text: '헷갈리면 이것만 기억하세요. **"이동 먼저 쓰고, 회전·확대는 뒤에"** 쓰면 대부분 생각한 대로 나와요. 그리고 결과는 꼭 화면으로 확인하기!' },
          ],
        },
        {
          title: 'transform은 합쳐지지 않아요',
          blocks: [
            { type: 'code', code: `.btn     { transform: translateY(-2px); }
.btn.big { transform: scale(1.1); }

/* .btn.big 은? → scale(1.1)만! translateY는 사라져요 */` },
            { type: 'say', text: '`transform`은 **속성 하나**예요. 2강 Cascading 규칙대로 더 센 규칙이 **값 전체를 덮어써요.** 둘을 합치고 싶으면 `transform: translateY(-2px) scale(1.1);`처럼 다시 다 적어야 해요.' },
            { type: 'code', code: `/* 최신 CSS: 개별 속성으로 나눠 쓰기 */
.btn     { translate: 0 -2px; }
.btn.big { scale: 1.1; }        /* 둘 다 살아 있어요 */` },
            { type: 'say', text: '요즘 브라우저는 `translate`, `scale`, `rotate`를 **각각 독립된 속성**으로도 지원해요. 서로 다른 속성이니 덮어쓰지 않고 **같이 적용돼요.** 덮어쓰기 문제를 피하는 깔끔한 방법이에요.' },
          ],
        },
      ],
    },
    {
      title: '3D: 카드 뒤집기',
      slides: [
        {
          title: '앞면과 뒷면이 있는 카드',
          blocks: [
            { type: 'code', code: `.scene { perspective: 800px; }            /* ① 원근감 (부모에) */
.card {
  transition: transform .6s;
  transform-style: preserve-3d;            /* ② 자식들을 3D 공간에 */
}
.scene:hover .card { transform: rotateY(180deg); }   /* ④ Y축으로 뒤집기 */
.front, .back {
  position: absolute; inset: 0;
  backface-visibility: hidden;             /* ③ 뒤돌아선 면은 숨기기 */
}
.back { transform: rotateY(180deg); }      /* 뒷면은 처음부터 뒤집어 둠 */` },
          ],
        },
        {
          title: '네 가지 재료',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**`perspective`** (부모) — 눈과 화면 사이 거리. 이게 없으면 3D로 돌려도 납작하게 **찌그러지기만** 해 보여요. 값이 작을수록 원근감이 강해요',
                '**`transform-style: preserve-3d`** — 자식들(앞면·뒷면)을 같은 3D 공간에 놓아요',
                '**`backface-visibility: hidden`** — 등 돌린 면을 **안 보이게.** 없으면 앞면이 뒤집혀도 거울글씨처럼 **비쳐 보여요**',
                '**`rotateY(180deg)`** — 세로축(Y)을 기준으로 반 바퀴, 책장 넘기듯 뒤집기',
              ],
            },
            { type: 'note', tone: 'analogy', text: '트럼프 카드를 손에 들고 뒤집는 장면이에요. 앞면과 뒷면이 **등을 맞대고 붙어 있고**(뒷면은 처음부터 180도 돌려 둠), 카드를 뒤집으면 등 돌린 면은 안 보이고(backface hidden) 반대 면이 보여요.' },
            { type: 'ask', q: '카드를 돌렸는데 입체감 없이 옆으로 납작해지기만 해요. 무엇이 빠졌을까요?', a: '부모의 `perspective`예요. 원근감이 없으면 3D 회전이 그냥 가로 폭이 줄었다 늘었다 하는 것처럼 보여요.' },
          ],
        },
      ],
    },
    {
      title: '자주 쓰는 곳',
      slides: [
        {
          title: '실무에서 만나는 transform 세 가지',
          blocks: [
            { type: 'code', code: `/* ① hover 시 살짝 떠오르기 */
.card:hover { transform: translateY(-4px); }

/* ② 아코디언 열리면 화살표 뒤집기 */
.accordion.open .arrow { transform: rotate(180deg); }

/* ③ 정중앙 배치 (9강) */
.modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); }` },
            { type: 'say', text: '세 가지 모두 10강의 transition을 붙이면 부드럽게 움직여요. 특히 ②는 아래를 가리키던 ▼ 화살표가 **180도 돌아서 ▲** 가 되는 거라, 아이콘을 두 개 준비할 필요가 없어요.' },
            { type: 'ask', q: '화살표를 `rotate(90deg)`로 돌리면 ▼가 어느 쪽을 가리킬까요?', a: '양수는 **시계 방향**이라 아래(6시)를 가리키던 화살표가 90도 돌아서 **왼쪽(9시)** 을 가리켜요. 180deg면 위, 270deg(또는 -90deg)면 오른쪽이에요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-12-01', type: 'ox', source: 'transform', question: 'transform으로 이동한 요소는 주변 요소들의 위치를 밀어낸다.', answer: false, explanation: 'transform은 원래 공간을 그대로 두고 그려지는 위치만 바꿔서 다른 요소에 영향을 주지 않아요.' },
    { id: 'fe-12-02', type: 'mcq', source: '2D 함수', question: 'translate(-50%, -50%) 에서 %의 기준은?', choices: ['부모 크기', '화면 크기', '자기 자신의 크기', 'html font-size'], answer: 2, explanation: 'transform의 translate %는 자기 크기 기준이라 정중앙 정렬에 쓰여요.' },
    { id: 'fe-12-03', type: 'short', source: '2D 함수', question: '요소를 1.2배 키우는 transform 함수는? (함수(값) 형태)', answer: ['scale(1.2)'], explanation: 'scale(1.2). 가로만은 scaleX, 세로만은 scaleY.' },
    { id: 'fe-12-04', type: 'mcq', source: 'transform-origin', question: '게이지 바가 왼쪽을 기준으로 줄어들게 하려면?', choices: ['transform-origin: right', 'transform-origin: left center + scaleX', 'transform: translateX(-100%)', 'origin: start'], answer: 1, explanation: '기준점(transform-origin)을 왼쪽으로 옮기고 scaleX로 줄여요. 기본값은 가운데.' },
    { id: 'fe-12-05', type: 'ox', source: '여러 변형 조합', question: 'transform: translateX(10px) rotate(15deg) 와 rotate(15deg) translateX(10px) 는 결과가 같다.', answer: false, explanation: '함수 순서에 따라 좌표계가 달라져서 결과가 달라져요.' },
    { id: 'fe-12-06', type: 'mcq', source: '여러 변형 조합', question: '.btn { transform: translateY(-2px) } 에 .btn.big { transform: scale(1.1) } 를 추가하면 .btn.big은?', choices: ['위로 이동 + 확대', '확대만 (translateY는 덮어써짐)', '이동만', '에러'], answer: 1, explanation: 'transform은 합쳐지지 않고 덮어쓰기. 개별 속성(translate, scale)을 쓰면 피할 수 있어요.' },
    { id: 'fe-12-07', type: 'mcq', source: '3D: 카드 뒤집기', question: '카드를 뒤집었을 때 앞면의 뒷모습이 비치지 않게 하는 속성은?', choices: ['perspective', 'transform-style: preserve-3d', 'backface-visibility: hidden', 'overflow: hidden'], answer: 2, explanation: 'backface-visibility: hidden — 뒷면이 보일 때 숨김.' },
    { id: 'fe-12-08', type: 'short', source: '3D: 카드 뒤집기', question: '3D 변형에 원근감을 주기 위해 부모에 주는 속성은?', answer: ['perspective'], explanation: '.flip { perspective: 800px; } — 값이 작을수록 원근감이 강해요.' },
    { id: 'fe-12-09', type: 'mcq', source: '자주 쓰는 곳', question: '아코디언이 열릴 때 아래 화살표를 위로 뒤집는 값은?', choices: ['rotate(90deg)', 'rotate(180deg)', 'scale(-1)', 'skew(180deg)'], answer: 1, explanation: 'rotate(180deg)로 화살표를 뒤집어요.' },
  ],
}

export default topic

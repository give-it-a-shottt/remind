import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-10-transition',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '10강 - transition',
  order: 10,
  notionId: '3efdf951bf80812b9b92d48d4c482833',
  sections: [
    {
      title: 'transition',
      slides: [
        {
          title: '뚝 바뀌는 것과 스르륵 바뀌는 것',
          blocks: [
            { type: 'say', text: '버튼에 `:hover`로 색을 바꾸면, 마우스를 올리는 순간 색이 **뚝** 바뀌어요. 틀린 건 아니지만 딱딱해 보여요. 여기에 한 줄만 더하면 **스르륵** 바뀌어요.' },
            { type: 'code', code: `.btn { background: navy; transition: background-color 0.3s; }
.btn:hover { background: tomato; }` },
            { type: 'say', text: '`transition`은 속성 값이 바뀔 때 **즉시가 아니라 정해진 시간 동안 부드럽게** 바뀌게 해요. 0.3초 동안 남색 → 토마토색 사이의 중간 색들을 브라우저가 알아서 채워 줘요.' },
          ],
        },
        {
          title: '변화가 있어야 움직여요',
          blocks: [
            { type: 'say', text: 'transition은 **시작 상태 → 끝 상태**, 두 지점을 이어 주는 기능이에요. 그래서 **무언가 바뀌는 계기**가 있어야 실행돼요.\n• `:hover`, `:focus` 같은 상태 변화\n• JavaScript로 class를 붙이거나 뗄 때' },
            { type: 'note', tone: 'analogy', text: 'transition은 **조광기(밝기 조절 스위치)** 예요. 스위치를 돌려야(변화) 불이 서서히 밝아지죠. 아무도 안 건드리면 아무 일도 안 일어나요.\n\n페이지가 열리자마자 **스스로** 움직이는 건 다음 수업의 `animation`이 맡아요.' },
          ],
        },
      ],
    },
    {
      title: '4가지 속성',
      slides: [
        {
          title: '무엇을, 얼마 동안, 어떻게, 언제',
          blocks: [
            { type: 'code', code: `transition: background-color 0.3s ease 0.1s;

/* ① property        → background-color
   ② duration        → 0.3s
   ③ timing-function → ease
   ④ delay           → 0.1s */` },
            {
              type: 'table',
              head: ['속성', '뜻', '예'],
              rows: [
                ['① `transition-property`', '**어떤** 속성을 부드럽게', '`background-color`, `transform`'],
                ['② `transition-duration`', '**얼마 동안**', '`0.3s`, `300ms`'],
                ['③ `transition-timing-function`', '**어떤 속도 곡선**으로 (다음 개념)', '`ease`, `linear`'],
                ['④ `transition-delay`', '**얼마 뒤에** 시작할지', '`0.1s`'],
              ],
            },
            { type: 'say', text: '단축 속성에 시간이 **두 개** 나오면, **첫 번째가 duration, 두 번째가 delay**예요. 시간이 하나뿐이면 그건 duration이에요.' },
          ],
        },
        {
          title: 'transition은 어디에 써야 할까',
          blocks: [
            { type: 'code', code: `/* ❌ hover 쪽에만 쓴 경우 */
.btn:hover { background: tomato; transition: background-color .3s; }
/* 올릴 때는 부드럽지만, 마우스를 뗄 때는 뚝 돌아와요 */

/* ✅ 기본 상태에 쓴 경우 */
.btn { transition: background-color .3s; }
.btn:hover { background: tomato; }
/* 올릴 때도, 뗄 때도 부드러워요 */` },
            { type: 'say', text: '마우스를 떼는 순간 `:hover` 규칙은 **더 이상 적용되지 않아요.** hover 안에 적어 둔 transition도 같이 사라지니, 돌아올 땐 transition이 없는 상태로 뚝 바뀌어요.\n\n**변하기 전 상태(기본 선택자)** 에 써 두면 들어갈 때도 나올 때도 항상 적용돼요.' },
            { type: 'ask', q: '`transition: opacity 0.5s 1s;`는 어떻게 동작할까요?', a: '변화가 생기고 **1초 기다린 뒤**, **0.5초 동안** 투명도가 바뀌어요. 시간이 두 개면 앞이 duration(0.5s), 뒤가 delay(1s)예요.' },
          ],
        },
      ],
    },
    {
      title: '타이밍 함수',
      slides: [
        {
          title: '같은 0.3초도 느낌이 달라요',
          blocks: [
            { type: 'say', text: '타이밍 함수는 변화의 **속도 곡선**이에요. 0.3초라는 시간은 같아도, 처음에 빠른지 끝에 빠른지에 따라 느낌이 완전히 달라요.' },
            {
              type: 'table',
              head: ['값', '속도', '느낌'],
              rows: [
                ['`ease` (기본)', '천천히 → **빠르게** → 천천히', '자연스러움, 대부분 이걸로 충분'],
                ['`linear`', '처음부터 끝까지 **일정**', '기계적. 회전하는 스피너에 어울림'],
                ['`ease-in`', '**천천히 시작** → 빨라짐', '떠나는 느낌 (사라질 때)'],
                ['`ease-out`', '빠르게 시작 → **천천히 끝**', '도착하는 느낌 (나타날 때)'],
                ['`ease-in-out`', '천천히 시작, 천천히 끝', '부드러운 왕복'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '자동차로 생각해요. **linear**는 출발부터 시속 60km로 튀어 나가서 60km로 박히듯 멈추는 차. **ease**는 살살 출발해서 속도를 냈다가 살살 멈추는 차. 사람 눈엔 ease가 자연스러워요.' },
          ],
        },
        {
          title: '곡선 직접 만들기: cubic-bezier',
          blocks: [
            { type: 'code', code: `transition: transform .4s cubic-bezier(0.34, 1.56, 0.64, 1);
/* 1을 넘는 값 → 목표를 살짝 지나쳤다가 돌아오는 "통통 튀는" 느낌 */` },
            { type: 'say', text: '`ease`, `linear`도 사실 전부 `cubic-bezier(x1, y1, x2, y2)` 곡선에 이름을 붙인 거예요. 숫자 네 개로 원하는 속도 곡선을 직접 만들 수 있어요.\n\n숫자를 외울 필요는 없어요. 개발자 도구 Styles 패널에서 타이밍 함수 옆 작은 곡선 아이콘을 누르면 **곡선을 끌어서** 만들 수 있고, cubic-bezier.com 같은 사이트도 있어요.' },
          ],
        },
      ],
    },
    {
      title: '예제: 버튼 hover',
      slides: [
        {
          title: '색과 위치를 함께',
          blocks: [
            { type: 'code', code: `.btn {
  transition: background-color .25s ease, transform .25s ease;
}
.btn:hover {
  background: tomato;
  transform: translateY(-2px);   /* 2px 위로 살짝 떠오름 */
}` },
            { type: 'say', text: '여러 속성에 transition을 걸고 싶으면 **쉼표로 나열**해요. 속성마다 시간과 곡선을 따로 줄 수도 있어요.\n\n`translateY(-2px)`는 12강에서 배울 transform인데, 요소를 **위로 2px** 옮겨요. 색이 바뀌면서 살짝 떠오르니 "눌러도 되는 버튼"이라는 느낌이 확 살아요.' },
            { type: 'note', tone: 'tip', text: '버튼 hover 효과는 **0.15~0.3초**가 적당해요. 너무 길면 굼뜨게 느껴져요. 사용자는 기다리는 걸 싫어해요.' },
          ],
        },
      ],
    },
    {
      title: '예제: 카드 이미지 확대',
      slides: [
        {
          title: '카드는 그대로, 사진만 커지게',
          blocks: [
            { type: 'code', code: `.card { overflow: hidden; }                       /* ① 넘치는 부분 자르기 */
.card img { transition: transform .4s ease-out; }  /* ② 변하기 전 상태에 transition */
.card:hover img { transform: scale(1.08); }        /* ③ 카드에 올리면 사진 8% 확대 */` },
            { type: 'say', text: '쇼핑몰 상품 카드에서 자주 보는 효과예요. 세 줄이 각각 앞에서 배운 걸 하나씩 써요.\n① 5강의 `overflow: hidden` — 커진 사진이 카드 밖으로 튀어나가지 않게 잘라요\n② 방금 배운 "transition은 기본 상태에"\n③ `.card:hover img` — **카드**에 마우스를 올렸을 때 **안의 img**를 바꿔요 (4강 자손 선택자)' },
            { type: 'ask', q: '①을 빼먹으면 어떻게 보일까요?', a: '사진이 커지면서 **카드 테두리 밖으로 삐져나와요.** 옆 카드를 덮기도 해요. "카드 안에서만 확대"로 보이려면 카드가 넘친 부분을 잘라 줘야 해요.' },
          ],
        },
      ],
    },
    {
      title: '성능 팁',
      slides: [
        {
          title: '가벼운 속성, 무거운 속성',
          blocks: [
            { type: 'say', text: '0강에서 브라우저가 화면을 그리는 순서를 배웠죠? **스타일 계산 → 레이아웃 → 페인트.** 무엇을 움직이느냐에 따라 브라우저가 다시 해야 하는 일의 양이 달라요.' },
            {
              type: 'table',
              head: ['속성', '바뀌면', '부담'],
              rows: [
                ['`width`, `height`, `top`, `left`, `margin`', '크기·위치가 바뀌어 주변까지 **레이아웃 재계산**', '무거움 → 버벅일 수 있음'],
                ['`background-color`, `color`', '다시 칠하기(페인트)만', '보통'],
                ['`transform`, `opacity`', '이미 그린 그림을 **옮기거나 투명하게만**', '**가벼움** → 부드러움'],
              ],
            },
            { type: 'say', text: '그래서 움직임은 가능하면 `transform`(이동·확대·회전)과 `opacity`(투명도)로 만들어요. `left: 0 → 100px` 대신 `transform: translateX(100px)`처럼요.' },
          ],
        },
        {
          title: 'all과 display: none의 함정',
          blocks: [
            { type: 'note', tone: 'warn', text: '`transition: all 0.3s`는 편해 보이지만, 나중에 다른 속성을 바꿨을 때 **의도하지 않은 것까지** 스르륵 움직여요. 레이아웃 속성이 섞이면 성능도 나빠지고요. 움직일 속성을 **콕 집어** 쓰세요.' },
            { type: 'say', text: '드롭다운을 `display: none ↔ block`으로 열고 닫으면 페이드 효과가 안 돼요. display는 "있다/없다" 두 상태뿐이라 **중간 값이 없거든요.** 중간이 없으면 transition이 채울 게 없어요.' },
            { type: 'code', code: `.dropdown {
  opacity: 0; visibility: hidden;
  transition: opacity .2s, visibility .2s;
}
.menu:hover .dropdown {
  opacity: 1; visibility: visible;
}` },
            { type: 'say', text: '`opacity`로 서서히 사라지게 하고, `visibility: hidden`으로 다 사라진 뒤 **클릭도 안 되게** 막아요. 7강에서 배운 "투명 인간은 만져진다" 문제를 이렇게 해결해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-10-01', type: 'ox', source: 'transition', question: 'transition은 페이지가 열리면 자동으로 실행된다.', answer: false, explanation: 'transition은 상태 변화(hover, class 추가 등)가 있어야 실행돼요. 자동 실행은 animation.' },
    { id: 'fe-10-02', type: 'mcq', source: '4가지 속성', question: 'transition: background-color 0.3s ease 0.1s; 에서 0.1s는?', choices: ['duration', 'delay', 'timing-function', 'property'], answer: 1, explanation: '시간 값이 두 개면 앞이 duration, 뒤가 delay.' },
    { id: 'fe-10-03', type: 'mcq', source: '4가지 속성', question: 'hover에서 나올 때도 부드럽게 되돌아가게 하려면 transition을 어디에 써야 할까?', choices: [':hover 선택자에만', '기본(변하기 전) 선택자에', ':active에', 'body에'], answer: 1, explanation: ':hover에만 쓰면 들어갈 때만 부드럽고 나올 때는 즉시 바뀌어요.' },
    { id: 'fe-10-04', type: 'mcq', source: '타이밍 함수', question: '일정한 속도로 변하는 타이밍 함수는?', choices: ['ease', 'linear', 'ease-in', 'ease-out'], answer: 1, explanation: 'linear = 등속. ease가 기본값.' },
    { id: 'fe-10-05', type: 'short', source: '타이밍 함수', question: '속도 곡선을 직접 만드는 함수 이름은?', answer: ['cubic-bezier', 'cubic-bezier()'], explanation: 'cubic-bezier(x1, y1, x2, y2). 피그마의 커스텀 베지어 이징과 같은 개념.' },
    { id: 'fe-10-06', type: 'ox', source: '예제: 버튼 hover', question: 'transition에 여러 속성을 쉼표로 나열할 수 있다.', answer: true, explanation: 'transition: background-color .25s, transform .25s; 처럼 써요.' },
    { id: 'fe-10-07', type: 'mcq', source: '예제: 카드 이미지 확대', question: 'hover 시 이미지가 카드 밖으로 넘치지 않고 확대되게 하려면 카드에 무엇을 줘야 할까?', choices: ['position: absolute', 'overflow: hidden', 'z-index: 1', 'display: inline'], answer: 1, explanation: 'scale로 커진 부분을 부모의 overflow: hidden이 잘라줘요.' },
    { id: 'fe-10-08', type: 'mcq', source: '성능 팁', question: '애니메이션에 가장 가볍고 부드러운 속성 조합은?', choices: ['width, height', 'top, left', 'transform, opacity', 'margin, padding'], answer: 2, explanation: 'transform·opacity는 레이아웃을 다시 계산하지 않아 가벼워요.' },
    { id: 'fe-10-09', type: 'essay', source: '성능 팁', question: '드롭다운을 display: none ↔ block으로 바꾸면 페이드 효과가 안 되는 이유와 대안은?', answer: 'display는 중간값이 없는 속성이라 transition이 적용되지 않는다. 대신 opacity(0↔1)와 visibility(hidden↔visible)를 함께 전환하면 부드럽게 나타나고, 숨겨진 상태에서는 클릭도 막을 수 있다.', keywords: ['중간값', 'opacity', 'visibility'], explanation: 'display: none은 transition 불가.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-11-animation',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '11강 - animation',
  order: 11,
  notionId: '3efdf951bf80818b979bf501cc09f2f5',
  sections: [
    {
      title: 'transition vs animation',
      slides: [
        {
          title: '스스로 움직이는 애니메이션',
          blocks: [
            { type: 'say', text: '10강의 transition은 hover 같은 **변화가 있어야** 움직였죠. 이번 수업의 `animation`은 아무도 건드리지 않아도 **스스로** 움직여요. 로딩 스피너가 빙글빙글 도는 것, 첫 화면 글자가 아래에서 스르륵 올라오는 것이 다 animation이에요.' },
            {
              type: 'table',
              head: ['', 'transition', 'animation'],
              rows: [
                ['시작 계기', 'hover, class 변경 등 **변화 필요**', '페이지가 열리면 **자동** 가능'],
                ['단계', '시작 → 끝, **두 지점**', '0%, 30%, 70%… **중간 단계 여러 개**'],
                ['반복', '한 번 (변화할 때마다)', '**횟수 지정, 무한 반복** 가능'],
              ],
            },
            { type: 'note', tone: 'analogy', text: 'transition은 **조광기**(돌릴 때만 서서히 변함), animation은 **안무가 짜인 춤**이에요. 음악(페이지)이 시작되면 정해진 동작들을 순서대로, 원하면 몇 번이고 반복해요.' },
          ],
        },
      ],
    },
    {
      title: '@keyframes',
      slides: [
        {
          title: '안무표 짜기',
          blocks: [
            { type: 'say', text: 'animation은 두 단계로 만들어요.\n① `@keyframes`로 **안무표**(어느 시점에 어떤 모습인지)를 짜고\n② 요소에 `animation` 속성으로 **그 안무표를 붙여요.**' },
            { type: 'code', code: `@keyframes float {          /* 안무 이름: float */
  0%   { transform: translateY(0); }       /* 시작: 제자리 */
  50%  { transform: translateY(-10px); }   /* 중간: 10px 위로 */
  100% { transform: translateY(0); }       /* 끝: 다시 제자리 */
}

.icon { animation: float 2s ease-in-out infinite; }   /* ② 붙이기 */` },
            { type: 'say', text: '`%`는 **전체 시간 중 어느 지점인지**예요. 2초짜리라면 50%는 1초 시점이에요. 그 사이는 브라우저가 transition처럼 부드럽게 채워요.' },
          ],
        },
        {
          title: 'from과 to',
          blocks: [
            { type: 'code', code: `@keyframes fadeIn {
  from { opacity: 0; }   /* = 0% */
  to   { opacity: 1; }   /* = 100% */
}` },
            { type: 'say', text: '시작과 끝 두 단계뿐이면 `from`(=0%), `to`(=100%)로 써도 돼요. 읽기가 더 편해요.\n\n심지어 한쪽만 써도 돼요. `@keyframes spin { to { transform: rotate(360deg); } }`처럼 to만 쓰면, 시작은 **요소의 현재 모습**에서 출발해요.' },
          ],
        },
      ],
    },
    {
      title: 'animation 속성',
      slides: [
        {
          title: 'transition과 같은 네 가지',
          blocks: [
            { type: 'code', code: `animation: float 2s ease-in-out 0s infinite alternate both;

/* 이름 float · 시간 2s · 속도 곡선 ease-in-out · 딜레이 0s
   반복 infinite · 방향 alternate · 채우기 both */` },
            { type: 'say', text: '앞의 네 개(**이름, duration, timing-function, delay**)는 10강 transition과 같아요. transition의 "어떤 속성" 자리에 **keyframes 이름**이 들어갔다고 보면 돼요. 나머지는 animation에만 있는 속성이에요.' },
          ],
        },
        {
          title: 'animation에만 있는 속성',
          blocks: [
            {
              type: 'table',
              head: ['속성', '값', '뜻'],
              rows: [
                ['`animation-iteration-count`', '`3`, **`infinite`**', '몇 번 반복할지 / 무한 반복'],
                ['`animation-direction`', '`normal`, `reverse`, **`alternate`**', '정방향 / 거꾸로 / **왕복** (갔다가 돌아오기)'],
                ['`animation-fill-mode`', '**`forwards`**, `both`', '끝난 뒤 **마지막 모습을 유지**할지 (예제 2에서)'],
                ['`animation-play-state`', '`running`, **`paused`**', '재생 중 / **일시 정지** (예제 3에서)'],
              ],
            },
            { type: 'say', text: '`alternate`를 쓰면 0%→100%로 갔다가, 다음 번엔 100%→0%로 **되돌아와요.** 그래서 위의 float를 `0% 제자리 → 100% 위로`만 짜고 alternate를 주면, 50% 단계 없이도 위아래로 둥둥 떠요.' },
            { type: 'ask', q: '"버튼을 계속 살짝 커졌다 작아졌다 하게" 만들려면 iteration-count와 direction을 무엇으로 줄까요?', a: '`infinite`(무한 반복) + `alternate`(왕복)예요. `@keyframes pulse { to { transform: scale(1.05); } }`에 `animation: pulse 1s ease-in-out infinite alternate;`처럼요.' },
          ],
        },
      ],
    },
    {
      title: '예제 1: 로딩 스피너',
      slides: [
        {
          title: '테두리 한쪽만 색칠하고 돌리기',
          blocks: [
            { type: 'code', code: `@keyframes spin { to { transform: rotate(360deg); } }

.spinner {
  width: 32px; height: 32px;
  border: 4px solid #eee;           /* ① 연한 회색 동그라미 */
  border-top-color: tomato;         /* ② 위쪽 테두리만 토마토색 */
  border-radius: 50%;
  animation: spin .8s linear infinite;   /* ③ 일정한 속도로 무한 회전 */
}` },
            { type: 'say', text: '이미지 파일 하나 없이 CSS만으로 스피너를 만들었어요.\n① 5강의 `border-radius: 50%`로 동그라미를 만들고\n② 테두리 네 변 중 **위쪽만** 다른 색을 칠한 뒤\n③ 계속 돌리면 색칠된 부분이 빙글빙글 도는 것처럼 보여요.' },
            { type: 'note', tone: 'tip', text: '스피너에는 `linear`가 어울려요. `ease`로 돌리면 한 바퀴마다 **느려졌다 빨라졌다** 해서 덜컹거리는 것처럼 보여요. 끊김 없이 계속 도는 건 일정한 속도가 자연스러워요.' },
          ],
        },
      ],
    },
    {
      title: '예제 2: 등장 효과',
      slides: [
        {
          title: '끝나자마자 다시 사라져요?',
          blocks: [
            { type: 'code', code: `@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-desc { opacity: 0; animation: fadeUp .8s ease-out; }` },
            { type: 'say', text: '첫 화면 글자가 아래에서 스르륵 올라오게 했어요. 그런데 애니메이션이 끝나는 순간 글자가 **다시 사라져요!**\n\n기본적으로 animation은 끝나면 **원래 CSS 상태로 돌아가요.** 원래 상태가 `opacity: 0`이니 다시 투명해지는 거예요.' },
            { type: 'code', code: `.hero-desc { opacity: 0; animation: fadeUp .8s ease-out forwards; }
/* forwards → 끝난 모습(to)을 그대로 유지 */` },
            { type: 'say', text: '`forwards`는 "끝난 뒤에도 **마지막 장면(to)** 에 머물러"라는 뜻이에요.' },
          ],
        },
        {
          title: 'forwards와 both의 차이',
          blocks: [
            { type: 'say', text: '이번엔 **0.2초 딜레이**를 줘서 제목 다음에 설명이 올라오게 해 볼게요. CSS 원래 상태에 opacity를 안 적어 뒀다면(보이는 상태라면) 무슨 일이 생길까요?' },
            {
              type: 'table',
              head: ['fill-mode', '딜레이 0.2초 동안', '끝난 뒤'],
              rows: [
                ['없음', '원래 상태 (**보임** → 깜빡)', '원래 상태로 돌아감'],
                ['`forwards`', '원래 상태 (**보임** → 깜빡)', '**to 유지** ✅'],
                ['`both`', '**from 상태** (투명) ✅', '**to 유지** ✅'],
              ],
            },
            { type: 'code', code: `.hero-desc { animation: fadeUp .8s ease-out .2s both; }` },
            { type: 'say', text: '`forwards`는 **끝**만 책임지고, `both`는 **딜레이 동안 시작 모습(from)** 까지 미리 적용해요. 딜레이가 있는 등장 효과에서 forwards만 쓰면, 글자가 0.2초 동안 **보였다가 → 사라졌다가 → 올라오는** 깜빡임이 생겨요. 등장 효과는 `both`가 안전해요.' },
          ],
        },
      ],
    },
    {
      title: '예제 3: hover 하면 멈추기',
      slides: [
        {
          title: '흐르는 배너 잠깐 멈추기',
          blocks: [
            { type: 'code', code: `.banner-track { animation: slide 20s linear infinite; }
.banner:hover .banner-track { animation-play-state: paused; }` },
            { type: 'say', text: '옆으로 계속 흘러가는 로고 띠나 공지 배너, 읽으려는데 자꾸 지나가면 답답하죠. 마우스를 올렸을 때 `animation-play-state: paused`로 **그 자리에서 일시 정지**시켜요. 마우스를 떼면 `running`(기본값)으로 돌아가서 **멈췄던 곳부터** 이어서 흘러요.' },
            { type: 'ask', q: '`paused` 대신 `animation: none`을 주면 어떻게 다를까요?', a: '`none`은 애니메이션을 **아예 지워 버려서** 요소가 원래 위치로 **확 튀어 돌아가요.** 마우스를 떼면 처음부터 다시 시작하고요. "잠깐 멈춤"은 `paused`예요.' },
          ],
        },
      ],
    },
    {
      title: '접근성',
      slides: [
        {
          title: '움직임이 불편한 사람도 있어요',
          blocks: [
            { type: 'say', text: '화면 속 큰 움직임은 어떤 사람에게 **어지럼증이나 멀미**를 일으켜요. 그래서 운영체제(Windows, macOS, iOS, Android)에는 **"동작 줄이기"** 설정이 있어요. 이 설정을 켠 사용자에게는 애니메이션을 줄여 주는 게 예의예요.' },
            { type: 'code', code: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}` },
            { type: 'say', text: '`prefers-reduced-motion: reduce`는 "이 사용자는 **동작 줄이기를 켰다**"일 때만 적용되는 미디어 쿼리예요(미디어 쿼리는 15강). 그 안에서 애니메이션 시간을 거의 0으로 만들어서, 움직임 없이 **바로 최종 모습**이 보이게 해요.' },
            { type: 'note', tone: 'tip', text: '2강에서 `!important`는 피하라고 했지만, 이건 "사용자 설정이 무조건 이겨야 한다"는 몇 안 되는 정당한 경우예요. 이 블록을 리셋 CSS 근처에 한 번 넣어 두면 사이트 전체에 적용돼요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-11-01', type: 'mcq', source: 'transition vs animation', question: 'animation이 transition과 다른 점은?', choices: ['상태 변화가 있어야만 실행된다', '중간 단계를 여러 개 두고 자동·반복 실행할 수 있다', '두 지점만 연결한다', 'hover에서만 동작한다'], answer: 1, explanation: 'animation은 @keyframes로 여러 단계를 정의하고 페이지 로드 시 자동·반복 실행이 가능해요.' },
    { id: 'fe-11-02', type: 'ox', source: '@keyframes', question: '@keyframes에서 from은 0%, to는 100%와 같다.', answer: true, explanation: 'from/to는 0%/100%의 별칭이에요.' },
    { id: 'fe-11-03', type: 'mcq', source: 'animation 속성', question: '애니메이션을 왕복(갔다가 돌아오기)으로 반복하는 direction 값은?', choices: ['normal', 'reverse', 'alternate', 'forwards'], answer: 2, explanation: 'alternate = 왕복.' },
    { id: 'fe-11-04', type: 'short', source: 'animation 속성', question: '애니메이션을 무한 반복하는 iteration-count 값은?', answer: ['infinite'], explanation: 'animation-iteration-count: infinite.' },
    { id: 'fe-11-05', type: 'mcq', source: '예제 1: 로딩 스피너', question: '로딩 스피너 회전에 어울리는 타이밍 함수는?', choices: ['ease', 'ease-in-out', 'linear', 'steps(1)'], answer: 2, explanation: '회전은 일정한 속도(linear)여야 끊김 없이 돌아가요.' },
    { id: 'fe-11-06', type: 'mcq', source: '예제 2: 등장 효과', question: 'fadeUp(투명→보임) 애니메이션이 끝난 뒤 다시 투명해지는 문제를 막는 속성값은?', choices: ['animation-direction: reverse', 'animation-fill-mode: forwards', 'animation-play-state: paused', 'animation-delay: 0'], answer: 1, explanation: 'forwards는 끝난 상태(to)를 유지해요.' },
    { id: 'fe-11-07', type: 'essay', source: '예제 2: 등장 효과', question: 'animation-fill-mode의 forwards와 both의 차이를 딜레이가 있는 등장 효과를 예로 설명하세요.', answer: 'forwards는 애니메이션이 끝난 뒤 마지막 상태를 유지할 뿐, 딜레이 동안에는 원래 상태(보이는 상태)로 있다가 시작할 때 갑자기 투명해진다. both는 딜레이 동안에도 시작 상태(from, 투명)를 유지하고 끝난 뒤에도 끝 상태를 유지해서 깜빡임 없이 자연스럽게 등장한다.', keywords: ['딜레이', '시작 상태', '끝 상태'], explanation: 'both = backwards(딜레이 중 시작 상태) + forwards(끝 상태 유지).' },
    { id: 'fe-11-08', type: 'short', source: '예제 3: hover 하면 멈추기', question: 'hover 시 흐르는 배너를 멈추게 하는 속성: 값은?', answer: ['animation-play-state: paused', 'animation-play-state:paused'], explanation: '.banner:hover { animation-play-state: paused; }' },
    { id: 'fe-11-09', type: 'mcq', source: '접근성', question: '움직임에 민감한 사용자를 위해 애니메이션을 끄는 미디어 쿼리는?', choices: ['@media (prefers-color-scheme: dark)', '@media (prefers-reduced-motion: reduce)', '@media (hover: none)', '@media print'], answer: 1, explanation: 'OS의 "동작 줄이기" 설정을 존중하는 미디어 쿼리예요.' },
  ],
}

export default topic

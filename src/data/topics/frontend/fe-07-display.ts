import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-07-display',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '7강 - display (block, inline, inline-block)',
  order: 7,
  notionId: '3efdf951bf8081e6b3dcea056fe69ceb',
  sections: [
    {
      title: 'block',
      slides: [
        {
          title: '상자마다 성격이 있어요',
          blocks: [
            { type: 'say', text: '5강에서 모든 요소는 상자라고 했죠. 그런데 상자마다 **줄을 서는 방식**이 달라요. 어떤 상자는 혼자 한 줄을 다 쓰고, 어떤 상자는 옆으로 나란히 서요. 이 성격을 정하는 속성이 `display`예요.\n\n이번 수업에서 세 가지 성격(**block**, **inline**, **inline-block**)을 배우면, "왜 width가 안 먹지?", "왜 옆으로 안 붙지?" 같은 의문이 대부분 풀려요.' },
          ],
        },
        {
          title: 'block: 한 줄을 통째로',
          blocks: [
            { type: 'code', code: `<h1>제목</h1>
<p>문단</p>
<div>상자</div>

+--------------------------------+
| h1                             |  ← 가로 한 줄 전부
+--------------------------------+
| p                              |  ← 다음 요소는 아래 줄로
+--------------------------------+
| div                            |
+--------------------------------+` },
            { type: 'list', items: ['너비를 안 정하면 **가로 한 줄을 전부** 차지해요 (글자가 짧아도요)', '그래서 다음 요소는 항상 **아래 줄**로 내려가요', '`width`, `height`, `margin`, `padding` 전부 **잘 먹어요**', '예: `div`, `p`, `h1`~`h6`, `ul`, `li`, `section`, `header`'] },
            { type: 'note', tone: 'analogy', text: '**block은 책장의 칸**이에요. 한 칸에 책 한 권만 들어 있어도 그 칸은 가로로 꽉 차 있고, 다음 책은 아래 칸으로 가요.' },
          ],
        },
      ],
    },
    {
      title: 'inline',
      slides: [
        {
          title: 'inline: 글자처럼 흘러가요',
          blocks: [
            { type: 'code', code: `<p>오늘의 <strong>추천</strong> 빵은 <a href="#">크로와상</a>입니다.</p>

→ 오늘의 추천 빵은 크로와상입니다.   (줄바꿈 없이 문장 안에 쏙)` },
            { type: 'say', text: 'inline 요소는 **글자처럼** 행동해요. 내용만큼만 자리를 차지하고, 옆에 나란히 흘러가요. 줄이 꽉 차면 다음 줄로 자연스럽게 넘어가고요.\n예: `span`, `a`, `strong`, `em`' },
            { type: 'note', tone: 'analogy', text: '**inline은 문장 속 단어**예요. 단어에게 "너는 폭 200px, 높이 50px"라고 할 수 없죠. 단어는 글자 길이만큼만 차지하고 문장 흐름을 따라가요.' },
          ],
        },
        {
          title: 'inline에서 안 먹는 것들',
          blocks: [
            {
              type: 'table',
              head: ['속성', 'inline에서'],
              rows: [
                ['`width`, `height`', '❌ **무시**돼요 (크기는 내용이 정함)'],
                ['좌우 `margin`, `padding`', '✅ 잘 돼요'],
                ['위아래 `margin`', '❌ 무시돼요'],
                ['위아래 `padding`', '⚠️ 배경은 **보이지만**, 위아래 줄을 **밀어내지 않아서** 겹쳐요'],
              ],
            },
            { type: 'say', text: '"링크에 `height: 50px` 줬는데 안 돼요!" — 링크(`a`)가 inline이라서 그래요. 다음 개념들에서 해결 방법이 나와요.' },
            { type: 'note', tone: 'tip', text: '`<img>`는 inline인데도 **예외적으로** width·height가 먹어요. 이미지처럼 바깥 파일로 내용이 정해지는 요소를 "대체 요소"라고 하는데, 이건 특별 취급을 받아요.' },
          ],
        },
      ],
    },
    {
      title: 'inline-block',
      slides: [
        {
          title: '두 성격의 좋은 점만',
          blocks: [
            { type: 'say', text: '`inline-block`은 이름 그대로 **둘을 섞었어요.**\n• 바깥에서 보면 **inline** → 옆으로 나란히 서요\n• 안에서 보면 **block** → width, height, 위아래 margin·padding이 **다 먹어요**' },
            { type: 'code', code: `.tag {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  border-radius: 999px;
  background: #fde8d7;
}
<span class="tag">#빵</span><span class="tag">#디저트</span><span class="tag">#커피</span>` },
            { type: 'say', text: '해시태그 칩이나 작은 버튼처럼 **옆으로 나란히 + 크기와 여백도 필요**한 곳에 딱이에요.' },
          ],
        },
        {
          title: '의문의 4px 틈',
          blocks: [
            { type: 'code', code: `<li>홈</li>
<li>메뉴</li>      ← HTML에서 줄을 바꿔 썼을 뿐인데
<li>오시는 길</li>

li { display: inline-block; }   → 홈 _ 메뉴 _ 오시는 길  (사이에 약 4px 틈)` },
            { type: 'say', text: 'inline-block은 **글자처럼** 흘러간다고 했죠. 그래서 HTML 코드의 **줄바꿈·띄어쓰기를 공백 한 칸(띄어쓰기 글자)** 으로 보여 줘요. margin을 0으로 해도 사라지지 않는 이유예요.' },
            { type: 'note', tone: 'tip', text: '그래서 요즘은 나란히 배치할 때 대부분 **flex**(16강)를 써요. flex 안에서는 이런 공백 틈이 생기지 않고, 정렬도 훨씬 쉬워요.' },
          ],
        },
      ],
    },
    {
      title: 'display로 성질 바꾸기',
      slides: [
        {
          title: '태그의 기본 성질은 바꿀 수 있어요',
          blocks: [
            { type: 'say', text: 'block, inline은 태그마다 **기본값**일 뿐이에요. `display`로 언제든 바꿀 수 있어요. 실무에서 가장 흔한 두 가지를 볼게요.' },
            { type: 'code', code: `/* ① 세로 목록 → 가로 메뉴 */
.menu li { display: inline-block; }

/* ② 링크 클릭 영역 넓히기 */
.menu a {
  display: block;
  padding: 12px 16px;
}` },
            { type: 'say', text: '②가 특히 중요해요. 링크(`a`)는 inline이라 **글자 부분만** 눌려요. 메뉴 칸 전체를 눌러도 이동하게 하려면 `display: block`으로 바꾸고 padding을 줘서 **누를 수 있는 면적**을 넓혀요. 손가락으로 누르는 모바일에서 특히 중요해요.' },
            { type: 'list', items: ['그 밖의 display 값: `flex`, `grid` (16강), `none` (다음 개념)'] },
          ],
        },
      ],
    },
    {
      title: '숨기기: display: none vs visibility: hidden vs opacity: 0',
      slides: [
        {
          title: '숨기는 방법 세 가지',
          blocks: [
            { type: 'say', text: '요소를 안 보이게 하는 방법이 세 가지 있어요. 눈에 안 보이는 건 같지만 **공간**과 **클릭**에서 달라요.' },
            {
              type: 'table',
              head: ['방법', '자리(공간)', '클릭', '서서히 사라지기'],
              rows: [
                ['`display: none`', '**사라짐** (뒤 요소가 당겨 옴)', '안 됨', '안 됨 (뚝 바뀜)'],
                ['`visibility: hidden`', '**남음** (빈칸)', '안 됨', '안 됨 (뚝 바뀜)'],
                ['`opacity: 0`', '**남음** (빈칸)', '**됨!**', '**됨**'],
              ],
            },
          ],
        },
        {
          title: '교실 자리로 기억하기',
          blocks: [
            { type: 'note', tone: 'analogy', text: '교실에서 학생 한 명이 안 보이게 되는 상황이에요.\n• **display: none** = **전학 갔어요.** 책상까지 빼서 뒷사람이 앞으로 당겨 앉아요.\n• **visibility: hidden** = **결석했어요.** 빈 책상은 그대로 있어요.\n• **opacity: 0** = **투명 인간**이 됐어요. 자리에 그대로 앉아 있어서, 손을 뻗으면 **만져져요(클릭됨)**.' },
            { type: 'say', text: '`opacity: 0`의 "클릭됨"은 실수의 원인이 되기도 해요. 투명하게 만든 메뉴가 그 자리를 덮고 있어서 **아래 버튼이 안 눌리는** 거죠. 완전히 숨긴 뒤엔 `visibility: hidden`이나 `pointer-events: none`을 같이 줘요.' },
            { type: 'ask', q: '모달 창을 **서서히** 사라지게 하고 싶어요. 셋 중 무엇을 써야 할까요?', a: '`opacity`예요. 0~1 사이 숫자라서 10강의 `transition`으로 부드럽게 바꿀 수 있어요. `display: none`은 "있다/없다" 두 상태뿐이라 중간 단계가 없어서 뚝 사라져요.' },
          ],
        },
      ],
    },
    {
      title: '정리표',
      slides: [
        {
          title: '한 장으로 정리',
          blocks: [
            {
              type: 'table',
              head: ['', 'block', 'inline', 'inline-block'],
              rows: [
                ['다음 요소가 아래 줄로?', '**O**', 'X (옆으로)', 'X (옆으로)'],
                ['width · height', '**O**', 'X', '**O**'],
                ['위아래 margin', '**O**', 'X', '**O**'],
                ['대표 태그', 'div, p, h1, li', 'span, a, strong', '(기본 태그 없음, 직접 지정)'],
              ],
            },
            { type: 'say', text: '외우는 요령: **inline-block은 줄 서는 법만 inline이고, 나머지는 전부 block**이에요. 표의 inline-block 줄은 첫 칸만 빼고 block과 똑같죠.' },
            { type: 'ask', q: '버튼을 문장 옆에 나란히 두면서, 높이를 44px로 맞추고 싶어요. 어떤 display일까요?', a: '**inline-block**이에요. 옆에 나란히(inline) + 높이 지정(block). 요즘은 부모를 flex로 만들어 해결하는 경우도 많아요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-07-01', type: 'mcq', source: 'block', question: 'block 요소가 아닌 것은?', choices: ['div', 'p', 'section', 'span'], answer: 3, explanation: 'span은 inline. div, p, section, h1, ul, li 등이 block.' },
    { id: 'fe-07-02', type: 'ox', source: 'block', question: 'block 요소는 너비를 지정하지 않으면 가로 한 줄을 전부 차지한다.', answer: true, explanation: '그래서 다음 요소는 아래 줄로 내려가요.' },
    { id: 'fe-07-03', type: 'mcq', source: 'inline', question: 'inline 요소에 적용되지 않는 것은?', choices: ['좌우 margin', '글자 색', 'width와 위아래 margin', '좌우 padding'], answer: 2, explanation: 'inline은 width·height와 위아래 margin이 적용되지 않아요.' },
    { id: 'fe-07-04', type: 'ox', source: 'inline', question: 'inline 요소의 위아래 padding은 보이지만 주변 줄 간격을 밀어내지 않는다.', answer: true, explanation: '배경은 커지지만 레이아웃(줄 높이)에 반영되지 않아 겹쳐 보일 수 있어요.' },
    { id: 'fe-07-05', type: 'mcq', source: 'inline-block', question: '태그(#빵 #디저트)처럼 옆으로 나란히 두면서 padding·margin을 주고 싶을 때 적합한 display는?', choices: ['block', 'inline', 'inline-block', 'none'], answer: 2, explanation: 'inline-block = 나란히 + 크기·여백 적용.' },
    { id: 'fe-07-06', type: 'short', source: 'inline-block', question: 'inline-block 요소 사이에 생기는 틈(약 4px)의 원인은?', answer: ['HTML 줄바꿈', '줄바꿈', '공백', 'HTML 공백', '띄어쓰기'], explanation: 'HTML 코드의 줄바꿈이 공백 문자로 렌더링되기 때문. 그래서 요즘은 flex를 많이 써요.' },
    { id: 'fe-07-07', type: 'mcq', source: 'display로 성질 바꾸기', question: '메뉴 링크의 클릭 영역을 넓히려고 a에 주는 속성은?', choices: ['display: inline', 'display: block + padding', 'visibility: visible', 'float: left'], answer: 1, explanation: 'a는 inline이라 padding이 레이아웃에 반영되지 않아요. block으로 바꾸고 padding을 주면 클릭 영역이 넓어져요.' },
    { id: 'fe-07-08', type: 'mcq', source: '숨기기: display: none vs visibility: hidden vs opacity: 0', question: '안 보이지만 "공간은 남는" 방법 두 가지는?', choices: ['display: none, opacity: 0', 'visibility: hidden, opacity: 0', 'display: none, visibility: hidden', 'display: none만'], answer: 1, explanation: 'display: none만 공간까지 사라져요.' },
    { id: 'fe-07-09', type: 'ox', source: '숨기기: display: none vs visibility: hidden vs opacity: 0', question: 'opacity: 0인 요소는 클릭할 수 없다.', answer: false, explanation: '투명할 뿐 그대로 있어서 클릭이 돼요. transition 애니메이션도 가능.' },
    { id: 'fe-07-10', type: 'mcq', source: '정리표', question: '"줄바꿈 X / 크기 지정 O / 상하 margin O" 인 것은?', choices: ['block', 'inline', 'inline-block', 'none'], answer: 2, explanation: 'inline-block의 특징이에요.' },
  ],
}

export default topic

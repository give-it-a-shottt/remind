import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-13-float',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '13강 - float',
  order: 13,
  notionId: '3efdf951bf808113b2d3feb8e3c3c4b7',
  sections: [
    {
      title: 'float',
      slides: [
        {
          title: '사진 옆으로 글이 흐르게',
          blocks: [
            { type: 'say', text: '이번 수업은 **float**예요. 요즘 새로 짜는 코드에선 잘 안 쓰지만, 오래된 사이트에는 정말 많이 남아 있어서 **읽을 줄은 알아야** 해요.' },
            { type: 'code', code: `<img class="photo" src="bread.jpg" alt="식빵" />
<p>우리 빵집의 식빵은 72시간 저온 숙성한 반죽으로… (긴 글)</p>

.photo { float: left; width: 200px; margin-right: 16px; }` },
            { type: 'code', code: `+----------+  우리 빵집의 식빵은 72시간
|  photo   |  저온 숙성한 반죽으로 만들어
|          |  겉은 바삭하고 속은 촉촉해요.
+----------+  매일 아침 7시에 첫 빵이
나오고, 오후 3시면 대부분 품절이에요.
← 사진이 끝나면 글이 아래로 다시 넓게 흘러요` },
            { type: 'say', text: '`float: left`는 요소를 **왼쪽으로 띄워 붙이고**, 뒤따르는 글자가 그 **주위를 감싸며 흐르게** 해요. 신문·잡지에서 사진 옆에 기사가 흐르는 배치가 원래 목적이에요.' },
          ],
        },
        {
          title: '원래 목적 밖에서 쓰이던 시절',
          blocks: [
            { type: 'say', text: '예전에는 16강에서 배울 **flex, grid가 없었어요.** 요소를 가로로 나란히 놓을 마땅한 방법이 없으니, 개발자들이 float를 **억지로** 레이아웃에 썼어요.\n• 메뉴를 가로로: `li { float: left; }`\n• 2단 레이아웃: 사이드바 `float: left`, 본문 `float: right`\n\n그래서 10년 넘은 사이트 코드를 열면 float가 가득해요. 그리고 원래 용도가 아니다 보니 **이상한 문제**가 생겼어요. 다음 개념이 그 문제예요.' },
          ],
        },
      ],
    },
    {
      title: '문제: 부모 높이가 사라짐',
      slides: [
        {
          title: '부모가 자식을 못 봐요',
          blocks: [
            { type: 'code', code: `<div class="box">          ← 배경색 베이지
  <div class="item">A</div>   float: left
  <div class="item">B</div>   float: left
</div>
<footer>푸터</footer>` },
            { type: 'say', text: '기대: 베이지 상자 안에 A, B가 나란히, 그 아래 푸터.\n현실: **베이지 배경이 안 보이고**, 푸터가 A·B 옆으로 **끌려 올라와요.**\n\n이유: float된 요소는 9강의 absolute처럼 **문서 흐름에서 빠져요.** 부모 `.box` 입장에선 안에 **아무것도 없는** 셈이라, 높이를 내용만큼 정하다 보니 **높이가 0**이 돼요. 높이가 0이니 배경도 안 보이고, 아래 요소가 그 빈자리로 올라오는 거예요.' },
            { type: 'note', tone: 'analogy', text: '상자에 풍선(float된 자식) 두 개를 넣었는데, 풍선이 둥둥 떠서 상자 바닥에 **무게가 하나도 안 실려요.** 상자는 "나 빈 상자네" 하고 납작하게 접혀 버려요.' },
            { type: 'say', text: '이 문제를 해결하는 방법이 세 가지 있어요. 오래된 것부터 차례로 볼게요.' },
          ],
        },
      ],
    },
    {
      title: '해결 1: clear',
      slides: [
        {
          title: 'float 아래로 내려가기',
          blocks: [
            { type: 'code', code: `footer { clear: both; }` },
            { type: 'say', text: '`clear`는 "**나는 float 옆에 서지 않을래, 그 아래로 내려갈래**"라는 뜻이에요.' },
            {
              type: 'table',
              head: ['값', '뜻'],
              rows: [
                ['`left`', '왼쪽 float 아래로'],
                ['`right`', '오른쪽 float 아래로'],
                ['`both`', '**양쪽** float 모두 아래로 (가장 많이 씀)'],
              ],
            },
            { type: 'say', text: '푸터가 끌려 올라오는 건 이걸로 해결돼요. 하지만 **부모 높이 0** 문제는 그대로예요. 부모 배경은 여전히 안 보여요. 그래서 다음 방법이 나왔어요.' },
          ],
        },
      ],
    },
    {
      title: '해결 2: clearfix',
      slides: [
        {
          title: '부모 안 맨 끝에 clear 하나 두기',
          blocks: [
            { type: 'code', code: `.clearfix::after {
  content: "";        /* ① 가상 요소를 만들려면 필수 (4강) */
  display: block;     /* ② 한 줄을 차지하는 블록으로 */
  clear: both;        /* ③ float들 아래로 내려가기 */
}

<div class="box clearfix">...</div>` },
            { type: 'say', text: '아이디어는 이래요. 부모 안의 **맨 마지막**에 보이지 않는 블록을 하나 두고, 그 블록에 `clear: both`를 줘서 float들 **아래로** 내려가게 해요. 이 블록은 float가 아니라 **흐름 안에** 있으니, 부모는 "아, 여기까지 내용이 있구나" 하고 **그 블록까지 높이를 늘려요.**\n\nHTML에 빈 div를 직접 넣는 대신, 4강의 `::after` 가상 요소로 CSS만으로 만들었어요.' },
            { type: 'ask', q: '세 줄 중 `content: ""`를 빼면 어떻게 될까요?', a: '`::after` 자체가 **만들어지지 않아요.** 4강에서 배웠듯이 가상 요소는 content가 있어야 생겨요. 나머지 두 줄이 있어도 적용할 대상이 없으니 아무 효과가 없어요.' },
          ],
        },
      ],
    },
    {
      title: '해결 3: BFC (flow-root)',
      slides: [
        {
          title: '한 줄로 끝내는 최신 방법',
          blocks: [
            { type: 'code', code: `.box { display: flow-root; }` },
            { type: 'say', text: '`display: flow-root`는 이 요소를 **독립된 레이아웃 구역**으로 만들어요. 이런 구역을 **BFC**(Block Formatting Context, 블록 서식 맥락)라고 하는데, BFC는 **안에 있는 float까지 다 감싸서** 높이를 계산해요.\n\n이름부터 "흐름(flow)의 뿌리(root)" — 이 문제를 해결하려고 만든 값이라 부작용이 없어요. clearfix 세 줄이 한 줄이 됐어요.' },
          ],
        },
        {
          title: '예전 방식 overflow: hidden의 부작용',
          blocks: [
            { type: 'code', code: `.box { overflow: hidden; }   /* 예전에 많이 쓰던 방법 */` },
            { type: 'say', text: '`overflow: hidden`도 BFC를 만들어서 float를 감싸요. 그래서 오래된 코드에서 자주 보여요. 하지만 원래 목적은 **넘친 걸 잘라내는 것**(5강)이라 부작용이 있어요.\n• 상자 밖으로 나가야 하는 **드롭다운 메뉴, 툴팁, 그림자**가 잘려요\n• 9강에서 본 것처럼 안쪽의 **sticky가 고장** 나요' },
            { type: 'note', tone: 'tip', text: '오래된 코드에서 `overflow: hidden`을 봤는데 왜 있는지 모르겠다면, float 감싸기용일 가능성이 커요. 함부로 지우면 레이아웃이 무너질 수 있으니, `flow-root`로 **바꿔 주는** 게 안전해요.' },
          ],
        },
      ],
    },
    {
      title: '요즘은?',
      slides: [
        {
          title: 'float의 현재 자리',
          blocks: [
            {
              type: 'table',
              head: ['하고 싶은 것', '요즘 방법'],
              rows: [
                ['가로로 나란히 배치, 메뉴', '**flex** (16강)'],
                ['여러 단, 바둑판 레이아웃', '**grid** (16강)'],
                ['사진 옆으로 글 감싸기', '**float** — 원래 용도로만!'],
              ],
            },
            { type: 'say', text: 'float는 이제 **원래 하던 일**로 돌아갔어요. 레이아웃에는 flex와 grid를 써요. 부모 높이 0 같은 문제도 없고, 정렬도 훨씬 쉬워요.\n\n그래도 이번 수업이 쓸모없지 않아요. 회사에 들어가면 **유지보수해야 할 기존 코드**에 float와 clearfix가 많아요. "이게 왜 여기 있지?"를 알아야 안전하게 고칠 수 있어요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-13-01', type: 'mcq', source: 'float', question: 'float의 원래 목적은?', choices: ['페이지 전체 레이아웃', '사진 옆으로 글이 흐르게 감싸기', '요소 숨기기', '화면 고정'], answer: 1, explanation: '신문·잡지 같은 텍스트 감싸기가 원래 용도예요.' },
    { id: 'fe-13-02', type: 'ox', source: '문제: 부모 높이가 사라짐', question: '자식이 모두 float이면 부모의 높이가 0이 될 수 있다.', answer: true, explanation: 'float된 자식은 흐름에서 빠져 부모가 높이를 계산하지 못해요.' },
    { id: 'fe-13-03', type: 'short', source: '해결 1: clear', question: '양쪽 float 아래로 내려가게 하는 clear 값은?', answer: ['both'], explanation: 'clear: both.' },
    { id: 'fe-13-04', type: 'mcq', source: '해결 2: clearfix', question: 'clearfix에서 ::after에 꼭 필요한 세 가지는?', choices: ['content: "", display: block, clear: both', 'float: none, height: 0, overflow: hidden', 'position: absolute, clear: left, content: none', 'display: flex, gap: 0, clear: both'], answer: 0, explanation: '빈 내용의 블록 가상 요소가 float 아래로 내려가며 부모 높이를 만들어요.' },
    { id: 'fe-13-05', type: 'short', source: '해결 3: BFC (flow-root)', question: 'float 문제를 해결하는 최신·가장 깔끔한 방법: 부모에 display: ?', answer: ['flow-root'], explanation: 'display: flow-root는 새 블록 서식 맥락(BFC)을 만들어 float 자식을 감싸요.' },
    { id: 'fe-13-06', type: 'ox', source: '해결 3: BFC (flow-root)', question: '부모에 overflow: hidden을 주는 예전 방식은 부작용이 없다.', answer: false, explanation: '넘치는 내용(그림자, 드롭다운 등)이 잘릴 수 있어요.' },
    { id: 'fe-13-07', type: 'mcq', source: '요즘은?', question: '요즘 가로 배치·단 나누기에 쓰는 방법은?', choices: ['float', 'table', 'flex, grid', 'position: absolute'], answer: 2, explanation: 'flex/grid가 표준. float은 텍스트 감싸기 용도로만.' },
  ],
}

export default topic

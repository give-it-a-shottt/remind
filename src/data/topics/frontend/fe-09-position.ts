import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-09-position',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '9강 - position',
  order: 9,
  notionId: '3efdf951bf808129b2a8d94874dc21a5',
  sections: [
    {
      title: 'position 값',
      slides: [
        {
          title: '흐름에서 벗어나 원하는 곳에',
          blocks: [
            { type: 'say', text: '지금까지 배운 요소들은 HTML에 쓴 순서대로 위에서 아래로, 왼쪽에서 오른쪽으로 **줄을 서요.** 이걸 **문서 흐름**(normal flow)이라고 해요.\n\n그런데 "카드 오른쪽 위 모서리에 배지", "화면 오른쪽 아래에 떠 있는 버튼"처럼 **줄과 상관없이 콕 집은 자리**에 두고 싶을 때가 있어요. 그때 쓰는 게 `position`이에요.' },
            { type: 'code', code: `.box {
  position: absolute;   /* 어떤 방식으로 */
  top: 12px;            /* 기준에서 위로부터 12px */
  right: 12px;          /* 기준에서 오른쪽으로부터 12px */
}` },
            { type: 'say', text: '`position`으로 **기준**을 정하고, `top`·`right`·`bottom`·`left`로 그 기준에서 얼마나 떨어질지 정해요. 값이 다섯 개인데, 핵심은 **"무엇을 기준으로 움직이나"** 예요.' },
          ],
        },
        {
          title: 'static과 relative',
          blocks: [
            {
              type: 'table',
              head: ['값', '기준', '원래 자리'],
              rows: [
                ['`static` (기본)', '없음 — top/left를 **무시**해요', '흐름대로'],
                ['`relative`', '**내 원래 자리**', '**그대로 차지**해요 (빈자리가 남음)'],
              ],
            },
            { type: 'code', code: `.box { position: relative; top: 10px; left: 20px; }
/* 원래 자리에서 아래로 10, 오른쪽으로 20 살짝 밀림.
   다른 요소들은 이 상자가 아직 원래 자리에 있다고 생각해요 */` },
            { type: 'say', text: '`relative`는 혼자 쓸 일은 많지 않아요. 진짜 쓰임새는 바로 다음 값, **absolute의 기준점**이 되어 주는 거예요.' },
          ],
        },
        {
          title: 'absolute, fixed, sticky',
          blocks: [
            {
              type: 'table',
              head: ['값', '기준', '원래 자리'],
              rows: [
                ['`absolute`', 'position이 static이 **아닌 가장 가까운 조상** (없으면 페이지 전체)', '**사라져요** (흐름에서 빠짐)'],
                ['`fixed`', '**화면(뷰포트)** — 스크롤해도 그 자리', '사라져요'],
                ['`sticky`', '평소엔 relative처럼 있다가, 스크롤이 지정 위치에 닿으면 **달라붙음**', '그대로 차지'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '• **relative** = 내 자리에 앉은 채로 의자만 살짝 옆으로 밀기\n• **absolute** = 자리를 비우고 일어나서, **가장 가까운 "기준 표시 붙은 어른"** 옆에 서기\n• **fixed** = 창문 유리에 붙인 스티커. 방 안(페이지)이 움직여도 창문 기준으로 그대로\n• **sticky** = 같이 걸어가다가 문 앞에 닿으면 거기 멈춰 서는 사람' },
            { type: 'ask', q: 'absolute 요소의 부모들 중 아무도 position을 안 주면, 기준은 어디가 될까요?', a: '**페이지 전체**(정확히는 문서의 첫 화면 영역)예요. 그래서 "배지가 카드가 아니라 화면 구석으로 날아갔어요!"라는 일이 생겨요. 다음 패턴에서 해결해요.' },
          ],
        },
      ],
    },
    {
      title: '패턴 1: 카드 모서리 배지',
      slides: [
        {
          title: 'relative 부모 + absolute 자식',
          blocks: [
            { type: 'say', text: '실무에서 position을 쓰는 경우의 절반은 이 조합이에요.' },
            { type: 'code', code: `.card { position: relative; }            /* ① 기준점 표시 */
.card .badge {
  position: absolute;                     /* ② 흐름에서 빠져서 */
  top: 12px;                              /* ③ 카드 기준 위 12 */
  right: 12px;                            /*    오른쪽 12 */
}

<article class="card">
  <span class="badge">BEST</span>
  <img src="croissant.jpg" alt="크로와상" />
</article>` },
            { type: 'say', text: '부모(`.card`)에 `relative`를 주는 이유는 **움직이기 위해서가 아니라 "내가 기준이야"라고 표시하기 위해서**예요. top/left를 안 줬으니 카드 자체는 꿈쩍도 안 해요. 이 표시 덕분에 배지가 화면 구석으로 날아가지 않고 **카드 모서리**에 붙어요.' },
            { type: 'note', tone: 'tip', text: '"absolute가 엉뚱한 데로 가요" → 원하는 부모에 `position: relative`를 줬는지부터 확인하세요. 열에 아홉은 이거예요.' },
          ],
        },
      ],
    },
    {
      title: '패턴 2: 고정 헤더와 플로팅 버튼',
      slides: [
        {
          title: 'fixed로 늘 보이게',
          blocks: [
            { type: 'code', code: `.header {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 64px;
}
.top-button {
  position: fixed;
  right: 20px; bottom: 20px;   /* 화면 오른쪽 아래 "맨 위로" 버튼 */
}` },
            { type: 'say', text: '스크롤해도 늘 위에 있는 헤더, 오른쪽 아래 떠 있는 채팅 버튼이 전부 `fixed`예요.' },
          ],
        },
        {
          title: '헤더가 본문을 가려요',
          blocks: [
            { type: 'say', text: 'fixed 헤더를 만들면 꼭 생기는 문제가 있어요. **본문 첫 줄이 헤더 밑에 숨어 버려요.**\n\n이유: fixed·absolute는 **흐름에서 빠져요.** 다른 요소들은 헤더가 "없다"고 생각하니까, 본문이 헤더 자리(맨 위)까지 **올라와서** 헤더 밑에 깔려요.' },
            { type: 'code', code: `body { padding-top: 64px; }   /* 헤더 높이만큼 본문을 내려 주기 */` },
            { type: 'ask', q: '헤더 높이를 80px로 바꿨더니 다시 본문이 살짝 가려져요. 왜일까요?', a: 'body의 `padding-top`이 아직 64px이라서요. 보정값은 헤더 높이와 **항상 같이** 바꿔야 해요. 그래서 실무에선 `--header-h: 64px` 같은 CSS 변수로 한 곳에서 관리하기도 해요.' },
          ],
        },
      ],
    },
    {
      title: '패턴 3: 스크롤하면 붙는 메뉴',
      slides: [
        {
          title: 'sticky: 닿으면 붙어요',
          blocks: [
            { type: 'code', code: `.tab-menu {
  position: sticky;
  top: 0;            /* 화면 맨 위(0)에 닿으면 거기서 멈춤 */
}` },
            { type: 'say', text: '쇼핑몰 상품 페이지에서 "상세정보 · 리뷰 · 문의" 탭이 처음엔 중간에 있다가, 스크롤해서 화면 위에 닿으면 **착 달라붙는** 거 보셨죠. 이게 sticky예요.\n\nfixed와 달리 **원래 자리를 차지하고 있어서** 헤더처럼 padding으로 보정할 필요가 없어요. 그리고 **부모 영역 안에서만** 붙어 있어요. 부모가 화면 밖으로 지나가면 같이 밀려 올라가요.' },
          ],
        },
        {
          title: 'sticky가 안 될 때 체크리스트',
          blocks: [
            { type: 'list', ordered: true, items: ['**`top` 값을 줬나요?** 어디에 붙을지 안 정하면 안 붙어요', '**조상 중에 `overflow: hidden`(또는 auto)이 있나요?** sticky는 가장 가까운 스크롤 영역 기준으로 붙어서, 중간 조상이 overflow를 가지고 있으면 그 안에서만 붙으려다 실패해요', '**부모 높이가 sticky 요소와 같지 않나요?** 부모 안에서만 붙으니, 부모가 딱 그 크기면 움직일 공간이 없어요'] },
            { type: 'note', tone: 'warn', text: '2번이 가장 찾기 어려워요. 5강에서 배운 `overflow: hidden`을 카드나 래퍼에 습관적으로 넣었다가 sticky가 망가지는 일이 정말 많아요.' },
          ],
        },
      ],
    },
    {
      title: '패턴 4: 정중앙 배치',
      slides: [
        {
          title: '50%만 주면 왜 살짝 어긋날까',
          blocks: [
            { type: 'code', code: `.modal {
  position: fixed;
  top: 50%; left: 50%;                 /* ① 왼쪽 위 꼭짓점을 정중앙에 */
  transform: translate(-50%, -50%);    /* ② 내 크기의 절반만큼 되돌리기 */
}` },
            { type: 'say', text: '`top: 50%; left: 50%`만 주면 상자의 **왼쪽 위 꼭짓점**이 정중앙에 가요. 그래서 상자 전체는 오른쪽 아래로 치우쳐 보여요.\n\n`translate(-50%, -50%)`의 %는 **부모가 아니라 내 크기** 기준이에요. 내 너비의 절반만큼 왼쪽, 높이의 절반만큼 위로 되돌리면 상자의 **가운데**가 정중앙에 와요. 상자 크기를 몰라도 항상 맞아요.' },
            { type: 'note', tone: 'analogy', text: '액자를 벽 정중앙에 걸 때, 못을 정중앙에 박고 액자 **왼쪽 위 모서리**를 거기 걸면 치우치죠. 액자 크기의 절반만큼 왼쪽 위로 옮겨야 가운데가 맞아요.' },
          ],
        },
        {
          title: 'inset: 0으로 전체 덮기',
          blocks: [
            { type: 'code', code: `.overlay {
  position: fixed;
  inset: 0;                         /* = top:0; right:0; bottom:0; left:0; */
  background: rgba(0, 0, 0, 0.5);   /* 화면 전체 반투명 막 */
}` },
            { type: 'say', text: '네 방향을 모두 0으로 주면 기준 영역을 **꽉 채워요.** 모달 뒤의 어두운 배경 막이 이렇게 만들어져요. `inset`은 네 줄을 한 줄로 줄인 단축 속성이에요.' },
          ],
        },
      ],
    },
    {
      title: 'z-index: 겹치는 순서',
      slides: [
        {
          title: '누가 위로 올라올까',
          blocks: [
            { type: 'say', text: 'position으로 요소를 띄우면 서로 **겹쳐요.** 누가 위에 그려질지는 `z-index`가 정해요. 숫자가 **클수록 위**예요.' },
            { type: 'code', code: `.header   { position: fixed;    z-index: 100; }
.dropdown { position: absolute; z-index: 200; }
.modal    { position: fixed;    z-index: 1000; }` },
            { type: 'note', tone: 'warn', text: 'z-index는 **position이 static이 아닌 요소**에서만 작동해요. 그냥 div에 `z-index: 999`를 줘도 아무 일도 안 일어나요. (flex·grid의 자식은 예외적으로 작동해요)' },
            { type: 'note', tone: 'tip', text: '팀에서 "헤더 100, 드롭다운 200, 모달 1000"처럼 **구간을 미리 정해 두면** 서로 9999, 99999 경쟁하는 일이 없어져요.' },
          ],
        },
        {
          title: '9999를 줘도 못 올라오는 이유',
          blocks: [
            { type: 'code', code: `.a { position: relative; z-index: 1; }
.a .child { position: absolute; z-index: 9999; }   /* 아무리 커도… */
.b { position: relative; z-index: 2; }             /* .b 아래에 깔림 */` },
            { type: 'say', text: 'z-index는 **같은 층끼리만** 비교해요. 부모 `.a`가 z-index를 가지면 자기만의 층(**쌓임 맥락**)을 만들고, 그 안의 자식은 아무리 큰 숫자를 줘도 **부모 층 안에서만** 위아래를 다퉈요. 부모 `.a`(1)가 `.b`(2)에게 지면 자식도 같이 져요.' },
            { type: 'note', tone: 'analogy', text: '아파트로 생각해요. **1층의 9999호**는 아무리 호수가 커도 **2층의 1호**보다 아래에 있어요. 위로 올리고 싶으면 호수가 아니라 **층(부모의 z-index)** 을 바꿔야 해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-09-01', type: 'ox', source: 'position 값', question: 'position: absolute 요소는 position이 static이 아닌 가장 가까운 조상을 기준으로 배치된다.', answer: true, explanation: '조상 중 relative·absolute·fixed·sticky가 있으면 그 요소, 없으면 페이지(초기 컨테이닝 블록)가 기준이에요.' },
    { id: 'fe-09-02', type: 'mcq', source: 'position 값', question: '원래 자리 기준으로 이동하고, 원래 공간은 그대로 차지하는 값은?', choices: ['static', 'relative', 'absolute', 'fixed'], answer: 1, explanation: 'relative는 흐름에 남아 있어서 원래 공간이 비지 않아요.' },
    { id: 'fe-09-03', type: 'mcq', source: 'position 값', question: '스크롤해도 화면(뷰포트)의 같은 자리에 고정되는 값은?', choices: ['relative', 'absolute', 'fixed', 'static'], answer: 2, explanation: 'fixed는 뷰포트 기준.' },
    { id: 'fe-09-04', type: 'mcq', source: '패턴 1: 카드 모서리 배지', question: '카드 오른쪽 위에 BEST 배지를 붙이는 가장 일반적인 조합은?', choices: ['부모 absolute + 자식 relative', '부모 relative + 자식 absolute', '부모 fixed + 자식 sticky', '부모 static + 자식 fixed'], answer: 1, explanation: '부모가 기준점(relative), 자식이 그 안에서 absolute로 위치.' },
    { id: 'fe-09-05', type: 'essay', source: '패턴 2: 고정 헤더와 플로팅 버튼', question: '고정 헤더(position: fixed)를 만들면 본문 첫 부분이 가려지는 이유와 해결 방법은?', answer: 'fixed 요소는 문서 흐름에서 빠져서 공간을 차지하지 않으므로 아래 콘텐츠가 그 자리로 올라와 헤더 밑에 깔린다. body(또는 본문)에 헤더 높이만큼 padding-top을 주거나, sticky를 쓰는 방법으로 해결한다.', keywords: ['문서 흐름', 'padding-top'], explanation: 'fixed/absolute는 흐름에서 빠진다 → 여백으로 보정.' },
    { id: 'fe-09-06', type: 'mcq', source: '패턴 3: 스크롤하면 붙는 메뉴', question: 'position: sticky가 동작하지 않을 때 먼저 확인할 것은?', choices: ['z-index 값', '부모의 overflow: hidden과 top 지정 여부', 'display: flex 여부', 'font-size'], answer: 1, explanation: 'sticky는 top 같은 기준 값이 필요하고, 부모에 overflow: hidden이 있으면 붙지 않아요.' },
    { id: 'fe-09-07', type: 'short', source: '패턴 4: 정중앙 배치', question: 'top: 50%; left: 50%; 다음에 자기 크기의 절반만큼 되돌리는 transform 값은?', answer: ['translate(-50%, -50%)', 'translate(-50%,-50%)'], explanation: 'transform: translate(-50%, -50%) — %는 자기 크기 기준.' },
    { id: 'fe-09-08', type: 'ox', source: '패턴 4: 정중앙 배치', question: 'inset: 0 은 top, right, bottom, left를 모두 0으로 준 것과 같다.', answer: true, explanation: '화면 전체를 덮는 배경 막에 유용해요.' },
    { id: 'fe-09-09', type: 'ox', source: 'z-index: 겹치는 순서', question: 'z-index는 position: static 요소에도 동작한다.', answer: false, explanation: 'position이 static이 아닌 요소(그리고 flex/grid 아이템)에서 동작해요.' },
    { id: 'fe-09-10', type: 'mcq', source: 'z-index: 겹치는 순서', question: '자식에게 z-index: 9999를 줬는데도 다른 요소 위로 못 올라오는 이유는?', choices: ['9999가 최대값을 넘어서', '부모의 z-index가 낮아 쌓임 맥락에 갇혀서', 'transform이 없어서', 'display가 block이어서'], answer: 1, explanation: '쌓임 맥락 — 자식은 부모의 층 안에서만 순서를 다퉈요.' },
  ],
}

export default topic

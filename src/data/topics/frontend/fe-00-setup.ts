import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-00-setup',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '0강 - 웹 프론트엔드 개요와 개발 환경',
  order: 0,
  notionId: '3efdf951bf808116b944c8d76f4bf385',
  sections: [
    {
      title: '웹페이지 = HTML + CSS + JavaScript',
      slides: [
        {
          title: '프론트엔드 수업에 온 걸 환영해요',
          blocks: [
            { type: 'say', text: '이 트랙에서는 **웹 화면을 직접 만드는 법**을 처음부터 배워요. 지금 보고 계신 이 앱도, 네이버도, 유튜브도 전부 똑같은 재료 세 가지로 만들어져 있어요.\n\n바로 **HTML**, **CSS**, **JavaScript**예요. 첫 수업에서는 이 셋이 각각 무슨 일을 하는지부터 확실히 잡고 갈게요.' },
            { type: 'note', tone: 'analogy', text: '웹페이지를 **사람 몸**이라고 생각해 보세요.\n• **HTML** = 뼈대. "여기에 머리, 여기에 팔"처럼 무엇이 어디 있는지 정해요.\n• **CSS** = 옷. 같은 뼈대라도 어떤 옷을 입히느냐에 따라 완전히 달라 보여요.\n• **JavaScript** = 근육. 뼈대와 옷만 있으면 가만히 서 있기만 해요. 움직이게 하는 건 근육이에요.' },
          ],
        },
        {
          title: '버튼 하나로 셋을 나눠 보면',
          blocks: [
            { type: 'say', text: '"장바구니 담기" 버튼 하나도 세 재료가 나눠서 만들어요.' },
            {
              type: 'table',
              head: ['재료', '하는 일', '버튼에서는'],
              rows: [
                ['HTML', '내용과 구조', '"여기에 **버튼**이 있고 글자는 장바구니 담기"'],
                ['CSS', '모양과 배치', '파란 배경, 둥근 모서리, 오른쪽 아래에 배치'],
                ['JavaScript', '동작', '누르면 장바구니 숫자가 1 올라감'],
              ],
            },
            { type: 'say', text: '그래서 "버튼 색이 이상해요"는 **CSS**를, "버튼을 눌러도 반응이 없어요"는 **JavaScript**를 봐야 해요. 문제가 생겼을 때 **어느 파일을 열어야 할지** 아는 게 이 구분의 진짜 쓸모예요.' },
            { type: 'ask', q: '글자 크기를 키우고 싶어요. HTML, CSS, JavaScript 중 어디를 고쳐야 할까요?', a: '**CSS**예요. 크기·색·위치처럼 "어떻게 보이는지"는 전부 CSS 담당이에요. HTML은 "여기에 글자가 있다"까지만 정해요.' },
          ],
        },
      ],
    },
    {
      title: '브라우저가 화면을 그리는 과정',
      slides: [
        {
          title: '주소를 치면 무슨 일이 생길까',
          blocks: [
            { type: 'say', text: '브라우저 주소창에 주소를 치고 엔터를 누르면, 서버가 **HTML 글자 덩어리**를 보내 줘요. 그런데 우리 눈에 보이는 건 글자 덩어리가 아니라 예쁜 화면이죠.\n\n그 사이에서 브라우저가 몇 단계를 거쳐 **글자를 그림으로 바꿔요.** 순서가 중요해요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**HTML 받기** — 서버에서 HTML 파일을 받아요',
                '**DOM 만들기** — HTML을 읽고 "무엇 안에 무엇이 있는지" 나무 모양 구조를 만들어요',
                '**스타일 계산** — CSS를 읽고 요소마다 어떤 색·크기를 입힐지 정해요',
                '**레이아웃** — 각 요소가 화면 어디에, 얼마나 크게 놓일지 계산해요',
                '**페인트** — 계산이 끝난 대로 실제 픽셀을 칠해요',
              ],
            },
          ],
        },
        {
          title: 'DOM은 문서의 가계도',
          blocks: [
            { type: 'say', text: '**DOM**(Document Object Model)은 브라우저가 HTML을 읽고 만든 **나무 모양 구조**예요.' },
            {
              type: 'code',
              code: `html
+-- head
|   +-- title
+-- body
    +-- h1
    +-- ul
        +-- li
        +-- li`,
              caption: 'HTML을 읽으면 이런 나무(트리)가 만들어져요',
            },
            { type: 'note', tone: 'analogy', text: '집을 짓는다고 생각해 보세요. **설계도(DOM)**가 있어야 벽지(스타일)를 고르고, 방 크기(레이아웃)를 재고, 페인트칠(페인트)을 할 수 있어요. 순서를 바꿀 수가 없죠. 칠할 벽이 어디 있는지 모르는데 칠부터 할 수는 없으니까요.' },
          ],
        },
        {
          title: 'JavaScript가 화면을 바꿀 때',
          blocks: [
            { type: 'say', text: 'JavaScript는 이 **DOM을 고쳐서** 화면을 바꿔요. 예를 들어 "장바구니 숫자 1 → 2"로 DOM을 고치면, 브라우저는 페이지 전체를 처음부터 다시 그리지 않고 **바뀐 부분만** 다시 계산하고 다시 칠해요.' },
            { type: 'note', tone: 'warn', text: '"JS가 화면을 바꾸면 새로고침된다"는 오해가 많아요. 새로고침은 서버에서 HTML을 **처음부터 다시 받는 것**이고, JS로 DOM을 바꾸는 건 **필요한 곳만 손보는 것**이에요. 그래서 요즘 웹은 새로고침 없이도 부드럽게 바뀌어요.' },
            { type: 'say', text: '확인해 볼까요? 순서를 머릿속으로 한 번 떠올려 보고 문제로 넘어가요.' },
          ],
        },
      ],
    },
    {
      title: '개발 환경',
      slides: [
        {
          title: '코드를 쓸 공구 준비하기',
          blocks: [
            { type: 'say', text: 'HTML·CSS는 메모장으로도 쓸 수 있지만, 실제로는 **코드 에디터**를 써요. 가장 많이 쓰는 게 **VS Code**예요. 무료이고, 확장 프로그램을 붙여서 기능을 늘릴 수 있어요.' },
            {
              type: 'table',
              head: ['확장 프로그램', '해 주는 일'],
              rows: [
                ['**Live Server**', '파일을 저장하면 브라우저가 **자동으로 새로고침**돼요'],
                ['**Prettier**', '들쭉날쭉한 코드를 저장할 때 **자동으로 줄 맞춰** 정리해요'],
                ['Auto Rename Tag (선택)', '여는 태그 이름을 바꾸면 닫는 태그도 같이 바뀌어요'],
                ['Korean Language Pack (선택)', 'VS Code 메뉴를 한국어로 바꿔요'],
              ],
            },
          ],
        },
        {
          title: 'Live Server가 왜 편할까',
          blocks: [
            { type: 'say', text: 'Live Server 없이 작업하면 이렇게 돼요.\n**코드 수정 → 저장 → 브라우저로 이동 → F5 → 확인 → 다시 에디터로**\n\n하루에 이걸 수백 번 해요. Live Server를 켜 두면 **저장만 하면** 옆에 띄운 브라우저가 알아서 바뀌어요. 화면을 둘로 나눠 두고 작업하면 정말 편해요.' },
            { type: 'note', tone: 'tip', text: '브라우저는 보통 **Chrome**을 기준으로 개발해요. 사용자가 가장 많고, 개발자 도구가 강력하기 때문이에요. 완성 후에는 Safari·Edge에서도 한 번씩 확인해요.' },
            { type: 'ask', q: 'Prettier와 Live Server, 이름이 헷갈려요. 어떻게 기억하면 좋을까요?', a: '**Live**(살아 있는) Server → 저장하면 화면이 살아 움직이듯 **바로 바뀜**.\n**Prettier**(더 예쁜) → 코드를 **예쁘게 정렬**해 줌.\n이름 뜻 그대로예요.' },
          ],
        },
      ],
    },
    {
      title: 'VS Code 필수 단축키 / Emmet',
      slides: [
        {
          title: '타자를 줄여 주는 Emmet',
          blocks: [
            { type: 'say', text: 'HTML은 `<`, `>`, 닫는 태그까지 쳐야 할 게 많아요. 그래서 VS Code에는 **Emmet**이라는 기능이 들어 있어요. **짧은 약속어를 치고 Tab**을 누르면 긴 코드로 펼쳐 줘요.' },
            {
              type: 'table',
              head: ['입력 + Tab', '펼쳐지는 결과'],
              rows: [
                ['`!` 또는 `html:5`', 'HTML 기본 틀 전체 (doctype, head, body…)'],
                ['`div.card`', '`<div class="card"></div>`'],
                ['`ul>li*3`', '`ul` 안에 `li` 3개'],
              ],
            },
          ],
        },
        {
          title: '기호 읽는 법',
          blocks: [
            { type: 'say', text: 'Emmet 기호는 뒤에서 배울 **CSS 선택자**와 닮았어요. 지금 익혀 두면 나중에 두 번 이득이에요.' },
            {
              type: 'list',
              items: ['`.이름` → class', '`#이름` → id', '`>` → **안에**(자식으로)', '`*3` → **3개**'],
            },
            {
              type: 'code',
              code: `ul>li*3  + Tab

<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>`,
            },
            { type: 'note', tone: 'tip', text: '함께 외워 둘 단축키 두 개 (Windows 기준)\n• `Ctrl + /` → 선택한 줄 **주석** 처리/해제\n• `Alt + Shift + ↓` → 지금 줄을 아래로 **복사**' },
          ],
        },
      ],
    },
    {
      title: '크롬 개발자 도구',
      slides: [
        {
          title: '브라우저 속을 들여다보는 창',
          blocks: [
            { type: 'say', text: 'Chrome에서 **F12**를 누르면 개발자 도구가 열려요. 프론트엔드 개발자는 하루 종일 이 창을 열어 놓고 일해요. 처음엔 탭 세 개만 알면 돼요.' },
            {
              type: 'table',
              head: ['탭 / 기능', '하는 일'],
              rows: [
                ['**Elements**', '지금 화면의 HTML 구조와, 거기 적용된 CSS를 보고 **고쳐 볼 수 있어요**'],
                ['**Console**', 'JavaScript를 바로 실행하고, **에러 메시지**를 확인해요'],
                ['**디바이스 툴바** (`Ctrl + Shift + M`)', '아이폰·갤럭시 같은 **모바일 화면**으로 미리 봐요'],
              ],
            },
          ],
        },
        {
          title: 'Elements에서 고친 건 어디에 남을까',
          blocks: [
            { type: 'say', text: 'Elements 탭에서 글자색을 빨강으로 바꾸면 화면이 바로 바뀌어요. 신기하죠. 그런데 **새로고침하면 원래대로** 돌아와요.\n\n이건 내 컴퓨터 브라우저 화면에서만 **잠깐** 바꾼 거라서 그래요. 실제 파일(`style.css`)은 그대로예요.' },
            { type: 'note', tone: 'analogy', text: '개발자 도구는 **연습장**이에요. 연습장에서 "이 색이 낫겠다"를 빠르게 실험해 보고, 마음에 들면 그 값을 **진짜 노트(코드 파일)에 옮겨 적어야** 해요.' },
            { type: 'ask', q: '버튼을 눌렀는데 아무 반응이 없어요. 개발자 도구에서 가장 먼저 어느 탭을 볼까요?', a: '**Console** 탭이에요. 동작은 JavaScript 담당이고, JS에서 에러가 나면 Console에 빨간 글씨로 **어느 파일 몇 번째 줄**에서 났는지 알려 줘요.' },
          ],
        },
      ],
    },
    {
      title: '폴더 구조 예시',
      slides: [
        {
          title: '파일을 어디에 둘까',
          blocks: [
            { type: 'say', text: '파일이 몇 개 안 될 땐 한 폴더에 다 넣어도 되지만, 금방 엉망이 돼요. 그래서 보통 **종류별로 폴더를 나눠요.**' },
            {
              type: 'code',
              code: `my-site/
+-- index.html      ← 첫 페이지는 맨 위(루트)에
+-- css/
|   +-- style.css
+-- js/
|   +-- main.js
+-- images/
    +-- logo.png`,
            },
            { type: 'say', text: '`index.html`은 특별한 이름이에요. 주소에 파일 이름을 안 쓰고 폴더만 열면 서버가 **기본으로 index.html을** 보여 줘요. 그래서 첫 페이지는 이 이름으로, 루트에 둬요.' },
          ],
        },
        {
          title: '이름 짓는 규칙',
          blocks: [
            { type: 'say', text: '파일·폴더 이름은 **영어 소문자 + 하이픈(-)** 으로 지어요.' },
            {
              type: 'table',
              head: ['피할 이름', '좋은 이름', '이유'],
              rows: [
                ['`메인 사진.jpg`', '`main-photo.jpg`', '한글·띄어쓰기는 주소에서 `%EB%A9%94…`처럼 깨져요'],
                ['`Logo.PNG`', '`logo.png`', '서버는 대소문자를 **다른 파일**로 봐요. 내 컴퓨터에선 되는데 배포하면 안 뜨는 원인 1순위'],
              ],
            },
            { type: 'note', tone: 'warn', text: 'Windows는 `Logo.png`와 `logo.png`를 같은 파일로 봐 주지만, 실제 서버(리눅스)는 **다른 파일**로 봐요. "내 컴퓨터에선 이미지가 보였는데 올리니까 안 보여요"의 흔한 원인이에요. 처음부터 전부 소문자로 쓰면 이 문제가 안 생겨요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fe-00-01',
      type: 'mcq',
      source: '웹페이지 = HTML + CSS + JavaScript',
      question: '웹페이지를 사람 몸에 비유할 때 "근육(동작)"에 해당하는 것은?',
      choices: ['HTML', 'CSS', 'JavaScript', 'DOM'],
      answer: 2,
      choiceExplanations: [
        'HTML은 내용과 구조, 즉 뼈대예요.',
        'CSS는 모양과 배치, 즉 옷이에요.',
        '정답. 클릭 반응, 데이터 불러오기처럼 페이지를 움직이게 하는 건 JavaScript예요.',
        'DOM은 브라우저가 HTML을 읽어 만든 문서 구조 트리로, 셋 중 하나가 아니에요.',
      ],
      explanation: 'HTML = 뼈대(구조), CSS = 옷(모양·배치), JavaScript = 근육(동작).',
    },
    {
      id: 'fe-00-02',
      type: 'ox',
      source: '웹페이지 = HTML + CSS + JavaScript',
      question: '버튼의 색과 크기를 정하는 것은 HTML의 역할이다.',
      answer: false,
      explanation: '색·크기·위치 같은 모양과 배치는 CSS의 역할이에요. HTML은 "여기에 버튼이 있다"는 구조만 정해요.',
    },
    {
      id: 'fe-00-03',
      type: 'mcq',
      source: '브라우저가 화면을 그리는 과정',
      question: '브라우저가 화면을 그리는 순서로 올바른 것은?',
      choices: [
        'HTML 받기 → DOM 생성 → 스타일 계산 → 레이아웃 → 페인트',
        'HTML 받기 → 스타일 계산 → DOM 생성 → 페인트 → 레이아웃',
        'DOM 생성 → HTML 받기 → 레이아웃 → 스타일 계산 → 페인트',
        'HTML 받기 → DOM 생성 → 페인트 → 레이아웃 → 스타일 계산',
      ],
      answer: 0,
      choiceExplanations: [
        '정답. 구조(DOM)를 만들고, 스타일을 계산하고, 위치·크기를 정한 뒤 그려요.',
        '스타일은 적용할 대상(DOM)이 있어야 계산할 수 있어요.',
        'HTML을 받아야 DOM을 만들 수 있어요.',
        '위치·크기(레이아웃)를 모르면 그릴(페인트) 수 없어요.',
      ],
      explanation: '서버에서 HTML 받기 → DOM 생성 → CSS 스타일 계산 → 레이아웃(위치·크기) → 페인트(그리기).',
    },
    {
      id: 'fe-00-04',
      type: 'short',
      source: '브라우저가 화면을 그리는 과정',
      question: '브라우저가 HTML을 읽어서 만드는 "문서 구조 트리"를 영어 약자로 뭐라고 할까요?',
      answer: ['DOM', 'Document Object Model'],
      explanation: 'DOM(Document Object Model). JavaScript는 이 DOM을 바꿔서 화면을 바꾸고, 브라우저는 바뀐 부분만 다시 그려요.',
    },
    {
      id: 'fe-00-05',
      type: 'ox',
      source: '브라우저가 화면을 그리는 과정',
      question: 'JavaScript가 DOM을 바꾸면 브라우저는 항상 페이지 전체를 처음부터 다시 그린다.',
      answer: false,
      explanation: '필요한 부분만 다시 그려요. 전체를 새로 받는 건 새로고침이에요.',
    },
    {
      id: 'fe-00-06',
      type: 'mcq',
      source: '개발 환경',
      question: '파일을 저장하면 브라우저가 자동으로 새로고침되게 해주는 VS Code 확장 프로그램은?',
      choices: ['Prettier', 'Live Server', 'Auto Rename Tag', 'Korean Language Pack'],
      answer: 1,
      choiceExplanations: [
        'Prettier는 코드 자동 정렬(포맷팅) 도구예요.',
        '정답. 저장할 때마다 브라우저를 자동으로 새로고침해 줘요.',
        '여는 태그 이름을 바꾸면 닫는 태그도 같이 바꿔 주는 도구예요.',
        'VS Code 메뉴를 한국어로 바꿔 주는 언어 팩이에요.',
      ],
      explanation: 'Live Server = 자동 새로고침, Prettier = 자동 정렬.',
    },
    {
      id: 'fe-00-07',
      type: 'short',
      source: 'VS Code 필수 단축키 / Emmet',
      question: 'VS Code에서 HTML 기본 틀을 자동으로 만들려면 무엇을 입력하고 Tab을 누를까요? (둘 중 하나)',
      answer: ['!', 'html:5'],
      explanation: '! + Tab 또는 html:5 + Tab. 이 기능을 Emmet이라고 해요.',
    },
    {
      id: 'fe-00-08',
      type: 'mcq',
      source: 'VS Code 필수 단축키 / Emmet',
      question: 'Emmet으로 ul>li*3 을 입력하고 Tab을 누르면?',
      choices: ['li 3개가 나란히 생긴다', 'ul 3개 안에 li가 하나씩 생긴다', 'ul 안에 li 3개가 생긴다', 'ul과 li가 각각 3개씩 생긴다'],
      answer: 2,
      explanation: '> 는 "안에(자식)", *3 은 "3개". 그래서 ul 안에 li가 3개 생겨요.',
    },
    {
      id: 'fe-00-09',
      type: 'short',
      source: 'VS Code 필수 단축키 / Emmet',
      question: 'VS Code에서 선택한 줄을 주석 처리하는 단축키는? (Windows)',
      answer: ['Ctrl + /', 'Ctrl+/'],
      explanation: 'Ctrl + / 는 주석, Alt + Shift + ↓ 는 줄 복사.',
    },
    {
      id: 'fe-00-10',
      type: 'mcq',
      source: '크롬 개발자 도구',
      question: '개발자 도구의 Elements 탭에서 CSS를 고친 뒤 새로고침하면?',
      choices: ['수정한 내용이 파일에 저장된다', '원래대로 돌아간다', '브라우저 캐시에만 남는다', '다른 탭에도 적용된다'],
      answer: 1,
      explanation: 'Elements 탭 수정은 화면에서만 잠깐 바뀌는 거라 새로고침하면 원래대로 돌아가요. 실험용으로 쓰고, 결과는 실제 파일에 옮겨야 해요.',
    },
    {
      id: 'fe-00-11',
      type: 'short',
      source: '크롬 개발자 도구',
      question: '크롬 개발자 도구에서 모바일 화면을 미리 보는 디바이스 툴바 단축키는? (Windows)',
      answer: ['Ctrl + Shift + M', 'Ctrl+Shift+M'],
      explanation: '개발자 도구(F12)를 연 상태에서 Ctrl + Shift + M. 15강 반응형 웹 테스트에서도 써요.',
    },
    {
      id: 'fe-00-12',
      type: 'ox',
      source: '크롬 개발자 도구',
      question: 'JavaScript 에러는 개발자 도구의 Console 탭에서 확인할 수 있다.',
      answer: true,
      explanation: 'Console 탭은 JavaScript를 직접 실행하거나 에러 메시지를 확인하는 곳이에요.',
    },
    {
      id: 'fe-00-13',
      type: 'mcq',
      source: '폴더 구조 예시',
      question: '웹 프로젝트 파일 이름으로 가장 적절한 것은?',
      choices: ['Main Page.html', '메인.html', 'main-page.html', 'MainPage .html'],
      answer: 2,
      explanation: '파일·폴더 이름은 영어 소문자 + 하이픈. 띄어쓰기와 한글은 경로 문제를 일으킬 수 있어요.',
    },
  ],
}

export default topic

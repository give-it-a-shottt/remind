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
      points: [
        'HTML은 내용과 구조(뼈대): 제목, 문단, 이미지, 버튼',
        'CSS는 모양과 배치(옷): 색, 크기, 위치, 애니메이션',
        'JavaScript는 동작(근육): 클릭 반응, 데이터 불러오기, 화면 바꾸기',
      ],
    },
    {
      title: '브라우저가 화면을 그리는 과정',
      points: [
        '서버에서 HTML을 받는다',
        'HTML을 읽어 DOM(문서 구조 트리)을 만든다',
        'CSS를 읽어 각 요소의 스타일을 계산한다',
        '위치·크기를 계산(레이아웃)하고 화면에 그린다(페인트)',
        'JavaScript가 DOM을 바꾸면 필요한 부분만 다시 그린다',
      ],
    },
    {
      title: '개발 환경',
      points: [
        '에디터는 VS Code',
        'Live Server: 저장하면 브라우저가 자동 새로고침',
        'Prettier: 코드 자동 정렬',
        '(선택) Korean Language Pack, Auto Rename Tag',
        '브라우저는 Chrome 기준으로 개발하는 경우가 많다',
      ],
    },
    {
      title: 'VS Code 필수 단축키 / Emmet',
      points: [
        '! + Tab 또는 html:5 + Tab → HTML 기본 틀 자동 생성',
        'ul>li*3 + Tab → ul 안에 li 3개',
        'div.card + Tab → <div class="card"></div>',
        'Alt + Shift + ↓ 줄 복사, Ctrl + / 주석',
      ],
    },
    {
      title: '크롬 개발자 도구',
      points: [
        'F12로 연다',
        'Elements: HTML 구조와 적용된 CSS 확인·수정 (새로고침하면 원래대로)',
        'Console: JavaScript 실행, 에러 확인',
        '디바이스 툴바(Ctrl + Shift + M): 모바일 화면 미리보기',
      ],
    },
    {
      title: '폴더 구조 예시',
      points: [
        'index.html을 루트에 두고 css/, js/, images/ 폴더로 나눈다',
        '파일·폴더 이름은 영어 소문자 + 하이픈 (띄어쓰기·한글 피하기)',
      ],
      code: `my-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/`,
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

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-01-html',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '1강 - HTML 정리',
  order: 1,
  notionId: '3efdf951bf8081029c13d0e11049bfa2',
  sections: [
    {
      title: 'HTML 기본 구조',
      points: ['<!DOCTYPE html>: HTML5 문서라는 선언', '<head>: 화면에 안 보이는 정보 (제목, 문자 인코딩, CSS 연결)', '<body>: 화면에 보이는 내용', 'viewport meta: 모바일에서 화면 폭에 맞게 보이도록 (반응형 필수)'],
      code: `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>동네 빵집</title>
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <h1>오늘의 빵</h1>
  </body>
</html>`,
    },
    {
      title: '태그, 요소, 속성',
      points: ['태그: <a>, </a> / 요소: 여는 태그~닫는 태그 전체', '속성: 태그에 추가 정보 (href, target)', '닫는 태그가 없는 빈 요소: <img>, <br>, <input>, <meta>'],
      code: '<a href="https://example.com" target="_blank">예시 사이트</a>',
    },
    {
      title: '텍스트 태그',
      points: ['<h1>~<h6>: 제목 (h1은 페이지당 보통 하나)', '<p>: 문단 / <br>: 줄바꿈', '<strong>: 중요한 내용(굵게) / <em>: 강조(기울임)', '<span>: 의미 없는 인라인 묶음 / <div>: 의미 없는 블록 묶음'],
    },
    {
      title: '링크와 이미지',
      points: ['<a href="#contact">: 같은 페이지 안 id로 이동', 'alt: 이미지가 안 뜨거나 스크린리더가 읽을 때 대체 텍스트 → 접근성 필수', '경로: 상대경로(images/a.jpg, ../a.jpg) / 절대경로(https://...)'],
      code: `<a href="menu.html">메뉴 보기</a>
<a href="#contact">연락처로 이동</a>
<img src="images/croissant.jpg" alt="버터 크로와상" />`,
    },
    {
      title: '목록',
      points: ['<ul>: 순서 없는 목록 / <ol>: 순서 있는 목록 / 항목은 <li>', '내비게이션 메뉴도 보통 <ul><li><a>로 만든다'],
    },
    {
      title: '표',
      points: ['<table> 안에 <thead>, <tbody>', 'tr 행, th 제목 칸, td 데이터 칸', 'colspan, rowspan으로 칸 합치기'],
    },
    {
      title: '폼',
      points: ['label의 for와 input의 id를 맞추면 라벨을 눌러도 입력창 선택', 'input type: text, password, email, number, checkbox, radio, date, file 등', 'name: 서버로 보낼 때의 키 이름'],
      code: `<form action="/order" method="post">
  <label for="name">이름</label>
  <input id="name" type="text" name="name" required />
  <button type="submit">주문</button>
</form>`,
    },
    {
      title: '시맨틱 태그',
      points: ['의미를 담은 태그 → 검색엔진(SEO)과 접근성에 유리', 'header, nav, main, section, article, aside, footer', 'div만 쓰지 말고 역할에 맞는 태그를 고르기'],
    },
    {
      title: 'id vs class',
      points: ['id: 페이지에서 하나만 (앵커 링크, JS에서 특정 요소 선택)', 'class: 여러 요소에 같은 스타일, 한 요소에 여러 개 가능 (class="card best")'],
    },
  ],
  questions: [
    { id: 'fe-01-01', type: 'mcq', source: 'HTML 기본 구조', question: '화면에 보이지 않는 정보(제목, 문자 인코딩, CSS 연결)를 넣는 곳은?', choices: ['<body>', '<head>', '<main>', '<footer>'], answer: 1, explanation: '<head>에는 title, meta, link처럼 화면에 직접 보이지 않는 정보가 들어가요. 화면에 보이는 내용은 <body>.' },
    { id: 'fe-01-02', type: 'short', source: 'HTML 기본 구조', question: '모바일에서 화면 폭에 맞게 보이도록 넣는 meta 태그의 name 값은?', answer: ['viewport'], explanation: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />. 반응형 웹의 필수 태그예요.' },
    { id: 'fe-01-03', type: 'ox', source: 'HTML 기본 구조', question: '<!DOCTYPE html>은 이 문서가 HTML5 문서라는 선언이다.', answer: true, explanation: '문서 맨 위에 두어 브라우저가 HTML5 표준 모드로 해석하게 해요.' },
    { id: 'fe-01-04', type: 'mcq', source: '태그, 요소, 속성', question: '<a href="https://example.com">예시</a> 에서 href는 무엇인가?', choices: ['태그', '요소', '속성', '내용'], answer: 2, choiceExplanations: ['태그는 <a>, </a> 자체예요.', '요소는 여는 태그부터 닫는 태그까지 전체예요.', '정답. 태그에 추가 정보를 주는 것이 속성이에요.', '내용은 "예시" 텍스트예요.'], explanation: '속성은 태그에 추가 정보를 준다. href(주소), target(열리는 위치) 등.' },
    { id: 'fe-01-05', type: 'mcq', source: '태그, 요소, 속성', question: '닫는 태그가 없는 빈 요소가 아닌 것은?', choices: ['<img>', '<br>', '<input>', '<span>'], answer: 3, explanation: '빈 요소: img, br, input, meta. span은 내용을 감싸는 인라인 요소라 닫는 태그가 필요해요.' },
    { id: 'fe-01-06', type: 'ox', source: '텍스트 태그', question: '<h1>은 한 페이지에 여러 번 쓰는 것이 일반적이다.', answer: false, explanation: 'h1은 페이지의 가장 큰 제목이라 보통 한 페이지에 하나만 써요.' },
    { id: 'fe-01-07', type: 'mcq', source: '텍스트 태그', question: '의미 없이 "블록" 단위로 요소를 묶을 때 쓰는 태그는?', choices: ['<span>', '<div>', '<strong>', '<em>'], answer: 1, explanation: 'div는 의미 없는 블록 묶음, span은 의미 없는 인라인 묶음이에요.' },
    { id: 'fe-01-08', type: 'short', source: '텍스트 태그', question: '중요한 내용(굵게)을 표시하는 태그 이름은? (<> 없이)', answer: ['strong'], explanation: '<strong>은 중요, <em>은 강조(기울임). 모양보다 의미를 나타내는 태그예요.' },
    { id: 'fe-01-09', type: 'short', source: '링크와 이미지', question: '이미지가 안 뜨거나 스크린리더가 읽을 때 쓰이는 img 속성은?', answer: ['alt'], explanation: 'alt는 대체 텍스트로, 접근성을 위해 꼭 넣어야 해요.' },
    { id: 'fe-01-10', type: 'mcq', source: '링크와 이미지', question: '같은 페이지 안에서 id="contact" 요소로 이동하는 링크는?', choices: ['<a href="contact">', '<a href="#contact">', '<a href=".contact">', '<a id="contact">'], answer: 1, explanation: 'href에 #id를 쓰면 같은 페이지의 그 id 요소로 이동해요.' },
    { id: 'fe-01-11', type: 'ox', source: '링크와 이미지', question: 'images/a.jpg 는 절대경로이다.', answer: false, explanation: 'images/a.jpg, ../a.jpg는 현재 파일 기준의 상대경로. https://...로 시작하면 절대경로예요.' },
    { id: 'fe-01-12', type: 'mcq', source: '목록', question: '순서가 있는 목록(1, 2, 3...)을 만드는 태그는?', choices: ['<ul>', '<ol>', '<li>', '<dl>'], answer: 1, explanation: 'ol(ordered list)은 순서 있는 목록, ul(unordered list)은 순서 없는 목록. 항목은 둘 다 li.' },
    { id: 'fe-01-13', type: 'ox', source: '목록', question: '내비게이션 메뉴는 보통 <ul><li><a> 구조로 만든다.', answer: true, explanation: '메뉴는 "링크들의 목록"이라 ul > li > a 구조가 일반적이에요.' },
    { id: 'fe-01-14', type: 'mcq', source: '표', question: '표에서 "제목 칸"을 만드는 태그는?', choices: ['<td>', '<tr>', '<th>', '<thead>'], answer: 2, explanation: 'tr = 행, th = 제목 칸, td = 데이터 칸. thead/tbody는 영역 구분이에요.' },
    { id: 'fe-01-15', type: 'short', source: '표', question: '표에서 가로로 여러 칸을 합칠 때 쓰는 속성은?', answer: ['colspan'], explanation: 'colspan은 가로(열) 합치기, rowspan은 세로(행) 합치기.' },
    { id: 'fe-01-16', type: 'mcq', source: '폼', question: '라벨을 눌러도 입력창이 선택되게 하려면?', choices: ['label의 name과 input의 name을 같게', 'label의 for와 input의 id를 같게', 'label 안에 id를 넣는다', 'input에 placeholder를 넣는다'], answer: 1, explanation: '<label for="name">과 <input id="name">을 맞추면 연결돼요. (label로 input을 감싸는 방법도 있어요)' },
    { id: 'fe-01-17', type: 'short', source: '폼', question: '폼 데이터를 서버로 보낼 때 "키 이름"이 되는 input 속성은?', answer: ['name'], explanation: 'name="bread" 처럼 쓰면 서버에서 bread라는 키로 값을 받아요.' },
    { id: 'fe-01-18', type: 'essay', source: '시맨틱 태그', question: 'div 대신 header, nav, main, article 같은 시맨틱 태그를 쓰면 좋은 이유를 설명하세요.', answer: '태그 자체가 의미(역할)를 담고 있어서 검색엔진이 페이지 구조를 이해하기 쉽고(SEO), 스크린리더 같은 보조기기가 영역을 구분해 탐색할 수 있어 접근성이 좋아져요. 코드를 읽는 사람도 구조를 바로 알 수 있어요.', keywords: ['의미', 'SEO', '접근성'], explanation: '시맨틱 태그 = 의미를 담은 태그. 역할에 맞는 태그를 고르는 습관이 중요해요.' },
    { id: 'fe-01-19', type: 'mcq', source: '시맨틱 태그', question: '블로그 글, 상품 카드처럼 "독립적인 글"에 어울리는 시맨틱 태그는?', choices: ['<section>', '<article>', '<aside>', '<nav>'], answer: 1, explanation: 'article은 독립적으로 배포해도 의미가 있는 콘텐츠. section은 주제별 묶음, aside는 사이드 정보.' },
    { id: 'fe-01-20', type: 'mcq', source: 'id vs class', question: 'id와 class에 대한 설명으로 옳은 것은?', choices: ['id는 여러 요소에 같은 값을 줄 수 있다', 'class는 한 요소에 하나만 줄 수 있다', 'id는 페이지에서 하나만, class는 여러 요소에 쓸 수 있다', '둘은 기능이 완전히 같다'], answer: 2, explanation: 'id는 페이지에서 유일(앵커, JS 선택용), class는 여러 요소에 공유하고 한 요소에 여러 개도 가능(class="card best").' },
  ],
}

export default topic

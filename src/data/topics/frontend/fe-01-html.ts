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
      slides: [
        {
          title: '모든 HTML 파일의 공통 틀',
          blocks: [
            { type: 'say', text: '이번 수업에서는 웹페이지의 뼈대, **HTML**을 배워요. 어떤 사이트든 HTML 파일을 열어 보면 맨 바깥 틀은 거의 똑같아요. 0강에서 배운 `!` + Tab이 바로 이 틀을 만들어 줘요.' },
            {
              type: 'code',
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
            { type: 'say', text: '크게 보면 `<html>` 안에 **`<head>`와 `<body>` 두 칸**이 있어요. 하나씩 볼게요.' },
          ],
        },
        {
          title: 'head는 안 보이고, body는 보여요',
          blocks: [
            {
              type: 'table',
              head: ['부분', '들어가는 것', '화면에 보이나요?'],
              rows: [
                ['`<!DOCTYPE html>`', '"이건 최신 HTML5 문서예요"라는 선언', '아니요'],
                ['`<head>`', '탭 제목(title), 글자 인코딩(charset), CSS 연결(link)', '아니요'],
                ['`<body>`', '제목, 글, 사진, 버튼 — 우리가 보는 **모든 것**', '네'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '책으로 치면 `<head>`는 **표지 안쪽의 출판 정보**(제목, 인쇄 정보)이고, `<body>`는 **본문**이에요. 출판 정보는 책을 만들 때 꼭 필요하지만 읽는 사람이 보는 곳은 아니죠.' },
          ],
        },
        {
          title: 'viewport 한 줄이 왜 중요할까',
          blocks: [
            { type: 'say', text: '`<meta name="viewport" ...>`를 빼먹으면, 스마트폰은 페이지를 **PC 화면 크기(약 980px)로 그린 다음 손톱만 하게 축소**해서 보여 줘요. 글자가 깨알같이 작아지죠.\n\n이 한 줄은 "화면 폭을 **기기의 실제 폭**에 맞춰 줘"라는 뜻이에요. 15강에서 배울 반응형 웹의 출발점이라, 무조건 넣는다고 기억해 두세요.' },
            { type: 'ask', q: '페이지 탭에 "동네 빵집"이라고 뜨게 하고 싶어요. head와 body 중 어디에 무엇을 써야 할까요?', a: '`<head>` 안에 `<title>동네 빵집</title>`이에요. 탭 제목은 본문에 보이는 게 아니라 브라우저가 쓰는 **정보**라서 head에 들어가요.' },
          ],
        },
      ],
    },
    {
      title: '태그, 요소, 속성',
      slides: [
        {
          title: '세 단어를 정확히 구분해요',
          blocks: [
            { type: 'say', text: '앞으로 수업에서 계속 나올 단어 세 개예요. 비슷해 보여도 가리키는 범위가 달라요.' },
            { type: 'code', code: '<a href="https://example.com" target="_blank">예시 사이트</a>' },
            {
              type: 'table',
              head: ['용어', '위 예시에서', '뜻'],
              rows: [
                ['**태그**', '`<a ...>`와 `</a>`', '꺾쇠로 감싼 표시 자체'],
                ['**요소**', '`<a ...>예시 사이트</a>` 전체', '여는 태그 + 내용 + 닫는 태그 묶음'],
                ['**속성**', '`href="..."`, `target="_blank"`', '여는 태그 안에 쓰는 **추가 정보** (`이름="값"`)'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '택배 상자로 생각해 보세요. **태그**는 상자를 여닫는 테이프, **요소**는 물건이 든 상자 전체, **속성**은 상자에 붙은 송장(받는 주소, 취급 주의)이에요.' },
          ],
        },
        {
          title: '닫는 태그가 없는 요소도 있어요',
          blocks: [
            { type: 'say', text: '대부분 요소는 `<p>...</p>`처럼 **내용을 감싸요.** 그런데 감쌀 내용이 없는 요소도 있어요. 이런 걸 **빈 요소**라고 하고, 닫는 태그를 쓰지 않아요.' },
            { type: 'code', code: `<img src="bread.jpg" alt="식빵" />   ← 이미지는 감쌀 글자가 없음
<br />                              ← 줄바꿈도 감쌀 게 없음
<input type="text" />               ← 입력창
<meta charset="UTF-8" />            ← 정보 한 줄` },
            { type: 'say', text: '반대로 `<span>`, `<div>`, `<p>`처럼 **안에 무언가를 담는** 요소는 반드시 닫아야 해요. 안 닫으면 뒤에 오는 내용까지 전부 그 안에 들어간 걸로 읽혀서 화면이 이상해져요.' },
          ],
        },
      ],
    },
    {
      title: '텍스트 태그',
      slides: [
        {
          title: '제목과 문단',
          blocks: [
            { type: 'say', text: '글자를 담는 태그부터 볼게요. 제목은 `<h1>`부터 `<h6>`까지 있어요. 숫자가 **작을수록 큰 제목**이에요.' },
            { type: 'code', code: `<h1>동네 빵집</h1>          ← 페이지에서 가장 큰 제목
<h2>오늘의 빵</h2>          ← 큰 단락의 제목
<h3>식빵류</h3>             ← 그 안의 작은 제목
<p>매일 아침 7시에 구워요.<br />주말은 9시예요.</p>` },
            { type: 'note', tone: 'warn', text: '`<h1>`은 **페이지당 보통 하나**예요. 책 제목이 한 권에 하나인 것과 같아요. 글자를 크게 하고 싶어서 h1을 여러 번 쓰면 안 돼요. 크기는 CSS로 바꾸고, 태그는 **제목의 계층(중요도)**으로 골라요.' },
          ],
        },
        {
          title: '의미가 있는 태그 vs 없는 태그',
          blocks: [
            {
              type: 'table',
              head: ['태그', '뜻', '기본 모양'],
              rows: [
                ['`<strong>`', '**중요한** 내용', '굵게'],
                ['`<em>`', '**강조**해서 읽을 부분', '기울임'],
                ['`<span>`', '의미 없음, 글 일부를 **인라인**으로 묶기', '변화 없음'],
                ['`<div>`', '의미 없음, 여러 요소를 **블록**으로 묶기', '변화 없음'],
              ],
            },
            { type: 'say', text: '`<strong>`과 `<em>`은 모양이 아니라 **의미**를 나타내요. 스크린리더(화면을 읽어 주는 프로그램)는 strong을 힘줘서 읽어요.\n\n`<span>`과 `<div>`는 아무 의미가 없는 **빈 상자**예요. "여기에 CSS를 입히고 싶은데 마땅한 태그가 없을 때" 묶는 용도로 써요. span은 글 줄 안에, div는 덩어리째로요.' },
            { type: 'ask', q: '"할인가 **3,000원**"에서 가격 부분만 빨갛게 하고 싶어요. 가격을 무엇으로 감싸면 좋을까요?', a: '`<span>`이에요. 문장 **안의 일부**(인라인)를 묶을 땐 span을 써요. div로 감싸면 그 부분만 줄이 바뀌어 버려요(블록이라서). 정말 중요한 정보라면 `<strong>`도 좋아요.' },
          ],
        },
      ],
    },
    {
      title: '링크와 이미지',
      slides: [
        {
          title: 'a 태그로 이동하기',
          blocks: [
            { type: 'say', text: '웹의 핵심은 **링크**예요. `<a>` 태그의 `href` 속성에 **어디로 갈지**를 써요.' },
            { type: 'code', code: `<a href="https://naver.com">네이버</a>     ← 다른 사이트
<a href="menu.html">메뉴 보기</a>          ← 내 사이트의 다른 파일
<a href="#contact">연락처로 이동</a>        ← 같은 페이지 안 id="contact"로 스크롤

<section id="contact">...</section>` },
            { type: 'say', text: '`#`으로 시작하면 **같은 페이지 안에서** 그 id를 가진 요소로 이동해요. 긴 페이지의 "맨 위로" 버튼이나 목차가 이렇게 만들어져요.' },
          ],
        },
        {
          title: '상대경로와 절대경로',
          blocks: [
            { type: 'say', text: '`href`나 `src`에 쓰는 주소는 두 종류예요.' },
            {
              type: 'table',
              head: ['종류', '예시', '기준'],
              rows: [
                ['**절대경로**', '`https://example.com/a.jpg`', '인터넷 어디서든 같은 곳 (전체 주소)'],
                ['**상대경로**', '`images/a.jpg`', '**지금 이 HTML 파일이 있는 폴더**에서 출발'],
                ['상대경로', '`../a.jpg`', '`..`은 **한 칸 위 폴더**로 올라가기'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '절대경로는 "서울시 강남구 ○○로 12"처럼 **전체 주소**, 상대경로는 "여기서 오른쪽 두 번째 집"처럼 **지금 위치 기준 길 안내**예요. 내 사이트 안의 파일은 보통 상대경로로 써요. 사이트 주소가 바뀌어도 안 깨지거든요.' },
          ],
        },
        {
          title: '이미지와 alt',
          blocks: [
            { type: 'code', code: `<img src="images/croissant.jpg" alt="버터 크로와상" />` },
            { type: 'say', text: '`src`는 이미지 파일 위치, `alt`는 **이미지를 글로 설명한 대체 텍스트**예요. alt는 언제 쓰일까요?\n• 이미지 파일이 깨져서 안 뜰 때 그 자리에 보여요\n• 눈이 불편한 사용자의 **스크린리더가 alt를 소리 내어 읽어요**\n• 검색엔진이 이미지 내용을 이해하는 단서가 돼요' },
            { type: 'note', tone: 'tip', text: '그냥 꾸밈용 이미지(배경 무늬 등)라면 `alt=""`처럼 **빈 값**을 줘요. 그러면 스크린리더가 읽지 않고 넘어가요. alt 속성 자체를 빼먹는 것과는 달라요.' },
          ],
        },
      ],
    },
    {
      title: '목록',
      slides: [
        {
          title: 'ul과 ol',
          blocks: [
            { type: 'say', text: '목록은 두 가지예요. **순서가 중요한지**만 따지면 돼요.' },
            { type: 'code', code: `<ul>
  <li>식빵</li>
  <li>크로와상</li>
  <li>바게트</li>
</ul>
→ • 식빵  • 크로와상  • 바게트

<ol>
  <li>반죽하기</li>
  <li>발효하기</li>
  <li>굽기</li>
</ol>
→ 1. 반죽하기  2. 발효하기  3. 굽기` },
            { type: 'list', items: ['`ul` = **u**nordered list (순서 없는 목록) → 점(•)', '`ol` = **o**rdered list (순서 있는 목록) → 숫자', '항목은 둘 다 `li` (list item)'] },
          ],
        },
        {
          title: '메뉴도 사실 목록이에요',
          blocks: [
            { type: 'say', text: '사이트 위쪽의 "홈 · 메뉴 · 오시는 길" 메뉴바를 떠올려 보세요. 점도 없고 가로로 놓여 있지만, 구조로 보면 **링크 여러 개의 목록**이에요.' },
            { type: 'code', code: `<nav>
  <ul>
    <li><a href="/">홈</a></li>
    <li><a href="/menu">메뉴</a></li>
    <li><a href="/map">오시는 길</a></li>
  </ul>
</nav>` },
            { type: 'say', text: '점을 없애고 가로로 놓는 건 **CSS**가 해요 (`list-style: none`, flex). HTML은 "이건 목록이다"라는 **구조**만 정확히 알려 주면 돼요. 이렇게 하면 스크린리더가 "목록, 항목 3개"라고 알려 줘서 사용자가 메뉴 개수를 바로 알 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '표',
      slides: [
        {
          title: '표는 행부터 만들어요',
          blocks: [
            { type: 'say', text: '가격표 같은 **표 형식 데이터**는 `<table>`로 만들어요. 태그가 많아 보이지만 규칙은 단순해요. **행(tr)을 먼저 만들고, 그 안에 칸을 채워요.**' },
            { type: 'code', code: `<table>
  <thead>
    <tr><th>빵</th><th>가격</th></tr>
  </thead>
  <tbody>
    <tr><td>식빵</td><td>3,000원</td></tr>
    <tr><td>크로와상</td><td>2,500원</td></tr>
  </tbody>
</table>` },
            {
              type: 'table',
              head: ['태그', '뜻'],
              rows: [
                ['`tr`', 'table row — **가로 한 줄(행)**'],
                ['`th`', 'table header — **제목 칸** (기본 굵게, 가운데)'],
                ['`td`', 'table data — **데이터 칸**'],
                ['`thead` / `tbody`', '제목 줄 영역 / 내용 영역 구분'],
              ],
            },
          ],
        },
        {
          title: '칸 합치기',
          blocks: [
            { type: 'say', text: '엑셀의 "셀 병합"처럼 칸을 합칠 수도 있어요.' },
            { type: 'list', items: ['`colspan="2"` → **가로로** 두 칸 합치기 (col = 열, 세로줄 두 개를 덮음)', '`rowspan="2"` → **세로로** 두 칸 합치기 (row = 행, 가로줄 두 개를 덮음)'] },
            { type: 'code', code: `<tr><td colspan="2">오늘은 휴무입니다</td></tr>` },
            { type: 'note', tone: 'warn', text: '예전엔 페이지 **레이아웃**(왼쪽 메뉴, 오른쪽 본문)을 표로 짰지만 지금은 하지 않아요. 표는 **진짜 표 데이터**에만 쓰고, 배치는 CSS(flex, grid)로 해요.' },
          ],
        },
      ],
    },
    {
      title: '폼',
      slides: [
        {
          title: '사용자에게 입력받기',
          blocks: [
            { type: 'say', text: '로그인, 주문, 검색처럼 사용자에게 **값을 받는** 곳은 전부 폼이에요.' },
            { type: 'code', code: `<form action="/order" method="post">
  <label for="name">이름</label>
  <input id="name" type="text" name="name" required />

  <label for="qty">수량</label>
  <input id="qty" type="number" name="qty" />

  <button type="submit">주문</button>
</form>` },
            { type: 'list', items: ['`action` → 입력값을 **어디로** 보낼지 (서버 주소)', '`method` → 어떤 방식으로 보낼지 (조회는 get, 저장은 post)', '`button type="submit"` → 누르면 폼이 전송돼요'] },
          ],
        },
        {
          title: 'label과 input을 잇는 법',
          blocks: [
            { type: 'say', text: '`<label for="name">`의 **for 값**과 `<input id="name">`의 **id 값**을 똑같이 맞추면 둘이 연결돼요. 연결되면 두 가지가 좋아져요.\n• "이름" **글자를 눌러도** 입력창에 커서가 들어가요 (작은 체크박스를 누르기 쉬워져요)\n• 스크린리더가 입력창에 들어갔을 때 "이름, 입력창"이라고 읽어 줘요' },
            { type: 'note', tone: 'warn', text: '헷갈리는 포인트! label과 연결하는 건 **id**이고, 서버로 보낼 때 이름표가 되는 건 **name**이에요. 위 예시에서 id와 name이 둘 다 "name"이라 같아 보이지만 하는 일이 달라요.' },
          ],
        },
        {
          title: 'type과 name',
          blocks: [
            {
              type: 'table',
              head: ['type', '모양'],
              rows: [
                ['`text` / `password`', '한 줄 글자 / 가려지는 글자(●●●)'],
                ['`email` / `number` / `date`', '형식 검사, 숫자 키패드, 달력이 자동으로 붙어요'],
                ['`checkbox` / `radio`', '여러 개 고르기 / 하나만 고르기'],
                ['`file`', '파일 선택'],
              ],
            },
            { type: 'say', text: '`name`은 서버로 보낼 때의 **키 이름**이에요. `name="qty"`에 3을 입력하고 보내면 서버는 `qty=3`으로 받아요. name이 없으면 그 칸의 값은 **아예 전송되지 않아요.**' },
            { type: 'ask', q: '휴대폰에서 수량 입력칸을 눌렀을 때 숫자 키패드가 바로 뜨게 하려면?', a: '`type="number"`로 바꾸면 돼요. type만 맞게 골라도 브라우저가 키패드, 형식 검사, 달력 같은 걸 공짜로 붙여 줘요.' },
          ],
        },
      ],
    },
    {
      title: '시맨틱 태그',
      slides: [
        {
          title: 'div만으로도 화면은 만들어지지만',
          blocks: [
            { type: 'say', text: '사실 모든 걸 `<div>`로만 만들어도 화면은 똑같이 보여요. 하지만 그러면 코드에 **의미가 하나도 없어요.**' },
            { type: 'code', code: `<!-- 의미 없는 버전 -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="post">...</div>
</div>
<div class="footer">...</div>

<!-- 시맨틱 버전 -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>` },
            { type: 'say', text: '**시맨틱(semantic)** 은 "의미의"라는 뜻이에요. 태그 이름 자체가 "여긴 머리말", "여긴 메뉴"라고 **역할을 말해 주는** 태그예요.' },
          ],
        },
        {
          title: '누가 이 의미를 읽을까',
          blocks: [
            { type: 'list', items: ['**검색엔진**: `<main>`, `<article>`을 보고 페이지의 핵심 내용을 알아내요 → **SEO**(검색 노출)에 유리', '**스크린리더**: "메뉴로 건너뛰기", "본문으로 건너뛰기"를 할 수 있어요 → **접근성**', '**동료 개발자**: 클래스 이름을 안 읽어도 구조가 한눈에 보여요'] },
            {
              type: 'table',
              head: ['태그', '쓰는 곳'],
              rows: [
                ['`header` / `footer`', '머리말(로고, 메뉴) / 꼬리말(저작권, 연락처)'],
                ['`nav`', '주요 **이동 메뉴**'],
                ['`main`', '페이지의 **핵심 내용** (페이지당 하나)'],
                ['`section`', '주제별 **묶음** (보통 제목이 있음)'],
                ['`article`', '**혼자 떼어 놔도 말이 되는** 글: 블로그 글, 상품 카드, 댓글'],
                ['`aside`', '본문 옆 **곁가지** 정보: 사이드바, 광고'],
              ],
            },
            { type: 'ask', q: 'section과 article이 헷갈려요. 구분하는 질문 하나만 알려 주세요.', a: '"이걸 **다른 사이트에 그대로 옮겨 붙여도** 말이 되나?"를 물어보세요. 블로그 글 하나, 상품 카드 하나는 따로 떼어도 완결된 내용이라 **article**이에요. "인기 상품 영역"처럼 페이지 안의 한 구역은 **section**이에요.' },
          ],
        },
      ],
    },
    {
      title: 'id vs class',
      slides: [
        {
          title: '이름표 두 종류',
          blocks: [
            { type: 'say', text: '요소에 이름을 붙이는 속성이 두 개 있어요. 둘 다 CSS와 JavaScript에서 요소를 찾을 때 써요.' },
            {
              type: 'table',
              head: ['', 'id', 'class'],
              rows: [
                ['개수', '페이지에서 **딱 하나**', '여러 요소가 **같은 값**을 써도 돼요'],
                ['한 요소에', '하나만', '`class="card best"`처럼 **여러 개** 가능'],
                ['주 용도', '`#contact` 링크 이동, JS로 특정 요소 하나 찾기', '**CSS 스타일** 입히기'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '**id는 주민등록번호**, **class는 소속 동아리**예요. 주민번호는 한 사람에게 하나뿐이고 겹치면 안 되지만, 동아리는 여러 명이 같이 들 수 있고 한 사람이 여러 동아리에 들 수도 있죠.' },
          ],
        },
        {
          title: '스타일은 class로',
          blocks: [
            { type: 'code', code: `<article class="card">식빵</article>
<article class="card best">크로와상</article>   ← card 스타일 + best 스타일 둘 다
<article class="card">바게트</article>` },
            { type: 'say', text: '카드 세 개에 같은 모양을 입히려면 class가 딱이에요. "베스트" 표시는 class를 하나 더 붙이면 되고요.\n\n스타일을 id로 주면 안 될까요? 될 수는 있지만 2강에서 배울 **명시도**가 너무 높아서, 나중에 덮어쓰기가 어려워져요. 그래서 실무 습관은 **"스타일은 class, id는 앵커·JS용"** 이에요.' },
          ],
        },
      ],
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

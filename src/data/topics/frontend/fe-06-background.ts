import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-06-background',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '6강 - 배경 (background)',
  order: 6,
  notionId: '3efdf951bf8081de9d2fc4a98a7b758d',
  sections: [
    {
      title: '기본 속성',
      slides: [
        {
          title: '상자에 배경 깔기',
          blocks: [
            { type: 'say', text: '5강에서 모든 요소는 상자라고 했죠. 이번엔 그 상자 **뒤에 배경**을 깔아 볼 거예요. 색 한 가지일 수도, 사진일 수도, 그라디언트일 수도 있어요.' },
            { type: 'code', code: `.banner {
  background-color: #f6efe6;
  background-image: url("../images/bakery.jpg");
  background-repeat: no-repeat;
  background-position: center;
}` },
            {
              type: 'table',
              head: ['속성', '하는 일', '자주 쓰는 값'],
              rows: [
                ['`background-color`', '배경색', '`#f6efe6`, `rgba(...)`'],
                ['`background-image`', '배경 이미지', '`url("경로")`'],
                ['`background-repeat`', '작은 이미지를 **타일처럼 반복**할지', '`repeat`(기본), `no-repeat`, `repeat-x`(가로만), `repeat-y`(세로만)'],
                ['`background-position`', '이미지를 **어디에** 붙일지', '`center`, `left top`, `50% 50%`'],
              ],
            },
            { type: 'note', tone: 'warn', text: '배경 이미지는 기본이 **반복(repeat)** 이에요. 사진 한 장을 깔았는데 바둑판처럼 여러 번 나오면 `no-repeat`을 빼먹은 거예요.' },
          ],
        },
        {
          title: 'url 경로의 기준은 CSS 파일',
          blocks: [
            { type: 'say', text: '여기서 정말 많이 틀려요. CSS 안의 `url()` 경로는 **HTML 파일이 아니라 CSS 파일 위치**에서 출발해요.' },
            { type: 'code', code: `my-site/
+-- index.html
+-- css/
|   +-- style.css    ← 여기서 출발!
+-- images/
    +-- bakery.jpg

/* style.css 안에서 */
url("images/bakery.jpg")      ❌ css/images/bakery.jpg 를 찾음
url("../images/bakery.jpg")   ✅ 한 칸 위로 나가서 images/` },
            { type: 'ask', q: 'HTML에서는 `<img src="images/bakery.jpg">`가 잘 되는데, CSS에서 같은 경로를 쓰니 안 보여요. 왜일까요?', a: 'HTML은 루트(`index.html` 위치)에서, CSS는 `css/` 폴더 안에서 출발하기 때문이에요. CSS에서는 `../`로 **한 칸 위로 나간 다음** images로 들어가야 해요. 1강의 상대경로 규칙이 "누가 쓰느냐" 기준이라는 걸 기억하세요.' },
          ],
        },
      ],
    },
    {
      title: 'background-size: cover vs contain',
      slides: [
        {
          title: '사진과 상자 비율이 다를 때',
          blocks: [
            { type: 'say', text: '가로로 긴 배너 상자에 정사각형 사진을 깔면, 비율이 안 맞죠. 이때 사진을 **어떻게 맞출지** 정하는 게 `background-size`예요. 두 값만 확실히 알면 돼요.' },
            {
              type: 'table',
              head: ['값', '맞추는 방식', '결과', '어울리는 곳'],
              rows: [
                ['`cover`', '상자를 **빈틈없이 덮을** 때까지 키움', '빈 곳 없음, 대신 **일부가 잘림**', '큰 배너, 히어로 이미지'],
                ['`contain`', '이미지 **전체가 들어갈** 때까지만 키움', '안 잘림, 대신 **여백이 생김**', '로고, 아이콘, 제품 전체 모습'],
              ],
            },
            { type: 'say', text: '두 방식 모두 **비율은 유지**해요. 사진이 찌그러지지 않아요. 차이는 "넘치는 쪽을 자를 거냐, 모자라는 쪽을 비워 둘 거냐"예요.' },
          ],
        },
        {
          title: '이불과 액자',
          blocks: [
            { type: 'note', tone: 'analogy', text: '**cover**는 이불이에요. 침대를 빈틈없이 **덮는 게** 목적이라 가장자리가 침대 밖으로 늘어져도(잘려도) 괜찮아요.\n**contain**은 액자예요. 그림 전체가 **담기는(contain) 게** 목적이라 그림 주변에 빈 여백이 남아도 괜찮아요.' },
            { type: 'ask', q: '회사 로고를 배경으로 넣었는데 `cover`를 썼더니 로고 글자 끝이 잘렸어요. 어떻게 할까요?', a: '`contain`으로 바꿔요. 로고는 **전부 보이는 게** 중요하니까요. 여백이 생기면 `background-color`로 그 자리를 채워 주면 자연스러워요.' },
          ],
        },
      ],
    },
    {
      title: 'background-attachment: fixed',
      slides: [
        {
          title: '배경은 멈추고 내용만 지나가게',
          blocks: [
            { type: 'code', code: `.parallax {
  background: url("../images/bread.jpg") center / cover;
  background-attachment: fixed;
}` },
            { type: 'say', text: '`fixed`를 주면 페이지를 스크롤해도 배경 이미지가 **화면에 고정**돼 있고, 그 위의 내용만 미끄러지듯 지나가요. 창문 너머 풍경을 보는 듯한 깊이감이 생기죠. 이런 걸 **패럴랙스**(시차) 효과라고 해요. CSS 한 줄로 만드는 가장 간단한 버전이에요.' },
            { type: 'note', tone: 'warn', text: '**모바일(특히 iOS Safari)에서는 잘 동작하지 않아요.** 고정이 무시되거나, 이미지가 엄청 크게 확대돼 보이기도 해요. 모바일에서는 미디어 쿼리(15강)로 `fixed`를 꺼 주는 게 안전해요.' },
          ],
        },
      ],
    },
    {
      title: '단축 속성',
      slides: [
        {
          title: '배경을 한 줄로',
          blocks: [
            { type: 'say', text: '5강의 margin처럼 배경도 **단축 속성** `background` 하나로 몰아 쓸 수 있어요.' },
            { type: 'code', code: `background: #f6efe6 url("../images/bakery.jpg") no-repeat center / cover;

/* 색:    #f6efe6
   이미지: url("../images/bakery.jpg")
   반복:   no-repeat
   위치 / 크기: center / cover */` },
            { type: 'say', text: '순서는 비교적 자유롭지만 **딱 하나 규칙**이 있어요. **위치(position)와 크기(size)는 `/`로 붙여서**, 위치를 먼저 써요.\n\n왜냐하면 `center`도, `50%`도 위치인지 크기인지 둘 다 될 수 있잖아요. `/`가 "여기부터는 크기예요"라는 표시예요.' },
            { type: 'code', code: `center / cover       ✅ 위치 center, 크기 cover
cover center         ❌ 크기를 / 없이 쓰면 무시됨` },
          ],
        },
      ],
    },
    {
      title: '그라디언트',
      slides: [
        {
          title: '이미지 파일 없이 색 번지기',
          blocks: [
            { type: 'say', text: '그라디언트는 색이 부드럽게 바뀌는 배경이에요. 신기하게도 CSS는 그라디언트를 **이미지**로 취급해서 `background-image`(또는 `background`)에 써요.' },
            { type: 'code', code: `/* 선형: 방향 + 색들 */
background: linear-gradient(90deg, #ff9a8b, #ff6a88);

/* 원형: 가운데서 바깥으로 */
background: radial-gradient(circle, #fff, #ffd6a5);` },
            {
              type: 'table',
              head: ['각도', '방향'],
              rows: [
                ['`0deg`', '아래 → **위**'],
                ['`90deg`', '왼쪽 → **오른쪽**'],
                ['`180deg` (기본)', '위 → **아래**'],
                ['`to right`', '각도 대신 말로 써도 돼요 (= 90deg)'],
              ],
            },
            { type: 'ask', q: '각도가 헷갈려요. 0deg가 왜 "위로"일까요?', a: '**시계 바늘**을 떠올려요. 0deg는 12시(위)를 가리키고, 90deg는 3시(오른쪽)를 가리켜요. 그라디언트는 그 바늘이 **가리키는 쪽으로** 색이 흘러가요.' },
          ],
        },
      ],
    },
    {
      title: '배경 위에 어두운 막 씌우기',
      slides: [
        {
          title: '배경은 여러 겹 쌓을 수 있어요',
          blocks: [
            { type: 'say', text: '`background`에 **쉼표로 여러 개**를 쓰면 겹겹이 쌓여요. 그리고 **먼저 쓴 게 위에** 올라가요.' },
            { type: 'code', code: `.hero {
  background:
    linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)),   /* 1층: 반투명 검은 막 (위) */
    url("../images/bakery.jpg") center / cover no-repeat;  /* 2층: 사진 (아래) */
  color: white;
}` },
            { type: 'say', text: '왜 이렇게 할까요? 밝은 사진 위에 흰 글씨를 쓰면 **글자가 안 보여요.** 사진과 글자 사이에 40% 검은 막을 끼우면 사진은 은은하게 보이고 글자는 또렷해져요.' },
            { type: 'note', tone: 'tip', text: '시작 색과 끝 색이 **같은** 그라디언트(`rgba(0,0,0,.4)` 두 번)는 그냥 "한 가지 반투명 색"이에요. `background-color`는 이미지 **아래**에만 깔리기 때문에, 이미지 **위에** 색을 얹으려면 이렇게 그라디언트로 써야 해요.' },
            { type: 'ask', q: '순서를 거꾸로 써서 사진을 먼저, 그라디언트를 나중에 쓰면 어떻게 될까요?', a: '사진이 맨 위로 올라와서 **검은 막이 사진 밑에 깔려요.** 사진이 막을 다 가려서 아무 효과가 없어요. "먼저 쓴 게 위" — 레이어 순서를 꼭 기억하세요.' },
          ],
        },
      ],
    },
    {
      title: 'img 태그 vs background-image',
      slides: [
        {
          title: '내용이냐, 꾸밈이냐',
          blocks: [
            { type: 'say', text: '이미지를 넣는 방법이 두 개라서, 언제 무엇을 쓸지 헷갈려요. 질문 하나로 정해요. **"이 이미지가 사라지면 정보가 사라지나?"**' },
            {
              type: 'table',
              head: ['', '`<img>` + alt', '`background-image`'],
              rows: [
                ['성격', '**내용**: 없으면 정보가 빠짐', '**꾸밈**: 없어도 내용은 그대로'],
                ['예시', '상품 사진, 프로필 사진, 기사 사진', '배경 패턴, 배너 분위기 사진, 장식'],
                ['스크린리더', 'alt를 읽어 줌', '무시함'],
                ['검색엔진', '이미지 검색에 나옴', '안 나옴'],
              ],
            },
            { type: 'say', text: '쇼핑몰 상품 사진을 배경 이미지로 넣으면, 눈이 불편한 사용자는 그 상품이 뭔지 알 방법이 없어요. **내용이면 img**, 이게 원칙이에요.' },
          ],
        },
        {
          title: 'img를 cover처럼 쓰기: object-fit',
          blocks: [
            { type: 'say', text: '"상품 사진이니 img가 맞는데, 카드 크기에 맞춰 cover처럼 꽉 채우고 싶어요." 이럴 땐 `object-fit`을 써요.' },
            { type: 'code', code: `.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;   /* background-size: cover 와 같은 효과 */
}` },
            { type: 'say', text: '크기를 강제로 정하면 사진이 찌그러지는데, `object-fit: cover`를 주면 비율을 지키면서 넘치는 부분만 잘라 줘요. `contain`도 똑같이 쓸 수 있어요. 내용은 img로 지키고, 모양은 배경처럼 다루는 방법이에요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-06-01', type: 'ox', source: '기본 속성', question: 'CSS 파일 안 background-image의 url 경로는 HTML 파일 위치 기준이다.', answer: false, explanation: 'CSS 파일 위치 기준이에요. css 폴더 안의 CSS라면 ../images/... 처럼 써야 해요.' },
    { id: 'fe-06-02', type: 'short', source: '기본 속성', question: '배경 이미지를 반복하지 않게 하는 background-repeat 값은?', answer: ['no-repeat'], explanation: '기본값은 repeat(바둑판 반복).' },
    { id: 'fe-06-03', type: 'mcq', source: 'background-size: cover vs contain', question: '영역을 빈틈없이 채우되 일부가 잘릴 수 있는 값은? (히어로 배너용)', choices: ['contain', 'cover', 'auto', '100% auto'], answer: 1, explanation: 'cover = 꽉 채움(잘림 가능), contain = 전체 보임(여백 가능).' },
    { id: 'fe-06-04', type: 'ox', source: 'background-size: cover vs contain', question: '로고처럼 이미지 전체가 보여야 할 때는 contain이 적합하다.', answer: true, explanation: 'contain은 비율을 유지하며 이미지 전체를 보여줘요.' },
    { id: 'fe-06-05', type: 'mcq', source: 'background-attachment: fixed', question: 'background-attachment: fixed 의 효과와 주의점은?', choices: ['배경이 스크롤을 따라감 / 주의점 없음', '스크롤해도 배경 고정(패럴랙스) / iOS 등 모바일에서 잘 안 됨', '배경이 반복됨 / 성능 저하', '배경 크기 고정 / 반응형 불가'], answer: 1, explanation: 'fixed는 간단한 패럴랙스 효과를 주지만 모바일 지원이 불안정해요.' },
    { id: 'fe-06-06', type: 'mcq', source: '단축 속성', question: 'background 단축 속성에서 position과 size를 구분하는 기호는?', choices: [',', '/', '-', ':'], answer: 1, explanation: 'center / cover 처럼 position / size.' },
    { id: 'fe-06-07', type: 'short', source: '그라디언트', question: '왼쪽에서 오른쪽으로 가는 선형 그라디언트의 각도는? (deg 포함)', answer: ['90deg'], explanation: 'linear-gradient(90deg, ...) 는 왼→오. 0deg는 아래→위.' },
    { id: 'fe-06-08', type: 'mcq', source: '배경 위에 어두운 막 씌우기', question: '배경을 쉼표로 여러 개 쓰면 쌓이는 순서는?', choices: ['뒤에 쓴 것이 위에', '앞에 쓴 것이 위에', '무작위', '이미지가 항상 위에'], answer: 1, explanation: '앞에 쓴 배경이 맨 위 레이어. 그래서 어두운 그라디언트를 이미지 앞에 써요.' },
    { id: 'fe-06-09', type: 'essay', source: 'img 태그 vs background-image', question: '이미지를 <img>로 넣을지 background-image로 넣을지 판단하는 기준을 설명하세요.', answer: '이미지가 콘텐츠(의미)인지 장식인지로 나눈다. 상품 사진·프로필처럼 내용인 이미지는 <img>와 alt를 써서 스크린리더·검색엔진이 인식하게 하고, 패턴·배너 배경 같은 꾸밈용은 background-image로 넣는다. <img>를 영역에 꽉 채우고 싶으면 object-fit: cover를 쓴다.', keywords: ['콘텐츠 vs 장식', 'alt', 'object-fit'], explanation: '의미가 있으면 img, 꾸밈이면 background.' },
    { id: 'fe-06-10', type: 'short', source: 'img 태그 vs background-image', question: '<img>를 영역에 cover처럼 채우는 CSS 속성은? (속성: 값)', answer: ['object-fit: cover', 'object-fit:cover'], explanation: 'object-fit: cover — img 버전의 background-size: cover.' },
  ],
}

export default topic

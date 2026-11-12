import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-02-css-basic',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '2강 - CSS 기본',
  order: 2,
  notionId: '3efdf951bf8081a6842be9808974569b',
  sections: [
    {
      title: 'CSS 문법',
      slides: [
        {
          title: '누구에게, 무엇을, 어떻게',
          blocks: [
            { type: 'say', text: '1강에서 HTML로 뼈대를 세웠으니, 이제 **옷을 입힐 차례**예요. CSS 문장은 딱 한 가지 모양뿐이에요.' },
            {
              type: 'code',
              code: `.price {            ← 선택자: 누구에게?
  color: tomato;    ← 속성: 값;  (무엇을, 어떻게)
  font-size: 20px;
}`,
            },
            { type: 'list', items: ['**선택자** — 스타일을 입힐 대상을 골라요 (`.price` = class가 price인 요소들)', '**중괄호 `{ }`** — 그 대상에게 줄 스타일 묶음', '**`속성: 값;`** — "글자색은 토마토색", 한 줄마다 끝에 **세미콜론**'] },
            { type: 'note', tone: 'analogy', text: '미용실 주문서랑 똑같아요. "**3번 손님**(선택자)에게 — 머리 색: 갈색; 길이: 어깨;" 대상을 먼저 부르고, 바꿀 항목과 값을 하나씩 적는 거예요.' },
          ],
        },
        {
          title: '주석은 /* */',
          blocks: [
            { type: 'code', code: `/* 가격 표시 — 할인 중일 때 빨간색 */
.price { color: tomato; }` },
            { type: 'say', text: 'CSS 주석은 **`/* */` 한 가지뿐**이에요. 언어마다 주석 모양이 달라서 헷갈리기 쉬워요.' },
            {
              type: 'table',
              head: ['언어', '주석'],
              rows: [
                ['HTML', '`<!-- 주석 -->`'],
                ['CSS', '`/* 주석 */`'],
                ['JavaScript', '`// 한 줄` 또는 `/* 여러 줄 */`'],
              ],
            },
            { type: 'note', tone: 'tip', text: 'VS Code에서 `Ctrl + /`를 누르면 지금 파일 언어에 맞는 주석을 알아서 넣어 줘요. 외우기 귀찮으면 이걸 쓰세요.' },
          ],
        },
      ],
    },
    {
      title: 'CSS 적용 방법',
      slides: [
        {
          title: 'CSS를 HTML에 붙이는 세 가지 방법',
          blocks: [
            {
              type: 'code',
              code: `<!-- ① 인라인: 태그에 직접 -->
<p style="color: red;">품절</p>

<!-- ② 내부: head 안 style 태그 -->
<style>
  p { color: red; }
</style>

<!-- ③ 외부: 별도 CSS 파일을 연결 -->
<link rel="stylesheet" href="css/style.css" />`,
            },
            { type: 'say', text: '세 방법 모두 결과는 같아 보여요. 차이는 **관리**에서 나요.' },
          ],
        },
        {
          title: '왜 외부 파일이 정답일까',
          blocks: [
            {
              type: 'table',
              head: ['방법', '장점', '단점'],
              rows: [
                ['① 인라인', '빠르게 한 곳만 바꿀 때', '**재사용 불가**, 우선순위가 너무 높아 덮어쓰기 어려움'],
                ['② 내부', '파일 하나로 끝남', '**그 페이지에서만** 쓸 수 있음'],
                ['③ 외부', '**여러 페이지가 공유**, HTML과 분리돼 보기 편함', '파일이 하나 더 생김'],
              ],
            },
            { type: 'say', text: '페이지가 20개인 사이트에서 버튼 색을 바꾼다고 해 볼게요. 인라인이면 20개 파일을 다 열어서 고쳐야 해요. 외부 파일이면 **style.css 한 줄만** 고치면 20페이지가 한 번에 바뀌어요.' },
            { type: 'ask', q: '인라인 스타일은 "우선순위가 매우 높다"고 했어요. 그게 왜 단점일까요?', a: '나중에 CSS 파일에서 그 요소를 바꾸려 해도 **인라인이 이겨 버려서** 안 바뀌어요. 이기려면 `!important` 같은 무리수를 써야 하고, 그러면 코드가 점점 꼬여요. 바로 다음 개념인 Cascading에서 자세히 볼게요.' },
          ],
        },
      ],
    },
    {
      title: '색상 표현',
      slides: [
        {
          title: '같은 색을 쓰는 여러 방법',
          blocks: [
            { type: 'say', text: 'CSS에서 색은 여러 방식으로 쓸 수 있어요. 아래는 전부 **같은 토마토색**이에요.' },
            { type: 'code', code: `color: tomato;                 /* 이름 */
color: #ff6347;                /* HEX (16진수) */
color: rgb(255, 99, 71);       /* RGB */
color: hsl(9, 100%, 64%);      /* HSL */` },
            {
              type: 'table',
              head: ['방식', '읽는 법'],
              rows: [
                ['이름', '`red`, `tomato`, `skyblue` — 쉽지만 종류가 한정돼요'],
                ['**HEX**', '`#빨강빨강 초록초록 파랑파랑` — 각 두 자리, 00(없음)~ff(가득). **피그마·포토샵 값 그대로** 복사 가능'],
                ['RGB', '빨강, 초록, 파랑을 0~255 숫자로'],
                ['HSL', '색상(0~360도 색상환), 채도(%), 밝기(%) — "조금 더 밝게"를 조절하기 쉬움'],
              ],
            },
          ],
        },
        {
          title: 'HEX 줄여 쓰기와 투명도',
          blocks: [
            { type: 'say', text: 'HEX는 **두 자리씩 같은 글자**면 한 글자로 줄일 수 있어요.' },
            { type: 'code', code: `#ff6633  →  #f63      (ff→f, 66→6, 33→3)
#ffffff  →  #fff      (흰색)
#ff6347  →  줄일 수 없음 (63, 47이 같은 글자 쌍이 아님)` },
            { type: 'say', text: '반투명하게 하고 싶으면 **rgba**를 써요. 마지막 네 번째 값 **a(alpha)** 가 **투명도**예요. `0`이면 완전히 투명, `1`이면 완전히 불투명이에요.' },
            { type: 'code', code: `/* 사진 위에 깔리는 반투명 검은 막 */
background: rgba(0, 0, 0, 0.5);   /* 검정, 50% 투명 */` },
            { type: 'note', tone: 'tip', text: '사진 위에 흰 글씨를 올릴 때, 사진이 밝으면 글씨가 안 보여요. 그 사이에 `rgba(0,0,0,0.4)` 같은 반투명 막을 깔면 글씨가 또렷해져요. 실무에서 정말 자주 쓰는 방법이에요.' },
          ],
        },
      ],
    },
    {
      title: 'Cascading: 어떤 스타일이 이기나?',
      slides: [
        {
          title: '규칙이 부딪히면 누가 이길까',
          blocks: [
            { type: 'say', text: 'CSS의 C는 **Cascading**(폭포처럼 흘러내리는)이에요. 한 요소에 여러 규칙이 동시에 걸리면, 정해진 순서대로 **누가 이길지** 결정해요. CSS가 "안 먹힌다"고 느낄 때 99%는 이 규칙 때문이에요.' },
            { type: 'code', code: `<p class="notice" id="top">공지</p>

p       { color: black; }
.notice { color: blue; }
#top    { color: green; }

/* 세 규칙이 전부 이 p에 걸려요. 글자색은? */` },
            { type: 'say', text: '정답은 **green**이에요. 판정은 세 단계로 해요.' },
          ],
        },
        {
          title: '판정 3단계',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**중요도** — `!important`가 붙은 쪽이 무조건 이겨요 (그래서 최대한 안 써요)',
                '**명시도** — 선택자가 얼마나 **구체적으로** 가리키는지 점수를 매겨요',
                '**순서** — 명시도까지 같으면 **나중에 쓴 규칙**이 이겨요',
              ],
            },
            {
              type: 'table',
              head: ['명시도 순위', '예시', '비유'],
              rows: [
                ['1. 인라인 `style=""`', '`<p style="...">`', '본인에게 직접 쪽지'],
                ['2. id', '`#top`', '주민번호로 지목'],
                ['3. class · 속성 · 가상 클래스', '`.notice`, `[type]`, `:hover`', '동아리로 지목'],
                ['4. 태그', '`p`, `h1`', '"모든 학생"'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '선생님이 "**모든 학생**은 앉아(태그)", "**축구부**는 서(class)", "**20번**은 나와(id)"라고 했어요. 20번 축구부 학생은? **가장 콕 집어 부른 말**(id)을 따르죠. 명시도가 바로 이 "얼마나 콕 집었나"예요.' },
          ],
        },
        {
          title: '명시도 점수 세기',
          blocks: [
            { type: 'say', text: '선택자가 길어지면 **(id 개수, class 개수, 태그 개수)** 로 세요. 왼쪽 자리부터 비교해서 큰 쪽이 이겨요.' },
            { type: 'code', code: `#nav .menu a     →  (1, 1, 1)
.menu a          →  (0, 1, 1)
ul li a          →  (0, 0, 3)

(1,1,1) > (0,1,1) > (0,0,3)
태그를 아무리 많이 붙여도 class 하나를 못 이겨요` },
            { type: 'ask', q: '`.btn { color: red; }` 다음 줄에 `.btn { color: blue; }`가 있어요. 버튼 색은?', a: '**blue**예요. 둘 다 class 하나라 명시도가 같고, 그럼 **나중에 쓴 쪽**이 이겨요.' },
          ],
        },
        {
          title: '안 먹힐 때 범인 찾기',
          blocks: [
            { type: 'say', text: '개발자 도구 Elements 탭에서 요소를 선택하면, 오른쪽 **Styles** 패널에 걸린 규칙이 전부 보여요. **취소선이 그어진 속성**이 "다른 규칙에 진 것"이에요. 위쪽에 있는 이긴 규칙을 보면 범인을 바로 찾을 수 있어요.' },
            { type: 'note', tone: 'warn', text: '안 먹힌다고 `!important`를 붙이면 그 순간은 해결돼요. 하지만 나중에 그걸 또 바꾸려면 **더 강한 `!important`** 가 필요해지고, 코드 전체가 `!important` 싸움판이 돼요. 해결은 **명시도를 정리**하는 쪽(class 위주로 짧게)으로 하세요.' },
          ],
        },
      ],
    },
    {
      title: '브라우저 기본 스타일',
      slides: [
        {
          title: 'CSS를 안 썼는데도 모양이 있는 이유',
          blocks: [
            { type: 'say', text: 'CSS를 한 줄도 안 쓴 HTML을 열어 보면, h1은 크고 굵고, 목록엔 점이 있고, 링크는 파란 밑줄이 있어요. 브라우저가 **기본 스타일**을 미리 입혀 두기 때문이에요.\n\n문제는 이 기본값이 **브라우저마다 조금씩 달라요.** body 바깥 여백이 Chrome은 8px인데 다른 브라우저는 다를 수 있어요. 그래서 작업 전에 기본값을 **리셋**하고 시작해요.' },
          ],
        },
        {
          title: '자주 쓰는 리셋 네 줄',
          blocks: [
            { type: 'code', code: `* { margin: 0; padding: 0; box-sizing: border-box; }
ul { list-style: none; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }` },
            {
              type: 'table',
              head: ['줄', '하는 일'],
              rows: [
                ['`*`', '모든 요소의 기본 여백을 0으로. box-sizing은 5강에서 배워요'],
                ['`ul`', '목록의 점 없애기 (메뉴 만들 때 매번 지우니까)'],
                ['`a`', '파란 글씨·밑줄 없애고 부모 글자색 따라가기'],
                ['`img`', '이미지가 **부모보다 넓어지지 않게** → 모바일에서 화면 밖으로 삐져나가는 걸 막아요'],
              ],
            },
            { type: 'note', tone: 'tip', text: '이걸 직접 쓰는 대신 **reset.css**나 **normalize.css** 같은 남이 만든 파일을 가져다 쓰기도 해요. reset은 기본값을 싹 지우고, normalize는 브라우저 간 차이만 맞춰 줘요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-02-01', type: 'mcq', source: 'CSS 문법', question: 'CSS 주석으로 올바른 것은?', choices: ['// 주석', '<!-- 주석 -->', '/* 주석 */', '# 주석'], answer: 2, explanation: 'CSS 주석은 /* */ 만 가능해요. <!-- -->는 HTML 주석.' },
    { id: 'fe-02-02', type: 'ox', source: 'CSS 문법', question: 'CSS는 "선택자 { 속성: 값; }" 구조로 작성한다.', answer: true, explanation: '선택자로 대상을 고르고 중괄호 안에 속성: 값; 을 나열해요.' },
    { id: 'fe-02-03', type: 'mcq', source: 'CSS 적용 방법', question: '실무에서 가장 권장되는 CSS 적용 방법은?', choices: ['인라인 style 속성', 'head 안 <style>', '외부 파일을 <link>로 연결', '@import만 사용'], answer: 2, explanation: '외부 파일은 여러 페이지가 같은 CSS를 공유할 수 있고 관리가 편해요.' },
    { id: 'fe-02-04', type: 'ox', source: 'CSS 적용 방법', question: '인라인 스타일은 재사용이 어렵고 우선순위가 매우 높다.', answer: true, explanation: '태그마다 직접 쓰므로 재사용 불가, 명시도는 id보다도 높아요.' },
    { id: 'fe-02-05', type: 'mcq', source: '색상 표현', question: 'rgba(0, 0, 0, 0.5) 에서 마지막 0.5의 의미는?', choices: ['밝기', '채도', '투명도', '색상 각도'], answer: 2, explanation: 'a = alpha(투명도), 0(완전 투명) ~ 1(불투명).' },
    { id: 'fe-02-06', type: 'short', source: '색상 표현', question: '#ff6633 을 HEX 줄임 표기로 쓰면? (# 포함)', answer: ['#f63'], explanation: '각 쌍이 같은 글자(ff, 66, 33)면 #f63처럼 3자리로 줄일 수 있어요.' },
    { id: 'fe-02-07', type: 'mcq', source: 'Cascading: 어떤 스타일이 이기나?', question: '명시도(Specificity)가 높은 순서로 올바른 것은?', choices: ['태그 > class > id > 인라인', '인라인 > id > class > 태그', 'id > 인라인 > class > 태그', 'class > id > 태그 > 인라인'], answer: 1, explanation: '인라인 > id > class·속성·가상클래스 > 태그. (!important는 별도로 가장 강함)' },
    { id: 'fe-02-08', type: 'mcq', source: 'Cascading: 어떤 스타일이 이기나?', question: '<p class="notice" id="top">에 아래 CSS가 적용되면 글자색은?', code: `p { color: black; }
.notice { color: blue; }
#top { color: green; }`, choices: ['black', 'blue', 'green', 'tomato'], answer: 2, explanation: 'id 선택자의 명시도가 가장 높아서 green이 이겨요.' },
    { id: 'fe-02-09', type: 'ox', source: 'Cascading: 어떤 스타일이 이기나?', question: '명시도가 같으면 먼저 쓴 규칙이 이긴다.', answer: false, explanation: '명시도가 같으면 나중에 쓴 규칙이 이겨요.' },
    { id: 'fe-02-10', type: 'short', source: 'Cascading: 어떤 스타일이 이기나?', question: '#nav .menu a 의 명시도를 (id, class, 태그) 형식으로 쓰면?', answer: ['(1,1,1)', '1,1,1', '(1, 1, 1)', '111'], explanation: 'id 1개(#nav), class 1개(.menu), 태그 1개(a) → (1, 1, 1).' },
    { id: 'fe-02-11', type: 'essay', source: 'Cascading: 어떤 스타일이 이기나?', question: 'CSS가 안 먹힐 때 개발자 도구로 원인을 찾는 방법과, !important를 피해야 하는 이유를 설명하세요.', answer: 'Elements 탭에서 요소를 선택하면 Styles 패널에 적용된 규칙이 보이고, 진 규칙은 취소선이 그어져 있어 어떤 규칙에 졌는지 알 수 있어요. !important는 명시도 규칙을 무시해서 이후에 덮어쓰려면 또 !important가 필요해지는 악순환이 생기고 유지보수가 어려워져요.', keywords: ['취소선', '명시도', '유지보수'], explanation: '스타일 충돌은 명시도를 정리(클래스 위주)해서 해결하는 게 기본이에요.' },
    { id: 'fe-02-12', type: 'mcq', source: '브라우저 기본 스타일', question: '리셋 CSS에서 img { max-width: 100%; } 를 주는 이유는?', choices: ['이미지를 숨기려고', '이미지가 부모보다 커지지 않게', '이미지를 가운데 정렬하려고', '이미지 비율을 바꾸려고'], answer: 1, explanation: 'max-width: 100%면 부모 너비를 넘지 않아 반응형에서 넘침을 막아요.' },
    { id: 'fe-02-13', type: 'ox', source: '브라우저 기본 스타일', question: '브라우저는 h1 크기, body 여백 같은 기본 스타일을 가지고 있다.', answer: true, explanation: '브라우저마다 기본값이 달라서 reset.css나 normalize.css로 맞추고 시작해요.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-08-font',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '8강 - 폰트와 텍스트 (font)',
  order: 8,
  notionId: '3efdf951bf8081989dc4e0bb020db59b',
  sections: [
    {
      title: 'font 속성',
      slides: [
        {
          title: '글꼴 고르기: font-family',
          blocks: [
            { type: 'say', text: '이번 수업은 **글자**를 다루는 법이에요. 웹페이지의 대부분은 글이라서, 글꼴만 잘 골라도 사이트 인상이 확 바뀌어요.' },
            { type: 'code', code: `body {
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
}` },
            { type: 'say', text: '`font-family`에는 글꼴을 **여러 개** 써요. 브라우저는 **앞에서부터** 하나씩 확인해서, 사용자 컴퓨터에 있는 첫 번째 글꼴을 써요.\n1. Pretendard가 있으면 → Pretendard\n2. 없으면 맥의 Apple SD Gothic Neo\n3. 그것도 없으면 → **아무 고딕(sans-serif) 계열**이라도' },
            { type: 'note', tone: 'analogy', text: '식당에서 "**짜장면, 없으면 짬뽕, 그것도 없으면 아무 면 요리**" 하고 주문하는 거예요. 마지막의 `sans-serif`(고딕 계열)나 `serif`(명조 계열)는 "아무 면 요리"라서, 원하는 글꼴이 다 없어도 **분위기는 비슷하게** 지켜 줘요.' },
            { type: 'say', text: '`"Apple SD Gothic Neo"`처럼 이름에 **띄어쓰기가 있으면 따옴표**로 감싸요.' },
          ],
        },
        {
          title: '굵기와 줄 간격',
          blocks: [
            { type: 'code', code: `h1   { font-weight: 700; }   /* = bold */
p    { font-weight: 400; }   /* = normal */
body { line-height: 1.6; }   /* 단위 없이! 글자 크기의 1.6배 */` },
            { type: 'say', text: '`font-weight`는 **100~900** 숫자로 써요. 400이 보통(`normal`), 700이 굵게(`bold`)예요. 단, 그 글꼴이 해당 굵기 파일을 가지고 있어야 제대로 보여요.' },
            { type: 'say', text: '`line-height`(줄 간격)는 **단위 없이** 쓰는 게 안전해요. 이유를 볼게요.' },
            { type: 'code', code: `body { font-size: 16px; line-height: 24px; }  /* 단위 있음 */
h1   { font-size: 40px; }  /* 줄 간격 24px을 그대로 물려받음 → 글자보다 좁아서 겹침! */

body { font-size: 16px; line-height: 1.5; }    /* 단위 없음 */
h1   { font-size: 40px; }  /* "1.5배"라는 비율을 물려받음 → 60px, 자연스러움 */` },
            { type: 'say', text: '단위를 붙이면 **계산 결과(24px)** 가 자식에게 물려지고, 단위가 없으면 **비율(1.5배)** 이 물려져요. 자식 글자 크기가 달라도 비율은 알맞게 다시 계산돼요. 물려받기(상속)는 14강에서 자세히 배워요.' },
          ],
        },
      ],
    },
    {
      title: '웹폰트',
      slides: [
        {
          title: '사용자 컴퓨터에 없는 글꼴 쓰기',
          blocks: [
            { type: 'say', text: '`font-family`는 사용자 컴퓨터에 **설치된** 글꼴만 쓸 수 있어요. 내가 예쁜 글꼴을 골라도 사용자에게 없으면 소용없죠.\n\n**웹폰트**는 글꼴 파일을 **웹에서 같이 내려받게** 해서, 누구에게나 같은 글꼴로 보여 줘요.' },
            { type: 'code', code: `<!-- 방법 ① Google Fonts: 사이트에서 link 태그를 복사해 head에 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet" />

/* 방법 ② 파일을 직접 가지고 있을 때 */
@font-face {
  font-family: "Pretendard";
  src: url("../fonts/Pretendard-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}` },
            { type: 'note', tone: 'tip', text: '파일 형식은 **woff2**를 쓰세요. 웹용으로 압축된 형식이라 ttf·otf보다 훨씬 가벼워요.' },
          ],
        },
        {
          title: 'font-display: swap과 한글 폰트 주의점',
          blocks: [
            { type: 'say', text: '웹폰트는 내려받는 데 시간이 걸려요. 그동안 글자를 **아예 안 보여 주면**, 사용자는 빈 화면만 봐요.\n\n`font-display: swap`은 "**일단 기본 글꼴로 글자를 먼저 보여 주고**, 웹폰트가 도착하면 바꿔치기(swap)해"라는 뜻이에요. 글꼴이 살짝 바뀌는 순간이 있지만, 내용을 바로 읽을 수 있어서 훨씬 나아요.' },
            { type: 'say', text: '한글 폰트는 특히 조심해요.\n• 영어는 글자가 수십 개지만 한글은 **수천 자**라 파일이 **몇 MB**씩 해요 → **필요한 굵기만** 불러와요 (400, 700 정도)\n• 무료라고 다 상업용으로 쓸 수 있는 게 아니에요 → 회사 사이트에 쓰기 전에 **라이선스**를 확인해요' },
            { type: 'ask', q: 'Google Fonts 링크 끝에 붙어 있던 `&display=swap`은 무슨 뜻일까요?', a: '바로 `font-display: swap`이에요. Google Fonts가 만들어 주는 CSS에 swap을 넣어 달라는 옵션이에요. 그래서 링크만 복사해도 "기본 글꼴 먼저 보여 주기"가 적용돼요.' },
          ],
        },
      ],
    },
    {
      title: '텍스트 속성',
      slides: [
        {
          title: '자주 쓰는 텍스트 속성',
          blocks: [
            {
              type: 'table',
              head: ['속성', '하는 일', '예'],
              rows: [
                ['`text-align`', '글자 **정렬**', '`left`, `center`, `right`'],
                ['`text-decoration`', '밑줄·취소선', '`underline`, `line-through`(할인 전 가격), `none`(링크 밑줄 제거)'],
                ['`text-transform`', '영어 대소문자', '`uppercase` → MENU'],
                ['`letter-spacing`', '**자간** (글자 사이)', '`-0.02em`'],
                ['`text-indent`', '첫 줄 들여쓰기', '`1em`'],
                ['`text-shadow`', '글자 그림자', '`0 1px 2px rgba(0,0,0,.3)`'],
              ],
            },
            { type: 'code', code: `.old-price { text-decoration: line-through; color: #999; }  /* ~~5,000원~~ */
.new-price { color: tomato; font-weight: 700; }` },
          ],
        },
        {
          title: '한글을 예쁘게: 자간과 keep-all',
          blocks: [
            { type: 'say', text: '한글 글꼴은 기본 자간이 약간 **넓어 보이는** 경우가 많아요. `letter-spacing`을 살짝 음수(`-0.02em` 정도)로 주면 단정해 보여요. 너무 많이 줄이면 글자끼리 붙으니 조금만요.' },
            { type: 'code', code: `/* 기본: 줄 끝에서 단어 중간이 잘림 */
오늘 아침에 갓 구운 크로와
상을 만나 보세요

/* word-break: keep-all */
오늘 아침에 갓 구운
크로와상을 만나 보세요` },
            { type: 'say', text: '브라우저는 한글을 **글자 단위**로 줄바꿈해서 "크로와 / 상"처럼 단어가 쪼개져요. `word-break: keep-all`을 주면 **띄어쓰기 단위**로만 줄을 바꿔서 단어가 붙어 있어요. 한글 사이트라면 body에 거의 기본으로 넣어요.' },
          ],
        },
      ],
    },
    {
      title: '말줄임 (...) 처리',
      slides: [
        {
          title: '한 줄 말줄임',
          blocks: [
            { type: 'say', text: '상품 이름이 길어서 카드 밖으로 넘칠 때, 끝을 **"…"** 으로 줄이는 처리예요. 쇼핑몰, 뉴스 목록 어디에나 있어요. 한 줄짜리는 **세 속성이 한 세트**예요.' },
            { type: 'code', code: `.title {
  white-space: nowrap;      /* ① 줄바꿈 금지 → 한 줄로 쭉 */
  overflow: hidden;         /* ② 넘친 부분 숨기기 (5강) */
  text-overflow: ellipsis;  /* ③ 잘린 자리에 … 표시 */
}` },
            { type: 'say', text: '왜 셋 다 필요할까요?\n• ①이 없으면 글자가 다음 줄로 넘어가 버려서 "넘침"이 안 생겨요\n• ②가 없으면 넘친 글자가 그대로 삐져나와 보여요\n• ③이 없으면 그냥 뚝 잘려요. "…"을 붙이는 건 ③이에요\n**하나라도 빠지면 작동하지 않아요.**' },
          ],
        },
        {
          title: '여러 줄 말줄임',
          blocks: [
            { type: 'code', code: `.desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;          /* 2줄까지만 보여 주기 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}` },
            { type: 'say', text: '상품 설명처럼 **두세 줄까지 보여 주고** 나머지를 "…"으로 줄이고 싶을 땐 이 네 줄 세트를 써요. 숫자를 바꾸고 싶으면 `-webkit-line-clamp`만 바꾸면 돼요.\n\n`-webkit-`이 붙어 있어서 낯설지만, 지금은 모든 주요 브라우저가 지원해요. 통째로 복사해서 쓰는 코드라고 생각하면 돼요.' },
            { type: 'ask', q: '한 줄 말줄임을 했는데 "…"이 안 나오고 글자가 그냥 다음 줄로 넘어가요. 무엇이 빠졌을까요?', a: '`white-space: nowrap`이에요. 줄바꿈을 막지 않으면 글자가 넘치지 않고 아래 줄로 흘러가서, 잘릴 일 자체가 생기지 않아요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'fe-08-01', type: 'mcq', source: 'font 속성', question: 'font-family 마지막에 sans-serif 같은 "계열"을 넣는 이유는?', choices: ['글자를 굵게 하려고', '앞의 폰트가 모두 없을 때 비슷한 계열로 대체하려고', '웹폰트를 내려받으려고', '자간을 줄이려고'], answer: 1, explanation: 'font-family는 앞에서부터 사용 가능한 폰트를 고르고, 모두 없으면 마지막 계열의 기본 폰트를 써요.' },
    { id: 'fe-08-02', type: 'short', source: 'font 속성', question: 'font-weight: bold 를 숫자로 쓰면?', answer: ['700'], explanation: 'normal = 400, bold = 700.' },
    { id: 'fe-08-03', type: 'ox', source: 'font 속성', question: 'line-height는 단위 없이(1.6) 쓰는 것이 상속할 때 안전하다.', answer: true, explanation: '단위 없는 값은 자식이 자기 글자 크기 기준으로 다시 계산해요. px/em으로 쓰면 계산된 고정값이 상속돼서 어긋날 수 있어요.' },
    { id: 'fe-08-04', type: 'short', source: '웹폰트', question: '웹폰트 로딩 전에도 기본 폰트로 글자를 먼저 보여주는 font-display 값은?', answer: ['swap'], explanation: 'font-display: swap — 빈 화면(FOIT) 대신 기본 폰트를 먼저 보여줘요.' },
    { id: 'fe-08-05', type: 'mcq', source: '웹폰트', question: '한글 웹폰트 사용 시 주의할 점으로 거리가 먼 것은?', choices: ['필요한 굵기만 불러오기', 'woff2 형식 권장', '상업적 사용 전 라이선스 확인', '반드시 모든 굵기를 다 불러오기'], answer: 3, explanation: '한글 폰트는 용량이 커서 필요한 굵기만 불러와야 해요.' },
    { id: 'fe-08-06', type: 'short', source: '텍스트 속성', question: '한글이 단어 중간에서 끊기지 않게 하는 속성은? (속성: 값)', answer: ['word-break: keep-all', 'word-break:keep-all'], explanation: 'word-break: keep-all.' },
    { id: 'fe-08-07', type: 'mcq', source: '텍스트 속성', question: '할인 전 가격에 가로줄을 긋는 값은?', choices: ['text-decoration: underline', 'text-decoration: line-through', 'text-transform: strike', 'font-style: line'], answer: 1, explanation: 'line-through = 취소선.' },
    { id: 'fe-08-08', type: 'mcq', source: '말줄임 (...) 처리', question: '한 줄 말줄임에 필요한 세 속성 조합은?', choices: ['white-space: nowrap + overflow: hidden + text-overflow: ellipsis', 'display: block + width: 100% + ellipsis', 'overflow: scroll + text-overflow: clip', 'line-clamp: 1만'], answer: 0, explanation: '줄바꿈 막기 + 넘친 부분 숨기기 + ...표시.' },
    { id: 'fe-08-09', type: 'short', source: '말줄임 (...) 처리', question: '여러 줄 말줄임에서 줄 수를 정하는 속성은?', answer: ['-webkit-line-clamp', 'line-clamp'], explanation: 'display: -webkit-box + -webkit-line-clamp: 2 + -webkit-box-orient: vertical + overflow: hidden.' },
  ],
}

export default topic

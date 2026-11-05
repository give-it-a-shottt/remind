import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-11-1-semantic-html',
  track: 'react',
  group: '11. 품질: 접근성·테스트·성능',
  title: '11-1. 웹 표준과 시맨틱 HTML',
  order: 1101,
  addedAt: '2026-11-06',
  sections: [
    {
      title: '웹 접근성은 누구를 위한 걸까',
      slides: [
        {
          title: '화면을 보지 않고 쓰는 사람들',
          blocks: [
            { type: 'say', text: '드디어 마지막 장이에요! 11장은 공고의 "**웹표준, 웹접근성에 대한 이해 또는 실무 경험**"과, 시니어라면 당연히 묻는 **테스트·성능**이에요.\n\n먼저 접근성이요. **웹 접근성**은 장애가 있든 없든, 어떤 기기를 쓰든 **누구나 웹을 쓸 수 있게** 만드는 거예요.' },
            {
              type: 'table',
              head: ['사용자', '웹을 쓰는 방법'],
              rows: [
                ['시각장애인', '**화면 낭독기**(스크린 리더)가 화면 내용을 소리로 읽어 줌'],
                ['손이 불편한 사람, 파워 유저', '마우스 없이 **키보드만**으로 (Tab, Enter, 화살표)'],
                ['저시력·색각 이상', '확대해서 보거나, 색 대비가 높아야 읽힘'],
                ['전정 장애', '움직이는 애니메이션에 어지러움을 느낌'],
                ['누구나', '햇빛 아래 휴대폰, 팔을 다쳐 한 손만 쓸 때'],
              ],
            },
          ],
        },
        {
          title: '법과 기준도 있어요',
          blocks: [
            { type: 'say', text: '접근성은 "있으면 좋은 것"만이 아니에요. 국제 기준인 **WCAG**(Web Content Accessibility Guidelines)가 있고, 한국에는 이를 바탕으로 한 **KWCAG**(한국형 웹 콘텐츠 접근성 지침)와 관련 법이 있어요. 공공기관·큰 서비스는 접근성 인증을 받기도 해요.' },
            { type: 'say', text: '좋은 소식은, 접근성의 **80%는 HTML을 올바르게 쓰는 것**에서 나온다는 거예요. 이걸 **시맨틱(의미 있는) HTML**이라고 해요. 오늘 수업이 그거예요.' },
          ],
        },
      ],
    },
    {
      title: 'div에 onClick을 달면',
      slides: [
        {
          title: '보이기엔 똑같은 버튼',
          blocks: [
            {
              type: 'code',
              code: `// ❌ 보이기엔 버튼인데…
<div className="btn" onClick={save}>저장</div>

// ✅ 진짜 버튼
<button type="button" className="btn" onClick={save}>저장</button>`,
            },
            { type: 'ask', q: '마우스로 누르면 둘 다 똑같이 동작해요. div 버전은 누구에게 문제일까요?', a: '• **키보드 사용자**: Tab 키로 이동해도 div에는 **포커스가 안 가요.** Enter·Space를 눌러도 안 눌려요\n• **화면 낭독기 사용자**: 그냥 "저장"이라는 **글자**로 읽혀요. 누를 수 있는 버튼인지 몰라요\n<button>은 이걸 전부 **공짜로** 해 줘요. 포커스, 키보드 동작, "저장, 버튼"이라고 읽어 주기까지.' },
            { type: 'note', tone: 'tip', text: '규칙: **누르면 뭔가 일어나면 `<button>`, 다른 주소로 이동하면 `<a href>`(또는 Link)**. "이동"인데 button에 navigate를 달거나, "동작"인데 a를 쓰는 것도 흔한 실수예요.' },
          ],
        },
      ],
    },
    {
      title: '시맨틱 태그와 랜드마크',
      slides: [
        {
          title: 'div 대신 의미 있는 태그',
          blocks: [
            {
              type: 'table',
              head: ['태그', '뜻'],
              rows: [
                ['`<header>`, `<footer>`', '머리말·꼬리말'],
                ['`<nav>`', '내비게이션 (메뉴)'],
                ['`<main>`', '페이지의 핵심 내용 (페이지에 **하나**)'],
                ['`<article>`', '따로 떼어도 말이 되는 독립 콘텐츠 (글, 카드)'],
                ['`<section>`', '제목이 있는 내용 묶음'],
                ['`<aside>`', '곁가지 정보 (사이드바, 팁 박스)'],
              ],
            },
            { type: 'say', text: '화면 낭독기 사용자는 이 태그들을 **랜드마크**(지표)로 써서 "메인 내용으로 바로 가기", "메뉴로 가기"처럼 페이지를 건너다녀요. 전부 div면 처음부터 끝까지 다 들어야 해요.' },
            { type: 'note', tone: 'tip', text: '지금 이 수업 카드도 `<article>` 안에 있고, 비유·팁 박스는 `<aside>`예요. 화면 맨 위 헤더는 `<header>`, 내용은 `<main>`이고요.' },
          ],
        },
        {
          title: '제목 순서',
          blocks: [
            { type: 'code', code: `<h1>강의 상세</h1>          // 페이지 제목 — 하나
  <h2>커리큘럼</h2>
    <h3>1장. 시작하기</h3>
  <h2>수강평</h2>

// ❌ 글자 크기 때문에 h1 → h4로 건너뛰거나, 제목인데 <div className="title">` },
            { type: 'say', text: '화면 낭독기 사용자는 **제목 목록**을 띄워서 목차처럼 훑어봐요. 그래서 h1~h6은 **글자 크기가 아니라 구조**로 골라요. 크기는 CSS로 바꾸면 돼요. 3-3에서 "이 앱은 Tailwind의 `text-15` 같은 클래스로 크기를 정한다"고 했죠? 태그(구조)와 크기(모양)를 따로 정하는 거예요.' },
          ],
        },
      ],
    },
    {
      title: '폼과 이미지',
      slides: [
        {
          title: 'label과 alt',
          blocks: [
            {
              type: 'code',
              code: `// ❌ placeholder만 — 글자를 치면 사라지고, 낭독기가 뭘 입력하는 칸인지 모름
<input placeholder="이메일" />

// ✅ label로 연결
<label htmlFor="email">이메일</label>
<input id="email" type="email" />

// 이미지
<img src="/hero.png" alt="노트북 앞에서 강의를 듣는 학생" />   // 의미 있는 그림
<img src="/divider.svg" alt="" />                               // 꾸밈용 → 빈 alt로 "읽지 마"`,
            },
            {
              type: 'list',
              items: [
                '`<label htmlFor>`(2-4: HTML의 for)로 입력칸과 연결하면, 낭독기가 "이메일, 입력칸"이라고 읽고 **label을 눌러도 칸에 포커스**가 가요',
                '`type="email"`이면 휴대폰에서 @가 있는 키보드가 떠요. 이것도 시맨틱이에요',
                '`alt`는 **그림이 안 보이는 사람에게 전할 말**이에요. 꾸밈용 그림은 `alt=""`로 건너뛰게 해요',
              ],
            },
          ],
        },
        {
          title: '<html lang="ko">',
          blocks: [
            { type: 'say', text: '아주 작지만 중요한 것 하나. `index.html`(Next.js면 `app/layout.tsx`)의 `<html lang="ko">`예요. 낭독기는 이 값을 보고 **어떤 언어 발음으로 읽을지** 정해요. `lang="en"`인데 한국어 내용이면 영어 발음으로 읽어서 알아들을 수 없어요.' },
            { type: 'say', text: '정리: 시맨틱 HTML은 **접근성, SEO(검색 엔진도 구조를 읽어요), 유지보수**를 한 번에 좋게 해요. 다음 수업에서는 HTML만으로는 부족한 부분, **키보드와 ARIA**를 배워요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're11-1-q1',
      source: '웹 접근성은 누구를 위한 걸까',
      type: 'mcq',
      question: '웹 접근성의 국제 기준 이름은?',
      choices: ['WCAG', 'W3C-CSS', 'HTTP/3', 'ECMAScript'],
      answer: 0,
      explanation: 'WCAG(Web Content Accessibility Guidelines)가 국제 기준이고, 한국은 이를 바탕으로 한 KWCAG가 있어요.',
    },
    {
      id: 're11-1-q2',
      source: 'div에 onClick을 달면',
      type: 'mcq',
      question: '<div onClick={save}>저장</div> 의 접근성 문제로 옳은 것은?',
      choices: ['색이 안 보인다', 'Tab으로 포커스가 안 가고 Enter로 안 눌리며, 낭독기가 버튼인지 모른다', '마우스로 안 눌린다', '문제 없다'],
      answer: 1,
      explanation: '<button>은 포커스·키보드 동작·역할 안내를 기본으로 해 줘요. 누르면 동작하는 건 button이에요.',
    },
    {
      id: 're11-1-q3',
      source: 'div에 onClick을 달면',
      type: 'ox',
      question: '다른 페이지로 이동하는 메뉴는 <button onClick={() => navigate(...)}> 보다 <a href> 또는 Link가 알맞다.',
      answer: true,
      explanation: '이동은 링크, 동작은 버튼이에요. 링크여야 새 탭 열기·주소 복사도 되고 낭독기도 "링크"로 알려 줘요.',
    },
    {
      id: 're11-1-q4',
      source: '시맨틱 태그와 랜드마크',
      type: 'mcq',
      question: '페이지의 핵심 내용을 감싸며 페이지에 하나만 두는 태그는?',
      choices: ['<section>', '<main>', '<div>', '<aside>'],
      answer: 1,
      explanation: '<main>은 랜드마크라 낭독기 사용자가 "메인으로 바로 가기"를 할 수 있어요.',
    },
    {
      id: 're11-1-q5',
      source: '시맨틱 태그와 랜드마크',
      type: 'ox',
      question: 'h1~h6은 원하는 글자 크기에 맞춰 고르면 된다.',
      answer: false,
      explanation: '제목 태그는 구조(목차)로 골라요. 낭독기 사용자가 제목 목록으로 페이지를 훑어요. 크기는 CSS로 바꿔요.',
    },
    {
      id: 're11-1-q6',
      source: '폼과 이미지',
      type: 'mcq',
      question: '페이지를 꾸미는 장식용 구분선 이미지의 alt로 알맞은 것은?',
      choices: ['alt를 아예 안 쓴다', 'alt="" (빈 값)', 'alt="이미지"', 'alt="divider.svg"'],
      answer: 1,
      explanation: '빈 alt는 "읽지 않아도 되는 그림"이라는 뜻이에요. alt가 없으면 낭독기가 파일 이름을 읽기도 해요.',
    },
    {
      id: 're11-1-q7',
      source: '폼과 이미지',
      type: 'short',
      question: '화면 낭독기가 한국어 발음으로 읽게 하려면 <html> 태그에 무엇을 써야 할까? (예: lang="__")',
      answer: ['ko', 'lang="ko"', 'lang=ko'],
      explanation: 'lang 값으로 읽을 언어를 정해요. 틀리면 엉뚱한 발음으로 읽어요.',
    },
  ],
}

export default topic

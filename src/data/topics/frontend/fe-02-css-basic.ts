import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-02-css-basic',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '2강 - CSS 기본',
  order: 2,
  notionId: '3efdf951bf8081a6842be9808974569b',
  sections: [
    { title: 'CSS 문법', points: ['선택자로 대상을 고르고, 중괄호 안에 속성: 값;', '주석은 /* 주석 */'], code: `.price {
  color: tomato;
  font-size: 20px;
}` },
    { title: 'CSS 적용 방법', points: ['인라인: 태그의 style 속성 (재사용 불가, 우선순위 매우 높음)', '내부: head 안 <style>', '외부: <link rel="stylesheet"> 로 별도 파일 연결 (가장 권장 — 여러 페이지가 공유, 관리 편함)'] },
    { title: '색상 표현', points: ['이름: red, tomato, skyblue', 'HEX: #ff6347, 줄여서 #f63', 'RGB / RGBA: rgba(0, 0, 0, 0.5) — 마지막은 투명도 0~1', 'HSL: hsl(9, 100%, 64%) — 색상, 채도, 밝기', '포토샵·피그마의 HEX 값을 그대로 쓸 수 있음'] },
    { title: 'Cascading: 어떤 스타일이 이기나?', points: ['1. 중요도: !important (최대한 쓰지 말기)', '2. 명시도: 인라인 > id > class·속성·가상클래스 > 태그', '3. 순서: 명시도가 같으면 나중에 쓴 것이 이김', '개발자 도구에서 취소선 그어진 속성 = 어떤 규칙에 졌는지'], code: `p { color: black; }
.notice { color: blue; }  /* class > 태그 */
#top { color: green; }    /* id가 더 높음 */` },
    { title: '브라우저 기본 스타일', points: ['브라우저마다 h1 크기, body 여백, 목록 점 등 기본 스타일이 있음', '그래서 작업 전에 리셋하는 경우가 많음 (reset.css, normalize.css)'], code: `* { margin: 0; padding: 0; box-sizing: border-box; }
ul { list-style: none; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }` },
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

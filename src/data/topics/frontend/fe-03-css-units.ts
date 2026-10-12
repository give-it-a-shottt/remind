import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-03-css-units',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '3강 - CSS 단위',
  order: 3,
  notionId: '3efdf951bf808174a291c8dac33febca',
  sections: [
    { title: 'px', points: ['화면의 점 하나 기준, 크기가 고정', '테두리 두께, 아이콘처럼 변하지 않아야 하는 것에 적합'] },
    { title: '%', points: ['부모 요소 기준', '높이를 %로 주려면 부모에 높이가 정해져 있어야 함'], code: `.wrap { width: 800px; }
.wrap .box { width: 50%; }  /* 400px */` },
    { title: 'em', points: ['자기(또는 부모)의 font-size 기준', '중첩되면 계속 곱해져서 계산이 복잡해질 수 있음'], code: `.card { font-size: 20px; }
.card p { font-size: 0.8em; padding: 1em; } /* 16px, padding 16px */` },
    { title: 'rem', points: ['html(루트)의 font-size 기준 (브라우저 기본 16px)', '중첩돼도 항상 같은 기준이라 예측하기 쉬움', '사용자가 브라우저 글자 크기를 키우면 같이 커져서 접근성에 유리'], code: `h2 { font-size: 1.5rem; }    /* 24px */
.section { padding: 2rem; }  /* 32px */` },
    { title: 'vw, vh', points: ['뷰포트 기준: 100vw = 화면 너비, 100vh = 화면 높이', '모바일 주소창 때문에 100vh가 넘칠 수 있어 100dvh를 쓰기도 함', 'vmin, vmax: 너비·높이 중 작은 / 큰 쪽 기준'], code: '.hero { height: 100vh; }' },
    { title: '어떤 단위를 쓸까?', points: ['글자 크기: rem', '여백: rem 또는 em (글자 크기에 맞춰 늘릴 땐 em)', '레이아웃 너비: %, max-width', '테두리: px / 전체 화면 섹션: vh'] },
    { title: '함께 쓰면 좋은 함수', points: ['min(a, b): 둘 중 작은 값', 'clamp(최소, 기본, 최대): 화면 크기에 따라 부드럽게', 'calc(): 단위 섞어서 계산', '시안 px → rem 변환은 px ÷ 16'], code: `.container { width: min(90%, 1200px); }
.title { font-size: clamp(1.5rem, 4vw, 3rem); }
.sidebar { width: calc(100% - 240px); }` },
  ],
  questions: [
    { id: 'fe-03-01', type: 'mcq', source: 'px', question: 'px 단위가 가장 적합한 곳은?', choices: ['본문 글자 크기', '테두리 두께', '전체 화면 섹션 높이', '레이아웃 너비'], answer: 1, explanation: 'px는 고정 크기라 변하지 않아야 하는 테두리·아이콘에 적합해요.' },
    { id: 'fe-03-02', type: 'short', source: '%', question: '부모 width가 800px일 때 자식 width: 50%는 몇 px? (숫자만)', answer: ['400', '400px'], explanation: '%는 부모 요소 기준 → 800 × 0.5 = 400px.' },
    { id: 'fe-03-03', type: 'ox', source: '%', question: 'height를 %로 주면 부모 높이와 상관없이 항상 적용된다.', answer: false, explanation: '부모에 높이가 정해져 있어야 % 높이가 계산돼요.' },
    { id: 'fe-03-04', type: 'short', source: 'em', question: '.card { font-size: 20px } 안의 p에 font-size: 0.8em 이면 몇 px? (숫자만)', answer: ['16', '16px'], explanation: 'em은 부모 font-size 기준 → 20 × 0.8 = 16px.' },
    { id: 'fe-03-05', type: 'ox', source: 'em', question: 'em은 중첩될수록 값이 곱해져 계산이 복잡해질 수 있다.', answer: true, explanation: '부모의 em 값이 다시 기준이 되기 때문이에요.' },
    { id: 'fe-03-06', type: 'mcq', source: 'rem', question: 'rem 단위의 기준이 되는 것은?', choices: ['화면 너비', '부모 요소의 font-size', 'html(루트)의 font-size', '브라우저 창 높이'], answer: 2, choiceExplanations: ['화면 너비 기준은 vw예요.', '부모(자기) font-size 기준은 em이라 중첩되면 곱해져요.', '정답. 루트(html) 기준이라 중첩돼도 항상 같아요.', '창 높이 기준은 vh예요.'], explanation: 'rem(root em)은 html의 font-size가 기준이에요. 부모 font-size가 기준인 건 em이에요.' },
    { id: 'fe-03-07', type: 'short', source: 'rem', question: '브라우저 기본 font-size 기준으로 1.5rem은 몇 px? (숫자만)', answer: ['24', '24px'], explanation: '16 × 1.5 = 24px.' },
    { id: 'fe-03-08', type: 'essay', source: 'rem', question: 'rem이 em보다 크기를 예측하기 쉬운 이유와, 접근성에 유리한 이유를 설명하세요.', answer: 'rem은 항상 루트(html)의 font-size 하나만 기준으로 해서 요소가 몇 번 중첩되어도 1rem은 같은 크기예요. em은 부모 font-size 기준이라 중첩될수록 값이 곱해져요. 또 사용자가 브라우저 글자 크기를 키우면 루트 크기가 바뀌어 rem으로 만든 크기도 같이 커져서 접근성에 유리해요.', keywords: ['루트 기준', '중첩', '브라우저 글자 크기'], explanation: '글자 크기는 rem이 일반적인 기준이에요.' },
    { id: 'fe-03-09', type: 'mcq', source: 'vw, vh', question: '모바일에서 100vh가 화면을 넘칠 때 대안으로 쓰는 단위는?', choices: ['100%', '100dvh', '100vmax', '100rem'], answer: 1, explanation: '주소창 높이 때문에 100vh가 넘칠 수 있어, 실제 보이는 높이 기준인 dvh를 써요.' },
    { id: 'fe-03-10', type: 'ox', source: 'vw, vh', question: 'vmin은 화면 너비와 높이 중 작은 쪽 기준이다.', answer: true, explanation: 'vmin = 작은 쪽, vmax = 큰 쪽 기준.' },
    { id: 'fe-03-11', type: 'mcq', source: '어떤 단위를 쓸까?', question: '일반적인 단위 선택 기준으로 어색한 것은?', choices: ['글자 크기 → rem', '테두리 → px', '레이아웃 너비 → %, max-width', '테두리 두께 → vh'], answer: 3, explanation: '테두리는 고정 px. vh는 전체 화면 섹션처럼 화면 높이에 맞출 때 써요.' },
    { id: 'fe-03-12', type: 'mcq', source: '함께 쓰면 좋은 함수', question: 'font-size: clamp(1.5rem, 4vw, 3rem) 의 의미는?', choices: ['항상 4vw', '최소 1.5rem, 기본 4vw, 최대 3rem', '1.5rem과 3rem의 평균', '4vw보다 작아지지 않음'], answer: 1, explanation: 'clamp(최소, 기본, 최대): 4vw로 커지고 작아지되 1.5rem~3rem 사이로 제한해요.' },
    { id: 'fe-03-13', type: 'short', source: '함께 쓰면 좋은 함수', question: '피그마 시안의 32px을 rem으로 바꾸면? (기본 16px 기준, 숫자+rem)', answer: ['2rem'], explanation: 'px ÷ 16 = rem → 32 ÷ 16 = 2rem.' },
    { id: 'fe-03-14', type: 'mcq', source: '함께 쓰면 좋은 함수', question: '"화면의 90%이되 최대 1200px"을 한 줄로 쓰는 방법은?', choices: ['width: max(90%, 1200px)', 'width: min(90%, 1200px)', 'width: calc(90% + 1200px)', 'width: clamp(90%, 1200px)'], answer: 1, explanation: 'min()은 둘 중 작은 값 → 넓은 화면에선 1200px, 좁은 화면에선 90%.' },
  ],
}

export default topic

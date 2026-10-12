import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-11-animation',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '11강 - animation',
  order: 11,
  notionId: '3efdf951bf80818b979bf501cc09f2f5',
  sections: [
    { title: 'transition vs animation', points: ['transition: 상태 변화가 있어야 실행, 시작→끝 두 지점', 'animation: 페이지가 열리면 자동 실행 가능, 중간 단계 여러 개, 반복 가능'] },
    { title: '@keyframes', points: ['0%~100% 구간별 상태 정의 (from = 0%, to = 100%)'], code: `@keyframes float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}` },
    { title: 'animation 속성', points: ['name, duration, timing-function, delay', 'iteration-count: 숫자 또는 infinite', 'direction: normal / reverse / alternate(왕복)', 'fill-mode: forwards(끝난 상태 유지)', 'play-state: running / paused', '단축: animation: float 2s ease-in-out infinite;'] },
    { title: '예제 1: 로딩 스피너', points: ['border-top-color만 다르게 + rotate 360deg 무한 반복 (linear)'], code: `@keyframes spin { to { transform: rotate(360deg); } }
.spinner { border: 4px solid #eee; border-top-color: tomato; border-radius: 50%;
  animation: spin .8s linear infinite; }` },
    { title: '예제 2: 등장 효과', points: ['forwards가 없으면 끝난 뒤 원래 상태(투명)로 돌아갈 수 있음', 'both: 딜레이 동안 시작 상태 유지 + 끝난 뒤 끝 상태 유지'], code: `.hero-desc { animation: fadeUp .8s ease-out .2s both; }` },
    { title: '예제 3: hover 하면 멈추기', points: ['.banner:hover { animation-play-state: paused; }'] },
    { title: '접근성', points: ['운영체제 "동작 줄이기" 설정 존중: @media (prefers-reduced-motion: reduce)'] },
  ],
  questions: [
    { id: 'fe-11-01', type: 'mcq', source: 'transition vs animation', question: 'animation이 transition과 다른 점은?', choices: ['상태 변화가 있어야만 실행된다', '중간 단계를 여러 개 두고 자동·반복 실행할 수 있다', '두 지점만 연결한다', 'hover에서만 동작한다'], answer: 1, explanation: 'animation은 @keyframes로 여러 단계를 정의하고 페이지 로드 시 자동·반복 실행이 가능해요.' },
    { id: 'fe-11-02', type: 'ox', source: '@keyframes', question: '@keyframes에서 from은 0%, to는 100%와 같다.', answer: true, explanation: 'from/to는 0%/100%의 별칭이에요.' },
    { id: 'fe-11-03', type: 'mcq', source: 'animation 속성', question: '애니메이션을 왕복(갔다가 돌아오기)으로 반복하는 direction 값은?', choices: ['normal', 'reverse', 'alternate', 'forwards'], answer: 2, explanation: 'alternate = 왕복.' },
    { id: 'fe-11-04', type: 'short', source: 'animation 속성', question: '애니메이션을 무한 반복하는 iteration-count 값은?', answer: ['infinite'], explanation: 'animation-iteration-count: infinite.' },
    { id: 'fe-11-05', type: 'mcq', source: '예제 1: 로딩 스피너', question: '로딩 스피너 회전에 어울리는 타이밍 함수는?', choices: ['ease', 'ease-in-out', 'linear', 'steps(1)'], answer: 2, explanation: '회전은 일정한 속도(linear)여야 끊김 없이 돌아가요.' },
    { id: 'fe-11-06', type: 'mcq', source: '예제 2: 등장 효과', question: 'fadeUp(투명→보임) 애니메이션이 끝난 뒤 다시 투명해지는 문제를 막는 속성값은?', choices: ['animation-direction: reverse', 'animation-fill-mode: forwards', 'animation-play-state: paused', 'animation-delay: 0'], answer: 1, explanation: 'forwards는 끝난 상태(to)를 유지해요.' },
    { id: 'fe-11-07', type: 'essay', source: '예제 2: 등장 효과', question: 'animation-fill-mode의 forwards와 both의 차이를 딜레이가 있는 등장 효과를 예로 설명하세요.', answer: 'forwards는 애니메이션이 끝난 뒤 마지막 상태를 유지할 뿐, 딜레이 동안에는 원래 상태(보이는 상태)로 있다가 시작할 때 갑자기 투명해진다. both는 딜레이 동안에도 시작 상태(from, 투명)를 유지하고 끝난 뒤에도 끝 상태를 유지해서 깜빡임 없이 자연스럽게 등장한다.', keywords: ['딜레이', '시작 상태', '끝 상태'], explanation: 'both = backwards(딜레이 중 시작 상태) + forwards(끝 상태 유지).' },
    { id: 'fe-11-08', type: 'short', source: '예제 3: hover 하면 멈추기', question: 'hover 시 흐르는 배너를 멈추게 하는 속성: 값은?', answer: ['animation-play-state: paused', 'animation-play-state:paused'], explanation: '.banner:hover { animation-play-state: paused; }' },
    { id: 'fe-11-09', type: 'mcq', source: '접근성', question: '움직임에 민감한 사용자를 위해 애니메이션을 끄는 미디어 쿼리는?', choices: ['@media (prefers-color-scheme: dark)', '@media (prefers-reduced-motion: reduce)', '@media (hover: none)', '@media print'], answer: 1, explanation: 'OS의 "동작 줄이기" 설정을 존중하는 미디어 쿼리예요.' },
  ],
}

export default topic

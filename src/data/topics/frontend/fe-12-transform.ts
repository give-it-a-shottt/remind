import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-12-transform',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '12강 - transform',
  order: 12,
  notionId: '3efdf951bf80814b9b77e438727ede6f',
  sections: [
    { title: 'transform', points: ['요소를 이동·크기 변경·회전·기울이기', '다른 요소의 위치에 영향을 주지 않음 (원래 공간 그대로)', 'transition/animation과 함께 쓰면 부드럽고 성능도 좋음'] },
    { title: '2D 함수', points: ['translate(x, y) — %는 자기 크기 기준', 'scale(1.2), rotate(45deg) 시계 방향, skew(10deg, 0)'] },
    { title: 'transform-origin', points: ['변형의 기준점, 기본값은 가운데 (50% 50%)', 'transform-origin: left center; transform: scaleX(.7) → 왼쪽 기준으로 줄어듦'] },
    { title: '여러 변형 조합', points: ['함수는 오른쪽부터 적용되는 것처럼 동작 → 순서가 바뀌면 결과가 달라짐', '다른 선택자에서 transform을 다시 쓰면 덮어쓰기 (합쳐지지 않음)', '최신 CSS는 translate, scale, rotate 개별 속성으로 덮어쓰기 문제를 피할 수 있음'] },
    { title: '3D: 카드 뒤집기', points: ['부모에 perspective(원근감)', 'transform-style: preserve-3d', 'backface-visibility: hidden으로 뒷면 숨기기', 'rotateY(180deg)로 뒤집기'] },
    { title: '자주 쓰는 곳', points: ['hover 시 살짝 떠오르기: translateY(-4px)', '아코디언 화살표 회전: rotate(180deg)', '정중앙 정렬: translate(-50%, -50%)'] },
  ],
  questions: [
    { id: 'fe-12-01', type: 'ox', source: 'transform', question: 'transform으로 이동한 요소는 주변 요소들의 위치를 밀어낸다.', answer: false, explanation: 'transform은 원래 공간을 그대로 두고 그려지는 위치만 바꿔서 다른 요소에 영향을 주지 않아요.' },
    { id: 'fe-12-02', type: 'mcq', source: '2D 함수', question: 'translate(-50%, -50%) 에서 %의 기준은?', choices: ['부모 크기', '화면 크기', '자기 자신의 크기', 'html font-size'], answer: 2, explanation: 'transform의 translate %는 자기 크기 기준이라 정중앙 정렬에 쓰여요.' },
    { id: 'fe-12-03', type: 'short', source: '2D 함수', question: '요소를 1.2배 키우는 transform 함수는? (함수(값) 형태)', answer: ['scale(1.2)'], explanation: 'scale(1.2). 가로만은 scaleX, 세로만은 scaleY.' },
    { id: 'fe-12-04', type: 'mcq', source: 'transform-origin', question: '게이지 바가 왼쪽을 기준으로 줄어들게 하려면?', choices: ['transform-origin: right', 'transform-origin: left center + scaleX', 'transform: translateX(-100%)', 'origin: start'], answer: 1, explanation: '기준점(transform-origin)을 왼쪽으로 옮기고 scaleX로 줄여요. 기본값은 가운데.' },
    { id: 'fe-12-05', type: 'ox', source: '여러 변형 조합', question: 'transform: translateX(10px) rotate(15deg) 와 rotate(15deg) translateX(10px) 는 결과가 같다.', answer: false, explanation: '함수 순서에 따라 좌표계가 달라져서 결과가 달라져요.' },
    { id: 'fe-12-06', type: 'mcq', source: '여러 변형 조합', question: '.btn { transform: translateY(-2px) } 에 .btn.big { transform: scale(1.1) } 를 추가하면 .btn.big은?', choices: ['위로 이동 + 확대', '확대만 (translateY는 덮어써짐)', '이동만', '에러'], answer: 1, explanation: 'transform은 합쳐지지 않고 덮어쓰기. 개별 속성(translate, scale)을 쓰면 피할 수 있어요.' },
    { id: 'fe-12-07', type: 'mcq', source: '3D: 카드 뒤집기', question: '카드를 뒤집었을 때 앞면의 뒷모습이 비치지 않게 하는 속성은?', choices: ['perspective', 'transform-style: preserve-3d', 'backface-visibility: hidden', 'overflow: hidden'], answer: 2, explanation: 'backface-visibility: hidden — 뒷면이 보일 때 숨김.' },
    { id: 'fe-12-08', type: 'short', source: '3D: 카드 뒤집기', question: '3D 변형에 원근감을 주기 위해 부모에 주는 속성은?', answer: ['perspective'], explanation: '.flip { perspective: 800px; } — 값이 작을수록 원근감이 강해요.' },
    { id: 'fe-12-09', type: 'mcq', source: '자주 쓰는 곳', question: '아코디언이 열릴 때 아래 화살표를 위로 뒤집는 값은?', choices: ['rotate(90deg)', 'rotate(180deg)', 'scale(-1)', 'skew(180deg)'], answer: 1, explanation: 'rotate(180deg)로 화살표를 뒤집어요.' },
  ],
}

export default topic

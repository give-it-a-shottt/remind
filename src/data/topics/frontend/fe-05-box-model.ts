import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-05-box-model',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '5강 - 박스 모델',
  order: 5,
  notionId: '3efdf951bf8081848e84d87dfb89d8e3',
  sections: [
    { title: '모든 요소는 상자다', points: ['안에서 밖으로: content → padding → border → margin', 'padding: 내용과 테두리 사이 안쪽 여백 (배경색이 칠해짐)', 'margin: 다른 요소와의 바깥 여백 (투명)'] },
    { title: '단축 속성', points: ['시계 방향: 위 → 오른쪽 → 아래 → 왼쪽', 'margin: 10px 20px → 위아래 10, 좌우 20', 'margin: 10px 20px 30px → 위 10, 좌우 20, 아래 30', 'border: 1px solid #333 → 두께, 스타일, 색'] },
    { title: 'box-sizing', points: ['기본 content-box: width는 내용만', 'border-box: width에 padding·border 포함 → 계산이 편해서 대부분 프로젝트가 처음에 설정'], code: `*, *::before, *::after { box-sizing: border-box; }` },
    { title: 'margin 상쇄', points: ['세로로 만나는 위아래 margin은 더해지지 않고 큰 쪽 하나만 적용', '부모와 첫 자식의 margin-top도 겹칠 수 있음 → 부모에 padding·border 또는 flex/grid', '좌우 margin은 상쇄되지 않음'] },
    { title: '가운데 정렬', points: ['max-width + margin: 0 auto → 블록 요소 가로 가운데 (너비가 있어야 함)'], code: `.container { max-width: 1200px; margin: 0 auto; }` },
    { title: 'overflow', points: ['visible(기본, 밖으로 비짐) / hidden(잘라냄) / scroll(항상 스크롤바) / auto(넘칠 때만)'] },
    { title: '기타 박스 속성', points: ['border-radius: 둥근 모서리 (50%면 원)', 'box-shadow: x y 흐림 색', 'min-height, max-width'] },
    { title: '디버깅 팁', points: ['개발자 도구 Computed 탭의 박스 모델 그림으로 여백 확인', '레이아웃이 이상하면 임시로 * { outline: 1px solid red; }'] },
  ],
  questions: [
    { id: 'fe-05-01', type: 'mcq', source: '모든 요소는 상자다', question: '박스 모델을 안쪽부터 바깥쪽 순서로 나열한 것은?', choices: ['margin → border → padding → content', 'content → padding → border → margin', 'content → border → padding → margin', 'padding → content → margin → border'], answer: 1, explanation: 'content → padding → border → margin.' },
    { id: 'fe-05-02', type: 'ox', source: '모든 요소는 상자다', question: 'margin 영역에는 요소의 배경색이 칠해진다.', answer: false, explanation: '배경색은 padding까지 칠해지고, margin은 투명한 바깥 여백이에요.' },
    { id: 'fe-05-03', type: 'mcq', source: '단축 속성', question: 'margin: 10px 20px 30px; 의 의미는?', choices: ['위 10, 오른쪽 20, 아래 30, 왼쪽 0', '위 10, 좌우 20, 아래 30', '위아래 10, 좌우 20, 전체 30', '위 30, 좌우 20, 아래 10'], answer: 1, explanation: '값이 3개면 위 / 좌우 / 아래.' },
    { id: 'fe-05-04', type: 'short', source: '단축 속성', question: '4개 값을 쓰는 margin 단축 속성의 방향 순서는? (예: 위 오른쪽 ...)', answer: ['위 오른쪽 아래 왼쪽', '위오른쪽아래왼쪽', '위, 오른쪽, 아래, 왼쪽', 'top right bottom left'], explanation: '시계 방향: 위 → 오른쪽 → 아래 → 왼쪽.' },
    { id: 'fe-05-05', type: 'short', source: 'box-sizing', question: 'width: 300px; padding: 20px; border: 2px; 인 content-box 요소의 실제 너비는? (숫자만)', answer: ['344', '344px'], explanation: '300 + 20×2 + 2×2 = 344px. border-box라면 300px.' },
    { id: 'fe-05-06', type: 'mcq', source: 'box-sizing', question: 'box-sizing: border-box 의 효과는?', choices: ['width가 내용 영역만 뜻함', 'width에 padding과 border까지 포함', 'margin까지 포함', '테두리가 사라짐'], answer: 1, explanation: '지정한 width가 실제 보이는 너비가 되어 계산이 편해요.' },
    { id: 'fe-05-07', type: 'short', source: 'margin 상쇄', question: '.a { margin-bottom: 30px } 다음 .b { margin-top: 20px } 일 때 두 상자 사이 간격은? (숫자만)', answer: ['30', '30px'], explanation: '세로 margin은 상쇄되어 큰 쪽(30px)만 적용돼요.' },
    { id: 'fe-05-08', type: 'ox', source: 'margin 상쇄', question: '좌우 margin도 상쇄된다.', answer: false, explanation: '상쇄는 세로(위아래) margin에서만 일어나요.' },
    { id: 'fe-05-09', type: 'mcq', source: '가운데 정렬', question: '블록 요소를 가로 가운데 정렬하는 방법은?', choices: ['text-align: center', 'margin: 0 auto (너비 지정 필요)', 'vertical-align: middle', 'float: center'], answer: 1, explanation: '너비가 있는 블록 요소에 margin: 0 auto. text-align은 안의 인라인 콘텐츠 정렬.' },
    { id: 'fe-05-10', type: 'mcq', source: 'overflow', question: '내용이 넘칠 때만 스크롤바가 생기는 overflow 값은?', choices: ['visible', 'hidden', 'scroll', 'auto'], answer: 3, explanation: 'scroll은 항상 스크롤바, auto는 넘칠 때만.' },
    { id: 'fe-05-11', type: 'short', source: '기타 박스 속성', question: '정사각형 요소를 원으로 만드는 border-radius 값은?', answer: ['50%'], explanation: 'border-radius: 50%.' },
    { id: 'fe-05-12', type: 'ox', source: '디버깅 팁', question: '* { outline: 1px solid red; } 는 레이아웃을 바꾸지 않고 모든 요소의 경계를 보여준다.', answer: true, explanation: 'outline은 박스 크기에 영향을 주지 않아서 디버깅용으로 좋아요 (border는 크기가 바뀜).' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-13-float',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '13강 - float',
  order: 13,
  notionId: '3efdf951bf808113b2d3feb8e3c3c4b7',
  sections: [
    { title: 'float', points: ['요소를 왼쪽/오른쪽으로 띄우고 글자가 그 주위를 감싸게 함', '원래 목적: 신문·잡지처럼 사진 옆에 글이 흐르는 배치', '과거엔 flex가 없어 메뉴·단 나누기 레이아웃에도 썼음 → 오래된 코드에 많음'] },
    { title: '문제: 부모 높이가 사라짐', points: ['float된 자식은 흐름에서 빠져서 자식이 모두 float이면 부모 높이가 0', '부모 배경색이 안 보이거나 아래 요소가 끌려 올라옴'] },
    { title: '해결 1: clear', points: ['clear: both → float 아래로 내려가기 (left, right, both)'] },
    { title: '해결 2: clearfix', points: ['부모의 ::after에 content: ""; display: block; clear: both;'] },
    { title: '해결 3: BFC (flow-root)', points: ['부모에 display: flow-root → 최신 방식, 가장 깔끔', '예전 방식 overflow: hidden은 내용이 잘릴 수 있음'] },
    { title: '요즘은?', points: ['가로 배치·단 나누기는 flex, grid', 'float은 이미지 옆 텍스트 감싸기 원래 용도로만', '유지보수할 기존 코드에 많아서 개념은 알아야 함'] },
  ],
  questions: [
    { id: 'fe-13-01', type: 'mcq', source: 'float', question: 'float의 원래 목적은?', choices: ['페이지 전체 레이아웃', '사진 옆으로 글이 흐르게 감싸기', '요소 숨기기', '화면 고정'], answer: 1, explanation: '신문·잡지 같은 텍스트 감싸기가 원래 용도예요.' },
    { id: 'fe-13-02', type: 'ox', source: '문제: 부모 높이가 사라짐', question: '자식이 모두 float이면 부모의 높이가 0이 될 수 있다.', answer: true, explanation: 'float된 자식은 흐름에서 빠져 부모가 높이를 계산하지 못해요.' },
    { id: 'fe-13-03', type: 'short', source: '해결 1: clear', question: '양쪽 float 아래로 내려가게 하는 clear 값은?', answer: ['both'], explanation: 'clear: both.' },
    { id: 'fe-13-04', type: 'mcq', source: '해결 2: clearfix', question: 'clearfix에서 ::after에 꼭 필요한 세 가지는?', choices: ['content: "", display: block, clear: both', 'float: none, height: 0, overflow: hidden', 'position: absolute, clear: left, content: none', 'display: flex, gap: 0, clear: both'], answer: 0, explanation: '빈 내용의 블록 가상 요소가 float 아래로 내려가며 부모 높이를 만들어요.' },
    { id: 'fe-13-05', type: 'short', source: '해결 3: BFC (flow-root)', question: 'float 문제를 해결하는 최신·가장 깔끔한 방법: 부모에 display: ?', answer: ['flow-root'], explanation: 'display: flow-root는 새 블록 서식 맥락(BFC)을 만들어 float 자식을 감싸요.' },
    { id: 'fe-13-06', type: 'ox', source: '해결 3: BFC (flow-root)', question: '부모에 overflow: hidden을 주는 예전 방식은 부작용이 없다.', answer: false, explanation: '넘치는 내용(그림자, 드롭다운 등)이 잘릴 수 있어요.' },
    { id: 'fe-13-07', type: 'mcq', source: '요즘은?', question: '요즘 가로 배치·단 나누기에 쓰는 방법은?', choices: ['float', 'table', 'flex, grid', 'position: absolute'], answer: 2, explanation: 'flex/grid가 표준. float은 텍스트 감싸기 용도로만.' },
  ],
}

export default topic

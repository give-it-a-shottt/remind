import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-16-layout',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '16강 - 레이아웃 (Flexbox & Grid)',
  order: 16,
  notionId: '3efdf951bf808127b78defb3abf27333',
  sections: [
    { title: 'Flexbox', points: ['1차원(가로 또는 세로 한 방향) 배치', '부모(flex container)에 display: flex → 직속 자식(flex item)이 배치됨', '주축(main axis)과 교차축(cross axis) 개념이 핵심'] },
    { title: '컨테이너 속성', points: ['flex-direction: row(기본) / column', 'justify-content: 주축 정렬 (flex-start, center, space-between, space-around, space-evenly)', 'align-items: 교차축 정렬 (stretch 기본, center...)', 'flex-wrap: wrap (기본 nowrap), gap: 아이템 간격', 'column이면 justify-content가 세로, align-items가 가로 정렬'] },
    { title: '아이템 속성', points: ['flex-grow: 남는 공간을 나눠 가지는 비율', 'flex-shrink: 모자랄 때 줄어드는 비율 (0이면 안 줄어듦)', 'flex-basis: 기본 크기 / 단축 flex: 1 1 200px, flex: 1 = 똑같이 나눠 갖기', 'align-self: 이 아이템만 따로 정렬, order: 보이는 순서'] },
    { title: 'flex 패턴', points: ['정중앙: justify-content + align-items: center', '헤더: justify-content: space-between', '사이드바 고정 + 본문: .sidebar { flex: 0 0 240px } .content { flex: 1 }', '카드 버튼 맨 아래: 카드 column + 버튼 margin-top: auto'] },
    { title: 'Grid', points: ['2차원(행과 열 동시) 배치', 'grid-template-columns: repeat(3, 1fr) — fr = 남는 공간 비율', 'grid-column: span 2 → 2칸 차지', 'grid-template-areas로 영역에 이름 붙여 배치'] },
    { title: 'flex vs grid', points: ['flex: 한 줄 정렬 (메뉴, 버튼 묶음, 카드 안 요소)', 'grid: 행·열이 있는 전체 구조 (상품 목록, 갤러리, 페이지 레이아웃)', '섞어 쓰는 게 보통: 페이지는 grid, 카드 안은 flex'] },
    { title: '연습 추천', points: ['Flexbox Froggy, Grid Garden (게임으로 연습)'] },
  ],
  questions: [
    { id: 'fe-16-01', type: 'mcq', source: 'Flexbox', question: 'display: flex를 주면 배치되는 대상은?', choices: ['모든 자손', '직속 자식', '형제 요소', '부모 요소'], answer: 1, explanation: 'flex container의 직속 자식만 flex item이 돼요.' },
    { id: 'fe-16-02', type: 'mcq', source: '컨테이너 속성', question: 'flex-direction: row일 때 justify-content가 정렬하는 방향은?', choices: ['세로', '가로(주축)', '대각선', '정렬하지 않음'], answer: 1, explanation: 'justify-content = 주축, align-items = 교차축. row면 주축이 가로.' },
    { id: 'fe-16-03', type: 'ox', source: '컨테이너 속성', question: 'flex-direction: column이면 justify-content가 세로 정렬을 담당한다.', answer: true, explanation: '주축이 세로가 되므로 justify-content는 세로, align-items는 가로.' },
    { id: 'fe-16-04', type: 'short', source: '컨테이너 속성', question: '로고는 왼쪽, 메뉴는 오른쪽 끝으로 보내는 justify-content 값은?', answer: ['space-between'], explanation: 'space-between — 양 끝에 붙이고 사이를 균등하게.' },
    { id: 'fe-16-05', type: 'mcq', source: '아이템 속성', question: 'flex: 1 의 의미로 가장 가까운 것은?', choices: ['고정 너비 1px', '남는 공간을 똑같이 나눠 갖기', '절대 줄어들지 않기', '순서를 1번으로'], answer: 1, explanation: 'flex: 1 = flex-grow 1, shrink 1, basis 0 → 남는 공간을 균등 분배.' },
    { id: 'fe-16-06', type: 'mcq', source: '아이템 속성', question: '공간이 모자라도 사이드바가 줄어들지 않게 하는 값은?', choices: ['flex-grow: 0', 'flex-shrink: 0', 'flex-basis: 0', 'order: 0'], answer: 1, explanation: 'flex-shrink: 0이면 안 줄어들어요. 그래서 사이드바에 flex: 0 0 240px.' },
    { id: 'fe-16-07', type: 'mcq', source: 'flex 패턴', question: '카드 높이가 제각각일 때 버튼을 항상 맨 아래에 두는 방법은?', choices: ['버튼에 position: fixed', '카드를 flex column으로 + 버튼에 margin-top: auto', '버튼에 float: bottom', '카드에 height: 100vh'], answer: 1, explanation: 'margin-top: auto가 남는 공간을 모두 위쪽 여백으로 가져가요.' },
    { id: 'fe-16-08', type: 'short', source: 'Grid', question: 'Grid에서 "남는 공간의 비율"을 뜻하는 단위는?', answer: ['fr'], explanation: 'grid-template-columns: repeat(3, 1fr) → 3등분.' },
    { id: 'fe-16-09', type: 'mcq', source: 'Grid', question: '그리드 아이템이 가로 2칸을 차지하게 하는 속성은?', choices: ['grid-row: span 2', 'grid-column: span 2', 'flex: 2', 'colspan: 2'], answer: 1, explanation: 'grid-column: span 2.' },
    { id: 'fe-16-10', type: 'essay', source: 'flex vs grid', question: 'flex와 grid를 각각 언제 쓰는지 예를 들어 설명하세요.', answer: 'flex는 1차원(한 방향) 정렬에 적합해서 메뉴, 버튼 묶음, 카드 안 요소 배치처럼 한 줄로 늘어선 것을 정렬할 때 쓴다. grid는 행과 열을 동시에 다루는 2차원 배치라 상품 목록, 갤러리, 페이지 전체 레이아웃에 쓴다. 보통 페이지 골격은 grid, 카드 내부는 flex처럼 섞어 쓴다.', keywords: ['1차원', '2차원', '섞어 쓰기'], explanation: 'flex = 줄, grid = 표.' },
    { id: 'fe-16-11', type: 'ox', source: '연습 추천', question: 'Flexbox Froggy와 Grid Garden은 게임으로 레이아웃을 연습하는 사이트다.', answer: true, explanation: '개구리를 연잎에, 당근밭에 물을 주며 속성을 익혀요.' },
  ],
}

export default topic

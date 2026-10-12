import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-09-position',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '9강 - position',
  order: 9,
  notionId: '3efdf951bf808129b2a8d94874dc21a5',
  sections: [
    { title: 'position 값', points: ['static(기본): 문서 흐름대로, top/left 적용 안 됨', 'relative: 원래 자리 기준 이동, 원래 공간은 그대로', 'absolute: 흐름에서 빠짐, position이 static이 아닌 가장 가까운 조상 기준 (없으면 페이지)', 'fixed: 화면(뷰포트) 기준 고정', 'sticky: 평소엔 relative, 스크롤이 지정 위치에 닿으면 fixed처럼 (부모 안에서만)'] },
    { title: '패턴 1: 카드 모서리 배지', points: ['부모에 relative(기준점), 자식에 absolute → 가장 많이 쓰는 조합'], code: `.card { position: relative; }
.card .badge { position: absolute; top: 12px; right: 12px; }` },
    { title: '패턴 2: 고정 헤더와 플로팅 버튼', points: ['fixed/absolute는 흐름에서 빠져 다른 요소가 그 자리로 올라옴 → body에 padding-top 등으로 보정'], code: `.header { position: fixed; top: 0; left: 0; width: 100%; }
body { padding-top: 64px; }` },
    { title: '패턴 3: 스크롤하면 붙는 메뉴', points: ['position: sticky; top: 0;', '안 되면: 부모의 overflow: hidden 여부, top 값 지정 여부 확인'] },
    { title: '패턴 4: 정중앙 배치', points: ['top: 50%; left: 50%; transform: translate(-50%, -50%) → 자기 크기의 절반만큼 되돌리기', 'inset: 0 = top, right, bottom, left 모두 0 (전체 덮는 배경 막)'] },
    { title: 'z-index: 겹치는 순서', points: ['숫자가 클수록 위, position이 static이 아닌 요소에서만 동작', '부모의 z-index가 낮으면 자식을 아무리 크게 해도 못 넘음 (쌓임 맥락)', '팀 규칙 예: 헤더 100, 드롭다운 200, 모달 1000'] },
  ],
  questions: [
    { id: 'fe-09-01', type: 'ox', source: 'position 값', question: 'position: absolute 요소는 position이 static이 아닌 가장 가까운 조상을 기준으로 배치된다.', answer: true, explanation: '조상 중 relative·absolute·fixed·sticky가 있으면 그 요소, 없으면 페이지(초기 컨테이닝 블록)가 기준이에요.' },
    { id: 'fe-09-02', type: 'mcq', source: 'position 값', question: '원래 자리 기준으로 이동하고, 원래 공간은 그대로 차지하는 값은?', choices: ['static', 'relative', 'absolute', 'fixed'], answer: 1, explanation: 'relative는 흐름에 남아 있어서 원래 공간이 비지 않아요.' },
    { id: 'fe-09-03', type: 'mcq', source: 'position 값', question: '스크롤해도 화면(뷰포트)의 같은 자리에 고정되는 값은?', choices: ['relative', 'absolute', 'fixed', 'static'], answer: 2, explanation: 'fixed는 뷰포트 기준.' },
    { id: 'fe-09-04', type: 'mcq', source: '패턴 1: 카드 모서리 배지', question: '카드 오른쪽 위에 BEST 배지를 붙이는 가장 일반적인 조합은?', choices: ['부모 absolute + 자식 relative', '부모 relative + 자식 absolute', '부모 fixed + 자식 sticky', '부모 static + 자식 fixed'], answer: 1, explanation: '부모가 기준점(relative), 자식이 그 안에서 absolute로 위치.' },
    { id: 'fe-09-05', type: 'essay', source: '패턴 2: 고정 헤더와 플로팅 버튼', question: '고정 헤더(position: fixed)를 만들면 본문 첫 부분이 가려지는 이유와 해결 방법은?', answer: 'fixed 요소는 문서 흐름에서 빠져서 공간을 차지하지 않으므로 아래 콘텐츠가 그 자리로 올라와 헤더 밑에 깔린다. body(또는 본문)에 헤더 높이만큼 padding-top을 주거나, sticky를 쓰는 방법으로 해결한다.', keywords: ['문서 흐름', 'padding-top'], explanation: 'fixed/absolute는 흐름에서 빠진다 → 여백으로 보정.' },
    { id: 'fe-09-06', type: 'mcq', source: '패턴 3: 스크롤하면 붙는 메뉴', question: 'position: sticky가 동작하지 않을 때 먼저 확인할 것은?', choices: ['z-index 값', '부모의 overflow: hidden과 top 지정 여부', 'display: flex 여부', 'font-size'], answer: 1, explanation: 'sticky는 top 같은 기준 값이 필요하고, 부모에 overflow: hidden이 있으면 붙지 않아요.' },
    { id: 'fe-09-07', type: 'short', source: '패턴 4: 정중앙 배치', question: 'top: 50%; left: 50%; 다음에 자기 크기의 절반만큼 되돌리는 transform 값은?', answer: ['translate(-50%, -50%)', 'translate(-50%,-50%)'], explanation: 'transform: translate(-50%, -50%) — %는 자기 크기 기준.' },
    { id: 'fe-09-08', type: 'ox', source: '패턴 4: 정중앙 배치', question: 'inset: 0 은 top, right, bottom, left를 모두 0으로 준 것과 같다.', answer: true, explanation: '화면 전체를 덮는 배경 막에 유용해요.' },
    { id: 'fe-09-09', type: 'ox', source: 'z-index: 겹치는 순서', question: 'z-index는 position: static 요소에도 동작한다.', answer: false, explanation: 'position이 static이 아닌 요소(그리고 flex/grid 아이템)에서 동작해요.' },
    { id: 'fe-09-10', type: 'mcq', source: 'z-index: 겹치는 순서', question: '자식에게 z-index: 9999를 줬는데도 다른 요소 위로 못 올라오는 이유는?', choices: ['9999가 최대값을 넘어서', '부모의 z-index가 낮아 쌓임 맥락에 갇혀서', 'transform이 없어서', 'display가 block이어서'], answer: 1, explanation: '쌓임 맥락 — 자식은 부모의 층 안에서만 순서를 다퉈요.' },
  ],
}

export default topic

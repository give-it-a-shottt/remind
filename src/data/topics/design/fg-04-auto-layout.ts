import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-04-auto-layout',
  track: 'design',
  group: '피그마',
  title: '피그마 4. 오토 레이아웃과 Constraints',
  order: 204,
  sections: [
    {
      title: '오토 레이아웃이란',
      points: [
        '자식 요소를 방향(가로·세로·랩)과 간격(gap), 패딩으로 자동 배치하는 프레임',
        '내용이 늘면 프레임도 자동으로 커진다 — 버튼 글자가 길어지면 버튼도 같이 늘어남',
        'CSS Flexbox와 거의 같은 개념: direction = flex-direction, gap = gap, padding = padding',
        'Wrap(줄바꿈)을 켜면 flex-wrap처럼 넘치는 요소가 다음 줄로',
      ],
    },
    {
      title: 'Hug / Fill / Fixed',
      points: [
        'Hug contents: 내용 크기에 맞춤 (CSS width: fit-content)',
        'Fill container: 부모의 남은 공간을 채움 (CSS flex: 1 / width: 100%)',
        'Fixed: 고정 값',
        '부모가 Hug인데 자식이 전부 Fill이면 크기를 정할 기준이 없어 Fill이 고정으로 바뀐다',
        'Min / Max width로 너무 줄거나 늘어나지 않게 제한 (CSS min-width / max-width)',
      ],
    },
    {
      title: '정렬·간격·패딩',
      points: [
        '정렬 9칸(3×3)으로 자식들의 위치 지정 = justify-content + align-items',
        'Spacing between items: 숫자 또는 Auto(= space-between)',
        '패딩은 상하·좌우 따로 또는 4방향 각각',
        '디자인 시스템의 4px·8px 배수 간격을 gap·padding에 쓰면 일관성이 생긴다',
        'Absolute position: 오토 레이아웃 안에서 배지처럼 흐름에서 빼서 자유 배치 (CSS position: absolute)',
      ],
    },
    {
      title: 'Constraints (일반 프레임)',
      points: [
        '오토 레이아웃이 아닌 프레임에서 부모 크기가 바뀔 때 자식이 어떻게 반응할지 정한다',
        'Left / Right / Left & Right / Center / Scale (가로), Top / Bottom / Top & Bottom / Center / Scale (세로)',
        'Left & Right: 양쪽 여백을 유지하며 늘어남 (가로로 꽉 찬 헤더)',
        'Right + Bottom: 오른쪽 아래 고정 (플로팅 버튼)',
        'Scale: 부모 비율대로 크기·위치 함께 변화',
        '오토 레이아웃의 자식에는 constraints 대신 Hug/Fill/Fixed가 적용된다',
      ],
    },
    {
      title: '실전 팁',
      points: [
        '버튼: 텍스트 Hug + 프레임 패딩 → 글자에 맞게 자동 크기',
        '리스트: 세로 오토 레이아웃 + 아이템 가로 Fill → 화면 폭에 맞게',
        '중첩: 카드(세로) 안에 헤더 줄(가로, space-between) 같은 식으로 겹겹이',
        '레이어 순서 = 배치 순서. 순서를 바꾸려면 화살표로 드래그하거나 Ctrl + ] / [',
        '오토 레이아웃 안 요소를 숨기면(Shift + Ctrl + H) 그 자리가 사라지고 나머지가 당겨진다',
      ],
    },
  ],
  questions: [
    { id: 'fg-04-01', type: 'mcq', source: '오토 레이아웃이란', question: '피그마 오토 레이아웃과 가장 비슷한 CSS 개념은?', choices: ['float', 'Flexbox', 'position: absolute', 'table'], answer: 1, explanation: 'direction, gap, padding, 정렬이 Flexbox와 그대로 대응돼요.' },
    { id: 'fg-04-02', type: 'ox', source: '오토 레이아웃이란', question: '오토 레이아웃 버튼은 텍스트가 길어지면 버튼 크기도 자동으로 늘어난다 (Hug일 때).', answer: true, explanation: '그래서 버튼·태그·칩을 만들 때 가장 먼저 쓰는 기능이에요.' },
    { id: 'fg-04-03', type: 'mcq', source: 'Hug / Fill / Fixed', question: '부모의 남은 공간을 채우는 크기 설정은?', choices: ['Hug contents', 'Fill container', 'Fixed', 'Scale'], answer: 1, explanation: 'CSS로는 flex: 1 또는 width: 100%.' },
    { id: 'fg-04-04', type: 'mcq', source: 'Hug / Fill / Fixed', question: 'Hug contents에 해당하는 CSS는?', choices: ['width: 100%', 'width: fit-content', 'width: 0', 'flex: 1'], answer: 1, explanation: '내용 크기에 맞춤.' },
    { id: 'fg-04-05', type: 'ox', source: 'Hug / Fill / Fixed', question: '부모가 Hug이고 자식이 모두 Fill이면 크기를 정할 기준이 없어 문제가 생긴다.', answer: true, explanation: '부모는 자식에 맞추려 하고 자식은 부모에 맞추려 해서 순환. 피그마는 Fill을 고정으로 바꿔요.' },
    { id: 'fg-04-06', type: 'mcq', source: '정렬·간격·패딩', question: 'Spacing between items를 Auto로 하면 CSS로는?', choices: ['gap: 0', 'justify-content: space-between', 'align-items: center', 'flex-wrap: wrap'], answer: 1, explanation: '양 끝에 붙이고 사이를 균등하게.' },
    { id: 'fg-04-07', type: 'mcq', source: '정렬·간격·패딩', question: '오토 레이아웃 카드의 오른쪽 위에 "NEW" 배지를 흐름과 상관없이 겹쳐 두려면?', choices: ['Fill container', 'Absolute position', 'Wrap', 'Hug'], answer: 1, explanation: '오토 레이아웃 흐름에서 빼서 자유 배치 = position: absolute.' },
    { id: 'fg-04-08', type: 'mcq', source: 'Constraints (일반 프레임)', question: '화면 폭이 바뀌어도 양쪽 여백을 유지하며 가로로 늘어나는 헤더의 가로 constraint는?', choices: ['Left', 'Center', 'Left & Right', 'Scale'], answer: 2, explanation: 'Left & Right = 양쪽 고정, 가운데가 늘어남.' },
    { id: 'fg-04-09', type: 'mcq', source: 'Constraints (일반 프레임)', question: '화면 오른쪽 아래에 항상 붙어 있는 플로팅 버튼의 constraints는?', choices: ['Left + Top', 'Right + Bottom', 'Center + Center', 'Scale + Scale'], answer: 1, explanation: '오른쪽·아래 여백을 유지.' },
    { id: 'fg-04-10', type: 'ox', source: 'Constraints (일반 프레임)', question: '오토 레이아웃 안의 자식 요소에도 constraints가 그대로 적용된다.', answer: false, explanation: '오토 레이아웃 자식은 Hug/Fill/Fixed로 크기가 정해져요. (Absolute position 요소만 constraints 사용)' },
    { id: 'fg-04-11', type: 'essay', source: '실전 팁', question: '화면 폭에 맞게 늘어나는 리스트를 오토 레이아웃으로 만드는 방법을 설명해 보세요.', answer: '리스트 컨테이너를 세로 오토 레이아웃으로 만들고 gap으로 간격을 준다. 각 아이템은 가로 크기를 Fill container로 해서 부모 폭에 맞춘다. 아이템 내부는 가로 오토 레이아웃 + space-between으로 왼쪽 텍스트·오른쪽 아이콘을 배치한다.', keywords: ['세로 오토 레이아웃', 'Fill container', 'gap', '중첩'], explanation: '오토 레이아웃은 겹겹이 중첩해서 쓰는 게 기본이에요.' },
    { id: 'fg-04-12', type: 'mcq', source: '실전 팁', question: '오토 레이아웃 안의 요소를 숨기면?', choices: ['자리가 빈 칸으로 남는다', '그 자리가 사라지고 나머지 요소가 당겨진다', '에러가 난다', '부모도 숨겨진다'], answer: 1, explanation: 'CSS display: none과 같은 동작이라 상태별 변형 만들 때 유용해요.' },
  ],
}

export default topic

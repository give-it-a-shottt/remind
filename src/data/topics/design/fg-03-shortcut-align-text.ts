import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-03-shortcut-align-text',
  track: 'design',
  group: '피그마',
  title: '피그마 단축키 3. 정렬·텍스트·화면 보기',
  order: 203,
  sections: [
    {
      title: '정렬과 간격',
      points: [
        'Alt + A / D (Option + A / D): 왼쪽 / 오른쪽 정렬',
        'Alt + W / S: 위 / 아래 정렬',
        'Alt + H / V: 가로 가운데 / 세로 가운데 정렬',
        'Alt + Shift + H / V: 가로 / 세로 간격 균등 분배',
        'Tidy up: 흩어진 요소를 격자로 정돈 (Mac: Control + Option + T)',
        'Shift + A: 오토 레이아웃 추가, Alt + Shift + A: 오토 레이아웃 제거',
      ],
    },
    {
      title: '텍스트 단축키',
      points: [
        'Ctrl + B / I / U: 굵게 / 기울임 / 밑줄, Shift + Ctrl + X: 취소선',
        'Ctrl + Alt + L / T / R / J: 텍스트 왼쪽 / 가운데 / 오른쪽 / 양쪽 정렬',
        'Shift + Ctrl + < / > : 글자 크기, Ctrl + Alt + < / > : 굵기(weight)',
        'Alt + < / > : 자간, Alt + Shift + < / > : 행간',
        'Shift + Ctrl + 7 / 8: 번호 목록 / 글머리 목록',
        'Shift + Enter: 같은 문단 안에서 줄바꿈 (목록 들여쓰기 유지)',
        'Ctrl + K: 링크 넣기',
        '글머리를 만든 직후 Ctrl + Z → 자동 변환만 취소되어 "-" 그대로 남음',
      ],
    },
    {
      title: '화면 보기(줌·이동)',
      points: [
        'Space + 드래그: 화면 이동(손 도구)',
        'Ctrl + + / - : 확대 / 축소',
        'Shift + 0: 100%, Shift + 1: 전체 보기, Shift + 2: 선택 영역 확대',
        'N / Shift + N: 다음 / 이전 프레임으로 이동하며 확대',
        'Page Down / Page Up: 다음 / 이전 페이지',
        'Ctrl + F: 레이어·텍스트 찾기',
      ],
    },
    {
      title: '가이드와 그리드 보기',
      points: [
        'Shift + R: 눈금자, Shift + G: 레이아웃 그리드 보이기/숨기기',
        "Shift + ' : 픽셀 그리드 (크게 확대했을 때 1px 격자)",
        'Ctrl + Alt + Enter (Cmd + Option + Enter): 프로토타입 실행(Present)',
        'Shift + Ctrl + E: 내보내기(Export) 패널',
      ],
    },
    {
      title: '자주 틀리는 단축키 정리',
      points: [
        'PNG로 복사는 Shift + Ctrl + C (Ctrl이 두 번 들어가지 않음)',
        '복사한 걸로 바꿔치기는 Shift + Ctrl + R — Ctrl + Alt + R은 텍스트 오른쪽 정렬',
        '줌 100%는 Shift + 0 — Ctrl + 0은 피그마 단축키가 아님(브라우저 줌 초기화)',
        '행간은 Alt + Shift + < / > (Alt + Shift + R 아님)',
        '그룹 해제는 Shift + Ctrl + G, Ctrl + Backspace는 감싼 프레임·그룹 제거',
        '오토 레이아웃 해제는 Alt + Shift + A (Shift + A로 다시 추가)',
      ],
    },
  ],
  questions: [
    { id: 'fg-03-01', type: 'mcq', source: '정렬과 간격', question: '여러 요소를 세로 가운데로 정렬하는 단축키는? (Windows)', choices: ['Alt + H', 'Alt + V', 'Alt + S', 'Alt + W'], answer: 1, explanation: 'Alt + H 가로 가운데, Alt + V 세로 가운데, W 위, S 아래.' },
    { id: 'fg-03-02', type: 'mcq', source: '정렬과 간격', question: '카드 5개의 가로 간격을 똑같이 만드는 단축키는? (Windows)', choices: ['Alt + H', 'Alt + Shift + H', 'Ctrl + Alt + H', 'Shift + H'], answer: 1, explanation: 'Alt + Shift + H / V = 간격 균등 분배. Shift + H는 좌우 뒤집기.' },
    { id: 'fg-03-03', type: 'short', source: '정렬과 간격', question: '선택한 요소들에 오토 레이아웃을 추가하는 단축키는?', answer: ['Shift + A', 'Shift+A'], explanation: '제거는 Alt + Shift + A (Option + Shift + A).' },
    { id: 'fg-03-04', type: 'mcq', source: '텍스트 단축키', question: '텍스트를 가운데 정렬하는 단축키는? (Windows)', choices: ['Ctrl + Alt + C', 'Ctrl + Alt + T', 'Ctrl + E', 'Alt + H'], answer: 1, explanation: 'Ctrl + Alt + L / T / R / J = 왼쪽 / 가운데 / 오른쪽 / 양쪽. Alt + H는 레이어 정렬.' },
    { id: 'fg-03-05', type: 'mcq', source: '텍스트 단축키', question: 'Alt + > 를 누르면?', choices: ['글자 크기 증가', '자간 증가', '행간 증가', '굵기 증가'], answer: 1, explanation: 'Alt = 자간, Alt + Shift = 행간, Shift + Ctrl = 크기, Ctrl + Alt = 굵기.' },
    { id: 'fg-03-06', type: 'mcq', source: '텍스트 단축키', question: '글머리 목록을 만드는 단축키는? (Windows)', choices: ['Shift + Ctrl + 7', 'Shift + Ctrl + 8', 'Ctrl + 8', 'Alt + 8'], answer: 1, explanation: '7 = 번호 목록, 8 = 글머리. Alt + 8은 디자인 패널.' },
    { id: 'fg-03-07', type: 'ox', source: '텍스트 단축키', question: '목록 안에서 Shift + Enter를 누르면 새 항목이 아니라 같은 항목 안에서 줄이 바뀐다.', answer: true, explanation: '들여쓰기가 유지돼요.' },
    { id: 'fg-03-08', type: 'mcq', source: '화면 보기(줌·이동)', question: '피그마에서 화면을 100% 배율로 보는 단축키는?', choices: ['Ctrl + 0', 'Shift + 0', 'Shift + 1', 'Ctrl + 1'], answer: 1, explanation: 'Shift + 0 = 100%, Shift + 1 = 전체 보기, Shift + 2 = 선택 영역.' },
    { id: 'fg-03-09', type: 'mcq', source: '화면 보기(줌·이동)', question: '선택한 버튼만 화면 가득 확대해서 보려면?', choices: ['Shift + 1', 'Shift + 2', 'Ctrl + +', 'N'], answer: 1, explanation: 'Zoom to selection = Shift + 2.' },
    { id: 'fg-03-10', type: 'short', source: '화면 보기(줌·이동)', question: '다음 프레임으로 이동하며 확대해서 보는 단축키는? (한 글자)', answer: ['N'], explanation: '이전 프레임은 Shift + N.' },
    { id: 'fg-03-11', type: 'mcq', source: '가이드와 그리드 보기', question: 'Shift + G의 기능은?', choices: ['그룹 해제', '레이아웃 그리드 보이기/숨기기', '눈금자', '픽셀 그리드'], answer: 1, explanation: 'Shift + R 눈금자, Shift + \' 픽셀 그리드.' },
    { id: 'fg-03-12', type: 'short', source: '가이드와 그리드 보기', question: '프로토타입을 실행(Present)하는 단축키는? (Windows)', answer: ['Ctrl + Alt + Enter', 'Ctrl+Alt+Enter'], explanation: 'Mac은 Cmd + Option + Enter.' },
    { id: 'fg-03-13', type: 'mcq', source: '자주 틀리는 단축키 정리', question: '다음 중 올바른 피그마 단축키 연결은?', choices: ['Ctrl + 0 = 줌 100%', 'Ctrl + Alt + R = 복사한 걸로 바꿔치기', 'Shift + Ctrl + C = PNG로 복사', 'Alt + Shift + R = 행간'], answer: 2, choiceExplanations: ['줌 100%는 Shift + 0.', 'Ctrl + Alt + R은 텍스트 오른쪽 정렬. 바꿔치기는 Shift + Ctrl + R.', '정답.', '행간은 Alt + Shift + < / >.'], explanation: '비슷하게 생긴 조합이 많아서 자주 헷갈려요.' },
    { id: 'fg-03-14', type: 'mcq', source: '자주 틀리는 단축키 정리', question: 'Ctrl + Backspace와 Shift + Ctrl + G의 차이로 맞는 것은?', choices: ['같은 기능', 'Ctrl + Backspace는 감싼 프레임·그룹 제거, Shift + Ctrl + G는 그룹 해제', '둘 다 삭제', 'Ctrl + Backspace는 오토 레이아웃 추가'], answer: 1, explanation: '프레임으로 감싼 걸 풀 때는 Ctrl + Backspace가 편해요.' },
  ],
}

export default topic

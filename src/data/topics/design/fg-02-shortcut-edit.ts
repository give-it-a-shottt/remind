import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-02-shortcut-edit',
  track: 'design',
  group: '피그마',
  title: '피그마 단축키 2. 선택·레이어·편집',
  order: 202,
  sections: [
    {
      title: '레이어 선택 이동',
      points: [
        'Enter: 자식(한 단계 아래) 선택, Shift + Enter 또는 \\ : 부모(한 단계 위) 선택',
        'Tab: 같은 깊이의 다음 레이어, Shift + Tab: 이전 레이어',
        'Ctrl + 클릭 (Cmd + 클릭): 그룹·프레임 속 요소를 바로 선택(Deep Select)',
        'Ctrl + 드래그: 프레임 안쪽 요소만 드래그 영역으로 선택',
        'Ctrl + Alt + A (Cmd + Option + A): 같은 속성의 레이어 모두 선택(Select all matching)',
        'Shift + Ctrl + A (Shift + Cmd + A): 선택 반전, Esc: 선택 해제',
      ],
    },
    {
      title: '복제와 붙여넣기',
      points: [
        'Ctrl + D: 복제 (간격을 두고 한 번 복제한 뒤 다시 Ctrl + D 하면 같은 간격으로 반복)',
        'Alt + 드래그: 끌어서 복제',
        'Shift + Ctrl + V: 제자리에 붙여넣기',
        'Ctrl + Alt + C / V (Cmd + Option + C / V): 속성(스타일) 복사 / 붙여넣기 — 채우기·선·효과·텍스트 스타일',
        'Shift + Ctrl + R (Shift + Cmd + R): 복사한 레이어로 선택한 레이어 바꿔치기(Paste to replace)',
        'Shift + Ctrl + C (Shift + Cmd + C): 선택한 레이어를 PNG 이미지로 복사',
      ],
    },
    {
      title: '그룹·프레임·마스크',
      points: [
        'Ctrl + G: 그룹, Shift + Ctrl + G: 그룹 해제',
        'Ctrl + Alt + G (Cmd + Option + G): 선택을 프레임으로 감싸기',
        'Ctrl + Backspace (Cmd + Delete): 감싼 프레임·그룹만 제거하고 내용은 남기기',
        'Ctrl + Alt + M (Cmd + Option + M): 마스크 (맨 아래 레이어가 마스크)',
        'Ctrl + E (Cmd + E): Flatten(도형 합치기 → 하나의 벡터)',
        'Ctrl + Alt + K: 컴포넌트 만들기, Ctrl + Alt + B: 인스턴스 분리(Detach)',
      ],
    },
    {
      title: '순서·잠금·숨김',
      points: [
        'Ctrl + ] / Ctrl + [ : 한 단계 앞으로 / 뒤로',
        '] / [ : 맨 앞으로 / 맨 뒤로',
        'Shift + Ctrl + L: 잠금/해제, Shift + Ctrl + H: 숨기기/보이기',
        'Shift + H / Shift + V: 좌우 / 상하 뒤집기',
        'Ctrl + R (Cmd + R): 레이어 이름 바꾸기 (여러 개 선택하면 일괄 이름 변경)',
        'Alt + L (Option + L): 레이어 패널의 열린 그룹 모두 접기',
      ],
    },
    {
      title: '크기 조절과 이동 보조키',
      points: [
        'Shift + 리사이즈: 비율 유지, Alt + 리사이즈: 가운데 기준',
        'Ctrl + 프레임 리사이즈: 안쪽 요소의 constraints를 무시하고 프레임만 크기 변경',
        'Space를 누른 채 드래그: 다른 프레임·오토 레이아웃 안으로 끼어 들어가지 않게 이동',
        '방향키 1px, Shift + 방향키 10px 이동 (Shift 간격은 환경설정 Nudge amount에서 변경)',
        'Shift + Ctrl + Alt + R: Resize to fit (프레임을 내용 크기에 맞추기)',
        'Alt를 누른 채 다른 요소 위에 올리기: 사이 간격(거리) 측정',
      ],
    },
    {
      title: '채우기·선·투명도',
      points: [
        '숫자키로 투명도: 1 = 10%, 5 = 50%, 0 = 100%, 빠르게 0 0 = 0%',
        'Shift + X: 채우기와 선 색 맞바꾸기',
        'Alt + / : 채우기 제거, Shift + / : 선 제거',
        'Shift + Ctrl + O (Shift + Cmd + O): Outline stroke (선을 면으로)',
      ],
    },
  ],
  questions: [
    { id: 'fg-02-01', type: 'mcq', source: '레이어 선택 이동', question: '선택한 프레임의 "자식" 레이어로 내려가는 키는?', choices: ['Tab', 'Enter', '\\', 'Esc'], answer: 1, explanation: 'Enter = 자식, Shift + Enter 또는 \\ = 부모, Tab = 다음 형제.' },
    { id: 'fg-02-02', type: 'mcq', source: '레이어 선택 이동', question: '그룹 안에 깊이 들어 있는 아이콘을 한 번에 선택하려면?', choices: ['더블클릭 3번', 'Ctrl + 클릭 (Cmd + 클릭)', 'Alt + 클릭', 'Shift + 클릭'], answer: 1, explanation: 'Deep Select. Shift + 클릭은 다중 선택이에요.' },
    { id: 'fg-02-03', type: 'mcq', source: '레이어 선택 이동', question: '파일 안의 같은 색 아이콘을 전부 선택하는 기능은?', choices: ['Ctrl + A', 'Select all matching layers (Ctrl + Alt + A)', 'Ctrl + F', 'Shift + Ctrl + A'], answer: 1, explanation: 'Ctrl + A는 전체 선택, Shift + Ctrl + A는 선택 반전.' },
    { id: 'fg-02-04', type: 'short', source: '레이어 선택 이동', question: '같은 깊이의 다음 레이어를 선택하는 키는?', answer: ['Tab'], explanation: '이전 레이어는 Shift + Tab.' },
    { id: 'fg-02-05', type: 'mcq', source: '복제와 붙여넣기', question: '버튼의 채우기·선·그림자만 다른 버튼에 복사하려면? (Windows)', choices: ['Ctrl + C / V', 'Ctrl + Alt + C / V', 'Shift + Ctrl + V', 'Ctrl + D'], answer: 1, explanation: '속성(스타일) 복사/붙여넣기. Mac은 Cmd + Option + C / V.' },
    { id: 'fg-02-06', type: 'mcq', source: '복제와 붙여넣기', question: '복사해 둔 아이콘으로 화면 속 아이콘 10개를 위치 그대로 바꿔치기하는 단축키는? (Windows)', choices: ['Ctrl + Alt + R', 'Shift + Ctrl + R', 'Ctrl + R', 'Shift + R'], answer: 1, explanation: 'Paste to replace = Shift + Ctrl + R. Ctrl + Alt + R은 텍스트 우측 정렬, Ctrl + R은 이름 바꾸기, Shift + R은 눈금자.' },
    { id: 'fg-02-07', type: 'mcq', source: '복제와 붙여넣기', question: '선택한 레이어를 PNG로 클립보드에 복사하는 단축키는? (Windows)', choices: ['Shift + Ctrl + C', 'Shift + Ctrl + Alt + C', 'Ctrl + Alt + C', 'Shift + Ctrl + E'], answer: 0, explanation: 'Mac은 Shift + Cmd + C. Shift + Ctrl + E는 내보내기 패널.' },
    { id: 'fg-02-08', type: 'ox', source: '복제와 붙여넣기', question: '간격을 두고 Ctrl + D로 한 번 복제한 뒤 다시 Ctrl + D를 누르면 같은 간격으로 계속 복제된다.', answer: true, explanation: '마지막 이동량을 기억해요. 리스트 배치할 때 편해요.' },
    { id: 'fg-02-09', type: 'mcq', source: '그룹·프레임·마스크', question: '그룹을 해제하는 단축키는? (Windows)', choices: ['Ctrl + U', 'Shift + Ctrl + G', 'Ctrl + Alt + G', 'Alt + G'], answer: 1, explanation: 'Ctrl + Alt + G는 프레임으로 감싸기, Ctrl + U는 텍스트 밑줄.' },
    { id: 'fg-02-10', type: 'mcq', source: '그룹·프레임·마스크', question: 'Ctrl + Alt + M으로 마스크를 걸 때 마스크 모양이 되는 레이어는?', choices: ['맨 위 레이어', '선택 중 맨 아래 레이어', '가장 큰 레이어', '이미지 레이어'], answer: 1, explanation: '맨 아래 레이어 모양대로 위 레이어들이 잘려요. 포토샵 클리핑 마스크와 같은 원리.' },
    { id: 'fg-02-11', type: 'short', source: '그룹·프레임·마스크', question: '인스턴스를 컴포넌트와의 연결을 끊고 일반 레이어로 만드는 단축키는? (Windows)', answer: ['Ctrl + Alt + B', 'Ctrl+Alt+B'], explanation: 'Detach instance. 컴포넌트 만들기는 Ctrl + Alt + K.' },
    { id: 'fg-02-12', type: 'mcq', source: '순서·잠금·숨김', question: '레이어를 맨 앞으로 보내는 피그마 단축키는?', choices: ['Ctrl + ]', ']', 'Ctrl + [', '['], answer: 1, explanation: '] 맨 앞, [ 맨 뒤, Ctrl + ] / [ 한 단계씩.' },
    { id: 'fg-02-13', type: 'mcq', source: '순서·잠금·숨김', question: '여러 레이어를 선택하고 Ctrl + R을 누르면?', choices: ['눈금자 표시', '일괄 이름 변경', '우측 정렬', '회전'], answer: 1, explanation: 'Batch rename. "Item $n" 같은 규칙으로 번호도 매길 수 있어요.' },
    { id: 'fg-02-14', type: 'short', source: '순서·잠금·숨김', question: '선택한 레이어를 좌우로 뒤집는 단축키는?', answer: ['Shift + H', 'Shift+H'], explanation: '상하 뒤집기는 Shift + V.' },
    { id: 'fg-02-15', type: 'mcq', source: '크기 조절과 이동 보조키', question: '오토 레이아웃 프레임 위로 요소를 끌고 갈 때 그 안에 끼어 들어가지 않게 하려면?', choices: ['Shift를 누른 채 드래그', 'Space를 누른 채 드래그', 'Alt를 누른 채 드래그', 'Ctrl을 누른 채 드래그'], answer: 1, explanation: 'Alt + 드래그는 복제, Shift + 드래그는 축 고정 이동이에요.' },
    { id: 'fg-02-16', type: 'mcq', source: '크기 조절과 이동 보조키', question: '프레임 크기만 바꾸고 안쪽 요소는 constraints와 상관없이 그대로 두려면?', choices: ['Shift + 리사이즈', 'Alt + 리사이즈', 'Ctrl + 리사이즈', 'Space + 리사이즈'], answer: 2, explanation: 'Ctrl(Cmd)을 누른 채 리사이즈하면 자식은 영향을 받지 않아요.' },
    { id: 'fg-02-17', type: 'ox', source: '크기 조절과 이동 보조키', question: '요소를 선택하고 Alt를 누른 채 다른 요소 위에 마우스를 올리면 둘 사이 거리가 표시된다.', answer: true, explanation: '디자인 QA에서 간격 확인할 때 가장 많이 써요.' },
    { id: 'fg-02-18', type: 'mcq', source: '채우기·선·투명도', question: '레이어를 선택하고 0을 두 번 빠르게 누르면 투명도는?', choices: ['100%', '0%', '50%', '10%'], answer: 1, explanation: '0 = 100%, 0 0 = 0%, 5 = 50%.' },
    { id: 'fg-02-19', type: 'mcq', source: '채우기·선·투명도', question: 'Shift + X의 기능은?', choices: ['레이어 삭제', '채우기와 선 색 맞바꾸기', '텍스트 취소선', '가로 뒤집기'], answer: 1, explanation: '취소선은 Ctrl + Shift + X.' },
  ],
}

export default topic

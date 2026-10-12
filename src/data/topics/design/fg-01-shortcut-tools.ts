import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-01-shortcut-tools',
  track: 'design',
  group: '피그마',
  title: '피그마 단축키 1. 도구와 패널',
  order: 201,
  sections: [
    {
      title: '읽는 법: Mac ↔ Windows',
      points: [
        'Mac의 Cmd(⌘) = Windows의 Ctrl, Mac의 Option(⌥) = Windows의 Alt, Shift(⇧)는 같다',
        '이 토픽은 Windows 표기 기준, 괄호 안이 Mac',
        '한 글자 단축키(V, F, R…)는 두 OS가 같다. 한글 입력 상태면 안 먹으니 영문 상태 확인',
      ],
    },
    {
      title: '그리기 도구',
      points: [
        'V 이동(Move), K 스케일(비율 그대로 크기 조절)',
        'F 또는 A 프레임, S 슬라이스',
        'R 사각형, O 원, L 선, Shift + L 화살표',
        'P 펜, Shift + P 연필, T 텍스트, C 코멘트, I 컬러 피커',
        'Shift + Ctrl + K (Shift + Cmd + K): 이미지·비디오 불러오기',
      ],
    },
    {
      title: '도형 편집 모드',
      points: [
        '도형·벡터·이미지 선택 후 Enter → 편집 모드 (Esc로 나가기)',
        '편집 모드에서 Ctrl(Cmd) 누른 채 점 드래그 = 벤드 툴(곡선 만들기)',
        '편집 모드에서 B = 페인트 버킷(닫힌 영역 채우기)',
        'Ctrl + J (Cmd + J): 선택한 점 합치기, Shift + Backspace: 경로를 이으면서 점 삭제',
      ],
    },
    {
      title: '패널 열기',
      points: [
        'Alt + 1 (Option + 1): 레이어 패널, Alt + 2: 에셋 패널',
        'Alt + 8: 디자인 패널, Alt + 9: 프로토타입 패널',
        'Shift + I: 에셋(컴포넌트) 검색해서 넣기',
        'Ctrl + Alt + O (Cmd + Option + O): 팀 라이브러리',
        'Ctrl + \\ (Cmd + \\): UI 숨기기/보이기 — 화면이 갑자기 비면 이걸 다시 누르기',
        'Shift + D: Dev Mode 전환',
      ],
    },
    {
      title: '빠른 실행',
      points: [
        'Ctrl + / 또는 Ctrl + P (Cmd + / 또는 Cmd + P): Quick actions — 메뉴·플러그인·레이어를 이름으로 검색해 실행',
        'Ctrl + Alt + P (Cmd + Option + P): 마지막 플러그인 다시 실행',
        '/ : 커서 챗 (협업 중 커서 옆에 말풍선)',
        'Ctrl + Alt + \\ (Cmd + Option + \\): 다른 사람 커서 보이기/숨기기',
        'Ctrl + Shift + ? : 단축키 패널 열기 (모를 땐 여기서 검색)',
      ],
    },
  ],
  questions: [
    { id: 'fg-01-01', type: 'mcq', source: '읽는 법: Mac ↔ Windows', question: 'Windows의 Ctrl + Alt + K에 해당하는 Mac 단축키는?', choices: ['Ctrl + Option + K', 'Cmd + Option + K', 'Cmd + Shift + K', 'Option + Shift + K'], answer: 1, explanation: 'Ctrl → Cmd, Alt → Option.' },
    { id: 'fg-01-02', type: 'ox', source: '읽는 법: Mac ↔ Windows', question: '한글 입력 상태에서는 R, T 같은 한 글자 단축키가 동작하지 않을 수 있다.', answer: true, explanation: 'ㄱ, ㅅ이 입력돼서 도구가 안 바뀌어요. 영문 상태 확인.' },
    { id: 'fg-01-03', type: 'mcq', source: '그리기 도구', question: '피그마에서 원(Ellipse) 도구 단축키는?', choices: ['E', 'O', 'C', 'R'], answer: 1, explanation: 'O = 원, R = 사각형, C = 코멘트.' },
    { id: 'fg-01-04', type: 'short', source: '그리기 도구', question: '프레임 도구 단축키 두 가지 중 하나는?', answer: ['F', 'A'], explanation: 'F 또는 A. S는 슬라이스.' },
    { id: 'fg-01-05', type: 'mcq', source: '그리기 도구', question: 'Shift + L은?', choices: ['선', '화살표', '잠금', '레이아웃 그리드'], answer: 1, explanation: 'L 선, Shift + L 화살표.' },
    { id: 'fg-01-06', type: 'mcq', source: '그리기 도구', question: '안쪽 효과·선 두께까지 비율대로 같이 줄여 주는 스케일 도구는?', choices: ['V', 'K', 'S', 'X'], answer: 1, explanation: 'K(Scale). V로 크기를 줄이면 선 두께·폰트 크기는 그대로예요.' },
    { id: 'fg-01-07', type: 'short', source: '그리기 도구', question: '이미지를 불러오는 단축키는? (Windows)', answer: ['Shift + Ctrl + K', 'Ctrl + Shift + K', 'Shift+Ctrl+K', 'Ctrl+Shift+K'], explanation: 'Mac은 Shift + Cmd + K.' },
    { id: 'fg-01-08', type: 'mcq', source: '도형 편집 모드', question: '도형을 선택하고 편집 모드(점 편집)로 들어가는 키는?', choices: ['Tab', 'Enter', 'E', 'Space'], answer: 1, explanation: 'Enter로 들어가고 Esc로 나와요.' },
    { id: 'fg-01-09', type: 'ox', source: '도형 편집 모드', question: '페인트 버킷(B)은 도형 편집 모드에서만 쓸 수 있다.', answer: true, explanation: '벡터 네트워크의 닫힌 영역을 채우는 도구라 편집 모드 전용이에요.' },
    { id: 'fg-01-10', type: 'mcq', source: '패널 열기', question: 'Alt + 2 (Option + 2)로 여는 패널은?', choices: ['레이어', '에셋', '디자인', '프로토타입'], answer: 1, explanation: 'Alt + 1 레이어, Alt + 2 에셋, Alt + 8 디자인, Alt + 9 프로토타입.' },
    { id: 'fg-01-11', type: 'mcq', source: '패널 열기', question: '작업 중 레이어·디자인 패널이 전부 사라졌다. 가장 먼저 눌러볼 단축키는?', choices: ['Ctrl + Z', 'Ctrl + \\', 'Shift + D', 'Esc'], answer: 1, explanation: 'Ctrl + \\ (Cmd + \\)는 UI 숨기기/보이기 토글이에요.' },
    { id: 'fg-01-12', type: 'short', source: '패널 열기', question: 'Dev Mode로 전환하는 단축키는?', answer: ['Shift + D', 'Shift+D'], explanation: '개발자가 수치·코드를 확인하는 모드.' },
    { id: 'fg-01-13', type: 'mcq', source: '빠른 실행', question: '메뉴·플러그인을 이름으로 검색해 바로 실행하는 Quick actions 단축키는? (Windows)', choices: ['Ctrl + F', 'Ctrl + /', 'Ctrl + K', 'Ctrl + Q'], answer: 1, explanation: 'Ctrl + / 또는 Ctrl + P. Ctrl + F는 찾기.' },
    { id: 'fg-01-14', type: 'mcq', source: '빠른 실행', question: '같은 플러그인을 반복 실행할 때 편한 단축키는?', choices: ['Ctrl + Alt + P (Cmd + Option + P)', 'Ctrl + P', 'Shift + P', 'Alt + P'], answer: 0, explanation: '마지막으로 실행한 플러그인을 다시 실행해요.' },
    { id: 'fg-01-15', type: 'ox', source: '빠른 실행', question: '/ 키는 협업 중 커서 옆에 메시지를 띄우는 커서 챗이다.', answer: true, explanation: '단, 텍스트 편집 중에는 그냥 / 문자가 입력돼요.' },
  ],
}

export default topic

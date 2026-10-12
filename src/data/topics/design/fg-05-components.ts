import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-05-components',
  track: 'design',
  group: '피그마',
  title: '피그마 5. 컴포넌트 · Variants · Properties',
  order: 205,
  sections: [
    {
      title: '컴포넌트와 인스턴스',
      points: [
        '컴포넌트(메인, ◆ 보라 아이콘): 원본. Ctrl + Alt + K로 만든다',
        '인스턴스(◇): 원본을 복제해 쓰는 사본. 메인을 고치면 모든 인스턴스에 반영',
        '인스턴스에서 바꾼 텍스트·색 등은 오버라이드 — 메인을 고쳐도 오버라이드한 값은 유지',
        'Reset all changes로 오버라이드 초기화, Detach(Ctrl + Alt + B)로 연결 끊기',
        '인스턴스 안에서는 레이어 추가·삭제 불가 → 구조를 바꾸려면 메인을 고치거나 Variant/Property로 설계',
        '코드의 컴포넌트(React 컴포넌트)와 props 개념에 대응',
      ],
    },
    {
      title: 'Variants',
      points: [
        '비슷한 컴포넌트를 하나의 컴포넌트 세트로 묶고 속성 값으로 전환',
        '예: Button — Type=Primary/Secondary, Size=L/M/S, State=Default/Hover/Disabled',
        '레이어 이름 규칙 "Property=Value, Property=Value"',
        '인스턴스에서 드롭다운으로 바꾸면 위치·오버라이드를 유지한 채 교체',
        '모든 조합을 다 만들 필요는 없지만, 같은 레이어 이름 구조를 맞춰야 전환 시 오버라이드가 유지된다',
      ],
    },
    {
      title: 'Component Properties',
      points: [
        'Boolean: 아이콘 보이기/숨기기 같은 on/off',
        'Text: 버튼 라벨처럼 텍스트를 속성으로 노출',
        'Instance swap: 안의 아이콘을 다른 컴포넌트로 바꾸기',
        'Variant: 위의 Variants 속성',
        'Variant 조합 폭발을 줄여준다 — 아이콘 있음/없음을 Variant 대신 Boolean으로',
        'Nested instances: 안쪽 인스턴스의 속성을 바깥에서 바로 노출',
      ],
    },
    {
      title: '인스턴스 교체(Swap)',
      points: [
        '인스턴스 선택 → 오른쪽 패널의 컴포넌트 이름 드롭다운에서 다른 컴포넌트로 교체',
        '에셋 패널에서 Alt(Option)를 누른 채 컴포넌트를 인스턴스 위로 드래그 → 바로 교체',
        '여러 개를 한꺼번에 바꿀 때는 복사 후 Shift + Ctrl + R(Paste to replace)도 가능',
      ],
    },
    {
      title: '라이브러리',
      points: [
        '컴포넌트·스타일·변수를 Publish하면 다른 파일에서 팀 라이브러리로 사용',
        '메인을 수정하고 다시 Publish하면 사용하는 파일에 업데이트 알림 → Review·Accept',
        '로컬 컴포넌트 이름에 "/"를 쓰면 에셋 패널에서 폴더처럼 묶인다 (Icon/Arrow/Left)',
        '_ 또는 . 으로 시작하는 이름은 Publish에서 제외 (내부용 부품)',
      ],
    },
  ],
  questions: [
    { id: 'fg-05-01', type: 'mcq', source: '컴포넌트와 인스턴스', question: '메인 컴포넌트의 색을 바꾸면 인스턴스는?', choices: ['변화 없음', '오버라이드하지 않은 속성은 모두 함께 바뀐다', '모두 삭제된다', '분리된다'], answer: 1, explanation: '인스턴스에서 직접 바꾼(오버라이드) 값은 유지돼요.' },
    { id: 'fg-05-02', type: 'ox', source: '컴포넌트와 인스턴스', question: '인스턴스 안에서는 레이어를 새로 추가하거나 삭제할 수 없다.', answer: true, explanation: '구조 변경은 메인에서. 숨기기·텍스트 변경 같은 오버라이드만 가능해요.' },
    { id: 'fg-05-03', type: 'mcq', source: '컴포넌트와 인스턴스', question: '인스턴스에서 바꾼 값을 모두 원래대로 되돌리는 기능은?', choices: ['Detach instance', 'Reset all changes', 'Go to main component', 'Push changes'], answer: 1, explanation: 'Detach는 연결 자체를 끊어요.' },
    { id: 'fg-05-04', type: 'mcq', source: 'Variants', question: 'Variants 레이어 이름 규칙으로 맞는 것은?', choices: ['Button/Primary/Large', 'Type=Primary, Size=Large', 'Button-Primary-Large', 'Primary(Large)'], answer: 1, explanation: '"속성=값"을 쉼표로 구분. "/"는 일반 컴포넌트 폴더 구분.' },
    { id: 'fg-05-05', type: 'ox', source: 'Variants', question: 'Variant끼리 레이어 이름 구조를 맞춰 두면 인스턴스를 전환해도 텍스트 오버라이드가 유지된다.', answer: true, explanation: '같은 이름의 레이어끼리 오버라이드를 이어받아요.' },
    { id: 'fg-05-06', type: 'mcq', source: 'Component Properties', question: '버튼의 아이콘을 보이거나 숨기는 옵션에 가장 적합한 속성은?', choices: ['Variant', 'Boolean', 'Text', 'Instance swap'], answer: 1, explanation: 'Variant로 만들면 조합 수가 두 배로 늘어요. on/off는 Boolean.' },
    { id: 'fg-05-07', type: 'mcq', source: 'Component Properties', question: '버튼 안 아이콘을 다른 아이콘 컴포넌트로 바꿀 수 있게 하는 속성은?', choices: ['Boolean', 'Text', 'Instance swap', 'Variant'], answer: 2, explanation: 'Instance swap 속성. 선호 아이콘 목록(Preferred values)도 지정할 수 있어요.' },
    { id: 'fg-05-08', type: 'essay', source: 'Component Properties', question: '피그마 컴포넌트 Properties와 React 컴포넌트의 props를 비교해 설명해 보세요.', answer: '둘 다 하나의 원본을 여러 곳에서 다른 값으로 재사용하기 위한 입력값이다. Variant는 type/size 같은 열거형 prop, Boolean은 showIcon 같은 불리언 prop, Text는 label 문자열 prop, Instance swap은 icon={<Icon />}처럼 컴포넌트를 넘기는 prop에 대응한다.', keywords: ['재사용', 'Variant = 열거형', 'Boolean', 'Instance swap = 컴포넌트 prop'], explanation: '디자인 컴포넌트 속성을 코드 props와 맞추면 개발 전달이 쉬워져요.' },
    { id: 'fg-05-09', type: 'mcq', source: '인스턴스 교체(Swap)', question: '에셋 패널에서 컴포넌트를 끌어 기존 인스턴스를 바로 교체하려면 어떤 키를 누른 채 드래그?', choices: ['Shift', 'Alt (Option)', 'Ctrl', 'Space'], answer: 1, explanation: 'Alt를 누른 채 인스턴스 위에 놓으면 교체돼요.' },
    { id: 'fg-05-10', type: 'mcq', source: '라이브러리', question: '컴포넌트 이름을 "Icon/Arrow/Left"로 지으면?', choices: ['에러', '에셋 패널에서 Icon > Arrow 폴더처럼 묶인다', 'Variant가 된다', 'Publish에서 제외된다'], answer: 1, explanation: '"/"는 폴더 구분. _ 또는 . 으로 시작하면 Publish 제외.' },
    { id: 'fg-05-11', type: 'ox', source: '라이브러리', question: '라이브러리의 메인 컴포넌트를 수정하면 사용하는 파일에 즉시 강제로 반영된다.', answer: false, explanation: '다시 Publish해야 하고, 사용하는 파일에서 업데이트를 Review·Accept해야 반영돼요.' },
  ],
}

export default topic

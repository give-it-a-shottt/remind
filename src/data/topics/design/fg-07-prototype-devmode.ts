import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-07-prototype-devmode',
  track: 'design',
  group: '피그마',
  title: '피그마 7. 프로토타입 · Smart Animate · Dev Mode',
  order: 207,
  sections: [
    {
      title: '프로토타입 기본',
      points: [
        'Prototype 탭에서 프레임·요소에 Interaction(트리거 → 액션 → 애니메이션)을 연결',
        '트리거: On click, On hover, While pressing, On drag, After delay, Key/Gamepad',
        '액션: Navigate to, Open overlay, Swap overlay, Back, Scroll to, Open link, Set variable',
        'Flow starting point: 프로토타입 시작 프레임 (여러 플로우 가능)',
        'Ctrl + Alt + Enter로 실행, 공유 링크로 모바일에서도 확인',
      ],
    },
    {
      title: 'Smart Animate',
      points: [
        '두 프레임에서 같은 이름의 레이어를 찾아 위치·크기·색·투명도 차이를 자동으로 보간',
        '레이어 이름이 다르면 매칭이 안 되어 그냥 디졸브처럼 보인다 → 이름 맞추기가 핵심',
        '이징: Linear, Ease in, Ease out, Ease in and out, Spring 계열(Gentle·Bouncy 등), 커스텀 베지어',
        'After delay로 프레임을 이어 붙이면 자동 재생 애니메이션',
      ],
    },
    {
      title: 'Interactive components',
      points: [
        'Variant끼리 프로토타입을 연결 → 인스턴스가 스스로 상태를 바꾼다 (Hover, 토글 on/off)',
        '화면마다 Hover 프레임을 만들 필요가 없어 프로토타입이 가벼워진다',
        'Overlay: 모달·바텀시트·툴팁을 위에 띄우기 (위치, 배경 어둡게, 바깥 클릭으로 닫기 설정)',
        'Scroll behavior: 헤더 Fixed(스크롤해도 고정), Sticky',
      ],
    },
    {
      title: 'Dev Mode',
      points: [
        'Shift + D로 전환. 개발자가 간격·크기·색·폰트 수치와 CSS/iOS/Android 코드 스니펫 확인',
        '변수에 바인딩된 값은 토큰 이름으로 보인다',
        'Ready for dev 표시로 개발할 화면을 구분, 변경 비교(Compare changes)',
        'Export 설정(PNG/SVG/PDF, 배율 1x·2x)을 레이어에 지정해 두면 개발자가 바로 다운로드',
        '아이콘은 SVG, 사진은 PNG·JPG(필요하면 2x)',
      ],
    },
    {
      title: '실무 팁',
      points: [
        '레이어 이름을 의미 있게: Frame 123 대신 Header, Card/Title — Smart Animate와 Dev Mode 모두 이름에 의존',
        '페이지 구성: Cover / Components / Screens / Archive처럼 나눠 관리',
        '섹션(Section)으로 화면 묶음을 구분하고 Ready for dev 상태 표시',
        '버전 기록(Version history)에 이름 붙여 저장 → 되돌리기 쉬움',
        '코멘트(C)로 피드백, 해결하면 Resolve',
        '플러그인은 Quick actions(Ctrl + /)로 이름 검색해 실행',
      ],
    },
  ],
  questions: [
    { id: 'fg-07-01', type: 'mcq', source: '프로토타입 기본', question: '버튼을 누르면 모달을 현재 화면 위에 띄우는 액션은?', choices: ['Navigate to', 'Open overlay', 'Scroll to', 'Back'], answer: 1, explanation: 'Navigate to는 화면 전체를 바꿔요.' },
    { id: 'fg-07-02', type: 'mcq', source: '프로토타입 기본', question: '스플래시 화면이 2초 뒤 자동으로 넘어가게 하는 트리거는?', choices: ['On click', 'After delay', 'On hover', 'While pressing'], answer: 1, explanation: 'After delay 2000ms → Navigate to.' },
    { id: 'fg-07-03', type: 'ox', source: '프로토타입 기본', question: '한 파일에 프로토타입 시작점(Flow starting point)을 여러 개 둘 수 있다.', answer: true, explanation: '로그인 플로우, 결제 플로우처럼 나눠 둘 수 있어요.' },
    { id: 'fg-07-04', type: 'mcq', source: 'Smart Animate', question: 'Smart Animate가 두 프레임 사이 요소를 매칭하는 기준은?', choices: ['레이어 색', '같은 레이어 이름(과 계층)', '레이어 크기', '생성 순서'], answer: 1, explanation: '이름이 다르면 매칭이 안 돼 그냥 페이드처럼 보여요.' },
    { id: 'fg-07-05', type: 'mcq', source: 'Smart Animate', question: '목표 지점을 살짝 지나쳤다 돌아오는 탄력 있는 움직임을 주는 이징은?', choices: ['Linear', 'Ease in', 'Spring(Bouncy) 계열', 'Instant'], answer: 2, explanation: '오버슈트 = 애니메이션 원칙의 과장·스쿼시와 연결돼요.' },
    { id: 'fg-07-06', type: 'mcq', source: 'Interactive components', question: '버튼 Hover 효과를 화면마다 만들지 않고 컴포넌트 하나로 처리하는 방법은?', choices: ['Overlay', 'Default/Hover Variant를 While hovering으로 연결 (Interactive components)', 'Smart Animate만', 'Detach'], answer: 1, explanation: 'Variant끼리 연결하면 모든 인스턴스가 스스로 상태를 바꿔요.' },
    { id: 'fg-07-07', type: 'ox', source: 'Interactive components', question: '스크롤해도 헤더를 상단에 고정하려면 헤더의 Scroll behavior를 Fixed로 한다.', answer: true, explanation: 'Fixed(고정) 또는 Sticky.' },
    { id: 'fg-07-08', type: 'mcq', source: 'Dev Mode', question: 'Dev Mode에서 확인할 수 없는 것은?', choices: ['간격·크기 수치', 'CSS 코드 스니펫', '변수(토큰) 이름', '서버 API 응답'], answer: 3, explanation: 'Dev Mode는 디자인 사양 확인용이에요.' },
    { id: 'fg-07-09', type: 'mcq', source: 'Dev Mode', question: '아이콘을 개발자에게 전달할 때 가장 적합한 내보내기 형식은?', choices: ['JPG', 'SVG', 'GIF', 'PSD'], answer: 1, explanation: '벡터라 크기와 상관없이 선명하고 색도 코드로 바꿀 수 있어요. 사진은 PNG·JPG.' },
    { id: 'fg-07-10', type: 'mcq', source: '실무 팁', question: '레이어 이름을 "Frame 123" 대신 의미 있게 짓는 이유로 거리가 먼 것은?', choices: ['Smart Animate 매칭', 'Dev Mode에서 개발자가 구조 파악', '레이어 검색', '파일 용량 감소'], answer: 3, explanation: '용량과는 상관없어요.' },
    { id: 'fg-07-11', type: 'ox', source: '실무 팁', question: '버전 기록에 이름을 붙여 저장해 두면 특정 시점으로 쉽게 돌아갈 수 있다.', answer: true, explanation: 'File → Save to version history.' },
  ],
}

export default topic

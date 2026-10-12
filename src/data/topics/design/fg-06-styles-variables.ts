import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fg-06-styles-variables',
  track: 'design',
  group: '피그마',
  title: '피그마 6. 스타일과 변수(Variables)',
  order: 206,
  sections: [
    {
      title: '스타일(Styles)',
      points: [
        '색(Color), 텍스트(Text), 효과(Effect: 그림자·블러), 그리드(Layout grid) 묶음을 이름 붙여 재사용',
        '스타일을 수정하면 쓰는 곳 전체가 바뀐다',
        '색 스타일은 그라데이션·이미지 채우기, 여러 겹 채우기도 담을 수 있다',
        '텍스트 스타일은 폰트·크기·굵기·행간·자간을 한 번에 — 이 프로젝트의 KR/Title/SemiBold/24 같은 이름',
      ],
    },
    {
      title: '변수(Variables)',
      points: [
        '타입: Color, Number, String, Boolean',
        'Number 변수는 간격·radius·크기에, String은 텍스트, Boolean은 보이기/숨기기에 바인딩',
        '변수는 다른 변수를 참조(Alias)할 수 있다: brand/500 → button/bg',
        'Collection(묶음) 안에 변수를 만들고 그룹은 "/"로',
        '프로토타입에서 Set variable 액션으로 값을 바꿔 상태 표현 (장바구니 수 증가 등)',
      ],
    },
    {
      title: '모드(Modes)',
      points: [
        '한 Collection에 Light / Dark 같은 여러 모드를 두고 변수마다 모드별 값을 지정',
        '프레임에 모드를 지정하면 그 안의 모든 바인딩이 해당 모드 값으로 바뀐다',
        '활용: 라이트/다크 테마, 브랜드별 색, 모바일/PC 간격, 언어별 문구',
      ],
    },
    {
      title: '토큰 설계',
      points: [
        'Primitive(원시) 토큰: orange/500 = #E8590C 같은 실제 값',
        'Semantic(의미) 토큰: button/primary/bg → orange/500 처럼 용도 이름이 원시 토큰을 참조',
        '컴포넌트에는 의미 토큰만 바인딩 → 테마를 바꿀 때 의미 토큰의 참조만 바꾸면 된다',
        '개발의 CSS 변수(--color-brand)·Tailwind 테마 토큰과 1:1로 맞추면 전달이 쉽다',
      ],
    },
    {
      title: '스타일 vs 변수',
      points: [
        '변수: 단일 값(색 하나, 숫자 하나), 모드 지원, 다른 변수 참조 가능',
        '스타일: 여러 속성 묶음(텍스트 스타일, 그림자 여러 겹, 그라데이션) — 변수로 대체 불가한 부분',
        '실무: 색·간격·radius는 변수, 타이포·그림자는 스타일 (스타일 안 값에 변수를 연결하기도 함)',
      ],
    },
  ],
  questions: [
    { id: 'fg-06-01', type: 'mcq', source: '스타일(Styles)', question: '피그마 스타일 종류가 아닌 것은?', choices: ['Color', 'Text', 'Effect', 'Boolean'], answer: 3, explanation: 'Boolean은 변수 타입이에요. 스타일은 Color, Text, Effect, Grid.' },
    { id: 'fg-06-02', type: 'ox', source: '스타일(Styles)', question: '텍스트 스타일 하나에 폰트·크기·굵기·행간·자간이 함께 저장된다.', answer: true, explanation: '그래서 타이포 체계는 텍스트 스타일로 관리해요.' },
    { id: 'fg-06-03', type: 'mcq', source: '변수(Variables)', question: '피그마 변수 타입이 아닌 것은?', choices: ['Color', 'Number', 'String', 'Gradient'], answer: 3, explanation: 'Color, Number, String, Boolean 네 가지. 그라데이션은 스타일로.' },
    { id: 'fg-06-04', type: 'mcq', source: '변수(Variables)', question: '버튼 radius 12, 카드 padding 16 같은 값을 바인딩하기 좋은 변수 타입은?', choices: ['Color', 'Number', 'String', 'Boolean'], answer: 1, explanation: '간격·radius·크기는 Number 변수.' },
    { id: 'fg-06-05', type: 'ox', source: '변수(Variables)', question: '변수는 다른 변수를 참조(Alias)하도록 만들 수 있다.', answer: true, explanation: 'button/bg → brand/500처럼 의미 토큰이 원시 토큰을 참조해요.' },
    { id: 'fg-06-06', type: 'mcq', source: '모드(Modes)', question: '같은 화면을 라이트/다크 테마로 전환해 보는 가장 좋은 방법은?', choices: ['화면을 복제해 색을 하나씩 바꾼다', '변수 Collection에 Light/Dark 모드를 두고 프레임의 모드를 바꾼다', '스타일을 두 벌 만든다', '플러그인만 가능'], answer: 1, explanation: '프레임에 모드를 지정하면 안의 바인딩이 모두 그 모드 값으로 바뀌어요.' },
    { id: 'fg-06-07', type: 'mcq', source: '모드(Modes)', question: '변수 모드의 활용으로 맞지 않는 것은?', choices: ['라이트/다크 테마', '브랜드별 색', '모바일/PC 간격', '레이어 순서 변경'], answer: 3, explanation: '모드는 변수 값의 묶음 전환이에요.' },
    { id: 'fg-06-08', type: 'mcq', source: '토큰 설계', question: '컴포넌트에 바인딩하기 좋은 토큰은?', choices: ['Primitive 토큰 (orange/500)', 'Semantic 토큰 (button/primary/bg)', 'HEX 값 직접 입력', '아무거나'], answer: 1, explanation: '의미 토큰만 바인딩하면 테마를 바꿀 때 참조만 바꾸면 돼요.' },
    { id: 'fg-06-09', type: 'essay', source: '토큰 설계', question: 'Primitive 토큰과 Semantic 토큰을 나누는 이유를 설명해 보세요.', answer: 'Primitive는 orange/500처럼 실제 값, Semantic은 button/primary/bg처럼 용도 이름으로 원시 토큰을 참조한다. 컴포넌트는 의미 토큰만 쓰기 때문에 브랜드색 변경이나 다크 모드에서 의미 토큰의 참조만 바꾸면 전체가 일관되게 바뀐다. CSS 변수나 Tailwind 테마와 이름을 맞추면 개발 전달도 쉽다.', keywords: ['실제 값', '용도 이름', '참조만 변경'], explanation: '값과 용도를 분리하는 게 핵심.' },
    { id: 'fg-06-10', type: 'mcq', source: '스타일 vs 변수', question: '여러 겹의 그림자를 하나로 재사용하려면?', choices: ['Number 변수', 'Effect 스타일', 'Boolean 변수', 'String 변수'], answer: 1, explanation: '여러 속성 묶음은 스타일. 변수는 단일 값.' },
    { id: 'fg-06-11', type: 'ox', source: '스타일 vs 변수', question: '변수는 모드를 지원하지만 스타일은 모드가 없다.', answer: true, explanation: '그래서 색·간격처럼 테마에 따라 바뀌는 값은 변수로 관리해요.' },
  ],
}

export default topic

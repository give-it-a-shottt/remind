import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-08-font',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '8강 - 폰트와 텍스트 (font)',
  order: 8,
  notionId: '3efdf951bf8081989dc4e0bb020db59b',
  sections: [
    { title: 'font 속성', points: ['font-family는 앞에서부터 사용 가능한 폰트를 씀, 마지막엔 계열(sans-serif, serif)', '띄어쓰기가 있는 폰트 이름은 따옴표', 'font-weight 100~900 (normal=400, bold=700)', 'line-height는 단위 없이 (1.6 = 글자 크기의 1.6배) 쓰는 게 상속할 때 안전'], code: `body {
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}` },
    { title: '웹폰트', points: ['사용자 컴퓨터에 없는 폰트도 웹에서 불러와 보여줌', 'Google Fonts: <link> 복사', '직접 파일: @font-face (woff2 권장)', 'font-display: swap → 로딩 전에도 기본 폰트로 글자를 먼저 보여줌', '한글 폰트는 용량이 커서 필요한 굵기만, 상업적 사용 전 라이선스 확인'] },
    { title: '텍스트 속성', points: ['text-align, text-decoration(underline, line-through), text-transform(uppercase)', 'letter-spacing 자간 / word-spacing / text-indent / text-shadow', '한글은 letter-spacing을 살짝 음수로 주면 단정해 보이는 경우가 많음', 'word-break: keep-all → 한글 단어 중간에서 안 끊김'] },
    { title: '말줄임 (...) 처리', points: ['한 줄: white-space: nowrap + overflow: hidden + text-overflow: ellipsis', '여러 줄: display: -webkit-box + -webkit-line-clamp + -webkit-box-orient: vertical + overflow: hidden'], code: `.title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }` },
  ],
  questions: [
    { id: 'fe-08-01', type: 'mcq', source: 'font 속성', question: 'font-family 마지막에 sans-serif 같은 "계열"을 넣는 이유는?', choices: ['글자를 굵게 하려고', '앞의 폰트가 모두 없을 때 비슷한 계열로 대체하려고', '웹폰트를 내려받으려고', '자간을 줄이려고'], answer: 1, explanation: 'font-family는 앞에서부터 사용 가능한 폰트를 고르고, 모두 없으면 마지막 계열의 기본 폰트를 써요.' },
    { id: 'fe-08-02', type: 'short', source: 'font 속성', question: 'font-weight: bold 를 숫자로 쓰면?', answer: ['700'], explanation: 'normal = 400, bold = 700.' },
    { id: 'fe-08-03', type: 'ox', source: 'font 속성', question: 'line-height는 단위 없이(1.6) 쓰는 것이 상속할 때 안전하다.', answer: true, explanation: '단위 없는 값은 자식이 자기 글자 크기 기준으로 다시 계산해요. px/em으로 쓰면 계산된 고정값이 상속돼서 어긋날 수 있어요.' },
    { id: 'fe-08-04', type: 'short', source: '웹폰트', question: '웹폰트 로딩 전에도 기본 폰트로 글자를 먼저 보여주는 font-display 값은?', answer: ['swap'], explanation: 'font-display: swap — 빈 화면(FOIT) 대신 기본 폰트를 먼저 보여줘요.' },
    { id: 'fe-08-05', type: 'mcq', source: '웹폰트', question: '한글 웹폰트 사용 시 주의할 점으로 거리가 먼 것은?', choices: ['필요한 굵기만 불러오기', 'woff2 형식 권장', '상업적 사용 전 라이선스 확인', '반드시 모든 굵기를 다 불러오기'], answer: 3, explanation: '한글 폰트는 용량이 커서 필요한 굵기만 불러와야 해요.' },
    { id: 'fe-08-06', type: 'short', source: '텍스트 속성', question: '한글이 단어 중간에서 끊기지 않게 하는 속성은? (속성: 값)', answer: ['word-break: keep-all', 'word-break:keep-all'], explanation: 'word-break: keep-all.' },
    { id: 'fe-08-07', type: 'mcq', source: '텍스트 속성', question: '할인 전 가격에 가로줄을 긋는 값은?', choices: ['text-decoration: underline', 'text-decoration: line-through', 'text-transform: strike', 'font-style: line'], answer: 1, explanation: 'line-through = 취소선.' },
    { id: 'fe-08-08', type: 'mcq', source: '말줄임 (...) 처리', question: '한 줄 말줄임에 필요한 세 속성 조합은?', choices: ['white-space: nowrap + overflow: hidden + text-overflow: ellipsis', 'display: block + width: 100% + ellipsis', 'overflow: scroll + text-overflow: clip', 'line-clamp: 1만'], answer: 0, explanation: '줄바꿈 막기 + 넘친 부분 숨기기 + ...표시.' },
    { id: 'fe-08-09', type: 'short', source: '말줄임 (...) 처리', question: '여러 줄 말줄임에서 줄 수를 정하는 속성은?', answer: ['-webkit-line-clamp', 'line-clamp'], explanation: 'display: -webkit-box + -webkit-line-clamp: 2 + -webkit-box-orient: vertical + overflow: hidden.' },
  ],
}

export default topic

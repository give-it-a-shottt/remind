import type { Topic } from '../../types'

const topic: Topic = {
  id: 'ps-03-blending',
  track: 'design',
  group: '포토샵',
  title: '포토샵 3. 블렌딩 모드 · Opacity · Levels',
  order: 103,
  notionId: '3f3df951bf808002ad47dbe48a173071',
  sections: [
    {
      title: 'Blending Mode',
      points: [
        '선택한 레이어(위)와 아래 레이어의 픽셀을 계산식으로 혼합해 시각 효과를 만드는 기능',
        '모드 목록에 마우스를 올리면 결과가 미리 보인다',
      ],
    },
    {
      title: '계열별 정리',
      points: [
        'Darken 계열 (Multiply): 항상 어두워짐, 중립색 흰색',
        'Lighten 계열 (Screen, Color Dodge, Linear Dodge(Add)): 항상 밝아짐, 중립색 검정',
        'Contrast 계열 (Overlay, Soft Light): 밝은 곳은 더 밝게·어두운 곳은 더 어둡게, 중립색 50% 회색',
        'Component 계열 (Hue, Saturation, Color, Luminosity): 색상·채도·명도 중 일부 성분만',
        '검정 배경 소스(불꽃·빛·보케) → Screen / 흰 배경 소스(종이·잉크·스캔) → Multiply / 질감만 → Overlay·Soft Light',
      ],
    },
    {
      title: '실습: 블렌딩 모드 연습 세트 합성',
      points: [
        '베이스: 어두운 숲 + 인물 실루엣 + 노을 하늘 (명암 대비가 강해 효과 비교가 쉬움)',
        '불꽃/보케(검정 배경): Screen이 가장 자연스럽고, Color Dodge·Linear Dodge는 더 강하고 쨍하게',
        '구겨진 종이 질감: Multiply(진하게, 오래된 사진), Overlay(대비↑, 빈티지 포스터), Soft Light(은은하게 바랜 사진)',
        '최종: 불꽃 Screen 80% → 질감 Overlay 60% → 베이스. 너무 강하면 Opacity로 조절',
      ],
    },
    {
      title: 'Opacity(불투명도)',
      points: [
        '100% 완전히 보임, 50% 반투명, 0% 완전 투명',
        '블렌딩 모드의 효과 세기 조절용으로 같이 쓴다',
        'Move Tool(V)에서 숫자키: 1 = 10%, 5 = 50%, 0 = 100%, 빠르게 4·5 = 45%',
      ],
    },
    {
      title: 'Levels(레벨)',
      points: [
        '밝기·대비·색조를 히스토그램을 보며 어두운/중간/밝은 영역으로 조정. 단축키 Ctrl + L (Mac: Cmd + L)',
        'Curves와 비슷하지만 3단계로만 조정해 더 쉽다',
        '히스토그램: 가로 = 밝기(0 검정 ~ 255 흰색), 세로 = 해당 밝기의 픽셀 수',
        '슬라이더 오른쪽 → 어두워짐, 왼쪽 → 밝아짐',
        '어둡게 81/1.00/255, 밝게 0/1.00/176, 대비 31/1.00/176',
        '검정 81 = 0~81 픽셀이 전부 완전한 검정 → 디테일 손실(클리핑). Alt + 드래그로 미리 보기',
        'Output Levels는 범위를 좁혀 대비를 낮춤 (물 빠진 톤)',
        '[Image] → [Adjustments] → [Levels]는 원본을 직접 바꿈, 조정 레이어로 추가하면 나중에 수정 가능',
      ],
    },
    {
      title: '다시 봐야할 문제',
      points: [
        '3분할 이미지를 통째로 얹음 → 블렌딩은 같은 위치 픽셀끼리 계산. 패널마다 선택 → Ctrl + J로 분리 → Ctrl + T로 맞춤',
        'Color Dodge가 어두운 숲에서 안 보임 → 아래 밝기를 키우는 방식이라 아래가 검정이면 결과도 검정 → Screen·Linear Dodge',
        'Overlay로 종이 질감을 얹었더니 누렇게 → Shift + Ctrl + U(Desaturate)로 흑백 처리',
        '특수 8개 모드(Color/Linear Burn, Color/Linear Dodge, Vivid/Linear Light, Hard Mix, Difference)는 Fill과 Opacity가 다르게 계산 → Fill도 비교',
        '블렌딩 목록 비활성화 → 잠긴 Background 선택 중. 위에 얹는 레이어에 적용하거나 자물쇠 해제',
      ],
    },
    {
      title: '면접 숙제',
      points: [
        '웹 구현: CSS mix-blend-mode(요소끼리), background-blend-mode(배경끼리) — 이미지로 합치면 렌더 부담 없음, CSS면 동적 처리 가능',
        '비파괴 편집: 원본은 그대로 두고 보정을 별도 레이어로',
        'Levels는 3점, Curves는 여러 점으로 특정 구간 정밀 조정 (Levels = Curves 단순화 버전)',
        'Opacity는 레이어 스타일까지 투명하게, Fill은 내용만 투명하게 하고 스타일 유지',
      ],
    },
    {
      title: '복습',
      points: [
        '불꽃(검정 배경) → Screen, 잉크 스캔(흰 배경) → Multiply',
        'Overlay·Soft Light 중립색은 50% 회색, Soft Light가 더 부드러움',
        'Levels 대비: 검정은 오른쪽, 흰색은 왼쪽',
      ],
    },
  ],
  questions: [
    { id: 'ps-03-01', type: 'ox', source: 'Blending Mode', question: '블렌딩 모드는 선택한 레이어와 그 아래 레이어의 픽셀을 계산식으로 혼합한다.', answer: true, explanation: '모드 목록에 마우스를 올리면 결과를 미리 볼 수 있어요.' },
    { id: 'ps-03-02', type: 'mcq', source: '계열별 정리', question: 'Multiply 모드에서 사라지는 중립색은?', choices: ['검정', '흰색', '50% 회색', '빨강'], answer: 1, explanation: 'Darken 계열은 흰색이 사라지고 항상 어두워져요.' },
    { id: 'ps-03-03', type: 'mcq', source: '계열별 정리', question: '검정 배경의 불꽃 이미지를 얹을 때 가장 자연스러운 모드는?', choices: ['Multiply', 'Screen', 'Overlay', 'Luminosity'], answer: 1, explanation: 'Lighten 계열의 중립색이 검정이라 배경은 사라지고 빛만 남아요.' },
    { id: 'ps-03-04', type: 'mcq', source: '계열별 정리', question: 'Overlay와 Soft Light의 중립색은?', choices: ['흰색', '검정', '50% 회색', '없음'], answer: 2, explanation: 'Contrast 계열 — 50% 회색 기준으로 명암만 더해져요.' },
    { id: 'ps-03-05', type: 'mcq', source: '계열별 정리', question: '색상·채도·명도 중 일부 성분만 가져오는 계열의 모드가 아닌 것은?', choices: ['Hue', 'Color', 'Luminosity', 'Screen'], answer: 3, explanation: 'Screen은 Lighten 계열이에요.' },
    { id: 'ps-03-06', type: 'mcq', source: '실습: 블렌딩 모드 연습 세트 합성', question: '구겨진 종이 질감을 "은은하게 바랜 사진" 느낌으로 얹고 싶다면?', choices: ['Multiply', 'Overlay', 'Soft Light', 'Color Dodge'], answer: 2, explanation: 'Soft Light는 Overlay보다 약하고 부드러워요. Multiply는 진하게, Overlay는 대비 강하게.' },
    { id: 'ps-03-07', type: 'ox', source: '실습: 블렌딩 모드 연습 세트 합성', question: '블렌딩 효과가 너무 강하면 해당 레이어의 Opacity로 세기를 조절한다.', answer: true, explanation: '최종: 불꽃 Screen 80%, 질감 Overlay 60%.' },
    { id: 'ps-03-08', type: 'mcq', source: 'Opacity(불투명도)', question: 'Move Tool 상태에서 숫자 5를 누르면 선택 레이어의 Opacity는?', choices: ['5%', '50%', '500%', '변화 없음'], answer: 1, explanation: '1 = 10%, 5 = 50%, 0 = 100%, 빠르게 4·5 = 45%.' },
    { id: 'ps-03-09', type: 'short', source: 'Levels(레벨)', question: 'Levels를 바로 여는 단축키는? (Windows)', answer: ['Ctrl + L', 'Ctrl+L'], explanation: 'Mac은 Cmd + L. 단, 이 방식은 원본에 직접 적용돼요.' },
    { id: 'ps-03-10', type: 'mcq', source: 'Levels(레벨)', question: 'Levels로 대비를 키우는 방법은?', choices: ['검정·흰색 슬라이더를 모두 오른쪽으로', '검정은 오른쪽, 흰색은 왼쪽으로 (예: 31/1.00/176)', '회색만 왼쪽으로', 'Output Levels 범위를 좁히기'], answer: 1, explanation: '양쪽을 안으로 → 어두운 곳은 더 어둡게, 밝은 곳은 더 밝게.' },
    { id: 'ps-03-11', type: 'ox', source: 'Levels(레벨)', question: 'Levels에서 슬라이더를 오른쪽으로 옮기면 해당 영역이 밝아진다.', answer: false, explanation: '오른쪽 → 어두워짐, 왼쪽 → 밝아짐.' },
    { id: 'ps-03-12', type: 'mcq', source: 'Levels(레벨)', question: '검정 슬라이더를 81로 옮겼을 때 생기는 부작용은?', choices: ['색이 바뀐다', '0~81 픽셀이 전부 완전한 검정이 되어 그 구간 디테일이 사라진다', '파일이 커진다', '흰색이 사라진다'], answer: 1, explanation: '클리핑. Alt 누른 채 드래그하면 날아가는 영역을 미리 볼 수 있어요.' },
    { id: 'ps-03-13', type: 'mcq', source: 'Levels(레벨)', question: 'Levels 히스토그램의 가로축은?', choices: ['픽셀 수', '밝기 (0 검정 ~ 255 흰색)', '색상', '시간'], answer: 1, explanation: '세로축이 해당 밝기의 픽셀 수예요.' },
    { id: 'ps-03-14', type: 'mcq', source: '다시 봐야할 문제', question: 'Color Dodge를 걸었는데 어두운 숲 위에서 불꽃이 거의 안 보인다. 이유는?', choices: ['Opacity가 낮아서', '아래 레이어의 밝기를 키우는 방식이라 아래가 검정이면 결과도 검정', '레이어가 잠겨서', '해상도가 낮아서'], answer: 1, explanation: '어두운 영역에도 빛을 넣으려면 Screen이나 Linear Dodge(Add).' },
    { id: 'ps-03-15', type: 'mcq', source: '다시 봐야할 문제', question: 'Overlay로 베이지 종이 질감을 얹었더니 사진이 누렇게 변했다. 해결은?', choices: ['Multiply로 변경', '질감 레이어를 Desaturate(Shift + Ctrl + U)로 흑백 처리', 'Opacity 100%', '레이어 순서 변경'], answer: 1, explanation: '색 정보를 빼고 명암만 남겨서 합성해요.' },
    { id: 'ps-03-16', type: 'mcq', source: '다시 봐야할 문제', question: '블렌딩 모드 목록이 회색으로 비활성화되어 있다. 원인은?', choices: ['모드가 너무 많아서', '잠긴 Background 레이어를 선택한 상태', '파일이 JPG라서', 'Opacity가 0%'], answer: 1, explanation: 'Background는 블렌딩·Opacity를 바꿀 수 없어요. 위에 얹는 레이어에 적용.' },
    { id: 'ps-03-17', type: 'ox', source: '다시 봐야할 문제', question: '3분할 이미지를 한 장 그대로 얹어도 블렌딩은 패널별로 알아서 계산된다.', answer: false, explanation: '블렌딩은 같은 위치 픽셀끼리 계산해요. 패널마다 Ctrl + J로 분리하고 Ctrl + T로 맞춰야 해요.' },
    { id: 'ps-03-18', type: 'mcq', source: '면접 숙제', question: '웹에서 요소끼리 블렌딩 모드를 적용하는 CSS 속성은?', choices: ['filter', 'mix-blend-mode', 'opacity', 'mask'], answer: 1, explanation: '배경 레이어끼리는 background-blend-mode.' },
    { id: 'ps-03-19', type: 'mcq', source: '면접 숙제', question: 'Opacity와 Fill의 차이는?', choices: ['같다', 'Opacity는 스타일까지 투명하게, Fill은 내용만 투명하게 하고 스타일 유지', 'Fill은 텍스트에만', 'Opacity는 배경에만'], answer: 1, explanation: '특수 8개 블렌딩 모드에서는 결과도 달라져요.' },
    { id: 'ps-03-20', type: 'essay', source: '면접 숙제', question: 'Levels와 Curves의 차이를 설명해 보세요.', answer: '둘 다 입력 밝기를 출력 밝기로 매핑한다. Levels는 검정·중간·흰색 3점만 조정하고, Curves는 곡선 위에 여러 점을 찍어 특정 구간만 정밀하게 조정할 수 있다. Levels는 Curves의 단순화 버전이다.', keywords: ['3점', '여러 점', '단순화'], explanation: 'Levels가 더 쉽고, Curves가 더 정밀해요.' },
    { id: 'ps-03-21', type: 'mcq', source: '복습', question: '흰 종이 위 잉크 스캔본을 얹어 잉크만 남기려면?', choices: ['Screen', 'Multiply', 'Overlay', 'Hue'], answer: 1, explanation: 'Multiply의 중립색이 흰색이라 종이는 사라지고 잉크만 남아요.' },
  ],
}

export default topic

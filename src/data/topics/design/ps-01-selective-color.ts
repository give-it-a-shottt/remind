import type { Topic } from '../../types'

const topic: Topic = {
  id: 'ps-01-selective-color',
  track: 'design',
  group: '포토샵',
  title: '포토샵 1. 조정 레이어 & Selective Color',
  order: 101,
  notionId: '3efdf951bf8080beb779ecde4838b7ce',
  sections: [
    {
      title: '도형을 이용한 폴라로이드 프레임',
      points: [
        '강아지 사진, 종이 배경, 빨간 리본 소스로 동물 소개 이미지 만들기',
        '사각형 도형으로 폴라로이드 프레임을 만들고 그 위에 사진을 배치하는 실습',
      ],
    },
    {
      title: '조정 레이어(Adjustment Layer)',
      points: [
        '이미지 위쪽에 추가해서 원본을 훼손하지 않고 색상·톤을 조정 — 아래에 있는 이미지가 보정된다',
        '원본 자체를 바꾸려면 [Image] → [Adjustments] 메뉴',
        '추가: [Layers] 패널 → [Create new fill or adjustment layer] 아이콘',
        '눈 아이콘을 껐다 켜면 보정 전/후 비교',
        'Selective Color(특정 색 계열만 조정), Curves(곡선으로 밝기·대비), Vibrance(채도 낮은 색 위주로 생동감)',
      ],
    },
    {
      title: '1. 파일 열고 수평 맞추기 (Open vs Place)',
      points: [
        'Ctrl + O로 열기 → Crop Tool(C) → 옵션 바 [Straighten] → 수평선을 따라 드래그 → Enter',
        'Open: 새 작업 창, 파일 원본 크기대로 작업 영역',
        'Place: 이미 열린 작업 창에 새 레이어로 가져옴',
      ],
    },
    {
      title: '2. Selective Color로 색감 보정',
      points: [
        '하늘·바다: Cyans → Yellow -100%, Black +35% / 더 진한 파랑: Blues → Yellow -80%, Black +20%',
        '잔디: Yellows → Magenta -75%, Black +35% / 버스 빨강 강조: Reds → Cyan -80%',
        'Black을 올리면 색의 농도가 진해진다',
        '초기화: 슬라이더 삼각형 더블클릭(그 값만), 패널 아래 재설정 아이콘(전체)',
      ],
    },
    {
      title: '3. Curves로 밝기 조절',
      points: [
        '곡선 위쪽 1/4 지점에 조절점 → 살짝 위로 → 전체가 밝아짐',
        '그래프 뒤 회색 영역 = 히스토그램(밝기 분포)',
        'x = 입력(원본 밝기), y = 출력(보정 밝기)',
        '위로 = 밝게, 아래로 = 어둡게, S자 = 대비 강조',
      ],
    },
    {
      title: '보색',
      points: [
        '섞었을 때 무채색이 되는 두 색, 색상환에서 마주 보는 색',
        'Red ↔ Cyan, Green ↔ Magenta, Blue ↔ Yellow',
        'Blues를 고르고 보색 Yellow를 낮추면 더 파랗게',
        '잔디는 Yellows에서 Green의 보색 Magenta를 낮춰 녹색 강조',
      ],
    },
    {
      title: '잔디 색을 Yellows로 보정하는 이유',
      points: [
        '자연의 풀·나무는 순수 초록보다 노란 기운이 섞인 연두~올리브 → Greens는 반응이 적고 Yellows가 대부분 잡힌다',
        'Cyan + Yellow = Green → Yellows에서 Cyan(+)이면 짙은 초록, Cyan(-)이면 붉은 단풍 톤',
      ],
    },
    {
      title: 'Relative vs Absolute',
      points: [
        'Relative(기본값): 원래 색 양에 비례해 자연스럽게 → 풍경·인물',
        'Absolute: 색이 적은 곳에도 강제로 얹어 극적인 변화 → 강렬한 그래픽',
      ],
    },
    {
      title: 'Selective Color 슬라이더 4개의 의미',
      points: [
        '어떤 색을 빼면 그 보색이 올라온다',
        'Cyan(-) → Red ↑, Magenta(-) → Green ↑, Yellow(-) → Blue ↑',
        'Black(+) 묵직·짙게, (-) 밝고 투명하게',
        '양 끝에 Cyan–Red처럼 색 이름이 나오는 건 Color Balance 패널',
      ],
    },
    {
      title: '색 합성 공식',
      points: ['Yellow + Cyan = Green', 'Yellow + Magenta = Red / Orange', 'Cyan + Magenta = Blue / Purple'],
    },
    {
      title: '조정 레이어 마스크',
      points: ['조정 레이어 옆 흰 네모 = 마스크', '흰색 = 보정 적용, 검은색 = 보정 제외', '검은 브러시로 칠한 부분만 보정이 빠진다 (하늘만 보정하고 버스는 제외)'],
    },
    {
      title: 'Vibrance vs Saturation',
      points: ['Saturation: 모든 색을 똑같이 → 과하면 인위적', 'Vibrance: 채도 낮은 색 위주 → 자연스럽고 피부톤이 덜 망가짐'],
    },
    {
      title: '저장 팁',
      points: ['조정 레이어를 살리려면 .psd', '.jpg는 레이어가 합쳐져 나중에 수정 불가'],
    },
    {
      title: 'Curves 단축키 주의',
      points: ['Ctrl + M(Mac: Cmd + M)으로 Curves를 바로 열 수 있다', '이 방식은 조정 레이어가 아니라 원본에 직접 적용된다'],
    },
    {
      title: 'Selective Color 실전 레시피',
      points: [
        '여름 숲: Yellows → Cyan(+), Magenta(-) / 가을 숲: Yellows → Cyan(-), Magenta(+) / 무게감: Black(+)',
        '피부는 Reds·Yellows. 노란 기 빼기: Yellows → Yellow(-) / 홍조 잡기: Reds → Cyan(+) 또는 Magenta(-) / 맑은 피부: Black(-)',
        '에메랄드 바다: Cyans·Blues → Magenta(-), Yellow(-) / 짙은 남색 하늘: Blues → Cyan·Magenta·Black(+) / 노을: Reds·Yellows → Magenta·Yellow(+)',
        '무채색: Whites(밝은 영역)·Neutrals(중간톤)·Blacks(어두운 영역) — 전체 톤에 가장 강력',
        'Teal & Orange: Blacks → Cyan(+), Yellow(-) / Neutrals → Cyan(-), Yellow(+)',
        '매트한 블랙: Blacks → Black(-) 살짝 (필름 느낌)',
      ],
    },
  ],
  questions: [
    { id: 'ps-01-01', type: 'ox', source: '도형을 이용한 폴라로이드 프레임', question: '폴라로이드 프레임 실습은 사각형 도형으로 프레임을 만들고 그 위에 사진을 배치한다.', answer: true, explanation: '강아지 사진·종이 배경·리본 소스를 도형 프레임과 합성하는 실습이에요.' },
    { id: 'ps-01-02', type: 'mcq', source: '조정 레이어(Adjustment Layer)', question: '조정 레이어의 가장 큰 장점은?', choices: ['파일 용량이 줄어든다', '원본을 훼손하지 않고 보정할 수 있다', '자동으로 수평을 맞춘다', 'JPG에도 레이어가 남는다'], answer: 1, explanation: '보정을 별도 레이어로 얹어서, 언제든 수정·삭제·비교할 수 있어요.' },
    { id: 'ps-01-03', type: 'ox', source: '조정 레이어(Adjustment Layer)', question: '조정 레이어는 자기보다 "위에" 있는 레이어를 보정한다.', answer: false, explanation: '조정 레이어 아래에 있는 이미지가 보정돼요.' },
    { id: 'ps-01-04', type: 'mcq', source: '1. 파일 열고 수평 맞추기 (Open vs Place)', question: '이미 열린 작업 창에 이미지를 새 레이어로 가져오는 방법은?', choices: ['Open', 'Place', 'Crop', 'Straighten'], answer: 1, explanation: 'Open은 새 작업 창으로 열려요.' },
    { id: 'ps-01-05', type: 'mcq', source: '1. 파일 열고 수평 맞추기 (Open vs Place)', question: '기울어진 사진의 수평을 맞추는 방법은?', choices: ['Move Tool로 회전', 'Crop Tool(C) → [Straighten] → 수평선을 따라 드래그', 'Curves', 'Ctrl + T만 누르기'], answer: 1, explanation: 'Straighten으로 기준선을 그으면 그 선이 수평이 되도록 회전·자르기돼요.' },
    { id: 'ps-01-06', type: 'mcq', source: '2. Selective Color로 색감 보정', question: 'Selective Color에서 Black 값을 올리면?', choices: ['색이 밝아진다', '선택한 색의 농도가 더 진해진다', '흑백이 된다', '보색이 올라온다'], answer: 1, explanation: '하늘·잔디 보정에서 Black +35%로 색을 묵직하게 했어요.' },
    { id: 'ps-01-07', type: 'short', source: '2. Selective Color로 색감 보정', question: 'Selective Color 슬라이더 하나만 초기화하려면 무엇을 더블클릭할까요?', answer: ['삼각형', '고정점', '슬라이더 삼각형', '삼각형(고정점)'], explanation: '삼각형(고정점) 더블클릭 = 그 값만, 재설정 아이콘 = 전체.' },
    { id: 'ps-01-08', type: 'mcq', source: '3. Curves로 밝기 조절', question: 'Curves에서 S자 곡선의 효과는?', choices: ['전체가 밝아진다', '전체가 어두워진다', '밝은 곳은 더 밝게, 어두운 곳은 더 어둡게 (대비 강조)', '채도가 올라간다'], answer: 2, explanation: '위로 = 밝게, 아래로 = 어둡게, S자 = 대비.' },
    { id: 'ps-01-09', type: 'mcq', source: '3. Curves로 밝기 조절', question: 'Curves 그래프의 x축과 y축의 의미는?', choices: ['x: 출력, y: 입력', 'x: 입력(원본 밝기), y: 출력(보정 밝기)', 'x: 색상, y: 채도', 'x: 시간, y: 밝기'], answer: 1, explanation: '회색 영역은 히스토그램(밝기 분포).' },
    { id: 'ps-01-10', type: 'mcq', source: '보색', question: 'Blue의 보색은?', choices: ['Red', 'Cyan', 'Yellow', 'Magenta'], answer: 2, explanation: 'Red↔Cyan, Green↔Magenta, Blue↔Yellow.' },
    { id: 'ps-01-11', type: 'mcq', source: '보색', question: '하늘을 더 파랗게 하려면 Blues를 선택한 뒤 어떤 값을 낮출까?', choices: ['Cyan', 'Magenta', 'Yellow', 'Black'], answer: 2, explanation: 'Blue의 보색 Yellow를 빼면 파랑이 올라와요.' },
    { id: 'ps-01-12', type: 'essay', source: '잔디 색을 Yellows로 보정하는 이유', question: '잔디·나뭇잎을 Greens가 아니라 Yellows로 보정하는 이유를 설명해 보세요.', answer: '자연의 풀·나무는 순수 초록보다 노란 기운이 섞인 연두~올리브 계열이라 Greens는 반응이 적고 Yellows가 대부분의 식물 영역을 잡는다. 또 Cyan + Yellow = Green이라 Yellows에서 Cyan을 올리면(또는 Magenta를 빼면) 짙은 초록이 된다.', keywords: ['노란 기운', 'Cyan + Yellow = Green', 'Magenta'], explanation: 'Cyan을 빼면 반대로 붉은 단풍 톤이 돼요.' },
    { id: 'ps-01-13', type: 'mcq', source: 'Relative vs Absolute', question: '풍경·인물을 자연스럽게 보정할 때 추천하는 Selective Color 방식은?', choices: ['Relative', 'Absolute', '둘 다 같다', 'Color Balance'], answer: 0, explanation: 'Relative(기본값)는 원래 색 양에 비례해 부드럽게. Absolute는 극적인 변화용.' },
    { id: 'ps-01-14', type: 'mcq', source: 'Selective Color 슬라이더 4개의 의미', question: 'Selective Color에서 Magenta를 내리면(-) 올라오는 색은?', choices: ['Red', 'Green', 'Blue', 'Yellow'], answer: 1, explanation: '어떤 색을 빼면 그 보색이 올라와요. Magenta ↔ Green.' },
    { id: 'ps-01-15', type: 'ox', source: 'Selective Color 슬라이더 4개의 의미', question: '슬라이더 양 끝에 Cyan–Red처럼 색 이름이 표시되는 건 Selective Color 패널이다.', answer: false, explanation: '그건 Color Balance 패널이에요. Selective Color에는 양 끝 색 표시가 없어요.' },
    { id: 'ps-01-16', type: 'short', source: '색 합성 공식', question: 'Yellow + Cyan = ?', answer: ['Green', '초록', '녹색', 'green'], explanation: '그래서 잔디를 Yellows로 보정해요. Yellow + Magenta = Red/Orange, Cyan + Magenta = Blue/Purple.' },
    { id: 'ps-01-17', type: 'mcq', source: '조정 레이어 마스크', question: '조정 레이어 마스크에서 버스 부분만 보정을 빼려면?', choices: ['흰색 브러시로 버스를 칠한다', '검은색 브러시로 버스를 칠한다', '레이어를 삭제한다', 'Opacity를 0으로'], answer: 1, explanation: '흰색 = 적용, 검은색 = 제외.' },
    { id: 'ps-01-18', type: 'mcq', source: 'Vibrance vs Saturation', question: '인물 사진에서 피부톤을 덜 망가뜨리며 생동감을 올리려면?', choices: ['Saturation', 'Vibrance', 'Curves', 'Levels'], answer: 1, explanation: 'Vibrance는 채도 낮은 색 위주로 올려 자연스러워요. Saturation은 모든 색을 똑같이.' },
    { id: 'ps-01-19', type: 'ox', source: '저장 팁', question: '.jpg로 저장해도 나중에 조정 레이어를 다시 수정할 수 있다.', answer: false, explanation: 'jpg는 레이어가 합쳐져요. 조정 레이어를 살리려면 .psd.' },
    { id: 'ps-01-20', type: 'mcq', source: 'Curves 단축키 주의', question: 'Ctrl + M으로 Curves를 열면 생기는 차이는?', choices: ['조정 레이어로 추가된다', '원본에 직접 적용된다', '마스크가 생긴다', '새 문서가 열린다'], answer: 1, explanation: '[Image] → [Adjustments]와 같은 방식이라 원본이 바뀌어요. 비파괴 보정은 조정 레이어로.' },
    { id: 'ps-01-21', type: 'mcq', source: 'Selective Color 실전 레시피', question: '영화 같은 Teal & Orange 룩에서 그림자(Blacks)에 주는 조정은?', choices: ['Cyan(-), Yellow(+)', 'Cyan(+), Yellow(-)', 'Black(+)', 'Magenta(+)'], answer: 1, explanation: '그림자는 차가운 청록(Cyan +, Yellow -), 중간톤(Neutrals)은 따뜻하게(Cyan -, Yellow +).' },
    { id: 'ps-01-22', type: 'mcq', source: 'Selective Color 실전 레시피', question: '가을·빈티지 웜톤 숲을 만드는 Yellows 조정은?', choices: ['Cyan(+), Magenta(-)', 'Cyan(-), Magenta(+)', 'Black(-)만', 'Yellow(-)'], answer: 1, explanation: 'Cyan을 빼서 붉은빛, Magenta를 더해 주황·갈색. 여름 숲은 반대(Cyan +, Magenta -).' },
    { id: 'ps-01-23', type: 'ox', source: 'Selective Color 실전 레시피', question: '피부톤은 주로 Reds와 Yellows 영역에 속한다.', answer: true, explanation: '그래서 피부 보정은 Reds·Yellows에서 해요.' },
  ],
}

export default topic

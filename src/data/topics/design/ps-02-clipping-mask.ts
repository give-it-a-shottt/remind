import type { Topic } from '../../types'

const topic: Topic = {
  id: 'ps-02-clipping-mask',
  track: 'design',
  group: '포토샵',
  title: '포토샵 2. 클리핑 마스크 타이포 합성',
  order: 102,
  notionId: '3f0df951bf8080b6a520d09c38f3aa24',
  sections: [
    {
      title: '클리핑 마스크(Clipping Mask)',
      points: [
        '아래 레이어(마스크)의 픽셀 모양대로 위 레이어(이미지)가 보이는 기능 → 도형·텍스트 안에 이미지 채우기',
        '조건: 마스크 레이어에 픽셀 정보가 있어야 하고, 이미지 레이어 아래에 있어야 한다',
        '적용: Alt(Mac: Option) 누른 채 두 레이어 사이 클릭, 또는 위 레이어 선택 → Ctrl + Alt + G (Mac: Cmd + Option + G)',
        '적용되면 이미지 썸네일 앞에 꺾인 화살표, 마스크 레이어 이름에 밑줄',
        '실습: 인물 사진을 가이드라인 기준 반으로 나눠 왼쪽은 텍스트 안에 사진, 오른쪽은 인물 그대로 → 2000년대 잡지 느낌 타이포 포스터',
      ],
    },
    {
      title: 'Rulers & Guidelines / Select Subject',
      points: [
        'Rulers(눈금자) & Guidelines(가이드라인): 정렬과 배치를 돕는 도구',
        '[Select] → [Subject]: AI가 주요 피사체를 자동으로 선택',
      ],
    },
    {
      title: '1. 가이드라인 추가 후 피사체 선택',
      points: [
        'Ctrl + R로 눈금자 → 왼쪽 눈금자에서 중앙으로 드래그 (스냅으로 정확히 중앙)',
        '[Select] → [Subject] → Ctrl + J로 선택 영역을 새 레이어로 복제',
        '격자무늬 = 색상 정보가 없는 투명 영역. 투명 배경을 살리려면 PNG',
        '가이드 숨기기/표시 Ctrl + ;, 스냅 Shift + Ctrl + ;, 이동은 Move Tool(V), 삭제는 눈금자 안쪽으로 드래그',
        '가이드라인은 저장·인쇄 시 나타나지 않는다',
      ],
    },
    {
      title: '2. 클리핑 마스크의 마스크 준비',
      points: [
        'Rectangular Marquee(M)로 왼쪽 선택 → Layer 1에서 Delete (오른쪽 인물만 남음)',
        'Background 선택 → Ctrl + J → 원본 왼쪽이 Layer 2로',
        '선택 영역으로 삭제·복사할 때는 [Layers] 패널에서 지금 선택된 레이어가 기준 — 패널을 꼭 확인',
        'Type Tool(T): Wanted Sans ExtraBlack 170pt, 행간 160pt, 자간 -50, 흰색, 우측 정렬 / Ctrl + Enter로 입력 마침',
        'Move Tool에서 방향키 1px, Shift + 방향키 10px',
      ],
    },
    {
      title: '3. 클리핑 마스크로 텍스트 합성',
      points: [
        '텍스트 레이어를 Layer 2 아래로 (마스크는 아래, 이미지는 위)',
        '한 칸 위/아래 Ctrl + ] / [, 맨 앞/뒤 Ctrl + Shift + ] / [',
        'Alt + 레이어 사이 클릭 → 글자 안에만 사진',
        '[Solid Color] #e4ff00 → Color Fill을 Background 바로 위로 → 노란 배경 (썸네일 더블클릭으로 색 변경)',
      ],
    },
    {
      title: '최종 레이어 구조',
      points: [
        '위에서부터 Layer 1(오른쪽 인물) → Layer 2(왼쪽, 텍스트에 클리핑) → 텍스트(마스크) → Color Fill 1(배경) → Background(눈 끔)',
        '텍스트를 흰색으로 한 이유: 클리핑 마스크는 색이 아니라 모양만 본다 — 흰색은 위치 잡기 편해서',
        'Layer 2를 따로 복제한 이유: Layer 1은 왼쪽을 지웠고 Background는 잠겨 있어 클리핑할 수 없어서',
      ],
    },
    {
      title: '클리핑 마스크 vs 레이어 마스크',
      points: [
        '클리핑: 아래 레이어의 모양 기준, 레이어 2개 필요, 텍스트·도형 안에 이미지 채우기',
        '레이어 마스크: 흑백 기준(흰색 = 보임, 검정 = 숨김), 레이어 1개에 붙음, 브러시로 부분 가리기·자연스러운 경계',
      ],
    },
    {
      title: '클리핑 마스크 더 활용하기',
      points: [
        '해제: 다시 Alt + 레이어 사이 클릭 또는 Ctrl + Alt + G',
        '마스크 하나 위에 여러 레이어를 연달아 클리핑 가능 (사진 + 그라데이션)',
        '조정 레이어를 특정 레이어에 클리핑하면 그 레이어에만 보정 적용',
        '텍스트는 클리핑 후에도 수정 가능 → 사진이 자동으로 따라감',
      ],
    },
    {
      title: '타이포 합성이 예쁘게 나오는 조건',
      points: [
        '획이 굵을수록 사진이 많이 보임 → Black·ExtraBlack',
        '행간을 글자 크기보다 작게, 자간을 마이너스로 → 덩어리처럼 보여 이미지가 끊기지 않음',
        '배경은 사진 톤과 대비되는 색 — 차분한 사진 + 형광 노랑 같은 채도 대비',
      ],
    },
    {
      title: 'Subject 선택이 깔끔하지 않을 때',
      points: [
        '[Select] → [Select and Mask] (Alt + Ctrl + R)에서 다듬기',
        'Refine Edge Brush로 머리카락 경계를 문지르기',
        '비슷한 도구: Object Selection Tool, Quick Selection Tool (W)',
      ],
    },
    {
      title: '자간 단위',
      points: ['포토샵 자간(Tracking)은 1/1000 em 단위 → -50 = 글자 크기의 5%만큼 좁힘', '큰 제목일수록 자간이 넓어 보여 살짝 마이너스로 조인다'],
    },
    {
      title: '저장',
      points: ['레이어·클리핑 상태를 살리려면 .psd 원본 보관', '공유용은 .jpg, 투명 배경이 필요하면 .png'],
    },
  ],
  questions: [
    { id: 'ps-02-01', type: 'mcq', source: '클리핑 마스크(Clipping Mask)', question: '클리핑 마스크가 동작하는 조건으로 맞는 것은?', choices: ['마스크 레이어가 이미지 위에 있어야 한다', '마스크 레이어가 이미지 아래에 있고 픽셀 정보가 있어야 한다', '마스크가 흰색이어야 한다', 'Background 레이어여야 한다'], answer: 1, explanation: '아래 레이어의 픽셀 모양대로 위 레이어가 보여요.' },
    { id: 'ps-02-02', type: 'short', source: '클리핑 마스크(Clipping Mask)', question: '위 레이어를 선택하고 클리핑 마스크를 적용하는 단축키는? (Windows)', answer: ['Ctrl + Alt + G', 'Ctrl+Alt+G'], explanation: 'Mac은 Cmd + Option + G. 또는 Alt 누른 채 두 레이어 사이 클릭.' },
    { id: 'ps-02-03', type: 'ox', source: '클리핑 마스크(Clipping Mask)', question: '클리핑이 적용되면 이미지 레이어 썸네일 앞에 꺾인 화살표가 생긴다.', answer: true, explanation: '마스크 레이어 이름에는 밑줄이 생겨요.' },
    { id: 'ps-02-04', type: 'mcq', source: 'Rulers & Guidelines / Select Subject', question: 'AI가 사진의 주요 피사체를 자동으로 선택해 주는 메뉴는?', choices: ['[Select] → [All]', '[Select] → [Subject]', '[Image] → [Trim]', '[Layer] → [Mask]'], answer: 1, explanation: 'Select Subject.' },
    { id: 'ps-02-05', type: 'short', source: '1. 가이드라인 추가 후 피사체 선택', question: '포토샵에서 눈금자를 켜고 끄는 단축키는? (Windows)', answer: ['Ctrl + R', 'Ctrl+R'], explanation: 'Mac은 Cmd + R. 가이드 숨기기는 Ctrl + ;' },
    { id: 'ps-02-06', type: 'mcq', source: '1. 가이드라인 추가 후 피사체 선택', question: '레이어의 격자무늬(체크무늬) 부분은?', choices: ['흰색 배경', '색상 정보가 없는 투명 영역', '저장 오류', '가이드라인'], answer: 1, explanation: '투명 배경을 살리려면 PNG로 저장해요.' },
    { id: 'ps-02-07', type: 'ox', source: '1. 가이드라인 추가 후 피사체 선택', question: '가이드라인은 저장하거나 인쇄해도 이미지에 나타난다.', answer: false, explanation: '작업 중에만 보여요.' },
    { id: 'ps-02-08', type: 'mcq', source: '2. 클리핑 마스크의 마스크 준비', question: '선택 영역을 Delete했는데 엉뚱한 부분이 지워졌다. 가장 먼저 확인할 것은?', choices: ['브러시 크기', '[Layers] 패널에서 선택된 레이어', '파일 형식', '해상도'], answer: 1, explanation: '삭제·복사는 지금 선택된 레이어가 기준이에요. 화면만 믿지 말고 패널 확인.' },
    { id: 'ps-02-09', type: 'mcq', source: '2. 클리핑 마스크의 마스크 준비', question: 'Move Tool에서 Shift + 방향키를 누르면 몇 px 이동할까?', choices: ['1px', '5px', '10px', '100px'], answer: 2, explanation: '방향키 1px, Shift + 방향키 10px.' },
    { id: 'ps-02-10', type: 'mcq', source: '3. 클리핑 마스크로 텍스트 합성', question: '레이어를 맨 앞으로 보내는 단축키는? (Windows)', choices: ['Ctrl + ]', 'Ctrl + Shift + ]', 'Ctrl + [', 'Alt + ]'], answer: 1, explanation: 'Ctrl + ] 한 칸 위, Ctrl + Shift + ] 맨 앞. [는 반대 방향.' },
    { id: 'ps-02-11', type: 'ox', source: '3. 클리핑 마스크로 텍스트 합성', question: 'Color Fill 조정 레이어의 썸네일을 더블클릭하면 배경색을 언제든 바꿀 수 있다.', answer: true, explanation: 'Solid Color 레이어라 비파괴로 색만 바꿀 수 있어요.' },
    { id: 'ps-02-12', type: 'mcq', source: '최종 레이어 구조', question: '마스크용 텍스트를 흰색으로 한 진짜 이유는?', choices: ['흰색이어야 클리핑이 된다', '클리핑은 색이 아니라 모양만 봐서 아무 색이나 되고, 흰색은 위치 잡기 편해서', '흰색이 용량이 작아서', '배경이 노랑이라서'], answer: 1, explanation: '검정이어도 결과는 같아요.' },
    { id: 'ps-02-13', type: 'mcq', source: '최종 레이어 구조', question: 'Layer 2(원본 왼쪽)를 따로 복제한 이유는?', choices: ['용량을 줄이려고', 'Layer 1은 왼쪽을 지웠고 Background는 잠겨 있어 클리핑할 수 없어서', '색을 바꾸려고', '가이드 때문에'], answer: 1, explanation: '텍스트 안에 들어갈 사진 조각이 별도 레이어로 필요했어요.' },
    { id: 'ps-02-14', type: 'mcq', source: '클리핑 마스크 vs 레이어 마스크', question: '브러시로 부분적으로 가리고 경계를 자연스럽게 만들 때 적합한 것은?', choices: ['클리핑 마스크', '레이어 마스크', 'Opacity', 'Crop'], answer: 1, explanation: '레이어 마스크는 흑백 기준(흰 = 보임, 검정 = 숨김). 클리핑은 텍스트·도형 안 채우기에.' },
    { id: 'ps-02-15', type: 'mcq', source: '클리핑 마스크 더 활용하기', question: '인물만 밝게 하고 배경은 그대로 두려면 조정 레이어를 어떻게?', choices: ['맨 위에 둔다', '인물 레이어에 클리핑한다', 'Background에 병합한다', 'Opacity 0%'], answer: 1, explanation: '조정 레이어를 특정 레이어에 클리핑하면 그 레이어에만 적용돼요.' },
    { id: 'ps-02-16', type: 'ox', source: '클리핑 마스크 더 활용하기', question: '클리핑 후에도 텍스트 문구나 폰트를 수정할 수 있고, 사진이 자동으로 따라간다.', answer: true, explanation: '텍스트 레이어가 살아 있으니까요.' },
    { id: 'ps-02-17', type: 'mcq', source: '타이포 합성이 예쁘게 나오는 조건', question: '타이포 합성에서 사진이 끊기지 않고 덩어리처럼 보이게 하는 설정은?', choices: ['얇은 웨이트 + 넓은 자간', '굵은 웨이트 + 행간을 글자보다 작게 + 마이너스 자간', '이탤릭', '행간을 크게'], answer: 1, explanation: '170pt / 행간 160pt / 자간 -50처럼.' },
    { id: 'ps-02-18', type: 'mcq', source: 'Subject 선택이 깔끔하지 않을 때', question: '머리카락 경계를 다듬는 기능은?', choices: ['[Select] → [Select and Mask]의 Refine Edge Brush', 'Crop Tool', 'Levels', 'Free Transform'], answer: 0, explanation: '단축키 Alt + Ctrl + R.' },
    { id: 'ps-02-19', type: 'mcq', source: '자간 단위', question: '포토샵 자간 -50은 무엇을 의미할까?', choices: ['50px 좁힘', '글자 크기의 5%만큼 좁힘 (1/1000 em 단위)', '50% 좁힘', '0.5pt 좁힘'], answer: 1, explanation: '-50/1000 = 0.05em = 글자 크기의 5%.' },
    { id: 'ps-02-20', type: 'mcq', source: '저장', question: '투명 배경을 유지한 채 공유하려면 어떤 형식?', choices: ['.jpg', '.png', '.psd만', '.gif만'], answer: 1, explanation: '원본은 .psd, 공유용 .jpg, 투명 배경 .png.' },
  ],
}

export default topic

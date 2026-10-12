import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fe-06-background',
  track: 'frontend',
  group: 'HTML/CSS',
  title: '6강 - 배경 (background)',
  order: 6,
  notionId: '3efdf951bf8081de9d2fc4a98a7b758d',
  sections: [
    { title: '기본 속성', points: ['background-color, background-image: url()', 'background-repeat: repeat(기본) / no-repeat / repeat-x / repeat-y', 'background-position: center, left top, 50% 50% 등', 'url 경로는 CSS 파일 위치 기준 (css 폴더 안이면 ../images/...)'] },
    { title: 'background-size: cover vs contain', points: ['cover: 영역을 빈틈없이 채움, 비율 유지, 일부 잘릴 수 있음 → 히어로 배너', 'contain: 이미지 전체가 보이게, 비율 유지, 여백이 생길 수 있음 → 로고, 아이콘'] },
    { title: 'background-attachment: fixed', points: ['스크롤해도 배경 고정 → 간단한 패럴랙스 효과', '모바일(iOS 등)에서는 잘 동작하지 않을 수 있음'] },
    { title: '단축 속성', points: ['position과 size는 / 로 구분 (position / size)'], code: `background: #f6efe6 url("../images/bakery.jpg") no-repeat center / cover;` },
    { title: '그라디언트', points: ['linear-gradient(90deg, #ff9a8b, #ff6a88): 방향 + 색', 'radial-gradient(circle, ...): 원형'] },
    { title: '배경 위에 어두운 막 씌우기', points: ['배경을 쉼표로 여러 개 쓰면 앞에 쓴 게 위에 쌓임', '그라디언트 막 + 이미지로 글자 가독성 확보'], code: `.hero {
  background:
    linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)),
    url("../images/bakery.jpg") center / cover no-repeat;
}` },
    { title: 'img 태그 vs background-image', points: ['내용인 이미지(상품 사진, 프로필) → <img> + alt', '꾸미기용 이미지(패턴, 배너 배경) → background-image', '<img>를 cover처럼 쓰려면 object-fit: cover'] },
  ],
  questions: [
    { id: 'fe-06-01', type: 'ox', source: '기본 속성', question: 'CSS 파일 안 background-image의 url 경로는 HTML 파일 위치 기준이다.', answer: false, explanation: 'CSS 파일 위치 기준이에요. css 폴더 안의 CSS라면 ../images/... 처럼 써야 해요.' },
    { id: 'fe-06-02', type: 'short', source: '기본 속성', question: '배경 이미지를 반복하지 않게 하는 background-repeat 값은?', answer: ['no-repeat'], explanation: '기본값은 repeat(바둑판 반복).' },
    { id: 'fe-06-03', type: 'mcq', source: 'background-size: cover vs contain', question: '영역을 빈틈없이 채우되 일부가 잘릴 수 있는 값은? (히어로 배너용)', choices: ['contain', 'cover', 'auto', '100% auto'], answer: 1, explanation: 'cover = 꽉 채움(잘림 가능), contain = 전체 보임(여백 가능).' },
    { id: 'fe-06-04', type: 'ox', source: 'background-size: cover vs contain', question: '로고처럼 이미지 전체가 보여야 할 때는 contain이 적합하다.', answer: true, explanation: 'contain은 비율을 유지하며 이미지 전체를 보여줘요.' },
    { id: 'fe-06-05', type: 'mcq', source: 'background-attachment: fixed', question: 'background-attachment: fixed 의 효과와 주의점은?', choices: ['배경이 스크롤을 따라감 / 주의점 없음', '스크롤해도 배경 고정(패럴랙스) / iOS 등 모바일에서 잘 안 됨', '배경이 반복됨 / 성능 저하', '배경 크기 고정 / 반응형 불가'], answer: 1, explanation: 'fixed는 간단한 패럴랙스 효과를 주지만 모바일 지원이 불안정해요.' },
    { id: 'fe-06-06', type: 'mcq', source: '단축 속성', question: 'background 단축 속성에서 position과 size를 구분하는 기호는?', choices: [',', '/', '-', ':'], answer: 1, explanation: 'center / cover 처럼 position / size.' },
    { id: 'fe-06-07', type: 'short', source: '그라디언트', question: '왼쪽에서 오른쪽으로 가는 선형 그라디언트의 각도는? (deg 포함)', answer: ['90deg'], explanation: 'linear-gradient(90deg, ...) 는 왼→오. 0deg는 아래→위.' },
    { id: 'fe-06-08', type: 'mcq', source: '배경 위에 어두운 막 씌우기', question: '배경을 쉼표로 여러 개 쓰면 쌓이는 순서는?', choices: ['뒤에 쓴 것이 위에', '앞에 쓴 것이 위에', '무작위', '이미지가 항상 위에'], answer: 1, explanation: '앞에 쓴 배경이 맨 위 레이어. 그래서 어두운 그라디언트를 이미지 앞에 써요.' },
    { id: 'fe-06-09', type: 'essay', source: 'img 태그 vs background-image', question: '이미지를 <img>로 넣을지 background-image로 넣을지 판단하는 기준을 설명하세요.', answer: '이미지가 콘텐츠(의미)인지 장식인지로 나눈다. 상품 사진·프로필처럼 내용인 이미지는 <img>와 alt를 써서 스크린리더·검색엔진이 인식하게 하고, 패턴·배너 배경 같은 꾸밈용은 background-image로 넣는다. <img>를 영역에 꽉 채우고 싶으면 object-fit: cover를 쓴다.', keywords: ['콘텐츠 vs 장식', 'alt', 'object-fit'], explanation: '의미가 있으면 img, 꾸밈이면 background.' },
    { id: 'fe-06-10', type: 'short', source: 'img 태그 vs background-image', question: '<img>를 영역에 cover처럼 채우는 CSS 속성은? (속성: 값)', answer: ['object-fit: cover', 'object-fit:cover'], explanation: 'object-fit: cover — img 버전의 background-size: cover.' },
  ],
}

export default topic

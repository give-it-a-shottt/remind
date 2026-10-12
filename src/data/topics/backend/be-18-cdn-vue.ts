import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-18-cdn-vue',
  track: 'backend',
  group: 'Flask',
  title: '18강 - CDN & Vue + axios 연동',
  order: 18,
  notionId: '3efdf951bf8081deb46cd917937eab25',
  sections: [
    { title: 'CDN', points: ['Contents Delivery Network: 멀리 있는 사용자에게 콘텐츠를 더 빠르게', '사용자와 가까운 Cache Server에 저장해 두고 응답', '주요 JS/CSS를 내 서버 대신 CDN 주소로 연결하면 페이지 열 때 자동 다운로드'] },
    { title: '폴더 구성', points: ['vue 폴더와 flask 폴더를 나눔', 'vue_test.html에 부트스트랩 시작 템플릿 복사'] },
    { title: 'Vue 코드 추가 순서', points: ['1. Vue가 적용될 부분을 <div id="app">으로 감싸기', '2. </body> 바로 위에 Vue와 axios를 CDN으로 연결'] },
    { title: '버튼으로 Flask API 호출하기', points: ['v-on:click으로 클릭 시 실행할 함수 연결', 'axios(주소, { method: "get" }).then(...).catch(...)', '그대로 실행하면 CORS 에러 → 19강에서 해결'] },
  ],
  questions: [
    { id: 'be-18-01', type: 'mcq', source: 'CDN', question: 'CDN이 콘텐츠를 빠르게 전달하는 방법은?', choices: ['파일을 압축하지 않는다', '사용자와 가까운 캐시 서버에서 응답한다', '모든 요청을 원본 서버 한 곳에서 처리한다', 'HTTP 대신 FTP를 쓴다'], answer: 1, explanation: 'Contents Delivery Network — 가까운 Cache Server에 저장해 두고 응답.' },
    { id: 'be-18-02', type: 'ox', source: '폴더 구성', question: '강의 실습에서는 vue(프론트) 폴더와 flask(백엔드) 폴더를 나눠서 만든다.', answer: true, explanation: '프론트와 백엔드를 분리하면 서로 다른 출처(포트)가 되어 CORS가 필요해져요.' },
    { id: 'be-18-03', type: 'mcq', source: 'Vue 코드 추가 순서', question: 'Vue와 axios CDN <script>를 넣는 권장 위치는?', choices: ['<head> 맨 위', '</body> 바로 위', '<div id="app"> 안', '<title> 안'], answer: 1, explanation: 'HTML이 먼저 그려진 뒤 스크립트를 불러오도록 </body> 바로 위.' },
    { id: 'be-18-04', type: 'short', source: '버튼으로 Flask API 호출하기', question: 'Vue에서 버튼 클릭 시 함수를 연결하는 디렉티브는?', answer: ['v-on:click', '@click'], explanation: 'v-on:click="axios_test" (축약 @click).' },
    { id: 'be-18-05', type: 'mcq', source: '버튼으로 Flask API 호출하기', question: 'vue_test.html에서 localhost:8082 Flask API를 axios로 부르면 처음에 나는 에러는?', choices: ['404 Not Found', 'CORS 에러', 'SyntaxError', '500 에러'], answer: 1, explanation: '출처(포트)가 달라서 브라우저가 막아요 → flask_cors로 해결(19강).' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-19-cors',
  track: 'backend',
  group: 'Flask',
  title: '19강 - CORS & HTTP 요청 메서드',
  order: 19,
  notionId: '3efdf951bf8081598e39c4da0c36cf64',
  sections: [
    { title: 'Same Origin Policy', points: ['<img>, <link>로는 다른 도메인 파일도 가져올 수 있음', '하지만 <script>에서 보내는 HTTP 요청은 같은 출처에만', '같은 출처 = 프로토콜, 호스트명, 포트가 모두 같음'] },
    { title: 'CORS', points: ['Cross Origin Resource Sharing: 스크립트에서 다른 출처 데이터를 요청하기 위한 가이드', '에러 원인: 응답 헤더에 Access-Control-Allow-Origin이 없어서 브라우저가 막음'] },
    { title: 'flask_cors로 해결', points: ['pip install flask_cors', 'CORS(app) → 모든 응답에 CORS 허용 헤더'] },
    { title: '메서드별로 파라미터 받기 (Flask)', points: ["methods=['GET', 'POST', 'PUT', 'DELETE']", 'GET / PUT / DELETE → request.args.get()', 'POST → request.get_json()'] },
    { title: 'axios에서 보내는 방법 (프론트)', points: ['method에 요청 방식', 'GET / PUT / DELETE → params에 데이터', 'POST → data에 데이터', '응답은 response.data'] },
    { title: 'HTTP 요청 메서드 정리', points: ['HTML 폼은 GET과 POST만 지원', 'GET: 파라미터가 URL에 보임 / POST: HTTP body에 들어가 안 보임', '기능에 맞는 메서드를 쓰는 것을 권장 ("RESTful 하다")'] },
  ],
  questions: [
    { id: 'be-19-01', type: 'mcq', source: 'Same Origin Policy', question: '"같은 출처"를 판단하는 세 가지는?', choices: ['프로토콜, 호스트명, 포트', '도메인, 경로, 파일명', 'IP, 브라우저, OS', '프로토콜, 경로, 쿼리'], answer: 0, explanation: 'http://localhost:5000 과 http://localhost:8080 은 포트가 달라 다른 출처예요.' },
    { id: 'be-19-02', type: 'ox', source: 'Same Origin Policy', question: '<img src="다른 도메인 이미지"> 는 Same Origin Policy 때문에 막힌다.', answer: false, explanation: 'img, link 태그는 다른 도메인도 가져올 수 있어요. 막히는 건 스크립트에서 보내는 HTTP 요청.' },
    { id: 'be-19-03', type: 'short', source: 'CORS', question: 'CORS 에러가 나는 직접 원인이 되는, 응답에 없는 헤더 이름은?', answer: ['Access-Control-Allow-Origin'], explanation: '서버가 이 헤더로 허용 출처를 알려줘야 브라우저가 응답을 넘겨줘요.' },
    { id: 'be-19-04', type: 'mcq', source: 'flask_cors로 해결', question: 'flask_cors로 모든 응답에 CORS 허용 헤더를 넣는 코드는?', choices: ['app.cors = True', 'CORS(app)', '@cors', 'app.run(cors=True)'], answer: 1, explanation: 'from flask_cors import CORS → CORS(app).' },
    { id: 'be-19-05', type: 'mcq', source: '메서드별로 파라미터 받기 (Flask)', question: 'POST로 보낸 JSON 데이터를 Flask에서 꺼내는 함수는?', choices: ['request.args.get()', 'request.get_json()', 'request.form()', 'request.params()'], answer: 1, choiceExplanations: ['GET·PUT·DELETE의 URL 파라미터를 꺼낼 때 써요.', '정답. POST body의 JSON을 딕셔너리로.', '폼 데이터용이고 함수가 아니라 request.form[...] 속성이에요.', '없는 함수예요.'], explanation: 'GET/PUT/DELETE → request.args.get(), POST → request.get_json().' },
    { id: 'be-19-06', type: 'mcq', source: 'axios에서 보내는 방법 (프론트)', question: 'axios로 POST 요청 시 보낼 데이터를 넣는 옵션은?', choices: ['params', 'data', 'body', 'query'], answer: 1, explanation: 'POST → data, GET·PUT·DELETE → params. 응답은 response.data.' },
    { id: 'be-19-07', type: 'ox', source: 'HTTP 요청 메서드 정리', question: 'HTML <form>은 PUT과 DELETE 메서드도 지원한다.', answer: false, explanation: 'HTML 폼은 GET과 POST만. PUT·DELETE는 axios 같은 JS로 보내요.' },
    { id: 'be-19-08', type: 'mcq', source: 'HTTP 요청 메서드 정리', question: '파라미터가 URL에 보이지 않는 메서드는?', choices: ['GET', 'POST', 'DELETE', 'PUT'], answer: 1, explanation: 'POST는 HTTP body에 담겨요. (보이지 않을 뿐 암호화는 아님)' },
  ],
}

export default topic

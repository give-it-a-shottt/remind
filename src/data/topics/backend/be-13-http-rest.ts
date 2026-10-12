import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-13-http-rest',
  track: 'backend',
  group: 'Flask',
  title: '13강 - HTTP & REST API 개념',
  order: 13,
  notionId: '3efdf951bf8081bb922cd8bbf0ed803b',
  sections: [
    { title: 'HTTP', points: ['프로토콜 = 컴퓨터끼리 통신하기 위한 규칙', 'Client가 요청(Request)을 보내면 Server가 응답(Response)'] },
    { title: 'REST', points: ['REpresentational State Transfer', 'URI로 자원을 지정하고 HTTP Method로 CRUD 표현', 'Create→POST, Read→GET, Update→PUT, Delete→DELETE'] },
    { title: 'REST API', points: ['REST 방식으로 만든 서비스 API', '마이크로 서비스, OpenAPI(누구나 쓸 수 있게 공개된 API)에서 많이 사용'] },
    { title: 'Flask에서 REST API 만드는 방법', points: ['특정 URI 요청에 JSON 형식으로 데이터를 돌려주면 됨', '딕셔너리를 만들고 jsonify()로 JSON 응답 변환'] },
    { title: 'httpie 설치와 사용법', points: ['터미널에서 HTTP 요청을 보내 API를 테스트하는 도구 (pip install httpie)', '윈도우는 PowerShell 권장', 'http GET 주소 / 메서드 생략하면 GET / -v 는 요청 헤더까지 출력'] },
  ],
  questions: [
    { id: 'be-13-01', type: 'ox', source: 'HTTP', question: 'HTTP에서는 서버가 먼저 클라이언트에게 요청을 보낸다.', answer: false, explanation: 'Client가 요청(Request) → Server가 응답(Response).' },
    { id: 'be-13-02', type: 'mcq', source: 'REST', question: 'REST에서 "수정(Update)"에 해당하는 HTTP 메서드는?', choices: ['GET', 'POST', 'PUT', 'DELETE'], answer: 2, explanation: 'Create-POST, Read-GET, Update-PUT, Delete-DELETE.' },
    { id: 'be-13-03', type: 'essay', source: 'REST', question: 'REST의 핵심 두 가지를 설명하세요.', answer: 'URI로 자원(resource)을 지정하고, 그 자원에 할 작업(CRUD)을 HTTP 메서드(POST·GET·PUT·DELETE)로 표현하는 것이다. 예를 들어 /users/1 에 GET이면 조회, DELETE면 삭제.', keywords: ['URI = 자원', '메서드 = 행위', 'CRUD'], explanation: 'REST = 자원(URI) + 행위(메서드).' },
    { id: 'be-13-04', type: 'mcq', source: 'REST API', question: '누구나 쓸 수 있게 공개된 API를 뭐라고 할까?', choices: ['Private API', 'OpenAPI', 'Internal API', 'Batch API'], answer: 1, explanation: 'OpenAPI. 마이크로 서비스와 함께 REST API가 많이 쓰이는 곳.' },
    { id: 'be-13-05', type: 'short', source: 'Flask에서 REST API 만드는 방법', question: 'Flask에서 딕셔너리를 JSON 응답으로 바꾸는 함수는?', answer: ['jsonify', 'jsonify()'], explanation: 'from flask import jsonify → return jsonify(data).' },
    { id: 'be-13-06', type: 'mcq', source: 'httpie 설치와 사용법', question: 'httpie에서 요청 헤더까지 출력하는 옵션은?', choices: ['-h', '-v', '-a', '--json'], answer: 1, explanation: 'http -v GET 주소. 메서드를 생략하면 GET.' },
  ],
}

export default topic

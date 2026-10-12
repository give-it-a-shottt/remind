import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-12-routing-advanced',
  track: 'backend',
  group: 'Flask',
  title: '12강 - Flask 라우팅 심화',
  order: 12,
  notionId: '3efdf951bf808141a071fd4cbb558ff9',
  sections: [
    { title: '정적 페이지 리턴', points: ['경로마다 함수를 연결해 HTML 문자열을 리턴'], code: `@app.route("/first")
def hello_first():
    return "<h3>Hello First</h3>"` },
    { title: 'URI를 변수로 사용', points: ['<변수명>으로 주소의 일부를 받아 함수 인자로 사용'], code: `@app.route("/profile/<username>")
def get_profile(username):
    return "profile: " + username` },
    { title: '변수에 데이터 타입 지정', points: ['타입을 안 주면 문자열', '<int:변수>, <float:변수>', 'int는 문자열과 + 로 바로 못 붙임 → %d 나 str()'], code: `@app.route("/message/<int:message_id>")
def get_message(message_id):
    return "message id: %d" % message_id` },
    { title: '실습: 숫자 + 5 출력하기', points: ['/first/3 → add_five(3) → <h1>8</h1>'] },
  ],
  questions: [
    { id: 'be-12-01', type: 'ox', source: '정적 페이지 리턴', question: 'Flask 라우팅 함수는 HTML 문자열을 그대로 리턴해서 화면에 보여줄 수 있다.', answer: true, explanation: 'return "<h3>Hello First</h3>" 처럼요.' },
    { id: 'be-12-02', type: 'short', source: 'URI를 변수로 사용', question: '/profile/dave 요청 시 위 get_profile의 응답은?', answer: ['profile: dave'], explanation: '<username> 부분이 함수 인자 username으로 들어와요.' },
    { id: 'be-12-03', type: 'mcq', source: '변수에 데이터 타입 지정', question: 'URL 변수에 타입을 지정하지 않으면 기본 타입은?', choices: ['int', 'float', '문자열(str)', 'None'], answer: 2, explanation: '기본은 문자열. 숫자로 받으려면 <int:변수>.' },
    { id: 'be-12-04', type: 'mcq', source: '변수에 데이터 타입 지정', question: '<int:message_id> 를 "message id: " + message_id 로 리턴하면?', choices: ['정상 출력', 'TypeError (int와 str을 + 로 못 붙임)', '0 출력', '404'], answer: 1, explanation: '%d 포맷이나 str()로 변환해야 해요.' },
    { id: 'be-12-05', type: 'short', source: '실습: 숫자 + 5 출력하기', question: '/first/3 요청 시 응답 HTML은?', code: `def add_five(data):
    return data + 5

@app.route("/first/<int:messageid>")
def get_first(messageid):
    return "<h1>%d</h1>" % add_five(messageid)`, answer: ['<h1>8</h1>'], explanation: '3 + 5 = 8.' },
  ],
}

export default topic

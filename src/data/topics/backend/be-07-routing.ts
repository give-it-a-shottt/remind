import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-07-routing',
  track: 'backend',
  group: 'Flask',
  title: '7강 - 라우팅 & Flask 서버 실행',
  order: 7,
  notionId: '3efdf951bf8081e09ef6d423f70984d2',
  sections: [
    { title: 'URL vs URI', points: ['URL: 인터넷 상 자원의 위치', 'URI: 자원을 식별하는 주소, URL을 포함하는 더 큰 개념', '예: .../input 은 URL, .../input?id=dave&pw=1111 은 식별자까지 포함한 URI', '웹의 3요소: HTML, URL, HTTP'] },
    { title: '라우팅이란?', points: ['URL을 그에 맞는 함수(기능)와 연결하는 것', '@로 시작하는 건 데코레이터'], code: `@app.route("/hello")
def hello():
    return "<h1>Hello World!</h1>"` },
    { title: '서버 실행: app.run()', points: ['옵션: host(주소), port(포트), debug(True/False)', '내 PC 테스트 host: localhost, 127.0.0.1, 0.0.0.0'] },
    { title: '전체 기본 코드', points: ['파일이름.py로 저장 후 python 파일이름.py로 실행', '주피터에서 실행했으면 테스트 후 꼭 중지'], code: `if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8080")` },
    { title: 'Web Server vs WAS', points: ['Web Server: 정적 HTML 파일을 그대로 돌려줌', 'WAS: 요청에 따라 동적으로 데이터를 만들어 줌 (Flask, Django, Node.js...)', '상용 서비스는 전문 웹서버를 따로 쓰지만 Flask는 개발용 웹서버 기본 제공'] },
  ],
  questions: [
    { id: 'be-07-01', type: 'ox', source: 'URL vs URI', question: 'URI는 URL을 포함하는 더 큰 개념이다.', answer: true, explanation: 'URL은 위치, URI는 식별자. 실무에선 섞어 쓰니 참고만.' },
    { id: 'be-07-02', type: 'mcq', source: 'URL vs URI', question: '웹의 3요소가 아닌 것은?', choices: ['HTML', 'URL', 'HTTP', 'SQL'], answer: 3, explanation: '웹의 3요소: HTML(문서), URL(주소), HTTP(통신 규칙).' },
    { id: 'be-07-03', type: 'mcq', source: '라우팅이란?', question: '라우팅의 의미는?', choices: ['서버를 실행하는 것', 'URL을 그에 맞는 함수와 연결하는 것', 'HTML을 꾸미는 것', 'DB에 저장하는 것'], answer: 1, explanation: '@app.route("/hello") 데코레이터로 URL과 함수를 연결해요.' },
    { id: 'be-07-04', type: 'mcq', source: '서버 실행: app.run()', question: 'app.run()의 옵션이 아닌 것은?', choices: ['host', 'port', 'debug', 'route'], answer: 3, explanation: 'route는 데코레이터. run()은 host, port, debug.' },
    { id: 'be-07-05', type: 'short', source: '전체 기본 코드', question: 'blog.py로 저장한 Flask 서버를 터미널에서 실행하는 명령은?', answer: ['python blog.py', 'python3 blog.py'], explanation: 'python 파일이름.py. 주피터에서 돌렸다면 테스트 후 꼭 중지.' },
    { id: 'be-07-06', type: 'mcq', source: 'Web Server vs WAS', question: '요청에 따라 동적으로 데이터를 만들어 주는 것은?', choices: ['Web Server', 'WAS (Flask 등)', 'DNS', 'CDN'], answer: 1, explanation: 'Web Server는 정적 파일 그대로, WAS는 동적으로 생성.' },
  ],
}

export default topic

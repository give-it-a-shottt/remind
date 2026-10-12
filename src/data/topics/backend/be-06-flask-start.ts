import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-06-flask-start',
  track: 'backend',
  group: 'Flask',
  title: '6강 - 웹 서비스 흐름 & Flask 시작',
  order: 6,
  notionId: '3efdf951bf808190ab34eb3d97e84dc0',
  sections: [
    { title: '웹 서비스 개발 흐름', points: ['1세대: 정적 HTML을 읽어 보여줌', '2세대: CGI + DB로 요청에 따라 HTML 생성', '3세대: MVC 패턴 기반 프레임워크', '4세대: OpenAPI, REST API를 섞어 다양한 서비스', '백엔드는 주로 동시 접속자 규모에 따라 구성을 바꿈'] },
    { title: '풀스택 프레임워크 vs 마이크로 프레임워크', points: ['풀스택(Spring, Django, Rails): 인증·세션·템플릿·DB·보안·캐시 전부 제공, 학습 곡선 큼', '마이크로(Flask): 최소 기능 + 필요한 건 라이브러리로 확장, 빠르게 시작'] },
    { title: 'Flask 설치와 객체 생성', points: ['pip install flask', 'Flask(__name__)으로 현재 위치를 Flask에 알려줌'], code: `from flask import Flask
app = Flask(__name__)` },
    { title: '__name__ 이란?', points: ['모듈 이름이 저장되는 변수', '직접 실행한 파일에서는 "__main__", import된 파일에서는 그 파일 이름'] },
    { title: '시작점 (entry point)', points: ['C, Java는 main 같은 시작점이 있지만 파이썬은 위에서부터 실행', '직접 실행할 때만 동작할 코드를 구분'], code: `if __name__ == '__main__':
    print("직접 실행했을 때만 출력")` },
  ],
  questions: [
    { id: 'be-06-01', type: 'mcq', source: '웹 서비스 개발 흐름', question: 'OpenAPI, REST API를 섞어 다양한 서비스를 제공하는 것은 몇 세대 웹 서비스인가?', choices: ['1세대', '2세대', '3세대', '4세대'], answer: 3, explanation: '1 정적 HTML → 2 CGI+DB → 3 MVC 프레임워크 → 4 OpenAPI·REST API.' },
    { id: 'be-06-02', type: 'mcq', source: '풀스택 프레임워크 vs 마이크로 프레임워크', question: '마이크로 프레임워크에 해당하는 것은?', choices: ['Java Spring', 'Django', 'Flask', 'Ruby on Rails'], answer: 2, explanation: 'Flask는 최소 기능만 제공하고 필요한 기능을 라이브러리로 확장해요.' },
    { id: 'be-06-03', type: 'ox', source: '풀스택 프레임워크 vs 마이크로 프레임워크', question: '풀스택 프레임워크는 필요 없는 부분까지 구축해야 할 수 있다.', answer: true, explanation: '모든 기능을 제공하는 대신 학습 곡선이 크고 무거워요.' },
    { id: 'be-06-04', type: 'short', source: 'Flask 설치와 객체 생성', question: 'Flask 앱 객체를 만드는 코드는? (app = ...)', answer: ['Flask(__name__)', 'app = Flask(__name__)'], explanation: '__name__으로 현재 모듈 위치를 알려줘요 (일부 확장 기능에 필요).' },
    { id: 'be-06-05', type: 'mcq', source: '__name__ 이란?', question: 'start.py에서 test.py를 import한 뒤 start.py를 실행하면 test.py 안의 __name__ 값은?', choices: ["'__main__'", "'test'", "'start'", 'None'], answer: 1, explanation: 'import된 파일은 자기 파일 이름, 직접 실행한 start.py가 "__main__".' },
    { id: 'be-06-06', type: 'essay', source: '시작점 (entry point)', question: "if __name__ == '__main__': 을 쓰는 이유를 설명하세요.", answer: "파이썬은 main 함수 같은 시작점이 없이 파일을 위에서부터 실행한다. 이 파일을 다른 곳에서 import하면 그 안의 코드가 모두 실행돼 버리므로, 파일을 직접 실행했을 때(__name__이 '__main__'일 때)만 서버 실행 같은 코드가 돌도록 구분하는 것이다.", keywords: ['시작점', 'import', '직접 실행'], explanation: 'Flask에서는 이 블록 안에 app.run()을 둬요.' },
  ],
}

export default topic

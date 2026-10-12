import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-15-get-template',
  track: 'backend',
  group: 'Flask',
  title: '15강 - GET 파라미터 & render_template',
  order: 15,
  notionId: '3efdf951bf8081d0a7cacadcbe6e2608',
  sections: [
    { title: 'GET 파라미터', points: ['규칙: URL?파라미터1=값1&파라미터2=값2', 'Flask에서는 request.args.get("이름")'], code: `@app.route('/login')
def login():
    username = request.args.get('user_name')
    if username == 'dave':
        return jsonify({'auth': 'success'})
    return jsonify({'auth': 'failed'})` },
    { title: 'HTML 로그인 폼 만들기', points: ['VS Code에서 html:5 + Tab → HTML 기본 템플릿 (Emmet)', 'templates/login.html', 'input의 name이 GET 파라미터 이름이 됨'] },
    { title: 'render_template()', points: ['HTML 파일을 브라우저에 보내줌', 'HTML 파일은 반드시 templates 폴더 안에'] },
    { title: 'static_url_path', points: ['부트스트랩 같은 CSS/JS 경로를 못 찾을 때', "Flask(__name__, static_url_path='/static') + HTML도 /static/... 경로로"] },
  ],
  questions: [
    { id: 'be-15-01', type: 'mcq', source: 'GET 파라미터', question: 'GET 파라미터 여러 개를 이어 붙이는 기호는?', choices: ['?로 시작하고 &로 연결', '&로 시작하고 ?로 연결', '#로 연결', '/로 연결'], answer: 0, explanation: 'URL?a=1&b=2.' },
    { id: 'be-15-02', type: 'short', source: 'GET 파라미터', question: 'Flask에서 GET 파라미터 user_name 값을 꺼내는 코드는?', answer: ["request.args.get('user_name')", 'request.args.get("user_name")'], explanation: 'request.args는 쿼리스트링을 담은 딕셔너리 같은 객체.' },
    { id: 'be-15-03', type: 'mcq', source: 'HTML 로그인 폼 만들기', question: '<form action="/login" method="get"> 안 <input name="user_name"> 의 값은 서버에 어떻게 전달될까?', choices: ['/login/user_name', '/login?user_name=입력값', 'POST body', '쿠키'], answer: 1, explanation: 'GET 폼은 input의 name을 키로 쿼리스트링을 만들어요.' },
    { id: 'be-15-04', type: 'mcq', source: 'render_template()', question: "render_template('login.html')이 찾는 파일 위치는?", choices: ['static 폴더', 'templates 폴더', '프로젝트 루트', '아무 곳이나'], answer: 1, explanation: 'HTML 파일은 반드시 templates 폴더 안에 있어야 해요.' },
    { id: 'be-15-05', type: 'short', source: 'static_url_path', question: 'CSS/JS 경로를 /static으로 지정하는 Flask 객체 생성 인자는? (이름=값)', answer: ["static_url_path='/static'", 'static_url_path="/static"', 'static_url_path=/static'], explanation: "Flask(__name__, static_url_path='/static')" },
  ],
}

export default topic

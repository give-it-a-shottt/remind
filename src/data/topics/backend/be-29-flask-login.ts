import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-29-flask-login',
  track: 'backend',
  group: '클래스·배포',
  title: '29강 - flask_login & Control 클래스',
  order: 29,
  notionId: '3efdf951bf80816987ffde25fc69913a',
  sections: [
    { title: 'flask_login이란?', points: ['사용자를 구분하는 기능을 담당하는 라이브러리', '로그인하면 세션 정보를 응답에 넣어 보내고, 이후 요청에서 그 세션으로 사용자 구분'] },
    { title: '동작 방식', points: ['1. 로그인 → User 객체를 만들고 LoginManager에 추가 → 세션 생성', '2. current_user에 저장 (current_user.id, is_authenticated)', '3. 이후 요청은 세션의 id로 @login_required API 접근 허용', '4. 로그아웃 → LoginManager에서 id 제거'] },
    { title: '세션이 전달되는 과정', points: ['서버가 응답 헤더 Set-Cookie에 세션 정보를 넣어 보냄', '브라우저는 이후 같은 서버 요청 때 자동으로 쿠키를 보냄', 'session_protection = "strong": IP·user agent도 참고 → 세션 탈취 악용 어려움'] },
    { title: '초기 설정', points: ['app.secret_key = os.urandom(24) (세션 생성에 필요)', 'login_manager = LoginManager(); login_manager.init_app(app)'] },
    { title: '미리 선언해야 하는 함수 2개', points: ['@login_manager.user_loader: current_user 처음 호출될 때 → User.get(user_id)', '@login_manager.unauthorized_handler: 로그인 안 하고 보호된 페이지 접근 시 → 401'] },
    { title: '세션 생성', points: ['user = User.create(email, blog_id) → login_user(user)'] },
    { title: 'User 클래스', points: ['UserMixin 상속 → is_authenticated, is_active, is_anonymous, get_id() 기본 제공', 'id 속성이 반드시 있어야 함', 'DB 조회·생성은 @staticmethod (User.get(), find(), create())'] },
    { title: 'BlogSession 클래스', points: ['클래스 변수 blog_page, session_count', 'save_session_info(): IP·이메일·페이지·시간을 MongoDB에 저장', 'get_blog_page(): A/B 페이지를 번갈아 리턴, force 값이면 고정'] },
    { title: '클래스로 Control을 만드는 이유', points: ['클래스명.함수 형태라 코드만 봐도 기능을 알 수 있음', '비슷한 기능끼리 모아 유지보수가 쉬움'] },
    { title: '주의', points: ['강의 코드는 SQL을 문자열 더하기로 만들어 SQL 인젝션에 취약 → execute(sql, (값,))'] },
  ],
  questions: [
    { id: 'be-29-01', type: 'ox', source: 'flask_login이란?', question: 'flask_login은 세션을 이용해 요청한 사용자가 누구인지 구분한다.', answer: true, explanation: '로그인 시 세션을 만들고 이후 요청에서 그 세션으로 구분해요.' },
    { id: 'be-29-02', type: 'mcq', source: '동작 방식', question: '로그인한 사용자만 접근할 수 있게 API에 붙이는 데코레이터는?', choices: ['@login_manager.user_loader', '@login_required', '@app.before_request', '@staticmethod'], answer: 1, explanation: '@login_required가 붙은 API는 세션의 id가 있어야 접근 가능.' },
    { id: 'be-29-03', type: 'short', source: '세션이 전달되는 과정', question: '서버가 세션 정보를 담아 보내는 응답 헤더 이름은?', answer: ['Set-Cookie'], explanation: '브라우저는 이후 같은 서버 요청에 쿠키를 자동으로 보내요.' },
    { id: 'be-29-04', type: 'mcq', source: '세션이 전달되는 과정', question: 'session_protection = "strong"의 효과는?', choices: ['세션을 암호화 안 함', 'IP·user agent도 참고해 세션을 훔쳐도 악용하기 어렵게', '세션을 1분마다 삭제', '쿠키를 쓰지 않음'], answer: 1, explanation: '세션 정보가 다른 환경에서 쓰이면 무효화돼요.' },
    { id: 'be-29-05', type: 'mcq', source: '초기 설정', question: 'flask_login 세션 생성에 꼭 필요한 Flask 설정은?', choices: ['app.debug', 'app.secret_key', 'app.static_url_path', 'app.port'], answer: 1, explanation: 'app.secret_key = os.urandom(24) — 세션 서명에 쓰여요.' },
    { id: 'be-29-06', type: 'mcq', source: '미리 선언해야 하는 함수 2개', question: '로그인하지 않고 보호된 페이지에 접근하면 실행되는 함수의 데코레이터는?', choices: ['@login_manager.user_loader', '@login_manager.unauthorized_handler', '@app.errorhandler(404)', '@login_required'], answer: 1, explanation: 'unauthorized_handler에서 401 응답을 돌려줘요.' },
    { id: 'be-29-07', type: 'short', source: '세션 생성', question: 'User 객체로 세션을 만드는 flask_login 함수는?', answer: ['login_user', 'login_user()', 'login_user(user)'], explanation: 'from flask_login import login_user → login_user(user)' },
    { id: 'be-29-08', type: 'mcq', source: 'User 클래스', question: 'User 클래스가 상속해야 하는 flask_login 클래스는?', choices: ['LoginManager', 'UserMixin', 'BaseUser', 'Session'], answer: 1, explanation: 'UserMixin이 is_authenticated, get_id() 등을 기본 제공해요. id 속성은 필수.' },
    { id: 'be-29-09', type: 'ox', source: 'BlogSession 클래스', question: 'get_blog_page()는 session_count를 번갈아 바꿔 A와 B 페이지를 번갈아 리턴한다.', answer: true, explanation: 'force 값이 있으면 그 페이지로 고정(이미 구독한 사용자).' },
    { id: 'be-29-10', type: 'mcq', source: '클래스로 Control을 만드는 이유', question: 'Control 코드를 클래스로 만드는 이유로 알맞은 것은?', choices: ['실행 속도가 빨라서', '클래스명.함수 형태라 기능을 알아보기 쉽고 비슷한 기능끼리 모을 수 있어서', 'DB 연결이 자동이라서', '세션이 필요 없어서'], answer: 1, explanation: 'User.get(), BlogSession.save_session_info()처럼 의미가 드러나요.' },
    { id: 'be-29-11', type: 'ox', source: '주의', question: '강의 코드처럼 SQL을 문자열 더하기로 만들어도 보안상 문제는 없다.', answer: false, explanation: 'SQL 인젝션에 취약 → execute(sql, (값,)) 방식 사용.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-23-blueprint',
  track: 'backend',
  group: 'Flask',
  title: '23강 - 프로젝트 폴더 구조 & Blueprint',
  order: 23,
  notionId: '3efdf951bf80810d9b84c4922dc76208',
  sections: [
    { title: '왜 파일을 나누나?', points: ['한 파일에 모든 코드를 넣으면 복잡하고 관리가 어려움', '재사용성(re-usability)을 항상 생각', '대형 프로그램용 복잡한 구조까지는 필요 없음'] },
    { title: '폴더 구조', points: ['blog_control = C(제어), blog_view = V(라우팅), db_model = M(DB 연결)', 'static: CSS/JS, templates: HTML', '순수 REST API 서버면 View 없이 C = API, M = DB'] },
    { title: 'Blueprint', points: ['여러 파일에 나눠서 Flask 라우팅 코드를 작성하게 해 주는 기능', '기능별로 추가·삭제가 쉬워짐'] },
    { title: '하위 파일', points: ["blog_ab = Blueprint('blog', __name__) — Blueprint(이름, __name__)", '@blog_ab.route("/blog1")'] },
    { title: '메인 파일', points: ["app.register_blueprint(blog.blog_ab, url_prefix='/blog')", 'url_prefix: 하위 라우팅 앞에 붙는 기본 경로 → /blog/blog1'] },
  ],
  questions: [
    { id: 'be-23-01', type: 'ox', source: '왜 파일을 나누나?', question: '코드를 파일로 나눌 때는 재사용성을 함께 생각해야 한다.', answer: true, explanation: '단, 작은 프로젝트에 대형 구조까지 가져올 필요는 없어요.' },
    { id: 'be-23-02', type: 'mcq', source: '폴더 구조', question: '블로그 프로젝트에서 DB 연결 코드(mongodb.py, mysql.py)가 들어가는 MVC 역할은?', choices: ['M (db_model)', 'V (blog_view)', 'C (blog_control)', 'static'], answer: 0, explanation: 'Model = 데이터. db_model 폴더.' },
    { id: 'be-23-03', type: 'mcq', source: 'Blueprint', question: 'Blueprint의 역할은?', choices: ['DB 스키마 설계', '라우팅 코드를 여러 파일로 나눠 작성', 'HTML 템플릿 렌더링', '로그 저장'], answer: 1, explanation: '기능별로 라우팅 파일을 나누고 추가·삭제가 쉬워져요.' },
    { id: 'be-23-04', type: 'short', source: '하위 파일', question: "Blueprint 객체를 만드는 코드의 두 번째 인자는? Blueprint('blog', ?)", answer: ['__name__'], explanation: "Blueprint(이름, __name__)" },
    { id: 'be-23-05', type: 'short', source: '메인 파일', question: "url_prefix='/blog'로 등록한 Blueprint의 @route('/blog1') 최종 주소 경로는?", answer: ['/blog/blog1'], explanation: 'url_prefix + 라우트 경로.' },
    { id: 'be-23-06', type: 'mcq', source: '메인 파일', question: '메인 파일에서 Blueprint를 앱에 등록하는 함수는?', choices: ['app.add_blueprint()', 'app.register_blueprint()', 'app.include()', 'app.use()'], answer: 1, explanation: 'app.register_blueprint(blog.blog_ab, url_prefix="/blog").' },
  ],
}

export default topic

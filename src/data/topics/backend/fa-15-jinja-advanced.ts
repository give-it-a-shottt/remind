import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-15-jinja-advanced',
  track: 'backend',
  group: 'FastAPI',
  title: '고급 템플릿: 상속 · include · 정적 파일 · 폼',
  order: 35,
  sections: [
    {
      title: '템플릿 상속: extends와 block',
      points: [
        '모든 페이지에 공통인 머리글·메뉴·바닥글을 base.html에 한 번만 쓰고, 페이지마다 바뀌는 부분은 {% block 이름 %}{% endblock %} 으로 비워 둔다.',
        '자식 템플릿은 맨 위에 {% extends "base.html" %} 를 쓰고, 같은 이름의 block을 채운다. 자식에서 block 밖에 쓴 내용은 출력되지 않는다.',
        '부모 block의 기본 내용을 유지하면서 덧붙이려면 자식 block 안에서 {{ super() }} 를 호출한다.',
        'block은 여러 개 둘 수 있다: title, content, scripts 등.',
      ],
      code: `{# base.html #}
<!doctype html>
<html>
<head><title>{% block title %}My Blog{% endblock %}</title></head>
<body>
  <nav>...</nav>
  <main>{% block content %}{% endblock %}</main>
</body>
</html>

{# posts.html #}
{% extends "base.html" %}
{% block title %}글 목록 - {{ super() }}{% endblock %}
{% block content %}
  {% for p in posts %}<h2>{{ p.title }}</h2>{% endfor %}
{% endblock %}`,
    },
    {
      title: 'include와 macro',
      points: [
        '{% include "partials/post_card.html" %} 는 다른 템플릿 조각을 그 자리에 끼워 넣는다. 현재 템플릿의 변수를 그대로 쓸 수 있다.',
        'macro는 템플릿용 함수다. {% macro input(name, type="text") %}<input name="{{ name }}" type="{{ type }}">{% endmacro %} 로 정의하고 {{ input("email", "email") }} 로 호출한다.',
        '여러 파일에서 쓸 매크로는 {% from "macros.html" import input %} 로 가져온다.',
        '상속 = 큰 틀(레이아웃) 공유, include = 조각 끼워 넣기, macro = 인자를 받아 반복 생성.',
      ],
    },
    {
      title: '정적 파일과 url_for',
      notionIds: ['3efdf951bf8081d0a7cacadcbe6e2608'],
      points: [
        'CSS, JS, 이미지 같은 정적 파일은 app.mount("/static", StaticFiles(directory="static"), name="static") 으로 연결한다. static/css/app.css 는 /static/css/app.css 주소로 제공된다.',
        '템플릿에서는 경로를 직접 쓰기보다 {{ url_for("static", path="css/app.css") }} 를 쓴다. 앱이 하위 경로(/blog)에 배포돼도 올바른 주소가 만들어진다.',
        '라우트 주소도 url_for("함수이름", 경로파라미터=값) 으로 만든다. url_for("read_post", post_id=3) → /posts/3. 경로를 바꿔도 템플릿을 고칠 필요가 없다.',
        'mount는 그 경로 아래를 하위 앱에 통째로 넘기는 것이라, 일반 라우트와 달리 /docs에 나오지 않는다.',
      ],
      code: `from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")

<link rel="stylesheet" href="{{ url_for('static', path='css/app.css') }}">
<a href="{{ url_for('read_post', post_id=post.id) }}">{{ post.title }}</a>`,
    },
    {
      title: '폼 처리와 PRG 패턴',
      points: [
        '글쓰기 화면(GET /posts/new)은 폼 HTML을 보여 주고, 제출(POST /posts)은 Form()으로 값을 받아 저장한다.',
        '저장 후에는 HTML을 바로 그리지 말고 RedirectResponse(url, status_code=303) 로 목록이나 상세 페이지로 보낸다(Post-Redirect-Get). 새로고침해도 중복 저장되지 않는다.',
        '검증 실패 시에는 같은 폼 템플릿을 에러 메시지와 이전 입력값을 담아 다시 렌더링한다(상태 코드 400 또는 422).',
        '쿠키 세션으로 로그인하는 폼 기반 사이트는 CSRF(다른 사이트가 사용자의 브라우저로 몰래 폼을 제출하는 공격)에 대비해 SameSite 쿠키와 CSRF 토큰을 쓴다.',
      ],
      code: `@app.get("/posts/new", response_class=HTMLResponse)
def new_post_form(request: Request):
    return templates.TemplateResponse(request, "post_form.html", {"errors": [], "title": ""})

@app.post("/posts")
def create_post(request: Request, title: Annotated[str, Form()]):
    if len(title.strip()) < 2:
        return templates.TemplateResponse(
            request, "post_form.html",
            {"errors": ["제목은 2자 이상"], "title": title}, status_code=400,
        )
    post_id = save(title)
    return RedirectResponse(f"/posts/{post_id}", status_code=303)`,
    },
  ],
  questions: [
    {
      id: 'fa-15-01', type: 'mcq', source: '템플릿 상속: extends와 block',
      question: '자식 템플릿에서 아래 코드의 "안녕"은 어떻게 될까?',
      code: `{% extends "base.html" %}
<p>안녕</p>
{% block content %}<h1>본문</h1>{% endblock %}`,
      choices: ['본문 위에 출력된다', '에러가 난다', 'base.html 맨 끝에 붙는다', '출력되지 않는다(block 밖의 내용은 무시됨)'],
      answer: 3,
      choiceExplanations: [
        '상속 템플릿에서 출력 위치는 block으로만 정해져요.',
        '에러 없이 조용히 무시돼요.',
        '붙지 않아요.',
        '정답. extends를 쓰면 자식의 block 밖 내용은 버려져요.',
      ],
      explanation: '상속 구조에서 자식은 "부모 틀의 빈칸(block)을 채우는 역할"만 해요. 어디에 넣을지 모르는 내용은 출력할 곳이 없어 사라져요.\n"분명히 썼는데 화면에 안 나와요"의 흔한 원인이에요.',
    },
    {
      id: 'fa-15-02', type: 'short', source: '템플릿 상속: extends와 block',
      question: '자식 템플릿의 block 안에서 부모 block의 기본 내용을 그대로 출력하려면 {{ _______() }} 를 호출한다. 빈칸은?',
      answer: ['super'],
      explanation: '{{ super() }}예요. 예: 부모 title이 "My Blog"이면 자식에서 {% block title %}글 목록 - {{ super() }}{% endblock %} → "글 목록 - My Blog".\n클래스 상속에서 super()로 부모 메서드를 부르는 것과 같은 개념이에요.',
    },
    {
      id: 'fa-15-03', type: 'mcq', source: 'include와 macro',
      question: '게시글 카드 모양을 목록 페이지와 검색 결과 페이지에서 똑같이 쓰고 싶다. 가장 알맞은 방법은?',
      choices: ['두 페이지에 HTML을 복사한다', '카드를 partials/post_card.html로 빼서 {% include %}하거나 macro로 만든다', 'base.html의 block으로 만든다', 'JSON으로 보낸다'],
      answer: 1,
      choiceExplanations: [
        '디자인이 바뀌면 두 곳을 고쳐야 해요.',
        '정답. 조각 재사용은 include, 인자를 바꿔 가며 쓰려면 macro예요.',
        'block은 레이아웃의 빈칸을 정의하는 용도라 조각 재사용에는 맞지 않아요.',
        '서버 렌더링 화면 구성 문제예요.',
      ],
      explanation: '템플릿 재사용 도구 정리:\n• extends/block: 페이지 전체 틀 공유\n• include: 조각을 그대로 끼워 넣기(현재 변수 사용)\n• macro: 인자를 받는 조각(템플릿 함수)\nReact로 치면 레이아웃 컴포넌트 / 단순 컴포넌트 / props 있는 컴포넌트와 비슷해요.',
    },
    {
      id: 'fa-15-04', type: 'ox', source: 'include와 macro',
      question: 'include로 불러온 템플릿 조각은 기본적으로 불러온 쪽 템플릿의 변수를 사용할 수 있다.',
      answer: true,
      explanation: '맞아요. include는 현재 컨텍스트를 그대로 물려받아요. {% for post in posts %}{% include "card.html" %}{% endfor %} 에서 card.html은 post 변수를 쓸 수 있어요.\n반면 import로 가져온 macro는 기본적으로 현재 변수를 모르고, 인자로 받은 값만 써요(그래서 더 독립적이에요).',
    },
    {
      id: 'fa-15-05', type: 'mcq', source: '정적 파일과 url_for',
      question: 'static/img/logo.png 파일을 /static/img/logo.png 주소로 제공하려면?',
      choices: ['@app.get("/static/{path}")로 직접 파일을 읽어 보낸다', 'templates 폴더에 이미지를 넣는다', 'FileResponse를 모든 이미지마다 만든다', 'app.mount("/static", StaticFiles(directory="static"), name="static")'],
      answer: 3,
      choiceExplanations: [
        '가능은 하지만 경로 조작 검사, 캐시 헤더, Content-Type 처리를 직접 해야 해요.',
        'templates는 Jinja2 템플릿 폴더예요.',
        '비효율적이에요.',
        '정답. StaticFiles가 파일 제공, Content-Type, 캐시 관련 헤더를 처리해 줘요.',
      ],
      explanation: 'mount는 "/static 아래 요청은 StaticFiles 앱에 통째로 맡긴다"는 뜻이에요. name="static"은 url_for("static", path=...)에서 쓰는 이름이에요.\n운영에서 트래픽이 크면 정적 파일은 Nginx나 CDN이 직접 제공하게 하고, 앱 서버는 API에 집중시키기도 해요.',
    },
    {
      id: 'fa-15-06', type: 'mcq', source: '정적 파일과 url_for',
      question: '템플릿에서 <a href="/posts/{{ post.id }}">처럼 경로를 직접 쓰는 대신 url_for("read_post", post_id=post.id)를 쓰는 이유는?',
      choices: ['url_for가 더 빠르다', '보안을 위해서', '라우트 경로를 바꾸거나 앱을 하위 경로에 배포해도 템플릿을 고치지 않아도 된다', 'url_for를 쓰지 않으면 링크가 동작하지 않는다'],
      answer: 2,
      choiceExplanations: [
        '속도 차이는 의미 없어요.',
        '보안 기능은 아니에요.',
        '정답. 함수 이름으로 주소를 만들기 때문에 경로 문자열이 한 곳(데코레이터)에만 있게 돼요.',
        '직접 쓴 링크도 동작은 해요.',
      ],
      explanation: '"경로 문자열을 여러 곳에 하드코딩하지 않기"가 핵심이에요. /posts가 /articles로 바뀌어도 데코레이터만 고치면 템플릿의 모든 링크가 따라와요.\nurl_for의 첫 인자는 라우트 함수 이름(또는 name=으로 준 이름)이에요.',
    },
    {
      id: 'fa-15-07', type: 'short', source: '정적 파일과 url_for',
      question: 'FastAPI 앱에 StaticFiles처럼 "경로 하나 아래를 통째로 다른 앱에 맡기는" 메서드 이름은? app._____("/static", ...)',
      answer: ['mount'],
      explanation: 'app.mount예요. 정적 파일, 다른 ASGI 앱(예: 관리자 앱), 별도 FastAPI 앱을 하위 경로에 붙일 때 써요.\nmount된 경로는 메인 앱의 OpenAPI 문서에 포함되지 않아요. API 라우트를 파일별로 나누는 건 mount가 아니라 APIRouter + include_router예요(다음 토픽).',
    },
    {
      id: 'fa-15-08', type: 'mcq', source: '폼 처리와 PRG 패턴',
      question: '글쓰기 폼에서 제목이 너무 짧아 검증에 실패했다. 사용자 경험이 가장 좋은 처리는?',
      choices: ['같은 폼 템플릿을 에러 메시지와 사용자가 입력했던 값을 채워 다시 렌더링한다', 'JSON {"detail": "..."}을 보낸다', '빈 폼으로 리다이렉트한다', '500 에러 페이지를 보여 준다'],
      answer: 0,
      choiceExplanations: [
        '정답. 무엇이 틀렸는지 보여 주고, 입력한 내용을 잃지 않게 해요.',
        '폼 기반 사이트에서 사용자는 JSON 글자를 보게 돼요.',
        '입력한 내용이 사라져서 처음부터 다시 써야 해요.',
        '사용자 입력 문제는 서버 오류가 아니에요.',
      ],
      explanation: 'SSR 폼 패턴: 실패 → 같은 폼 + 에러 + 이전 값(상태 400/422), 성공 → 303 리다이렉트.\nJSON API에서는 422 + detail이 표준이지만, HTML 화면에서는 사람이 읽을 수 있는 형태로 돌려줘야 해요.',
    },
    {
      id: 'fa-15-09', type: 'mcq', source: '폼 처리와 PRG 패턴',
      question: '폼 저장 후 return RedirectResponse("/posts")(기본 307)를 했더니 목록 페이지 대신 405 에러가 났다. 이유는?',
      choices: ['/posts 라우트가 없어서', 'RedirectResponse가 동작하지 않아서', '템플릿 오류', '307은 메서드를 유지해서 브라우저가 /posts로 POST를 다시 보냈고, POST /posts가 없거나 다른 동작이라서'],
      answer: 3,
      choiceExplanations: [
        '라우트가 없다면 404예요.',
        '리다이렉트 자체는 동작했어요.',
        '템플릿과 무관해요.',
        '정답. 폼 제출 후 리다이렉트는 status_code=303으로 GET 전환을 명시해야 해요.',
      ],
      explanation: '같은 경로에 GET(목록)과 POST(저장)가 있으면 307로 POST가 다시 가서 중복 저장되거나, POST가 없으면 405가 나요. 폼 처리 후 리다이렉트는 303이 정답이에요.',
    },
    {
      id: 'fa-15-10', type: 'ox', source: '폼 처리와 PRG 패턴',
      question: '쿠키 세션으로 로그인하는 폼 기반 사이트는 CSRF(다른 사이트가 사용자의 브라우저로 몰래 요청을 보내는 공격)를 신경 써야 한다.',
      answer: true,
      explanation: '맞아요. 브라우저는 다른 사이트에서 시작된 폼 제출에도 우리 사이트의 쿠키를 붙일 수 있어요(SameSite 설정에 따라). 그래서 "사용자 몰래 글 삭제" 같은 요청이 가능해져요.\n대책: SameSite=Lax/Strict 쿠키, 폼마다 서버가 발급한 CSRF 토큰을 숨은 필드로 넣고 검증, 상태를 바꾸는 요청에 GET을 쓰지 않기.',
    },
    {
      id: 'fa-15-11', type: 'mcq', source: '템플릿 상속: extends와 block',
      question: 'base.html에 {% block scripts %}{% endblock %}를 두는 이유로 가장 알맞은 것은?',
      choices: ['모든 페이지에 같은 스크립트를 넣으려고', 'CSS를 넣으려고', '특정 페이지에서만 필요한 JS를 그 페이지 템플릿이 body 끝 등 정해진 위치에 넣을 수 있게 하려고', '보안을 위해'],
      answer: 2,
      choiceExplanations: [
        '모든 페이지 공통 스크립트는 block 밖에 그냥 쓰면 돼요.',
        '보통 CSS용 block은 따로(head 안에) 둬요.',
        '정답. 페이지별 스크립트 자리를 만들어 두는 거예요.',
        '보안과는 관계없어요.',
      ],
      explanation: '레이아웃 템플릿에는 보통 title, head(추가 CSS·메타), content, scripts 정도의 block을 둬요. 자식은 필요한 block만 채우고 나머지는 기본값을 써요.',
    },
    {
      id: 'fa-15-12', type: 'short', source: '템플릿 상속: extends와 block',
      question: '자식 템플릿이 base.html을 상속할 때 맨 위에 쓰는 태그는? {% _______ "base.html" %}',
      answer: ['extends'],
      explanation: '{% extends "base.html" %}예요. 템플릿 맨 처음에 둬야 하고, 한 템플릿은 하나의 부모만 상속해요(부모가 또 다른 부모를 상속하는 다단계는 가능).',
    },
  ],
}

export default topic

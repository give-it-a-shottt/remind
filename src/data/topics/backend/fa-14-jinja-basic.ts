import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-14-jinja-basic',
  track: 'backend',
  group: 'FastAPI',
  title: 'Jinja2 템플릿 기본 문법',
  order: 34,
  sections: [
    {
      title: '서버에서 HTML을 만드는 이유와 설정',
      notionIds: ['3efdf951bf8081d0a7cacadcbe6e2608'],
      slides: [
        {
          title: '서버가 완성된 HTML을 보내요',
          blocks: [
            { type: 'say', text: '지금까지 FastAPI는 JSON만 돌려줬어요. 화면은 React 같은 프론트가 그린다고 했죠. 그런데 **서버가 직접 데이터를 넣은 완성된 HTML**을 보낼 수도 있어요. 이걸 **서버 사이드 렌더링(SSR)** 이라고 해요.\n\n관리자 페이지, 이메일 본문, 간단한 서비스, 검색 노출이 중요한 페이지에 잘 맞아요. React 없이도 사용자마다 다른 페이지를 만들 수 있어요.' },
            { type: 'say', text: '**Jinja2**는 HTML 안에 변수·반복·조건을 넣는 **템플릿 엔진**이에요. Flask에서 쓰던 것과 문법이 같아요. `pip install jinja2`.' },
          ],
        },
        {
          title: 'TemplateResponse',
          blocks: [
            { type: 'code', code: `from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    posts = [{"id": 1, "title": "첫 글"}, {"id": 2, "title": "둘째 글"}]
    return templates.TemplateResponse(request, "index.html", {"posts": posts, "user": "kim"})` },
            { type: 'list', items: ['`Jinja2Templates(directory="templates")` — 템플릿 폴더 지정', '`TemplateResponse(request, "파일", {컨텍스트})` — **request를 꼭** 넘겨요. 템플릿 안의 `url_for` 같은 기능이 요청 정보를 쓰거든요', '`response_class=HTMLResponse` — 문서에 HTML 응답으로 표시'] },
          ],
        },
      ],
    },
    {
      title: '변수 출력과 필터',
      notionIds: ['3efdf951bf80815a82bddec479d5ce62'],
      slides: [
        {
          title: '{{ }}로 값 출력',
          blocks: [
            { type: 'code', code: `<h1>{{ user | upper }}님 환영합니다</h1>
<p>{{ post.title }}</p>            {# dict 키도, 객체 속성도 점으로 #}
<p>글 {{ posts | length }}개</p>
<p>{{ bio | default("소개가 없습니다") }}</p>` },
            { type: 'say', text: '`{{ 변수 }}`는 값을 출력해요. 점(`.`)으로 **dict 키와 객체 속성 모두** 읽을 수 있어요. `post`가 `{"title": "hi"}`여도 `{{ post.title }}`은 "hi"예요.' },
            { type: 'note', tone: 'warn', text: '컨텍스트로 **넘기지 않은 변수**는 에러 없이 **빈 문자열**로 출력돼요. `{{ usre }}`처럼 오타를 내도 조용히 빈칸이라 찾기 어려워요.' },
          ],
        },
        {
          title: '필터와 자동 이스케이프',
          blocks: [
            {
              type: 'table',
              head: ['필터', '결과'],
              rows: [
                ['`upper`', '대문자'],
                ['`length`', '개수'],
                ['`truncate(20)`', '20자에서 자르기'],
                ['`default("없음")`', '값이 없을 때 대신'],
                ['`join(", ")`', '리스트를 이어 붙이기'],
                ['`round`', '반올림'],
              ],
            },
            { type: 'say', text: '중요한 보안 기능이 하나 있어요. **자동 이스케이프**. 사용자가 댓글에 `<script>alert(1)</script>`를 쓰면, `{{ comment }}`는 `<`, `>`를 `&lt;`, `&gt;`로 바꿔서 **글자로만** 보여 줘요. 스크립트가 실행되지 않아요(**XSS 방어**).' },
            { type: 'note', tone: 'warn', text: '`| safe` 필터는 이 보호를 **꺼요.** 내가 직접 만든 믿을 수 있는 HTML에만 쓰고, **사용자가 쓴 내용에는 절대** 쓰지 마세요.' },
          ],
        },
      ],
    },
    {
      title: '반복문',
      notionIds: ['3efdf951bf80815a82bddec479d5ce62'],
      slides: [
        {
          title: '{% for %}',
          blocks: [
            { type: 'code', code: `<ul>
{% for post in posts %}
  <li class="{{ 'first' if loop.first }}">{{ loop.index }}. {{ post.title }}</li>
{% else %}
  <li>아직 글이 없습니다</li>
{% endfor %}
</ul>` },
            { type: 'say', text: '`{% %}`는 **블록 문법**(반복, 조건), `{{ }}`는 **출력**이에요. 파이썬과 달리 들여쓰기로 범위를 정하지 않아서 `{% endfor %}`로 **꼭 닫아야** 해요.\n\n`{% else %}`를 for 안에 쓰면 **목록이 비었을 때** 보여 줄 내용이 돼요. "아직 글이 없습니다" 같은 빈 화면 처리가 한 번에 끝나요.' },
          ],
        },
        {
          title: 'loop 변수',
          blocks: [
            {
              type: 'table',
              head: ['변수', '값'],
              rows: [
                ['`loop.index`', '**1부터** 세는 번호'],
                ['`loop.index0`', '0부터 세는 번호'],
                ['`loop.first` / `loop.last`', '첫째 / 마지막이면 True'],
                ['`loop.length`', '전체 개수'],
              ],
            },
            { type: 'say', text: 'dict는 `{% for key, value in data.items() %}`로 돌고, `range(5)`도 쓸 수 있어요.' },
          ],
        },
      ],
    },
    {
      title: '조건문과 주석',
      notionIds: ['3efdf951bf80818fafb6d7a70eaf38ac'],
      slides: [
        {
          title: '{% if %}',
          blocks: [
            { type: 'code', code: `{% if user and user.is_admin %}
  <button>삭제</button>
{% elif user %}
  <a href="/logout">로그아웃</a>
{% else %}
  <a href="/login">로그인</a>
{% endif %}

{{ "로그아웃" if user else "로그인" }}     {# 한 줄 조건 #}` },
            { type: 'say', text: '`{% if %} … {% elif %} … {% else %} … {% endif %}`. **endif는 필수**예요. 비교·논리 연산(`==`, `!=`, `and`, `or`, `not`, `in`)은 파이썬과 같아요.' },
            { type: 'note', tone: 'warn', text: '관리자에게만 삭제 버튼을 **보여 주는 것**은 화면 처리일 뿐이에요. 누군가 삭제 요청을 직접 보내면? **서버 라우트에서도 권한을 검사**해야 해요. 버튼 숨기기는 보안이 아니에요.' },
          ],
        },
        {
          title: '두 가지 주석',
          blocks: [
            {
              type: 'table',
              head: ['주석', '결과 HTML에'],
              rows: [
                ['`{# 메모 #}`', '**남지 않음** — 서버에서 지워짐'],
                ['`<!-- 메모 -->`', '**남음** — 사용자가 "소스 보기"로 볼 수 있음'],
              ],
            },
            { type: 'say', text: '"여기 관리자 비밀번호 임시로 1234" 같은 메모를 HTML 주석으로 남기면 전 세계가 볼 수 있어요. 개발자용 메모는 `{# #}`로 써요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fa-14-01', type: 'mcq', source: '서버에서 HTML을 만드는 이유와 설정',
      question: 'FastAPI에서 템플릿을 렌더링하는 코드로 올바른 것은?',
      choices: [
        'return render_template("index.html", posts=posts)',
        'return HTMLResponse("index.html")',
        'return templates.TemplateResponse(request, "index.html", {"posts": posts})',
        'return {"template": "index.html", "posts": posts}',
      ],
      answer: 2,
      choiceExplanations: [
        'Flask의 함수예요. FastAPI에는 없어요.',
        '"index.html"이라는 글자만 HTML로 보내요.',
        '정답. request와 템플릿 이름, 컨텍스트 dict를 넘겨요.',
        'JSON 응답이 돼요.',
      ],
      explanation: 'Flask render_template(이름, **변수) ↔ FastAPI templates.TemplateResponse(request, 이름, {변수 dict}).\n오래된 FastAPI 예제는 TemplateResponse("index.html", {"request": request, ...})처럼 request를 dict 안에 넣었어요. 최신 버전은 첫 인자로 request를 넘기는 방식을 권장해요.',
    },
    {
      id: 'fa-14-02', type: 'short', source: '서버에서 HTML을 만드는 이유와 설정',
      question: 'FastAPI에서 Jinja2 템플릿 폴더를 지정하는 클래스 이름은? templates = ______________(directory="templates")',
      answer: ['Jinja2Templates'],
      explanation: 'fastapi.templating.Jinja2Templates예요(실제로는 Starlette 클래스).\n템플릿 파일은 지정한 폴더 기준 경로로 찾아요. templates/posts/list.html → "posts/list.html".',
    },
    {
      id: 'fa-14-03', type: 'mcq', source: '변수 출력과 필터',
      question: '템플릿 {{ post.title }} 에서 post가 dict({"title": "hi"})일 때 결과는?',
      choices: ['hi', '에러: dict에는 점 접근을 할 수 없다', '빈 문자열', '{{ post.title }} 글자 그대로'],
      answer: 0,
      choiceExplanations: [
        '정답. Jinja2의 점 접근은 속성을 먼저 찾고, 없으면 키(post["title"])로 찾아요.',
        '파이썬과 달리 Jinja2는 dict 키도 점으로 읽어요.',
        'title 키가 있어서 값이 나와요.',
        '템플릿이 정상 렌더링돼요.',
      ],
      explanation: '덕분에 템플릿은 dict든 ORM 객체든 같은 문법({{ post.title }})으로 쓸 수 있어요.\n반대로 오타({{ post.titel }})는 에러 없이 빈 문자열이 되니, 화면에 값이 안 나오면 이름부터 확인하세요. 엄격하게 하려면 Jinja2 환경의 undefined를 StrictUndefined로 바꿀 수 있어요.',
    },
    {
      id: 'fa-14-04', type: 'mcq', source: '변수 출력과 필터',
      question: '사용자가 댓글에 <script>alert(1)</script>를 썼다. {{ comment }}로 출력하면 기본적으로 어떻게 될까?',
      choices: ['스크립트가 실행된다', '&lt;script&gt;... 로 이스케이프되어 글자로만 보인다', '댓글이 지워진다', '500 에러'],
      answer: 1,
      choiceExplanations: [
        '자동 이스케이프 덕분에 실행되지 않아요.',
        '정답. HTML 특수 문자를 엔티티로 바꿔 화면에 글자로 보여 줘요.',
        '내용은 그대로 보여요(글자로).',
        '정상 렌더링돼요.',
      ],
      explanation: '자동 이스케이프는 XSS(크로스 사이트 스크립팅)의 기본 방어선이에요.\n{{ comment | safe }}를 쓰면 이 보호가 꺼져 스크립트가 실행돼요. 사용자 입력에는 절대 safe를 쓰지 마세요. 마크다운처럼 HTML을 허용해야 한다면 bleach 같은 라이브러리로 허용 태그만 남기는 정화 과정을 거쳐요.',
    },
    {
      id: 'fa-14-05', type: 'short', source: '변수 출력과 필터',
      question: '리스트 items의 개수를 출력하는 Jinja2 표현은? {{ items | ______ }}',
      answer: ['length', 'count'],
      explanation: '{{ items | length }}예요(count도 같은 필터). Jinja2 템플릿에서는 len(items) 같은 파이썬 내장 함수를 기본적으로 쓸 수 없어서 필터를 써요.\n자주 쓰는 필터: upper, lower, title, trim, default, join, truncate, round, replace, first, last.',
    },
    {
      id: 'fa-14-06', type: 'mcq', source: '반복문',
      question: '다음 템플릿에 posts가 빈 리스트로 넘어오면 출력은?',
      code: `<ul>
{% for p in posts %}
  <li>{{ loop.index }}. {{ p.title }}</li>
{% else %}
  <li>글이 없습니다</li>
{% endfor %}
</ul>`,
      choices: ['<ul></ul>', '에러: for에는 else를 쓸 수 없다', '<ul><li>0. </li></ul>', '<ul><li>글이 없습니다</li></ul>'],
      answer: 3,
      choiceExplanations: [
        'for의 else 블록이 실행돼요.',
        'Jinja2는 for 안의 else를 지원해요.',
        '반복이 없으니 li가 만들어지지 않아요.',
        '정답. Jinja2의 for-else는 "한 번도 반복하지 않았을 때" 실행돼요.',
      ],
      explanation: '주의: 파이썬의 for-else는 "break 없이 끝났을 때" 실행돼서 의미가 달라요. Jinja2의 for-else는 "빈 목록일 때"라 빈 상태 화면을 만들기 편해요.',
    },
    {
      id: 'fa-14-07', type: 'mcq', source: '반복문',
      question: '목록의 번호를 1부터 출력하려면?',
      choices: ['{{ loop.index }}', '{{ loop.index0 }}', '{{ index + 1 }}', '{{ loop.count }}'],
      answer: 0,
      choiceExplanations: [
        '정답. loop.index는 1부터 세요.',
        'index0은 0부터 시작해요.',
        'index라는 변수는 따로 정의되지 않아요.',
        'loop.count는 없어요. 전체 개수는 loop.length예요.',
      ],
      explanation: 'loop 변수 정리: index(1~), index0(0~), revindex(뒤에서 몇 번째, 1~), first, last, length, cycle("odd", "even")(번갈아 값 출력).\n표에서 줄마다 색을 번갈아 주려면 class="{{ loop.cycle(\'odd\', \'even\') }}"처럼 써요.',
    },
    {
      id: 'fa-14-08', type: 'ox', source: '반복문',
      question: 'Jinja2 템플릿의 {% for %} 블록은 파이썬처럼 들여쓰기로 범위를 구분하므로 {% endfor %}가 필요 없다.',
      answer: false,
      explanation: 'Jinja2는 들여쓰기를 신경 쓰지 않고 {% endfor %}, {% endif %} 같은 종료 태그로 블록을 닫아요. 종료 태그를 빼먹으면 TemplateSyntaxError가 나요.\n들여쓰기는 읽기 좋게 하는 용도일 뿐이에요.',
    },
    {
      id: 'fa-14-09', type: 'mcq', source: '조건문과 주석',
      question: '관리자에게만 "삭제" 버튼을 보여 주려 한다. 알맞은 템플릿과 추가로 꼭 해야 할 일은?',
      choices: [
        '{% if user.is_admin %}<button>삭제</button>{% endif %} — 버튼만 숨기면 충분하다',
        '{{ if user.is_admin }} — 출력 문법으로 조건을 쓴다',
        '{% if user.is_admin %}<button>삭제</button>{% endif %} — 그리고 삭제 API에서도 서버가 관리자인지 다시 확인한다',
        'HTML 주석으로 버튼을 감춘다',
      ],
      answer: 2,
      choiceExplanations: [
        '버튼을 숨겨도 누구나 curl로 삭제 API를 직접 호출할 수 있어요.',
        '조건은 {% %} 블록 문법이에요.',
        '정답. 화면 숨김은 편의, 진짜 보안은 서버 API의 권한 검사예요.',
        'HTML 주석은 소스 보기에 그대로 보여요.',
      ],
      explanation: '"UI에서 숨기기"와 "서버에서 막기"는 별개예요. 서버는 모든 요청이 조작될 수 있다고 가정하고 매번 권한을 검사해야 해요(403).',
    },
    {
      id: 'fa-14-10', type: 'mcq', source: '조건문과 주석',
      question: '{# 메모 #} 와 <!-- 메모 --> 의 차이는?',
      choices: ['{# #}는 렌더링 결과에서 사라지고, <!-- -->는 결과 HTML에 남아 사용자가 소스 보기로 볼 수 있다', '같다', '<!-- -->만 템플릿 문법을 막는다', '{# #}는 화면에 보인다'],
      answer: 0,
      choiceExplanations: [
        '정답. 내부 메모는 Jinja2 주석으로 남겨야 사용자에게 전송되지 않아요.',
        '처리 시점과 결과가 달라요.',
        'HTML 주석 안의 {{ }}도 Jinja2가 먼저 처리해요. 그래서 <!-- {{ secret }} --> 은 값이 그대로 HTML에 들어가요.',
        '렌더링 시 사라져요.',
      ],
      explanation: 'Jinja2는 HTML을 해석하지 않고 텍스트로 처리해요. 그래서 HTML 주석 안의 템플릿 문법도 실행돼요. 민감한 정보나 내부 메모는 반드시 {# #}로 남기세요.',
    },
    {
      id: 'fa-14-11', type: 'short', source: '조건문과 주석',
      question: 'Jinja2에서 if 블록을 닫는 태그는? {% ______ %}',
      answer: ['endif'],
      explanation: '{% endif %}예요. elif와 else는 선택, endif는 필수예요.\n블록 짝: for ↔ endfor, if ↔ endif, block ↔ endblock, macro ↔ endmacro.',
    },
    {
      id: 'fa-14-12', type: 'ox', source: '서버에서 HTML을 만드는 이유와 설정',
      question: 'Jinja2로 서버에서 HTML을 만들면 React 없이도 동적인 페이지(사용자별로 다른 내용)를 만들 수 있다.',
      answer: true,
      explanation: '맞아요. 요청마다 다른 데이터를 템플릿에 넣어 HTML을 만들기 때문에 사용자별 페이지를 만들 수 있어요. 3세대 웹(MVC 프레임워크)의 방식이에요.\n클릭할 때마다 화면 일부만 바꾸는 상호작용은 약하지만, htmx 같은 도구를 붙여 보완하기도 해요.',
    },
  ],
}

export default topic

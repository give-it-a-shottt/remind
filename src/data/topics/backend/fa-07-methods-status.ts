import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-07-methods-status',
  track: 'backend',
  group: 'FastAPI',
  title: 'HTTP 메서드와 응답 코드 다루기',
  order: 27,
  sections: [
    {
      title: '메서드별 데코레이터로 CRUD 만들기',
      notionIds: ['3efdf951bf8081598e39c4da0c36cf64'],
      points: [
        'FastAPI는 @app.get, @app.post, @app.put, @app.patch, @app.delete 로 메서드마다 라우트를 따로 등록한다. 같은 경로라도 메서드가 다르면 다른 함수가 처리한다.',
        '전형적인 자원 하나의 CRUD: GET /posts(목록), POST /posts(생성), GET /posts/{id}(조회), PUT 또는 PATCH /posts/{id}(수정), DELETE /posts/{id}(삭제).',
        'POST·PUT·PATCH는 보통 본문(JSON)에 데이터를 담는다. GET·DELETE는 본문을 쓰지 않는 것이 관례다.',
        'Flask의 methods=["GET", "POST"] 처럼 한 함수에 여러 메서드를 몰아넣는 방식보다, 메서드별로 함수를 나누는 편이 문서·검증·테스트 모두 명확하다.',
      ],
      code: `posts: dict[int, dict] = {}

@app.get("/posts")
def list_posts():
    return list(posts.values())

@app.post("/posts", status_code=201)
def create_post(post: PostCreate):
    new_id = max(posts, default=0) + 1
    posts[new_id] = {"id": new_id, **post.model_dump()}
    return posts[new_id]

@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: int):
    if post_id not in posts:
        raise HTTPException(404, "Post not found")
    del posts[post_id]`,
    },
    {
      title: 'status_code 지정하기',
      points: [
        '데코레이터의 status_code 로 성공 시 상태 코드를 정한다. 생성은 201, 본문 없는 삭제는 204가 관례다.',
        '숫자 대신 from fastapi import status 후 status.HTTP_201_CREATED 처럼 상수를 쓰면 의미가 드러나고 오타를 줄인다.',
        '204 No Content 응답에는 본문이 있으면 안 된다. 함수가 아무것도 리턴하지 않게(None) 해야 한다.',
        '상황에 따라 성공 코드를 바꿔야 하면(예: 이미 있으면 200, 새로 만들면 201) 함수 파라미터로 response: Response 를 받아 response.status_code = 201 로 바꾼다.',
      ],
      code: `from fastapi import Response, status

@app.put("/items/{item_id}")
def upsert_item(item_id: int, item: Item, response: Response):
    if item_id in items:
        items[item_id] = item
        return item                       # 200
    items[item_id] = item
    response.status_code = status.HTTP_201_CREATED
    return item`,
    },
    {
      title: '에러 상태 코드 고르기',
      points: [
        '"요청을 고치면 해결되는가?" → 4xx. "서버를 고쳐야 하는가?" → 5xx.',
        '자주 쓰는 4xx: 400(규칙 위반·잘못된 요청), 401(로그인 필요), 403(권한 없음), 404(자원 없음), 409(중복·상태 충돌), 422(입력 값 검증 실패), 429(요청이 너무 많음).',
        '에러는 HTTPException(status_code=404, detail="...") 를 raise 해서 보낸다. return 이 아니라 raise 다. 함수가 즉시 중단되고 FastAPI가 {"detail": "..."} 응답을 만든다.',
        '500을 일부러 보내는 일은 거의 없다. 500은 "예상하지 못한 버그"의 신호여야 한다. 예상 가능한 실패(없음, 중복, 권한)는 모두 알맞은 4xx로 바꿔서 응답한다.',
      ],
    },
    {
      title: 'PUT과 PATCH의 실제 차이',
      points: [
        'PUT은 "전체 교체"다. 보내지 않은 필드는 기본값이 되거나 검증 에러가 난다. 그래서 PUT용 모델은 보통 생성용 모델과 필드가 같다(모두 필수).',
        'PATCH는 "부분 수정"이다. PATCH용 모델은 모든 필드를 선택(= None)으로 만들고, 실제로 보낸 필드만 반영한다.',
        '"보낸 필드만"을 알아내는 방법: data = patch.model_dump(exclude_unset=True). 요청에 없던 필드는 결과 dict에서 빠진다. 그냥 model_dump()를 쓰면 안 보낸 필드가 None으로 덮어써지는 버그가 생긴다.',
      ],
      code: `class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None

@app.patch("/posts/{post_id}")
def patch_post(post_id: int, patch: PostUpdate):
    stored = posts[post_id]
    changes = patch.model_dump(exclude_unset=True)   # 보낸 필드만
    stored.update(changes)
    return stored

# PATCH {"title": "새 제목"}  → content 는 그대로 유지`,
    },
  ],
  questions: [
    {
      id: 'fa-07-01', type: 'mcq', source: '메서드별 데코레이터로 CRUD 만들기',
      question: '같은 경로 /posts/{post_id}에 GET, PUT, DELETE를 모두 만들려 한다. FastAPI에서 올바른 방법은?',
      choices: ['@app.route("/posts/{post_id}", methods=["GET","PUT","DELETE"]) 하나로 처리', '경로를 /get-post, /put-post, /delete-post로 나눈다', '@app.get, @app.put, @app.delete 로 같은 경로에 함수 세 개를 등록', '하나의 @app.post에서 action 파라미터로 분기'],
      answer: 2,
      choiceExplanations: [
        'Flask 방식이에요. FastAPI에서는 메서드별 데코레이터가 기본이에요.',
        'URL에 동사를 넣는 REST 안티패턴이에요.',
        '정답. 경로는 같고 메서드가 다르면 각각 다른 함수가 처리해요.',
        '하나의 메서드로 모든 행위를 처리하면 HTTP 메서드의 의미(안전성·멱등성)가 사라져요.',
      ],
      explanation: '메서드별로 함수를 나누면 각 함수가 받는 입력(모델)과 응답 코드가 명확해지고, /docs에도 따로 표시돼요. 한 함수에서 if request.method == ... 로 분기할 일이 없어요.',
    },
    {
      id: 'fa-07-02', type: 'short', source: 'status_code 지정하기',
      question: '생성 API의 성공 코드를 숫자 대신 상수로 쓰려 한다. from fastapi import status 후 쓰는 상수 이름은? status.______',
      answer: ['HTTP_201_CREATED'],
      explanation: 'status.HTTP_201_CREATED예요. 이름 규칙은 HTTP_숫자_이름이에요. 예: HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND, HTTP_409_CONFLICT.\n에디터 자동 완성으로 고를 수 있어서 숫자를 외우지 않아도 되고, 코드를 읽는 사람도 의미를 바로 알아요.',
    },
    {
      id: 'fa-07-03', type: 'mcq', source: 'status_code 지정하기',
      question: '삭제 API를 status_code=204로 만들었는데 return {"ok": True}를 했다. 무엇이 문제인가?',
      choices: ['204는 본문이 없어야 하는 응답이라 본문을 보내면 안 된다', '문제없다', '204는 GET에서만 쓸 수 있다', 'True는 JSON으로 바꿀 수 없다'],
      answer: 0,
      choiceExplanations: [
        '정답. 확인 메시지를 주고 싶다면 200을 쓰고, 204를 쓸 거라면 아무것도 리턴하지 마세요.',
        'HTTP 규칙상 204 응답에는 본문이 없어야 해요. 클라이언트나 프록시가 이상하게 동작할 수 있어요.',
        '204는 주로 DELETE·PUT 같은 변경 요청에 써요.',
        'True는 JSON true로 잘 바뀌어요.',
      ],
      explanation: '204 No Content = "성공했고 돌려줄 내용은 없음".\n삭제 API 선택지: ① 204 + 본문 없음 ② 200 + 삭제된 자원(또는 메시지). 팀 규칙으로 하나를 정해 일관되게 쓰면 돼요.',
    },
    {
      id: 'fa-07-04', type: 'mcq', source: 'status_code 지정하기',
      question: '같은 PUT 요청에서 "새로 만들면 201, 기존 것을 바꾸면 200"을 돌려주려 한다. 방법은?',
      choices: ['데코레이터에 status_code=[200, 201]', '함수에 response: Response 파라미터를 받고 response.status_code = 201 로 바꾼다', '항상 201을 쓴다', 'HTTPException(201)을 raise한다'],
      answer: 1,
      choiceExplanations: [
        '상태 코드는 하나만 지정할 수 있어요.',
        '정답. FastAPI가 Response 객체를 주입해 주고, 거기서 바꾼 상태 코드와 헤더가 최종 응답에 반영돼요.',
        '수정인데 201을 주면 의미가 틀려요.',
        'HTTPException은 에러용이에요. 201로 raise하면 이상한 응답이 돼요.',
      ],
      explanation: 'response: Response 파라미터는 "이 요청의 응답을 미리 손볼 수 있는 객체"예요. status_code를 바꾸거나 response.headers["X-Total-Count"] = "120"처럼 헤더를 추가하거나 response.set_cookie(...)로 쿠키를 심을 수 있어요. 리턴값은 그대로 응답 본문으로 쓰여요.',
    },
    {
      id: 'fa-07-05', type: 'mcq', source: '에러 상태 코드 고르기',
      question: '없는 게시글을 조회했을 때 FastAPI 코드로 가장 올바른 것은?',
      choices: ['return {"error": "not found"}', 'return HTTPException(status_code=404)', 'raise HTTPException(status_code=404, detail="Post not found")', 'raise Exception("not found")'],
      answer: 2,
      choiceExplanations: [
        '본문은 에러처럼 보이지만 상태 코드는 200이라 클라이언트가 성공으로 처리해요.',
        'return하면 예외 객체를 JSON으로 바꾸려다 이상한 응답(또는 에러)이 돼요. 반드시 raise예요.',
        '정답. 함수가 즉시 멈추고 404와 {"detail": "Post not found"}가 응답돼요.',
        '일반 예외는 처리되지 않은 에러라 500이 돼요.',
      ],
      explanation: '에러 응답의 3원칙: ① 상태 코드로 실패를 알린다(200에 error 필드 X) ② raise HTTPException으로 즉시 중단한다 ③ detail에 이유를 담는다.\n프론트는 res.ok(상태 2xx 여부)로 성공/실패를 판단하니, 상태 코드가 정확해야 해요.',
    },
    {
      id: 'fa-07-06', type: 'mcq', source: '에러 상태 코드 고르기',
      question: '로그인 API에서 1분에 100번 넘게 시도한 IP를 막으려 한다. 알맞은 상태 코드는?',
      choices: ['400', '403', '503', '429'],
      answer: 3,
      choiceExplanations: [
        '요청 자체는 정상 형식이에요.',
        '권한 문제가 아니라 빈도 문제예요.',
        '503은 서버 자체가 일시적으로 서비스 불가일 때예요.',
        '정답. 429 Too Many Requests. Retry-After 헤더로 언제 다시 시도할지 알려 줄 수 있어요.',
      ],
      explanation: '429는 속도 제한(rate limit)의 표준 코드예요. 로그인 무차별 대입 공격 방어, 외부 API 한도 보호에 쓰여요.\n프로젝트에서 외부 API 하루 호출 한도를 지키려고 429를 다뤘던 것처럼, 받는 쪽에서도 429를 보면 잠시 기다렸다 재시도하는 로직이 필요해요.',
    },
    {
      id: 'fa-07-07', type: 'ox', source: '에러 상태 코드 고르기',
      question: 'DB의 UNIQUE 제약 위반(IntegrityError)을 그대로 두어 500이 나가게 하는 것은 정상적인 설계다.',
      answer: false,
      explanation: '아니에요. 중복은 "예상 가능한 실패"라서 잡아서 409(또는 400)로 바꿔야 해요.\ntry: db.commit()\nexcept IntegrityError:\n    db.rollback()\n    raise HTTPException(409, "이미 존재합니다")\n500이 나가면 클라이언트는 무엇을 고쳐야 할지 모르고, 모니터링에도 "버그"로 잡혀요.',
    },
    {
      id: 'fa-07-08', type: 'mcq', source: 'PUT과 PATCH의 실제 차이',
      question: '저장된 글은 {"title": "A", "content": "B"}다. PATCH 요청 본문 {"title": "C"}를 받아 아래처럼 처리하면 결과는?',
      code: `class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None

stored.update(patch.model_dump())`,
      choices: ['{"title": "C", "content": "B"}', '{"title": "C", "content": null}', '{"title": "A", "content": "B"}', '422 에러'],
      answer: 1,
      choiceExplanations: [
        '그렇게 되려면 exclude_unset=True가 필요해요.',
        '정답. model_dump()는 보내지 않은 content도 기본값 None으로 포함해서, 기존 "B"를 None으로 덮어써요.',
        'title은 바뀌어요.',
        '모든 필드가 선택이라 검증은 통과해요.',
      ],
      explanation: 'PATCH 구현의 대표 버그예요. 해결: patch.model_dump(exclude_unset=True) → {"title": "C"}만 나와요.\n"사용자가 null을 명시적으로 보낸 경우"(content를 지우고 싶음)와 "아예 안 보낸 경우"를 구분할 수 있다는 것도 exclude_unset의 장점이에요. {"content": null}을 보내면 content가 결과에 포함돼요.',
    },
    {
      id: 'fa-07-09', type: 'short', source: 'PUT과 PATCH의 실제 차이',
      question: 'Pydantic v2에서 요청에 실제로 들어온 필드만 dict로 뽑을 때 model_dump()에 주는 옵션은? (옵션=True 형식)',
      answer: ['exclude_unset=True', 'exclude_unset'],
      explanation: 'exclude_unset=True예요.\n비슷한 옵션 비교:\n• exclude_unset: 요청에서 설정하지 않은 필드 제외\n• exclude_none: 값이 None인 필드 제외(명시적으로 보낸 null도 빠짐)\n• exclude_defaults: 기본값과 같은 필드 제외\nPATCH에는 exclude_unset이 가장 정확해요.',
    },
    {
      id: 'fa-07-10', type: 'mcq', source: 'PUT과 PATCH의 실제 차이',
      question: 'PUT /posts/3 의 요청 모델로 가장 알맞은 것은?',
      choices: ['모든 필드가 필수인 모델(PostCreate와 같은 구조)', '모든 필드가 선택인 모델', '필드가 없는 빈 모델', 'id 필드가 필수인 모델'],
      answer: 0,
      choiceExplanations: [
        '정답. PUT은 전체 교체라 모든 필드를 보내야 해요.',
        '그건 PATCH 모델이에요.',
        '교체할 내용이 없어요.',
        'id는 경로(/posts/3)에 있어요. 본문에도 받으면 둘이 다를 때 혼란이 생겨요.',
      ],
      explanation: '설계 정리:\n• POST /posts → PostCreate(필수 필드)\n• PUT /posts/{id} → PostCreate와 같은 필드(전체 교체)\n• PATCH /posts/{id} → PostUpdate(모두 선택) + exclude_unset\nid는 경로에서만 받는 게 원칙이에요.',
    },
    {
      id: 'fa-07-11', type: 'ox', source: '메서드별 데코레이터로 CRUD 만들기',
      question: '서버를 재시작해도 데이터가 남아 있으려면 파이썬 dict 대신 데이터베이스에 저장해야 한다.',
      answer: true,
      explanation: '맞아요. 예제의 posts = {} 는 서버 프로세스의 메모리에 있어서, 재시작하거나 --reload로 코드가 바뀌면 사라져요. workers를 여러 개 띄우면 프로세스마다 dict가 따로 있어서 데이터가 엇갈리기도 해요.\n그래서 다음 단계가 SQLAlchemy로 DB를 연결하는 거예요.',
    },
    {
      id: 'fa-07-12', type: 'mcq', source: '에러 상태 코드 고르기',
      question: '"로그인은 했는데 관리자 전용 API를 호출" vs "토큰 없이 호출"의 상태 코드 짝으로 맞는 것은?',
      choices: ['401 / 403', '404 / 400', '403 / 401', '400 / 401'],
      answer: 2,
      choiceExplanations: [
        '반대예요.',
        '자원이 없는 게 아니에요.',
        '정답. 누구인지는 알지만 권한이 없으면 403, 누구인지 모르면 401.',
        '요청 형식 문제가 아니에요.',
      ],
      explanation: '인증(Authentication, 누구냐?) 실패 → 401\n인가(Authorization, 해도 되냐?) 실패 → 403\nFastAPI의 HTTPBasic 같은 보안 도구는 인증 실패 시 401과 WWW-Authenticate 헤더를 함께 보내요(인증 토픽).',
    },
  ],
}

export default topic

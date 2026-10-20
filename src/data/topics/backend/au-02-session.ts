import type { Topic } from '../../types'

const topic: Topic = {
  id: 'au-02-session',
  track: 'backend',
  group: '인증',
  title: '쿠키와 세션 인증',
  order: 62,
  sections: [
    {
      title: '쿠키의 동작',
      notionIds: ['3efdf951bf80816987ffde25fc69913a'],
      points: [
        '서버가 응답 헤더 Set-Cookie: name=value; 옵션들 을 보내면 브라우저가 저장하고, 이후 같은 사이트로 보내는 요청마다 Cookie: name=value 헤더를 자동으로 붙인다.',
        '옵션: Max-Age/Expires(수명, 없으면 브라우저를 닫을 때까지), HttpOnly(JS 접근 금지), Secure(HTTPS에서만 전송), SameSite(다른 사이트에서 시작된 요청에 보낼지: Strict/Lax/None), Path·Domain(범위).',
        '쿠키는 클라이언트가 마음대로 바꿀 수 있다. 쿠키에 user_id=3 처럼 신원을 그대로 넣으면 user_id=1로 바꿔 관리자로 행세할 수 있다. 그래서 신원 정보는 서명하거나 서버에 보관한다.',
      ],
    },
    {
      title: '세션 인증의 흐름',
      notionIds: ['3efdf951bf80816987ffde25fc69913a'],
      points: [
        '① 로그인 성공 → 서버가 세션을 만들고(예: user_id=3을 서버 저장소에 보관) 추측할 수 없는 세션 ID를 쿠키로 보낸다.',
        '② 이후 요청 → 브라우저가 세션 ID 쿠키를 자동으로 보냄 → 서버가 세션 저장소에서 user_id를 찾아 "누구인지" 안다.',
        '③ 로그아웃 → 서버에서 세션을 삭제하고 쿠키도 지운다. 서버가 세션을 지우면 그 ID는 즉시 무효가 된다(토큰 방식보다 강제 로그아웃이 쉬움).',
        'Flask의 flask_login이 해 주던 일(login_user로 세션 생성, current_user로 사용자 조회, @login_required로 보호)을 FastAPI에서는 세션 미들웨어 + 의존성으로 직접 조립한다.',
      ],
    },
    {
      title: 'SessionMiddleware (서명된 쿠키 세션)',
      points: [
        'Starlette의 SessionMiddleware는 세션 데이터(dict)를 쿠키에 담되, secret_key로 서명해서 변조를 막는다. 서버에 저장소가 따로 없다(쿠키 기반 세션). itsdangerous 패키지가 필요하다.',
        'request.session 이 dict처럼 동작한다. 로그인: request.session["user_id"] = user.id, 로그아웃: request.session.clear().',
        '서명은 "변조 방지"이지 "암호화"가 아니다. 쿠키 내용은 Base64로 디코딩해 볼 수 있으므로 비밀번호 같은 민감 정보를 넣지 않는다. user_id 같은 최소 정보만 넣는다.',
        'secret_key가 바뀌면 기존 세션 쿠키가 모두 무효(전원 로그아웃)가 된다. secret_key가 유출되면 누구나 세션을 위조할 수 있으니 환경 변수로 안전하게 관리한다.',
        '옵션: max_age(초), https_only=True(Secure), same_site="lax".',
      ],
      code: `from starlette.middleware.sessions import SessionMiddleware

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,     # 길고 무작위인 값
    max_age=60 * 60 * 24 * 7,           # 7일
    same_site="lax",
    https_only=True,                    # 운영(HTTPS)
)`,
    },
    {
      title: '현재 사용자 의존성',
      points: [
        'get_current_user: request.session에서 user_id를 꺼내 DB에서 사용자를 찾는다. 없으면 401. 라우트는 user: CurrentUser 만 선언하면 로그인 필수가 된다(flask_login의 @login_required + current_user 역할).',
        '선택적 로그인(로그인하면 추가 정보, 아니면 기본 화면)은 None을 허용하는 get_optional_user를 따로 만든다.',
        '세션에 있는 user_id의 사용자가 탈퇴·정지됐을 수 있으므로 매 요청 DB에서 상태를 확인한다.',
      ],
      code: `def get_current_user(request: Request, db: SessionDep) -> User:
    user_id = request.session.get("user_id")
    if user_id is None:
        raise HTTPException(401, "로그인이 필요합니다")
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        request.session.clear()
        raise HTTPException(401, "다시 로그인해 주세요")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]`,
    },
    {
      title: '세션 저장소와 보안 고려',
      points: [
        '서버 저장소 세션: 세션 ID만 쿠키에 두고 데이터는 Redis·DB에 둔다. 강제 로그아웃·동시 접속 관리가 쉽고 쿠키 크기 제한(약 4KB)도 없다. 서버가 여러 대면 저장소를 공유해야 한다.',
        '세션 고정(Session Fixation) 방어: 로그인 성공 시 기존 세션을 비우고 새로 만든다(request.session.clear() 후 다시 설정).',
        'CSRF: 쿠키는 자동으로 붙기 때문에, 다른 사이트가 사용자의 브라우저로 우리 사이트에 요청을 보내게 만들 수 있다. SameSite=Lax 쿠키, 상태 변경에 GET 금지, 중요한 요청에 CSRF 토큰으로 막는다.',
        '프론트(다른 출처)에서 쿠키 세션을 쓰려면 fetch에 credentials: "include", 서버 CORS에 allow_credentials=True와 정확한 allow_origins가 필요하다.',
      ],
    },
  ],
  questions: [
    {
      id: 'au-02-01', type: 'mcq', source: '쿠키의 동작',
      question: '로그인 후 서버가 Set-Cookie: user_id=3 (서명 없음)을 보냈다. 어떤 문제가 있을까?',
      choices: ['사용자가 쿠키 값을 user_id=1로 바꿔 다른 사람(관리자)으로 행세할 수 있다', '문제없다', '쿠키는 숫자를 저장할 수 없다', '브라우저가 쿠키를 보내지 않는다'],
      answer: 0,
      choiceExplanations: [
        '정답. 신원 정보는 서명(SessionMiddleware)하거나, 추측 불가능한 세션 ID만 주고 실제 정보는 서버에 둬야 해요.',
        '쿠키는 클라이언트가 자유롭게 바꿀 수 있어요.',
        '문자열로 저장돼요.',
        '정상적으로 보내요. 그래서 문제예요.',
      ],
      explanation: '원칙: 클라이언트가 보낸 값은 모두 조작 가능하다고 가정한다. 쿠키, 헤더, 본문, 숨은 폼 필드 모두요.\n서명된 쿠키는 값을 바꾸면 서명이 맞지 않아 서버가 거부해요.',
    },
    {
      id: 'au-02-02', type: 'mcq', source: '쿠키의 동작',
      question: '세션 쿠키에 HttpOnly를 켜는 이유는?',
      choices: ['HTTPS에서만 보내려고', '자바스크립트(document.cookie)가 쿠키를 읽지 못하게 해 XSS로 세션이 탈취되는 것을 막으려고', '다른 사이트 요청에 쿠키를 안 붙이려고', '쿠키 수명을 늘리려고'],
      answer: 1,
      choiceExplanations: [
        '그건 Secure 옵션이에요.',
        '정답. 악성 스크립트가 실행되더라도 세션 쿠키를 훔쳐 갈 수 없어요.',
        '그건 SameSite 옵션이에요.',
        '그건 Max-Age/Expires예요.',
      ],
      explanation: '쿠키 보안 3종: HttpOnly(JS 차단, XSS 대비), Secure(HTTPS 전용, 도청 대비), SameSite(교차 사이트 요청 제한, CSRF 대비). 인증 쿠키에는 셋 다 켜는 게 기본이에요.',
    },
    {
      id: 'au-02-03', type: 'short', source: '쿠키의 동작',
      question: '쿠키를 HTTPS 연결에서만 전송하게 하는 쿠키 옵션 이름은?',
      answer: ['Secure', 'secure'],
      explanation: 'Secure예요. FastAPI response.set_cookie(..., secure=True), SessionMiddleware(https_only=True).\n로컬 개발(http://localhost)에서는 Secure 쿠키가 저장되지 않는 브라우저가 있으니, 환경별로 설정을 나눠요(localhost는 예외로 허용하는 브라우저도 있어요).',
    },
    {
      id: 'au-02-04', type: 'mcq', source: '세션 인증의 흐름',
      question: '세션 인증의 순서로 맞는 것은?',
      choices: [
        '요청마다 아이디·비밀번호 전송 → 서버 비교',
        '서버가 먼저 쿠키를 보낸 뒤 로그인 화면을 보여 준다',
        '클라이언트가 직접 세션 ID를 정해서 보낸다',
        '로그인 성공 → 서버가 세션 생성, 세션 ID 쿠키 발급 → 이후 요청에 쿠키 자동 전송 → 서버가 세션으로 사용자 확인',
      ],
      answer: 3,
      choiceExplanations: [
        '그건 Basic 인증이에요.',
        '흐름이 맞지 않아요.',
        '세션 ID는 서버가 추측 불가능하게 생성해야 해요. 클라이언트가 정하면 세션 고정 공격이 가능해요.',
        '정답. 비밀번호는 로그인할 때 한 번만 보내고, 이후엔 세션 ID로 신원을 증명해요.',
      ],
      explanation: '노션의 flask_login 흐름(login_user → 세션 생성 → Set-Cookie → 이후 요청에서 current_user)과 똑같은 구조예요. 도구만 FastAPI식(미들웨어 + 의존성)으로 바뀌어요.',
    },
    {
      id: 'au-02-05', type: 'ox', source: '세션 인증의 흐름',
      question: '서버 저장소 방식의 세션 인증에서는 서버가 세션을 삭제하면 해당 사용자를 즉시 로그아웃시킬 수 있다.',
      answer: true,
      explanation: '맞아요. 상태를 서버가 들고 있으니 서버가 지우면 끝이에요. 비밀번호 변경 시 "다른 기기에서 모두 로그아웃" 같은 기능이 쉬워요.\n반면 JWT 같은 자체 포함 토큰은 만료 전까지 유효해서 즉시 무효화하려면 차단 목록 같은 추가 장치가 필요해요(다음 토픽).',
    },
    {
      id: 'au-02-06', type: 'mcq', source: 'SessionMiddleware (서명된 쿠키 세션)',
      question: 'Starlette SessionMiddleware에 대한 설명으로 틀린 것은?',
      choices: ['세션 데이터를 쿠키에 담고 secret_key로 서명한다', '서명돼 있으므로 쿠키 내용이 암호화되어 아무도 읽을 수 없다', 'request.session을 dict처럼 쓴다', 'secret_key를 바꾸면 기존 세션이 모두 무효가 된다'],
      answer: 1,
      choiceExplanations: [
        '맞는 설명이에요.',
        '정답(틀린 설명). 서명은 변조 방지일 뿐 암호화가 아니에요. Base64를 풀면 내용을 볼 수 있어요.',
        '맞는 설명이에요.',
        '맞는 설명이에요. 서명 검증에 실패하니까요.',
      ],
      explanation: '서명(signing) = "내가 만든 값이 맞는지" 확인, 암호화(encryption) = "남이 내용을 못 보게". 서명된 세션 쿠키에는 user_id처럼 보여도 괜찮은 최소 정보만 넣어요.',
    },
    {
      id: 'au-02-07', type: 'short', source: 'SessionMiddleware (서명된 쿠키 세션)',
      question: 'SessionMiddleware를 추가한 뒤 라우트에서 로그아웃 처리로 세션 내용을 모두 지우는 코드는? request.session.______()',
      answer: ['clear', 'clear()'],
      explanation: 'request.session.clear()예요. 응답 시 비어 있는 세션 쿠키가 다시 설정돼 로그아웃 상태가 돼요.\n로그인할 때도 먼저 clear() 한 뒤 user_id를 넣으면 세션 고정 공격을 막는 데 도움이 돼요.',
    },
    {
      id: 'au-02-08', type: 'mcq', source: 'SessionMiddleware (서명된 쿠키 세션)',
      question: 'secret_key를 코드에 "dev-secret"으로 하드코딩해 운영에 배포했다. 가장 큰 위험은?',
      choices: ['서버가 느려진다', '쿠키가 저장되지 않는다', '세션이 너무 빨리 만료된다', '저장소를 본 누구나 그 키로 원하는 user_id의 세션 쿠키를 위조해 다른 사람으로 로그인할 수 있다'],
      answer: 3,
      choiceExplanations: [
        '성능과는 관계없어요.',
        '정상 저장돼요.',
        '수명과는 관계없어요.',
        '정답. 서명 키를 알면 서명된 쿠키를 마음대로 만들 수 있어요.',
      ],
      explanation: '비밀 키는 길고 무작위로(python -c "import secrets; print(secrets.token_urlsafe(64))"), 환경 변수로 넣고, 유출이 의심되면 즉시 교체해요(전원 로그아웃되는 건 감수).',
    },
    {
      id: 'au-02-09', type: 'mcq', source: '현재 사용자 의존성',
      question: 'Flask의 @login_required + current_user 조합을 FastAPI에서 구현하는 방법으로 가장 알맞은 것은?',
      choices: ['get_current_user 의존성을 만들고 라우트에서 user: CurrentUser를 선언한다', 'FastAPI에도 @login_required 데코레이터가 기본으로 있다', '미들웨어에서 모든 요청을 검사한다', '전역 변수 current_user를 쓴다'],
      answer: 0,
      choiceExplanations: [
        '정답. 로그인 확인 + 사용자 객체 제공을 한 번에 해요.',
        'FastAPI에는 그런 기본 데코레이터가 없어요.',
        '공개 페이지(로그인 화면 포함)까지 막혀요. 라우트별 요구사항은 의존성으로.',
        '전역 변수는 여러 요청이 동시에 처리될 때 섞여요. 사용자 정보는 요청 단위여야 해요.',
      ],
      explanation: 'FastAPI의 의존성은 "보호(검사)"와 "주입(사용자 객체)"을 동시에 해요. 그리고 /docs에도 보안 요구사항이 표시되고, 테스트에서 dependency_overrides로 쉽게 바꿀 수 있어요.',
    },
    {
      id: 'au-02-10', type: 'ox', source: '현재 사용자 의존성',
      question: '세션에 user_id가 들어 있으면, 그 사용자가 이미 탈퇴·정지됐더라도 DB를 다시 확인할 필요는 없다.',
      answer: false,
      explanation: '세션은 로그인 "당시"의 정보예요. 그 뒤에 계정이 정지되거나 삭제됐을 수 있으니, get_current_user에서 DB로 사용자와 상태(is_active)를 확인해야 해요. 확인 결과 문제가 있으면 세션을 지우고 401을 줘요.',
    },
    {
      id: 'au-02-11', type: 'mcq', source: '세션 저장소와 보안 고려',
      question: 'React(localhost:5173)에서 FastAPI(localhost:8000)의 세션 쿠키 로그인을 쓰는데, 로그인 후 다음 요청에서 계속 401이 난다. 가장 먼저 확인할 것은?',
      choices: ['비밀번호 해시 알고리즘', 'fetch에 credentials: "include"를 넣었는지, 서버 CORS에 allow_credentials=True와 정확한 출처를 넣었는지', 'DB 인덱스', 'uvicorn 버전'],
      answer: 1,
      choiceExplanations: [
        '로그인 자체는 성공했어요.',
        '정답. 다른 출처 요청에서 브라우저는 기본적으로 쿠키를 보내지도, 저장하지도 않아요.',
        '관계없어요.',
        '관계없어요.',
      ],
      explanation: '교차 출처 쿠키 체크리스트: ① fetch(url, { credentials: "include" }) ② CORSMiddleware(allow_origins=["http://localhost:5173"], allow_credentials=True) ③ 쿠키 SameSite/Secure 설정이 환경에 맞는지.\n가장 단순한 해결은 Vite proxy로 같은 출처처럼 만드는 거예요.',
    },
    {
      id: 'au-02-12', type: 'short', source: '세션 저장소와 보안 고려',
      question: '다른 사이트가 사용자의 브라우저를 이용해 몰래 우리 사이트로 요청을 보내게 하는 공격의 약어는? (4글자 영어)',
      answer: ['CSRF', 'csrf', 'xsrf'],
      explanation: 'CSRF(Cross-Site Request Forgery)예요. 쿠키가 자동으로 붙는 성질을 악용해요.\n방어: SameSite=Lax 이상, 상태를 바꾸는 요청에 GET 금지, 중요한 폼에 CSRF 토큰, 필요하면 Origin/Referer 헤더 확인.\n토큰을 Authorization 헤더로 보내는 방식은 자동으로 붙지 않아 CSRF에 강하지만, 대신 XSS로 토큰을 훔치는 위험을 따로 관리해야 해요.',
    },
  ],
}

export default topic

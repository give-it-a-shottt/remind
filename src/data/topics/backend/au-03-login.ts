import type { Topic } from '../../types'

const topic: Topic = {
  id: 'au-03-login',
  track: 'backend',
  group: '인증',
  title: '로그인 구현: 비밀번호 해시 · 세션 로그인 · 토큰 비교',
  order: 63,
  sections: [
    {
      title: '비밀번호는 해시로 저장한다',
      points: [
        '비밀번호 원문을 DB에 저장하면, DB가 유출되는 순간 모든 사용자의 비밀번호가 노출된다(다른 사이트에서도 같은 비밀번호를 쓰는 경우가 많다).',
        '해시는 되돌릴 수 없는 변환이다. 로그인할 때는 입력한 비밀번호를 같은 방식으로 해시해 저장된 해시와 비교한다.',
        'SHA-256 같은 빠른 해시는 비밀번호용으로 부적합하다. GPU로 초당 수십억 번 대입할 수 있다. 일부러 느리게 설계된 bcrypt, argon2를 쓴다.',
        '솔트(salt): 사용자마다 다른 무작위 값을 섞어 해시한다. 같은 비밀번호라도 해시가 달라져, 미리 계산한 표(레인보우 테이블) 공격을 막는다. bcrypt·argon2는 솔트를 해시 문자열 안에 자동으로 포함한다.',
      ],
      code: `from pwdlib import PasswordHash      # 또는 passlib[bcrypt], argon2-cffi

password_hash = PasswordHash.recommended()   # argon2

hashed = password_hash.hash("my-password")
# '$argon2id$v=19$m=65536,t=3,p=4$...'  ← 알고리즘·설정·솔트·해시가 한 문자열에

password_hash.verify("my-password", hashed)   # True
password_hash.verify("wrong", hashed)         # False`,
    },
    {
      title: '회원가입과 로그인 API',
      points: [
        '회원가입: 이메일 정규화(.strip().lower()) → 비밀번호 규칙 검사(길이 등) → 해시 → User(email, hashed_password) 저장 → UNIQUE 위반이면 409.',
        '로그인: 이메일로 사용자 조회 → 없거나 비밀번호가 틀리면 똑같은 메시지("이메일 또는 비밀번호가 올바르지 않습니다")로 401. 어느 쪽이 틀렸는지 알려 주면 가입된 이메일 목록을 수집당한다.',
        '로그인 성공: 세션 방식이면 request.session.clear() 후 request.session["user_id"] = user.id. 토큰 방식이면 토큰을 발급해 응답한다.',
        '로그인 시도에는 속도 제한(rate limit)을 건다. 같은 IP·계정의 연속 실패가 많으면 잠시 막는다(429).',
      ],
      code: `@router.post("/login")
def login(data: LoginIn, request: Request, db: SessionDep):
    user = db.scalar(select(User).where(User.email == data.email.strip().lower()))
    if user is None or not password_hash.verify(data.password, user.hashed_password):
        raise HTTPException(401, "이메일 또는 비밀번호가 올바르지 않습니다")
    request.session.clear()                 # 세션 고정 방지
    request.session["user_id"] = user.id
    return {"id": user.id, "email": user.email}

@router.post("/logout", status_code=204)
def logout(request: Request):
    request.session.clear()`,
    },
    {
      title: '토큰 방식(JWT)과 비교',
      points: [
        'JWT(JSON Web Token): {"sub": "3", "exp": 만료시각} 같은 정보를 서명해 문자열로 만든 토큰. 서버는 서명만 확인하면 되므로 세션 저장소가 필요 없다(무상태).',
        '클라이언트는 Authorization: Bearer <토큰> 헤더로 보낸다. FastAPI에서는 OAuth2PasswordBearer(tokenUrl="token")로 꺼내고, jwt 라이브러리로 서명과 만료를 검증한다.',
        'JWT도 서명일 뿐 암호화가 아니다. 내용은 누구나 디코딩해 읽을 수 있으니 민감 정보를 넣지 않는다.',
        '단점: 만료 전에는 서버가 강제로 무효화하기 어렵다. 그래서 액세스 토큰은 짧게(15분 등), 리프레시 토큰으로 갱신하는 구조를 쓴다.',
        '선택 기준: 같은 도메인의 웹 앱 → 세션 쿠키가 단순하고 안전하게 만들기 쉽다. 모바일 앱·여러 서비스가 같은 인증을 공유 → 토큰이 편하다.',
      ],
      code: `import jwt   # PyJWT
from datetime import datetime, timedelta, timezone

def create_access_token(user_id: int) -> str:
    payload = {"sub": str(user_id), "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")

def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        raise HTTPException(401, "유효하지 않은 토큰", headers={"WWW-Authenticate": "Bearer"})
    return int(payload["sub"])`,
    },
    {
      title: '권한 검사와 보안 체크리스트',
      points: [
        '역할 기반 권한(RBAC): User.role("user", "admin")을 두고 require_role("admin") 의존성으로 검사한다.',
        '소유권 검사: 수정·삭제는 "로그인했는가"가 아니라 "이 자원의 주인인가"를 확인한다. 이걸 빠뜨리는 IDOR가 가장 흔한 취약점이다.',
        '응답에 hashed_password가 절대 나가지 않게 응답 모델로 막는다.',
        '체크리스트: HTTPS, 해시 저장(argon2/bcrypt), 같은 실패 메시지, 로그인 속도 제한, HttpOnly·Secure·SameSite 쿠키, 비밀 키는 환경 변수, 로그에 비밀번호·토큰 금지, 비밀번호 변경 시 기존 세션 무효화.',
      ],
    },
  ],
  questions: [
    {
      id: 'au-03-01', type: 'mcq', source: '비밀번호는 해시로 저장한다',
      question: '사용자 비밀번호를 DB에 저장하는 방법으로 가장 알맞은 것은?',
      choices: ['원문 그대로', 'argon2 또는 bcrypt 같은 느린 비밀번호 전용 해시(솔트 포함)', 'Base64로 인코딩', 'SHA-256 해시 한 번'],
      answer: 1,
      choiceExplanations: [
        'DB 유출 = 모든 비밀번호 유출이에요.',
        '정답. 일부러 느리고 메모리를 많이 쓰게 설계돼 대입 공격 비용이 매우 커져요.',
        'Base64는 누구나 되돌릴 수 있어요.',
        '빠른 해시라 GPU로 대량 대입 공격이 쉬워요. 솔트가 없으면 레인보우 테이블에도 약해요.',
      ],
      explanation: '비밀번호 저장의 표준: argon2id(권장) 또는 bcrypt. 라이브러리가 솔트 생성·포함, 비교, 설정 업그레이드까지 처리해 줘요. 직접 해시 함수를 조합하지 마세요.',
    },
    {
      id: 'au-03-02', type: 'ox', source: '비밀번호는 해시로 저장한다',
      question: '같은 비밀번호 "1234"를 쓰는 두 사용자의 bcrypt 해시 값은 서로 같다.',
      answer: false,
      explanation: '사용자마다 무작위 솔트가 섞여서 해시가 달라요. 그래서 해시만 보고 "같은 비밀번호를 쓰는 사람"을 찾을 수 없고, 미리 계산한 표로 한꺼번에 깨는 공격도 막혀요.\nverify(입력, 저장된해시)는 저장된 해시 문자열 안의 솔트를 꺼내 같은 방식으로 계산해 비교해요.',
    },
    {
      id: 'au-03-03', type: 'short', source: '비밀번호는 해시로 저장한다',
      question: '비밀번호 해시에 사용자마다 섞는 무작위 값을 무엇이라 하나요? (영어 한 단어 또는 한글)',
      answer: ['salt', '솔트', '소금'],
      explanation: '솔트(salt)예요. 비밀이 아니어도 되고, 해시 문자열 안에 함께 저장돼요. 목적은 같은 비밀번호라도 해시를 다르게 만드는 것이에요.\n(서버 전체에 공통으로 쓰는 비밀 값은 pepper라고 부르기도 해요.)',
    },
    {
      id: 'au-03-04', type: 'mcq', source: '회원가입과 로그인 API',
      question: '로그인 실패 메시지로 가장 알맞은 것은?',
      choices: ['"존재하지 않는 이메일입니다" / "비밀번호가 틀렸습니다"로 구분', '실패해도 200과 빈 응답', '"이메일 또는 비밀번호가 올바르지 않습니다"로 통일', '500 에러'],
      answer: 2,
      choiceExplanations: [
        '구분하면 공격자가 "가입된 이메일 목록"을 알아낼 수 있어요(계정 열거).',
        '실패는 상태 코드로 알려야 해요.',
        '정답. 어느 쪽이 틀렸는지 알려 주지 않아요. 상태 코드는 401.',
        '사용자 입력 문제는 서버 오류가 아니에요.',
      ],
      explanation: '같은 이유로 응답 시간도 비슷하게 맞추는 게 좋아요. 이메일이 없을 때 해시 비교를 건너뛰면 응답이 더 빨라서 시간 차이로 가입 여부가 드러날 수 있어요. 없는 경우에도 가짜 해시로 verify를 한 번 돌리는 방법을 써요.',
    },
    {
      id: 'au-03-05', type: 'mcq', source: '회원가입과 로그인 API',
      question: '로그인 성공 직후 request.session.clear()를 먼저 하는 이유는?',
      choices: ['로그아웃시키려고', '로그인 전부터 쓰던 세션을 버리고 새로 만들어 세션 고정 공격을 막으려고', '쿠키 크기를 줄이려고', '속도를 높이려고'],
      answer: 1,
      choiceExplanations: [
        '바로 다음 줄에서 user_id를 넣으니 로그인 상태가 돼요.',
        '정답. 공격자가 미리 심어 둔 세션을 피해자가 로그인으로 "승격"시키는 것을 막아요.',
        '부수 효과일 뿐 목적이 아니에요.',
        '관계없어요.',
      ],
      explanation: '세션 고정(Session Fixation): 공격자가 아는 세션 ID를 피해자가 쓰게 만든 뒤, 피해자가 로그인하면 그 세션으로 접근하는 공격이에요. 서버 저장소 세션에서는 로그인 시 세션 ID를 새로 발급(재생성)하는 게 표준 방어예요.',
    },
    {
      id: 'au-03-06', type: 'mcq', source: '회원가입과 로그인 API',
      question: '회원가입 시 이메일을 .strip().lower()로 정규화하는 이유는?',
      choices: ['" Kim@A.com"과 "kim@a.com"을 같은 계정으로 취급해 중복 가입과 로그인 실패를 막으려고', '보안 암호화를 위해', 'DB 용량을 줄이려고', '이메일 형식 검증을 대신하려고'],
      answer: 0,
      choiceExplanations: [
        '정답. 저장할 때와 조회할 때 똑같이 정규화해야 해요.',
        '암호화와 무관해요.',
        '의미 있는 차이는 없어요.',
        '형식 검증은 EmailStr이 해요.',
      ],
      explanation: '정규화는 저장 시점과 비교 시점 모두에 적용해야 해요. 한쪽만 하면 오히려 로그인이 안 돼요. Pydantic field_validator에서 처리해 두면 모든 입력 경로에 자동으로 적용돼요.',
    },
    {
      id: 'au-03-07', type: 'mcq', source: '토큰 방식(JWT)과 비교',
      question: 'JWT에 대한 설명으로 틀린 것은?',
      choices: ['서명돼 있어 내용을 바꾸면 검증에 실패한다', '서버가 세션 저장소 없이 서명만으로 검증할 수 있다', '만료 시간(exp)을 넣어 유효 기간을 정한다', '내용이 암호화돼 있어 비밀번호를 넣어도 안전하다'],
      answer: 3,
      choiceExplanations: [
        '맞는 설명이에요.',
        '맞는 설명이에요(무상태).',
        '맞는 설명이에요. 검증 시 만료를 확인해요.',
        '정답(틀린 설명). 일반 JWT는 Base64URL 인코딩 + 서명이라 누구나 내용을 읽을 수 있어요.',
      ],
      explanation: 'jwt.io에 토큰을 붙여 넣으면 내용이 바로 보여요. 그래서 sub(사용자 id), exp, 역할 정도의 최소 정보만 넣어요.\n검증할 때 algorithms=["HS256"]처럼 허용 알고리즘을 명시해야 "alg: none" 같은 공격을 막을 수 있어요.',
    },
    {
      id: 'au-03-08', type: 'mcq', source: '토큰 방식(JWT)과 비교',
      question: '비밀번호를 바꾼 사용자의 다른 기기 로그인을 즉시 모두 끊어야 한다. 어떤 방식이 더 쉬운가?',
      choices: ['서버 저장소 세션: 그 사용자의 세션을 서버에서 삭제', '만료가 30일인 JWT: 아무것도 안 해도 즉시 끊긴다', '둘 다 불가능하다', 'Basic 인증이 가장 쉽다'],
      answer: 0,
      choiceExplanations: [
        '정답. 서버가 상태를 가지고 있으니 지우면 즉시 무효예요.',
        'JWT는 만료 전까지 서명이 유효해서 서버가 따로 막지 않으면 계속 쓸 수 있어요.',
        '세션 방식은 쉽게 가능해요.',
        '비밀번호가 바뀌면 다음 요청부터 실패하긴 하지만, Basic은 일반 로그인 방식으로 쓰기 어려워요.',
      ],
      explanation: 'JWT로 즉시 무효화하려면: 짧은 액세스 토큰 + 리프레시 토큰을 서버에 저장해 폐기, 또는 사용자별 token_version을 두고 토큰에 넣어 비교, 또는 차단 목록. 결국 일부 상태를 다시 서버에 두게 돼요. "무상태"의 장점과 "통제"의 장점 사이 트레이드오프예요.',
    },
    {
      id: 'au-03-09', type: 'short', source: '토큰 방식(JWT)과 비교',
      question: '토큰 방식에서 클라이언트가 액세스 토큰을 보내는 헤더 형식은? Authorization: ______ <토큰>',
      answer: ['Bearer', 'bearer'],
      explanation: 'Authorization: Bearer <토큰>이에요. "이 토큰을 가진(bearer) 사람에게 권한을 준다"는 뜻이라, 토큰을 도둑맞으면 그대로 악용돼요. 그래서 HTTPS와 짧은 만료가 중요해요.\nFastAPI: oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") → token: str = Depends(oauth2_scheme).',
    },
    {
      id: 'au-03-10', type: 'mcq', source: '권한 검사와 보안 체크리스트',
      question: 'DELETE /posts/{id}에서 "로그인 여부"만 확인했다. 어떤 공격이 가능할까?',
      choices: ['SQL 인젝션', 'CORS 에러', 'XSS', '로그인한 아무 사용자가 다른 사람 글의 id를 넣어 삭제하는 IDOR(접근 통제 실패)'],
      answer: 3,
      choiceExplanations: [
        'ORM 바인딩으로 이미 막혀 있어요.',
        'CORS는 공격이 아니라 브라우저 정책이에요.',
        '출력 이스케이프 문제예요.',
        '정답. post.author_id == user.id(또는 관리자) 검사가 필요해요.',
      ],
      explanation: 'IDOR(Insecure Direct Object Reference): "id만 바꾸면 남의 데이터에 접근된다". OWASP Top 10 1위(접근 통제 실패)의 대표 사례예요.\n모든 수정·삭제·개인 조회 API에 "이 자원이 이 사용자의 것인가"를 넣는 습관을 들이세요.',
    },
    {
      id: 'au-03-11', type: 'ox', source: '권한 검사와 보안 체크리스트',
      question: 'User 모델을 그대로 응답(response_model 없이)하면 hashed_password가 응답에 포함될 위험이 있다.',
      answer: true,
      explanation: '맞아요. 해시라도 노출되면 오프라인 대입 공격의 재료가 돼요. UserRead처럼 공개할 필드만 가진 응답 모델을 항상 지정하세요(응답 모델 토픽).',
    },
    {
      id: 'au-03-12', type: 'mcq', source: '토큰 방식(JWT)과 비교',
      question: '같은 도메인에서 서버가 화면도 만들어 주는 작은 웹 서비스의 로그인 방식으로 가장 무난한 선택은?',
      choices: ['localStorage에 저장한 장기 JWT', 'HttpOnly·Secure·SameSite 세션 쿠키', '요청마다 Basic 인증', '쿼리 스트링에 ?token=...'],
      answer: 1,
      choiceExplanations: [
        'localStorage는 JS로 읽을 수 있어 XSS 한 번에 토큰이 털려요. 만료도 길면 피해가 커요.',
        '정답. 브라우저가 자동으로 관리하고, JS가 읽지 못해 XSS에 강하며, 서버에서 쉽게 무효화할 수 있어요.',
        '사용자 로그인 경험을 만들 수 없어요.',
        'URL은 로그·브라우저 기록·Referer 헤더로 새어 나가요.',
      ],
      explanation: '정답이 하나는 아니지만, 웹 브라우저 중심 서비스는 세션 쿠키가 단순하고 안전하게 만들기 쉬워요. 모바일 앱이나 여러 API 서버가 인증을 공유해야 할 때 토큰 방식의 장점이 커져요.',
    },
  ],
}

export default topic

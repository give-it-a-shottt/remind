import type { Topic } from '../../types'

const topic: Topic = {
  id: 'au-01-basic-auth',
  track: 'backend',
  group: '인증',
  title: '인증의 기초와 HTTPBasic',
  order: 61,
  sections: [
    {
      title: '인증과 인가',
      points: [
        '인증(Authentication): "너 누구야?" 사용자가 주장하는 신원이 맞는지 확인한다. 아이디·비밀번호, 소셜 로그인, 인증서 등.',
        '인가(Authorization): "그걸 해도 돼?" 확인된 사용자가 특정 자원·행동에 권한이 있는지 판단한다. 관리자 전용, 본인 글만 수정 등.',
        '실패 응답: 인증 실패 → 401 Unauthorized(이름과 달리 인증 문제), 인가 실패 → 403 Forbidden.',
        'HTTP는 무상태라서 로그인 후에도 요청마다 "나는 누구"라는 증거(자격 증명, 세션 ID, 토큰)를 함께 보내야 한다. 이 증거를 어디에 어떻게 담느냐가 인증 방식의 차이다.',
      ],
    },
    {
      title: 'HTTP Basic 인증의 원리',
      points: [
        '클라이언트가 Authorization: Basic <base64(아이디:비밀번호)> 헤더를 요청마다 보낸다.',
        '서버가 인증이 필요하다고 401과 WWW-Authenticate: Basic 헤더를 보내면, 브라우저는 아이디·비밀번호 입력 창을 띄운다.',
        'Base64는 암호화가 아니라 단순 인코딩이다. 누구나 디코딩할 수 있다. 그래서 Basic 인증은 반드시 HTTPS에서만 써야 한다.',
        '요청마다 비밀번호가 오가고, 로그아웃 개념이 약하고, 화면을 꾸밀 수 없다. 그래서 일반 사용자 로그인보다는 내부 관리 도구, 간단한 API 보호, 개발 서버 잠금에 쓴다.',
      ],
      code: `import base64
token = base64.b64encode(b"admin:secret").decode()
print(token)                          # YWRtaW46c2VjcmV0
print(base64.b64decode(token))        # b'admin:secret'  ← 누구나 복원 가능

# 요청 헤더
# Authorization: Basic YWRtaW46c2VjcmV0`,
    },
    {
      title: 'FastAPI의 HTTPBasic',
      points: [
        'security = HTTPBasic() 을 만들고 credentials: HTTPBasicCredentials = Depends(security) 로 받으면 FastAPI가 헤더를 파싱해 credentials.username, credentials.password 를 준다.',
        '헤더가 없으면 FastAPI가 자동으로 401 + WWW-Authenticate를 응답한다. /docs에 자물쇠 아이콘과 Authorize 버튼이 생긴다.',
        '값을 비교할 때는 == 대신 secrets.compare_digest()를 쓴다. ==는 다른 글자를 발견하는 순간 멈춰서, 응답 시간 차이로 비밀번호를 한 글자씩 추측하는 타이밍 공격이 가능하다.',
        '검증 로직은 의존성 함수로 만들어 재사용한다: def get_admin(credentials = Depends(security)) -> str.',
      ],
      code: `import secrets
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()

def get_admin(credentials: Annotated[HTTPBasicCredentials, Depends(security)]) -> str:
    ok_user = secrets.compare_digest(credentials.username.encode(), b"admin")
    ok_pass = secrets.compare_digest(credentials.password.encode(), settings.admin_password.encode())
    if not (ok_user and ok_pass):
        raise HTTPException(
            status_code=401,
            detail="아이디 또는 비밀번호가 틀렸습니다",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/admin/stats")
def stats(admin: Annotated[str, Depends(get_admin)]):
    return {"hello": admin}`,
    },
    {
      title: '비밀 값과 설정 관리',
      points: [
        '비밀번호·API 키·DB URL 같은 비밀 값은 코드에 쓰지 않는다. git에 한 번 올라가면 기록에 영원히 남는다.',
        '환경 변수나 .env 파일(git에 올리지 않음, .gitignore에 추가)로 주입하고, pydantic-settings의 BaseSettings로 읽어 타입 검증까지 한다.',
        '팀원을 위해 값이 빠진 .env.example 을 함께 커밋해 어떤 설정이 필요한지 알려 준다.',
        '배포 서버(Render, Vercel 등)는 대시보드의 환경 변수 설정으로 값을 넣는다.',
      ],
      code: `from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    database_url: str
    admin_password: str
    secret_key: str

settings = Settings()   # 값이 없으면 시작할 때 ValidationError → 빨리 실패`,
    },
  ],
  questions: [
    {
      id: 'au-01-01', type: 'mcq', source: '인증과 인가',
      question: '로그인한 일반 사용자가 관리자 전용 API를 호출했다. 이 실패는 어느 단계의 실패인가?',
      choices: ['인증(Authentication) 실패, 401', '검증(Validation) 실패, 422', '라우팅 실패, 404', '인가(Authorization) 실패, 403'],
      answer: 3,
      choiceExplanations: [
        '누구인지는 확인됐어요.',
        '입력 값 문제가 아니에요.',
        '경로는 존재해요.',
        '정답. 신원은 맞지만 권한이 없어요.',
      ],
      explanation: '인증 → "누구인가" 확인, 인가 → "무엇을 할 수 있나" 판단. 순서도 항상 인증 다음이 인가예요. 누구인지 모르면 권한을 판단할 수 없으니까요.',
    },
    {
      id: 'au-01-02', type: 'ox', source: '인증과 인가',
      question: 'HTTP는 무상태이므로, 로그인한 뒤에도 요청마다 "누구인지"를 증명하는 정보(쿠키, 토큰 등)를 함께 보내야 한다.',
      answer: true,
      explanation: '맞아요. 서버는 각 요청을 독립적으로 보기 때문에, 로그인 상태를 유지하려면 요청마다 증거가 필요해요.\n• Basic: 요청마다 아이디·비밀번호\n• 세션: 요청마다 세션 ID 쿠키\n• 토큰(JWT): 요청마다 Authorization: Bearer 토큰',
    },
    {
      id: 'au-01-03', type: 'mcq', source: 'HTTP Basic 인증의 원리',
      question: 'Authorization: Basic YWRtaW46c2VjcmV0 헤더를 가로챘다. 비밀번호를 알아낼 수 있을까?',
      choices: ['불가능하다. 암호화돼 있다', '가능하다. Base64는 인코딩일 뿐이라 바로 "admin:secret"으로 복원된다', '서버의 비밀 키가 있어야 가능하다', '해시라서 무차별 대입이 필요하다'],
      answer: 1,
      choiceExplanations: [
        'Base64는 암호화가 아니에요.',
        '정답. 그래서 HTTPS(전송 구간 암호화) 없이 Basic 인증을 쓰면 비밀번호가 그대로 노출돼요.',
        '키가 필요 없는 단순 변환이에요.',
        '해시가 아니라 되돌릴 수 있는 인코딩이에요.',
      ],
      explanation: '인코딩(Base64, URL 인코딩): 형식 변환, 누구나 되돌림. 암호화(AES 등): 키가 있어야 되돌림. 해시(SHA-256, bcrypt): 되돌릴 수 없음.\n이 세 가지를 구분하는 게 보안 기초예요.',
    },
    {
      id: 'au-01-04', type: 'short', source: 'HTTP Basic 인증의 원리',
      question: 'Basic 인증이 필요할 때 서버가 401 응답과 함께 보내 브라우저 로그인 창을 띄우게 하는 응답 헤더 이름은?',
      answer: ['WWW-Authenticate', 'www-authenticate'],
      explanation: 'WWW-Authenticate: Basic 이에요. 브라우저는 이 헤더가 있는 401을 받으면 기본 로그인 창을 띄워요.\n토큰 방식에서는 WWW-Authenticate: Bearer를 보내는 게 표준이에요. HTTPException(401, headers={"WWW-Authenticate": "Bearer"}).',
    },
    {
      id: 'au-01-05', type: 'mcq', source: 'HTTP Basic 인증의 원리',
      question: 'HTTP Basic 인증이 가장 잘 어울리는 상황은?',
      choices: ['수백만 사용자가 쓰는 쇼핑몰 로그인', '소셜 로그인', '모바일 앱의 장기 로그인 유지', '팀 내부에서만 쓰는 관리 통계 API를 HTTPS로 간단히 잠그기'],
      answer: 3,
      choiceExplanations: [
        '로그인 화면을 꾸밀 수 없고, 로그아웃·비밀번호 재설정 등 사용자 경험을 만들 수 없어요.',
        '소셜 로그인은 OAuth 흐름이에요.',
        '요청마다 비밀번호를 저장·전송해야 해서 위험해요. 토큰 방식이 알맞아요.',
        '정답. 구현이 간단하고 클라이언트(curl, 브라우저)가 기본 지원해요.',
      ],
      explanation: 'Basic 인증은 "간단하지만 기능이 적은" 방식이에요. 일반 사용자 대상 서비스는 세션 쿠키나 토큰 방식을 쓰고, Basic은 내부 도구·간단한 보호에 써요.',
    },
    {
      id: 'au-01-06', type: 'mcq', source: 'FastAPI의 HTTPBasic',
      question: 'FastAPI에서 security = HTTPBasic()을 의존성으로 쓴 라우트에 Authorization 헤더 없이 요청하면?',
      choices: ['200 OK', '403', '401 + WWW-Authenticate: Basic 헤더 자동 응답', '422'],
      answer: 2,
      choiceExplanations: [
        '자격 증명이 없어 통과하지 못해요.',
        '자격 증명이 아예 없으니 인증 실패(401)예요.',
        '정답. 헤더 파싱 단계에서 FastAPI가 자동으로 401을 보내요. 내 검증 함수는 실행되지 않아요.',
        '검증 에러가 아니라 보안 의존성의 실패예요.',
      ],
      explanation: 'HTTPBasic 같은 보안 클래스는 "헤더에서 자격 증명을 꺼내는" 역할까지만 해요. 꺼낸 값이 맞는지 비교하는 건 우리가 만든 의존성(get_admin)이 해요.',
    },
    {
      id: 'au-01-07', type: 'mcq', source: 'FastAPI의 HTTPBasic',
      question: '비밀번호 비교에 password == expected 대신 secrets.compare_digest를 쓰는 이유는?',
      choices: ['더 빨라서', '비교 시간이 내용과 상관없이 일정해 타이밍 공격을 막으려고', '대소문자를 무시하려고', '해시를 자동으로 계산해서'],
      answer: 1,
      choiceExplanations: [
        '속도가 목적이 아니에요. 오히려 항상 끝까지 비교해요.',
        '정답. ==는 첫 번째로 다른 글자에서 멈춰서, 응답 시간을 재면 앞 글자부터 하나씩 맞혀 볼 수 있어요.',
        '대소문자를 구분해요.',
        '해시를 계산하지 않아요. 값을 비교할 뿐이에요.',
      ],
      explanation: '비밀 값(API 키, 토큰, 서명)을 비교할 때는 항상 상수 시간 비교(secrets.compare_digest, hmac.compare_digest)를 써요.\n사용자 비밀번호는 원문이 아니라 해시를 저장하고, 해시 라이브러리의 verify 함수가 이 부분을 처리해 줘요(로그인 토픽).',
    },
    {
      id: 'au-01-08', type: 'short', source: 'FastAPI의 HTTPBasic',
      question: 'FastAPI에서 HTTPBasic 의존성이 돌려주는 객체의 타입(클래스) 이름은? (username, password 속성을 가짐)',
      answer: ['HTTPBasicCredentials'],
      explanation: 'HTTPBasicCredentials예요. from fastapi.security import HTTPBasic, HTTPBasicCredentials.\ncredentials.username, credentials.password로 꺼내 검증해요.',
    },
    {
      id: 'au-01-09', type: 'mcq', source: '비밀 값과 설정 관리',
      question: '관리자 비밀번호를 어디에 두는 것이 가장 알맞을까?',
      choices: ['main.py에 ADMIN_PASSWORD = "1234"', 'README.md에 적는다', '프론트 코드의 VITE_ADMIN_PASSWORD', '환경 변수(.env, git 제외)로 두고 BaseSettings로 읽는다'],
      answer: 3,
      choiceExplanations: [
        '코드는 git에 올라가 기록에 영원히 남아요.',
        '문서도 저장소에 올라가요.',
        'VITE_ 변수는 번들에 그대로 들어가 누구나 볼 수 있어요.',
        '정답. 코드와 비밀을 분리하고, 배포 환경마다 다른 값을 넣을 수 있어요.',
      ],
      explanation: '노션 프로젝트 노트의 "API 키는 Render 환경 변수에만 두고 프론트는 백엔드만 부른다"와 같은 원칙이에요.\n실수로 비밀 값을 커밋했다면 파일을 지우는 걸로는 부족해요. 그 값 자체를 즉시 바꾸세요(키 재발급).',
    },
    {
      id: 'au-01-10', type: 'ox', source: '비밀 값과 설정 관리',
      question: 'pydantic-settings의 BaseSettings는 필요한 환경 변수가 없으면 앱이 시작될 때 에러를 내서 문제를 빨리 알려 준다.',
      answer: true,
      explanation: '맞아요. 필수 필드에 값이 없으면 Settings()를 만들 때 ValidationError가 나요. "운영 중에 처음 그 설정을 쓰는 순간 터지는 것"보다 "시작할 때 바로 실패"가 훨씬 낫아요(Fail Fast).\n타입도 검증돼요. 예: port: int에 "abc"가 들어오면 시작 실패.',
    },
    {
      id: 'au-01-11', type: 'short', source: '비밀 값과 설정 관리',
      question: '.env 파일을 git에 올리지 않으려면 어떤 파일에 .env 를 추가하나요?',
      answer: ['.gitignore', 'gitignore'],
      explanation: '.gitignore예요. 대신 키 이름만 있고 값은 비운 .env.example을 커밋해서, 새 팀원이나 배포 서버가 어떤 값을 채워야 하는지 알 수 있게 해요.',
    },
    {
      id: 'au-01-12', type: 'mcq', source: 'HTTP Basic 인증의 원리',
      question: 'Basic 인증의 한계가 아닌 것은?',
      choices: ['요청마다 비밀번호가 전송된다', '서버 쪽에서 "로그아웃"을 깔끔하게 구현하기 어렵다', '로그인 화면 디자인을 바꿀 수 없다', 'HTTPS에서는 전혀 사용할 수 없다'],
      answer: 3,
      choiceExplanations: [
        '맞는 한계예요. 노출 기회가 많아요.',
        '맞는 한계예요. 브라우저가 자격 증명을 기억해 계속 보내요.',
        '맞는 한계예요. 브라우저 기본 창만 떠요.',
        '정답(한계가 아님). 오히려 HTTPS에서만 써야 해요.',
      ],
      explanation: '이런 한계 때문에 일반 서비스는 "로그인 한 번 → 세션 ID나 토큰 발급 → 이후엔 그 값으로 인증" 구조를 써요. 다음 토픽에서 세션을 다뤄요.',
    },
  ],
}

export default topic

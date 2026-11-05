import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fs-03-3-pydantic',
  track: 'fullstack',
  group: '03. FastAPI와 DB 연결',
  title: '3-3. Pydantic 응답 모델',
  order: 303,
  notionId: '40bdf951bf8080c78327ed9d6f61251c',
  addedAt: '2026-11-06',
  sections: [
    {
      title: '응답의 모양을 약속하기',
      slides: [
        {
          title: 'DB 모델과 응답 모델은 달라요',
          blocks: [
            { type: 'say', text: '3-2 끝에서 "ORM 객체를 그대로 돌려주면 곤란하다"고 했죠. 이번 수업은 **응답의 모양을 정해 주는** Pydantic 응답 모델이에요.\n\n먼저 생각해 볼게요. 나중에 users 테이블에는 `password_hash`(비밀번호 암호값) 열이 생겨요. DB 모델을 그대로 응답하면?' },
            { type: 'ask', q: 'User ORM 객체를 그대로 return 하면 어떤 일이 생길 수 있을까요?', a: '`password_hash`까지 **API 응답에 그대로** 나갈 수 있어요. 누구나 개발자 도구로 볼 수 있죠. 실제로 일어나는 보안 사고예요.\n그래서 "DB에 저장하는 모양"과 "밖에 보여 주는 모양"을 **따로** 정해요. 밖에 보여 주는 모양이 **응답 모델**이에요.' },
            {
              type: 'table',
              head: ['', 'SQLAlchemy 모델 (3-2)', 'Pydantic 모델 (오늘)'],
              rows: [
                ['역할', 'DB 테이블과 연결', 'API로 주고받는 데이터 모양'],
                ['비유', '창고 안 재고 장부', '손님에게 보여 주는 메뉴판'],
                ['들어가는 것', '모든 열 (내부용 포함)', '보여 줄 것만'],
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'response_model 쓰기',
      slides: [
        {
          title: 'CourseOut 만들기',
          blocks: [
            {
              type: 'code',
              code: `from pydantic import BaseModel, ConfigDict

class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)   # ORM 객체의 속성에서 값을 읽어 와도 돼

    id: int
    title: str
    instructor: str
    price: int

@app.get("/courses", response_model=list[CourseOut])
def get_courses(db: Session = Depends(get_db)):
    return db.scalars(select(Course).order_by(Course.id)).all()`,
            },
            {
              type: 'list',
              items: [
                '`response_model=list[CourseOut]`: "응답은 CourseOut들의 **목록** 모양이야" (1-1의 `[ {}, {} ]`)',
                '`from_attributes=True`: 딕셔너리가 아니라 `course.title` 같은 **객체 속성**에서 값을 꺼내도 된다는 허락. ORM 객체를 받으려면 필요해요',
                'FastAPI가 return 값을 CourseOut 모양으로 **걸러서** JSON으로 바꿔요',
              ],
            },
          ],
        },
        {
          title: '응답 모델이 해 주는 세 가지',
          blocks: [
            {
              type: 'table',
              head: ['하는 일', '예'],
              rows: [
                ['**거르기**', 'CourseOut에 없는 속성(password_hash 등)은 응답에서 **빠짐**'],
                ['**검사**', 'DB에서 price가 NULL로 왔는데 모델은 `int`면 → 이상한 응답을 내보내는 대신 **서버 에러**로 알려 줌'],
                ['**문서**', '`/docs`에 응답 모양이 자동으로 표시 → 프론트 개발자가 보고 타입을 맞춤'],
              ],
            },
            { type: 'note', tone: 'tip', text: '1-2에서 키 오타(`tiele`)가 에러 없이 나가서 프론트에서 안 보인다고 했죠? 응답 모델이 있으면 모델에 없는 키는 안 나가고, 필요한 키(`title`)가 없으면 서버 쪽에서 바로 에러가 나요. **프론트에 도착하기 전에** 잡히는 거예요.' },
          ],
        },
      ],
    },
    {
      title: '요청 모델로 입력 검사하기',
      slides: [
        {
          title: '들어오는 데이터도 모양을 정해요',
          blocks: [
            { type: 'say', text: 'Pydantic은 나가는 쪽만이 아니라 **들어오는** 쪽도 지켜요. 강의를 새로 만드는 POST API를 볼게요.' },
            {
              type: 'code',
              code: `from pydantic import BaseModel, Field

class CourseCreate(BaseModel):              # 만들 때 받는 모양 (id는 없음, DB가 매기니까)
    title: str = Field(min_length=1, max_length=200)
    instructor: str
    price: int = Field(ge=0)                # 0 이상 (greater or equal)

@app.post("/courses", response_model=CourseOut, status_code=201)
def create_course(body: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**body.model_dump())    # 검사 통과한 값으로 ORM 객체 만들기
    db.add(course)
    db.commit()
    db.refresh(course)                      # DB가 매긴 id 등을 다시 읽어 옴
    return course`,
            },
          ],
        },
        {
          title: '잘못 보내면 422',
          blocks: [
            { type: 'ask', q: '프론트가 { "title": "", "price": -1000 } 을 보내면 어떻게 될까요?', a: '함수가 **실행되기도 전에** FastAPI가 Pydantic으로 검사해서 **422 Unprocessable Entity**를 돌려줘요. 본문에는 "title은 1자 이상", "price는 0 이상"처럼 어느 필드가 왜 틀렸는지가 담겨요. 우리 코드에는 if문 하나 없었는데요.' },
            {
              type: 'table',
              head: ['모델', '언제', '들어가는 것'],
              rows: [
                ['`CourseCreate`', '만들 때 받음', 'title, instructor, price (id 없음)'],
                ['`CourseOut`', '응답으로 보냄', 'id 포함, 보여 줄 것만'],
                ['`CourseUpdate`', '수정할 때 받음', '전부 선택(`None` 가능)'],
              ],
            },
            { type: 'say', text: '목적마다 모델을 **따로** 만드는 게 보통이에요. React 트랙 8-2의 `Omit`, `Partial`로 타입을 나누던 것과 같은 생각이에요. 그리고 2-4의 DB 제약(CHECK)과 함께 **두 겹으로** 지켜요. Pydantic이 먼저 막고, 그래도 뚫리면 DB가 막아요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'fs03-3-q1',
      source: '응답의 모양을 약속하기',
      type: 'mcq',
      question: 'DB 모델(User)을 그대로 API 응답으로 돌려주면 생길 수 있는 문제는?',
      choices: ['응답이 빨라진다', 'password_hash 같은 내부 값까지 밖으로 노출될 수 있다', 'CORS 에러', 'DB가 지워진다'],
      answer: 1,
      explanation: 'DB에 저장하는 모양과 밖에 보여 주는 모양을 나눠서, 응답 모델에는 보여 줄 것만 둬요.',
    },
    {
      id: 'fs03-3-q2',
      source: 'response_model 쓰기',
      type: 'short',
      question: 'Pydantic 모델이 ORM 객체의 속성(course.title)에서 값을 읽게 허락하는 설정은? (ConfigDict(____________=True))',
      answer: ['from_attributes'],
      explanation: '이 설정이 있어야 SQLAlchemy 객체를 그대로 return 해도 CourseOut 모양으로 바꿀 수 있어요.',
    },
    {
      id: 'fs03-3-q3',
      source: 'response_model 쓰기',
      type: 'ox',
      question: 'response_model=CourseOut 이면, return한 객체에 CourseOut에 없는 속성이 있어도 응답에는 포함되지 않는다.',
      answer: true,
      explanation: '응답 모델이 걸러서 정해진 모양만 내보내요. 민감한 값이 새는 걸 막아요.',
    },
    {
      id: 'fs03-3-q4',
      source: '요청 모델로 입력 검사하기',
      type: 'mcq',
      question: 'body: CourseCreate 로 받는 POST에 price: -1000 을 보냈다(price: int = Field(ge=0)). 결과는?',
      choices: ['그대로 저장된다', '함수 실행 전에 FastAPI가 422와 함께 어떤 필드가 왜 틀렸는지 돌려준다', '500 에러', '0으로 바뀐다'],
      answer: 1,
      explanation: '요청 모델이 입구에서 검사해요. 우리 코드에 if문이 없어도 돼요.',
    },
    {
      id: 'fs03-3-q5',
      source: '요청 모델로 입력 검사하기',
      type: 'mcq',
      question: '강의 생성 요청 모델(CourseCreate)에 id가 없는 이유는?',
      choices: ['깜빡해서', 'id는 DB가 IDENTITY로 매기니 받으면 안 되기 때문(2-4)', 'Pydantic이 id를 못 다뤄서', 'id는 문자열이라서'],
      answer: 1,
      explanation: '만들 때 받는 모양, 응답으로 보내는 모양, 수정할 때 받는 모양을 목적별로 따로 만들어요.',
    },
  ],
}

export default topic

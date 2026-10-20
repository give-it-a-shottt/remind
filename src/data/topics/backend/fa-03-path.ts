import type { Topic } from '../../types'

const topic: Topic = {
  id: 'fa-03-path',
  track: 'backend',
  group: 'FastAPI',
  title: '경로 파라미터',
  order: 23,
  sections: [
    {
      title: '경로 파라미터 기본',
      notionIds: ['3efdf951bf808141a071fd4cbb558ff9'],
      points: [
        '경로 안의 {이름} 부분이 경로 파라미터다. @app.get("/posts/{post_id}") 에 GET /posts/7 이 오면 함수의 post_id 파라미터에 7이 들어간다.',
        '데코레이터의 {이름}과 함수 파라미터 이름이 정확히 같아야 연결된다. 다르면 FastAPI는 그 함수 파라미터를 쿼리 파라미터로 착각한다.',
        '경로 파라미터는 항상 필수다. /posts/ 처럼 값이 비면 그 라우트에 매칭되지 않는다(404).',
        '경로 파라미터는 "어떤 자원 하나"를 가리킬 때 쓴다. /users/3, /posts/7/comments 처럼 자원의 위치를 나타낸다.',
      ],
      code: `@app.get("/posts/{post_id}")
def read_post(post_id: int):
    return {"post_id": post_id, "type": type(post_id).__name__}

# GET /posts/7    → {"post_id": 7, "type": "int"}
# GET /posts/abc  → 422 (int 변환 실패)`,
    },
    {
      title: '타입 변환과 검증',
      points: [
        'URL은 원래 모두 문자열이다. 타입 힌트를 int로 주면 FastAPI가 "7" → 7로 바꿔 준다. 타입 힌트가 없으면 문자열 그대로 들어온다.',
        '변환이 불가능하면("abc" → int) 함수는 실행되지 않고 422가 응답된다. float, bool, UUID, date 같은 타입도 쓸 수 있다.',
        'Path()로 숫자 범위를 선언할 수 있다. post_id: int = Path(ge=1) 이면 0이나 음수는 422로 거절된다. gt(초과), ge(이상), lt(미만), le(이하).',
        '요즘 권장 문법은 Annotated[int, Path(ge=1)] 다. 타입과 검증 정보를 한 곳에 묶는다(타입 힌트 고급 토픽).',
      ],
      code: `from typing import Annotated
from fastapi import Path

@app.get("/items/{item_id}")
def read_item(item_id: Annotated[int, Path(ge=1, le=10_000, description="상품 ID")]):
    return {"item_id": item_id}`,
    },
    {
      title: 'Enum으로 값 제한하기',
      points: [
        '경로 값이 정해진 몇 가지 중 하나여야 한다면 Enum을 쓴다. class Category(str, Enum): book = "book"; music = "music".',
        'str을 함께 상속하면 값이 문자열로 다뤄져 JSON으로 그대로 나가고, /docs에 선택 목록(드롭다운)이 생긴다.',
        '목록에 없는 값이 오면 422와 함께 "허용 값: book, music"이 응답된다. 함수 안에서는 category == Category.book 또는 category.value 로 비교한다.',
      ],
      code: `from enum import Enum

class Category(str, Enum):
    book = "book"
    music = "music"

@app.get("/categories/{category}")
def by_category(category: Category):
    if category is Category.book:
        return {"msg": "책 목록"}
    return {"msg": f"{category.value} 목록"}`,
    },
    {
      title: '라우트 순서와 경로 안의 경로',
      points: [
        '라우트는 등록 순서대로 비교된다. /users/me 같은 고정 경로는 /users/{user_id} 같은 변수 경로보다 먼저 선언해야 한다.',
        '파일 경로처럼 슬래시(/)가 포함된 값을 통째로 받으려면 {file_path:path} 를 쓴다. /files/a/b/c.txt → file_path = "a/b/c.txt".',
        '하위 자원은 경로 파라미터를 여러 개 쓴다. /posts/{post_id}/comments/{comment_id}. 이 경우 comment가 정말 그 post에 속하는지 DB에서 함께 확인해야 한다.',
      ],
      code: `@app.get("/users/me")          # 먼저!
def read_me(): ...

@app.get("/users/{user_id}")
def read_user(user_id: int): ...

@app.get("/files/{file_path:path}")
def read_file(file_path: str):
    return {"path": file_path}`,
    },
  ],
  questions: [
    {
      id: 'fa-03-01', type: 'mcq', source: '경로 파라미터 기본',
      question: '다음 코드에서 GET /books/12 요청을 보내면?',
      code: `@app.get("/books/{book_id}")
def read_book(id: int):
    return {"id": id}`,
      choices: ['{"id": 12}', '404 에러', '422 에러: 쿼리 파라미터 id가 필요하다고 응답', '500 에러'],
      answer: 2,
      choiceExplanations: [
        '경로의 {book_id}와 함수의 id 이름이 달라서 연결되지 않아요.',
        '/books/12는 라우트 모양과 맞아서 404는 아니에요.',
        '정답. 함수의 id는 경로에 같은 이름이 없으니 "필수 쿼리 파라미터"로 해석되고, ?id=가 없어서 422가 나요.',
        '함수가 실행되기 전에 검증에서 막혀요.',
      ],
      explanation: '연결 규칙: 함수 파라미터 이름이 경로의 {이름}과 같으면 경로 파라미터, 아니면(단순 타입일 때) 쿼리 파라미터.\nFastAPI는 이 실수에 경고를 주지 않아서 /docs에서 id가 query로 표시되는 걸 보고 알아채야 해요. def read_book(book_id: int)로 이름을 맞추면 해결돼요.',
    },
    {
      id: 'fa-03-02', type: 'ox', source: '경로 파라미터 기본',
      question: '경로 파라미터는 기본값을 주면 생략할 수 있는 선택 값이 된다.',
      answer: false,
      explanation: '경로 파라미터는 항상 필수예요. 경로 자체의 일부라서 값이 없으면 /posts/ 처럼 다른 경로가 돼 매칭되지 않아요.\n선택적인 값은 쿼리 파라미터(?page=1)로 받아야 해요.',
    },
    {
      id: 'fa-03-03', type: 'mcq', source: '타입 변환과 검증',
      question: '다음 코드에서 GET /items/3 과 GET /items/3.5 의 결과는?',
      code: `@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}`,
      choices: ['{"item_id": 3} / 422', '{"item_id": 3} / {"item_id": 3}', '{"item_id": "3"} / {"item_id": "3.5"}', '422 / 422'],
      answer: 0,
      choiceExplanations: [
        '정답. "3"은 int 3으로 변환되지만 "3.5"는 정수 문자열이 아니라서 422예요.',
        '"3.5"를 int로 바꾸면 소수점이 버려지는 게 아니라 검증 실패예요.',
        '타입 힌트가 int라서 문자열이 아니라 숫자로 변환돼요.',
        '"3"은 정상적으로 변환돼요.',
      ],
      explanation: 'Pydantic은 손실이 생기는 변환을 허용하지 않아요. "3.5" → int는 거절되고, 실제 float 3.0 같은 값만 int로 받아들여요.\n소수를 받고 싶다면 float로 선언하세요.',
    },
    {
      id: 'fa-03-04', type: 'mcq', source: '타입 변환과 검증',
      question: '상품 ID는 1 이상이어야 한다. 0이나 음수가 오면 자동으로 422를 돌려주도록 선언하는 방법은?',
      choices: ['item_id: int = Path(gt=1)', 'item_id: int = Path(ge=1)', 'item_id: int = Path(le=1)', 'if item_id < 1: return None'],
      answer: 1,
      choiceExplanations: [
        'gt = greater than(초과)라서 1도 거절돼요.',
        '정답. ge = greater than or equal(이상). 1은 통과, 0과 음수는 422예요.',
        'le = less than or equal(이하). 반대 조건이에요.',
        '동작은 하지만 None을 200으로 돌려주게 되고, 문서에도 규칙이 안 나타나요.',
      ],
      explanation: '숫자 검증 키워드: gt(>), ge(>=), lt(<), le(<=).\nPath(ge=1)로 선언하면 검증 + /docs 표시가 함께 돼요. 요즘 문법으로는 item_id: Annotated[int, Path(ge=1)]처럼 써요.',
    },
    {
      id: 'fa-03-05', type: 'short', source: '타입 변환과 검증',
      question: '숫자 검증 키워드 중 "미만(<)"을 뜻하는 것은? (gt, ge, lt, le 중 하나)',
      answer: ['lt'],
      explanation: 'lt = less than(<).\n외우는 법: g = greater(크다), l = less(작다), t = than(초과·미만, 같음 미포함), e = equal(이상·이하, 같음 포함).\nPath, Query, Field 모두 같은 키워드를 써요.',
    },
    {
      id: 'fa-03-06', type: 'mcq', source: 'Enum으로 값 제한하기',
      question: '정렬 기준을 경로로 받는다. "latest" 또는 "popular"만 허용하고 /docs에 선택 목록으로 보이게 하려면?',
      choices: ['sort: str 로 받고 함수 안에서 if 문으로 검사한다', 'sort: list[str] 로 받는다', 'sort: bool 로 받는다', 'class Sort(str, Enum): latest = "latest"; popular = "popular" 를 만들고 sort: Sort 로 받는다'],
      answer: 3,
      choiceExplanations: [
        '동작은 하지만 문서에 허용 값이 안 보이고, 틀린 값에 대한 에러 형식도 직접 만들어야 해요.',
        '목록을 받는 게 아니라 하나를 고르는 문제예요.',
        '두 가지 문자열 값을 bool로 표현하면 의미가 흐려져요.',
        '정답. 허용 값 이외는 422로 자동 거절되고, /docs에 드롭다운이 생겨요.',
      ],
      explanation: 'Enum은 "정해진 선택지"를 코드로 선언하는 방법이에요. str을 함께 상속하는 이유는 JSON 직렬화와 문자열 비교를 자연스럽게 하기 위해서예요.\n같은 기법을 쿼리 파라미터(?sort=latest)와 Pydantic 필드에도 그대로 쓸 수 있어요. 문자열 몇 개만 허용하는 간단한 경우엔 Literal["latest", "popular"]도 같은 효과예요.',
    },
    {
      id: 'fa-03-07', type: 'mcq', source: 'Enum으로 값 제한하기',
      question: 'class Category(str, Enum): book = "book" 이 있을 때, 함수 안에서 category가 book인지 확인하는 코드로 가장 알맞은 것은?',
      choices: ['category is Category.book', 'category == "Book"', 'category.name == "BOOK"', 'category in ["Category.book"]'],
      answer: 0,
      choiceExplanations: [
        '정답. Enum 멤버는 하나뿐인 객체라 is 비교가 정확해요. str Enum이라 category == "book"도 True예요.',
        '대소문자가 달라요. 값은 "book"이에요.',
        'name은 "book"(멤버 이름)이에요. 대문자가 아니에요.',
        '문자열 "Category.book"과 비교하면 False예요.',
      ],
      explanation: 'Enum 멤버의 두 속성: .name(코드에서의 이름)과 .value(실제 값).\nclass Category(str, Enum): book = "book" 에서 Category.book.name == "book", Category.book.value == "book".\n이름과 값을 다르게 줄 수도 있어요. 예: BOOK = "book".',
    },
    {
      id: 'fa-03-08', type: 'mcq', source: '라우트 순서와 경로 안의 경로',
      question: '다음 순서로 라우트를 등록했다. GET /users/me 요청의 결과는?',
      code: `@app.get("/users/{user_id}")
def read_user(user_id: int): ...

@app.get("/users/me")
def read_me(): ...`,
      choices: ['read_me가 실행된다', '422 에러 (user_id에 "me"를 int로 변환 실패)', '404 에러', '두 함수가 차례로 실행된다'],
      answer: 1,
      choiceExplanations: [
        '먼저 등록된 /users/{user_id}가 먼저 매칭돼서 read_me까지 가지 않아요.',
        '정답. 첫 라우트에 매칭된 뒤 "me" → int 변환에 실패해 422가 나요. 다음 라우트를 시도하지 않아요.',
        '경로 모양은 맞으니 404는 아니에요.',
        '한 요청에는 하나의 라우트만 실행돼요.',
      ],
      explanation: '고정 경로를 먼저, 변수 경로를 나중에 선언하세요.\n"매칭은 경로 모양만 보고, 타입 검증은 매칭 뒤에 한다"는 점이 핵심이에요. 그래서 타입이 안 맞아도 다음 라우트로 넘어가지 않아요.',
    },
    {
      id: 'fa-03-09', type: 'short', source: '라우트 순서와 경로 안의 경로',
      question: '/files/a/b/c.txt 요청에서 "a/b/c.txt" 전체를 한 파라미터로 받으려면 경로를 /files/{file_path:____} 로 선언한다. 빈칸은?',
      answer: ['path'],
      explanation: '{file_path:path}예요. Starlette의 path 변환기로, 슬래시를 포함한 나머지 경로 전체를 받아요.\n보안 주의: 이 값을 그대로 open()에 넘기면 "../../etc/passwd" 같은 경로 조작 공격에 당할 수 있어요. 허용된 폴더 밖으로 나가지 않는지 반드시 검사하세요.',
    },
    {
      id: 'fa-03-10', type: 'mcq', source: '라우트 순서와 경로 안의 경로',
      question: 'GET /posts/{post_id}/comments/{comment_id} 를 구현할 때 꼭 확인해야 하는 것은?',
      choices: ['해당 댓글이 정말 그 post_id의 글에 속하는지', 'comment_id가 post_id보다 큰지', 'post_id가 짝수인지', '두 값이 같은지'],
      answer: 0,
      choiceExplanations: [
        '정답. comment_id만으로 조회하면 /posts/1/comments/99 처럼 다른 글의 댓글도 보여 줄 수 있어요. WHERE id = :cid AND post_id = :pid로 함께 확인해요.',
        'ID 크기 비교는 의미가 없어요.',
        '의미 없는 조건이에요.',
        '서로 다른 테이블의 ID라 같을 이유가 없어요.',
      ],
      explanation: '경로가 "소속 관계"를 표현한다면 서버도 그 관계를 검증해야 해요. 그렇지 않으면 URL을 조작해 접근해선 안 되는 데이터에 닿을 수 있어요(권한 검사 누락의 흔한 형태예요).',
    },
    {
      id: 'fa-03-11', type: 'ox', source: '타입 변환과 검증',
      question: '경로 파라미터에 타입 힌트를 생략하면 FastAPI는 값을 문자열(str)로 넘겨준다.',
      answer: true,
      explanation: '맞아요. URL은 원래 문자열이라 타입 힌트가 없으면 변환·검증 없이 str로 들어와요.\n그러면 post_id + 1 같은 코드에서 TypeError(500)가 날 수 있어요. 경로 파라미터에는 항상 타입 힌트를 다는 습관을 들이세요.',
    },
    {
      id: 'fa-03-12', type: 'mcq', source: '경로 파라미터 기본',
      question: '다음 중 경로 파라미터보다 쿼리 파라미터로 받는 것이 더 자연스러운 값은?',
      choices: ['조회할 게시글의 id', '사용자의 id', '게시글 목록의 페이지 번호와 정렬 기준', '상품의 고유 코드'],
      answer: 2,
      choiceExplanations: [
        '자원 하나를 가리키니 경로(/posts/3)가 자연스러워요.',
        '자원 식별자라 경로가 자연스러워요.',
        '정답. 같은 자원(목록)을 "어떻게" 볼지에 대한 선택 사항이라 쿼리(?page=2&sort=latest)가 맞아요.',
        '자원 식별자라 경로가 자연스러워요.',
      ],
      explanation: '기준:\n• 경로 파라미터: 어떤 자원인지(필수, 식별)\n• 쿼리 파라미터: 그 자원을 어떻게 볼지(선택, 필터·정렬·페이지)\n다음 토픽에서 쿼리 파라미터를 자세히 다뤄요.',
    },
  ],
}

export default topic

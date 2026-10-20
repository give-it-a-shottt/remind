import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-13-gray-knowhow',
  track: 'backend',
  group: 'DB 설계',
  title: '8장. 그레이 노하우: 대리키 · 칼럼 기반 테이블 · 뷰 · 클렌징',
  order: 113,
  sections: [
    {
      title: '대리키: 기본키가 잘 작동하지 않을 때',
      points: [
        '자연키(업무 의미가 있는 키)가 곤란한 경우: 값이 바뀐다(사번 재발급), 재사용된다(퇴사자 번호를 신입에게), 유일하지 않을 수 있다(동명이인), 너무 길거나 복합키가 지나치게 커진다, 처음엔 값이 없다.',
        '대리키(surrogate key): 업무 의미 없는 일련번호(AUTO_INCREMENT, IDENTITY)나 UUID를 기본키로 쓴다. 절대 바뀌지 않고 짧아 FK와 인덱스에 유리하다.',
        '대리키를 쓰더라도 업무상 유일해야 하는 자연키에는 반드시 UNIQUE 제약을 건다. 그렇지 않으면 같은 이메일·같은 상품 코드가 id만 다르게 중복 저장된다.',
        '교재 관점: 대리키는 "자연키로 해결할 수 없을 때의 차선책"이다. 자연키가 안정적이면(국가 코드 KR, 통화 코드 KRW) 그대로 써도 좋다. 다만 웹 서비스 실무에서는 대부분의 엔티티에 대리키를 기본으로 쓰는 편이다.',
        '정수 일련번호 vs UUID: 정수는 작고 정렬이 쉬우나 URL에 노출되면 개수 추측·순차 조회 공격의 단서가 된다. UUID는 추측이 어렵고 여러 서버에서 생성 가능하지만 크고 무작위라 인덱스 삽입 효율이 떨어진다(시간 순 UUIDv7로 완화).',
      ],
      code: `CREATE TABLE products (
  id    BIGINT PRIMARY KEY AUTO_INCREMENT,   -- 대리키
  sku   VARCHAR(30) NOT NULL UNIQUE,          -- 업무 키는 UNIQUE 로 보호
  name  VARCHAR(100) NOT NULL
);`,
    },
    {
      title: '칼럼 기반 테이블(EAV)',
      points: [
        'EAV(Entity-Attribute-Value): 컬럼을 미리 정하지 않고 attributes(entity_id, attr_name, attr_value) 형태로 어떤 속성이든 행으로 저장하는 설계. "컬럼 추가 없이 무한 확장"이라는 유혹이 있다.',
        '문제: 자료형이 모두 문자열로 뭉개지고(숫자·날짜 비교가 어려움), NOT NULL·CHECK·FK 같은 제약을 걸 수 없고, 한 엔티티를 조회하려면 속성 수만큼 JOIN이나 피벗이 필요해 쿼리가 복잡하고 느리다.',
        '언제 쓰나: 속성이 정말로 사용자 정의라 미리 알 수 없을 때(상품 카테고리마다 스펙이 전혀 다름, 사용자 정의 필드). 이 경우에도 공통 속성은 일반 컬럼으로 두고 가변 부분만 EAV나 JSONB로 둔다.',
        '현대 RDB에서는 같은 문제를 JSON/JSONB 컬럼(+ 필요한 키에 인덱스)으로 푸는 경우가 많다.',
      ],
      code: `-- EAV
product_attrs(product_id, attr_name, attr_value)
-- (1, 'color', 'red'), (1, 'weight_g', '350'), (2, 'screen_inch', '27')

-- 대안: 공통은 컬럼, 가변 스펙은 JSONB
products(id, name, price, specs JSONB)   -- specs: {"color": "red", "weight_g": 350}`,
    },
    {
      title: '애드혹 집계 키와 다단계 뷰',
      points: [
        '애드혹 집계 키: 원래 업무에는 없지만 집계 편의를 위해 추가하는 키 컬럼. 예: 시·군·구 대신 영업 권역 코드, 나이 대신 연령대 코드. 집계 요구가 바뀔 때마다 컬럼이 늘고 의미가 흔들리기 쉽다.',
        '대안: 집계 단위는 별도 매핑 테이블(region_groups: 시군구 → 권역)로 관리하면, 권역 정의가 바뀌어도 원본 데이터를 고치지 않고 매핑만 바꾼다.',
        '뷰(VIEW): 저장된 SELECT. 복잡한 조인을 숨기고, 필요한 컬럼만 보여 줘 보안에도 쓰인다. 하지만 데이터를 저장하지 않으므로 뷰를 조회할 때마다 내부 SELECT가 실행된다.',
        '다단계 뷰: 뷰 위에 뷰, 그 위에 또 뷰. 겉으로는 단순한 SELECT가 실제로는 거대한 쿼리가 되어 성능을 예측하기 어렵고, 하위 뷰를 고치면 어디까지 영향이 가는지 알기 어렵다. 뷰는 1~2단계로 얕게 유지한다.',
        '자주 쓰는 무거운 집계라면 머티리얼라이즈드 뷰(결과를 저장하고 주기적으로 갱신, PostgreSQL 지원)나 요약 테이블을 고려한다.',
      ],
    },
    {
      title: '데이터 클렌징',
      points: [
        '데이터 클렌징: 표기 흔들림·중복·오류·누락을 정리해 데이터 품질을 확보하는 작업. "(주)ABC" / "㈜ABC" / "ABC 주식회사", 전화번호의 하이픈 유무, 전각·반각 문자, 앞뒤 공백.',
        '왜 중요한가: 아무리 잘 설계한 테이블도 들어오는 데이터가 지저분하면 집계·중복 판정·조인이 틀린다. 시스템 이전·통합(더블 마스터 해소) 때 특히 큰 작업이 된다.',
        '원칙 ① 입력 시점에 막기: 정규화(trim, 소문자, 하이픈 제거), 형식 검증(Pydantic), 선택지는 자유 입력 대신 목록으로. ② 저장된 데이터는 규칙을 문서화하고 스크립트로 정리, 정리 전후 건수를 검증. ③ 원본은 보존하고 정리 결과를 별도로 남기면 실수를 되돌릴 수 있다.',
        '크롤링 데이터(MongoDB 실습의 평점 "" 문제)처럼 외부에서 온 데이터는 저장 직전에 검증·정리하는 단계를 파이프라인에 넣는다.',
      ],
      code: `# 입력 시점 정규화 (Pydantic)
class CompanyIn(BaseModel):
    name: str
    phone: str

    @field_validator("name")
    @classmethod
    def norm_name(cls, v: str) -> str:
        return " ".join(v.replace("㈜", "(주)").split())

    @field_validator("phone")
    @classmethod
    def norm_phone(cls, v: str) -> str:
        return "".join(ch for ch in v if ch.isdigit())`,
    },
  ],
  questions: [
    {
      id: 'dbd-13-01', type: 'mcq', source: '대리키: 기본키가 잘 작동하지 않을 때',
      question: '대리키(surrogate key)를 쓰는 이유로 가장 알맞은 것은?',
      choices: ['자연키가 바뀌거나 재사용되거나 너무 길 때, 절대 바뀌지 않는 짧은 식별자가 필요해서', '업무 의미를 키에 담기 위해', 'UNIQUE 제약을 쓰지 않기 위해', '정규화를 피하기 위해'],
      answer: 0,
      choiceExplanations: [
        '정답. 안정성과 단순함이 대리키의 가치예요.',
        '대리키는 오히려 업무 의미가 없어요.',
        '대리키를 써도 업무 키에는 UNIQUE가 필요해요.',
        '정규화와는 별개의 결정이에요.',
      ],
      explanation: '기본키의 세 가지 요구: 유일, NOT NULL, 불변. 자연키가 "불변"을 못 지키면 대리키가 답이에요. 웹 서비스에서 id BIGINT 기본키가 거의 표준이 된 이유예요.',
    },
    {
      id: 'dbd-13-02', type: 'mcq', source: '대리키: 기본키가 잘 작동하지 않을 때',
      question: 'products에 대리키 id를 두고 sku(상품 코드)에는 아무 제약도 걸지 않았다. 생길 수 있는 문제는?',
      choices: ['문제없다', '같은 sku를 가진 상품이 id만 다르게 중복 저장될 수 있다', 'id가 중복된다', 'JOIN이 불가능하다'],
      answer: 1,
      choiceExplanations: [
        '대리키는 중복 행을 막아 주지 않아요.',
        '정답. 대리키 + 업무 키 UNIQUE가 한 세트예요.',
        'id는 기본키라 중복되지 않아요.',
        'JOIN은 가능해요.',
      ],
      explanation: '대리키의 함정: "id가 다르니 다른 행"이 되어 실제로는 같은 사실이 여러 번 들어가도 DB가 몰라요. 업무적으로 유일한 값(sku, email, (user_id, post_id))에는 항상 UNIQUE를 걸어요.',
    },
    {
      id: 'dbd-13-03', type: 'mcq', source: '대리키: 기본키가 잘 작동하지 않을 때',
      question: '주문 상세 URL이 /orders/1043 처럼 자동 증가 id를 그대로 쓴다. 보안상 고려할 점은?',
      choices: ['아무 문제 없다', 'id를 문자열로 바꾸면 해결된다', 'id를 1씩 바꿔 다른 주문을 조회하는 시도(IDOR)에 대비해 반드시 소유자 검사를 하고, 필요하면 추측 어려운 UUID나 별도 공개 ID를 쓴다', 'HTTPS를 쓰면 해결된다'],
      answer: 2,
      choiceExplanations: [
        '순차 id는 전체 주문 수 추정과 다른 주문 탐색의 단서가 돼요.',
        '형식만 바뀌고 순서는 그대로예요.',
        '정답. 근본 방어는 권한 검사이고, 추측 어려운 ID는 보조 수단이에요.',
        '전송 암호화와 권한 검사는 별개예요.',
      ],
      explanation: '정수 id의 장점(작고 빠름)은 유지하면서 외부에는 public_id(UUID, 짧은 무작위 문자열)를 노출하는 구성도 흔해요. UUIDv7은 시간 순으로 정렬돼 인덱스 효율 문제도 줄여요.',
    },
    {
      id: 'dbd-13-04', type: 'short', source: '대리키: 기본키가 잘 작동하지 않을 때',
      question: '업무 의미가 없는 일련번호나 UUID로 만든 기본키를 무엇이라 하나요? (___키)',
      answer: ['대리', '대리키', 'surrogate', 'surrogate key', '인조키', '인조'],
      explanation: '대리키(surrogate key, 인조키)예요. 반대는 자연키(natural key). 실무 조합: id(대리키, PK) + 업무 키(UNIQUE).',
    },
    {
      id: 'dbd-13-05', type: 'mcq', source: '칼럼 기반 테이블(EAV)',
      question: 'attrs(entity_id, name, value) 형태의 EAV 설계의 문제가 아닌 것은?',
      choices: ['새 속성을 추가할 때마다 ALTER TABLE이 필요하다', 'value가 문자열로 통일돼 숫자·날짜 비교와 검증이 어렵다', 'NOT NULL·FK·CHECK 같은 제약을 속성별로 걸 수 없다', '한 엔티티를 가로로 펼쳐 조회하려면 속성 수만큼 JOIN이나 피벗이 필요하다'],
      answer: 0,
      choiceExplanations: [
        '정답(문제 아님). 오히려 ALTER 없이 속성을 늘릴 수 있다는 게 EAV의 "유혹"이에요.',
        '맞는 문제예요.',
        '맞는 문제예요.',
        '맞는 문제예요.',
      ],
      explanation: 'EAV는 스키마의 역할(타입, 제약, 구조)을 포기하는 대가로 유연성을 얻어요. 정말 미리 알 수 없는 사용자 정의 속성에만 제한적으로 쓰고, 요즘은 JSONB + 필요한 키 인덱스로 대체하는 경우가 많아요.',
    },
    {
      id: 'dbd-13-06', type: 'short', source: '칼럼 기반 테이블(EAV)',
      question: '엔티티·속성 이름·값을 행으로 저장하는 칼럼 기반 테이블 설계를 영어 약어로 무엇이라 하나요? (3글자)',
      answer: ['EAV', 'eav'],
      explanation: 'EAV(Entity-Attribute-Value)예요. 의료 기록(검사 항목이 수천 가지)처럼 정당한 사용처도 있지만, 일반 업무 테이블을 EAV로 만들면 거의 확실히 후회해요.',
    },
    {
      id: 'dbd-13-07', type: 'mcq', source: '칼럼 기반 테이블(EAV)',
      question: '쇼핑몰 상품마다 스펙 항목이 크게 다르다(노트북: CPU·RAM, 의류: 사이즈·소재). 현실적인 설계는?',
      choices: ['모든 가능한 스펙을 컬럼으로 수백 개 만든다', '스펙을 한 TEXT 칸에 자유 문장으로 쓴다', '이름·가격 같은 공통 속성은 컬럼으로, 카테고리별 가변 스펙은 JSONB(또는 제한된 EAV)로 저장하고 자주 검색하는 키만 인덱스', '상품마다 테이블을 새로 만든다'],
      answer: 2,
      choiceExplanations: [
        '대부분 NULL인 희소 테이블이 돼요.',
        '검색·필터가 불가능해요.',
        '정답. 공통은 엄격하게, 가변은 유연하게 나누는 하이브리드예요.',
        '"테이블 분할" 안티패턴이 돼요.',
      ],
      explanation: '"모두 엄격"도 "모두 유연"도 아닌 경계 설계가 8장(그레이 노하우)의 주제예요. 규칙을 알고, 규칙을 넘는 이유와 비용을 설명할 수 있으면 돼요.',
    },
    {
      id: 'dbd-13-08', type: 'mcq', source: '애드혹 집계 키와 다단계 뷰',
      question: '영업 권역별 매출을 보려고 customers에 sales_region 컬럼을 추가하자는 의견이 나왔다. 권역 정의가 자주 바뀐다면 더 나은 방법은?',
      choices: ['그래도 고객마다 컬럼에 저장한다', '권역을 고객 이름에 붙인다', '매번 엑셀로 계산한다', '시군구 → 권역 매핑 테이블을 따로 두고 집계할 때 JOIN한다'],
      answer: 3,
      choiceExplanations: [
        '정의가 바뀔 때마다 수많은 고객 행을 고쳐야 해요.',
        '더블 미닝이 돼요.',
        '반복 작업이고 실수가 쌓여요.',
        '정답. 원본은 그대로 두고 매핑만 바꾸면 돼요.',
      ],
      explanation: '애드혹 집계 키를 원본 테이블에 직접 넣으면 집계 요구가 바뀔 때마다 원본이 흔들려요. "분류 체계"는 별도 테이블로 분리하는 게 변화에 강해요.',
    },
    {
      id: 'dbd-13-09', type: 'mcq', source: '애드혹 집계 키와 다단계 뷰',
      question: 'v_sales → v_sales_by_region → v_region_summary → v_dashboard 처럼 뷰를 4단계로 쌓았다. 예상되는 문제는?',
      choices: ['겉보기엔 단순한 SELECT가 실제로는 거대한 쿼리가 되어 성능을 예측하기 어렵고, 하위 뷰 변경의 영향 범위를 파악하기 어렵다', '데이터가 중복 저장되어 디스크가 부족해진다', '뷰는 SELECT를 지원하지 않는다', '뷰를 만들 수 없다'],
      answer: 0,
      choiceExplanations: [
        '정답. 다단계 뷰 안티패턴이에요.',
        '일반 뷰는 데이터를 저장하지 않아요.',
        '뷰는 SELECT로 조회해요.',
        '만들 수는 있어요.',
      ],
      explanation: '뷰는 편리한 추상화지만 "저장된 쿼리"일 뿐이에요. 깊게 쌓으면 옵티마이저도 사람도 전체를 이해하기 어려워요. 얕게 유지하고, 무거운 집계는 머티리얼라이즈드 뷰나 요약 테이블로.',
    },
    {
      id: 'dbd-13-10', type: 'ox', source: '애드혹 집계 키와 다단계 뷰',
      question: '일반 뷰(VIEW)는 결과 데이터를 저장해 두므로, 조회할 때 내부 SELECT가 다시 실행되지 않는다.',
      answer: false,
      explanation: '일반 뷰는 쿼리 정의만 저장하고 조회할 때마다 실행돼요. 결과를 저장하는 건 머티리얼라이즈드 뷰(PostgreSQL: CREATE MATERIALIZED VIEW, REFRESH로 갱신)예요. MySQL은 기본 지원이 없어 요약 테이블로 대신해요.',
    },
    {
      id: 'dbd-13-11', type: 'mcq', source: '데이터 클렌징',
      question: '거래처 이름에 "(주)ABC", "㈜ABC", " ABC 주식회사 "가 섞여 있다. 앞으로 이런 일을 막는 가장 효과적인 방법은?',
      choices: ['매달 사람이 엑셀로 고친다', '입력 시점에 정규화 규칙(공백 정리, 표기 통일)을 적용하고 형식을 검증한다', '이름 컬럼을 없앤다', '중복을 그대로 둔다'],
      answer: 1,
      choiceExplanations: [
        '사후 수작업은 계속 반복되고 실수가 생겨요.',
        '정답. 들어오는 순간 깨끗하게 만드는 게 가장 싸요. 이미 쌓인 데이터는 별도로 스크립트로 정리해요.',
        '요구사항을 버려요.',
        '집계·중복 판정이 틀려요.',
      ],
      explanation: '데이터 품질 = 입구에서 지키기(검증·정규화) + 쌓인 것 정리하기(클렌징 스크립트, 전후 건수 검증, 원본 보존). Pydantic field_validator가 바로 입구 역할을 해요.',
    },
    {
      id: 'dbd-13-12', type: 'short', source: '데이터 클렌징',
      question: '표기 흔들림·중복·오류를 정리해 데이터 품질을 확보하는 작업을 무엇이라 하나요? (데이터 ____)',
      answer: ['클렌징', 'cleansing', '정제', '클리닝', 'cleaning', '데이터클렌징'],
      explanation: '데이터 클렌징(정제)이에요. 시스템 이전, 마스터 통합, 분석 프로젝트에서 가장 많은 시간이 드는 작업으로 꼽혀요. 설계가 아무리 좋아도 데이터가 지저분하면 결과가 틀려요.',
    },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-06-normalization-1',
  track: 'backend',
  group: 'DB 설계',
  title: '3장 ②. 정규화: 제1 · 제2 · 제3정규형',
  order: 106,
  sections: [
    {
      title: '정규화란 무엇이고 왜 하나',
      slides: [
        {
          title: '하나의 사실은 한 곳에만',
          blocks: [
            { type: 'say', text: 'DB 설계의 핵심, **정규화**예요. 정규화는 테이블을 규칙에 따라 **분해**해서 "**하나의 사실은 한 곳에만**" 저장되게 만드는 과정이에요.\n\n정규화하지 않으면 **갱신 이상**(anomaly)이 생겨요. 주문 테이블에 상품명까지 같이 저장했다고 해 볼게요.' },
            {
              type: 'table',
              head: ['이상', '무슨 일'],
              rows: [
                ['**삽입** 이상', '주문이 없으면 새 상품 정보를 **넣을 수 없음**'],
                ['**갱신** 이상', '같은 상품명이 여러 행에 있어서 하나만 고치면 값이 **어긋남**'],
                ['**삭제** 이상', '마지막 주문을 지우면 **상품 정보까지 사라짐**'],
              ],
            },
          ],
        },
        {
          title: '함수 종속과 무손실 분해',
          blocks: [
            { type: 'say', text: '정규화의 기반은 **함수 종속**이에요. "A가 정해지면 B가 **하나로** 정해진다"를 `A → B`로 써요. 예: `상품코드 → 상품명`.\n\n정규화는 **무손실 분해**여야 해요. 나눈 테이블을 다시 JOIN하면 원래 정보를 **그대로 복원**할 수 있어야 해요. 나누다가 정보가 사라지면 안 되죠.' },
            { type: 'note', tone: 'tip', text: '1NF·2NF·3NF를 한 문장으로 외우는 법: "**키에(1NF), 키 전체에(2NF), 그리고 오직 키에만(3NF) 종속된다**" (The key, the whole key, and nothing but the key). 실무에서는 보통 **3NF(또는 BCNF)** 까지가 기본 목표예요.' },
          ],
        },
      ],
    },
    {
      title: '제1정규형: 스칼라 값',
      slides: [
        {
          title: '한 칸에는 값 하나',
          blocks: [
            { type: 'code', code: `-- 위반
users(id, name, hobbies)         -- hobbies = '등산,독서,요리'
contacts(id, name, phone1, phone2, phone3)   -- 반복 그룹

-- 1NF
users(id, name)
user_hobbies(user_id, hobby)     -- (1,'등산'), (1,'독서'), (1,'요리')` },
            { type: 'say', text: '**제1정규형**: 모든 칸이 더 쪼갤 수 없는 **하나의 값**(원자값)이어야 해요.\n• 한 칸에 `"등산,독서,요리"` → 위반\n• `phone1, phone2, phone3`처럼 같은 종류 컬럼 반복(**반복 그룹**) → 위반. 전화가 4개면? 컬럼을 또 추가해야 해요\n\n해결: 여러 값은 **별도 테이블의 여러 행**으로.' },
          ],
        },
        {
          title: '1NF를 어기면 생기는 일',
          blocks: [
            { type: 'say', text: '"독서가 취미인 사람"을 찾으려면 `LIKE \'%독서%\'`를 써야 해요. 인덱스도 못 쓰고(sa-05), **"독서실"** 도 걸려요. 취미 하나를 지우려면 문자열을 잘라 붙여야 하고요.\n\nal-01의 신고 문제에서 한 칸에 신고자를 이어 붙이지 않고 set으로 관리한 것과 같은 생각이에요.' },
            { type: 'note', tone: 'tip', text: '그렇다고 모든 걸 극단적으로 쪼갤 필요는 없어요. 주소를 시·구·동으로 나눌지는 "**그 단위로 검색·집계하는가**"로 정해요. 구별 통계를 내야 하면 나누고, 배송 라벨에 찍기만 하면 한 칸으로 충분해요.' },
          ],
        },
      ],
    },
    {
      title: '제2정규형: 부분 함수 종속 제거',
      slides: [
        {
          title: '키 "전체"에 종속',
          blocks: [
            { type: 'code', code: `-- 위반: 키는 (order_no, product_code)
order_items(order_no, product_code, qty, product_name, unit_price)
--   qty          ← (order_no, product_code) 전체에 종속 ✅
--   product_name ← product_code 에만 종속 ❌ (부분 종속)

-- 2NF
order_items(order_no, product_code, qty)
products(product_code, product_name, unit_price)` },
            { type: 'say', text: '**제2정규형**: 1NF이면서, 키가 아닌 모든 컬럼이 기본키 **전체**에 종속돼야 해요. 키의 **일부**에만 종속되는 컬럼(**부분 함수 종속**)이 있으면 안 돼요.\n\n수량은 "**어느 주문의 어느 상품**"이어야 정해지지만, 상품명은 **상품코드만** 알면 정해지죠. 그래서 상품명은 상품코드를 키로 하는 테이블로 분리해요.' },
            { type: 'note', tone: 'tip', text: '부분 종속은 **복합 키**일 때만 생겨요. 기본키가 컬럼 **하나**면 "키의 일부"라는 게 없으니, 1NF만 만족하면 자동으로 2NF예요.' },
          ],
        },
      ],
    },
    {
      title: '제3정규형: 이행적 함수 종속 제거',
      slides: [
        {
          title: '키 "에만" 종속',
          blocks: [
            { type: 'code', code: `-- 위반: emp_no → dept_code → dept_name
employees(emp_no, name, dept_code, dept_name)

-- 3NF
employees(emp_no, name, dept_code)
departments(dept_code, dept_name)` },
            { type: 'say', text: '**제3정규형**: 2NF이면서, 키가 아닌 컬럼이 **다른 키가 아닌 컬럼을 거쳐** 키에 종속되면(**이행적 함수 종속**) 안 돼요. `키 → A → B` 모양이요.\n\n부서명은 사원번호가 아니라 **부서코드**가 정해요. 사원 테이블에 있으면\n• 부서명이 바뀌면 그 부서 사원 행을 **전부** 고쳐야 하고 (갱신 이상)\n• 사원이 없는 새 부서는 **등록할 수 없어요** (삽입 이상)' },
            { type: 'note', tone: 'analogy', text: '학생 명부에 **담임 선생님 전화번호**까지 적어 두면, 선생님이 번호를 바꿀 때 반 학생 30명 칸을 다 고쳐야 해요. 학생 명부엔 **담임 선생님 이름**만, 전화번호는 **교사 명부**에 한 번만 적는 게 3NF예요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 'dbd-06-01', type: 'mcq', source: '정규화란 무엇이고 왜 하나',
      question: '주문 테이블에 상품명이 함께 저장돼 있다. 마지막으로 남은 주문을 삭제했더니 그 상품의 이름 정보까지 사라졌다. 이 현상은?',
      choices: ['삽입 이상', '갱신 이상', '삭제 이상', '정상 동작'],
      answer: 2,
      choiceExplanations: [
        '삽입 이상은 "다른 정보가 없어서 넣을 수 없는" 문제예요.',
        '갱신 이상은 "여러 곳 중 일부만 고쳐 값이 어긋나는" 문제예요.',
        '정답. 지우려던 사실(주문) 외에 다른 사실(상품명)까지 함께 사라졌어요.',
        '상품 정보는 주문과 별개로 유지돼야 해요.',
      ],
      explanation: '세 가지 이상 현상 모두 원인은 하나예요. "서로 다른 사실이 한 테이블에 섞여 있다". 정규화는 사실별로 테이블을 나눠 이 문제를 구조적으로 없애요.',
    },
    {
      id: 'dbd-06-02', type: 'short', source: '정규화란 무엇이고 왜 하나',
      question: '"A가 정해지면 B가 하나로 정해진다"(A → B)는 관계를 무엇이라 하나요? (__ 종속)',
      answer: ['함수', '함수종속', '함수 종속', 'functional dependency', 'fd'],
      explanation: '함수 종속(functional dependency)이에요. 상품코드 → 상품명, 사원번호 → 부서코드. 정규화는 결국 "어떤 함수 종속이 테이블 안에 있으면 안 되는가"의 규칙이에요(2NF: 부분 종속, 3NF: 이행 종속).',
    },
    {
      id: 'dbd-06-03', type: 'ox', source: '정규화란 무엇이고 왜 하나',
      question: '정규화로 나눈 테이블들은 다시 JOIN하면 원래 정보를 손실 없이 복원할 수 있어야 한다.',
      answer: true,
      explanation: '맞아요. 이를 무손실 분해(lossless decomposition)라고 해요. 잘못 나누면 JOIN 결과에 원래 없던 가짜 행이 생기거나 정보가 빠져요. 공통 키(외래키)를 남기고 나누는 게 핵심이에요.',
    },
    {
      id: 'dbd-06-04', type: 'mcq', source: '제1정규형: 스칼라 값',
      question: '제1정규형을 위반한 설계는?',
      choices: ['users(id, name, email)', 'posts(id, title, tags) — tags에 "python,fastapi,db"', 'orders(id, user_id, total)', 'user_hobbies(user_id, hobby)'],
      answer: 1,
      choiceExplanations: [
        '모든 값이 하나씩이에요.',
        '정답. 한 칸에 여러 값을 넣었어요. post_tags(post_id, tag) 테이블로 분리해요.',
        '모든 값이 하나씩이에요.',
        '1NF로 분리된 결과예요.',
      ],
      explanation: 'CSV 문자열 컬럼은 편해 보여도 검색(LIKE \'%python%\'은 "cpython"도 걸림), 집계(태그별 글 수), 수정, 무결성(존재하는 태그만 허용) 모두 어려워져요. 7장의 "비스칼라 값" 안티패턴이에요.',
    },
    {
      id: 'dbd-06-05', type: 'mcq', source: '제1정규형: 스칼라 값',
      question: 'contacts(id, name, phone1, phone2, phone3) 설계의 문제와 해결은?',
      choices: ['문제없다', 'phone 컬럼을 TEXT로 바꾼다', '반복 그룹이라 네 번째 번호를 넣을 수 없고 번호 검색이 세 컬럼에 걸친다 → phones(contact_id, phone) 테이블로 분리', 'phone1만 남기고 지운다'],
      answer: 2,
      choiceExplanations: [
        '구조적 한계가 있어요.',
        '자료형의 문제가 아니에요.',
        '정답. 개수 제한이 사라지고, 번호 하나로 검색·인덱스가 가능해져요.',
        '데이터를 잃어요.',
      ],
      explanation: '같은 의미의 컬럼에 번호를 붙여 반복하는 것도 1NF 위반(반복 그룹)이에요. "몇 개까지일지 모르는 값"은 행으로 표현하는 게 관계형의 방식이에요.',
    },
    {
      id: 'dbd-06-06', type: 'mcq', source: '제2정규형: 부분 함수 종속 제거',
      question: 'order_items(order_no, product_code, qty, product_name)의 기본키는 (order_no, product_code)다. 2NF 위반의 원인이 되는 컬럼은?',
      choices: ['qty', 'order_no', 'product_code', 'product_name'],
      answer: 3,
      choiceExplanations: [
        '수량은 "어느 주문의 어느 상품"이 정해져야 정해지니 키 전체에 종속돼요.',
        '키 구성 요소예요.',
        '키 구성 요소예요.',
        '정답. 상품명은 상품코드(키의 일부)만으로 정해지는 부분 종속이에요.',
      ],
      explanation: '부분 종속 찾기: 복합 키의 각 부분만으로 정해지는 컬럼이 있는지 보세요. 있으면 그 부분을 키로 하는 테이블(products)로 옮겨요.',
    },
    {
      id: 'dbd-06-07', type: 'ox', source: '제2정규형: 부분 함수 종속 제거',
      question: '기본키가 컬럼 하나(단일 키)인 테이블은 제1정규형만 만족하면 자동으로 제2정규형도 만족한다.',
      answer: true,
      explanation: '맞아요. 부분 종속은 "키의 일부"가 있어야 생기는데, 단일 키에는 일부가 없어요. 그래서 2NF 문제는 복합 키 테이블에서만 확인하면 돼요.',
    },
    {
      id: 'dbd-06-08', type: 'mcq', source: '제3정규형: 이행적 함수 종속 제거',
      question: 'employees(emp_no, name, dept_code, dept_name)가 3NF를 위반하는 이유는?',
      choices: ['emp_no가 기본키라서', 'emp_no → dept_code → dept_name 처럼 키가 아닌 컬럼을 거쳐 종속되는 이행 종속이 있어서', 'name이 중복될 수 있어서', 'dept_code가 문자라서'],
      answer: 1,
      choiceExplanations: [
        '기본키는 정상이에요.',
        '정답. 부서명은 사원이 아니라 부서에 대한 사실이에요. departments 테이블로 분리해요.',
        '동명이인은 정상이에요.',
        '자료형과 무관해요.',
      ],
      explanation: '이행 종속의 신호: "이 컬럼은 사실 다른 무언가(부서)에 대한 정보다". 그 무언가가 테이블로 독립해야 할 엔티티예요.',
    },
    {
      id: 'dbd-06-09', type: 'mcq', source: '제3정규형: 이행적 함수 종속 제거',
      question: '위 employees를 3NF로 바꾸지 않으면 생기는 문제로 맞는 것은?',
      choices: ['사원을 등록할 수 없다', 'JOIN이 필요해진다', '부서명을 바꾸려면 그 부서의 모든 사원 행을 고쳐야 하고, 사원이 없는 부서는 등록할 수 없다', '인덱스를 만들 수 없다'],
      answer: 2,
      choiceExplanations: [
        '사원 등록은 가능해요.',
        '오히려 3NF로 나누면 JOIN이 필요해져요(정규화의 비용, 5장).',
        '정답. 갱신 이상과 삽입 이상이 동시에 생겨요.',
        '인덱스와 무관해요.',
      ],
      explanation: '정규화의 이득(정합성, 갱신 단순화)과 비용(JOIN 증가)은 항상 함께 와요. 5장에서 이 트레이드오프와 비정규화를 다뤄요.',
    },
    {
      id: 'dbd-06-10', type: 'short', source: '제3정규형: 이행적 함수 종속 제거',
      question: '키 → A → B 처럼 키가 아닌 컬럼을 거쳐 이루어지는 종속을 무엇이라 하나요? (___ 함수 종속)',
      answer: ['이행적', '이행', '이행적 함수 종속', '이행 종속', 'transitive'],
      explanation: '이행적 함수 종속(transitive dependency)이에요. 이걸 없애면 3NF. 2NF는 부분 종속 제거, 3NF는 이행 종속 제거로 짝지어 기억하세요.',
    },
    {
      id: 'dbd-06-11', type: 'mcq', source: '정규화란 무엇이고 왜 하나',
      question: '"The key, the whole key, and nothing but the key"를 정규형에 대응시킨 것으로 맞는 것은?',
      choices: ['key=3NF, whole key=1NF, nothing but=2NF', '모두 BCNF', '모두 1NF', 'key=1NF(키가 있고 값이 원자적), whole key=2NF(키 전체에 종속), nothing but the key=3NF(키에만 종속)'],
      answer: 3,
      choiceExplanations: [
        '순서가 섞였어요.',
        'BCNF는 다음 토픽이에요.',
        '세 가지 정규형을 요약한 말이에요.',
        '정답. 키가 있어야 하고(1NF), 키 전체에 종속하고(2NF, 부분 종속 금지), 키 외의 것에 종속하지 않아야(3NF, 이행 종속 금지) 해요.',
      ],
      explanation: '모든 비키 컬럼은 "키에 대한, 키 전체에 대한, 오직 키에 대한 사실"이어야 한다. 이 한 문장으로 1~3NF 위반을 점검할 수 있어요.',
    },
    {
      id: 'dbd-06-12', type: 'mcq', source: '제1정규형: 스칼라 값',
      question: '주소를 하나의 컬럼(address)으로 둘지, 시/구/상세로 나눌지 정하는 가장 좋은 기준은?',
      choices: ['무조건 최대한 잘게 나눈다', '무조건 하나로 둔다', '그 단위(시, 구)로 검색·집계·검증할 필요가 있는지에 따라 정한다', 'DB 종류에 따라 정한다'],
      answer: 2,
      choiceExplanations: [
        '쓰지도 않는 단위로 나누면 복잡도만 늘어요.',
        '"시별 매출" 같은 요구가 있으면 하나로는 부족해요.',
        '정답. "원자값"의 기준은 업무에서 그 값을 하나로 다루는가예요.',
        'DB 종류와는 무관한 논리 설계 판단이에요.',
      ],
      explanation: '1NF의 "더 쪼갤 수 없는 값"은 절대적인 게 아니라 업무 관점의 판단이에요. 날짜를 연/월/일 컬럼으로 나누지 않는 것처럼, 하나로 다루는 값은 하나로 둬요.',
    },
  ],
}

export default topic

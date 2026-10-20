import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-07-normalization-2',
  track: 'backend',
  group: 'DB 설계',
  title: '3장 ③. BCNF · 제4 · 제5정규형과 정규화 정리',
  order: 107,
  sections: [
    {
      title: '보이스-코드 정규형(BCNF)',
      points: [
        'BCNF: 테이블의 모든 함수 종속 A → B에서 A가 슈퍼키(후보키를 포함한 키)여야 한다. 즉 "키가 아닌 것이 무언가를 결정하는" 종속이 없어야 한다.',
        '3NF와의 차이: 3NF는 "키가 아닌 컬럼"의 종속만 문제 삼는다. BCNF는 "키의 일부(키 속성)를 키가 아닌 컬럼이 결정하는" 경우까지 막는다. 후보키가 여러 개이고 서로 겹칠 때 주로 드러난다.',
        '예: 수강지도(학생, 과목, 교수). 규칙: 교수는 한 과목만 가르친다(교수 → 과목). 한 학생은 과목당 교수 한 명. 키는 (학생, 과목). 3NF는 만족하지만 교수 → 과목에서 교수는 키가 아니므로 BCNF 위반.',
        '해결: 담당(교수, 과목) + 지도(학생, 교수). 다만 BCNF로 분해하면 원래 있던 종속("학생+과목 → 교수")을 한 테이블의 제약으로 표현하기 어려워지는(종속성 보존 실패) 경우가 있어, 3NF에서 멈추기도 한다.',
      ],
      code: `-- 3NF 이지만 BCNF 위반: 교수 → 과목 (교수는 키가 아님)
advising(student, subject, professor)   -- PK (student, subject)

-- BCNF
teaching(professor, subject)            -- PK professor
advising(student, professor)            -- PK (student, professor)`,
    },
    {
      title: '제4정규형: 다치 종속',
      points: [
        '다치 종속(multi-valued dependency): A가 정해지면 B의 "집합"이 정해지는데, 그 집합이 다른 컬럼 C와 독립적인 경우. A →→ B.',
        '예: 직원(직원, 기술, 언어). 직원의 기술 목록과 사용 언어 목록은 서로 무관하다. 한 테이블에 두면 기술 × 언어의 모든 조합을 행으로 넣어야 한다(kim의 기술 2개 × 언어 3개 = 6행). 언어 하나를 추가하면 기술 수만큼 행을 추가해야 한다.',
        '제4정규형(4NF): 자명하지 않은 다치 종속을 없앤다 → 직원기술(직원, 기술) + 직원언어(직원, 언어).',
        '실무 감각: "서로 관계없는 두 목록을 한 테이블에 함께 넣지 않는다". 제1정규형을 지키려고 여러 다중값을 한 테이블에 펼치다 생기는 경우가 많다.',
      ],
      code: `-- 4NF 위반: 기술과 언어가 서로 독립
emp_skill_lang(emp, skill, language)
-- (kim, python, 한국어) (kim, python, 영어) (kim, sql, 한국어) (kim, sql, 영어) ...

-- 4NF
emp_skills(emp, skill)
emp_languages(emp, language)`,
    },
    {
      title: '제5정규형: 결합 종속',
      points: [
        '제5정규형(5NF, 투영-결합 정규형): 테이블을 세 개 이상으로 나눠야만 중복이 사라지고, 그 세 테이블을 JOIN하면 원래대로 복원되는 경우(결합 종속)를 분해한 상태.',
        '예: (영업사원, 회사, 제품). "사원이 회사를 담당하고, 회사가 제품을 취급하고, 사원이 제품을 다룰 수 있으면 → 사원이 그 회사에 그 제품을 판다"는 규칙이 있다면, 세 개의 2개짜리 관계로 나눌 수 있다.',
        '이런 규칙이 업무에 정말 있는지 판단하기 어렵고 실무에서 드물다. 교재도 "개념만 이해하면 충분"하다고 본다.',
      ],
    },
    {
      title: '정규화 정리',
      points: [
        '1NF: 원자값(반복 그룹·다중값 없음) → 2NF: 부분 함수 종속 제거 → 3NF: 이행 함수 종속 제거 → BCNF: 모든 결정자가 키 → 4NF: 다치 종속 제거 → 5NF: 결합 종속 제거.',
        '높은 정규형은 낮은 정규형을 모두 만족한다. 정규화할수록 중복과 갱신 이상은 줄고 테이블 수와 JOIN은 늘어난다.',
        '실무 목표는 보통 3NF(또는 BCNF). 그 이상은 특수한 경우에만 의식한다.',
        '정규화는 "갱신(쓰기)의 정합성"을 위한 것이다. 조회 성능 때문에 의도적으로 되돌리는 것이 비정규화이며, 이는 정규화를 먼저 한 뒤 근거를 가지고 한다(5장).',
        '정규화의 본질은 "하나의 사실은 한 곳에(One fact in one place)". 이 문장을 기준으로 어떤 설계든 점검할 수 있다.',
      ],
    },
  ],
  questions: [
    {
      id: 'dbd-07-01', type: 'mcq', source: '보이스-코드 정규형(BCNF)',
      question: 'BCNF의 조건으로 맞는 것은?',
      choices: ['모든 컬럼이 원자값이다', '부분 함수 종속이 없다', '다치 종속이 없다', '모든 함수 종속에서 결정자(왼쪽)가 슈퍼키다'],
      answer: 3,
      choiceExplanations: [
        '1NF의 조건이에요.',
        '2NF의 조건이에요.',
        '4NF의 조건이에요.',
        '정답. "키가 아닌 것이 무언가를 결정하면 안 된다".',
      ],
      explanation: 'BCNF는 3NF를 더 엄격하게 만든 것이에요. 3NF는 비키 컬럼끼리의 종속만 막지만, BCNF는 비키 컬럼이 키 컬럼을 결정하는 경우까지 막아요.',
    },
    {
      id: 'dbd-07-02', type: 'mcq', source: '보이스-코드 정규형(BCNF)',
      question: 'advising(student, subject, professor), 기본키 (student, subject), 규칙 "교수는 한 과목만 가르친다". BCNF 위반의 원인이 되는 종속은?',
      choices: ['(student, subject) → professor', 'student → student', 'professor → subject', 'subject → student'],
      answer: 2,
      choiceExplanations: [
        '결정자가 키라서 문제없어요.',
        '자명한 종속이에요.',
        '정답. professor는 키가 아닌데 subject(키의 일부)를 결정해요.',
        '이런 종속은 없어요(과목을 여러 학생이 들어요).',
      ],
      explanation: '이 테이블은 3NF예요(비키 컬럼 professor가 다른 비키 컬럼을 결정하지 않으니까요). 하지만 BCNF는 아니에요. 그 결과 "박 교수는 DB 과목" 정보가 학생 수만큼 반복되고, 학생이 없으면 담당 정보를 저장할 수 없어요.',
    },
    {
      id: 'dbd-07-03', type: 'ox', source: '보이스-코드 정규형(BCNF)',
      question: 'BCNF로 분해하면 원래 테이블에서 표현되던 함수 종속을 하나의 테이블 제약으로 유지하지 못하는(종속성 보존이 안 되는) 경우가 있다.',
      answer: true,
      explanation: '맞아요. 수강지도 예에서 분해 후에는 "학생+과목 → 교수(한 학생은 과목당 교수 한 명)"를 한 테이블의 UNIQUE로 표현하기 어려워져요. 그래서 실무에서는 3NF에서 멈추고 그 종속을 제약으로 지키는 선택도 해요. 정규형은 높을수록 무조건 좋은 게 아니라 트레이드오프예요.',
    },
    {
      id: 'dbd-07-04', type: 'mcq', source: '제4정규형: 다치 종속',
      question: 'emp_skill_lang(emp, skill, language)에서 직원의 기술과 언어는 서로 무관하다. 이 설계의 문제는?',
      choices: ['기술 × 언어의 모든 조합을 행으로 넣어야 해서, 언어 하나를 추가할 때 기술 수만큼 행을 추가해야 한다', '기본키를 만들 수 없다', 'NULL이 생기지 않는다', '조회가 불가능하다'],
      answer: 0,
      choiceExplanations: [
        '정답. 다치 종속 때문에 생기는 조합 폭발과 갱신 이상이에요.',
        '(emp, skill, language) 전체를 키로 만들 수는 있어요.',
        'NULL 여부가 핵심이 아니에요. 오히려 조합을 맞추려 NULL을 넣는 꼼수가 생기기도 해요.',
        '조회는 가능해요.',
      ],
      explanation: '4NF 해결: emp_skills(emp, skill) + emp_languages(emp, language). "서로 독립적인 두 개의 여러 값 목록을 한 테이블에 함께 두지 않는다".',
    },
    {
      id: 'dbd-07-05', type: 'short', source: '제4정규형: 다치 종속',
      question: 'A가 정해지면 B의 "값 집합"이 정해지고, 그것이 다른 컬럼과 독립적인 종속(A →→ B)을 무엇이라 하나요? (__ 종속)',
      answer: ['다치', '다치종속', '다치 종속', '다가', 'multivalued', 'multi-valued', 'mvd'],
      explanation: '다치 종속(multi-valued dependency, MVD)이에요. 이걸 제거한 상태가 4NF예요.',
    },
    {
      id: 'dbd-07-06', type: 'mcq', source: '제5정규형: 결합 종속',
      question: '제5정규형에 대한 설명으로 맞는 것은?',
      choices: ['원자값에 관한 규칙이다', '부분 함수 종속을 제거한다', '두 개로는 무손실 분해가 안 되고 세 개 이상으로 나눠야만 중복이 사라지는 결합 종속을 다룬다', '실무에서 가장 자주 의식하는 정규형이다'],
      answer: 2,
      choiceExplanations: [
        '1NF예요.',
        '2NF예요.',
        '정답. 나눈 테이블들을 JOIN하면 정확히 원래가 복원되는 관계(결합 종속)예요.',
        '실무에서는 드물게 등장해요.',
      ],
      explanation: '5NF는 "세 요소 사이의 순환 규칙"이 업무에 실제로 있을 때만 의미가 있어요. 그런 규칙이 없는데 나누면 JOIN 결과에 가짜 조합이 생겨요. 개념을 알아 두되 무리하게 적용하지 않아요.',
    },
    {
      id: 'dbd-07-07', type: 'mcq', source: '정규화 정리',
      question: '정규형과 제거 대상의 짝이 틀린 것은?',
      choices: ['1NF - 반복 그룹·다중값', '4NF - 결합 종속', '2NF - 부분 함수 종속', '3NF - 이행 함수 종속'],
      answer: 1,
      choiceExplanations: [
        '맞는 짝이에요.',
        '정답(틀린 짝). 4NF는 다치 종속, 결합 종속은 5NF예요.',
        '맞는 짝이에요.',
        '맞는 짝이에요.',
      ],
      explanation: '1NF 원자값 → 2NF 부분 종속 → 3NF 이행 종속 → BCNF 결정자는 키 → 4NF 다치 종속 → 5NF 결합 종속. 순서대로 앞의 것을 모두 포함해요.',
    },
    {
      id: 'dbd-07-08', type: 'short', source: '정규화 정리',
      question: '정규화의 본질을 한 문장으로 요약하면 "하나의 사실은 ___ 곳에"다. 빈칸은? (한 글자 또는 숫자)',
      answer: ['한', '1', '하나', '한곳', '한 곳'],
      explanation: '"One fact in one place". 같은 사실이 여러 곳에 있으면 언젠가 어긋나요. 정규화는 이 원칙을 체계적으로 지키는 방법이고, 비정규화는 성능을 위해 이 원칙을 "알고서" 일부 어기는 것이에요.',
    },
    {
      id: 'dbd-07-09', type: 'ox', source: '정규화 정리',
      question: '정규화를 높일수록 조회 성능도 항상 좋아진다.',
      answer: false,
      explanation: '정규화는 쓰기의 정합성과 중복 제거가 목적이에요. 테이블이 늘어나면 조회 시 JOIN이 늘어나 오히려 느려질 수 있어요. 이 트레이드오프를 다루는 게 5장(정규화의 단점과 비정규화)이에요.',
    },
    {
      id: 'dbd-07-10', type: 'mcq', source: '정규화 정리',
      question: '실무에서 일반적으로 목표로 삼는 정규화 수준은?',
      choices: ['1NF', '3NF 또는 BCNF', '5NF', '정규화하지 않는다'],
      answer: 1,
      choiceExplanations: [
        '부분·이행 종속으로 인한 갱신 이상이 남아요.',
        '정답. 대부분의 갱신 이상이 사라지고 테이블 수도 과하지 않은 균형점이에요.',
        '드문 경우에만 의미가 있어요.',
        '갱신 이상과 데이터 불일치가 쌓여요.',
      ],
      explanation: '먼저 3NF(BCNF)까지 정규화 → 실제 쿼리와 부하를 보고 → 필요한 곳만 근거를 가지고 비정규화. 이 순서가 교재가 말하는 "정석"이에요.',
    },
    {
      id: 'dbd-07-11', type: 'mcq', source: '보이스-코드 정규형(BCNF)',
      question: '3NF이지만 BCNF가 아닌 테이블이 생기기 쉬운 상황은?',
      choices: ['기본키가 정수 하나뿐일 때', '컬럼이 두 개뿐일 때', '후보키가 여러 개이고 서로 일부 컬럼을 공유(겹침)할 때', 'NULL이 없을 때'],
      answer: 2,
      choiceExplanations: [
        '단일 키 + 3NF면 대부분 BCNF예요.',
        '두 컬럼짜리 테이블은 항상 BCNF예요.',
        '정답. 겹치는 복합 후보키가 있을 때 "키의 일부를 비키가 결정"하는 상황이 생겨요.',
        'NULL과 무관해요.',
      ],
      explanation: '수강지도 예: 후보키 (student, subject)와 (student, professor)가 student를 공유해요. 이런 구조가 보이면 BCNF를 의심해 보세요.',
    },
    {
      id: 'dbd-07-12', type: 'ox', source: '제4정규형: 다치 종속',
      question: '서로 관계없는 두 개의 다중값 속성(취미, 자격증)을 하나의 테이블에 함께 펼쳐 넣으면 4NF 위반이 되기 쉽다.',
      answer: true,
      explanation: '맞아요. 1NF를 지키려고 다중값을 행으로 펼칠 때, 서로 독립적인 목록 두 개를 한 테이블에 넣으면 조합 폭발이 일어나요. 목록마다 별도 테이블(user_hobbies, user_certificates)로 나누면 4NF가 돼요.',
    },
  ],
}

export default topic

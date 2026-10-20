import type { Topic } from '../../types'

const topic: Topic = {
  id: 'dbd-14-tree',
  track: 'backend',
  group: 'DB 설계',
  title: '9장. RDB로 트리 구조 다루기',
  order: 114,
  sections: [
    {
      title: '관계형 DB의 약점: 계층 구조',
      points: [
        '조직도, 카테고리(대·중·소분류), 댓글의 답글, 폴더 구조, 메뉴는 모두 트리(계층) 구조다. 깊이가 정해져 있지 않다는 점이 어렵다.',
        '관계형 모델은 평평한 테이블의 집합이라, "깊이를 모르는 재귀적 관계"를 표현하고 조회하는 것이 본래 약점이다.',
        '대표 모델: 인접 리스트(parent_id), 경로 열거(path 문자열), 중첩 집합(left/right 번호), 폐쇄 테이블(조상-자손 쌍을 모두 저장). 교재는 인접 리스트와 폐쇄 테이블을 중심으로 비교한다.',
      ],
    },
    {
      title: '인접 리스트 모델',
      points: [
        '각 노드가 부모의 id를 가진다: categories(id, name, parent_id). 루트는 parent_id가 NULL.',
        '장점: 구조가 직관적이고, 노드 추가(부모 지정)·이동(parent_id 하나 변경)이 간단하다. 바로 아래 자식 조회도 쉽다(WHERE parent_id = ?).',
        '단점: "특정 노드의 모든 자손" 또는 "루트까지의 모든 조상"을 구하려면 깊이만큼 반복 조회해야 했다(N단계 = N번 셀프 조인 또는 앱에서 반복).',
        '"오래되었지만 새로운 해법": 표준 SQL의 재귀 CTE(WITH RECURSIVE)를 MySQL 8.0, PostgreSQL, SQLite 등이 지원하면서, 인접 리스트로도 한 번의 쿼리로 전체 자손을 구할 수 있게 됐다.',
        '주의: 데이터 오류로 순환(A의 부모가 B, B의 부모가 A)이 생기면 재귀가 끝나지 않을 수 있다. 깊이 제한이나 순환 검사가 필요하다.',
      ],
      code: `-- 3번 카테고리의 모든 하위 카테고리 (재귀 CTE)
WITH RECURSIVE sub AS (
  SELECT id, name, parent_id, 0 AS depth
  FROM categories WHERE id = 3
  UNION ALL
  SELECT c.id, c.name, c.parent_id, sub.depth + 1
  FROM categories c JOIN sub ON c.parent_id = sub.id
)
SELECT * FROM sub;`,
    },
    {
      title: '폐쇄 테이블 모델',
      points: [
        '노드 테이블과 별도로, 모든 "조상-자손" 쌍을 저장하는 폐쇄 테이블(closure table)을 둔다: tree_paths(ancestor, descendant, depth). 자기 자신과의 쌍(depth 0)도 넣는다.',
        '장점: 모든 자손 조회(WHERE ancestor = ?), 모든 조상 조회(WHERE descendant = ?), 특정 깊이 조회가 재귀 없이 단순한 JOIN 한 번으로 끝난다. 인덱스도 잘 활용된다.',
        '노드 추가: 새 노드 N을 부모 P 아래에 붙일 때, P의 모든 조상 각각과 N의 쌍(depth + 1)을 넣고 자기 자신 쌍(N, N, 0)을 넣는다.',
        '단점: 저장 공간이 많이 든다(깊이가 깊을수록 쌍이 많아짐). 서브트리 이동은 관련 쌍을 지우고 다시 넣어야 해 복잡하다. 두 테이블의 정합성을 트랜잭션으로 함께 지켜야 한다.',
      ],
      code: `categories(id, name)
tree_paths(ancestor, descendant, depth)   -- PK (ancestor, descendant)

-- 3번의 모든 자손
SELECT c.* FROM categories c
JOIN tree_paths t ON t.descendant = c.id
WHERE t.ancestor = 3 AND t.depth > 0;

-- 새 노드 9 를 부모 3 아래에 추가
INSERT INTO tree_paths (ancestor, descendant, depth)
SELECT ancestor, 9, depth + 1 FROM tree_paths WHERE descendant = 3
UNION ALL SELECT 9, 9, 0;`,
    },
    {
      title: '어떤 모델을 쓸까',
      points: [
        '인접 리스트(+ 재귀 CTE): 구조 변경(추가·이동)이 잦고, 깊이가 적당하고, DB가 재귀 CTE를 지원하면 1순위. 가장 단순하다. 댓글·답글, 일반적인 카테고리.',
        '폐쇄 테이블: 조상·자손 조회가 매우 잦고 빨라야 하며, 구조 변경은 상대적으로 드문 경우. 권한 상속(상위 조직의 권한이 하위로), 대규모 조직도.',
        '경로 열거(path = "/1/3/9/"): 자손 조회를 LIKE \'/1/3/%\'로 하고 경로를 그대로 보여 줄 수 있지만, 이동 시 하위 경로를 모두 바꿔야 하고 참조 무결성을 걸 수 없다.',
        '중첩 집합(left, right 번호): 서브트리 조회가 범위 조건 하나로 끝나지만, 노드 하나 추가에도 많은 행의 번호를 다시 매겨야 해 쓰기가 무겁다.',
        '선택 기준: 읽기 패턴(자손/조상을 얼마나 자주), 쓰기 패턴(추가·이동이 얼마나 잦은지), 깊이, 사용하는 DB의 기능. 여러 모델을 함께 쓰기도 한다(parent_id + 경로 캐시).',
      ],
    },
  ],
  questions: [
    {
      id: 'dbd-14-01', type: 'mcq', source: '관계형 DB의 약점: 계층 구조',
      question: '트리 구조가 관계형 DB에서 다루기 어려운 근본 이유는?',
      choices: ['트리는 데이터가 적어서', 'SQL에 SELECT가 없어서', '트리에는 기본키가 없어서', '깊이가 정해지지 않은 재귀적 관계를, 평평한 테이블과 고정된 JOIN으로 표현·조회해야 해서'],
      answer: 3,
      choiceExplanations: [
        '데이터 양과 무관해요.',
        'SELECT는 있어요.',
        '노드마다 기본키를 둘 수 있어요.',
        '정답. 깊이를 모르니 몇 번 JOIN해야 할지 미리 쓸 수 없어요.',
      ],
      explanation: '그래서 계층형 DB, 그래프 DB 같은 다른 모델이 존재해요. RDB에서는 재귀 CTE나 별도 구조(폐쇄 테이블 등)로 이 약점을 보완해요.',
    },
    {
      id: 'dbd-14-02', type: 'mcq', source: '인접 리스트 모델',
      question: '인접 리스트 모델(categories.parent_id)에서 가장 쉬운 작업은?',
      choices: ['특정 노드의 모든 자손을 재귀 없이 한 번에 구하기', '루트까지 모든 조상을 JOIN 한 번으로 구하기', '노드를 다른 부모 아래로 옮기기(parent_id 하나만 변경)', '모든 노드의 깊이를 저장 없이 한 번에 구하기'],
      answer: 2,
      choiceExplanations: [
        '재귀(CTE)가 필요해요.',
        '깊이만큼 반복하거나 재귀가 필요해요.',
        '정답. 이동·추가가 간단한 게 인접 리스트의 큰 장점이에요. 하위 노드들은 자동으로 따라와요.',
        '재귀로 계산해야 해요.',
      ],
      explanation: '인접 리스트 = 쓰기 쉬움, 깊은 읽기 어려움(재귀 필요). 폐쇄 테이블 = 깊은 읽기 쉬움, 쓰기·공간 비용. 이 대비가 9장의 핵심이에요.',
    },
    {
      id: 'dbd-14-03', type: 'short', source: '인접 리스트 모델',
      question: '인접 리스트에서 모든 자손을 한 번의 쿼리로 구할 때 쓰는 SQL 문법은? WITH ________ (영어 한 단어)',
      answer: ['RECURSIVE', 'recursive'],
      explanation: 'WITH RECURSIVE(재귀 공통 테이블 식)예요. 시작 행(앵커) + UNION ALL + 자기 자신을 참조하는 부분(재귀)으로 구성돼요. MySQL 8.0+, PostgreSQL, SQLite 3.8.3+에서 쓸 수 있어요.',
    },
    {
      id: 'dbd-14-04', type: 'mcq', source: '인접 리스트 모델',
      question: '재귀 CTE로 자손을 구하는 쿼리가 끝나지 않는다. 데이터에서 의심할 문제는?',
      choices: ['A의 부모가 B이고 B의 부모가 A인 순환 참조', '노드 이름이 같은 경우', '루트가 하나뿐인 경우', '자식이 없는 노드가 있는 경우'],
      answer: 0,
      choiceExplanations: [
        '정답. 순환이 있으면 재귀가 같은 노드를 계속 방문해요. 깊이 제한(WHERE depth < 100)이나 방문 경로 검사를 넣어요.',
        '이름 중복은 재귀에 영향이 없어요.',
        '정상적인 트리예요.',
        '리프 노드는 정상이에요.',
      ],
      explanation: '인접 리스트는 FK만으로 "순환 없음"을 보장하지 못해요. 노드를 이동할 때 "새 부모가 내 자손이 아닌지" 확인하는 검사를 앱이나 트리거에 둬야 해요.',
    },
    {
      id: 'dbd-14-05', type: 'mcq', source: '폐쇄 테이블 모델',
      question: '폐쇄 테이블 tree_paths(ancestor, descendant, depth)에 저장되는 것은?',
      choices: ['각 노드의 부모 하나', '루트에서 노드까지의 경로 문자열', '노드의 왼쪽·오른쪽 번호', '모든 조상-자손 쌍(자기 자신 쌍 포함)과 그 거리'],
      answer: 3,
      choiceExplanations: [
        '그건 인접 리스트예요.',
        '그건 경로 열거예요.',
        '그건 중첩 집합이에요.',
        '정답. 그래서 어떤 조상·자손 관계든 행 하나로 바로 찾을 수 있어요.',
      ],
      explanation: '깊이 d인 노드는 d + 1개의 쌍(조상 d개 + 자기 자신)을 가져요. 트리가 깊고 크면 행이 많아지지만, 조회는 인덱스를 탄 단순 JOIN으로 끝나요.',
    },
    {
      id: 'dbd-14-06', type: 'mcq', source: '폐쇄 테이블 모델',
      question: '폐쇄 테이블에서 "3번 노드의 모든 자손"을 구하는 조건은?',
      choices: ['WHERE descendant = 3', 'WHERE depth = 3', 'WHERE ancestor = 3 AND depth > 0', 'WHERE ancestor = descendant'],
      answer: 2,
      choiceExplanations: [
        '3번의 모든 조상(자기 포함)이에요.',
        '깊이가 3인 쌍이에요.',
        '정답. 3을 조상으로 가진 모든 쌍에서 자기 자신(depth 0)만 빼요.',
        '모든 노드의 자기 자신 쌍이에요.',
      ],
      explanation: '방향만 기억하면 돼요: 자손 = ancestor로 걸기, 조상 = descendant로 걸기, 직계 자식 = ancestor = ? AND depth = 1.',
    },
    {
      id: 'dbd-14-07', type: 'ox', source: '폐쇄 테이블 모델',
      question: '폐쇄 테이블 모델에서 서브트리를 다른 부모 아래로 옮기는 작업은 인접 리스트보다 복잡하다.',
      answer: true,
      explanation: '맞아요. 옮기는 서브트리의 모든 노드에 대해, 옛 조상들과의 쌍을 지우고 새 조상들과의 쌍을 다시 넣어야 해요(한 트랜잭션으로). 인접 리스트는 parent_id 하나만 바꾸면 끝이에요.',
    },
    {
      id: 'dbd-14-08', type: 'mcq', source: '폐쇄 테이블 모델',
      question: '폐쇄 테이블에서 노드 9를 부모 3 아래에 새로 추가할 때 넣어야 하는 행은?',
      choices: ['부모 3의 모든 조상 a에 대해 (a, 9, depth + 1), 그리고 (9, 9, 0)', '(3, 9, 1) 하나', '(9, 3, 1) 하나', '아무것도 넣지 않는다'],
      answer: 0,
      choiceExplanations: [
        '정답. "3을 자손으로 가진 모든 쌍"을 복사해 자손을 9로, 깊이를 +1, 그리고 자기 자신 쌍.',
        '3의 조상(예: 루트 1)과 9의 관계가 빠져요.',
        '방향이 반대예요.',
        '관계가 기록되지 않아요.',
      ],
      explanation: 'INSERT ... SELECT ancestor, 9, depth + 1 FROM tree_paths WHERE descendant = 3 UNION ALL SELECT 9, 9, 0. 노드 테이블 INSERT와 같은 트랜잭션에서 실행해 정합성을 지켜요.',
    },
    {
      id: 'dbd-14-09', type: 'mcq', source: '어떤 모델을 쓸까',
      question: '게시판 댓글·답글(깊이 3~4 정도, 답글 추가가 잦고 글마다 전체 댓글을 한 번에 보여 줌)에 가장 무난한 선택은?',
      choices: ['폐쇄 테이블', '중첩 집합', 'EAV', '인접 리스트(parent_id) + 글 단위로 전부 조회 후 앱에서 트리 구성 또는 재귀 CTE'],
      answer: 3,
      choiceExplanations: [
        '가능하지만 쓰기가 잦은 데 비해 이점이 작아요.',
        '답글 하나 추가에도 번호를 많이 다시 매겨야 해요.',
        '트리 모델이 아니에요.',
        '정답. 단순하고 추가가 쉬워요. 한 글의 댓글은 post_id로 한 번에 가져와 메모리에서 트리를 만들면 재귀 쿼리도 필요 없어요.',
      ],
      explanation: '실무 팁: "전체 트리를 통째로 가져와도 되는 크기"라면 parent_id로 한 번에 읽고 앱(파이썬 dict)에서 조립하는 게 가장 단순해요. 큰 트리의 일부만 자주 탐색할 때 폐쇄 테이블·재귀 CTE가 빛나요.',
    },
    {
      id: 'dbd-14-10', type: 'mcq', source: '어떤 모델을 쓸까',
      question: '경로 열거 모델(path = "/1/3/9/")의 단점으로 맞는 것은?',
      choices: ['자손 조회가 불가능하다', '노드를 옮기면 그 아래 모든 노드의 경로 문자열을 바꿔야 하고, 경로 안의 id에 참조 무결성(FK)을 걸 수 없다', '경로를 화면에 보여 줄 수 없다', '깊이를 알 수 없다'],
      answer: 1,
      choiceExplanations: [
        "LIKE '/1/3/%' 로 조회할 수 있어요.",
        '정답. 문자열 안의 id는 DB가 검증해 주지 않아요(비스칼라 값의 일종).',
        '오히려 경로(빵 부스러기)를 바로 보여 주기 좋아요.',
        '슬래시 개수로 알 수 있어요.',
      ],
      explanation: '모델마다 강점과 비용이 달라요. 인접 리스트(쓰기 쉬움), 경로 열거(조회·표시 쉬움, 무결성 약함), 중첩 집합(서브트리 조회 빠름, 쓰기 무거움), 폐쇄 테이블(조상·자손 조회 빠름, 공간·이동 비용).',
    },
    {
      id: 'dbd-14-11', type: 'short', source: '폐쇄 테이블 모델',
      question: '모든 조상-자손 쌍을 별도 테이블에 저장하는 트리 모델의 이름은? (___ 테이블)',
      answer: ['폐쇄', '폐쇄테이블', '폐쇄 테이블', 'closure', 'closure table', '클로저', '클로저 테이블'],
      explanation: '폐쇄 테이블(closure table)이에요. "추이적 폐쇄(transitive closure)" — 직접 관계뿐 아니라 거쳐서 이어지는 모든 관계까지 미리 펼쳐 저장한다는 뜻에서 온 이름이에요.',
    },
    {
      id: 'dbd-14-12', type: 'ox', source: '어떤 모델을 쓸까',
      question: '트리 모델은 하나만 골라야 하며, 인접 리스트와 경로 캐시 같은 방식을 함께 쓰는 것은 불가능하다.',
      answer: false,
      explanation: '함께 쓰기도 해요. 예: parent_id(원본, 이동 쉬움) + path(조회·표시용 캐시) 또는 + 폐쇄 테이블. 대신 여러 표현을 같은 트랜잭션에서 맞춰야 하는 동기화 책임이 생겨요(비정규화와 같은 트레이드오프).',
    },
  ],
}

export default topic

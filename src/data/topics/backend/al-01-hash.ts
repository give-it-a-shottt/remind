import type { Topic } from '../../types'

const topic: Topic = {
  id: 'al-01-hash',
  track: 'backend',
  group: '알고리즘',
  title: '알고리즘 1. 해시 (오픈채팅방 · 신고 결과 받기)',
  order: 301,
  notionId: '3f4df951bf8080b386d6ea387d6549c6',
  sections: [
    {
      title: '해시 (파이썬 dict)',
      points: [
        '키로 값을 O(1)에 바로 찾는 자료구조 — 리스트처럼 처음부터 뒤질 필요가 없다',
        '프론트: 유저 ID → 닉네임 맵을 두고 렌더링할 때 최신 이름으로 바꿔 보여줄 때',
        '백엔드: 신고·좋아요 같은 이벤트를 유저별로 집계하고 중복을 걸러낼 때',
      ],
    },
    {
      title: '자료구조별 만들기 · 추가',
      points: [
        'list: [] / .append(x) — 순서 있음, 중복 허용',
        'set: set() / .add(x) — 순서 없음, 중복 자동 제거',
        'dict: {} 또는 dict() / d[키] = 값 — 같은 키면 덮어쓰기',
        '빈 set은 반드시 set(). {}는 빈 dict',
        '꺼내기는 d[키], 없을 수도 있으면 d.get(키) (KeyError 대신 None)',
        '= 는 바꿔치기, append/add는 추가',
        '파이썬 map()은 자료구조가 아니라 함수. JS의 Map은 파이썬 dict에 해당',
      ],
    },
    {
      title: '문법 정리',
      points: [
        'split()은 괄호를 비우면 공백 기준',
        'cmd, uid, *rest = line.split() — 남은 건 rest 리스트로 (없으면 [])',
        '{name: i for i, name in enumerate(id_list)} — 이름 → 인덱스 매핑',
        'defaultdict(set) — 없는 키도 자동으로 빈 set 생성',
      ],
      code: `cmd, uid, *rest = "Enter uid1234 Muzi".split()
idx = {name: i for i, name in enumerate(id_list)}
from collections import defaultdict
reported = defaultdict(set)`,
    },
    {
      title: '[프론트] 오픈채팅방',
      points: [
        '닉네임은 기록을 끝까지 봐야 확정된다 → 두 번 순회',
        '1번째: Enter·Change로 아이디 → 최종 닉네임 저장',
        '2번째: Enter·Leave 메시지를 최종 닉네임으로 생성 (Change는 메시지 없음)',
        '시간 O(N), 공간 O(N)',
        '실무: 메시지 DB에는 닉네임이 아니라 user_id를 저장하고, 그릴 때 최신 닉네임을 붙인다',
      ],
      code: `def solution(record):
    msg = {"Enter": "님이 들어왔습니다.", "Leave": "님이 나갔습니다."}
    nick, logs = {}, []
    for line in record:
        cmd, uid, *rest = line.split()
        if rest:
            nick[uid] = rest[0]
        if cmd in msg:
            logs.append((cmd, uid))
    return [nick[uid] + msg[cmd] for cmd, uid in logs]`,
    },
    {
      title: '[백엔드] 신고 결과 받기',
      points: [
        '신고당한 사람 → 신고자 set으로 중복 신고 제거',
        '신고자 수가 k 이상이면 신고한 사람들에게 메일 +1',
        '시간 O(N + M), 공간 O(N + M)',
        'idx 사전은 DB의 AUTO_INCREMENT가 아니라 INDEX에 가깝다 (이름 → 위치를 미리 만들어 빠르게 찾기)',
        '실무: 중복 신고는 DB에서 (신고자, 피신고자) UNIQUE 제약으로 막는다',
      ],
      code: `def solution(id_list, report, k):
    reported = {name: set() for name in id_list}
    answer = [0] * len(id_list)
    idx = {name: i for i, name in enumerate(id_list)}
    for line in report:
        a, b = line.split()
        reported[b].add(a)
    for target, reporters in reported.items():
        if len(reporters) >= k:
            for p in reporters:
                answer[idx[p]] += 1
    return answer`,
    },
    {
      title: '오픈채팅방 사고 과정',
      points: [
        '신호: "아이디로 닉네임을 찾음, 같은 아이디는 덮어씀" → dict',
        '신호: "나중에 바꾼 닉네임이 예전 메시지에도 반영" → 끝까지 봐야 확정 → 두 번 순회',
        '닉네임 사전은 반복문 밖에서 한 번만 만든다',
        '최적화 버전: (명령, 아이디)를 logs에 저장해 split을 1번만, 메시지는 msg 사전 조회 — 복잡도는 O(N)으로 같다',
      ],
    },
    {
      title: '신고 결과 받기 사고 과정',
      points: [
        '신호: "같은 유저를 여러 번 신고해도 1회" → set, "결과는 id_list 순서" → 이름 → 위치 사전',
        'index()로 매번 찾으면 숨은 반복이 생긴다',
        '최적화 버전: defaultdict(set), set(report)로 중복 문자열 먼저 제거, defaultdict(int)로 메일 집계 후 id_list 순서로 꺼내기',
      ],
      code: `from collections import defaultdict

def solution(id_list, report, k):
    reported = defaultdict(set)
    for line in set(report):
        a, b = line.split()
        reported[b].add(a)
    mail = defaultdict(int)
    for reporters in reported.values():
        if len(reporters) >= k:
            for p in reporters:
                mail[p] += 1
    return [mail[name] for name in id_list]`,
    },
    {
      title: '트러블슈팅',
      points: [
        '한 번 순회하며 바로 메시지 생성 → 이후 닉네임 변경을 모름',
        'x == "Enter" or "Change"는 (x == "Enter") or ("Change")라 항상 참 → x in ("Enter", "Change")',
        'reported[b] = a는 덮어써서 마지막 1명만 남음 → set + add',
        '없는 키에 add → KeyError → 미리 초기화 또는 defaultdict(set)',
        '결과 길이 [0,0,0,0] 하드코딩 → [0] * len(id_list)',
      ],
    },
    {
      title: '면접 숙제',
      points: [
        '리스트 조회 O(N) vs 해시 평균 O(1) → N번 조회면 O(N²) vs O(N)',
        'set과 dict 모두 해시 기반. dict는 키-값, set은 키만 → 중복 자동 제거',
        '닉네임 변경 반영: 메시지엔 user_id, 닉네임은 users 테이블 한 곳 (정규화)',
        '중복 신고 방지: (reporter_id, target_id) UNIQUE 제약 — 앱 체크만 하면 경쟁 조건',
      ],
    },
  ],
  questions: [
    { id: 'al-01-01', type: 'mcq', source: '해시 (파이썬 dict)', question: '키로 값을 찾을 때 dict의 평균 시간복잡도는?', choices: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'], answer: 0, explanation: '해시는 키로 바로 찾아가 평균 O(1). 리스트는 처음부터 뒤져 O(N).' },
    { id: 'al-01-02', type: 'mcq', source: '자료구조별 만들기 · 추가', question: '빈 set을 만드는 올바른 코드는?', choices: ['s = {}', 's = set()', 's = []', 's = set[]'], answer: 1, choiceExplanations: ['{}는 빈 dict예요.', '정답.', '[]는 빈 리스트예요.', '문법 오류예요.'], explanation: '빈 set은 반드시 set(). {}는 빈 dict.' },
    { id: 'al-01-03', type: 'mcq', source: '자료구조별 만들기 · 추가', question: 'set에 값을 추가하는 메서드는?', choices: ['.append(x)', '.add(x)', '.push(x)', 's[x] = True'], answer: 1, explanation: 'list는 append, set은 add, dict는 d[키] = 값.' },
    { id: 'al-01-04', type: 'short', source: '자료구조별 만들기 · 추가', question: 'dict에 키가 없을 수도 있을 때 KeyError 대신 None을 받으려면 어떤 메서드를 쓸까요?', answer: ['get', '.get', 'd.get(키)', 'get()'], explanation: 'd.get(키) → 없으면 None (기본값도 지정 가능).' },
    { id: 'al-01-05', type: 'ox', source: '자료구조별 만들기 · 추가', question: '파이썬의 map()은 JS의 Map처럼 키-값을 저장하는 자료구조다.', answer: false, explanation: '파이썬 map()은 함수(list(map(int, ...)))예요. JS의 Map에 해당하는 건 dict.' },
    { id: 'al-01-06', type: 'mcq', source: '문법 정리', question: 'cmd, uid, *rest = "Leave uid1234".split() 실행 후 rest는?', choices: ['None', '[]', "['']", '에러'], answer: 1, explanation: '*rest는 남은 것을 리스트로 받아요. 남은 게 없으면 빈 리스트.' },
    { id: 'al-01-07', type: 'short', source: '문법 정리', question: '없는 키에 접근해도 자동으로 빈 set을 만들어 주는 사전은? (collections 모듈)', answer: ['defaultdict(set)', 'defaultdict'], explanation: 'from collections import defaultdict → reported = defaultdict(set)' },
    { id: 'al-01-08', type: 'mcq', source: '[프론트] 오픈채팅방', question: '오픈채팅방 문제를 두 번 순회하는 이유는?', choices: ['속도를 높이려고', '닉네임은 기록을 끝까지 봐야 확정되기 때문', 'Leave 메시지를 지우려고', '정렬하려고'], answer: 1, explanation: '나중에 바꾼 닉네임이 과거 메시지에도 반영돼야 해요. 1번째로 최종 닉네임 확정, 2번째로 메시지 생성.' },
    { id: 'al-01-09', type: 'ox', source: '[프론트] 오픈채팅방', question: 'Change 명령은 닉네임만 바꾸고 메시지는 남기지 않는다.', answer: true, explanation: '메시지는 Enter·Leave만. 그래서 msg 사전에 Change가 없어요.' },
    { id: 'al-01-10', type: 'mcq', source: '[백엔드] 신고 결과 받기', question: '신고 결과 받기에서 처리 결과 메일을 받는 사람은?', choices: ['정지된 사람', '정지된 사람을 신고한 사람들', '모든 유저', '신고를 k번 이상 한 사람'], answer: 1, explanation: '신고당한 사람의 신고자 수가 k 이상이면 그 신고자들에게 메일 +1.' },
    { id: 'al-01-11', type: 'mcq', source: '[백엔드] 신고 결과 받기', question: 'reported 값으로 set을 쓰는 이유는?', choices: ['정렬하려고', '같은 사람이 같은 대상을 여러 번 신고해도 1회로 처리하려고', '메모리를 아끼려고', '순서를 지키려고'], answer: 1, explanation: 'set은 중복을 자동 제거해요.' },
    { id: 'al-01-12', type: 'ox', source: '[백엔드] 신고 결과 받기', question: 'idx = {name: i for i, name in enumerate(id_list)}는 DB의 AUTO_INCREMENT에 가까운 개념이다.', answer: false, explanation: '"이름 → 위치"를 미리 만들어 빠르게 찾는 INDEX에 가까워요.' },
    { id: 'al-01-13', type: 'essay', source: '오픈채팅방 사고 과정', question: '오픈채팅방 문제에서 "신호 → 도구"를 두 가지 말해 보세요.', answer: '"아이디로 닉네임을 찾고 같은 아이디는 덮어쓴다" → dict(해시). "나중에 바꾼 닉네임이 예전 메시지에도 반영된다" → 끝까지 봐야 확정되므로 두 번 순회.', keywords: ['dict', '덮어쓰기', '두 번 순회'], explanation: '"마지막 상태가 과거 출력에도 반영된다" → 먼저 끝까지 훑어 상태를 확정하고 출력을 만든다.' },
    { id: 'al-01-14', type: 'mcq', source: '오픈채팅방 사고 과정', question: '최적화 버전(logs + msg 사전)이 내 논리 버전보다 나아진 점은?', choices: ['시간복잡도가 O(N²)→O(N)', 'split을 기록마다 1번만 하고 분기를 사전 조회로 바꿈', '공간이 O(1)이 됨', '순회가 한 번으로 줄어듦'], answer: 1, explanation: '복잡도는 둘 다 O(N)으로 같아요. 중복 split과 if/elif만 줄었어요.' },
    { id: 'al-01-15', type: 'mcq', source: '신고 결과 받기 사고 과정', question: '신고 결과 받기 최적화 버전에서 set(report)를 먼저 하는 이유는?', choices: ['정렬하려고', '같은 신고 문자열을 처음부터 제거해 split 횟수를 줄이려고', '결과 순서를 맞추려고', 'KeyError 방지'], answer: 1, explanation: '"muzi frodo"가 여러 번 있어도 한 번만 처리돼요.' },
    { id: 'al-01-16', type: 'ox', source: '신고 결과 받기 사고 과정', question: '결과 위치를 찾을 때 id_list.index(name)을 매번 호출하면 숨은 반복이 생긴다.', answer: true, explanation: 'index()는 리스트를 처음부터 훑어 O(N). 그래서 이름 → 위치 사전을 미리 만들어요.' },
    { id: 'al-01-17', type: 'mcq', source: '트러블슈팅', question: 'if x == "Enter" or "Change": 가 항상 참이 되는 이유는?', choices: ['or가 and로 동작해서', '(x == "Enter") or ("Change")로 해석되고 비어 있지 않은 문자열은 True라서', '문자열 비교가 안 돼서', 'x가 None이라서'], answer: 1, explanation: 'x == "Enter" or x == "Change" 또는 x in ("Enter", "Change")로 써야 해요.' },
    { id: 'al-01-18', type: 'mcq', source: '트러블슈팅', question: 'reported[b] = a로 기록했더니 신고자가 마지막 1명만 남았다. 해결은?', choices: ['reported[b] += a', '값을 set으로 두고 reported[b].add(a)', 'reported.append(a)', 'reported[a] = b'], answer: 1, explanation: '= 는 대입(덮어쓰기). 추가는 add.' },
    { id: 'al-01-19', type: 'essay', source: '면접 숙제', question: '리스트 대신 해시(dict)를 써야 하는 상황을 시간복잡도와 함께 설명해 보세요.', answer: '키로 값을 찾을 때 리스트는 처음부터 탐색해 O(N), 해시는 평균 O(1). 조회가 N번 반복되면 리스트는 O(N²), 해시는 O(N)이라 데이터가 커질수록 차이가 크다. 오픈채팅방의 아이디 → 닉네임 조회가 예.', keywords: ['O(1)', 'O(N)', '반복 조회'], explanation: '반복 조회가 핵심 신호예요.' },
    { id: 'al-01-20', type: 'mcq', source: '면접 숙제', question: '같은 유저가 같은 대상을 여러 번 신고하는 걸 DB 레벨에서 막는 가장 안전한 방법은?', choices: ['앱에서 중복 체크', '(reporter_id, target_id)에 UNIQUE 제약', 'AUTO_INCREMENT', '인덱스 삭제'], answer: 1, explanation: '앱 체크만 하면 동시 요청에서 경쟁 조건이 생길 수 있어 DB 제약이 더 안전해요.' },
  ],
}

export default topic

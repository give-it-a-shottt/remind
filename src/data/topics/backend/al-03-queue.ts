import type { Topic } from '../../types'

const topic: Topic = {
  id: 'al-03-queue',
  track: 'backend',
  group: '알고리즘',
  title: '알고리즘 3. 큐 (다리를 지나는 트럭 · 프로세스)',
  order: 303,
  notionId: '3f6df951bf80806c9e9bdf5434eec14d',
  sections: [
    {
      title: '큐 (FIFO)',
      points: [
        '먼저 넣은 걸 먼저 꺼내는 자료구조. 줄 서기처럼 뒤에 넣고 앞에서 꺼낸다',
        'collections.deque: append()로 넣고 popleft()로 꺼내고, q[0]으로 맨 앞 미리 보기',
        '"들어온 순서대로 처리"해야 하면 큐',
        '프론트: 토스트 알림·애니메이션 대기열 / 백엔드: 작업 큐 (더 급한 게 있으면 다시 뒤로)',
        '리스트 pop(0)은 O(N), deque.popleft()는 O(1)',
      ],
      code: `from collections import deque
q = deque([1, 2, 3])
q.append(4)       # [1, 2, 3, 4]
q.popleft()       # 1
q[0]              # 2 (꺼내지 않고 보기)`,
    },
    {
      title: '튜플 vs 리스트',
      points: [
        '튜플 (w, t): 수정 불가(immutable), 바뀌지 않는 값의 묶음 — (무게, 나갈 시간), (우선순위, 위치)',
        '리스트 [w, t]: 수정 가능 — 과제 진행하기의 [이름, 남은시간] (남은 시간을 줄여야 해서)',
        '코테에서 속도 차이는 체감 안 됨. 바뀌지 않는 묶음이면 튜플이 의도가 잘 드러난다',
      ],
    },
    {
      title: '언패킹 vs 인덱스',
      points: [
        'w, _ = bridge.popleft() — 묶음을 변수 여러 개로 풀기, _ = 안 쓰는 값',
        'w = bridge.popleft()[0] — 0번째만 바로. 결과는 같다',
        '언패킹은 개수가 안 맞으면 바로 에러가 나서 실수를 잡아주고, 이름으로 의도를 드러낸다',
      ],
    },
    {
      title: '튜플끼리 비교와 max',
      points: [
        '튜플은 0번째부터 비교하고, 같을 때만 다음 칸을 본다',
        '(우선순위, 위치) 순서면 max(q)[0] = 가장 큰 우선순위',
        '순서에 상관없이 안전한 건 max(q, key=lambda x: x[0])[0] 또는 max(p for p, _ in q)',
        '튜플을 숫자와 바로 비교하면 안 된다 → [0]으로 꺼내서 비교',
        'q[:][0] 같은 "모든 줄의 0번째" 문법은 없다 ([:]는 전체 복사, deque는 슬라이싱 에러)',
      ],
    },
    {
      title: '[프론트] 다리를 지나는 트럭',
      points: [
        '다리 위 트럭을 (무게, 나갈 시간)으로 큐에 저장 — 먼저 올라간 트럭이 먼저 나가니 맨 앞만 보면 된다',
        '한 초에 한 대만 올라가서 bridge_length 대수 제한은 자동으로 지켜진다',
        '매 초 순서: 시간 +1 → 내릴 트럭 먼저 내림 → 올릴 수 있으면 올림',
        '무게 합은 sum() 대신 total 변수로 관리',
        '시간 점프 최적화: 못 올리는 초에는 다음 하차 직전으로 건너뜀 (elif bridge: time = bridge[0][1] - 1) → O(N)',
        '실무: 토스트를 최대 N개·높이 합 제한 안에서 띄우고 오래된 것부터 사라지게 하는 대기열',
      ],
      code: `while wait or bridge:
    time += 1
    if bridge and bridge[0][1] == time:
        w, _ = bridge.popleft()
        total -= w
    if wait and total + wait[0] <= weight:
        w = wait.popleft()
        bridge.append((w, time + bridge_length))
        total += w`,
    },
    {
      title: '[백엔드] 프로세스',
      points: [
        '(우선순위, 원래 위치)로 묶어 큐에 넣어야 꺼내고 다시 넣어도 추적할 수 있다',
        '꺼낸 뒤 "남은 것 중 더 높은 게 있나?"로 판단 → 있으면 뒤로, 없으면 실행',
        'if q and ... — 남은 큐가 비면 max()가 에러라서 먼저 확인',
        'N ≤ 100이라 최대 약 100만 번으로 안전. 실무에선 힙(우선순위 큐)',
      ],
      code: `q = deque((p, i) for i, p in enumerate(priorities))
a = 0
while q:
    cur = q.popleft()
    if q and max(p for p, _ in q) > cur[0]:
        q.append(cur)
    else:
        a += 1
        if cur[1] == location:
            return a`,
    },
    {
      title: '다리를 지나는 트럭 사고 과정',
      points: [
        '신호: 정해진 순서로 건넘 → 대기 큐, 먼저 올라간 트럭이 먼저 내림 → 다리 큐, 1초에 1칸 + 무게 제한 → 매 초 시뮬레이션 + 무게 합 변수',
        '갈라진 지점: 내리는 조건은 나갈 시간 == 현재 (> 아님)',
        '순서는 시간 → 내리기 → 올리기 (같은 초의 빈자리를 써야 함)',
        '무게 체크는 지금 무게 + 다음 트럭 ≤ 최대 (올리기 전에 확인)',
        '시간 증가는 반복 맨 앞에서 매번 (아무 일 없는 초도 흐름)',
      ],
    },
    {
      title: '프로세스 사고 과정',
      points: [
        '신호: 앞에서 꺼내고 더 높은 게 있으면 다시 뒤로 → 큐, 원래 몇 번째인지 추적 → (우선순위, 위치)',
        '갈라진 지점: 뒤로 보내는 조건은 "다르다"가 아니라 "남은 max가 더 크다"',
        '최적화 버전: sorted(priorities, reverse=True)로 실행될 우선순위 순서를 미리 계산하고 order[a]와 비교 → max 숨은 반복 제거',
      ],
    },
    {
      title: '시간 초과 판단법',
      points: [
        '시간은 조건문 개수가 아니라 "몇 번 반복되냐"로 정해진다',
        '제한사항의 최대 N → 반복 횟수 곱하기 → 파이썬 1초에 약 1천만 번 (1억 넘으면 시간 초과)',
        '숨은 반복도 센다: max(), min(), sum(), x in 리스트, 리스트.pop(0), 리스트.index()',
        'N ~100: 3중 OK / ~1,000: 2중 OK / ~10만: 반복 1개 + 정렬 / ~100만 이상: 반복 1개, 숨은 반복 금지',
      ],
    },
    {
      title: '트러블슈팅',
      points: [
        '나갈 시간 비교 방향 반대 → [10] 한 대 예제에서 101 대신 2',
        '올리기를 내리기보다 먼저 → 3초에 7+4=11로 못 올림',
        '매 초 sum(다리) → 숨은 반복',
        '프로세스에서 "같은지" 비교 → [3, 1], location 0에서 무한루프',
        '빈 큐에서 max() → ValueError',
      ],
    },
    {
      title: '면접 숙제',
      points: [
        'deque를 쓰는 이유: 양쪽 끝 넣기·빼기 O(1)',
        '트럭: total 변수 + 시간 점프로 O(N)',
        '프로세스 실무: heapq로 가장 높은 작업을 O(log N)에',
        '튜플은 immutable이라 dict 키로도 쓸 수 있다',
      ],
    },
  ],
  questions: [
    { id: 'al-03-01', type: 'mcq', source: '큐 (FIFO)', question: 'deque에서 맨 앞 원소를 꺼내지 않고 보기만 하는 코드는?', choices: ['q.popleft()', 'q[0]', 'q[-1]', 'q.peek()'], answer: 1, explanation: 'q[0]은 맨 앞, q[-1]은 맨 뒤. deque에는 peek()가 없어요.' },
    { id: 'al-03-02', type: 'ox', source: '큐 (FIFO)', question: '토스트 알림 대기열은 큐로 구현하기 좋다.', answer: true, explanation: '먼저 들어온 알림부터 보여주니까 FIFO.' },
    { id: 'al-03-03', type: 'mcq', source: '튜플 vs 리스트', question: '과제 진행하기에서는 [이름, 남은시간] 리스트를, 트럭 문제에서는 (무게, 나갈 시간) 튜플을 쓴 이유는?', choices: ['튜플이 더 빨라서', '남은 시간은 줄여야(수정) 하고, 무게·나갈 시간은 바뀌지 않아서', '리스트는 큐에 못 넣어서', '아무 이유 없음'], answer: 1, explanation: '튜플은 수정 불가. 바뀌지 않는 묶음이면 튜플이 의도를 드러내요.' },
    { id: 'al-03-04', type: 'ox', source: '튜플 vs 리스트', question: '튜플은 dict의 키로 쓸 수 있다.', answer: true, explanation: 'immutable이라 해시할 수 있어요. 리스트는 키로 못 써요.' },
    { id: 'al-03-05', type: 'mcq', source: '언패킹 vs 인덱스', question: 'w, _ = bridge.popleft() 에서 _의 의미는?', choices: ['에러를 무시', '안 쓰는 값을 받는 자리', '마지막 값', '빈 튜플'], answer: 1, explanation: '관례적으로 "안 쓰는 값". w = bridge.popleft()[0]과 결과는 같아요.' },
    { id: 'al-03-06', type: 'mcq', source: '튜플끼리 비교와 max', question: 'q = [(2, 0), (3, 1), (3, 2)]일 때 max(q)는?', choices: ['(2, 0)', '(3, 1)', '(3, 2)', '3'], answer: 2, explanation: '0번째(3)가 같으면 1번째를 비교 → (3, 2). max(q)[0]은 3.' },
    { id: 'al-03-07', type: 'ox', source: '튜플끼리 비교와 max', question: 'q[:][0]으로 큐 안 모든 튜플의 0번째 값을 한 번에 얻을 수 있다.', answer: false, explanation: '[:]는 전체 복사라 첫 번째 튜플이 나와요. deque는 슬라이싱 자체가 에러. [p for p, _ in q]처럼 써야 해요.' },
    { id: 'al-03-08', type: 'mcq', source: '[프론트] 다리를 지나는 트럭', question: '트럭 시뮬레이션의 매 초 처리 순서로 맞는 것은?', choices: ['올리기 → 내리기 → 시간', '시간 +1 → 내리기 → 올리기', '내리기 → 시간 → 올리기', '시간 +1 → 올리기 → 내리기'], answer: 1, explanation: '같은 초에 빈자리를 써야 하니 내리기가 먼저, 시간은 맨 앞에서 매번.' },
    { id: 'al-03-09', type: 'short', source: '[프론트] 다리를 지나는 트럭', question: '트럭을 올릴 수 있는 조건을 코드로? (wait and ?)', answer: ['total + wait[0] <= weight', 'total+wait[0]<=weight'], explanation: '올린 뒤의 무게를 올리기 전에 확인. "이하"라서 <=.' },
    { id: 'al-03-10', type: 'mcq', source: '[프론트] 다리를 지나는 트럭', question: '시간 점프 최적화는 무엇을 건너뛰나?', choices: ['트럭 정렬', '트럭을 못 올리는 동안 아무 일도 없는 초들', '무게 계산', '다리 길이 확인'], answer: 1, explanation: 'elif bridge: time = bridge[0][1] - 1 → 다음 하차 직전으로. 최악 약 1억 번 → O(N).' },
    { id: 'al-03-11', type: 'mcq', source: '[백엔드] 프로세스', question: '프로세스 문제에서 (우선순위, 원래 위치)로 묶는 이유는?', choices: ['정렬하려고', '꺼내고 다시 넣으면 순서가 섞여도 내가 찾는 프로세스를 추적하려고', '메모리 절약', 'max를 쓰려고'], answer: 1, explanation: '"순서가 섞여도 누구인지 알아야 한다" → 값과 원래 위치를 튜플로.' },
    { id: 'al-03-12', type: 'ox', source: '[백엔드] 프로세스', question: 'if q and max(...) > cur[0]에서 if q를 빼면 마지막 하나가 남았을 때 에러가 날 수 있다.', answer: true, explanation: '빈 시퀀스의 max()는 ValueError.' },
    { id: 'al-03-13', type: 'essay', source: '다리를 지나는 트럭 사고 과정', question: '트럭 문제에서 내 생각과 정답 경로가 갈라진 지점(한 초 안의 순서)을 설명해 보세요.', answer: '내리는 조건을 "나갈 시간 > 현재"로 반대로 썼고(== 이어야 함), 올리기를 내리기보다 먼저 해서 같은 초의 빈자리를 못 썼다. 무게도 지금 무게만 보고 올린 뒤를 확인하지 않았고, 시간 증가를 한 분기에만 넣었다. 정답은 시간 +1 → 내리기 → (total + 다음 ≤ weight면) 올리기.', keywords: ['== 현재', '내리기 먼저', 'total + 다음', '매번 time += 1'], explanation: '자료구조는 맞게 골랐고, 한 초 안에서 일어나는 일의 순서가 핵심이었어요.' },
    { id: 'al-03-14', type: 'mcq', source: '프로세스 사고 과정', question: '[3, 1], location 0에서 "남은 max와 다르면 뒤로" 조건이 무한루프가 되는 이유는?', choices: ['큐가 비지 않아서', '3을 꺼내면 남은 max=1이라 3≠1로 계속 뒤로 보내져서', 'location이 0이라서', 'max가 에러라서'], answer: 1, explanation: '꺼낸 게 더 클 때도 "다르다"로 판정됐어요. "남은 max > 꺼낸 것"이어야 해요.' },
    { id: 'al-03-15', type: 'mcq', source: '프로세스 사고 과정', question: '최적화 버전에서 order = sorted(priorities, reverse=True)를 쓰면 좋아지는 점은?', choices: ['큐가 필요 없어짐', '매번 max로 남은 큐 전체를 훑던 숨은 반복이 O(1) 비교로 바뀜', '정렬이 필요 없어짐', '정답이 달라짐'], answer: 1, explanation: '실행된 건 항상 남은 것 중 최대라, a번째 큰 값 = 남은 것의 max.' },
    { id: 'al-03-16', type: 'mcq', source: '시간 초과 판단법', question: '파이썬에서 1초에 처리할 수 있는 반복 횟수 기준은 대략?', choices: ['약 1만 번', '약 1천만 번', '약 100억 번', '무제한'], answer: 1, explanation: '1초에 약 1천만 번. 1억을 넘으면 시간 초과를 의심.' },
    { id: 'al-03-17', type: 'mcq', source: '시간 초과 판단법', question: '다음 중 "숨은 반복"이 아닌 것은?', choices: ['x in 리스트', 'sum(리스트)', 'deque.popleft()', '리스트.index(x)'], answer: 2, explanation: 'popleft는 O(1). 나머지는 전체를 훑어 O(N).' },
    { id: 'al-03-18', type: 'mcq', source: '시간 초과 판단법', question: 'N이 최대 10만일 때 허용되는 방식은?', choices: ['3중 반복문', '2중 반복문', '반복문 1개 + 정렬 (N log N)', '모든 경우의 수'], answer: 2, explanation: '~100: 3중, ~1,000: 2중, ~10만: N log N, ~100만 이상: 반복 1개.' },
    { id: 'al-03-19', type: 'mcq', source: '트러블슈팅', question: '[10] 트럭 한 대, 다리 길이 100 예제에서 101이 아닌 2가 나왔다. 원인은?', choices: ['무게 비교 오류', '나갈 시간 > 현재일 때 내보내서 아직 건너는 트럭이 내려감', '시간 점프', 'deque 사용'], answer: 1, explanation: '나갈 시간 == 현재일 때 내보내야 해요.' },
    { id: 'al-03-20', type: 'ox', source: '트러블슈팅', question: '매 초 sum(다리)로 무게를 계산하면 반복 안의 숨은 반복이 된다.', answer: true, explanation: 'total 변수에 올릴 때 더하고 내릴 때 빼면 O(1).' },
    { id: 'al-03-21', type: 'essay', source: '면접 숙제', question: '프로세스 문제를 실무라면 어떤 자료구조로 바꾸겠어요?', answer: '매번 max로 전체를 훑으면 O(N)이라 작업이 많아지면 느려진다. 힙 기반 우선순위 큐(파이썬 heapq)로 가장 높은 작업을 O(log N)에 꺼낸다.', keywords: ['힙', 'heapq', 'O(log N)'], explanation: '실무 작업 큐의 우선순위 처리는 힙.' },
  ],
}

export default topic

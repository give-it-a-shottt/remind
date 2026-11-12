import type { Topic } from '../../types'

const topic: Topic = {
  id: 'al-04-bfs',
  track: 'backend',
  group: '알고리즘',
  title: '알고리즘 4. BFS (게임 맵 최단거리 · 네트워크)',
  order: 304,
  notionId: '3f7df951bf808096986fc7f52bbe4d05',
  sections: [
    {
      title: 'BFS (너비 우선 탐색)',
      slides: [
        {
          title: '물결처럼 한 겹씩',
          blocks: [
            { type: 'say', text: '알고리즘 마지막 수업은 **BFS**(너비 우선 탐색)예요. 지난 수업의 **큐**를 그대로 써요.\n\n시작점에서 **가까운 곳부터 한 겹씩** 넓혀 가며 탐색해요. 큐에 "다음에 볼 곳"을 넣고 `popleft()`로 꺼내요. 한 번 간 곳은 **visited**로 표시해 다시 가지 않아요.' },
            { type: 'note', tone: 'analogy', text: '연못에 돌을 던지면 **물결이 한 겹씩** 퍼지죠. 1미터 거리에 먼저 닿고, 그다음 2미터… 그래서 목적지에 물결이 **처음 닿은 순간**의 거리가 **최단거리**예요(이동 비용이 모두 같을 때).' },
            { type: 'list', items: ['**프론트**: 맵·그리드 UI의 최단 경로', '**백엔드**: 연결 관계에서 이어진 **묶음 개수**'] },
          ],
        },
      ],
    },
    {
      title: 'BFS vs DFS',
      slides: [
        {
          title: '꺼내는 위치 하나의 차이',
          blocks: [
            {
              type: 'table',
              head: ['', 'BFS', 'DFS'],
              rows: [
                ['꺼내기', '**앞에서** `popleft()` (큐)', '**뒤에서** `pop()` (스택) 또는 재귀'],
                ['모양', '물결처럼 **한 겹씩**', '**한 길로 끝까지** 갔다가 돌아옴'],
                ['잘 맞는 문제', '**최단거리**·최소 횟수 (비용이 같을 때)', '갈 수 있나, **묶음 개수**, 경우의 수'],
              ],
            },
            { type: 'say', text: 'BFS 코드에서 `popleft()`를 `pop()`으로 바꾸기만 하면 DFS가 돼요. **꺼내는 위치 하나**가 탐색 방식을 바꿔요.\n\n"연결된 묶음의 개수"는 **탐색을 새로 시작한 횟수**예요. 아직 안 간 곳에서 탐색을 시작할 때마다 묶음이 하나 늘어나요.' },
          ],
        },
      ],
    },
    {
      title: '방문 표시는 언제 찍나',
      slides: [
        {
          title: '넣는 순간 = 예약 완료',
          blocks: [
            { type: 'say', text: '방문 표시는 **큐에 넣는 순간** 찍어요. "이 칸은 내가 맡았어"라는 **예약**이에요.\n\n**꺼낼 때** 찍으면 어떻게 될까요? 아직 꺼내지 않은 칸은 표시가 없어서, 이웃 여러 개가 **같은 칸을 중복으로** 큐에 넣어요. 100×100 빈 맵이면 10,000번이면 될 삽입이 **19,801번**으로 늘어요. 답(최단거리)은 맞지만 느려지고 메모리를 더 써요.' },
          ],
        },
      ],
    },
    {
      title: '그리드 탐색 표준 패턴',
      slides: [
        {
          title: '방향 배열과 범위 체크',
          blocks: [
            { type: 'code', code: `for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):   # 하, 상, 우, 좌
    nr, nc = r + dr, c + dc
    if 0 <= nr < n and 0 <= nc < m:                  # 맵 안인지
        ...` },
            { type: 'say', text: '상하좌우 네 방향을 if문 네 개로 쓰는 대신 **방향 배열**로 for문 하나로 돌려요. 코드가 짧아지고 실수가 줄어요.\n\n`0 <= nr < n and 0 <= nc < m`으로 **맵 밖은 건너뛰어요.** 파이썬은 `-1` 인덱스가 에러 없이 **마지막 칸**을 가리켜서, 이 검사를 빼면 엉뚱한 칸으로 건너가는 버그가 조용히 생겨요.' },
          ],
        },
      ],
    },
    {
      title: '[프론트] 게임 맵 최단거리',
      slides: [
        {
          title: '손으로 풀어 보기',
          blocks: [
            { type: 'say', text: '1은 길, 0은 벽인 맵에서 (0, 0)에서 (n-1, m-1)까지 **지나가는 칸의 최솟값**을 구해요.\n\n신호: 상하좌우 한 칸씩(**비용이 같음**) + **최솟값** → BFS.\n\n손으로 풀면: 시작 칸에 **1**, 그 이웃에 **2**, 그 이웃의 빈칸에 **3**… 도착 칸에 **처음 적힌 숫자**가 답이에요. 시작 칸도 지나간 칸이라 큐의 시작값은 `(0, 0, 1)`이에요.' },
          ],
        },
        {
          title: '맵에 거리를 덮어쓰기',
          blocks: [
            { type: 'code', code: `q = deque([(0, 0)])
while q:
    r, c = q.popleft()
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < m and maps[nr][nc] == 1 and (nr, nc) != (0, 0):
            maps[nr][nc] = maps[r][c] + 1
            if (nr, nc) == (n - 1, m - 1):
                return maps[nr][nc]
            q.append((nr, nc))
return -1` },
            { type: 'say', text: '최적화 버전은 **맵 칸에 거리를 덮어써서** 방문 표시를 겸해요. 1(아직 안 간 길)인 칸만 가니까요. 그런데 시작 칸도 값이 **1**이라 "안 간 길"로 착각해 다시 들어갈 수 있어요. 그래서 `(nr, nc) != (0, 0)` 조건이 필요해요.\n\n도착하면 **즉시 반환**, 반복이 끝나도 도착 못 하면 **-1**. 시간·공간 O(n×m).' },
            { type: 'note', tone: 'tip', text: '실제 길찾기처럼 이동마다 **비용이 다르면**(고속도로 vs 골목) "먼저 닿은 게 최단"이 성립하지 않아요. 그때는 **다익스트라**(힙)를 써요.' },
          ],
        },
      ],
    },
    {
      title: '[백엔드] 네트워크',
      slides: [
        {
          title: '이어진 묶음 세기',
          blocks: [
            { type: 'code', code: `def solution(n, computers):
    visited = [False] * n
    def dfs(cur):
        visited[cur] = True
        for nxt, linked in enumerate(computers[cur]):   # 1인 칸 = 직접 연결
            if linked and not visited[nxt]:
                dfs(nxt)
    count = 0
    for i in range(n):
        if not visited[i]:      # 아직 안 간 컴퓨터에서
            dfs(i)              # 탐색을 새로 시작할 때
            count += 1          # 묶음 +1
    return count` },
            { type: 'say', text: '서로 닿을 수 있는 컴퓨터 **묶음의 개수**예요(혼자 떨어진 컴퓨터도 1개). 거리를 묻지 않으니 **BFS든 DFS든** 정답이에요.\n\n`computers`는 n×n **인접 행렬**이라 행을 한 번씩 다 보면 **O(n²)**.' },
          ],
        },
        {
          title: '재귀 한도와 실무',
          blocks: [
            { type: 'note', tone: 'warn', text: '재귀 DFS는 파이썬 **재귀 한도**(기본 1000)에 걸릴 수 있어요. 컴퓨터가 일렬로 수천 대 이어져 있으면 RecursionError가 나요. 그럴 땐 큐/스택을 쓰는 **반복문 버전**으로 바꿔요.' },
            { type: 'say', text: '실무 예: **친구 그룹** 판별, 마이크로서비스 **의존성 묶음**. 연결이 계속 추가되고 "같은 그룹인가?"를 자주 묻는다면 **Union-Find**가 더 잘 맞아요(다음 면접 숙제).' },
          ],
        },
      ],
    },
    {
      title: '트러블슈팅',
      slides: [
        {
          title: '자주 한 실수들',
          blocks: [
            {
              type: 'table',
              head: ['실수', '결과'],
              rows: [
                ['최단거리를 **DFS + 방문 표시**로', '돌아가는 길이 먼저 도장을 찍어서 **더 짧은 길이 막힘** (9 대신 11)'],
                ['방문 표시 없이 탐색', '**무한 반복**'],
                ['방문 표시를 지우는 백트래킹', '경로 수 **폭발** (시간 초과)'],
                ['좌표를 숫자로 고정 `maps[1+1][1]` + 범위 체크 없음', '맵 밖 접근'],
                ['네트워크에서 **cur+1부터만** 보기', '0–2, 1–2 연결에서 1 대신 **2**'],
              ],
            },
            { type: 'ask', q: '네트워크 행렬은 대칭이니까 "cur+1부터만 보면 된다"가 왜 틀릴까요?', a: '탐색은 0부터 순서대로 가지 않아요. 2번에서 1번으로 **거꾸로** 건너가야 하는 경우가 있는데, cur+1부터만 보면 2번에서 1번(더 작은 번호)을 못 봐요. 그래서 1번이 따로 떨어진 묶음으로 세어져요.' },
          ],
        },
      ],
    },
    {
      title: '면접 숙제',
      slides: [
        {
          title: '면접에서 이렇게 답해요',
          blocks: [
            { type: 'list', items: ['**최단거리에 BFS**: 거리 순서대로 방문하니 **첫 도착이 최단**. DFS는 모든 경로를 다 봐야 확신할 수 있어요', '**연결 요소 개수**: 인접 행렬 O(N²), 인접 리스트 **O(V + E)**', '**이동 비용이 다르면** BFS 불가 → **다익스트라**(힙)', '**같은 그룹 확인이 잦으면** Union-Find로 대표끼리 비교, 거의 O(1)'] },
            { type: 'say', text: '알고리즘 네 수업(해시, 스택, 큐, BFS)이 끝났어요. 공통점이 보이죠? 문제에서 **신호**를 찾고 → **도구**를 고르고 → **실무**에서 같은 구조를 떠올리기. 이 흐름이 면접에서도 그대로 통해요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'al-04-01', type: 'ox', source: 'BFS (너비 우선 탐색)', question: 'BFS에서 목적지에 처음 도착한 순간의 거리가 최단거리다 (이동 비용이 모두 같을 때).', answer: true, explanation: '가까운 순서로 한 겹씩 퍼지니까, 더 짧은 길이 있었다면 더 일찍 도착했을 거예요.' },
    { id: 'al-04-02', type: 'mcq', source: 'BFS (너비 우선 탐색)', question: 'BFS 구현에 쓰는 자료구조와 꺼내는 메서드는?', choices: ['리스트 / pop()', 'deque / popleft()', 'set / pop()', 'dict / popitem()'], answer: 1, explanation: '큐(deque)에서 앞에서 꺼내기.' },
    { id: 'al-04-03', type: 'mcq', source: 'BFS vs DFS', question: 'BFS 코드에서 popleft()를 pop()으로 바꾸면?', choices: ['그대로 BFS', 'DFS가 된다', '에러', '더 빠른 BFS'], answer: 1, explanation: '꺼내는 위치 하나가 탐색 방식을 바꿔요. 뒤에서 꺼내면 스택 → DFS.' },
    { id: 'al-04-04', type: 'mcq', source: 'BFS vs DFS', question: '"연결된 묶음의 개수"를 구하는 방법은?', choices: ['최단거리 합', '탐색을 새로 시작한 횟수', '간선 수', '방문 표시 수'], answer: 1, explanation: '미방문 노드에서 탐색을 시작할 때마다 +1.' },
    { id: 'al-04-05', type: 'mcq', source: '방문 표시는 언제 찍나', question: 'BFS에서 방문 표시를 찍는 시점으로 권장되는 것은?', choices: ['꺼낼 때', '큐에 넣는 순간', '도착했을 때', '반복이 끝난 뒤'], answer: 1, explanation: '넣을 때 찍으면 칸마다 한 번만 들어가요. 꺼낼 때 찍으면 중복 삽입(빈 맵에서 약 2배).' },
    { id: 'al-04-06', type: 'ox', source: '방문 표시는 언제 찍나', question: '방문 표시를 꺼낼 때 찍으면 최단거리 답이 틀린다.', answer: false, explanation: '답은 같지만 같은 칸이 여러 번 큐에 들어가 일이 거의 2배가 돼요.' },
    { id: 'al-04-07', type: 'short', source: '그리드 탐색 표준 패턴', question: 'n행 m열 맵에서 다음 칸 (nr, nc)가 맵 안인지 확인하는 조건은?', answer: ['0 <= nr < n and 0 <= nc < m', '0<=nr<n and 0<=nc<m'], explanation: '파이썬은 연쇄 비교가 돼요. 맵 밖이면 건너뜀.' },
    { id: 'al-04-08', type: 'mcq', source: '그리드 탐색 표준 패턴', question: '방향 배열 ((1,0), (-1,0), (0,1), (0,-1))을 쓰는 이유는?', choices: ['속도 향상', 'if문 4개 대신 for문 하나로 범위 체크를 한 곳에서', '대각선 이동', '정렬'], answer: 1, explanation: '상하좌우를 반복문 하나로 처리해요.' },
    { id: 'al-04-09', type: 'mcq', source: '[프론트] 게임 맵 최단거리', question: '게임 맵 BFS에서 큐의 시작값이 (0, 0, 1)인 이유는?', choices: ['0부터 세면 안 돼서', '시작 칸도 지나간 칸이라 거리 1부터', '에러 방지', '방향 표시'], answer: 1, explanation: '"지나가는 칸의 개수"라 시작 칸 포함.' },
    { id: 'al-04-10', type: 'mcq', source: '[프론트] 게임 맵 최단거리', question: '맵 덮어쓰기 최적화 버전에 (nr, nc) != (0, 0) 조건이 필요한 이유는?', choices: ['시작 칸이 벽이라서', '시작 칸 값이 원래 1이라 미방문처럼 보여서', '도착 칸이라서', '범위 밖이라서'], answer: 1, explanation: '맵에 거리를 덮어써 방문 표시를 겸하는데, 시작 칸은 1 그대로라 다시 들어갈 수 있어요. 헷갈리면 visited를 따로 두는 게 안전.' },
    { id: 'al-04-11', type: 'ox', source: '[프론트] 게임 맵 최단거리', question: '실제 길찾기처럼 이동마다 비용이 다르면 BFS 대신 다익스트라를 쓴다.', answer: true, explanation: 'BFS는 이동 횟수가 적은 순서만 보장해요.' },
    { id: 'al-04-12', type: 'mcq', source: '[백엔드] 네트워크', question: '네트워크 문제에서 count를 +1 하는 위치는?', choices: ['연결된 컴퓨터를 찾을 때마다', '미방문 컴퓨터에서 탐색을 새로 시작할 때', '탐색이 끝난 뒤 매번', 'computers[i][j] == 1일 때'], answer: 1, explanation: '미방문에서 출발 = 새 묶음 발견.' },
    { id: 'al-04-13', type: 'ox', source: '[백엔드] 네트워크', question: '네트워크 문제는 거리를 묻지 않아서 BFS와 DFS 모두 정답이다.', answer: true, explanation: '묶음 개수만 세면 되니까요. 재귀 DFS가 코드가 짧아요.' },
    { id: 'al-04-14', type: 'mcq', source: '[백엔드] 네트워크', question: '인접 행렬로 주어진 네트워크 문제의 시간복잡도는?', choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2, explanation: 'n×n 행렬을 전부 한 번은 봐야 해요.' },
    { id: 'al-04-15', type: 'mcq', source: '[백엔드] 네트워크', question: '재귀 DFS를 쓸 때 n이 아주 크면 생길 수 있는 문제는?', choices: ['정답이 달라짐', '파이썬 재귀 한도(기본 1000)에 걸림', '메모리 0', '무한루프'], answer: 1, explanation: '이 문제는 n ≤ 200이라 괜찮아요.' },
    { id: 'al-04-16', type: 'mcq', source: '트러블슈팅', question: '최단거리를 DFS + 방문 표시로 구했더니 9 대신 11이 나왔다. 이유는?', choices: ['범위 체크 누락', 'DFS가 돌아가는 길에 먼저 도장을 찍어 나중에 짧은 길로 와도 못 들어가서', 'deque를 안 써서', '시작 거리를 0으로 해서'], answer: 1, explanation: 'BFS(popleft)로 바꾸면 첫 도착이 곧 최단.' },
    { id: 'al-04-17', type: 'mcq', source: '트러블슈팅', question: '네트워크에서 "대칭이니까 cur+1부터만 보면 된다"가 틀린 이유는?', choices: ['행렬이 대칭이 아니라서', 'BFS는 번호 순이 아니라 도착 순으로 꺼내서 작은 번호로 가는 길이 잘림', '속도가 느려서', 'visited가 없어서'], answer: 1, explanation: '0–2, 1–2 연결에서 2번에서 1번으로 가는 길이 잘려 1 대신 2가 나와요. 이웃은 항상 0~n-1 전체.' },
    { id: 'al-04-18', type: 'essay', source: '면접 숙제', question: 'BFS와 DFS의 차이를 설명하고, 최단거리 문제에서 BFS를 쓰는 이유를 말해 보세요.', answer: 'BFS는 큐로 가까운 곳부터 한 겹씩, DFS는 스택이나 재귀로 한 경로를 끝까지 탐색한다. 이동 비용이 모두 같을 때 BFS는 거리 순서대로 방문하므로 처음 도착한 거리가 최단이다. DFS는 먼 길로 먼저 도착할 수 있어 최단을 보장하려면 모든 경로를 봐야 한다.', keywords: ['큐', '한 겹씩', '첫 도착 = 최단'], explanation: '"비용 같은 이동 + 최단거리 → BFS".' },
    { id: 'al-04-19', type: 'mcq', source: '면접 숙제', question: '친구 관계에서 "같은 그룹인지"를 자주 확인해야 할 때 적합한 방법은?', choices: ['매번 BFS', 'Union-Find로 그룹 대표 관리', '정렬', '해시 하나'], answer: 1, explanation: '관계가 추가될 때 두 그룹을 합치고, 대표가 같은지로 거의 O(1)에 확인.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'al-02-stack',
  track: 'backend',
  group: '알고리즘',
  title: '알고리즘 2. 스택 (올바른 괄호 · 과제 진행하기)',
  order: 302,
  notionId: '3f5df951bf8080d0943bf46bf8e85ebf',
  sections: [
    {
      title: '스택 (LIFO)',
      slides: [
        {
          title: '나중에 넣은 걸 먼저',
          blocks: [
            { type: 'say', text: '두 번째 자료구조는 **스택**이에요. **나중에 넣은 걸 먼저 꺼내요**(LIFO, Last In First Out). 파이썬은 리스트의 `append()`로 넣고 `pop()`으로 꺼내요.\n\n"**가장 최근 것부터** 처리해야 한다"는 신호가 보이면 스택이에요.' },
            { type: 'note', tone: 'analogy', text: '**접시 쌓기**예요. 씻은 접시를 위에 쌓고, 꺼낼 때도 맨 위부터 꺼내죠. 맨 아래 접시를 먼저 꺼내려면 위를 다 들어내야 해요.' },
            { type: 'list', items: ['**프론트**: JSX·HTML 태그 짝 검증, **Undo 히스토리** (Ctrl+Z는 가장 최근 동작부터 되돌림)', '**백엔드**: 작업을 멈춰 두고 급한 일 먼저, **가장 최근에 멈춘 것부터** 재개 (선점형 스케줄러)'] },
          ],
        },
      ],
    },
    {
      title: '스택 vs 큐',
      slides: [
        {
          title: '꺼내는 쪽이 달라요',
          blocks: [
            {
              type: 'table',
              head: ['', '스택', '큐'],
              rows: [
                ['순서', '**LIFO** (나중에 넣은 것 먼저)', '**FIFO** (먼저 넣은 것 먼저)'],
                ['파이썬', '`list`의 `append()` / `pop()`', '`collections.deque`의 `append()` / `popleft()`'],
                ['예', '괄호 짝, 멈춘 과제 재개', '시작 시각 순으로 들어오는 과제'],
              ],
            },
            { type: 'list', items: ['맨 위 원소는 **`stack[-1]`** (`stack[len(stack) - 1]`보다 짧고 안전)', 'pop은 **괄호까지** 써야 실행돼요: `stack.pop()`'] },
          ],
        },
      ],
    },
    {
      title: '문법 정리',
      slides: [
        {
          title: '이번 문제에 쓰는 문법',
          blocks: [
            { type: 'code', code: `h, m = map(int, "12:40".split(":"))         # 12, 40
tasks = sorted(tasks, key=lambda x: x[1])   # 1번 칸 기준 정렬
name = stack.pop()[0]                       # 꺼내면서 이름만
len(stack)                                  # stack.len() 아님!` },
            { type: 'say', text: '`False`, `True`는 **대문자**, 비교는 `==`, 줄 끝에 `:`. 다른 언어에서 넘어오면 자주 틀리는 부분이에요.' },
          ],
        },
      ],
    },
    {
      title: '[프론트] 올바른 괄호',
      slides: [
        {
          title: '스택 풀이와 카운터 풀이',
          blocks: [
            { type: 'say', text: '`"(())()"`처럼 괄호 짝이 맞는지 판별해요.\n\n**스택 풀이**: 맨 위가 `(`이고 지금 글자가 `)`일 **때만** pop, 나머지는 push. 끝나고 스택이 비어 있으면 True.\n\n그런데 괄호가 **한 종류**면 카운터 하나로 충분해요.' },
            { type: 'code', code: `def solution(s):
    count = 0
    for char in s:
        count += 1 if char == '(' else -1
        if count < 0:          # 닫는 게 더 많아지는 순간 실패
            return False
    return count == 0` },
            { type: 'say', text: '`count < 0` 검사가 없으면 `")("`도 마지막엔 0이라 True가 돼요. **닫는 괄호가 여는 괄호보다 먼저** 나오는 순간 바로 실패시켜요. 시간 O(N), 공간 O(1).' },
            { type: 'note', tone: 'warn', text: '괄호가 `()`, `{}`, `[]` **여러 종류**면 카운터로는 `"([)]"`를 못 잡아요. **스택 + 짝 dict**가 필요해요. 코드 에디터의 태그 짝 검사가 이 원리예요.' },
          ],
        },
      ],
    },
    {
      title: '[백엔드] 과제 진행하기',
      slides: [
        {
          title: '새 과제는 큐, 멈춘 과제는 스택',
          blocks: [
            { type: 'say', text: '과제마다 시작 시각과 걸리는 시간이 있어요. 새 과제 시작 시각이 되면 하던 걸 **멈추고** 새 걸 해요. 과제를 끝내고 시간이 남으면 **가장 최근에 멈춘** 과제부터 이어서 해요.\n• 새로 시작할 과제 = **시작 시각 순 정렬**(큐처럼)\n• 멈춘 과제 = **`[이름, 남은 시간]` 스택**' },
            { type: 'code', code: `for i in range(len(tasks) - 1):
    name, start, play = tasks[i]
    next_start = tasks[i + 1][1]
    end = start + play
    if end <= next_start:                    # 다음 과제 전에 끝남
        result.append(name)
        gap = next_start - end
        while gap > 0 and stack:             # 빈 시간에 멈춘 과제 이어 하기
            if stack[-1][1] <= gap:
                gap -= stack[-1][1]
                result.append(stack.pop()[0])
            else:
                stack[-1][1] -= gap          # 남은 시간만 줄이고 다시 멈춤
                gap = 0
    else:
        stack.append([name, end - next_start])` },
            { type: 'say', text: '마지막 과제는 끝까지 하고, 스택에 남은 걸 **위에서부터** 전부 꺼내요. 시간 O(N log N)(정렬). 각 과제는 스택에 **최대 한 번** 들어가고 나와서 while은 전체 합쳐 O(N)이에요.' },
          ],
        },
      ],
    },
    {
      title: '과제 진행하기 코드 Q&A (sorted/key/lambda/[-1])',
      slides: [
        {
          title: 'sorted와 key',
          blocks: [
            { type: 'list', items: ['`sorted(tasks)`만 하면 **0번 칸(이름) 알파벳순** → 틀림', '`key`에는 값이 아니라 **함수**를 넘겨요. `key=x[1]`은 x가 없어서 **NameError**, `key=get_start()`는 실행 **결과**를 넘겨서 에러', '`sorted()`는 **새 리스트** 반환·원본 유지. `.sort()`는 **원본 변경**·**None** 반환·리스트만'] },
            { type: 'note', tone: 'warn', text: '`tasks = tasks.sort(key=...)`라고 쓰면 `.sort()`의 반환값 **None**이 tasks에 들어가요. 정렬된 리스트가 사라져요.' },
          ],
        },
        {
          title: '[-1]과 range(len - 1)',
          blocks: [
            { type: 'say', text: '`[-1]`은 리스트의 **마지막 원소**, 즉 append로 쌓은 스택의 **최상단**이에요. 파이썬 리스트는 C의 포인터 스택이 아니라 **크기가 늘어나는 배열**이고, `-1`은 "뒤에서 첫 번째"라는 인덱스일 뿐이에요.\n\n`range(len(tasks) - 1)`인 이유: 반복문 안에서 **`tasks[i + 1]`** 을 보기 때문이에요. 마지막까지 돌면 다음 과제가 없어서 IndexError가 나요.' },
          ],
        },
      ],
    },
    {
      title: '올바른 괄호 사고 과정',
      slides: [
        {
          title: '갈라진 지점',
          blocks: [
            {
              type: 'table',
              head: ['문제의 신호', '도구'],
              rows: [
                ['"닫는 괄호는 **가장 최근에 열린 것**과 짝"', '**스택**'],
                ['"괄호가 **한 종류**"', '**카운터**로 충분'],
              ],
            },
            { type: 'say', text: '처음에 "**다르면 pop**"으로 짰더니 `")("`가 True가 나왔어요. 스택이 비었을 때 `)`는 push, 다음 `(`는 맨 위 `)`와 **다르니까** pop해서 비어 버렸거든요.\n\n올바른 조건은 "맨 위가 `(` **그리고** 지금이 `)`일 때만 pop"이에요. 같은 글자일 때도, 순서가 거꾸로일 때도 **push** 해야 해요.' },
          ],
        },
      ],
    },
    {
      title: '과제 진행하기 사고 과정',
      slides: [
        {
          title: '정렬 기준과 보초값',
          blocks: [
            {
              type: 'table',
              head: ['문제의 신호', '도구'],
              rows: [
                ['"정해진 시각에 새 과제 시작"', '**시작 시각** 순 정렬 (작업 시간 아님!)'],
                ['"멈춘 건 **최근 것부터**"', '**스택**, 이름까지 `[이름, 남은 시간]`'],
              ],
            },
            { type: 'say', text: '최적화 버전의 아이디어 세 가지\n• 시작 시각을 **0번 칸**에 두면 key 없이 `sorted()`만으로 정렬\n• 끝이 **무한대**인 가짜 과제(**보초값**)를 맨 뒤에 넣으면, "마지막 과제" 특별 처리가 필요 없어요\n• `zip(tasks, tasks[1:])`로 **(지금, 다음)** 쌍을 바로 순회' },
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
              head: ['실수', '해결'],
              rows: [
                ['`if` 두 개 연달아 → 둘 다 실행됨', '두 번째는 **`elif`**'],
                ['빈 시간에 멈춘 과제를 **한 번만** 꺼냄 → 결과 순서가 틀림', '**`while gap > 0 and stack`**'],
                ['`tasks = tasks.sort(...)`', 'tasks가 **None**'],
                ['빈 리스트에서 `stack[-1]` → IndexError', '비어 있는지 **먼저** 확인'],
              ],
            },
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
            { type: 'list', items: ['괄호 세 종류면 카운터는 `"([)]"`를 못 잡아요 → **스택 + 짝 dict** (`{")": "(", "]": "[", "}": "{"}`)', '리스트 **`pop(0)`은 O(N)** — 앞을 지우면 뒤 원소가 전부 한 칸씩 당겨져요. N번이면 O(N²). 큐는 **`deque.popleft()` O(1)**', '스케줄러가 중단된 작업을 재시작 후 이어가려면, 작업 ID와 진행 상태를 메모리가 아니라 **DB/Redis** 같은 외부 저장소에 기록해야 해요'] },
          ],
        },
      ],
    },
  ],
  questions: [
    { id: 'al-02-01', type: 'mcq', source: '스택 (LIFO)', question: '파이썬 리스트를 스택으로 쓸 때 넣기/꺼내기 메서드는?', choices: ['add / remove', 'append / pop', 'push / pop', 'insert / popleft'], answer: 1, explanation: 'append()로 끝에 넣고 pop()으로 끝에서 꺼내요. 둘 다 O(1).' },
    { id: 'al-02-02', type: 'ox', source: '스택 (LIFO)', question: 'Undo 히스토리는 스택으로 구현하기 좋다.', answer: true, explanation: '가장 최근 작업부터 되돌리니까 LIFO.' },
    { id: 'al-02-03', type: 'mcq', source: '스택 vs 큐', question: '파이썬에서 큐를 구현할 때 권장하는 것은?', choices: ['list.pop(0)', 'collections.deque의 popleft()', 'set.pop()', 'dict.popitem()'], answer: 1, explanation: 'deque.popleft()는 O(1). list.pop(0)은 O(N).' },
    { id: 'al-02-04', type: 'short', source: '스택 vs 큐', question: '스택의 맨 위(마지막에 넣은) 원소를 꺼내지 않고 보는 인덱스 표현은?', answer: ['stack[-1]', '[-1]', '-1'], explanation: 'stack[-1]. 빈 리스트면 IndexError라 먼저 비어 있는지 확인.' },
    { id: 'al-02-05', type: 'mcq', source: '문법 정리', question: '"12:40"을 시와 분 정수로 나누는 코드는?', choices: ['h, m = "12:40".split(":")', 'h, m = map(int, "12:40".split(":"))', 'h, m = int("12:40")', 'h, m = "12:40".split()'], answer: 1, explanation: 'split만 하면 문자열. map(int, ...)로 정수로 바꿔요.' },
    { id: 'al-02-06', type: 'ox', source: '문법 정리', question: '스택 길이는 stack.len()으로 구한다.', answer: false, explanation: 'len(stack). 파이썬은 내장 함수 len().' },
    { id: 'al-02-07', type: 'mcq', source: '[프론트] 올바른 괄호', question: '스택 풀이에서 pop하는 조건은?', choices: ['맨 위와 지금 글자가 다를 때', '맨 위가 "("이고 지금 글자가 ")"일 때만', '지금 글자가 "("일 때', '스택이 비었을 때'], answer: 1, explanation: '")" 위에 "("가 오는 건 짝이 아니에요. 나머지는 전부 push.' },
    { id: 'al-02-08', type: 'mcq', source: '[프론트] 올바른 괄호', question: '카운터 방식에서 if count < 0: return False가 필요한 이유는?', choices: ['속도', '")("처럼 닫는 게 먼저 많아지는 경우를 잡으려고', '"(("를 잡으려고', '빈 문자열 처리'], answer: 1, explanation: '")("는 최종 count가 0이지만 올바르지 않아요. 중간에 음수가 되면 바로 실패.' },
    { id: 'al-02-09', type: 'ox', source: '[프론트] 올바른 괄호', question: '괄호가 (), {}, [] 세 종류여도 카운터 하나로 판별할 수 있다.', answer: false, explanation: '종류가 여러 개면 순서를 봐야 해서 스택이 필요해요.' },
    { id: 'al-02-10', type: 'mcq', source: '[백엔드] 과제 진행하기', question: '과제 진행하기에서 스택에 들어가는 값은?', choices: ['과제 이름만', '[이름, 남은 시간]', '시작 시각', '[이름, 시작 시각]'], answer: 1, explanation: '나중에 이어서 할 남은 시간과, 끝냈을 때 결과에 넣을 이름이 둘 다 필요해요.' },
    { id: 'al-02-11', type: 'mcq', source: '[백엔드] 과제 진행하기', question: '빈 시간이 멈춘 과제의 남은 시간보다 작을 때 처리는?', choices: ['pop하고 버린다', 'pop하지 않고 남은 시간에서 빈 시간만 빼고 gap = 0', '다음 과제로 넘긴다', '결과에 넣는다'], answer: 1, explanation: '일부만 했으니 스택에 그대로 두고 남은 시간만 줄여요.' },
    { id: 'al-02-12', type: 'ox', source: '[백엔드] 과제 진행하기', question: '과제 진행하기 전체 시간복잡도는 정렬 때문에 O(N log N)이다.', answer: true, explanation: '스택 while은 과제마다 최대 한 번 들어가고 나와서 전체 합쳐 O(N).' },
    { id: 'al-02-13', type: 'mcq', source: '과제 진행하기 코드 Q&A (sorted/key/lambda/[-1])', question: 'sorted(tasks, key=x[1])이 NameError가 나는 이유는?', choices: ['x가 예약어라서', 'key에는 함수를 넘겨야 하는데 x[1]을 지금 계산하려 해서', '리스트는 정렬이 안 돼서', '1이 범위를 벗어나서'], answer: 1, explanation: 'key=lambda x: x[1]처럼 함수를 넘겨야 sorted가 원소마다 호출해요.' },
    { id: 'al-02-14', type: 'mcq', source: '과제 진행하기 코드 Q&A (sorted/key/lambda/[-1])', question: 'tasks = tasks.sort(key=...) 실행 후 tasks는?', choices: ['정렬된 리스트', 'None', '원래 리스트', '에러'], answer: 1, explanation: '.sort()는 원본을 바꾸고 None을 반환해요. 새 리스트가 필요하면 sorted().' },
    { id: 'al-02-15', type: 'mcq', source: '과제 진행하기 코드 Q&A (sorted/key/lambda/[-1])', question: 'for i in range(len(tasks) - 1)에서 -1을 하는 진짜 이유는?', choices: ['0번부터 시작하니까', '반복문 안에서 다음 과제 tasks[i + 1]을 보기 때문', '마지막 과제는 필요 없어서', '속도'], answer: 1, explanation: '마지막까지 돌면 tasks[i + 1]에서 IndexError. 마지막 과제는 반복 후 따로 처리.' },
    { id: 'al-02-16', type: 'ox', source: '과제 진행하기 코드 Q&A (sorted/key/lambda/[-1])', question: '파이썬 리스트의 [-1]은 C 스택의 top 포인터처럼 노드를 가리키는 포인터다.', answer: false, explanation: '파이썬 리스트는 크기가 늘어나는 배열이고 [-1]은 "길이 - 1번 칸" 계산이에요.' },
    { id: 'al-02-17', type: 'essay', source: '올바른 괄호 사고 과정', question: '"다르면 pop"으로 짠 괄호 코드가 ")("를 True로 판정한 이유와 고친 조건을 설명해 보세요.', answer: '")" 위에 "("가 와도 서로 다르니 pop되어 짝으로 처리됐다. 맨 위가 "(" 그리고 지금이 ")"일 때만 pop하고 나머지는 모두 push해야 한다.', keywords: ['방향', '"(" 그리고 ")"', 'push'], explanation: '짝 조건의 방향(여는 게 아래, 닫는 게 위)이 핵심.' },
    { id: 'al-02-18', type: 'mcq', source: '과제 진행하기 사고 과정', question: '과제 진행하기의 정렬 기준은?', choices: ['작업시간', '시작 시각', '이름', '남은 시간'], answer: 1, explanation: '과제는 시작 시각에 시작돼요. 작업시간 기준으로 정렬한 게 갈라진 지점이었어요.' },
    { id: 'al-02-19', type: 'mcq', source: '과제 진행하기 사고 과정', question: '최적화 버전에서 끝이 무한대인 가짜 과제를 넣는 이유는?', choices: ['정렬을 위해', '마지막 과제와 남은 스택을 같은 분기에서 처리하려고', '메모리 절약', '에러 방지'], answer: 1, explanation: 'gap이 무한대가 되어 스택이 전부 비워져요. 단, 이해하고 써야 해서 시험에선 내 논리 버전이 더 안전.' },
    { id: 'al-02-20', type: 'mcq', source: '트러블슈팅', question: '반례에서 [c, b, a, d]가 아니라 [c, b, d, a]가 나왔다. 원인은?', choices: ['정렬 기준 오류', '빈 시간에 멈춘 과제를 한 번만 꺼냄 (while 대신 if)', '스택에 이름 미저장', 'range 오류'], answer: 1, explanation: '90분 빈 시간 동안 b를 끝내고 70분이 남는데 a를 이어서 안 했어요. while gap > 0 and stack.' },
    { id: 'al-02-21', type: 'mcq', source: '면접 숙제', question: '리스트의 pop(0)으로 큐를 구현하면 생기는 문제는?', choices: ['순서가 뒤집힌다', '앞 원소를 빼고 나머지를 당겨 O(N), N번이면 O(N²)', '메모리 누수', '중복 제거'], answer: 1, explanation: 'deque.popleft()는 O(1).' },
    { id: 'al-02-22', type: 'essay', source: '면접 숙제', question: '괄호가 (), {}, [] 세 종류라면 어떻게 풀겠어요?', answer: '카운터는 개수만 세서 "([)]"를 못 잡는다. 여는 괄호는 스택에 넣고, 닫는 괄호가 오면 맨 위가 같은 종류의 여는 괄호인지 {")": "(", "}": "{", "]": "["} 같은 dict로 확인해 pop한다. 끝나고 비어 있으면 True.', keywords: ['스택', '짝 dict', '([)]'], explanation: '짝 정보를 dict로 두는 게 포인트.' },
  ],
}

export default topic

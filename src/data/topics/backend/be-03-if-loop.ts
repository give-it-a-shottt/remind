import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-03-if-loop',
  track: 'backend',
  group: 'Python 기초',
  title: '3강 - 조건문 & 반복문',
  order: 3,
  notionId: '3efdf951bf80819e9e47c640c3a3095f',
  sections: [
    { title: '조건문 기본 구조', points: ['if / elif / else, 들여쓰기로 블록 구분', 'and(둘 다), or(하나라도), not(반대)'] },
    { title: '예제: 나이로 구분하기', points: ['위에서부터 조건을 검사해서 처음 참인 블록만 실행', 'input()은 문자열이라 int()로 바꿔야 비교 가능'], code: `age = int(input("나이는?"))
if age >= 19:
    print("성인")
elif age >= 13:
    print("청소년")
else:
    print("어린이")` },
    { title: '조건문 안에 조건문', points: ['else 안에 다시 if를 넣어 중첩 가능'] },
    { title: 'for 반복문', points: ['리스트나 문자열을 하나씩 꺼내며 반복', 'range(시작, 끝): 끝 바로 앞까지'], code: `total = 0
for i in range(1, 11):
    total += i
print(total)  # 55` },
    { title: 'while 반복문', points: ['조건이 True인 동안 계속 반복', 'while 1: 은 무한 반복 → 주피터에서 셀이 안 끝나니 주의'] },
  ],
  questions: [
    { id: 'be-03-01', type: 'mcq', source: '조건문 기본 구조', question: '파이썬에서 "둘 다 참"을 뜻하는 논리 연산자는?', choices: ['&&', 'and', '&', 'both'], answer: 1, explanation: '파이썬은 and / or / not 단어를 써요.' },
    { id: 'be-03-02', type: 'ox', source: '조건문 기본 구조', question: '파이썬은 중괄호 대신 들여쓰기로 코드 블록을 구분한다.', answer: true, explanation: '그래서 들여쓰기가 틀리면 IndentationError.' },
    { id: 'be-03-03', type: 'short', source: '예제: 나이로 구분하기', question: '위 예제에서 age = 15 이면 출력은?', code: `if age >= 19:
    print("성인")
elif age >= 13:
    print("청소년")
else:
    print("어린이")`, answer: ['청소년'], explanation: '19 이상이 아니고 13 이상이므로 elif 블록만 실행돼요.' },
    { id: 'be-03-04', type: 'ox', source: '조건문 안에 조건문', question: 'else 블록 안에 다시 if문을 넣을 수 있다.', answer: true, explanation: '조건문은 중첩할 수 있어요 (단, 깊어지면 elif로 펴는 게 읽기 좋아요).' },
    { id: 'be-03-05', type: 'short', source: 'for 반복문', question: 'for i in range(1, 11): total += i 후 total은? (total=0 시작)', answer: ['55'], explanation: 'range(1, 11)은 1~10 → 합 55.' },
    { id: 'be-03-06', type: 'mcq', source: 'for 반복문', question: 'range(2, 5) 가 만드는 숫자는?', choices: ['2, 3, 4, 5', '2, 3, 4', '3, 4, 5', '2, 5'], answer: 1, explanation: '끝 숫자 바로 앞까지 → 2, 3, 4.' },
    { id: 'be-03-07', type: 'mcq', source: 'while 반복문', question: '주피터에서 while 1: 블록을 탈출 조건 없이 실행하면?', choices: ['한 번만 실행된다', '셀이 끝나지 않는다(무한 반복)', '문법 에러', '자동으로 10번 후 멈춘다'], answer: 1, explanation: '1은 참이라 무한 반복. Stop/Restart로 멈춰야 해요.' },
  ],
}

export default topic

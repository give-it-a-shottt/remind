import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-01-python-start',
  track: 'backend',
  group: 'Python 기초',
  title: '1강 - 주피터 노트북 & 파이썬 시작',
  order: 1,
  notionId: '3efdf951bf8081829f51f5c34e0bf50e',
  sections: [
    { title: '주피터 노트북 사용법', points: ['셀 종류: Code(코드), Markdown(글)', '단축키: a 위에 셀 추가, b 아래에 셀 추가, Shift + Enter 셀 실행', '실행 중이면 [*], 끝나면 [숫자]', '무한 반복이나 input() 대기 중엔 다른 셀이 실행 안 됨 → Stop 또는 Restart'] },
    { title: '마크다운 문법', points: ['# ~ ####: 제목 크기', '* 또는 -: 목록 / >: 인용문', '*기울임*, **굵게**', '[텍스트](주소) 링크, ![설명](이미지주소) 이미지, --- 구분선'] },
    { title: '출력과 계산', points: ['print()로 출력', '// 몫, % 나머지, ** 거듭제곱'] },
    { title: '변수와 데이터 타입', points: ['int(정수), float(실수), str(문자열), bool(True/False)', '변수 이름은 영어로 시작, snake_case 권장'] },
    { title: '비교 연산자', points: ['< > <= >= == !=, 결과는 True/False'] },
    { title: '입력과 타입 변환', points: ['input()은 항상 문자열 → 숫자 계산하려면 변환', 'int(), float(), str()'], code: `A = int(input("A = ?"))
B = int(input("B = ?"))
print(A + B)` },
    { title: '함수 핵심 개념', points: ['y = f(x): 입력을 넣으면 결과가 나옴', '함수 안에 함수: print(type(1))'] },
  ],
  questions: [
    { id: 'be-01-01', type: 'mcq', source: '주피터 노트북 사용법', question: '주피터 노트북에서 현재 셀을 실행하는 단축키는?', choices: ['Ctrl + S', 'Shift + Enter', 'Alt + R', 'a'], answer: 1, explanation: 'Shift + Enter 실행. a는 위에, b는 아래에 셀 추가.' },
    { id: 'be-01-02', type: 'mcq', source: '주피터 노트북 사용법', question: '셀 왼쪽에 [*]가 계속 표시되고 다른 셀이 실행되지 않는다. 원인은?', choices: ['문법 에러', '아직 실행 중 (무한 반복이나 input 대기)', '마크다운 셀이라서', '저장이 안 돼서'], answer: 1, explanation: '[*] = 실행 중. Stop 또는 Restart로 끊어요.' },
    { id: 'be-01-03', type: 'mcq', source: '마크다운 문법', question: '마크다운에서 굵은 글씨는?', choices: ['*글자*', '**글자**', '# 글자', '> 글자'], answer: 1, explanation: '*기울임*, **굵게**, # 제목, > 인용.' },
    { id: 'be-01-04', type: 'short', source: '마크다운 문법', question: '마크다운에서 이미지를 넣는 문법의 시작 기호 두 글자는?', answer: ['![', '!['], explanation: '![설명](이미지주소). 링크는 느낌표 없이 [텍스트](주소).' },
    { id: 'be-01-05', type: 'short', source: '출력과 계산', question: 'print(7 // 2, 7 % 2, 2 ** 3) 의 출력은?', answer: ['3 1 8'], explanation: '// 몫 3, % 나머지 1, ** 거듭제곱 8.' },
    { id: 'be-01-06', type: 'mcq', source: '변수와 데이터 타입', question: 'True의 데이터 타입은?', choices: ['int', 'str', 'bool', 'float'], answer: 2, explanation: 'bool은 True/False 두 값.' },
    { id: 'be-01-07', type: 'ox', source: '변수와 데이터 타입', question: '파이썬 변수 이름은 snake_case(user_name) 방식을 권장한다.', answer: true, explanation: '단어를 밑줄로 연결. 클래스 이름은 CapWords.' },
    { id: 'be-01-08', type: 'mcq', source: '비교 연산자', question: '"같지 않다"를 뜻하는 비교 연산자는?', choices: ['<>', '=!', '!=', '=/='], answer: 2, explanation: '!= (같지 않음), == (같음).' },
    { id: 'be-01-09', type: 'mcq', source: '입력과 타입 변환', question: 'a = input() 에 3, b = input() 에 4를 입력하고 print(a + b) 하면?', choices: ['7', '34', '에러', '12'], answer: 1, explanation: 'input()은 항상 문자열 → "3" + "4" = "34". 계산하려면 int()로 변환.' },
    { id: 'be-01-10', type: 'ox', source: '함수 핵심 개념', question: 'print(type(1)) 처럼 함수 안에 함수를 넣을 수 있다.', answer: true, explanation: '안쪽 type(1)의 결과(<class "int">)가 print의 입력이 돼요. y = f(x).' },
  ],
}

export default topic

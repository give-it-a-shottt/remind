import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-02-string-list',
  track: 'backend',
  group: 'Python 기초',
  title: '2강 - 문자열 & 리스트',
  order: 2,
  notionId: '3efdf951bf8081278b07e013b599a969',
  sections: [
    { title: '문자열 인덱스와 슬라이싱', points: ['len()으로 길이', '인덱스는 0부터, 뒤에서부터는 -1부터', '문자열[시작:끝] → 끝 번호 바로 앞까지'], code: `s = "python"
print(s[0])    # p
print(s[-1])   # n
print(s[1:5])  # ytho` },
    { title: '문자열 함수', points: ["count('p') 개수, find('p') 위치", 'replace(A, B) 바꾸기, strip() 양쪽 공백 제거', 'split() 공백 기준으로 나눠 리스트로'] },
    { title: '포맷 출력', points: ['"{} {}".format(a, b), {1}{0}처럼 번호로 순서 지정', 'format(0.087, ".2f") → 소수점 2자리', '%s 문자열, %d 정수, %f 실수'] },
    { title: '리스트', points: ['관련 있는 여러 데이터를 하나의 변수로', '[ ] 안에 쉼표로 구분, 타입이 섞여도 됨', '선언: lang = [] 또는 list()'] },
    { title: '리스트 함수', points: ['append(값) 끝에 추가, insert(위치, 값)', 'remove(값) / del 리스트[인덱스] 삭제', 'sort() 정렬, reverse() 뒤집기'] },
  ],
  questions: [
    { id: 'be-02-01', type: 'short', source: '문자열 인덱스와 슬라이싱', question: 's = "python" 일 때 s[1:5] 는?', answer: ['ytho', "'ytho'", '"ytho"'], explanation: '끝 번호(5) 바로 앞까지 → 인덱스 1~4 = ytho.' },
    { id: 'be-02-02', type: 'short', source: '문자열 인덱스와 슬라이싱', question: 's = "python" 일 때 s[-1] 은?', answer: ['n', "'n'", '"n"'], explanation: '-1은 맨 뒤 글자.' },
    { id: 'be-02-03', type: 'mcq', source: '문자열 함수', question: '"a b c".split() 의 결과는?', choices: ['"abc"', "['a', 'b', 'c']", "('a', 'b', 'c')", '3'], answer: 1, explanation: 'split()은 공백 기준으로 나눠 리스트를 만들어요.' },
    { id: 'be-02-04', type: 'mcq', source: '문자열 함수', question: '문자열 양쪽 공백을 제거하는 함수는?', choices: ['trim()', 'strip()', 'cut()', 'clean()'], answer: 1, explanation: 'strip(). JS의 trim()과 헷갈리지 않기.' },
    { id: 'be-02-05', type: 'short', source: '포맷 출력', question: '"I have a {1}, I have an {0}.".format("pen", "apple") 의 결과는?', answer: ['I have a apple, I have an pen.'], explanation: '{1}은 두 번째 인자(apple), {0}은 첫 번째(pen).' },
    { id: 'be-02-06', type: 'mcq', source: '포맷 출력', question: 'format(0.087, ".2f") 의 결과는?', choices: ['0.08', '0.09', '0.087', '8.7%'], answer: 1, explanation: '소수점 2자리로 반올림 → 0.09.' },
    { id: 'be-02-07', type: 'ox', source: '리스트', question: '파이썬 리스트에는 서로 다른 타입의 값을 함께 넣을 수 있다.', answer: true, explanation: '[1, "a", True] 처럼 섞여도 돼요.' },
    { id: 'be-02-08', type: 'mcq', source: '리스트 함수', question: 'lang = ["java", "c"]; lang.append("go") 후 lang은?', choices: ['["go", "java", "c"]', '["java", "c", "go"]', '["java", "go", "c"]', '에러'], answer: 1, explanation: 'append는 끝에 추가. 원하는 위치는 insert(위치, 값).' },
    { id: 'be-02-09', type: 'mcq', source: '리스트 함수', question: '인덱스로 리스트 요소를 삭제하는 방법은?', choices: ['lang.remove(0)', 'del lang[0]', 'lang.delete(0)', 'lang.pop("0")'], answer: 1, explanation: 'del 리스트[인덱스]는 위치로, remove(값)은 값으로 삭제.' },
  ],
}

export default topic

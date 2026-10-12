import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-08-decorator-1',
  track: 'backend',
  group: '데코레이터',
  title: '8강 - 데코레이터 ① 중첩 함수 & First-class 함수',
  order: 8,
  notionId: '3efdf951bf808142b13df5bd00c4a917',
  sections: [
    { title: '왜 데코레이터?', points: ['Flask의 @app.route 같은 @ 문법이 데코레이터', '여러 언어에서 쓰이는 개념', '이해 순서: 중첩 함수 → First-class 함수 → Closure'] },
    { title: '중첩 함수', points: ['함수 안에 정의된 또 다른 함수', '바깥 함수 안에서만 호출 가능 (로컬 변수와 같은 원리)'] },
    { title: 'First-class 함수', points: ['1. 함수를 변수에 저장 2. 다른 함수의 인자로 전달 3. 리턴값으로 돌려줌', '파이썬은 모든 것이 객체라 함수도 이렇게 다룸', '지원: Python, Go, JavaScript, Kotlin / 미지원: C 등'] },
    { title: '예시', points: ['func1 = calc_square → 변수에 저장', 'list_square(calc_square, [1, 2, 3]) → 인자로 전달', 'html_creator("h1") → text_wrapper 함수를 리턴'], code: `def html_creator(tag):
    def text_wrapper(msg):
        print('<{0}>{1}</{0}>'.format(tag, msg))
    return text_wrapper

h1 = html_creator('h1')
h1('제목입니다')  # <h1>제목입니다</h1>` },
    { title: '연습: 목차 기호 붙이는 함수', points: ['list_creator("-")가 반환한 함수에 리스트를 넣으면 각 항목 앞에 - 를 붙여 출력'] },
  ],
  questions: [
    { id: 'be-08-01', type: 'mcq', source: '왜 데코레이터?', question: '데코레이터를 이해하기 위한 순서로 맞는 것은?', choices: ['Closure → 중첩 함수 → First-class', '중첩 함수 → First-class 함수 → Closure', 'First-class → Closure → 중첩 함수', '클래스 → 상속 → 데코레이터'], answer: 1, explanation: '중첩 함수 → First-class 함수 → Closure → 데코레이터.' },
    { id: 'be-08-02', type: 'mcq', source: '중첩 함수', question: 'outer_func 안에 정의된 inner_func를 바깥에서 inner_func()로 호출하면?', choices: ['정상 실행', 'NameError (밖에서는 호출 불가)', 'None 반환', 'outer_func도 함께 실행'], answer: 1, explanation: '중첩 함수는 로컬 변수처럼 바깥 함수 안에서만 존재해요.' },
    { id: 'be-08-03', type: 'mcq', source: 'First-class 함수', question: 'First-class 함수의 조건이 아닌 것은?', choices: ['변수에 저장할 수 있다', '다른 함수의 인자로 전달할 수 있다', '리턴값으로 돌려줄 수 있다', '반드시 클래스 안에 있어야 한다'], answer: 3, explanation: '저장·전달·반환이 가능하면 First-class 함수.' },
    { id: 'be-08-04', type: 'ox', source: 'First-class 함수', question: 'C 언어는 First-class 함수를 지원한다.', answer: false, explanation: '지원: Python, Go, JavaScript, Kotlin. 미지원: C 등.' },
    { id: 'be-08-05', type: 'short', source: '예시', question: "h1 = html_creator('h1'); h1('제목') 의 출력은?", code: `def html_creator(tag):
    def text_wrapper(msg):
        print('<{0}>{1}</{0}>'.format(tag, msg))
    return text_wrapper`, answer: ['<h1>제목</h1>'], explanation: '{0}=tag, {1}=msg → <h1>제목</h1>.' },
    { id: 'be-08-06', type: 'short', source: '연습: 목차 기호 붙이는 함수', question: "minus = list_creator('-'); minus(['안녕']) 의 출력은?", code: `def list_creator(tag):
    def text_wrapper(list_data):
        for item in list_data:
            print(tag, item)
    return text_wrapper`, answer: ['- 안녕'], explanation: 'print(tag, item) → 기호와 항목 사이에 공백.' },
  ],
}

export default topic

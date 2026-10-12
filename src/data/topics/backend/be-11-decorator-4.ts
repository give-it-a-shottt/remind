import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-11-decorator-4',
  track: 'backend',
  group: '데코레이터',
  title: '11강 - 데코레이터 ④ 여러 개·메서드·파라미터 데코레이터',
  order: 11,
  notionId: '3efdf951bf8081a1abeae8f03c744e48',
  sections: [
    { title: '데코레이터 여러 개 지정', points: ['@데코레이터를 여러 줄 쓰면 됨', '위에 쓴 것부터 순서대로 실행 (decorator1 → decorator2 → 함수)'] },
    { title: '도전 과제: HTML 태그 붙이기', points: ['@mark_bold 아래 @mark_italic → 안쪽(아래)부터 감싸져서 <b><i>...</i></b>'], code: `@mark_bold
@mark_italic
def add_html(string):
    return string

print(add_html('안녕하세요'))  # <b><i>안녕하세요</i></b>` },
    { title: '메서드에 데코레이터 적용', points: ['클래스 메서드는 첫 파라미터가 self → 데코레이터 wrapper에도 self를 넣어야 함'], code: `def h1_tag(function):
    def func_wrapper(self, *args, **kwargs):
        return "<h1>{0}</h1>".format(function(self, *args, **kwargs))
    return func_wrapper` },
    { title: 'format() 함수 복습', points: ["'{} {}'.format(10, 100) → 10 100", "'{0} {2} {0} {1}'.format(10, 100, 20) → 10 20 10 100", "'{aa} {bb}'.format(aa='a', bb='b') → 이름으로 지정"] },
    { title: '파라미터가 있는 데코레이터', points: ['중첩 함수를 한 단계 더 깊게', '@decorator1(1) = decorator1(1)(함수)', 'Flask의 @app.route("/hello")도 파라미터가 있는 데코레이터'], code: `def mark_html(tag):
    def outer_wrapper(function):
        def inner_wrapper(*args, **kwargs):
            return '<' + tag + '>' + function(*args, **kwargs) + '</' + tag + '>'
        return inner_wrapper
    return outer_wrapper` },
  ],
  questions: [
    { id: 'be-11-01', type: 'mcq', source: '데코레이터 여러 개 지정', question: '@decorator1 아래 @decorator2 를 붙인 hello()를 호출하면 실행 순서는?', choices: ['decorator2 → decorator1 → hello', 'decorator1 → decorator2 → hello', 'hello → decorator1 → decorator2', 'hello만'], answer: 1, explanation: '위에 쓴 데코레이터부터 순서대로 실행돼요.' },
    { id: 'be-11-02', type: 'short', source: '도전 과제: HTML 태그 붙이기', question: "@mark_bold, @mark_italic 순으로 꾸민 add_html('안녕') 의 결과는?", answer: ['<b><i>안녕</i></b>'], explanation: '아래(mark_italic)가 먼저 감싸고 그 바깥을 mark_bold가 감싸요.' },
    { id: 'be-11-03', type: 'mcq', source: '메서드에 데코레이터 적용', question: '클래스 메서드에 쓰는 데코레이터의 wrapper가 꼭 받아야 하는 첫 인자는?', choices: ['cls', 'self', 'args', '아무것도 필요 없음'], answer: 1, explanation: '메서드는 첫 파라미터가 self라 wrapper도 self를 받아 넘겨야 해요.' },
    { id: 'be-11-04', type: 'short', source: 'format() 함수 복습', question: "'{0} {2} {0} {1}'.format(10, 100, 20) 의 결과는?", answer: ['10 20 10 100'], explanation: '번호 = 인자 순서: 0→10, 1→100, 2→20.' },
    { id: 'be-11-05', type: 'mcq', source: '파라미터가 있는 데코레이터', question: '@mark_html("h1") 과 같은 의미는?', choices: ['mark_html(함수)("h1")', 'mark_html("h1")(함수)', 'mark_html("h1", 함수)', 'mark_html()("h1")'], answer: 1, explanation: '파라미터로 데코레이터를 만든 뒤(outer_wrapper) 그걸로 함수를 감싸요.' },
    { id: 'be-11-06', type: 'ox', source: '파라미터가 있는 데코레이터', question: 'Flask의 @app.route("/hello")는 파라미터가 있는 데코레이터다.', answer: true, explanation: '"/hello"를 받아 URL과 함수를 연결하는 데코레이터를 만들어요.' },
    { id: 'be-11-07', type: 'mcq', source: '파라미터가 있는 데코레이터', question: '파라미터가 있는 데코레이터는 중첩 함수가 몇 단계인가?', choices: ['1단계', '2단계', '3단계 (태그 받기 → 함수 받기 → 인자 받기)', '중첩 없음'], answer: 2, explanation: 'mark_html(tag) → outer_wrapper(function) → inner_wrapper(*args) 로 한 단계 더 깊어요.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-10-decorator-3',
  track: 'backend',
  group: '데코레이터',
  title: '10강 - 데코레이터 ③ 작성법 & 파라미터',
  order: 10,
  notionId: '3efdf951bf8081faad83c5aa0c575c3f',
  sections: [
    { title: '데코레이터란?', points: ['함수 앞뒤에 기능을 추가하는 기법, Closure를 활용', '여러 함수에 같은 기능(유효성 검사 등)을 넣을 때 각 함수를 일일이 고치지 않아도 됨', '검사 방법이 바뀌면 데코레이터 하나만 고치면 됨'] },
    { title: '작성법', points: ['꾸밀 함수(func)를 받아 감싸는 함수(wrapper)를 리턴', 'wrapper 안에서 앞 기능 → func() → 뒤 기능'], code: `def datetime_decorator(func):
    def wrapper():
        print('time', datetime.datetime.now())
        func()
        print(datetime.datetime.now())
    return wrapper

@datetime_decorator
def logger_login():
    print("login")` },
    { title: '데코레이터를 풀어서 쓰면', points: ['@outer_func 를 붙이는 것 = log_func = outer_func(log_func)'] },
    { title: '파라미터가 있는 함수에 적용', points: ['안쪽 함수가 꾸밀 함수와 같은 파라미터를 받으면 됨'], code: `def outer_func(function):
    def inner_func(d1, d2):
        if d2 == 0:
            print('cannot be divided with zero')
            return
        function(d1, d2)
    return inner_func` },
    { title: '연습: type_checker 데코레이터', points: ['두 인자가 int가 아니면 안내 문구 출력 후 return, 맞으면 원래 함수 실행'] },
    { title: '어떤 함수에도 쓸 수 있는 데코레이터', points: ['(*args, **kwargs)로 받으면 파라미터 개수와 상관없이 적용'], code: `def general_decorator(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper` },
  ],
  questions: [
    { id: 'be-10-01', type: 'essay', source: '데코레이터란?', question: '여러 API 함수에 같은 유효성 검사를 넣을 때 데코레이터를 쓰면 좋은 이유는?', answer: '검사 코드를 각 함수에 복사해 넣으면 검사 방법이 바뀔 때 모든 함수를 고쳐야 한다. 데코레이터로 한 곳에 만들어 함수 앞에 @로 붙이면 원래 함수는 그대로 두고 앞뒤에 기능을 추가할 수 있고, 수정도 데코레이터 하나만 하면 된다.', keywords: ['중복 제거', '한 곳 수정', '앞뒤 기능'], explanation: '데코레이터 = 함수 앞뒤에 기능을 추가하는 기법.' },
    { id: 'be-10-02', type: 'mcq', source: '작성법', question: '데코레이터 함수가 마지막에 리턴하는 것은?', choices: ['원래 함수 func', '감싸는 함수 wrapper (호출하지 않고 이름만)', 'wrapper()의 실행 결과', 'None'], answer: 1, explanation: 'return wrapper — Closure로 func를 기억한 wrapper를 돌려줘요.' },
    { id: 'be-10-03', type: 'short', source: '데코레이터를 풀어서 쓰면', question: '@outer_func 를 log_func 위에 붙인 것과 같은 코드는? (log_func = ...)', answer: ['outer_func(log_func)', 'log_func = outer_func(log_func)'], explanation: '데코레이터 문법은 함수를 감싼 결과로 이름을 바꿔치기하는 것과 같아요.' },
    { id: 'be-10-04', type: 'mcq', source: '파라미터가 있는 함수에 적용', question: 'divide(d1, d2)에 데코레이터를 적용하려면 안쪽 함수는?', choices: ['파라미터가 없어야 한다', 'divide와 같은 파라미터(d1, d2)를 받아야 한다', 'self를 받아야 한다', '하나만 받아야 한다'], answer: 1, explanation: '안쪽 함수가 같은 인자를 받아서 원래 함수에 전달해요.' },
    { id: 'be-10-05', type: 'short', source: '파라미터가 있는 함수에 적용', question: '위 outer_func로 꾸민 divide(9, 0) 을 호출하면 출력은?', answer: ['cannot be divided with zero'], explanation: 'd2 == 0이라 안내 문구 출력 후 return. 에러 대신 안내.' },
    { id: 'be-10-06', type: 'ox', source: '연습: type_checker 데코레이터', question: 'type_checker는 type(d1) != int or type(d2) != int 이면 원래 함수를 실행하지 않는다.', answer: true, explanation: "'the only int is supported' 출력 후 return." },
    { id: 'be-10-07', type: 'mcq', source: '어떤 함수에도 쓸 수 있는 데코레이터', question: '파라미터 개수와 상관없이 쓸 수 있는 데코레이터의 wrapper 시그니처는?', choices: ['wrapper()', 'wrapper(self)', 'wrapper(*args, **kwargs)', 'wrapper(args, kwargs)'], answer: 2, explanation: '*args(위치 인자), **kwargs(키워드 인자)로 모두 받아 그대로 넘겨요.' },
  ],
}

export default topic

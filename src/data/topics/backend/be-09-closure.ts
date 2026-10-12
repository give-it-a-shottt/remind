import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-09-closure',
  track: 'backend',
  group: '데코레이터',
  title: '9강 - 데코레이터 ② Closure',
  order: 9,
  notionId: '3efdf951bf8081ebab07d7c8c1112978',
  sections: [
    { title: 'Closure란?', points: ['함수와 그 함수가 가진 데이터를 함께 저장해서 따로 쓰는 기법', '바깥 함수가 끝나도(삭제돼도) 안쪽 함수와 바깥 변수 값이 살아 있음'], code: `def outer_func(num):
    def inner_func():
        print(num)
    return inner_func

closure_func = outer_func(10)
closure_func()   # 10
del outer_func
closure_func()   # 그래도 10` },
    { title: '정리', points: ['outer_func(10) 호출이 끝나면 원래 num은 사라져야 함', '그런데 closure_func() 호출 시 저장된 10을 사용', '함수 + 데이터를 같이 기억하는 것이 Closure'] },
    { title: '언제 쓰나?', points: ['Closure는 객체(클래스)와 비슷한 역할', '제공할 기능이 적으면 Closure, 많으면 클래스'], code: `def calc_power(n):
    def power(digit):
        return digit ** n
    return power

power2, power3 = calc_power(2), calc_power(3)
print(power2(2), power3(2))  # 4 8` },
    { title: '연습: 1승~5승 계산 함수', points: ['[calc_power(n) for n in range(1, 6)] → 함수 5개가 담긴 리스트'] },
  ],
  questions: [
    { id: 'be-09-01', type: 'mcq', source: 'Closure란?', question: 'Closure의 정의로 가장 알맞은 것은?', choices: ['함수 안에 클래스를 넣는 것', '함수와 그 함수가 가진 데이터를 함께 저장해 따로 쓰는 기법', '함수를 삭제하는 것', '전역 변수만 쓰는 함수'], answer: 1, explanation: '바깥 함수가 끝나도 안쪽 함수가 바깥 변수 값을 기억해요.' },
    { id: 'be-09-02', type: 'short', source: 'Closure란?', question: 'closure_func = outer_func(10); del outer_func; closure_func() 의 출력은?', answer: ['10'], explanation: 'outer_func를 지워도 closure_func가 num=10을 기억해요.' },
    { id: 'be-09-03', type: 'ox', source: '정리', question: 'outer_func(10) 호출이 끝나면 num 값은 메모리에서 바로 사라져 closure_func()가 에러를 낸다.', answer: false, explanation: 'Closure가 데이터를 함께 저장해서 계속 쓸 수 있어요.' },
    { id: 'be-09-04', type: 'mcq', source: '언제 쓰나?', question: 'Closure와 클래스 중 선택하는 기준은?', choices: ['기능이 적으면 Closure, 많으면 클래스', '항상 클래스', '항상 Closure', '속도가 빠른 쪽'], answer: 0, explanation: 'Closure는 객체와 비슷한 역할. 제공할 기능이 많아지면 클래스가 관리하기 좋아요.' },
    { id: 'be-09-05', type: 'short', source: '언제 쓰나?', question: 'power3 = calc_power(3); print(power3(2)) 의 출력은?', answer: ['8'], explanation: '2 ** 3 = 8. n=3을 Closure가 기억해요.' },
    { id: 'be-09-06', type: 'short', source: '연습: 1승~5승 계산 함수', question: 'for f in [calc_power(n) for n in range(1, 6)]: print(f(2)) 의 출력을 공백으로 구분해 쓰면?', answer: ['2 4 8 16 32'], explanation: '2의 1~5승.' },
  ],
}

export default topic

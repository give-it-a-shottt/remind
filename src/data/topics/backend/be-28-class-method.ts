import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-28-class-method',
  track: 'backend',
  group: '클래스·배포',
  title: '28강 - 클래스 변수 & static·class 메서드',
  order: 28,
  notionId: '3efdf951bf8081798cc5cbbf7c22b9c9',
  sections: [
    { title: '클래스 변수 vs 인스턴스 변수', points: ['클래스 변수: 메서드 밖에 선언, 모든 객체가 공유 → 클래스명.변수명', '인스턴스 변수: 메서드 안에서 self.변수명, 객체마다 다름', '__del__: 객체가 삭제될 때 실행'] },
    { title: 'instance method', points: ['self를 받는 일반 메서드, 호출한 객체에만 영향, 객체 속성 접근 가능'] },
    { title: 'static method', points: ['객체와 상관없지만 논리상 클래스에 넣어 둔 메서드', '@staticmethod 필수, self 없음 → 객체 속성 접근 불가 (클래스 변수는 가능)', '클래스명.메서드(), 객체명.메서드() 둘 다 호출 가능'] },
    { title: 'class method', points: ['@classmethod 필수, self 대신 cls', 'cls.클래스변수로 접근, 객체 속성은 불가'] },
    { title: 'static vs class method 차이', points: ['classmethod: cls가 호출한 클래스를 가리킴 → 자식에서 부르면 자식 클래스 값만 바뀜', 'staticmethod: 클래스 이름을 직접 써서 항상 그 클래스 값이 바뀜'] },
  ],
  questions: [
    { id: 'be-28-01', type: 'short', source: '클래스 변수 vs 인스턴스 변수', question: 'Figure(2,3), Figure(4,5) 생성 후 print(Figure.count)는? (생성자에서 Figure.count += 1)', answer: ['2'], explanation: '클래스 변수는 모든 객체가 공유.' },
    { id: 'be-28-02', type: 'mcq', source: '클래스 변수 vs 인스턴스 변수', question: '객체가 삭제될 때 실행되는 메서드는?', choices: ['__init__', '__del__', '__exit__', '__end__'], answer: 1, explanation: '__del__에서 Figure.count -= 1 처럼 정리해요.' },
    { id: 'be-28-03', type: 'ox', source: 'instance method', question: 'instance method는 호출한 객체의 속성에 접근할 수 있다.', answer: true, explanation: 'self로 그 객체에 접근해요.' },
    { id: 'be-28-04', type: 'mcq', source: 'static method', question: 'static method 안에서 self.width를 쓰면?', choices: ['정상 동작', "NameError: name 'self' is not defined", 'None', '클래스 변수로 대체'], answer: 1, explanation: 'staticmethod는 self를 받지 않아요.' },
    { id: 'be-28-05', type: 'short', source: 'class method', question: 'class method가 self 대신 받는 첫 번째 인자 이름은?', answer: ['cls'], explanation: '@classmethod def print_count(cls): return cls.count' },
    { id: 'be-28-06', type: 'mcq', source: 'static vs class method 차이', question: 'Figure를 상속한 Circle에서 classmethod set_name("circle")을 호출하면?', choices: ['Figure와 Circle의 name이 모두 바뀜', 'Circle의 name만 바뀜', 'Figure의 name만 바뀜', '에러'], answer: 1, explanation: 'cls가 호출한 클래스(Circle)를 가리켜요. staticmethod(Figure.name = ...)였다면 Figure까지 바뀜.' },
    { id: 'be-28-07', type: 'essay', source: 'static vs class method 차이', question: 'static method와 class method의 차이를 상속 상황에서 설명하세요.', answer: 'class method는 cls로 호출한 클래스를 받기 때문에 자식 클래스에서 호출하면 자식 클래스의 클래스 변수만 바뀐다. static method는 cls가 없어 메서드 안에서 클래스 이름을 직접 써야 하므로, 자식에서 호출해도 항상 그 이름의 클래스(부모) 값이 바뀐다.', keywords: ['cls', '호출한 클래스', '이름 직접'], explanation: '상속까지 고려하면 class method.' },
  ],
}

export default topic

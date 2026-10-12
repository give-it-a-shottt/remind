import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-26-class',
  track: 'backend',
  group: '클래스·배포',
  title: '26강 - 클래스 기본 (class & object)',
  order: 26,
  notionId: '3efdf951bf80817abb60e92382bb6efa',
  sections: [
    { title: '클래스 선언', points: ['객체를 만들기 전에 클래스를 먼저 선언, 내용이 없으면 pass', '이름은 CapWords (SingleWord)', 'square = Quadrangle() 로 객체 생성, dir(객체)로 속성·메서드 확인'] },
    { title: 'attribute (속성)', points: ['__init__(생성자) 안에서 self.속성명으로 만듦', '객체마다 속성 값은 따로 관리됨'], code: `class Quadrangle:
    def __init__(self, width, height, color):
        self.width = width
        self.height = height
        self.color = color` },
    { title: 'method (메서드)', points: ['클래스 안에 정의한 함수', '첫 번째 파라미터는 항상 self', '클래스 안에서 속성 접근은 self.속성명'] },
    { title: 'self를 꼭 넣는 이유', points: ['메서드를 호출하면 객체 자신이 첫 번째 인자로 자동으로 들어감', 'square.get_area() = Quadrangle.get_area(square)'] },
  ],
  questions: [
    { id: 'be-26-01', type: 'mcq', source: '클래스 선언', question: '파이썬 클래스 이름 짓는 방식은?', choices: ['snake_case', 'CapWords', 'kebab-case', 'UPPER_CASE'], answer: 1, explanation: 'class SingleWord — 단어 첫 글자 대문자.' },
    { id: 'be-26-02', type: 'short', source: '클래스 선언', question: '내용이 없는 클래스를 임시로 선언할 때 몸통에 쓰는 키워드는?', answer: ['pass'], explanation: 'class Quadrangle:\n    pass' },
    { id: 'be-26-03', type: 'mcq', source: 'attribute (속성)', question: '객체의 속성을 만드는 곳은?', choices: ['클래스 밖 전역', '__init__ 안에서 self.속성명', 'import 문', 'return 문'], answer: 1, explanation: '__init__(생성자)에서 self.width = width 처럼.' },
    { id: 'be-26-04', type: 'ox', source: 'attribute (속성)', question: 'square1.height = 5 로 바꾸면 같은 클래스로 만든 square2의 height도 바뀐다.', answer: false, explanation: '인스턴스 속성은 객체마다 따로 관리돼요.' },
    { id: 'be-26-05', type: 'short', source: 'method (메서드)', question: 'square = Quadrangle(2, 3, "blue"); square.set_area(5, 5); print(square.get_area()) 의 출력은? (get_area = width * height)', answer: ['25'], explanation: 'set_area로 5, 5로 바뀐 뒤 5 × 5.' },
    { id: 'be-26-06', type: 'mcq', source: 'self를 꼭 넣는 이유', question: 'square.get_area() 와 같은 호출은?', choices: ['Quadrangle.get_area()', 'Quadrangle.get_area(square)', 'get_area(Quadrangle)', 'self.get_area(square)'], answer: 1, explanation: '메서드 호출 시 객체 자신이 첫 번째 인자(self)로 자동으로 들어가요.' },
  ],
}

export default topic

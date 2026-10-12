import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-27-inheritance',
  track: 'backend',
  group: '클래스·배포',
  title: '27강 - 상속 & 메서드 재정의',
  order: 27,
  notionId: '3efdf951bf8081ada6a4fe809ac5761b',
  sections: [
    { title: '추상화와 상속', points: ['추상화: 겹치는 속성·메서드를 기본 클래스로 묶기', '상속: 기본 클래스 기능을 물려받고 다른 부분만 추가·변경', '부모 = 상위, Parent, Super, Base / 자식 = 하위, Child, Sub, Derived', '장점: 코드 재사용, 공통 기능은 부모만 고치면 됨 / 부모가 둘 이상이면 다중 상속'] },
    { title: '상속 방법', points: ['class Quadrangle(Figure): → 괄호 안에 부모', '__init__이 없으면 부모 것 사용'] },
    { title: '관계 확인', points: ['issubclass(자식, 부모): 상속 관계인지', 'isinstance(객체, 클래스): 그 클래스(또는 부모)로 만든 객체인지'] },
    { title: '메서드 재정의 (Override)', points: ['부모 메서드를 자식에서 같은 이름으로 다시 정의 → 자식 객체에선 재정의된 것이 호출', '파이썬은 이름만 같으면 됨 (C++/Java는 인자까지 같아야)'] },
    { title: 'super()와 self', points: ['super().메서드명(): 자식에서 부모의 메서드 호출', 'self.메서드명(): 현재 객체 자신의 메서드 (재정의했으면 재정의된 것)', '다른 언어의 this = 파이썬의 self'] },
  ],
  questions: [
    { id: 'be-27-01', type: 'mcq', source: '추상화와 상속', question: '부모 클래스를 부르는 다른 이름이 아닌 것은?', choices: ['Super', 'Base', 'Derived', 'Parent'], answer: 2, explanation: 'Derived는 자식(파생) 클래스.' },
    { id: 'be-27-02', type: 'short', source: '상속 방법', question: 'Figure를 상속받는 Quadrangle 클래스 선언 첫 줄은?', answer: ['class Quadrangle(Figure):'], explanation: '자식 클래스 괄호 안에 부모 클래스.' },
    { id: 'be-27-03', type: 'mcq', source: '관계 확인', question: 'square가 Quadrangle(Figure 상속)로 만든 객체일 때 isinstance(square, Figure) 는?', choices: ['True', 'False', '에러', 'None'], answer: 0, explanation: '부모 클래스 기준으로도 True.' },
    { id: 'be-27-04', type: 'ox', source: '메서드 재정의 (Override)', question: '파이썬에서 메서드를 재정의하려면 부모와 인자 개수까지 같아야 한다.', answer: false, explanation: '파이썬은 이름만 같으면 돼요. (C++/Java는 인자까지)' },
    { id: 'be-27-05', type: 'short', source: '메서드 재정의 (Override)', question: "ElecCar('dave').get_info() 의 출력은?", code: `class Car:
    def __init__(self, name): self.name = name
    def get_info(self): print(self.name)

class ElecCar(Car):
    def get_info(self): print(self.name, 'Fuel: Electronic')`, answer: ['dave Fuel: Electronic'], explanation: '자식에서 재정의한 get_info가 호출돼요.' },
    { id: 'be-27-06', type: 'mcq', source: 'super()와 self', question: 'Student(Person 상속)에서 work를 재정의했을 때, parttime 안의 super().work()가 호출하는 것은?', choices: ['Student의 work', 'Person의 work', '둘 다', '에러'], answer: 1, explanation: 'super()는 부모의 메서드, self.work()는 재정의된 자식 메서드.' },
  ],
}

export default topic

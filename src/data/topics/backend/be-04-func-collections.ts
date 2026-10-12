import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-04-func-collections',
  track: 'backend',
  group: 'Python 기초',
  title: '4강 - 함수 & 튜플·딕셔너리·집합',
  order: 4,
  notionId: '3efdf951bf8081ee8850c7e3d6b13c5c',
  sections: [
    { title: '함수', points: ['def로 정의, 입력(인자) → 처리 → 결과(return)', '입력 없는 함수, return 없는 함수도 가능', 'return a, b → 여러 값을 튜플로 돌려줌', 'return만 쓰면 그 자리에서 함수 종료 → 조건 체크에 자주 씀'] },
    { title: '튜플 (Tuple)', points: ['( )로 선언, 추가·삭제·수정 불가', '+ 더하기, * 반복은 가능', '값 맞바꾸기: (x, y) = (y, x)', 'list(), tuple()로 변환'] },
    { title: '딕셔너리 (Dictionary)', points: ['{key: value} 형태, JSON과 비슷', "d['english'] = 'pass' 추가, del d['math'] 삭제", 'keys(), values(), items()'] },
    { title: '집합 (Set)', points: ['순서 없음, 중복 없음, in으로 포함 확인', 'A | B 합집합, A & B 교집합, A - B 차집합, A ^ B 대칭차집합', 'add(값), update([여러 값]), remove(값)'] },
  ],
  questions: [
    { id: 'be-04-01', type: 'mcq', source: '함수', question: 'def f(): return 1, 2 를 호출한 결과 타입은?', choices: ['list', 'tuple', 'dict', '에러'], answer: 1, explanation: '여러 값을 return하면 튜플 (1, 2)로 돌려줘요.' },
    { id: 'be-04-02', type: 'ox', source: '함수', question: '함수 안에서 return만 단독으로 쓰면 그 자리에서 함수가 끝난다.', answer: true, explanation: '조건이 안 맞을 때 일찍 빠져나가는 패턴에 자주 써요 (반환값은 None).' },
    { id: 'be-04-03', type: 'mcq', source: '튜플 (Tuple)', question: '튜플에서 할 수 없는 것은?', choices: ['두 튜플 더하기', '튜플 반복(*)', '요소 수정', '인덱스로 읽기'], answer: 2, explanation: '튜플은 추가·삭제·수정 불가(immutable).' },
    { id: 'be-04-04', type: 'short', source: '튜플 (Tuple)', question: 'x와 y의 값을 한 줄로 맞바꾸는 코드는?', answer: ['x, y = y, x', '(x, y) = (y, x)'], explanation: '튜플 언패킹을 이용해요.' },
    { id: 'be-04-05', type: 'mcq', source: '딕셔너리 (Dictionary)', question: "d = {'korean': 95} 에 영어 점수를 추가하는 코드는?", choices: ["d.append('english', 90)", "d['english'] = 90", "d.add('english': 90)", "d + {'english': 90}"], answer: 1, explanation: '딕셔너리는 d[키] = 값 으로 추가(같은 키면 덮어쓰기).' },
    { id: 'be-04-06', type: 'mcq', source: '딕셔너리 (Dictionary)', question: '(키, 값) 쌍을 함께 꺼내는 딕셔너리 메서드는?', choices: ['keys()', 'values()', 'items()', 'pairs()'], answer: 2, explanation: 'items() → for k, v in d.items():' },
    { id: 'be-04-07', type: 'mcq', source: '집합 (Set)', question: 'A = {1, 2, 3}, B = {2, 3, 4} 일 때 A ^ B 는?', choices: ['{2, 3}', '{1, 2, 3, 4}', '{1, 4}', '{1}'], answer: 2, explanation: '^ 대칭차집합 = 둘 중 한쪽에만 있는 것 {1, 4}.' },
    { id: 'be-04-08', type: 'short', source: '집합 (Set)', question: 'A = {1, 2, 3}, B = {2, 3, 4} 일 때 A - B 는? (중괄호 포함)', answer: ['{1}'], explanation: '차집합: A에만 있는 것.' },
    { id: 'be-04-09', type: 'ox', source: '집합 (Set)', question: '집합에 같은 값을 두 번 add하면 두 개가 저장된다.', answer: false, explanation: '집합은 중복을 허용하지 않아 하나만 남아요.' },
  ],
}

export default topic

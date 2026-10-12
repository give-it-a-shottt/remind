import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-14-jsonify',
  track: 'backend',
  group: 'Flask',
  title: '14강 - jsonify로 REST API 구현 & VS Code',
  order: 14,
  notionId: '3efdf951bf808199b333e12b0e63ba46',
  sections: [
    { title: 'jsonify()', points: ['딕셔너리를 JSON 형식 응답으로 만들어 줌', '테스트: http GET http://localhost:8080/json_test'], code: `@app.route('/json_test')
def hello_json():
    data = {'name': '김대리', 'family': 'Byun'}
    return jsonify(data)` },
    { title: '참고: jsonify 없이도 됨?', points: ['딕셔너리를 그냥 return해도 Flask가 JSON으로 인식', '하지만 jsonify()가 더 명시적이고 표준적', '내부적으로 Response 객체를 만들고 Content-Type: application/json 헤더 설정'] },
    { title: 'VS Code를 쓰는 이유', points: ['주피터는 코드 조각 테스트용, 여러 파일이 연결되는 프로젝트는 코드 에디터가 편함', 'Pycharm은 파이썬 전용, VS Code는 여러 언어 + 가장 많이 씀'] },
    { title: 'VS Code 설치', points: ['Extension: Python, Python Extension Pack', 'Interpreter 위치: 맥 which python, 윈도우(PowerShell) where.exe python'] },
  ],
  questions: [
    { id: 'be-14-01', type: 'mcq', source: 'jsonify()', question: 'jsonify(data)에서 data로 주로 넘기는 파이썬 자료형은?', choices: ['리스트만', '딕셔너리', '튜플', '집합'], answer: 1, explanation: '딕셔너리 → JSON 객체. (리스트도 가능하지만 강의에선 딕셔너리)' },
    { id: 'be-14-02', type: 'mcq', source: '참고: jsonify 없이도 됨?', question: 'jsonify()가 응답에 설정해 주는 Content-Type은?', choices: ['text/html', 'application/json', 'text/plain', 'multipart/form-data'], answer: 1, explanation: 'Response 객체를 만들고 Content-Type: application/json을 붙여요.' },
    { id: 'be-14-03', type: 'ox', source: '참고: jsonify 없이도 됨?', question: '최신 Flask는 딕셔너리를 그냥 return해도 JSON 응답으로 처리한다.', answer: true, explanation: '그래도 jsonify()가 더 명시적이고 표준적인 방법이에요.' },
    { id: 'be-14-04', type: 'mcq', source: 'VS Code를 쓰는 이유', question: '주피터 대신 VS Code를 쓰는 이유는?', choices: ['주피터는 파이썬을 실행할 수 없어서', '여러 파일이 연결되는 프로젝트는 코드 에디터가 편해서', 'VS Code가 더 빨라서', 'Flask는 VS Code에서만 동작해서'], answer: 1, explanation: '주피터는 조각 테스트용, 프로젝트는 에디터.' },
    { id: 'be-14-05', type: 'short', source: 'VS Code 설치', question: '윈도우 PowerShell에서 python 인터프리터 위치를 확인하는 명령은?', answer: ['where.exe python', 'where python'], explanation: '맥은 which python.' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-16-jinja-1',
  track: 'backend',
  group: 'Flask',
  title: '16강 - Jinja2 템플릿 ① 변수 & 반복문',
  order: 16,
  notionId: '3efdf951bf80815a82bddec479d5ce62',
  sections: [
    { title: 'Jinja2 템플릿', points: ['HTML 안에서 필요한 부분만 바꿀 때 쓰는 문법', '{{ 변수명 }}: 값 출력', '{% 파이썬 코드 %}: 반복문, 조건문 등'] },
    { title: '변수 출력', points: ['render_template()에 템플릿에서 쓸 변수를 같이 넘겨야 함'], code: `return render_template('variable.html', name=user)
# variable.html: <h1>Hello {{ name }}</h1>` },
    { title: '반복문', points: ['{% for %}로 시작해서 {% endfor %}로 끝', '들여쓰기는 안 해도 됨'], code: `{% for value in values %}
<li>{{ value }}</li>
{% endfor %}` },
    { title: '반복문 추가 문법', points: ['range()는 파이썬과 같음', 'len(values) 대신 values | length', 'loop.index: 몇 번째 반복인지 (1부터)'] },
  ],
  questions: [
    { id: 'be-16-01', type: 'mcq', source: 'Jinja2 템플릿', question: 'Jinja2에서 값을 "출력"하는 문법은?', choices: ['{% name %}', '{{ name }}', '{# name #}', '${name}'], answer: 1, explanation: '{{ }} 출력, {% %} 코드(반복·조건), {# #} 주석.' },
    { id: 'be-16-02', type: 'mcq', source: '변수 출력', question: '템플릿에서 {{ name }}을 쓰려면 Flask에서 어떻게 넘겨야 할까?', choices: ["render_template('a.html', name=user)", "render_template('a.html')['name'] = user", "jsonify(name=user)", '전역 변수로 선언'], answer: 0, explanation: 'render_template의 키워드 인자로 넘긴 이름을 템플릿에서 써요.' },
    { id: 'be-16-03', type: 'short', source: '반복문', question: 'Jinja2 for 반복문을 끝내는 태그는?', answer: ['{% endfor %}', 'endfor'], explanation: '{% for %} ... {% endfor %}.' },
    { id: 'be-16-04', type: 'mcq', source: '반복문 추가 문법', question: 'Jinja2에서 리스트 values의 길이를 구하는 방법은?', choices: ['len(values)', 'values.length', 'values | length', 'count(values)'], answer: 2, explanation: '필터 문법 values | length.' },
    { id: 'be-16-05', type: 'ox', source: '반복문 추가 문법', question: 'Jinja2의 loop.index는 0부터 시작한다.', answer: false, explanation: 'loop.index는 1부터. (0부터는 loop.index0)' },
  ],
}

export default topic

import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-17-jinja-2',
  track: 'backend',
  group: 'Flask',
  title: '17강 - Jinja2 템플릿 ② 조건문 & 주석',
  order: 17,
  notionId: '3efdf951bf80818fafb6d7a70eaf38ac',
  sections: [
    { title: '조건문', points: ['{% if %}, {% elif %}, {% else %}, {% endif %}', 'elif, else는 필요할 때만, endif는 필수'], code: `{% if data >= 30 %}
<h3>30보다 큽니다.</h3>
{% elif data > 25 %}
<h3>25보다 큽니다.</h3>
{% else %}
<h3>{{ data }}</h3>
{% endif %}` },
    { title: '주석', points: ['{# 주석 #} → 실행·출력되지 않음, 여러 줄도 가능'] },
    { title: '크롤링 결과 그대로 리턴', points: ['requests.get(구글).text를 리턴하면 HTML은 보이지만 이미지·JS는 404', '상대 경로라 그 파일들을 내 서버에서 찾기 때문'] },
  ],
  questions: [
    { id: 'be-17-01', type: 'short', source: '조건문', question: '위 condition.html에 data = 27을 넘기면 출력되는 문구는?', answer: ['25보다 큽니다.', '25보다 큽니다'], explanation: '30 이상은 아니고 25보다 크므로 elif 블록.' },
    { id: 'be-17-02', type: 'ox', source: '조건문', question: 'Jinja2 조건문에서 {% endif %}는 생략할 수 있다.', answer: false, explanation: 'elif/else는 선택이지만 endif는 필수.' },
    { id: 'be-17-03', type: 'mcq', source: '주석', question: 'Jinja2 주석 문법은?', choices: ['<!-- -->', '{# #}', '{% comment %}', '//'], answer: 1, explanation: '{# #}로 감싸면 실행·출력되지 않아요. HTML 주석과 달리 결과 HTML에도 안 남아요.' },
    { id: 'be-17-04', type: 'essay', source: '크롤링 결과 그대로 리턴', question: '구글 HTML을 그대로 리턴하면 이미지·JS가 404가 되는 이유는?', answer: '구글 HTML 안의 이미지·스크립트 경로가 상대 경로라서, 브라우저가 그 파일들을 구글 서버가 아니라 현재 접속한 내 Flask 서버에서 찾는다. 내 서버엔 그 파일이 없으니 404가 난다.', keywords: ['상대 경로', '내 서버'], explanation: 'HTML만 가져오고 리소스 경로는 그대로라서 생기는 문제.' },
  ],
}

export default topic

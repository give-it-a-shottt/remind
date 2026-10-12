import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-20-error-logging',
  track: 'backend',
  group: 'Flask',
  title: '20강 - 에러 처리 & 로깅',
  order: 20,
  notionId: '3efdf951bf8081e6bf73ca497056d696',
  sections: [
    { title: 'errorhandler', points: ['특정 HTTP 오류 시 실행할 함수 지정', 'return의 두 번째 값으로 에러 코드를 안 주면 200(성공)으로 인식', '400 Bad Request / 403 Forbidden / 404 Not Found / 500 Internal Server Error'], code: `@app.errorhandler(404)
def page_not_found(error):
    return "<h1>404 Error</h1>", 404` },
    { title: '로깅이 필요한 이유', points: ['서버는 24시간 돌아가니 문제가 생겼을 때 기록을 보고 원인을 찾음', '사용자 모니터링, 해킹 확인 등에도 활용', '개발 단계보다 상용화 단계에서 제대로 구현'] },
    { title: '로그 레벨', points: ['DEBUG < INFO < WARNING < ERROR < CRITICAL', '설정한 레벨 이상만 기록됨'] },
    { title: '주요 로깅 핸들러', points: ['FileHandler: 파일로 저장', 'RotatingFileHandler: 크기를 넘으면 새 파일, 개수를 다 쓰면 처음부터 (maxBytes, backupCount)', '로그가 디스크를 꽉 채우지 않도록 보통 RotatingFileHandler'] },
    { title: 'Flask에 적용', points: ['RotatingFileHandler를 만들고 setLevel 후 app.logger.addHandler()로 등록해야 app.logger로 사용'] },
  ],
  questions: [
    { id: 'be-20-01', type: 'mcq', source: 'errorhandler', question: '@app.errorhandler(404) 함수에서 return "<h1>404</h1>" 만 쓰면 응답 상태 코드는?', choices: ['404', '200', '500', '302'], answer: 1, explanation: '두 번째 값으로 404를 같이 리턴해야 해요: return "...", 404' },
    { id: 'be-20-02', type: 'mcq', source: 'errorhandler', question: '"접근 권한 없음"을 뜻하는 상태 코드는?', choices: ['400', '403', '404', '500'], answer: 1, explanation: '400 잘못된 요청, 403 권한 없음, 404 없음, 500 서버 오류.' },
    { id: 'be-20-03', type: 'ox', source: '로깅이 필요한 이유', question: '로깅은 해킹 확인이나 사용자 모니터링에도 활용된다.', answer: true, explanation: '24시간 돌아가는 서버의 문제 원인을 찾는 기록.' },
    { id: 'be-20-04', type: 'mcq', source: '로그 레벨', question: 'level=logging.ERROR로 설정했을 때 기록되지 않는 것은?', choices: ['logging.error()', 'logging.critical()', 'logging.warning()', '둘 다 기록됨'], answer: 2, explanation: 'DEBUG < INFO < WARNING < ERROR < CRITICAL — 설정 레벨 이상만 기록.' },
    { id: 'be-20-05', type: 'short', source: '주요 로깅 핸들러', question: '파일 크기가 넘으면 새 파일로, 정해진 개수를 다 쓰면 처음부터 다시 쓰는 핸들러는?', answer: ['RotatingFileHandler'], explanation: 'maxBytes(파일 하나 크기), backupCount(파일 개수).' },
    { id: 'be-20-06', type: 'essay', source: '주요 로깅 핸들러', question: '운영 서버에서 FileHandler 대신 RotatingFileHandler를 쓰는 이유는?', answer: 'FileHandler는 로그를 한 파일에 계속 쌓아 디스크를 가득 채울 수 있고, 디스크가 차면 서버가 이상해질 수 있다. RotatingFileHandler는 파일 크기와 개수를 제한하고 오래된 것부터 덮어써서 용량을 일정하게 유지한다.', keywords: ['디스크', '크기·개수 제한'], explanation: 'maxBytes × backupCount 만큼만 사용.' },
    { id: 'be-20-07', type: 'mcq', source: 'Flask에 적용', question: '만든 핸들러를 app.logger로 쓰려면 꼭 해야 하는 것은?', choices: ['app.debug = False', 'app.logger.addHandler(file_handler)', 'logging.basicConfig()', 'app.run(log=True)'], answer: 1, explanation: '등록해야 app.logger.error(...)가 그 파일에 기록돼요.' },
  ],
}

export default topic

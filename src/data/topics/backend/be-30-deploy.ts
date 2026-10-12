import type { Topic } from '../../types'

const topic: Topic = {
  id: 'be-30-deploy',
  track: 'backend',
  group: '클래스·배포',
  title: '30강 - 배포 (ngrok & AWS)',
  order: 30,
  notionId: '3efdf951bf80818bb289e4782b910ad0',
  sections: [
    { title: '배포란?', points: ['만든 서비스를 다른 사람도 접속할 수 있게 서버에 올리는 것', '가장 일반적: 클라우드(AWS) + 리눅스 서버 + Docker'] },
    { title: 'ngrok: 초간단 배포', points: ['내 PC 서버를 외부에서 접속하게 해 줌', 'ngrok http 8080 (윈도우는 ngrok.exe http 8080)', '윈도우는 방화벽이 8080 인바운드를 막는지 확인'] },
    { title: '1. EC2 서버 만들기', points: ['AWS 콘솔 → Region(Seoul) → EC2 → Launch Instance', 'Ubuntu, t2.micro(프리티어), pem 파일(접속 키) 다운로드', 'Elastic IP: 고정 공개 IP를 인스턴스에 연결'] },
    { title: '2. 서버 접속', points: ['맥: chmod 400 pem → ssh -i pem ubuntu@공개IP', '윈도우: PuTTY + PuTTYgen', '파일 올리기: FileZilla(FTP)'] },
    { title: '3. Apache 웹서버 설치', points: ['sudo apt-get install apache2, sudo service apache2 restart / status', '정적 페이지는 /var/www/html/에 복사'] },
    { title: '4. Anaconda 설치', points: ['설치 파일을 FTP로 올리고 sudo bash Anaconda3-....sh'] },
    { title: '5. Flask를 Apache에 연결 (mod_wsgi)', points: ['Apache가 파이썬 앱을 실행하게 해 주는 모듈이 mod_wsgi', 'ports.conf에 포트 추가 + AWS 보안 설정에서도 포트 열기', '000-default.conf에 VirtualHost (WSGIDaemonProcess, WSGIScriptAlias)'] },
    { title: 'runserver.wsgi 예시', points: ['sys.path에 앱 경로 추가 후 from runserver import app as application'] },
    { title: '정리', points: ['개발 중 테스트 → ngrok', '실제 서비스 → AWS + 웹서버 + (요즘은) Docker'] },
  ],
  questions: [
    { id: 'be-30-01', type: 'mcq', source: '배포란?', question: '가장 일반적인 배포 형태로 강의에서 소개한 조합은?', choices: ['내 PC + 공유기', '클라우드(AWS) + 리눅스 서버 + Docker', 'GitHub Pages + DB', 'FTP + 윈도우 서버'], answer: 1, explanation: '그래서 AWS, 리눅스, Docker를 익혀야 해요.' },
    { id: 'be-30-02', type: 'short', source: 'ngrok: 초간단 배포', question: '8080 포트에서 돌고 있는 로컬 서버를 ngrok으로 외부에 여는 명령은?', answer: ['ngrok http 8080'], explanation: '윈도우는 ngrok.exe http 8080. 방화벽 인바운드 확인.' },
    { id: 'be-30-03', type: 'mcq', source: '1. EC2 서버 만들기', question: 'EC2 인스턴스에 고정 공개 IP를 할당하는 기능은?', choices: ['Security Group', 'Elastic IP', 'Region', 'AMI'], answer: 1, explanation: 'Elastic IP를 할당해 인스턴스에 연결해요.' },
    { id: 'be-30-04', type: 'short', source: '2. 서버 접속', question: '맥에서 pem 파일 권한을 설정하는 명령은? (chmod ...)', answer: ['chmod 400', 'chmod 400 [pem파일]'], explanation: 'chmod 400 key.pem → ssh -i key.pem ubuntu@IP' },
    { id: 'be-30-05', type: 'mcq', source: '3. Apache 웹서버 설치', question: 'Apache에서 정적 페이지를 두는 기본 경로는?', choices: ['/home/ubuntu', '/var/www/html/', '/etc/apache2', '/usr/bin'], answer: 1, explanation: 'FTP로 올린 뒤 /var/www/html/에 복사.' },
    { id: 'be-30-06', type: 'ox', source: '4. Anaconda 설치', question: 'EC2에 Anaconda를 설치할 때 설치 파일을 FTP로 올린 뒤 bash로 실행한다.', answer: true, explanation: 'sudo bash Anaconda3-....sh' },
    { id: 'be-30-07', type: 'short', source: '5. Flask를 Apache에 연결 (mod_wsgi)', question: 'Apache가 파이썬(Flask) 앱을 실행할 수 있게 해 주는 모듈 이름은?', answer: ['mod_wsgi'], explanation: 'WSGI = 파이썬 웹 앱과 웹서버를 잇는 표준.' },
    { id: 'be-30-08', type: 'ox', source: '5. Flask를 Apache에 연결 (mod_wsgi)', question: '새 포트로 서비스하려면 ports.conf만 수정하면 되고 AWS 보안 설정은 필요 없다.', answer: false, explanation: 'AWS 보안 그룹에서도 그 포트를 열어야 외부 접속이 돼요.' },
    { id: 'be-30-09', type: 'mcq', source: 'runserver.wsgi 예시', question: 'runserver.wsgi에서 Flask 앱을 mod_wsgi가 찾는 이름으로 가져오는 코드는?', choices: ['from runserver import app', 'from runserver import app as application', 'import application', 'app = Flask(application)'], answer: 1, explanation: 'mod_wsgi는 application이라는 이름을 찾아요.' },
    { id: 'be-30-10', type: 'mcq', source: '정리', question: '개발 중 다른 사람에게 잠깐 보여줄 때 적합한 방법은?', choices: ['AWS + Docker', 'ngrok', 'mod_wsgi', 'FileZilla'], answer: 1, explanation: '테스트는 ngrok, 실제 서비스는 AWS + 웹서버 + Docker.' },
  ],
}

export default topic

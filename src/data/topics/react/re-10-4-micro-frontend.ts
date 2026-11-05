import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-10-4-micro-frontend',
  track: 'react',
  group: '10. 프론트엔드 아키텍처',
  title: '10-4. Micro Frontend와 Module Federation',
  order: 1004,
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'Micro Frontend란',
      slides: [
        {
          title: '팀이 많아지면 배포가 막혀요',
          blocks: [
            { type: 'say', text: '10장 마지막 수업이에요. 큰 쇼핑몰을 생각해 볼게요. 상품 팀, 장바구니 팀, 결제 팀, 추천 팀이 있어요. 모두 **한 앱**에서 일하면 이런 일이 생겨요.\n• 장바구니 팀이 배포하려는데 결제 팀 코드에 버그가 있어서 **같이 못 나감**\n• 앱이 거대해서 빌드에 30분\n• 한 팀이 React를 올리려면 **모든 팀이 동시에** 맞춰야 함' },
            { type: 'say', text: '**Micro Frontend(MFE)** 는 백엔드의 마이크로서비스처럼 프론트엔드를 **팀·기능 단위의 작은 앱으로 쪼개서, 각자 따로 개발하고 따로 배포**한 뒤, 사용자 브라우저에서 **하나의 화면으로 조립**하는 방식이에요.' },
            { type: 'note', tone: 'analogy', text: '백화점이에요. 건물(셸 앱)은 하나지만 매장(MFE)마다 주인이 달라요. 신발 매장이 인테리어를 바꿔도 화장품 매장은 문을 닫을 필요가 없죠. 손님은 그냥 한 백화점에서 쇼핑해요.' },
          ],
        },
        {
          title: '모노레포와 뭐가 달라요',
          blocks: [
            {
              type: 'table',
              head: ['', '모노레포 (10-2)', 'Micro Frontend'],
              rows: [
                ['나누는 것', '**코드 저장 위치** (한 저장소)', '**배포 단위** (따로 배포)'],
                ['결과물', '앱마다 하나의 번들', '여러 팀의 번들을 **실행 중에** 조립'],
                ['공용 Button을 고치면', '한 커밋으로 반영, 각 앱 다시 빌드', '각 MFE가 자기 일정대로'],
                ['같이 쓸 수 있나', '네. MFE들을 모노레포에 두는 경우도 많음', ''],
              ],
            },
            { type: 'say', text: '둘은 서로 다른 문제를 풀어요. 모노레포는 "**코드 공유**", MFE는 "**독립 배포**". 그래서 한 회사에서 둘을 같이 쓰기도 해요.' },
          ],
        },
      ],
    },
    {
      title: 'Module Federation',
      slides: [
        {
          title: '다른 앱의 컴포넌트를 실행 중에 가져오기',
          blocks: [
            { type: 'say', text: '그럼 따로 배포된 앱들을 어떻게 한 화면에 합칠까요? 가장 대표적인 기술이 **Module Federation(MF)** 이에요. webpack 5에서 처음 나왔고, 지금은 Module Federation 2.0으로 발전해서 webpack·Rspack·Vite 모두에서 쓸 수 있어요.\n\n핵심 아이디어: **다른 서버에 배포된 앱의 모듈을, 실행 중에 import 해 온다.**' },
            {
              type: 'table',
              head: ['역할', '뜻', '쇼핑몰 예'],
              rows: [
                ['**remote**', '자기 모듈을 **내보내는** 앱', '장바구니 팀의 앱 (CartWidget을 내보냄)'],
                ['**host**', '다른 앱의 모듈을 **가져와 쓰는** 앱 (셸)', '메인 쇼핑몰 앱'],
                ['**exposes**', 'remote가 공개하는 모듈 목록 (10-1의 공개 출입구)', "`'./CartWidget'`"],
                ['**shared**', '여러 앱이 **한 벌만** 같이 쓸 라이브러리', 'react, react-dom'],
              ],
            },
          ],
        },
        {
          title: '설정과 사용',
          blocks: [
            {
              type: 'code',
              code: `// 장바구니 팀 (remote) — 설정
new ModuleFederationPlugin({
  name: 'cart',
  filename: 'remoteEntry.js',                         // 다른 앱이 읽어 갈 "목록표" 파일
  exposes: { './CartWidget': './src/CartWidget.tsx' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// 메인 쇼핑몰 (host) — 설정
new ModuleFederationPlugin({
  name: 'shell',
  remotes: { cart: 'cart@https://cart.mall.com/remoteEntry.js' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// 메인 쇼핑몰 코드에서 — 5-2의 lazy와 똑같이
const CartWidget = lazy(() => import('cart/CartWidget'));
<Suspense fallback={<p>장바구니 불러오는 중...</p>}><CartWidget /></Suspense>`,
            },
            { type: 'say', text: '`import(\'cart/CartWidget\')`는 내 번들에 없는 모듈이에요. 실행 중에 `cart.mall.com/remoteEntry.js`를 받아서 CartWidget 코드를 가져와요. 장바구니 팀이 CartWidget을 고쳐서 **자기 서버에만 다시 배포하면**, 메인 쇼핑몰은 다시 빌드하지 않아도 다음 방문부터 새 버전을 보여 줘요. 이게 **독립 배포**예요.' },
          ],
        },
      ],
    },
    {
      title: 'shared와 singleton',
      slides: [
        {
          title: 'React가 두 벌이면 안 돼요',
          blocks: [
            { type: 'ask', q: 'shared 설정 없이 메인 앱과 장바구니 앱이 각자 React를 번들에 넣으면 어떤 일이 생길까요?', a: '① 같은 React를 **두 번 다운로드**해서 느려지고 ② 더 심각하게는, 화면에 **React가 두 벌** 돌아가게 돼요. 그러면 훅이 "Invalid hook call" 에러를 내거나, 메인 앱의 Context(4-5)를 장바구니 위젯이 못 읽어요. 서로 다른 React 인스턴스는 서로를 모르거든요.' },
            { type: 'say', text: '그래서 react·react-dom은 `shared`에 넣고 **`singleton: true`**(한 벌만)로 둬요. 먼저 로드된 앱의 React를 다른 앱이 같이 써요. 이 때문에 **팀들이 React 메이저 버전은 맞춰야** 해요. 완전한 독립은 아닌 거죠.' },
          ],
        },
      ],
    },
    {
      title: 'MFE의 비용과 언제 쓸까',
      slides: [
        {
          title: '공짜가 아니에요',
          blocks: [
            {
              type: 'table',
              head: ['비용', '설명'],
              rows: [
                ['**복잡도**', '앱 여러 개의 배포·버전·로딩 순서를 관리해야 함'],
                ['**성능**', '실행 중에 여러 remoteEntry와 청크를 받음. 잘못하면 첫 화면이 느려짐'],
                ['**일관성**', '팀마다 버튼 모양·로딩 표시가 달라지기 쉬움 → 공용 디자인 시스템 필수'],
                ['**런타임 에러**', 'remote가 배포 중 깨지면 host 화면 일부가 터짐 → 에러 바운더리(6-3 error.tsx)로 감싸기'],
                ['**공유 상태**', '앱끼리 상태를 어떻게 주고받을지 약속 필요 (URL, 이벤트, 작은 공용 스토어)'],
              ],
            },
            { type: 'note', tone: 'warn', text: 'remote 위젯은 언제든 실패할 수 있는 **외부 부품**이라고 생각하세요. Suspense로 로딩을, 에러 바운더리로 실패를 감싸서 "장바구니만 안 보이고 나머지 쇼핑몰은 정상"이 되게 해요.' },
          ],
        },
        {
          title: '이럴 때만 써요',
          blocks: [
            { type: 'say', text: 'MFE는 **기술 문제가 아니라 조직 문제**를 푸는 도구예요.' },
            {
              type: 'table',
              head: ['MFE가 맞는 경우', 'MFE가 과한 경우'],
              rows: [
                ['독립적으로 배포해야 하는 팀이 여럿 (5개 이상 등)', '팀이 하나 또는 둘'],
                ['오래된 앱을 **조금씩** 새 기술로 교체 (일부 화면만 새 React 앱으로)', '새로 시작하는 서비스'],
                ['기능 영역마다 배포 주기가 크게 다름', '모두 같은 주기로 배포'],
              ],
            },
            { type: 'say', text: '10-1의 결론과 같아요. **"규모에 맞는 만큼만."** 작은 팀이 MFE를 하면 얻는 것보다 복잡도가 훨씬 커요. 면접에서 "MFE를 언제 쓰면 안 되는지"까지 말하면 진짜 해 본 사람처럼 들려요.\n\n10장 끝! 다음 11장은 웹 접근성·테스트·성능이에요. 마지막 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're10-4-q1',
      source: 'Micro Frontend란',
      type: 'mcq',
      question: 'Micro Frontend가 주로 해결하려는 문제는?',
      choices: ['CSS 이름 충돌', '여러 팀이 한 앱에 묶여 서로 배포를 막는 문제 (독립 배포)', '타입 에러', 'SEO'],
      answer: 1,
      explanation: '팀·기능 단위로 앱을 나눠 따로 개발·배포하고 브라우저에서 조립해요.',
    },
    {
      id: 're10-4-q2',
      source: 'Micro Frontend란',
      type: 'ox',
      question: '모노레포를 쓰면 자동으로 Micro Frontend가 된다.',
      answer: false,
      explanation: '모노레포는 코드 저장 위치, MFE는 배포 단위를 나누는 거예요. 서로 다른 문제를 풀고, 같이 쓸 수도 있어요.',
    },
    {
      id: 're10-4-q3',
      source: 'Module Federation',
      type: 'mcq',
      question: 'Module Federation에서 자기 모듈을 다른 앱에 내보내는 앱을 부르는 말은?',
      choices: ['host', 'remote', 'shell', 'shared'],
      answer: 1,
      explanation: 'remote가 exposes로 모듈을 내보내고, host가 remotes 설정으로 가져와 써요.',
    },
    {
      id: 're10-4-q4',
      source: 'Module Federation',
      type: 'mcq',
      question: '장바구니 팀이 CartWidget을 고쳐 자기 서버에만 다시 배포했다. 메인 쇼핑몰(host)은?',
      choices: ['다시 빌드해야 새 버전이 보인다', '다시 빌드하지 않아도 실행 중에 remoteEntry를 받아 새 버전을 쓴다', '영원히 옛 버전을 쓴다', '에러가 난다'],
      answer: 1,
      explanation: '모듈을 실행 중에 가져오기 때문에 독립 배포가 가능해요.',
    },
    {
      id: 're10-4-q5',
      source: 'shared와 singleton',
      type: 'mcq',
      question: "Module Federation에서 react를 shared에 singleton: true로 두는 이유는?",
      choices: ['번들 이름을 바꾸려고', 'React가 두 벌 실행되면 훅 에러나 Context 단절이 생기므로 한 벌만 같이 쓰려고', 'CSS를 공유하려고', '타입 검사를 위해'],
      answer: 1,
      explanation: '서로 다른 React 인스턴스는 서로를 몰라서 "Invalid hook call"이나 Context 문제가 생겨요.',
    },
    {
      id: 're10-4-q6',
      source: 'MFE의 비용과 언제 쓸까',
      type: 'ox',
      question: '팀이 두 명뿐인 새 서비스도 Micro Frontend로 시작하면 개발이 더 쉬워진다.',
      answer: false,
      explanation: 'MFE는 조직 문제를 푸는 도구라 작은 팀에는 복잡도만 늘어요. 규모에 맞는 만큼만 써요.',
    },
    {
      id: 're10-4-q7',
      source: 'MFE의 비용과 언제 쓸까',
      type: 'essay',
      question: '[면접] Micro Frontend(Module Federation)의 장단점과, 언제 도입하시겠는지 말해 주세요.',
      answer: 'Micro Frontend는 프론트엔드를 팀·기능 단위의 앱으로 나눠 독립적으로 개발·배포하고 실행 중에 조립하는 방식입니다. Module Federation은 remote가 exposes로 모듈을 공개하고 host가 실행 중에 remoteEntry를 받아 import 하게 해 주며, react 같은 라이브러리는 shared singleton으로 한 벌만 씁니다. 장점은 팀별 독립 배포와 점진적인 레거시 교체이고, 단점은 배포·버전 관리 복잡도, 런타임 로딩 비용, UI 일관성 유지, remote 장애 대응입니다. 그래서 독립 배포가 필요한 팀이 여럿이거나 오래된 앱을 조금씩 바꿀 때 도입하고, 작은 팀이나 새 서비스에는 기능별 폴더나 모노레포로 충분하다고 판단합니다.',
      keywords: ['독립 배포', 'remote/host/exposes', 'shared singleton', '복잡도·성능·일관성', '조직 규모', '에러 바운더리'],
      explanation: '정의 → MF 동작 → 장단점 → "언제 쓰지 않을지"까지 말하면 시니어다운 답이에요.',
    },
  ],
}

export default topic

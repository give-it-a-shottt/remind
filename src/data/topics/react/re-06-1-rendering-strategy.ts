import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-06-1-rendering-strategy',
  track: 'react',
  group: '06. 렌더링 전략과 Next.js',
  title: '6-1. 렌더링 전략: CSR·SSR·SSG·ISR',
  order: 601,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'HTML을 언제, 어디서 만들까',
      slides: [
        {
          title: '시니어 챕터에 온 걸 환영해요',
          blocks: [
            { type: 'say', text: '여기서부터는 **시니어가 되기 위한 챕터**예요. 채용 공고에 자주 나오는 "SSR, CSR에 대한 기본적인 이해", "Next.js 기반의 SSR/SSG 프로젝트 경험"을 이번 장에서 다뤄요.\n\n그리고 1~5장 끝마다 "Next.js에서는 무엇이 다른가"를 미뤄 뒀죠. 그걸 이번 장에서 한꺼번에 풀어요.' },
            { type: 'say', text: '렌더링 전략은 결국 한 가지 질문이에요.\n\n**"사용자가 보는 HTML을 언제, 어디서 만들까?"**\n\n• **어디서**: 브라우저에서? 서버에서?\n• **언제**: 빌드할 때 미리? 요청이 올 때마다?\n\n이 조합에 따라 이름이 CSR, SSR, SSG, ISR로 나뉘어요.' },
          ],
        },
        {
          title: '한눈에 보기',
          blocks: [
            {
              type: 'table',
              head: ['전략', 'HTML을 만드는 곳', '만드는 때', '한 줄'],
              rows: [
                ['**CSR** (Client-Side Rendering)', '브라우저', '페이지를 연 뒤 JS가 실행될 때', '빈 HTML + JS 묶음을 받아 브라우저가 그림'],
                ['**SSR** (Server-Side Rendering)', '서버', '**요청이 올 때마다**', '서버가 그때그때 완성된 HTML을 만들어 줌'],
                ['**SSG** (Static Site Generation)', '서버(빌드 머신)', '**빌드할 때 한 번**', '미리 만들어 둔 HTML 파일을 그대로 줌'],
                ['**ISR** (Incremental Static Regeneration)', '서버', '빌드 때 + **정해진 주기마다 다시**', 'SSG인데 가끔 새로 구워 줌'],
              ],
            },
            { type: 'note', tone: 'analogy', text: '빵집으로 비유해 볼게요.\n• **CSR**: 반죽과 레시피를 주고 손님이 집에서 굽게 함\n• **SSR**: 주문이 들어오면 그때 구워서 줌\n• **SSG**: 새벽에 미리 구워 진열대에 놓음\n• **ISR**: 미리 구워 두되, 1시간마다 새로 구워 교체함' },
          ],
        },
      ],
    },
    {
      title: 'CSR: 브라우저가 그린다',
      slides: [
        {
          title: '지금 이 앱이 CSR이에요',
          blocks: [
            { type: 'say', text: '1~5장에서 배운 Vite + React 앱이 바로 **CSR**이에요. 지금 보고 있는 이 앱(remind)도요. 브라우저에서 "페이지 소스 보기"를 하면 이렇게 생겼어요.' },
            {
              type: 'code',
              code: `<body>
  <div id="root"></div>           ← 텅 비어 있음
  <script type="module" src="/assets/index-xxxx.js"></script>
</body>`,
            },
            { type: 'list', ordered: true, items: ['브라우저가 거의 빈 HTML을 받음 → 하얀 화면', 'JS 파일을 내려받음', 'JS가 실행되면서 React가 `#root` 안에 화면을 그림 → 이제 보임'] },
          ],
        },
        {
          title: 'CSR의 장단점',
          blocks: [
            {
              type: 'table',
              head: ['장점', '단점'],
              rows: [
                ['서버가 HTML을 안 만들어도 됨 → **정적 호스팅**으로 싸고 쉽게 배포', 'JS를 다 받고 실행할 때까지 **첫 화면이 늦음** (하얀 화면)'],
                ['한 번 뜨고 나면 화면 전환이 빠름', '**검색 엔진**·SNS 미리보기가 내용을 못 볼 수 있음 (빈 HTML이라)'],
                ['서버 부담 적음', 'JS 묶음이 커질수록 느린 폰에서 더 느려짐'],
              ],
            },
            { type: 'ask', q: '이 복습 앱(remind)은 CSR로 충분할까요? 쇼핑몰 상품 페이지는요?', a: '**remind**는 로그인한 나만 쓰고, 검색에 노출될 필요가 없고, 한 번 열면 계속 쓰는 앱이라 CSR로 충분해요.\n**쇼핑몰 상품 페이지**는 검색에 잘 걸려야 하고, 링크를 공유했을 때 미리보기(상품 사진·가격)가 떠야 하고, 첫 화면이 빨라야 사는 사람이 안 떠나요. 그래서 서버에서 HTML을 만드는 전략이 필요해요.' },
          ],
        },
      ],
    },
    {
      title: 'SSR: 요청마다 서버가 그린다',
      slides: [
        {
          title: '완성된 HTML이 먼저 와요',
          blocks: [
            { type: 'say', text: '**SSR**은 요청이 오면 서버가 React 컴포넌트를 실행해서 **내용이 다 들어 있는 HTML**을 만들어 보내요.' },
            {
              type: 'code',
              code: `<body>
  <div id="root">
    <h1>React 완벽 가이드</h1>       ← 이미 내용이 들어 있음
    <p>39,000원</p>
    <button>장바구니 담기</button>
  </div>
  <script src="/assets/page-xxxx.js"></script>
</body>`,
            },
            { type: 'say', text: '브라우저는 받자마자 화면을 보여 줄 수 있어요. 검색 엔진도 내용을 바로 읽고요. 그다음 JS가 도착하면 버튼에 클릭 기능을 연결해요. 이 "연결하는" 과정이 다음 수업의 **하이드레이션**이에요.' },
          ],
        },
        {
          title: 'SSR의 장단점',
          blocks: [
            {
              type: 'table',
              head: ['장점', '단점'],
              rows: [
                ['**첫 화면이 빠름** (내용이 든 HTML)', '요청마다 서버가 일함 → **서버 비용**, 트래픽 몰리면 느려짐'],
                ['**SEO**에 좋음, SNS 미리보기 잘 뜸', '서버가 HTML을 다 만들 때까지 첫 바이트가 늦어질 수 있음 (TTFB)'],
                ['로그인 사용자별 내용처럼 **요청마다 다른 화면**에 맞음', '서버가 꼭 있어야 함 (정적 호스팅 불가)'],
              ],
            },
            { type: 'note', tone: 'warn', text: '"SSR이면 다 빠르다"는 오해예요. HTML은 빨리 보여도 **JS가 도착해서 하이드레이션되기 전에는 버튼이 안 눌려요.** 보이는데 안 눌리는 시간이 생기는 거예요. 이걸 줄이는 게 서버 컴포넌트(6-4)의 큰 목적 중 하나예요.' },
          ],
        },
      ],
    },
    {
      title: 'SSG와 ISR: 미리 구워 두기',
      slides: [
        {
          title: 'SSG: 빌드할 때 한 번',
          blocks: [
            { type: 'say', text: '회사 소개, 블로그 글, 문서 페이지는 **모든 사람에게 똑같고 자주 안 바뀌어요.** 요청마다 서버가 다시 만들 이유가 없죠. 그래서 **빌드할 때 HTML 파일로 미리 만들어 두는** 게 **SSG**예요.' },
            { type: 'list', items: ['장점: CDN에 파일로 올려 두니 **가장 빠르고 가장 싸요.** 서버가 일할 게 없어요', '단점: 내용이 바뀌면 **다시 빌드**해야 해요. 글이 1만 개면 빌드도 오래 걸리고요'] },
          ],
        },
        {
          title: 'ISR: 미리 굽되 가끔 새로',
          blocks: [
            { type: 'say', text: '상품 목록처럼 "거의 똑같지만 가끔 바뀌는" 페이지는요? 가격이 바뀔 때마다 전체 빌드를 하긴 싫잖아요. 그래서 나온 게 **ISR**이에요.' },
            { type: 'list', ordered: true, items: ['처음엔 SSG처럼 미리 만든 HTML을 줌 (빠름)', '정해 둔 시간(예: 1시간)이 지나면 다음 요청이 왔을 때 **일단 예전 HTML을 주고**', '뒤에서 몰래 새 HTML을 만들어 교체', '그다음 사람부터는 새 HTML을 받음'] },
            { type: 'note', tone: 'tip', text: '"일단 예전 걸 주고 뒤에서 새로 만든다"를 **stale-while-revalidate**라고 불러요. 7장 TanStack Query에서도 똑같은 개념이 나와요. 시니어가 자주 쓰는 단어니까 기억해 두세요.' },
          ],
        },
      ],
    },
    {
      title: '어떤 전략을 고를까',
      slides: [
        {
          title: '페이지마다 다르게 골라요',
          blocks: [
            { type: 'say', text: '중요한 사실: 요즘은 **앱 전체를 하나의 전략으로 고르지 않아요.** Next.js에서는 **페이지마다, 심지어 한 페이지 안의 부분마다** 다르게 고를 수 있어요.' },
            {
              type: 'table',
              head: ['페이지', '추천', '이유'],
              rows: [
                ['회사 소개, 이용약관', 'SSG', '모두에게 같고 거의 안 바뀜'],
                ['블로그 글, 강의 소개', 'SSG / ISR', '모두에게 같고 가끔 수정됨, SEO 중요'],
                ['상품 목록·상세', 'ISR', '자주는 아니지만 가격·재고가 바뀜, SEO 중요'],
                ['내 주문 내역, 마이페이지', 'SSR (또는 CSR)', '사람마다 다름, SEO 불필요'],
                ['관리자 대시보드, 이 복습 앱', 'CSR', '로그인 뒤에서만 쓰고 SEO 불필요'],
              ],
            },
          ],
        },
        {
          title: '한 페이지 안에서 섞기 (PPR)',
          blocks: [
            { type: 'say', text: '상품 상세 페이지를 보면, 상품 정보는 모두에게 같지만 "내 장바구니 개수"는 사람마다 달라요. 예전엔 페이지 전체를 정적이냐 동적이냐 **하나만** 골라야 했어요.' },
            { type: 'say', text: 'Next.js 16의 기본 방식은 **Partial Prerendering(PPR, 부분 사전 렌더링)** 이에요.\n• 모두에게 같은 부분은 미리 만들어 둔 **정적 껍데기(static shell)** 로 즉시 보내고\n• 사람마다 다른 부분은 그 자리에 **로딩 화면**을 두었다가 요청 때 만들어서 **흘려보내요(스트리밍)**\n\n한 페이지에 SSG와 SSR이 섞인 거예요. 6-5에서 코드로 직접 볼게요.' },
            { type: 'say', text: '첫 시니어 수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're06-1-q1',
      source: 'HTML을 언제, 어디서 만들까',
      type: 'mcq',
      question: '요청이 올 때마다 서버가 완성된 HTML을 만들어 주는 렌더링 전략은?',
      choices: ['CSR', 'SSR', 'SSG', 'ISR'],
      answer: 1,
      explanation: 'SSR은 요청마다 서버에서, SSG는 빌드 때 한 번, ISR은 빌드 때 + 주기적으로 다시, CSR은 브라우저에서 HTML을 만들어요.',
    },
    {
      id: 're06-1-q2',
      source: 'CSR: 브라우저가 그린다',
      type: 'mcq',
      question: 'Vite로 만든 CSR 앱의 "페이지 소스 보기"에서 보이는 것은?',
      choices: ['모든 내용이 들어 있는 HTML', '거의 빈 <div id="root"></div> 와 JS 파일 링크', 'PHP 코드', '서버 컴포넌트 코드'],
      answer: 1,
      explanation: 'CSR은 빈 HTML을 받고, JS가 실행된 뒤에야 React가 #root 안에 화면을 그려요. 그래서 검색 엔진·첫 화면에 불리해요.',
    },
    {
      id: 're06-1-q3',
      source: 'CSR: 브라우저가 그린다',
      type: 'ox',
      question: '로그인 뒤에서만 쓰고 검색 노출이 필요 없는 관리자 대시보드는 CSR로도 충분하다.',
      answer: true,
      explanation: 'SEO가 필요 없고 한 번 열면 오래 쓰는 앱은 CSR의 단점이 크지 않아요. 정적 호스팅으로 싸게 배포할 수 있어요.',
    },
    {
      id: 're06-1-q4',
      source: 'SSR: 요청마다 서버가 그린다',
      type: 'ox',
      question: 'SSR 페이지는 HTML이 도착하는 순간 모든 버튼이 바로 클릭된다.',
      answer: false,
      explanation: 'HTML은 바로 보이지만, JS가 도착해서 하이드레이션되기 전에는 버튼에 클릭 기능이 연결되지 않아요.',
    },
    {
      id: 're06-1-q5',
      source: 'SSR: 요청마다 서버가 그린다',
      type: 'mcq',
      question: 'SSR의 단점으로 가장 알맞은 것은?',
      choices: ['검색 엔진이 내용을 못 읽는다', '요청마다 서버가 HTML을 만들어서 서버 비용·부하가 생긴다', '첫 화면이 항상 하얗다', 'React를 쓸 수 없다'],
      answer: 1,
      explanation: 'SSR은 SEO와 첫 화면에 좋지만, 요청마다 서버가 일해야 해서 비용과 부하가 생겨요.',
    },
    {
      id: 're06-1-q6',
      source: 'SSG와 ISR: 미리 구워 두기',
      type: 'mcq',
      question: '"미리 만든 HTML을 주다가, 정해 둔 시간이 지나면 일단 예전 걸 주고 뒤에서 새로 만들어 교체"하는 전략은?',
      choices: ['CSR', 'SSR', 'SSG', 'ISR'],
      answer: 3,
      explanation: 'ISR이에요. "일단 예전 걸 주고 뒤에서 새로"를 stale-while-revalidate라고 불러요.',
    },
    {
      id: 're06-1-q7',
      source: 'SSG와 ISR: 미리 구워 두기',
      type: 'short',
      question: '"일단 오래된 데이터를 보여 주고 뒤에서 새로 가져와 교체한다"는 캐시 방식을 영어로? (stale-while-______)',
      answer: ['revalidate', 'stale-while-revalidate', 'SWR'],
      explanation: 'ISR, Next.js 캐시, TanStack Query에서 공통으로 쓰는 개념이에요.',
    },
    {
      id: 're06-1-q8',
      source: '어떤 전략을 고를까',
      type: 'mcq',
      question: '쇼핑몰 상품 상세 페이지(검색 노출 중요, 가격이 가끔 바뀜)에 가장 알맞은 전략은?',
      choices: ['CSR', 'ISR (또는 SSR)', '모든 사용자에게 빈 HTML', 'HashRouter'],
      answer: 1,
      explanation: 'SEO가 중요하니 서버에서 HTML을 만들어야 하고, 가끔 바뀌니 주기적으로 새로 만드는 ISR이 잘 맞아요.',
    },
    {
      id: 're06-1-q9',
      source: '어떤 전략을 고를까',
      type: 'essay',
      question: '[면접] CSR과 SSR의 차이를 설명하고, 각각 어떤 페이지에 어울리는지 말해 주세요.',
      answer: 'CSR은 브라우저가 빈 HTML과 JS를 받아 JS 실행 후 화면을 그리는 방식이라, 정적 호스팅으로 배포가 쉽고 이후 화면 전환이 빠르지만 첫 화면이 늦고 검색 엔진이 내용을 읽기 어렵습니다. SSR은 요청마다 서버가 완성된 HTML을 만들어 보내므로 첫 화면과 SEO에 유리하지만 서버 비용이 들고, JS가 도착해 하이드레이션되기 전까지는 상호작용이 안 됩니다. 그래서 관리자 화면처럼 로그인 뒤에서 쓰는 앱은 CSR, 상품·블로그처럼 검색과 첫 화면이 중요한 페이지는 SSR이나 SSG·ISR을 고르고, Next.js에서는 페이지나 컴포넌트 단위로 섞어 씁니다.',
      keywords: ['HTML을 만드는 곳과 때', '첫 화면', 'SEO', '서버 비용', '하이드레이션', '페이지별 선택'],
      explanation: '"어디서·언제 HTML을 만드나"로 정의하고, 장단점과 어울리는 페이지 예시까지 말하면 좋아요.',
    },
  ],
}

export default topic

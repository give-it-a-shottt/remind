import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-11-4-web-vitals',
  track: 'react',
  group: '11. 품질: 접근성·테스트·성능',
  title: '11-4. 성능과 Core Web Vitals',
  order: 1104,
  addedAt: '2026-11-06',
  sections: [
    {
      title: 'Core Web Vitals 세 가지',
      slides: [
        {
          title: '"빠르다"를 숫자로',
          blocks: [
            { type: 'say', text: '"사이트가 느려요"는 너무 막연하죠. 구글은 사용자가 느끼는 속도를 **세 가지 숫자**로 정했어요. 이걸 **Core Web Vitals**라고 하고, 검색 순위에도 반영돼요.' },
            {
              type: 'table',
              head: ['지표', '질문', '좋음 기준'],
              rows: [
                ['**LCP** (Largest Contentful Paint)', '가장 큰 내용(대표 이미지, 큰 제목)이 **언제 보이나?**', '**2.5초** 이내'],
                ['**INP** (Interaction to Next Paint)', '클릭·입력하면 화면이 **얼마나 빨리 반응하나?**', '**200ms** 이하'],
                ['**CLS** (Cumulative Layout Shift)', '보는 도중 화면이 **얼마나 덜컹거리나?**', '**0.1** 이하'],
              ],
            },
            { type: 'note', tone: 'tip', text: '예전 자료에는 **FID**(첫 입력 지연)가 나오는데, 2024년에 **INP**로 바뀌었어요. FID는 첫 클릭 한 번만 봤지만, INP는 페이지를 쓰는 동안의 **모든 상호작용**을 봐서 더 정확해요.' },
          ],
        },
      ],
    },
    {
      title: 'LCP: 큰 내용이 늦게 떠요',
      slides: [
        {
          title: '원인과 해결',
          blocks: [
            { type: 'say', text: '쇼핑몰 첫 화면의 큰 배너 이미지가 4초 뒤에야 떠요. LCP가 나쁜 거예요.' },
            {
              type: 'table',
              head: ['원인', '해결'],
              rows: [
                ['이미지가 너무 큼 (원본 4MB)', '알맞은 크기·형식(WebP, AVIF)으로, `srcset`으로 화면 크기별 이미지'],
                ['큰 이미지를 늦게 발견', '첫 화면의 대표 이미지는 `fetchpriority="high"`, **lazy 로딩하지 않기**'],
                ['JS가 실행돼야 내용이 그려짐 (CSR)', 'SSR·SSG로 HTML에 내용을 담기 (6-1)'],
                ['서버 응답이 느림', '캐시(6-5), CDN'],
                ['폰트 로딩 대기', '`font-display: swap`, 필요한 글자만 (서브셋)'],
              ],
            },
            { type: 'note', tone: 'warn', text: '흔한 실수: 성능을 위해 **모든** 이미지에 `loading="lazy"`를 붙이는 것. 첫 화면의 대표 이미지까지 lazy면 브라우저가 늦게 받아서 LCP가 **더 나빠져요.** lazy는 스크롤해야 보이는 이미지에만. Next.js의 `next/image`는 크기 최적화와 `priority` 옵션을 제공해요.' },
          ],
        },
      ],
    },
    {
      title: 'INP: 눌렀는데 반응이 늦어요',
      slides: [
        {
          title: '메인 스레드가 막혀 있으면',
          blocks: [
            { type: 'say', text: '브라우저는 JS 실행, 화면 그리기, 클릭 처리를 **한 줄(메인 스레드)** 에서 차례로 해요. 무거운 JS가 200ms 동안 돌고 있으면, 그 사이에 누른 버튼은 **기다려야** 해요. 이렇게 50ms 넘게 메인 스레드를 잡는 작업을 **긴 작업(long task)** 이라고 해요.' },
            {
              type: 'table',
              head: ['원인', '해결'],
              rows: [
                ['한 번에 너무 많이 다시 렌더링', '2-5·4-4: memo, 상태를 가까이 두기(3-1), React Compiler'],
                ['긴 목록 수천 개를 한꺼번에 그림', '**가상화**(보이는 부분만 그리기: TanStack Virtual 등), 페이지네이션'],
                ['입력할 때마다 무거운 필터링', '`useDeferredValue`, `useTransition`으로 급한 업데이트(글자 입력)를 먼저'],
                ['JS 번들이 너무 큼', '9-3: 코드 스플리팅, 하이드레이션 줄이기(6-4 서버 컴포넌트)'],
              ],
            },
          ],
        },
        {
          title: 'useTransition 맛보기',
          blocks: [
            {
              type: 'code',
              code: `const [query, setQuery] = useState('');
const [filter, setFilter] = useState('');
const [isPending, startTransition] = useTransition();

<input
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);                      // 급함: 입력칸은 바로 반영
    startTransition(() => setFilter(e.target.value)); // 덜 급함: 무거운 목록 필터링은 뒤로
  }}
/>
{isPending && <Spinner />}
<HugeList filter={filter} />`,
            },
            { type: 'say', text: '`startTransition` 안의 업데이트는 "**덜 급한 일**"로 표시돼요. React는 글자 입력처럼 급한 일을 먼저 처리하고, 무거운 목록은 그 뒤에 그려요. 그사이 또 입력이 오면 하던 무거운 작업을 버리고 새로 시작해요. 그래서 입력이 버벅이지 않아요.' },
          ],
        },
      ],
    },
    {
      title: 'CLS: 화면이 덜컹거려요',
      slides: [
        {
          title: '누르려는 순간 버튼이 밀려나요',
          blocks: [
            { type: 'say', text: '기사를 읽는데 갑자기 광고가 위에 끼어들어 글이 아래로 밀려나요. "확인"을 누르려는데 배너가 뜨면서 "취소"를 눌러 버려요. 이게 **레이아웃 이동(layout shift)** 이고, 쌓인 양이 CLS예요.' },
            {
              type: 'table',
              head: ['원인', '해결'],
              rows: [
                ['크기 없는 이미지·영상', '`width`, `height` 또는 CSS `aspect-ratio`로 **자리를 미리** 잡기'],
                ['나중에 끼어드는 배너·광고', '들어올 자리를 미리 비워 두기 (min-height)'],
                ['데이터가 오면 갑자기 커지는 영역', '로딩 중에도 같은 크기의 **스켈레톤**을 보여 주기'],
                ['웹폰트로 바뀌며 글자 폭이 달라짐', '비슷한 크기의 대체 폰트, `size-adjust`'],
              ],
            },
            { type: 'ask', q: '6-2에서 배운 하이드레이션 불일치나 persist 스토어(7-5) 처리가 CLS와 어떤 관계가 있을까요?', a: '서버 HTML에는 "장바구니 0"이 있다가 하이드레이션 뒤 "장바구니 3"과 쿠폰 배너가 끼어들면 화면이 밀려요. 브라우저 전용 값을 나중에 넣을 때도 **그 자리의 크기는 처음부터 같게** 잡아 둬야 덜컹거리지 않아요.' },
          ],
        },
      ],
    },
    {
      title: '측정하기',
      slides: [
        {
          title: '실험실 숫자와 실제 사용자 숫자',
          blocks: [
            {
              type: 'table',
              head: ['', '실험실 (lab)', '현장 (field)'],
              rows: [
                ['도구', 'Lighthouse, 크롬 Performance 탭', '`web-vitals` 라이브러리로 실제 사용자 측정, 구글 CrUX 리포트'],
                ['장점', '같은 조건에서 반복 측정, 원인 찾기 쉬움', '**진짜 사용자**의 기기·네트워크'],
                ['단점', '내 빠른 컴퓨터 기준이라 현실보다 좋게 나오기 쉬움', '원인까지는 안 알려 줌'],
              ],
            },
            { type: 'code', code: `import { onCLS, onINP, onLCP } from 'web-vitals';

onLCP((m) => sendToAnalytics(m));   // 실제 사용자의 LCP를 서버로 보내 모으기
onINP((m) => sendToAnalytics(m));
onCLS((m) => sendToAnalytics(m));` },
          ],
        },
        {
          title: '시니어의 성능 개선 순서',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**측정**: 현장 데이터에서 어느 페이지의 어느 지표가 나쁜지',
                '**원인 찾기**: Lighthouse, Performance 탭, React DevTools Profiler(어떤 컴포넌트가 오래 렌더링되나), 번들 분석(9-3)',
                '**하나만 고치기**: 이미지 우선순위, 청크 나누기, memo 등',
                '**다시 측정**해서 숫자로 확인',
                '**기록**: "상품 상세 LCP 3.8초 → 1.9초 (대표 이미지 fetchpriority + WebP)"',
              ],
            },
            { type: 'say', text: '9-3, 10-3에서도 계속 나온 순서죠? **측정 없이 최적화하지 않기.** 이게 시니어와 주니어를 가르는 가장 큰 습관이에요. 감으로 memo를 도배하는 대신, 숫자를 보고 가장 아픈 곳 하나를 고쳐요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're11-4-q1',
      source: 'Core Web Vitals 세 가지',
      type: 'mcq',
      question: '클릭·입력 후 화면이 얼마나 빨리 반응하는지를 나타내는 Core Web Vital은?',
      choices: ['LCP', 'INP', 'CLS', 'TTFB'],
      answer: 1,
      explanation: 'INP(좋음 200ms 이하)예요. 2024년에 FID를 대체했어요. LCP는 큰 내용 표시, CLS는 레이아웃 이동이에요.',
    },
    {
      id: 're11-4-q2',
      source: 'Core Web Vitals 세 가지',
      type: 'short',
      question: 'LCP의 "좋음" 기준은 몇 초 이내일까? (숫자만)',
      answer: ['2.5', '2.5초'],
      explanation: 'LCP 2.5초, INP 200ms, CLS 0.1이 좋음 기준이에요.',
    },
    {
      id: 're11-4-q3',
      source: 'LCP: 큰 내용이 늦게 떠요',
      type: 'ox',
      question: '성능을 위해 첫 화면의 대표 배너 이미지에도 loading="lazy"를 붙이는 것이 좋다.',
      answer: false,
      explanation: '첫 화면 대표 이미지를 lazy로 하면 늦게 받아서 LCP가 나빠져요. lazy는 스크롤해야 보이는 이미지에만 써요.',
    },
    {
      id: 're11-4-q4',
      source: 'INP: 눌렀는데 반응이 늦어요',
      type: 'mcq',
      question: '검색어를 칠 때마다 수천 개 목록을 필터링해서 입력이 버벅인다. React에서 쓸 수 있는 해결은?',
      choices: ['useEffect로 옮긴다', 'useTransition으로 무거운 필터 업데이트를 덜 급한 일로 표시한다', '모든 컴포넌트에 use client', 'CSS 애니메이션 추가'],
      answer: 1,
      explanation: '급한 입력 반영을 먼저 하고 무거운 렌더링은 뒤로 미뤄요. 목록이 아주 길면 가상화도 함께 써요.',
    },
    {
      id: 're11-4-q5',
      source: 'CLS: 화면이 덜컹거려요',
      type: 'mcq',
      question: '이미지가 로드되면서 아래 글이 밀려나는 레이아웃 이동을 막는 방법은?',
      choices: ['이미지를 지운다', 'width·height나 aspect-ratio로 이미지 자리를 미리 잡는다', 'z-index를 높인다', 'lazy를 붙인다'],
      answer: 1,
      explanation: '크기를 미리 알려 주면 브라우저가 자리를 비워 두고 그려요.',
    },
    {
      id: 're11-4-q6',
      source: '측정하기',
      type: 'ox',
      question: '내 컴퓨터의 Lighthouse 점수만 좋으면 실제 사용자도 빠르게 느낀다고 볼 수 있다.',
      answer: false,
      explanation: 'Lighthouse는 실험실 숫자예요. 실제 사용자의 기기·네트워크는 web-vitals 같은 현장 측정으로 봐야 해요.',
    },
    {
      id: 're11-4-q7',
      source: '측정하기',
      type: 'essay',
      question: '[면접] 웹 성능을 어떻게 측정하고 개선하시나요?',
      answer: 'Core Web Vitals인 LCP, INP, CLS를 기준으로, 먼저 web-vitals나 CrUX 같은 현장 데이터로 어느 페이지의 어느 지표가 나쁜지 찾습니다. 그다음 Lighthouse, Performance 탭, React Profiler, 번들 분석으로 원인을 좁힙니다. LCP는 대표 이미지 크기·우선순위와 SSR·캐시로, INP는 긴 작업을 줄이는 코드 스플리팅·memo·가상화·useTransition으로, CLS는 이미지와 동적 영역의 자리를 미리 잡는 방식으로 개선합니다. 한 번에 하나씩 고치고 다시 측정해서 전후 숫자로 효과를 확인하고 기록합니다.',
      keywords: ['LCP·INP·CLS', '현장 vs 실험실', '원인 분석 도구', '지표별 해결책', '전후 숫자'],
      explanation: '"측정 → 원인 → 하나씩 개선 → 다시 측정"의 순서와 지표별 해결책을 말하면 좋아요.',
    },
  ],
}

export default topic

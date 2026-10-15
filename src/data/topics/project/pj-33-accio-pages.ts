import type { Topic } from '../../types'

const topic: Topic = {
  id: 'pj-33-accio-pages',
  track: 'project',
  group: '프론트',
  title: '03-4. projects/accio ② 서브 페이지 (목록 · 상세 · 장바구니 · 고객센터)',
  order: 33,
  notionId: '3f2df951bf808183834de5dc0e872567',
  addedAt: '2026-10-15',
  sections: [
    {
      title: 'BrandSection · Footer · LoginPage',
      notionIds: ['3f2df951bf808158bdc2ef819998584f', '3f2df951bf8081b28f3dfb709d17e678', '3f2df951bf80817ba7dde102a275da96'],
      points: [
        'BrandSection: active 인덱스를 (prev + dir + n) % n 으로 순환, 칩은 aria-pressed. 바뀌는 건 배너 제목뿐(목업)',
        'justify-center-safe: 가운데 정렬이지만 넘치면 왼쪽부터 스크롤 (일반 center 는 왼쪽이 잘림)',
        'Footer: lg 미만 grid-cols-3(소개는 col-span-3), lg 이상 flex 한 줄. 시안 줄바꿈이 단어 중간이라 lg 에서만 block',
        'LoginPage: onSubmit 은 preventDefault 만 (인증 없음), autoComplete="email" / "current-password" 로 비밀번호 관리자가 알아봄',
        '카카오 로고는 스프라이트 이미지에서 말풍선만 잘라 보여줌 (overflow-hidden + 이미지 370%)',
        '로그인 화면은 공통 헤더가 없어 홈으로 돌아가는 링크가 없음',
      ],
    },
    {
      title: 'ListPage.tsx',
      notionIds: ['3f2df951bf8081c0b8d0c116b2ea0738'],
      code: `const toggleFilter = (key: string) => {
  setCheckedFilters((prev) => {
    const next = new Set(prev)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })
}`,
      points: [
        '상태 4개: checkedFilters(Set), sort, page, filtersOpen(모바일 필터 펼침)',
        '새 Set 을 만들어야 React 가 바뀜을 알아차림 (같은 객체를 고치면 리렌더 안 됨)',
        '필터 키 모양: `${group.title}:${option}` → "가격:3~6만원"',
        '체크박스: 진짜 input 은 peer sr-only 로 숨기고 디자인된 span 을 보여줌, 키보드 포커스는 peer-focus-visible: 로 표시',
        '정렬은 role="radiogroup" + role="radio" + aria-checked, "필터 N" 버튼은 aria-expanded + aria-controls',
        '그리드 2열 → sm 3열 → lg 4열. 필터·정렬을 바꿔도 상품은 그대로 → 실제 적용은 연습 과제 ③',
      ],
    },
    {
      title: 'DetailPage · ReviewSection',
      notionIds: ['3f2df951bf8081b5a17fec1df384e2b3', '3f2df951bf8081c09165da642b255423'],
      code: `const visible = items
  .filter((review) => filter !== '포토리뷰' || review.photos.length > 0)
  .sort((a, b) => (sort === '도움순' ? b.helpful - a.helpful : b.date.localeCompare(a.date)))`,
      points: [
        'DetailPage 상태 5개: imageIndex, color, quantity(1~99), wished, tab',
        '찜 수 = wishCount + (wished ? 1 : 0), 총액 = price × quantity — 파생 값',
        '− 버튼은 quantity <= 1 이면 disabled',
        '탭은 role=tablist/tab/tabpanel + aria-selected (WAI-ARIA 탭 패턴), 색상은 radiogroup, 수량은 <output>',
        '"장바구니"·"바로 구매"는 onClick 없음 — 페이지마다 자기 useState 만 있어 장바구니와 연결 안 됨',
        'ReviewSection: 날짜 "2026.09.15" 문자열을 localeCompare 로 정렬 → mock 은 YYYY.MM.DD 형식을 지켜야 함',
        '.sort() 는 원본을 바꾸지만 앞의 .filter() 가 새 배열을 만들어 안전. filter 없이 sort 하면 상수를 건드림 → toSorted() 가 더 안전',
        '평점 막대 폭 = count / total × 100%, 리뷰마다 helped 상태로 "도움돼요" +1',
      ],
    },
    {
      title: 'AiChatPage.tsx',
      notionIds: ['3f2df951bf8081ba9e3fd6d1936ce2e8'],
      points: [
        '내 질문 → ACCIO 답변 → "이렇게 이해했어요" 조건 칩 → 추천 4개 → 후속 질문 칩 → 하단 고정 입력창 (목업)',
        '후속 질문 칩은 setDraft(f) 로 입력창만 채움, 전송은 비우기만',
        '입력창 폼은 sticky bottom-4 → 스크롤해도 화면 아래에 붙어 있음',
        '전송 버튼 disabled={!draft.trim()} — 공백만 있으면 비활성',
        'AI 표시는 흔한 ✨ 아이콘 대신 ACCIO 워드마크로 — 일부러 피한 디자인 결정',
      ],
    },
    {
      title: 'CartPage.tsx',
      notionIds: ['3f2df951bf808183834de5dc0e872567'],
      code: `const selectedItems = items.filter((item) => selected.has(item.id))
const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

const setQuantity = (id, quantity) =>
  setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
const remove = (ids: string[]) => {
  setItems((prev) => prev.filter((item) => !ids.includes(item.id)))
  setSelected((prev) => new Set([...prev].filter((id) => !ids.includes(id))))
}`,
      points: [
        'Accio 에서 상태 로직이 가장 많은 화면: 상태는 items, selected(Set, 처음엔 전부 선택) 두 개뿐',
        'selectedItems·allSelected·listTotal·total·couponGap 은 모두 파생 값 — 매번 계산',
        '수량 변경은 map + 스프레드로 불변 업데이트, 삭제는 두 상태 모두 정리',
        'CartRow 는 상태 없이 onToggle/onQuantity/onRemove 콜백만 받음 → 상태 끌어올리기',
        '할인율도 저장하지 않고 Math.round((1 - price / listPrice) * 100)',
        '쿠폰 막대 폭 = Math.min(100, total / 120000 × 100)%, 선택 0개면 주문 버튼 disabled',
        'selected 를 Set 으로: has 확인이 빠르고 중복이 없음 (단, 바꿀 때마다 new Set)',
      ],
    },
    {
      title: 'MyPage · OrderTrackingPage',
      notionIds: ['3f2df951bf8081ba9c55c962a467393c', '3f2df951bf8081858733da1025c16641'],
      code: `const STATUS_ACTION: Record<OrderStatus, { label: string; href: string }> = {
  배송중: { label: '배송 조회', href: accioHref('/order') },
  배송완료: { label: '리뷰 쓰기', href: accioHref('/detail') },
  구매확정: { label: '재구매', href: accioHref('/detail') },
}`,
      points: [
        'MyPage 는 상태 없음 — 데이터를 보여주기만',
        'Record<OrderStatus, ...> 조회표: 상태 하나라도 빠뜨리면 TS 에러 → if/else 대신 lookup table 패턴',
        '상태 배지는 클릭 요소가 아니라 포인트 컬러 없이 무채색 단계로, "작성할 리뷰" 숫자만 주황(해야 할 일)',
        'gap-px bg-light 로 칸 사이 1px 틈을 구분선처럼',
        '운송장 복사: navigator.clipboard.writeText → 2초간 "복사했어요", 권한이 없으면 번호가 화면에 있으니 따로 안 알림',
        '배송지 변경 버튼은 disabled + aria-describedby 로 "배송이 시작되면 바꿀 수 없어요" 설명 연결',
        '복사 setTimeout 에 정리가 없어 2초 안에 떠나면 언마운트된 컴포넌트에 setState (무해하지만 useRef + cleanup 이 더 깔끔)',
      ],
    },
    {
      title: 'SupportPage.tsx',
      notionIds: ['3f2df951bf8081b29dbfd413fe059f34'],
      code: `const send = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return
  setMessages((prev) => [...prev,
    { from: 'user', text: trimmed },
    { from: 'bot', text: chat.replies[trimmed] ?? chat.fallbackReply },
  ])
  setDraft('')
}`,
      points: [
        'FAQ 아코디언: openFaq 숫자 하나 → 한 번에 하나만 열림(처음엔 0번). aria-expanded + aria-controls + role="region" hidden',
        '채팅: 내 말풍선과 봇 말풍선을 한 번에 추가, 빠른답변은 replies 표에서 정해진 답, 없으면 fallbackReply',
        'useEffect([messages]) 로 새 메시지가 붙으면 listRef 를 scrollHeight 까지 스크롤',
        '말풍선 목록 aria-live="polite" → 새 메시지를 스크린리더가 읽음',
        '말풍선 key 가 배열 index — 뒤에 추가만 하니 괜찮지만 중간 삭제가 생기면 id 가 필요',
      ],
    },
  ],
  questions: [
    { id: 'pj-33-01', type: 'mcq', source: 'BrandSection · Footer · LoginPage', question: 'justify-center-safe 가 일반 justify-center 와 다른 점은?', choices: ['같다', '넘칠 때 왼쪽이 잘리지 않고 왼쪽부터 스크롤되게', '세로 정렬', '애니메이션'], answer: 1, explanation: '넘치는 flex 컨테이너에서 center 는 시작 부분이 잘려요.' },
    { id: 'pj-33-02', type: 'mcq', source: 'BrandSection · Footer · LoginPage', question: 'LoginPage 입력칸에 autoComplete="current-password" 를 준 이유는?', choices: ['보안 강화', '브라우저 비밀번호 관리자가 알아보고 자동 입력하게', '마스킹', '검증'], answer: 1, explanation: '새 비밀번호 칸은 "new-password".' },
    { id: 'pj-33-03', type: 'mcq', source: 'BrandSection · Footer · LoginPage', question: 'Accio 로그인 버튼을 누르면?', choices: ['서버 인증', 'preventDefault 만 — 아무 동작 없음', '카카오 로그인', '홈 이동'], answer: 1, explanation: '인증이 없는 목업이에요.' },
    { id: 'pj-33-04', type: 'mcq', source: 'ListPage.tsx', question: 'toggleFilter 에서 new Set(prev) 로 복사하는 이유는?', choices: ['속도', '같은 Set 을 직접 고치면 참조가 같아 React 가 변경을 알아차리지 못해서', 'Set 은 수정 불가', '정렬'], answer: 1, explanation: 'React 는 Object.is 로 이전 값과 비교해요.' },
    { id: 'pj-33-05', type: 'mcq', source: 'ListPage.tsx', question: '진짜 체크박스를 sr-only 로 숨기고 span 을 보여줄 때 키보드 포커스 표시는?', choices: ['표시 불가', 'peer-focus-visible: 로 형제 span 에 포커스 스타일', 'outline 제거', 'tabindex=-1'], answer: 1, explanation: '숨긴 input 이 포커스를 받고 peer 로 옆 요소를 꾸며요.' },
    { id: 'pj-33-06', type: 'mcq', source: 'ListPage.tsx', question: '정렬 칩에 쓴 ARIA 패턴은?', choices: ['tablist', 'radiogroup + radio + aria-checked', 'listbox', 'menu'], answer: 1, explanation: '여러 개 중 하나만 고르는 선택이라 라디오.' },
    { id: 'pj-33-07', type: 'mcq', source: 'ListPage.tsx', question: '필터를 바꿔도 상품 목록이 그대로인 이유는?', choices: ['버그', '상태가 UI 표시에만 쓰이고 상품 필터링에 연결되지 않아서', '서버 응답 지연', '캐시'], answer: 1, explanation: '복습 연습 과제 ③에서 파생 값으로 적용해 봐요.' },
    { id: 'pj-33-08', type: 'mcq', source: 'DetailPage · ReviewSection', question: '상세의 찜 수를 wishCount + (wished ? 1 : 0) 으로 보여주는 이유는?', choices: ['서버 값', '원본 숫자는 그대로 두고 상태에서 계산한 파생 값으로 +1 처럼 보이게', '랜덤', '캐시'], answer: 1, explanation: '두 번 누르면 원래대로 돌아와요.' },
    { id: 'pj-33-09', type: 'mcq', source: 'DetailPage · ReviewSection', question: '리뷰 날짜를 문자열 localeCompare 로 정렬해도 되는 조건은?', choices: ['항상', '"YYYY.MM.DD"처럼 자릿수가 고정된 형식일 때', '한국어일 때', '숫자일 때'], answer: 1, explanation: '그래서 mock 주석에 형식을 지키라고 적혀 있어요.' },
    { id: 'pj-33-10', type: 'mcq', source: 'DetailPage · ReviewSection', question: 'items.sort(...) 를 바로 호출하면 생기는 문제는?', choices: ['정렬 안 됨', 'mock 상수 원본 배열이 바뀜 — toSorted() 가 더 안전', '에러', '느림'], answer: 1, explanation: '여기선 앞의 filter 가 새 배열을 만들어 괜찮아요.' },
    { id: 'pj-33-11', type: 'mcq', source: 'DetailPage · ReviewSection', question: '상세의 "장바구니" 버튼을 눌러도 장바구니에 안 담기는 이유는?', choices: ['서버 오류', 'onClick 이 없고, 페이지마다 자기 useState 만 있어 공유 상태가 없음', '로그인 필요', '버그'], answer: 1, explanation: '복습 과제 ④ 공유 스토어로 해결해요.' },
    { id: 'pj-33-12', type: 'mcq', source: 'AiChatPage.tsx', question: 'AI 대화 입력창이 스크롤해도 화면 아래에 붙어 있는 이유는?', choices: ['position: fixed', 'sticky bottom-4', 'JS 스크롤 이벤트', 'z-index'], answer: 1, explanation: 'sticky 는 부모 영역 안에서 지정 위치에 붙어요.' },
    { id: 'pj-33-13', type: 'mcq', source: 'AiChatPage.tsx', question: 'AI 표시를 ✨ 아이콘 대신 ACCIO 워드마크로 한 것은?', choices: ['라이선스', '흔한 AI 아이콘을 일부러 피한 디자인 결정', '용량', '접근성 규칙'], answer: 1, explanation: 'shared/icons.tsx 주석과 같은 맥락이에요.' },
    { id: 'pj-33-14', type: 'mcq', source: 'CartPage.tsx', question: 'CartPage 에서 useState 로 관리하는 것은?', choices: ['items, selected, total, allSelected', 'items 와 selected 두 개뿐 (나머지는 파생 값)', 'total 만', '없음'], answer: 1, explanation: '합계·전체선택 여부·쿠폰 차액은 매번 계산해요.' },
    { id: 'pj-33-15', type: 'mcq', source: 'CartPage.tsx', question: '수량 변경을 prev.map(item => item.id === id ? { ...item, quantity } : item) 로 하는 이유는?', choices: ['짧아서', '원본을 바꾸지 않는 불변 업데이트 — 새 배열·새 객체라 React 가 변경을 감지', '속도', '정렬'], answer: 1, explanation: 'item.quantity = n 처럼 직접 고치면 안 돼요.' },
    { id: 'pj-33-16', type: 'mcq', source: 'CartPage.tsx', question: '상품을 삭제할 때 items 와 selected 를 둘 다 정리하는 이유는?', choices: ['필수 문법', 'selected 에 없는 상품 id 가 남아 선택 개수·합계가 어긋나지 않게', '성능', '서버 동기화'], answer: 1, explanation: '두 상태가 같은 id 를 가리키기 때문이에요.' },
    { id: 'pj-33-17', type: 'mcq', source: 'CartPage.tsx', question: 'CartRow 가 상태 없이 콜백만 받는 구조를 뭐라고 하나?', choices: ['prop drilling 금지', '상태 끌어올리기 (lifting state up)', 'Context', '렌더 프롭'], answer: 1, explanation: '공유되는 상태는 공통 부모에 둬요.' },
    { id: 'pj-33-18', type: 'mcq', source: 'MyPage · OrderTrackingPage', question: 'Record<OrderStatus, ...> 조회표의 장점은?', choices: ['빠름', '상태 하나라도 빠뜨리면 TS 가 에러로 알려줌 — if/else 누락 방지', '짧음', '런타임 검증'], answer: 1, explanation: 'lookup table 패턴.' },
    { id: 'pj-33-19', type: 'mcq', source: 'MyPage · OrderTrackingPage', question: '배송지 변경 버튼이 disabled 일 때 이유를 스크린리더에 알리는 방법은?', choices: ['title', 'aria-describedby 로 설명 텍스트 연결', 'alert', 'placeholder'], answer: 1, explanation: '"배송이 시작되면 바꿀 수 없어요" 문장을 연결해요.' },
    { id: 'pj-33-20', type: 'mcq', source: 'MyPage · OrderTrackingPage', question: '운송장 복사 setTimeout 의 개선점은?', choices: ['없음', 'useRef 에 타이머를 두고 언마운트 cleanup 에서 clearTimeout', 'setInterval 로', 'async 로'], answer: 1, explanation: 'StayLoginDemo 처럼 맞추면 더 깔끔해요.' },
    { id: 'pj-33-21', type: 'mcq', source: 'SupportPage.tsx', question: 'FAQ 가 한 번에 하나만 열리는 이유는?', choices: ['CSS', '열린 항목을 숫자 하나(openFaq)로 관리해서', 'details 태그', '랜덤'], answer: 1, explanation: '여러 개를 열려면 Set 이 필요해요.' },
    { id: 'pj-33-22', type: 'mcq', source: 'SupportPage.tsx', question: '새 채팅 메시지를 스크린리더가 읽어주게 하는 속성은?', choices: ['role="log" 없이 불가', 'aria-live="polite"', 'aria-hidden', 'tabindex'], answer: 1, explanation: 'polite 는 읽던 걸 끊지 않고 이어서 알려줘요.' },
    { id: 'pj-33-23', type: 'mcq', source: 'SupportPage.tsx', question: '말풍선 key 로 배열 index 를 써도 지금은 괜찮은 이유는?', choices: ['React 가 무시해서', '뒤에 추가만 하고 중간 삭제·재정렬이 없어서', 'key 불필요', '성능상 이점'], answer: 1, explanation: '중간 삭제가 생기면 고유 id 가 필요해요.' },
  ],
}

export default topic

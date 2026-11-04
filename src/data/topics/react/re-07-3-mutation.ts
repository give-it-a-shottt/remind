import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-07-3-mutation',
  track: 'react',
  group: '07. 서버 상태와 클라이언트 상태',
  title: '7-3. useMutation·무효화·낙관적 업데이트',
  order: 703,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'useMutation: 서버 데이터 바꾸기',
      slides: [
        {
          title: '읽기는 useQuery, 쓰기는 useMutation',
          blocks: [
            { type: 'say', text: '이번 수업은 서버 데이터를 **바꾸는** 쪽이에요. 찜하기, 수강평 등록, 장바구니 담기 같은 거요. 이때는 **useMutation**을 써요.' },
            {
              type: 'code',
              code: `import { useMutation } from '@tanstack/react-query';

function ReviewForm({ courseId }: { courseId: number }) {
  const mutation = useMutation({
    mutationFn: (content: string) =>
      api('/api/reviews', { method: 'POST', body: JSON.stringify({ courseId, content }) }),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(text); }}>
      ...
      <button disabled={mutation.isPending}>{mutation.isPending ? '등록 중…' : '등록'}</button>
      {mutation.isError && <p role="alert">등록에 실패했어요</p>}
    </form>
  );
}`,
            },
          ],
        },
        {
          title: 'useQuery와 뭐가 달라요',
          blocks: [
            {
              type: 'table',
              head: ['', 'useQuery', 'useMutation'],
              rows: [
                ['언제 실행', '마운트될 때 **자동으로**', '`mutate()`를 부를 때만'],
                ['캐시', '결과를 queryKey로 저장', '저장 안 함'],
                ['재시도', '기본 3번', '기본 **안 함** (같은 주문이 두 번 들어가면 큰일이니까)'],
                ['쓰는 곳', 'GET (읽기)', 'POST·PUT·DELETE (쓰기)'],
              ],
            },
            { type: 'say', text: '`mutation.isPending`으로 버튼을 막는 것도 잊지 마세요. 6-6의 useActionState처럼 **두 번 제출**을 막아 줘요.' },
          ],
        },
      ],
    },
    {
      title: '저장 후 무효화',
      slides: [
        {
          title: '등록했는데 목록이 그대로예요',
          blocks: [
            { type: 'say', text: '수강평을 등록했는데 바로 아래 수강평 목록(useQuery)에 새 글이 안 보여요. 6-6에서 본 것과 같은 문제예요. 목록 캐시는 서버가 바뀐 걸 **몰라요.**\n\n그래서 저장이 성공하면 "이 캐시는 이제 믿지 마"라고 **무효화(invalidate)** 해요.' },
            {
              type: 'code',
              code: `import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createReview,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'reviews'] });
  },
});`,
            },
            { type: 'say', text: '`invalidateQueries`는 그 키의 캐시를 **stale(오래됨)** 으로 표시하고, 지금 화면에 쓰이고 있으면 **바로 다시 가져와요.** 7-2에서 키를 계층으로 짰다면 `[\'courses\']` 하나로 강의 관련 캐시 전부를 무효화할 수도 있어요.' },
          ],
        },
        {
          title: '무효화 vs 직접 넣기',
          blocks: [
            { type: 'say', text: '서버가 저장 결과(새로 만든 수강평)를 응답으로 돌려준다면, 다시 요청하지 않고 **캐시에 직접 넣을** 수도 있어요.' },
            { type: 'code', code: `onSuccess: (newReview) => {
  queryClient.setQueryData(['courses', courseId, 'reviews'], (old: Review[] = []) => [newReview, ...old]);
},` },
            {
              type: 'table',
              head: ['방법', '장점', '단점'],
              rows: [
                ['`invalidateQueries` (다시 가져오기)', '단순하고 항상 서버와 정확히 같음', '요청이 한 번 더 나감'],
                ['`setQueryData` (직접 넣기)', '요청 없이 즉시', '정렬·필터 등 서버 로직을 프론트에서 흉내 내야 해서 어긋날 수 있음'],
              ],
            },
            { type: 'note', tone: 'tip', text: '실무 기본값은 **invalidateQueries**예요. 단순하고 틀릴 일이 적어요. 성능이 정말 문제일 때 setQueryData를 고려해요. setQueryData도 3장 불변성 규칙(새 배열로)을 지켜야 해요.' },
          ],
        },
      ],
    },
    {
      title: '낙관적 업데이트',
      slides: [
        {
          title: '서버 응답을 기다리지 않고 먼저 바꾸기',
          blocks: [
            { type: 'say', text: '인스타그램에서 하트를 누르면 **즉시** 빨개지죠. 서버 응답을 기다렸다 바뀌면 0.5초씩 굼뜨게 느껴져요. 그래서 "**성공할 거라고 낙관하고 화면을 먼저 바꾸고**, 실패하면 되돌리는" 방식을 써요. 이걸 **낙관적 업데이트(optimistic update)** 라고 해요.' },
            { type: 'note', tone: 'analogy', text: '식당에서 "물 좀 주세요" 하면 직원이 "네!" 하고 바로 컵을 놓아 주는 거예요. 정수기가 고장 났으면(실패) 그때 "죄송해요" 하고 컵을 치우고요. 대부분은 성공하니까 기다리게 할 필요가 없어요.' },
          ],
        },
        {
          title: '코드로 보면',
          blocks: [
            {
              type: 'code',
              code: `const key = ['courses', courseId];

useMutation({
  mutationFn: toggleWish,
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: key });          // ① 진행 중인 요청 취소 (덮어쓰기 방지)
    const previous = queryClient.getQueryData<Course>(key);      // ② 되돌릴 값 보관
    queryClient.setQueryData<Course>(key, (old) => old && { ...old, wished: !old.wished }); // ③ 먼저 바꿈
    return { previous };
  },
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(key, context?.previous);            // ④ 실패하면 되돌림
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: key });            // ⑤ 끝나면 서버와 다시 맞춤
  },
});`,
            },
            { type: 'ask', q: '① cancelQueries는 왜 필요할까요?', a: '하트를 누르기 직전에 그 강의 데이터를 뒤에서 다시 가져오는 중이었다면, 그 응답이 **낙관적으로 바꾼 값을 덮어써서** 하트가 다시 꺼질 수 있어요. 4-2의 경쟁 상태와 같은 문제예요. 그래서 먼저 진행 중인 요청을 취소해요.' },
          ],
        },
        {
          title: '언제 쓸까',
          blocks: [
            {
              type: 'table',
              head: ['낙관적 업데이트가 잘 맞는 곳', '안 맞는 곳'],
              rows: [
                ['좋아요·찜·북마크 토글', '결제, 송금, 주문 확정'],
                ['체크리스트 완료 표시', '실패할 가능성이 높은 작업'],
                ['실패해도 되돌리면 그만인 것', '"성공했다"고 보여 줬다가 되돌리면 사용자에게 큰 혼란을 주는 것'],
              ],
            },
            { type: 'note', tone: 'tip', text: '더 간단한 방법도 있어요. 캐시는 건드리지 않고, `mutation.isPending`인 동안 `mutation.variables`(보낸 값)를 화면에 **임시로** 보여 주는 거예요. 한 곳에서만 보이면 되는 경우엔 이쪽이 되돌리기 코드가 없어서 편해요. React 19의 `useOptimistic` 훅도 같은 아이디어예요.' },
            { type: 'say', text: '수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're07-3-q1',
      source: 'useMutation: 서버 데이터 바꾸기',
      type: 'mcq',
      question: 'useMutation이 useQuery와 다른 점으로 옳은 것은?',
      choices: ['마운트되면 자동으로 실행된다', 'mutate()를 부를 때만 실행되고, 기본적으로 재시도하지 않는다', '결과를 queryKey로 캐시한다', 'GET 요청에만 쓴다'],
      answer: 1,
      explanation: '쓰기는 사용자의 행동으로 실행하고, 같은 쓰기가 두 번 들어가면 위험하니 기본 재시도가 없어요.',
    },
    {
      id: 're07-3-q2',
      source: '저장 후 무효화',
      type: 'mcq',
      question: '수강평 등록이 성공한 뒤 목록 캐시를 서버와 맞추는 가장 기본적인 방법은?',
      choices: ['페이지를 새로고침한다', "onSuccess에서 queryClient.invalidateQueries({ queryKey: ['courses', id, 'reviews'] })", 'staleTime을 0으로 바꾼다', 'useEffect로 다시 fetch'],
      answer: 1,
      explanation: '무효화하면 그 캐시가 stale이 되고, 화면에서 쓰는 중이면 바로 다시 가져와요.',
    },
    {
      id: 're07-3-q3',
      source: '저장 후 무효화',
      type: 'ox',
      question: 'setQueryData로 캐시를 직접 바꾸면 요청을 아끼지만, 정렬·필터 같은 서버 로직을 프론트에서 흉내 내야 해서 어긋날 위험이 있다.',
      answer: true,
      explanation: '그래서 기본은 invalidateQueries이고, 성능이 꼭 필요할 때 setQueryData를 고려해요.',
    },
    {
      id: 're07-3-q4',
      source: '낙관적 업데이트',
      type: 'mcq',
      question: '낙관적 업데이트(optimistic update)란?',
      choices: ['서버가 항상 성공한다고 가정하고 에러 처리를 안 하는 것', '서버 응답 전에 화면을 먼저 바꾸고, 실패하면 이전 값으로 되돌리는 것', '캐시를 영원히 유지하는 것', '요청을 미리 보내 두는 것'],
      answer: 1,
      explanation: '빠르게 느껴지게 먼저 바꾸되, onError에서 보관해 둔 이전 값으로 되돌려요.',
    },
    {
      id: 're07-3-q5',
      source: '낙관적 업데이트',
      type: 'mcq',
      question: '낙관적 업데이트의 onMutate에서 cancelQueries를 먼저 부르는 이유는?',
      choices: ['요청 수를 늘리려고', '진행 중이던 재요청 응답이 낙관적으로 바꾼 값을 덮어쓰지 않게 하려고', '캐시를 삭제하려고', '에러를 숨기려고'],
      answer: 1,
      explanation: '뒤에서 가져오던 옛 데이터가 나중에 도착해 하트를 다시 꺼 버리는 경쟁 상태를 막아요.',
    },
    {
      id: 're07-3-q6',
      source: '낙관적 업데이트',
      type: 'ox',
      question: '결제·송금처럼 실패하면 큰 혼란을 주는 작업에도 낙관적 업데이트를 쓰는 것이 좋다.',
      answer: false,
      explanation: '성공했다고 보여 줬다가 되돌리면 위험한 작업에는 쓰지 않아요. 좋아요·찜처럼 되돌려도 괜찮은 곳에 써요.',
    },
    {
      id: 're07-3-q7',
      source: '낙관적 업데이트',
      type: 'essay',
      question: '[면접] TanStack Query에서 데이터를 수정한 뒤 화면을 최신으로 맞추는 방법들을 설명해 주세요.',
      answer: '가장 기본은 useMutation의 onSuccess에서 invalidateQueries로 관련 queryKey를 무효화해 다시 가져오는 것입니다. 단순하고 서버와 항상 일치합니다. 서버가 결과를 돌려주면 setQueryData로 캐시를 직접 갱신해 요청을 아낄 수 있지만 서버 로직과 어긋날 위험이 있습니다. 반응 속도가 중요한 좋아요·찜 같은 기능은 onMutate에서 진행 중 쿼리를 취소하고 이전 값을 보관한 뒤 캐시를 먼저 바꾸고, onError에서 되돌리고, onSettled에서 무효화하는 낙관적 업데이트를 씁니다.',
      keywords: ['invalidateQueries', 'setQueryData', '낙관적 업데이트', 'onMutate/onError/onSettled', 'cancelQueries'],
      explanation: '세 가지 방법과 각각의 장단점, 언제 쓰는지를 말하면 돼요.',
    },
  ],
}

export default topic

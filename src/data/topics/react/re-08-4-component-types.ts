import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-08-4-component-types',
  track: 'react',
  group: '08. TypeScript 실전',
  title: '8-4. React 컴포넌트 타입 설계',
  order: 804,
  addedAt: '2026-11-05',
  sections: [
    {
      title: 'props와 children 타입',
      slides: [
        {
          title: '기본 모양',
          blocks: [
            { type: 'say', text: '이번 수업은 React 컴포넌트에 타입을 **잘** 붙이는 법이에요. 공통 컴포넌트(디자인 시스템)를 만들 때 특히 중요해요.' },
            {
              type: 'code',
              code: `type CardProps = {
  title: string;
  description?: string;          // 선택
  children: React.ReactNode;     // 안에 들어갈 내용
};

function Card({ title, description, children }: CardProps) {
  return (
    <section>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}`,
            },
            { type: 'say', text: '`children`에는 **`React.ReactNode`** 를 써요. 글자, 숫자, JSX, 배열, null까지 "화면에 그릴 수 있는 것 전부"를 뜻해요.' },
          ],
        },
        {
          title: 'React.FC는요?',
          blocks: [
            { type: 'say', text: '오래된 코드에서 `const Card: React.FC<CardProps> = (...) => ...`를 자주 봐요. 예전엔 FC가 children을 자동으로 넣어 줘서 오히려 실수를 만들었고(React 18에서 빠짐), 제네릭 컴포넌트(8-3)를 만들기 어려워요.' },
            { type: 'say', text: '요즘 많이 쓰는 방식은 위처럼 **함수 파라미터에 props 타입을 바로** 붙이는 거예요. React 팀의 TypeScript 예제도 이 방식이에요. FC를 쓰는 팀 코드를 만나도 틀린 건 아니니 읽을 줄만 알면 돼요.' },
          ],
        },
      ],
    },
    {
      title: '이벤트 타입',
      slides: [
        {
          title: '어떤 요소의 어떤 이벤트인지',
          blocks: [
            { type: 'say', text: '3-4에서 `ChangeEvent<HTMLInputElement>`를 봤죠. 자주 쓰는 것만 모아 볼게요.' },
            {
              type: 'table',
              head: ['상황', '타입'],
              rows: [
                ['input 값 변경', '`React.ChangeEvent<HTMLInputElement>`'],
                ['textarea·select 변경', '`React.ChangeEvent<HTMLTextAreaElement>`, `<HTMLSelectElement>`'],
                ['버튼 클릭', '`React.MouseEvent<HTMLButtonElement>`'],
                ['키 입력', '`React.KeyboardEvent<HTMLInputElement>`'],
                ['폼 제출 (onSubmit)', '`React.FormEvent<HTMLFormElement>`'],
                ['핸들러 prop 자체의 타입', '`React.MouseEventHandler<HTMLButtonElement>`'],
              ],
            },
            { type: 'note', tone: 'tip', text: '외우지 않아도 돼요. JSX에 `onChange={(e) => ...}`처럼 **바로** 쓰면 TS가 e의 타입을 알아서 추론해요. 핸들러를 밖으로 뺄 때만 적으면 돼요. 에디터에서 onChange에 마우스를 올리면 정확한 타입을 알려 줘요.' },
          ],
        },
      ],
    },
    {
      title: 'HTML 속성 그대로 물려받기',
      slides: [
        {
          title: '공통 Button을 만들 때',
          blocks: [
            { type: 'say', text: '3-4에서 "공통 Button은 받은 props를 통째로 `<button>`에 넘긴다"고 했죠. 그러려면 `disabled`, `type`, `onClick`, `aria-label`… button의 **모든 속성을 props 타입에** 넣어야 해요. 하나하나 적을 순 없죠.' },
            {
              type: 'code',
              code: `type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';     // 내가 추가하는 것
};

function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button className={\`btn btn-\${variant} \${className}\`} {...rest} />;
}

<Button type="submit" disabled aria-label="저장">저장</Button>   // 전부 자동완성됨`,
            },
            { type: 'say', text: '`React.ComponentProps<\'button\'>`은 "**진짜 button이 받는 속성 전부**"예요. 거기에 2-3의 인터섹션 `&`로 내 속성을 더해요. 이 앱(remind)의 Button도 `ButtonHTMLAttributes`로 같은 일을 하고 있어요.' },
            { type: 'note', tone: 'tip', text: 'React 19부터는 ref도 그냥 prop이라(4-3) `ComponentProps<\'button\'>`에 ref까지 들어 있어요. forwardRef 없이 `<Button ref={btnRef}>`가 돼요.' },
          ],
        },
        {
          title: '다른 컴포넌트의 props 꺼내기',
          blocks: [
            { type: 'code', code: `type ListItemProps = React.ComponentProps<typeof CourseCard>;   // CourseCard가 받는 props 그대로` },
            { type: 'say', text: '`ComponentProps`에 `typeof 컴포넌트`를 넣으면 **그 컴포넌트의 props 타입**이 나와요. 라이브러리 컴포넌트를 감싸는 래퍼를 만들 때, 그 props 타입이 export 안 돼 있어도 꺼낼 수 있어요. 8-2의 ReturnType처럼 "적지 말고 꺼내 쓰기"예요.' },
          ],
        },
      ],
    },
    {
      title: 'props도 판별 유니온으로',
      slides: [
        {
          title: '같이 와야 하는 props',
          blocks: [
            { type: 'say', text: '링크처럼도, 버튼처럼도 쓰고 싶은 컴포넌트가 있어요. `href`가 있으면 링크, `onClick`이 있으면 버튼이요. 이렇게 짜면 문제가 생겨요.' },
            { type: 'code', code: `type Props = { href?: string; onClick?: () => void; label: string };
<Action label="?" />                            // 둘 다 없음 — 아무 일도 안 함
<Action label="?" href="/a" onClick={f} />      // 둘 다 있음 — 뭘 하라는 거지?` },
            { type: 'say', text: '8-1의 판별 유니온을 props에도 써요.' },
            {
              type: 'code',
              code: `type Props =
  | { as: 'link'; href: string; label: string }
  | { as: 'button'; onClick: () => void; label: string };

function Action(props: Props) {
  if (props.as === 'link') return <a href={props.href}>{props.label}</a>;
  return <button onClick={props.onClick}>{props.label}</button>;
}

<Action as="link" href="/a" label="이동" />         // ✅
<Action as="link" onClick={f} label="이동" />       // ❌ link에는 href가 필요`,
            },
            { type: 'say', text: '이제 "둘 다 없음", "둘 다 있음" 같은 잘못된 사용을 **쓰는 순간** 막아요. 공통 컴포넌트를 동료가 잘못 쓸 수 없게 만드는 게 좋은 타입 설계예요.\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're08-4-q1',
      source: 'props와 children 타입',
      type: 'mcq',
      question: 'children prop에 가장 알맞은 타입은?',
      choices: ['string', 'JSX.Element', 'React.ReactNode', 'any'],
      answer: 2,
      explanation: 'ReactNode는 글자·숫자·JSX·배열·null 등 그릴 수 있는 것 전부예요. JSX.Element는 JSX 하나만 받아서 좁아요.',
    },
    {
      id: 're08-4-q2',
      source: '이벤트 타입',
      type: 'short',
      question: '폼 onSubmit 핸들러의 이벤트 타입은? React.____Event<HTMLFormElement>',
      answer: ['Form', 'FormEvent', 'React.FormEvent'],
      explanation: 'React.FormEvent<HTMLFormElement>예요. JSX에 바로 쓰면 타입을 추론해 줘서 밖으로 뺄 때만 적으면 돼요.',
    },
    {
      id: 're08-4-q3',
      source: 'HTML 속성 그대로 물려받기',
      type: 'mcq',
      question: '공통 Button이 진짜 <button>의 모든 속성(disabled, type, aria-* 등)을 받게 하려면 props 타입을?',
      choices: ["React.ComponentProps<'button'> & { variant?: ... }", '{ onClick: () => void }', 'any', "Pick<HTMLElement, 'id'>"],
      answer: 0,
      explanation: "ComponentProps<'button'>이 button 속성 전부예요. 내 속성은 &로 더해요.",
    },
    {
      id: 're08-4-q4',
      source: 'HTML 속성 그대로 물려받기',
      type: 'ox',
      question: 'React.ComponentProps<typeof CourseCard> 로 CourseCard 컴포넌트가 받는 props 타입을 꺼낼 수 있다.',
      answer: true,
      explanation: 'props 타입이 export 안 된 라이브러리 컴포넌트를 감쌀 때 특히 유용해요.',
    },
    {
      id: 're08-4-q5',
      source: 'props도 판별 유니온으로',
      type: 'mcq',
      question: "href와 onClick을 둘 다 선택(?)으로 둔 Action 컴포넌트의 문제를 타입으로 막는 방법은?",
      choices: ['둘 다 필수로 바꾼다', "as: 'link' | 'button' 으로 구별되는 판별 유니온 props로 바꾼다", 'any로 바꾼다', '런타임에 console.warn'],
      answer: 1,
      explanation: '판별 유니온이면 link에는 href, button에는 onClick이 반드시 오고, 잘못 쓰면 쓰는 순간 에러가 나요.',
    },
    {
      id: 're08-4-q6',
      source: 'props와 children 타입',
      type: 'ox',
      question: '요즘 React 코드에서는 React.FC를 반드시 써야 한다.',
      answer: false,
      explanation: '함수 파라미터에 props 타입을 바로 붙이는 방식이 많이 쓰여요. FC는 틀린 건 아니지만 제네릭 컴포넌트 등에서 불편해요.',
    },
  ],
}

export default topic

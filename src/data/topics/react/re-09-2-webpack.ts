import type { Topic } from '../../types'

const topic: Topic = {
  id: 're-09-2-webpack',
  track: 'react',
  group: '09. 빌드와 번들러',
  title: '9-2. webpack 직접 구성해 보기',
  order: 902,
  addedAt: '2026-11-05',
  sections: [
    {
      title: '왜 아직 webpack을 배워요?',
      slides: [
        {
          title: '회사 코드의 절반은 webpack',
          blocks: [
            { type: 'say', text: '1-2에서 "요즘은 번들러를 직접 설정할 일이 거의 없다"고 했죠. 그런데 공고에는 webpack이 자주 나와요. 이유가 있어요.\n• 오래된 회사 프로젝트(CRA로 시작한 것 등)는 대부분 webpack이에요\n• Next.js도 `--webpack` 옵션으로 webpack을 쓸 수 있고, 10장의 **Module Federation**은 webpack에서 시작된 기능이에요\n• webpack 설정을 읽을 줄 알면 **번들러가 무슨 일을 하는지** 가장 정확히 보여요. Vite는 이걸 숨겨 두고 있을 뿐이에요' },
            { type: 'say', text: 'webpack 설정은 딱 네 가지 개념으로 되어 있어요. **entry, output, loader, plugin.**' },
          ],
        },
      ],
    },
    {
      title: 'entry·output·loader·plugin',
      slides: [
        {
          title: '네 가지 개념',
          blocks: [
            {
              type: 'table',
              head: ['개념', '뜻', '비유 (공장)'],
              rows: [
                ['**entry**', '의존성 그래프를 따라가기 시작할 파일 (1-2)', '조립 라인의 시작점'],
                ['**output**', '묶은 결과를 어디에 어떤 이름으로', '완성품 창고'],
                ['**loader**', 'JS가 아닌 파일(TS, JSX, CSS, 이미지)을 webpack이 이해하는 모듈로 **변환**', '원자재 가공 기계'],
                ['**plugin**', '번들 전체에 대한 추가 작업 (HTML 생성, 압축, 환경변수 주입)', '포장·검수 라인'],
              ],
            },
            { type: 'say', text: 'webpack은 원래 **JS만** 알아요. `import \'./style.css\'`나 `import Logo from \'./logo.png\'`를 만나면 "이게 뭐지?" 해요. 그래서 **loader**가 "이 파일은 이렇게 JS로 바꿔 줘"를 알려 줘요.' },
          ],
        },
        {
          title: '최소 설정 파일',
          blocks: [
            {
              type: 'code',
              code: `// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',                          // 'development'면 압축 안 하고 빠르게
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',       // 1-2: 내용이 바뀔 때만 이름이 바뀌는 해시
    clean: true,                               // 빌드 전에 dist 비우기
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },   // import 할 때 확장자 생략 허용
  module: {
    rules: [                                   // ← loader 규칙
      { test: /\\.tsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\\.(png|svg)$/, type: 'asset' },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],   // ← plugin
};`,
            },
          ],
        },
      ],
    },
    {
      title: 'loader는 오른쪽에서 왼쪽으로',
      slides: [
        {
          title: "['style-loader', 'css-loader']의 순서",
          blocks: [
            { type: 'say', text: 'CSS 규칙에 loader가 두 개 있죠. **배열의 오른쪽(뒤)부터** 실행돼요.' },
            {
              type: 'list',
              ordered: true,
              items: [
                '**css-loader**: CSS 파일을 읽고 그 안의 `@import`, `url()`을 따라가서 JS 모듈로 바꿈',
                '**style-loader**: 그 CSS를 실행할 때 `<style>` 태그로 페이지에 넣는 코드로 감쌈',
              ],
            },
            { type: 'ask', q: "순서를 ['css-loader', 'style-loader']로 바꾸면 어떻게 될까요?", a: 'style-loader가 아직 CSS를 읽지도 않은(가공 전) 파일을 먼저 받게 돼서 빌드 에러가 나요. 공장 라인 순서가 바뀐 거예요. "오른쪽 → 왼쪽"을 꼭 기억하세요.' },
            { type: 'note', tone: 'tip', text: '배포용에서는 style-loader 대신 `MiniCssExtractPlugin.loader`를 써서 CSS를 **별도 .css 파일**로 뽑아요. JS가 실행되기 전에 CSS가 먼저 적용돼서 화면 깜빡임이 없어요.' },
          ],
        },
      ],
    },
    {
      title: '개발 서버와 SPA 404',
      slides: [
        {
          title: 'webpack-dev-server',
          blocks: [
            {
              type: 'code',
              code: `module.exports = {
  // ...
  devServer: {
    port: 3000,
    hot: true,                                   // 수정하면 새로고침 없이 반영 (HMR)
    historyApiFallback: true,                    // ← 이거!
    proxy: [{ context: ['/api'], target: 'http://localhost:8000' }],   // 5-4 프록시
  },
};`,
            },
            { type: 'ask', q: 'historyApiFallback: true는 5장에서 배운 무엇과 같을까요?', a: '5-2의 "**새로고침하면 404**" 해결책이에요. 없는 경로로 요청이 오면 index.html을 돌려주는 서버 fallback 설정이에요. Vite 개발 서버는 이걸 자동으로 해 주지만, webpack-dev-server는 직접 켜야 해요. 이 옵션 이름을 보면 "아, SPA 404 그거구나" 하고 바로 알아봐야 해요.' },
          ],
        },
      ],
    },
    {
      title: 'Vite와 webpack 비교',
      slides: [
        {
          title: '같은 일, 다른 철학',
          blocks: [
            {
              type: 'table',
              head: ['', 'webpack', 'Vite'],
              rows: [
                ['개발 서버', '시작할 때 **전부 묶음** → 앱이 크면 시작이 느림', '묶지 않고 필요한 파일만 (9-1)'],
                ['설정', '거의 모든 걸 직접 (loader 규칙 등)', '기본값이 좋아서 거의 안 만짐'],
                ['TS·JSX·CSS', 'loader를 직접 연결', '기본 지원'],
                ['생태계', '가장 오래되고 플러그인이 가장 많음', '빠르게 성장, Rollup 호환 플러그인'],
                ['지금 쓰는 곳', '레거시 프로젝트, Module Federation, Next.js `--webpack`', '새 SPA 프로젝트의 기본'],
              ],
            },
            { type: 'note', tone: 'tip', text: 'webpack에서 Vite로 **옮기는(마이그레이션)** 경험은 이력서에 좋은 이야깃거리예요. 순서는 보통 이래요: ① `index.html`을 루트로 옮기고 `<script type="module">` 추가 ② `process.env.X` → `import.meta.env.VITE_X` ③ loader 설정을 Vite 기본 기능·플러그인으로 대체 ④ `require()`를 `import`로 (1-3 ESM vs CJS).\n\n수업 끝! 확인 문제 가요.' },
          ],
        },
      ],
    },
  ],
  questions: [
    {
      id: 're09-2-q1',
      source: 'entry·output·loader·plugin',
      type: 'mcq',
      question: 'webpack에서 TS·CSS·이미지처럼 JS가 아닌 파일을 모듈로 변환하는 것은?',
      choices: ['entry', 'output', 'loader', 'plugin'],
      answer: 2,
      explanation: 'loader는 파일 하나하나를 변환해요. plugin은 번들 전체에 대한 작업(HTML 생성, 압축 등)을 해요.',
    },
    {
      id: 're09-2-q2',
      source: 'entry·output·loader·plugin',
      type: 'mcq',
      question: "output.filename: '[name].[contenthash].js' 에서 contenthash를 쓰는 이유는?",
      choices: ['파일을 암호화하려고', '내용이 바뀔 때만 파일 이름이 바뀌어 브라우저 캐시를 안전하게 쓰려고', '파일을 작게 하려고', '이름을 무작위로 하려고'],
      answer: 1,
      explanation: '1-2의 파일명 해시와 같아요. 안 바뀐 파일은 이름이 그대로라 캐시를 계속 써요.',
    },
    {
      id: 're09-2-q3',
      source: 'loader는 오른쪽에서 왼쪽으로',
      type: 'mcq',
      question: "use: ['style-loader', 'css-loader'] 에서 먼저 실행되는 loader는?",
      choices: ['style-loader', 'css-loader', '동시에', '순서 없음'],
      answer: 1,
      explanation: 'loader 배열은 오른쪽(뒤)부터 실행돼요. css-loader가 CSS를 읽고, style-loader가 페이지에 넣어요.',
    },
    {
      id: 're09-2-q4',
      source: '개발 서버와 SPA 404',
      type: 'short',
      question: 'webpack-dev-server에서 없는 경로 요청에 index.html을 돌려주게 하는 옵션 이름은?',
      answer: ['historyApiFallback', 'historyApiFallback: true'],
      explanation: '5-2의 새로고침 404 해결책과 같은 서버 fallback이에요. Vite 개발 서버는 자동이에요.',
    },
    {
      id: 're09-2-q5',
      source: 'Vite와 webpack 비교',
      type: 'mcq',
      question: '큰 앱에서 webpack 개발 서버가 Vite보다 시작이 느린 주된 이유는?',
      choices: ['webpack은 TS를 못 읽어서', '시작할 때 앱 전체를 먼저 묶기 때문에', 'webpack은 Go로 만들어져서', '플러그인이 없어서'],
      answer: 1,
      explanation: 'webpack은 개발 서버도 번들을 먼저 만들어요. Vite는 묶지 않고 요청된 파일만 변환해요.',
    },
    {
      id: 're09-2-q6',
      source: 'Vite와 webpack 비교',
      type: 'ox',
      question: 'webpack에서 Vite로 옮길 때 process.env.X 로 읽던 값은 보통 import.meta.env.VITE_X 로 바꿔야 한다.',
      answer: true,
      explanation: 'Vite는 import.meta.env를 쓰고, 브라우저에 넣을 값은 VITE_ 접두사가 필요해요.',
    },
  ],
}

export default topic

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // 문제 데이터는 자주 바뀌고 크므로 앱 코드와 분리해 캐시 효율을 높인다
        codeSplitting: {
          groups: [
            { name: 'content', test: /src[\\/]data[\\/]topics/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
})
